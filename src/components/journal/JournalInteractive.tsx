import { Suspense, useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import useReducedMotion from '@/hooks/useReducedMotion';
import { isPrerender } from '@/lib/isPrerender';
import { TR } from '@/lib/translations';
import type { ArticleBlock } from '@/data/journalTypes';
import BlockBoundary from './BlockBoundary';
import { SIZE_CLASS } from './blockSize';
import { ImageFigure } from './JournalImage';
import { INTERACTIVES } from './interactive/registry';

type InteractiveBlock = Extract<ArticleBlock, { type: 'interactive' }>;

// Frame for a game / calculator / simulator. The title and description are
// always on the page as ordinary text — that is what crawlers, no-JS readers,
// the prerendered snapshot and a failed load all get. The piece itself loads
// only when the frame is near the viewport, and never during prerender.
export default function JournalInteractive({ block }: { block: InteractiveBlock }) {
  const { lang } = useLanguage();
  const reducedMotion = useReducedMotion();
  const frame = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  // hasOwn: an id like "constructor" must not resolve to Object.prototype.
  const Piece = Object.hasOwn(INTERACTIVES, block.id) ? INTERACTIVES[block.id] : undefined;
  const live = Piece !== undefined && near && !isPrerender();

  useEffect(() => {
    if (Piece || !import.meta.env.DEV) return;
    console.warn(`[journal] no interactive piece registered under "${block.id}" — showing the static fallback`);
  }, [Piece, block.id]);

  useEffect(() => {
    const el = frame.current;
    if (!el || !Piece || isPrerender()) return;
    const observer = new IntersectionObserver(
      (entries) => {
        // Records can queue up; loading is a one-way trip, so ANY sighting counts.
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setNear(true);
        observer.disconnect();
      },
      { rootMargin: '400px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [Piece]);

  const poster = block.poster ? <ImageFigure asset={block.poster} /> : null;
  const failed = (
    <div>
      {poster}
      <p role="status" className="mt-3 font-sans text-[13px] sec-text-60">
        {TR.journal.blocks.interactiveFailed[lang]}
      </p>
    </div>
  );

  return (
    <section
      ref={frame}
      aria-label={block.title[lang]}
      data-jn-block="interactive"
      data-jn-interactive-id={block.id}
      data-jn-interactive-registered={Piece ? 'true' : 'false'}
      data-jn-interactive-state={live ? 'live' : 'static'}
      className={`mx-auto my-10 w-full rounded-xl border sec-border card-surface p-5 md:p-7 ${SIZE_CLASS[block.size ?? 'reading']}`}
    >
      <p className="font-sans text-[11px] font-medium uppercase tracking-[0.16em] sec-text-60">
        {TR.journal.blocks.interactiveTag[lang]}
      </p>
      <h3 className="mt-1 font-sans text-[19px] font-medium leading-snug sec-text">{block.title[lang]}</h3>
      <p className="mt-3 font-sans text-[15.5px] font-light leading-[1.85] sec-text-90">{block.description[lang]}</p>
      <div className="mt-5" style={block.minHeight ? { minHeight: block.minHeight } : undefined}>
        {live && Piece ? (
          <BlockBoundary label={`interactive piece "${block.id}"`} fallback={failed}>
            <Suspense
              fallback={
                <p role="status" className="font-sans text-[13px] sec-text-60">
                  {TR.journal.blocks.interactiveLoading[lang]}
                </p>
              }
            >
              <Piece lang={lang} reducedMotion={reducedMotion} />
            </Suspense>
          </BlockBoundary>
        ) : (
          poster
        )}
      </div>
    </section>
  );
}
