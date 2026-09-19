// Unit tests for the room-arranging game's rules (src/lib/roomFit*.ts).
//
// The game answers questions a visitor will trust — "is my walkway 90 cm?",
// "is the door blocked?" — so the geometry has to be right, not approximately
// right. Written before the implementation; run with `npm run test:journal`.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  BED_SIDE,
  DOOR_ZONES,
  FINAL_PLAN,
  LIVING,
  PIECE_IDS,
  SNAP,
  START_LAYOUT,
  WALK_MIN,
  bedStripsOf,
  clampPlacement,
  evaluate,
  evaluateFast,
  evaluateWalk,
  footprintOf,
  frontZoneOf,
  movePiece,
  nudgePiece,
  overlaps,
  rotatePiece,
  snap,
  walkOk,
} from '../../src/lib/roomFit.ts';
import type { Layout, PieceId, Placement } from '../../src/lib/roomFit.ts';
import { CELL, widestRoutes } from '../../src/lib/roomFitRoute.ts';
import type { Rect } from '../../src/lib/roomFitRoute.ts';

const place = (x: number, y: number, rot: Placement['rot'] = 0): Placement => ({ x, y, rot });
const withPiece = (layout: Layout, id: PieceId, placement: Placement): Layout => ({ ...layout, [id]: placement });
const inside = (r: Rect) => r.x0 >= LIVING.x0 && r.y0 >= LIVING.y0 && r.x1 <= LIVING.x1 && r.y1 <= LIVING.y1;

describe('snap', () => {
  it('rounds to the 5 cm grid', () => {
    assert.equal(snap(12), 10);
    assert.equal(snap(13), 15);
    assert.equal(snap(-7), -5);
    assert.equal(snap(0), 0);
  });
});

describe('overlaps', () => {
  const a: Rect = { x0: 0, y0: 0, x1: 10, y1: 10 };
  it('is false for rectangles that only touch', () => {
    assert.equal(overlaps(a, { x0: 10, y0: 0, x1: 20, y1: 10 }), false);
    assert.equal(overlaps(a, { x0: 0, y0: 10, x1: 10, y1: 20 }), false);
  });
  it('is true when interiors intersect', () => {
    assert.equal(overlaps(a, { x0: 9, y0: 9, x1: 20, y1: 20 }), true);
    assert.equal(overlaps(a, { x0: 2, y0: 2, x1: 3, y1: 3 }), true);
  });
});

describe('footprintOf', () => {
  it('uses the real sizes from the article, swapping width and depth at 90 and 270 degrees', () => {
    assert.deepEqual(footprintOf('bed', place(0, 310, 0)), { x0: 0, y0: 310, x1: 200, y1: 470 });
    assert.deepEqual(footprintOf('bed', place(0, 310, 90)), { x0: 0, y0: 310, x1: 160, y1: 510 });
    assert.deepEqual(footprintOf('bed', place(0, 310, 180)), { x0: 0, y0: 310, x1: 200, y1: 470 });
    assert.deepEqual(footprintOf('table', place(305, 160, 90)), { x0: 305, y0: 160, x1: 350, y1: 460 });
    assert.deepEqual(footprintOf('kitchen', place(0, 0, 0)), { x0: 0, y0: 0, x1: 195, y1: 45 });
  });
});

describe('frontZoneOf', () => {
  it('extends from the front edge, and the front turns clockwise with the piece', () => {
    const at = (rot: Placement['rot']) => frontZoneOf('closet', place(100, 300, rot));
    assert.deepEqual(at(0), { x0: 100, y0: 360, x1: 250, y1: 420 }); // south
    assert.deepEqual(at(90), { x0: 40, y0: 300, x1: 100, y1: 450 }); // west (footprint 60 x 150)
    assert.deepEqual(at(180), { x0: 100, y0: 240, x1: 250, y1: 300 }); // north
    assert.deepEqual(at(270), { x0: 160, y0: 300, x1: 220, y1: 450 }); // east
  });
  it('uses each piece\'s own depth', () => {
    const depth = (id: PieceId) => {
      const zone = frontZoneOf(id, place(100, 300, 0))!;
      return zone.y1 - zone.y0;
    };
    assert.equal(depth('kitchen'), 90);
    assert.equal(depth('table'), 70);
    assert.equal(depth('shelf'), 50);
  });
  it('has none for the bed, which is checked by its long sides instead', () => {
    assert.equal(frontZoneOf('bed', place(0, 310, 0)), null);
  });
});

