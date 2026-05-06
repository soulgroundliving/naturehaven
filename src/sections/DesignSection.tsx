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

const DesignSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

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

  return (
    <section ref={sectionRef} id="design" className="bg-pure-white/30 backdrop-blur-xl section-padding">
        <div className="container-main">
          <SectionHeader
            label="Design & Architecture"
            headline="Designed with intention. Built for calm."
            dark
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Column — Materials */}
            <div>
              <h3 className="design-left-animate headline-sm mb-2 text-pure-white">
                Design & Materials
              </h3>
              <p className="design-left-animate font-sans text-base italic text-pure-white/70 mb-8">
                Every material chosen with care.
              </p>

              <div className="space-y-5 mb-8">
                {materials.map(({ color, text }) => (
                  <div key={text} className="design-left-animate flex items-center gap-4">
                    <div
                      className="w-8 h-8 rounded-md shadow-sm flex-shrink-0 border border-pure-white/20"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-sans text-base font-light text-pure-white/85">
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
              <h3 className="design-right-animate headline-sm mb-8 text-pure-white">
                Architecture & Living Concept
              </h3>

              <ul className="space-y-4 mb-10">
                {architectureSpecs.map((spec) => (
                  <li key={spec} className="design-right-animate flex items-start gap-3">
                    <Check className="text-sage-green mt-0.5 flex-shrink-0" size={18} />
                    <span className="font-sans text-base font-light text-pure-white/80 leading-relaxed">
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
    </section>
  );
};

export default DesignSection;