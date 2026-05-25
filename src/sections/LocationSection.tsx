import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SectionHeader from '@/components/SectionHeader';
import { LocationPin } from '@/components/icons';
import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';

gsap.registerPlugin(ScrollTrigger);

const nearbyEssentials = [
  { name: 'Café Amazon', distance: 'in front of the property' },
  { name: 'Big C', distance: '280 m' },
  { name: 'CGH Sai Mai Hospital', distance: '300 m' },
  { name: 'Wongsakorn Market', distance: '700 m' },
  { name: 'Makro Sai Mai', distance: '750 m' },
  { name: 'BTS Khu Khot', distance: '5 km · ~15 min by taxi' },
];

const lifestyleSurroundings = [
  { name: 'Saimai Avenue', distance: '1 km' },
  { name: 'Maruay Market', distance: '4.4 km' },
  { name: 'AC Sai Mai Market', distance: '5 km' },
  { name: 'Foodland', distance: '3.3 km' },
  { name: 'Save One Go Market', distance: '7 km' },
  { name: 'Market Place Theprak', distance: '9.7 km' },
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
                  key={name}
                  className={`loc-item flex items-center justify-between py-3.5 ${
                    i < nearbyEssentials.length - 1 ? 'border-b border-dotted sec-border' : ''
                  }`}
                >
                  <span className="font-sans text-base font-normal sec-text">{name}</span>
                  <span className="font-sans text-base font-light sec-text-60">{distance}</span>
                </div>
              ))}
            </div>

            <h3 className="loc-item font-serif text-2xl md:text-[32px] sec-text mt-12 mb-6">
              {loc.lifestyleTitle[lang]}
            </h3>
            <div className="space-y-0">
              {lifestyleSurroundings.map(({ name, distance }, i) => (
                <div
                  key={name}
                  className={`loc-item flex items-center justify-between py-3 ${
                    i < lifestyleSurroundings.length - 1 ? 'border-b border-dotted sec-border' : ''
                  }`}
                >
                  <span className="font-sans text-base font-normal sec-text">{name}</span>
                  <span className="font-sans text-base font-light sec-text-60">{distance}</span>
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
