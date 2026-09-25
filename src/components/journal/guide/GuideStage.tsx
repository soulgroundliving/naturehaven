import type { CSSProperties, ReactNode } from 'react';
import { DOOR_IDS, DOOR_ZONES, FINAL_PLAN, LIVING, PIECE_IDS, ROOM, bedStripsOf, footprintOf, frontZoneOf } from '@/lib/roomFit';
import type { DoorId, PieceId, Rect } from '@/lib/roomFit';
import type { LangCode } from '@/lib/journalBlocks';
import type { Bilingual } from '@/data/journalTypes';
import type { GuideDrawnStage } from '@/lib/journalGuide';
import DoorsLayer from '../interactive/room-fit/DoorsLayer';
import RoomBackdrop from '../interactive/room-fit/RoomBackdrop';
import { PIECE_NAME } from '../interactive/room-fit/copy';
import { STYLE } from '../interactive/room-fit/pieceStyle';
import { DOOR_LABEL, GUIDE_COPY, PICTURE_LABEL, cm, sqm } from './guideCopy';

const t = (en: string, th: string): Bilingual => ({ en, th });

// A phone draws the plan at about half a pixel per centimetre (less on one with a browser bar), so a label is
// sized in plan units: 24-26 of them come out near 11px, the smallest text a thumb-sized screen reads without
// squinting. That is why the labels are short: "Balcony" fits beside its door at this size, "Balcony door" did not.
const LABEL = 26;
const SMALL = 20;

// The plan and its margins: room for the dimension lines on the top and left, and for the front door to swing out
// through the bottom wall (its leaf is about 80cm). The same on every page, so the plan stays put as you turn them.
const VIEW_BOX = '-28 -34 402 844';

const width = (r: Rect) => r.x1 - r.x0;
const height = (r: Rect) => r.y1 - r.y0;

// The five zones the brief divides the living area into (article blocks: Sleeping, Working, Cooking, Storage,
// Entry) - not pieces, a way of asking what the room needs to do before anything is placed. Their edges are
// a reading of the brief, not a measurement: unlike every other stage here, the room a zone claims is illustrative.
// Every fill is translucent: a zone's name takes the theme's text colour, and an opaque light fill under it
// (this was light-warm-grey) left the name white on beige at night.
const BRIEF_ZONES: readonly { id: string; name: Bilingual; area: Rect; className: string }[] = [
  { id: 'sleeping', name: t('Sleeping', 'นอน'), area: { x0: 0, y0: LIVING.y0, x1: 220, y1: LIVING.y1 }, className: 'fill-sage-green/20' },
  { id: 'working', name: t('Working', 'ทำงาน'), area: { x0: 220, y0: LIVING.y0, x1: LIVING.x1, y1: 300 }, className: 'fill-warm-rose/25' },
  { id: 'cooking', name: t('Cooking', 'ครัว'), area: { x0: 220, y0: 300, x1: LIVING.x1, y1: 460 }, className: 'fill-warm-brown/20' },
  { id: 'storage', name: t('Storage', 'เก็บของ'), area: { x0: 220, y0: 460, x1: LIVING.x1, y1: 600 }, className: 'fill-dark-grey/15' },
  { id: 'entry', name: t('Entry', 'ทางเข้า'), area: { x0: 220, y0: 600, x1: LIVING.x1, y1: LIVING.y1 }, className: 'fill-dark-grey/5' },
];

const DIMENSION_LINE = { stroke: 'var(--sec-text-70)', strokeWidth: 1.2 } as const;
const DIMENSION_TEXT = { fill: 'var(--sec-text-70)' } as const;

// The room's own numbers, printed on it: from ROOM, so they cannot disagree with the rules, in the reader's units.
function PlanDimensions({ lang }: { lang: LangCode }) {
  const middle = ROOM.length / 2;
  return (
    <g aria-hidden="true" fill="none">
      <path d={`M0 -4H${ROOM.width}M0 -8V0M${ROOM.width} -8V0`} style={DIMENSION_LINE} />
      <text x={ROOM.width / 2} y={-12} textAnchor="middle" fontSize={SMALL - 2} style={DIMENSION_TEXT}>
        {cm(ROOM.width, lang)}
      </text>
      <path d={`M-4 0V${ROOM.length}M-8 0H0M-8 ${ROOM.length}H0`} style={DIMENSION_LINE} />
      <text x={-12} y={middle} textAnchor="middle" fontSize={SMALL - 2} transform={`rotate(-90 -12 ${middle})`} style={DIMENSION_TEXT}>
        {cm(ROOM.length, lang)}
      </text>
      <text x={ROOM.width / 2} y={(LIVING.y0 + LIVING.y1) / 2} textAnchor="middle" fontSize={30} className="font-serif" style={DIMENSION_TEXT}>
        {sqm((ROOM.width * ROOM.length) / 10000, lang)}
      </text>
    </g>
  );
}

