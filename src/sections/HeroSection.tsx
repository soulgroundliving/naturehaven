import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowDown } from '@/components/icons';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  lenisRef: React.RefObject<unknown>;
}

// Each word in its own mask container — editorial mask-reveal effect
const LABEL_WORDS = ['Quiet', 'Living', 'in', 'Saimai,', 'Bangkok'];
const HEADLINE_LINES = ['Nature', 'Haven'];

const HeroSection: React.FC<HeroSectionProps> = ({ lenisRef }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // 1. Thin rule above label — scales in from left
      tl.fromTo(
        '.hero-rule-top',
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.65, ease: 'power2.inOut' },
        0.15
      )

      // 2. Label words slide up through overflow-hidden mask
      .from(
        '.hero-label-word',
        { y: '115%', duration: 0.65, stagger: 0.055, ease: 'power3.out' },
        0.45
      )

      // 3. Headline lines — large dramatic upward reveal
      .from(
        '.hero-line-inner',
        { y: 110, duration: 1.0, stagger: 0.13, ease: 'power4.out' },
        0.7
      )

      // 4. Thin rule below headline
      .fromTo(
        '.hero-rule-bottom',
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.55, ease: 'power2.inOut' },
        1.45
      )

      // 5. Subtitle
      .from('.hero-subtitle', { y: 18, opacity: 0, duration: 0.7 }, 1.6)

      // 6. CTA
      .from('.hero-cta', { y: 14, opacity: 0, duration: 0.6 }, 1.8)

      // 7. Scroll indicator
      .from(scrollIndicatorRef.current, { opacity: 0, duration: 0.5 }, 2.05);

      // Parallax fade on scroll out
      gsap.to(contentRef.current, {
        y: -150,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '50% top',
          scrub: true,
        },
      });

      gsap.to(scrollIndicatorRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: '10% top',
          end: '20% top',
          scrub: true,
        },
      });
    },
    { scope: sectionRef }
  );

  const scrollToAbout = () => {
    const target = document.querySelector('#about');
    const lenis = lenisRef.current as { scrollTo: (t: Element, o?: { offset?: number }) => void } | null;
    if (target && lenis) {
      lenis.scrollTo(target, { offset: -80 });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full min-h-[100dvh] overflow-hidden flex items-center justify-center"
    >
      <div
        ref={contentRef}
        className="relative z-10 text-center px-4 flex flex-col items-center"
        style={{ willChange: 'transform, opacity', color: 'var(--text-on-bg, #2B2B2B)' }}
      >
        {/* Editorial rule above label */}
        <div className="hero-rule-top w-20 h-px mb-6 opacity-25" style={{ background: 'var(--text-on-bg, #2B2B2B)' }} />

        {/* Label — word mask-reveal */}
        <p
          className="font-sans text-[10px] md:text-xs uppercase tracking-[0.22em] mb-8 flex flex-wrap justify-center gap-x-[0.55em] gap-y-1"
          style={{ color: 'var(--text-on-bg, #2B2B2B)' }}
          aria-label="Quiet Living in Saimai, Bangkok"
        >
          {LABEL_WORDS.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden" style={{ lineHeight: 1.3 }}>
              <span className="hero-label-word inline-block">{word}</span>
            </span>
          ))}
        </p>

        {/* Headline — line-by-line mask-reveal */}
        <h1
          className="font-serif leading-[0.88] text-[15vw] sm:text-[13vw] md:text-[11.5vw] lg:text-[10vw]"
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

        {/* Editorial rule below headline */}
        <div
          className="hero-rule-bottom h-px mt-7 mb-8 opacity-20"
          style={{ width: '260px', background: 'var(--text-on-bg, #2B2B2B)' }}
        />

        {/* Subtitle */}
        <p
          className="hero-subtitle font-sans text-base md:text-lg font-light max-w-[520px] leading-relaxed"
          style={{ color: 'var(--text-on-bg, #2B2B2B)' }}
        >
          A residence shaped by intention — where life gently returns to its natural rhythm.
        </p>

        {/* CTA */}
        <button
          onClick={scrollToAbout}
          className="hero-cta group relative mt-12 inline-flex items-center gap-3 bg-[var(--cta-bg,#3D5A4C)] text-pure-white font-sans text-sm uppercase tracking-wide px-10 py-4 rounded-full overflow-hidden transition-transform duration-200 active:scale-[0.98] hover:shadow-lg"
        >
          <span className="absolute inset-0 bg-[var(--cta-bg-hover,#4a6e5d)] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
          <span className="relative z-10">Discover More</span>
          <svg
            className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        style={{ color: 'var(--text-muted-on-bg, #5C5650)' }}
      >
        <span className="font-sans text-xs uppercase tracking-[0.15em]">เลื่อนเพื่อสำรวจ</span>
        <div className="animate-bounce-gentle">
          <ArrowDown size={20} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
