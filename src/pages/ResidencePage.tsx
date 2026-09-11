import React from 'react';
import { Link } from 'react-router-dom';
import JournalShell from '@/components/JournalShell';
import RoomCarousel from '@/components/RoomCarousel';
import ResidenceDetails from '@/components/ResidenceDetails';
import usePageMeta from '@/hooks/usePageMeta';
import { COLLECTIONS } from '@/data/collections';
import { PROPERTY } from '@/data/propertyFacts';
import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';

// The standalone, shareable, indexable version of the homepage Residences
// section — same facts (via ResidenceDetails), its own URL, its own SEO.
// Structured data comes from RouteStructuredData's '/residence' case
// (structuredData.ts), same pattern as /places and /journal — no dedicated
// entity data to add per-instance here, unlike /journal/:slug or
// /collections/:slug.
const ResidencePage: React.FC = () => {
  const { lang } = useLanguage();
  const rp = TR.residencePage;
  const r = TR.residences;
  const lb = TR.lookbook;

  const canonical = `${PROPERTY.url}/residence`;
  usePageMeta({
    title: rp.metaTitle[lang],
    description: rp.metaDescription[lang],
    canonical,
    ogImage: `${PROPERTY.url}/og-image-v2.jpg`,
  });

  return (
    <JournalShell>
      <article className="frosted-page backdrop-blur-xl">
        <div className="container-main py-12 md:py-16">
          <div className="mx-auto w-full max-w-[900px]">
            <p className="font-sans text-[11px] uppercase tracking-[0.22em] sec-text-60">
              {rp.eyebrow[lang]}
            </p>
            <h1
              className="mt-3 font-serif text-[30px] leading-[1.15] sec-text md:text-5xl"
              style={{ textWrap: 'balance' } as React.CSSProperties}
            >
              {r.sectionHeadline[lang]}
            </h1>

            <RoomCarousel className="mt-8 h-[50vh] rounded-xl md:h-[60vh]" />
          </div>
        </div>

        <ResidenceDetails />

        <div className="container-main pb-12 md:pb-20">
          <div className="mx-auto w-full max-w-[900px]">
            {/* Cross-link into the Lookbook — fixes the gap where nothing on
                the site pointed from room facts to the design reasoning
                behind them. */}
            <div className="mb-8 rounded-xl border sec-border bg-pure-white/40 p-7 backdrop-blur-sm md:p-8">
              <p className="font-sans text-[15px] font-medium sec-text">{rp.designLinkTitle[lang]}</p>
              <p className="mt-1 font-sans text-sm font-light leading-relaxed sec-text-70">{rp.designLinkBody[lang]}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {COLLECTIONS.map((c) => (
                  <Link
                    key={c.slug}
                    to={`/collections/${c.slug}`}
                    className="rounded-full border sec-border px-4 py-2 font-sans text-xs sec-text-70 transition-colors duration-300 hover:border-sage-green hover:text-sage-green"
                  >
                    {c.title[lang]}
                  </Link>
                ))}
              </div>
            </div>

            {/* Viewing CTA — same panel pattern as Journal/Collection pages */}
            <div className="flex flex-col items-start justify-between gap-4 rounded-xl border sec-border bg-pure-white/50 p-7 backdrop-blur-sm md:flex-row md:items-center">
              <div>
                <p className="font-sans text-[15px] font-medium sec-text">{r.ctaLabel[lang]}</p>
                <p className="mt-1 font-sans text-sm font-light sec-text-70">{lb.ctaBody[lang]}</p>
              </div>
              <a
                href={PROPERTY.lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block flex-none cursor-pointer rounded-full bg-sage-green px-7 py-3 font-sans text-xs uppercase tracking-[0.1em] text-pure-white transition-opacity duration-300 hover:opacity-85"
              >
                {r.ctaButton[lang]}
              </a>
            </div>
          </div>
        </div>
      </article>
    </JournalShell>
  );
};

export default ResidencePage;
