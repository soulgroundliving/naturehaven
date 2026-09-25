import assert from 'node:assert/strict';
import { test } from 'node:test';
import article from '../../src/content/journal/design-notes-01.ts';
import type { Article, ArticleBlock, GuideStage } from '../../src/data/journalTypes.ts';
import { GUIDE_STAGE_IDS, guidePages, guideProblems, splitNumber } from '../../src/lib/journalGuide.ts';
import { validateArticle } from '../../src/lib/journalContract.ts';

const t = (en: string, th = en) => ({ en, th });
const p = (text: string): ArticleBlock => ({ type: 'p', text: t(text) });
const h2 = (text: string): ArticleBlock => ({ type: 'h2', text: t(text) });
const game: ArticleBlock = { type: 'interactive', id: 'game', title: t('Try it'), description: t('A game.') };

const essay = (guide: Article['guide']): Article => ({
  slug: 'essay',
  category: t('Notes'),
  title: t('Essay'),
  excerpt: t('An essay.'),
  date: '2026-09-22',
  readMinutes: 1,
  hero: '/assets/x.jpg',
  heroAlt: t('x'),
  guide,
  blocks: [p('Before any section.'), h2('01 — First'), p('one'), p('two'), h2('02 — Second'), p('three'), p('leads into the game'), game, p('after the game')],
});

test('a number is split off a heading only when it is one: never a bare hyphen, a decimal point, a clock or a year', () => {
  for (const words of ['3-bedroom plans', '24-hour access', '2.5 m ceilings', '10:30 check-in', '2026 was a year', '1st floor', 'A record of decisions']) {
    assert.deepEqual(splitNumber(words), { number: null, title: words }, words);
  }
  assert.deepEqual(splitNumber('3: Layout'), { number: '3', title: 'Layout' });
  assert.deepEqual(splitNumber('12 – Twelve'), { number: '12', title: 'Twelve' });
  assert.deepEqual(splitNumber('  04 - Four'), { number: '04', title: 'Four' });
});

test('a number in front of a heading is split off, and a heading without one is left alone', () => {
  assert.deepEqual(splitNumber('01 — The Plan'), { number: '01', title: 'The Plan' });
  assert.deepEqual(splitNumber('7. Seven'), { number: '7', title: 'Seven' });
  assert.deepEqual(splitNumber('A record of decisions'), { number: null, title: 'A record of decisions' });
  assert.deepEqual(splitNumber('2026 was a year'), { number: null, title: '2026 was a year' });
});

const words = (page: { blocks: ArticleBlock[] }) => page.blocks.map((b) => (b.type === 'p' ? b.text.en : b.type));

test('a section page is the blocks between its h2 and the next h2, and nothing else', () => {
  const pages = guidePages(essay({ pages: [{ section: '01-first', stage: 'plan' }, { section: '02-second', stage: 'brief' }] }));
  assert.equal(pages.length, 2);
  assert.deepEqual(words(pages[0]), ['one', 'two']);
  assert.equal(pages[0].title.en, 'First');
  assert.equal(pages[0].number, '01');
  assert.deepEqual(pages.map((page) => page.index), [0, 1]);
});

test('an interactive block gets a page of its own with the paragraph that leads into it, taken out of its section', () => {
  const pages = guidePages(essay({ pages: [{ section: '02-second', stage: 'brief' }, { interactive: 'game', stage: 'try' }] }));
  assert.deepEqual(words(pages[0]), ['three', 'after the game']);
  assert.deepEqual(words(pages[1]), ['leads into the game']);
  assert.equal(pages[1].interactive?.id, 'game');
  assert.equal(pages[1].title.en, 'Try it');
  assert.equal(pages[1].number, null);
});

test('a slide page leads with the first image of its section, and a drawn page drops the section\'s media', () => {
  const picture: ArticleBlock = { type: 'image', src: '/assets/a.webp', alt: t('a'), width: 10, height: 10, origin: 'drawing' };
  const second: ArticleBlock = { type: 'image', src: '/assets/b.webp', alt: t('b'), width: 10, height: 10, origin: 'drawing' };
  const withMedia = (stage: GuideStage): Article => ({ ...essay({ pages: [{ section: '01-first', stage }] }), blocks: [h2('01 — First'), p('one'), picture, p('two'), second, h2('02 — Second')] });
  const slide = guidePages(withMedia('slide'))[0];
  assert.equal(slide.picture, picture);
  assert.deepEqual(slide.blocks.map((b) => b.type), ['p', 'p', 'image'], 'only the first image is lifted out; a later one stays in the words');
  const drawn = guidePages(withMedia('plan'))[0];
  assert.equal(drawn.picture, undefined);
  assert.deepEqual(drawn.blocks.map((b) => b.type), ['p', 'p']);
  assert.equal(guidePages({ ...withMedia('measurements'), blocks: [h2('01 — First'), p('only words'), h2('02 — Second')] })[0].picture, undefined, 'a section with no image has no picture to lead with');
});

test('without a page for the interactive block, its section keeps it and its lead-in', () => {
  const pages = guidePages(essay({ pages: [{ section: '02-second', stage: 'brief' }] }));
  assert.deepEqual(words(pages[0]), ['three', 'leads into the game', 'interactive', 'after the game']);
});

