// Behaviour test for the Journal block renderer.
//
// Starts the Vite dev server, opens the dev-only sandbox page
// (/journal-sandbox — src/content/journal-sandbox/kitchen-sink.ts, which uses
// every block type) in headless Chromium, and drives each block the way a
// visitor would. Complements tools/test-journal-content.mjs, which checks the
// published articles' HTML; this one checks that the blocks WORK.
//
//   npm run test:journal:ui
//
//   exit 0  every check passed
//   exit 1  a check failed (each is listed)
//   exit 2  the harness could not run (server or browser did not start)
import { createChecks, sleep, startHarness } from './lib/dev-harness.mjs';

const { check, finish } = createChecks('journal-ui');
const { browser, base, stop } = await startHarness({ label: 'journal-ui', port: 4177, probe: '/journal-sandbox' });
const SANDBOX = `${base}/journal-sandbox`;

async function openSandbox({ reducedMotion = false, query = '?lang=en&tod=day' } = {}) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  if (reducedMotion) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  const problems = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') problems.push(`console.error: ${msg.text().slice(0, 200)}`);
  });
  page.on('pageerror', (err) => problems.push(`pageerror: ${err.message.slice(0, 200)}`));
  await page.goto(`${SANDBOX}${query}`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('[data-jn-block="toc"]', { timeout: 20000 });
  return { page, problems };
}

