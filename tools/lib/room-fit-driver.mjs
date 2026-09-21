// The page-driving half of the room-fit browser test (tools/test-room-fit.mjs and tools/room-fit/*.mjs): open the
// article, read the game's state off the screen, drag a piece with a real mouse or a real touch, find the doors,
// measure where things are. Nothing here asserts anything — the checks live in the sections.
import { FINAL_PLAN, PIECE_IDS } from '../../src/lib/roomFit.ts';
import { sleep } from './dev-harness.mjs';

export function createDriver({ browser, base }) {
  const ARTICLE = `${base}/journal/design-notes-01`;

  const FRAME = '[data-jn-interactive-id="room-fit"]';
  const GAME = '[data-testid="room-fit"]';
  const BOARD = `${GAME} svg[role="group"]`;
  const DESKTOP = { width: 1280, height: 900 };
  const PHONE = { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true };

  const sameSpot = (a, b) => a.x === b.x && a.y === b.y && a.rot === b.rot;
  const allAt = (pieces, layout) => PIECE_IDS.every((id) => sameSpot(pieces[id], layout[id]));
  const sameRect = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  // One space as the panel shows it: "closet:90:standard", or with a trailing "!" when it does not meet what the game asks.
  const spaceLine = (s) => `${s.id}:${s.cm}:${s.tier}${s.ok ? '' : '!'}`;
  const spaceOf = (game, id) => game.spaces.find((s) => s.id === id);

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
        // "Room to live in": each space's measured width and the tier it falls in.
        spaces: [...root.querySelectorAll('[data-space]')].map((li) => ({
          id: li.dataset.space,
          cm: Number(li.dataset.cm),
          tier: li.dataset.tier,
          ok: li.dataset.ok === 'true',
          pending: li.dataset.pending === 'true',
          cmText: li.querySelector('[data-testid="space-cm"]')?.textContent.trim() ?? null,
          tierText: li.querySelector('[data-testid="space-tier"]')?.textContent.trim() ?? null,
          shortText: li.querySelector('[data-testid="space-short"]')?.textContent.trim() ?? null,
        })),
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

  // The full-screen game (a dialog over the page). While it is open it is the only game on the page, so the
  // helpers above (readGame, pieceOf, grabPoint, scaleOf) read it just as they read the inline one.
  const PLAY = '[data-testid="room-fit-play"]';

  // Which doors stand open, as the screen says it — within `scope`, the inline game or the full-screen one.
  const doorsOf = (page, scope = GAME) =>
    page.$$eval(`${scope} [data-door]`, (els) => Object.fromEntries(els.map((el) => [el.dataset.door, el.dataset.open === 'true'])));

  // A swinging door's leaf as drawn: from its hinge to its free end, in plan units.
  const leafOf = (page, id, scope = GAME) =>
    page.$eval(`${scope} [data-door="${id}"] line`, (el) => ({ x1: Number(el.getAttribute('x1')), y1: Number(el.getAttribute('y1')), x2: Number(el.getAttribute('x2')), y2: Number(el.getAttribute('y2')) }));

  // The middle of a door's tappable area in viewport pixels — refusing to answer if something else is on top of it there.
  async function doorPoint(page, id, scope = GAME) {
    const at = await page.evaluate(
      ({ within, door }) => {
        const box = document.querySelector(`${within} [data-door="${door}"] rect`).getBoundingClientRect();
        const x = box.left + box.width / 2;
        const y = box.top + box.height / 2;
        return { x, y, top: document.elementFromPoint(x, y)?.closest('[data-door]')?.dataset.door ?? null };
      },
      { within: scope, door: id },
    );
    if (at.top !== id) throw new Error(`the ${id} door is covered where it would be tapped (${at.top ?? 'nothing'} is on top there)`);
    return at;
  }

  // Wait until a scroller has stopped moving (a swipe ends in a fling; a tap during it only stops the fling and sends no click).
  async function scrollSettles(page, selector) {
    let last = -1;
    let still = 0;
    for (let i = 0; i < 80 && still < 4; i += 1) {
      const now = await page.$eval(selector, (el) => el.scrollTop);
      still = now === last ? still + 1 : 0;
      last = now;
      await sleep(60);
    }
  }

  // Where an element is on the screen, in viewport pixels.
  const inView = (page, selector) =>
    page.evaluate((sel) => {
      const box = document.querySelector(sel)?.getBoundingClientRect();
      return box ? { top: Math.round(box.top), bottom: Math.round(box.bottom), left: Math.round(box.left), right: Math.round(box.right), width: Math.round(box.width), height: Math.round(box.height), vh: innerHeight, vw: innerWidth } : null;
    }, selector);
  const fitsScreen = (b) => b !== null && b.top >= 0 && b.bottom <= b.vh && b.left >= 0 && b.right <= b.vw;

  // Would a tap at the element's centre land on it? Being inside the viewport is not enough: a button scrolled out of a
  // clipped column, or covered by something, has a box on the screen and cannot be pressed.
  const hittable = (page, selector) =>
    page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return false;
      const box = el.getBoundingClientRect();
      const top = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
      return top === el || el.contains(top);
    }, selector);

  // Which doors stand open, all shut — as JSON, the way doorsOf() prints them.
  const SHUT = '{"entrance":false,"bathroom":false,"balcony":false}';

  // Every mention of "WELL" in the game, and whether each sits inside the note about where the numbers come from.
  const wellMentions = (target) =>
    target.evaluate((game) => {
      const hits = [...document.querySelector(game).querySelectorAll('*')].filter((el) => [...el.childNodes].some((n) => n.nodeType === 3 && /\bWELL\b/.test(n.textContent)));
      return { total: hits.length, outside: hits.filter((el) => !el.closest('[data-testid="spaces-note"]')).map((el) => el.textContent.slice(0, 80)), note: document.querySelector('[data-testid="spaces-note"]')?.textContent ?? '' };
    }, GAME);

  return { ARTICLE, FRAME, GAME, BOARD, PLAY, DESKTOP, PHONE, SHUT, browser, sameSpot, allAt, sameRect, spaceLine, spaceOf, rectOf, openArticle, readGame, pieceOf, settle, showBoard, startGame, scaleOf, grabPoint, dragBy, touchDrag, placeLikeThePlan, scrollOf, focusPiece, doorsOf, leafOf, doorPoint, scrollSettles, inView, fitsScreen, hittable, wellMentions };
}
