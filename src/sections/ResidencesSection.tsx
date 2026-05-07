import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SectionHeader from '@/components/SectionHeader';
import { Check } from '@/components/icons';
import { PawPrint } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const suitableFor = [
  '1–2 residents',
  'Working professionals',
  'Couples',
  'Those who value quiet living',
  'Small pets (1–2 allowed)',
];

const essentials = [
  'Built-in furniture (functional & minimal)',
  '5 ft bed with ergonomic mattress',
  'Work desk / wardrobe / shelving / chair',
  'Full-length mirror',
  'Air conditioner',
  'Refrigerator & microwave',
  'Water heater',
  'Full blackout curtains',
  'Air ventilation system',
];

const roomPhotos = [
  {
    src: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&fit=crop&auto=format&q=80',
    label: 'Bathroom',
    alt: 'Minimal bathroom with natural light',
  },
  {
    src: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&fit=crop&auto=format&q=80',
    label: 'Kitchen',
    alt: 'Separate kitchen with minimal fittings',
  },
  {
    src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&fit=crop&auto=format&q=80',
    label: 'Balcony',
    alt: 'Private balcony overlooking the garden',
  },
];

const ResidencesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

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
          toggleActions: 'play none none none',
        },
      });

      const mainPhoto = sectionRef.current.querySelector('.gallery-main');
      gsap.from(mainPhoto, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: mainPhoto as Element,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      });

      const thumbs = sectionRef.current.querySelectorAll('.gallery-thumb');
      gsap.from(thumbs, {
        y: 16,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: thumbs[0] as Element,
          start: 'top 85%',
          toggleActions: 'play none none none',
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
          toggleActions: 'play none none none',
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
          toggleActions: 'play none none none',
        },
      });
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
          label="Residences"
          headline="Spaces designed for real living — comfortable, intentional, and meant to last."
          dark
        />

        {/* Three Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 md:mb-16 lg:mb-20">
          {/* Suitable For */}
          <div className="res-card card-surface backdrop-blur-sm rounded-xl p-8 md:p-12">
            <h3 className="font-serif text-2xl md:text-[32px] sec-text mb-6">
              Suitable For
            </h3>
            <ul className="space-y-3">
              {suitableFor.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage-green flex-shrink-0" />
                  <span className="font-sans text-base font-light sec-text">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Space & Layout */}
          <div className="res-card card-surface backdrop-blur-sm rounded-xl p-8 md:p-12">
            <h3 className="font-serif text-2xl md:text-[32px] sec-text mb-4">
              Space & Layout
            </h3>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-serif text-6xl md:text-7xl lg:text-[80px] sec-text leading-none">
                31.5
              </span>
              <span className="font-sans text-base sec-text-60">
                sq.m.
              </span>
            </div>
            <div className="w-full h-px bg-dark-charcoal/20 my-4" />
            <p className="font-sans text-base font-light sec-text mb-1">
              1 Bedroom / 1 Bathroom
            </p>
            <p className="font-sans text-base font-light sec-text mb-5">
              Separate kitchen with balcony
            </p>

            {/* Unit type split */}
            <div className="grid grid-cols-2 gap-3">
              {/* Units 1–2 */}
              <div className="rounded-xl border sec-border p-4">
                <p className="font-sans text-[10px] sec-text-60 uppercase tracking-[0.18em] mb-2">
                  Units 1–2
                </p>
                <p className="font-sans text-sm font-medium sec-text-90 leading-snug mb-4">
                  Standard
                </p>
                <div className="pt-3 border-t sec-border">
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="font-serif text-[22px] sec-text leading-none">5,800</span>
                    <span className="font-sans text-[11px] sec-text-60">THB / mo</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="inline-block bg-subtle-taupe/20 sec-text text-[10px] font-sans px-2.5 py-1 rounded-full whitespace-nowrap">
                      Opening Rate
                    </span>
                    <span className="font-sans text-[11px] sec-text-60 line-through whitespace-nowrap">
                      6,000 THB
                    </span>
                  </div>
                </div>
              </div>

              {/* Units 3–4 */}
              <div className="rounded-xl border border-sage-green/30 bg-sage-green/5 p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <p className="font-sans text-[10px] uppercase tracking-[0.18em]"
                     style={{ color: 'var(--sage-green, #3D5A4C)', opacity: 0.75 }}>
                    Units 3–4
                  </p>
                  <PawPrint size={11} className="text-sage-green opacity-70 flex-shrink-0" />
                </div>
                <p className="font-sans text-sm font-medium text-sage-green leading-snug mb-4">
                  Pet Friendly
                </p>
                <div className="pt-3 border-t border-sage-green/20">
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="font-serif text-[22px] sec-text leading-none">6,200</span>
                    <span className="font-sans text-[11px] sec-text-60">THB / mo</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="inline-block bg-subtle-taupe/20 sec-text text-[10px] font-sans px-2.5 py-1 rounded-full whitespace-nowrap">
                      Opening Rate
                    </span>
                    <span className="font-sans text-[11px] sec-text-60 line-through whitespace-nowrap">
                      6,500 THB
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="res-card card-surface backdrop-blur-sm rounded-xl p-8 md:p-12">
            <h3 className="font-serif text-2xl md:text-[32px] sec-text mb-8">
              Terms
            </h3>

            <ul className="flex flex-col gap-5">
              <li className="flex flex-col gap-1">
                <span className="font-sans text-[10px] sec-text-60 uppercase tracking-[0.18em]">
                  Contract
                </span>
                <span className="font-sans text-base font-light sec-text">
                  Annual (12 months)
                </span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="font-sans text-[10px] sec-text-60 uppercase tracking-[0.18em]">
                  Move-in
                </span>
                <span className="font-sans text-base font-light sec-text">
                  1-month deposit + 1-month advance
                </span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="font-sans text-[10px] sec-text-60 uppercase tracking-[0.18em]">
                  Available from
                </span>
                <span className="font-sans text-base font-light sec-text">
                  August 2026
                </span>
              </li>
            </ul>

            <div className="w-full h-px bg-dark-charcoal/10 mt-8 mb-5" />
            <p className="font-sans text-sm italic text-sage-green leading-relaxed">
              All-inclusive — amenities, Wi-Fi, cleaning &amp; A/C service covered in monthly rate.
            </p>
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="mb-10 md:mb-16 lg:mb-20 flex flex-col gap-2.5">
          {/* Main — bedroom */}
          <div className="gallery-main relative rounded-xl overflow-hidden">
            <img
              src="/assets/room-3d-render.jpg"
              alt="Bedroom interior — 31.5 sq.m."
              className="w-full object-cover aspect-[16/9] md:aspect-[21/9]"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/35 to-transparent p-4 md:p-6">
              <span className="font-sans text-[10px] md:text-[11px] text-white/75 uppercase tracking-[0.2em]">
                Bedroom
              </span>
            </div>
          </div>

          {/* Secondary — bathroom · kitchen · balcony */}
          <div className="grid grid-cols-3 gap-2.5">
            {roomPhotos.map(({ src, label, alt }) => (
              <div key={label} className="gallery-thumb relative rounded-xl overflow-hidden aspect-square">
                <img
                  src={src}
                  alt={alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/40 to-transparent p-2 md:p-4">
                  <span className="font-sans text-[9px] md:text-[11px] text-white/75 uppercase tracking-[0.2em]">
                    {label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* In-Room Essentials */}
        <div className="essentials-card card-surface backdrop-blur-sm rounded-xl p-8 md:p-12 lg:p-16">
          <h3 className="font-serif text-3xl md:text-[40px] sec-text text-center mb-2">
            In-Room Essentials
          </h3>
          <p className="font-sans text-base italic sec-text-70 text-center mb-10 md:mb-12">
            Every element is selected with purpose.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
            {essentials.map((item) => (
              <div key={item} className="ess-item flex items-center gap-3">
                <Check
                  className="text-sage-green flex-shrink-0"
                  size={20}
                />
                <span className="font-sans text-base font-light sec-text">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResidencesSection;