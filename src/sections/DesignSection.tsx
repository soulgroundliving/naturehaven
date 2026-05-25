import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SectionHeader from '@/components/SectionHeader';
import { Check } from '@/components/icons';
import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';

gsap.registerPlugin(ScrollTrigger);

const materialColors = ['#D4C5B5', '#EDE7DE', '#C4A882', '#C8A951'];

const DesignSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { lang } = useLanguage();
  const d = TR.design;
  const materialTexts = d.materials[lang];
  const archSpecs = d.archSpecs[lang];

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      if (window.matchMedia('(max-width: 767px)').matches) return;

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
          toggleActions: 'play none none reverse',
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
          toggleActions: 'play none none reverse',
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="design" className="frosted-section backdrop-blur-xl section-padding">
      <div className="container-main">
        <SectionHeader
          label={d.sectionLabel[lang]}
          headline={d.sectionHeadline[lang].split('\n').join('\n')}
          dark
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column — Materials */}
          <div>
            <h3 className="design-left-animate headline-sm mb-2 sec-text">
              {d.materialsTitle[lang]}
            </h3>
            <p className="design-left-animate font-sans text-base italic sec-text-70 mb-8">
              {d.materialsSub[lang]}
            </p>

            <div className="space-y-5 mb-8">
              {materialTexts.map((text, i) => (
                <div key={i} className="design-left-animate flex items-center gap-4">
                  <div
                    className="w-8 h-8 rounded-md shadow-sm flex-shrink-0 border border-pure-white/20"
                    style={{ backgroundColor: materialColors[i] }}
                  />
                  <span className="font-sans text-base font-light sec-text-80">{text}</span>
                </div>
              ))}
            </div>

            <div className="design-left-animate">
              <img
                src="/assets/design-materials-detail.jpg"
                alt="Interior materials detail"
                loading="lazy"
                className="w-full rounded-lg shadow-md object-cover aspect-[3/2]"
              />
            </div>
          </div>

          {/* Right Column — Architecture */}
          <div>
            <h3 className="design-right-animate headline-sm mb-8 sec-text">
              {d.archTitle[lang]}
            </h3>

            <ul className="space-y-4 mb-10">
              {archSpecs.map((spec, i) => (
                <li key={i} className="design-right-animate flex items-start gap-3">
                  <Check className="text-sage-green mt-0.5 flex-shrink-0" size={18} />
                  <span className="font-sans text-base font-light sec-text-80 leading-relaxed">{spec}</span>
                </li>
              ))}
            </ul>

            <div className="design-right-animate">
              <img
                src="/assets/design-philosophy-interior.jpg"
                alt="Airflow optimized interior"
                loading="lazy"
                className="w-full rounded-lg shadow-md object-cover aspect-video"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DesignSection;
