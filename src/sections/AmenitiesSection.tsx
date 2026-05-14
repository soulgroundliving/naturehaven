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
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const sectionRef  = useRef<HTMLDivElement>(null);
  const trackRef    = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track   = trackRef.current;
      const section = sectionRef.current;
      const wrapper = wrapperRef.current;
      if (!track || !section || !wrapper) return;
      // Skip scroll-hijacking for reduced-motion users and on mobile —
      // mobile shows a vertical stack instead (no scroll-driven translate).
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (window.matchMedia('(max-width: 767px)').matches) return;

      const getDistance = () => track.scrollWidth - section.offsetWidth;
      // Extra scroll pixels held at end so CTA card has time to be read
      const getDwell    = () => window.innerHeight * 1.5;

      // Set wrapper height to create the scroll space (sticky section stays 100vh)
      const setWrapperHeight = () => {
        wrapper.style.height = `${window.innerHeight + getDistance() + getDwell()}px`;
      };
      setWrapperHeight();

      const setX        = gsap.quickSetter(track, 'x', 'px') as (v: number) => void;
      const setProgress = progressRef.current
        ? gsap.quickSetter(progressRef.current, 'scaleX') as (v: number) => void
        : null;

      // No pin:true — sticky CSS handles visual pinning, avoiding Lenis conflicts
      ScrollTrigger.create({
        trigger: wrapper,
        start: 'top top',
        end: () => `+=${getDistance() + getDwell()}`,
        invalidateOnRefresh: true,
        onRefresh: setWrapperHeight,
        onUpdate: (st) => {
          const d     = getDistance();
          const total = d + getDwell();
          const hp    = Math.min(1, (st.progress * total) / d);
          setX(-d * hp);
          if (setProgress) setProgress(hp);
        },
      });
    },
    { scope: wrapperRef }
  );

  return (
    <div ref={wrapperRef}>
    <section
      ref={sectionRef}
      id="amenities"
      className="overflow-hidden relative"
      style={{ background: 'var(--sec-bg, rgba(255,255,255,0.55))', position: 'sticky', top: 0 }}
    >
      {/* Horizontal track — desktop: wider than viewport, GSAP-scrolled left.
           Mobile: flex-col vertical stack via CSS (am-track media query). */}
      <div
        ref={trackRef}
        className="am-track flex items-stretch md:h-[100dvh]"
        style={{ willChange: 'transform' }}
      >
        {/* ── Intro card ─────────────────────────────────── */}
        <div
          className="am-intro flex-shrink-0 flex flex-col justify-between p-8 md:p-10 lg:p-16"
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

          {/* Scroll hint — desktop only (mobile is a vertical stack, no horizontal scroll) */}
          <div className="hidden md:flex items-center gap-3" style={{ color: 'var(--sec-text-55)' }}>
            <span className="font-sans text-[10px] uppercase tracking-[0.2em]">Scroll</span>
            <svg width="28" height="10" viewBox="0 0 28 10" fill="none" aria-hidden="true">
              <path d="M1 5h26M22 1l5 4-5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* ── Thin divider ───────────────────────────────── */}
        <div
          className="am-divider flex-shrink-0 self-stretch"
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
              className="am-divider flex-shrink-0 self-stretch"
              style={{ width: '1px', background: 'var(--sec-border)', margin: '2.5rem 0' }}
            />
          </React.Fragment>
        ))}

        {/* ── CTA card ───────────────────────────────────── */}
        <div
          className="am-cta flex-shrink-0 flex flex-col justify-center px-8 py-10 md:px-12 lg:px-16"
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

      {/* Horizontal progress bar — desktop only */}
      <div
        className="am-progress absolute bottom-0 left-0 w-full pointer-events-none"
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
    </div>
  );
};

export default AmenitiesSection;
