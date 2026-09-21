// The doors of the room-arranging game (src/lib/roomFitDoors.ts), as the owner's plan draws them:
// the front door swings OUT to the corridor, the bathroom door swings INTO the bathroom, the
// balcony is a double sliding door. The claim worth pinning is the one that shapes the game: no
// door swings into the living area, so an open door never takes floor from the furniture.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { DOOR_IDS, DOOR_ZONES, LIVING, ROOM } from '../../src/lib/roomFit.ts';
import { DOOR_SPECS, closedLeafTip, doorWidth, hingeOf, openLeafTip, swingSweep } from '../../src/lib/roomFitDoors.ts';

describe('the doors as the plan draws them', () => {
  it('opens each door in the wall exactly where the rules keep the floor in front of it clear', () => {
    for (const id of DOOR_IDS) {
      assert.equal(DOOR_SPECS[id].x0, DOOR_ZONES[id].x0, id);
      assert.equal(DOOR_SPECS[id].x1, DOOR_ZONES[id].x1, id);
    }
  });

  it('makes the front door swing out, the bathroom door swing into the bathroom, and the balcony slide', () => {
    assert.deepEqual([DOOR_SPECS.entrance.kind, DOOR_SPECS.bathroom.kind, DOOR_SPECS.balcony.kind], ['swing', 'swing', 'slide']);
    assert.deepEqual(DOOR_SPECS.entrance.swing, { x: 0, y: 1 }); // down the plan = out of the room, to the corridor
    assert.deepEqual(DOOR_SPECS.bathroom.swing, { x: 0, y: -1 }); // up the plan = into the bathroom
    assert.equal(DOOR_SPECS.balcony.swing, null);
  });

  it('hangs each swinging door on its left jamb, and stands the open leaf square to the wall', () => {
    assert.deepEqual(hingeOf('entrance'), { x: 220, y: ROOM.length });
    assert.deepEqual(closedLeafTip('entrance'), { x: 300, y: ROOM.length });
    assert.deepEqual(openLeafTip('entrance'), { x: 220, y: ROOM.length + 80 });
    assert.deepEqual(hingeOf('bathroom'), { x: 155, y: ROOM.topZone });
    assert.deepEqual(closedLeafTip('bathroom'), { x: 225, y: ROOM.topZone });
    assert.deepEqual(openLeafTip('bathroom'), { x: 155, y: ROOM.topZone - 70 });
  });

  it('sizes the doors: 80 cm at the front, 70 in the bathroom, and 120 — a double slider — filling the balcony exit', () => {
    assert.deepEqual(DOOR_IDS.map(doorWidth), [80, 70, 120]);
  });

  it('gives the sliding door no leaf to swing and no floor to sweep', () => {
    assert.equal(hingeOf('balcony'), null);
    assert.equal(openLeafTip('balcony'), null);
    assert.deepEqual(swingSweep('balcony'), []);
  });

  it('never sweeps floor inside the living area: an open door takes nothing from the furniture', () => {
    for (const id of DOOR_IDS) {
      for (const p of swingSweep(id)) {
        const inside = p.x > LIVING.x0 && p.x < LIVING.x1 && p.y > LIVING.y0 && p.y < LIVING.y1;
        assert.equal(inside, false, `${id} sweeps (${p.x.toFixed(1)}, ${p.y.toFixed(1)}) inside the living area`);
      }
    }
  });

  it('keeps the bathroom door\'s swing inside the bathroom, and the front door\'s outside the room', () => {
    for (const p of swingSweep('bathroom')) {
      assert.ok(p.x >= ROOM.balconyWidth && p.x <= ROOM.width && p.y >= 0 && p.y <= ROOM.topZone, `bathroom door sweeps (${p.x.toFixed(1)}, ${p.y.toFixed(1)})`);
    }
    for (const p of swingSweep('entrance')) assert.ok(p.y >= ROOM.length, `front door sweeps (${p.x.toFixed(1)}, ${p.y.toFixed(1)}) inside the room`);
  });

  it('sweeps the whole fan from shut to open, out to the full width of the leaf', () => {
    const sweep = swingSweep('bathroom');
    assert.ok(sweep.length > 50);
    const farthest = Math.max(...sweep.map((p) => Math.hypot(p.x - 155, p.y - ROOM.topZone)));
    assert.ok(Math.abs(farthest - 70) < 1e-6, String(farthest));
  });
});
