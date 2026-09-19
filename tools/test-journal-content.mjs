// Contract test for published Journal articles.
//
// Two layers, both over EVERY article so the next one is checked without anyone
// remembering to:
//   1. SOURCE  — each src/content/journal/<slug>.ts is loaded and held to
//      validateArticle (src/lib/journalContract.ts): both languages complete, no
//      empty arrays, tables rectangular, ids unique, only same-site paths — and
//      every file it references must exist in public/.
//   2. OUTPUT  — the prerendered pages in dist/ (what crawlers and visitors get):
//      alt + reserved size on every image, video poster + preload="none", unique
//      DOM ids, TOC anchors resolve, every block type the source uses actually
//      rendered, interactive ids registered, no literal ** from a pasted draft.
//
// Run `npm run build` first (layer 2 reads dist/). It prints what it scanned: a
// gate that scanned nothing must not read as a pass.
//
//   exit 0  every rule holds
//   exit 1  a rule is broken (each is listed)
//   exit 2  the check itself could not run (no dist/, no articles, old Node)
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve('.');
const dist = path.join(root, 'dist');
const publicDir = path.join(root, 'public');
const contentDir = path.join(root, 'src', 'content', 'journal');
const journalDir = path.join(dist, 'journal');
const SITE = 'https://naturehaven-living.vercel.app';

let isLocalAssetPath;
let validateArticle;
let collectAssetPaths;
try {
  ({ isLocalAssetPath } = await import('../src/lib/journalBlocks.ts'));
  ({ validateArticle, collectAssetPaths } = await import('../src/lib/journalContract.ts'));
} catch (error) {
  console.error('[journal-content] cannot load src/lib/journal*.ts — needs Node 22.6+ (type stripping).', error.message);
  process.exit(2);
}

if (!fs.existsSync(journalDir)) {
  console.error('[journal-content] dist/journal not found — run `npm run build` first.');
  process.exit(2);
}

// The same directory listing tools/prerender.mjs uses: a file starting "_" is not an article.
const slugs = fs
  .readdirSync(contentDir)
  .filter((f) => f.endsWith('.ts') && !f.startsWith('_'))
  .map((f) => f.replace(/\.ts$/, ''))
  .sort();
if (slugs.length === 0) {
  console.error('[journal-content] src/content/journal has no articles.');
  process.exit(2);
}

// A tag regex that survives '>' inside a quoted attribute value.
const tagPattern = (name) => new RegExp(`<${name}\\b(?:[^>"']|"[^"]*"|'[^']*')*>`, 'gi');