describe('bedStripsOf', () => {
  it('lies along the two long sides, 120 cm deep, whichever way the bed points', () => {
    const horizontal = bedStripsOf(place(0, 310, 0));
    assert.deepEqual(horizontal, [
      { x0: 0, y0: 310 - BED_SIDE, x1: 200, y1: 310 },
      { x0: 0, y0: 470, x1: 200, y1: 470 + BED_SIDE },
    ]);
    const vertical = bedStripsOf(place(100, 300, 90));
    assert.deepEqual(vertical, [
      { x0: 100 - BED_SIDE, y0: 300, x1: 100, y1: 500 },
      { x0: 260, y0: 300, x1: 260 + BED_SIDE, y1: 500 },
    ]);
  });
});

describe('clampPlacement', () => {
  it('keeps a footprint inside the living area', () => {
    const c = (x: number, y: number) => clampPlacement('bed', place(x, y, 0));
    assert.deepEqual(c(-40, 100), place(0, 160));
    assert.deepEqual(c(500, 900), place(150, 560)); // 350 - 200, 720 - 160
    assert.deepEqual(c(75, 330), place(75, 330));
  });
});

describe('movePiece / nudgePiece', () => {
  it('snaps to 5 cm, clamps to the room, and never mutates the layout it was given', () => {
    const before = structuredClone(FINAL_PLAN);
    const moved = movePiece(FINAL_PLAN, 'bed', 83, 402);
    assert.deepEqual(moved.bed, place(85, 400, 0));
    assert.deepEqual(FINAL_PLAN, before);
    assert.equal(moved.closet, FINAL_PLAN.closet); // other pieces are the same objects
    assert.deepEqual(movePiece(FINAL_PLAN, 'bed', -300, 5000).bed, place(0, 560, 0));
  });
  it('nudges by a relative amount', () => {
    assert.deepEqual(nudgePiece(FINAL_PLAN, 'bed', 5, -5).bed, place(5, 305, 0));
    assert.deepEqual(nudgePiece(FINAL_PLAN, 'bed', -100, 0).bed, place(0, 310, 0)); // held at the wall
  });
});

describe('rotatePiece', () => {
  it('turns a piece 90 degrees clockwise about its centre', () => {
    const start = withPiece(FINAL_PLAN, 'bed', place(75, 330, 0)); // centre (175, 410)
    const turned = rotatePiece(start, 'bed').bed;
    assert.deepEqual(turned, place(95, 310, 90));
    assert.deepEqual(footprintOf('bed', turned), { x0: 95, y0: 310, x1: 255, y1: 510 });
  });
  it('returns to the start after four turns', () => {
    let layout = withPiece(FINAL_PLAN, 'bed', place(75, 330, 0));
    for (let i = 0; i < 4; i += 1) layout = rotatePiece(layout, 'bed');
    assert.deepEqual(layout.bed, place(75, 330, 0));
  });
  it('is a true quarter turn for EVERY piece: two turns keep the footprint, four keep the placement', () => {
    // The table and the shelf differ from a whole number of 5 cm cells by half a cell, so their
    // turns must round consistently — else every full circle walks the piece 10 cm across the floor.
    // Spots are chosen well away from the walls: squeezing a turn back into the room is a different matter.
    const turn = (layout: Layout, id: PieceId, times: number) => {
      let next = layout;
      for (let i = 0; i < times; i += 1) next = rotatePiece(next, id);
      return next;
    };
    let checked = 0;
    for (const id of PIECE_IDS) {
      const spec = footprintOf(id, place(0, 0, 0));
      const reach = Math.max(spec.x1 - spec.x0, spec.y1 - spec.y0) / 2 + SNAP; // how far the piece can swing from its centre
      for (const cx of [LIVING.x0 + reach, 175, LIVING.x1 - reach]) {
        for (const cy of [LIVING.y0 + reach, 440, LIVING.y1 - reach]) {
          for (const rot of [0, 90, 180, 270] as const) {
            const size = footprintOf(id, place(0, 0, rot));
            const at = place(snap(cx - (size.x1 - size.x0) / 2), snap(cy - (size.y1 - size.y0) / 2), rot);
            const layout = withPiece(FINAL_PLAN, id, at);
            const label = `${id} at (${at.x}, ${at.y}) facing ${rot}`;
            assert.deepEqual(footprintOf(id, turn(layout, id, 2)[id]), footprintOf(id, at), `${label}: two turns`);
            assert.deepEqual(turn(layout, id, 4)[id], at, `${label}: four turns`);
            const once = footprintOf(id, turn(layout, id, 1)[id]);
            const before = footprintOf(id, at);
            assert.ok(Math.abs((once.x0 + once.x1) / 2 - (before.x0 + before.x1) / 2) <= SNAP / 2, `${label}: one turn moved the centre sideways`);
            assert.ok(Math.abs((once.y0 + once.y1) / 2 - (before.y0 + before.y1) / 2) <= SNAP / 2, `${label}: one turn moved the centre up or down`);
            checked += 1;
          }
        }
      }
    }
    assert.equal(checked, PIECE_IDS.length * 3 * 3 * 4);
  });
  it('wraps the rotation and never lets the piece leave the room', () => {
    let layout = START_LAYOUT;
    for (const id of PIECE_IDS) {
      for (let i = 0; i < 5; i += 1) {
        layout = rotatePiece(layout, id);
        assert.ok(inside(footprintOf(id, layout[id])), `${id} after ${i + 1} turns`);
        assert.ok([0, 90, 180, 270].includes(layout[id].rot));
      }
    }
  });
});

