import type { ReactNode } from 'react';
import { Check, Ellipsis, X } from 'lucide-react';
import type { LangCode } from '@/lib/journalBlocks';
import { COPY, RULE_HELP, type RuleView } from './copy';

interface RulesListProps {
  rules: RuleView[];
  lang: LangCode;
  /** False while the walkway is still waiting to be measured for the arrangement on the board. */
  settled: boolean;
}

type Status = 'pending' | 'holds' | 'fails';

const CHIP: Record<Status, string> = {
  pending: 'border sec-border sec-text-60',
  holds: 'bg-sage-green text-pure-white',
  fails: 'bg-destructive/15 text-destructive',
};
const ICON: Record<Status, ReactNode> = {
  pending: <Ellipsis size={14} />,
  holds: <Check size={14} />,
  fails: <X size={14} />,
};
const SPOKEN = { pending: COPY.checking, holds: COPY.holds, fails: COPY.fails };

// The five rules as a checklist. Colour is never the only signal: each row has
// an icon and a spoken "holds / does not hold" as well as its numbers. A walkway
// that has not been measured yet shows neither a tick nor a cross.
export default function RulesList({ rules, lang, settled }: RulesListProps) {
  return (
    <ul className="flex flex-col gap-2.5">
      {rules.map((rule) => {
        const pending = rule.id === 'walk' && !settled;
        const status: Status = pending ? 'pending' : rule.ok ? 'holds' : 'fails';
        return (
          <li
            key={rule.id}
            data-rule={rule.id}
            data-ok={rule.ok}
            className="flex gap-3 rounded-xl border sec-border card-surface px-4 py-3"
          >
            <span aria-hidden="true" className={`mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full ${CHIP[status]}`}>
              {ICON[status]}
            </span>
            <div className="min-w-0">
              <p className="font-sans text-[15px] font-medium leading-snug sec-text">
                {rule.label[lang]}
                <span className="sr-only"> — {SPOKEN[status][lang]}</span>
              </p>
              <p className={`mt-0.5 font-sans text-[13px] leading-snug sec-text-80 ${pending ? 'opacity-60' : ''}`} data-rule-detail>
                {pending ? COPY.checking[lang] : rule.detail}
              </p>
              <p className="mt-1 font-sans text-[12px] leading-snug sec-text-60">{RULE_HELP[rule.id][lang]}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
