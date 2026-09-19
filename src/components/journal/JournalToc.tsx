import { useLanguage } from '@/contexts/LanguageContext';
import type { Heading } from '@/lib/journalBlocks';
import { TR } from '@/lib/translations';

interface Group {
  head: Heading;
  children: Heading[];
}

// h3s nest under the h2 above them; an h3 before any h2 stands on its own.
function group(headings: Heading[]): Group[] {
  const groups: Group[] = [];
  for (const heading of headings) {
    const last = groups[groups.length - 1];
    if (heading.level === 3 && last) last.children.push(heading);
    else groups.push({ head: heading, children: [] });
  }
  return groups;
}

const LINK = 'underline-offset-4 transition-colors duration-300 hover:text-sage-green hover:underline';

// "On this page" for long pieces. Plain #anchor links: they work without JS,
// in the prerendered snapshot, and give every section a shareable URL. The
// headings carry scroll-mt so the fixed header does not cover the target.
export default function JournalToc({ headings }: { headings: Heading[] }) {
  const { lang } = useLanguage();
  const groups = group(headings);
  return (
    <nav aria-label={TR.journal.blocks.toc[lang]} data-jn-block="toc" className="mx-auto mb-10 w-full max-w-[720px]">
      <details className="rounded-xl border sec-border card-surface">
        <summary className="cursor-pointer list-none px-5 py-3 font-sans text-[12px] font-medium uppercase tracking-[0.16em] sec-text-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-green [&::-webkit-details-marker]:hidden">
          {TR.journal.blocks.toc[lang]} <span className="tabular-nums opacity-60">({groups.length})</span>
        </summary>
        <ol className="space-y-1.5 px-5 pb-4 pt-1 font-sans text-[15px] leading-snug sec-text-80">
          {groups.map(({ head, children }) => (
            <li key={head.id}>
              <a href={`#${head.id}`} className={LINK}>
                {head.text[lang]}
              </a>
              {children.length > 0 && (
                <ul className="mt-1.5 space-y-1 pl-4 text-[14px] sec-text-70">
                  {children.map((child) => (
                    <li key={child.id}>
                      <a href={`#${child.id}`} className={LINK}>
                        {child.text[lang]}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </details>
    </nav>
  );
}
