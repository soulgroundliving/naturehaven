import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { LangCode } from '@/lib/journalBlocks';
import { DIALOG_SURFACE } from '../../dialogSurface';
import PlayStage from './PlayStage';
import { COPY } from './copy';
import useDialog from '@/hooks/useDialog';
import useMediaQuery, { WIDE_SCREEN } from '@/hooks/useMediaQuery';
import type { RoomFitGame } from './useRoomFitGame';

interface RoomFitPlayProps {
  game: RoomFitGame;
  lang: LangCode;
  onClose: () => void;
}

// The game played full screen. On a phone the article is a column meant to be read down, and a game
// is a tool: it needs its buttons beside the plan, not a screen and a half below it. So the plan takes
// all the room the screen has (PlayStage) and everything is on the one screen.
//
// `touch-action: pinch-zoom` on the dialog: nothing in it is meant to be scrolled by one finger (a piece is
// dragged, the rest is buttons), but `none` also switched off pinch-zooming - measured: the page scale stayed 1
// over the header, the plan and the rules - and the article behind it zooms. Pinch-zoom is what a visitor with low
// vision reads a phone with. A pinch that starts ON a piece still drags the piece (RoomBoard cancels that touch).
export default function RoomFitPlay({ game, lang, onClose }: RoomFitPlayProps) {
  const dialog = useRef<HTMLDivElement>(null);
  const wide = useMediaQuery(WIDE_SCREEN);
  useDialog(dialog, onClose);
  // Turning the phone swaps one layout for the other, and the button that had focus goes with it: keep focus in the dialog.
  useEffect(() => {
    const node = dialog.current;
    if (node && !node.contains(document.activeElement)) node.focus();
  }, [wide]);

  return createPortal(
    <div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label={COPY.playLabel[lang]}
      tabIndex={-1}
      data-testid="room-fit-play"
      className="fixed inset-0 z-[300] h-dvh overflow-hidden overscroll-none pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pt-[env(safe-area-inset-top)] outline-none"
      style={{ background: DIALOG_SURFACE, touchAction: 'pinch-zoom' }}
    >
      <PlayStage game={game} lang={lang} wide={wide} onClose={onClose} className={`mx-auto ${wide ? 'max-w-[1120px]' : 'max-w-[520px]'}`} />
    </div>,
    document.body,
  );
}
