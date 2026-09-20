import { FINAL_PLAN, PIECE_IDS, footprintOf } from '@/lib/roomFit';
import type { Layout, Placement } from '@/lib/roomFit';
import type { LangCode } from '@/lib/journalBlocks';
import { PIECE_NAME } from './copy';

const onItsSpot = (a: Placement, b: Placement) => a.x === b.x && a.y === b.y && a.rot === b.rot;

// The article's own final plan, as dashed outlines over the visitor's arrangement. Purely
// decorative — the caption beside the board says what it shows — so it is hidden from
// assistive technology and never takes a pointer event. A piece already on its spot keeps
// the outline but loses the label: printed over the piece's own caption, the two garble.
export default function GhostPlan({ layout, lang }: { layout: Layout; lang: LangCode }) {
  return (
    <g data-testid="room-fit-ghost" className="pointer-events-none" aria-hidden="true">
      {PIECE_IDS.map((id) => {
        const f = footprintOf(id, FINAL_PLAN[id]);
        const w = f.x1 - f.x0;
        const h = f.y1 - f.y0;
        const cx = f.x0 + w / 2;
        const cy = f.y0 + h / 2;
        return (
          <g key={id}>
            <rect x={f.x0} y={f.y0} width={w} height={h} rx={3} fill="none" strokeWidth={2.5} strokeDasharray="9 5" className="stroke-warm-brown" />
            {!onItsSpot(layout[id], FINAL_PLAN[id]) && (
              <text
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={11}
                transform={h > w && w < 70 ? `rotate(-90 ${cx} ${cy})` : undefined}
                className="fill-warm-brown"
              >
                {PIECE_NAME[id][lang]}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}
