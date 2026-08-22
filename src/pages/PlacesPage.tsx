import React, { useEffect, useMemo, useState } from 'react';
import JournalShell from '@/components/JournalShell';
import usePageMeta from '@/hooks/usePageMeta';
import { PROPERTY } from '@/data/propertyFacts';
import { useLanguage } from '@/contexts/LanguageContext';

// Neighbourhood guide ("ไปไหนดี") — fetches the owner-curated ร้านแนะนำย่าน from the resident app's
// public /api/places feed (the SAME Firestore source the LINE bot reads → no data drift, and this
// site stays Firebase-free: just a fetch). Owner 2026-07-16, spec The_green_haven/tasks/strategy/28
// §1/§6. The endpoint is hardcoded (repo convention: static single-source consts, no env layer).
const PLACES_API = 'https://the-green-haven.vercel.app/api/places';
const FEED_TIMEOUT_MS = 10_000;

interface Place {
  name: string; area?: string; dist?: string; hours?: string; price?: string;
  tel?: string; mapUrl?: string; note?: string; tags?: string[]; pinned?: boolean;
  road?: string; lastVerified?: string;
}
interface Category { key: string; label: string; order: number; places: Place[] }
interface Feed { categories: Category[]; count: number; generatedAt: string }
const EMPTY_CATEGORIES: Category[] = [];

type Lang = 'en' | 'th';
const COPY = {
  label: { en: 'The Neighbourhood', th: 'ย่านของเรา' },
  headline: { en: 'Where to go around Nature Haven', th: 'ไปไหนดี · ร้านเด็ดย่านสายไหม' },
  intro: {
    en: 'A living guide to the cafés, restaurants, and everyday spots we love around Saimai — the same picks Green shares on LINE.',
    th: 'ไกด์ร้านรอบ ๆ เฮเวน — คาเฟ่ ร้านอาหาร และที่เด็ด ๆ ย่านสายไหมที่เราคัดมาให้ ชุดเดียวกับที่น้อง Green แนะนำในไลน์ค่ะ',
  },
  all: { en: 'All', th: 'ทั้งหมด' },
  loading: { en: 'Loading the guide…', th: 'กำลังโหลดไกด์ย่าน…' },
  empty: { en: 'The guide is being put together — check back soon.', th: 'กำลังรวบรวมร้านเด็ด ๆ อยู่นะคะ เร็ว ๆ นี้ค่ะ 🌿' },
  noResults: { en: 'There are no places in this category yet.', th: 'หมวดนี้ยังไม่มีร้านที่คัดมาแนะนำค่ะ' },
  error: { en: 'The guide is temporarily unavailable. Please try again.', th: 'ไกด์ย่านยังไม่พร้อมชั่วคราว ลองใหม่อีกครั้งนะคะ' },
  retry: { en: 'Try again', th: 'ลองใหม่' },
  map: { en: 'Open map', th: 'เปิดแผนที่' },
  call: { en: 'Call', th: 'โทร' },
  recommended: { en: 'Top pick', th: 'แนะนำ' },
  filterLabel: { en: 'Filter neighbourhood places', th: 'เลือกหมวดหมู่สถานที่ใกล้เคียง' },
  filterHint: { en: 'Swipe to browse categories', th: 'ปัดเพื่อดูหมวดหมู่ทั้งหมด' },
  resultCount: { en: 'places selected', th: 'สถานที่ที่คัดไว้' },
  source: {
    en: 'Our picks from around the neighbourhood · call ahead to confirm hours.',
    th: 'เราเลือกมาให้จากย่านนี้ · โทรเช็กเวลาเปิดก่อนไปนะคะ',
  },
};

const isRecord = (value: unknown): value is Record<string, unknown> => (
  typeof value === 'object' && value !== null
);

const textValue = (value: unknown): string | undefined => (
  typeof value === 'string' && value.trim() ? value.trim() : undefined
);

const safeHttpUrl = (value: unknown): string | undefined => {
  const text = textValue(value);
  if (!text) return undefined;
  try {
    const url = new URL(text);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : undefined;
  } catch {
    return undefined;
  }
};

const toPlace = (value: unknown): Place | null => {
  if (!isRecord(value)) return null;
  const name = textValue(value.name);
  if (!name) return null;
  const tags = Array.isArray(value.tags)
    ? value.tags.filter((tag): tag is string => typeof tag === 'string' && Boolean(tag.trim())).map(tag => tag.trim())
    : undefined;
  return {
    name,
    area: textValue(value.area),
    dist: textValue(value.dist),
    hours: textValue(value.hours),
    price: textValue(value.price),
    tel: textValue(value.tel),
    mapUrl: safeHttpUrl(value.mapUrl),
    note: textValue(value.note),
    tags: tags?.length ? tags : undefined,
    pinned: value.pinned === true ? true : undefined,
    road: textValue(value.road),
    lastVerified: textValue(value.lastVerified),
  };
};

