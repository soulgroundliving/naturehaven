import React, { useState } from 'react';

// Click-to-select room gallery (replaced the scroll-hijack scrollytelling
// 2026-07-10 — owner: "ไม่เอาเป็นการเลื่อน มีปุ่มกดให้เลือกดูภาพดีกว่า").
// No GSAP, no sticky pin, no ScrollTrigger — pure React state + CSS crossfade.
const SCENES = [
  {
    tag: '01 / Bedroom',
    headline: 'The Morning\nBegins Here',
    body: '25 m² shaped around rest and focus — a 5-ft bed, full blackout curtains, and a desk that makes staying in feel intentional.',
    src: '/assets/room-view-in.jpg',
    alt: 'Bedroom interior looking toward the private balcony — 25 sq.m.',
  },
  {
    tag: '02 / Bathroom',
    headline: 'Quiet\nRituals',
    body: 'Soft tile and clean light — a space made for the small daily rituals that shape the rhythm of home.',
    src: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1400&fit=crop&auto=format&q=80',
    alt: 'Minimal bathroom with natural light',
  },
  {
    tag: '03 / Kitchen',
    headline: 'Separate.\nFully Yours.',
    body: 'A proper kitchen — not a kitchenette. Refrigerator, microwave, ventilation. Room to cook, room to think.',
    src: 'https://images.unsplash.com/photo-1757439402103-fc35542f96f8?w=1400&fit=crop&auto=format&q=80',
    alt: 'Separate kitchen with minimal fittings',
  },
  {
    tag: '04 / Balcony',
    headline: 'Where the\nDay Ends',
    body: 'Step outside to green — a private balcony overlooking the garden. The place where quiet living becomes visible.',
    src: 'https://images.unsplash.com/photo-1725399103001-200ce2bb5350?w=1400&fit=crop&auto=format&q=80',
    alt: 'Private balcony overlooking the garden',
  },
] as const;

const RoomJourneySection: React.FC = () => {
  const [active, setActive] = useState(0);
  const scene = SCENES[active];

  return (
    <section aria-label="The room" className="section-padding">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-8 lg:gap-14 items-center">

          {/* Image frame — the 4 room photos are stacked and crossfaded on click */}
          <div
            className="relative w-full overflow-hidden rounded-2xl shadow-[0_18px_44px_rgba(43,43,43,0.16)]"
            style={{ height: 'clamp(300px, 54vh, 620px)' }}
          >
            {SCENES.map((s, i) => (
              <img
                key={s.tag}
                src={s.src}
                alt={s.alt}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out"
                style={{ opacity: i === active ? 1 : 0 }}
                loading={i === 0 ? 'eager' : 'lazy'}
                aria-hidden={i !== active}
              />
            ))}
            {/* Soft top/bottom scrims so the tag stays legible over any frame */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(0,0,0,0.30) 0%, transparent 26%, transparent 72%, rgba(0,0,0,0.18) 100%)',
              }}
            />
            <span className="absolute top-5 left-5 md:top-6 md:left-7 font-sans text-[10px] uppercase tracking-[0.22em] text-white/85">
              {scene.tag}
            </span>
            <span className="absolute top-5 right-5 md:top-6 md:right-7 font-sans text-[9px] uppercase tracking-[0.22em] text-white/45 select-none">
              The Room
            </span>
          </div>

          {/* Copy + room selector buttons */}
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.22em] mb-5" style={{ color: 'var(--sec-text-60)' }}>
              Explore the room
            </p>

            <div key={active} className="animate-in fade-in slide-in-from-bottom-2 duration-500 mb-8 min-h-[128px]">
              <h2
                className="font-serif leading-[1.08] mb-3"
                style={{ fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', color: 'var(--sec-text)', whiteSpace: 'pre-line' }}
              >
                {scene.headline}
              </h2>
              <p
                className="font-sans font-light leading-relaxed text-sm md:text-[15px] max-w-[420px]"
                style={{ color: 'var(--sec-text-70)' }}
              >
                {scene.body}
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              {SCENES.map((s, i) => {
                const parts = s.tag.split(' / ');
                const num = parts[0];
                const name = parts[1] ?? s.tag;
                const isActive = i === active;
                return (
                  <button
                    key={s.tag}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-pressed={isActive}
                    className="group flex items-center gap-4 px-4 py-3 rounded-xl border text-left transition-all duration-300 hover:-translate-y-px"
                    style={{
                      background: isActive ? 'var(--cta-bg, #3D5A4C)' : 'var(--card-bg, rgba(255,255,255,0.55))',
                      borderColor: isActive ? 'transparent' : 'var(--sec-border)',
                    }}
                  >
                    <span
                      className="font-sans text-[11px] tracking-[0.15em] tabular-nums"
                      style={{ color: isActive ? 'rgba(255,255,255,0.65)' : 'var(--sec-text-55)' }}
                    >
                      {num}
                    </span>
                    <span
                      className="font-sans text-sm font-medium"
                      style={{ color: isActive ? '#FFFFFF' : 'var(--sec-text-90)' }}
                    >
                      {name}
                    </span>
                    <svg
                      className="ml-auto transition-all duration-300"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      style={{
                        color: isActive ? '#FFFFFF' : 'var(--sec-text-55)',
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? 'translateX(0)' : 'translateX(-6px)',
                      }}
                      aria-hidden="true"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default RoomJourneySection;
