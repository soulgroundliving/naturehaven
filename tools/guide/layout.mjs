// The reader on every kind of screen: nothing spills sideways, the picture gets a real share of the height,
// the card stays below it (or beside it) and inside the screen, a long page says so - and on a screen too small
// to hold both (a desktop zoomed to 400%: 320 CSS px wide) the page scrolls as a whole rather than squeezing
// the plan to nothing.
import { VIEWPORTS } from '../lib/guide-driver.mjs';

// `mode`: stacked = picture over card; wide = side by side; flows = the whole page scrolls (WCAG 1.4.10, reflow).
// `minPicture` is the smallest picture worth having, per screen: a plan under ~150px tall cannot be read.
const SCREENS = [
  { name: 'a phone (390x844)', viewport: VIEWPORTS.phone, minPicture: 330, mode: 'stacked' },
  { name: 'a phone with its browser bars up (390x664)', viewport: { ...VIEWPORTS.phone, height: 664 }, minPicture: 250, mode: 'stacked' },
  { name: 'a small phone (375x667)', viewport: VIEWPORTS.smallPhone, minPicture: 230, mode: 'stacked' },
  { name: 'the smallest phone (320x568)', viewport: VIEWPORTS.tinyPhone, minPicture: 160, mode: 'stacked' },
  { name: 'a tablet (768x1024)', viewport: VIEWPORTS.tablet, minPicture: 420, mode: 'stacked' },
  { name: 'a phone on its side (844x390)', viewport: VIEWPORTS.landscape, minPicture: 240, mode: 'wide' },
  { name: 'the smallest phone on its side (568x320)', viewport: { ...VIEWPORTS.landscape, width: 568, height: 320 }, minPicture: 170, mode: 'wide' },
  { name: 'a desktop zoomed to 200% (640x360)', viewport: { width: 640, height: 360, deviceScaleFactor: 1 }, minPicture: 180, mode: 'wide' },
  { name: 'a desktop (1280x900)', viewport: VIEWPORTS.desktop, minPicture: 560, mode: 'wide' },
  { name: 'a desktop zoomed to 400% (320x256)', viewport: { width: 320, height: 256, deviceScaleFactor: 1 }, minPicture: 300, mode: 'flows' },
  { name: 'a short phone (360x480)', viewport: { ...VIEWPORTS.tinyPhone, width: 360, height: 480 }, minPicture: 300, mode: 'flows' },
];
const PAGES_WITH_WORDS = [0, 1, 2, 3, 4, 5, 7];

