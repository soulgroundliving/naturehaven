import { useEffect, useMemo, useReducer, useState } from 'react';
import { Eye, EyeOff, RotateCcw } from 'lucide-react';
import {
  BED_SIDE,
  FINAL_PLAN,
  LIVING,
  RULE_COUNT,
  START_LAYOUT,
  WALK_MIN,
  evaluate,
  evaluateFast,
  evaluateWalk,
  movePiece,
  nudgePiece,
  rotatePiece,
} from '@/lib/roomFit';
import type { Layout, PieceId, Placement } from '@/lib/roomFit';
import type { InteractiveProps } from '../registry';
import PieceControls from './PieceControls';
import RoomBoard from './RoomBoard';
import RulesList from './RulesList';
import {
  COPY,
  PIECE_NAME,
  bedDetail,
  doorsDetail,
  fitDetail,
  ourPlanCaption,
  positionLabel,
  progress,
  ruleLabels,
  useDetail,
  verdict,
  walkDetail,
} from './copy';
import type { RuleView, VerdictKind } from './copy';

// How long the arrangement must hold still before the walkway is measured.
const WALK_CHECK_DELAY_MS = 150;

interface State {
  layout: Layout;
  selected: PieceId | null;
  /** The piece that last changed place (for the spoken announcement); null until one has. */
  moved: PieceId | null;
  showPlan: boolean;
}

type Action =
  | { type: 'select'; id: PieceId }
  | { type: 'move'; id: PieceId; x: number; y: number }
  | { type: 'nudge'; id: PieceId; dx: number; dy: number }
  | { type: 'rotate'; id: PieceId }
  | { type: 'reset' }
  | { type: 'togglePlan' };

const INITIAL: State = { layout: START_LAYOUT, selected: null, moved: null, showPlan: false };

const samePlacement = (a: Placement, b: Placement) => a.x === b.x && a.y === b.y && a.rot === b.rot;

// What the headline can honestly say: overlapping pieces are visible at once, but a win only
// counts for an arrangement whose walkway has been measured.
function verdictFor(fits: boolean, settled: boolean, won: boolean): VerdictKind {
  if (!fits) return 'overlap';
  return settled && won ? 'won' : 'open';
}

// A move that lands where the piece already is (held against a wall, say) must
// not count as a change, or every pointer event would re-run the rules.
function withLayout(state: State, id: PieceId, layout: Layout): State {
  return samePlacement(layout[id], state.layout[id]) ? state : { ...state, layout, moved: id };
}

function reduce(state: State, action: Action): State {
  switch (action.type) {
    case 'select':
      return state.selected === action.id ? state : { ...state, selected: action.id };
    case 'move':
      return withLayout(state, action.id, movePiece(state.layout, action.id, action.x, action.y));
    case 'nudge':
      return withLayout(state, action.id, nudgePiece(state.layout, action.id, action.dx, action.dy));
    case 'rotate':
      return withLayout(state, action.id, rotatePiece(state.layout, action.id));
    case 'reset':
      return { ...INITIAL, showPlan: state.showPlan };
    case 'togglePlan':
      return { ...state, showPlan: !state.showPlan };
  }
}

