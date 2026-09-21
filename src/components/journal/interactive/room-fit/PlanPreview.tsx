import { PIECES, footprintOf } from '@/lib/roomFit';
import type { Layout } from '@/lib/roomFit';
import type { LangCode } from '@/lib/journalBlocks';
import RoomBackdrop from './RoomBackdrop';
import { STYLE } from './pieceStyle';

// The plan as a picture, for the card a phone shows in the article: the arrangement as it stands,
// with nothing to grab. Playing happens in the full-screen game.
export default function PlanPreview({ layout, lang }: { layout: Layout; lang: LangCode }) {
  return (
    <svg viewBox="-16 -16 382 772" aria-hidden="true" className="block h-auto w-full">
      <RoomBackdrop lang={lang} />
      {PIECES.map((piece) => {
        const f = footprintOf(piece.id, layout[piece.id]);
        return (
          <rect
            key={piece.id}
            x={f.x0}
            y={f.y0}
            width={f.x1 - f.x0}
            height={f.y1 - f.y0}
            rx={3}
            strokeWidth={1.5}
            className={STYLE[piece.id].fill}
            style={{ stroke: 'var(--sec-text)', strokeOpacity: 0.7 }}
          />
        );
      })}
    </svg>
  );
}
