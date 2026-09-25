import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { LangCode } from '@/lib/journalBlocks';
import type { GuidePageView } from '@/lib/journalGuide';
import { GUIDE_COPY, pageAnnouncement, pageLabel } from './guideCopy';

// The focus ring is the site's call-to-action colour, which changes with the palette (sage by day, slate at night); a fixed sage
// was 1.5-2.3:1 against the night card and sky.
const ICON_BUTTON =
  'inline-flex h-10 w-10 flex-none items-center justify-center rounded-full sec-text-80 transition-colors duration-300 hover:bg-black/5 aria-disabled:pointer-events-none aria-disabled:opacity-25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--cta-bg)]';

interface GuideTopBarProps {
  pages: GuidePageView[];
  index: number;
  lang: LangCode;
  /** Room to name the page beside its number. */
  wide: boolean;
  /** The id of the counter, so the dialog can be described by it. */
  labelId: string;
  onBack: () => void;
  onNext: () => void;
  onClose: () => void;
  onJump: (index: number) => void;
}

// Every page of the guide has the same strip: where you are (a segmented bar, one piece per page, and
// "03 / 08"), Back and Next beside it so a thumb never has to travel for them, and Close - always in the same
// place, whether the page below is words or the game itself. The page's name is the heading below, so the strip
// only shows it where there is room to spare; a screen reader is told it either way, when the page changes.
//
// Back and Next at the ends are aria-disabled, not disabled: a disabled button cannot keep focus, so pressing
// Next from the keyboard on the last-but-one page would drop focus to nowhere. The bar's segments are for a
// finger (and a screen reader's swipe); they are left out of the Tab order so the keyboard reaches Back, Next
// and Close at once. They are 28px tall targets drawn as a line, and the line is a BORDER: in a forced-colours
// mode (Windows high contrast) backgrounds are replaced but borders stay, so the bar does not disappear.
export default function GuideTopBar({ pages, index, lang, wide, labelId, onBack, onNext, onClose, onJump }: GuideTopBarProps) {
  const first = index === 0;
  const last = index === pages.length - 1;
  const title = pages[index].title[lang];
  return (
    <header data-testid="guide-topbar" className="flex-none px-4 pt-[max(0.5rem,env(safe-area-inset-top))]">
      <div className="mb-1 flex items-center gap-1" role="group" aria-label={GUIDE_COPY.dialogLabel[lang]}>
        {pages.map((page, i) => (
          <button
            key={page.key}
            type="button"
            tabIndex={-1}
            aria-current={i === index ? 'step' : undefined}
            aria-label={`${GUIDE_COPY.pageOf[lang]} ${i + 1}: ${page.title[lang]}`}
            data-action="guide-jump"
            data-index={i}
            onClick={() => onJump(i)}
            className="flex h-7 flex-1 items-center"
          >
            <span
              className="block w-full"
              style={{
                borderTop: i <= index ? '3px solid var(--cta-bg)' : '1px solid var(--sec-text-55)',
                borderRadius: 2,
              }}
            />
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between gap-2 pb-1">
        <div className="flex items-center">
          <button type="button" data-action="guide-back" aria-label={GUIDE_COPY.back[lang]} aria-disabled={first} onClick={first ? undefined : onBack} className={ICON_BUTTON}>
            <ChevronLeft size={22} aria-hidden="true" />
          </button>
          <button type="button" data-action="guide-next" aria-label={GUIDE_COPY.next[lang]} aria-disabled={last} onClick={last ? undefined : onNext} className={ICON_BUTTON}>
            <ChevronRight size={22} aria-hidden="true" />
          </button>
        </div>
        {/* What is seen ("03 / 08") is hidden from a screen reader, and what it hears ("Page 3 of 8: The Constraints")
            is hidden from the eye: one live region, replaced whole (aria-atomic) each time the page changes. */}
        <p id={labelId} data-testid="guide-page-label" aria-live="polite" aria-atomic="true" className="min-w-0 flex-1 truncate text-center font-sans text-[12px] font-medium leading-6 tracking-[0.14em] sec-text-70">
          <span data-testid="guide-page-counter" aria-hidden="true">
            {pageLabel(index, pages.length)}
            {wide && <span className="uppercase"> · {title}</span>}
          </span>
          <span data-testid="guide-page-announcement" className="sr-only">
            {pageAnnouncement(index, pages.length, title, lang)}
          </span>
        </p>
        <button type="button" data-action="guide-close" aria-label={GUIDE_COPY.close[lang]} title={GUIDE_COPY.close[lang]} onClick={onClose} className={ICON_BUTTON}>
          <X size={22} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
