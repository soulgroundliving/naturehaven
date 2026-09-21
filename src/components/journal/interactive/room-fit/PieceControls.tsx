import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, RotateCw } from 'lucide-react';
import { specOf, spaceOfPiece } from '@/lib/roomFit';
import type { PieceId, Rotation } from '@/lib/roomFit';
import type { LangCode } from '@/lib/journalBlocks';
import { COPY, PIECE_NAME, PIECE_NOTE, facingLabel } from './copy';
import { selectedSpaceLine } from './spaceCopy';
import NudgeButton from './NudgeButton';

const BUTTON =
  'inline-flex h-11 w-11 items-center justify-center rounded-full border sec-border sec-text-80 transition-colors duration-300 hover:border-sage-green hover:text-sage-green disabled:pointer-events-none disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-green';

interface PieceControlsProps {
  selected: PieceId | null;
  /** How the selected piece is turned (null when nothing is selected). */
  rot: Rotation | null;
  /** The room the selected piece leaves (in front of it, or beside the bed), in cm; null when nothing is selected. */
  roomCm: number | null;
  lang: LangCode;
  onNudge: (id: PieceId, dx: number, dy: number) => void;
  onRotate: (id: PieceId) => void;
}

// The selected piece — its name and size, what it is, which way it faces, how much room it leaves —
// and a 3 x 3 pad (arrows around a turn button).
export default function PieceControls({ selected, rot, roomCm, lang, onNudge, onRotate }: PieceControlsProps) {
  const none = selected === null;
  const nudge = (dx: number, dy: number) => () => {
    if (selected) onNudge(selected, dx, dy);
  };
  const spec = selected ? specOf(selected) : null;
  return (
    <div data-testid="room-fit-controls" className="rounded-xl border sec-border card-surface p-4">
      <p className="font-sans text-[13px] leading-snug sec-text-70" aria-live="polite">
        {selected && spec ? (
          <>
            <span className="uppercase tracking-[0.14em] sec-text-60">{COPY.selected[lang]}</span>
            {' · '}
            <span data-testid="room-fit-selected-name" className="font-medium sec-text">
              {PIECE_NAME[selected][lang]} {spec.w}×{spec.d}
            </span>
          </>
        ) : (
          COPY.nothingSelected[lang]
        )}
      </p>
      {selected && rot !== null && (
        <div data-testid="room-fit-selected-note" className="mt-1 font-sans text-[12.5px] leading-snug">
          <p className="sec-text-70">{PIECE_NOTE[selected][lang]}</p>
          <p data-testid="room-fit-facing" className="mt-0.5 font-medium sec-text">
            {facingLabel(selected, rot, lang)}
          </p>
          {roomCm !== null && (
            <p data-testid="room-fit-selected-space" className="mt-0.5 sec-text-80">
              {selectedSpaceLine(spaceOfPiece(selected), roomCm, lang)}
            </p>
          )}
        </div>
      )}
      <div className="mt-3 grid w-[9.25rem] grid-cols-3 gap-1.5">
        <span />
        <NudgeButton label={COPY.moveUp[lang]} disabled={none} onPress={nudge(0, -5)} testId="nudge-up">
          <ArrowUp size={18} aria-hidden="true" />
        </NudgeButton>
        <span />
        <NudgeButton label={COPY.moveLeft[lang]} disabled={none} onPress={nudge(-5, 0)} testId="nudge-left">
          <ArrowLeft size={18} aria-hidden="true" />
        </NudgeButton>
        <button
          type="button"
          aria-label={COPY.rotate[lang]}
          title={COPY.rotate[lang]}
          disabled={none}
          data-action="rotate"
          onClick={() => selected && onRotate(selected)}
          className={`${BUTTON} bg-sage-green text-pure-white hover:text-pure-white`}
        >
          <RotateCw size={18} aria-hidden="true" />
        </button>
        <NudgeButton label={COPY.moveRight[lang]} disabled={none} onPress={nudge(5, 0)} testId="nudge-right">
          <ArrowRight size={18} aria-hidden="true" />
        </NudgeButton>
        <span />
        <NudgeButton label={COPY.moveDown[lang]} disabled={none} onPress={nudge(0, 5)} testId="nudge-down">
          <ArrowDown size={18} aria-hidden="true" />
        </NudgeButton>
        <span />
      </div>
    </div>
  );
}
