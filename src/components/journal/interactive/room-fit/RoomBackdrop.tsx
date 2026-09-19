import { memo } from 'react';
import { DOOR_ZONES, ROOM } from '@/lib/roomFit';
import type { LangCode } from '@/lib/journalBlocks';
import { AREA_LABEL } from './copy';

const WALL = 7;

// Pillars sit in the walls (slide 3 marks them). They are drawn, not obstacles:
// they protrude only a few centimetres, which the game does not model.
const PILLARS: [number, number][] = [
  [0, 0],
  [ROOM.width, 0],
  [0, ROOM.length],
  [ROOM.width, ROOM.length],
  [0, 372],
  [ROOM.width, 372],
];

// One path for every wall, with the openings left out: the front door in the
// bottom wall, the bathroom door and the balcony door in the wall under the balcony
// and bathroom. The openings are the door zones the rules use, so the drawing cannot
// disagree with them.
const { entrance, balcony, bathroom } = DOOR_ZONES;
const WALLS = [
  `M0 0H${ROOM.width}V${ROOM.length}H${entrance.x1}`,
  `M${entrance.x0} ${ROOM.length}H0V0`,
  `M${ROOM.balconyWidth} 0V${ROOM.topZone}`,
  `M0 ${ROOM.topZone}H${balcony.x0}`,
  `M${balcony.x1} ${ROOM.topZone}H${bathroom.x0}`,
  `M${bathroom.x1} ${ROOM.topZone}H${ROOM.width}`,
].join('');

// The fixed part of the plan: floor, balcony, bathroom, walls, pillars. It never
// changes while a piece is dragged, so it renders once per language.
function RoomBackdrop({ lang }: { lang: LangCode }) {
  return (
    <g aria-hidden="true">
      <rect x={0} y={0} width={ROOM.width} height={ROOM.length} style={{ fill: 'var(--card-bg, rgba(255,255,255,0.85))' }} />
      <rect x={0} y={0} width={ROOM.balconyWidth} height={ROOM.topZone} style={{ fill: 'var(--sec-border)', opacity: 0.35 }} />
      <rect
        x={ROOM.balconyWidth}
        y={0}
        width={ROOM.width - ROOM.balconyWidth}
        height={ROOM.topZone}
        style={{ fill: 'var(--sec-border)', opacity: 0.2 }}
      />
      <text x={ROOM.balconyWidth / 2} y={ROOM.topZone / 2} textAnchor="middle" dominantBaseline="central" fontSize={14} style={{ fill: 'var(--sec-text-70)' }}>
        {AREA_LABEL.balcony[lang]}
      </text>
      <text
        x={(ROOM.balconyWidth + ROOM.width) / 2}
        y={ROOM.topZone / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={14}
        style={{ fill: 'var(--sec-text-70)' }}
      >
        {AREA_LABEL.bathroom[lang]}
      </text>
      {/* the balcony window, drawn as a gap in its outer wall */}
      <path d="M20 0H120" style={{ stroke: 'var(--card-bg, #fff)', strokeWidth: 3 }} />
      <path d={WALLS} fill="none" strokeLinecap="square" style={{ stroke: 'var(--sec-text)', strokeWidth: WALL }} />
      {PILLARS.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x - 6} y={y - 6} width={12} height={12} style={{ fill: 'var(--sec-text)', opacity: 0.55 }} />
      ))}
      <text x={260} y={ROOM.length + 22} textAnchor="middle" fontSize={13} style={{ fill: 'var(--sec-text-70)' }}>
        {AREA_LABEL.entrance[lang]}
      </text>
    </g>
  );
}

export default memo(RoomBackdrop);
