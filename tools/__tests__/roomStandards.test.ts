// The width standards of the room-arranging game (src/lib/roomStandards.ts): what "tight",
// "minimum", "just right" and "comfortable" mean, in centimetres, for every space the brief asks
// a room to give. Pure data plus one comparison, so it runs on plain Node.
//
// These numbers are published as Nature Haven's working standard, so the tests pin the ones the
// article already states (90 cm to walk, 120 cm beside the bed) and the shape every row must have.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BRIEF_ZONES, SPACE_IDS, SPACE_STANDARDS, TIERS, meetsRequirement, requiredCm, shortOf, tierOf, wholeCm } from '../../src/lib/roomStandards.ts';

describe('SPACE_STANDARDS', () => {
  it('lists every space the game measures once, in reading order: the bed, the walk, then each piece with a front', () => {
    assert.deepEqual([...SPACE_IDS], ['bedside', 'walk', 'closet', 'kitchen', 'fridge', 'table', 'shelf']);
    assert.deepEqual(Object.keys(SPACE_STANDARDS).sort(), [...SPACE_IDS].sort());
  });

  it('has rising thresholds for every space, all on the 5 cm grid the pieces snap to', () => {
    for (const id of SPACE_IDS) {
      const s = SPACE_STANDARDS[id];
      assert.ok(s.minimum > 0 && s.minimum < s.standard && s.standard < s.comfortable, `${id}: ${s.minimum} < ${s.standard} < ${s.comfortable}`);
      for (const cm of [s.minimum, s.standard, s.comfortable]) assert.equal(cm % 5, 0, `${id} ${cm}`);
    }
  });

  it('serves every zone of the article\'s Brief (slide 2): sleeping, working, cooking, wardrobe, entry — and the walk between them', () => {
    const served = new Set(SPACE_IDS.map((id) => SPACE_STANDARDS[id].zone));
    assert.deepEqual([...BRIEF_ZONES].sort(), [...served].sort());
    assert.deepEqual([...BRIEF_ZONES].sort(), ['circulation', 'cooking', 'entry', 'sleeping', 'wardrobe', 'working']);
  });

  it('never asks for "tight" — that is the failing tier', () => {
    for (const id of SPACE_IDS) assert.notEqual(SPACE_STANDARDS[id].required, 'tight', id);
  });
});

describe('the numbers the article already states', () => {
  it('walks at 90 cm: 80 is the least, 90 is just right, 120 is comfortable', () => {
    assert.deepEqual([SPACE_STANDARDS.walk.minimum, SPACE_STANDARDS.walk.standard, SPACE_STANDARDS.walk.comfortable], [80, 90, 120]);
    assert.equal(requiredCm('walk'), 90);
  });
  it('gives the bed 120 cm at its side (slide 4), which is the comfortable tier', () => {
    assert.equal(SPACE_STANDARDS.bedside.required, 'comfortable');
    assert.equal(requiredCm('bedside'), 120);
  });
  it('asks the room in front of each piece for its just-right width', () => {
    assert.deepEqual(
      Object.fromEntries((['closet', 'kitchen', 'fridge', 'table', 'shelf'] as const).map((id) => [id, requiredCm(id)])),
      { closet: 90, kitchen: 90, fridge: 70, table: 70, shelf: 50 },
    );
  });
});

describe('tierOf', () => {
  it('reads a walkway: 79 tight · 80 minimum · 89 minimum · 90 just right · 119 just right · 120 comfortable', () => {
    assert.deepEqual([79, 80, 89, 90, 119, 120, 200].map((cm) => tierOf('walk', cm)), [
      'tight',
      'minimum',
      'minimum',
      'standard',
      'standard',
      'comfortable',
      'comfortable',
    ]);
  });

  it('includes the threshold itself in the tier it opens, for every space', () => {
    for (const id of SPACE_IDS) {
      const s = SPACE_STANDARDS[id];
      assert.equal(tierOf(id, s.minimum), 'minimum', `${id} at ${s.minimum}`);
      assert.equal(tierOf(id, s.standard), 'standard', `${id} at ${s.standard}`);
      assert.equal(tierOf(id, s.comfortable), 'comfortable', `${id} at ${s.comfortable}`);
      assert.equal(tierOf(id, s.minimum - 5), 'tight', `${id} just under ${s.minimum}`);
    }
  });

  it('never gives a lower tier for more room', () => {
    for (const id of SPACE_IDS) {
      let last = 0;
      for (let cm = 0; cm <= 200; cm += 5) {
        const rank = TIERS.indexOf(tierOf(id, cm));
        assert.ok(rank >= last, `${id} at ${cm} cm fell from tier ${last} to ${rank}`);
        last = rank;
      }
    }
  });
});

