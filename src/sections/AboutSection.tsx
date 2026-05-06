import React, { useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const mantraRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef<HTMLDivElement>(null);

  // Reduced-motion users get the mantra statically — no pin, no scrub.
  // Pin scrubbing on a 150vh trigger is the whole point of the orb-passes-
  // through-text moment, so falling back to "show all three at once" would
  // be visually noisy. Showing the mantra alone preserves the message.
  const reducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      // ── Sticky-pin: orb passes through 3 layered reveals ───────────────
      // 0–25%   subtitle in
      // 25–50%  subtitle out, mantra in (the orb-passing-through moment)
      // 50–75%  mantra fades + scales up slightly, closing in
      // 75–100% hold for orb to clear the section
      if (!reducedMotion && pinRef.current) {
        gsap.set([subtitleRef.current, mantraRef.current, closingRef.current], {
          opacity: 0,
          y: 16,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinRef.current,
            start: 'top top',
            end: '+=150%',
            pin: true,
            scrub: 0.4,
          },
        });

        tl.to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.25 }, 0)
          .to(subtitleRef.current, { opacity: 0, y: -10, duration: 0.2 }, 0.25)
          .to(mantraRef.current, { opacity: 1, y: 0, duration: 0.25 }, 0.25)
          .to(mantraRef.current, { opacity: 0.35, scale: 1.06, duration: 0.25 }, 0.5)
          .to(closingRef.current, { opacity: 1, y: 0, duration: 0.25 }, 0.5)
          .to({}, { duration: 0.25 }, 0.75);
      }

      // ── Existing about-content fade-up (untouched behavior) ────────────
      const items = sectionRef.current.querySelectorAll('.about-animate');
      gsap.from(items, {
        y: 20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-content',
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      const image = sectionRef.current.querySelector('.about-image');
      if (image) {
        gsap.from(image, {
          y: 30,
          opacity: 0,
          scale: 0.98,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: image as Element,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="bg-pure-white/30 backdrop-blur-xl"
    >
      {/* Sticky-pin orb pass-through with mantra reveal */}
      {reducedMotion ? (
        <div className="h-screen flex items-center justify-center px-6">
          <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl text-dark-charcoal text-center">
            ทางสายกลาง
          </h2>
        </div>
      ) : (
        <div ref={pinRef} className="h-screen flex items-center justify-center px-6">
          <div className="relative w-full max-w-3xl h-[60vh]">
            <div
              ref={subtitleRef}
              className="absolute inset-0 flex items-center justify-center"
            >
              <p className="font-serif italic text-2xl md:text-3xl text-dark-charcoal/80">
                ที่นี่คือ
              </p>
            </div>
            <div
              ref={mantraRef}
              className="absolute inset-0 flex items-center justify-center"
            >
              <h2 className="font-serif text-6xl md:text-8xl lg:text-9xl text-dark-charcoal text-center leading-none">
                ทางสายกลาง
              </h2>
            </div>
            <div
              ref={closingRef}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            >
              <p className="font-sans text-base md:text-lg text-dark-charcoal/70 text-center max-w-md">
                ความสมดุลในทุกจังหวะของวัน
              </p>
              <span
                aria-hidden="true"
                className="text-sm text-dark-charcoal/50 mt-1"
              >
                ↓
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Existing Philosophy + About content (unchanged copy) */}
      <div className="about-content section-padding">
        <div className="container-main">
          {/* Philosophy Block */}
          <div className="mb-24 md:mb-32">
            <p className="about-animate section-label text-dark-charcoal/70 mb-4">
              Our Philosophy
            </p>
            <div className="about-animate w-10 h-px bg-dark-charcoal mb-6" />
            <h2 className="about-animate headline-lg max-w-[700px]">
              True comfort is never excessive.
            </h2>
            <p className="about-animate body-text max-w-[600px] mt-6">
              It is found in stillness — in spaces that are thoughtfully designed,
              and in a quiet balance that allows each day to unfold with ease.
            </p>
          </div>

          {/* About Block */}
          <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 lg:gap-16 items-start">
            <div>
              <p className="about-animate section-label text-dark-charcoal/70 mb-4">
                About
              </p>
              <h2 className="about-animate headline-md">
                A newly built private residence inspired by MUJI minimal living.
              </h2>
              <p className="about-animate body-text mt-8">
                Designed for calm, crafted for privacy, and quietly connected to
                Sai Mai Road. Available from August 2026.
              </p>
              <button
                onClick={() => {
                  const el = document.getElementById('residences');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="about-animate group mt-8 inline-flex items-center gap-2 font-serif italic text-xl text-dark-charcoal hover:text-sage-green transition-colors duration-300"
              >
                <span className="relative">
                  View Residences
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-current group-hover:w-full transition-all duration-500" />
                </span>
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
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
            <div className="about-image lg:-mt-10">
              <img
                src="/assets/about-minimal-room.jpg"
                alt="Minimal bedroom interior"
                className="w-full rounded-lg shadow-lg object-cover aspect-[3/4]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
