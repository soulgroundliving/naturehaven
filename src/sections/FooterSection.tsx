import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const FooterSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const items = sectionRef.current.querySelectorAll('.footer-animate');
      gsap.from(items, {
        y: 15,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });

      const divider = sectionRef.current.querySelector('.footer-divider');
      gsap.from(divider, {
        scaleX: 0,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: divider as Element,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <footer ref={sectionRef} id="footer" className="bg-near-black pt-16 md:pt-20 pb-10">
      <div className="container-main">
        {/* Top Area */}
        <div className="text-center mb-12">
          <h3 className="footer-animate font-serif text-xl md:text-2xl text-warm-brown">
            Nature Haven — Quiet Living in Saimai
          </h3>
          <p className="footer-animate font-sans text-sm font-light text-warm-brown/70 mt-2">
            A residence shaped by intention.
          </p>
        </div>

        {/* Divider */}
        <div className="footer-divider w-full h-px bg-warm-brown/20 mb-8 origin-center" />

        {/* Bottom Area */}
        <div className="footer-animate flex flex-col-reverse md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-[13px] text-warm-brown/50">
            © 2026 Nature Haven. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <a
              href="https://lin.ee/ZoujovB6"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[13px] uppercase tracking-[0.05em] text-warm-brown/60 hover:text-pure-white transition-colors duration-300"
            >
              LINE
            </a>
            <span className="font-sans text-[13px] uppercase tracking-[0.05em] text-warm-brown/60 hover:text-pure-white transition-colors duration-300 cursor-default">
              Instagram
            </span>
            <span className="font-sans text-[13px] uppercase tracking-[0.05em] text-warm-brown/60 hover:text-pure-white transition-colors duration-300 cursor-default">
              Facebook
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;