const normalizeFeed = (value: unknown): Feed => {
  if (!isRecord(value) || !Array.isArray(value.categories)) {
    throw new Error('Unexpected places feed shape');
  }

  const categories = value.categories.flatMap((rawCategory, index): Category[] => {
    if (!isRecord(rawCategory) || typeof rawCategory.key !== 'string' || typeof rawCategory.label !== 'string') {
      return [];
    }
    const places = Array.isArray(rawCategory.places)
      ? rawCategory.places.flatMap((rawPlace) => {
        const place = toPlace(rawPlace);
        return place ? [place] : [];
      })
      : [];
    if (!places.length) return [];
    return [{
      key: rawCategory.key,
      label: rawCategory.label,
      order: typeof rawCategory.order === 'number' ? rawCategory.order : index,
      places,
    }];
  }).sort((a, b) => a.order - b.order);

  const count = categories.reduce((sum, category) => sum + category.places.length, 0);
  return {
    categories,
    count,
    generatedAt: textValue(value.generatedAt) ?? '',
  };
};

const PlacesPage: React.FC = () => {
  const { lang } = useLanguage();
  const [feed, setFeed] = useState<Feed | null>(null);
  const [failed, setFailed] = useState(false);
  const [active, setActive] = useState('all');
  const [retryKey, setRetryKey] = useState(0);

  usePageMeta({
    title: lang === 'th' ? 'ไปไหนดี · ย่านสายไหม — Nature Haven' : 'Neighbourhood Guide — Nature Haven',
    description: COPY.intro[lang],
    canonical: `${PROPERTY.url}/places`,
  });

  useEffect(() => {
    const ac = new AbortController();
    let disposed = false;
    const timeout = window.setTimeout(() => ac.abort(), FEED_TIMEOUT_MS);

    fetch(PLACES_API, { signal: ac.signal })
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json() as Promise<unknown>;
      })
      .then((value) => {
        if (disposed) return;
        setFeed(normalizeFeed(value));
        setFailed(false);
      })
      .catch(() => {
        if (!disposed) {
          setFeed(null);
          setFailed(true);
        }
      })
      .finally(() => window.clearTimeout(timeout));

    return () => {
      disposed = true;
      window.clearTimeout(timeout);
      ac.abort();
    };
  }, [retryKey]);

  const categories = feed?.categories ?? EMPTY_CATEGORIES;
  const visible = useMemo(() => {
    const list = active === 'all'
      ? categories.flatMap((category) => category.places)
      : (categories.find((category) => category.key === active)?.places ?? []);
    return [...list].sort((a, b) => Number(b.pinned) - Number(a.pinned));
  }, [categories, active]);

  const loading = !feed && !failed;
  const showFeedEmpty = feed !== null && !failed && feed.count === 0;
  const showFilterEmpty = feed !== null && !failed && feed.count > 0 && visible.length === 0;

  return (
    <JournalShell>
      <section className="frosted-page backdrop-blur-xl" aria-labelledby="places-heading">
        <div className="container-main py-8 md:py-20">
          <div className="max-w-3xl">
            <p className="section-label mb-3">{COPY.label[lang]}</p>
            <h1
              id="places-heading"
              className="font-sans font-medium sec-text text-[clamp(2.15rem,9vw,3.25rem)] leading-[1.08] tracking-[-0.025em] md:text-5xl lg:text-6xl"
              style={{ textWrap: 'balance' } as React.CSSProperties}
            >
              {COPY.headline[lang]}
            </h1>
            <p className="mt-4 max-w-2xl font-sans text-[15px] leading-7 font-light sec-text-70 md:mt-5 md:text-base">
              {COPY.intro[lang]}
            </p>
          </div>

          {categories.length > 0 && (
            <div
              className="places-filter-shell sticky top-16 z-20 -mx-4 mt-6 border-y sec-border px-4 py-3 backdrop-blur-xl md:static md:mx-0 md:mt-10 md:border-0 md:px-0 md:py-0"
              style={{ backgroundColor: 'var(--sec-bg)' }}
            >
              <div className="flex items-center justify-between gap-3 md:hidden">
                <span className="font-sans text-xs font-medium sec-text">{COPY.filterLabel[lang]}</span>
                <span className="font-sans text-[11px] sec-text-60" aria-live="polite">
                  {visible.length} {COPY.resultCount[lang]}
                </span>
              </div>
              <p className="sr-only md:not-sr-only md:mb-3 font-sans text-xs sec-text-60">{COPY.filterHint[lang]}</p>
              <div
                className="mt-2 flex snap-x snap-mandatory flex-nowrap gap-2 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mt-0 md:flex-wrap md:overflow-visible"
                role="group"
                aria-label={COPY.filterLabel[lang]}
                aria-controls="places-list"
              >
                <FilterChip label={COPY.all[lang]} active={active === 'all'} onClick={() => setActive('all')} />
                {categories.map((category) => (
                  <FilterChip
                    key={category.key}
                    label={category.label}
                    active={active === category.key}
                    onClick={() => setActive(category.key)}
                  />
                ))}
              </div>
            </div>
          )}

          {loading && <p className="mt-10 font-sans text-sm sec-text-60" role="status" aria-live="polite">{COPY.loading[lang]}</p>}

          {failed && (
            <div className="mt-10 flex flex-col items-start gap-3 rounded-2xl border sec-border bg-pure-white/10 p-5 sm:flex-row sm:items-center" role="alert">
              <p className="font-sans text-sm sec-text-70">{COPY.error[lang]}</p>
              <button
                type="button"
                onClick={() => { setFailed(false); setRetryKey((key) => key + 1); }}
                className="min-h-11 rounded-full border sec-border px-5 py-2 font-sans text-xs sec-text transition-colors hover:border-sage-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-green"
              >
                {COPY.retry[lang]}
              </button>
            </div>
          )}

          {showFeedEmpty && <p className="mt-10 font-sans text-sm sec-text-60" role="status">{COPY.empty[lang]}</p>}
          {showFilterEmpty && <p className="mt-10 font-sans text-sm sec-text-60" role="status">{COPY.noResults[lang]}</p>}

          {feed !== null && !failed && visible.length > 0 && (
            <>
              <div className="mb-3 mt-6 flex items-baseline justify-between gap-3 md:mb-0 md:mt-12" aria-live="polite">
                <p className="font-sans text-xs sec-text-60">{visible.length} {COPY.resultCount[lang]}</p>
                <p className="hidden font-sans text-xs sec-text-55 md:block">{COPY.filterHint[lang]}</p>
              </div>
              <div
                id="places-list"
                className="grid grid-cols-1 gap-3 sm:gap-4 md:mt-5 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6"
              >
                {visible.map((place, index) => <PlaceCard key={`${place.name}-${index}`} place={place} lang={lang} />)}
              </div>
              <p className="mt-8 font-sans text-xs leading-6 sec-text-55 md:mt-10">{COPY.source[lang]}</p>
            </>
          )}
        </div>
      </section>
    </JournalShell>
  );
};

