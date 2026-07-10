import { useCallback, useEffect, useRef, useState } from 'react';
import AiRenderBadge from '@/components/AiRenderBadge';
import { useLanguage } from '@/contexts/LanguageContext';

// Every room render, walked in the order you'd actually move through a unit.
// Captions describe the VIEW DIRECTION, not the filename's camera position
// (room-view-in shows the outward view, room-view-out the interior — verified
// against the actual images).
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
    caption: { en: 'Looking out', th: 'มองภายนอก' },
    alt: {
      en: 'Inside a Nature Haven residence, looking out toward the balcony window',
      th: 'ภายในห้องพัก Nature Haven มองออกไปทางหน้าต่างและระเบียง',
    },
  },
  {
    src: '/assets/room-view-out.jpg',
    caption: { en: 'Looking in', th: 'มองภายใน' },
    alt: {
      en: 'The interior of a Nature Haven residence, seen from the balcony side',
      th: 'มุมมองภายในห้องพัก Nature Haven จากฝั่งระเบียง',
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
    caption: { en: 'Toward the balcony', th: 'สู่ระเบียง' },
    alt: {
      en: 'A Nature Haven residence opening toward its private balcony and ensuite bath',
      th: 'ห้องพัก Nature Haven ที่เปิดออกสู่ระเบียงและห้องน้ำในตัว',
    },
  },
];

const AUTO_MS = 4800;
const SWIPE_THRESHOLD = 40; // px of horizontal travel before a release counts as a swipe

// True infinite loop: clone the last slide before the first and the first after
// the last → track = [Llast, 0..N-1, Lfirst]. Real slides live at track
// positions 1..N. When a step lands on a clone, we let the slide animate there
// (seamless — the clone looks identical to the real slide it mirrors), then on
// transitionend snap WITHOUT animation to the matching real position. No
// backward "rewind" when wrapping past the end.
export default function RoomCarousel({ className = '' }: { className?: string }) {
  const { lang } = useLanguage();
  const count = SLIDES.length;
  const track = [SLIDES[count - 1], ...SLIDES, SLIDES[0]];

  const [pos, setPos] = useState(1); // track position; 1..count are the real slides
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const activeIndex = ((pos - 1) % count + count) % count;

  const next = useCallback(() => setPos((p) => p + 1), []);
  const prev = useCallback(() => setPos((p) => p - 1), []);
  const goTo = useCallback((realIdx: number) => setPos(realIdx + 1), []);

  // Auto-advance — restarts on every pos change (manual nav resets the clock);
  // holds while paused; skipped for reduced-motion (dots + swipe still work).
  useEffect(() => {
    if (paused) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setPos((p) => p + 1), AUTO_MS);
    return () => window.clearInterval(id);
  }, [paused, pos]);

  // Landed on a clone → jump to the real twin with animation off.
  const onTransitionEnd = (e: React.TransitionEvent) => {
    if (e.propertyName !== 'transform') return;
    if (pos === count + 1) {
      setAnimate(false);
      setPos(1);
    } else if (pos === 0) {
      setAnimate(false);
      setPos(count);
    }
  };

  // Re-enable the transition the frame after a snap (double rAF so the browser
  // commits the no-transition jump before transitions come back).
  useEffect(() => {
    if (animate) return;
    const r = requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
    return () => cancelAnimationFrame(r);
  }, [animate]);

  // Loose swipe — decide on release, only when horizontal travel dominates, so
  // it never fights the page's vertical scroll (touch-action:pan-y).
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
      else prev();
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
      <div
        className="flex h-full"
        style={{
          transform: `translateX(-${pos * 100}%)`,
          transition: animate ? 'transform 700ms cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
        }}
        onTransitionEnd={onTransitionEnd}
      >
        {track.map((s, i) => (
          <div
            key={i}
            className="relative h-full w-full flex-none"
            role="group"
            aria-roledescription="slide"
            aria-hidden={i !== pos}
          >
            <img
              src={s.src}
              alt={s.alt[lang]}
              loading={i === 1 ? 'eager' : 'lazy'}
              draggable={false}
              className="h-full w-full object-contain select-none"
            />
          </div>
        ))}
      </div>

      {/* Room label — understated pill, top-left, clear of the badge and dots. */}
      <div
        key={activeIndex}
        className="pointer-events-none absolute top-3 left-3 rounded-full bg-black/50 px-2.5 py-1 font-sans text-[10px] uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm nh-caption-fade"
        aria-hidden="true"
      >
        {SLIDES[activeIndex].caption[lang]}
      </div>

      <AiRenderBadge className="absolute bottom-3 right-3 z-10" />

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => goTo(i)}
            aria-label={lang === 'th' ? `ไปภาพที่ ${i + 1}` : `Go to render ${i + 1}`}
            aria-current={i === activeIndex}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/55 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
