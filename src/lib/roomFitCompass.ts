// Which way things face on the plan, in words. Pure, so tools/__tests__/roomFitCompass.test.ts
// runs it on plain Node — and checks these words against the geometry, so they cannot drift.
import type { Rotation } from './roomFit.ts';

/** A side of the plan, as it is drawn. */
export type Side = 'up' | 'down' | 'left' | 'right';
export type CompassPoint = 'north' | 'east' | 'south' | 'west';

/**
 * Slide 3 of the article draws the compass with S at the top of the plan and N at the bottom.
 * Turned that way round, east falls on the left of the plan and west on the right. The slide
 * prints only N and S: east and west are worked out from them (assuming the plan is not
 * mirrored), so check those two against the building.
 */
export const COMPASS: Record<Side, CompassPoint> = { up: 'south', down: 'north', left: 'east', right: 'west' };

// Turning a piece clockwise moves its front, and the bed's head, round in this order — the same
// order frontZoneOf and headRectOf in roomFit.ts draw them in.
const FRONT: readonly Side[] = ['down', 'left', 'up', 'right'];
const HEAD: readonly Side[] = ['left', 'up', 'right', 'down'];

/** The side of the plan a piece's front faces. */
export const frontSide = (rot: Rotation): Side => FRONT[rot / 90];

/** The side of the plan the bed's head is on. */
export const headSide = (rot: Rotation): Side => HEAD[rot / 90];
