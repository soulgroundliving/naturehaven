import { X } from 'lucide-react';
import { specOf, spaceOfPiece } from '@/lib/roomFit';
import type { LangCode } from '@/lib/journalBlocks';
import { COPY, PIECE_NAME } from './copy';
import { selectedSpaceLine } from './spaceCopy';
import type { RoomFitGame } from './useRoomFitGame';

interface PlayHeaderProps {
  game: RoomFitGame;
  lang: LangCode;
  /** The close button; a game shown inside something that has its own leaves it out. */
  onClose?: () => void;
}

// The top of the full-screen game: what you are holding. It is always two lines — the game's name and a
// hint, or the piece and the room it leaves — so picking a piece up never changes how tall anything is
// and the plan below it never shifts under a finger.
export default function PlayHeader({ game, lang, onClose }: PlayHeaderProps) {
  const { state, roomCm } = game;
  const selected = state.selected;
  const spec = selected ? specOf(selected) : null;
  return (
    <header className="flex h-14 flex-none items-center justify-between gap-3 px-4 [@media(max-height:500px)]:h-11">
      <div className="min-w-0">
        <p aria-live="polite" className="truncate font-serif text-[19px] leading-tight sec-text">
          {selected && spec ? (
            <span data-testid="room-fit-selected-name">
              {PIECE_NAME[selected][lang]} {spec.w}×{spec.d}
            </span>
          ) : (
            COPY.playLabel[lang]
          )}
        </p>
        {selected && roomCm !== null ? (
          <p data-testid="room-fit-selected-space" className="truncate font-sans text-[12.5px] leading-snug sec-text-70">
            {selectedSpaceLine(spaceOfPiece(selected), roomCm, lang)}
          </p>
        ) : (
          <p className="truncate font-sans text-[12.5px] leading-snug sec-text-70">{COPY.nothingSelected[lang]}</p>
        )}
      </div>
      {onClose && (
        <button
          type="button"
          data-action="close-play"
          aria-label={COPY.close[lang]}
          title={COPY.close[lang]}
          onClick={onClose}
          className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-full border sec-border card-surface sec-text-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-green"
        >
          <X size={20} aria-hidden="true" />
        </button>
      )}
    </header>
  );
}
