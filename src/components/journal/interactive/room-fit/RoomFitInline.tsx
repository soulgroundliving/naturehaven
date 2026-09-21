import type { MouseEvent } from 'react';
import { DoorClosed, DoorOpen, Eye, EyeOff, Maximize2, RotateCcw } from 'lucide-react';
import { DOOR_IDS, RULE_COUNT } from '@/lib/roomFit';
import type { LangCode } from '@/lib/journalBlocks';
import OurPlan from './OurPlan';
import PieceControls from './PieceControls';
import RoomBoard from './RoomBoard';
import RulesList from './RulesList';
import SpacesPanel from './SpacesPanel';
import { COPY, progress, verdict } from './copy';
import type { RoomFitGame } from './useRoomFitGame';

const ACTION_BUTTON =
  'inline-flex items-center gap-2 rounded-full border sec-border px-4 py-2 font-sans text-[13px] sec-text-80 transition-colors duration-300 hover:border-sage-green hover:text-sage-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-green';

interface RoomFitInlineProps {
  game: RoomFitGame;
  lang: LangCode;
  onPlay: (event: MouseEvent<HTMLElement>) => void;
}

// The game as it sits in the article on a screen wide enough to hold the plan and its checks side by
// side: the board on the left (it stays in view while the checks beside it scroll), the rules, the
// piece controls and the widths on the right.
export default function RoomFitInline({ game, lang, onPlay }: RoomFitInlineProps) {
  const { state, fast, verified, settled, ourWalk, roomCm, spoken, rules, verdictKind } = game;
  const allOpen = DOOR_IDS.every((id) => state.doors[id]);

  return (
    <div
      data-testid="room-fit"
      data-mode="inline"
      data-rules-passed={verified.passed}
      data-won={settled && verified.won}
      data-settled={settled}
      data-selected={state.selected ?? ''}
      className="grid gap-6 lg:grid-cols-[minmax(0,370px)_minmax(0,1fr)] lg:gap-8"
    >
      {/* On a wide screen the board stays in view while the long column of checks beside it scrolls. */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        <RoomBoard
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
      </div>

      <div className="flex min-w-0 flex-col gap-5">
        <div>
          <p data-testid="room-fit-progress" aria-live="polite" className="font-sans text-[12px] font-medium uppercase tracking-[0.16em] sec-text-60">
            {settled ? progress(verified.passed, RULE_COUNT, lang) : COPY.checking[lang]}
          </p>
          <p data-testid="room-fit-verdict" className="mt-1 font-sans text-[17px] font-medium leading-snug sec-text">
            {verdict(verdictKind, lang)}
          </p>
          <p data-testid="room-fit-announce" aria-live="polite" className="sr-only">
            {spoken}
          </p>
        </div>

        <RulesList rules={rules} lang={lang} settled={settled} />

        <PieceControls
          selected={state.selected}
          rot={state.selected ? state.layout[state.selected].rot : null}
          roomCm={roomCm}
          lang={lang}
          onNudge={game.nudge}
          onRotate={game.rotate}
        />

        <div className="flex flex-wrap gap-3">
          <button type="button" data-action="reset" onClick={game.reset} className={ACTION_BUTTON}>
            <RotateCcw size={15} aria-hidden="true" />
            {COPY.reset[lang]}
          </button>
          <button type="button" data-action="toggle-plan" onClick={game.togglePlan} className={ACTION_BUTTON}>
            {state.showPlan ? <EyeOff size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />}
            {state.showPlan ? COPY.hidePlan[lang] : COPY.showPlan[lang]}
          </button>
          <button type="button" data-action="toggle-doors" onClick={game.toggleAllDoors} className={ACTION_BUTTON}>
            {allOpen ? <DoorClosed size={15} aria-hidden="true" /> : <DoorOpen size={15} aria-hidden="true" />}
            {allOpen ? COPY.closeDoors[lang] : COPY.openDoors[lang]}
          </button>
          <button type="button" data-action="play-full-screen" onClick={onPlay} className={ACTION_BUTTON}>
            <Maximize2 size={15} aria-hidden="true" />
            {COPY.playFullScreen[lang]}
          </button>
        </div>

        <SpacesPanel spaces={fast.spaces} walkCm={verified.walk.width} walkPending={!settled} lang={lang} />

        {ourWalk && <OurPlan walkWidth={ourWalk.width} lang={lang} />}

        <div className="flex flex-col gap-1.5 font-sans text-[12px] leading-snug sec-text-60">
          <p>{COPY.howTo[lang]}</p>
          <p>{COPY.routeLegend[lang]}</p>
          <p>{COPY.disclaimer[lang]}</p>
        </div>
      </div>
    </div>
  );
}
