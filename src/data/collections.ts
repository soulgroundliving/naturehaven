// Aggregates the Architectural Lookbook collections.
// Add a new collection = create src/content/collections/<slug>.ts + import here.
// tools/prerender.mjs derives its /collections/<slug> routes from that
// directory listing, so routes stay in sync by construction.

import type { Collection } from '@/data/collectionTypes';
import atmosphericStructure from '@/content/collections/atmospheric-structure';
import theSanctuary from '@/content/collections/the-sanctuary';
import ergonomicPetFriendly from '@/content/collections/ergonomic-pet-friendly';
import functionalZones from '@/content/collections/functional-zones';

export const COLLECTIONS: Collection[] = [
  atmosphericStructure,
  theSanctuary,
  ergonomicPetFriendly,
  functionalZones,
].sort((a, b) => a.index.localeCompare(b.index));

export function getCollection(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}
