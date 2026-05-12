import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ChevronDown } from 'lucide-react';
import { FAQ_ITEMS } from '@/data/propertyFacts';

gsap.registerPlugin(ScrollTrigger);

const FAQSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const header = sectionRef.current.querySelectorAll('.faq-header-animate');
      gsap.from(header, {
        y: 20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: header[0] as Element,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      const items = sectionRef.current.querySelectorAll('.faq-item');
      gsap.from(items, {
        y: 16,
        opacity: 0,
        duration: 0.55,
        stagger: 0.06,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: items[0] as Element,
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
      id="faq"
      className="section-padding frosted-section backdrop-blur-xl"
    >
      <div className="container-main">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <p className="faq-header-animate section-label sec-text-60 mb-4 tracking-[0.2em]">
            FAQ
          </p>
          <h2 className="faq-header-animate font-serif text-3xl md:text-5xl lg:text-[56px] sec-text leading-[1.1] mb-3">
            คำถามที่พบบ่อย
          </h2>
          <div className="faq-header-animate flex items-center justify-center gap-4 mt-7">
            <div className="h-px w-14" style={{ background: 'var(--sec-border)' }} />
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="flex-shrink-0" style={{ color: 'var(--sec-text-55)' }}>
              <path d="M5 0L6.25 3.75L10 5L6.25 6.25L5 10L3.75 6.25L0 5L3.75 3.75L5 0Z" fill="currentColor"/>
            </svg>
            <div className="h-px w-14" style={{ background: 'var(--sec-border)' }} />
          </div>
        </div>

        {/* Accordion */}
        <div className="max-w-3xl mx-auto card-surface backdrop-blur-sm rounded-xl overflow-hidden divide-y sec-border">
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.id}
              className="faq-item group"
            >
              <summary className="flex items-start justify-between gap-4 px-6 py-5 cursor-pointer list-none select-none hover:bg-black/[0.025] transition-colors duration-200">
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-[15px] font-medium sec-text-90 leading-snug">
                    {item.q_th}
                  </p>
                  <p className="font-sans text-[12px] sec-text-55 mt-0.5 leading-snug" lang="en">
                    {item.q_en}
                  </p>
                </div>
                <ChevronDown
                  size={18}
                  className="flex-shrink-0 mt-0.5 sec-text-55 transition-transform duration-300 group-open:rotate-180"
                />
              </summary>

              <div className="px-6 pb-5 pt-1">
                <p className="font-sans text-[15px] font-light sec-text-80 leading-relaxed">
                  {item.a_th}
                </p>
                <p className="font-sans text-[12px] sec-text-55 mt-1.5 leading-relaxed" lang="en">
                  {item.a_en}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
