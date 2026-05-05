import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowDown } from '@/components/icons';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  lenisRef: React.RefObject<any>;
}

const HeroSection: React.FC<HeroSectionProps> = ({ lenisRef }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !contentRef.current) return;

      // Load animation timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(bgRef.current, {
        opacity: 0,
        scale: 1.05,
        duration: 1.2,
      })
        .from(
          '.hero-label',
          { y: 20, opacity: 0, duration: 0.7 },
          0.3
        )
        .from(
          '.hero-line1',
          { y: 30, opacity: 0, duration: 0.8 },
          0.45
        )
        .from(
          '.hero-line2',
          { y: 30, opacity: 0, duration: 0.8 },
          0.6
        )
        .from(
          '.hero-subtitle',
          { y: 20, opacity: 0, duration: 0.7 },
          0.75
        )
        .from(
          '.hero-cta',
          { y: 15, opacity: 0, duration: 0.6 },
          0.9
        )
        .from(
          scrollIndicatorRef.current,
          { opacity: 0, duration: 0.5 },
          1.1
        );

      // Parallax + fade on scroll
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

      gsap.to(bgRef.current, {
        y: 80,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Scroll indicator fade out
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
    if (target && lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: -80 });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[100dvh] overflow-hidden flex items-center justify-center"
    >
      {/* Background Image */}
      <div
        ref={bgRef}
        className="absolute inset-0 z-0"
        style={{ willChange: 'transform' }}
      >
        <img
          src="/assets/hero-living-space.jpg"
          alt="Nature Haven living space"
          className="w-full h-full object-cover"
        />
        {/* Vignette overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 30%, rgba(26,26,26,0.45) 100%)',
          }}
        />
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 text-center px-4 flex flex-col items-center"
        style={{ willChange: 'transform, opacity' }}
      >
        <p className="hero-label font-sans text-xs md:text-sm uppercase tracking-[0.15em] text-pure-white mb-6">
          Quiet Living in Saimai
        </p>
        <h1 className="font-serif text-pure-white leading-[0.9]">
          <span className="hero-line1 block text-[14vw] md:text-[12vw] lg:text-[10vw]">
            Nature
          </span>
          <span className="hero-line2 block text-[14vw] md:text-[12vw] lg:text-[10vw]">
            Haven
          </span>
        </h1>
        <p className="hero-subtitle font-sans text-base md:text-lg font-light text-pure-white/90 max-w-[500px] mt-8 leading-relaxed">
          A residence shaped by intention — where life gently returns to its
          natural rhythm.
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

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="animate-bounce-gentle">
          <ArrowDown className="text-pure-white/70" size={24} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;