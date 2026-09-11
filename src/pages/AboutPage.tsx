import React from 'react';
import JournalShell from '@/components/JournalShell';
import usePageMeta from '@/hooks/usePageMeta';
import { PROPERTY } from '@/data/propertyFacts';
import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';

// Structure-only shell for the future About/Founder page. No biography,
// motivation, or brand-philosophy copy has been written — every section
// body below is an explicit placeholder marker (ap.placeholderBody), not a
// first draft. Do not fill these in without real content from the owner.
//
// Deliberately NOT in tools/prerender.mjs ROUTES, public/sitemap.xml, or any
// nav (desktop, mobile, footer) — noindex'd via usePageMeta so it can be
// reviewed at /about in local dev without being publicly reachable or
// crawlable once deployed (no prerendered file exists at that path, and
// nothing on the live site links to it yet).
const AboutPage: React.FC = () => {
  const { lang } = useLanguage();
  const ap = TR.aboutPage;

  usePageMeta({
    title: ap.metaTitle[lang],
    description: ap.metaDescription[lang],
    canonical: `${PROPERTY.url}/about`,
    robots: 'noindex, nofollow',
  });

  return (
    <JournalShell>
      <article className="frosted-page backdrop-blur-xl">
        <div className="container-main py-12 md:py-16">
          <div className="mx-auto w-full max-w-[720px]">
            <p className="font-sans text-[11px] uppercase tracking-[0.22em] sec-text-60">
              {ap.eyebrow[lang]}
            </p>

            <div className="mt-6 rounded-xl border-2 border-dashed border-sage-green/40 bg-sage-green/5 p-6">
              <p className="font-sans text-[13px] font-medium uppercase tracking-[0.08em] text-sage-green">
                {lang === 'th' ? 'ฉบับร่างโครงสร้าง — ยังไม่เผยแพร่' : 'Structure draft — not yet published'}
              </p>
              <p className="mt-2 font-sans text-sm font-light leading-relaxed sec-text-70">
                {ap.draftNote[lang]}
              </p>
            </div>

            <div className="mt-12 flex flex-col gap-8">
              {ap.sections[lang].map((title, i) => (
                <section
                  key={title}
                  className="rounded-xl border sec-border bg-pure-white/30 p-7 md:p-8"
                  aria-labelledby={`about-section-${i}`}
                >
                  <p className="font-sans text-[11px] uppercase tracking-[0.18em] sec-text-55 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h2 id={`about-section-${i}`} className="mt-2 font-serif text-2xl sec-text md:text-[28px]">
                    {title}
                  </h2>
                  <p className="mt-4 rounded-lg border border-dashed sec-border px-4 py-3 font-sans text-sm italic leading-relaxed sec-text-55">
                    {ap.placeholderBody[lang]}
                  </p>
                </section>
              ))}
            </div>
          </div>
        </div>
      </article>
    </JournalShell>
  );
};

export default AboutPage;