const scrollTo = (page, selector, index = 0) =>
  page.evaluate(
    async (sel, i) => {
      document.querySelectorAll(sel)[i].scrollIntoView({ block: 'center' });
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
    selector,
    index,
  );

try {
  // Warm-up: the first dev request can trigger dependency pre-bundling and a reload.
  const warm = await openSandbox();
  await sleep(1500);
  await warm.page.close();

  // ── normal motion, English ──────────────────────────────────────────────────
  const { page, problems } = await openSandbox();

  // Before anything scrolls: the interactive block is far below the fold, so its piece must not be loaded yet.
  const farState = await page.evaluate(() => document.querySelector('[data-jn-block="interactive"]').dataset.jnInteractiveState);
  check('interactive piece is not loaded while far from the viewport', farState === 'static', farState);

  const counts = await page.evaluate(() =>
    Object.fromEntries(
      ['toc', 'gallery', 'video', 'table', 'choice', 'details', 'interactive'].map((t) => [t, document.querySelectorAll(`[data-jn-block="${t}"]`).length]),
    ),
  );
  const expected = { toc: 1, gallery: 1, video: 2, table: 1, choice: 1, details: 2, interactive: 2 };
  check('every block type renders', JSON.stringify(counts) === JSON.stringify(expected), `got ${JSON.stringify(counts)}`);

  // Images: alt, reserved size, and disclosure badges.
  const imgs = await page.evaluate(() =>
    [...document.querySelectorAll('article img')].map((i) => ({ alt: i.alt, w: i.width, h: i.height, lazy: i.loading })),
  );
  check('every image has alt text and a reserved size', imgs.length > 0 && imgs.every((i) => i.alt && i.w > 0 && i.h > 0), JSON.stringify(imgs.filter((i) => !i.alt || !(i.w > 0))));
  const badges = await page.evaluate(() => [...document.querySelectorAll('span.pointer-events-none')].map((s) => s.textContent.trim()));
  check('AI images carry the AI badge', badges.filter((b) => b === 'AI-generated visualization').length === 7, JSON.stringify(badges));
  check('3D renders carry the render badge', badges.filter((b) => b === '3D render').length === 3, JSON.stringify(badges));
  const photoHasBadge = await page.evaluate(() => {
    const fig = [...document.querySelectorAll('figure')].find((f) => f.textContent.includes('No badge for a photograph'));
    return fig ? fig.querySelector('span.pointer-events-none') !== null : 'figure not found';
  });
  check('a photograph carries no badge', photoHasBadge === false, String(photoHasBadge));

  // Table of contents: anchors resolve and clicking one scrolls to it.
  const toc = await page.evaluate(() => {
    const links = [...document.querySelectorAll('[data-jn-block="toc"] a')];
    return { n: links.length, dangling: links.filter((a) => !document.getElementById(a.getAttribute('href').slice(1))).length };
  });
  check('TOC lists every h2 and h3, all anchors resolve', toc.n === 8 && toc.dangling === 0, JSON.stringify(toc));
  await page.evaluate(() => document.querySelector('[data-jn-block="toc"] summary').click());
  const galleryLink = await page.$('[data-jn-block="toc"] a[href="#gallery"]');
  await galleryLink.click();
  await sleep(600);
  const jump = await page.evaluate(() => ({ hash: location.hash, top: Math.round(document.getElementById('gallery').getBoundingClientRect().top) }));
  check('a TOC link jumps to its section, clear of the fixed header', jump.hash === '#gallery' && jump.top >= 0 && jump.top < 300, JSON.stringify(jump));

  // Gallery: buttons move it, the counter follows, the ends dim WITHOUT dropping keyboard focus.
  await scrollTo(page, '[data-jn-block="gallery"]');
  const gallery = await page.$('[data-jn-block="gallery"]');
  const [prev, next] = await gallery.$$('button');
  const readCount = () => gallery.$eval('[data-jn-gallery-count]', (el) => el.textContent.trim());
  const dimmed = (button) => button.evaluate((b) => b.getAttribute('aria-disabled') === 'true');
  const scrollerAttrs = await gallery.$eval('div[tabindex]', (el) => ({ role: el.getAttribute('role'), label: el.getAttribute('aria-label'), roledescription: el.getAttribute('aria-roledescription'), tabindex: el.getAttribute('tabindex') }));
  check('the gallery scroller is one labelled, focusable carousel', scrollerAttrs.role === 'group' && scrollerAttrs.roledescription === 'carousel' && Boolean(scrollerAttrs.label) && scrollerAttrs.tabindex === '0', JSON.stringify(scrollerAttrs));
  const atStart = { count: await readCount(), prevDimmed: await dimmed(prev) };
  check('gallery starts at 1 with Previous dimmed', atStart.count.startsWith('1 /') && atStart.prevDimmed === true, JSON.stringify(atStart));
  await next.click();
  await sleep(900);
  const afterNext = await readCount();
  check('gallery Next advances the counter', afterNext.startsWith('2 /'), afterNext);
  for (let i = 0; i < 6 && !(await dimmed(next)); i += 1) {
    await next.click();
    await sleep(700);
  }
  check('gallery Next dims at the end', await dimmed(next));
  check('a dimmed gallery button keeps keyboard focus (it is aria-disabled, not disabled)', await next.evaluate((b) => b.disabled === false && b.tabIndex === 0));
  await prev.click();
  await sleep(700);
  check('gallery Previous walks back', !(await dimmed(next)));

  // Table: a wrapper that can scroll sideways must be reachable by keyboard.
  const tableWrapper = await page.$eval('[data-jn-block="table"] > div', (el) => ({ tabindex: el.getAttribute('tabindex'), role: el.getAttribute('role'), label: el.getAttribute('aria-label') }));
  check('the table wrapper is keyboard-focusable and named by its caption', tableWrapper.tabindex === '0' && tableWrapper.role === 'region' && Boolean(tableWrapper.label), JSON.stringify(tableWrapper));

  // Callout: a tip with no title still says what it is.
  const untitled = await page.evaluate(() => {
    const el = [...document.querySelectorAll('aside[role="note"]')].find((a) => a.textContent.includes('A tip with no title'));
    return el ? el.textContent : null;
  });
  check('a titleless tip is labelled "Tip" in words', typeof untitled === 'string' && untitled.startsWith('Tip'), String(untitled));

  // Choice: default option, every panel in the DOM, switching shows one at a time.
  await page.waitForSelector('[data-jn-block="choice"][data-jn-choice-mode="tabs"]', { timeout: 8000 });
  await scrollTo(page, '[data-jn-block="choice"]');
  const choiceState = () =>
    page.evaluate(() => {
      const root = document.querySelector('[data-jn-block="choice"]');
      return {
        selected: [...root.querySelectorAll('[role="tab"]')].filter((t) => t.getAttribute('aria-selected') === 'true').map((t) => t.textContent.trim()),
        panelsInDom: root.querySelectorAll('[role="tabpanel"]').length,
        visible: [...root.querySelectorAll('[role="tabpanel"]')].filter((p) => getComputedStyle(p).display !== 'none').length,
      };
    });
  const choiceBefore = await choiceState();
  check('choice opens on its defaultId with all panels in the DOM', choiceBefore.selected[0] === 'Works from home' && choiceBefore.panelsInDom === 3 && choiceBefore.visible === 1, JSON.stringify(choiceBefore));
  const petTab = await page.evaluateHandle(() => [...document.querySelectorAll('[data-jn-block="choice"] [role="tab"]')].find((t) => t.textContent.includes('pet')));
  await petTab.asElement().click();
  await sleep(300);
  const choiceAfter = await choiceState();
  check('choosing an option shows only its panel', choiceAfter.selected[0] === 'Has a pet' && choiceAfter.visible === 1 && choiceAfter.panelsInDom === 3, JSON.stringify(choiceAfter));

  // Details: collapsed by default, opens on click, content present either way.
  const details = await page.evaluate(() => [...document.querySelectorAll('[data-jn-block="details"]')].map((d) => ({ open: d.open, hasText: d.textContent.length > 20 })));
  check('details: first collapsed, second open, text present in both', details[0].open === false && details[1].open === true && details.every((d) => d.hasText), JSON.stringify(details));
  await page.evaluate(() => document.querySelectorAll('[data-jn-block="details"] summary')[0].click());
  check('details opens on click', await page.evaluate(() => document.querySelectorAll('[data-jn-block="details"]')[0].open));

  // Video: nothing downloads until play; an ambient clip plays only while visible.
  const videos = await page.evaluate(() =>
    [...document.querySelectorAll('video')].map((v) => ({ preload: v.preload, poster: v.getAttribute('poster'), controls: v.controls, sources: v.querySelectorAll('source').length })),
  );
  check('videos: poster, preload=none, real sources', videos.length === 2 && videos.every((v) => v.preload === 'none' && v.poster && v.sources >= 1), JSON.stringify(videos));
  check('regular video has controls, ambient video has none', videos[0].controls === true && videos[1].controls === false, JSON.stringify(videos));
  await scrollTo(page, '[data-jn-block="video"]', 1);
  try {
    await page.waitForFunction(() => document.querySelectorAll('video')[1].paused === false, { timeout: 8000 });
    check('ambient video plays once scrolled into view', true);
  } catch {
    check('ambient video plays once scrolled into view', false, 'still paused after 8s');
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(800);
  check('ambient video pauses when scrolled away', await page.evaluate(() => document.querySelectorAll('video')[1].paused === true));

  // Interactive: loads on demand and works; an unregistered id degrades to text.
  await scrollTo(page, '[data-jn-block="interactive"]', 0);
  try {
    await page.waitForSelector('[data-testid="sandbox-demo"]', { timeout: 8000 });
    await page.click('[data-testid="sandbox-demo"] button');
    await page.click('[data-testid="sandbox-demo"] button');
    const taps = await page.$eval('[data-testid="sandbox-demo-count"]', (el) => el.textContent.trim());
    check('interactive piece loads near the viewport and responds to input', taps === '2', `count ${taps}`);
  } catch (error) {
    check('interactive piece loads near the viewport and responds to input', false, error.message);
  }
  const unregistered = await page.evaluate(() => {
    const el = document.querySelector('[data-jn-interactive-id="not-registered"]');
    return { state: el.dataset.jnInteractiveState, registered: el.dataset.jnInteractiveRegistered, text: el.textContent.includes('only the description shows') };
  });
  check('an unregistered interactive keeps its description and stays static', unregistered.state === 'static' && unregistered.registered === 'false' && unregistered.text, JSON.stringify(unregistered));

  // Language: every block switches.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.click('button[aria-label="Switch language"]');
  await sleep(500);
  const thai = await page.evaluate(() => ({
    h1: document.querySelector('h1').textContent,
    tabs: [...document.querySelectorAll('[data-jn-block="choice"] [role="tab"]')].map((t) => t.textContent),
    galleryPrev: document.querySelector('[data-jn-block="gallery"] button').getAttribute('aria-label'),
    toc: document.querySelector('[data-jn-block="toc"] summary').textContent.trim(),
  }));
  check('switching to Thai retitles the page and every block', thai.h1 === 'ทุกบล็อกในหน้าเดียว' && thai.tabs[0] === 'นักศึกษา' && thai.galleryPrev === 'ก่อนหน้า' && thai.toc.startsWith('สารบัญ'), JSON.stringify(thai));

  check('no console errors or page errors', problems.length === 0, problems.join(' | '));
  await page.close();

  // ── reduced motion: no autoplay, controls shown instead ─────────────────────
  const calm = await openSandbox({ reducedMotion: true });
  await scrollTo(calm.page, '[data-jn-block="video"]', 1);
  await sleep(1500);
  const ambient = await calm.page.evaluate(() => {
    const v = document.querySelectorAll('video')[1];
    return { paused: v.paused, controls: v.controls };
  });
  check('reduced motion: the ambient clip does not autoplay and offers controls', ambient.paused === true && ambient.controls === true, JSON.stringify(ambient));
  check('reduced motion: no console errors', calm.problems.length === 0, calm.problems.join(' | '));
  await calm.page.close();

  // ── a shared /journal/<slug>#section link opens at that section ─────────────
  const deep = await openSandbox({ query: '?lang=en&tod=day#gallery' });
  await sleep(1200);
  const deepLink = await deep.page.evaluate(() => ({ top: Math.round(document.getElementById('gallery').getBoundingClientRect().top), scrollY: Math.round(scrollY) }));
  check('a #section link opens at that section on a cold load, not at the top', deepLink.scrollY > 500 && deepLink.top >= 0 && deepLink.top < 300, JSON.stringify(deepLink));
  await deep.page.close();

  // ── the tab-set chunk fails to download (a deploy left a stale page) ────────
  const broken = await browser.newPage();
  await broken.setViewport({ width: 1280, height: 900 });
  await broken.setRequestInterception(true);
  // "JournalChoice.tsx" only: JournalChoiceStatic.tsx is a normal import and must still load.
  broken.on('request', (req) => (/JournalChoice\.tsx/.test(req.url()) ? req.abort() : req.continue()));
  await broken.goto(`${SANDBOX}?lang=en&tod=day`, { waitUntil: 'domcontentloaded' });
  await broken.waitForSelector('[data-jn-block="toc"]', { timeout: 20000 });
  await sleep(1500);
  const stacked = await broken.evaluate(() => {
    const el = document.querySelector('[data-jn-block="choice"]');
    const options = ['Content for the student option.', 'Content for the work-from-home option.', 'Content for the pet option.'];
    return {
      mode: el?.dataset.jnChoiceMode,
      everyOption: options.every((text) => el?.textContent.includes(text)),
      pageAlive: Boolean(document.querySelector('h1')) && document.querySelectorAll('[data-jn-block]').length >= 8,
    };
  });
  check('when the tab-set chunk fails, every option still shows as plain text and the page survives', stacked.mode === 'static' && stacked.everyOption && stacked.pageAlive, JSON.stringify(stacked));
  await broken.close();

  // ── an interactive piece that throws while rendering ────────────────────────
  const crash = await openSandbox({ query: '?lang=en&tod=day&crash' });
  await scrollTo(crash.page, '[data-jn-interactive-id="sandbox-crash"]');
  await sleep(1500);
  const crashed = await crash.page.evaluate(() => {
    const el = document.querySelector('[data-jn-interactive-id="sandbox-crash"]');
    return { text: el?.textContent ?? '', pageAlive: Boolean(document.querySelector('h1')) && document.querySelectorAll('[data-jn-block]').length >= 8 };
  });
  check('a crashing interactive piece falls back to its description and the article survives', crashed.text.includes('This piece throws while rendering') && crashed.text.includes('could not load') && crashed.pageAlive, JSON.stringify(crashed));
  await crash.page.close();
} catch (error) {
  check('the test run completed', false, error.stack ?? String(error));
} finally {
  await stop();
}

finish();
