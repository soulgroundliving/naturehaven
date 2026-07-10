import React from 'react';
import { Link } from 'react-router-dom';
import { titleFont } from '@/components/JournalCard';
import AiRenderBadge from '@/components/AiRenderBadge';
import { COLLECTIONS } from '@/data/collections';
import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';

// The Architectural Lookbook — homepage index. Four numbered editorial rows,
// each linking to its /collections/<slug> chapter. Replaced the scroll-driven
// RoomJourney (2026-07-10 quiet-luxury redesign): no GSAP, no pins — the
// desktop lift-in comes free from the shared .frosted-section observer.
const CollectionsSection: React.FC = () => {
  const { lang } = useLanguage();
  const lb = TR.lookbook;

  return (
    <section id="collections" className="frosted-section backdrop-blur-xl section-padding">
      <div className="container-main">
        {/* Header */}
        <div className="mb-10 md:mb-16 max-w-[700px]">
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

        {/* Collection rows */}
        <div className="flex flex-col gap-10 md:gap-14">
          {COLLECTIONS.map((c, i) => {
            const teasers = c.details.slice(0, 3);
            const reversed = i % 2 === 1;
            return (
              <Link
                key={c.slug}
                to={`/collections/${c.slug}`}
                className="group grid grid-cols-1 items-center gap-5 md:grid-cols-2 md:gap-12 cursor-pointer"
                aria-label={`${lb.collectionWord[lang]} ${c.index} — ${c.title[lang]}`}
              >
                {/* Image — fixed-height matte frame, full image via
                    object-contain (most heroes are portrait renders). */}
                <div
                  className={`relative h-72 overflow-hidden rounded-2xl shadow-[0_14px_36px_rgba(43,43,43,0.12)] card-surface md:h-96 ${
                    reversed ? 'md:order-2' : ''
                  }`}
                >
                  <img
                    src={c.hero}
                    alt={c.heroAlt[lang]}
                    loading="lazy"
                    className="h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  <AiRenderBadge className="absolute bottom-2.5 right-2.5" />
                </div>

                {/* Text */}
                <div className={reversed ? 'md:order-1' : ''}>
                  <div className="flex items-baseline gap-4">
                    <span className="font-serif text-3xl md:text-4xl font-light leading-none sec-text-55 tabular-nums">
                      {c.index}
                    </span>
                    <span className="font-sans text-[10px] uppercase tracking-[0.24em] sec-text-55">
                      {c.title.en}
                    </span>
                  </div>
                  <h3
                    className={`${titleFont(lang)} mt-3 text-xl md:text-[26px] leading-[1.3] sec-text`}
                    style={{ textWrap: 'balance' } as React.CSSProperties}
                  >
                    {c.title[lang]}
                  </h3>
                  <p className="mt-3 font-sans text-sm md:text-[15px] font-light leading-relaxed sec-text-70 max-w-[440px]">
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

                  <span className="mt-5 inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.16em] sec-text-80">
                    {lb.openCollection[lang]}
                    <svg
                      width="20"
                      height="10"
                      viewBox="0 0 28 10"
                      fill="none"
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-1.5"
                    >
                      <path d="M1 5h26M22 1l5 4-5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CollectionsSection;
