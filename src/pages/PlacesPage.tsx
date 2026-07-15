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

interface Place {
  name: string; area?: string; dist?: string; hours?: string; price?: string;
  tel?: string; mapUrl?: string; note?: string; tags?: string[]; pinned?: boolean;
  road?: string; lastVerified?: string;
}
interface Category { key: string; label: string; order: number; places: Place[] }
interface Feed { categories: Category[]; count: number; generatedAt: string }

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
  map: { en: 'Open map', th: 'เปิดแผนที่' },
  recommended: { en: 'Top pick', th: 'แนะนำ' },
  source: {
    en: 'Our picks from around the neighbourhood · call ahead to confirm hours.',
    th: 'เราเลือกมาให้จากย่านนี้ · โทรเช็กเวลาเปิดก่อนไปนะคะ',
  },
};

const PlacesPage: React.FC = () => {
  const { lang } = useLanguage();
  const [feed, setFeed] = useState<Feed | null>(null);
  const [failed, setFailed] = useState(false);
  const [active, setActive] = useState('all');

  usePageMeta({
    title: lang === 'th' ? 'ไปไหนดี · ย่านสายไหม — Nature Haven' : 'Neighbourhood Guide — Nature Haven',
    description: COPY.intro[lang],
    canonical: `${PROPERTY.url}/places`,
  });

  useEffect(() => {
    const ac = new AbortController();
    fetch(PLACES_API, { signal: ac.signal })
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then((d: Feed) => setFeed(d))
      .catch((e: unknown) => { if ((e as Error).name !== 'AbortError') setFailed(true); });
    return () => ac.abort();
  }, []);

  const categories = feed?.categories ?? [];
  const visible = useMemo(() => {
    const list = active === 'all'
      ? categories.flatMap((c) => c.places)
      : (categories.find((c) => c.key === active)?.places ?? []);
    return [...list].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  }, [categories, active]);

  const loading = !feed && !failed;
  const isEmpty = failed || (feed != null && feed.count === 0);

  return (
    <JournalShell>
      <section className="frosted-page backdrop-blur-xl">
        <div className="container-main py-14 md:py-20">
          <p className="section-label mb-4">{COPY.label[lang]}</p>
          <h1
            className="font-sans font-medium sec-text text-3xl leading-snug md:text-4xl lg:text-5xl max-w-3xl"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            {COPY.headline[lang]}
          </h1>
          <p className="mt-5 max-w-xl font-sans text-[15px] font-light leading-relaxed sec-text-70">{COPY.intro[lang]}</p>

          {categories.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              <FilterChip label={COPY.all[lang]} active={active === 'all'} onClick={() => setActive('all')} />
              {categories.map((c) => (
                <FilterChip key={c.key} label={c.label} active={active === c.key} onClick={() => setActive(c.key)} />
              ))}
            </div>
          )}

          {loading && <p className="mt-12 font-sans text-sm sec-text-60">{COPY.loading[lang]}</p>}
          {isEmpty && <p className="mt-12 font-sans text-sm sec-text-60">{COPY.empty[lang]}</p>}

          {!loading && !isEmpty && (
            <>
              <div className="mt-10 grid grid-cols-1 gap-5 md:mt-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {visible.map((p, i) => <PlaceCard key={`${p.name}-${i}`} place={p} lang={lang} />)}
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
    onClick={onClick}
    className={`rounded-full border px-4 py-1.5 font-sans text-xs transition-colors duration-300 ${
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
          className="mt-4 inline-block flex-none self-start rounded-full bg-sage-green px-5 py-2 font-sans text-[11px] uppercase tracking-[0.1em] text-pure-white transition-opacity duration-300 hover:opacity-85"
        >
          {COPY.map[lang]}
        </a>
      )}
    </article>
  );
};

const Row: React.FC<{ icon: string; v: string }> = ({ icon, v }) => (
  <div className="flex items-start gap-2"><span className="flex-none">{icon}</span><span>{v}</span></div>
);

export default PlacesPage;
