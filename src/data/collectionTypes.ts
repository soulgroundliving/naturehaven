// Shared shape for the Architectural Lookbook collections.
// One collection = one file in src/content/collections/<slug>.ts — the
// filename IS the route slug (tools/prerender.mjs derives its route list
// from that directory, same contract as the Journal).

import type { Bilingual } from '@/data/journalTypes';

export interface CollectionDetail {
  /** EN small-caps design device, shown in both languages (e.g. "The Orientation") */
  label: string;
  title: Bilingual;
  body: Bilingual;
  /** Optional hard-spec line rendered small + muted under the story */
  spec?: Bilingual;
}

export interface Collection {
  slug: string;
  /** '01'…'04' — drives ordering and the numbered editorial layout */
  index: string;
  title: Bilingual;
  /** One-line essence used on homepage cards and page lede */
  essence: Bilingual;
  /** Page-top manifesto paragraph */
  manifesto: Bilingual;
  /** public/ asset path or full URL */
  hero: string;
  heroAlt: Bilingual;
  details: CollectionDetail[];
}
