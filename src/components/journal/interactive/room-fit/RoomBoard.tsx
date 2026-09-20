import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from 'react';
import { DOOR_IDS, DOOR_ZONES, PIECE_IDS, bedStripsOf, footprintOf, frontZoneOf } from '@/lib/roomFit';
import type { FastEvaluation, Layout, PieceId, Point, Rect, WalkEvaluation } from '@/lib/roomFit';
import type { LangCode } from '@/lib/journalBlocks';
import GhostPlan from './GhostPlan';
import PieceShape from './PieceShape';
import RoomBackdrop from './RoomBackdrop';
import { COPY } from './copy';
import { keyAction } from './pieceKeys';

const width = (r: Rect) => r.x1 - r.x0;
const height = (r: Rect) => r.y1 - r.y0;

function ZoneRect({ rect, bad }: { rect: Rect; bad: boolean }) {
  return (
    <rect
      x={rect.x0}
      y={rect.y0}
      width={width(rect)}
      height={height(rect)}
      rx={2}
      strokeWidth={1.5}
      strokeDasharray="5 4"
      className={`pointer-events-none ${bad ? 'fill-destructive/10 stroke-destructive' : 'fill-sage-green/5 stroke-sage-green/40'}`}
    />
  );
}

interface RoomBoardProps {
  layout: Layout;
  selected: PieceId | null;
  fast: FastEvaluation;
  /** The last walkway measurement — it belongs to the current layout only when `settled`. */
  walk: WalkEvaluation;
  settled: boolean;
  showPlan: boolean;
  lang: LangCode;
  onSelect: (id: PieceId) => void;
  onMove: (id: PieceId, x: number, y: number) => void;
  onNudge: (id: PieceId, dx: number, dy: number) => void;
  onRotate: (id: PieceId) => void;
}

// The plan: fixed walls and doors underneath, the pieces on top. Pieces move by
// pointer (mouse, touch, pen) or by keyboard, and every move goes through the
// same reducer, so the two cannot disagree. Positions are in cm (the SVG's own
// units), so the geometry the rules see is exactly what is drawn.
export default function RoomBoard({ layout, selected, fast, walk, settled, showPlan, lang, onSelect, onMove, onNudge, onRotate }: RoomBoardProps) {
  const svg = useRef<SVGSVGElement>(null);
  const drag = useRef<{ id: PieceId; dx: number; dy: number } | null>(null);

  // A finger on a piece must drag it, not scroll the page. `touch-action: none` is meant
  // to say so, but Chrome ignores it on SVG children (only the outer <svg> counts): after
  // ~15 px the browser takes the touch for scrolling and cancels the drag. Cancelling
  // touchstart is what holds everywhere — and only when it lands on a piece, so a swipe
  // that starts on empty floor still scrolls the article instead of trapping the reader.
  // It must be a native, non-passive listener: React registers its touch handlers passive.
  useEffect(() => {
    const board = svg.current;
    if (!board) return;
    const holdThePage = (event: TouchEvent) => {
      if (event.cancelable && event.target instanceof Element && event.target.closest('[data-piece]')) event.preventDefault();
    };
    board.addEventListener('touchstart', holdThePage, { passive: false });
    return () => board.removeEventListener('touchstart', holdThePage);
  }, []);

  // Pointer position in the plan's own units, whatever the on-screen scale.
  const toPlan = (event: PointerEvent): Point | null => {
    const matrix = svg.current?.getScreenCTM();
    if (!matrix) return null;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    return { x: point.x, y: point.y };
  };

  const endDrag = () => {
    drag.current = null;
  };

  const onPointerDown = (event: PointerEvent<SVGGElement>, id: PieceId) => {
    if (event.button !== 0) return;
    const at = toPlan(event);
    if (!at) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.focus();
    drag.current = { id, dx: at.x - layout[id].x, dy: at.y - layout[id].y };
    onSelect(id);
  };

  const onPointerMove = (event: PointerEvent<SVGGElement>, id: PieceId) => {
    if (drag.current?.id !== id) return;
    // A mouse button let go where nobody heard it must not leave the piece stuck to the pointer.
    if (event.pointerType === 'mouse' && event.buttons === 0) {
      endDrag();
      return;
    }
    const at = toPlan(event);
    if (at) onMove(id, at.x - drag.current.dx, at.y - drag.current.dy);
  };

  const onKeyDown = (event: KeyboardEvent<SVGGElement>, id: PieceId) => {
    const action = keyAction(event);
    if (!action) return;
    if (action.type === 'nudge') onNudge(id, action.dx, action.dy);
    else onRotate(id);
    event.preventDefault();
  };

  const handlers = { onPointerDown, onPointerMove, onPointerEnd: endDrag, onFocus: onSelect, onKeyDown };
  const selectedFootprint = selected ? footprintOf(selected, layout[selected]) : null;

  return (
    <svg
      ref={svg}
      viewBox="-16 -16 382 772"
      role="group"
      aria-label={COPY.boardLabel[lang]}
      className="mx-auto block w-full max-w-[380px] select-none"
      style={{ maxHeight: '80svh', WebkitTouchCallout: 'none' }}
    >
      <RoomBackdrop lang={lang} />

      {DOOR_IDS.map((door) => (
        <ZoneRect key={door} rect={DOOR_ZONES[door]} bad={fast.blockedDoors.includes(door)} />
      ))}

      {/* A route measured for an earlier arrangement would run through pieces that have moved: draw it only once it is current. */}
      {[walk.toBathroom, walk.toBalcony].map((route, i) =>
        settled && route.path.length > 1 ? (
          <polyline
            key={i}
            data-testid="room-fit-route"
            points={route.path.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="none"
            strokeWidth={3}
            strokeDasharray="7 6"
            strokeLinecap="round"
            className={`pointer-events-none ${walk.ok ? 'stroke-sage-green' : 'stroke-destructive'}`}
          />
        ) : null,
      )}

      {PIECE_IDS.map((id) => {
        const zone = frontZoneOf(id, layout[id]);
        return zone ? <ZoneRect key={`zone-${id}`} rect={zone} bad={fast.cramped.includes(id)} /> : null;
      })}
      {bedStripsOf(layout.bed).map((strip, i) => (
        <ZoneRect key={`strip-${i}`} rect={strip} bad={!fast.bed} />
      ))}

      {PIECE_IDS.map((id) => (
        <PieceShape key={id} id={id} placement={layout[id]} selected={selected === id} overlapping={fast.overlapping.includes(id)} lang={lang} handlers={handlers} />
      ))}

      {selectedFootprint && (
        <rect
          data-testid="room-fit-selection"
          x={selectedFootprint.x0 - 4}
          y={selectedFootprint.y0 - 4}
          width={width(selectedFootprint) + 8}
          height={height(selectedFootprint) + 8}
          rx={5}
          fill="none"
          strokeWidth={2.5}
          className="pointer-events-none"
          style={{ stroke: 'var(--sec-text)' }}
        />
      )}

      {showPlan && <GhostPlan layout={layout} lang={lang} />}
    </svg>
  );
}
