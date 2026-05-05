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

      const items = sectionRef.current.querySelectorAll('.about-animate');
      gsap.from(items, {
        y: 20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      const image = sectionRef.current.querySelector('.about-image');
      gsap.from(image, {
        y: 30,
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
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-padding bg-soft-taupe"
    >
      <div className="container-main">
        {/* Philosophy Block */}
        <div className="mb-24 md:mb-32">
          <p className="about-animate section-label text-dark-charcoal/70 mb-4">
            Our Philosophy
          </p>
          <div className="about-animate w-10 h-px bg-dark-charcoal mb-6" />
          <h2 className="about-animate headline-lg max-w-[700px]">
            True comfort is never excessive.
          </h2>
          <p className="about-animate body-text max-w-[600px] mt-6">
            It is found in stillness — in spaces that are thoughtfully designed,
            and in a quiet balance that allows each day to unfold with ease.
          </p>
        </div>

        {/* About Block */}
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 lg:gap-16 items-start">
          <div>
            <p className="about-animate section-label text-dark-charcoal/70 mb-4">
              About
            </p>
            <h2 className="about-animate headline-md">
              A newly built private residence inspired by MUJI minimal living.
            </h2>
            <p className="about-animate body-text mt-8">
              Designed for calm, crafted for privacy, and quietly connected to
              Sai Mai Road. Available from August 2026.
            </p>
            <button
              onClick={() => {
                const el = document.getElementById('residences');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="about-animate group mt-8 inline-flex items-center gap-2 font-serif italic text-xl text-dark-charcoal hover:text-sage-green transition-colors duration-300"
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
          <div className="about-image lg:-mt-10">
            <img
              src="/assets/about-minimal-room.jpg"
              alt="Minimal bedroom interior"
              className="w-full rounded-lg shadow-lg object-cover aspect-[3/4]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;