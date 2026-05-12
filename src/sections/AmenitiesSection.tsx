import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import PrimaryButton from '@/components/PrimaryButton';
import {
  CarIcon,
  LeafIcon,
  WashingIcon,
  SparkleIcon,
  SnowflakeIcon,
} from '@/components/icons';

gsap.registerPlugin(ScrollTrigger);

const AMENITIES = [
  {
    num: '01',
    Icon: CarIcon,
    label: 'Parking',
    desc: 'One dedicated bay per unit — no searching, no waiting.',
  },
  {
    num: '02',
    Icon: LeafIcon,
    label: 'Pocket Garden',
    desc: 'A communal garden to slow down in. Green, quiet, yours.',
  },
  {
    num: '03',
    Icon: WashingIcon,
    label: 'Laundry & Drying',
    desc: 'On-site facility, clean and always available.',
  },
  {
    num: '04',
    Icon: SparkleIcon,
    label: 'Cleaning Service',
    desc: 'Common areas professionally maintained every six months.',
  },
  {
    num: '05',
    Icon: SnowflakeIcon,
    label: 'A/C Maintenance',
    desc: 'Serviced annually — no extra cost, no surprises.',
  },
];

const AmenitiesSection: React.FC = () => {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const trackRef    = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track || !sectionRef.current) return;

      // Use the section's actual layout width (accounts for scrollbar, not window.innerWidth)
      const getDistance = () =>
        track.scrollWidth - (sectionRef.current?.offsetWidth ?? window.innerWidth);
      // Extra scroll pixels held at the end so the CTA card has time to be read
      // 1.5 × vh matches RoomJourney's VH_PER_SCENE = 150vh dwell per scene
      const getDwell = () => window.innerHeight * 1.5;

      const cards = gsap.utils.toArray<HTMLElement>('.am-card');
      gsap.set(cards, { opacity: 0, y: 18 });

      const hTween = gsap.to(track, {
        x: () => -(getDistance() + getDwell()),
        ease: 'none',
        // Clamp so the track never moves past its true end — the extra scroll
        // is pure dwell at the final state, not additional translation.
        modifiers: {
          x: (x: number) => Math.max(-getDistance(), x),
        },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${getDistance() + getDwell()}`,
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (st) => {
            if (progressRef.current) {
              // Progress bar fills to 100% when horizontal scroll is complete,
              // then holds at 100% during the dwell period.
              const d = getDistance();
              const fill = Math.min(1, (st.progress * (d + getDwell())) / d);
              gsap.set(progressRef.current, { scaleX: fill });
            }
          },
        },
      });

      // Per-card entrance: each card fades in as its left edge enters the viewport
      // (initially-visible cards all trigger at containerProgress=0 → staggered entrance on pin)
      cards.forEach((card) => {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            containerAnimation: hTween,
            start: 'left right',
            toggleActions: 'play none none none',
          },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="amenities"
      className="overflow-hidden relative"
      style={{ background: 'var(--sec-bg, rgba(255,255,255,0.55))' }}
    >
      {/* Horizontal track — wider than viewport, scrolls left */}
      <div
        ref={trackRef}
        className="flex items-stretch"
        style={{ height: '100vh', willChange: 'transform' }}
      >
        {/* ── Intro card ─────────────────────────────────── */}
        <div
          className="flex-shrink-0 flex flex-col justify-between p-10 md:p-16"
          style={{ width: 'clamp(300px, 38vw, 520px)' }}
        >
          <p
            className="font-sans text-[10px] uppercase tracking-[0.22em]"
            style={{ color: 'var(--sec-text-60)' }}
          >
            Amenities
          </p>

          <div>
            <h2
              className="font-serif leading-[1.05]"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                color: 'var(--sec-text)',
              }}
            >
              Everything in place,<br />
              before you arrive.
            </h2>
            <p
              className="font-sans font-light mt-5 leading-relaxed"
              style={{
                fontSize: '0.9375rem',
                color: 'var(--sec-text-70)',
                maxWidth: '340px',
              }}
            >
              Every item below is included in your monthly rate — nothing hidden, nothing extra.
            </p>
          </div>

          {/* Scroll hint */}
          <div className="flex items-center gap-3" style={{ color: 'var(--sec-text-55)' }}>
            <span className="font-sans text-[10px] uppercase tracking-[0.2em]">Scroll</span>
            <svg width="28" height="10" viewBox="0 0 28 10" fill="none" aria-hidden="true">
              <path d="M1 5h26M22 1l5 4-5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* ── Thin divider ───────────────────────────────── */}
        <div
          className="flex-shrink-0 self-stretch"
          style={{ width: '1px', background: 'var(--sec-border)', margin: '2.5rem 0' }}
        />

        {/* ── Amenity cards ─────────────────────────────── */}
        {AMENITIES.map(({ num, Icon, label, desc }) => (
          <React.Fragment key={label}>
            <div
              className="am-card flex-shrink-0 flex flex-col justify-between px-10 py-12 md:px-14 md:py-16 relative"
              style={{ width: 'clamp(260px, 28vw, 380px)' }}
            >
              {/* Faint background number */}
              <span
                className="absolute bottom-10 right-8 font-serif select-none pointer-events-none"
                style={{
                  fontSize: 'clamp(5rem, 12vw, 9rem)',
                  lineHeight: 1,
                  color: 'var(--sec-text)',
                  opacity: 0.045,
                }}
                aria-hidden="true"
              >
                {num}
              </span>

              {/* Top: number + icon */}
              <div className="flex flex-col gap-6">
                <span
                  className="font-sans text-[10px] uppercase tracking-[0.2em]"
                  style={{ color: 'var(--sec-text-55)' }}
                >
                  {num}
                </span>
                <Icon size={22} className="text-sage-green opacity-80" />
              </div>

              {/* Bottom: name + desc */}
              <div>
                <div
                  className="w-8 h-px mb-6"
                  style={{ background: 'var(--sec-border)' }}
                />
                <h3
                  className="font-serif leading-tight mb-3"
                  style={{
                    fontSize: 'clamp(1.5rem, 2.8vw, 2.25rem)',
                    color: 'var(--sec-text)',
                  }}
                >
                  {label}
                </h3>
                <p
                  className="font-sans font-light leading-relaxed"
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--sec-text-70)',
                    maxWidth: '240px',
                  }}
                >
                  {desc}
                </p>
              </div>
            </div>

            {/* Inter-card divider */}
            <div
              className="flex-shrink-0 self-stretch"
              style={{ width: '1px', background: 'var(--sec-border)', margin: '2.5rem 0' }}
            />
          </React.Fragment>
        ))}

        {/* ── CTA card ───────────────────────────────────── */}
        <div
          className="flex-shrink-0 flex flex-col justify-center px-12 md:px-16"
          style={{ width: 'clamp(280px, 32vw, 440px)' }}
        >
          <p
            className="font-sans text-[10px] uppercase tracking-[0.22em] mb-6"
            style={{ color: 'var(--sec-text-55)' }}
          >
            All included
          </p>
          <p
            className="font-serif leading-snug mb-8"
            style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              color: 'var(--sec-text)',
            }}
          >
            Ready when<br />you are.
          </p>
          <p
            className="font-sans font-light leading-relaxed mb-10"
            style={{
              fontSize: '0.9375rem',
              color: 'var(--sec-text-70)',
              maxWidth: '300px',
            }}
          >
            Reserve your unit and move in knowing every detail has already been handled.
          </p>
          <PrimaryButton href="#contact">Reserve a Unit</PrimaryButton>
        </div>
      </div>

      {/* Horizontal progress bar — bottom edge of the pinned frame */}
      <div
        className="absolute bottom-0 left-0 w-full pointer-events-none"
        style={{ height: '1px', background: 'var(--sec-border)' }}
        aria-hidden="true"
      >
        <div
          ref={progressRef}
          className="h-full"
          style={{
            background: 'var(--sec-text-55)',
            transformOrigin: 'left center',
            transform: 'scaleX(0)',
          }}
        />
      </div>
    </section>
  );
};

export default AmenitiesSection;