function BriefZones({ lang }: { lang: LangCode }) {
  return (
    <g aria-hidden="true">
      {BRIEF_ZONES.map(({ id, name, area, className }) => (
        <g key={id}>
          <rect x={area.x0} y={area.y0} width={width(area)} height={height(area)} className={className} />
          <text x={(area.x0 + area.x1) / 2} y={(area.y0 + area.y1) / 2} textAnchor="middle" dominantBaseline="central" fontSize={LABEL} className="font-medium" style={{ fill: 'var(--sec-text)' }}>
            {name[lang]}
          </text>
        </g>
      ))}
    </g>
  );
}

// A piece's name, as large as its footprint lets it be: along its long side when it is a narrow one.
function PieceLabel({ id, at, lang, className, style }: { id: PieceId; at: Rect; lang: LangCode; className?: string; style?: CSSProperties }) {
  const text = PIECE_NAME[id][lang];
  const vertical = height(at) > width(at) && width(at) < 90;
  const along = (vertical ? height(at) : width(at)) - 10;
  const across = (vertical ? width(at) : height(at)) - 6;
  const size = Math.max(12, Math.min(LABEL, across * 0.7, along / (Math.max(text.length, 1) * 0.6)));
  const cx = at.x0 + width(at) / 2;
  const cy = at.y0 + height(at) / 2;
  return (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize={size} transform={vertical ? `rotate(-90 ${cx} ${cy})` : undefined} className={className} style={style}>
      {text}
    </text>
  );
}

// The clear floor is drawn in the theme's call-to-action colour (sage by day, slate at night): a fixed sage was 1.6:1 on the night floor.
const CLEAR: CSSProperties = { fill: 'var(--cta-bg)', fillOpacity: 0.13, stroke: 'var(--cta-bg)', strokeOpacity: 0.75, strokeWidth: 1.6, strokeDasharray: '6 4' };

/** The spaces between things: the floor a piece needs in front of it, and beside the bed - from the final plan, as the rules measure them. */
function LayoutClearances({ lang }: { lang: LangCode }) {
  return (
    <g aria-hidden="true">
      {PIECE_IDS.map((id) => {
        const zone = frontZoneOf(id, FINAL_PLAN[id]);
        return zone && <rect key={id} x={zone.x0} y={zone.y0} width={width(zone)} height={height(zone)} rx={2} style={CLEAR} />;
      })}
      {bedStripsOf(FINAL_PLAN.bed).map((strip, i) => (
        <rect key={i} x={strip.x0} y={strip.y0} width={width(strip)} height={height(strip)} rx={2} style={CLEAR} />
      ))}
      {PIECE_IDS.map((id) => {
        const at = footprintOf(id, FINAL_PLAN[id]);
        return (
          <g key={`piece-${id}`}>
            <rect x={at.x0} y={at.y0} width={width(at)} height={height(at)} rx={2} fill="none" strokeWidth={1.6} style={{ stroke: 'var(--sec-text)', strokeOpacity: 0.55 }} />
            <PieceLabel id={id} at={at} lang={lang} style={{ fill: 'var(--sec-text-80)' }} />
          </g>
        );
      })}
    </g>
  );
}

function FinalPieces({ lang }: { lang: LangCode }) {
  return (
    <g aria-hidden="true">
      {PIECE_IDS.map((id) => {
        const at = footprintOf(id, FINAL_PLAN[id]);
        return (
          <g key={id}>
            <rect x={at.x0} y={at.y0} width={width(at)} height={height(at)} rx={2} className={STYLE[id].fill} strokeWidth={1.6} style={{ stroke: 'var(--sec-text)', strokeOpacity: 0.7 }} />
            <PieceLabel id={id} at={at} lang={lang} className={STYLE[id].text} />
          </g>
        );
      })}
    </g>
  );
}

