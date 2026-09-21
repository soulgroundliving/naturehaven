import type { MouseEvent } from 'react';
import { Maximize2 } from 'lucide-react';
import { RULE_COUNT } from '@/lib/roomFit';
import type { LangCode } from '@/lib/journalBlocks';
import PlanPreview from './PlanPreview';
import { COPY, progress, verdict } from './copy';
import type { RoomFitGame } from './useRoomFitGame';

interface RoomFitCompactProps {
  game: RoomFitGame;
  lang: LangCode;
  onPlay: (event: MouseEvent<HTMLElement>) => void;
}

// What a phone shows in the article: a picture of the plan and one button. The game itself is a
// tool, and needs its buttons beside the plan — which a page that scrolls cannot give it (the turn
// button used to sit 1.7 screens below the board) — so it is played full screen.
export default function RoomFitCompact({ game, lang, onPlay }: RoomFitCompactProps) {
  const { state, verified, settled, verdictKind } = game;
  return (
    <div
      data-testid="room-fit"
      data-mode="compact"
      data-rules-passed={verified.passed}
      data-won={settled && verified.won}
      data-settled={settled}
      data-selected={state.selected ?? ''}
      className="rounded-xl border sec-border card-surface p-4"
    >
      <div className="flex items-center gap-4">
        <div className="w-[34%] flex-none">
          <PlanPreview layout={state.layout} lang={lang} />
        </div>
        <div className="min-w-0 flex-1">
          <p data-testid="room-fit-progress" aria-live="polite" className="font-sans text-[12px] font-medium uppercase tracking-[0.16em] sec-text-60">
            {settled ? progress(verified.passed, RULE_COUNT, lang) : COPY.checking[lang]}
          </p>
          <p data-testid="room-fit-verdict" className="mt-1 font-sans text-[15px] font-medium leading-snug sec-text">
            {verdict(verdictKind, lang)}
          </p>
        </div>
      </div>
      <p className="mt-3 font-sans text-[12.5px] leading-snug sec-text-70">{COPY.playHint[lang]}</p>
      <button
        type="button"
        data-action="play-full-screen"
        onClick={onPlay}
        className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-sage-green px-6 font-sans text-[15px] font-medium text-pure-white transition-colors duration-300 hover:bg-sage-green/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-green"
      >
        <Maximize2 size={18} aria-hidden="true" />
        {COPY.playFullScreen[lang]}
      </button>
    </div>
  );
}
