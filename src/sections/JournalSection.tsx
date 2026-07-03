import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SectionHeader from '@/components/SectionHeader';
import JournalCard from '@/components/JournalCard';
import { ARTICLES } from '@/data/journal';
import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';

gsap.registerPlugin(ScrollTrigger);

// Homepage Journal block — 1 featured + up to 2 compact rows + read-all tile.
// Sits in the "Belong" chapter between Testimonials and Location.
const JournalSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { lang } = useLanguage();
  const j = TR.journal;

  const [featured, ...rest] = ARTICLES;
  const secondary = rest.slice(0, 2);

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      if (window.matchMedia('(max-width: 767px)').matches) return;

      const cards = sectionRef.current.querySelectorAll('.jn-card, .jn-all');
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

  if (!featured) return null;

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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.35fr_1fr] lg:gap-8">
          <JournalCard article={featured} variant="featured" />

          <div className="flex flex-col gap-5">
            {secondary.map((article) => (
              <JournalCard key={article.slug} article={article} variant="row" />
            ))}
            <Link
              to="/journal"
              className="jn-all group flex flex-1 items-center justify-between rounded-xl border sec-border px-6 py-5 transition-all duration-300 hover:bg-pure-white/40 hover:shadow-lg"
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
        </div>
      </div>
    </section>
  );
};

export default JournalSection;
