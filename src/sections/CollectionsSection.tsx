import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { titleFont } from '@/components/JournalCard';
import AiRenderBadge from '@/components/AiRenderBadge';
import { COLLECTIONS } from '@/data/collections';
import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';

// The Architectural Lookbook — homepage index. Each collection is a collapsible
// row: the number + title stay visible as an elegant contents list; tapping
// expands the render + essence + teasers + the link to its /collections/<slug>
// chapter. Collapsed-by-default (first one open) keeps mobile from drowning in
// text — the recurring "ตัวหนังสือเยอะ ไม่อ่าน".
const CollectionsSection: React.FC = () => {
  const { lang } = useLanguage();
  const lb = TR.lookbook;
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section id="collections" className="frosted-section backdrop-blur-xl section-padding">
      <div className="container-main">
        {/* Header */}
        <div className="mb-8 md:mb-12 max-w-[700px]">
          <p className="section-label sec-text-60 mb-4">{lb.sectionLabel[lang]}</p>
          <h2 className="headline-lg sec-text">
            {lb.sectionHeadline[lang].split('\n').map((line, i, arr) => (
              <React.Fragment key={i}>{line}{i < arr.length - 1 && <br />}</React.Fragment>
            ))}
          </h2>
          <p className="mt-5 font-sans text-[15px] md:text-base font-light leading-relaxed sec-text-70 max-w-[520px]">
            {lb.intro[lang]}
          </p>
        </div>

        {/* Accordion */}
        <div className="border-t sec-border">
          {COLLECTIONS.map((c, i) => {
            const open = openIdx === i;
            const teasers = c.details.slice(0, 3);
            return (
              <div key={c.slug} className="border-b sec-border">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpenIdx(open ? -1 : i)}
                    aria-expanded={open}
                    className="group flex w-full items-center gap-4 py-5 text-left md:gap-6 md:py-6"
                  >
                    <span className="flex-none font-serif text-2xl font-light leading-none tabular-nums sec-text-55 md:text-3xl">
                      {c.index}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-sans text-[9px] uppercase tracking-[0.24em] sec-text-55">
                        {c.title.en}
                      </span>
                      <span
                        className={`${titleFont(lang)} mt-1 block text-lg leading-tight sec-text md:text-2xl`}
                        style={{ textWrap: 'balance' } as React.CSSProperties}
                      >
                        {c.title[lang]}
                      </span>
                    </span>
                    <svg
                      className={`h-5 w-5 flex-none sec-text-55 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      aria-hidden="true"
                    >
                      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </h3>

                {/* Collapsible body — grid 0fr→1fr animates height with no magic number */}
                <div
                  className="grid"
                  style={{ gridTemplateRows: open ? '1fr' : '0fr', transition: 'grid-template-rows 450ms ease' }}
                >
                  <div className="overflow-hidden">
                    <div className="grid gap-6 pb-8 md:grid-cols-2 md:items-center md:gap-10">
                      {/* Render */}
                      <div className="relative h-64 overflow-hidden rounded-2xl card-surface md:h-80">
                        <img
                          src={c.hero}
                          alt={c.heroAlt[lang]}
                          loading="lazy"
                          className="h-full w-full object-contain"
                        />
                        <AiRenderBadge className="absolute bottom-2.5 right-2.5" />
                      </div>

                      {/* Text */}
                      <div>
                        <p className="font-sans text-sm md:text-[15px] font-light leading-relaxed sec-text-70 max-w-[440px]">
                          {c.essence[lang]}
                        </p>
                        <ul className="mt-5 max-w-[440px]">
                          {teasers.map((d) => (
                            <li
                              key={d.label}
                              className="border-t sec-border py-2.5 font-sans text-[13px] font-light sec-text-80 flex items-center gap-3"
                            >
                              <span className="text-[9px] uppercase tracking-[0.18em] sec-text-55 flex-none">
                                {d.label}
                              </span>
                              <span className="truncate">{d.title[lang]}</span>
                            </li>
                          ))}
                        </ul>
                        <Link
                          to={`/collections/${c.slug}`}
                          className="group/link mt-5 inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.16em] sec-text-80 transition-colors hover:text-sage-green"
                        >
                          {lb.openCollection[lang]}
                          <svg
                            width="20"
                            height="10"
                            viewBox="0 0 28 10"
                            fill="none"
                            aria-hidden="true"
                            className="transition-transform duration-300 group-hover/link:translate-x-1.5"
                          >
                            <path d="M1 5h26M22 1l5 4-5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CollectionsSection;