describe('meetsRequirement', () => {
  it('holds at exactly the required width and not a centimetre under', () => {
    for (const id of SPACE_IDS) {
      assert.equal(meetsRequirement(id, requiredCm(id)), true, id);
      assert.equal(meetsRequirement(id, requiredCm(id) - 1), false, id);
    }
  });
  it('shrugs off float noise on a measured walkway (89.9999999999 is 90)', () => {
    assert.equal(meetsRequirement('walk', 90 - 1e-12), true);
  });

  it('never disagrees with the tier: a space meets the game exactly when its tier is at least the required one', () => {
    for (const id of SPACE_IDS) {
      const needed = TIERS.indexOf(SPACE_STANDARDS[id].required);
      for (let cm = 0; cm <= 200; cm += 0.37) {
        assert.equal(TIERS.indexOf(tierOf(id, cm)) >= needed, meetsRequirement(id, cm), `${id} at ${cm} cm`);
      }
      // ...including the float noise a measured walkway carries
      const threshold = requiredCm(id);
      assert.equal(TIERS.indexOf(tierOf(id, threshold - 1e-12)) >= needed, true, `${id} just under ${threshold}`);
    }
  });
});

describe('tierOf and float noise', () => {
  it('puts 89.9999999999 in the tier that starts at 90, the same way the rule does', () => {
    assert.equal(tierOf('walk', 90 - 1e-12), 'standard');
    assert.equal(tierOf('walk', 120 - 1e-12), 'comfortable');
    assert.equal(tierOf('walk', 80 - 1e-12), 'minimum');
  });
});

describe('shortOf', () => {
  it('says what a space still needs, and nothing once the game is satisfied', () => {
    assert.equal(shortOf('walk', 85), 90);
    assert.equal(shortOf('walk', 90), null);
    assert.equal(shortOf('closet', 5), 90);
    assert.equal(shortOf('fridge', 70), null);
  });

  it('is what tells beside-the-bed apart: "just right" (90) is still short of the 120 the game asks for there', () => {
    assert.equal(tierOf('bedside', 105), 'standard');
    assert.equal(shortOf('bedside', 105), 120);
    assert.equal(shortOf('bedside', 120), null);
  });
});

// The public note sets two of our widths beside published guidance. Those sentences are copy, so the
// numbers they lean on are pinned here: change a threshold and this fails before the note goes wrong.
describe('the published-guidance comparisons in the public note', () => {
  it('holds for the walkway: our 90 and 80 sit at or just under the ADA route (91) and its short narrowing (81)', () => {
    assert.ok(SPACE_STANDARDS.walk.standard <= 91 && SPACE_STANDARDS.walk.standard >= 85);
    assert.ok(SPACE_STANDARDS.walk.minimum <= 81 && SPACE_STANDARDS.walk.minimum >= 75);
  });

  it('holds for the kitchen: the one-cook aisle (107) sits BETWEEN our just-right and our comfortable', () => {
    assert.ok(SPACE_STANDARDS.kitchen.standard < 107 && 107 < SPACE_STANDARDS.kitchen.comfortable);
  });
});

// The walkway is the one width that is not a multiple of 5: squeezing between two corners it is a
// diagonal (a 65 x 65 gap is 91.92 cm). What the screen prints must never say "90" for a width that fails.
describe('wholeCm', () => {
  it('leaves a whole width alone', () => {
    for (const cm of [0, 5, 85, 90, 95, 150]) assert.equal(wholeCm(cm), cm);
  });

  it('rounds a diagonal gap DOWN, so a width that falls short never reads as one that meets the standard', () => {
    assert.equal(wholeCm(89.6), 89);
    assert.equal(meetsRequirement('walk', 89.6), false);
    assert.equal(wholeCm(Math.hypot(65, 65)), 91);
    assert.equal(wholeCm(64.03124237432849), 64);
  });

  it('shrugs off float noise the same way meetsRequirement does (89.9999999999 is 90)', () => {
    assert.equal(wholeCm(90 - 1e-12), 90);
    assert.equal(meetsRequirement('walk', 90 - 1e-12), true);
  });

  it('never prints a number that contradicts the verdict, at any width and in every space', () => {
    for (const id of SPACE_IDS) {
      for (let cm = 0; cm <= 200; cm += 0.37) {
        assert.equal(wholeCm(cm) >= requiredCm(id), meetsRequirement(id, cm), `${id} at ${cm} cm`);
      }
    }
  });
});
