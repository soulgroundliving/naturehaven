import type { KeyboardEvent, PointerEvent } from 'react';
import { LIVING, footprintOf, specOf } from '@/lib/roomFit';
import type { PieceId, Placement, Rect } from '@/lib/roomFit';
import type { LangCode } from '@/lib/journalBlocks';
import { COPY, PIECE_NAME, positionLabel } from './copy';

// Fills are brand tokens, so the pieces read the same by day and by night. The OUTLINE, like the
// selection ring, follows the theme's text colour: fixed dark, a piece's edge measured only
// 1.4-1.9:1 against the night floor (3:1 is the floor for a shape you must be able to make out).
const STYLE: Record<PieceId, { fill: string; text: string }> = {
  bed: { fill: 'fill-sage-green', text: 'fill-pure-white' },
  closet: { fill: 'fill-warm-brown', text: 'fill-pure-white' },
  kitchen: { fill: 'fill-dark-grey', text: 'fill-pure-white' },
  table: { fill: 'fill-light-warm-grey', text: 'fill-dark-charcoal' },
  shelf: { fill: 'fill-warm-rose', text: 'fill-dark-charcoal' },
};
const OUTLINE = { stroke: 'var(--sec-text)', strokeOpacity: 0.7 } as const;
const MARKER = { fill: 'var(--sec-text)' } as const;

// A small arrowhead on the front edge: which way the piece faces.
function frontMarker(f: Rect, rot: Placement['rot']): string {
  const cx = (f.x0 + f.x1) / 2;
  const cy = (f.y0 + f.y1) / 2;
  switch (rot) {
    case 0:
      return `${cx - 9},${f.y1 - 2} ${cx + 9},${f.y1 - 2} ${cx},${f.y1 + 9}`;
    case 90:
      return `${f.x0 + 2},${cy - 9} ${f.x0 + 2},${cy + 9} ${f.x0 - 9},${cy}`;
    case 180:
      return `${cx - 9},${f.y0 + 2} ${cx + 9},${f.y0 + 2} ${cx},${f.y0 - 9}`;
    case 270:
      return `${f.x1 - 2},${cy - 9} ${f.x1 - 2},${cy + 9} ${f.x1 + 9},${cy}`;
  }
}

/** What a piece reports to the board; each is told which piece it came from. */
export interface PieceHandlers {
  onPointerDown: (event: PointerEvent<SVGGElement>, id: PieceId) => void;
  onPointerMove: (event: PointerEvent<SVGGElement>, id: PieceId) => void;
  onPointerEnd: () => void;
  onFocus: (id: PieceId) => void;
  onKeyDown: (event: KeyboardEvent<SVGGElement>, id: PieceId) => void;
}

interface PieceShapeProps {
  id: PieceId;
  placement: Placement;
  selected: boolean;
  overlapping: boolean;
  lang: LangCode;
  handlers: PieceHandlers;
}

// One piece on the plan: a body, an arrowhead for its front, a caption. It is a focusable group
// so it can be moved with the keyboard as well as by pointer — but Enter and Space do nothing on
// it, so it calls itself a "movable piece" rather than letting a screen reader promise a button.
export default function PieceShape({ id, placement, selected, overlapping, lang, handlers }: PieceShapeProps) {
  const f = footprintOf(id, placement);
  const fw = f.x1 - f.x0;
  const fh = f.y1 - f.y0;
  const cx = f.x0 + fw / 2;
  const cy = f.y0 + fh / 2;
  const spec = specOf(id);
  const name = PIECE_NAME[id][lang];
  const caption = Math.max(fw, fh) >= 140 ? `${name} ${spec.w}×${spec.d}` : name;
  const label = `${positionLabel(name, placement.x, placement.y - LIVING.y0, lang)} · ${spec.w}×${spec.d}`;
  const style = STYLE[id];
  return (
    <g
      role="button"
      aria-roledescription={COPY.pieceRole[lang]}
      tabIndex={0}
      aria-label={label}
      aria-pressed={selected}
      data-piece={id}
      data-x={placement.x}
      data-y={placement.y}
      data-rot={placement.rot}
      className="cursor-grab outline-none active:cursor-grabbing"
      style={{ touchAction: 'none' }}
      onPointerDown={(event) => handlers.onPointerDown(event, id)}
      onPointerMove={(event) => handlers.onPointerMove(event, id)}
      onPointerUp={handlers.onPointerEnd}
      onPointerCancel={handlers.onPointerEnd}
      onLostPointerCapture={handlers.onPointerEnd}
      onFocus={() => handlers.onFocus(id)}
      onKeyDown={(event) => handlers.onKeyDown(event, id)}
    >
      <rect
        x={f.x0}
        y={f.y0}
        width={fw}
        height={fh}
        rx={3}
        strokeWidth={overlapping ? 3.5 : 1.5}
        strokeDasharray={overlapping ? '6 3' : undefined}
        className={`${style.fill} ${overlapping ? 'stroke-destructive' : ''}`}
        style={overlapping ? undefined : OUTLINE}
      />
      {spec.frontDepth > 0 && <polygon points={frontMarker(f, placement.rot)} style={MARKER} />}
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={Math.min(fw, fh) >= 55 ? 14 : 12}
        transform={fh > fw && fw < 70 ? `rotate(-90 ${cx} ${cy})` : undefined}
        className={`pointer-events-none ${style.text}`}
      >
        {caption}
      </text>
    </g>
  );
}
