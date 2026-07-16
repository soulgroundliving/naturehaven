import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';
import { PROPERTY } from '@/data/propertyFacts';

gsap.registerPlugin(ScrollTrigger);

const FooterSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { lang } = useLanguage();
  const f = TR.footer;

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (window.matchMedia('(max-width: 767px)').matches) return;

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
          toggleActions: 'play none none reverse',
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
          toggleActions: 'play none none reverse',
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <footer
      ref={sectionRef}
      id="footer"
      className="frosted-section backdrop-blur-xl shadow-sm pt-10 md:pt-16 pb-[calc(env(safe-area-inset-bottom,0px)+80px)] md:pb-8"
    >
      <div className="container-main">
        {/* Top Area */}
        <div className="text-center mb-8">
          <p className="footer-animate font-serif text-[13px] tracking-[0.35em] sec-text-55 mb-5">N · H</p>
          <h3 className="footer-animate font-serif text-xl md:text-2xl sec-text">
            {f.headline[lang]}
          </h3>
          <p className="footer-animate font-sans text-sm font-light sec-text-60 mt-2">
            {f.sub[lang]}
          </p>
          <address
            className="footer-animate not-italic mt-3 font-sans text-[13px] sec-text-55 leading-relaxed"
            itemScope
            itemType="https://schema.org/PostalAddress"
          >
            <span itemProp="addressLocality">Sai Mai</span>
            {', '}
            <span itemProp="addressRegion">Bangkok</span>
            {' · '}
            <span itemProp="postalCode">10220</span>
            {' · '}
            <span itemProp="addressCountry">Thailand</span>
          </address>
        </div>

        {/* Divider */}
        <div className="footer-divider w-full h-px sec-border mb-6 origin-center" style={{ background: 'var(--sec-border)' }} />

        {/* Bottom Area */}
        <div className="footer-animate flex flex-col-reverse md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-[13px] sec-text-55">
            {f.copyright[lang]}
          </p>
          <div className="flex items-center gap-8">
            <a
              href={PROPERTY.lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[13px] uppercase tracking-[0.05em] sec-text-60 hover:text-sage-green transition-colors duration-300"
            >
              LINE
            </a>
            <a
              href={PROPERTY.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[13px] uppercase tracking-[0.05em] sec-text-60 hover:text-sage-green transition-colors duration-300"
            >
              Instagram
            </a>
            {/* /links is the master hub — every channel (incl. Facebook/
                TikTok once real accounts exist) lives there instead of a
                dead placeholder link here. */}
            <Link
              to="/links"
              className="font-sans text-[13px] uppercase tracking-[0.05em] sec-text-60 hover:text-sage-green transition-colors duration-300"
            >
              {f.allChannels[lang]}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
