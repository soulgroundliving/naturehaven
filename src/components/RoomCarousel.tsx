import { useCallback, useEffect, useRef, useState } from 'react';
import AiRenderBadge from '@/components/AiRenderBadge';
import { useLanguage } from '@/contexts/LanguageContext';

// Every room render, walked in the order you'd actually move through a unit:
// approach → room → the view out → bath → balcony → the whole thing. Each is an
// AI visualization, so one AiRenderBadge covers the set. object-contain keeps
// every frame whole (portrait + landscape renders coexist) against the
// palette-reactive card-surface matte — same "gallery print" treatment used
// across the site, never a crop.
type Slide = {
  src: string;
  caption: { en: string; th: string };
  alt: { en: string; th: string };
};

const SLIDES: Slide[] = [
  {
    src: '/assets/corridor-approach.jpg',
    caption: { en: 'The approach', th: 'โถงทางเดิน' },
    alt: {
      en: 'Corridor approaching a Nature Haven residence',
      th: 'โถงทางเดินสู่ห้องพัก Nature Haven',
    },
  },
  {
    src: '/assets/room-view-in.jpg',
    caption: { en: 'The room', th: 'ห้องพัก' },
    alt: {
      en: 'Inside a Nature Haven residence, looking in',
      th: 'ภายในห้องพัก Nature Haven มองเข้า',
    },
  },
  {
    src: '/assets/room-view-out.jpg',
    caption: { en: 'Toward the balcony', th: 'สู่ระเบียง' },
    alt: {
      en: 'The room opening toward its private balcony',
      th: 'ห้องที่เปิดออกสู่ระเบียงส่วนตัว',
    },
  },
  {
    src: '/assets/bathroom-functional.jpg',
    caption: { en: 'The bath', th: 'ห้องน้ำ' },
    alt: {
      en: 'The ensuite bathroom of a Nature Haven residence',
      th: 'ห้องน้ำในตัวของห้องพัก Nature Haven',
    },
  },
  {
    src: '/assets/balcony-view.jpg',
    caption: { en: 'The balcony', th: 'ระเบียง' },
    alt: {
      en: 'The private balcony with its own utility sink',
      th: 'ระเบียงส่วนตัวพร้อมซิงก์อเนกประสงค์',
    },
  },
  {
    src: '/assets/unit-overview.jpg',
    caption: { en: 'The whole unit', th: 'ภาพรวมห้อง' },
    alt: {
      en: 'A Nature Haven residence, room to balcony to ensuite bath',
      th: 'ห้องพัก Nature Haven ตั้งแต่ห้องถึงระเบียงและห้องน้ำ',
    },
  },
];

const AUTO_MS = 4800;
const SWIPE_THRESHOLD = 40; // px of horizontal travel before a release counts as a swipe

export default function RoomCarousel({ className = '' }: { className?: string }) {
  const { lang } = useLanguage();
  const count = SLIDES.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);

  // Auto-advance — restarts on every index change (so manual nav resets the
  // clock) and holds while paused. Skipped entirely for reduced-motion users;
  // dots + swipe still drive it manually.
  useEffect(() => {
    if (paused) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(next, AUTO_MS);
    return () => window.clearInterval(id);
  }, [paused, next, index]);

  // Loose swipe — decide on release rather than following the finger, so the
  // gesture never fights the page's vertical scroll (no preventDefault, and we
  // only act when the horizontal travel dominates). touch-action:pan-y lets the
  // browser keep vertical panning.
  const start = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    start.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const s = start.current;
    start.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next();
      else go(index - 1);
    }
  };

  return (
    <div
      className={`relative overflow-hidden card-surface ${className}`}
      style={{ touchAction: 'pan-y' }}
      role="group"
      aria-roledescription="carousel"
      aria-label={lang === 'th' ? 'ภาพจำลองห้องพัก' : 'Residence renders'}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (start.current = null)}
    >
      {/* Track — one viewport-width slide each, translated by index. */}
      <div
        className="flex h-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {SLIDES.map((s, i) => (
          <div
            key={s.src}
            className="relative h-full w-full flex-none"
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${count}`}
            aria-hidden={i !== index}
          >
            <img
              src={s.src}
              alt={s.alt[lang]}
              loading={i === 0 ? 'eager' : 'lazy'}
              draggable={false}
              className="h-full w-full object-contain select-none"
            />
          </div>
        ))}
      </div>

      {/* Room label — understated pill, top-left, out of the way of the badge
          (bottom-right) and dots (bottom-centre). */}
      <div
        key={index}
        className="pointer-events-none absolute top-3 left-3 rounded-full bg-black/50 px-2.5 py-1 font-sans text-[10px] uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm nh-caption-fade"
        aria-hidden="true"
      >
        {SLIDES[index].caption[lang]}
      </div>

      <AiRenderBadge className="absolute bottom-3 right-3 z-10" />

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => go(i)}
            aria-label={
              lang === 'th' ? `ไปภาพที่ ${i + 1}` : `Go to render ${i + 1}`
            }
            aria-current={i === index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? 'w-5 bg-white' : 'w-1.5 bg-white/55 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
