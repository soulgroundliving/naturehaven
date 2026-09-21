import { Check, Ellipsis, X } from 'lucide-react';
import type { LangCode } from '@/lib/journalBlocks';
import { COPY, RULE_SHORT, verdict } from './copy';
import type { RoomFitGame } from './useRoomFitGame';

type Status = 'pending' | 'holds' | 'fails';
const CHIP: Record<Status, string> = {
  pending: 'border sec-border sec-text-60',
  holds: 'bg-sage-green text-pure-white',
  fails: 'bg-destructive/15 text-destructive',
};

interface PlayResultProps {
  game: RoomFitGame;
  lang: LangCode;
  /** True in the bottom sheet, where the verdict keeps a slot two lines tall so the plan above it never shifts. */
  fixedHeight?: boolean;
}

// The result at a glance: the five rules as five marks, and one sentence on where the room stands.
// Colour is never the only signal — each mark has an icon and a spoken "holds / does not hold".
export default function PlayResult({ game, lang, fixedHeight = false }: PlayResultProps) {
  const { settled, spoken, rules, verdictKind } = game;
  return (
    <>
      <ul className="flex gap-1.5">
        {rules.map((rule) => {
          const status: Status = rule.id === 'walk' && !settled ? 'pending' : rule.ok ? 'holds' : 'fails';
          const Icon = status === 'pending' ? Ellipsis : status === 'holds' ? Check : X;
          return (
            <li key={rule.id} data-rule-chip={rule.id} data-ok={rule.ok} className="flex flex-1 flex-col items-center gap-0.5 rounded-xl border sec-border px-1 py-1">
              <span aria-hidden="true" className={`inline-flex h-[18px] w-[18px] items-center justify-center rounded-full ${CHIP[status]}`}>
                <Icon size={11} />
              </span>
              <span className="font-sans text-[10.5px] leading-none sec-text-80">
                {RULE_SHORT[rule.id][lang]}
                <span className="sr-only"> — {status === 'pending' ? COPY.checking[lang] : status === 'holds' ? COPY.holds[lang] : COPY.fails[lang]}</span>
              </span>
            </li>
          );
        })}
      </ul>
      <p data-testid="room-fit-verdict" className={`mt-2 font-sans text-[13px] leading-snug sec-text-80 ${fixedHeight ? 'line-clamp-2 h-9' : ''}`}>
        {verdict(verdictKind, lang)}
      </p>
      <p data-testid="room-fit-announce" aria-live="polite" className="sr-only">
        {spoken}
      </p>
    </>
  );
}