const FilterChip: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button
    type="button"
    aria-pressed={active}
    onClick={onClick}
    className={`min-h-11 shrink-0 snap-start rounded-full border px-4 py-2 font-sans text-xs whitespace-nowrap transition-colors duration-200 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-green md:px-4 md:py-1.5 ${
      active ? 'border-sage-green bg-sage-green text-pure-white' : 'sec-border sec-text-70 hover:border-sage-green/60'
    }`}
  >
    {label}
  </button>
);

const PlaceCard: React.FC<{ place: Place; lang: Lang }> = ({ place, lang }) => {
  const loc = place.road || place.area;
  const telHref = place.tel?.replace(/[^\d+]/g, '');
  return (
    <article className="group relative flex min-w-0 flex-col rounded-2xl border sec-border bg-pure-white/10 p-4 backdrop-blur-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg md:rounded-xl md:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-sans text-[1.08rem] font-medium leading-snug sec-text md:text-lg">{place.name}</h2>
          {place.note && <p className="mt-1 line-clamp-2 font-sans text-[13px] leading-5 font-light sec-text-70">{place.note}</p>}
        </div>
        {place.pinned && (
          <span className="shrink-0 rounded-full bg-sage-green/15 px-2 py-1 font-sans text-[10px] uppercase tracking-[0.08em] text-sage-green">
            {COPY.recommended[lang]}
          </span>
        )}
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-y-2 font-sans text-[13px] leading-5 sec-text-70 sm:grid-cols-2 sm:gap-x-3">
        {loc && <Row icon="📍" label={lang === 'th' ? 'ย่าน' : 'Area'} v={loc} />}
        {place.dist && <Row icon="🚶" label={lang === 'th' ? 'ระยะทาง' : 'Distance'} v={place.dist} />}
        {place.hours && <Row icon="🕒" label={lang === 'th' ? 'เวลา' : 'Hours'} v={place.hours} />}
        {place.price && <Row icon="💵" label={lang === 'th' ? 'ราคา' : 'Price'} v={place.price} />}
      </dl>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        {place.mapUrl && (
          <a
            href={place.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${COPY.map[lang]} — ${place.name}`}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-sage-green px-4 py-2 font-sans text-[11px] uppercase tracking-[0.1em] text-pure-white transition-opacity duration-200 hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-green"
          >
            {COPY.map[lang]}
          </a>
        )}
        {place.tel && telHref && (
          <a
            href={`tel:${telHref}`}
            aria-label={`${COPY.call[lang]} — ${place.name}`}
            className="inline-flex min-h-11 items-center justify-center rounded-full border sec-border px-4 py-2 font-sans text-[11px] uppercase tracking-[0.1em] sec-text transition-colors duration-200 hover:border-sage-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-green"
          >
            {COPY.call[lang]}
          </a>
        )}
      </div>
    </article>
  );
};

const Row: React.FC<{ icon: string; label: string; v: string }> = ({ icon, label, v }) => (
  <div className="flex min-w-0 items-start gap-2">
    <span aria-hidden="true" className="flex-none">{icon}</span>
    <div className="min-w-0">
      <dt className="sr-only">{label}</dt>
      <dd className="truncate">{v}</dd>
    </div>
  </div>
);

export default PlacesPage;
