import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SectionHeader from '@/components/SectionHeader';
import { Check } from '@/components/icons';
import { PawPrint } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';

gsap.registerPlugin(ScrollTrigger);

const ALL_ROOMS = [
  {
    key: 'galleryBedroom',
    src: '/assets/room-3d-render.jpg',
    alt: 'Bedroom interior — 31.5 sq.m.',
    eager: true,
  },
  {
    key: 'galleryBathroom',
    src: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1600&fit=crop&auto=format&q=80',
    alt: 'Minimal bathroom with natural light',
    eager: false,
  },
  {
    key: 'galleryKitchen',
    src: 'https://images.unsplash.com/photo-1757439402103-fc35542f96f8?w=1600&fit=crop&auto=format&q=80',
    alt: 'Separate kitchen with minimal fittings',
    eager: false,
  },
  {
    key: 'galleryBalcony',
    src: 'https://images.unsplash.com/photo-1725399103001-200ce2bb5350?w=1600&fit=crop&auto=format&q=80',
    alt: 'Private balcony overlooking the garden',
    eager: false,
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

      // Pinned scrollytelling room gallery — desktop only (mobile stacks vertically)
      const galleryWrap = sectionRef.current.querySelector('.gallery-wrap');
      const frames = galleryWrap?.querySelectorAll<HTMLElement>('.gallery-frame');
      const dots   = galleryWrap?.querySelectorAll<HTMLElement>('.gal-dot');
      if (galleryWrap && frames && frames.length > 0) {
        const N = frames.length;
        const opSetters  = Array.from(frames).map(f => gsap.quickSetter(f, 'opacity') as (v: number) => void);
        const dotSetters = dots ? Array.from(dots).map(d => gsap.quickSetter(d, 'backgroundColor') as (v: string) => void) : [];
        // Initial state — only first frame visible
        opSetters.forEach((set, i) => set(i === 0 ? 1 : 0));
        dotSetters.forEach((set, i) => set(i === 0 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)'));

        ScrollTrigger.create({
          trigger: galleryWrap,
          start: 'top top',
          end: 'bottom bottom',
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            const fadeWindow = 0.05; // crossfade band before each frame's anchor
            // Stack-layered crossfade: each frame i becomes visible at progress i/N
            for (let i = 0; i < N; i++) {
              if (i === 0) {
                opSetters[i](1); // frame 0 always present underneath
                continue;
              }
              const target = i / N;
              const fadeStart = target - fadeWindow;
              let op = 0;
              if (p >= target) op = 1;
              else if (p >= fadeStart) op = (p - fadeStart) / fadeWindow;
              opSetters[i](op);
            }
            // Active dot — based on which slot the progress is currently in
            const activeIdx = Math.min(N - 1, Math.floor(p * N + fadeWindow));
            dotSetters.forEach((set, i) => set(i === activeIdx ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)'));
          },
        });
      }

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
        const obj = { val: 28 };
        gsap.to(obj, {
          val: 31.5,
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
                31.5
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

        {/* Pricing Tiers */}
        <div className="mb-10 md:mb-16 lg:mb-20">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <p className="font-sans text-[10px] sec-text-60 uppercase tracking-[0.18em]">{r.pricingLabel[lang]}</p>
            <p className="font-sans text-[10px] sec-text-55 uppercase tracking-[0.14em]">{r.pricingNote[lang]}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Standard tier */}
            <div className="tier-card rounded-xl border sec-border card-surface p-6 md:p-8">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-sans text-[10px] sec-text-60 uppercase tracking-[0.18em]">{r.tierFloors1[lang]}</span>
              </div>
              <p className="font-sans text-base font-medium leading-snug mb-5 sec-text-90">{r.tierNameStd[lang]}</p>
              <div className="pt-4 border-t sec-border">
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="font-serif text-[28px] sec-text leading-none">7,000</span>
                  <span className="font-sans text-[11px] sec-text-60">THB / mo</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="inline-block bg-subtle-taupe/20 sec-text text-[10px] font-sans px-2.5 py-1 rounded-full whitespace-nowrap">{r.openingRate[lang]}</span>
                  <span className="font-sans text-[11px] sec-text-60 line-through whitespace-nowrap">8,500 THB</span>
                </div>
              </div>
              <div className="mt-5 pt-5 border-t sec-border">
                <ul className="flex flex-col gap-3">
                  <li className="flex flex-col gap-0.5">
                    <span className="font-sans text-[10px] sec-text-55 uppercase tracking-[0.14em]">{r.tierUnitsLabel[lang]}</span>
                    <span className="font-sans text-sm font-light sec-text-80">{"10 units"}</span>
                  </li>
                  <li className="flex flex-col gap-0.5">
                    <span className="font-sans text-[10px] sec-text-55 uppercase tracking-[0.14em]">{r.tierLocationLabel[lang]}</span>
                    <span className="font-sans text-sm font-light sec-text-80">{r.tierLocation1[lang]}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Premium / pet tier */}
            <div className="tier-card rounded-xl border border-sage-green/30 bg-sage-green/5 p-6 md:p-8">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-sans text-[10px] sec-text-60 uppercase tracking-[0.18em]">{r.tierFloors2[lang]}</span>
                <PawPrint size={11} className="text-sage-green opacity-70 flex-shrink-0" />
              </div>
              <p className="font-sans text-base font-medium leading-snug mb-5 text-sage-green">{r.tierNamePet[lang]}</p>
              <div className="pt-4 border-t border-sage-green/20">
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="font-serif text-[28px] sec-text leading-none">7,800</span>
                  <span className="font-sans text-[11px] sec-text-60">THB / mo</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="inline-block bg-subtle-taupe/20 sec-text text-[10px] font-sans px-2.5 py-1 rounded-full whitespace-nowrap">{r.openingRate[lang]}</span>
                  <span className="font-sans text-[11px] sec-text-60 line-through whitespace-nowrap">9,200 THB</span>
                </div>
              </div>
              <div className="mt-5 pt-5 border-t border-sage-green/15">
                <ul className="flex flex-col gap-3">
                  <li className="flex flex-col gap-0.5">
                    <span className="font-sans text-[10px] sec-text-55 uppercase tracking-[0.14em]">{r.tierUnitsLabel[lang]}</span>
                    <span className="font-sans text-sm font-light sec-text-80">{"10 units"}</span>
                  </li>
                  <li className="flex flex-col gap-0.5">
                    <span className="font-sans text-[10px] sec-text-55 uppercase tracking-[0.14em]">{r.tierLocationLabel[lang]}</span>
                    <span className="font-sans text-sm font-light sec-text-80">{r.tierLocation2[lang]}</span>
                  </li>
                  <li className="flex flex-col gap-0.5">
                    <span className="font-sans text-[10px] sec-text-55 uppercase tracking-[0.14em]">{r.tierPetsLabel[lang]}</span>
                    <span className="font-sans text-sm font-light sec-text-80">{r.tierPetsValue[lang]}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Photo Gallery — pinned scrollytelling on desktop, vertical stack on mobile */}
        <div className="gallery-wrap relative mb-10 md:mb-16 lg:mb-20 md:[height:calc(100vh*4)]">
          <div className="gallery-sticky relative md:sticky md:top-0 md:h-screen w-full md:overflow-hidden md:rounded-xl flex flex-col md:block gap-2.5 md:gap-0">
            {ALL_ROOMS.map((room, i) => (
              <div
                key={room.key}
                className="gallery-frame relative md:absolute md:inset-0 aspect-[4/3] md:aspect-auto md:h-full rounded-xl md:rounded-none overflow-hidden"
                data-idx={i}
              >
                <img
                  src={room.src}
                  alt={room.alt}
                  loading={room.eager ? 'eager' : 'lazy'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent p-6 md:p-12 lg:p-16">
                  <span className="block font-sans text-[10px] md:text-[11px] text-white/70 uppercase tracking-[0.25em] mb-2">
                    {String(i + 1).padStart(2, '0')} <span className="opacity-50">/ 04</span>
                  </span>
                  <h3 className="font-serif text-2xl md:text-5xl lg:text-6xl text-white leading-[1.05]">
                    {r[room.key as keyof typeof r][lang]}
                  </h3>
                </div>
              </div>
            ))}

            {/* Progress dots — desktop only */}
            <div className="hidden md:flex absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 gap-2.5 z-10">
              {ALL_ROOMS.map((_, i) => (
                <div
                  key={i}
                  className="gal-dot w-2 h-2 rounded-full transition-colors duration-300"
                  data-idx={i}
                  style={{ backgroundColor: i === 0 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)' }}
                />
              ))}
            </div>
          </div>
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
