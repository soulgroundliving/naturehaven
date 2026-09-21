import { ChevronDown, ChevronUp } from 'lucide-react';
import { RULE_COUNT } from '@/lib/roomFit';
import type { LangCode } from '@/lib/journalBlocks';
import PlayDetails from './PlayDetails';
import PlayResult from './PlayResult';
import { COPY, progress } from './copy';
import type { RoomFitGame } from './useRoomFitGame';

interface PlaySheetProps {
  game: RoomFitGame;
  lang: LangCode;
  open: boolean;
  onToggle: () => void;
}

// The result of the game, at the foot of the full-screen one on a phone held upright. Shut, it is the
// score, the five rules as five marks and one sentence; open, it holds the whole of the rules and the
// widths — and the plan above it shrinks to stay in view, so nothing is ever out of sight.
export default function PlaySheet({ game, lang, open, onToggle }: PlaySheetProps) {
  const { verified, settled } = game;
  return (
    <section
      data-testid="room-fit-sheet"
      className="flex max-h-[min(56dvh,calc(100dvh_-_16rem))] min-h-0 shrink flex-col rounded-t-3xl border-t sec-border card-surface pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-6px_26px_rgba(43,43,43,0.12)]"
    >
      <button
        type="button"
        data-action="toggle-sheet"
        aria-expanded={open}
        aria-controls="room-fit-sheet-body"
        onClick={onToggle}
        className="flex w-full flex-none flex-col items-center gap-1.5 px-4 pb-1 pt-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sage-green"
      >
        <span aria-hidden="true" className="h-1 w-10 rounded-full" style={{ background: 'var(--sec-border)' }} />
        <span className="flex w-full items-baseline justify-between gap-3">
          <span data-testid="room-fit-progress" aria-live="polite" className="font-sans text-[15px] font-medium sec-text">
            {settled ? progress(verified.passed, RULE_COUNT, lang) : COPY.checking[lang]}
          </span>
          <span className="inline-flex items-center gap-1 font-sans text-[12px] sec-text-70">
            {open ? COPY.hideDetails[lang] : COPY.showDetails[lang]}
            {open ? <ChevronDown size={14} aria-hidden="true" /> : <ChevronUp size={14} aria-hidden="true" />}
          </span>
        </span>
      </button>

      <div className="flex-none px-4">
        <PlayResult game={game} lang={lang} fixedHeight />
      </div>

      {/* Shut, it is not there to be seen or tabbed to; it stays in the page so its numbers are always current.
          `flex` is only on while it is open: a class that sets `display` beats the `hidden` attribute, so an always-on
          `flex` left the whole body on screen and squeezed the plan to a strip. */}
      <div
        id="room-fit-sheet-body"
        hidden={!open}
        className={`mt-2 min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-4 pb-2 ${open ? 'flex' : ''}`}
        style={{ touchAction: 'pan-y pinch-zoom' }}
      >
        <PlayDetails game={game} lang={lang} />
      </div>
    </section>
  );
}
