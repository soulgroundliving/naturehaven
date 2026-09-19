import { useId } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { initialChoiceId } from '@/lib/journalBlocks';
import type { ArticleBlock } from '@/data/journalTypes';
import { renderLeaf } from './renderLeaf';

type ChoiceBlock = Extract<ArticleBlock, { type: 'choice' }>;

const TRIGGER =
  'rounded-full border sec-border px-4 py-2 font-sans text-[14px] sec-text-80 transition-colors duration-300 hover:border-sage-green data-[state=active]:border-sage-green data-[state=active]:bg-sage-green data-[state=active]:text-pure-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-green';

// "Pick your situation": a WAI-ARIA tab set (Radix handles roles and arrow
// keys). Every option's panel is force-mounted and hidden with CSS rather than
// unmounted, so crawlers and the prerendered snapshot read all of them.
export default function JournalChoice({ block }: { block: ChoiceBlock }) {
  const { lang } = useLanguage();
  const labelId = useId();
  return (
    <Tabs.Root
      defaultValue={initialChoiceId(block.options, block.defaultId)}
      data-jn-block="choice"
      data-jn-choice-mode="tabs"
      className="mx-auto my-10 w-full max-w-[720px]"
    >
      <p id={labelId} className="mb-3 font-sans text-[12px] uppercase tracking-[0.16em] sec-text-60">
        {block.label[lang]}
      </p>
      <Tabs.List aria-labelledby={labelId} className="flex flex-wrap gap-2">
        {block.options.map((option) => (
          <Tabs.Trigger key={option.id} value={option.id} className={TRIGGER}>
            {option.label[lang]}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {block.options.map((option) => (
        <Tabs.Content
          key={option.id}
          value={option.id}
          forceMount
          className="mt-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sage-green data-[state=inactive]:hidden"
        >
          {option.blocks.map((inner, i) => renderLeaf(inner, i))}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
