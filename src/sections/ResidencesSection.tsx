import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SectionHeader from '@/components/SectionHeader';
import { Check } from '@/components/icons';

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
      className="section-padding bg-pure-white"
    >
      <div className="container-main">
        <SectionHeader
          label="Residences"
          headline="Spaces designed for real living — comfortable, intentional, and meant to last."
        />

        {/* Three Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 md:mb-20">
          {/* Suitable For */}
          <div className="res-card bg-light-warm-grey rounded-xl p-8 md:p-12">
            <h3 className="font-serif text-2xl md:text-[32px] text-dark-charcoal mb-6">
              Suitable For
            </h3>
            <ul className="space-y-3">
              {suitableFor.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage-green flex-shrink-0" />
                  <span className="font-sans text-base font-light text-dark-charcoal">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Space & Layout */}
          <div className="res-card bg-light-warm-grey rounded-xl p-8 md:p-12">
            <h3 className="font-serif text-2xl md:text-[32px] text-dark-charcoal mb-4">
              Space & Layout
            </h3>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-serif text-6xl md:text-7xl lg:text-[80px] text-dark-charcoal leading-none">
                31.5
              </span>
              <span className="font-sans text-base text-subtle-taupe">
                sq.m.
              </span>
            </div>
            <div className="w-full h-px bg-dark-charcoal/20 my-4" />
            <p className="font-sans text-base font-light text-dark-charcoal mb-1">
              1 Bedroom / 1 Bathroom
            </p>
            <p className="font-sans text-base font-light text-dark-charcoal mb-3">
              Separate kitchen with balcony
            </p>
            <div className="flex flex-col gap-1">
              <span className="font-sans text-sm text-subtle-taupe">
                Units 1–2
              </span>
              <span className="font-sans text-sm text-subtle-taupe">
                Units 3–4 (Pet Allowed)
              </span>
            </div>
          </div>

          {/* Rental Rates */}
          <div className="res-card bg-light-warm-grey rounded-xl p-8 md:p-12">
            <h3 className="font-serif text-2xl md:text-[32px] text-dark-charcoal mb-6">
              Rental
            </h3>

            {/* Rate 1 */}
            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-4xl md:text-5xl text-dark-charcoal">
                  5,800
                </span>
                <span className="font-sans text-sm text-subtle-taupe">
                  THB / month
                </span>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <span className="inline-block bg-subtle-taupe/20 text-dark-charcoal text-xs font-sans font-normal px-4 py-1.5 rounded-full">
                  Opening Rate
                </span>
                <span className="font-sans text-sm text-subtle-taupe line-through">
                  Regular: 6,000 THB
                </span>
              </div>
            </div>

            {/* Rate 2 */}
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-4xl md:text-5xl text-dark-charcoal">
                  6,200
                </span>
                <span className="font-sans text-sm text-subtle-taupe">
                  THB / month
                </span>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <span className="inline-block bg-subtle-taupe/20 text-dark-charcoal text-xs font-sans font-normal px-4 py-1.5 rounded-full">
                  Opening Rate
                </span>
                <span className="font-sans text-sm text-subtle-taupe line-through">
                  Regular: 6,500 THB
                </span>
              </div>
            </div>

            <p className="font-sans text-sm italic text-sage-green mt-6">
              All-inclusive of common area & services
            </p>

            <div className="w-full h-px bg-dark-charcoal/10 mt-6 mb-4" />
            <p className="font-sans text-sm text-subtle-taupe">
              Annual contract • 1-month deposit + 1-month advance
            </p>
          </div>
        </div>

        {/* In-Room Essentials */}
        <div className="essentials-card bg-light-warm-grey rounded-xl p-8 md:p-12 lg:p-16">
          <h3 className="font-serif text-3xl md:text-[40px] text-dark-charcoal text-center mb-2">
            In-Room Essentials
          </h3>
          <p className="font-sans text-base italic text-dark-charcoal/70 text-center mb-10 md:mb-12">
            Every element is selected with purpose.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
            {essentials.map((item) => (
              <div key={item} className="ess-item flex items-center gap-3">
                <Check
                  className="text-sage-green flex-shrink-0"
                  size={20}
                />
                <span className="font-sans text-base font-light text-dark-charcoal">
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