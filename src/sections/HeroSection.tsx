import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowDown } from '@/components/icons';
import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';
import { PROPERTY } from '@/data/propertyFacts';
import VideoBackground from '@/components/VideoBackground';
import { isPrerender } from '@/lib/isPrerender';

gsap.registerPlugin(ScrollTrigger);

const HEADLINE_LINES = ['Nature', 'Haven'];

const HeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const { lang } = useLanguage();
  const h = TR.hero;
  const labelWords = h.labelWords[lang];

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(['.hero-rule-top', '.hero-label-word', '.hero-line-inner', '.hero-rule-bottom', '.hero-subtitle', '.hero-cta', scrollIndicatorRef.current], { clearProps: 'all' });
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
        '.hero-label-word',
        { y: '115%', duration: 0.65, stagger: 0.055, ease: 'power3.out' },
        0.45
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
      .from('.hero-subtitle', { y: 18, opacity: 0, duration: 0.7 }, 1.6)
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
      className="relative w-full min-h-[100dvh] overflow-hidden flex flex-col"
    >
      {/* Text zone — sits on the clean, palette-adaptive page background (no
          full-bleed footage behind the copy), so the wordmark, subtitle and
          pricing stay legible in every time-of-day slot. */}
      <div
        ref={contentRef}
        className="relative z-10 flex-1 flex flex-col items-center justify-center text-center w-full max-w-[1300px] mx-auto px-4 md:px-8 lg:px-12 pt-24 pb-4"
        style={{ willChange: 'transform, opacity', color: 'var(--text-on-bg, #2B2B2B)' }}
      >
        <div className="hero-rule-top w-20 h-px mb-6 opacity-25" style={{ background: 'var(--text-on-bg, #2B2B2B)' }} />

        <p
          className="font-sans text-[10px] md:text-xs uppercase tracking-[0.22em] mb-7 flex flex-wrap justify-center gap-x-[0.55em] gap-y-1"
          style={{ color: 'var(--text-on-bg, #2B2B2B)' }}
        >
          {labelWords.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden" style={{ lineHeight: 1.3 }}>
              <span className="hero-label-word inline-block">{word}</span>
            </span>
          ))}
        </p>

        <h1
          className="font-serif leading-[0.88] text-[13vw] sm:text-[11vw] md:text-[9.5vw] lg:text-[8.5vw] tracking-[-0.01em]"
          aria-label="Nature Haven"
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

        <div
          className="hero-rule-bottom w-[220px] h-px mt-6 mb-6 opacity-20"
          style={{ background: 'var(--text-on-bg, #2B2B2B)' }}
        />

        <p
          className="hero-subtitle font-sans text-[15px] md:text-lg font-light max-w-[520px] leading-relaxed"
          style={{ color: 'var(--text-on-bg, #2B2B2B)' }}
        >
          {h.subtitle[lang]}
        </p>

        <p
          className="hero-cta font-sans text-[11px] uppercase tracking-[0.16em] mt-6 opacity-55"
          style={{ color: 'var(--text-on-bg, #2B2B2B)' }}
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

      {/* Meadow — now its own framed block instead of a full-bleed image
          behind the copy. Poster still during prerender (crawler snapshot),
          the ambient video mounts client-side. */}
      <div className="relative z-10 w-full px-4 md:px-8 lg:px-12 pb-14 md:pb-16">
        <div className="relative mx-auto w-full max-w-[1080px] h-[22vh] md:h-[30vh] min-h-[130px] overflow-hidden rounded-2xl shadow-[0_18px_44px_rgba(43,43,43,0.16)]">
          {isPrerender() ? (
            <img
              src="/assets/hero-video-poster.jpg"
              alt="The Nature Haven meadow — Sai Mai, Bangkok"
              className="absolute inset-0 w-full h-full object-cover"
              fetchPriority="high"
            />
          ) : (
            <VideoBackground />
          )}
        </div>
      </div>

      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1"
        style={{ color: 'var(--text-on-bg, #2B2B2B)' }}
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
