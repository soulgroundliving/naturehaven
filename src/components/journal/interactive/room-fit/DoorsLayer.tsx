import { memo } from 'react';
import type { KeyboardEvent } from 'react';
import { DOOR_IDS } from '@/lib/roomFit';
import type { DoorId } from '@/lib/roomFit';
import { DOOR_SPECS, closedLeafTip, doorWidth, hingeOf, openLeafTip } from '@/lib/roomFitDoors';
import type { LangCode } from '@/lib/journalBlocks';
import { doorToggleLabel } from './copy';

// The three doors, drawn the way the article's plan draws them and openable by a tap or Enter/Space:
// the front door swings OUT to the corridor, the bathroom door swings INTO the bathroom, and the
// balcony is a double sliding door. None swings into the living area (src/lib/roomFitDoors.ts).
// Opening a door changes nothing in the rules: it shows what the door is. The label states the door's
// state and what pressing does, so there is no aria-pressed as well (two statements of one fact); a
// keyboard visitor sees a dashed ring round the door (the `group/door` variant — a variant written
// `focus-visible:[&>rect]:` puts the pseudo-class on the rect, which is never focused).

const LEAF = { stroke: 'var(--sec-text)', strokeWidth: 4, strokeLinecap: 'round' } as const;
const ARC = { stroke: 'var(--sec-text-70)', strokeWidth: 2, strokeDasharray: '6 5' } as const;
const PANEL = { stroke: 'var(--sec-text)', strokeWidth: 3, opacity: 0.85 } as const;
/** How far beyond its opening a door answers to a tap, so a finger has more than a slit to hit. */
const HIT_MARGIN = 10;
const HIT_HALF_DEPTH = 24;

// Shut, the leaf lies along its wall from the hinge to the far jamb; open, it stands square to the wall and its
// free end has swept a quarter turn about the hinge. Every point comes from roomFitDoors.ts, the geometry the
// unit tests prove — the screen adds nothing of its own.
function swingDrawing(id: DoorId, open: boolean) {
  const hinge = hingeOf(id);
  const jamb = closedLeafTip(id);
  const tip = openLeafTip(id);
  if (!hinge || !jamb || !tip) return null;
  const w = doorWidth(id);
  const pin = <circle cx={hinge.x} cy={hinge.y} r={3.5} style={{ fill: 'var(--sec-text)' }} />;
  if (!open) {
    return (
      <>
        <line x1={hinge.x} y1={hinge.y} x2={jamb.x} y2={jamb.y} style={{ ...LEAF, strokeWidth: 3.5 }} />
        {pin}
      </>
    );
  }
  // Counter-clockwise from the tip to the far jamb when it opens down the plan, clockwise when it opens up.
  const sweep = tip.y > hinge.y ? 0 : 1;
  return (
    <>
      <path d={`M${hinge.x} ${hinge.y}L${tip.x} ${tip.y}A${w} ${w} 0 0 ${sweep} ${jamb.x} ${jamb.y}Z`} style={{ fill: 'var(--sec-text)', opacity: 0.07 }} />
      <path d={`M${tip.x} ${tip.y}A${w} ${w} 0 0 ${sweep} ${jamb.x} ${jamb.y}`} fill="none" style={ARC} />
      <line x1={hinge.x} y1={hinge.y} x2={tip.x} y2={tip.y} style={LEAF} />
      {pin}
    </>
  );
}

// Two panels, each a little over half the opening, one running behind the other. Shut, they fill it;
// open, the front one has slid over the back one and half the opening is clear.
function slideDrawing(id: DoorId, open: boolean) {
  const { x0, x1, wallY } = DOOR_SPECS[id];
  const panel = (doorWidth(id) + 8) / 2;
  const d = open
    ? `M${x0} ${wallY - 3}H${x0 + panel}M${x0 + 4} ${wallY + 3}H${x0 + 4 + panel}`
    : `M${x0} ${wallY - 3}H${x0 + panel}M${x1 - panel} ${wallY + 3}H${x1}`;
  return <path data-testid="room-fit-balcony-door" d={d} fill="none" style={PANEL} />;
}

interface DoorsLayerProps {
  /** Which doors stand open. */
  open: Record<DoorId, boolean>;
  lang: LangCode;
  onToggle: (id: DoorId) => void;
}

function DoorsLayer({ open, lang, onToggle }: DoorsLayerProps) {
  const onKeyDown = (event: KeyboardEvent<SVGGElement>, id: DoorId) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    // A key held down repeats; the door should open once, not flicker open and shut.
    if (event.repeat) return;
    onToggle(id);
  };
  return (
    <g data-testid="room-fit-doors">
      {DOOR_IDS.map((id) => {
        const spec = DOOR_SPECS[id];
        const isOpen = open[id];
        return (
          <g
            key={id}
            data-door={id}
            data-open={isOpen}
            role="button"
            tabIndex={0}
            aria-label={doorToggleLabel(id, isOpen, lang)}
            className="group/door cursor-pointer outline-none"
            onClick={() => onToggle(id)}
            onKeyDown={(event) => onKeyDown(event, id)}
          >
            <rect
              x={spec.x0 - HIT_MARGIN}
              y={spec.wallY - HIT_HALF_DEPTH}
              width={spec.x1 - spec.x0 + 2 * HIT_MARGIN}
              height={2 * HIT_HALF_DEPTH}
              rx={6}
              fill="transparent"
              // A focus ring is drawn in screen pixels, not plan units: at the scale a phone draws the plan a 2-unit
              // line was under a pixel wide - too thin to find the focused door by.
              vectorEffect="non-scaling-stroke"
              strokeWidth={2.5}
              strokeDasharray="4 4"
              stroke="transparent"
              className="group-focus-visible/door:stroke-[color:var(--sec-text)]"
            />
            {spec.kind === 'swing' ? swingDrawing(id, isOpen) : slideDrawing(id, isOpen)}
          </g>
        );
      })}
    </g>
  );
}

export default memo(DoorsLayer);
