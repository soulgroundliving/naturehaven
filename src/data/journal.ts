// Aggregates Haven Journal articles. Add a new article by creating
// src/content/journal/<slug>.ts and importing it here — tools/prerender.mjs
// picks the route up automatically from the directory listing.
import type { Article } from '@/data/journalTypes';
import quietByDesign from '@/content/journal/quiet-by-design';
import petsAtHome from '@/content/journal/pets-at-home-31-5-sqm';
import buildDiary01 from '@/content/journal/build-diary-01';

export type { Article, ArticleBlock, Bilingual } from '@/data/journalTypes';

export const ARTICLES: Article[] = [quietByDesign, petsAtHome, buildDiary01]
  .slice()
  .sort((a, b) => b.date.localeCompare(a.date));

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

const TH_MONTHS = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
];
const EN_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** '2026-07-03' → th: '3 ก.ค. 2569' · en: 'Jul 3, 2026' */
export function formatArticleDate(iso: string, lang: 'en' | 'th'): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return lang === 'th'
    ? `${d} ${TH_MONTHS[m - 1]} ${y + 543}`
    : `${EN_MONTHS[m - 1]} ${d}, ${y}`;
}
