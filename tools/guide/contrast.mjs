// Contrast at every hour of the site's day, measured from the painted pixels: the reader's counter, its icons, its card,
// a label drawn on the plan, and the game's own header (in the reader and in the game's full-screen dialog).
//
// The site's palette changes with the clock (five slots, blended between). The text colours (`sec-*`) are made for a
// frosted panel: over the bare sky they were 1.0-1.4:1 - invisible - from 04:45 to 18:25. This suite ran at day and
// at night only, so nothing saw it; it now runs every slot, and reads what was painted rather than what the CSS says.
import { contrastOf, decodePng } from '../lib/contrast.mjs';
import { createDriver as createRoomFitDriver } from '../lib/room-fit-driver.mjs';
import { sleep } from '../lib/dev-harness.mjs';
import { VIEWPORTS } from '../lib/guide-driver.mjs';

const SLOTS = ['dawn', 'morning', 'day', 'sunset', 'night'];
const PHONE = { ...VIEWPORTS.phone, deviceScaleFactor: 1 }; // a picture pixel is a page pixel
const TEXT = 4.5; // WCAG 1.4.3
const ICON = 3; // WCAG 1.4.11

const measure = async (page, checks) => {
  const png = decodePng(await page.screenshot({ type: 'png' }));
  const found = [];
  for (const [name, selector, minimum, options] of checks) {
    const result = await contrastOf(page, selector, png, options);
    found.push({ name, minimum, ...result });
  }
  return found;
};
const worst = (found) => found.filter((f) => !(f.ratio >= f.minimum)).map((f) => `${f.name} ${Number.isNaN(f.ratio) ? f.note : f.ratio.toFixed(2)}<${f.minimum}`);
const summary = (found) => found.map((f) => `${f.name} ${f.ratio.toFixed(1)}`).join(', ');

export default async function run({ check, driver }) {
  for (const slot of SLOTS) {
    const { page } = await driver.openGuide({ tod: slot, viewport: PHONE });
    await sleep(900); // the palette blends in over 600ms

    const plan = await measure(page, [
      ['the counter', '[data-testid="guide-page-counter"]', TEXT],
      ['the Next icon', '[data-action="guide-next"]', ICON],
      ['the Close icon', '[data-action="guide-close"]', ICON],
      ['the card title', '[data-testid="guide-card"] h2', TEXT],
      ['the first paragraph', '[data-testid="guide-card"] div.mt-3 p', TEXT],
      ['the "350 cm" beside the plan', '[data-testid="journal-guide"] svg text', TEXT, { text: '350 cm' }],
    ]);
    check(`${slot}: the reader's strip, card and plan labels can be read (${summary(plan)})`, worst(plan).length === 0, worst(plan).join(' | '));

    await driver.goTo(page, 2);
    await sleep(300);
    const doors = await measure(page, [
      ['the hint pill', '[data-testid="journal-guide"] p.bg-dark-charcoal', TEXT],
      ['a door name', '[data-testid="journal-guide"] svg text', TEXT, { text: 'Front door' }],
    ]);
    check(`${slot}: the door labels can be read (${summary(doors)})`, worst(doors).length === 0, worst(doors).join(' | '));

    await driver.goTo(page, 6);
    await sleep(300);
    const game = await measure(page, [
      ['the game title', '[data-testid="room-fit"][data-mode="play"] header p:nth-of-type(1)', TEXT],
      ['the game hint', '[data-testid="room-fit"][data-mode="play"] header p:nth-of-type(2)', TEXT],
    ]);
    check(`${slot}: the game's heading inside the reader can be read (${summary(game)})`, worst(game).length === 0, worst(game).join(' | '));
    await page.close();

    // The game's own full-screen dialog is painted by the same surface: it had the same bug.
    const roomFit = createRoomFitDriver({ browser: driver.browser, base: driver.base });
    const article = await roomFit.openArticle({ tod: slot, viewport: PHONE });
    const gamePage = article.page;
    await gamePage.evaluate((selector) => document.querySelector(selector).scrollIntoView({ block: 'center', behavior: 'instant' }), roomFit.FRAME);
    await gamePage.waitForSelector('[data-testid="room-fit"][data-mode="compact"]', { timeout: 60000 });
    await sleep(500);
    await gamePage.tap('[data-action="play-full-screen"]');
    await gamePage.waitForSelector('[data-testid="room-fit-play"]', { timeout: 30000 });
    await sleep(1000);
    const dialog = await measure(gamePage, [
      ['the title', '[data-testid="room-fit-play"] header p:nth-of-type(1)', TEXT],
      ['the hint', '[data-testid="room-fit-play"] header p:nth-of-type(2)', TEXT],
      ['the Close icon', '[data-testid="room-fit-play"] [data-action="close-play"]', ICON],
    ]);
    check(`${slot}: the game's own full-screen dialog can be read (${summary(dialog)})`, worst(dialog).length === 0, worst(dialog).join(' | '));
    await gamePage.close();
  }
}
