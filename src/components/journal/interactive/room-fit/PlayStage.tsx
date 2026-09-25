import { useState } from 'react';
import type { LangCode } from '@/lib/journalBlocks';
import PlayHeader from './PlayHeader';
import PlayPanel from './PlayPanel';
import PlayRail from './PlayRail';
import PlaySheet from './PlaySheet';
import RoomBoard from './RoomBoard';
import type { RoomFitGame } from './useRoomFitGame';

interface PlayStageProps {
  game: RoomFitGame;
  lang: LangCode;
  /** Wider than it is tall: the plan is as tall as its room and the result sits beside it, not under it. */
  wide: boolean;
  /** Shows a close button in the header; leave it out where the game sits inside something with its own. */
  onClose?: () => void;
  /** Sizing from whatever holds the stage (it fills the room it is given). */
  className?: string;
}

// The game's screen: what you are holding, the plan, its buttons and the result, together in one place
// with nothing to scroll. Shown full screen by RoomFitPlay and as a page of the guided reading. On a
// phone held upright the rules and widths wait in a sheet at the foot that opens over nothing - the plan
// shrinks to stay in view; where the room is wider than it is tall they sit in a panel beside the plan.
export default function PlayStage({ game, lang, wide, onClose, className = '' }: PlayStageProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
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

  return (
    <div
      data-testid="room-fit"
      data-mode="play"
      data-layout={wide ? 'wide' : 'upright'}
      data-rules-passed={verified.passed}
      data-won={settled && verified.won}
      data-settled={settled}
      data-selected={state.selected ?? ''}
      className={`flex h-full min-h-0 w-full flex-col ${className}`}
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
  );
}
