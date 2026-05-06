import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

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
          toggleActions: 'play none none none',
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
          toggleActions: 'play none none none',
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
          toggleActions: 'play none none none',
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-padding frosted-section backdrop-blur-xl"
    >
      <div className="container-main">

        {/* Philosophy Block */}
        <div className="mb-12 md:mb-24 lg:mb-32">
          <p className="ph-anim section-label sec-text-60 mb-5 tracking-[0.2em]">
            Our Philosophy
          </p>
          <h2 className="ph-anim font-serif text-[30px] md:text-5xl lg:text-[58px] sec-text leading-[1.07] max-w-2xl">
            True comfort is<br />
            never excessive.
          </h2>
          <p className="ph-anim font-sans text-[15px] font-light sec-text-70 leading-relaxed mt-7 max-w-[440px]">
            It is found in stillness — in spaces that are thoughtfully designed,
            and in a quiet balance that allows each day to unfold with ease.
          </p>
        </div>

        {/* About Block — image left, text right */}
        <div className="grid grid-cols-1 lg:grid-cols-[52%_48%] gap-10 lg:gap-0 items-stretch">

          {/* Image — full-height */}
          <div className="ab-image lg:pr-10 self-stretch">
            <img
              src="/assets/about-minimal-room.jpg"
              alt="Minimal bedroom interior"
              className="w-full object-cover rounded-lg aspect-[4/3] lg:aspect-auto lg:h-full"
            />
          </div>

          {/* Text */}
          <div className="flex flex-col justify-center lg:pl-2">
            <p className="ab-text-anim section-label sec-text-60 mb-5 tracking-[0.2em]">
              About
            </p>
            <h3 className="ab-text-anim font-serif text-[28px] md:text-[34px] lg:text-[38px] sec-text leading-[1.12]">
              A newly built private<br />
              residence inspired<br />
              by MUJI minimal living.
            </h3>
            <p className="ab-text-anim font-sans text-[15px] font-light sec-text-70 leading-relaxed mt-7 max-w-sm">
              Designed for calm, crafted for privacy, and quietly connected
              to Sai Mai Road. Available from August 2026.
            </p>
            <button
              onClick={() => {
                document.getElementById('residences')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="ab-text-anim group mt-9 inline-flex items-center gap-2.5 font-serif italic text-[18px] sec-text hover:text-sage-green transition-colors duration-300 self-start py-2 -my-2"
            >
              <span className="relative">
                View Residences
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
      </div>
    </section>
  );
};

export default AboutSection;
