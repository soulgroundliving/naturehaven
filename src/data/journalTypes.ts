// Shared shape for Haven Journal articles.
// One article = one file in src/content/journal/<slug>.ts — the filename IS
// the route slug (tools/prerender.mjs derives its route list from that
// directory, so keep them in sync by construction).

export interface Bilingual {
  en: string;
  th: string;
}

export type ArticleBlock =
  | { type: 'p'; text: Bilingual }
  | { type: 'h2'; text: Bilingual }
  | { type: 'pull'; text: Bilingual };

export interface Article {
  slug: string;
  category: Bilingual;
  title: Bilingual;
  excerpt: Bilingual;
  /** ISO date, drives sort order (newest first) */
  date: string;
  readMinutes: number;
  /** public/ asset path, e.g. /assets/about-minimal-room.jpg */
  hero: string;
  heroAlt: Bilingual;
  blocks: ArticleBlock[];
}
