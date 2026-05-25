import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
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

gsap.registerPlugin(ScrollTrigger);

const ICONS = [CarIcon, LeafIcon, WashingIcon, SparkleIcon, SnowflakeIcon];
const NUMS  = ['01', '02', '03', '04', '05'];

const AmenitiesSection: React.FC = () => {
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const sectionRef  = useRef<HTMLDivElement>(null);
  const trackRef    = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const { lang } = useLanguage();
  const am = TR.amenities;
  const items = am.items[lang];

  useGSAP(
    () => {
      const track   = trackRef.current;
      const section = sectionRef.current;
      const wrapper = wrapperRef.current;
      if (!track || !section || !wrapper) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (window.matchMedia('(max-width: 767px)').matches) return;

      let cachedDist = 0;
      const refreshState = () => {
        cachedDist = Math.max(0, track.scrollWidth - section.offsetWidth);
        wrapper.style.height = `${window.innerHeight + cachedDist}px`;
      };
      refreshState();

      const setX        = gsap.quickSetter(track, 'x', 'px') as (v: number) => void;
      const setProgress = progressRef.current
        ? gsap.quickSetter(progressRef.current, 'scaleX') as (v: number) => void
        : null;
      gsap.set(track, { x: 0 });

      ScrollTrigger.create({
        trigger: wrapper,
        start: 'top top',
        end: () => `+=${Math.max(1, cachedDist)}`,
        invalidateOnRefresh: true,
        onRefreshInit: refreshState,
        onLeaveBack: () => {
          gsap.set(track, { x: 0 });
          if (setProgress) setProgress(0);
        },
        onUpdate: (st) => {
          if (cachedDist <= 0) return;
          setX(-cachedDist * st.progress);
          if (setProgress) setProgress(st.progress);
        },
      });
    },
    { scope: wrapperRef, dependencies: [lang] }
  );

  return (
    <div ref={wrapperRef}>
    <section
      ref={sectionRef}
      id="amenities"
      className="overflow-hidden relative"
      style={{ background: 'var(--sec-bg, rgba(255,255,255,0.55))', position: 'sticky', top: 0 }}
    >
      <div
        ref={trackRef}
        className="am-track flex items-stretch md:h-[100dvh]"
        style={{ willChange: 'transform' }}
      >
        {/* Intro card */}
        <div
          className="am-intro flex-shrink-0 flex flex-col justify-between p-8 md:p-10 lg:p-16"
          style={{ width: 'clamp(300px, 38vw, 520px)' }}
        >
          <p className="font-sans text-[10px] uppercase tracking-[0.22em]" style={{ color: 'var(--sec-text-60)' }}>
            {am.sectionLabel[lang]}
          </p>
          <div>
            <h2
              className="font-serif leading-[1.05]"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', color: 'var(--sec-text)' }}
            >
              {am.introHeadline[lang].split('\n').map((line, i, arr) => (
                <React.Fragment key={i}>{line}{i < arr.length - 1 && <br />}</React.Fragment>
              ))}
            </h2>
            <p className="font-sans font-light mt-5 leading-relaxed" style={{ fontSize: '0.9375rem', color: 'var(--sec-text-70)', maxWidth: '340px' }}>
              {am.introBody[lang]}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3" style={{ color: 'var(--sec-text-55)' }}>
            <span className="font-sans text-[10px] uppercase tracking-[0.2em]">{am.scrollHint[lang]}</span>
            <svg width="28" height="10" viewBox="0 0 28 10" fill="none" aria-hidden="true">
              <path d="M1 5h26M22 1l5 4-5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <div className="am-divider flex-shrink-0 self-stretch" style={{ width: '1px', background: 'var(--sec-border)', margin: '2.5rem 0' }} />

        {items.map(({ label, desc }, idx) => {
          const Icon = ICONS[idx];
          const num  = NUMS[idx];
          return (
            <React.Fragment key={idx}>
              <div
                className="am-card flex-shrink-0 flex flex-col justify-between px-10 py-12 md:px-14 md:py-16 relative"
                style={{ width: 'clamp(260px, 28vw, 380px)' }}
              >
                <span
                  className="absolute bottom-10 right-8 font-serif select-none pointer-events-none"
                  style={{ fontSize: 'clamp(5rem, 12vw, 9rem)', lineHeight: 1, color: 'var(--sec-text)', opacity: 0.045 }}
                  aria-hidden="true"
                >
                  {num}
                </span>
                <div className="flex flex-col gap-6">
                  <span className="font-sans text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--sec-text-55)' }}>{num}</span>
                  <Icon size={22} className="text-sage-green opacity-80" />
                </div>
                <div>
                  <div className="w-8 h-px mb-6" style={{ background: 'var(--sec-border)' }} />
                  <h3 className="font-serif leading-tight mb-3" style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.25rem)', color: 'var(--sec-text)' }}>
                    {label}
                  </h3>
                  <p className="font-sans font-light leading-relaxed" style={{ fontSize: '0.875rem', color: 'var(--sec-text-70)', maxWidth: '240px' }}>
                    {desc}
                  </p>
                </div>
              </div>
              <div className="am-divider flex-shrink-0 self-stretch" style={{ width: '1px', background: 'var(--sec-border)', margin: '2.5rem 0' }} />
            </React.Fragment>
          );
        })}

        {/* CTA card */}
        <div
          className="am-cta flex-shrink-0 flex flex-col justify-center px-8 py-10 md:px-12 lg:px-16"
          style={{ width: 'clamp(280px, 32vw, 440px)' }}
        >
          <p className="font-sans text-[10px] uppercase tracking-[0.22em] mb-6" style={{ color: 'var(--sec-text-55)' }}>
            {am.ctaTag[lang]}
          </p>
          <p className="font-serif leading-snug mb-8" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: 'var(--sec-text)' }}>
            {am.ctaHeadline[lang].split('\n').map((line, i, arr) => (
              <React.Fragment key={i}>{line}{i < arr.length - 1 && <br />}</React.Fragment>
            ))}
          </p>
          <p className="font-sans font-light leading-relaxed mb-10" style={{ fontSize: '0.9375rem', color: 'var(--sec-text-70)', maxWidth: '300px' }}>
            {am.ctaBody[lang]}
          </p>
          <PrimaryButton href="#contact">{am.ctaBtn[lang]}</PrimaryButton>
        </div>
      </div>

      <div
        className="am-progress absolute bottom-0 left-0 w-full pointer-events-none"
        style={{ height: '1px', background: 'var(--sec-border)' }}
        aria-hidden="true"
      >
        <div
          ref={progressRef}
          className="h-full"
          style={{ background: 'var(--sec-text-55)', transformOrigin: 'left center', transform: 'scaleX(0)' }}
        />
      </div>
    </section>
    </div>
  );
};

export default AmenitiesSection;
