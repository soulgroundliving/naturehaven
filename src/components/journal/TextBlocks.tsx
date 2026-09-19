import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';
import type { ArticleBlock } from '@/data/journalTypes';

type Of<T extends ArticleBlock['type']> = Extract<ArticleBlock, { type: T }>;

// Every text block sits in the 720px reading column, whatever width its
// neighbours (a wide gallery, a table) break out to.
const COLUMN = 'mx-auto w-full max-w-[720px]';
const BODY = 'font-sans text-[16.5px] font-light leading-[1.95] sec-text-90 md:text-[17.5px]';

const TONE_BORDER = {
  note: 'border-sage-green',
  tip: 'border-warm-brown',
  caution: 'border-warm-rose',
} as const;

export function Heading({ block, id }: { block: Of<'h2'> | Of<'h3'>; id?: string }) {
  const { lang } = useLanguage();
  if (block.type === 'h2') {
    return (
      <h2 id={id} className={`${COLUMN} mb-4 mt-12 scroll-mt-24 font-sans text-xl font-medium leading-snug sec-text md:text-[22px]`}>
        {block.text[lang]}
      </h2>
    );
  }
  return (
    <h3 id={id} className={`${COLUMN} mb-3 mt-8 scroll-mt-24 font-sans text-[18px] font-medium leading-snug sec-text md:text-[19px]`}>
      {block.text[lang]}
    </h3>
  );
}

export function Paragraph({ block }: { block: Of<'p'> }) {
  const { lang } = useLanguage();
  return <p className={`${COLUMN} mb-6 ${BODY}`}>{block.text[lang]}</p>;
}

export function PullQuote({ block }: { block: Of<'pull'> }) {
  const { lang } = useLanguage();
  return (
    <blockquote
      className={`${COLUMN} my-10 border-l-2 border-sage-green py-1 pl-6 font-sans text-lg font-light italic leading-relaxed sec-text-80 md:text-xl`}
    >
      {block.text[lang]}
    </blockquote>
  );
}

export function BulletList({ block }: { block: Of<'list'> }) {
  const { lang } = useLanguage();
  const Tag = block.ordered ? 'ol' : 'ul';
  return (
    <Tag className={`${COLUMN} mb-6 space-y-2 pl-6 marker:text-sage-green ${BODY} ${block.ordered ? 'list-decimal' : 'list-disc'}`}>
      {block.items.map((item, i) => (
        <li key={i}>{item[lang]}</li>
      ))}
    </Tag>
  );
}

export function Callout({ block }: { block: Of<'callout'> }) {
  const { lang } = useLanguage();
  const tone = block.tone ?? 'note';
  // A tip or caution without a title still says what it is — never colour alone.
  const heading = block.title?.[lang] ?? (tone === 'note' ? undefined : TR.journal.blocks.tone[tone][lang]);
  return (
    <aside role="note" className={`${COLUMN} my-8 rounded-xl border-l-4 px-5 py-4 card-surface ${TONE_BORDER[tone]}`}>
      {heading && (
        <p className="mb-1 font-sans text-[11px] font-medium uppercase tracking-[0.16em] sec-text-60">{heading}</p>
      )}
      <p className="font-sans text-[15.5px] font-light leading-[1.85] sec-text-90">{block.text[lang]}</p>
    </aside>
  );
}
