import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SectionHeader from '@/components/SectionHeader';
import JournalMosaicGrid from '@/components/JournalMosaicGrid';
import { ARTICLES } from '@/data/journal';
import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';

gsap.registerPlugin(ScrollTrigger);

// Homepage Journal block — a compact taste of the /journal mosaic (same
// tile treatment, no filters) plus a read-all link. Sits in the "Belong"
// chapter between Testimonials and Location.
const JournalSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { lang } = useLanguage();
  const j = TR.journal;

  const preview = ARTICLES.slice(0, 4);

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      if (window.matchMedia('(max-width: 767px)').matches) return;

      const cards = sectionRef.current.querySelectorAll('.jn-tile, .jn-all');
      gsap.from(cards, {
        y: 28,
        opacity: 0,
        duration: 0.65,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    },
    { scope: sectionRef }
  );

  if (!preview.length) return null;

  return (
    <section
      ref={sectionRef}
      id="journal"
      className="frosted-section backdrop-blur-xl section-padding"
    >
      <div className="container-main">
        <SectionHeader
          label={j.sectionLabel[lang]}
          headline={j.sectionHeadline[lang]}
          dark
        />

        <JournalMosaicGrid articles={preview} showFilters={false} />

        <Link
          to="/journal"
          className="jn-all group mt-5 flex items-center justify-between rounded-xl border sec-border px-6 py-5 transition-all duration-300 hover:bg-pure-white/40 hover:shadow-lg md:mt-6"
        >
          <span className="font-sans text-sm uppercase tracking-[0.12em] sec-text-80">
            {j.readAll[lang]}
          </span>
          <span
            aria-hidden="true"
            className="font-serif text-xl sec-text-60 transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>
    </section>
  );
};

export default JournalSection;
