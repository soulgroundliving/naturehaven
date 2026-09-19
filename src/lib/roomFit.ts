// Rules and geometry of the room-arranging game (the interactive piece in the
// Design Notes #01 article). Pure and dependency-free, so tools/__tests__/
// roomFit.test.ts runs it on plain Node and the React piece only draws it.
//
// Everything is in centimetres, x to the right, y DOWN, origin at the top-left
// of the room. The sizes come from slide 6 of the article (room 350 x 720 cm,
// 25.2 sqm; balcony 140 x 160, bathroom 210 x 160; the five pieces below).
// Where the drawing gives no number — door positions, the room to stand in front
// of a piece — the values are estimates read off the plan and stated as such in
// the game's copy: this is a game, not a building specification.
import { widestRoutes } from './roomFitRoute.ts';
import type { Rect, Route } from './roomFitRoute.ts';

export type { Point, Rect, Route } from './roomFitRoute.ts';

export type PieceId = 'bed' | 'closet' | 'kitchen' | 'table' | 'shelf';
export type Rotation = 0 | 90 | 180 | 270;
export type DoorId = 'entrance' | 'bathroom' | 'balcony';

/** Where a piece stands: the top-left corner of its (rotated) footprint, and how far it is turned clockwise. */
export interface Placement {
  x: number;
  y: number;
  rot: Rotation;
}

export type Layout = Record<PieceId, Placement>;

export interface PieceSpec {
  id: PieceId;
  /** cm along x when not rotated */
  w: number;
  /** cm along y when not rotated */
  d: number;
  /** cm that must stay free in front of it (0 = none; the bed uses its long sides instead) */
  frontDepth: number;
}

/** Positions snap to this grid. All sizes and walls are multiples of it, so gaps are exact. */
export const SNAP = 5;

export const ROOM = { width: 350, length: 720, topZone: 160, balconyWidth: 140 } as const;

/** The floor the pieces stand on: everything below the balcony and bathroom. */
export const LIVING: Rect = { x0: 0, y0: ROOM.topZone, x1: ROOM.width, y1: ROOM.length };

/** The article's walkway (slide 4: 90 cm) and the room beside a bed (slide 4: 120 cm). */
export const WALK_MIN = 90;
export const BED_SIDE = 120;

export const PIECES: readonly PieceSpec[] = [
  { id: 'bed', w: 200, d: 160, frontDepth: 0 },
  { id: 'closet', w: 150, d: 60, frontDepth: 60 },
  { id: 'kitchen', w: 195, d: 45, frontDepth: 90 },
  { id: 'table', w: 300, d: 45, frontDepth: 70 },
  { id: 'shelf', w: 60, d: 45, frontDepth: 50 },
];
export const PIECE_IDS: readonly PieceId[] = PIECES.map((piece) => piece.id);
const SPECS = Object.fromEntries(PIECES.map((piece) => [piece.id, piece])) as Record<PieceId, PieceSpec>;

/** The real size of a piece, as in the article's measurements table. */
export const specOf = (id: PieceId): PieceSpec => SPECS[id];

/**
 * The clear space needed in front of each door (estimated from the plan). Every edge is a
 * multiple of 2.5 cm — the lattice the walkway is measured on (see CELL) — so a route may
 * start anywhere along a zone; the wall openings are drawn from these same numbers.
 */
export const DOOR_ZONES: Record<DoorId, Rect> = {
  entrance: { x0: 220, y0: 640, x1: 300, y1: 720 },
  bathroom: { x0: 155, y0: ROOM.topZone, x1: 225, y1: 240 },
  balcony: { x0: 45, y0: ROOM.topZone, x1: 105, y1: 240 },
};
export const DOOR_IDS: readonly DoorId[] = ['entrance', 'bathroom', 'balcony'];

/** The arrangement from the article's final plan (slide 7): the three units fill the right wall. */
export const FINAL_PLAN: Layout = {
  bed: { x: 0, y: 310, rot: 0 },
  closet: { x: 0, y: 660, rot: 180 },
  table: { x: 305, y: 160, rot: 90 },
  shelf: { x: 305, y: 460, rot: 90 },
  kitchen: { x: 305, y: 520, rot: 90 },
};

