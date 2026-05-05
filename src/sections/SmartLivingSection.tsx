import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Check, LeafIcon } from '@/components/icons';

gsap.registerPlugin(ScrollTrigger);

const smartFeatures = [
  'Booking & payments',
  'Maintenance requests',
  'Air quality monitoring',
  'Pet vaccination tracking',
];

const sustainabilityFeatures = [
  'Solar energy integration',
  'Long-term material durability',
  'Energy-conscious design',
];

const SmartLivingSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const leftCol = sectionRef.current.querySelectorAll('.sl-left');
      gsap.from(leftCol, {
        x: -20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: leftCol[0] as Element,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      const rightCol = sectionRef.current.querySelectorAll('.sl-right');
      gsap.from(rightCol, {
        x: 20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        delay: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: rightCol[0] as Element,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="smart-living"
      className="section-padding bg-pure-white"
    >
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
          {/* Smart Living */}
          <div>
            <p className="sl-left section-label mb-4">Smart Living</p>
            <h2 className="sl-left font-serif text-3xl md:text-4xl lg:text-[50px] text-dark-charcoal leading-[1.2] mb-4">
              A digital management system designed for modern living.
            </h2>
            <p className="sl-left font-sans text-base italic text-dark-charcoal/70 mb-8">
              All in one application.
            </p>

            <ul className="space-y-4 mb-10">
              {smartFeatures.map((feature) => (
                <li key={feature} className="sl-left flex items-center gap-3">
                  <Check className="text-sage-green flex-shrink-0" size={18} />
                  <span className="font-sans text-base font-light text-dark-charcoal">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <div className="sl-left">
              <img
                src="/assets/smart-living-app.jpg"
                alt="Smart living app"
                className="w-full max-w-md rounded-lg shadow-md object-cover"
              />
            </div>
          </div>

          {/* Sustainability */}
          <div>
            <p className="sl-right section-label mb-4">Sustainability</p>
            <h2 className="sl-right font-serif text-3xl md:text-4xl lg:text-[50px] text-dark-charcoal leading-[1.2] mb-8">
              Built with the future in mind.
            </h2>

            <ul className="space-y-4 mb-10">
              {sustainabilityFeatures.map((feature) => (
                <li key={feature} className="sl-right flex items-center gap-3">
                  <LeafIcon className="text-sage-green flex-shrink-0" size={18} />
                  <span className="font-sans text-base font-light text-dark-charcoal">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <div className="sl-right">
              <img
                src="/assets/sustainability-solar.jpg"
                alt="Solar panels and greenery"
                className="w-full rounded-lg shadow-md object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SmartLivingSection;