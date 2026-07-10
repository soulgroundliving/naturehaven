import React from 'react';
import PrimaryButton from '@/components/PrimaryButton';
import {
  CarIcon,
  LeafIcon,
  WashingIcon,
  SparkleIcon,
  SnowflakeIcon,
} from '@/components/icons';
import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';

const ICONS = [CarIcon, LeafIcon, WashingIcon, SparkleIcon, SnowflakeIcon];
const NUMS  = ['01', '02', '03', '04', '05'];

// Compact, all-five-at-once list. Replaces the former desktop horizontal
// scroll-hijack (the last pinned track on the site) — every amenity is now
// visible on one screen, and the section rides native scroll like the rest.
const AmenitiesSection: React.FC = () => {
  const { lang } = useLanguage();
  const am = TR.amenities;
  const items = am.items[lang];

  return (
    <section id="amenities" className="section-padding frosted-section backdrop-blur-xl">
      <div className="container-main">
        {/* Header */}
        <div className="mb-8 md:mb-12 max-w-[620px]">
          <p className="section-label sec-text-60 mb-4">{am.sectionLabel[lang]}</p>
          <h2 className="headline-lg sec-text">
            {am.headline[lang].split('\n').map((line, i, arr) => (
              <React.Fragment key={i}>{line}{i < arr.length - 1 && <br />}</React.Fragment>
            ))}
          </h2>
          <p className="mt-4 font-sans text-[15px] font-light leading-relaxed sec-text-70 max-w-[440px]">
            {am.subtext[lang]}
          </p>
        </div>

        {/* All five — one screen, no scroll-hijack */}
        <ul className="border-t sec-border">
          {items.map(({ label, desc }, idx) => {
            const Icon = ICONS[idx];
            return (
              <li
                key={idx}
                className="flex items-center gap-4 border-b sec-border py-4 md:gap-6 md:py-5"
              >
                <span className="w-6 flex-none font-serif text-base tabular-nums sec-text-55 md:text-lg">
                  {NUMS[idx]}
                </span>
                <Icon size={22} className="flex-none text-sage-green" />
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-lg leading-tight sec-text md:text-2xl">
                    {label}
                  </h3>
                  <p className="mt-0.5 font-sans text-[13px] font-light leading-snug sec-text-70 md:text-sm">
                    {desc}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        {/* CTA */}
        <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between md:mt-12">
          <p className="max-w-[420px] font-serif text-xl leading-snug sec-text md:text-2xl">
            {am.ctaHeadline[lang].split('\n').join(' ')}
          </p>
          <PrimaryButton href="#contact">{am.ctaButton[lang]}</PrimaryButton>
        </div>
      </div>
    </section>
  );
};

export default AmenitiesSection;
