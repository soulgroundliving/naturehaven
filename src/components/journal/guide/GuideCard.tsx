import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { titleFont } from '@/components/JournalCard';
import type { LangCode } from '@/lib/journalBlocks';
import type { GuidePageView } from '@/lib/journalGuide';
import GuideBlocks from './GuideBlocks';

// The article's blocks bring the long page's reading rhythm (17px on a 1.95 line, 24px between paragraphs).
// Here they share a phone with a plan, so the card tightens them - from the wrapper, by descendant selector
// (one class more specific than each block's own), not by re-implementing the blocks: the markup stays the
// article's, and a block type added tomorrow is still rendered by the same component as on the long page.
const COMPACT =
  '[&_p]:mb-3.5 [&_p]:text-[15.5px] [&_p]:leading-[1.75] [&_ul]:mb-3.5 [&_ul]:text-[15.5px] [&_ul]:leading-[1.75] [&_ol]:mb-3.5 [&_ol]:text-[15.5px] [&_ol]:leading-[1.75] [&_blockquote]:my-4 [&_blockquote]:text-[16px] [&_aside]:my-4';
const ROOMY = '[&_p]:mb-4 [&_p]:text-[16.5px] [&_p]:leading-[1.8] [&_ul]:text-[16.5px] [&_blockquote]:my-5';

// When the words run past the card, the last line fades out - "there is more" without a scrollbar to draw.
const FADE = 'linear-gradient(to bottom, #000 calc(100% - 30px), transparent)';

interface GuideCardProps {
  page: GuidePageView;
  lang: LangCode;
  /** Beside the picture rather than under it: a column of its own, as tall as it needs. */
  wide: boolean;
  /** No picture to share the screen with: the words may use all of it. */
  alone: boolean;
  /** The whole page scrolls (a screen too short to hold a readable plan and its words): the card is as tall as its words. */
  flows: boolean;
}

// One page's words: the section's number and title, then its own blocks - the article's text, never
// paraphrased. It sits on a sheet below the picture, and scrolls inside itself when it is long, so the
// picture never leaves the screen while you read.
export default function GuideCard({ page, lang, wide, alone, flows }: GuideCardProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const [more, setMore] = useState(false);
  const [scrollable, setScrollable] = useState(false);
  const measure = useCallback(() => {
    const node = scroller.current;
    if (!node) return;
    setScrollable(node.scrollHeight > node.clientHeight + 1);
    setMore(node.scrollHeight - node.scrollTop - node.clientHeight > 4);
  }, []);
  useLayoutEffect(() => {
    const node = scroller.current;
    if (!node) return undefined;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    if (node.firstElementChild) observer.observe(node.firstElementChild);
    return () => observer.disconnect();
  }, [measure]);

  const shape = wide
    ? 'max-h-full self-center rounded-3xl border'
    : `rounded-t-3xl border-t shadow-[0_-6px_26px_rgba(43,43,43,0.12)] ${alone ? 'min-h-0 flex-1' : 'flex-none'}`;
  const inside = flows ? 'overflow-visible' : 'overflow-y-auto overscroll-contain';
  const limit = wide || alone || flows ? 'max-h-full' : 'max-h-[40dvh]';
  return (
    <section data-testid="guide-card" className={`flex min-h-0 flex-col sec-border card-surface ${shape}`}>
      <div
        ref={scroller}
        data-testid="guide-card-scroll"
        onScroll={measure}
        // Words that run past the card are a scrolling region: a keyboard has to be able to reach it to scroll
        // it (Chrome and Firefox focus one on their own, Safari does not), and the dialog's Tab trap has to know
        // it is a stop. One that fits is not a stop, and is not announced as a region.
        tabIndex={scrollable ? 0 : undefined}
        role={scrollable ? 'region' : undefined}
        aria-label={scrollable ? page.title[lang] : undefined}
        className={`min-h-0 px-5 pt-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[color:var(--cta-bg)] ${inside} ${wide ? 'pb-6' : 'pb-[max(1.25rem,env(safe-area-inset-bottom))]'} ${limit}`}
        style={{ touchAction: 'pan-y pinch-zoom', maskImage: more ? FADE : undefined, WebkitMaskImage: more ? FADE : undefined }}
      >
        <div className="mx-auto w-full max-w-[520px]">
          {page.number && <p className="font-sans text-[12px] tracking-[0.16em] sec-text-60">{page.number}</p>}
          <h2 className={`${titleFont(lang)} mt-0.5 text-[24px] leading-snug sec-text`}>{page.title[lang]}</h2>
          <div className={`mt-3 ${wide ? ROOMY : COMPACT}`}>
            <GuideBlocks blocks={page.blocks} />
          </div>
        </div>
      </div>
    </section>
  );
}
