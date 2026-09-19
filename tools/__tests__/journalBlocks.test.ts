// Unit tests for the pure helpers behind the Journal block renderer.
// Run with:  npm run test:journal   (Node's built-in runner — no test framework
// is installed in this repo, and these helpers are deliberately dependency-free
// so they can run on plain Node).
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  collectHeadings,
  galleryIndexFromScroll,
  initialChoiceId,
  isLocalAssetPath,
  localize,
  shouldShowToc,
  slugify,
} from '../../src/lib/journalBlocks.ts';
import { collectAssetPaths, validateArticle } from '../../src/lib/journalContract.ts';
import type { Article, ArticleBlock } from '../../src/data/journalTypes.ts';

const t = (en: string, th = 'ไทย') => ({ en, th });
const h2 = (en: string, id?: string): ArticleBlock => ({ type: 'h2', text: t(en), ...(id ? { id } : {}) });
const h3 = (en: string, id?: string): ArticleBlock => ({ type: 'h3', text: t(en), ...(id ? { id } : {}) });
const p = (en: string): ArticleBlock => ({ type: 'p', text: t(en) });

describe('localize', () => {
  it('returns a plain string unchanged in both languages', () => {
    assert.equal(localize('L195 x D45', 'en'), 'L195 x D45');
    assert.equal(localize('L195 x D45', 'th'), 'L195 x D45');
  });

  it('picks the requested language from a bilingual value', () => {
    assert.equal(localize({ en: 'Bed', th: 'เตียง' }, 'en'), 'Bed');
    assert.equal(localize({ en: 'Bed', th: 'เตียง' }, 'th'), 'เตียง');
  });
});

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    assert.equal(slugify('01 — The Plan'), '01-the-plan');
  });

  it('collapses punctuation and trims stray dashes', () => {
    assert.equal(slugify('  Pets & Policy!! '), 'pets-policy');
  });

  it('returns an empty string when nothing ASCII survives', () => {
    assert.equal(slugify('แปลน'), '');
  });
});

describe('collectHeadings', () => {
  it('lists only h2 and h3 blocks and keeps their top-level index', () => {
    const blocks = [p('intro'), h2('The Plan'), p('body'), h3('Details')];
    const found = collectHeadings(blocks);
    assert.deepEqual(
      found.map((h) => [h.index, h.level]),
      [
        [1, 2],
        [3, 3],
      ],
    );
  });

  it('derives ids from the English text so they survive a language switch', () => {
    const [first] = collectHeadings([h2('01 — The Plan')]);
    assert.equal(first.id, '01-the-plan');
  });

  it('prefers an explicit id, cleaned to a safe slug', () => {
    const [first] = collectHeadings([h2('The Plan', 'Plan Section')]);
    assert.equal(first.id, 'plan-section');
  });

  it('falls back to s<position> when the English text has nothing usable', () => {
    const found = collectHeadings([h2('The Plan'), h2('!!!')]);
    assert.equal(found[1].id, 's2');
  });

  it('keeps every id unique when the same heading repeats', () => {
    const found = collectHeadings([h2('Overview'), h2('Overview'), h2('Overview')]);
    assert.deepEqual(
      found.map((h) => h.id),
      ['overview', 'overview-2', 'overview-3'],
    );
  });

  it('keeps an explicit id from colliding with an earlier derived one', () => {
    const found = collectHeadings([h2('Pets'), h2('Something else', 'pets')]);
    assert.deepEqual(
      found.map((h) => h.id),
      ['pets', 'pets-2'],
    );
  });

  it('returns nothing for an article without headings', () => {
    assert.deepEqual(collectHeadings([p('only text')]), []);
  });
});

