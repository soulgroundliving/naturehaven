import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SectionHeader from '@/components/SectionHeader';
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
  {
    icon: KeyIcon,
    title: 'Digital Access',
    desc: 'Digital door lock — secure unit & building access',
  },
  {
    icon: ShieldIcon,
    title: 'Security',
    desc: 'CCTV security — monitored around the clock',
  },
  {
    icon: CarIcon,
    title: 'Parking',
    desc: 'Parking — 1 space per unit',
  },
  {
    icon: LeafIcon,
    title: 'Pocket Garden',
    desc: 'Pocket garden — a breath of green in your day',
  },
  {
    icon: WashingIcon,
    title: 'Laundry',
    desc: 'Laundry & drying area — convenient and clean',
  },
  {
    icon: WifiIcon,
    title: 'High-Speed Internet',
    desc: 'Free Wi-Fi — AIS Fiber connectivity',
  },
  {
    icon: SparkleIcon,
    title: 'Cleaning Service',
    desc: 'Cleaning service — every 6 months',
  },
  {
    icon: SnowflakeIcon,
    title: 'AC Maintenance',
    desc: 'Air conditioner cleaning — yearly service',
  },
];

const AmenitiesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const cards = sectionRef.current.querySelectorAll('.amenity-card');
      gsap.from(cards, {
        y: 25,
        opacity: 0,
        scale: 0.97,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cards[0] as Element,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      const cta = sectionRef.current.querySelector('.amenities-cta');
      gsap.from(cta, {
        y: 15,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cta as Element,
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
      id="amenities"
      className="section-padding bg-soft-taupe"
    >
      <div className="container-main">
        <SectionHeader
          label="Amenities"
          headline="Everything you need, thoughtfully provided."
          align="center"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {amenities.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="amenity-card bg-pure-white rounded-xl p-8 md:p-10 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className="w-12 h-12 flex items-center justify-center text-sage-green mb-5">
                <Icon size={28} />
              </div>
              <h4 className="font-serif text-xl md:text-2xl text-dark-charcoal mb-3">
                {title}
              </h4>
              <p className="font-sans text-[15px] font-light text-dark-charcoal/80 leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>

        <div className="amenities-cta text-center mt-16">
          <p className="font-sans text-lg font-light text-dark-charcoal mb-6">
            Ready to make this your home?
          </p>
          <PrimaryButton href="#contact">Reserve Now</PrimaryButton>
        </div>
      </div>
    </section>
  );
};

export default AmenitiesSection;