function parseAttrs(tag) {
  const body = tag.replace(/^<\w+/, '').replace(/\/?>$/, '');
  const attrs = {};
  for (const m of body.matchAll(/([^\s"'<>/=]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g)) {
    attrs[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4] ?? '';
  }
  return attrs;
}

const tagsOf = (html, name) => [...html.matchAll(tagPattern(name))].map((m) => parseAttrs(m[0]));

const problems = [];
const totals = { articles: 0, sourceFiles: 0, images: 0, videos: 0, headings: 0, tocLinks: 0, interactives: 0, tables: 0 };

function checkDistAsset(slug, what, src) {
  if (!src) {
    problems.push(`/journal/${slug}: ${what} has no src`);
    return;
  }
  if (!isLocalAssetPath(src)) {
    problems.push(`/journal/${slug}: ${what} "${src}" is not a same-site path (the CSP blocks external hosts)`);
    return;
  }
  const file = path.join(dist, src.split('?')[0].replace(/^\//, ''));
  if (!fs.existsSync(file)) problems.push(`/journal/${slug}: ${what} "${src}" does not exist in dist/`);
}

// ── layer 1: the article SOURCE ───────────────────────────────────────────────
const sources = new Map(); // slug -> source text, for the layer-2 block-type check
for (const slug of slugs) {
  const file = path.join(contentDir, `${slug}.ts`);
  sources.set(slug, fs.readFileSync(file, 'utf8'));
  let article;
  try {
    article = (await import(pathToFileURL(file).href)).default;
  } catch (error) {
    console.error(`[journal-content] cannot load ${path.relative(root, file)}: ${error.message}`);
    process.exit(2);
  }
  totals.sourceFiles += 1;
  if (article.slug !== slug) problems.push(`src/content/journal/${slug}.ts: slug is "${article.slug}" but the filename is the route — they must match`);
  for (const problem of validateArticle(article)) problems.push(`/journal/${slug}: ${problem}`);
  for (const asset of collectAssetPaths(article)) {
    if (!fs.existsSync(path.join(publicDir, asset.split('?')[0].replace(/^\//, '')))) {
      problems.push(`/journal/${slug}: "${asset}" is referenced but public${asset} does not exist`);
    }
  }
}

// ── layer 2: the prerendered OUTPUT ──────────────────────────────────────────
// Block types whose presence in the source must show up as a rendered block.
const RENDERED_BLOCKS = ['gallery', 'video', 'table', 'choice', 'details', 'interactive'];

for (const slug of slugs) {
  const file = path.join(journalDir, slug, 'index.html');
  if (!fs.existsSync(file)) {
    problems.push(`/journal/${slug}: no prerendered page (dist/journal/${slug}/index.html)`);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  totals.articles += 1;

  // metadata every article must carry
  const title = /<title>([^<]*)<\/title>/i.exec(html)?.[1]?.trim();
  if (!title) problems.push(`/journal/${slug}: <title> is empty`);
  const canonical = tagsOf(html, 'link').find((a) => a.rel === 'canonical')?.href;
  if (canonical !== `${SITE}/journal/${slug}`) problems.push(`/journal/${slug}: canonical is "${canonical}"`);
  const ogImage = tagsOf(html, 'meta').find((a) => a.property === 'og:image')?.content;
  if (!ogImage?.startsWith(SITE)) problems.push(`/journal/${slug}: og:image "${ogImage}" is not an absolute site URL`);
  else checkDistAsset(slug, 'og:image', ogImage.slice(SITE.length));

  // images: alt text, reserved size, a file that exists
  for (const img of tagsOf(html, 'img')) {
    totals.images += 1;
    if (!img.alt?.trim()) problems.push(`/journal/${slug}: <img src="${img.src}"> has no alt text`);
    if (!(Number(img.width) > 0 && Number(img.height) > 0)) problems.push(`/journal/${slug}: <img src="${img.src}"> has no width/height (layout shift)`);
    checkDistAsset(slug, '<img>', img.src);
  }

  // videos: poster, no eager download, real sources
  for (const [block] of html.matchAll(/<video\b[\s\S]*?<\/video>/gi)) {
    totals.videos += 1;
    const video = parseAttrs(/<video\b(?:[^>"']|"[^"]*"|'[^']*')*>/i.exec(block)[0]);
    checkDistAsset(slug, '<video poster>', video.poster);
    if (video.preload !== 'none') problems.push(`/journal/${slug}: <video> must use preload="none" (got "${video.preload}")`);
    const sourceTags = tagsOf(block, 'source');
    if (sourceTags.length === 0) problems.push(`/journal/${slug}: <video> has no <source>`);
    sourceTags.forEach((s) => checkDistAsset(slug, '<video><source>', s.src));
    tagsOf(block, 'track').forEach((t) => checkDistAsset(slug, '<track>', t.src));
  }

  // ids: unique across the whole article, headings anchored, TOC links resolve
  const article = /<article\b[\s\S]*<\/article>/i.exec(html)?.[0] ?? '';
  const allIds = [...article.matchAll(/\sid="([^"]+)"/gi)].map((m) => m[1]);
  const dupes = allIds.filter((id, i) => allIds.indexOf(id) !== i);
  if (dupes.length) problems.push(`/journal/${slug}: duplicate DOM ids: ${[...new Set(dupes)].join(', ')}`);
  const headingIds = [...article.matchAll(/<h[23]\b[^>]*\sid="([^"]+)"/gi)].map((m) => m[1]);
  totals.headings += headingIds.length;
  const toc = /<nav\b[^>]*data-jn-block="toc"[\s\S]*?<\/nav>/i.exec(article)?.[0] ?? '';
  for (const link of tagsOf(toc, 'a')) {
    totals.tocLinks += 1;
    if (!headingIds.includes((link.href ?? '').replace(/^#/, ''))) problems.push(`/journal/${slug}: TOC link ${link.href} points at no heading`);
  }

  // every block type the source uses must actually have rendered (a lazy chunk
  // that failed at prerender time, or a renderer that dropped it, shows up here)
  const source = sources.get(slug) ?? '';
  for (const type of RENDERED_BLOCKS) {
    const used = new RegExp(`\\btype:\\s*'${type}'`).test(source);
    const rendered = new RegExp(`data-jn-block="${type}"`).test(article);
    if (used && !rendered) problems.push(`/journal/${slug}: the source uses a "${type}" block but none was rendered`);
  }
  totals.tables += (article.match(/data-jn-block="table"/g) ?? []).length;

  // tables are rectangular in the output too (a renderer regression would not show in the source)
  for (const [table] of article.matchAll(/<table\b[\s\S]*?<\/table>/gi)) {
    const widths = [...table.matchAll(/<tr\b[\s\S]*?<\/tr>/gi)].map((row) => (row[0].match(/<t[dh]\b/gi) ?? []).length);
    if (new Set(widths).size > 1) problems.push(`/journal/${slug}: a table has rows of different widths (${widths.join(', ')})`);
  }

  // interactive pieces must be registered (else visitors get only the fallback)
  for (const m of article.matchAll(/<section\b[^>]*data-jn-interactive-id="([^"]+)"[^>]*>/gi)) {
    totals.interactives += 1;
    if (!/data-jn-interactive-registered="true"/.test(m[0])) {
      problems.push(`/journal/${slug}: interactive "${m[1]}" is not registered in src/components/journal/interactive/registry.ts`);
    }
  }

  // stray markdown: authors paste **bold** from drafts and it prints literally
  const text = article.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ');
  if (/\*\*/.test(text)) problems.push(`/journal/${slug}: literal "**" in the article text (markdown does not render here)`);
}

const summary =
  `${totals.sourceFiles} article sources (both languages) · ${totals.articles} prerendered pages · ${totals.images} images · ` +
  `${totals.videos} videos · ${totals.tables} tables · ${totals.headings} anchored headings · ${totals.tocLinks} TOC links · ` +
  `${totals.interactives} interactive pieces`;

if (problems.length) {
  console.error(`[journal-content] FAIL — scanned ${summary}`);
  problems.forEach((p) => console.error(`  - ${p}`));
  process.exit(1);
}
console.log(`[journal-content] PASS — scanned ${summary}`);
