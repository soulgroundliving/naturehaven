// Behaviour test for the room-arranging game in Design Notes #01.
//
// Starts the Vite dev server, opens the real article in headless Chromium and
// plays the game the way a visitor does: real mouse drags, real touch drags, the
// keyboard, and the on-screen arrow buttons. Complements
// tools/__tests__/roomFit.test.ts, which proves the rules on paper; this proves
// the screen lets you play them.
//
//   npm run test:room-fit
//   TEST_BASE_URL=https://naturehaven-living.vercel.app npm run test:room-fit   (the deployed site, no dev server)
//
//   exit 0  every check passed
//   exit 1  a check failed (each is listed)
//   exit 2  the harness could not run (server or browser did not start)
import { FINAL_PLAN, LIVING, PIECE_IDS, START_LAYOUT, footprintOf, fridgeRectOf, headRectOf } from '../src/lib/roomFit.ts';
import { createChecks, sleep, startHarness } from './lib/dev-harness.mjs';

const { check, finish } = createChecks('room-fit');
const { browser, base, stop } = await startHarness({ label: 'room-fit', port: 4178, probe: '/journal/design-notes-01' });
const ARTICLE = `${base}/journal/design-notes-01`;

const FRAME = '[data-jn-interactive-id="room-fit"]';
const GAME = '[data-testid="room-fit"]';
const BOARD = `${GAME} svg[role="group"]`;
const DESKTOP = { width: 1280, height: 900 };
const PHONE = { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true };

const sameSpot = (a, b) => a.x === b.x && a.y === b.y && a.rot === b.rot;
const allAt = (pieces, layout) => PIECE_IDS.every((id) => sameSpot(pieces[id], layout[id]));
const sameRect = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// The rectangle an SVG <rect> is drawn as, in plan units (cm).
const rectOf = (page, selector) =>
  page.$eval(selector, (el) => {
    const x0 = Number(el.getAttribute('x'));
    const y0 = Number(el.getAttribute('y'));
    return { x0, y0, x1: x0 + Number(el.getAttribute('width')), y1: y0 + Number(el.getAttribute('height')) };
  });

// ── driving the page ─────────────────────────────────────────────────────────
async function openArticle({ lang = 'en', tod = 'day', viewport = DESKTOP } = {}) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  const problems = [];
  page.on('console', (msg) => {
    // A failed download is reported below with its URL; the browser's own console line does not name it.
    if (msg.type() === 'error' && !msg.text().startsWith('Failed to load resource')) problems.push(`console.error: ${msg.text().slice(0, 200)}`);
  });
  page.on('pageerror', (err) => problems.push(`pageerror: ${err.message.slice(0, 200)}`));
  page.on('response', (res) => {
    // Vercel's analytics script exists only once deployed, so a plain static server 404s it on every page.
    if (res.status() >= 400 && !new URL(res.url()).pathname.startsWith('/_vercel/')) problems.push(`${res.status()} ${res.url()}`);
  });
  await page.goto(`${ARTICLE}?lang=${lang}&tod=${tod}`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector(FRAME, { timeout: 60000 });
  return { page, problems };
}

const readGame = (page) =>
  page.evaluate(() => {
    const root = document.querySelector('[data-testid="room-fit"]');
    const text = (selector) => root.querySelector(selector)?.textContent.trim() ?? null;
    return {
      passed: Number(root.dataset.rulesPassed),
      won: root.dataset.won === 'true',
      settled: root.dataset.settled === 'true',
      selected: root.dataset.selected,
      progress: text('[data-testid="room-fit-progress"]'),
      verdict: text('[data-testid="room-fit-verdict"]'),
      walkDetail: text('[data-rule="walk"] [data-rule-detail]'),
      rules: Object.fromEntries([...root.querySelectorAll('[data-rule]')].map((li) => [li.dataset.rule, li.dataset.ok === 'true'])),
      pieces: Object.fromEntries(
        [...root.querySelectorAll('[data-piece]')].map((g) => [g.dataset.piece, { x: Number(g.dataset.x), y: Number(g.dataset.y), rot: Number(g.dataset.rot) }]),
      ),
    };
  });

