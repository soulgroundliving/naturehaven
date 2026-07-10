// Aggregates the Architectural Lookbook collections.
// Add a new collection = create src/content/collections/<slug>.ts + import here.
// tools/prerender.mjs derives its /collections/<slug> routes from that
// directory listing, so routes stay in sync by construction.

import type { Collection } from '@/data/collectionTypes';
import atmosphericStructure from '@/content/collections/atmospheric-structure';
import theSanctuary from '@/content/collections/the-sanctuary';
import ergonomicPetFriendly from '@/content/collections/ergonomic-pet-friendly';
import theBath from '@/content/collections/the-bath';
import theBalcony from '@/content/collections/the-balcony';

export const COLLECTIONS: Collection[] = [
  atmosphericStructure,
  theSanctuary,
  ergonomicPetFriendly,
  theBath,
  theBalcony,
].sort((a, b) => a.index.localeCompare(b.index));

export function getCollection(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}
