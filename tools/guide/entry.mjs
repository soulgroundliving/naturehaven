// The public way in: a button under the article's title opens the reader. Everything that follows from it being a
// button rather than a link: the history it makes (Back closes the reader, the close button pops the same entry, no
// dead step), where focus goes back to, and that nothing is downloaded until a finger or a pointer is near it.
import { VIEWPORTS } from '../lib/guide-driver.mjs';

const BUTTON = 'button[aria-haspopup="dialog"]';
const ARTICLE = '/journal/design-notes-01';
const settle = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));
// Does it appear? A thing that never does is a failed check, not a crash that hides every check after it.
const appears = (page, selector, timeout = 20000) => page.waitForSelector(selector, { timeout }).then(() => true, () => false);
const where = (page) =>
  page.evaluate(() => ({
    url: location.pathname + location.search,
    open: Boolean(document.querySelector('[data-testid="journal-guide"]')),
    focus: document.activeElement?.getAttribute('aria-haspopup') ?? document.activeElement?.tagName ?? null,
    entries: history.length,
  }));

export default async function run({ check, driver }) {
  // ── it is there, in both languages, and only where there is a guide ────────
  for (const [lang, label, pages] of [['en', 'Read page by page', '8 pages'], ['th', 'อ่านทีละหน้า', '8 หน้า']]) {
    const { page } = await driver.open({ query: '', lang, viewport: VIEWPORTS.tinyPhone });
    if (!(await appears(page, BUTTON, 60000))) {
      check(`${lang}: the article has a button that opens the reader`, false, 'no button on the page');
      await page.close();
      continue;
    }
    const b = await page.$eval(BUTTON, (el) => {
      const r = el.getBoundingClientRect();
      return { text: el.textContent.trim().replace(/\s+/g, ' '), h: Math.round(r.height), right: Math.round(r.right), inner: innerWidth, popup: el.getAttribute('aria-haspopup') };
    });
    check(`${lang}: the article has a button that says "${label}" and how many pages there are`, b.text === `${label} ${pages}` && b.popup === 'dialog', JSON.stringify(b));
    check(`${lang}: it is a thumb-sized target that fits the smallest phone (${b.h}px tall, ${b.right} of ${b.inner}px)`, b.h >= 44 && b.right <= b.inner, JSON.stringify(b));
    await page.close();
  }
  const other = await driver.open({ slug: 'nest', query: '' });
  await other.page.waitForSelector('h1', { timeout: 60000 });
  await settle();
  check('an article with no guide has no such button', (await other.page.$(BUTTON)) === null);
  await other.page.close();

  // ── nothing is fetched until a pointer is near ─────────────────────────────
  {
    const { page } = await driver.open({ query: '', viewport: VIEWPORTS.desktop });
    const fetched = [];
    page.on('request', (request) => {
      if (/GuideView/.test(request.url())) fetched.push(request.url());
    });
    await appears(page, BUTTON, 60000);
    await settle(900);
    const before = fetched.length;
    await page.hover(BUTTON);
    await settle(700);
    check('the reader (and the game inside it) is not downloaded with the article', before === 0, `${before} request(s) before the pointer arrived`);
    check('...it is fetched as a pointer reaches the button, so it is there by the click', fetched.length > 0, `${fetched.length} request(s) after`);
    await page.close();
  }

  // ── a tap opens it; Back closes it; focus goes home ────────────────────────
  {
    const { page, problems } = await driver.open({ query: '', viewport: VIEWPORTS.phone });
    await appears(page, BUTTON, 60000);
    await settle(600);
    const before = await where(page);
    await page.tap(BUTTON).catch(() => undefined);
    await appears(page, driver.DIALOG, 15000);
    const opened = await where(page);
    check('a tap on the button opens the reader', opened.open);
    check('...the URL gains the flag and keeps the rest of it (language, palette)', /guide/.test(opened.url) && /lang=en/.test(opened.url) && /tod=day/.test(opened.url) && opened.url.startsWith(ARTICLE), opened.url);
    check('...as a new history entry, so that Back can close it', opened.entries === before.entries + 1, `${before.entries} -> ${opened.entries}`);

    await page.evaluate(() => history.back());
    await settle();
    const backed = await where(page);
    check('Back closes it and lands on the article as it was', !backed.open && backed.url === before.url, JSON.stringify([backed.url, before.url]));
    check('...with focus on the button that opened it, so a screen-reader user keeps their place', backed.focus === 'dialog', String(backed.focus));

    await page.tap(BUTTON).catch(() => undefined);
    await appears(page, driver.DIALOG, 15000);
    await page.click(`${driver.DIALOG} [data-action="guide-close"]`).catch(() => undefined);
    await settle();
    const closed = await where(page);
    check('the close button undoes what the button pushed: the URL is as it was, the reader gone', !closed.open && closed.url === before.url, JSON.stringify([closed.url, before.url]));
    check('...focus is on the button again', closed.focus === 'dialog', String(closed.focus));
    // This Back leaves the site's page altogether, which destroys the page's script context mid-call: that is the
    // outcome being asked for, so the call is allowed to be interrupted and the URL is read from outside.
    await page.evaluate(() => history.back()).catch(() => undefined);
    await settle(900);
    const left = new URL(page.url()).pathname;
    check('...so one more Back leaves the article: there is no dead step of the same page in between', left !== ARTICLE, left);
    check('the way in ran clean', problems.length === 0, problems.join(' | '));
    await page.close();
  }

  // ── from the keyboard ──────────────────────────────────────────────────────
  {
    const { page } = await driver.open({ query: '', viewport: VIEWPORTS.desktop });
    await appears(page, BUTTON, 60000);
    await settle(600);
    await page.focus(BUTTON).catch(() => undefined);
    await page.keyboard.press('Enter');
    await appears(page, driver.DIALOG, 15000);
    check('Enter on the focused button opens the reader', (await where(page)).open);
    await page.keyboard.press('Escape');
    await settle();
    const after = await where(page);
    check('Escape closes it and puts focus back on the button', !after.open && after.focus === 'dialog' && !/guide/.test(after.url), JSON.stringify(after));
    await page.close();
  }
}
