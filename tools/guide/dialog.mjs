// The reader as a dialog: it holds the page while it is open (scroll, focus, the article behind it) and gives
// everything back when it closes, by the button or by Escape.
import { VIEWPORTS } from '../lib/guide-driver.mjs';

const state = (page, dialog) =>
  page.evaluate((selector) => ({
    open: Boolean(document.querySelector(selector)),
    inert: document.getElementById('root')?.hasAttribute('inert') ?? false,
    locked: document.documentElement.style.overflow === 'hidden' || document.body.style.overflow === 'hidden',
    inside: Boolean(document.activeElement?.closest(selector)),
    scrollY: Math.round(scrollY),
  }), dialog);

export default async function run({ check, driver }) {
  const { page, problems } = await driver.openGuide({ viewport: VIEWPORTS.desktop });
  const open = await state(page, driver.DIALOG);
  check('while open: the page behind is inert and its scroll is locked', open.open && open.inert && open.locked, JSON.stringify(open));
  check('while open: focus is inside the reader', (await state(page, driver.DIALOG)).inside);

  let leftTheDialog = 0;
  for (let i = 0; i < 24; i += 1) {
    await page.keyboard.press('Tab');
    if (!(await state(page, driver.DIALOG)).inside) leftTheDialog += 1;
  }
  check('Tab, pressed 24 times, never leaves the reader (it wraps)', leftTheDialog === 0, `${leftTheDialog} presses left it`);
  let backOut = 0;
  for (let i = 0; i < 24; i += 1) {
    await page.keyboard.down('Shift');
    await page.keyboard.press('Tab');
    await page.keyboard.up('Shift');
    if (!(await state(page, driver.DIALOG)).inside) backOut += 1;
  }
  check('Shift+Tab, pressed 24 times, never leaves it either', backOut === 0, `${backOut} presses left it`);

  // Paging from the keyboard: Enter on Next, all the way to the end. Focus must stay on Next (it is aria-disabled
  // there, not disabled) - a disabled button cannot keep focus, and the keyboard user would be dropped off the page.
  await page.evaluate((selector) => document.querySelector(`${selector} [data-action="guide-next"]`).focus(), driver.DIALOG);
  for (let i = 0; i < 9; i += 1) {
    await page.keyboard.press('Enter');
    await new Promise((resolve) => setTimeout(resolve, 120));
  }
  const ended = await page.evaluate((selector) => ({ on: document.activeElement?.getAttribute('data-action'), stage: document.querySelector(`${selector} [data-testid="guide-page"]`).dataset.stage }), driver.DIALOG);
  check('Enter on Next pages to the end and stops there, with focus still on Next', ended.stage === 'final' && ended.on === 'guide-next', JSON.stringify(ended));
  const announced = await driver.read(page);
  check('the counter is a live region and names the page it is on', announced.live === 'polite' && announced.announced.includes('The Final Plan'), announced.announced);
  check('the bar has 8 segments for a finger, none of them a Tab stop', announced.tabs === 8 && announced.tabStops === 0, JSON.stringify([announced.tabs, announced.tabStops]));

  await page.keyboard.press('Escape');
  await new Promise((resolve) => setTimeout(resolve, 250));
  const escaped = await state(page, driver.DIALOG);
  check('Escape closes it and gives the page back (scroll, focus, the article)', !escaped.open && !escaped.inert && !escaped.locked, JSON.stringify(escaped));
  check('...and focus lands on the article\'s heading, not on nothing', await page.evaluate(() => document.activeElement?.tagName === 'H1'));
  check('the article is still there to read', await page.evaluate(() => Boolean(document.querySelector('h1')) && document.body.innerText.includes('Every design starts with understanding the space itself')));
  await page.evaluate(() => window.scrollTo(0, 400));
  check('...and it scrolls again', (await state(page, driver.DIALOG)).scrollY > 100);
  await page.close();

  // A long page: its words scroll inside the card. The card is a stop the Tab trap knows, and the keyboard can scroll it.
  const long = await driver.openGuide({ viewport: VIEWPORTS.phone });
  await driver.goTo(long.page, 1);
  let strayed = 0;
  let reached = false;
  for (let i = 0; i < 12; i += 1) {
    await long.page.keyboard.press('Tab');
    const now = await long.page.evaluate((selector) => ({ inside: Boolean(document.activeElement?.closest(selector)), card: document.activeElement?.getAttribute('data-testid') === 'guide-card-scroll' }), driver.DIALOG);
    if (!now.inside) strayed += 1;
    reached ||= now.card;
    if (now.card) break;
  }
  check('a long page is a stop for Tab, and Tab never strays out of the reader on the way', reached && strayed === 0, JSON.stringify({ reached, strayed }));
  const region = await long.page.$eval(`${driver.DIALOG} [data-testid="guide-card-scroll"]`, (el) => ({ role: el.getAttribute('role'), name: el.getAttribute('aria-label') }));
  check('...it is a named region', region.role === 'region' && Boolean(region.name), JSON.stringify(region));
  await long.page.keyboard.press('ArrowDown');
  await new Promise((resolve) => setTimeout(resolve, 200));
  check('...and the arrow keys scroll it', (await driver.read(long.page)).scroll.top > 0);
  await long.page.keyboard.press('Tab');
  const wrapped = await long.page.evaluate((selector) => document.activeElement?.closest(selector) !== null, driver.DIALOG);
  check('Tab from the last stop wraps to the first instead of leaving', wrapped);
  await long.page.close();

  const button = await driver.openGuide({ viewport: VIEWPORTS.phone });
  await driver.goTo(button.page, 3);
  await button.page.click(`${driver.DIALOG} [data-action="guide-close"]`);
  await new Promise((resolve) => setTimeout(resolve, 250));
  const closed = await state(button.page, driver.DIALOG);
  check('the close button does the same', !closed.open && !closed.inert && !closed.locked, JSON.stringify(closed));
  check('the dialog ran clean', problems.length === 0 && button.problems.length === 0, [...problems, ...button.problems].join(' | '));
  await button.page.close();
}
