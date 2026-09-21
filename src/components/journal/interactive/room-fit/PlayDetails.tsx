import type { LangCode } from '@/lib/journalBlocks';
import OurPlan from './OurPlan';
import RulesList from './RulesList';
import SpacesPanel from './SpacesPanel';
import { COPY } from './copy';
import type { RoomFitGame } from './useRoomFitGame';

// The whole of the rules and the widths, for the full-screen game: what the sheet holds on a phone held
// upright and what the panel beside the plan shows on a wide screen.
export default function PlayDetails({ game, lang }: { game: RoomFitGame; lang: LangCode }) {
  const { fast, verified, settled, ourWalk, rules } = game;
  return (
    <div className="flex flex-col gap-4">
      <RulesList rules={rules} lang={lang} settled={settled} />
      <SpacesPanel spaces={fast.spaces} walkCm={verified.walk.width} walkPending={!settled} lang={lang} />
      {ourWalk && <OurPlan walkWidth={ourWalk.width} lang={lang} />}
      <div className="flex flex-col gap-1.5 font-sans text-[12px] leading-snug sec-text-60">
        <p>{COPY.routeLegend[lang]}</p>
        <p>{COPY.disclaimer[lang]}</p>
      </div>
    </div>
  );
}