export default async function run({ check, driver }) {
  for (const screen of SCREENS) {
    const { page, problems } = await driver.openGuide({ viewport: screen.viewport });
    const trouble = [];
    for (const i of PAGES_WITH_WORDS) {
      const now = await driver.goTo(page, i);
      const at = `page ${i + 1}`;
      if (now.scrollWidth > now.innerWidth) trouble.push(`${at}: scrolls sideways (${now.scrollWidth} > ${now.innerWidth})`);
      if (!now.picture || !now.card) {
        trouble.push(`${at}: no picture or no card`);
        continue;
      }
      if (now.picture.y < 0 || now.picture.h < screen.minPicture) trouble.push(`${at}: the picture is ${now.picture.h}px tall, wanted at least ${screen.minPicture}`);
      if (screen.mode === 'wide' && now.picture.w < 240) trouble.push(`${at}: the picture is ${now.picture.w}px wide beside the card, wanted at least 240`);
      if (screen.mode === 'stacked') {
        if (now.card.bottom > now.innerHeight + 1 || now.card.right > now.innerWidth + 1) trouble.push(`${at}: the card leaves the screen (${now.card.bottom} > ${now.innerHeight})`);
        if (now.picture.bottom > now.card.y + 1) trouble.push(`${at}: the picture runs under the card`);
        if (now.card.h > now.innerHeight * 0.4 + 2) trouble.push(`${at}: the card is ${now.card.h}px, more than 40% of the screen`);
      }
      if (screen.mode === 'wide') {
        if (now.card.bottom > now.innerHeight + 1 || now.card.right > now.innerWidth + 1) trouble.push(`${at}: the card leaves the screen (${now.card.bottom} > ${now.innerHeight})`);
        if (now.card.x < now.picture.right - 1) trouble.push(`${at}: the card is not beside the picture`);
      }
      if (screen.mode === 'flows') {
        // The page scrolls as a whole: the picture is a full-size one, the card sits under it, and scrolling reaches the end of the words.
        const reach = await page.evaluate((dialog) => {
          const main = document.querySelector(`${dialog} [data-testid="guide-page"]`);
          const scrolls = main.scrollHeight > main.clientHeight + 1;
          main.scrollTop = main.scrollHeight;
          const card = document.querySelector(`${dialog} [data-testid="guide-card"]`).getBoundingClientRect();
          const inner = document.querySelector(`${dialog} [data-testid="guide-card-scroll"]`);
          const words = { held: inner.scrollHeight <= inner.clientHeight + 1, tabStop: inner.tabIndex >= 0 };
          main.scrollTop = 0;
          return { scrolls, endVisible: card.bottom <= innerHeight + 1, words };
        }, driver.DIALOG);
        if (!reach.scrolls) trouble.push(`${at}: the page does not scroll, so the words are cut off`);
        if (!reach.endVisible) trouble.push(`${at}: scrolled to the end, the card still runs off the screen`);
        if (!reach.words.held) trouble.push(`${at}: the card scrolls inside itself as well as the page (two scrollbars)`);
        if (reach.words.tabStop) trouble.push(`${at}: the card is a tab stop although it does not scroll`);
        if (now.picture.bottom > now.card.y + 1) trouble.push(`${at}: the picture runs under the card`);
      }
      if (i === 4 || i === 5) {
        const loaded = await page.$eval(`${driver.DIALOG} [data-testid="guide-picture"] img`, (img) => img.complete && img.naturalWidth > 0);
        if (!loaded) trouble.push(`${at}: the slide did not load`);
      }
    }
    check(`${screen.name}: nothing spills, the picture is big enough, the card is where it belongs (7 pages)`, trouble.length === 0, trouble.join(' | '));

    const game = await driver.goTo(page, 6);
    const board = await page.$eval(`${driver.GAME} svg[role="group"]`, (svg) => {
      const box = svg.getBoundingClientRect();
      return { top: box.top, bottom: box.bottom, height: box.height };
    });
    if (screen.mode !== 'flows') {
      check(`${screen.name}: the game's plan is on screen whole (${Math.round(board.height)}px tall)`, board.top >= 0 && board.bottom <= game.innerHeight + 1 && board.height >= Math.min(screen.minPicture * 0.6, 100), JSON.stringify(board));
    }
    check(`${screen.name}: ran clean`, problems.length === 0, problems.join(' | '));
    await page.close();
  }

  // A page whose words run past the card says so, and stops saying so at the end; a page that fits does not.
  const { page } = await driver.openGuide({ viewport: VIEWPORTS.phone });
  const brief = await driver.goTo(page, 1);
  check('a long page scrolls inside its card and fades its last line to say so', brief.scroll.height > brief.scroll.client + 8 && brief.scroll.masked, JSON.stringify(brief.scroll));
  await page.evaluate(() => {
    const node = document.querySelector('[data-testid="guide-card-scroll"]');
    node.scrollTop = node.scrollHeight;
  });
  await new Promise((resolve) => setTimeout(resolve, 200));
  const end = (await driver.read(page)).scroll;
  check('...and the fade goes when the end is reached', end.top > 0 && !end.masked, JSON.stringify(end));
  await driver.next(page);
  await driver.back(page);
  const again = (await driver.read(page)).scroll;
  check('a page always opens at its top', again.top === 0 && again.masked, JSON.stringify(again));
  await page.close();

  const wide = await driver.openGuide({ viewport: VIEWPORTS.desktop });
  const fits = (await driver.read(wide.page)).scroll;
  check('on a desktop the first page fits its card, so nothing fades', fits.height <= fits.client + 1 && !fits.masked, JSON.stringify(fits));
  await wide.page.close();
}
