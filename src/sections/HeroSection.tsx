import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowDown } from '@/components/icons';
import { useTimeOfDay } from '@/contexts/TimeOfDayContext';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  lenisRef: React.RefObject<unknown>;
}

const HEADLINE = 'Nature Haven';

const HeroSection: React.FC<HeroSectionProps> = ({ lenisRef }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const { palette } = useTimeOfDay();

  useGSAP(
    () => {
      if (!headlineRef.current) return;

      const chars = headlineRef.current.querySelectorAll('.hero-char');
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.hero-label', { y: 20, opacity: 0, duration: 0.7 }, 0.3)
        .from(
          chars,
          {
            y: 50,
            opacity: 0,
            filter: 'blur(8px)',
            duration: 0.9,
            stagger: 0.04,
          },
          0.4
        )
        .from('.hero-subtitle', { y: 20, opacity: 0, duration: 0.7 }, 1.0)
        .from('.hero-cta', { y: 15, opacity: 0, duration: 0.6 }, 1.2)
        .from(scrollIndicatorRef.current, { opacity: 0, duration: 0.5 }, 1.5);

      // Parallax fade as user scrolls past
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

  // Char-by-char split-text — no SplitText plugin needed
  const headlineChars = HEADLINE.split('').map((c, i) => (
    <span key={i} className="hero-char inline-block" aria-hidden="true">
      {c === ' ' ? ' ' : c}
    </span>
  ));

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full min-h-[100dvh] overflow-hidden flex items-center justify-center"
    >
      {/* Sky gradient + orb come from <OrbScene /> behind. No bg here. */}

      <div
        ref={contentRef}
        className="relative z-10 text-center px-4 flex flex-col items-center"
        style={{
          willChange: 'transform, opacity',
          color: 'var(--text-on-bg, #2B2B2B)',
        }}
      >
        <p
          className="hero-label font-sans text-xs md:text-sm uppercase tracking-[0.15em] mb-6"
          style={{ color: 'var(--text-muted-on-bg, #5C5650)' }}
        >
          Quiet Living in Saimai
        </p>
        <h1
          ref={headlineRef}
          className="font-serif leading-[0.9] text-[14vw] md:text-[12vw] lg:text-[10vw]"
          aria-label={HEADLINE}
        >
          <span aria-hidden="true">{headlineChars}</span>
        </h1>
        <p
          className="hero-subtitle font-sans text-base md:text-lg font-light max-w-[500px] mt-8 leading-relaxed"
          style={{ color: 'var(--text-on-bg, #2B2B2B)' }}
        >
          ทางสายกลาง · {palette.tagline}
        </p>
        <button
          onClick={scrollToAbout}
          className="hero-cta group relative mt-12 inline-flex items-center gap-3 bg-sage-green text-pure-white font-sans text-sm uppercase tracking-wide px-10 py-4 rounded-full overflow-hidden transition-transform duration-200 active:scale-[0.98] hover:shadow-lg"
        >
          <span className="absolute inset-0 bg-[#4a6e5d] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
          <span className="relative z-10">Discover More</span>
          <svg
            className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </button>
      </div>

      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        style={{ color: 'var(--text-muted-on-bg, #5C5650)' }}
      >
        <span className="font-sans text-xs uppercase tracking-[0.15em]">
          เลื่อนเพื่อสำรวจ
        </span>
        <div className="animate-bounce-gentle">
          <ArrowDown size={20} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