// "Can the room still work once everything fits?" — the article's question,
// playable. Every piece is the real size from the measurements table; the start
// fits everything and works for nothing; the five rules are checked live against
// the real geometry (src/lib/roomFit.ts), the walkway by measuring the narrowest
// point of the widest route from the front door, not by a rule of thumb.
export default function RoomFit({ lang }: InteractiveProps) {
  const [state, dispatch] = useReducer(reduce, INITIAL);

  // The four quick rules follow every move. The walkway is a route search — about 25 ms on
  // a laptop, 100-250 ms on a mid-range phone — and run for every 5 cm of a drag it would keep
  // the main thread busy for most of the drag (useDeferredValue does not help: the search is
  // one render that cannot be interrupted). So the full check waits until the arrangement has
  // held still, and until then the game speaks only for what it has actually checked.
  const fast = useMemo(() => evaluateFast(state.layout), [state.layout]);
  const [checked, setChecked] = useState(state.layout);
  useEffect(() => {
    const timer = window.setTimeout(() => setChecked(state.layout), WALK_CHECK_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [state.layout]);
  const verified = useMemo(() => evaluate(checked), [checked]);
  const settled = checked === state.layout;
  const ourWalk = useMemo(() => (state.showPlan ? evaluateWalk(FINAL_PLAN) : null), [state.showPlan]);
  // Moving a piece only changes its label, which a screen reader does not re-read: say where it landed, once it has stopped.
  const spoken =
    settled && state.moved
      ? positionLabel(PIECE_NAME[state.moved][lang], state.layout[state.moved].x, state.layout[state.moved].y - LIVING.y0, lang)
      : '';

  const labels = ruleLabels(WALK_MIN, BED_SIDE);
  const rules: RuleView[] = [
    { id: 'fit', label: labels.fit, ok: fast.fit, detail: fitDetail(fast.overlapping, lang) },
    { id: 'doors', label: labels.doors, ok: fast.doors, detail: doorsDetail(fast.blockedDoors, lang) },
    { id: 'walk', label: labels.walk, ok: verified.walk.ok, detail: walkDetail(verified.walk.width, lang) },
    { id: 'use', label: labels.use, ok: fast.use, detail: useDetail(fast.cramped, lang) },
    { id: 'bed', label: labels.bed, ok: fast.bed, detail: bedDetail(fast.bed, lang) },
  ];

  const ACTION_BUTTON =
    'inline-flex items-center gap-2 rounded-full border sec-border px-4 py-2 font-sans text-[13px] sec-text-80 transition-colors duration-300 hover:border-sage-green hover:text-sage-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-green';

  return (
    <div
      data-testid="room-fit"
      data-rules-passed={verified.passed}
      data-won={settled && verified.won}
      data-settled={settled}
      data-selected={state.selected ?? ''}
      className="grid gap-6 lg:grid-cols-[minmax(0,370px)_minmax(0,1fr)] lg:gap-8"
    >
      <RoomBoard
        layout={state.layout}
        selected={state.selected}
        fast={fast}
        walk={verified.walk}
        settled={settled}
        showPlan={state.showPlan}
        lang={lang}
        onSelect={(id) => dispatch({ type: 'select', id })}
        onMove={(id, x, y) => dispatch({ type: 'move', id, x, y })}
        onNudge={(id, dx, dy) => dispatch({ type: 'nudge', id, dx, dy })}
        onRotate={(id) => dispatch({ type: 'rotate', id })}
      />

      <div className="flex min-w-0 flex-col gap-5">
        <div>
          <p data-testid="room-fit-progress" aria-live="polite" className="font-sans text-[12px] font-medium uppercase tracking-[0.16em] sec-text-60">
            {settled ? progress(verified.passed, RULE_COUNT, lang) : COPY.checking[lang]}
          </p>
          <p data-testid="room-fit-verdict" className="mt-1 font-sans text-[17px] font-medium leading-snug sec-text">
            {verdict(verdictFor(fast.fit, settled, verified.won), lang)}
          </p>
          <p data-testid="room-fit-announce" aria-live="polite" className="sr-only">
            {spoken}
          </p>
        </div>

        <RulesList rules={rules} lang={lang} settled={settled} />

        <PieceControls
          selected={state.selected}
          lang={lang}
          onNudge={(id, dx, dy) => dispatch({ type: 'nudge', id, dx, dy })}
          onRotate={(id) => dispatch({ type: 'rotate', id })}
        />

        <div className="flex flex-wrap gap-3">
          <button type="button" data-action="reset" onClick={() => dispatch({ type: 'reset' })} className={ACTION_BUTTON}>
            <RotateCcw size={15} aria-hidden="true" />
            {COPY.reset[lang]}
          </button>
          <button type="button" data-action="toggle-plan" onClick={() => dispatch({ type: 'togglePlan' })} className={ACTION_BUTTON}>
            {state.showPlan ? <EyeOff size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />}
            {state.showPlan ? COPY.hidePlan[lang] : COPY.showPlan[lang]}
          </button>
        </div>

        {ourWalk && (
          <p data-testid="room-fit-our-plan" className="font-sans text-[13px] leading-snug sec-text-80">
            {ourPlanCaption(ourWalk.width, lang)}
          </p>
        )}

        <div className="flex flex-col gap-1.5 font-sans text-[12px] leading-snug sec-text-60">
          <p>{COPY.howTo[lang]}</p>
          <p>{COPY.routeLegend[lang]}</p>
          <p>{COPY.disclaimer[lang]}</p>
        </div>
      </div>
    </div>
  );
}
