import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import JournalShell from '@/components/JournalShell';
import JournalCard, { titleFont } from '@/components/JournalCard';
import ShareRow from '@/components/ShareRow';
import usePageMeta, { useJsonLd } from '@/hooks/usePageMeta';
import { ARTICLES, formatArticleDate } from '@/data/journal';
import type { Article } from '@/data/journalTypes';
import { PROPERTY } from '@/data/propertyFacts';
import { useLanguage } from '@/contexts/LanguageContext';
import { collectHeadings, shouldShowToc } from '@/lib/journalBlocks';
import type { LangCode } from '@/lib/journalBlocks';
import { guidePages } from '@/lib/journalGuide';
import { TR } from '@/lib/translations';
import BlockBoundary from './BlockBoundary';
import JournalBlocks from './JournalBlocks';
import JournalToc from './JournalToc';
import OriginBadge from './OriginBadge';

// The reader carries the game with it (its "try it" page is the real thing), and the game is deliberately
// not in the article's own bundle - so nobody downloads either until the reader is asked for.
const GuideView = lazy(() => import('./guide/GuideView'));

// If the reader's chunk cannot be fetched (a deploy leaves an open tab pointing at a file that no longer exists) the
// article must stay: a visitor who followed a ?guide link is told, and can dismiss it.
function ReaderFailed({ lang, onClose }: { lang: LangCode; onClose: () => void }) {
  return (
    <div role="alert" className="fixed inset-x-4 bottom-4 z-[300] mx-auto flex max-w-[520px] items-center gap-3 rounded-xl border sec-border card-surface px-4 py-3 shadow-lg">
      <p className="flex-1 font-sans text-[13px] leading-snug sec-text">
        {lang === 'th' ? 'โหลดหน้าอ่านทีละหน้าไม่สำเร็จ โหลดหน้านี้ใหม่อีกครั้ง' : 'The page-by-page reader could not load. Reload the page to try again.'}
      </p>
      <button type="button" onClick={onClose} className="font-sans text-[13px] font-medium underline sec-text">
        {lang === 'th' ? 'ปิด' : 'Close'}
      </button>
    </div>
  );
}

interface ArticleViewProps {
  article: Article;
  /** Keep the page out of search results (dev sandbox). */
  noindex?: boolean;
}

// One article, fully presented. ArticlePage looks the article up by slug; the
// dev sandbox hands one in directly.
const ArticleView: React.FC<ArticleViewProps> = ({ article, noindex = false }) => {
  const { lang } = useLanguage();
  const j = TR.journal;

  const canonical = `${PROPERTY.url}/journal/${article.slug}`;
  usePageMeta({
    title: `${article.title[lang]} — The Haven Journal`,
    description: article.excerpt[lang],
    canonical,
    ogImage: `${PROPERTY.url}${article.hero}`,
    ogType: 'article',
    publishedTime: `${article.date}T00:00:00+07:00`,
    section: article.category.en,
    robots: noindex ? 'noindex, nofollow' : undefined,
  });

  const jsonLd = useMemo(
    () => ({
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
    }),
    [article, canonical],
  );
  useJsonLd('jsonld-article', jsonLd);

  // A shared /journal/<slug>#section link must open at that section. JournalShell
  // (and ScrollToTop) reset the scroll to the top on mount, and the browser's own
  // jump ran against the prerendered page that React then replaced — so scroll
  // again here. Effects run child-first, so this runs after JournalShell's reset.
  const { hash, search, pathname } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (!hash) return;
    let id = hash.slice(1);
    try {
      id = decodeURIComponent(id);
    } catch {
      /* a malformed escape: use the fragment as written */
    }
    document.getElementById(id)?.scrollIntoView();
  }, [hash]);

  // The page-by-page reader is open exactly when the URL says so (?guide) and the article has pages to show. It is
  // hidden while in review: only a visitor given the link sees it (not a security boundary - a URL parameter is
  // guessable - just kept off the article for everyone else until the owner has read it on a phone and asked for the
  // button that will open it for good). Because the URL is the whole state, Back closes a reader that a button
  // opened with a push, it cannot be left "open" on another article, and `?guide=0` is off.
  const guideOpen = useMemo(() => {
    const flag = new URLSearchParams(search).get('guide');
    return flag !== null && flag !== '0' && flag !== 'false' && guidePages(article).length > 0;
  }, [search, article]);
  const closeGuide = useCallback(() => {
    const params = new URLSearchParams(search);
    params.delete('guide');
    const rest = params.toString();
    navigate({ pathname, search: rest ? `?${rest}` : '', hash }, { replace: true });
  }, [navigate, pathname, search, hash]);

  // The reader is a dialog opened by a URL, not by a button, so nothing else will give focus back when it closes:
  // it falls to <body> and a screen-reader user loses their place. The heading is the top of the page they return to.
  const title = useRef<HTMLHeadingElement>(null);
  const wasOpen = useRef(false);
  useEffect(() => {
    if (wasOpen.current && !guideOpen) title.current?.focus({ preventScroll: true });
    wasOpen.current = guideOpen;
  }, [guideOpen]);

  const headings = useMemo(() => collectHeadings(article.blocks), [article.blocks]);
  const showToc = shouldShowToc(article.layout, headings);
  const showHero = article.layout?.hero !== 'none';
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
              ref={title}
              tabIndex={-1}
              className={`${titleFont(lang)} mt-3 text-[26px] leading-[1.35] outline-none sec-text md:text-4xl md:leading-[1.3]`}
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

            {showHero && (
              <div className="relative mt-8 overflow-hidden rounded-xl">
                <img
                  src={article.hero}
                  alt={article.heroAlt[lang]}
                  width={1440}
                  height={810}
                  loading="eager"
                  fetchPriority="high"
                  className="aspect-[16/9] w-full object-cover"
                />
                <OriginBadge origin={article.heroOrigin ?? 'photo'} className="absolute bottom-3 right-3" />
              </div>
            )}
          </div>

          {/* Body: each block picks its own column width (text 720px, media up to 1000px). */}
          <div className="mt-10">
            {showToc && <JournalToc headings={headings} />}
            <JournalBlocks blocks={article.blocks} />
          </div>

          <div className="mx-auto w-full max-w-[720px]">
            <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-xl border sec-border bg-pure-white/50 p-7 backdrop-blur-sm md:flex-row md:items-center">
              <div>
                <p className="font-sans text-[15px] font-medium sec-text">{j.ctaTitle[lang]}</p>
                <p className="mt-1 font-sans text-sm font-light sec-text-70">{j.ctaBody[lang]}</p>
              </div>
              <div className="flex flex-none items-center gap-5">
                <Link
                  to="/residence"
                  className="font-sans text-xs uppercase tracking-[0.1em] sec-text-70 underline decoration-sage-green/40 underline-offset-4 transition-colors duration-300 hover:text-sage-green"
                >
                  {TR.about.aboutButton[lang]}
                </Link>
                <a
                  href={PROPERTY.lineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-full bg-sage-green px-7 py-3 font-sans text-xs uppercase tracking-[0.1em] text-pure-white transition-opacity duration-300 hover:opacity-85"
                >
                  {j.ctaButton[lang]}
                </a>
              </div>
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
      {guideOpen && (
        <BlockBoundary label="page-by-page reader" fallback={<ReaderFailed lang={lang} onClose={closeGuide} />}>
          <Suspense fallback={null}>
            <GuideView key={article.slug} article={article} lang={lang} onClose={closeGuide} />
          </Suspense>
        </BlockBoundary>
      )}
    </JournalShell>
  );
};

export default ArticleView;
