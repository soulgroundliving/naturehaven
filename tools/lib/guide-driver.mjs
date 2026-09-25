// The page-driving half of the guided-reading browser test (tools/test-journal-guide.mjs and tools/guide/*.mjs):
// open Design Notes #01 with the reader on, read what the screen says, tap and drag the way a phone does.
// Nothing here asserts anything - the checks live in the sections.
import { sleep } from './dev-harness.mjs';

export const VIEWPORTS = {
  phone: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  smallPhone: { width: 375, height: 667, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  tinyPhone: { width: 320, height: 568, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  landscape: { width: 844, height: 390, deviceScaleFactor: 2, isMobile: true, hasTouch: true, isLandscape: true },
  tablet: { width: 768, height: 1024, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  desktop: { width: 1280, height: 900 },
};

export const DIALOG = '[data-testid="journal-guide"]';
const PAGE = `${DIALOG} [data-testid="guide-page"]`;
const GAME = `${DIALOG} [data-testid="room-fit"][data-mode="play"]`;

export function createGuideDriver({ browser, base }) {
  // A page on the article. `query` is everything after the ? except lang and tod, which are always set so a
  // run never depends on the clock or the browser's language.
  async function open({ query = 'guide', lang = 'en', tod = 'day', viewport = VIEWPORTS.phone, slug = 'design-notes-01', prepare } = {}) {
    const page = await browser.newPage();
    await page.setViewport(viewport);
    if (prepare) await prepare(page); // before the first request: to block a file, say
    const problems = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' && !msg.text().startsWith('Failed to load resource')) problems.push(`console.error: ${msg.text().slice(0, 200)}`);
    });
    page.on('pageerror', (err) => problems.push(`pageerror: ${err.message.slice(0, 200)}`));
    page.on('response', (res) => {
      if (res.status() >= 400 && !new URL(res.url()).pathname.startsWith('/_vercel/')) problems.push(`${res.status()} ${res.url()}`);
    });
    await page.goto(`${base}/journal/${slug}?${query ? `${query}&` : ''}lang=${lang}&tod=${tod}`, { waitUntil: 'domcontentloaded' });
    return { page, problems };
  }

  async function openGuide(options) {
    const session = await open(options);
    await session.page.waitForSelector(DIALOG, { timeout: 60000 });
    await sleep(300); // the first paint of the sheet and the plan
    return session;
  }

  // What the reader says it is showing.
  const read = (page) =>
    page.evaluate(
      ({ dialog, pageSelector }) => {
        const root = document.querySelector(dialog);
        if (!root) return null;
        const main = root.querySelector(pageSelector);
        const card = root.querySelector('[data-testid="guide-card"]');
        const scroll = root.querySelector('[data-testid="guide-card-scroll"]');
        const picture = root.querySelector('[data-testid="guide-picture"]');
        const box = (el) => {
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height), bottom: Math.round(r.bottom), right: Math.round(r.right) };
        };
        const tabs = [...root.querySelectorAll('[data-action="guide-jump"]')];
        const counter = root.querySelector('[data-testid="guide-page-label"]');
        return {
          index: Number(main.dataset.index),
          stage: main.dataset.stage,
          // "03 / 08" is what a sighted reader sees (and a screen reader is spared); `announced` is what it hears instead.
          label: counter.querySelector('[data-testid="guide-page-counter"]').textContent.split('·')[0].trim(),
          seenAria: counter.querySelector('[data-testid="guide-page-counter"]').getAttribute('aria-hidden'),
          announced: counter.querySelector('[data-testid="guide-page-announcement"]').textContent.trim(),
          live: counter.getAttribute('aria-live'),
          atomic: counter.getAttribute('aria-atomic'),
          counterId: counter.id,
          tabs: tabs.length,
          selectedTab: tabs.findIndex((t) => t.getAttribute('aria-current') === 'step'),
          tabStops: tabs.filter((t) => t.tabIndex >= 0).length,
          filledTabs: tabs.filter((t) => parseFloat(getComputedStyle(t.firstElementChild).borderTopWidth) === 3).length,
          backDisabled: root.querySelector('[data-action="guide-back"]').getAttribute('aria-disabled') === 'true',
          nextDisabled: root.querySelector('[data-action="guide-next"]').getAttribute('aria-disabled') === 'true',
          title: card?.querySelector('h2')?.textContent.trim() ?? null,
          cardText: card?.innerText ?? '',
          cardImages: card ? card.querySelectorAll('img').length : 0,
          card: box(card),
          picture: box(picture),
          pictureImg: picture?.querySelector('img')?.getAttribute('src') ?? null,
          pictureBadge: picture?.innerText ?? '',
          scroll: scroll ? { top: Math.round(scroll.scrollTop), height: scroll.scrollHeight, client: scroll.clientHeight, masked: Boolean(scroll.style.maskImage || scroll.style.webkitMaskImage) } : null,
          hint: [...root.querySelectorAll('p')].find((p) => p.className.includes('bg-dark-charcoal'))?.textContent.trim() ?? null,
          picLabel: root.querySelector('[data-testid="guide-picture"] svg')?.getAttribute('aria-label') ?? null,
          picRole: root.querySelector('[data-testid="guide-picture"] svg')?.getAttribute('role') ?? null,
          dialogLang: root.getAttribute('lang'),
          describedBy: root.getAttribute('aria-describedby'),
          touchAction: getComputedStyle(root).touchAction,
          bars: { back: box(root.querySelector('[data-action="guide-back"]')), next: box(root.querySelector('[data-action="guide-next"]')), close: box(root.querySelector('[data-action="guide-close"]')) },
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth,
          innerHeight,
          hasGame: Boolean(root.querySelector('[data-testid="room-fit"][data-mode="play"]')),
        };
      },
      { dialog: DIALOG, pageSelector: '[data-testid="guide-page"]' },
    );

  // Move through the pages the way a reader does: the buttons, or a tap on the bar.
  const next = async (page) => {
    await page.click(`${DIALOG} [data-action="guide-next"]`);
    await sleep(160);
  };
  const back = async (page) => {
    await page.click(`${DIALOG} [data-action="guide-back"]`);
    await sleep(160);
  };
  const jump = async (page, index) => {
    await page.click(`${DIALOG} [data-action="guide-jump"][data-index="${index}"]`);
    await sleep(160);
  };
  async function goTo(page, index) {
    for (let i = 0; i < 10; i += 1) {
      const now = await read(page);
      if (now.index === index) return now;
      await (now.index < index ? next : back)(page);
    }
    throw new Error(`could not reach page ${index}`);
  }

  // The doors of the plan on the constraints page, as the screen says they stand.
  const doorsOf = (page) => page.$$eval(`${DIALOG} [data-door]`, (els) => Object.fromEntries(els.map((el) => [el.dataset.door, el.dataset.open === 'true'])));
  const doorLabels = (page) => page.$$eval(`${DIALOG} [data-door]`, (els) => Object.fromEntries(els.map((el) => [el.dataset.door, el.getAttribute('aria-label')])));

  // The middle of a door's tappable area in viewport pixels, refusing to answer if something else is on top of it there.
  async function doorPoint(page, id) {
    const at = await page.evaluate(
      ({ dialog, door }) => {
        const box = document.querySelector(`${dialog} [data-door="${door}"] rect`).getBoundingClientRect();
        const x = box.left + box.width / 2;
        const y = box.top + box.height / 2;
        return document.elementFromPoint(x, y)?.closest('[data-door]')?.dataset.door === door ? { x, y, w: box.width, h: box.height } : null;
      },
      { dialog: DIALOG, door: id },
    );
    if (!at) throw new Error(`the ${id} door is covered at its middle`);
    return at;
  }

  // The whole marker drawn round a door, in viewport pixels, and a point just inside its corner - well away from
  // the band the door's own button covers, so a tap there proves the marker itself answers.
  async function doorMarker(page, id) {
    const box = await page.$eval(`${DIALOG} [data-door-target="${id}"]`, (el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left, y: r.top, w: r.width, h: r.height };
    });
    // The far side from the wall: the door's own button lies along the wall, so the free end of the marker is the far one.
    const corner = { x: box.x + box.w * 0.18, y: box.y + box.h * (id === 'entrance' ? 0.14 : 0.86) };
    const covered = await page.evaluate(({ x, y, door, dialog }) => document.elementFromPoint(x, y)?.getAttribute('data-door-target') === door && Boolean(document.querySelector(dialog)), { ...corner, door: id, dialog: DIALOG });
    return { ...box, corner, corner_is_marker: covered };
  }

  // A real tap: touch down and up through the same pipeline a phone uses.
  async function tap(page, point) {
    const cdp = await page.createCDPSession();
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: point.x, y: point.y }] });
    await sleep(40);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await cdp.detach();
    await sleep(160);
  }

  // The game on the "try it" page.
  const gamePieces = (page) =>
    page.$$eval(`${GAME} [data-piece]`, (els) => Object.fromEntries(els.map((g) => [g.dataset.piece, { x: Number(g.dataset.x), y: Number(g.dataset.y), rot: Number(g.dataset.rot) }])));
  const pieceMiddle = (page, id) =>
    page.evaluate(
      ({ game, piece }) => {
        const box = document.querySelector(`${game} [data-piece="${piece}"] rect`).getBoundingClientRect();
        return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
      },
      { game: GAME, piece: id },
    );

  // How many screen pixels one centimetre of the game's plan is drawn as.
  const boardScale = (page) => page.$eval(`${GAME} svg[role="group"]`, (svg) => svg.getScreenCTM().a);

  async function touchDrag(page, from, to) {
    const cdp = await page.createCDPSession();
    const send = (type, touchPoints) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints });
    await send('touchStart', [{ x: from.x, y: from.y }]);
    for (let i = 1; i <= 12; i += 1) {
      await send('touchMove', [{ x: from.x + ((to.x - from.x) * i) / 12, y: from.y + ((to.y - from.y) * i) / 12 }]);
      await sleep(16);
    }
    await send('touchEnd', []);
    await sleep(300);
    await cdp.detach();
  }

  return { browser, base, open, openGuide, read, next, back, jump, goTo, doorsOf, doorLabels, doorPoint, doorMarker, tap, gamePieces, pieceMiddle, boardScale, touchDrag, DIALOG, PAGE, GAME };
}
