import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowDown } from '@/components/icons';
import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';

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
    { scope: sectionRef, dependencies: [lang] }
  );

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full min-h-[100dvh] overflow-hidden flex items-center justify-center"
    >
      <div
        ref={contentRef}
        className="relative z-10 text-center w-full max-w-[1300px] mx-auto px-4 md:px-8 lg:px-12 flex flex-col items-center"
        style={{ willChange: 'transform, opacity', color: 'var(--text-on-bg, #2B2B2B)' }}
      >
        <div className="hero-rule-top w-20 h-px mb-6 opacity-25" style={{ background: 'var(--text-on-bg, #2B2B2B)' }} />

        <p
          className="font-sans text-[10px] md:text-xs uppercase tracking-[0.22em] mb-8 flex flex-wrap justify-center gap-x-[0.55em] gap-y-1"
          style={{ color: 'var(--text-on-bg, #2B2B2B)', textShadow: 'var(--text-shadow-hero)' }}
        >
          {labelWords.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden" style={{ lineHeight: 1.3 }}>
              <span className="hero-label-word inline-block">{word}</span>
            </span>
          ))}
        </p>

        <h1
          className="font-serif leading-[0.88] text-[11vw] sm:text-[10.5vw] md:text-[10.5vw] lg:text-[10vw] tracking-[-0.01em]"
          aria-label="Nature Haven"
          style={{ textShadow: 'var(--text-shadow-hero)' }}
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
          className="hero-rule-bottom w-[260px] h-px mt-7 mb-8 opacity-20"
          style={{ background: 'var(--text-on-bg, #2B2B2B)' }}
        />

        <p
          className="hero-subtitle font-sans text-base md:text-lg font-light max-w-[520px] leading-relaxed"
          style={{ color: 'var(--text-on-bg, #2B2B2B)', textShadow: 'var(--text-shadow-hero)' }}
        >
          {h.subtitle[lang]}
        </p>

        <p className="hero-cta font-sans text-[11px] uppercase tracking-[0.18em] mt-7 text-white opacity-60">
          {h.cta[lang]}
        </p>
      </div>

      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white"
      >
        <span className="font-sans text-xs uppercase tracking-[0.15em]">{h.scroll[lang]}</span>
        <div className="animate-bounce-gentle">
          <ArrowDown size={20} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
