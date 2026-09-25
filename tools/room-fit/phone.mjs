// Section 5 — a phone: a card in the article, the game played full screen with real touch, pinch-zoom, smaller screens, a tablet, and a phone on its side.
import { START_LAYOUT } from '../../src/lib/roomFit.ts';
import { sleep } from '../lib/dev-harness.mjs';

export default async function run({ check, driver }) {
  const { FRAME, BOARD, PLAY, PHONE, SHUT, browser, sameSpot, allAt, sameRect, openArticle, readGame, pieceOf, settle, scaleOf, grabPoint, touchDrag, scrollOf, doorsOf, doorPoint, scrollSettles, inView, fitsScreen, hittable } = driver;

  // ── 5. a phone: a card in the article, and the game played full screen ──────
  // On a phone the article is a column to read down, and the game is a tool that needs its buttons beside
  // the plan: the turn button used to sit 1.7 screens below the board. So the article holds a picture and one
  // button, and the game opens over the whole screen with the plan, its buttons and its result together.
  const phone = await openArticle({ viewport: PHONE });
  const pp = phone.page;
  await pp.evaluate((selector) => document.querySelector(selector).scrollIntoView({ block: 'center', behavior: 'instant' }), FRAME);
  await pp.waitForSelector('[data-testid="room-fit"][data-mode="compact"]', { timeout: 60000 });
  await sleep(600);
  const card = await pp.evaluate(() => ({
    boards: document.querySelectorAll('svg[role="group"]').length,
    rules: document.querySelectorAll('[data-rule]').length,
    cardHeight: Math.round(document.querySelector('[data-testid="room-fit"]').getBoundingClientRect().height),
    // The frame reserves a slot for the game while it loads: it must not be taller than the card, or a blank stretch is left under it.
    slotHeight: Math.round(document.querySelector('[data-testid="room-fit"]').parentElement.getBoundingClientRect().height),
    viewport: innerHeight,
    button: document.querySelector('[data-action="play-full-screen"]')?.textContent.trim() ?? null,
    overflow: document.documentElement.scrollWidth <= innerWidth,
  }));
  check(
    'on a 390 px phone the article holds a card with one button — no board, no rules list, no sideways scrolling — under half a screen tall, where the game was three',
    card.boards === 0 && card.rules === 0 && card.button === 'Play full screen' && card.overflow && card.cardHeight < card.viewport / 2,
    JSON.stringify(card),
  );
  check('the space the frame keeps for the game is no taller than the card, so no blank stretch is left under it', card.slotHeight <= card.cardHeight + 8, JSON.stringify(card));
  const articleScroll = await scrollOf(pp);

  await pp.tap('[data-action="play-full-screen"]');
  await pp.waitForSelector(PLAY, { timeout: 30000 });
  await sleep(500);
  const opened = await pp.evaluate((play) => {
    const box = document.querySelector(play).getBoundingClientRect();
    return { top: Math.round(box.top), height: Math.round(box.height), vh: innerHeight, locked: getComputedStyle(document.documentElement).overflow, focused: document.activeElement === document.querySelector(play) };
  }, PLAY);
  check(
    'it opens over the whole screen, stops the page scrolling behind it, and takes focus',
    opened.top === 0 && Math.abs(opened.height - opened.vh) <= 1 && opened.locked === 'hidden' && opened.focused,
    JSON.stringify(opened),
  );

  const shutBody = await pp.$eval(`${PLAY} #room-fit-sheet-body`, (el) => ({ hidden: el.hidden, display: getComputedStyle(el).display, rects: el.getClientRects().length }));
  check(
    'the result sheet starts shut and its body is really not drawn (a class that sets `display` beats the `hidden` attribute), so the plan gets the room',
    shutBody.hidden && shutBody.display === 'none' && shutBody.rects === 0,
    JSON.stringify(shutBody),
  );

  // The point of it: the plan, the turn button, the doors button and the result are all on the screen at once.
  const board = await inView(pp, BOARD);
  const turn = await inView(pp, `${PLAY} [data-action="rotate"]`);
  const handle = await inView(pp, `${PLAY} [data-action="toggle-sheet"]`);
  const doorsButton = await inView(pp, `${PLAY} [data-action="toggle-doors"]`);
  const nudges = await Promise.all(['up', 'down', 'left', 'right'].map((way) => inView(pp, `${PLAY} [data-action="nudge-${way}"]`)));
  const overlaps = (a, b) => a.top < b.bottom && b.top < a.bottom && a.left < b.right && b.left < a.right;
  check(
    'the plan, the turn button, the arrow keys, the doors button and the result share ONE screen — nothing to scroll to',
    [board, turn, handle, doorsButton, ...nudges].every(fitsScreen) && !overlaps(turn, board) && !overlaps(doorsButton, board) && nudges.every((key) => !overlaps(key, board)),
    JSON.stringify({ board, turn, handle, doorsButton, nudges }),
  );
  const tappable = await Promise.all(['toggle-doors', 'reset', 'toggle-plan', 'close-play', 'toggle-sheet'].map((action) => hittable(pp, `${PLAY} [data-action="${action}"]`)));
  check('the doors, start over, our plan, close and result buttons can all be pressed where they are drawn — none is clipped or covered', tappable.every(Boolean), JSON.stringify(tappable));
  const railButtons = await pp.$$eval(`${PLAY} [data-testid="room-fit-rail"] button`, (els) => els.map((el) => ({ action: el.dataset.action, w: Math.round(el.getBoundingClientRect().width), h: Math.round(el.getBoundingClientRect().height) })));
  check(
    'no button in the rail is squashed: the turn button is a 60 px circle, the arrow keys are 32 px squares, the others at least 44 px tall',
    railButtons.length === 8 &&
      railButtons.every((b) => (b.action === 'rotate' ? b.w === 60 && b.h === 60 : b.action.startsWith('nudge-') ? b.w === 32 && b.h === 32 : b.h >= 44)),
    JSON.stringify(railButtons),
  );
  const phoneScale = await scaleOf(pp);
  check(
    'the plan is drawn big enough to play with a finger: the room is at least 240 px wide, and the smallest side of any piece (45 cm) is at least 24 px',
    350 * phoneScale.x >= 240 && 45 * phoneScale.x >= 24,
    `1 cm is ${phoneScale.x.toFixed(3)} px: room ${Math.round(350 * phoneScale.x)} px wide, a 45 cm side ${(45 * phoneScale.x).toFixed(1)} px`,
  );

  // Select a piece with a tap and turn it — the thing that used to mean scrolling 1,090 px down and back.
  const untouched = await settle(pp);
  const shelfAt = await grabPoint(pp, 'shelf');
  await pp.touchscreen.tap(shelfAt.x, shelfAt.y);
  const selectedNow = (await readGame(pp)).selected;
  const shelfBefore = await pieceOf(pp, 'shelf');
  await pp.tap(`${PLAY} [data-action="rotate"]`);
  const shelfAfter = await pieceOf(pp, 'shelf');
  check(
    'a tap on a piece and a tap on Turn turn it a quarter, with no scrolling in between',
    untouched.selected === '' && selectedNow === 'shelf' && shelfAfter.rot === (shelfBefore.rot + 90) % 360 && (await scrollOf(pp)) === articleScroll,
    JSON.stringify({ selectedNow, shelfBefore, shelfAfter }),
  );
  const selectedLine = await pp.$eval(`${PLAY} [data-testid="room-fit-selected-name"]`, (el) => el.textContent.trim());
  const roomLine = await pp.$eval(`${PLAY} [data-testid="room-fit-selected-space"]`, (el) => el.textContent.trim());
  check(
    'the top of the game names the piece that is selected and says how much room it leaves',
    selectedLine === 'Shelf 60×45' && /^Room in front: \d+ cm · (Tight|Minimum|Just right|Comfortable)/.test(roomLine),
    JSON.stringify({ selectedLine, roomLine }),
  );
  // Picking a piece up must not change how tall anything is: the plan rescaling under the finger would move every piece.
  const boardAfterSelect = await inView(pp, BOARD);
  const scaleAfterSelect = await scaleOf(pp);
  check(
    'picking a piece up does not move or rescale the plan (its header and result keep their height)',
    sameRect(board, boardAfterSelect) && scaleAfterSelect.x === phoneScale.x && scaleAfterSelect.y === phoneScale.y,
    JSON.stringify({ board, boardAfterSelect, before: phoneScale, after: scaleAfterSelect }),
  );

  // A finger drags a piece by exactly as far as it moved, and the page does not scroll under it.
  const fingerFrom = await pieceOf(pp, 'shelf');
  const grabbed = await grabPoint(pp, 'shelf');
  await touchDrag(pp, grabbed, { x: grabbed.x + 40 * phoneScale.x, y: grabbed.y - 20 * phoneScale.y });
  const fingerTo = await pieceOf(pp, 'shelf');
  check(
    'a finger drags a piece by exactly as far as it moved, and the page does not scroll under it',
    fingerTo.x === fingerFrom.x + 40 && fingerTo.y === fingerFrom.y - 20 && (await scrollOf(pp)) === articleScroll,
    JSON.stringify({ fingerFrom, fingerTo }),
  );
  await pp.tap(`${PLAY} [data-action="nudge-right"]`);
  const tapped = await pieceOf(pp, 'shelf');
  check('a tap on a small arrow key moves the selected piece 5 cm — once, not twice', tapped.x === fingerTo.x + 5, JSON.stringify({ fingerTo, tapped }));

  // A swipe that starts on empty floor is not a scroll of the article behind: the game is the whole screen.
  const floor = await pp.evaluate((board) => {
    const matrix = document.querySelector(board).getScreenCTM();
    const at = { x: matrix.e + 300 * matrix.a, y: matrix.f + 250 * matrix.d }; // free floor in every layout this test reaches
    return { ...at, onPiece: document.elementFromPoint(at.x, at.y)?.closest('[data-piece]') !== null };
  }, BOARD);
  if (floor.onPiece) throw new Error('the spot chosen as empty floor has a piece on it');
  await touchDrag(pp, floor, { x: floor.x, y: floor.y - 150 });
  check('a swipe over the game does not scroll the article behind it, and moves no piece', (await scrollOf(pp)) === articleScroll && sameSpot(await pieceOf(pp, 'shelf'), tapped), `scrollY ${await scrollOf(pp)} (was ${articleScroll})`);

  // The doors: a tap on one opens it, the button opens them all, and none of it changes the rules.
  const rulesBeforeDoors = (await readGame(pp)).passed;
  const shut = await doorsOf(pp, PLAY);
  const balconyTap = await doorPoint(pp, 'balcony', PLAY);
  await pp.touchscreen.tap(balconyTap.x, balconyTap.y);
  const phoneOneOpen = await doorsOf(pp, PLAY);
  const balconyPanels = await pp.$eval(`${PLAY} [data-testid="room-fit-balcony-door"]`, (el) => el.getAttribute('d'));
  await pp.tap(`${PLAY} [data-action="toggle-doors"]`);
  const phoneAllOpen = await doorsOf(pp, PLAY);
  const phoneDoor = await pp.evaluate(() => {
    const matrix = document.querySelector('[data-testid="room-fit-play"] svg[role="group"]').getScreenCTM();
    const door = document.querySelector('[data-testid="room-fit-play"] [data-door="entrance"]').getBoundingClientRect();
    return { doorBottom: Math.round(door.bottom), wallY: Math.round(matrix.f + 720 * matrix.d), viewport: innerHeight };
  });
  await pp.tap(`${PLAY} [data-action="toggle-doors"]`);
  const allShut = await doorsOf(pp, PLAY);
  check(
    'a tap on the balcony door opens it (the panels stack); "Open the doors" opens all three and swings the front door out below the room, on the screen; pressing again shuts them all',
    JSON.stringify(shut) === SHUT &&
      JSON.stringify(phoneOneOpen) === '{"entrance":false,"bathroom":false,"balcony":true}' &&
      balconyPanels === 'M10 157H74M14 163H78' &&
      Object.values(phoneAllOpen).every(Boolean) &&
      phoneDoor.doorBottom > phoneDoor.wallY &&
      phoneDoor.doorBottom <= phoneDoor.viewport &&
      JSON.stringify(allShut) === SHUT,
    JSON.stringify({ shut, phoneOneOpen, balconyPanels, phoneAllOpen, phoneDoor, allShut }),
  );
  check('opening and shutting doors changes nothing in the rules', (await readGame(pp)).passed === rulesBeforeDoors, String((await readGame(pp)).passed));
  await pp.touchscreen.tap(balconyTap.x, balconyTap.y); // leave the balcony door open: closing and reopening must keep it so

  // The result: the sheet opens over nothing — the plan shrinks to stay wholly in view above it.
  await pp.tap(`${PLAY} [data-action="toggle-sheet"]`);
  await sleep(400);
  const sheetOpen = await pp.evaluate((play) => ({
    expanded: document.querySelector(`${play} [data-action="toggle-sheet"]`).getAttribute('aria-expanded'),
    bodyShown: !document.querySelector(`${play} #room-fit-sheet-body`).hidden,
    rules: document.querySelectorAll(`${play} [data-rule]`).length,
    spaces: document.querySelectorAll(`${play} [data-space]`).length,
  }), PLAY);
  const bodyShownWhenOpen = await pp.$eval(`${PLAY} #room-fit-sheet-body`, (el) => getComputedStyle(el).display);
  const boardWithSheet = await inView(pp, BOARD);
  const sheetBox = await inView(pp, `${PLAY} [data-testid="room-fit-sheet"]`);
  const drawnWithSheet = await scaleOf(pp);
  const railWhileOpen = await pp.$eval(`${PLAY}`, (play) => play.querySelector('[data-testid="room-fit-rail"]')?.getClientRects().length ?? 0);
  check(
    'pulling the sheet up shows the five rules and the seven widths, and the whole plan stays in view above it — at least 110 px wide, so it still says where things are',
    sheetOpen.expanded === 'true' && sheetOpen.bodyShown && bodyShownWhenOpen === 'flex' && sheetOpen.rules === 5 && sheetOpen.spaces === 7 && fitsScreen(boardWithSheet) && boardWithSheet.bottom <= sheetBox.top + 1 && 350 * drawnWithSheet.x >= 110,
    JSON.stringify({ sheetOpen, boardWithSheet, sheetTop: sheetBox.top, roomWidth: Math.round(350 * drawnWithSheet.x) }),
  );
  check('while the sheet is open the buttons step aside, so nothing is drawn underneath it', railWhileOpen === 0, `rail boxes: ${railWhileOpen}`);
  check('the sheet itself stays on the screen, whole, and never taller than 56% of it', sheetBox.bottom <= sheetBox.vh && sheetBox.height <= Math.round(sheetBox.vh * 0.56) + 1, JSON.stringify(sheetBox));
  // The sheet is the one part of the game that scrolls (its content is longer than the room it is given): a swipe on it scrolls it, not the page.
  const bodyBox = await inView(pp, `${PLAY} #room-fit-sheet-body`);
  await touchDrag(pp, { x: bodyBox.left + bodyBox.width / 2, y: bodyBox.top + bodyBox.height - 40 }, { x: bodyBox.left + bodyBox.width / 2, y: bodyBox.top + 40 });
  const sheetScrolled = await pp.$eval(`${PLAY} #room-fit-sheet-body`, (el) => Math.round(el.scrollTop));
  check('a swipe on the open sheet scrolls the sheet, and the article behind stays put', sheetScrolled >= 40 && (await scrollOf(pp)) === articleScroll, `sheet scrolled ${sheetScrolled}px, page scrollY ${await scrollOf(pp)}`);
  await scrollSettles(pp, `${PLAY} #room-fit-sheet-body`);
  await pp.tap(`${PLAY} [data-action="toggle-sheet"]`);
  await pp.waitForFunction((play) => document.querySelector(`${play} #room-fit-sheet-body`).hidden, { timeout: 5000 }, PLAY).catch(() => undefined);
  const shutAgain = await pp.$eval(`${PLAY} #room-fit-sheet-body`, (el) => ({ hidden: el.hidden, display: getComputedStyle(el).display, rects: el.getClientRects().length }));
  check('the sheet shuts again, and its rules are no longer on the screen', shutAgain.hidden && shutAgain.display === 'none' && shutAgain.rects === 0, JSON.stringify(shutAgain));

  // Tab and Shift+Tab wrap inside the dialog in the upright layout too — with the result sheet shut (its last stop is the handle) and open (a row of the widths).
  const tabsThatStrayed = async (page, backwards) => {
    let strayed = 0;
    if (backwards) await page.keyboard.down('Shift');
    for (let stop = 0; stop < 30; stop += 1) {
      await page.keyboard.press('Tab');
      if (!(await page.evaluate((play) => document.querySelector(play).contains(document.activeElement), PLAY))) strayed += 1;
    }
    if (backwards) await page.keyboard.up('Shift');
    return strayed;
  };
  const strays = { shutForward: await tabsThatStrayed(pp, false), shutBackward: await tabsThatStrayed(pp, true) };
  await pp.tap(`${PLAY} [data-action="toggle-sheet"]`);
  await sleep(300);
  strays.openForward = await tabsThatStrayed(pp, false);
  strays.openBackward = await tabsThatStrayed(pp, true);
  await pp.tap(`${PLAY} [data-action="toggle-sheet"]`);
  await sleep(300);
  check('in the upright layout Tab and Shift+Tab stay inside the dialog, with the sheet shut and with it open', Object.values(strays).every((count) => count === 0), JSON.stringify(strays));

  // Close: the article is back where it was, scrolling again, with focus on the button that opened the game.
  const phoneHeld = await pieceOf(pp, 'shelf');
  await pp.tap(`${PLAY} [data-action="close-play"]`);
  await pp.waitForFunction((play) => !document.querySelector(play), { timeout: 10000 }, PLAY);
  await sleep(200);
  const closed = await pp.evaluate(() => ({
    overflow: getComputedStyle(document.documentElement).overflow,
    focus: document.activeElement?.getAttribute('data-action') ?? null,
    card: Boolean(document.querySelector('[data-testid="room-fit"][data-mode="compact"]')),
    progress: document.querySelector('[data-testid="room-fit-progress"]')?.textContent.trim() ?? null,
  }));
  check(
    'closing gives the page its scrolling back, on the same spot of the article, with focus on the button that opened the game and the card showing the score',
    closed.overflow !== 'hidden' && closed.focus === 'play-full-screen' && closed.card && /^\d of 5 rules hold$/.test(closed.progress) && (await scrollOf(pp)) === articleScroll,
    JSON.stringify({ ...closed, scrollY: await scrollOf(pp), articleScroll }),
  );

  // Reopening finds the game as it was left; "Start over" puts the furniture back and keeps the door; Escape closes.
  await pp.tap('[data-action="play-full-screen"]');
  await pp.waitForSelector(PLAY, { timeout: 30000 });
  await sleep(300);
  const reopened = await settle(pp);
  check(
    'reopening finds the game as it was left: the shelf where the finger put it, and the balcony door still open',
    sameSpot(reopened.pieces.shelf, phoneHeld) && JSON.stringify(await doorsOf(pp, PLAY)) === '{"entrance":false,"bathroom":false,"balcony":true}',
    JSON.stringify({ shelf: reopened.pieces.shelf, phoneHeld }),
  );
  const phoneEntry = await pp.evaluate(() => Boolean(history.state?.overlay));
  check('on a phone too, opening the game pushes a history entry of its own for Back to pop', phoneEntry === true, String(phoneEntry));
  if (phoneEntry) {
    await pp.evaluate(() => history.back());
    await pp.waitForFunction((play) => !document.querySelector(play), { timeout: 10000 }, PLAY);
    await sleep(300);
    const backed = await pp.evaluate(() => ({ path: location.pathname, entry: Boolean(history.state?.overlay), card: Boolean(document.querySelector('[data-testid="room-fit"][data-mode="compact"]')) }));
    check('on a phone the Back gesture closes the full-screen game and leaves the article where it is, with the card showing', backed.path === '/journal/design-notes-01' && backed.entry === false && backed.card, JSON.stringify(backed));
    await pp.tap('[data-action="play-full-screen"]');
    await pp.waitForSelector(PLAY, { timeout: 30000 });
    await sleep(300);
    const afterBack = await settle(pp);
    check('and reopening after Back finds the game as it was left', sameSpot(afterBack.pieces.shelf, phoneHeld) && JSON.stringify(await doorsOf(pp, PLAY)) === '{"entrance":false,"bathroom":false,"balcony":true}', JSON.stringify(afterBack.pieces.shelf));
  }
  await pp.tap(`${PLAY} [data-action="reset"]`);
  const restarted = await settle(pp);
  check('"Start over" puts the pieces back in the full-screen game too', allAt(restarted.pieces, START_LAYOUT), JSON.stringify(restarted.pieces));
  await pp.keyboard.press('Escape');
  await pp.waitForFunction((play) => !document.querySelector(play), { timeout: 10000 }, PLAY);
  check('Escape closes the full-screen game on a phone as well', (await pp.$(PLAY)) === null);
  check('no console errors or page errors on the phone', phone.problems.length === 0, phone.problems.join(' | '));
  await pp.close();

  // ── 5b. pinch-zoom: a visitor with low vision reads a phone by zooming it ───
  // The dialog once had `touch-action: none`, which switched pinch-zoom off everywhere inside it — the page scale stayed 1 over the
  // header, the plan and the rules — while the article behind it zooms. A pinch that starts ON a piece is a drag, and stays one.
  const pinch = async (page, at) => {
    const cdp = await page.createCDPSession();
    const send = (type, touchPoints) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints });
    const fingers = (spread) => [{ x: at.x - spread, y: at.y, id: 1 }, { x: at.x + spread, y: at.y, id: 2 }];
    await send('touchStart', fingers(40));
    for (let step = 1; step <= 16; step += 1) {
      await send('touchMove', fingers(40 + step * 8));
      await sleep(16);
    }
    await send('touchEnd', []);
    await sleep(600);
    await cdp.detach();
    return page.evaluate(() => window.visualViewport.scale);
  };
  const zoomedBy = async (where) => {
    const zoom = await openArticle({ viewport: PHONE });
    const zp = zoom.page;
    await zp.evaluate((selector) => document.querySelector(selector).scrollIntoView({ block: 'center', behavior: 'instant' }), FRAME);
    await zp.waitForSelector('[data-action="play-full-screen"]', { timeout: 60000 });
    await sleep(400);
    if (where !== 'the article') {
      await zp.tap('[data-action="play-full-screen"]');
      await zp.waitForSelector(PLAY, { timeout: 30000 });
      await sleep(400);
    }
    if (where === 'the rules') {
      await zp.tap(`${PLAY} [data-action="toggle-sheet"]`);
      await sleep(400);
    }
    const at = await zp.evaluate(
      ({ target, play, frame }) => {
        const centre = (selector) => {
          const r = document.querySelector(selector).getBoundingClientRect();
          return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) };
        };
        if (target === 'the article') return centre(`${frame} h3`);
        if (target === 'the header') return centre(`${play} header`);
        if (target === 'the result') return centre(`${play} [data-testid="room-fit-sheet"]`);
        if (target === 'the rules') return centre(`${play} #room-fit-sheet-body`);
        if (target === 'a piece') return centre(`${play} [data-piece="bed"] rect`);
        const matrix = document.querySelector(`${play} svg[role="group"]`).getScreenCTM(); // empty floor: 300 cm across, 250 down
        return { x: Math.round(matrix.e + 300 * matrix.a), y: Math.round(matrix.f + 250 * matrix.d) };
      },
      { target: where, play: PLAY, frame: FRAME },
    );
    const bedBefore = where === 'the article' ? null : await pieceOf(zp, 'bed');
    const scale = await pinch(zp, at);
    const bedAfter = where === 'the article' ? null : await pieceOf(zp, 'bed');
    await zp.close();
    return { scale, bedMoved: bedBefore !== null && !sameSpot(bedBefore, bedAfter) };
  };
  const zoomed = {};
  const bedMoved = {};
  for (const where of ['the article', 'the header', 'empty floor', 'the result', 'the rules', 'a piece']) {
    const result = await zoomedBy(where);
    zoomed[where] = result.scale;
    bedMoved[where] = result.bedMoved;
  }
  check(
    'a two-finger pinch zooms the page over the article (so this probe can see a zoom at all), and still zooms it inside the full-screen game over its header, empty floor, result, rules — and over a piece, which is most of the plan',
    Object.values(zoomed).every((scale) => scale > 1.5),
    JSON.stringify(zoomed),
  );
  check('a pinch does not carry the bed along, whether the fingers land on it or beside it: the second finger ends the drag', Object.values(bedMoved).every((moved) => moved === false), JSON.stringify(bedMoved));

  // Smaller screens: 360 x 640, and 375 x 550 — an iPhone SE whose browser bars take their share. Everything still on one screen.
  for (const [name, size, minRoom] of [
    ['a 360 x 640 phone', { width: 360, height: 640 }, 170],
    ['a short 375 x 550 phone', { width: 375, height: 550 }, 140],
    ['a tablet held upright (768 x 1024)', { width: 768, height: 1024 }, 300],
  ]) {
    const small = await openArticle({ viewport: { ...size, deviceScaleFactor: 2, isMobile: true, hasTouch: true } });
    const sp = small.page;
    await sp.evaluate((selector) => document.querySelector(selector).scrollIntoView({ block: 'center', behavior: 'instant' }), FRAME);
    await sp.waitForSelector('[data-action="play-full-screen"]', { timeout: 60000 });
    await sp.tap('[data-action="play-full-screen"]');
    await sp.waitForSelector(PLAY, { timeout: 30000 });
    await sleep(400);
    const parts = {
      board: await inView(sp, BOARD),
      turn: await inView(sp, `${PLAY} [data-action="rotate"]`),
      handle: await inView(sp, `${PLAY} [data-action="toggle-sheet"]`),
      plan: await inView(sp, `${PLAY} [data-action="toggle-plan"]`),
      doors: await inView(sp, `${PLAY} [data-action="toggle-doors"]`),
      reset: await inView(sp, `${PLAY} [data-action="reset"]`),
      down: await inView(sp, `${PLAY} [data-action="nudge-down"]`),
      close: await inView(sp, `${PLAY} [data-action="close-play"]`),
    };
    const scale = await scaleOf(sp);
    const pressable = await Promise.all(['toggle-doors', 'reset', 'toggle-plan', 'close-play', 'toggle-sheet'].map((action) => hittable(sp, `${PLAY} [data-action="${action}"]`)));
    check(
      `on ${name} the plan, the buttons and the result all fit on the one screen, every button can be pressed where it is drawn, and the room is drawn at least ${minRoom} px wide`,
      Object.values(parts).every(fitsScreen) && pressable.every(Boolean) && 350 * scale.x >= minRoom,
      JSON.stringify({ ...parts, pressable, roomWidth: Math.round(350 * scale.x) }),
    );
    check(`no console errors or page errors on ${name}`, small.problems.length === 0, small.problems.join(' | '));
    await sp.close();
  }

  // Turning the phone with the game open: the layout swaps, and the game — pieces, doors, the page lock, focus — goes on as it was.
  const turning = await openArticle({ viewport: PHONE });
  const tp = turning.page;
  await tp.evaluate((selector) => document.querySelector(selector).scrollIntoView({ block: 'center', behavior: 'instant' }), FRAME);
  await tp.waitForSelector('[data-action="play-full-screen"]', { timeout: 60000 });
  await tp.tap('[data-action="play-full-screen"]');
  await tp.waitForSelector(PLAY, { timeout: 30000 });
  await sleep(400);
  const turnShelfAt = await grabPoint(tp, 'shelf');
  await tp.touchscreen.tap(turnShelfAt.x, turnShelfAt.y);
  await tp.tap(`${PLAY} [data-action="nudge-right"]`);
  await tp.tap(`${PLAY} [data-action="toggle-doors"]`);
  const upright = await settle(tp);
  const layoutOf = () => tp.evaluate((play) => ({ layout: document.querySelector('[data-testid="room-fit"]').dataset.layout, locked: getComputedStyle(document.documentElement).overflow, focusInside: document.querySelector(play).contains(document.activeElement) }), PLAY);
  const beforeTurn = await layoutOf();
  await tp.setViewport({ width: 844, height: 390, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await sleep(500);
  const onItsSide = await settle(tp);
  const turnedSide = await layoutOf();
  await tp.setViewport(PHONE);
  await sleep(500);
  const backUpright = await settle(tp);
  const afterTurning = await layoutOf();
  check(
    'turning the phone with the game open swaps the layout (upright → wide → upright) and changes nothing else: the same pieces and doors, the page still locked, focus still in the dialog',
    beforeTurn.layout === 'upright' &&
      turnedSide.layout === 'wide' &&
      afterTurning.layout === 'upright' &&
      allAt(onItsSide.pieces, upright.pieces) &&
      allAt(backUpright.pieces, upright.pieces) &&
      JSON.stringify(await doorsOf(tp, PLAY)) === '{"entrance":true,"bathroom":true,"balcony":true}' &&
      [turnedSide, afterTurning].every((now) => now.locked === 'hidden' && now.focusInside),
    JSON.stringify({ beforeTurn, turnedSide, afterTurning }),
  );
  await tp.close();

  // A phone on its side: wider than it is tall, so the result sits beside the plan instead of under it — and it is the
  // article's card that opens it, because the article's own two columns start at 1024 px.
  const sideways = await openArticle({ viewport: { width: 844, height: 390, deviceScaleFactor: 2, isMobile: true, hasTouch: true } });
  const sw = sideways.page;
  await sw.evaluate((selector) => document.querySelector(selector).scrollIntoView({ block: 'center', behavior: 'instant' }), FRAME);
  await sw.waitForSelector('[data-testid="room-fit"][data-mode="compact"]', { timeout: 60000 });
  await sw.tap('[data-action="play-full-screen"]');
  await sw.waitForSelector(PLAY, { timeout: 30000 });
  await sleep(400);
  const sideParts = {
    board: await inView(sw, BOARD),
    rail: await inView(sw, `${PLAY} [data-testid="room-fit-rail"]`),
    panel: await inView(sw, `${PLAY} [data-testid="room-fit-panel"]`),
    turn: await inView(sw, `${PLAY} [data-action="rotate"]`),
    close: await inView(sw, `${PLAY} [data-action="close-play"]`),
  };
  const sideScale = await scaleOf(sw);
  const sideFacts = await sw.evaluate((play) => {
    const rail = document.querySelector(`${play} [data-testid="room-fit-rail"]`);
    const panel = document.querySelector(`${play} [data-testid="room-fit-panel"]`);
    return {
      layout: document.querySelector('[data-testid="room-fit"]').dataset.layout,
      railScrolls: rail.scrollHeight > rail.clientHeight + 1,
      rules: panel.querySelectorAll('[data-rule]').length,
      sheet: document.querySelector(`${play} [data-testid="room-fit-sheet"]`) !== null,
    };
  }, PLAY);
  check(
    'on a phone turned sideways (844 x 390) the plan is as tall as the screen, the buttons fit beside it without scrolling, and the rules sit in a panel beside them',
    sideFacts.layout === 'wide' && !sideFacts.railScrolls && sideFacts.rules === 5 && !sideFacts.sheet && Object.values(sideParts).every(fitsScreen) && 350 * sideScale.x >= 120 && sideParts.panel.width >= 300,
    JSON.stringify({ sideFacts, sideParts, roomWidth: Math.round(350 * sideScale.x) }),
  );
  check('no console errors or page errors on a phone turned sideways', sideways.problems.length === 0, sideways.problems.join(' | '));
  await sw.close();
}
