import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';
import RoomCarousel from '@/components/RoomCarousel';

gsap.registerPlugin(ScrollTrigger);

const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { lang } = useLanguage();
  const a = TR.about;

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      if (window.matchMedia('(max-width: 767px)').matches) return;

      const philo = sectionRef.current.querySelectorAll('.ph-anim');
      gsap.from(philo, {
        y: 22,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: philo[0] as Element,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      const image = sectionRef.current.querySelector('.ab-image');
      gsap.from(image, {
        x: -24,
        opacity: 0,
        scale: 0.98,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: image as Element,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      const text = sectionRef.current.querySelectorAll('.ab-text-anim');
      gsap.from(text, {
        x: 20,
        opacity: 0,
        duration: 0.65,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: text[0] as Element,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-padding frosted-section backdrop-blur-xl overflow-hidden"
    >
      {/* Philosophy Block */}
      <div className="container-main mb-12 md:mb-24 lg:mb-32">
        <p className="ph-anim section-label sec-text-60 mb-5 tracking-[0.2em]">
          {a.philosophyLabel[lang]}
        </p>
        <h2 className="ph-anim font-serif text-[30px] md:text-5xl lg:text-[58px] sec-text leading-[1.07] max-w-2xl">
          {a.philosophyHeadline[lang].split('\n').map((line, i, arr) => (
            <React.Fragment key={i}>{line}{i < arr.length - 1 && <br />}</React.Fragment>
          ))}
        </h2>
        <p className="ph-anim font-sans text-[15px] font-light sec-text-70 leading-relaxed mt-7 max-w-[440px]">
          {a.philosophyBody[lang]}
        </p>
      </div>

      {/* About Block — capped, centred editorial columns. The image frame is
          held near-square (≤540 × 600) so the mostly-portrait renders fill it
          instead of floating in wide matte bars; minmax lets both columns
          shrink together on smaller desktops. */}
      <div className="grid grid-cols-1 items-center lg:grid-cols-[minmax(0,540px)_minmax(0,640px)] lg:justify-center lg:gap-14">
        <RoomCarousel className="ab-image h-[380px] md:h-[440px] lg:h-[600px]" />

        <div className="flex flex-col justify-center px-4 md:px-8 lg:px-0 py-10 lg:py-0">
          <p className="ab-text-anim section-label sec-text-60 mb-5 tracking-[0.2em]">
            {a.aboutLabel[lang]}
          </p>
          <h3 className="ab-text-anim font-serif text-[28px] md:text-[34px] lg:text-[38px] sec-text leading-[1.12]">
            {a.aboutHeadline[lang].split('\n').map((line, i, arr) => (
              <React.Fragment key={i}>{line}{i < arr.length - 1 && <br />}</React.Fragment>
            ))}
          </h3>
          <p className="ab-text-anim font-sans text-[15px] font-light sec-text-70 leading-relaxed mt-7 max-w-sm">
            {a.aboutBody[lang]}
          </p>
          <button
            onClick={() => {
              document.getElementById('residences')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="ab-text-anim group mt-9 inline-flex items-center gap-2.5 font-serif italic text-[18px] sec-text hover:text-sage-green transition-colors duration-300 self-start py-2 -my-2"
          >
            <span className="relative">
              {a.aboutButton[lang]}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-current group-hover:w-full transition-all duration-500" />
            </span>
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
