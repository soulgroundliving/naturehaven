import React, { useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import JournalShell from '@/components/JournalShell';
import JournalCard, { titleFont } from '@/components/JournalCard';
import ShareRow from '@/components/ShareRow';
import usePageMeta, { useJsonLd } from '@/hooks/usePageMeta';
import { ARTICLES, formatArticleDate, getArticle } from '@/data/journal';
import { PROPERTY } from '@/data/propertyFacts';
import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';

const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { lang } = useLanguage();
  const article = getArticle(slug ?? '');
  const j = TR.journal;

  // Hooks must run unconditionally — fall back to neutral values when the
  // slug is unknown; the <Navigate> below then redirects before paint.
  const canonical = `${PROPERTY.url}/journal/${slug ?? ''}`;
  usePageMeta({
    title: article ? `${article.title[lang]} — The Haven Journal` : 'The Haven Journal',
    description: article ? article.excerpt[lang] : '',
    canonical,
    ogImage: article ? `${PROPERTY.url}${article.hero}` : undefined,
    ogType: 'article',
    publishedTime: article ? `${article.date}T00:00:00+07:00` : undefined,
    section: article ? article.category.en : undefined,
  });

  const jsonLd = useMemo(
    () =>
      article
        ? {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.title.th,
            alternativeHeadline: article.title.en,
            description: article.excerpt.th,
            image: `${PROPERTY.url}${article.hero}`,
            datePublished: article.date,
            inLanguage: ['th-TH', 'en-US'],
            author: { '@type': 'Organization', name: PROPERTY.name },
            publisher: { '@type': 'Organization', name: PROPERTY.legalName, url: PROPERTY.url },
            mainEntityOfPage: canonical,
          }
        : null,
    [article, canonical]
  );
  useJsonLd('jsonld-article', jsonLd);

  if (!article) return <Navigate to="/journal" replace />;

  const related = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 2);

  return (
    <JournalShell>
      <article className="frosted-page backdrop-blur-xl">
        <div className="container-main py-12 md:py-16">
          <div className="mx-auto w-full max-w-[720px]">
            <Link
              to="/journal"
              className="font-sans text-xs uppercase tracking-[0.12em] sec-text-60 transition-opacity duration-300 hover:opacity-70"
            >
              ← {j.navLabel[lang]}
            </Link>

            <p className="mt-8 font-sans text-[11px] uppercase tracking-[0.2em] sec-text-60">
              {article.category[lang]}
            </p>
            <h1
              className={`${titleFont(lang)} mt-3 text-[26px] leading-[1.35] sec-text md:text-4xl md:leading-[1.3]`}
              style={{ textWrap: 'balance' } as React.CSSProperties}
            >
              {article.title[lang]}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1 border-b sec-border pb-6 font-sans text-[13px] sec-text-60 tabular-nums">
              <span>{formatArticleDate(article.date, lang)}</span>
              <span>
                {article.readMinutes} {j.readMin[lang]}
              </span>
              <span>{j.byLine[lang]}</span>
            </div>
            <div className="mt-5">
              <ShareRow url={canonical} title={article.title[lang]} />
            </div>

            <div className="mt-8 overflow-hidden rounded-xl">
              <img
                src={article.hero}
                alt={article.heroAlt[lang]}
                width={1440}
                height={810}
                loading="eager"
                fetchPriority="high"
                className="aspect-[16/9] w-full object-cover"
              />
            </div>

            <div className="mt-10">
              {article.blocks.map((block, i) => {
                if (block.type === 'h2') {
                  return (
                    <h2
                      key={i}
                      className="mb-4 mt-12 font-sans text-xl font-medium leading-snug sec-text md:text-[22px]"
                    >
                      {block.text[lang]}
                    </h2>
                  );
                }
                if (block.type === 'pull') {
                  return (
                    <blockquote
                      key={i}
                      className="my-10 border-l-2 border-sage-green py-1 pl-6 font-sans text-lg font-light italic leading-relaxed sec-text-80 md:text-xl"
                    >
                      {block.text[lang]}
                    </blockquote>
                  );
                }
                return (
                  <p
                    key={i}
                    className="mb-6 font-sans text-[16.5px] font-light leading-[1.95] sec-text-90 md:text-[17.5px]"
                  >
                    {block.text[lang]}
                  </p>
                );
              })}
            </div>

            <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-xl border sec-border bg-pure-white/50 p-7 backdrop-blur-sm md:flex-row md:items-center">
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

            <div className="mt-8 pt-8 border-t sec-border">
              <ShareRow url={canonical} title={article.title[lang]} />
            </div>
          </div>

          {related.length > 0 && (
            <div className="mx-auto mt-16 w-full max-w-[900px]">
              <p className="section-label mb-6">{j.related[lang]}</p>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {related.map((a) => (
                  <JournalCard key={a.slug} article={a} variant="row" />
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </JournalShell>
  );
};

export default ArticlePage;