describe('shouldShowToc', () => {
  const sections = (n: number) => collectHeadings(Array.from({ length: n }, (_, i) => h2(`Section ${i + 1}`)));

  it('shows automatically from four h2 sections up', () => {
    assert.equal(shouldShowToc(undefined, sections(4)), true);
    assert.equal(shouldShowToc(undefined, sections(3)), false);
  });

  it('does not count h3 sub-headings toward the automatic threshold', () => {
    const headings = collectHeadings([h2('A'), h3('a1'), h3('a2'), h3('a3'), h3('a4')]);
    assert.equal(shouldShowToc(undefined, headings), false);
  });

  it('lets the article force it on or off', () => {
    assert.equal(shouldShowToc({ toc: true }, sections(1)), true);
    assert.equal(shouldShowToc({ toc: false }, sections(9)), false);
  });

  it('never shows an empty table of contents, even when forced', () => {
    assert.equal(shouldShowToc({ toc: true }, []), false);
  });
});

describe('isLocalAssetPath', () => {
  it('accepts site-relative paths', () => {
    assert.equal(isLocalAssetPath('/assets/journal/design-notes-01/1.webp'), true);
    assert.equal(isLocalAssetPath('/assets/a.jpg?v=2'), true);
  });

  it('rejects external hosts — the CSP would block them', () => {
    assert.equal(isLocalAssetPath('https://example.com/a.jpg'), false);
    assert.equal(isLocalAssetPath('http://example.com/a.jpg'), false);
    assert.equal(isLocalAssetPath('//cdn.example.com/a.jpg'), false);
  });

  it('rejects data:, javascript: and relative paths', () => {
    assert.equal(isLocalAssetPath('data:image/png;base64,AAAA'), false);
    assert.equal(isLocalAssetPath('javascript:alert(1)'), false);
    assert.equal(isLocalAssetPath('assets/a.jpg'), false);
    assert.equal(isLocalAssetPath('../a.jpg'), false);
    assert.equal(isLocalAssetPath(''), false);
    assert.equal(isLocalAssetPath(' /assets/a.jpg'), false);
  });

  it('rejects a backslash path that browsers read as protocol-relative', () => {
    assert.equal(isLocalAssetPath('/\\evil.example.com/a.jpg'), false);
  });

  it('rejects control characters, which URL parsing strips to leave "//host"', () => {
    for (const evil of ['/\t/evil.example.com', '/\n/evil.example.com', '/\r/evil.example.com', '/' + String.fromCharCode(0) + '/evil.example.com']) {
      assert.equal(isLocalAssetPath(evil), false, JSON.stringify(evil));
    }
  });
});

describe('galleryIndexFromScroll', () => {
  it('maps scroll position to the nearest item', () => {
    assert.equal(galleryIndexFromScroll(0, 300, 12, 7), 0);
    assert.equal(galleryIndexFromScroll(312, 300, 12, 7), 1);
    assert.equal(galleryIndexFromScroll(700, 300, 12, 7), 2);
  });

  it('clamps to the first and last item', () => {
    assert.equal(galleryIndexFromScroll(-40, 300, 12, 7), 0);
    assert.equal(galleryIndexFromScroll(99999, 300, 12, 7), 6);
  });

  it('does not divide by zero before layout', () => {
    assert.equal(galleryIndexFromScroll(120, 0, 0, 7), 0);
  });
});

describe('initialChoiceId', () => {
  const options = [{ id: 'student' }, { id: 'remote-work' }];

  it('uses the requested default when it exists', () => {
    assert.equal(initialChoiceId(options, 'remote-work'), 'remote-work');
  });

  it('falls back to the first option for a missing or unknown default', () => {
    assert.equal(initialChoiceId(options), 'student');
    assert.equal(initialChoiceId(options, 'nope'), 'student');
  });

  it('returns an empty string for no options', () => {
    assert.equal(initialChoiceId([]), '');
  });
});

// ── the content contract ─────────────────────────────────────────────────────
// validateArticle sees BOTH languages (the prerendered HTML only shows Thai) and
// the invalid states the types cannot forbid (empty arrays survive a cast).
const valid = (): Article => ({
  slug: 'a-piece',
  category: t('Category'),
  title: t('Title'),
  excerpt: t('Excerpt'),
  date: '2026-09-20',
  readMinutes: 5,
  hero: '/assets/hero.jpg',
  heroAlt: t('Hero'),
  blocks: [{ type: 'p', text: t('Body') }],
});
const withBlocks = (...blocks: unknown[]): Article => ({ ...valid(), blocks: blocks as Article['blocks'] });
// A picture without its block `type` — what a gallery item is.
const asset = (over: Record<string, unknown> = {}) => ({
  src: '/assets/a.webp',
  alt: t('Alt'),
  width: 100,
  height: 50,
  origin: 'photo',
  ...over,
});
const image = (over: Record<string, unknown> = {}) => ({ type: 'image', ...asset(over) });
const flagged = (article: Article, fragment: string) => validateArticle(article).some((p) => p.includes(fragment));

