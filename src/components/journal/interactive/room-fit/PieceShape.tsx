import type { KeyboardEvent, PointerEvent } from 'react';
import { LIVING, footprintOf, headRectOf, specOf } from '@/lib/roomFit';
import type { PieceId, Placement, Rect } from '@/lib/roomFit';
import type { LangCode } from '@/lib/journalBlocks';
import { COPY, PIECE_NAME, placeLabel } from './copy';
import { STYLE } from './pieceStyle';

const OUTLINE = { stroke: 'var(--sec-text)', strokeOpacity: 0.7 } as const;
const MARKER = { fill: 'var(--sec-text)' } as const;
const HEAD_BAR = { fill: 'var(--sec-text)', fillOpacity: 0.35 } as const;

const width = (r: Rect) => r.x1 - r.x0;
const height = (r: Rect) => r.y1 - r.y0;

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
  onPointerEnd: (event: PointerEvent<SVGGElement>) => void;
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

// A caption, turned to read along a piece that is taller than it is wide.
function Caption({ area, text, size, className }: { area: Rect; text: string; size: number; className: string }) {
  const cx = area.x0 + width(area) / 2;
  const cy = area.y0 + height(area) / 2;
  return (
    <text
      x={cx}
      y={cy}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={size}
      transform={height(area) > width(area) && width(area) < 70 ? `rotate(-90 ${cx} ${cy})` : undefined}
      className={`pointer-events-none ${className}`}
    >
      {text}
    </text>
  );
}

// One piece on the plan: a body, an arrowhead for its front (or a bar for the bed's head) and a
// caption. It is a focusable group so it can be moved with the keyboard as well as by pointer —
// but Enter and Space do nothing on it, so it calls itself a "movable piece" rather than letting
// a screen reader promise a button.
export default function PieceShape({ id, placement, selected, overlapping, lang, handlers }: PieceShapeProps) {
  const f = footprintOf(id, placement);
  const spec = specOf(id);
  const name = PIECE_NAME[id][lang];
  const head = id === 'bed' ? headRectOf(placement) : null;
  const label =`${placeLabel(id, placement, LIVING.y0, lang)} · ${spec.w}×${spec.d}`;
  const style = STYLE[id];
  const short = Math.min(width(f), height(f));
  const caption = Math.max(width(f), height(f)) >= 100 ? `${name} ${spec.w}×${spec.d}` : name;
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
        width={width(f)}
        height={height(f)}
        rx={3}
        strokeWidth={overlapping ? 3.5 : 1.5}
        strokeDasharray={overlapping ? '6 3' : undefined}
        className={`${style.fill} ${overlapping ? 'stroke-destructive' : ''}`}
        style={overlapping ? undefined : OUTLINE}
      />
      {head && <rect data-part="head" x={head.x0} y={head.y0} width={width(head)} height={height(head)} className="pointer-events-none" style={HEAD_BAR} />}
      {spec.frontDepth > 0 && <polygon points={frontMarker(f, placement.rot)} style={MARKER} />}
      <Caption area={f} text={caption} size={short >= 60 ? 14 : 12} className={style.text} />
    </g>
  );
}
