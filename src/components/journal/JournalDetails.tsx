import { useLanguage } from '@/contexts/LanguageContext';
import type { ArticleBlock } from '@/data/journalTypes';
import { renderLeaf } from './renderLeaf';

type DetailsBlock = Extract<ArticleBlock, { type: 'details' }>;

// Native <details>: keyboard and screen-reader support for free, the content
// is in the DOM whether or not it is open, and there is no JS to break.
export default function JournalDetails({ block }: { block: DetailsBlock }) {
  const { lang } = useLanguage();
  return (
    <details
      open={block.open}
      data-jn-block="details"
      className="group mx-auto my-4 w-full max-w-[720px] rounded-xl border sec-border card-surface"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-sans text-[16px] font-medium sec-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-green [&::-webkit-details-marker]:hidden">
        <span>{block.summary[lang]}</span>
        <span aria-hidden="true" className="flex-none text-xl leading-none transition-transform duration-300 group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="px-5 pb-5 pt-1">{block.blocks.map((inner, i) => renderLeaf(inner, i))}</div>
    </details>
  );
}
