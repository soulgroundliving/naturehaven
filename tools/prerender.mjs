// Post-build prerender — captures the SPA's rendered DOM via headless Chrome
// and rewrites dist/index.html with the snapshot. Crawlers, social previews,
// and JS-disabled visitors then see real content instead of an empty <div>.
//
// Run automatically as the third stage of `npm run build`:
//   tsc -b && vite build && node tools/prerender.mjs
//
// Browser binary strategy:
//   • Vercel / any Linux CI → @sparticuz/chromium (Lambda-optimised, smaller,
//     bundles the system libs Vercel's build container is missing)
//   • Local dev (Windows / macOS) → puppeteer's bundled Chromium (works
//     out of the box, no extra setup)
//
// Detection on the client:
//   window.__PRERENDER__ === true → puppeteer is rendering us; skip Canvas,
//   skip the loading overlay, skip video autoplay. Plain client loads do not
//   have this flag and behave normally.

import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import Prerenderer from '@prerenderer/prerenderer';
import PuppeteerRenderer from '@prerenderer/renderer-puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot  = path.resolve(__dirname, '..');
const distDir   = path.join(repoRoot, 'dist');

// Route list = homepage + journal index + one route per article. Article
// filenames ARE the slugs (see src/data/journalTypes.ts), so the directory
// listing is the single source of truth — adding an article file adds its
// prerender route automatically.
const journalDir = path.join(repoRoot, 'src', 'content', 'journal');
let journalSlugs = [];
try {
  journalSlugs = (await fs.readdir(journalDir))
    .filter((f) => f.endsWith('.ts') && !f.startsWith('_'))
    .map((f) => f.replace(/\.ts$/, ''));
} catch {
  console.warn('[prerender] no journal content dir found — rendering base routes only');
}
const ROUTES = ['/', '/journal', '/links', ...journalSlugs.map((s) => `/journal/${s}`)];
console.log(`[prerender] routes: ${ROUTES.join(', ')}`);

// On Linux CI (Vercel sets VERCEL=1; GitHub Actions sets CI=true) load the
// Lambda-bundled Chromium. Locally puppeteer's auto-downloaded binary works.
const isLinuxCI =
  process.platform === 'linux' &&
  (process.env.VERCEL === '1' || process.env.CI === 'true' || process.env.AWS_LAMBDA_FUNCTION_NAME);

let launchOptions = {};
if (isLinuxCI) {
  const { default: chromium } = await import('@sparticuz/chromium');
  launchOptions = {
    args: [...chromium.args, '--disable-dev-shm-usage'],
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  };
  console.log('[prerender] using @sparticuz/chromium for Linux CI');
} else {
  console.log(`[prerender] using puppeteer's bundled Chromium (platform=${process.platform})`);
}

// Sanity check — dist must exist before we try to render it.
try {
  await fs.access(path.join(distDir, 'index.html'));
} catch {
  console.error('[prerender] dist/index.html not found. Run `vite build` first.');
  process.exit(1);
}

const prerenderer = new Prerenderer({
  staticDir: distDir,
  renderer: new PuppeteerRenderer({
    headless: true,
    // Generous wait — LoadingOverlay GSAP timeline is ~3s in normal mode.
    // With reduced-motion forced ON it collapses to near-instant, but lazy
    // chunks (10 sections, ~1MB orb) still need time to settle.
    renderAfterTime: 4000,
    maxConcurrentRoutes: 1,
    // Tell client code it's being prerendered. Components key off this to
    // skip Canvas / autoplay / cursor-follow / intro overlay.
    inject: true,
    injectProperty: '__PRERENDER__',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
    ],
    launchOptions,
    pageSetup: async (page) => {
      // Force reduced-motion so GSAP / Lenis / animated reveals are skipped.
      // Sections that respect the media feature collapse to their final
      // rendered state instantly; captured HTML is animation-free.
      await page.emulateMediaFeatures([
        { name: 'prefers-reduced-motion', value: 'reduce' },
      ]);
      // Match Vercel's reported viewport so any responsive logic captures
      // the same desktop layout that the largest share of crawl bots see.
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    },
    consoleHandler: (route, msg) => {
      // Surface client-side errors so a broken build fails loudly rather
      // than producing a half-rendered snapshot.
      if (msg.type() === 'error') {
        console.warn(`[prerender ${route}] ${msg.text()}`);
      }
    },
  }),
});

try {
  await prerenderer.initialize();
  const rendered = await prerenderer.renderRoutes(ROUTES);

  for (const r of rendered) {
    // `/` → dist/index.html  ·  `/foo` → dist/foo/index.html
    const outDir = path.join(distDir, r.route === '/' ? '' : r.route);
    const outFile = path.join(outDir, 'index.html');
    await fs.mkdir(outDir, { recursive: true });
    await fs.writeFile(outFile, r.html, 'utf8');
    const bytes = Buffer.byteLength(r.html, 'utf8');
    console.log(`[prerender] ${r.route} → ${path.relative(repoRoot, outFile)} (${bytes.toLocaleString()} bytes)`);
  }
} catch (err) {
  console.error('[prerender] failed:', err);
  await prerenderer.destroy();
  process.exit(1);
}

await prerenderer.destroy();
console.log('[prerender] done');
