import React from 'react';
import SectionHeader from '@/components/SectionHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';
import ResidenceDetails from '@/components/ResidenceDetails';

// Homepage wrapper: header + anchor id. All facts, pricing and specs live in
// ResidenceDetails.tsx, shared with the standalone /residence page.
const ResidencesSection: React.FC = () => {
  const { lang } = useLanguage();
  const r = TR.residences;

  return (
    <section id="residences" className="section-padding frosted-section backdrop-blur-xl">
      <div className="container-main">
        <SectionHeader
          label={r.sectionLabel[lang]}
          headline={r.sectionHeadline[lang].split('\n').join('\n')}
          dark
        />
      </div>
      <ResidenceDetails />
    </section>
  );
};

export default ResidencesSection;
