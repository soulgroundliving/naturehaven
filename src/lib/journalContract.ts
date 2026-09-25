// The authoring contract for a Journal article, as pure functions.
//
// The types (journalTypes.ts) forbid most mistakes at compile time, but not
// these: an empty English alt text, an empty array, a table row a cell short, a
// duplicate tab id, an external image URL. tools/test-journal-content.mjs runs
// validateArticle over every published article, so BOTH languages are checked
// (the prerendered HTML only shows Thai) and a mistake fails `npm run
// test:journal` instead of reaching a visitor.
//
// Dependency-free like journalBlocks.ts: type-only imports plus one relative
// runtime import, so it runs on plain Node.
import type { Article, ArticleBlock, Bilingual, ImageAsset, Localized } from '../data/journalTypes.ts';
import { isLocalAssetPath, slugify } from './journalBlocks.ts';
import { guideProblems } from './journalGuide.ts';

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const ORIGINS: readonly string[] = ['photo', 'drawing', 'render', 'ai'];
const HERO_MODES: readonly string[] = ['image', 'none'];

const isPositiveInt = (value: unknown) => typeof value === 'number' && Number.isInteger(value) && value > 0;

function isBilingual(value: unknown): value is Bilingual {
  return typeof value === 'object' && value !== null && 'en' in value && 'th' in value;
}

/** Every { en, th } anywhere inside `value` must have real text in both languages. */
function checkText(value: unknown, path: string, problems: string[]): void {
  if (Array.isArray(value)) {
    value.forEach((item, i) => checkText(item, `${path}[${i}]`, problems));
  } else if (isBilingual(value)) {
    for (const lang of ['en', 'th'] as const) {
      const text = value[lang];
      if (typeof text !== 'string' || text.trim() === '') problems.push(`${path}.${lang} is empty`);
    }
  } else if (typeof value === 'object' && value !== null) {
    for (const [key, child] of Object.entries(value)) checkText(child, path ? `${path}.${key}` : key, problems);
  }
}

/** Each language variant of a path must be a same-site file (the CSP blocks external hosts). */
function checkAsset(value: Localized | undefined, path: string, problems: string[]): void {
  const variants: [string, unknown][] =
    typeof value === 'object' && value !== null ? [[`${path}.en`, value.en], [`${path}.th`, value.th]] : [[path, value]];
  for (const [where, src] of variants) {
    if (typeof src !== 'string') problems.push(`${where} is missing`);
    else if (!isLocalAssetPath(src)) problems.push(`${where} "${src}" is not a same-site path (the CSP blocks external hosts)`);
  }
}

function checkPicture(picture: Pick<ImageAsset, 'width' | 'height' | 'origin'>, path: string, problems: string[]): void {
  if (!isPositiveInt(picture.width)) problems.push(`${path}.width must be a positive whole number of pixels`);
  if (!isPositiveInt(picture.height)) problems.push(`${path}.height must be a positive whole number of pixels`);
  if (!ORIGINS.includes(picture.origin)) problems.push(`${path}.origin "${String(picture.origin)}" must be one of ${ORIGINS.join(', ')}`);
}

