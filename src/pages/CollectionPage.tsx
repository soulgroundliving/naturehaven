import React, { useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import JournalShell from '@/components/JournalShell';
import { titleFont } from '@/components/JournalCard';
import AiRenderBadge from '@/components/AiRenderBadge';
import usePageMeta, { useJsonLd } from '@/hooks/usePageMeta';
import { COLLECTIONS, getCollection } from '@/data/collections';
import { PROPERTY } from '@/data/propertyFacts';
import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';

// One chapter of the Architectural Lookbook — a plain, quiet scrolling page.
// Reuses JournalShell (light chrome, no homepage GSAP machinery).
const CollectionPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { lang } = useLanguage();
  const collection = getCollection(slug ?? '');
  const lb = TR.lookbook;

  // Hooks must run unconditionally — neutral fallbacks when slug is unknown;
  // the <Navigate> below redirects before paint.
  const canonical = `${PROPERTY.url}/collections/${slug ?? ''}`;
  usePageMeta({
    title: collection
      ? `${collection.title[lang]} — The Architectural Lookbook · Nature Haven`
      : 'The Architectural Lookbook · Nature Haven',
    description: collection ? collection.essence[lang] : '',
    canonical,
    ogImage: collection
      ? collection.hero.startsWith('http')
        ? collection.hero
        : `${PROPERTY.url}${collection.hero}`
      : undefined,
  });

  const jsonLd = useMemo(
    () =>
      collection
        ? {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: `${collection.title.th} — The Architectural Lookbook`,
            alternateName: collection.title.en,
            description: collection.essence.th,
            inLanguage: ['th-TH', 'en-US'],
            isPartOf: { '@type': 'WebSite', name: PROPERTY.name, url: PROPERTY.url },
            mainEntityOfPage: canonical,
          }
        : null,
    [collection, canonical]
  );
  useJsonLd('jsonld-collection', jsonLd);

  if (!collection) return <Navigate to="/" replace />;

  const i = COLLECTIONS.findIndex((c) => c.slug === collection.slug);
  const prev = COLLECTIONS[(i - 1 + COLLECTIONS.length) % COLLECTIONS.length];
  const next = COLLECTIONS[(i + 1) % COLLECTIONS.length];

  return (
    <JournalShell>
      <article className="frosted-page backdrop-blur-xl">
        <div className="container-main py-12 md:py-20">
          <div className="mx-auto w-full max-w-[760px]">
            {/* Eyebrow */}
            <p className="font-sans text-[11px] uppercase tracking-[0.22em] sec-text-60">
              {lb.sectionLabel[lang]} — {lb.collectionWord[lang]} {collection.index} / {String(COLLECTIONS.length).padStart(2, '0')}
            </p>

            {/* Title + essence */}
            <h1
              className={`${titleFont(lang)} mt-4 text-[26px] leading-[1.3] sec-text md:text-[40px] md:leading-[1.25]`}
              style={{ textWrap: 'balance' } as React.CSSProperties}
            >
              {collection.title[lang]}
            </h1>
            <p className="mt-4 border-b sec-border pb-8 font-sans text-[15px] font-light italic leading-relaxed sec-text-70 md:text-base">
              {collection.essence[lang]}
            </p>

            {/* Hero — fixed-height matte frame, full image via object-contain
                (most Lookbook renders are portrait; a landscape crop was
                cutting more than half of them off). */}
            <div className="relative mt-10 h-[50vh] overflow-hidden rounded-xl shadow-[0_18px_44px_rgba(43,43,43,0.14)] card-surface md:h-[65vh]">
              <img
                src={collection.hero}
                alt={collection.heroAlt[lang]}
                loading="eager"
                fetchPriority="high"
                className="h-full w-full object-contain"
              />
              <AiRenderBadge className="absolute bottom-3 right-3" />
            </div>

            {/* Manifesto */}
            <p className="mt-10 font-sans text-[17px] font-light leading-[1.95] sec-text-90 md:text-[19px] md:leading-[2]">
              {collection.manifesto[lang]}
            </p>

            {/* Details */}
            <p className="mt-14 font-sans text-[11px] uppercase tracking-[0.22em] sec-text-60">
              {lb.detailsWord[lang]}
            </p>
            <div className="mt-2">
              {collection.details.map((d, idx) => (
                <div
                  key={d.label}
                  className="grid grid-cols-1 gap-2 border-t sec-border py-9 md:grid-cols-[72px_1fr] md:gap-6"
                >
                  <span className="font-serif text-[22px] font-light leading-none sec-text-55 tabular-nums md:pt-1">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-[0.24em] sec-text-55">
                      {d.label}
                    </p>
                    <h2 className="mt-2 font-sans text-lg font-medium leading-snug sec-text md:text-xl">
                      {d.title[lang]}
                    </h2>
                    <p className="mt-3 font-sans text-[15.5px] font-light leading-[1.9] sec-text-80 md:text-base">
                      {d.body[lang]}
                    </p>
                    {d.spec && (
                      <p className="mt-4 font-sans text-[12.5px] leading-relaxed sec-text-55 tabular-nums">
                        {d.spec[lang]}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Viewing CTA */}
            <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-xl border sec-border bg-pure-white/50 p-7 backdrop-blur-sm md:flex-row md:items-center">
              <div>
                <p className="font-sans text-[15px] font-medium sec-text">{lb.ctaTitle[lang]}</p>
                <p className="mt-1 font-sans text-sm font-light sec-text-70">{lb.ctaBody[lang]}</p>
              </div>
              <a
                href={PROPERTY.lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block flex-none cursor-pointer rounded-full bg-sage-green px-7 py-3 font-sans text-xs uppercase tracking-[0.1em] text-pure-white transition-opacity duration-300 hover:opacity-85"
              >
                {lb.ctaButton[lang]}
              </a>
            </div>

            {/* Prev / next */}
            <div className="mt-10 flex items-center justify-between gap-4 border-t sec-border pt-8">
              <Link
                to={`/collections/${prev.slug}`}
                className="group max-w-[45%] cursor-pointer font-sans text-[13px] sec-text-60 transition-opacity duration-300 hover:opacity-70"
              >
                <span className="block text-[10px] uppercase tracking-[0.2em] sec-text-55">
                  ← {lb.prevCollection[lang]}
                </span>
                <span className="mt-1 block truncate font-medium sec-text-80">{prev.title[lang]}</span>
              </Link>
              <Link
                to={`/collections/${next.slug}`}
                className="group max-w-[45%] cursor-pointer text-right font-sans text-[13px] sec-text-60 transition-opacity duration-300 hover:opacity-70"
              >
                <span className="block text-[10px] uppercase tracking-[0.2em] sec-text-55">
                  {lb.nextCollection[lang]} →
                </span>
                <span className="mt-1 block truncate font-medium sec-text-80">{next.title[lang]}</span>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </JournalShell>
  );
};

export default CollectionPage;
