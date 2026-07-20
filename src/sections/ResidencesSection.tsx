import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SectionHeader from '@/components/SectionHeader';
import {
  PawPrint,
  Boxes,
  BedDouble,
  Armchair,
  RectangleVertical,
  Snowflake,
  Refrigerator,
  ShowerHead,
  Blinds,
  Wind,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import AiRenderBadge from '@/components/AiRenderBadge';
import { TR } from '@/lib/translations';

gsap.registerPlugin(ScrollTrigger);

// One icon per In-Room Essential, index-aligned with TR.residences.essentials
// (built-ins · mattress · desk/wardrobe · mirror · AC · fridge · water heater ·
// UV-blocking curtains · ventilation). Colour follows the time-of-day theme.
const ESSENTIAL_ICONS = [
  Boxes,
  BedDouble,
  Armchair,
  RectangleVertical,
  Snowflake,
  Refrigerator,
  ShowerHead,
  Blinds,
  Wind,
];

const ResidencesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const sqmRef    = useRef<HTMLSpanElement>(null);
  const unitsRef  = useRef<HTMLSpanElement>(null);
  const floorsRef = useRef<HTMLSpanElement>(null);
  const { lang } = useLanguage();
  const r = TR.residences;
  const suitableFor = r.suitableFor[lang];
  const essentials = r.essentials[lang];

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      if (window.matchMedia('(max-width: 767px)').matches) return;

      const cards = sectionRef.current.querySelectorAll('.res-card');
      gsap.from(cards, {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cards[0] as Element,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      const essentialsCard = sectionRef.current.querySelector('.essentials-card');
      gsap.from(essentialsCard, {
        y: 25,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: essentialsCard as Element,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      const features = sectionRef.current.querySelectorAll('.ess-item');
      gsap.from(features, {
        y: 15,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: features[0] as Element,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });

      if (sqmRef.current) {
        const el = sqmRef.current;
        const obj = { val: 21 };
        gsap.to(obj, {
          val: 25.2,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate() { el.textContent = obj.val.toFixed(1); },
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
        });
      }
      if (unitsRef.current) {
        const el = unitsRef.current;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: 20,
          duration: 1.2,
          ease: 'power2.out',
          onUpdate() { el.textContent = String(Math.round(obj.val)); },
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
        });
      }
      if (floorsRef.current) {
        const el = floorsRef.current;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: 4,
          duration: 0.9,
          ease: 'power2.out',
          onUpdate() { el.textContent = String(Math.round(obj.val)); },
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
        });
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="residences"
      className="section-padding frosted-section backdrop-blur-xl"
    >
      <div className="container-main">
        <SectionHeader
          label={r.sectionLabel[lang]}
          headline={r.sectionHeadline[lang].split('\n').join('\n')}
          dark
        />

        {/* Three Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 md:mb-16 lg:mb-20">
          {/* Suitable For */}
          <div className="res-card card-surface backdrop-blur-sm rounded-xl p-8 md:p-12">
            <h3 className="font-serif text-2xl md:text-[32px] sec-text mb-6">
              {r.suitableForTitle[lang]}
            </h3>
            <ul className="space-y-3">
              {suitableFor.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage-green flex-shrink-0" />
                  <span className="font-sans text-base font-light sec-text">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Space & Layout */}
          <div className="res-card card-surface backdrop-blur-sm rounded-xl p-8 md:p-12">
            <h3 className="font-serif text-2xl md:text-[32px] sec-text mb-4">
              {r.spaceTitle[lang]}
            </h3>
            <div className="flex items-baseline gap-2 mb-2">
              <span ref={sqmRef} className="font-serif text-6xl md:text-7xl lg:text-[80px] sec-text leading-none">
                25.2
              </span>
              <span className="font-sans text-base sec-text-60">sq.m.</span>
            </div>
            <div className="w-full h-px my-4" style={{ background: 'var(--sec-border)' }} />
            <p className="font-sans text-base font-light sec-text mb-1">{r.bedroom[lang]}</p>
            <p className="font-sans text-base font-light sec-text mb-5">{r.kitchen[lang]}</p>
            <div className="flex items-center gap-2">
              <span className="inline-block bg-subtle-taupe/20 sec-text text-[11px] font-sans px-2.5 py-1 rounded-full">
                <span ref={unitsRef}>20</span> units total
              </span>
              <span className="inline-block bg-subtle-taupe/20 sec-text text-[11px] font-sans px-2.5 py-1 rounded-full">
                <span ref={floorsRef}>4</span> floors
              </span>
            </div>
          </div>

          {/* Terms */}
          <div className="res-card card-surface backdrop-blur-sm rounded-xl p-8 md:p-12">
            <h3 className="font-serif text-2xl md:text-[32px] sec-text mb-8">
              {r.termsTitle[lang]}
            </h3>
            <ul className="flex flex-col gap-5">
              <li className="flex flex-col gap-1">
                <span className="font-sans text-[11px] sec-text-60 uppercase tracking-[0.18em]">{r.contractLabel[lang]}</span>
                <span className="font-sans text-base font-light sec-text">{r.contractValue[lang]}</span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="font-sans text-[11px] sec-text-60 uppercase tracking-[0.18em]">{r.moveinLabel[lang]}</span>
                <span className="font-sans text-base font-light sec-text">{r.moveinValue[lang]}</span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="font-sans text-[11px] sec-text-60 uppercase tracking-[0.18em]">{r.availableLabel[lang]}</span>
                <span className="font-sans text-base font-light sec-text">{r.availableValue[lang]}</span>
              </li>
            </ul>
            <div className="w-full h-px mt-8 mb-5" style={{ background: 'var(--sec-border)' }} />
            <p className="font-sans text-sm italic text-sage-green leading-relaxed">
              {r.allinclusive[lang]}
            </p>
          </div>
        </div>

        {/* Pricing — by floor, every unit pet-friendly */}
        <div className="mb-10 md:mb-16 lg:mb-20">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <p className="font-sans text-[11px] sec-text-60 uppercase tracking-[0.18em]">{r.pricingLabel[lang]}</p>
            <p className="font-sans text-[11px] sec-text-55 uppercase tracking-[0.14em]">{r.pricingNote[lang]}</p>
          </div>

          {/* Pet-friendly banner — every floor */}
          <div className="flex items-center gap-3 mb-5 rounded-xl border border-sage-green/30 bg-sage-green/5 px-5 py-3.5">
            <PawPrint size={18} className="text-sage-green flex-shrink-0" />
            <p className="font-sans text-sm font-light leading-snug">
              <span className="font-medium text-sage-green">{r.petsEverywhere[lang]}</span>
              <span className="sec-text-70"> — {r.petsEverywhereSub[lang]}</span>
            </p>
          </div>

          {/* Private pricing — quiet-luxury posture: rates shared 1:1 via LINE,
              never as a public ladder. No button here (one-CTA rule, owner
              2026-07-12): the floating LINE pill is always on screen. */}
          <div className="rounded-xl sec-border border card-surface backdrop-blur-sm p-7 md:p-10">
            <p className="font-sans text-[16px] font-light leading-relaxed sec-text-80 max-w-[640px]">
              {r.privateBody[lang]}
            </p>
          </div>
        </div>

        {/* One render mid-section — breaks the longest text-only stretch on
            mobile (viewport audit 2026-07-12: 3.8 screen-heights with no image
            from the top of this section to the Journal thumbnails).
            room-view-out shows the desk / pantry / built-ins the specs above
            describe. object-contain on card-surface per the never-crop rule. */}
        <div className="relative mb-10 md:mb-16 h-64 md:h-96 overflow-hidden rounded-2xl card-surface">
          <img
            src="/assets/room-view-out.jpg"
            alt={lang === 'th' ? 'มุมมองภายในห้อง — โต๊ะทำงานยาว มุมครัว และเฟอร์นิเจอร์บิลต์อิน' : 'Room interior — long desk, kitchenette corner and built-in furniture'}
            loading="lazy"
            className="h-full w-full object-contain"
          />
          <AiRenderBadge className="absolute bottom-2.5 right-2.5" />
        </div>

        {/* In-Room Essentials */}
        <div className="essentials-card card-surface backdrop-blur-sm rounded-xl p-8 md:p-12 lg:p-16">
          <h3 className="font-serif text-3xl md:text-[40px] sec-text text-center mb-2">
            {r.essentialsTitle[lang]}
          </h3>
          <p className="font-sans text-base italic sec-text-70 text-center mb-10 md:mb-12">
            {r.essentialsSub[lang]}
          </p>
          {/* 2-col from the smallest screens (audit: 9 single-file rows made
              this the tail of the text desert) — halves the scroll, loses
              nothing. */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4 sm:gap-x-8 sm:gap-y-5">
            {essentials.map((item, i) => {
              const Icon = ESSENTIAL_ICONS[i] ?? Boxes;
              return (
                <div key={item} className="ess-item flex items-start gap-2.5 sm:gap-3">
                  <Icon className="sec-text-70 flex-shrink-0 mt-[2px]" size={20} strokeWidth={1.5} />
                  <span className="font-sans text-[14px] sm:text-base font-light leading-snug sec-text">{item}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResidencesSection;
