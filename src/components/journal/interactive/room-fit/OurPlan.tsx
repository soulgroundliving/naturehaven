import { FINAL_PLAN } from '@/lib/roomFit';
import type { PieceId } from '@/lib/roomFit';
import type { LangCode } from '@/lib/journalBlocks';
import { PIECE_NAME, facingLabel, ourPlanCaption } from './copy';

// In reading order along the plan: the bed and the closet on the left, then the units down the
// right wall from the balcony end to the front door.
const ORDER: readonly PieceId[] = ['bed', 'closet', 'table', 'kitchen', 'shelf'];

// What "Show our plan" says beside the dashed outlines: the walkway it gives, and which way each
// piece faces, by the article's compass — the direction half of what a plan has to tell you.
export default function OurPlan({ walkWidth, lang }: { walkWidth: number; lang: LangCode }) {
  return (
    <div data-testid="room-fit-our-plan" className="font-sans text-[13px] leading-snug sec-text-80">
      <p>{ourPlanCaption(walkWidth, lang)}</p>
      <ul data-testid="room-fit-our-plan-directions" className="mt-2 flex flex-col gap-1">
        {ORDER.map((id) => (
          <li key={id}>
            <span className="font-medium sec-text">{PIECE_NAME[id][lang]}</span> — {facingLabel(id, FINAL_PLAN[id].rot, lang)}
          </li>
        ))}
      </ul>
    </div>
  );
}
