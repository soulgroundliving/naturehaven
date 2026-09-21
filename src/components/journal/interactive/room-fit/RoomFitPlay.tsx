import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { LangCode } from '@/lib/journalBlocks';
import PlayHeader from './PlayHeader';
import PlayPanel from './PlayPanel';
import PlayRail from './PlayRail';
import PlaySheet from './PlaySheet';
import RoomBoard from './RoomBoard';
import { COPY } from './copy';
import useDialog from './useDialog';
import useMediaQuery from './useMediaQuery';
import type { RoomFitGame } from './useRoomFitGame';

// The page's own background (index.css), so the game covers the article without looking like a different site.
const SKY = 'linear-gradient(180deg, var(--sky-from, #E8E9EA), var(--sky-via, #F0EEE8) 55%, var(--sky-to, #DCDED5))';

// Wider than it is tall: the plan is as tall as the screen and the result sits beside it, not under it.
const WIDE_QUERY = '(min-aspect-ratio: 6/5)';

interface RoomFitPlayProps {
  game: RoomFitGame;
  lang: LangCode;
  onClose: () => void;
}

// The game played full screen. On a phone the article is a column meant to be read down, and a game
// is a tool: it needs its buttons beside the plan, not a screen and a half below it. So the plan takes
// all the room the screen has and its buttons stand in a rail at the edge the thumb reaches. The rules
// and widths wait in a sheet at the foot that opens over nothing — the plan shrinks to stay in view —
// or, where the screen is wider than it is tall, in a panel beside the plan.
//
// `touch-action: pinch-zoom` on the dialog: nothing in it is meant to be scrolled by one finger (a piece is
// dragged, the rest is buttons), but `none` also switched off pinch-zooming — measured: the page scale stayed 1
// over the header, the plan and the rules — and the article behind it zooms. Pinch-zoom is what a visitor with low
// vision reads a phone with. A pinch that starts ON a piece still drags the piece (RoomBoard cancels that touch).
export default function RoomFitPlay({ game, lang, onClose }: RoomFitPlayProps) {
  const dialog = useRef<HTMLDivElement>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const wide = useMediaQuery(WIDE_QUERY);
  useDialog(dialog, onClose);
  // Turning the phone swaps one layout for the other, and the button that had focus goes with it: keep focus in the dialog.
  useEffect(() => {
    const node = dialog.current;
    if (node && !node.contains(document.activeElement)) node.focus();
  }, [wide]);
  const { state, fast, verified, settled } = game;

  const board = (variant: 'fill' | 'tall') => (
    <RoomBoard
      variant={variant}
      layout={state.layout}
      selected={state.selected}
      fast={fast}
      walk={verified.walk}
      settled={settled}
      showPlan={state.showPlan}
      doors={state.doors}
      lang={lang}
      onSelect={game.select}
      onMove={game.move}
      onNudge={game.nudge}
      onRotate={game.rotate}
      onToggleDoor={game.toggleDoor}
    />
  );

  return createPortal(
    <div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label={COPY.playLabel[lang]}
      tabIndex={-1}
      data-testid="room-fit-play"
      className="fixed inset-0 z-[300] h-dvh overflow-hidden overscroll-none pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pt-[env(safe-area-inset-top)] outline-none"
      style={{ background: SKY, touchAction: 'pinch-zoom' }}
    >
      <div
        data-testid="room-fit"
        data-mode="play"
        data-layout={wide ? 'wide' : 'upright'}
        data-rules-passed={verified.passed}
        data-won={settled && verified.won}
        data-settled={settled}
        data-selected={state.selected ?? ''}
        className={`mx-auto flex h-full min-h-0 w-full flex-col ${wide ? 'max-w-[1120px]' : 'max-w-[520px]'}`}
      >
        <PlayHeader game={game} lang={lang} onClose={onClose} />

        {wide ? (
          <div className="flex min-h-0 flex-1 gap-3 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-1">
            <div className="flex min-h-0 flex-none items-stretch gap-2">
              <div className="min-h-0 flex-none">{board('tall')}</div>
              <PlayRail game={game} lang={lang} />
            </div>
            <PlayPanel game={game} lang={lang} />
          </div>
        ) : (
          <>
            <div className="flex min-h-[12rem] min-w-0 flex-1 items-stretch gap-1 px-2 pb-2">
              <div className="relative min-h-0 min-w-0 flex-1">
                <div className="absolute inset-0">{board('fill')}</div>
              </div>
              {/* With the sheet open the plan is small and the sheet is what is being read: the buttons wait until it shuts. */}
              {!sheetOpen && <PlayRail game={game} lang={lang} />}
            </div>
            <PlaySheet game={game} lang={lang} open={sheetOpen} onToggle={() => setSheetOpen((open) => !open)} />
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
