// The pages of the reader: hidden unless asked for, eight of them in the article's order, each carrying the
// article's own words (in both languages), moving between them, and the strip on top that never moves.
import article from '../../src/content/journal/design-notes-01.ts';
import { PICTURE_LABEL } from '../../src/components/journal/guide/guideCopy.ts';
import { guidePages } from '../../src/lib/journalGuide.ts';
import { VIEWPORTS } from '../lib/guide-driver.mjs';

const STAGES = ['plan', 'brief', 'constraints', 'layout', 'slide', 'measurements', 'try', 'final'];
const PAGES = guidePages(article);

const localized = (value, lang) => (typeof value === 'string' ? value : value[lang]);
const squash = (text) => text.replace(/\s+/g, ' ').trim().toLowerCase(); // innerText applies text-transform: uppercase to headings and cells

// Every line of text a block puts on the screen.
function linesOf(block, lang) {
  switch (block.type) {
    case 'p':
    case 'h3':
    case 'pull':
      return [block.text[lang]];
    case 'callout':
      return [block.text[lang]];
    case 'list':
      return block.items.map((item) => item[lang]);
    case 'table':
      return [...(block.head ?? []), ...block.rows.flat()].map((cell) => localized(cell, lang));
    default:
      return [];
  }
}

const sameBox = (a, b) => Math.abs(a.x - b.x) <= 1 && Math.abs(a.y - b.y) <= 1 && Math.abs(a.w - b.w) <= 1 && Math.abs(a.h - b.h) <= 1;