/** Everything fits — and the room does not work. That is the puzzle. */
export const START_LAYOUT: Layout = {
  table: { x: 25, y: 165, rot: 0 },
  bed: { x: 75, y: 330, rot: 0 },
  kitchen: { x: 300, y: 380, rot: 90 },
  closet: { x: 10, y: 655, rot: 0 },
  shelf: { x: 10, y: 540, rot: 0 },
};

export const snap = (value: number): number => Math.round(value / SNAP) * SNAP;

export function overlaps(a: Rect, b: Rect): boolean {
  return a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
}

const insideLiving = (r: Rect) => r.x0 >= LIVING.x0 && r.y0 >= LIVING.y0 && r.x1 <= LIVING.x1 && r.y1 <= LIVING.y1;

function size(id: PieceId, rot: Rotation): { w: number; h: number } {
  const { w, d } = SPECS[id];
  return rot === 90 || rot === 270 ? { w: d, h: w } : { w, h: d };
}

export function footprintOf(id: PieceId, placement: Placement): Rect {
  const { w, h } = size(id, placement.rot);
  return { x0: placement.x, y0: placement.y, x1: placement.x + w, y1: placement.y + h };
}

/** The space to keep free in front of a piece; the front turns clockwise with it (south, west, north, east). */
export function frontZoneOf(id: PieceId, placement: Placement): Rect | null {
  const depth = SPECS[id].frontDepth;
  if (depth === 0) return null;
  const f = footprintOf(id, placement);
  switch (placement.rot) {
    case 0:
      return { x0: f.x0, y0: f.y1, x1: f.x1, y1: f.y1 + depth };
    case 90:
      return { x0: f.x0 - depth, y0: f.y0, x1: f.x0, y1: f.y1 };
    case 180:
      return { x0: f.x0, y0: f.y0 - depth, x1: f.x1, y1: f.y0 };
    case 270:
      return { x0: f.x1, y0: f.y0, x1: f.x1 + depth, y1: f.y1 };
  }
}

/** The two strips beside the bed's long sides, where you get in and out. */
export function bedStripsOf(placement: Placement): [Rect, Rect] {
  const f = footprintOf('bed', placement);
  if (f.x1 - f.x0 >= f.y1 - f.y0) {
    return [
      { x0: f.x0, y0: f.y0 - BED_SIDE, x1: f.x1, y1: f.y0 },
      { x0: f.x0, y0: f.y1, x1: f.x1, y1: f.y1 + BED_SIDE },
    ];
  }
  return [
    { x0: f.x0 - BED_SIDE, y0: f.y0, x1: f.x0, y1: f.y1 },
    { x0: f.x1, y0: f.y0, x1: f.x1 + BED_SIDE, y1: f.y1 },
  ];
}

/** Keeps a piece's footprint inside the living area. */
export function clampPlacement(id: PieceId, placement: Placement): Placement {
  const { w, h } = size(id, placement.rot);
  return {
    x: Math.min(Math.max(placement.x, LIVING.x0), LIVING.x1 - w),
    y: Math.min(Math.max(placement.y, LIVING.y0), LIVING.y1 - h),
    rot: placement.rot,
  };
}

/** Moves a piece's top-left corner to (x, y), snapped and kept in the room. Returns a new layout. */
export function movePiece(layout: Layout, id: PieceId, x: number, y: number): Layout {
  return { ...layout, [id]: clampPlacement(id, { x: snap(x), y: snap(y), rot: layout[id].rot }) };
}

export function nudgePiece(layout: Layout, id: PieceId, dx: number, dy: number): Layout {
  return movePiece(layout, id, layout[id].x + dx, layout[id].y + dy);
}

/** Rounds to the 5 cm grid with a half rounding AWAY from zero, so that -x rounds to minus what x rounds to. */
const snapAway = (value: number): number => Math.sign(value) * Math.round(Math.abs(value) / SNAP) * SNAP;

