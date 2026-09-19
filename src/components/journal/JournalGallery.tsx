import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import useReducedMotion from '@/hooks/useReducedMotion';
import { galleryIndexFromScroll } from '@/lib/journalBlocks';
import { TR } from '@/lib/translations';
import type { ArticleBlock, BlockSize } from '@/data/journalTypes';
import { SIZE_CLASS } from './blockSize';
import { ImageFigure } from './JournalImage';

type GalleryBlock = Extract<ArticleBlock, { type: 'gallery' }>;

// Slides per row by column width: one to peek at on phones (so the swipe is
// obvious), a comfortable few on desktop.
const ITEM_BASIS: Record<BlockSize, string> = {
  narrow: 'basis-[78%]',
  reading: 'basis-[72%] sm:basis-[46%]',
  wide: 'basis-[72%] sm:basis-[46%] lg:basis-[32%]',
};

// aria-disabled, not `disabled`: a disabled button drops keyboard focus, which
// strands a keyboard user the moment they reach either end.
const NAV_BUTTON =
  'inline-flex h-9 w-9 items-center justify-center rounded-full border sec-border sec-text-80 transition-colors duration-300 hover:border-sage-green hover:text-sage-green aria-disabled:cursor-default aria-disabled:opacity-30 aria-disabled:hover:border-[inherit] aria-disabled:hover:text-[inherit] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-green';

// Native scroll-snap carousel: every slide is in the DOM (crawlers and the
// prerendered snapshot see them all), touch and trackpad swipe come free, and
// the arrow buttons are a convenience on top — not the only way to move. The
// scroller itself is the labelled, focusable carousel, so arrow keys work.
export default function JournalGallery({ block }: { block: GalleryBlock }) {
  const { lang } = useLanguage();
  const reducedMotion = useReducedMotion();
  const scroller = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ index: 0, atEnd: false });
  const count = block.items.length;
  const size = block.size ?? 'reading';

  const geometry = useCallback(() => {
    const el = scroller.current;
    const first = el?.firstElementChild;
    if (!el || !(first instanceof HTMLElement)) return null;
    return { el, width: first.offsetWidth, gap: parseFloat(getComputedStyle(el).columnGap) || 0 };
  }, []);

  const measure = useCallback(() => {
    const g = geometry();
    if (!g) return;
    const index = galleryIndexFromScroll(g.el.scrollLeft, g.width, g.gap, count);
    const atEnd = g.el.scrollLeft + g.el.clientWidth >= g.el.scrollWidth - 1;
    // Scroll fires many times a second; only re-render when something changed.
    setPosition((prev) => (prev.index === index && prev.atEnd === atEnd ? prev : { index, atEnd }));
  }, [count, geometry]);

  // ResizeObserver also fires once on observe, which sets the initial state
  // (e.g. "already at the end" when every slide fits without scrolling).
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure]);

  const go = (direction: 1 | -1) => {
    const g = geometry();
    if (!g) return;
    g.el.scrollBy({ left: direction * (g.width + g.gap), behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  return (
    <div data-jn-block="gallery" className={`mx-auto my-10 w-full ${SIZE_CLASS[size]}`}>
      <div
        ref={scroller}
        role="group"
        aria-roledescription="carousel"
        aria-label={block.label[lang]}
        tabIndex={0}
        onScroll={measure}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] motion-safe:scroll-smooth focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sage-green [&::-webkit-scrollbar]:hidden"
      >
        {block.items.map((item, i) => (
          <ImageFigure key={i} asset={item} className={`flex-none snap-start ${ITEM_BASIS[size]}`} />
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <p className="font-sans text-[13px] tabular-nums sec-text-60" aria-live="polite" data-jn-gallery-count>
          {position.atEnd ? count : position.index + 1} / {count}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-disabled={position.index === 0}
            aria-label={TR.journal.blocks.galleryPrev[lang]}
            className={NAV_BUTTON}
          >
            <ArrowLeft size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-disabled={position.atEnd}
            aria-label={TR.journal.blocks.galleryNext[lang]}
            className={NAV_BUTTON}
          >
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