describe('random play never breaks the rules of the board', () => {
  it('stays on the 5 cm grid and inside the room after any sequence of moves and turns', () => {
    let seed = 20260920;
    const next = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    let layout: Layout = START_LAYOUT;
    for (let step = 0; step < 400; step += 1) {
      const id = PIECE_IDS[Math.floor(next() * PIECE_IDS.length)];
      layout = next() < 0.3 ? rotatePiece(layout, id) : movePiece(layout, id, next() * 500 - 50, next() * 900);
      const p = layout[id];
      assert.ok(inside(footprintOf(id, p)), `${id} left the room at step ${step}`);
      assert.equal(p.x % 5, 0);
      assert.equal(p.y % 5, 0);
    }
  });
});

describe('the article\'s final plan', () => {
  it('is exactly the arrangement documented in the design: bed at the left wall, three units filling the right wall', () => {
    assert.deepEqual(FINAL_PLAN.bed, place(0, 310, 0));
    assert.deepEqual(FINAL_PLAN.table, place(305, 160, 90));
    assert.deepEqual(FINAL_PLAN.shelf, place(305, 460, 90));
    assert.deepEqual(FINAL_PLAN.kitchen, place(305, 520, 90));
    assert.deepEqual(FINAL_PLAN.closet, place(0, 660, 180));
    // 300 + 60 + 195 = 555 of the 560 cm along the right wall
    assert.equal(footprintOf('kitchen', FINAL_PLAN.kitchen).y1, 715);
  });
  it('fits, and every piece is inside the living area', () => {
    for (const id of PIECE_IDS) assert.ok(inside(footprintOf(id, FINAL_PLAN[id])), id);
  });
});

describe('evaluateFast', () => {
  it('passes every quick rule for the final plan', () => {
    const r = evaluateFast(FINAL_PLAN);
    assert.deepEqual(r.overlapping, []);
    assert.deepEqual(r.blockedDoors, []);
    assert.deepEqual(r.cramped, []);
    assert.equal(r.bed, true);
    assert.deepEqual([r.fit, r.doors, r.use, r.bed], [true, true, true, true]);
  });

  it('starts the puzzle with everything fitting but the room not working', () => {
    const r = evaluateFast(START_LAYOUT);
    assert.equal(r.fit, true);
    assert.equal(r.bed, true);
    assert.equal(r.doors, false);
    assert.equal(r.use, false);
    assert.deepEqual([...r.blockedDoors].sort(), ['balcony', 'bathroom']);
    assert.deepEqual([...r.cramped].sort(), ['closet', 'kitchen']);
  });

  it('reports overlapping pieces, both of them', () => {
    const r = evaluateFast(withPiece(FINAL_PLAN, 'shelf', place(50, 350, 0)));
    assert.equal(r.fit, false);
    assert.deepEqual([...r.overlapping].sort(), ['bed', 'shelf']);
  });

  it('reports a blocked entrance', () => {
    const r = evaluateFast(withPiece(FINAL_PLAN, 'shelf', place(230, 660, 0)));
    assert.equal(r.doors, false);
    assert.deepEqual(r.blockedDoors, ['entrance']);
  });

  it('counts a piece as cramped when its front faces a wall', () => {
    const r = evaluateFast(withPiece(FINAL_PLAN, 'closet', place(0, 660, 0))); // front turned to the bottom wall
    assert.deepEqual(r.cramped, ['closet']);
    assert.equal(r.use, false);
  });

  it('counts a piece as cramped when another piece stands in its front zone', () => {
    // The bed pushed against the right wall sits in the front zone of the table (and the shelf) beside it.
    const r = evaluateFast(withPiece(FINAL_PLAN, 'bed', place(150, 310, 0)));
    assert.ok(r.cramped.includes('table'), JSON.stringify(r.cramped));
    assert.ok(r.cramped.includes('shelf'), JSON.stringify(r.cramped));
    assert.ok(!r.cramped.includes('closet'));
  });

  it('needs 120 cm free beside the bed on at least one long side', () => {
    const boxed = withPiece(withPiece(FINAL_PLAN, 'shelf', place(0, 250, 0)), 'closet', place(0, 470, 0));
    assert.equal(evaluateFast(boxed).bed, false);
    const oneSide = withPiece(FINAL_PLAN, 'shelf', place(0, 250, 0));
    assert.equal(evaluateFast(oneSide).bed, true); // the south side is still free
  });

  it('checks the long sides of a bed turned to point up the room', () => {
    const layout = withPiece(FINAL_PLAN, 'bed', place(120, 300, 90));
    const strips = bedStripsOf(layout.bed);
    assert.equal(strips.length, 2);
    assert.ok(strips[0].x1 - strips[0].x0 === BED_SIDE);
  });
});