const pieceOf = (page, id) =>
  page.evaluate((pieceId) => {
    const g = document.querySelector(`[data-piece="${pieceId}"]`);
    return { x: Number(g.dataset.x), y: Number(g.dataset.y), rot: Number(g.dataset.rot) };
  }, id);

// The rules re-check a moment after a move (the route search is deferred so dragging stays smooth),
// so wait until the screen has said the same thing twice in a row.
async function settle(page) {
  let last = '';
  for (let i = 0; i < 100; i += 1) {
    const now = await readGame(page);
    const json = JSON.stringify(now);
    if (now.settled && json === last) return now;
    last = json;
    await sleep(100);
  }
  throw new Error('the game never settled');
}

// Bring the whole board into view. It must not need to scroll again mid-drag, or the pointer would slide over the plan.
async function showBoard(page) {
  const fits = await page.evaluate((selector) => {
    const board = document.querySelector(selector);
    board.scrollIntoView({ block: 'center', behavior: 'instant' });
    const box = board.getBoundingClientRect();
    return box.top >= 0 && box.bottom <= innerHeight;
  }, BOARD);
  if (!fits) throw new Error('the whole board does not fit in the viewport');
}

// Scroll to the frame; the game loads when it is near. Returns the settled starting state.
async function startGame(page) {
  await page.evaluate((selector) => document.querySelector(selector).scrollIntoView({ block: 'center', behavior: 'instant' }), FRAME);
  await page.waitForSelector(GAME, { timeout: 60000 });
  await showBoard(page);
  return settle(page);
}

const scaleOf = (page) =>
  page.evaluate((selector) => {
    const matrix = document.querySelector(selector).getScreenCTM();
    return { x: matrix.a, y: matrix.d };
  }, BOARD);

// A point on the piece that no other piece covers, in viewport pixels.
async function grabPoint(page, id) {
  const at = await page.evaluate((pieceId) => {
    const box = document.querySelector(`[data-piece="${pieceId}"] rect`).getBoundingClientRect();
    for (const [fx, fy] of [[0.5, 0.5], [0.25, 0.5], [0.75, 0.5], [0.5, 0.25], [0.5, 0.75], [0.25, 0.25], [0.75, 0.75]]) {
      const x = box.left + box.width * fx;
      const y = box.top + box.height * fy;
      if (document.elementFromPoint(x, y)?.closest('[data-piece]')?.dataset.piece === pieceId) return { x, y };
    }
    return null;
  }, id);
  if (!at) throw new Error(`no uncovered point on the ${id}`);
  return at;
}

// Drag by (dx, dy) centimetres with the mouse.
async function dragBy(page, id, dxCm, dyCm) {
  const from = await grabPoint(page, id);
  const scale = await scaleOf(page);
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(from.x + dxCm * scale.x, from.y + dyCm * scale.y, { steps: 12 });
  await page.mouse.up();
}

// A real touch: down, a run of moves, up — through the same input pipeline a phone uses.
async function touchDrag(page, from, to) {
  const cdp = await page.createCDPSession();
  const send = (type, touchPoints) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints });
  await send('touchStart', [{ x: from.x, y: from.y }]);
  for (let i = 1; i <= 12; i += 1) {
    await send('touchMove', [{ x: from.x + ((to.x - from.x) * i) / 12, y: from.y + ((to.y - from.y) * i) / 12 }]);
    await sleep(16);
  }
  await send('touchEnd', []);
  await sleep(400); // let a scroll the browser took over finish
  await cdp.detach();
}

// Select a piece, turn it to the plan's direction, then drag it onto the plan's spot.
async function placeLikeThePlan(page, id) {
  const want = FINAL_PLAN[id];
  await showBoard(page);
  const at = await grabPoint(page, id);
  await page.mouse.click(at.x, at.y); // selects, and focuses, the piece
  for (let turns = 0; turns < 3 && (await pieceOf(page, id)).rot !== want.rot; turns += 1) {
    await page.keyboard.press('r');
    await sleep(60);
  }
  const now = await pieceOf(page, id);
  await dragBy(page, id, want.x - now.x, want.y - now.y);
}

const scrollOf = (page) => page.evaluate(() => Math.round(scrollY));

