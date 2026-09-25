// An article read page by page, as pure functions.
//
// A guide page is the words of one section of the article beside a picture. It holds no words of its own:
// `guidePages` cuts them out of the article's own blocks, so editing the article edits the guide, and the
// article stays the one thing crawlers, no-JS readers and the long page all see.
// Dependency-free like journalBlocks.ts, so tools/__tests__/journalGuide.test.ts runs it on plain Node.
import type { Article, ArticleBlock, Bilingual, GuideStage, InteractiveBlock } from '../data/journalTypes.ts';
import { collectHeadings } from './journalBlocks.ts';

/** The pictures a guide page can stand beside; components/journal/guide/GuideStage.tsx draws the drawn ones. */
export const GUIDE_STAGE_IDS = ['plan', 'brief', 'constraints', 'layout', 'slide', 'measurements', 'try', 'final'] as const satisfies readonly GuideStage[];
export type GuideStageId = GuideStage;

// A stage added to the GuideStage union but not listed above fails to compile here, rather than being
// accepted by the type and refused (or drawn as an empty plan) at runtime.
type MustBeNever<T extends never> = T;
export type EveryStageIsListed = MustBeNever<Exclude<GuideStage, (typeof GUIDE_STAGE_IDS)[number]>>;

/** The stages that draw a picture of the plan. 'slide' and 'measurements' lead with their section's own image; 'try' is the game. */
export const GUIDE_DRAWN_STAGES = ['plan', 'brief', 'constraints', 'layout', 'final'] as const satisfies readonly GuideStage[];
export type GuideDrawnStage = (typeof GUIDE_DRAWN_STAGES)[number];
export const isDrawnStage = (stage: GuideStage): stage is GuideDrawnStage => (GUIDE_DRAWN_STAGES as readonly string[]).includes(stage);

export interface GuidePageView {
  /** Position in the guide, from 0. */
  index: number;
  stage: GuideStage;
  /** The section's anchor id, or the interactive block's id. */
  key: string;
  /** What the page is called: the heading without its number ("01 — The Plan" → "The Plan"), or the interactive's title. */
  title: Bilingual;
  /** The heading's own number ("01"), when it has one. */
  number: string | null;
  /** The words: the article's own blocks for this page, in order (a page shows the ones it can). */
  blocks: ArticleBlock[];
  /** A 'slide' or 'measurements' page's own picture, lifted out of `blocks` so the page can lead with it. */
  picture?: ImageBlock;
  /** The interactive block a "try it" page is about. */
  interactive?: InteractiveBlock;
}

/** An image block of the article - what a 'slide' or 'measurements' page leads with. */
export type ImageBlock = Extract<ArticleBlock, { type: 'image' }>;

// A section number, then a separator: a dash set off by spaces ("01 — The Plan"), or a full stop or colon and a space
// ("7. Seven", "3: Layout"). Never a bare hyphen, a decimal point or a clock: "3-bedroom plans", "24-hour access",
// "2.5 m ceilings" and "10:30 check-in" are all words, not a number and a title. At most two digits: "2026 was a year" is a sentence.
const NUMBERED = /^\s*(\d{1,2})(?:\s+[—–-]\s+|[.:]\s+)/;

/**
 * Where a page's picture comes from. Most stages DRAW one (GuideStage.tsx: the plan, the zones, the doors,
 * the clearances, the final layout), so the section's own image, gallery or video would only repeat it - or
 * contradict it: 01-plan-2.webp is a cover card that carries the article's own title. Those blocks are dropped.
 * 'slide' and 'measurements' draw nothing; the section's own first image IS their picture, so it is lifted out
 * of the words for the page to lead with (its tables and any later media stay where they are).
 */
const MEDIA: ReadonlySet<string> = new Set(['image', 'gallery', 'video']);
const isImage = (block: ArticleBlock): block is ImageBlock => block.type === 'image';
function splitPicture(blocks: ArticleBlock[], stage: GuideStage): { words: ArticleBlock[]; picture?: ImageBlock } {
  if (isDrawnStage(stage)) return { words: blocks.filter((block) => !MEDIA.has(block.type)) };
  const picture = blocks.find(isImage);
  return { words: blocks.filter((block) => block !== picture), picture };
}