function checkBlock(block: ArticleBlock, path: string, problems: string[]): void {
  switch (block.type) {
    case 'image':
      checkAsset(block.src, `${path}.src`, problems);
      checkPicture(block, path, problems);
      break;
    case 'gallery':
      if (block.items.length === 0) problems.push(`${path} (gallery) has no items`);
      block.items.forEach((item, i) => {
        checkAsset(item.src, `${path}.items[${i}].src`, problems);
        checkPicture(item, `${path}.items[${i}]`, problems);
      });
      break;
    case 'video':
      if (block.sources.length === 0) problems.push(`${path} (video) has no sources`);
      block.sources.forEach((source, i) => checkAsset(source.src, `${path}.sources[${i}].src`, problems));
      checkAsset(block.poster, `${path}.poster`, problems);
      block.tracks?.forEach((track, i) => checkAsset(track.src, `${path}.tracks[${i}].src`, problems));
      checkPicture(block, path, problems);
      break;
    case 'table': {
      if (block.rows.length === 0) problems.push(`${path} (table) has no rows`);
      const width = block.head ? block.head.length : block.rows[0]?.length;
      block.rows.forEach((row, i) => {
        if (row.length !== width) problems.push(`${path}.rows[${i}] has ${row.length} cells, expected ${width}`);
      });
      break;
    }
    case 'list':
      if (block.items.length === 0) problems.push(`${path} (list) has no items`);
      break;
    case 'choice': {
      if (block.options.length === 0) problems.push(`${path} (choice) has no options`);
      const seen = new Set<string>();
      block.options.forEach((option, i) => {
        const at = `${path}.options[${i}]`;
        if (!SLUG.test(option.id)) problems.push(`${at}.id "${option.id}" must be a lowercase slug`);
        if (seen.has(option.id)) problems.push(`${at}.id "${option.id}" is a duplicate`);
        seen.add(option.id);
        if (option.blocks.length === 0) problems.push(`${at} has no blocks`);
        option.blocks.forEach((inner, j) => checkBlock(inner, `${at}.blocks[${j}]`, problems));
      });
      if (block.defaultId !== undefined && !seen.has(block.defaultId)) {
        problems.push(`${path}.defaultId "${block.defaultId}" matches no option`);
      }
      break;
    }
    case 'details':
      if (block.blocks.length === 0) problems.push(`${path} (details) has no blocks`);
      block.blocks.forEach((inner, i) => checkBlock(inner, `${path}.blocks[${i}]`, problems));
      break;
    case 'interactive':
      if (!SLUG.test(block.id)) problems.push(`${path}.id "${block.id}" must be a lowercase slug`);
      if (block.poster) checkAsset(block.poster.src, `${path}.poster.src`, problems);
      break;
    case 'h2':
    case 'h3':
      if (block.id !== undefined && slugify(block.id) === '') problems.push(`${path}.id "${block.id}" has no usable characters`);
      break;
    default:
      break; // p, pull, callout: their text is covered by checkText
  }
}

/** Everything wrong with an article that the types cannot catch. Empty means it honours the contract. */
export function validateArticle(article: Article): string[] {
  const problems: string[] = [];
  if (!SLUG.test(article.slug)) problems.push(`slug "${article.slug}" must be a lowercase slug`);
  if (!DATE.test(article.date) || Number.isNaN(Date.parse(article.date))) problems.push(`date "${article.date}" must be YYYY-MM-DD`);
  if (!isPositiveInt(article.readMinutes)) problems.push('readMinutes must be a positive whole number');
  checkAsset(article.hero, 'hero', problems);
  if (article.heroOrigin !== undefined && !ORIGINS.includes(article.heroOrigin)) {
    problems.push(`heroOrigin "${String(article.heroOrigin)}" must be one of ${ORIGINS.join(', ')}`);
  }
  if (article.layout?.hero !== undefined && !HERO_MODES.includes(article.layout.hero)) {
    problems.push(`layout.hero "${String(article.layout.hero)}" must be one of ${HERO_MODES.join(', ')}`);
  }
  checkText(article, '', problems);
  article.blocks.forEach((block, i) => checkBlock(block, `blocks[${i}]`, problems));
  problems.push(...guideProblems(article));
  return problems;
}

/** Every same-site file the article references (hero, pictures, clips, posters, captions), once each. */
export function collectAssetPaths(article: Article): string[] {
  const found = new Set<string>();
  const add = (value: Localized | undefined) => {
    if (value === undefined) return;
    for (const src of typeof value === 'string' ? [value] : [value.en, value.th]) {
      if (isLocalAssetPath(src)) found.add(src);
    }
  };
  const visit = (block: ArticleBlock): void => {
    switch (block.type) {
      case 'image':
        add(block.src);
        break;
      case 'gallery':
        block.items.forEach((item) => add(item.src));
        break;
      case 'video':
        block.sources.forEach((source) => add(source.src));
        add(block.poster);
        block.tracks?.forEach((track) => add(track.src));
        break;
      case 'interactive':
        add(block.poster?.src);
        break;
      case 'choice':
        block.options.forEach((option) => option.blocks.forEach(visit));
        break;
      case 'details':
        block.blocks.forEach(visit);
        break;
      default:
        break;
    }
  };
  add(article.hero);
  article.blocks.forEach(visit);
  return [...found];
}
