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
    <footer ref={sectionRef} id="footer" className="frosted-section backdrop-blur-xl shadow-sm pt-16 md:pt-20 pb-24 md:pb-10">
      <div className="container-main">
        {/* Top Area */}
        <div className="text-center mb-12">
          <p className="footer-animate font-serif text-[13px] tracking-[0.35em] sec-text-55 mb-5">N · H</p>
          <h3 className="footer-animate font-serif text-xl md:text-2xl sec-text">
            Nature Haven — Quiet Living in Saimai
          </h3>
          <p className="footer-animate font-sans text-sm font-light sec-text-60 mt-2">
            A residence shaped by intention.
          </p>
          <address
            className="footer-animate not-italic mt-3 font-sans text-[13px] sec-text-55 leading-relaxed"
            itemScope
            itemType="https://schema.org/PostalAddress"
          >
            <span itemProp="addressLocality">Sai Mai</span
            >{', '}
            <span itemProp="addressRegion">Bangkok</span
            >{' · '}
            <span itemProp="postalCode">10220</span
            >{' · '}
            <span itemProp="addressCountry">Thailand</span>
          </address>
        </div>

        {/* Divider */}
        <div className="footer-divider w-full h-px sec-border mb-8 origin-center" style={{ background: 'var(--sec-border)' }} />

        {/* Bottom Area */}
        <div className="footer-animate flex flex-col-reverse md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-[13px] sec-text-55">
            © 2026 Nature Haven. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <a
              href="https://lin.ee/ZoujovB6"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[13px] uppercase tracking-[0.05em] sec-text-60 hover:text-sage-green transition-colors duration-300"
            >
              LINE
            </a>
            <span className="font-sans text-[13px] uppercase tracking-[0.05em] sec-text-60 hover:text-sage-green transition-colors duration-300 cursor-default">
              Instagram
            </span>
            <span className="font-sans text-[13px] uppercase tracking-[0.05em] sec-text-60 hover:text-sage-green transition-colors duration-300 cursor-default">
              Facebook
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;