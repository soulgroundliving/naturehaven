// Rules and geometry of the room-arranging game (the interactive piece in the
// Design Notes #01 article). Pure and dependency-free, so tools/__tests__/
// roomFit.test.ts runs it on plain Node and the React piece only draws it.
//
// Everything is in centimetres, x to the right, y DOWN, origin at the top-left
// of the room. The sizes come from slide 6 of the article (room 350 x 720 cm,
// 25.2 sqm; balcony 140 x 160, bathroom 210 x 160; the pieces below — the 195 cm
// kitchen run is a 140 cm counter and a single-door fridge). Where the drawing
// gives no number — door positions, the fridge's size — the values are estimates
// read off the plan and stated as such in the game's copy: this is a game, not a
// building specification. How much floor each piece needs in front of it is not
// here: that is roomStandards.ts, the width standards the rules and the screen share.
import { widestRoutes } from './roomFitRoute.ts';
import type { Rect, Route } from './roomFitRoute.ts';
import { meetsRequirement, requiredCm } from './roomStandards.ts';
import type { FrontSpaceId, SpaceId } from './roomStandards.ts';

export type { Point, Rect, Route } from './roomFitRoute.ts';

export type PieceId = 'bed' | 'closet' | 'kitchen' | 'fridge' | 'table' | 'shelf';
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
export const WALK_MIN = requiredCm('walk');
export const BED_SIDE = requiredCm('bedside');

export const PIECES: readonly PieceSpec[] = [
  { id: 'bed', w: 200, d: 160, frontDepth: 0 },
  { id: 'closet', w: 150, d: 60, frontDepth: requiredCm('closet') },
  { id: 'kitchen', w: 140, d: 45, frontDepth: requiredCm('kitchen') },
  { id: 'fridge', w: 55, d: 55, frontDepth: requiredCm('fridge') },
  { id: 'table', w: 300, d: 45, frontDepth: requiredCm('table') },
  { id: 'shelf', w: 60, d: 45, frontDepth: requiredCm('shelf') },
];
export const PIECE_IDS: readonly PieceId[] = PIECES.map((piece) => piece.id);
const SPECS = Object.fromEntries(PIECES.map((piece) => [piece.id, piece])) as Record<PieceId, PieceSpec>;

/** The real size of a piece, as in the article's measurements table. */
export const specOf = (id: PieceId): PieceSpec => SPECS[id];

/**
 * The clear space needed in front of each door (estimated from the plan). Every edge is a
 * multiple of 2.5 cm — the lattice the walkway is measured on (see CELL) — so a route may
 * start anywhere along a zone; the wall openings are drawn from these same numbers.
 *
 * The balcony is a double sliding door (two panels) that fills its exit: 120 cm, 10 cm in from
 * each side of the balcony. That width is read off a photo of the finished shell, not measured.
 */
export const DOOR_ZONES: Record<DoorId, Rect> = {
  entrance: { x0: 220, y0: 640, x1: 300, y1: 720 },
  bathroom: { x0: 155, y0: ROOM.topZone, x1: 225, y1: 240 },
  balcony: { x0: 10, y0: ROOM.topZone, x1: 130, y1: 240 },
};
export const DOOR_IDS: readonly DoorId[] = ['entrance', 'bathroom', 'balcony'];

/**
 * The arrangement drawn in the article's final plan (slides 4 and 7): the bed with its head
 * against the left wall, and down the right wall — from the balcony end to the front door —
 * the table, the fridge (55 deep, so it stands 10 cm proud of the 45 cm units), the kitchen
 * counter and the shelf, end to end.
 */
export const FINAL_PLAN: Layout = {
  bed: { x: 0, y: 310, rot: 0 },
  closet: { x: 0, y: 660, rot: 180 },
  table: { x: 305, y: 160, rot: 90 },
  fridge: { x: 295, y: 460, rot: 90 },
  kitchen: { x: 305, y: 515, rot: 90 },
  shelf: { x: 305, y: 655, rot: 90 },
};

