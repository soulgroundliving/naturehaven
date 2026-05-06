import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import PrimaryButton from '@/components/PrimaryButton';
import {
  KeyIcon,
  ShieldIcon,
  CarIcon,
  LeafIcon,
  WashingIcon,
  WifiIcon,
  SparkleIcon,
  SnowflakeIcon,
} from '@/components/icons';

gsap.registerPlugin(ScrollTrigger);

const amenities = [
  { Icon: KeyIcon,      label: 'Digital door lock',   desc: 'Keyless entry — unit & building' },
  { Icon: ShieldIcon,   label: 'CCTV security',        desc: '24 / 7 perimeter monitoring' },
  { Icon: CarIcon,      label: 'Parking',              desc: 'One dedicated bay per unit' },
  { Icon: LeafIcon,     label: 'Pocket garden',        desc: 'A communal garden to breathe in' },
  { Icon: WashingIcon,  label: 'Laundry & drying',     desc: 'On-site, clean, and convenient' },
  { Icon: WifiIcon,     label: 'Free Wi-Fi',           desc: 'AIS Fiber — no shared throttle' },
  { Icon: SparkleIcon,  label: 'Cleaning service',     desc: 'Common areas, every 6 months' },
  { Icon: SnowflakeIcon,label: 'A/C maintenance',      desc: 'Serviced annually — no extra cost' },
];

const AmenitiesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const header = sectionRef.current.querySelectorAll('.am-header-anim');
      gsap.from(header, {
        y: 18,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: header[0] as Element,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      const rows = sectionRef.current.querySelectorAll('.am-row-anim');
      gsap.from(rows, {
        x: -16,
        opacity: 0,
        duration: 0.55,
        stagger: 0.07,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: rows[0] as Element,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      const cta = sectionRef.current.querySelector('.am-cta-anim');
      gsap.from(cta, {
        y: 12,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cta as Element,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="amenities"
      className="section-padding frosted-section backdrop-blur-xl"
    >
      <div className="container-main">
        {/* Header */}
        <div className="max-w-xl mb-10 md:mb-16">
          <p className="am-header-anim section-label sec-text-60 mb-4 tracking-[0.2em]">
            Amenities
          </p>
          <h2 className="am-header-anim font-serif text-3xl md:text-4xl lg:text-[44px] sec-text leading-[1.1]">
            Everything in place,<br />
            before you arrive.
          </h2>
        </div>

        {/* Amenity list — two columns, editorial rule-separated rows */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 lg:gap-x-24">
          {amenities.map(({ Icon, label, desc }) => (
            <div
              key={label}
              className="am-row-anim flex items-start gap-4 py-5 border-t sec-border last:border-b md:last:border-b-0"
            >
              <Icon
                size={14}
                className="text-sage-green flex-shrink-0 mt-[5px] opacity-70"
              />
              <div>
                <p className="font-sans text-[14px] font-medium sec-text-90 leading-snug">
                  {label}
                </p>
                <p className="font-sans text-[12px] sec-text-60 mt-0.5 leading-snug">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="am-cta-anim mt-10 md:mt-16 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <p className="font-sans text-[15px] font-light sec-text-70 max-w-xs leading-relaxed">
            Every item above is included in your monthly rate — nothing hidden.
          </p>
          <PrimaryButton href="#contact">Reserve a Unit</PrimaryButton>
        </div>
      </div>
    </section>
  );
};

export default AmenitiesSection;