/**
 * Turns a piece 90 degrees clockwise about its centre. The centre stays put, so the top-left
 * corner moves by half the change in size. For the table and the shelf that half is 2.5 cm off
 * the grid; it is rounded away from zero, which makes the turn back the exact opposite shift:
 * two turns leave the footprint where it was and four leave the whole placement where it was.
 * (Rounding the absolute position instead lets every full circle walk the piece 10 cm.) That
 * holds wherever the turn fits; beside a wall, a turn that would poke through it is pushed
 * back inside, and that push is not undone by the turns that follow.
 */
export function rotatePiece(layout: Layout, id: PieceId): Layout {
  const current = layout[id];
  const rot = ((current.rot + 90) % 360) as Rotation;
  const before = size(id, current.rot);
  const after = size(id, rot);
  const x = current.x + snapAway((before.w - after.w) / 2);
  const y = current.y + snapAway((before.h - after.h) / 2);
  return { ...layout, [id]: clampPlacement(id, { x, y, rot }) };
}

// ── the rules ────────────────────────────────────────────────────────────────

/** The four rules that are quick to check (no route search). */
export interface FastEvaluation {
  /** Nothing overlaps. */
  fit: boolean;
  /** The clear space in front of each door is really clear. */
  doors: boolean;
  /** Every piece with a front has its room to be used. */
  use: boolean;
  /** You can get in and out of bed. */
  bed: boolean;
  overlapping: PieceId[];
  blockedDoors: DoorId[];
  cramped: PieceId[];
}

export function evaluateFast(layout: Layout): FastEvaluation {
  const footprints = Object.fromEntries(PIECE_IDS.map((id) => [id, footprintOf(id, layout[id])])) as Record<PieceId, Rect>;
  const others = (id: PieceId) => PIECE_IDS.filter((other) => other !== id).map((other) => footprints[other]);

  const overlapping = PIECE_IDS.filter((id) => others(id).some((other) => overlaps(footprints[id], other)));
  const blockedDoors = DOOR_IDS.filter((door) => PIECE_IDS.some((id) => overlaps(DOOR_ZONES[door], footprints[id])));
  const cramped = PIECE_IDS.filter((id) => {
    const zone = frontZoneOf(id, layout[id]);
    return zone !== null && (!insideLiving(zone) || others(id).some((other) => overlaps(zone, other)));
  });
  const bed = bedStripsOf(layout.bed).some((strip) => insideLiving(strip) && !others('bed').some((other) => overlaps(strip, other)));

  return {
    fit: overlapping.length === 0,
    doors: blockedDoors.length === 0,
    use: cramped.length === 0,
    bed,
    overlapping,
    blockedDoors,
    cramped,
  };
}

/** A walkway passes when its narrowest point is at least WALK_MIN (the epsilon absorbs float noise, not a fudge). */
export const walkOk = (width: number): boolean => width >= WALK_MIN - 1e-9;

export interface WalkEvaluation {
  toBathroom: Route;
  toBalcony: Route;
  /** The narrower of the two routes, in cm. */
  width: number;
  ok: boolean;
}

/** From the front door to the bathroom door and to the balcony door: how wide is the narrowest point? */
export function evaluateWalk(layout: Layout): WalkEvaluation {
  const obstacles = PIECE_IDS.map((id) => footprintOf(id, layout[id]));
  const routes = widestRoutes(LIVING, obstacles, DOOR_ZONES.entrance, {
    bathroom: DOOR_ZONES.bathroom,
    balcony: DOOR_ZONES.balcony,
  });
  const width = Math.min(routes.bathroom.width, routes.balcony.width);
  return { toBathroom: routes.bathroom, toBalcony: routes.balcony, width, ok: walkOk(width) };
}

export const RULE_COUNT = 5;

export interface Evaluation extends FastEvaluation {
  walk: WalkEvaluation;
  /** How many of the five rules hold. */
  passed: number;
  won: boolean;
}

export function summarize(fast: FastEvaluation, walk: WalkEvaluation): Evaluation {
  const passed = [fast.fit, fast.doors, walk.ok, fast.use, fast.bed].filter(Boolean).length;
  return { ...fast, walk, passed, won: passed === RULE_COUNT };
}

export function evaluate(layout: Layout): Evaluation {
  return summarize(evaluateFast(layout), evaluateWalk(layout));
}
