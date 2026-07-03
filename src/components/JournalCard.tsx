import React from 'react';
import { Link } from 'react-router-dom';
import type { Article } from '@/data/journalTypes';
import { formatArticleDate } from '@/data/journal';
import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';

interface JournalCardProps {
  article: Article;
  /** featured = large photo-top card · row = compact horizontal · grid = index-page card */
  variant?: 'featured' | 'row' | 'grid';
  className?: string;
}

// DM Serif Display has no Thai glyphs — Thai titles must stay on the brand
// sans (IBM Plex Sans Thai Looped) or they fall back to system serifs.
export const titleFont = (lang: 'en' | 'th') =>
  lang === 'en' ? 'font-serif' : 'font-sans font-medium';

const JournalCard: React.FC<JournalCardProps> = ({ article, variant = 'grid', className = '' }) => {
  const { lang } = useLanguage();
  const meta = (
    <p className="font-sans text-xs sec-text-60 tabular-nums">
      {formatArticleDate(article.date, lang)}
      <span className="mx-2 opacity-50">·</span>
      {article.readMinutes} {TR.journal.readMin[lang]}
    </p>
  );

  if (variant === 'row') {
    return (
      <Link
        to={`/journal/${article.slug}`}
        className={`jn-card group flex items-stretch overflow-hidden rounded-xl border sec-border bg-pure-white/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${className}`}
      >
        <div className="w-28 md:w-32 flex-none overflow-hidden">
          <img
            src={article.hero}
            alt={article.heroAlt[lang]}
            width={256}
            height={256}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1.5 p-4 md:p-5">
          <p className="font-sans text-[10px] uppercase tracking-[0.18em] sec-text-60">
            {article.category[lang]}
          </p>
          <p className={`${titleFont(lang)} text-[15px] leading-snug sec-text`}>
            {article.title[lang]}
          </p>
          <div className="mt-auto pt-1">{meta}</div>
        </div>
      </Link>
    );
  }

  const isFeatured = variant === 'featured';
  return (
    <Link
      to={`/journal/${article.slug}`}
      className={`jn-card group flex flex-col overflow-hidden rounded-xl border sec-border bg-pure-white/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${className}`}
    >
      <div className="aspect-[16/9] overflow-hidden">
        <img
          src={article.hero}
          alt={article.heroAlt[lang]}
          width={800}
          height={450}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-6 md:p-7">
        <p className="font-sans text-[10px] uppercase tracking-[0.18em] sec-text-60">
          {article.category[lang]}
        </p>
        <p
          className={`${titleFont(lang)} sec-text leading-snug ${
            isFeatured ? 'text-xl md:text-2xl lg:text-[26px]' : 'text-lg'
          }`}
        >
          {article.title[lang]}
        </p>
        {isFeatured && (
          <p className="font-sans text-sm font-light leading-relaxed sec-text-70">
            {article.excerpt[lang]}
          </p>
        )}
        <div className="mt-auto pt-2">{meta}</div>
      </div>
    </Link>
  );
};

export default JournalCard;