// The doors read as fixed walls until you know they open - the game's own affordance is deliberately quiet
// (a dashed ring on focus, nothing at rest). A page meant to teach "these doors open" states the promise once:
// a dashed marker on each door zone (the same DOOR_ZONES the rules use), its name and how it opens. None of
// this changes DoorsLayer's own drawing, so the real game keeps the affordance it shipped with.
//
// What is drawn is what answers a finger: the whole marker is a tap target, not just the band DoorsLayer's own
// button covers (about 24px tall at the scale a phone draws the plan). The marker is pointer-only - the door's
// button, with its name and state, is still DoorsLayer's, which is the one a keyboard or a screen reader meets.
function DoorLabels({ lang, onToggle }: { lang: LangCode; onToggle: (id: DoorId) => void }) {
  return (
    <g aria-hidden="true">
      {DOOR_IDS.map((id) => {
        const zone = DOOR_ZONES[id];
        const above = id === 'entrance';
        // On the room's side of the door's wall: the top doors' labels hang below them, the front door's stands above.
        const howY = above ? zone.y0 - 14 : zone.y1 + 6 + LABEL + 24;
        const nameY = above ? howY - 26 : zone.y1 + 6 + LABEL;
        const x = above ? zone.x1 + 6 : zone.x0 - 6;
        return (
          <g key={id}>
            <rect
              data-door-target={id}
              x={zone.x0 - 6}
              y={zone.y0 - 6}
              width={width(zone) + 12}
              height={height(zone) + 12}
              rx={10}
              strokeWidth={1.8}
              strokeDasharray="5 4"
              className="cursor-pointer fill-transparent"
              style={{ stroke: 'var(--cta-bg)' }}
              onClick={() => onToggle(id)}
            />
            <text x={x} y={nameY} textAnchor={above ? 'end' : 'start'} fontSize={LABEL - 2} className="font-medium" style={{ fill: 'var(--sec-text)' }}>
              {DOOR_LABEL[id].name[lang]}
            </text>
            <text x={x} y={howY} textAnchor={above ? 'end' : 'start'} fontSize={SMALL} style={{ fill: 'var(--sec-text-70)' }}>
              {DOOR_LABEL[id].how[lang]}
            </text>
          </g>
        );
      })}
    </g>
  );
}

interface LayerProps {
  lang: LangCode;
  doors: Record<DoorId, boolean>;
  onToggleDoor: (id: DoorId) => void;
}

// One entry per drawn stage: a stage added to GUIDE_DRAWN_STAGES without one here does not compile, rather
// than drawing an empty plan.
const LAYERS: Record<GuideDrawnStage, (props: LayerProps) => ReactNode> = {
  plan: ({ lang }) => <PlanDimensions lang={lang} />,
  brief: ({ lang }) => <BriefZones lang={lang} />,
  constraints: ({ lang, doors, onToggleDoor }) => (
    <>
      <DoorLabels lang={lang} onToggle={onToggleDoor} />
      <DoorsLayer open={doors} lang={lang} onToggle={onToggleDoor} />
    </>
  ),
  layout: ({ lang }) => <LayoutClearances lang={lang} />,
  final: ({ lang }) => <FinalPieces lang={lang} />,
};

interface GuideStageProps extends LayerProps {
  stage: GuideDrawnStage;
}

// The picture beside a guide page's words: the plan, drawn to show what that section of the article is about.
// Every stage draws from the SAME geometry the game's rules use (roomFit.ts) - the real walls, the real door
// openings, the real final plan - so the picture cannot disagree with the article. It fills whatever room its
// slot has (the slot is `relative`); the plan is scaled to fit, never cropped.
export default function GuideStage({ stage, lang, doors, onToggleDoor }: GuideStageProps) {
  const interactive = stage === 'constraints';
  return (
    <div className="absolute inset-0 flex flex-col items-center">
      {/* The hint has a row of its own: over the plan it would sit on the top wall and the compass. */}
      {interactive && (
        <p className="pointer-events-none mb-1 mt-1 flex-none whitespace-nowrap rounded-full bg-dark-charcoal px-3 py-1 font-sans text-[12px] font-medium text-pure-white shadow-sm">
          {GUIDE_COPY.tapADoor[lang]}
        </p>
      )}
      <div className="relative min-h-0 w-full flex-1">
        <svg viewBox={VIEW_BOX} role={interactive ? 'group' : 'img'} aria-label={PICTURE_LABEL[stage][lang]} className="absolute inset-0 block h-full w-full select-none">
          <RoomBackdrop lang={lang} />
          {LAYERS[stage]({ lang, doors, onToggleDoor })}
        </svg>
      </div>
    </div>
  );
}