// Keyboard focus, as Tab would give it. (page.focus() only accepts HTML elements; the pieces are SVG groups.)
const focusPiece = (page, id) => page.evaluate((pieceId) => document.querySelector(`[data-piece="${pieceId}"]`).focus(), id);

try {
  // Warm-up: the first dev request compiles the game's chunk and can trigger a dependency reload.
  const warm = await openArticle();
  await startGame(warm.page);
  await warm.page.close();

  // ── 1. desktop, English, mouse ──────────────────────────────────────────────
  const { page, problems } = await openArticle();

  const before = await page.evaluate((frame) => {
    const el = document.querySelector(frame);
    return { state: el.dataset.jnInteractiveState, loaded: Boolean(document.querySelector('[data-testid="room-fit"]')), text: el.textContent };
  }, FRAME);
  check(
    'the game is not loaded while far from the viewport, and its rules are already on the page as text',
    before.state === 'static' && !before.loaded && before.text.includes('25.2 sqm') && before.text.includes('120 cm beside the bed'),
    JSON.stringify({ state: before.state, loaded: before.loaded }),
  );

  const start = await startGame(page);
  const frameState = await page.$eval(FRAME, (el) => el.dataset.jnInteractiveState);
  check('the game loads on demand once it is near the viewport', frameState === 'live', frameState);
  check(
    'it starts with everything fitting and the room not working: 2 of 5, walkway failing',
    start.passed === 2 && start.won === false && start.rules.fit === true && start.rules.walk === false && start.progress === '2 of 5 rules hold',
    JSON.stringify(start),
  );
  check('the five rules are listed in the order the article gives them', Object.keys(start.rules).join() === 'fit,doors,walk,use,bed', Object.keys(start.rules).join());
  check('the five pieces start where the game says', allAt(start.pieces, START_LAYOUT), JSON.stringify(start.pieces));
  const routes = await page.$$eval('[data-testid="room-fit-route"]', (lines) => lines.map((l) => ({ points: l.getAttribute('points').split(' ').length, cls: l.getAttribute('class') })));
  check(
    'a route is drawn to the bathroom and to the balcony, red while the walkway fails',
    routes.length === 2 && routes.every((r) => r.points >= 5 && r.cls.includes('stroke-destructive')),
    JSON.stringify(routes),
  );

  // Directions come from the article's own compass (slide 3: S at the top of the plan, N at the bottom).
  const compass = await page.$$eval('[data-testid="room-fit-compass"] text', (nodes) =>
    nodes.map((n) => ({ letter: n.textContent.trim(), x: Number(n.getAttribute('x')), y: Number(n.getAttribute('y')) })),
  );
  const letterAt = Object.fromEntries(compass.map((c) => [c.letter, c]));
  check(
    'a compass rose sits on the plan the way slide 3 draws it: S at the top, N at the bottom, east on the left, west on the right',
    compass.length === 4 && letterAt.S?.y < letterAt.N?.y && letterAt.E?.x < letterAt.W?.x,
    JSON.stringify(compass),
  );
  // The plan shows a single-door fridge at one end of the kitchen unit, and the bed with its head against a wall.
  const fridgeAtStart = await rectOf(page, '[data-piece="kitchen"] [data-part="fridge"]').catch(() => null);
  const headAtStart = await rectOf(page, '[data-piece="bed"] [data-part="head"]').catch(() => null);
  check(
    'the kitchen unit is drawn with its fridge at one end, and the bed with its head bar',
    sameRect(fridgeAtStart, fridgeRectOf('kitchen', START_LAYOUT.kitchen)) && sameRect(headAtStart, headRectOf(START_LAYOUT.bed)),
    JSON.stringify({ fridgeAtStart, headAtStart }),
  );

  // Dragging every piece onto the final plan wins.
  for (const id of ['table', 'kitchen', 'shelf', 'closet', 'bed']) await placeLikeThePlan(page, id);
  const solved = await settle(page);
  check('every piece lands exactly on the plan (dropped on the 5 cm grid)', allAt(solved.pieces, FINAL_PLAN), JSON.stringify(solved.pieces));
  check(
    'with the plan in place all five rules hold and the verdict says so',
    solved.passed === 5 && solved.won && Object.values(solved.rules).every(Boolean) && solved.progress === '5 of 5 rules hold' && solved.verdict.startsWith('All five hold'),
    JSON.stringify(solved),
  );
  check('the walkway rule prints the true narrowest gap (105 cm: bed to the row of units)', solved.walkDetail === 'narrowest 105 cm', String(solved.walkDetail));
  const routeColours = await page.$$eval('[data-testid="room-fit-route"]', (lines) => lines.map((l) => l.getAttribute('class')));
  check('the routes turn green once the walkway holds', routeColours.length === 2 && routeColours.every((c) => c.includes('stroke-sage-green')), JSON.stringify(routeColours));
  // As on the plan (slides 4 and 7), the fridge end of the kitchen unit is the end next to the table, and the shelf is last, by the door.
  const fridgeSolved = await rectOf(page, '[data-piece="kitchen"] [data-part="fridge"]').catch(() => null);
  check(
    'in the final plan the fridge is at the table end of the kitchen unit and the shelf is beside the front door, as drawn',
    fridgeSolved !== null && fridgeSolved.y0 === footprintOf('table', FINAL_PLAN.table).y1 && footprintOf('shelf', solved.pieces.shelf).y1 === 715,
    JSON.stringify({ fridgeSolved, shelf: solved.pieces.shelf }),
  );

  // Break ONLY the walkway: the bed 65 cm nearer the top wall leaves 85 cm between them (to the balcony door),
  // and every quick rule still passes.
  // Right after letting go, the one thing between the visitor and a false "you win" is that the game
  // has not measured the walkway yet — it must say so rather than quote the score it had.
  await showBoard(page);
  await dragBy(page, 'bed', 0, -65);
  const unchecked = await readGame(page);
  check(
    'right after a move the game does not claim a win it has not checked',
    !unchecked.won && unchecked.progress !== '5 of 5 rules hold' && !unchecked.verdict.startsWith('All five hold'),
    JSON.stringify(unchecked),
  );
  const narrowed = await settle(page);
  check(
    'once measured it says which rule broke: only the walkway, at 85 cm',
    narrowed.rules.walk === false && narrowed.passed === 4 && narrowed.walkDetail === 'narrowest 85 cm',
    JSON.stringify(narrowed),
  );
  await dragBy(page, 'bed', 0, 65);
  const restored = await settle(page);
  check('moving it back wins again', restored.won && restored.passed === 5 && allAt(restored.pieces, FINAL_PLAN), JSON.stringify(restored));

  // One drag can undo it.
  await showBoard(page);
  await dragBy(page, 'bed', 75, 0);
  const broken = await settle(page);
  check(
    'sliding the bed into the middle breaks the walkway rule and takes the win away',
    broken.rules.walk === false && broken.won === false && broken.passed < 5 && broken.walkDetail === 'narrowest 75 cm',
    JSON.stringify(broken),
  );

  // "Show our plan" draws the outlines, states the plan's own number, and survives a reset.
  await page.click('[data-action="toggle-plan"]');
  const ghost = await page.evaluate(() => {
    const toggle = document.querySelector('[data-action="toggle-plan"]');
    return {
      outlines: document.querySelectorAll('[data-testid="room-fit-ghost"] rect').length,
      caption: document.querySelector('[data-testid="room-fit-our-plan"]')?.textContent ?? '',
      label: toggle.textContent.trim(),
      hasPressed: toggle.hasAttribute('aria-pressed'), // a button whose LABEL changes must not also carry a pressed state
      directions: [...document.querySelectorAll('[data-testid="room-fit-our-plan-directions"] li')].map((li) => li.textContent.trim()),
      labels: [...document.querySelectorAll('[data-testid="room-fit-ghost"] text')].map((t) => t.textContent.trim()),
    };
  });
  // Four pieces are on their spots and only the bed is not: a ghost label printed over a piece's own caption comes out garbled.
  check('the plan outline is labelled only where a piece is NOT yet on its spot (here: just the bed)', JSON.stringify(ghost.labels) === JSON.stringify(['Bed']), JSON.stringify(ghost.labels));
  check(
    '"Show our plan" states which way each piece faces, in the article\'s compass: the bed\'s head east, the closet south, the right-wall units east',
    JSON.stringify(ghost.directions) ===
      JSON.stringify([
        'Bed — Head towards the east (the left wall)',
        'Closet — Faces south (the balcony end)',
        'Table — Faces east (the left wall)',
        'Kitchen — Faces east (the left wall)',
        'Shelf — Faces east (the left wall)',
      ]),
    JSON.stringify(ghost.directions),
  );
  check(
    '"Show our plan" outlines the five pieces, states the plan\'s own walkway, and its label — not aria-pressed — carries the state',
    ghost.outlines === 5 && ghost.label === 'Hide our plan' && ghost.hasPressed === false && /narrowest walkway 105 cm/.test(ghost.caption),
    JSON.stringify(ghost),
  );
  await page.click('[data-action="reset"]');
  const reset = await settle(page);
  const ghostAfterReset = await page.$('[data-testid="room-fit-ghost"]');
  check('"Start over" puts every piece back and returns to 2 of 5', allAt(reset.pieces, START_LAYOUT) && reset.passed === 2 && !reset.won, JSON.stringify(reset));
  check('"Start over" keeps the plan outline the visitor asked to see, now labelled on all five pieces', ghostAfterReset !== null && (await page.$$('[data-testid="room-fit-ghost"] text')).length === 5);
  await page.click('[data-action="toggle-plan"]');
  check('hiding the plan removes the outlines and the caption', (await page.$('[data-testid="room-fit-ghost"]')) === null && (await page.$('[data-testid="room-fit-our-plan"]')) === null);

  // Pieces stop at the walls, and letting go outside the board ends the drag.
  await showBoard(page);
  const grip = await grabPoint(page, 'shelf');
  await page.mouse.move(grip.x, grip.y);
  await page.mouse.down();
  await page.mouse.move(DESKTOP.width - 4, DESKTOP.height - 4, { steps: 8 });
  await page.mouse.up();
  const cornered = footprintOf('shelf', await pieceOf(page, 'shelf'));
  check('a piece dragged past the walls stops against them', cornered.x1 === LIVING.x1 && cornered.y1 === LIVING.y1, JSON.stringify(cornered));
  const parked = await pieceOf(page, 'shelf');
  // A drag that never ended would carry the piece along when the pointer next passes over it — so pass over it.
  const parkedAt = await grabPoint(page, 'shelf');
  await page.mouse.move(parkedAt.x - 60, parkedAt.y - 60, { steps: 4 });
  await page.mouse.move(parkedAt.x, parkedAt.y, { steps: 6 });
  await page.mouse.move(parkedAt.x - 40, parkedAt.y - 90, { steps: 6 });
  check('letting go outside the board ends the drag — the piece does not follow the pointer back over it', sameSpot(await pieceOf(page, 'shelf'), parked));

  check('no console errors or page errors while playing with the mouse', problems.length === 0, problems.join(' | '));
  await page.close();

  // ── 2. dragging stays cheap: the walkway is measured when the piece stops ───
  // The route search is heavy on a mid-range phone (100-250 ms). Run for every 5 cm of a drag it
  // would keep the main thread busy for most of the drag, so it waits for a pause.
  const cheap = await openArticle();
  const cp = cheap.page;
  await startGame(cp);
  const routeCount = (target) => target.$$eval('[data-testid="room-fit-route"]', (lines) => lines.length);
  const startRoutes = await routeCount(cp);

  const hold = await grabPoint(cp, 'bed');
  const cheapScale = await scaleOf(cp);
  await cp.mouse.move(hold.x, hold.y);
  await cp.mouse.down();
  for (let step = 1; step <= 30; step += 1) {
    await cp.mouse.move(hold.x, hold.y - (150 * cheapScale.y * step) / 30); // slide the bed 150 cm up, over the table
    await sleep(25);
  }
  const held = await readGame(cp); // still holding: well inside the pause the game waits for
  check(
    'while a piece is held the quick rules keep up with it: the bed over the table breaks "nothing overlaps" at once',
    held.rules.fit === false && held.settled === false,
    JSON.stringify(held),
  );
  check(
    'while a piece is held the walking route steps aside instead of being re-measured for every move',
    startRoutes === 2 && (await routeCount(cp)) === 0,
    `routes: ${startRoutes} at the start, ${await routeCount(cp)} while held`,
  );
  check('while a piece is held the header does not quote a score it has not checked', held.progress === 'checking…' && !held.won, JSON.stringify(held));
  await cp.mouse.up();
  const released = await settle(cp);
  check(
    'once the piece stops the walkway is measured and the route comes back',
    (await routeCount(cp)) === 2 && /^narrowest \d+ cm$/.test(released.walkDetail) && /^\d of 5 rules hold$/.test(released.progress),
    JSON.stringify(released),
  );
  check('no console errors or page errors while dragging under load', cheap.problems.length === 0, cheap.problems.join(' | '));
  await cp.close();

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
    a11y.count === 5 && a11y.buttons && a11y.described && a11y.labelled && a11y.board === 'Plan of the 25.2 sqm room, in centimetres' && a11y.live === 'polite' && a11y.announcer === 'polite',
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
    }));
  const shelfNote = await readSelected();
  check(
    'the selected piece is described (the shelf: a shoe rack below, storage above) and the way it faces is stated',
    shelfNote.note === 'Shoe rack in the lower half, storage above · 240 cm tall' && shelfNote.facing === 'Faces north (the front-door end)',
    JSON.stringify(shelfNote),
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

  // ── 4. language: Thai, and switching mid-game ───────────────────────────────
  const lang = await openArticle({ lang: 'en' });
  const lp = lang.page;
  await startGame(lp);
  await focusPiece(lp, 'shelf');
  await lp.keyboard.down('Shift');
  await lp.keyboard.press('ArrowUp');
  await lp.keyboard.up('Shift');
  const english = await settle(lp);
  await lp.evaluate(() => document.querySelector('button[aria-label="Switch language"]').click());
  await sleep(400);
  const thai = await settle(lp);
  const thaiText = await lp.evaluate(() => ({
    board: document.querySelector('svg[role="group"]')?.getAttribute('aria-label'),
    walkLabel: document.querySelector('[data-rule="walk"] p')?.textContent ?? '',
    shelf: document.querySelector('[data-piece="shelf"]')?.getAttribute('aria-label') ?? '',
    note: document.querySelector('[data-testid="room-fit-selected-note"] p')?.textContent.trim() ?? '',
    facing: document.querySelector('[data-testid="room-fit-facing"]')?.textContent.trim() ?? '',
    fridge: document.querySelector('[data-piece="kitchen"] [data-part="fridge"] + text')?.textContent.trim() ?? '',
  }));
  check(
    'switching to Thai retitles the game and keeps every piece where the visitor put it',
    thai.progress === `ผ่าน ${english.passed} จาก 5 ข้อ` && thaiText.board.startsWith('แปลนห้อง 25.2 ตร.ม.') && thaiText.walkLabel.includes('ทางเดินกว้างอย่างน้อย 90 ซม.') && thaiText.shelf.includes('ห่างผนังซ้าย') && allAt(thai.pieces, english.pieces),
    JSON.stringify({ progress: thai.progress, ...thaiText }),
  );
  check(
    'in Thai the shelf is described (shoe rack below, storage above), its direction is stated by the compass, and the fridge is labelled',
    thaiText.note === 'ตู้รองเท้าครึ่งล่าง ที่เก็บของครึ่งบน สูง 240 ซม.' && thaiText.facing === 'หันหน้าไปทางทิศเหนือ (ฝั่งประตูห้อง)' && thaiText.shelf.includes('หันหน้าไปทางทิศเหนือ') && thaiText.fridge === 'ตู้เย็น',
    JSON.stringify(thaiText),
  );
  check('no console errors or page errors switching language', lang.problems.length === 0, lang.problems.join(' | '));
  await lp.close();

  // ── 5. a phone: a finger drags a piece, and the page stays put ──────────────
  const phone = await openArticle({ viewport: PHONE });
  const pp = phone.page;
  await startGame(pp);
  const overflow = await pp.evaluate(() => ({ page: document.documentElement.scrollWidth, window: innerWidth, board: Math.round(document.querySelector('svg[role="group"]').getBoundingClientRect().width) }));
  check('on a 390 px phone the game fits: no sideways scrolling, board narrower than the screen', overflow.page <= overflow.window && overflow.board <= overflow.window, JSON.stringify(overflow));

  await showBoard(pp);
  const fingerFrom = await pieceOf(pp, 'shelf');
  const grabbed = await grabPoint(pp, 'shelf');
  const phoneScale = await scaleOf(pp);
  const scrollBefore = await scrollOf(pp);
  await touchDrag(pp, grabbed, { x: grabbed.x + 40 * phoneScale.x, y: grabbed.y - 20 * phoneScale.y });
  const fingerTo = await pieceOf(pp, 'shelf');
  check(
    'a finger drags a piece by exactly as far as it moved, and the page does not scroll under it',
    fingerTo.x === fingerFrom.x + 40 && fingerTo.y === fingerFrom.y - 20 && (await scrollOf(pp)) === scrollBefore,
    JSON.stringify({ fingerFrom, fingerTo, scrollBefore, scrollAfter: await scrollOf(pp) }),
  );
  await pp.tap('[data-action="nudge-right"]');
  const tapped = await pieceOf(pp, 'shelf');
  check('a tap on an arrow button moves the selected piece 5 cm — once, not twice', tapped.x === fingerTo.x + 5, JSON.stringify({ fingerTo, tapped }));

  // The guard must be selective: a swipe that starts on empty floor still scrolls the article.
  await showBoard(pp);
  const floor = await pp.evaluate((board) => {
    const matrix = document.querySelector(board).getScreenCTM();
    const at = { x: matrix.e + 300 * matrix.a, y: matrix.f + 250 * matrix.d }; // free floor in every layout this test reaches
    return { ...at, onPiece: document.elementFromPoint(at.x, at.y)?.closest('[data-piece]') !== null };
  }, BOARD);
  if (floor.onPiece) throw new Error('the spot chosen as empty floor has a piece on it');
  const swipeFrom = await scrollOf(pp);
  await touchDrag(pp, floor, { x: floor.x, y: floor.y - 200 });
  const swiped = (await scrollOf(pp)) - swipeFrom;
  check('a swipe that starts on empty floor still scrolls the page — the board is not a scroll trap', swiped > 100, `scrolled ${swiped}px`);
  check('no console errors or page errors on the phone', phone.problems.length === 0, phone.problems.join(' | '));
  await pp.close();

  // ── 6. night: the selection and the pieces stay visible against a dark floor ─
  // Fixed dark, the selection ring measured 1.3:1 against the night floor (3:1 is the floor for a
  // focus indicator), and a piece's edge 1.4-1.9:1. Both now follow the theme's text colour.
  const luminance = (colour) => {
    const [r, g, b] = colour
      .match(/\d+(\.\d+)?/g)
      .slice(0, 3)
      .map((channel) => {
        const c = Number(channel) / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
      });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const strokes = async (tod) => {
    const themed = await openArticle({ tod });
    await startGame(themed.page);
    await focusPiece(themed.page, 'kitchen');
    await sleep(900); // the theme's colours ease over 600 ms
    const found = await themed.page.evaluate(() => {
      const ring = getComputedStyle(document.querySelector('[data-testid="room-fit-selection"]'));
      const piece = getComputedStyle(document.querySelector('[data-piece="bed"] rect'));
      return { ring: ring.stroke, piece: piece.stroke, pieceOpacity: piece.strokeOpacity };
    });
    await themed.page.close();
    return found;
  };
  const dayStrokes = await strokes('day');
  const nightStrokes = await strokes('night');
  check(
    'the selection ring follows the theme: dark by day, light at night',
    luminance(dayStrokes.ring) < 0.2 && luminance(nightStrokes.ring) > 0.6,
    JSON.stringify({ dayStrokes, nightStrokes }),
  );
  check(
    'every piece is outlined in the theme\'s text colour, so its edge shows against the floor in both themes',
    luminance(dayStrokes.piece) < 0.2 && luminance(nightStrokes.piece) > 0.6 && Number(nightStrokes.pieceOpacity) >= 0.6,
    JSON.stringify({ dayStrokes, nightStrokes }),
  );
} catch (error) {
  check('the test run completed', false, error.stack ?? String(error));
} finally {
  await stop();
}

finish();
