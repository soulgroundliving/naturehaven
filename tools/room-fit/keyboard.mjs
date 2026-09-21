// Section 3 — the keyboard and the on-screen buttons: arrows, Shift, R (also from a Thai layout), the arrow pad with press-and-hold.
import { LIVING } from '../../src/lib/roomFit.ts';
import { sleep } from '../lib/dev-harness.mjs';

export default async function run({ check, driver }) {
  const { browser, sameSpot, openArticle, readGame, pieceOf, settle, showBoard, startGame, scrollOf, focusPiece } = driver;

  // ── 3. keyboard and on-screen buttons ───────────────────────────────────────
  const keys = await openArticle();
  const kp = keys.page;
  await startGame(kp);

  const idle = await kp.evaluate(() => ({
    disabled: [...document.querySelectorAll('[data-action^="nudge"], [data-action="rotate"]')].map((b) => b.disabled),
    hint: document.querySelector('[data-testid="room-fit-controls"] p').textContent.trim(),
  }));
  check('with nothing selected the five buttons are off and the hint says how to begin', idle.disabled.length === 5 && idle.disabled.every(Boolean) && idle.hint === 'Select a piece to move it.', JSON.stringify(idle));

  const a11y = await kp.evaluate(() => {
    const pieces = [...document.querySelectorAll('[data-piece]')];
    return {
      count: pieces.length,
      buttons: pieces.every((g) => g.getAttribute('role') === 'button' && g.tabIndex === 0),
      // Enter and Space do nothing on a piece, so it must not announce itself as a plain button.
      described: pieces.every((g) => g.getAttribute('aria-roledescription') === 'movable piece'),
      // where it is, which way it faces (or where the bed's head is), and how big
      labelled: pieces.every((g) => /cm from the left wall.*(Faces|Head towards) .*\d+×\d+$/.test(g.getAttribute('aria-label') ?? '')),
      board: document.querySelector('svg[role="group"]')?.getAttribute('aria-label'),
      live: document.querySelector('[data-testid="room-fit-progress"]').getAttribute('aria-live'),
      announcer: document.querySelector('[data-testid="room-fit-announce"]')?.getAttribute('aria-live'),
    };
  });
  check(
    'every piece is a focusable "movable piece" that says where it is and how big; the board is named; progress and moves are announced',
    a11y.count === 6 && a11y.buttons && a11y.described && a11y.labelled && a11y.board === 'Plan of the 25.2 sqm room, in centimetres' && a11y.live === 'polite' && a11y.announcer === 'polite',
    JSON.stringify(a11y),
  );

  await showBoard(kp);
  await focusPiece(kp, 'shelf');
  const focused = await readGame(kp);
  const selectedName = await kp.$eval('[data-testid="room-fit-selected-name"]', (el) => el.textContent.trim());
  check('focusing a piece selects it and the controls name it', focused.selected === 'shelf' && selectedName === 'Shelf 60×45', JSON.stringify({ selected: focused.selected, selectedName }));
  const readSelected = () =>
    kp.evaluate(() => ({
      note: document.querySelector('[data-testid="room-fit-selected-note"] p')?.textContent.trim() ?? null,
      facing: document.querySelector('[data-testid="room-fit-facing"]')?.textContent.trim() ?? null,
      space: document.querySelector('[data-testid="room-fit-selected-space"]')?.textContent.trim() ?? null,
    }));
  const shelfNote = await readSelected();
  check(
    'the selected piece is described (the shelf: a shoe rack below, storage above) and the way it faces is stated',
    shelfNote.note === 'Shoe rack in the lower half, storage above · 240 cm tall' && shelfNote.facing === 'Faces north (the front-door end)',
    JSON.stringify(shelfNote),
  );
  await focusPiece(kp, 'bed');
  const bedNote = await readSelected();
  await focusPiece(kp, 'shelf');
  check(
    'the selected piece also says how much room it leaves: in front of the shelf, beside the bed',
    shelfNote.space === 'Room in front: 70 cm · Just right' && bedNote.space === 'Room beside the bed: 150+ cm · Comfortable',
    JSON.stringify({ shelf: shelfNote.space, bed: bedNote.space }),
  );

  const home = await pieceOf(kp, 'shelf');
  const scrolledFrom = await scrollOf(kp);
  await kp.keyboard.press('ArrowRight');
  const right = await pieceOf(kp, 'shelf');
  await kp.keyboard.down('Shift');
  await kp.keyboard.press('ArrowDown');
  await kp.keyboard.up('Shift');
  const down = await pieceOf(kp, 'shelf');
  await kp.keyboard.press('ArrowLeft');
  await kp.keyboard.down('Shift');
  await kp.keyboard.press('ArrowUp');
  await kp.keyboard.up('Shift');
  const back = await pieceOf(kp, 'shelf');
  check(
    'arrow keys move a piece 5 cm, Shift moves it 25 cm, and reversing them comes home',
    right.x === home.x + 5 && down.y === home.y + 25 && sameSpot(back, home),
    JSON.stringify({ home, right, down, back }),
  );
  check('the arrow keys move the piece and do not scroll the page', (await scrollOf(kp)) === scrolledFrom, `${scrolledFrom} -> ${await scrollOf(kp)}`);

  await kp.keyboard.press('r');
  const turned = await pieceOf(kp, 'shelf');
  const turnedBox = await kp.$eval('[data-piece="shelf"] rect', (r) => ({ w: Number(r.getAttribute('width')), h: Number(r.getAttribute('height')) }));
  check('R turns the piece 90 degrees clockwise, swapping its footprint', turned.rot === 90 && turnedBox.w === 45 && turnedBox.h === 60, JSON.stringify({ turned, turnedBox }));
  const turnedNote = await readSelected();
  check('and the stated direction turns with it: north, then (a quarter turn clockwise) east', turnedNote.facing === 'Faces east (the left wall)', JSON.stringify(turnedNote));

  // A screen-reader user gets no spoken confirmation from a piece that merely changed its label,
  // so once a move has settled the new position is said in a polite live region.
  await settle(kp);
  const spoken = await kp.evaluate(() => document.querySelector('[data-testid="room-fit-announce"]')?.textContent.trim() ?? '(no announcer on the page)');
  check(
    'once a move settles, its new position is announced: which piece, and how far from which walls',
    spoken.startsWith('Shelf') && spoken.includes(`${turned.x} cm from the left wall`) && spoken.includes(`${turned.y - LIVING.y0} cm from the bathroom and balcony wall`),
    spoken,
  );

  for (let i = 0; i < 3; i += 1) {
    await kp.keyboard.down('Shift');
    await kp.keyboard.press('ArrowLeft');
    await kp.keyboard.up('Shift');
  }
  check('a piece pushed with the keyboard stops at the wall', (await pieceOf(kp, 'shelf')).x === 0);

  // The arrow buttons: the alternative to dragging.
  const beforeButton = await pieceOf(kp, 'shelf');
  await kp.click('[data-action="nudge-right"]');
  const afterButton = await pieceOf(kp, 'shelf');
  check('one click on an arrow button moves the selected piece exactly 5 cm', afterButton.x === beforeButton.x + 5 && afterButton.y === beforeButton.y, JSON.stringify({ beforeButton, afterButton }));

  await kp.click('[data-action="rotate"]');
  check('the turn button turns the selected piece', (await pieceOf(kp, 'shelf')).rot === 180);

  const holdFrom = await pieceOf(kp, 'shelf');
  const up = await (await kp.$('[data-action="nudge-up"]')).boundingBox();
  await kp.mouse.move(up.x + up.width / 2, up.y + up.height / 2);
  await kp.mouse.down();
  await sleep(1000);
  await kp.mouse.up();
  const heldTo = await pieceOf(kp, 'shelf');
  await sleep(400);
  const later = await pieceOf(kp, 'shelf');
  check(
    'holding an arrow button keeps moving the piece, and letting go stops it',
    holdFrom.y - heldTo.y >= 20 && sameSpot(later, heldTo),
    JSON.stringify({ holdFrom, heldTo, later }),
  );

  // Two fingers land on the same arrow button and both lift: the first finger's repeat timer must not be orphaned.
  const twoFingersFrom = await pieceOf(kp, 'shelf');
  await kp.evaluate(() => {
    const button = document.querySelector('[data-action="nudge-down"]');
    const fire = (type) => button.dispatchEvent(new PointerEvent(type, { bubbles: true, button: 0, pointerId: 7, pointerType: 'touch', isPrimary: true }));
    fire('pointerdown');
    fire('pointerdown');
    fire('pointerup');
    fire('pointerup');
  });
  await sleep(1200);
  const twoFingersTo = await pieceOf(kp, 'shelf');
  await sleep(500);
  const twoFingersLater = await pieceOf(kp, 'shelf');
  check(
    'two fingers on one arrow button, both lifted: each press moved the piece once and nothing keeps running',
    twoFingersTo.y === twoFingersFrom.y + 10 && sameSpot(twoFingersLater, twoFingersTo),
    JSON.stringify({ twoFingersFrom, twoFingersTo, twoFingersLater }),
  );

  // Browser and system shortcuts keep working while a piece has focus; R also works from a Thai keyboard layout.
  await focusPiece(kp, 'shelf');
  await kp.evaluate(() => {
    window.__swallowed = [];
    window.addEventListener('keydown', (event) => event.defaultPrevented && window.__swallowed.push(`${event.ctrlKey ? 'Ctrl+' : ''}${event.altKey ? 'Alt+' : ''}${event.key}`));
  });
  const beforeShortcuts = await pieceOf(kp, 'shelf');
  await kp.keyboard.down('Control');
  await kp.keyboard.press('r'); // reload
  await kp.keyboard.up('Control');
  await kp.keyboard.down('Alt');
  await kp.keyboard.press('ArrowLeft'); // history back
  await kp.keyboard.up('Alt');
  const swallowed = await kp.evaluate(() => window.__swallowed);
  check(
    'Ctrl+R and Alt+Arrow are left to the browser: the piece stays put and the keys are not swallowed',
    sameSpot(await pieceOf(kp, 'shelf'), beforeShortcuts) && swallowed.length === 0,
    JSON.stringify({ beforeShortcuts, swallowed }),
  );
  const beforeThai = await pieceOf(kp, 'shelf'); // read fresh: it must not depend on what the shortcut check did
  await kp.evaluate(() => document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'พ', code: 'KeyR', bubbles: true, cancelable: true })));
  const afterThai = await pieceOf(kp, 'shelf');
  check(
    'R turns a piece from a Thai keyboard layout too (the physical key is the same; it types พ)',
    afterThai.rot === (beforeThai.rot + 90) % 360,
    JSON.stringify({ beforeThai, afterThai }),
  );
  check('no console errors or page errors with the keyboard and buttons', keys.problems.length === 0, keys.problems.join(' | '));
  await kp.close();
}
