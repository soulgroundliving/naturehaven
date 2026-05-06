import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { LineIcon } from '@/components/icons';

gsap.registerPlugin(ScrollTrigger);

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
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="section-padding bg-pure-white/30 backdrop-blur-xl"
    >
      <div className="container-main">
        <div className="text-center mb-12">
          <p className="contact-animate section-label text-dark-charcoal/50 mb-4 tracking-[0.2em]">
            Contact
          </p>
          <h2 className="contact-animate font-serif text-4xl md:text-5xl lg:text-6xl xl:text-[80px] text-dark-charcoal leading-[1.1]">
            Reserve your space quietly.
          </h2>
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
          <p className="font-sans text-base font-light text-dark-charcoal/50 text-center">
            We answer fastest on LINE.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
