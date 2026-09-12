import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Article } from '@/data/journalTypes';
import { formatArticleDate, getCategoryAccent } from '@/data/journal';
import { titleFont } from '@/components/JournalCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';

type TileSize = 'large' | 'wide' | 'tall' | 'normal';

// Most recent visible article leads at 2x2; everything after cycles through
// a fixed rhythm so the mosaic stays varied no matter how many articles
// exist — grid-flow-dense backfills the gaps a fixed cycle would otherwise
// leave, so this never needs hand-placed positions per article.
const SIZE_CYCLE: TileSize[] = ['wide', 'normal', 'tall', 'normal'];
function tileSizeAt(index: number): TileSize {
  return index === 0 ? 'large' : SIZE_CYCLE[(index - 1) % SIZE_CYCLE.length];
}

const SPAN: Record<TileSize, string> = {
  large: 'col-span-2 row-span-2',
  wide: 'col-span-2 row-span-1',
  tall: 'col-span-1 row-span-2',
  normal: 'col-span-1 row-span-1',
};
const TITLE_SIZE: Record<TileSize, string> = {
  large: 'text-lg md:text-2xl',
  wide: 'text-base md:text-lg',
  tall: 'text-sm md:text-base',
  normal: 'text-sm md:text-base',
};
const CLAMP: Record<TileSize, string> = {
  large: 'line-clamp-3',
  wide: 'line-clamp-2',
  tall: 'line-clamp-3',
  normal: 'line-clamp-2',
};

interface JournalMosaicGridProps {
  articles: Article[];
  className?: string;
}

const JournalMosaicGrid: React.FC<JournalMosaicGridProps> = ({ articles, className = '' }) => {
  const { lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const seen = new Map<string, Article['category']>();
    for (const a of articles) {
      if (!seen.has(a.category.en)) seen.set(a.category.en, a.category);
    }
    return Array.from(seen.entries());
  }, [articles]);

  const filtered = useMemo(
    () => (activeCategory ? articles.filter((a) => a.category.en === activeCategory) : articles),
    [articles, activeCategory]
  );

  return (
    <div className={className}>
      <div className="mb-5 flex flex-wrap gap-2 md:mb-7" role="group" aria-label={TR.journal.filterLabel[lang]}>
        <button
          type="button"
          onClick={() => setActiveCategory(null)}
          aria-pressed={activeCategory === null}
          className={`rounded-full px-3.5 py-1.5 font-sans text-xs transition-colors duration-200 ${
            activeCategory === null
              ? 'bg-dark-charcoal text-pure-white'
              : 'border sec-border sec-text-70 hover:sec-text'
          }`}
        >
          {TR.journal.filterAll[lang]}
        </button>
        {categories.map(([catEn, catLabel]) => (
          <button
            key={catEn}
            type="button"
            onClick={() => setActiveCategory(catEn)}
            aria-pressed={activeCategory === catEn}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-sans text-xs transition-colors duration-200 ${
              activeCategory === catEn
                ? 'bg-dark-charcoal text-pure-white'
                : 'border sec-border sec-text-70 hover:sec-text'
            }`}
          >
            <span className={`h-[6px] w-[6px] flex-none rounded-full ${getCategoryAccent(catEn)}`} />
            {catLabel[lang]}
          </button>
        ))}
      </div>

      <div className="grid grid-flow-dense grid-cols-2 auto-rows-[130px] gap-2.5 md:grid-cols-4 md:auto-rows-[150px] md:gap-3">
        {filtered.map((article, i) => {
          const size = tileSizeAt(i);
          return (
            <Link
              key={article.slug}
              to={`/journal/${article.slug}`}
              className={`jn-tile group relative block overflow-hidden rounded-xl ${SPAN[size]}`}
            >
              <img
                src={article.hero}
                alt={article.heroAlt[lang]}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
              <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 font-sans text-[10px] uppercase tracking-[0.12em] text-pure-white backdrop-blur-sm">
                <span className={`h-[6px] w-[6px] flex-none rounded-full ${getCategoryAccent(article.category.en)}`} />
                {article.category[lang]}
              </span>
              <div className="absolute inset-x-0 bottom-0 p-3.5 md:p-4">
                <p className={`${titleFont(lang)} ${TITLE_SIZE[size]} ${CLAMP[size]} leading-snug text-pure-white`}>
                  {article.title[lang]}
                </p>
                <p className="mt-1.5 font-sans text-[11px] text-pure-white/75 tabular-nums">
                  {formatArticleDate(article.date, lang)}
                  <span className="mx-1.5 opacity-60">·</span>
                  {article.readMinutes} {TR.journal.readMin[lang]}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default JournalMosaicGrid;