/** "01 — The Plan" → { number: "01", title: "The Plan" }; a heading without a number keeps its text. */
export function splitNumber(text: string): { number: string | null; title: string } {
  const match = NUMBERED.exec(text);
  return match ? { number: match[1], title: text.slice(match[0].length) } : { number: null, title: text };
}

/**
 * What is wrong with an article's guide, in words - for the authoring contract (an empty list means it is sound).
 * This runs in `npm run test:journal`, not in `npm run build`: a guide that is unsound is caught when the tests
 * are run, and is otherwise shown as far as it can be (a page that matches nothing is dropped, never guessed).
 */
export function guideProblems(article: Article): string[] {
  const problems: string[] = [];
  const pages = article.guide?.pages;
  if (!pages) return problems;
  const headings = collectHeadings(article.blocks).filter((heading) => heading.level === 2);
  const seen = new Set<string>();
  pages.forEach((page, i) => {
    const at = `guide.pages[${i}]`;
    if (!(GUIDE_STAGE_IDS as readonly string[]).includes(page.stage)) problems.push(`${at}.stage "${page.stage}" is not one of ${GUIDE_STAGE_IDS.join(', ')}`);
    if ('section' in page) {
      if (page.stage === 'try') problems.push(`${at}: a section page cannot use stage "try" - that is the picture of an interactive page`);
      if (!headings.some((heading) => heading.id === page.section)) problems.push(`${at}.section "${page.section}" matches no h2 (its anchors: ${headings.map((heading) => heading.id).join(', ')})`);
      if (seen.has(`s:${page.section}`)) problems.push(`${at}.section "${page.section}" is used by an earlier page`);
      seen.add(`s:${page.section}`);
    } else {
      if (page.stage !== 'try') problems.push(`${at}: an interactive page must use stage "try", not "${page.stage}"`);
      if (!article.blocks.some((block) => block.type === 'interactive' && block.id === page.interactive)) problems.push(`${at}.interactive "${page.interactive}" matches no interactive block`);
      if (seen.has(`i:${page.interactive}`)) problems.push(`${at}.interactive "${page.interactive}" is used by an earlier page`);
      seen.add(`i:${page.interactive}`);
    }
  });
  return problems;
}

/**
 * The pages of an article's guide, in order. A section page is the blocks between its h2 and the next one.
 * An interactive block gets a page of its own with the paragraph that leads into it, and both are taken out
 * of the section they sat in. A page that matches nothing is dropped (guideProblems says which).
 */
export function guidePages(article: Article): GuidePageView[] {
  const config = article.guide?.pages ?? [];
  const blocks = article.blocks;
  const headings = collectHeadings(blocks).filter((heading) => heading.level === 2);
  const claimed = new Set(config.flatMap((page) => ('interactive' in page ? [page.interactive] : [])));
  const isClaimed = (block: ArticleBlock | undefined) => block?.type === 'interactive' && claimed.has(block.id);
  const leadsIntoClaimed = (at: number) => blocks[at]?.type === 'p' && isClaimed(blocks[at + 1]);

  const views: Omit<GuidePageView, 'index'>[] = [];
  for (const page of config) {
    if ('interactive' in page) {
      const at = blocks.findIndex((block) => block.type === 'interactive' && block.id === page.interactive);
      const block = blocks[at];
      if (block?.type !== 'interactive') continue;
      const lead = at > 0 && blocks[at - 1].type === 'p' ? [blocks[at - 1]] : [];
      views.push({ stage: page.stage, key: block.id, title: block.title, number: null, blocks: lead, interactive: block });
      continue;
    }
    const at = headings.findIndex((heading) => heading.id === page.section);
    if (at < 0) continue;
    const heading = headings[at];
    const end = headings[at + 1]?.index ?? blocks.length;
    const section = blocks.slice(heading.index + 1, end).filter((block, i) => !isClaimed(block) && !leadsIntoClaimed(heading.index + 1 + i));
    const { words, picture } = splitPicture(section, page.stage);
    const en = splitNumber(heading.text.en);
    const th = splitNumber(heading.text.th);
    views.push({ stage: page.stage, key: heading.id, title: { en: en.title, th: th.title }, number: en.number, blocks: words, picture });
  }
  return views.map((view, index) => ({ ...view, index }));
}
