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
    th: 'ไกด์ร้านรอบ ๆ เฮเวน — คาเฟ่ ร้านอาหาร และที่เด็ด ๆ ย่านสายไหมที่เราคัดมาให้ (ชุดเดียวกับที่น้อง Green แนะนำในไลน์ค่ะ)',
  },
  all: { en: 'All', th: 'ทั้งหมด' },
  loading: { en: 'Loading the guide…', th: 'กำลังโหลดไกด์ย่าน…' },
  empty: { en: 'The guide is being put together — check back soon.', th: 'กำลังรวบรวมร้านเด็ด ๆ อยู่นะคะ เร็ว ๆ นี้ค่ะ 🌿' },
  noResults: { en: 'There are no places in this category yet.', th: 'หมวดนี้ยังไม่มีร้านที่คัดมาแนะนำค่ะ' },
  error: { en: 'The guide is temporarily unavailable. Please try again.', th: 'ไกด์ย่านยังไม่พร้อมชั่วคราว ลองใหม่อีกครั้งนะคะ' },
  retry: { en: 'Try again', th: 'ลองใหม่' },
  map: { en: 'Open map', th: 'เปิดแผนที่' },
  recommended: { en: 'Top pick', th: 'แนะนำ' },
  filterLabel: { en: 'Filter neighbourhood places', th: 'เลือกหมวดหมู่สถานที่ใกล้เคียง' },
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
        <div className="container-main py-14 md:py-20">
          <p className="section-label mb-4">{COPY.label[lang]}</p>
          <h1
            id="places-heading"
            className="font-sans font-medium sec-text text-3xl leading-snug md:text-4xl lg:text-5xl max-w-3xl"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            {COPY.headline[lang]}
          </h1>
          <p className="mt-5 max-w-xl font-sans text-[15px] font-light leading-relaxed sec-text-70">{COPY.intro[lang]}</p>

          {categories.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label={COPY.filterLabel[lang]}>
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
          )}

          {loading && <p className="mt-12 font-sans text-sm sec-text-60" role="status" aria-live="polite">{COPY.loading[lang]}</p>}

          {failed && (
            <div className="mt-12 flex flex-wrap items-center gap-4" role="alert">
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

          {showFeedEmpty && <p className="mt-12 font-sans text-sm sec-text-60" role="status">{COPY.empty[lang]}</p>}
          {showFilterEmpty && <p className="mt-12 font-sans text-sm sec-text-60" role="status">{COPY.noResults[lang]}</p>}

          {feed !== null && !failed && visible.length > 0 && (
            <>
              <div className="mt-10 grid grid-cols-1 gap-5 md:mt-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {visible.map((place, index) => <PlaceCard key={`${place.name}-${index}`} place={place} lang={lang} />)}
              </div>
              <p className="mt-10 font-sans text-xs sec-text-55">{COPY.source[lang]}</p>
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
    className={`min-h-11 rounded-full border px-4 py-1.5 font-sans text-xs transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-green ${
      active ? 'border-sage-green bg-sage-green text-pure-white' : 'sec-border sec-text-70 hover:border-sage-green/60'
    }`}
  >
    {label}
  </button>
);

const PlaceCard: React.FC<{ place: Place; lang: Lang }> = ({ place, lang }) => {
  const loc = place.road || place.area;
  return (
    <article className="group relative flex flex-col rounded-xl border sec-border bg-pure-white/50 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      {place.pinned && (
        <span className="absolute right-4 top-4 rounded-full bg-sage-green/10 px-2 py-0.5 font-sans text-[10px] uppercase tracking-[0.08em] text-sage-green">
          {COPY.recommended[lang]}
        </span>
      )}
      <h2 className="pr-14 font-sans text-lg font-medium leading-snug sec-text">{place.name}</h2>
      {place.note && <p className="mt-1 font-sans text-[13px] font-light sec-text-70">{place.note}</p>}
      <dl className="mt-3 space-y-1 font-sans text-[13px] sec-text-70">
        {loc && <Row icon="📍" v={loc} />}
        {place.dist && <Row icon="🚶" v={place.dist} />}
        {place.hours && <Row icon="🕒" v={place.hours} />}
        {place.price && <Row icon="💵" v={place.price} />}
        {place.tel && <Row icon="☎️" v={place.tel} />}
      </dl>
      {place.mapUrl && (
        <a
          href={place.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${COPY.map[lang]} — ${place.name}`}
          className="mt-4 inline-flex min-h-11 flex-none items-center self-start rounded-full bg-sage-green px-5 py-2 font-sans text-[11px] uppercase tracking-[0.1em] text-pure-white transition-opacity duration-300 hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-green"
        >
          {COPY.map[lang]}
        </a>
      )}
    </article>
  );
};

const Row: React.FC<{ icon: string; v: string }> = ({ icon, v }) => (
  <div className="flex items-start gap-2"><span aria-hidden="true" className="flex-none">{icon}</span><span>{v}</span></div>
);

export default PlacesPage;
