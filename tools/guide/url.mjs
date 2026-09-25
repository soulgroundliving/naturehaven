// The reader is open exactly when the URL says so: a flag that is off, a close that clears the flag, a navigation that
// opens or closes it, a flag that does not follow you to another article, and a reader whose file will not load.
import { VIEWPORTS } from '../lib/guide-driver.mjs';

const settle = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));
const has = (page, selector) => page.evaluate((s) => Boolean(document.querySelector(s)), selector);
// A client-side navigation, the way a link or a button inside the app makes one.
const go = (page, url) =>
  page.evaluate((to) => {
    history.pushState({}, '', to);
    dispatchEvent(new PopStateEvent('popstate'));
  }, url);

export default async function run({ check, driver }) {
  // ── the flag ───────────────────────────────────────────────────────────────
  for (const value of ['0', 'false']) {
    const off = await driver.open({ query: `guide=${value}` });
    await off.page.waitForSelector('h1', { timeout: 60000 });
    await settle();
    check(`?guide=${value} is off`, !(await has(off.page, driver.DIALOG)));
    await off.page.close();
  }

  // ── closing ────────────────────────────────────────────────────────────────
  const { page } = await driver.openGuide({ viewport: VIEWPORTS.phone });
  const historyBefore = await page.evaluate(() => history.length);
  await page.click(`${driver.DIALOG} [data-action="guide-close"]`);
  await settle();
  const url = await page.evaluate(() => ({ search: location.search, path: location.pathname, length: history.length }));
  check('closing takes ?guide out of the URL and leaves the rest of it (language, palette)', !/guide/.test(url.search) && /lang=en/.test(url.search) && /tod=day/.test(url.search) && url.path === '/journal/design-notes-01', JSON.stringify(url));
  check('...by replacing the entry, so Back does not walk through a reader that is no longer there', url.length === historyBefore, `${historyBefore} -> ${url.length}`);
  check('the article is there, and focus is on its heading (the reader was opened by a URL, so nothing else will take it back)', await page.evaluate(() => document.activeElement?.tagName === 'H1' && document.activeElement.textContent.includes('How We Design a Room')));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('h1', { timeout: 60000 });
  await settle();
  check('a reload after closing does not bring it back', !(await has(page, driver.DIALOG)));

  // ── opened and closed by navigation, as a button would ─────────────────────
  await go(page, '/journal/design-notes-01?guide&lang=en&tod=day');
  await page.waitForSelector(driver.DIALOG, { timeout: 30000 });
  await page.evaluate(() => history.back());
  await settle();
  check('a navigation to ?guide opens the reader without a reload, and Back closes it (the URL is the state)', !(await has(page, driver.DIALOG)));
  check('...and hands the page back (not inert, scrolls)', await page.evaluate(() => !document.getElementById('root')?.hasAttribute('inert') && document.documentElement.style.overflow !== 'hidden'));
  await page.close();

  // ── it does not follow you to another article ──────────────────────────────
  const trip = await driver.open({ slug: 'nest', query: 'guide' });
  await trip.page.waitForSelector('h1', { timeout: 60000 });
  await settle();
  await go(trip.page, '/journal/design-notes-01?lang=en&tod=day');
  await trip.page.waitForFunction(() => document.querySelector('h1')?.textContent?.includes('How We Design a Room'), { timeout: 30000 });
  await settle();
  check('a ?guide left on one article does not open the reader on the next', !(await has(trip.page, driver.DIALOG)));
  await go(trip.page, '/journal/design-notes-01?guide&lang=en&tod=day');
  await trip.page.waitForSelector(driver.DIALOG, { timeout: 30000 });
  await go(trip.page, '/journal/nest?lang=en&tod=day');
  await settle();
  check('...and going on to an article with no guide closes it and gives the page back', !(await has(trip.page, driver.DIALOG)) && (await trip.page.evaluate(() => !document.getElementById('root')?.hasAttribute('inert'))));
  await trip.page.close();

  // ── a reader that will not load ────────────────────────────────────────────
  const broken = await driver.open({
    query: 'guide',
    prepare: async (p) => {
      await p.setRequestInterception(true);
      p.on('request', (request) => (/GuideView/.test(request.url()) ? request.abort() : request.continue()));
    },
  });
  const told = await broken.page.waitForSelector('[role="alert"]', { timeout: 20000 }).then(() => true, () => false);
  if (!told) await broken.page.waitForSelector('h1', { timeout: 60000 });
  const failed = await broken.page.evaluate(() => ({
    heading: document.querySelector('h1')?.textContent ?? '',
    alert: document.querySelector('[role="alert"]')?.textContent ?? '',
    inert: document.getElementById('root')?.hasAttribute('inert') ?? false,
    body: document.body.innerText.includes('Every design starts with understanding the space itself'),
  }));
  check('when the reader cannot be fetched the article is still there, whole', failed.heading.includes('How We Design a Room') && failed.body && !failed.inert, JSON.stringify(failed));
  check('...and the visitor is told', told && /could not load/i.test(failed.alert), failed.alert || 'no alert appeared');
  if (told) {
    await broken.page.click('[role="alert"] button');
    await settle();
    check('...and can dismiss it, which takes ?guide out of the URL', (await has(broken.page, '[role="alert"]')) === false && !/guide/.test(await broken.page.evaluate(() => location.search)));
  }
  await broken.page.close();
}
