// How wide is wide enough? The width standards behind the room-arranging game, kept apart from
// the furniture: a room's brief (slide 2 of Design Notes #01) is a list of things to DO — sleep,
// work, cook, keep clothes, come in from outside, walk between them — and each needs some floor
// that no piece stands on. This says how much, in centimetres, and what to call it.
//
// Pure data and one comparison, so tools/__tests__/roomStandards.test.ts runs it on plain Node
// and the pieces of the screen read the same numbers the rules use, never a copy of them.
//
// These are Nature Haven's own working numbers, drawn in the spirit of universal design (WELL v2
// Accessibility and Universal Design, C13). Only two have a published counterpart to be set
// beside: an accessible route is 91 cm (36 in) wide, 81 cm (32 in) at a point (ADA Standards,
// Access Board) — our walkway's 90 and 80; a kitchen walkway is 91 cm and a one-cook work aisle
// 107 cm (NKBA) — our 90 and 120 in front of the counter. The rest are our own judgement. None is
// a WELL requirement, and the article says so.

/** From least to most room. "tight" is the failing tier; "standard" is what we call just right. */
export type Tier = 'tight' | 'minimum' | 'standard' | 'comfortable';
export const TIERS: readonly Tier[] = ['tight', 'minimum', 'standard', 'comfortable'];

/** The zones of the article's Brief slide, plus the walk between them. */
export type BriefZone = 'sleeping' | 'circulation' | 'wardrobe' | 'cooking' | 'working' | 'entry';
export const BRIEF_ZONES: readonly BriefZone[] = ['sleeping', 'circulation', 'wardrobe', 'cooking', 'working', 'entry'];

/** The floor in front of a piece that has a front. */
export type FrontSpaceId = 'closet' | 'kitchen' | 'fridge' | 'table' | 'shelf';
export type SpaceId = 'walk' | 'bedside' | FrontSpaceId;

/** In reading order: the bed and the walk first, then each piece down the plan. */
export const SPACE_IDS: readonly SpaceId[] = ['bedside', 'walk', 'closet', 'kitchen', 'fridge', 'table', 'shelf'];

export interface SpaceStandard {
  zone: BriefZone;
  /** The width (cm) at which the space stops being tight. */
  minimum: number;
  /** The width at which it is just right: our standard. */
  standard: number;
  /** The width at which it is comfortable. */
  comfortable: number;
  /** The least tier the game accepts for this space. */
  required: Exclude<Tier, 'tight'>;
}

export const SPACE_STANDARDS: Record<SpaceId, SpaceStandard> = {
  // The article's own numbers: 90 cm to walk, 120 cm beside the bed (slide 4).
  walk: { zone: 'circulation', minimum: 80, standard: 90, comfortable: 120, required: 'standard' },
  bedside: { zone: 'sleeping', minimum: 60, standard: 90, comfortable: 120, required: 'comfortable' },
  closet: { zone: 'wardrobe', minimum: 60, standard: 90, comfortable: 120, required: 'standard' },
  kitchen: { zone: 'cooking', minimum: 70, standard: 90, comfortable: 120, required: 'standard' },
  fridge: { zone: 'cooking', minimum: 55, standard: 70, comfortable: 90, required: 'standard' },
  table: { zone: 'working', minimum: 60, standard: 70, comfortable: 90, required: 'standard' },
  shelf: { zone: 'entry', minimum: 40, standard: 50, comfortable: 90, required: 'standard' },
};

/** Float noise on a measured walkway (a hypotenuse, doubled): far below anything a centimetre can mean. */
const FLOAT_NOISE = 1e-9;

/** True from a threshold up; every comparison against a threshold goes through here, so the tiers and the rule cannot disagree. */
const atLeast = (cm: number, threshold: number): boolean => cm >= threshold - FLOAT_NOISE;

/** Which tier a width falls in. A threshold belongs to the tier it opens: 90 is "standard". */
export function tierOf(space: SpaceId, cm: number): Tier {
  const s = SPACE_STANDARDS[space];
  if (atLeast(cm, s.comfortable)) return 'comfortable';
  if (atLeast(cm, s.standard)) return 'standard';
  if (atLeast(cm, s.minimum)) return 'minimum';
  return 'tight';
}

/** The width the game asks for: the threshold of the required tier. */
export const requiredCm = (space: SpaceId): number => SPACE_STANDARDS[space][SPACE_STANDARDS[space].required];

/** True from the required width up (the epsilon absorbs float noise on a measured walkway, not a fudge). */
export const meetsRequirement = (space: SpaceId, cm: number): boolean => atLeast(cm, requiredCm(space));

/**
 * What a space still needs to meet the game, or null when it already does. The tier alone cannot say:
 * beside the bed "just right" (90) is not enough, because the game asks for "comfortable" (120).
 */
export const shortOf = (space: SpaceId, cm: number): number | null => (meetsRequirement(space, cm) ? null : requiredCm(space));

/**
 * A measured width as the whole centimetres to print, rounded DOWN so a width that falls short never
 * reads as one that meets the standard (89.6 says 89, never 90). Only the walkway is ever fractional:
 * squeezing between two corners it is a diagonal, and a 65 x 65 gap is 91.92 cm.
 */
export const wholeCm = (cm: number): number => Math.floor(cm + FLOAT_NOISE);
