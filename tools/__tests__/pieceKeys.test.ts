// What a key press means for the piece that has focus in the room-arranging game
// (src/components/journal/interactive/room-fit/pieceKeys.ts). Pure, so it runs on plain Node.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { KEY_STEP, KEY_STEP_BIG, keyAction } from '../../src/components/journal/interactive/room-fit/pieceKeys.ts';

const press = (key: string, options: Partial<{ code: string; shiftKey: boolean; ctrlKey: boolean; metaKey: boolean; altKey: boolean }> = {}) =>
  keyAction({ key, code: options.code ?? '', shiftKey: false, ctrlKey: false, metaKey: false, altKey: false, ...options });

describe('keyAction', () => {
  it('moves a piece 5 cm per arrow key, and 25 cm with Shift', () => {
    assert.deepEqual(press('ArrowLeft'), { type: 'nudge', dx: -KEY_STEP, dy: 0 });
    assert.deepEqual(press('ArrowRight'), { type: 'nudge', dx: KEY_STEP, dy: 0 });
    assert.deepEqual(press('ArrowUp'), { type: 'nudge', dx: 0, dy: -KEY_STEP });
    assert.deepEqual(press('ArrowDown'), { type: 'nudge', dx: 0, dy: KEY_STEP });
    assert.deepEqual(press('ArrowDown', { shiftKey: true }), { type: 'nudge', dx: 0, dy: KEY_STEP_BIG });
    assert.equal(KEY_STEP, 5);
    assert.equal(KEY_STEP_BIG, 25);
  });

  it('turns a piece on R, in either case', () => {
    assert.deepEqual(press('r', { code: 'KeyR' }), { type: 'rotate' });
    assert.deepEqual(press('R', { code: 'KeyR', shiftKey: true }), { type: 'rotate' });
  });

  it('turns a piece from a Thai keyboard: the physical R key types พ, so the printed letter alone would miss it', () => {
    assert.deepEqual(press('พ', { code: 'KeyR' }), { type: 'rotate' });
  });

  it('still turns a piece when the printed R is on another physical key (Dvorak)', () => {
    assert.deepEqual(press('r', { code: 'KeyK' }), { type: 'rotate' });
  });

  it('leaves browser and system shortcuts alone: Ctrl or Cmd+R reload, Alt or Cmd+Arrow navigate', () => {
    assert.equal(press('r', { code: 'KeyR', ctrlKey: true }), null);
    assert.equal(press('r', { code: 'KeyR', metaKey: true }), null);
    assert.equal(press('ArrowLeft', { altKey: true }), null);
    assert.equal(press('ArrowLeft', { metaKey: true }), null);
    assert.equal(press('ArrowRight', { ctrlKey: true }), null);
  });

  it('ignores every other key, including names that exist on every object', () => {
    for (const key of ['Enter', ' ', 'Tab', 'a', 'Escape', 'toString', 'constructor', '__proto__', 'hasOwnProperty']) {
      assert.equal(press(key, { code: key === 'a' ? 'KeyA' : '' }), null, key);
    }
  });
});
