import React from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SectionHeaderProps {
  label: string;
  headline: string;
  dark?: boolean;
  className?: string;
  align?: 'left' | 'center';
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  label,
  headline,
  dark = false,
  className = '',
  align = 'left',
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      const els = containerRef.current.querySelectorAll('.sh-animate');
      gsap.from(els, {
        y: 20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className={`mb-8 md:mb-16 lg:mb-20 ${align === 'center' ? 'text-center' : ''} ${className}`}
    >
      <p
        className={`sh-animate section-label mb-4 ${dark ? 'sec-text-60' : ''}`}
      >
        {label}
      </p>
      <h2
        className={`sh-animate headline-lg max-w-[900px] ${align === 'center' ? 'mx-auto' : ''} ${dark ? 'sec-text' : ''}`}
      >
        {headline}
      </h2>
    </div>
  );
};

export default SectionHeader;