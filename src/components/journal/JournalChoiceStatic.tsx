import { useLanguage } from '@/contexts/LanguageContext';
import type { ArticleBlock } from '@/data/journalTypes';
import { renderLeaf } from './renderLeaf';

type ChoiceBlock = Extract<ArticleBlock, { type: 'choice' }>;

// The same content as the tab set, laid out as plain stacked sections. It is
// what a `choice` shows while its tab-set chunk is still downloading and what
// it falls back to if that chunk never arrives — so the conditions are always
// readable, and never depend on a lazy import succeeding. Deliberately does not
// import Radix: that is the whole point of splitting the tab set out.
export default function JournalChoiceStatic({ block }: { block: ChoiceBlock }) {
  const { lang } = useLanguage();
  return (
    <section data-jn-block="choice" data-jn-choice-mode="static" className="mx-auto my-10 w-full max-w-[720px]">
      <p className="mb-4 font-sans text-[12px] uppercase tracking-[0.16em] sec-text-60">{block.label[lang]}</p>
      {block.options.map((option) => (
        <div key={option.id} className="mb-6">
          <p className="mb-2 font-sans text-[15px] font-medium sec-text">{option.label[lang]}</p>
          {option.blocks.map((inner, i) => renderLeaf(inner, i))}
        </div>
      ))}
    </section>
  );
}
