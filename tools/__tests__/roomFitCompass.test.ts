// Which way things face on the plan, in words (src/lib/roomFitCompass.ts). Pure, so it runs on plain Node.
//
// The words must never drift from the picture: a piece said to face east has its front zone on
// the side the compass calls east. So these tests check the words against the geometry.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { FINAL_PLAN, PIECE_IDS, footprintOf, frontZoneOf, headRectOf } from '../../src/lib/roomFit.ts';
import type { Placement } from '../../src/lib/roomFit.ts';
import { COMPASS, frontSide, headSide } from '../../src/lib/roomFitCompass.ts';

const ROTATIONS = [0, 90, 180, 270] as const;

describe('frontSide', () => {
  it('names the side of the piece where its front zone is — for every piece and every turn', () => {
    for (const id of PIECE_IDS) {
      for (const rot of ROTATIONS) {
        const at: Placement = { x: 50, y: 300, rot };
        const zone = frontZoneOf(id, at);
        if (zone === null) continue; // the bed has no front: its head is what it faces
        const f = footprintOf(id, at);
        const touches = { down: zone.y0 === f.y1, up: zone.y1 === f.y0, left: zone.x1 === f.x0, right: zone.x0 === f.x1 };
        assert.ok(touches[frontSide(rot)], `${id} turned to ${rot}`);
      }
    }
  });
});

describe('headSide', () => {
  it('names the side of the bed where its head bar is — for every turn', () => {
    for (const rot of ROTATIONS) {
      const at: Placement = { x: 50, y: 300, rot };
      const f = footprintOf('bed', at);
      const head = headRectOf(at);
      const spansHeight = head.y0 === f.y0 && head.y1 === f.y1;
      const spansWidth = head.x0 === f.x0 && head.x1 === f.x1;
      const touches = {
        left: spansHeight && head.x0 === f.x0,
        right: spansHeight && head.x1 === f.x1,
        up: spansWidth && head.y0 === f.y0,
        down: spansWidth && head.y1 === f.y1,
      };
      assert.ok(touches[headSide(rot)], `bed turned to ${rot}`);
    }
  });
});

describe('COMPASS', () => {
  it('follows the article\'s compass: slide 3 puts S at the top of the plan and N at the bottom', () => {
    assert.equal(COMPASS.up, 'south');
    assert.equal(COMPASS.down, 'north');
  });
  it('then has east on the left of the plan and west on the right (worked out from that, not printed on the slide)', () => {
    assert.equal(COMPASS.left, 'east');
    assert.equal(COMPASS.right, 'west');
  });
});

describe('the final plan, in the compass', () => {
  it('has the bed\'s head to the east, the closet facing south, and the table, kitchen and shelf on the west wall facing east', () => {
    assert.equal(COMPASS[headSide(FINAL_PLAN.bed.rot)], 'east');
    assert.equal(COMPASS[frontSide(FINAL_PLAN.closet.rot)], 'south');
    for (const id of ['table', 'kitchen', 'shelf'] as const) assert.equal(COMPASS[frontSide(FINAL_PLAN[id].rot)], 'east', id);
  });
});
