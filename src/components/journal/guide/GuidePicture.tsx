import type { LangCode } from '@/lib/journalBlocks';
import { localize } from '@/lib/journalBlocks';
import type { ImageBlock } from '@/lib/journalGuide';
import OriginBadge from '../OriginBadge';

// A 'slide' or 'measurements' page has no drawing of the plan (GuideStage.tsx) - the section's own image IS
// its picture (journalGuide.ts lifts it out of the words). It is fitted to the slot rather than cropped or
// scrolled: the box is sized from the slot with container-query units, so the origin badge sits on the
// picture's own corner however tall or wide the slot is. The badge is not optional - it is the article's rule
// for anything that is not a photograph or a plan, and it travels with the picture wherever it is shown.
export default function GuidePicture({ block, lang }: { block: ImageBlock; lang: LangCode }) {
  const caption = block.caption?.[lang];
  return (
    <figure className="absolute inset-0 flex flex-col items-center gap-1.5 px-4 pt-1">
      <div className="relative min-h-0 w-full flex-1" style={{ containerType: 'size' }}>
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border sec-border card-surface"
          style={{ width: `min(100cqw, calc(100cqh * ${block.width} / ${block.height}))`, aspectRatio: `${block.width} / ${block.height}` }}
        >
          <img src={localize(block.src, lang)} alt={block.alt[lang]} width={block.width} height={block.height} decoding="async" className="block h-full w-full object-contain" />
          <OriginBadge origin={block.origin} className="absolute bottom-2 right-2" />
        </div>
      </div>
      {caption && <figcaption className="max-w-[420px] flex-none pb-1 text-center font-sans text-[12.5px] leading-snug sec-text-60">{caption}</figcaption>}
    </figure>
  );
}
