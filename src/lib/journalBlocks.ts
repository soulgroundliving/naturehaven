// Pure helpers behind the Journal block renderer.
//
// Deliberately dependency-free (type-only imports, erasable syntax) so they run
// on plain Node: tools/__tests__/journalBlocks.test.ts imports this file
// directly, and tools/test-journal-content.mjs reuses isLocalAssetPath.
import type { ArticleBlock, ArticleLayout, Bilingual, Localized } from '../data/journalTypes.ts';

export type LangCode = 'en' | 'th';

/** Resolve a value that is either one string for both languages or { en, th }. */
export function localize(value: Localized, lang: LangCode): string {
  return typeof value === 'string' ? value : value[lang];
}

/** ASCII URL slug: lowercase, runs of anything else become one hyphen. Thai-only input yields ''. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export interface Heading {
  /** Position in the article's top-level `blocks` array. */
  index: number;
  level: 2 | 3;
  /** Anchor id, unique within the article. */
  id: string;
  text: Bilingual;
}

/**
 * Top-level h2/h3 blocks with a stable anchor id each. Ids come from the
 * English text (so `#01-the-plan` survives a language switch), unless the
 * block sets its own `id`; anything unusable falls back to `s<position>`.
 * Repeats get `-2`, `-3` … so anchors never collide.
 */
export function collectHeadings(blocks: ArticleBlock[]): Heading[] {
  const used = new Set<string>();
  const headings: Heading[] = [];
  blocks.forEach((block, index) => {
    if (block.type !== 'h2' && block.type !== 'h3') return;
    const base = slugify(block.id ?? '') || slugify(block.text.en) || `s${headings.length + 1}`;
    let id = base;
    for (let n = 2; used.has(id); n += 1) id = `${base}-${n}`;
    used.add(id);
    headings.push({ index, level: block.type === 'h2' ? 2 : 3, id, text: block.text });
  });
  return headings;
}

/**
 * "On this page" shows when the article asks for it, or automatically from
 * four h2 sections. Never shown empty, even when forced.
 */
export function shouldShowToc(layout: ArticleLayout | undefined, headings: Heading[]): boolean {
  if (headings.length === 0) return false;
  return layout?.toc ?? headings.filter((h) => h.level === 2).length >= 4;
}

// A backslash or a control character (tab, newline…) after the leading slash is
// stripped or rewritten by URL parsing, which can turn "/\t/host" into "//host".
const hasBackslashOrControl = (text: string) =>
  [...text].some((ch) => ch === '\\' || ch.charCodeAt(0) < 0x20 || ch.charCodeAt(0) === 0x7f);

/**
 * True only for a same-site absolute path. The site CSP is `img-src 'self' data:`
 * (no external hosts), so anything else would silently fail to load.
 */
export function isLocalAssetPath(src: string): boolean {
  return src.startsWith('/') && !src.startsWith('//') && !hasBackslashOrControl(src);
}

/** Which gallery item is closest to the left edge, given the scroller's position. */
export function galleryIndexFromScroll(scrollLeft: number, itemWidth: number, gap: number, count: number): number {
  const step = itemWidth + gap;
  if (step <= 0 || count <= 0) return 0;
  return Math.min(count - 1, Math.max(0, Math.round(scrollLeft / step)));
}

/** The option a `choice` block opens on: its `defaultId` if it exists, else the first. */
export function initialChoiceId(options: readonly { id: string }[], defaultId?: string): string {
  if (defaultId && options.some((option) => option.id === defaultId)) return defaultId;
  return options[0]?.id ?? '';
}
