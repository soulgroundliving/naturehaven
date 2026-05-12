import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const SCENES = [
  {
    tag: '01 / Bedroom',
    headline: 'The Morning\nBegins Here',
    body: '31.5 m² shaped around rest and focus — a 5-ft bed, full blackout curtains, and a desk that makes staying in feel intentional.',
    src: '/assets/room-3d-render.jpg',
    alt: 'Bedroom interior — 31.5 sq.m.',
  },
  {
    tag: '02 / Kitchen',
    headline: 'Separate.\nFully Yours.',
    body: 'A proper kitchen — not a kitchenette. Refrigerator, microwave, ventilation. Room to cook, room to think.',
    src: 'https://images.unsplash.com/photo-1757439402103-fc35542f96f8?w=1400&fit=crop&auto=format&q=80',
    alt: 'Separate kitchen with minimal fittings',
  },
  {
    tag: '03 / Balcony',
    headline: 'Where the\nDay Ends',
    body: 'Step outside to green — a private balcony overlooking the garden. The place where quiet living becomes visible.',
    src: 'https://images.unsplash.com/photo-1725399103001-200ce2bb5350?w=1400&fit=crop&auto=format&q=80',
    alt: 'Private balcony overlooking the garden',
  },
] as const;

const N = SCENES.length;