describe('validateArticle', () => {
  it('accepts a well-formed article', () => {
    assert.deepEqual(validateArticle(valid()), []);
  });

  it('flags empty text in either language, at the path where it sits', () => {
    assert.ok(flagged(withBlocks({ type: 'p', text: { en: 'Hello', th: '  ' } }), 'blocks[0].text.th'));
    assert.ok(flagged(withBlocks(image({ alt: { en: '', th: 'ไทย' } })), 'blocks[0].alt.en'));
  });

  it('checks the article metadata', () => {
    assert.ok(flagged({ ...valid(), slug: 'Bad Slug' }, 'slug'));
    assert.ok(flagged({ ...valid(), date: '20/09/2026' }, 'date'));
    assert.ok(flagged({ ...valid(), readMinutes: 0 }, 'readMinutes'));
    assert.ok(flagged({ ...valid(), hero: 'https://cdn.example.com/h.jpg' }, 'hero'));
    assert.ok(flagged({ ...valid(), heroAlt: t('') }, 'heroAlt.en'));
    assert.ok(flagged({ ...valid(), heroOrigin: 'stock' as never }, 'heroOrigin'));
  });

  it('image: needs same-site sources in BOTH languages, a real size and a known origin', () => {
    assert.ok(flagged(withBlocks(image({ src: 'https://cdn.example.com/a.webp' })), 'not a same-site path'));
    assert.ok(flagged(withBlocks(image({ src: { en: '/assets/a.webp', th: 'https://cdn.example.com/a.webp' } })), 'src.th'));
    assert.ok(flagged(withBlocks(image({ width: 0 })), 'width'));
    assert.ok(flagged(withBlocks(image({ height: 10.5 })), 'height'));
    assert.ok(flagged(withBlocks(image({ origin: 'stock' })), 'origin'));
    assert.deepEqual(validateArticle(withBlocks(image())), []);
  });

  it('gallery: needs items and validates each one', () => {
    assert.ok(flagged(withBlocks({ type: 'gallery', label: t('L'), items: [] }), 'no items'));
    assert.ok(flagged(withBlocks({ type: 'gallery', label: t('L'), items: [asset({ alt: t('') })] }), 'items[0].alt.en'));
    assert.ok(flagged(withBlocks({ type: 'gallery', label: t('L'), items: [asset({ src: 'https://cdn.example.com/a.webp' })] }), 'items[0]'));
  });

  it('video: needs sources, a poster and same-site paths', () => {
    const video = (over: Record<string, unknown> = {}) => ({
      type: 'video',
      sources: [{ src: '/assets/v.mp4', type: 'video/mp4' }],
      poster: '/assets/v.jpg',
      width: 16,
      height: 9,
      label: t('Clip'),
      origin: 'photo',
      ...over,
    });
    assert.deepEqual(validateArticle(withBlocks(video())), []);
    assert.ok(flagged(withBlocks(video({ sources: [] })), 'no sources'));
    assert.ok(flagged(withBlocks(video({ poster: 'https://x.example/p.jpg' })), 'poster'));
    assert.ok(flagged(withBlocks(video({ sources: [{ src: 'https://x.example/v.mp4', type: 'video/mp4' }] })), 'sources[0]'));
    assert.ok(flagged(withBlocks(video({ tracks: [{ src: 'https://x.example/t.vtt', lang: 'en', label: 'English' }] })), 'tracks[0]'));
  });

  it('table: needs rows, and every row as wide as the header', () => {
    const table = (over: Record<string, unknown>) => ({ type: 'table', ...over });
    assert.ok(flagged(withBlocks(table({ rows: [] })), 'no rows'));
    assert.ok(flagged(withBlocks(table({ head: ['A', 'B'], rows: [['1', '2'], ['3']] })), 'rows[1]'));
    assert.ok(flagged(withBlocks(table({ rows: [['1', '2'], ['3']] })), 'rows[1]'));
    assert.deepEqual(validateArticle(withBlocks(table({ head: ['A', 'B'], rows: [['1', '2']] }))), []);
  });

  it('list: needs items', () => {
    assert.ok(flagged(withBlocks({ type: 'list', items: [] }), 'no items'));
  });

  it('choice: needs options with unique ids, a real defaultId and content', () => {
    const option = (id: string, ...blocks: unknown[]) => ({ id, label: t(id), blocks: blocks.length ? blocks : [{ type: 'p', text: t('x') }] });
    const choice = (over: Record<string, unknown>) => ({ type: 'choice', label: t('Which?'), options: [option('a'), option('b')], ...over });
    assert.deepEqual(validateArticle(withBlocks(choice({}))), []);
    assert.ok(flagged(withBlocks(choice({ options: [] })), 'no options'));
    assert.ok(flagged(withBlocks(choice({ options: [option('a'), option('a')] })), 'duplicate'));
    assert.ok(flagged(withBlocks(choice({ defaultId: 'zzz' })), 'defaultId'));
    assert.ok(flagged(withBlocks(choice({ options: [{ id: 'a', label: t('a'), blocks: [] }] })), 'no blocks'));
    assert.ok(flagged(withBlocks(choice({ options: [option('Not A Slug')] })), 'id'));
  });

  it('details: needs content', () => {
    assert.ok(flagged(withBlocks({ type: 'details', summary: t('S'), blocks: [] }), 'no blocks'));
  });

  it('interactive: the id must be a slug', () => {
    assert.ok(flagged(withBlocks({ type: 'interactive', id: 'Room Fit!', title: t('T'), description: t('D') }), 'id'));
    assert.deepEqual(validateArticle(withBlocks({ type: 'interactive', id: 'room-fit', title: t('T'), description: t('D') })), []);
  });

  it('checks blocks nested inside containers, with the full path', () => {
    const nested = withBlocks({
      type: 'details',
      summary: t('S'),
      blocks: [image({ src: 'https://cdn.example.com/a.webp' })],
    });
    assert.ok(flagged(nested, 'blocks[0].blocks[0]'));
  });

  it('flags an explicit heading id that slugifies to nothing', () => {
    assert.ok(flagged(withBlocks({ type: 'h2', text: t('Heading'), id: '!!!' }), 'id'));
  });
});

