import type { LangCode } from '@/lib/journalBlocks';
import type { Spaces } from '@/lib/roomFit';
import { SPACE_IDS, SPACE_STANDARDS, TIERS, meetsRequirement, shortOf, tierOf, wholeCm } from '@/lib/roomStandards';
import type { SpaceId, Tier } from '@/lib/roomStandards';
import {
  SPACES_COPY,
  SPACE_FOR,
  SPACE_WHERE,
  TIER_MEANING,
  TIER_NAME,
  TIGHT_MEANING,
  ZONE_NAME,
  cmLabel,
  requirementLine,
  standardsNote,
  thresholdsLine,
} from './spaceCopy';

// How many of the four segments a tier fills, and what colour: red while tight, brown at the
// minimum, green from "just right". The name is always written beside it, so colour is never alone.
const FILL: Record<Tier, { segments: number; colour: string }> = {
  tight: { segments: 1, colour: 'bg-destructive' },
  minimum: { segments: 2, colour: 'bg-warm-brown' },
  standard: { segments: 3, colour: 'bg-sage-green' },
  comfortable: { segments: 4, colour: 'bg-sage-green' },
};

// Fills are brand tokens, so what tells a filled slot from an empty one is its outline — which,
// like the pieces', follows the theme: the text colour for a filled slot, the faint theme border for
// an empty one. (The green fill alone measured about 1.3:1 against the night card.)
const FILLED_OUTLINE = { borderColor: 'var(--sec-text-60)' } as const;
const EMPTY_OUTLINE = { borderColor: 'var(--sec-border)' } as const;

function Meter({ tier, pending }: { tier: Tier; pending: boolean }) {
  const { segments, colour } = FILL[tier];
  return (
    <span aria-hidden="true" data-testid="space-meter" className={`flex flex-none gap-0.5 ${pending ? 'opacity-30' : ''}`}>
      {TIERS.map((name, i) => {
        const filled = i < segments;
        return <span key={name} data-filled={filled} className={`h-2 w-4 rounded-sm border ${filled ? colour : ''}`} style={filled ? FILLED_OUTLINE : EMPTY_OUTLINE} />;
      })}
    </span>
  );
}

interface RowProps {
  id: SpaceId;
  cm: number;
  /** The walkway is measured a moment after a move: until then its number is the last one, not this arrangement's. */
  pending: boolean;
  lang: LangCode;
}

function SpaceRow({ id, cm, pending, lang }: RowProps) {
  const tier = tierOf(id, cm);
  const short = shortOf(id, cm);
  // "Tight" says what is wrong with THIS space. While the walkway is being measured again, no meaning is shown: it would be the last arrangement's.
  const meaning = tier === 'tight' ? `${TIER_MEANING.tight[lang]} ${TIGHT_MEANING[id][lang]}` : TIER_MEANING[tier][lang];
  return (
    <li data-space={id} data-cm={wholeCm(cm)} data-tier={tier} data-ok={meetsRequirement(id, cm)} data-pending={pending} className="py-2.5">
      <details className="group">
        <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-3 gap-y-1 font-sans text-[13px] leading-snug focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-green [&::-webkit-details-marker]:hidden">
          {/* On a phone the label has a line to itself and the measurement sits under it. */}
          <span className="min-w-0 basis-full sm:flex-1 sm:basis-0">
            <span className="font-medium sec-text">{ZONE_NAME[SPACE_STANDARDS[id].zone][lang]}</span>
            <span className="sec-text-70"> · {SPACE_WHERE[id][lang]}</span>
          </span>
          <span data-testid="space-cm" className="w-[4.5rem] flex-none text-right tabular-nums sec-text">
            {pending ? '…' : cmLabel(cm, lang)}
          </span>
          <Meter tier={tier} pending={pending} />
          <span className="min-w-0 flex-1 sm:w-[6.5rem] sm:flex-none">
            <span data-testid="space-tier" className="block font-medium sec-text">
              {pending ? SPACES_COPY.checking[lang] : TIER_NAME[tier][lang]}
            </span>
            {/* The tier alone cannot say it: beside the bed "just right" (90) still falls short of the 120 the game asks for. */}
            {!pending && short !== null && (
              <span data-testid="space-short" className="block text-[11.5px] leading-tight sec-text-70">
                {SPACES_COPY.needs[lang]} {short}
              </span>
            )}
          </span>
          <span aria-hidden="true" className="flex-none text-lg leading-none sec-text-60 transition-transform duration-300 group-open:rotate-45">
            +
          </span>
        </summary>
        <div className="mt-2 flex flex-col gap-1 pl-0.5 font-sans text-[12.5px] leading-snug sec-text-80">
          <p>{SPACE_FOR[id][lang]}</p>
          <p data-testid="space-meaning">{pending ? SPACES_COPY.checking[lang] : meaning}</p>
          <p data-testid="space-thresholds" className="sec-text-70">
            {thresholdsLine(id, lang)}
          </p>
          <p data-testid="space-asked" className="sec-text-70">
            {requirementLine(id, lang)}
          </p>
        </div>
      </details>
    </li>
  );
}

interface SpacesPanelProps {
  /** The room beside the bed and in front of each piece, measured for the arrangement on the board. */
  spaces: Spaces;
  /** The narrowest point of the walkway, and whether that is still the previous arrangement's. */
  walkCm: number;
  walkPending: boolean;
  lang: LangCode;
}

// The brief asks a room to let you sleep, work, cook, keep clothes and come in from outside. Each
// needs floor no piece stands on. This measures it in the visitor's arrangement and says how wide
// that is: tight, minimum, just right (our standard) or comfortable — and what each means to use.
export default function SpacesPanel({ spaces, walkCm, walkPending, lang }: SpacesPanelProps) {
  return (
    <section data-testid="room-fit-spaces" aria-labelledby="room-fit-spaces-title" className="rounded-xl border sec-border card-surface p-4">
      <h4 id="room-fit-spaces-title" className="font-sans text-[15px] font-medium leading-snug sec-text">
        {SPACES_COPY.title[lang]}
      </h4>
      <p className="mt-1 font-sans text-[12.5px] leading-snug sec-text-70">{SPACES_COPY.intro[lang]}</p>
      <ul className="mt-2 flex flex-col divide-y sec-border">
        {SPACE_IDS.map((id) => (
          <SpaceRow key={id} id={id} cm={id === 'walk' ? walkCm : spaces[id]} pending={id === 'walk' && walkPending} lang={lang} />
        ))}
      </ul>
      <details className="mt-2">
        <summary className="cursor-pointer font-sans text-[12px] sec-text-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-green">
          {SPACES_COPY.sourcesTitle[lang]}
        </summary>
        <p data-testid="spaces-note" className="mt-1.5 font-sans text-[12px] leading-snug sec-text-70">
          {standardsNote(lang)}
        </p>
      </details>
    </section>
  );
}
