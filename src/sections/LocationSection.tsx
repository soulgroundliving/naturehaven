import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SectionHeader from '@/components/SectionHeader';
import { LocationPin } from '@/components/icons';
import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';

gsap.registerPlugin(ScrollTrigger);

// Generic place-TYPES only — no brand names here (owner: specific shops belong
// in the journal article, not this list; Café Amazon removed, it closed).
const nearbyEssentials = [
  { name: { th: 'ไฮเปอร์มาร์เก็ต', en: 'Hypermarket' },     distance: { th: '280 ม.', en: '280 m' } },
  { name: { th: 'โรงพยาบาล', en: 'Hospital' },             distance: { th: '300 ม.', en: '300 m' } },
  { name: { th: 'ตลาดสด', en: 'Fresh market' },            distance: { th: '700 ม.', en: '700 m' } },
  { name: { th: 'ร้านค้าส่ง', en: 'Wholesale store' },      distance: { th: '750 ม.', en: '750 m' } },
  { name: { th: 'สถานีรถไฟฟ้า', en: 'Skytrain station' },   distance: { th: '5 กม. · ~15 นาที', en: '5 km · ~15 min' } },
];

const lifestyleSurroundings = [
  { name: { th: 'คอมมูนิตี้มอลล์', en: 'Community mall' },   distance: { th: '1 กม.', en: '1 km' } },
  { name: { th: 'ซูเปอร์มาร์เก็ต', en: 'Supermarket' },      distance: { th: '3.3 กม.', en: '3.3 km' } },
  { name: { th: 'ตลาดสด', en: 'Fresh market' },            distance: { th: '4.4 กม.', en: '4.4 km' } },
  { name: { th: 'ตลาดนัด', en: 'Weekend market' },         distance: { th: '5 กม.', en: '5 km' } },
  { name: { th: 'ซูเปอร์สโตร์', en: 'Superstore' },         distance: { th: '7 กม.', en: '7 km' } },
  { name: { th: 'ช้อปปิ้งมอลล์', en: 'Shopping mall' },      distance: { th: '9.7 กม.', en: '9.7 km' } },
];

const LocationSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { lang } = useLanguage();
  const loc = TR.location;

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      if (window.matchMedia('(max-width: 767px)').matches) return;

      const mapImage = sectionRef.current.querySelector('.loc-map');
      gsap.from(mapImage, {
        x: -30,
        opacity: 0,
        scale: 0.98,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: mapImage as Element,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      const listItems = sectionRef.current.querySelectorAll('.loc-item');
      gsap.from(listItems, {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: listItems[0] as Element,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="location"
      className="section-padding frosted-section backdrop-blur-xl"
    >
      <div className="container-main">
        <SectionHeader
          label={loc.sectionLabel[lang]}
          headline={loc.sectionHeadline[lang].split('\n').join('\n')}
          dark
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="loc-map relative">
            <img
              src="/assets/location-area-map.jpg"
              alt="Sai Mai neighborhood map"
              loading="lazy"
              className="w-full rounded-xl shadow-lg object-cover aspect-[3/4] lg:aspect-auto lg:h-[700px]"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-sage-green flex items-center justify-center shadow-lg">
                <LocationPin className="text-pure-white" size={20} />
              </div>
              <span className="mt-2 bg-pure-white/90 backdrop-blur-sm px-3 py-1 rounded-full font-sans text-xs text-dark-charcoal shadow-sm">
                Nature Haven
              </span>
            </div>
          </div>

          <div>
            <h3 className="loc-item font-serif text-3xl md:text-[40px] sec-text mb-6">
              {loc.nearbyTitle[lang]}
            </h3>
            <div className="space-y-0">
              {nearbyEssentials.map(({ name, distance }, i) => (
                <div
                  key={name.en}
                  className={`loc-item flex items-center justify-between py-3.5 ${
                    i < nearbyEssentials.length - 1 ? 'border-b border-dotted sec-border' : ''
                  }`}
                >
                  <span className="font-sans text-base font-normal sec-text">{name[lang]}</span>
                  <span className="font-sans text-base font-light sec-text-60">{distance[lang]}</span>
                </div>
              ))}
            </div>

            <h3 className="loc-item font-serif text-2xl md:text-[32px] sec-text mt-12 mb-6">
              {loc.lifestyleTitle[lang]}
            </h3>
            <div className="space-y-0">
              {lifestyleSurroundings.map(({ name, distance }, i) => (
                <div
                  key={name.en}
                  className={`loc-item flex items-center justify-between py-3 ${
                    i < lifestyleSurroundings.length - 1 ? 'border-b border-dotted sec-border' : ''
                  }`}
                >
                  <span className="font-sans text-base font-normal sec-text">{name[lang]}</span>
                  <span className="font-sans text-base font-light sec-text-60">{distance[lang]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
