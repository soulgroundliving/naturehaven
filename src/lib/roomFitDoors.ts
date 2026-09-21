// The doors of the room-arranging game, as the owner's plan draws them (slides 3 and 7 of Design
// Notes #01): the front door is hinged on its left jamb and swings OUT to the corridor, the
// bathroom door is hinged on its left jamb and swings INTO the bathroom, and the balcony is a
// double sliding door. None of them swings into the living area — so an open door never takes
// floor from the furniture, and what it needs is only the floor you stand on to walk through
// (DOOR_ZONES, which the "doors stay clear" rule keeps free).
//
// Pure geometry in centimetres (x right, y down), so tools/__tests__/roomFitDoors.test.ts proves
// those claims on plain Node and the screen (DoorsLayer.tsx) only draws them.
import { DOOR_ZONES, ROOM } from './roomFit.ts';
import type { DoorId } from './roomFit.ts';
import type { Point } from './roomFitRoute.ts';

export interface DoorSpec {
  kind: 'swing' | 'slide';
  /** The wall the door is in: y of the wall line (the front door in the bottom wall, the others under the balcony and bathroom). */
  wallY: number;
  /** The opening in the wall, from the left jamb to the right one (x, cm). It is the door's own width. */
  x0: number;
  x1: number;
  /** For a swinging door, the direction the leaf turns towards when it opens (a unit vector); null for a sliding door. */
  swing: Point | null;
}

const { entrance, bathroom, balcony } = DOOR_ZONES;

export const DOOR_SPECS: Record<DoorId, DoorSpec> = {
  entrance: { kind: 'swing', wallY: ROOM.length, x0: entrance.x0, x1: entrance.x1, swing: { x: 0, y: 1 } },
  bathroom: { kind: 'swing', wallY: ROOM.topZone, x0: bathroom.x0, x1: bathroom.x1, swing: { x: 0, y: -1 } },
  balcony: { kind: 'slide', wallY: ROOM.topZone, x0: balcony.x0, x1: balcony.x1, swing: null },
};

/** The width of the opening, which is also the width of a swinging leaf. */
export const doorWidth = (id: DoorId): number => DOOR_SPECS[id].x1 - DOOR_SPECS[id].x0;

/** The hinge: the left jamb, on the wall line. Only swinging doors have one. */
export function hingeOf(id: DoorId): Point | null {
  const spec = DOOR_SPECS[id];
  return spec.kind === 'swing' ? { x: spec.x0, y: spec.wallY } : null;
}

/** Where the free end of a swinging leaf is when the door is open: the leaf stands square to the wall. */
export function openLeafTip(id: DoorId): Point | null {
  const spec = DOOR_SPECS[id];
  const hinge = hingeOf(id);
  if (!hinge || !spec.swing) return null;
  return { x: hinge.x + spec.swing.x * doorWidth(id), y: hinge.y + spec.swing.y * doorWidth(id) };
}

/** Where the free end is when it is shut: on the far jamb. */
export function closedLeafTip(id: DoorId): Point | null {
  const hinge = hingeOf(id);
  return hinge ? { x: DOOR_SPECS[id].x1, y: hinge.y } : null;
}

/**
 * Points sweeping the floor a swinging leaf passes over on its way from shut to open (the fan between
 * the two positions), for checking where that floor is. Empty for a sliding door, which sweeps nothing.
 */
export function swingSweep(id: DoorId, steps = 12): Point[] {
  const hinge = hingeOf(id);
  const spec = DOOR_SPECS[id];
  if (!hinge || !spec.swing) return [];
  const width = doorWidth(id);
  const points: Point[] = [];
  for (let a = 0; a <= steps; a += 1) {
    // from along the wall (0) to square to it (90 degrees), towards the side the door swings to
    const angle = (a / steps) * (Math.PI / 2);
    for (let r = width / steps; r <= width + 1e-9; r += width / steps) {
      points.push({ x: hinge.x + Math.cos(angle) * r, y: hinge.y + spec.swing.y * Math.sin(angle) * r });
    }
  }
  return points;
}
