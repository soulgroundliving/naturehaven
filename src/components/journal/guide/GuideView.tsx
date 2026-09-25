import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Article } from '@/data/journalTypes';
import type { LangCode } from '@/lib/journalBlocks';
import { guidePages, isDrawnStage } from '@/lib/journalGuide';
import { DOOR_IDS } from '@/lib/roomFit';
import type { DoorId } from '@/lib/roomFit';
import useDialog from '@/hooks/useDialog';
import useMediaQuery, { WIDE_SCREEN } from '@/hooks/useMediaQuery';
import JournalInteractive from '../JournalInteractive';
import { DIALOG_SURFACE } from '../dialogSurface';
import PlayStage from '../interactive/room-fit/PlayStage';
import useRoomFitGame from '../interactive/room-fit/useRoomFitGame';
import GuideCard from './GuideCard';
import GuidePicture from './GuidePicture';
import GuideStage from './GuideStage';
import GuideTopBar from './GuideTopBar';
import { GUIDE_COPY } from './guideCopy';

const ALL_DOORS_SHUT = Object.fromEntries(DOOR_IDS.map((id) => [id, false])) as Record<DoorId, boolean>;

// Beside each other only where there is room for both a plan worth reading (240px) and the words (240px): a
// window wider than tall is not enough - a desktop zoomed to 400% is 320 CSS px wide and would give the plan 0.
const READER_WIDE = '(min-aspect-ratio: 6/5) and (min-width: 560px)';
// Under this height a plan and its words cannot share the screen and both be read (a 40dvh card and what is
// left is under 200px): the page scrolls as a whole instead, the way an article does.
const READER_SHORT = '(max-height: 519.98px)';

interface GuideViewProps {
  article: Article;
  lang: LangCode;
  onClose: () => void;
}

// The article read page by page: one section's words beside a picture, changing together as you move through
// it - built because the long page put the game a scroll away from its own controls (the owner, on a phone:
// "เล่นแต่ละทีต้องเลื่อนขึ้น-ลงตลอด"). The words are never invented - every page's text is the article's own
// blocks (journalGuide.ts) - and the picture is either drawn from the same geometry the game's rules use
// (GuideStage.tsx) or is the section's own slide (GuidePicture.tsx), so neither can drift from the long page.
//
// The "try it" page is the real game, not a picture of it: its own useRoomFitGame instance, played the same way
// the full-screen dialog plays it (PlayStage), so nothing about it is a simplified stand-in. That page's lead-in
// paragraph is the one piece of the article's text the reader does not show: the game's own header says the task.
export default function GuideView({ article, lang, onClose }: GuideViewProps) {
  const dialog = useRef<HTMLDivElement>(null);
  const labelId = useId();
  useDialog(dialog, onClose);
  const readerWide = useMediaQuery(READER_WIDE);
  const gameWide = useMediaQuery(WIDE_SCREEN);
  const short = useMediaQuery(READER_SHORT);
  const pages = useMemo(() => guidePages(article), [article]);
  const [index, setIndex] = useState(0);
  const [doors, setDoors] = useState(ALL_DOORS_SHUT);
  const tryGame = useRoomFitGame(lang);

  // Turning the phone swaps one layout for another, and the button that had focus goes with it: keep focus in the dialog.
  useEffect(() => {
    const node = dialog.current;
    if (node && !node.contains(document.activeElement)) node.focus();
  }, [readerWide, gameWide, short]);

  const page = pages[Math.min(index, pages.length - 1)];
  if (!page) return null; // an article with no pages never opens one (ArticleView checks); nothing to draw here
  const goTo = (next: number) => setIndex(Math.max(0, Math.min(pages.length - 1, next)));
  const toggleDoor = (id: DoorId) => setDoors((open) => ({ ...open, [id]: !open[id] }));
  const { stage } = page;
  const drawn = isDrawnStage(stage);
  const hasPicture = drawn || page.picture !== undefined;
  const flows = !readerWide && short;

  return createPortal(
    <div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label={GUIDE_COPY.dialogLabel[lang]}
      aria-describedby={labelId}
      lang={lang}
      tabIndex={-1}
      data-testid="journal-guide"
      className="fixed inset-0 z-[300] flex h-dvh flex-col overflow-hidden overscroll-none pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] outline-none"
      // pinch-zoom, as the game's own full-screen dialog has: without it a finger on the plan pans the page and the
      // browser takes the touch from a piece being dragged (measured: a 100px drag moved the bed 17px).
      style={{ background: DIALOG_SURFACE, touchAction: 'pinch-zoom' }}
    >
      <GuideTopBar
        pages={pages}
        index={page.index}
        lang={lang}
        wide={readerWide}
        labelId={labelId}
        onBack={() => goTo(page.index - 1)}
        onNext={() => goTo(page.index + 1)}
        onClose={onClose}
        onJump={goTo}
      />

      <main
        data-testid="guide-page"
        data-stage={stage}
        data-index={page.index}
        className={`flex min-h-0 flex-1 flex-col ${flows && !page.interactive ? 'overflow-y-auto overscroll-contain' : ''}`}
        style={flows && !page.interactive ? { touchAction: 'pan-y pinch-zoom' } : undefined}
      >
        {page.interactive ? (
          page.interactive.id === 'room-fit' ? (
            <PlayStage game={tryGame} lang={lang} wide={gameWide} className="min-h-0 flex-1" />
          ) : (
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6" style={{ touchAction: 'pan-y pinch-zoom' }}>
              <JournalInteractive block={page.interactive} />
            </div>
          )
        ) : (
          <div
            className={
              readerWide
                ? `grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] gap-8 px-8 pb-6 ${hasPicture ? 'grid-cols-[minmax(240px,1fr)_minmax(240px,460px)]' : 'grid-cols-[minmax(0,640px)] justify-center'}`
                : flows
                  ? 'flex flex-none flex-col'
                  : 'flex min-h-0 flex-1 flex-col'
            }
          >
            {hasPicture && (
              <div data-testid="guide-picture" className={`relative ${flows ? 'h-[340px] flex-none' : 'min-h-0 flex-1'}`}>
                {page.picture ? (
                  <GuidePicture block={page.picture} lang={lang} />
                ) : (
                  drawn && <GuideStage stage={stage} lang={lang} doors={doors} onToggleDoor={toggleDoor} />
                )}
              </div>
            )}
            <GuideCard key={page.key} page={page} lang={lang} wide={readerWide} alone={!hasPicture} flows={flows} />
          </div>
        )}
      </main>
    </div>,
    document.body,
  );
}