describe('widestRoutes', () => {
  const area: Rect = { x0: 0, y0: 0, x1: 200, y1: 400 };
  const from: Rect = { x0: 60, y0: 320, x1: 140, y1: 400 };
  const targets = { top: { x0: 60, y0: 0, x1: 140, y1: 80 } };
  // Two blocks forming a vertical corridor of the given width across the middle of the room.
  const corridor = (gap: number): Rect[] => [
    { x0: 0, y0: 100, x1: 100 - gap / 2, y1: 300 },
    { x0: 100 + gap / 2, y0: 100, x1: 200, y1: 300 },
  ];
  const measured = (gap: number) => widestRoutes(area, corridor(gap), from, targets).top.width;

  it('measures a corridor exactly when its edges sit on the 5 cm grid the pieces snap to', () => {
    for (const gap of [5, 45, 85, 90, 95, 100, 120]) {
      assert.equal(measured(gap), gap, `a ${gap} cm gap`);
    }
  });

  it('measures a gap between two walls, not only between two pieces', () => {
    const tight: Rect[] = [{ x0: 90, y0: 100, x1: 200, y1: 300 }]; // a block, leaving 90 cm beside the left wall
    assert.equal(widestRoutes(area, tight, from, targets).top.width, 90);
  });

  it('tells 90 cm from 85 cm', () => {
    assert.equal(walkOk(measured(90)), true);
    assert.equal(walkOk(measured(85)), false);
    assert.equal(walkOk(measured(95)), true);
    assert.equal(WALK_MIN, 90);
  });

  it('samples on a lattice of CELL cm, so a gap edge to edge has a sample exactly in its middle', () => {
    assert.equal(CELL, 2.5);
    assert.equal(measured(5), 5); // one sample fits in a 5 cm gap — and only if it is in the middle
  });

  it('reports zero, and no path, when the way is shut', () => {
    const shut: Rect[] = [{ x0: 0, y0: 100, x1: 200, y1: 300 }];
    const route = widestRoutes(area, shut, from, targets).top;
    assert.equal(route.width, 0);
    assert.deepEqual(route.path, []);
  });

  it('returns a path that runs from the start zone to the target zone', () => {
    const route = widestRoutes(area, corridor(100), from, targets).top;
    assert.ok(route.path.length > 5);
    const first = route.path[0];
    const last = route.path[route.path.length - 1];
    assert.ok(first.y >= from.y0 && first.y <= from.y1);
    assert.ok(last.y >= targets.top.y0 && last.y <= targets.top.y1);
  });

  it('draws a direct route, not a wandering one, when many routes are equally wide', () => {
    // An empty room: every route through the middle is as wide as any other, so only
    // the shortest-path pass keeps the line from meandering across the floor.
    const route = widestRoutes(area, [], from, targets).top;
    const length = route.path.slice(1).reduce((sum, p, i) => sum + Math.hypot(p.x - route.path[i].x, p.y - route.path[i].y), 0);
    const first = route.path[0];
    const last = route.path[route.path.length - 1];
    const straight = Math.hypot(last.x - first.x, last.y - first.y);
    assert.ok(length <= straight * 1.15 + 10, `route ${Math.round(length)} cm for a ${Math.round(straight)} cm gap`);
  });

  it('keeps the route inside the wide part of the room, never squeezing through a narrow gap it could avoid', () => {
    // An 80 cm corridor next to a 30 cm one: the route must take the wide one.
    const both: Rect[] = [
      { x0: 0, y0: 100, x1: 40, y1: 300 },
      { x0: 120, y0: 100, x1: 130, y1: 300 }, // corridor A: 40..120 = 80 cm wide
      { x0: 160, y0: 100, x1: 200, y1: 300 }, // corridor B: 130..160 = 30 cm — too tight
    ];
    const route = widestRoutes(area, both, from, targets).top;
    assert.equal(route.width, 80);
    const crossing = route.path.filter((p) => p.y > 110 && p.y < 290);
    assert.ok(crossing.length > 0 && crossing.every((p) => p.x > 40 && p.x < 120), 'the route did not use the 80 cm corridor');
  });

  it('answers several targets from one search', () => {
    const many = widestRoutes(area, [], from, { a: targets.top, b: { x0: 0, y0: 160, x1: 40, y1: 240 } });
    assert.ok(many.a.width > 0 && many.b.width > 0);
  });
});

