import { useLanguage } from '@/contexts/LanguageContext';
import { localize } from '@/lib/journalBlocks';
import type { TableBlock } from '@/data/journalTypes';
import { SIZE_CLASS } from './blockSize';

// Real <table> markup (readable by screen readers and crawlers, unlike a
// picture of one). Scrolls sideways inside its own frame on narrow screens
// instead of stretching the page.
export default function JournalTable({ block }: { block: TableBlock }) {
  const { lang } = useLanguage();
  const label = block.caption?.[lang];
  return (
    <div data-jn-block="table" className={`mx-auto my-10 w-full ${SIZE_CLASS[block.size ?? 'reading']}`}>
      {/* Focusable so a keyboard user can scroll a table that overflows; named by its caption when it has one. */}
      <div
        tabIndex={0}
        {...(label ? { role: 'region', 'aria-label': label } : {})}
        className="overflow-x-auto rounded-xl border sec-border card-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sage-green"
      >
        <table className="w-full min-w-[320px] border-collapse text-left font-sans text-[14.5px] leading-snug sec-text-90">
          {block.caption && (
            <caption className="caption-bottom px-4 py-3 text-left text-[13px] sec-text-60">{block.caption[lang]}</caption>
          )}
          {block.head && (
            <thead>
              <tr>
                {block.head.map((cell, i) => (
                  <th key={i} scope="col" className="border-b sec-border px-4 py-3 text-[12px] font-medium uppercase tracking-[0.12em] sec-text-70">
                    {localize(cell, lang)}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {block.rows.map((row, r) => (
              <tr key={r} className="border-b sec-border last:border-b-0">
                {row.map((cell, c) =>
                  c === 0 && block.rowHeader ? (
                    <th key={c} scope="row" className="px-4 py-3 align-top font-medium sec-text">
                      {localize(cell, lang)}
                    </th>
                  ) : (
                    <td key={c} className="px-4 py-3 align-top tabular-nums">
                      {localize(cell, lang)}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
