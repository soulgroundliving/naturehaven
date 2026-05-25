import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { LineIcon } from '@/components/icons';
import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';

gsap.registerPlugin(ScrollTrigger);

const ContactSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { lang } = useLanguage();
  const c = TR.contact;
  const steps = c.steps[lang];

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      if (window.matchMedia('(max-width: 767px)').matches) return;

      const items = sectionRef.current.querySelectorAll('.contact-animate');
      gsap.from(items, {
        y: 20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });

      const stepEls = sectionRef.current.querySelectorAll('.journey-step');
      gsap.from(stepEls, {
        y: 16,
        opacity: 0,
        duration: 0.55,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: stepEls[0] as Element,
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="section-padding frosted-section backdrop-blur-xl"
    >
      <div className="container-main">
        <div className="text-center mb-12">
          <p className="contact-animate section-label mb-4 tracking-[0.2em]">
            {c.sectionLabel[lang]}
          </p>
          <h2 className="contact-animate font-serif text-[28px] md:text-5xl lg:text-6xl xl:text-[80px] leading-[1.1] sec-text">
            {c.headline[lang]}
          </h2>
        </div>

        {/* Booking journey */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-14 md:mb-20">
          {steps.map(({ num, title, body }) => (
            <div key={num} className="journey-step border-t-2 sec-border pt-5">
              <span className="block font-serif text-[80px] md:text-[96px] font-light leading-[1] mb-3 sec-text-55">
                {num}
              </span>
              <h3 className="font-sans text-[15px] font-medium leading-snug mb-2 sec-text-90">
                {title}
              </h3>
              <p className="font-sans text-[13px] leading-relaxed sec-text-60">
                {body}
              </p>
            </div>
          ))}
        </div>

        {/* LINE-only CTA */}
        <div className="contact-animate flex flex-col items-center gap-6">
          <a
            href="https://lin.ee/ZoujovB6"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 bg-[var(--cta-bg,#3D5A4C)] text-pure-white font-sans text-sm uppercase tracking-wide px-10 py-4 rounded-full overflow-hidden transition-transform duration-200 active:scale-[0.98] hover:shadow-lg"
          >
            <span className="absolute inset-0 bg-[var(--cta-bg-hover,#4a6e5d)] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
            <LineIcon className="relative z-10" size={20} />
            <span className="relative z-10">Reserve via LINE</span>
          </a>
          <p className="font-sans text-base font-light text-center sec-text-60">
            {c.lineNote[lang]}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
