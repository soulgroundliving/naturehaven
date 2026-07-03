import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SectionHeader from '@/components/SectionHeader';
import { Check } from '@/components/icons';
import { PawPrint } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';
import { PROPERTY } from '@/data/propertyFacts';

gsap.registerPlugin(ScrollTrigger);

const roomPhotos = [
  {
    src: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&fit=crop&auto=format&q=80',
    alt: 'Minimal bathroom with natural light',
    key: 'galleryBathroom',
  },
  {
    src: 'https://images.unsplash.com/photo-1757439402103-fc35542f96f8?w=800&fit=crop&auto=format&q=80',
    alt: 'Separate kitchen with minimal fittings',
    key: 'galleryKitchen',
  },
  {
    src: 'https://images.unsplash.com/photo-1725399103001-200ce2bb5350?w=800&fit=crop&auto=format&q=80',
    alt: 'Private balcony overlooking the garden',
    key: 'galleryBalcony',
  },
] as const;

// Every unit is pet-friendly. Price is set by floor — the top floor (4) is the
// two tiers: floors 3–4 at the 6,900 entry rate, floors 1–2 at 7,200.
const FLOORS = [
  { floor: 4, price: '6,900', entry: true },
  { floor: 3, price: '6,900', entry: true },
  { floor: 2, price: '7,200', entry: false },
  { floor: 1, price: '7,200', entry: false },
] as const;

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

      const tierCards = sectionRef.current.querySelectorAll('.tier-card');
      gsap.from(tierCards, {
        y: 24,
        opacity: 0,
        duration: 0.65,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: tierCards[0] as Element,
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        },
      });

      const tiles = sectionRef.current.querySelectorAll('.gallery-tile');
      gsap.from(tiles, {
        y: 20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: tiles[0] as Element,
          start: 'top 82%',
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
          val: 25,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate() { el.textContent = String(Math.round(obj.val)); },
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
                25
              </span>
              <span className="font-sans text-base sec-text-60">sq.m.</span>
            </div>
            <div className="w-full h-px my-4" style={{ background: 'var(--sec-border)' }} />
            <p className="font-sans text-base font-light sec-text mb-1">{r.bedroom[lang]}</p>
            <p className="font-sans text-base font-light sec-text mb-5">{r.kitchen[lang]}</p>
            <div className="flex items-center gap-2">
              <span className="inline-block bg-subtle-taupe/20 sec-text text-[10px] font-sans px-2.5 py-1 rounded-full">
                <span ref={unitsRef}>20</span> units total
              </span>
              <span className="inline-block bg-subtle-taupe/20 sec-text text-[10px] font-sans px-2.5 py-1 rounded-full">
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
                <span className="font-sans text-[10px] sec-text-60 uppercase tracking-[0.18em]">{r.contractLabel[lang]}</span>
                <span className="font-sans text-base font-light sec-text">{r.contractValue[lang]}</span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="font-sans text-[10px] sec-text-60 uppercase tracking-[0.18em]">{r.moveinLabel[lang]}</span>
                <span className="font-sans text-base font-light sec-text">{r.moveinValue[lang]}</span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="font-sans text-[10px] sec-text-60 uppercase tracking-[0.18em]">{r.availableLabel[lang]}</span>
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
            <p className="font-sans text-[10px] sec-text-60 uppercase tracking-[0.18em]">{r.pricingLabel[lang]}</p>
            <p className="font-sans text-[10px] sec-text-55 uppercase tracking-[0.14em]">{r.pricingNote[lang]}</p>
          </div>

          {/* Pet-friendly banner — every floor */}
          <div className="flex items-center gap-3 mb-5 rounded-xl border border-sage-green/30 bg-sage-green/5 px-5 py-3.5">
            <PawPrint size={18} className="text-sage-green flex-shrink-0" />
            <p className="font-sans text-sm font-light leading-snug">
              <span className="font-medium text-sage-green">{r.petsEverywhere[lang]}</span>
              <span className="sec-text-70"> — {r.petsEverywhereSub[lang]}</span>
            </p>
          </div>

          {/* Floor price tiers — 6,900 (floors 3–4) · 7,200 (floors 1–2) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {FLOORS.map(({ floor, price, entry }) => (
              <div
                key={floor}
                className={[
                  'tier-card rounded-xl border p-5 md:p-6',
                  entry ? 'border-sage-green/40 bg-sage-green/5' : 'sec-border card-surface',
                ].join(' ')}
              >
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="font-sans text-[10px] sec-text-60 uppercase tracking-[0.16em]">
                    {r.floorWord[lang]} {floor}
                  </span>
                  <PawPrint size={11} className="text-sage-green opacity-70 flex-shrink-0" />
                </div>
                <div className="flex items-baseline gap-1 mb-2.5">
                  <span className="font-serif text-[26px] md:text-[28px] sec-text leading-none">{price}</span>
                  <span className="font-sans text-[11px] sec-text-60">THB / mo</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span
                    className={[
                      'inline-block text-[10px] font-sans px-2.5 py-1 rounded-full whitespace-nowrap',
                      entry ? 'bg-sage-green/15 text-sage-green font-medium' : 'bg-subtle-taupe/20 sec-text',
                    ].join(' ')}
                  >
                    {entry ? r.fromLabel[lang] : r.openingRate[lang]}
                  </span>
                  <span className="font-sans text-[10px] sec-text-55 whitespace-nowrap">{r.unitsPerFloor[lang]}</span>
                </div>
                <a
                  href={PROPERTY.lineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 font-sans text-[11px] uppercase tracking-[0.12em] text-sage-green border-b border-sage-green/40 pb-0.5 transition-opacity duration-200 hover:opacity-70"
                >
                  {r.tierCta[lang]} →
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Photo Gallery — 2x2 equal grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-10 md:mb-16 lg:mb-20">
          {/* Bedroom (local asset) */}
          <div className="gallery-tile relative rounded-xl overflow-hidden aspect-[4/3]">
            <img
              src="/assets/room-view-out.jpg"
              alt="Bedroom interior looking toward the entrance — 25 sq.m."
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/40 to-transparent p-3 md:p-4">
              <span className="font-sans text-[10px] md:text-[11px] text-white/75 uppercase tracking-[0.2em]">
                {r.galleryBedroom[lang]}
              </span>
            </div>
          </div>

          {/* Bathroom / Kitchen / Balcony (remote) */}
          {roomPhotos.map(({ src, alt, key }) => (
            <div key={key} className="gallery-tile relative rounded-xl overflow-hidden aspect-[4/3]">
              <img src={src} alt={alt} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/40 to-transparent p-3 md:p-4">
                <span className="font-sans text-[10px] md:text-[11px] text-white/75 uppercase tracking-[0.2em]">
                  {r[key as keyof typeof r][lang]}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Reserve CTA */}
        <div className="mb-10 md:mb-16 lg:mb-20 text-center">
          <p className="font-sans text-[11px] sec-text-55 uppercase tracking-[0.18em] mb-5">
            {r.ctaLabel[lang]}
          </p>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group inline-flex items-center gap-3 bg-[var(--cta-bg,#3D5A4C)] text-pure-white font-sans text-sm uppercase tracking-wide px-10 py-4 rounded-full overflow-hidden relative transition-transform duration-200 active:scale-[0.98] hover:shadow-lg"
          >
            <span className="absolute inset-0 bg-[var(--cta-bg-hover,#4a6e5d)] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
            <span className="relative z-10">{r.ctaButton[lang]}</span>
            <svg className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        {/* In-Room Essentials */}
        <div className="essentials-card card-surface backdrop-blur-sm rounded-xl p-8 md:p-12 lg:p-16">
          <h3 className="font-serif text-3xl md:text-[40px] sec-text text-center mb-2">
            {r.essentialsTitle[lang]}
          </h3>
          <p className="font-sans text-base italic sec-text-70 text-center mb-10 md:mb-12">
            {r.essentialsSub[lang]}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
            {essentials.map((item) => (
              <div key={item} className="ess-item flex items-center gap-3">
                <Check className="text-sage-green flex-shrink-0" size={20} />
                <span className="font-sans text-base font-light sec-text">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResidencesSection;
