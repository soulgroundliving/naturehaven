import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SectionHeader from '@/components/SectionHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';
import { NEARBY_ESSENTIALS as nearbyEssentials, LIFESTYLE_SURROUNDINGS as lifestyleSurroundings } from '@/data/propertyFacts';

gsap.registerPlugin(ScrollTrigger);

// Real nearby places (brand names are fine HERE — owner's "no brand names"
// note was about the in-room essentials, not this list). Café Amazon dropped
// only because that shop closed. Canonical list lives in propertyFacts.ts —
// the same distances are also stated in prose in the "Sai Mai, measured in
// metres" journal article.

const LocationSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { lang } = useLanguage();
  const loc = TR.location;
  // Mobile: the 5 essentials always show; the 6 lifestyle rows collapse behind
  // "ดูทั้งหมด" (owner 2026-07-12 — trims the 1.7-screen list). Desktop: both
  // lists always full. GSAP reveals skip mobile entirely, so no conflict.
  const [showAll, setShowAll] = useState(false);

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
            {/* One map for both languages: the redrawn building + the real drive
                (U-turn at Make Me Wine) exist only with Thai labels. Landscape
                20:13 — shown whole, never cropped, so the route stays readable.
                The same file is the hero of Green's location card on LINE. */}
            <img
              src="/assets/location-area-map-th.png"
              alt={
                lang === 'th'
                  ? 'แผนที่ทางมา Nature Haven จาก BTS คูคต ต่อแท็กซี่ราว 5 กม. ตาม ถ.ลำลูกกา เลย ถ.เฉลิมพงษ์ไปกลับรถที่ร้าน Make Me Wine แล้วเลี้ยวซ้ายเข้า ถ.เฉลิมพงษ์ ตรงหัวมุม Big C คลอง 4 ตึกอยู่ขวามือ พร้อม Big C มินิ รพ. CGH สายไหม 7-Eleven ตลาดวงศกร และ Makro ใกล้ตึก ภาพอาคารเป็นภาพจำลอง (AI)'
                  : 'Map (Thai labels) of the drive to Nature Haven: from BTS Khu Khot take a taxi about 5 km along Lam Luk Ka Rd, pass Chalermpong Rd, U-turn at Make Me Wine, then turn left into Chalermpong Rd at the Big C Khlong 4 corner — the building is on the right. Nearby: Big C Mini, CGH Sai Mai Hospital, 7-Eleven, Wongsakorn Market, Makro. The building is an AI illustration.'
              }
              width={1900}
              height={1236}
              loading="lazy"
              className="w-full h-auto rounded-xl shadow-lg"
            />
            <figure className="mt-6 flex flex-col items-center">
              <video
                src="/assets/nest-journey-map.mp4"
                poster="/assets/nest-journey-map-poster.jpg"
                controls
                muted
                playsInline
                preload="none"
                width={1080}
                height={1920}
                className="w-full max-w-[300px] h-auto rounded-xl shadow-lg bg-[#f5f1e4]"
                aria-label={lang === 'th' ? 'วิดีโอทางมาบ้าน จาก BTS คูคต ถึงหน้าตึก (59 วินาที ไม่มีเสียง)' : 'Video: the way here, from BTS Khu Khot to the building (59 s, no sound)'}
              />
              <figcaption className="mt-2 font-sans text-sm sec-text-60 text-center">
                {lang === 'th' ? 'วิดีโอทางมาบ้าน · 59 วิ · ภาพอาคารเป็นภาพจำลอง (AI)' : 'The way here · 59 s · building is an AI illustration'}
              </figcaption>
            </figure>
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
            {!showAll && (
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="md:hidden flex w-full items-center justify-between py-3 font-sans text-[15px] sec-text-70"
              >
                <span>{lang === 'th' ? `ดูทั้งหมด ${lifestyleSurroundings.length} ที่` : `Show all ${lifestyleSurroundings.length} places`}</span>
                <span aria-hidden="true" className="sec-text-55">▾</span>
              </button>
            )}
            <div className={`space-y-0 ${showAll ? '' : 'hidden md:block'}`}>
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

            {/* /places has no other homepage entry point (only reachable via
                the lightweight JournalShell chrome on other subpages) — this
                closes that gap without adding a persistent nav item. */}
            <Link
              to="/places"
              className="loc-item group mt-8 inline-flex items-center gap-2 font-sans text-sm sec-text-70 transition-colors duration-300 hover:text-sage-green"
            >
              {loc.guideLink[lang]}
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