export default async function run({ check, driver }) {
  // ── hidden unless asked for ────────────────────────────────────────────────
  {
    const plain = await driver.open({ query: '' });
    await plain.page.waitForSelector('h1', { timeout: 60000 });
    await new Promise((resolve) => setTimeout(resolve, 600));
    check('without ?guide the article has no reader', (await plain.page.$(driver.DIALOG)) === null);
    check('without ?guide the article itself is untouched (heading, no inert page)', await plain.page.evaluate(() => Boolean(document.querySelector('h1')) && !document.getElementById('root')?.hasAttribute('inert')));
    await plain.page.close();

    const other = await driver.open({ query: 'guide', slug: 'nest' });
    await other.page.waitForSelector('h1', { timeout: 60000 });
    await new Promise((resolve) => setTimeout(resolve, 600));
    check('?guide on an article that has no guide opens nothing', (await other.page.$(driver.DIALOG)) === null);
    check('?guide on an article that has no guide breaks nothing', other.problems.length === 0, other.problems.join(' | '));
    await other.page.close();
  }

  // ── the pages, in English, on a phone ──────────────────────────────────────
  const { page, problems } = await driver.openGuide({ viewport: VIEWPORTS.phone });
  check('the guide has the eight pages the article names', PAGES.length === 8 && PAGES.map((p) => p.stage).join() === STAGES.join(), PAGES.map((p) => p.stage).join());

  const dialog = await page.$eval(driver.DIALOG, (el) => ({ role: el.getAttribute('role'), modal: el.getAttribute('aria-modal'), label: el.getAttribute('aria-label') }));
  check('it is a modal dialog with a name', dialog.role === 'dialog' && dialog.modal === 'true' && Boolean(dialog.label), JSON.stringify(dialog));
  check('the article behind it is inert', await page.evaluate(() => document.getElementById('root')?.hasAttribute('inert')));

  const first = await driver.read(page);
  check('it opens on the first page: 01 / 08, the plan', first.index === 0 && first.stage === 'plan' && first.label === '01 / 08', JSON.stringify([first.index, first.stage, first.label]));
  check('the dialog is in the reader\'s language (a screen reader picks its voice by it) and is described by the counter', first.dialogLang === 'en' && first.describedBy === first.counterId && first.counterId !== '', JSON.stringify([first.dialogLang, first.describedBy, first.counterId]));
  check('the seen counter is hidden from a screen reader and what it hears is "Page n of N: title", replaced whole', first.seenAria === 'true' && first.announced === 'Page 1 of 8: The Plan' && first.atomic === 'true', JSON.stringify([first.seenAria, first.announced, first.atomic]));
  check('the dialog holds pinch-zoom (a finger drags a piece on the game page; touch-action: none would kill zoom)', first.touchAction === 'pinch-zoom', first.touchAction);
  check('the bar has one segment per page and the first is the one selected', first.tabs === 8 && first.selectedTab === 0, JSON.stringify([first.tabs, first.selectedTab]));
  check('on the first page Back is off and Next is on', first.backDisabled && !first.nextDisabled);
  const segments = await page.$$eval(`${driver.DIALOG} [data-action="guide-jump"]`, (els) => els.map((el) => { const r = el.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height) }; }));
  check('the segments of the bar are targets a finger can hit: 24px each way at least (WCAG 2.5.8)', segments.length === 8 && segments.every((s) => s.w >= 24 && s.h >= 24), JSON.stringify(segments[0]));

  const bars = [];
  for (let i = 0; i < PAGES.length; i += 1) {
    const now = await driver.goTo(page, i);
    const expected = PAGES[i];
    const name = `page ${i + 1} (${expected.stage})`;
    bars.push(now.bars);
    check(`${name}: the stage and the counter say where we are`, now.stage === expected.stage && now.label === `0${i + 1} / 08`, JSON.stringify([now.stage, now.label]));
    check(`${name}: the bar has ${i + 1} segment(s) filled and the right one selected`, now.selectedTab === i && now.filledTabs === i + 1, JSON.stringify([now.selectedTab, now.filledTabs]));
    check(`${name}: Back and Next are on or off as the ends require`, now.backDisabled === (i === 0) && now.nextDisabled === (i === PAGES.length - 1), JSON.stringify([now.backDisabled, now.nextDisabled]));
    if (expected.interactive) {
      check(`${name}: the game itself is the page, and there is no card of words`, now.hasGame && now.card === null);
      continue;
    }
    check(`${name}: the card is titled as the article titles the section`, now.title === expected.title.en, `${now.title} vs ${expected.title.en}`);
    const shown = squash(now.cardText);
    const missing = expected.blocks.flatMap((block) => linesOf(block, 'en')).filter((line) => !shown.includes(squash(line)));
    check(`${name}: every line of the section's own text is on the card`, missing.length === 0, `missing: ${missing.map((m) => m.slice(0, 50)).join(' | ')}`);
    check(`${name}: no picture inside the words - a slide is the page's picture or it is left out, never both`, now.cardImages === 0, `${now.cardImages} image(s) in the card`);
    const hasPicture = expected.stage === 'slide' || expected.stage === 'measurements';
    if (!hasPicture) check(`${name}: the drawing says what it is to someone who cannot see it (${expected.stage === 'constraints' ? 'a group, its doors are buttons' : 'an image'})`, now.picLabel === PICTURE_LABEL[expected.stage].en && now.picRole === (expected.stage === 'constraints' ? 'group' : 'img'), JSON.stringify([now.picLabel, now.picRole]));
    if (expected.stage === 'slide') check(`${name}: the 3D-render badge travels with the slide (the article's rule for anything that is not a photograph or a plan)`, /3D render/i.test(now.pictureBadge), now.pictureBadge);
    check(`${name}: ${hasPicture ? "it leads with the section's own slide" : 'the plan is drawn, and the slide is not shown twice'}`, hasPicture ? Boolean(now.pictureImg?.includes(i === 4 ? '05-iterations' : '06-measurements')) : now.pictureImg === null && now.picture !== null, JSON.stringify([now.pictureImg, now.picture]));
    if (i + 1 < PAGES.length && !PAGES[i + 1].interactive) {
      const next = PAGES[i + 1].blocks.flatMap((block) => (block.type === 'p' ? [block.text.en] : []))[0];
      check(`${name}: the next page's words are not on this one`, next === undefined || !shown.includes(squash(next)), next?.slice(0, 50));
    }
  }
  check('the strip on top does not move from page to page (Back, Next and Close stay under the thumb)', bars.every((b) => sameBox(b.back, bars[0].back) && sameBox(b.next, bars[0].next) && sameBox(b.close, bars[0].close)), JSON.stringify(bars.map((b) => b.next)));

  // ── moving between pages ──────────────────────────────────────────────────
  const last = await driver.read(page);
  check('on the last page Next is off', last.index === 7 && last.nextDisabled && !last.backDisabled);
  await driver.jump(page, 4);
  const jumped = await driver.read(page);
  check('a tap on the bar jumps to that page', jumped.index === 4 && jumped.stage === 'slide', JSON.stringify([jumped.index, jumped.stage]));
  await driver.back(page);
  check('Back returns to the page before', (await driver.read(page)).index === 3);
  check('the reader ran clean (no console errors, no failed requests)', problems.length === 0, problems.join(' | '));
  await page.close();

  // ── Thai ───────────────────────────────────────────────────────────────────
  const thai = await driver.openGuide({ lang: 'th', viewport: VIEWPORTS.phone });
  for (const i of [0, 1, 3, 5]) {
    const now = await driver.goTo(thai.page, i);
    const expected = PAGES[i];
    const shown = squash(now.cardText);
    const missing = expected.blocks.flatMap((block) => linesOf(block, 'th')).filter((line) => !shown.includes(squash(line)));
    check(`Thai page ${i + 1}: titled and worded as the Thai article has it`, now.title === expected.title.th && missing.length === 0, `${now.title} | missing: ${missing.map((m) => m.slice(0, 30)).join(' | ')}`);
    check(`Thai page ${i + 1}: the dialog says it is Thai`, now.dialogLang === 'th', String(now.dialogLang));
  }
  const thaiSlide = await driver.goTo(thai.page, 4);
  check('Thai: the render badge is in Thai too', /ภาพเรนเดอร์/.test(thaiSlide.pictureBadge), thaiSlide.pictureBadge);
  const thaiPlan = await driver.goTo(thai.page, 0);
  const thaiDrawn = await thai.page.evaluate(() => [...document.querySelectorAll('[data-testid="journal-guide"] svg text')].map((el) => el.textContent));
  check('Thai: the plan prints its own dimensions in Thai units, from the room\'s own numbers', thaiDrawn.includes('350 ซม.') && thaiDrawn.includes('720 ซม.') && thaiDrawn.includes('25.2 ตร.ม.') && !thaiDrawn.some((text) => /\bcm\b|sqm/.test(text)), thaiDrawn.join(' | '));
  check('Thai: the drawing is described in Thai', thaiPlan.picLabel === PICTURE_LABEL.plan.th, String(thaiPlan.picLabel));
  check('the Thai reader ran clean', thai.problems.length === 0, thai.problems.join(' | '));
  await thai.page.close();
}
