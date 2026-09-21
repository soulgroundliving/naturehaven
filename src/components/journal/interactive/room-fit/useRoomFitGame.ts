import { useEffect, useMemo, useReducer, useState } from 'react';
import {
  BED_SIDE,
  DOOR_IDS,
  FINAL_PLAN,
  LIVING,
  START_LAYOUT,
  WALK_MIN,
  evaluate,
  evaluateFast,
  evaluateWalk,
  movePiece,
  nudgePiece,
  rotatePiece,
  spaceOfPiece,
} from '@/lib/roomFit';
import type { DoorId, Evaluation, FastEvaluation, Layout, PieceId, Placement, WalkEvaluation } from '@/lib/roomFit';
import type { LangCode } from '@/lib/journalBlocks';
import { bedDetail, doorsDetail, fitDetail, placeLabel, ruleLabels, useDetail, walkDetail } from './copy';
import type { RuleView, VerdictKind } from './copy';

// How long the arrangement must hold still before the walkway is measured.
const WALK_CHECK_DELAY_MS = 150;

export type OpenDoors = Record<DoorId, boolean>;
const ALL_SHUT: OpenDoors = { entrance: false, bathroom: false, balcony: false };

export interface State {
  layout: Layout;
  selected: PieceId | null;
  /** The piece that last changed place (for the spoken announcement); null until one has. */
  moved: PieceId | null;
  showPlan: boolean;
  /** Which doors stand open. It changes what is drawn, never what the rules say. */
  doors: OpenDoors;
}

type Action =
  | { type: 'select'; id: PieceId }
  | { type: 'move'; id: PieceId; x: number; y: number }
  | { type: 'nudge'; id: PieceId; dx: number; dy: number }
  | { type: 'rotate'; id: PieceId }
  | { type: 'reset' }
  | { type: 'togglePlan' }
  | { type: 'toggleDoor'; id: DoorId }
  | { type: 'toggleAllDoors' };

const INITIAL: State = { layout: START_LAYOUT, selected: null, moved: null, showPlan: false, doors: ALL_SHUT };

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
      // Start over puts the furniture back; the doors and the plan outline stay as the visitor left them.
      return { ...INITIAL, showPlan: state.showPlan, doors: state.doors };
    case 'togglePlan':
      return { ...state, showPlan: !state.showPlan };
    case 'toggleDoor':
      return { ...state, doors: { ...state.doors, [action.id]: !state.doors[action.id] } };
    case 'toggleAllDoors': {
      // Any door still shut: open them all. Every door open: shut them all.
      const open = DOOR_IDS.some((id) => !state.doors[id]);
      return { ...state, doors: { entrance: open, bathroom: open, balcony: open } };
    }
  }
}

export interface RoomFitGame {
  state: State;
  /** The quick rules, live with every move. */
  fast: FastEvaluation;
  /** All five rules, for the last arrangement that held still. */
  verified: Evaluation;
  /** True when `verified` is about the arrangement on the board. */
  settled: boolean;
  /** The final plan's own walkway, once "our plan" is shown. */
  ourWalk: WalkEvaluation | null;
  /** What the selected piece leaves around it: the room in front of it, or beside the bed. */
  roomCm: number | null;
  /** Where the last moved piece landed, once it has stopped — for a screen reader. */
  spoken: string;
  rules: RuleView[];
  verdictKind: VerdictKind;
  select: (id: PieceId) => void;
  move: (id: PieceId, x: number, y: number) => void;
  nudge: (id: PieceId, dx: number, dy: number) => void;
  rotate: (id: PieceId) => void;
  reset: () => void;
  togglePlan: () => void;
  toggleDoor: (id: DoorId) => void;
  toggleAllDoors: () => void;
}

// "Can the room still work once everything fits?" — the article's question, playable. The state
// and the rules live here so the inline game and the full-screen one are the same game: every
// piece is the real size from the measurements table; the start fits everything and works for
// nothing; the five rules are checked live against the real geometry (src/lib/roomFit.ts), the
// walkway by measuring the narrowest point of the widest route from the front door.
export default function useRoomFitGame(lang: LangCode): RoomFitGame {
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
  const roomCm = state.selected ? fast.spaces[spaceOfPiece(state.selected)] : null;
  // Moving a piece only changes its label, which a screen reader does not re-read: say where it landed
  // and which way it faces, once it has stopped.
  const spoken = settled && state.moved ? placeLabel(state.moved, state.layout[state.moved], LIVING.y0, lang) : '';

  const labels = ruleLabels(WALK_MIN, BED_SIDE);
  const rules: RuleView[] = [
    { id: 'fit', label: labels.fit, ok: fast.fit, detail: fitDetail(fast.overlapping, lang) },
    { id: 'doors', label: labels.doors, ok: fast.doors, detail: doorsDetail(fast.blockedDoors, lang) },
    { id: 'walk', label: labels.walk, ok: verified.walk.ok, detail: walkDetail(verified.walk.width, lang) },
    { id: 'use', label: labels.use, ok: fast.use, detail: useDetail(fast.cramped, lang) },
    { id: 'bed', label: labels.bed, ok: fast.bed, detail: bedDetail(fast.bed, lang) },
  ];

  // `dispatch` never changes, so neither do these: a part of the screen that takes one need not re-render for it.
  const actions = useMemo(
    () => ({
      select: (id: PieceId) => dispatch({ type: 'select', id }),
      move: (id: PieceId, x: number, y: number) => dispatch({ type: 'move', id, x, y }),
      nudge: (id: PieceId, dx: number, dy: number) => dispatch({ type: 'nudge', id, dx, dy }),
      rotate: (id: PieceId) => dispatch({ type: 'rotate', id }),
      reset: () => dispatch({ type: 'reset' }),
      togglePlan: () => dispatch({ type: 'togglePlan' }),
      toggleDoor: (id: DoorId) => dispatch({ type: 'toggleDoor', id }),
      toggleAllDoors: () => dispatch({ type: 'toggleAllDoors' }),
    }),
    [],
  );

  return { state, fast, verified, settled, ourWalk, roomCm, spoken, rules, verdictKind: verdictFor(fast.fit, settled, verified.won), ...actions };
}