describe('collectAssetPaths', () => {
  it('lists every same-site file an article references, once, in both language variants', () => {
    const article: Article = {
      ...valid(),
      blocks: withBlocks(
        image({ src: { en: '/assets/en.webp', th: '/assets/th.webp' } }),
        image({ src: '/assets/a.webp' }),
        image({ src: '/assets/a.webp' }),
        { type: 'gallery', label: t('L'), items: [asset({ src: '/assets/g1.webp' })] },
        {
          type: 'video',
          sources: [{ src: '/assets/v.webm', type: 'video/webm' }],
          poster: '/assets/v.jpg',
          width: 1,
          height: 1,
          label: t('V'),
          origin: 'photo',
          tracks: [{ src: '/assets/v.en.vtt', lang: 'en', label: 'English' }],
        },
        { type: 'details', summary: t('S'), blocks: [image({ src: '/assets/nested.webp' })] },
      ).blocks,
    };
    assert.deepEqual(new Set(collectAssetPaths(article)), new Set([
      '/assets/hero.jpg',
      '/assets/en.webp',
      '/assets/th.webp',
      '/assets/a.webp',
      '/assets/g1.webp',
      '/assets/v.webm',
      '/assets/v.jpg',
      '/assets/v.en.vtt',
      '/assets/nested.webp',
    ]));
  });

  it('leaves out anything that is not a same-site path (validateArticle reports those)', () => {
    const paths = collectAssetPaths(withBlocks(image({ src: 'https://cdn.example.com/a.webp' })));
    assert.deepEqual(paths, ['/assets/hero.jpg']);
  });
});