test('a page that matches nothing is dropped from the guide, and guideProblems says why', () => {
  const broken = essay({ pages: [{ section: 'nope', stage: 'plan' }, { interactive: 'missing', stage: 'try' }, { section: '01-first', stage: 'sofa' as never }, { section: '01-first', stage: 'plan' }] });
  assert.deepEqual(guidePages(broken).map((page) => page.key), ['01-first', '01-first']);
  const problems = guideProblems(broken);
  assert.ok(problems.some((line) => line.includes('"nope" matches no h2')), problems.join('\n'));
  assert.ok(problems.some((line) => line.includes('"missing" matches no interactive block')), problems.join('\n'));
  assert.ok(problems.some((line) => line.includes('stage "sofa"')), problems.join('\n'));
  assert.ok(problems.some((line) => line.includes('is used by an earlier page')), problems.join('\n'));
});

test('guideProblems: an interactive page must be a try page, and a try page must be an interactive one', () => {
  const wrongPicture = essay({ pages: [{ section: '01-first', stage: 'plan' }, { interactive: 'game', stage: 'plan' }] });
  assert.ok(guideProblems(wrongPicture).some((line) => line.includes('an interactive page must use stage "try"')), guideProblems(wrongPicture).join('\n'));
  const wrongPage = essay({ pages: [{ section: '01-first', stage: 'try' }] });
  assert.ok(guideProblems(wrongPage).some((line) => line.includes('a section page cannot use stage "try"')), guideProblems(wrongPage).join('\n'));
  const sound = essay({ pages: [{ section: '01-first', stage: 'plan' }, { section: '02-second', stage: 'slide' }, { interactive: 'game', stage: 'try' }] });
  assert.deepEqual(guideProblems(sound), []);
});

test('an article without a guide has no pages and no problems', () => {
  assert.deepEqual(guidePages(essay(undefined)), []);
  assert.deepEqual(guideProblems(essay(undefined)), []);
});

test('Design Notes #01 is told in eight pages, in the order the article gives them, with the game as the seventh', () => {
  const pages = guidePages(article);
  assert.deepEqual(
    pages.map((page) => `${page.stage}:${page.key}`),
    [
      'plan:01-the-plan',
      'brief:02-the-brief',
      'constraints:03-the-constraints',
      'layout:04-the-layout',
      'slide:05-the-iterations',
      'measurements:06-the-measurements',
      'try:room-fit',
      'final:07-the-final-plan',
    ],
  );
  assert.deepEqual(guideProblems(article), []);
  assert.deepEqual(validateArticle(article), []);
  for (const page of pages) assert.ok((GUIDE_STAGE_IDS as readonly string[]).includes(page.stage));
});

test('every page of Design Notes #01 carries the article\'s own words, in both languages', () => {
  const pages = guidePages(article);
  const text = (i: number, lang: 'en' | 'th') => pages[i].blocks.flatMap((b) => (b.type === 'p' || b.type === 'pull' ? [b.text[lang]] : []));
  assert.equal(text(0, 'en')[0], 'Every design starts with understanding the space itself.');
  assert.equal(pages[0].title.en, 'The Plan');
  assert.match(pages[0].title.th, /\S/);
  assert.ok(text(1, 'en').some((line) => line.startsWith('Sleeping — ')), 'the brief lists its seven functions');
  assert.equal(text(1, 'en').filter((line) => /^(Sleeping|Working|Cooking|Storage|Entry \/ getting ready|Bathroom|Balcony \/ outdoor) — /.test(line)).length, 7);
  assert.ok(text(5, 'en').every((line) => !line.startsWith('Those numbers are all it takes')), 'the lead-in belongs to the game page');
  assert.deepEqual(text(6, 'en'), ['Those numbers are all it takes. Try arranging the same room yourself.']);
  assert.equal(pages[6].interactive?.id, 'room-fit');
  assert.equal(pages[6].title.en, 'Arrange the room yourself');
  assert.ok(pages[5].blocks.some((b) => b.type === 'table'), 'the measurements page has its tables');
  for (const i of [4, 5]) {
    assert.ok(pages[i].picture, `${pages[i].stage} has no drawing of its own, so the section's slide is its picture`);
    assert.ok(!pages[i].blocks.some((b) => b.type === 'image'), `${pages[i].stage}: the slide leads the page, it is not also in the words`);
  }
  assert.match(String(pages[4].picture?.src), /05-iterations/);
  assert.match(String(pages[5].picture?.src), /06-measurements/);
  for (const i of [0, 1, 2, 3, 7]) {
    assert.ok(!pages[i].blocks.some((b) => b.type === 'image' || b.type === 'gallery'), `${pages[i].stage} draws its own picture (GuideStage) and does not also need the section's slide`);
    assert.equal(pages[i].picture, undefined, `${pages[i].stage} draws its own picture`);
  }
  for (const page of pages) for (const lang of ['en', 'th'] as const) assert.ok(text(page.index, lang).every((line) => line.trim() !== ''));
});

test('the article\'s last section is the final plan, and its closing "record of decisions" is a page of no guide', () => {
  const pages = guidePages(article);
  const final = pages[pages.length - 1];
  assert.equal(final.key, '07-the-final-plan');
  assert.ok(!final.blocks.some((b) => b.type === 'p' && b.text.en.startsWith('A floor plan can look simple')));
});
