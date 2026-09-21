import { RULE_COUNT } from '@/lib/roomFit';
import type { LangCode } from '@/lib/journalBlocks';
import PlayDetails from './PlayDetails';
import PlayResult from './PlayResult';
import { COPY, progress } from './copy';
import type { RoomFitGame } from './useRoomFitGame';

// The result of the game beside the plan, for a screen wider than it is tall (a desktop, a tablet turned
// sideways, a phone on its side): the same score, marks, rules and widths as the sheet, always open, in a
// column that scrolls on its own while the plan stays put.
export default function PlayPanel({ game, lang }: { game: RoomFitGame; lang: LangCode }) {
  const { verified, settled } = game;
  return (
    <section
      data-testid="room-fit-panel"
      className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain rounded-3xl border sec-border card-surface p-5"
      style={{ touchAction: 'pan-y pinch-zoom' }}
    >
      <p data-testid="room-fit-progress" aria-live="polite" className="font-sans text-[15px] font-medium sec-text">
        {settled ? progress(verified.passed, RULE_COUNT, lang) : COPY.checking[lang]}
      </p>
      <div>
        <PlayResult game={game} lang={lang} />
      </div>
      <PlayDetails game={game} lang={lang} />
    </section>
  );
}
