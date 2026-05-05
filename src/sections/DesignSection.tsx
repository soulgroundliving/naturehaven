import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SectionHeader from '@/components/SectionHeader';
import { Check } from '@/components/icons';

gsap.registerPlugin(ScrollTrigger);

const materials = [
  { color: '#D4C5B5', text: 'SPC flooring — light tone, soft contrast with furniture' },
  { color: '#EDE7DE', text: 'Soft light wall palette (Nippon Paint OW 2154P)' },
  { color: '#C4A882', text: 'Built-in HMR E1 laminate — natural wood tone' },
  { color: '#3B3B3B', text: 'Modern switch design' },
];

const architectureSpecs = [
  'Open studio — 31.5 sq.m.',
  '20-unit low-rise residence (no elevator)',
  'North–South airflow optimization',
  'Ergonomic layout planning',
  'Sky Hook feature for vertical utility use',
];

const philosophyFeatures = [
  { num: '01', text: 'Feng Shui aligned' },
  { num: '02', text: 'Pocket green spaces' },
  { num: '03', text: 'Calm-centered layout' },
];

const DesignSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const darkSectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const leftItems = sectionRef.current.querySelectorAll('.design-left-animate');
      gsap.from(leftItems, {
        y: 25,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: leftItems[0] as Element,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      const rightItems = sectionRef.current.querySelectorAll('.design-right-animate');
      gsap.from(rightItems, {
        y: 25,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        delay: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: rightItems[0] as Element,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    },
    { scope: sectionRef }
  );

  useGSAP(
    () => {
      if (!darkSectionRef.current) return;

      const items = darkSectionRef.current.querySelectorAll('.phil-animate');
      gsap.from(items, {
        y: 20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: darkSectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });
    },
    { scope: darkSectionRef }
  );

  return (
    <section ref={sectionRef} id="design" className="bg-soft-taupe">
      {/* Light portion */}
      <div className="section-padding">
        <div className="container-main">
          <SectionHeader
            label="Design & Architecture"
            headline="Designed with intention. Built for calm."
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Column — Materials */}
            <div>
              <h3 className="design-left-animate headline-sm mb-2">
                Design & Materials
              </h3>
              <p className="design-left-animate font-sans text-base italic text-dark-charcoal/70 mb-8">
                Every material chosen with care.
              </p>

              <div className="space-y-5 mb-8">
                {materials.map(({ color, text }) => (
                  <div key={text} className="design-left-animate flex items-center gap-4">
                    <div
                      className="w-8 h-8 rounded-md shadow-sm flex-shrink-0 border border-dark-charcoal/10"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-sans text-base font-light text-dark-charcoal">
                      {text}
                    </span>
                  </div>
                ))}
              </div>

              <p className="design-left-animate font-sans text-[15px] italic text-sage-green mb-10">
                Designed with sustainability in mind.
              </p>

              <div className="design-left-animate">
                <img
                  src="/assets/design-materials-detail.jpg"
                  alt="Interior materials detail"
                  className="w-full rounded-lg shadow-md object-cover aspect-[3/2]"
                />
              </div>
            </div>

            {/* Right Column — Architecture */}
            <div>
              <h3 className="design-right-animate headline-sm mb-8">
                Architecture & Living Concept
              </h3>

              <ul className="space-y-4 mb-10">
                {architectureSpecs.map((spec) => (
                  <li key={spec} className="design-right-animate flex items-start gap-3">
                    <Check className="text-sage-green mt-0.5 flex-shrink-0" size={18} />
                    <span className="font-sans text-base font-light text-dark-charcoal leading-relaxed">
                      {spec}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="design-right-animate">
                <img
                  src="/assets/design-philosophy-interior.jpg"
                  alt="Airflow optimized interior"
                  className="w-full rounded-lg shadow-md object-cover aspect-video"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dark subsection — Living Philosophy */}
      <div
        ref={darkSectionRef}
        id="design-philosophy"
        className="bg-near-black py-24 md:py-32 lg:py-40"
      >
        <div className="container-main">
          <h2 className="phil-animate font-serif text-4xl md:text-5xl lg:text-6xl xl:text-[70px] text-pure-white leading-[1.1] mb-6">
            Living Philosophy
          </h2>
          <p className="phil-animate font-sans text-base lg:text-[17px] font-light text-pure-white/80 max-w-[600px] leading-relaxed mb-16">
            Nature Haven is built on a thoughtful understanding of living — where
            structure, flow, and quiet intention come together naturally.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-16">
            {philosophyFeatures.map(({ num, text }) => (
              <div key={num} className="phil-animate">
                <span className="font-serif text-4xl md:text-5xl text-sage-green">
                  {num}
                </span>
                <p className="font-sans text-[15px] text-pure-white/80 mt-3">
                  {text}
                </p>
              </div>
            ))}
          </div>

          <div className="phil-animate">
            <img
              src="/assets/design-philosophy-interior.jpg"
              alt="Calm-centered living space"
              className="w-full rounded-xl object-cover aspect-video opacity-80"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DesignSection;