const RoomJourneySection: React.FC = () => {
  const containerRef  = useRef<HTMLDivElement>(null);
  const frameRef      = useRef<HTMLDivElement>(null);
  const counterRef    = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current || !frameRef.current) return;

      const images = gsap.utils.toArray<HTMLElement>('.rj-img');
      const texts  = gsap.utils.toArray<HTMLElement>('.rj-text');
      const dots   = gsap.utils.toArray<HTMLElement>('.rj-dot');
      const tags   = gsap.utils.toArray<HTMLElement>('.rj-tag');
      const bar    = containerRef.current.querySelector<HTMLElement>('.rj-progress-bar');

      // Set initial states — only scene 0 visible
      gsap.set(images.slice(1), { opacity: 0 });
      gsap.set(texts.slice(1), { opacity: 0, y: 32 });
      gsap.set(dots.slice(1), { opacity: 0.25, scale: 0.8 });
      gsap.set(dots[0], { opacity: 1, scale: 1 });
      gsap.set(tags.slice(1), { opacity: 0 });

      let active = 0;

      const goTo = (next: number) => {
        if (next === active) return;
        const prev = active;
        active = next;

        // Image crossfade
        gsap.to(images[prev], { opacity: 0, duration: 0.75, ease: 'power2.inOut' });
        gsap.to(images[next], { opacity: 1, duration: 0.75, ease: 'power2.inOut' });

        // Text slide: prev fades out, then next snaps to full white and slides up (no opacity fade)
        gsap.to(texts[prev],  { opacity: 0, y: -24, duration: 0.35, ease: 'power2.in', overwrite: true });
        gsap.fromTo(
          texts[next],
          { opacity: 1, y: 22, immediateRender: false },
          { opacity: 1, y: 0, duration: 0.45, delay: 0.38, ease: 'power3.out', overwrite: true }
        );

        // Tags
        gsap.to(tags[prev],  { opacity: 0, duration: 0.25 });
        gsap.to(tags[next],  { opacity: 1, duration: 0.35, delay: 0.2 });

        // Dots
        dots.forEach((d, i) => {
          gsap.to(d, {
            opacity: i === next ? 1 : 0.25,
            scale: i === next ? 1 : 0.8,
            duration: 0.3,
          });
        });

        // Progress bar
        if (bar) {
          gsap.to(bar, {
            scaleY: (next + 1) / N,
            duration: 0.5,
            ease: 'power2.inOut',
          });
        }

        // Scene counter
        if (counterRef.current) {
          counterRef.current.textContent = `${next + 1} / ${N}`;
        }
      };

      // Pin the frame for the scroll journey
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${(N - 1) * 100}vh`,
        pin: frameRef.current,
        pinSpacing: false,
        anticipatePin: 1,
      });

      // Scene triggers
      for (let i = 1; i < N; i++) {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: `${((i) / N) * 100}% top`,
          onEnter:     () => goTo(i),
          onLeaveBack: () => goTo(i - 1),
        });
      }
    },
    { scope: containerRef }
  );

  return (
    // Container taller than viewport — provides scroll space
    <div
      ref={containerRef}
      style={{ height: `${N * 100}vh` }}
    >
      {/* Pinned frame — stays fixed during the scroll journey */}
      <div
        ref={frameRef}
        className="relative w-full overflow-hidden"
        style={{ height: '100vh' }}
        aria-label="Room journey — scroll to explore"
      >
        {/* Scene images (stacked, crossfade) */}
        {SCENES.map((scene, i) => (
          <img
            key={scene.tag}
            src={scene.src}
            alt={scene.alt}
            className={`rj-img absolute inset-0 w-full h-full object-cover ${i === 0 ? '' : 'opacity-0'}`}
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        ))}

        {/* Dark gradient — bottom for text legibility */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.28) 45%, rgba(0,0,0,0.08) 75%, transparent 100%)',
          }}
        />

        {/* Scene tags — top-left */}
        <div className="absolute top-8 left-8 md:top-12 md:left-14">
          {SCENES.map((scene, i) => (
            <span
              key={scene.tag}
              className={`rj-tag absolute font-sans text-[10px] uppercase tracking-[0.22em] text-white/60 ${i === 0 ? 'opacity-100' : 'opacity-0'}`}
              style={{ whiteSpace: 'nowrap' }}
              aria-hidden="true"
            >
              {scene.tag}
            </span>
          ))}
        </div>

        {/* "A Room" section label — top right */}
        <p
          className="absolute top-8 right-16 md:top-12 md:right-20 font-sans text-[9px] uppercase tracking-[0.22em] text-white/35 select-none"
          aria-hidden="true"
        >
          The Room
        </p>

        {/* Scene text blocks — bottom-left */}
        {/* width explicit — all children are absolute so parent collapses to h:0 intentionally */}
        <div className="absolute bottom-10 left-8 md:bottom-16 md:left-14 w-[460px] max-w-[calc(100vw-64px)]">
          {SCENES.map((scene, i) => (
            <div
              key={scene.tag}
              className={`rj-text absolute bottom-0 left-0 ${i === 0 ? '' : 'opacity-0'}`}
            >
              <h2
                className="font-serif text-white leading-[1.05] mb-4"
                style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', whiteSpace: 'pre-line' }}
              >
                {scene.headline}
              </h2>
              <p
                className="font-sans font-light text-white/70 leading-relaxed max-w-[380px]"
                style={{ fontSize: 'clamp(0.875rem, 1.1vw, 1rem)' }}
              >
                {scene.body}
              </p>
            </div>
          ))}
        </div>

        {/* Progress dots + bar — right edge */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
          {/* Thin track */}
          <div
            className="relative rounded-full overflow-hidden"
            style={{ width: '1px', height: `${N * 20}px`, background: 'rgba(255,255,255,0.15)' }}
          >
            <div
              className="rj-progress-bar absolute top-0 left-0 w-full rounded-full"
              style={{
                background: 'rgba(255,255,255,0.75)',
                height: '100%',
                transformOrigin: 'top center',
                transform: `scaleY(${1 / N})`,
              }}
            />
          </div>

          {/* Dots */}
          <div className="flex flex-col gap-2.5 mt-1">
            {SCENES.map((_, i) => (
              <div
                key={i}
                className={`rj-dot rounded-full ${i === 0 ? 'opacity-100 scale-100' : 'opacity-25 scale-[0.8]'}`}
                style={{
                  width: '6px',
                  height: '6px',
                  background: 'white',
                  transition: 'none', // GSAP handles this
                }}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>

        {/* Scroll hint + scene counter — bottom-right */}
        <div className="absolute bottom-10 right-8 md:bottom-16 md:right-14 flex flex-col items-end gap-2 select-none">
          <span ref={counterRef} className="font-sans text-[9px] uppercase tracking-[0.18em] text-white/60">
            1 / {N}
          </span>
          <div className="flex items-center gap-2">
            <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-white/60">
              Scroll
            </span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.60)" strokeWidth="1.5" aria-hidden="true">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomJourneySection;
