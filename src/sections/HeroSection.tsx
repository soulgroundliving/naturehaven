import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowDown } from '@/components/icons';
import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';
import { PROPERTY } from '@/data/propertyFacts';
import AiRenderBadge from '@/components/AiRenderBadge';

gsap.registerPlugin(ScrollTrigger);

const HEADLINE_LINES = ['Nature', 'Haven'];

// Fixed cream — NOT var(--text-on-bg). The old palette-adaptive text only
// worked because the hero had no photo behind it; now that a real room photo
// sits full-bleed under a permanent dark scrim, the text needs one reliable
// light tone regardless of time-of-day slot. See feedback_naturehaven_hero_text_colors.
const HERO_TEXT = '#F5F1EA';
const HERO_TEXT_SHADOW = '0 2px 24px rgba(20,16,10,0.45), 0 1px 4px rgba(20,16,10,0.35)';

const HeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const { lang } = useLanguage();
  const h = TR.hero;

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(['.hero-rule-top', '.hero-line-inner', '.hero-rule-bottom', '.hero-cta', scrollIndicatorRef.current], { clearProps: 'all' });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '.hero-rule-top',
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.65, ease: 'power2.inOut' },
        0.15
      )
      .from(
        '.hero-line-inner',
        { y: 110, duration: 1.0, stagger: 0.13, ease: 'power4.out' },
        0.7
      )
      .fromTo(
        '.hero-rule-bottom',
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.55, ease: 'power2.inOut' },
        1.45
      )
      .from('.hero-cta', { y: 14, opacity: 0, duration: 0.6 }, 1.8)
      .from(scrollIndicatorRef.current, { opacity: 0, duration: 0.5 }, 2.05);

      if (window.matchMedia('(max-width: 767px)').matches) return;

      gsap.to(contentRef.current, {
        y: -150,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '50% top',
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });

      gsap.to(scrollIndicatorRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: '10% top',
          end: '20% top',
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden"
    >
      {/* The room itself, full-bleed — real estate first, mood second. */}
      <img
        src="/assets/hero-room.jpg"
        alt="Inside a Nature Haven residence — bedroom with private balcony"
        className="absolute inset-0 h-full w-full object-cover"
        fetchPriority="high"
      />

      {/* Legibility scrim — fixed dark layers (NOT time-of-day tinted; a real
          photo re-colored per palette would look like a bug, not a feature).
          Stronger over the text zone and the bottom CTA/scroll-cue band,
          lighter at the corners so the room still reads as a room. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 75% 62% at 50% 38%, rgba(12,10,7,0.55) 0%, rgba(12,10,7,0.28) 55%, transparent 85%), ' +
            'linear-gradient(to top, rgba(12,10,7,0.55) 0%, rgba(12,10,7,0.18) 24%, transparent 46%), ' +
            'rgba(12,10,7,0.22)',
        }}
      />

      {/* Bottom-left, not bottom-right — FloatingLineChat sits fixed at
          bottom-right on every screen and would otherwise collide with it. */}
      <AiRenderBadge className="absolute bottom-4 left-4 z-20 md:bottom-5 md:left-5" />

      <div
        ref={contentRef}
        className="relative z-10 flex w-full max-w-[1300px] flex-col items-center px-4 pt-10 text-center md:px-8 lg:px-12"
        style={{ willChange: 'transform, opacity', color: HERO_TEXT }}
      >
        <div className="hero-rule-top mb-6 h-px w-20 opacity-30" style={{ background: HERO_TEXT }} />

        <h1
          className="font-serif leading-[0.88] text-[13vw] tracking-[-0.01em] sm:text-[11vw] md:text-[9.5vw] lg:text-[8.5vw]"
          aria-label="Nature Haven"
          style={{ textShadow: HERO_TEXT_SHADOW }}
        >
          {HEADLINE_LINES.map((line, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="block"
              style={{ overflow: 'hidden', paddingBottom: '0.06em' }}
            >
              <span className="hero-line-inner block">{line}</span>
            </span>
          ))}
        </h1>

        <div className="hero-rule-bottom mb-6 mt-6 h-px w-[220px] opacity-25" style={{ background: HERO_TEXT }} />

        <p
          className="hero-cta mt-7 font-sans text-[11px] uppercase tracking-[0.16em] opacity-80"
          style={{ color: HERO_TEXT, textShadow: HERO_TEXT_SHADOW }}
        >
          {h.cta[lang]}
        </p>

        <a
          href={PROPERTY.lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hero-cta mt-6 inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-[var(--cta-bg,#3D5A4C)] px-9 py-4 font-sans text-xs uppercase tracking-[0.12em] text-pure-white shadow-lg transition-transform duration-200 hover:shadow-xl active:scale-[0.98]"
        >
          {TR.lookbook.ctaButton[lang]}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>

      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1"
        style={{ color: HERO_TEXT, textShadow: HERO_TEXT_SHADOW }}
      >
        <span className="font-sans text-[10px] uppercase tracking-[0.15em]">{h.scroll[lang]}</span>
        <div className="animate-bounce-gentle">
          <ArrowDown size={18} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
