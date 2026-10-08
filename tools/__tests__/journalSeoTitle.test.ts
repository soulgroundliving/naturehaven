// The title a search result shows for a Journal article — and the honesty condition the owner set for the page that carries
// "ห้องเช่าเงียบสงบ" (2026-10-08): a page that says "quiet" must also say what can be heard from outside.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { documentTitle } from '../../src/lib/journalBlocks.ts';
import { SEO_TITLE_MAX, validateArticle } from '../../src/lib/journalContract.ts';
import quietByDesign from '../../src/content/journal/quiet-by-design.ts';
import type { Article } from '../../src/data/journalTypes.ts';

const t = (en: string, th: string) => ({ en, th });
const essay = (seoTitle?: Article['seoTitle']): Article => ({
  slug: 'essay',
  category: t('Notes', 'บันทึก'),
  title: t('An essay', 'เรียงความ'),
  excerpt: t('About an essay.', 'เกี่ยวกับเรียงความ'),
  date: '2026-10-08',
  readMinutes: 1,
  hero: '/assets/room-view-in.jpg',
  heroAlt: t('A room', 'ห้อง'),
  ...(seoTitle ? { seoTitle } : {}),
  blocks: [{ type: 'p', text: t('Words.', 'คำ') }],
});

describe('documentTitle', () => {
  it('without a seoTitle it is the article title plus the journal name — what every article had before', () => {
    assert.equal(documentTitle(essay(), 'en'), 'An essay — The Haven Journal');
    assert.equal(documentTitle(essay(), 'th'), 'เรียงความ — The Haven Journal');
  });

  it('with a seoTitle it is exactly that, per language, and the journal name is not added', () => {
    const a = essay(t('Short English title | Nature Haven', 'ชื่อสั้น | Nature Haven'));
    assert.equal(documentTitle(a, 'en'), 'Short English title | Nature Haven');
    assert.equal(documentTitle(a, 'th'), 'ชื่อสั้น | Nature Haven');
  });
});

describe('seoTitle is held to a length a search result can show', () => {
  it('passes at the limit and names the field when it is over, in either language', () => {
    const ok = 'x'.repeat(SEO_TITLE_MAX);
    assert.deepEqual(validateArticle(essay(t(ok, ok))), []);
    const over = 'x'.repeat(SEO_TITLE_MAX + 1);
    assert.match(validateArticle(essay(t(over, 'สั้น'))).join('\n'), /seoTitle\.en/);
    assert.match(validateArticle(essay(t('short', over))).join('\n'), /seoTitle\.th/);
  });
});

describe('quiet-by-design', () => {
  it('honours the article contract', () => {
    assert.deepEqual(validateArticle(quietByDesign), []);
  });

  it('is titled for what a visitor searches (ห้องเช่าเงียบสงบ · ไม่มีลิฟต์), in the brand name, not under a third name', () => {
    const th = documentTitle(quietByDesign, 'th');
    assert.ok(th.includes('ห้องเช่าเงียบสงบ'), th);
    assert.ok(th.includes('ไม่มีลิฟต์'), th);
    assert.ok(th.includes('Nature Haven'), th);
    assert.ok(!th.includes('The Haven Journal'), th);
    const en = documentTitle(quietByDesign, 'en');
    assert.ok(en.includes('Nature Haven') && !en.includes('The Haven Journal'), en);
    assert.ok(th.length <= SEO_TITLE_MAX && en.length <= SEO_TITLE_MAX, `${th.length}/${en.length}`);
  });

  it('says what can be heard from outside — the condition for using "ห้องเช่าเงียบสงบ" on this page', () => {
    const callouts = quietByDesign.blocks.filter((b) => b.type === 'callout');
    const outside = callouts.find((b) => b.type === 'callout' && b.text.th.includes('เสียงจากภายนอก'));
    assert.ok(outside, 'no callout about sound from outside');
    assert.ok(outside.type === 'callout' && /outside/i.test(outside.text.en), 'the English must say it too');
  });
});