describe('evaluateWalk', () => {
  it('finds the final plan comfortably walkable, with a route to each door', () => {
    const w = evaluateWalk(FINAL_PLAN);
    assert.equal(w.ok, true);
    // The narrowest point is the strip between the bed (its right edge, x = 200) and the
    // row of units (x = 305): 105 cm. What the game prints must be what a tape measure says.
    assert.equal(w.width, 105);
    assert.ok(w.toBathroom.path.length > 0 && w.toBalcony.path.length > 0);
  });

  it('finds the starting layout too cramped', () => {
    const w = evaluateWalk(START_LAYOUT);
    assert.equal(w.ok, false);
    assert.ok(w.width < WALK_MIN);
  });

  it('is too narrow when the bed sits in the middle of the room', () => {
    // Bed from 75 to 275: 75 cm on the left, 30 cm on the right — passable, but not by 90 cm.
    const w = evaluateWalk(withPiece(FINAL_PLAN, 'bed', place(75, 310, 0)));
    assert.equal(w.ok, false);
    assert.equal(w.width, 75);
  });

  it('still finds the open side when only one way is narrow', () => {
    // Bed from 100 to 300: the right side is 5 cm, but the left side is a full 100 cm.
    const w = evaluateWalk(withPiece(FINAL_PLAN, 'bed', place(100, 310, 0)));
    assert.equal(w.ok, true);
    assert.equal(w.width, 100);
  });

  it('stays cheap enough to run each time a piece comes to rest', () => {
    // About 12-25 ms on a laptop; a phone is 4-6x slower and the game only runs it on a pause, so a
    // several-fold slowdown here is what would make that pause feel like a freeze.
    evaluateWalk(FINAL_PLAN); // warm the JIT: the first call is the slow one
    const started = Date.now();
    for (let i = 0; i < 5; i += 1) evaluateWalk(FINAL_PLAN);
    assert.ok((Date.now() - started) / 5 < 80, 'a walk evaluation took over 80 ms');
  });
});

describe('evaluate', () => {
  it('scores the final plan 5 of 5 and the start 2 of 5', () => {
    const win = evaluate(FINAL_PLAN);
    assert.equal(win.passed, 5);
    assert.equal(win.won, true);
    const start = evaluate(START_LAYOUT);
    assert.equal(start.passed, 2);
    assert.equal(start.won, false);
  });

  it('is deterministic', () => {
    assert.deepEqual(evaluate(FINAL_PLAN), evaluate(FINAL_PLAN));
  });

  it('keeps the door zones where the drawing puts them', () => {
    assert.deepEqual(DOOR_ZONES.entrance, { x0: 220, y0: 640, x1: 300, y1: 720 }); // an 80 cm door
    assert.equal(DOOR_ZONES.bathroom.y0, LIVING.y0);
    assert.equal(DOOR_ZONES.balcony.y0, LIVING.y0);
  });

  it('puts every door-zone edge on the lattice the walkway is measured on', () => {
    // A route may start anywhere along a zone; an edge between two samples would silently shave up to
    // one cell off a walkway whose narrowest point sits right there.
    for (const [door, zone] of Object.entries(DOOR_ZONES)) {
      for (const edge of [zone.x0, zone.y0, zone.x1, zone.y1]) assert.equal(edge % CELL, 0, `${door} zone edge ${edge}`);
    }
  });

  it('lets a route start at the very left of the front door zone', () => {
    // A 90 cm corridor whose centre line, x = 220, is the zone's left edge: reads 90 only if a route may start there.
    const blocks: Rect[] = [
      { x0: 0, y0: 560, x1: 175, y1: 720 },
      { x0: 265, y0: 560, x1: 350, y1: 720 },
    ];
    const routes = widestRoutes(LIVING, blocks, DOOR_ZONES.entrance, { bathroom: DOOR_ZONES.bathroom });
    assert.equal(routes.bathroom.width, 90);
  });
});
