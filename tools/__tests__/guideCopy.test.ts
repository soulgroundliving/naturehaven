import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DOOR_LABEL, PICTURE_LABEL, cm, pageAnnouncement, pageLabel, sqm } from '../../src/components/journal/guide/guideCopy.ts';
import { GUIDE_DRAWN_STAGES } from '../../src/lib/journalGuide.ts';
import { DOOR_IDS, DOOR_ZONES, FINAL_PLAN, ROOM, footprintOf } from '../../src/lib/roomFit.ts';

// The reader describes each drawing in words (PICTURE_LABEL). Those words are written by hand, so these tests hold
// every claim in them to the geometry the drawing is made from: change the final plan and the description fails.

const en = (text: { en: string; th: string }) => text.en;

test('every drawing has a description in both languages, and no stage is left without one', () => {
  for (const stage of GUIDE_DRAWN_STAGES) {
    assert.ok(PICTURE_LABEL[stage].en.length > 30, `${stage} in English`);
    assert.match(PICTURE_LABEL[stage].th, /[฀-๿]/, `${stage} in Thai`);
  }
  assert.deepEqual(Object.keys(PICTURE_LABEL).sort(), [...GUIDE_DRAWN_STAGES].sort());
});

test('the final plan is described as it is drawn: the bed on the left wall, four pieces down the right wall, the closet bottom left', () => {
  const at = (id: keyof typeof FINAL_PLAN) => footprintOf(id, FINAL_PLAN[id]);
  assert.equal(at('bed').x0, 0, 'the bed is against the left wall');
  for (const id of ['table', 'fridge', 'kitchen', 'shelf'] as const) assert.equal(at(id).x1, ROOM.width, `${id} is against the right wall`);
  assert.equal(at('closet').x0, 0, 'the closet is at the left');
  assert.equal(at('closet').y1, ROOM.length, 'the closet is at the bottom');
  const label = en(PICTURE_LABEL.final);
  assert.match(label, /bed against the left wall/);
  assert.match(label, /table, the fridge, the kitchen counter and the shelf down the right wall/);
  assert.match(label, /closet at the bottom left/);
});

test('the plan is described with the room\'s own numbers, and the doors where the plan puts them', () => {
  assert.match(en(PICTURE_LABEL.plan), new RegExp(`${ROOM.width} by ${ROOM.length} centimetres`));
  assert.match(en(PICTURE_LABEL.plan), /25\.2 square metres/);
  assert.equal((ROOM.width * ROOM.length) / 10000, 25.2);
  // "the balcony and the bathroom door at the top, the front door at the bottom right"
  assert.equal(DOOR_ZONES.balcony.y0, ROOM.topZone);
  assert.equal(DOOR_ZONES.bathroom.y0, ROOM.topZone);
  assert.equal(DOOR_ZONES.entrance.y1, ROOM.length);
  assert.ok(DOOR_ZONES.entrance.x0 > ROOM.width / 2, 'the front door is in the right half');
  assert.match(en(PICTURE_LABEL.constraints), /front door at the bottom right/);
  assert.equal(DOOR_IDS.length, 3, 'three doors, as the description says');
});

test('a length and an area print in the reader\'s units, and a page announces itself', () => {
  assert.equal(cm(350, 'en'), '350 cm');
  assert.equal(cm(350, 'th'), '350 ซม.');
  assert.equal(sqm(25.2, 'en'), '25.2 sqm');
  assert.equal(sqm(25.2, 'th'), '25.2 ตร.ม.');
  assert.equal(pageLabel(2, 8), '03 / 08');
  assert.equal(pageAnnouncement(2, 8, 'The Constraints', 'en'), 'Page 3 of 8: The Constraints');
  assert.equal(pageAnnouncement(2, 8, 'ข้อจำกัด', 'th'), 'หน้า 3 จาก 8: ข้อจำกัด');
});

test('each door is labelled short enough to sit beside it, in both languages', () => {
  for (const id of DOOR_IDS) {
    assert.ok(DOOR_LABEL[id].name.en.length <= 12, `${id}: ${DOOR_LABEL[id].name.en}`);
    assert.match(DOOR_LABEL[id].name.th, /[฀-๿]/);
    assert.match(DOOR_LABEL[id].how.th, /[฀-๿]/);
  }
});
