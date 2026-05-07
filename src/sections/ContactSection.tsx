import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { LineIcon } from '@/components/icons';

gsap.registerPlugin(ScrollTrigger);

const journeySteps = [
  {
    num: '01',
    title: 'Explore',
    body: 'Browse the residences. Decide if Nature Haven is the right fit.',
  },
  {
    num: '02',
    title: 'Reach out',
    body: 'Message us on LINE. We'll answer questions and arrange a viewing.',
  },
  {
    num: '03',
    title: 'Reserve',
    body: 'Pay the deposit via PromptPay to hold your unit.',
  },
  {
    num: '04',
    title: 'Move in',
    body: 'Sign the lease. Residences open from August 2026.',
  },
];

const ContactSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

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
          toggleActions: 'play none none none',
        },
      });

      const steps = sectionRef.current.querySelectorAll('.journey-step');
      gsap.from(steps, {
        y: 16,
        opacity: 0,
        duration: 0.55,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: steps[0] as Element,
          start: 'top 82%',
          toggleActions: 'play none none none',
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
          <p className="contact-animate section-label sec-text-60 mb-4 tracking-[0.2em]">
            Contact
          </p>
          <h2 className="contact-animate font-serif text-[28px] md:text-5xl lg:text-6xl xl:text-[80px] sec-text leading-[1.1]">
            Reserve your space quietly.
          </h2>
        </div>

        {/* Booking journey */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-14 md:mb-20">
          {journeySteps.map(({ num, title, body }) => (
            <div key={num} className="journey-step border-t-2 border-sage-green/25 pt-5">
              <span className="block font-serif text-[28px] font-light text-sage-green/60 leading-none mb-4">
                {num}
              </span>
              <h3 className="font-sans text-[14px] font-medium sec-text-90 leading-snug mb-2">
                {title}
              </h3>
              <p className="font-sans text-[12px] sec-text-60 leading-relaxed">
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
          <p className="font-sans text-base font-light sec-text-60 text-center">
            We answer fastest on LINE.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
