// Shared shape for Haven Journal articles.
// One article = one file in src/content/journal/<slug>.ts — the filename IS
// the route slug (tools/prerender.mjs derives its route list from that
// directory, so keep them in sync by construction).
//
// An article is a list of typed BLOCKS. Text blocks are bilingual; media
// blocks carry what the reader needs to trust them (alt text, real pixel
// size, and what the picture actually is). To add a new kind of block:
//   1. add it to the union below,
//   2. render it in src/components/journal/JournalBlocks.tsx (the switch is
//      exhaustive — tsc fails until you do),
//   3. document it in CLAUDE.md → "Journal articles".
// Interactive pieces (games, calculators) do not need a new block: register
// the component in src/components/journal/interactive/registry.ts and use the
// `interactive` block.

export interface Bilingual {
  en: string;
  th: string;
}

/** Text that may be identical in both languages (numbers, model names, paths). */
export type Localized = string | Bilingual;

/** At least one element: an empty gallery, list or tab set is a mistake the types can forbid. */
export type NonEmpty<T> = [T, ...T[]];

/**
 * What a picture or clip actually is. REQUIRED on every image, gallery item and
 * video, so the brand rule "AI and 3D renders are always disclosed" is a
 * compile error to skip rather than a review comment to remember. 'render' and
 * 'ai' get a visible badge; 'photo' and 'drawing' (plans, diagrams,
 * typographic slides) do not. (The article hero is the one exception: its
 * `heroOrigin` is optional — see Article.)
 */
export type MediaOrigin = 'photo' | 'drawing' | 'render' | 'ai';

/** Column width a block occupies. Text blocks are always 'reading'. */
export type BlockSize = 'narrow' | 'reading' | 'wide';

export interface ImageAsset {
  /**
   * public/ path such as /assets/x.webp. Site CSP is `img-src 'self' data:`, so
   * external hosts are blocked — `npm run test:journal` fails on one. Pass
   * { en, th } when the picture has baked-in text per language. Never overwrite
   * a file under /assets: it is served `immutable` for a year, so returning
   * visitors would keep the old one — give a changed picture a new filename.
   */
  src: Localized;
  alt: Bilingual;
  /** Intrinsic pixel size — reserves the box before the file loads (no layout shift). */
  width: number;
  height: number;
  origin: MediaOrigin;
  caption?: Bilingual;
}

export interface VideoSource {
  src: string;
  type: 'video/mp4' | 'video/webm';
}

export interface VideoTrack {
  /** WebVTT captions file under public/ */
  src: string;
  lang: 'en' | 'th';
  label: string;
}

export type TextBlock =
  | { type: 'p'; text: Bilingual }
  | { type: 'h3'; text: Bilingual; id?: string }
  | { type: 'pull'; text: Bilingual }
  | { type: 'list'; ordered?: boolean; items: NonEmpty<Bilingual> }
  | { type: 'callout'; tone?: 'note' | 'tip' | 'caution'; title?: Bilingual; text: Bilingual };

export type MediaBlock =
  | ({ type: 'image'; size?: BlockSize } & ImageAsset)
  | {
      type: 'gallery';
      items: NonEmpty<ImageAsset>;
      /** Accessible name for the carousel, e.g. "The seven slides". */
      label: Bilingual;
      size?: BlockSize;
    }
  | {
      type: 'video';
      /** Self-hosted files only for now (CSP has no frame-src / external media-src). */
      sources: NonEmpty<VideoSource>;
      /** Shown until play — also what crawlers and link previews see. Required: preload is 'none'. */
      poster: Localized;
      width: number;
      height: number;
      /** Accessible name (also used as the poster's alt). */
      label: Bilingual;
      origin: MediaOrigin;
      caption?: Bilingual;
      /** Captions (WebVTT). Add them for any clip with speech — the type cannot know. */
      tracks?: VideoTrack[];
      /** Silent looping atmosphere clip: plays only while visible, never under reduced-motion. */
      ambient?: boolean;
      size?: BlockSize;
    };

export interface TableBlock {
  type: 'table';
  caption?: Bilingual;
  head?: Localized[];
  /** Every row must be as wide as `head` (checked by `npm run test:journal`). */
  rows: NonEmpty<Localized[]>;
  /** Render the first cell of each row as a row header (spec / comparison tables). */
  rowHeader?: boolean;
  size?: BlockSize;
}

export interface InteractiveBlock {
  type: 'interactive';
  /** Key into INTERACTIVES (src/components/journal/interactive/registry.ts). */
  id: string;
  title: Bilingual;
  /**
   * What this piece is and how to use it. This is what crawlers, no-JS
   * readers, the prerendered snapshot and a failed load all see — write it as
   * real content, not a placeholder.
   */
  description: Bilingual;
  poster?: ImageAsset;
  /** Reserve height so the page does not jump when the piece loads. */
  minHeight?: number;
  size?: BlockSize;
}

/** Everything that may sit inside a container block (no nesting of containers). */
export type LeafBlock = TextBlock | MediaBlock | TableBlock | InteractiveBlock;

export interface ChoiceOption {
  /** Stable key — becomes the tab value. */
  id: string;
  label: Bilingual;
  blocks: NonEmpty<LeafBlock>;
}

export type ContainerBlock =
  /**
   * "Pick your situation" — one option shows at a time, but every option is in
   * the DOM, so crawlers and the prerendered snapshot read all of them.
   */
  | { type: 'choice'; label: Bilingual; options: NonEmpty<ChoiceOption>; defaultId?: string }
  /** Collapsible group — many conditions, terms, or an FAQ. Native <details>. */
  | { type: 'details'; summary: Bilingual; open?: boolean; blocks: NonEmpty<LeafBlock> };

export type ArticleBlock =
  | { type: 'h2'; text: Bilingual; id?: string }
  | LeafBlock
  | ContainerBlock;

/** How an article presents itself. Every field is optional; defaults reproduce the plain essay. */
export interface ArticleLayout {
  /** "On this page" navigation. Default: shown automatically when there are 4+ h2 sections. */
  toc?: boolean;
  /** 'none' drops the hero image from the page (cards, previews and JSON-LD still use it) —
   *  for pieces that open with a video or an interactive. */
  hero?: 'image' | 'none';
}

export interface Article {
  slug: string;
  category: Bilingual;
  title: Bilingual;
  excerpt: Bilingual;
  /** ISO date, drives sort order (newest first) */
  date: string;
  readMinutes: number;
  /** public/ asset path, e.g. /assets/about-minimal-room.jpg */
  hero: string;
  heroAlt: Bilingual;
  /**
   * What the hero picture is; the article page shows the disclosure badge for
   * 'render' / 'ai'. OPTIONAL, unlike the origin on body media: leaving it out
   * means no badge, and the cards and tiles that show the hero never badge it.
   * Existing articles have not been audited for this yet (owner decision).
   */
  heroOrigin?: MediaOrigin;
  layout?: ArticleLayout;
  blocks: ArticleBlock[];
}
