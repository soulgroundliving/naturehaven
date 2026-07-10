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
    src: '/assets/bathroom-functional.jpg',
    alt: 'The bathroom — oval mirror, D-shape closet and constant-temperature shower',
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

          {/* Private pricing — quiet-luxury posture: rates shared 1:1 via LINE,
              never as a public ladder. */}
          <div className="rounded-xl sec-border border card-surface backdrop-blur-sm p-7 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <p className="font-sans text-[15px] font-light leading-relaxed sec-text-80 max-w-[560px]">
              {r.privateBody[lang]}
            </p>
            <a
              href={PROPERTY.lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-none cursor-pointer items-center gap-2 rounded-full bg-sage-green px-7 py-3.5 font-sans text-xs uppercase tracking-[0.1em] text-pure-white transition-opacity duration-300 hover:opacity-85"
            >
              {r.ctaButton[lang]}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>

        {/* Photo Gallery — 2x2 equal grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-10 md:mb-16 lg:mb-20">
          {/* Bedroom (local asset) */}
          <div className="gallery-tile relative rounded-xl overflow-hidden aspect-[4/3]">
            <img
              src="/assets/room-view-out.jpg"
              alt="Bedroom interior looking toward the entrance — 25.2 sq.m."
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
