// Section 1b — the doors: a click opens one, a button opens them all, none of it changes the rules; and the same game full screen on a desktop (a dialog: focus, Tab, Escape).
import { START_LAYOUT } from '../../src/lib/roomFit.ts';
import { DOOR_SPECS, closedLeafTip, openLeafTip } from '../../src/lib/roomFitDoors.ts';
import { sleep } from '../lib/dev-harness.mjs';

export default async function run({ check, driver }) {
  const { PLAY, SHUT, sameSpot, allAt, sameRect, spaceLine, openArticle, readGame, pieceOf, settle, showBoard, startGame, scaleOf, grabPoint, doorsOf, leafOf, doorPoint, inView, fitsScreen, scrollOf } = driver;

  // ── 1b. the doors: a click opens one, a button opens them all, and none of it changes the rules ──
  // Drawn the way the article's plan draws them: the front door hinged on its left jamb and swinging OUT to
  // the corridor, the bathroom door hinged on its left jamb and swinging INTO the bathroom, the balcony a
  // double slider. Opening a door shows what the door is; it never takes floor from the furniture.
  const doorTest = await openArticle();
  const dp = doorTest.page;
  await startGame(dp);
  const leafLine = (id, tip) => ({ x1: DOOR_SPECS[id].x0, y1: DOOR_SPECS[id].wallY, x2: tip.x, y2: tip.y });

  const doorFacts = await dp.$$eval('[data-door]', (els) =>
    els.map((el) => ({ id: el.dataset.door, role: el.getAttribute('role'), pressed: el.getAttribute('aria-pressed'), tab: el.getAttribute('tabindex'), label: el.getAttribute('aria-label') })),
  );
  check(
    'the three doors are on the plan as buttons, all shut, each saying which door it is, how it works and its state in its label — with no aria-pressed to say the same thing twice',
    JSON.stringify(doorFacts.map((d) => [d.id, d.role, d.pressed, d.tab])) === '[["entrance","button",null,"0"],["bathroom","button",null,"0"],["balcony","button",null,"0"]]' &&
      doorFacts[0].label === 'The front door, swings out to the corridor: closed. Press to open.' &&
      doorFacts[1].label === 'The bathroom door, swings into the bathroom: closed. Press to open.' &&
      doorFacts[2].label === 'The balcony door, a double sliding door: closed. Press to open.',
    JSON.stringify(doorFacts),
  );
  const shutLeaves = { entrance: await leafOf(dp, 'entrance'), bathroom: await leafOf(dp, 'bathroom') };
  check(
    'shut, a swinging door is one leaf along its wall, from its hinge to the far jamb; the balcony slider has panels and no leaf',
    sameRect(shutLeaves.entrance, leafLine('entrance', closedLeafTip('entrance'))) && sameRect(shutLeaves.bathroom, leafLine('bathroom', closedLeafTip('bathroom'))) && (await dp.$('[data-door="balcony"] line')) === null,
    JSON.stringify(shutLeaves),
  );

  const beforeDoors = await readGame(dp);
  const balconyAt = await doorPoint(dp, 'balcony');
  await dp.mouse.click(balconyAt.x, balconyAt.y);
  const oneOpen = await doorsOf(dp);
  const slid = await dp.$eval('[data-testid="room-fit-balcony-door"]', (el) => el.getAttribute('d'));
  const balconyState = await dp.$eval('[data-door="balcony"]', (el) => ({ label: el.getAttribute('aria-label'), pressed: el.getAttribute('aria-pressed') }));
  check(
    'a click on the balcony door opens it — the panels stack on the left and the exit is clear — and the other two stay shut',
    JSON.stringify(oneOpen) === '{"entrance":false,"bathroom":false,"balcony":true}' && slid === 'M10 157H74M14 163H78' && balconyState.label === 'The balcony door, a double sliding door: open. Press to close.',
    JSON.stringify({ oneOpen, slid, balconyState }),
  );

  await dp.click('[data-action="toggle-doors"]');
  const allOpen = await doorsOf(dp);
  const openLeaves = { entrance: await leafOf(dp, 'entrance'), bathroom: await leafOf(dp, 'bathroom') };
  const openLabel = await dp.$eval('[data-action="toggle-doors"]', (el) => el.textContent.trim());
  check(
    '"Open the doors" opens all three: each swinging leaf stands square to its wall — the front door out in the corridor, the bathroom door into the bathroom — and the button now offers to close them',
    Object.values(allOpen).every(Boolean) &&
      sameRect(openLeaves.entrance, leafLine('entrance', openLeafTip('entrance'))) &&
      sameRect(openLeaves.bathroom, leafLine('bathroom', openLeafTip('bathroom'))) &&
      openLeaves.entrance.y2 > DOOR_SPECS.entrance.wallY &&
      openLeaves.bathroom.y2 < DOOR_SPECS.bathroom.wallY &&
      openLabel === 'Close the doors',
    JSON.stringify({ allOpen, openLeaves, openLabel }),
  );
  const drawnOpen = await dp.evaluate(() => {
    const board = document.querySelector('svg[role="group"]').getBoundingClientRect();
    const door = document.querySelector('[data-door="entrance"]').getBoundingClientRect();
    return { doorBottom: Math.round(door.bottom), boardBottom: Math.round(board.bottom), viewport: innerHeight };
  });
  check('the open front door is drawn whole — it stays inside the plan\'s frame and on the screen', drawnOpen.doorBottom <= drawnOpen.boardBottom && drawnOpen.doorBottom <= drawnOpen.viewport, JSON.stringify(drawnOpen));

  // The arc is the path of the leaf's free end: a quarter circle about the hinge, on the side the door swings to. A flipped sweep flag
  // draws the other arc through the same two points — bulging into the door's own square — and every leaf check above still passes.
  const arcMiddle = (id) =>
    dp.$eval(`[data-door="${id}"] path[fill="none"]`, (el) => {
      const point = el.getPointAtLength(el.getTotalLength() / 2);
      return { x: point.x, y: point.y };
    });
  const arcs = {};
  for (const id of ['entrance', 'bathroom']) {
    const spec = DOOR_SPECS[id];
    const middle = await arcMiddle(id);
    arcs[id] = { fromHinge: Math.round(Math.hypot(middle.x - spec.x0, middle.y - spec.wallY) * 10) / 10, side: Math.sign(middle.y - spec.wallY), width: spec.x1 - spec.x0 };
  }
  check(
    'each open door\'s arc is a quarter circle about its hinge: its middle is one door-width from the hinge, on the side the door swings to (out to the corridor, into the bathroom)',
    ['entrance', 'bathroom'].every((id) => Math.abs(arcs[id].fromHinge - arcs[id].width) <= 1 && arcs[id].side === DOOR_SPECS[id].swing.y),
    JSON.stringify(arcs),
  );

  const afterDoors = await readGame(dp);
  check(
    'opening the doors changes nothing in the rules, the measurements or the furniture',
    afterDoors.passed === beforeDoors.passed && allAt(afterDoors.pieces, beforeDoors.pieces) && afterDoors.spaces.map(spaceLine).join() === beforeDoors.spaces.map(spaceLine).join(),
    JSON.stringify({ beforeDoors: beforeDoors.passed, afterDoors: afterDoors.passed }),
  );
  await dp.click('[data-action="toggle-doors"]');
  check(
    'pressing it again shuts them all, and the button offers to open them',
    JSON.stringify(await doorsOf(dp)) === SHUT && (await dp.$eval('[data-action="toggle-doors"]', (el) => el.textContent.trim())) === 'Open the doors',
  );

  // A door is a button, so the keyboard works too: Enter opens it, Space shuts it.
  await dp.evaluate(() => document.querySelector('[data-door="entrance"]').focus());
  await dp.keyboard.press('Enter');
  const byEnter = (await doorsOf(dp)).entrance;
  await dp.keyboard.press('Space');
  const bySpace = (await doorsOf(dp)).entrance;
  check('a focused door opens with Enter and shuts with Space', byEnter === true && bySpace === false, JSON.stringify({ byEnter, bySpace }));

  // "Start over" puts the furniture back and leaves the doors as the visitor left them.
  await showBoard(dp);
  const bathroomAt = await doorPoint(dp, 'bathroom');
  await dp.mouse.click(bathroomAt.x, bathroomAt.y);
  const shelfGrip = await grabPoint(dp, 'shelf');
  await dp.mouse.click(shelfGrip.x, shelfGrip.y);
  await dp.keyboard.press('ArrowRight');
  const nudged = await pieceOf(dp, 'shelf');
  await dp.click('[data-action="reset"]');
  const afterReset = await settle(dp);
  check(
    '"Start over" puts the furniture back and leaves the doors as they were',
    nudged.x === START_LAYOUT.shelf.x + 5 && allAt(afterReset.pieces, START_LAYOUT) && JSON.stringify(await doorsOf(dp)) === '{"entrance":false,"bathroom":true,"balcony":false}',
    JSON.stringify({ nudged, doors: await doorsOf(dp) }),
  );

  // The same game full screen, from the button beside "Start over": one game, with everything as it was left.
  const heldPiece = await pieceOf(dp, 'table');
  await dp.click('[data-action="play-full-screen"]');
  await dp.waitForSelector(PLAY, { timeout: 30000 });
  await sleep(300);
  const deskPlay = await dp.evaluate((play) => {
    const dialog = document.querySelector(play);
    const box = dialog.getBoundingClientRect();
    return {
      role: dialog.getAttribute('role'),
      modal: dialog.getAttribute('aria-modal'),
      label: dialog.getAttribute('aria-label'),
      covers: box.top === 0 && box.left === 0 && Math.round(box.width) === innerWidth && Math.abs(box.height - innerHeight) <= 1,
      games: document.querySelectorAll('[data-testid="room-fit"]').length,
      mode: document.querySelector('[data-testid="room-fit"]').dataset.mode,
      locked: getComputedStyle(document.documentElement).overflow,
      focused: document.activeElement === dialog,
    };
  }, PLAY);
  check(
    'on a desktop the button opens the game full screen as a dialog: it covers the page, stops it scrolling, takes focus, and leaves exactly one game on the page',
    deskPlay.role === 'dialog' && deskPlay.modal === 'true' && deskPlay.label === 'Arrange the room' && deskPlay.covers && deskPlay.games === 1 && deskPlay.mode === 'play' && deskPlay.locked === 'hidden' && deskPlay.focused,
    JSON.stringify(deskPlay),
  );
  const deskGame = await readGame(dp);
  check(
    'it is the same game: the pieces are where they were and the bathroom door is still open',
    allAt(deskGame.pieces, afterReset.pieces) && sameSpot(deskGame.pieces.table, heldPiece) && JSON.stringify(await doorsOf(dp, PLAY)) === '{"entrance":false,"bathroom":true,"balcony":false}',
    JSON.stringify({ doors: await doorsOf(dp, PLAY) }),
  );
  const deskBoard = await inView(dp, `${PLAY} svg[role="group"]`);
  const deskPanel = await inView(dp, `${PLAY} [data-testid="room-fit-panel"]`);
  const deskRail = await inView(dp, `${PLAY} [data-testid="room-fit-rail"]`);
  const deskTurn = await inView(dp, `${PLAY} [data-action="rotate"]`);
  const deskScale = await scaleOf(dp);
  const deskFacts = await dp.evaluate((play) => ({
    layout: document.querySelector('[data-testid="room-fit"]').dataset.layout,
    sheet: document.querySelector(`${play} [data-testid="room-fit-sheet"]`) !== null,
    rules: document.querySelectorAll(`${play} [data-testid="room-fit-panel"] [data-rule]`).length,
    spaces: document.querySelectorAll(`${play} [data-testid="room-fit-panel"] [data-space]`).length,
  }), PLAY);
  check(
    'on a screen wider than it is tall the plan is as tall as the screen, with the buttons beside it and the rules and widths always open in a panel beside them — no sheet to pull up',
    deskFacts.layout === 'wide' && !deskFacts.sheet && deskFacts.rules === 5 && deskFacts.spaces === 7 && [deskBoard, deskPanel, deskRail, deskTurn].every(fitsScreen) && deskScale.x >= 0.8 && deskRail.left >= deskBoard.right - 1 && deskPanel.left >= deskRail.right - 1,
    JSON.stringify({ deskFacts, deskBoard, deskRail, deskPanel, cmPx: deskScale.x }),
  );

  // Focus stays inside a dialog: Tab from the last control goes round to the first, and never out to the page behind.
  let strayed = 0;
  const ringOf = {};
  for (let stop = 0; stop < 60; stop += 1) {
    await dp.keyboard.press('Tab');
    const at = await dp.evaluate((play) => {
      const active = document.activeElement;
      const door = active?.closest?.('[data-door]');
      return { inside: document.querySelector(play).contains(active), door: door?.dataset.door ?? null, ring: door ? getComputedStyle(door.querySelector('rect')).stroke : null };
    }, PLAY);
    if (!at.inside) strayed += 1;
    if (at.door) ringOf[at.door] = at.ring;
  }
  check('Tab never leaves the full-screen game for the page behind it', strayed === 0, `${strayed} of 60 Tab presses landed outside the dialog`);
  // A variant written `focus-visible:[&>rect]:stroke-…` compiles to `.x>rect:focus-visible` — the rect is never focused, so the ring never showed.
  const visibleRing = (colour) => typeof colour === 'string' && colour !== 'none' && !/rgba\(0, 0, 0, 0\)|transparent/.test(colour);
  check(
    'every door shows a ring when the keyboard reaches it (Tab visits the three and the ring is a real colour, not transparent)',
    ['entrance', 'bathroom', 'balcony'].every((id) => visibleRing(ringOf[id])),
    JSON.stringify(ringOf),
  );
  // Shift+Tab goes round the other way and stays inside too.
  let strayedBack = 0;
  await dp.keyboard.down('Shift');
  for (let stop = 0; stop < 40; stop += 1) {
    await dp.keyboard.press('Tab');
    if (!(await dp.evaluate((play) => document.querySelector(play).contains(document.activeElement), PLAY))) strayedBack += 1;
  }
  await dp.keyboard.up('Shift');
  check('Shift+Tab goes round the dialog the other way and never leaves it either', strayedBack === 0, `${strayedBack} of 40 Shift+Tab presses landed outside the dialog`);

  // The page behind is inert: a screen reader does not read it, and neither Tab nor a programmatic focus() reaches a link in it.
  const behind = await dp.evaluate((play) => {
    const app = document.getElementById('root');
    const link = app.querySelector('a[href]');
    link?.focus();
    return { inert: app.inert, linkTookFocus: document.activeElement === link, focusInDialog: document.querySelector(play).contains(document.activeElement) };
  }, PLAY);
  check('the page behind the dialog is inert: no link in it can take focus while the game is up', behind.inert === true && behind.linkTookFocus === false && behind.focusInDialog, JSON.stringify(behind));

  // The Back gesture (Android's button, iOS's swipe) closes the game and stays on the article — it does not leave the page and lose the game.
  const beforeBack = await dp.evaluate(() => ({ path: location.pathname, scroll: Math.round(scrollY), entry: Boolean(history.state?.roomFitPlay) }));
  check('opening the full-screen game pushes a history entry of its own, so Back has something to pop instead of leaving the article', beforeBack.entry === true, JSON.stringify(beforeBack));
  if (beforeBack.entry) {
    await dp.evaluate(() => history.back());
    await dp.waitForFunction((play) => !document.querySelector(play), { timeout: 10000 }, PLAY);
    await sleep(300);
    const afterBack = await dp.evaluate(() => ({
      path: location.pathname,
      scroll: Math.round(scrollY),
      entry: Boolean(history.state?.roomFitPlay),
      live: document.getElementById('root').inert === false,
      game: Boolean(document.querySelector('[data-testid="room-fit"]:not([data-mode="play"])')),
    }));
    check(
      'Back closes the full-screen game and stays on the article — same page, same place in it, the page live again, the game back in the article with its pieces where they were',
      afterBack.path === beforeBack.path && afterBack.scroll === beforeBack.scroll && afterBack.entry === false && afterBack.live && afterBack.game && sameSpot(await pieceOf(dp, 'table'), heldPiece),
      JSON.stringify({ beforeBack, afterBack }),
    );
    await dp.click('[data-action="play-full-screen"]');
    await dp.waitForSelector(PLAY, { timeout: 30000 });
    await sleep(300);
  }

  const scrollBeforeEscape = await scrollOf(dp);
  await dp.keyboard.press('Escape');
  await dp.waitForFunction((play) => !document.querySelector(play), { timeout: 10000 }, PLAY);
  await sleep(300);
  const deskClosed = await dp.evaluate(() => ({
    locked: getComputedStyle(document.documentElement).overflow,
    focus: document.activeElement?.getAttribute('data-action') ?? null,
    mode: document.querySelector('[data-testid="room-fit"]')?.dataset.mode ?? 'inline',
    entry: Boolean(history.state?.roomFitPlay),
    live: document.getElementById('root').inert === false,
    scroll: Math.round(scrollY),
  }));
  check(
    'Escape closes it: the page scrolls again and is live again, the game is back in the article, focus is on the button that opened it, and no history entry of the game is left as the current one, and the reader is where they were in the article',
    deskClosed.scroll === scrollBeforeEscape && deskClosed.locked !== 'hidden' && deskClosed.focus === 'play-full-screen' && deskClosed.mode !== 'play' && deskClosed.entry === false && deskClosed.live && sameSpot((await pieceOf(dp, 'table')), heldPiece),
    JSON.stringify(deskClosed),
  );
  check('no console errors or page errors with the doors and the full-screen game', doorTest.problems.length === 0, doorTest.problems.join(' | '));
  await dp.close();
}
