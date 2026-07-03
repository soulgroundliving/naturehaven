import React from 'react';
import JournalShell from '@/components/JournalShell';
import JournalCard, { titleFont } from '@/components/JournalCard';
import usePageMeta from '@/hooks/usePageMeta';
import { ARTICLES } from '@/data/journal';
import { PROPERTY } from '@/data/propertyFacts';
import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';

const JournalPage: React.FC = () => {
  const { lang } = useLanguage();
  const j = TR.journal;

  usePageMeta({
    title: 'The Haven Journal — Nature Haven · บันทึกจากเฮเวน',
    description:
      lang === 'th'
        ? 'บันทึกจากเฮเวน — เรื่องเล่าการอยู่อย่างสงบ ชีวิตกับสัตว์เลี้ยง และบันทึกการสร้าง Nature Haven สายไหม กรุงเทพฯ เปิดกันยายน 2026'
        : 'The Haven Journal — notes on quiet living, pet life, and the building of Nature Haven, Saimai, Bangkok. Opening September 2026.',
    canonical: `${PROPERTY.url}/journal`,
  });

  return (
    <JournalShell>
      <section className="frosted-section backdrop-blur-xl">
        <div className="container-main py-14 md:py-20">
          <p className="section-label mb-4">{j.sectionLabel[lang]}</p>
          <h1
            className={`${titleFont(lang)} sec-text text-3xl leading-snug md:text-4xl lg:text-5xl max-w-3xl whitespace-pre-line`}
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            {j.sectionHeadline[lang]}
          </h1>
          <p className="mt-5 max-w-xl font-sans text-[15px] font-light leading-relaxed sec-text-70">
            {j.indexIntro[lang]}
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 md:mt-14 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {ARTICLES.map((article) => (
              <JournalCard key={article.slug} article={article} variant="grid" />
            ))}
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-xl border sec-border bg-pure-white/50 p-7 backdrop-blur-sm md:mt-16 md:flex-row md:items-center">
            <div>
              <p className="font-sans text-[15px] font-medium sec-text">{j.ctaTitle[lang]}</p>
              <p className="mt-1 font-sans text-sm font-light sec-text-70">{j.ctaBody[lang]}</p>
            </div>
            <a
              href={PROPERTY.lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block flex-none rounded-full bg-sage-green px-7 py-3 font-sans text-xs uppercase tracking-[0.1em] text-pure-white transition-opacity duration-300 hover:opacity-85"
            >
              {j.ctaButton[lang]}
            </a>
          </div>
        </div>
      </section>
    </JournalShell>
  );
};

export default JournalPage;
