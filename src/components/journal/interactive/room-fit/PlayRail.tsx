import type { ReactNode } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, DoorClosed, DoorOpen, Eye, EyeOff, RotateCcw, RotateCw } from 'lucide-react';
import { DOOR_IDS } from '@/lib/roomFit';
import type { LangCode } from '@/lib/journalBlocks';
import NudgeButton from './NudgeButton';
import { COPY } from './copy';
import type { RoomFitGame } from './useRoomFitGame';

const RAIL_BUTTON =
  'flex h-11 w-full flex-none flex-col items-center justify-center gap-0.5 rounded-2xl border sec-border card-surface font-sans text-[10.5px] leading-tight sec-text-80 transition-colors duration-300 hover:border-sage-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sage-green';

function RailButton({ action, label, onPress, children }: { action: string; label: string; onPress: () => void; children: ReactNode }) {
  return (
    <button type="button" data-action={action} onClick={onPress} className={RAIL_BUTTON}>
      {children}
      <span>{label}</span>
    </button>
  );
}

interface PlayRailProps {
  game: RoomFitGame;
  lang: LangCode;
}

// The buttons of the full-screen game, in a column at the edge the thumb reaches: the turn button (the one
// that used to sit a screen and a half below the plan), a small pad to nudge the piece, and the doors,
// start over and "our plan". Nothing here changes size — a button that shrank on a short screen would
// stop being a button — so a screen too short for all of it scrolls the rail instead.
export default function PlayRail({ game, lang }: PlayRailProps) {
  const { state } = game;
  const selected = state.selected;
  const none = selected === null;
  const allOpen = DOOR_IDS.every((id) => state.doors[id]);
  const nudge = (dx: number, dy: number) => () => {
    if (selected) game.nudge(selected, dx, dy);
  };

  return (
    <div data-testid="room-fit-rail" className="flex w-[104px] flex-none flex-col items-center gap-2 overflow-y-auto overscroll-contain" style={{ touchAction: 'pan-y pinch-zoom' }}>
      <button
        type="button"
        aria-label={COPY.rotate[lang]}
        title={COPY.rotate[lang]}
        disabled={none}
        data-action="rotate"
        onClick={() => selected && game.rotate(selected)}
        className="inline-flex h-[60px] w-[60px] flex-none items-center justify-center rounded-full bg-sage-green text-pure-white transition-opacity duration-300 disabled:pointer-events-none disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-green"
      >
        <RotateCw size={26} aria-hidden="true" />
      </button>

      <div className="grid flex-none grid-cols-3 gap-0.5">
        <span />
        <NudgeButton label={COPY.moveUp[lang]} disabled={none} onPress={nudge(0, -5)} testId="nudge-up" size="compact">
          <ArrowUp size={16} aria-hidden="true" />
        </NudgeButton>
        <span />
        <NudgeButton label={COPY.moveLeft[lang]} disabled={none} onPress={nudge(-5, 0)} testId="nudge-left" size="compact">
          <ArrowLeft size={16} aria-hidden="true" />
        </NudgeButton>
        <span />
        <NudgeButton label={COPY.moveRight[lang]} disabled={none} onPress={nudge(5, 0)} testId="nudge-right" size="compact">
          <ArrowRight size={16} aria-hidden="true" />
        </NudgeButton>
        <span />
        <NudgeButton label={COPY.moveDown[lang]} disabled={none} onPress={nudge(0, 5)} testId="nudge-down" size="compact">
          <ArrowDown size={16} aria-hidden="true" />
        </NudgeButton>
        <span />
      </div>

      <RailButton action="toggle-doors" label={allOpen ? COPY.closeDoors[lang] : COPY.openDoors[lang]} onPress={game.toggleAllDoors}>
        {allOpen ? <DoorClosed size={18} aria-hidden="true" /> : <DoorOpen size={18} aria-hidden="true" />}
      </RailButton>
      <RailButton action="reset" label={COPY.reset[lang]} onPress={game.reset}>
        <RotateCcw size={16} aria-hidden="true" />
      </RailButton>
      <RailButton action="toggle-plan" label={state.showPlan ? COPY.hidePlan[lang] : COPY.showPlan[lang]} onPress={game.togglePlan}>
        {state.showPlan ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
      </RailButton>
    </div>
  );
}