/** Everything fits — and the room does not work. That is the puzzle. */
export const START_LAYOUT: Layout = {
  table: { x: 25, y: 165, rot: 0 },
  bed: { x: 75, y: 330, rot: 0 },
  kitchen: { x: 300, y: 380, rot: 90 },
  fridge: { x: 295, y: 525, rot: 90 },
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

/** How deep the bar drawn along the bed's head is. */
export const HEAD_DEPTH = 10;

/** The bar along the bed's head (the article's plan has it against the left wall); it turns with the bed. */
export function headRectOf(placement: Placement): Rect {
  const f = footprintOf('bed', placement);
  switch (placement.rot) {
    case 0:
      return { x0: f.x0, y0: f.y0, x1: f.x0 + HEAD_DEPTH, y1: f.y1 };
    case 90:
      return { x0: f.x0, y0: f.y0, x1: f.x1, y1: f.y0 + HEAD_DEPTH };
    case 180:
      return { x0: f.x1 - HEAD_DEPTH, y0: f.y0, x1: f.x1, y1: f.y1 };
    case 270:
      return { x0: f.x0, y0: f.y1 - HEAD_DEPTH, x1: f.x1, y1: f.y1 };
  }
}

/** The floor in front of a piece, `depth` cm deep; the front turns clockwise with it (down, left, up, right on the plan). */
export function frontStripOf(id: FrontSpaceId, placement: Placement, depth: number): Rect {
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

/** The space to keep free in front of a piece, as deep as its just-right width. Null for the bed. */
export function frontZoneOf(id: PieceId, placement: Placement): Rect | null {
  return id === 'bed' ? null : frontStripOf(id, placement, SPECS[id].frontDepth);
}

/** The two strips beside the bed's long sides, `depth` cm deep, where you get in and out. */
export function bedStripsAt(placement: Placement, depth: number): [Rect, Rect] {
  const f = footprintOf('bed', placement);
  if (f.x1 - f.x0 >= f.y1 - f.y0) {
    return [
      { x0: f.x0, y0: f.y0 - depth, x1: f.x1, y1: f.y0 },
      { x0: f.x0, y0: f.y1, x1: f.x1, y1: f.y1 + depth },
    ];
  }
  return [
    { x0: f.x0 - depth, y0: f.y0, x1: f.x0, y1: f.y1 },
    { x0: f.x1, y0: f.y0, x1: f.x1 + depth, y1: f.y1 },
  ];
}

/** The strips beside the bed at the width the article asks for (120 cm). */
export const bedStripsOf = (placement: Placement): [Rect, Rect] => bedStripsAt(placement, BED_SIDE);

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

// ── measuring the room each piece leaves ─────────────────────────────────────

/** Beyond this nothing changes: the widest tier ("comfortable") starts at 120 cm. */
export const CLEAR_CAP = 150;

/** A strip of floor is clear when it is inside the living area and no other piece stands on it. */
function isClear(layout: Layout, id: PieceId, strip: Rect): boolean {
  return insideLiving(strip) && PIECE_IDS.every((other) => other === id || !overlaps(strip, footprintOf(other, layout[other])));
}

/**
 * How deep a strip growing out of a piece can get before it meets a wall or another piece, in
 * the 5 cm steps pieces snap to (so the answer is exact). Strips nest, so the first one that is
 * blocked ends the search.
 */
function clearDepth(layout: Layout, id: PieceId, stripAt: (depth: number) => Rect): number {
  let depth = 0;
  while (depth < CLEAR_CAP && isClear(layout, id, stripAt(depth + SNAP))) depth += SNAP;
  return depth;
}

/** How much floor is free in front of a piece with a front, in cm (at most CLEAR_CAP). */
export function clearDepthOf(layout: Layout, id: FrontSpaceId): number {
  return clearDepth(layout, id, (depth) => frontStripOf(id, layout[id], depth));
}

/** How much floor is free beside the bed, on its better long side, in cm (at most CLEAR_CAP). */
export function bedSideClear(layout: Layout): number {
  const side = (which: 0 | 1) => (depth: number) => bedStripsAt(layout.bed, depth)[which];
  return Math.max(clearDepth(layout, 'bed', side(0)), clearDepth(layout, 'bed', side(1)));
}

/** The room beside the bed and in front of each piece with a front. The walkway is measured apart, by evaluateWalk. */
export type Spaces = Record<Exclude<SpaceId, 'walk'>, number>;

/** The pieces that have a front, in the order the rules and the screen list them. */
export const FRONT_IDS: readonly FrontSpaceId[] = ['closet', 'kitchen', 'fridge', 'table', 'shelf'];

/** The space a piece is answerable for: the room beside the bed, the room in front of anything else. */
export const spaceOfPiece = (id: PieceId): Exclude<SpaceId, 'walk'> => (id === 'bed' ? 'bedside' : id);

export function measureSpaces(layout: Layout): Spaces {
  return {
    bedside: bedSideClear(layout),
    closet: clearDepthOf(layout, 'closet'),
    kitchen: clearDepthOf(layout, 'kitchen'),
    fridge: clearDepthOf(layout, 'fridge'),
    table: clearDepthOf(layout, 'table'),
    shelf: clearDepthOf(layout, 'shelf'),
  };
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
  /** How much room each piece really leaves, in cm. */
  spaces: Spaces;
}

export function evaluateFast(layout: Layout): FastEvaluation {
  const footprints = Object.fromEntries(PIECE_IDS.map((id) => [id, footprintOf(id, layout[id])])) as Record<PieceId, Rect>;
  const others = (id: PieceId) => PIECE_IDS.filter((other) => other !== id).map((other) => footprints[other]);
  const spaces = measureSpaces(layout);

  const overlapping = PIECE_IDS.filter((id) => others(id).some((other) => overlaps(footprints[id], other)));
  const blockedDoors = DOOR_IDS.filter((door) => PIECE_IDS.some((id) => overlaps(DOOR_ZONES[door], footprints[id])));
  const cramped = FRONT_IDS.filter((id) => !meetsRequirement(id, spaces[id]));
  const bed = meetsRequirement('bedside', spaces.bedside);

  return {
    fit: overlapping.length === 0,
    doors: blockedDoors.length === 0,
    use: cramped.length === 0,
    bed,
    overlapping,
    blockedDoors,
    cramped,
    spaces,
  };
}

/** A walkway passes when its narrowest point is at least WALK_MIN (see roomStandards.ts for the float epsilon). */
export const walkOk = (width: number): boolean => meetsRequirement('walk', width);

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
