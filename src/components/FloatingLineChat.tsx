import { LineIcon } from '@/components/icons';
import { PROPERTY } from '@/data/propertyFacts';
import { useLanguage } from '@/contexts/LanguageContext';

// The ONE contact button for the whole site (Sansiri-style restraint,
// owner call 2026-07-12): a single floating LINE pill on every breakpoint.
// In-page sections keep at most a text mention of LINE; the pill is always
// within reach instead, so nothing else on the page needs to ask.
// (Replaced the old pair: desktop-only pill + full-width mobile bottom bar.)
export default function FloatingLineChat() {
  const { lang } = useLanguage();
  return (
    <a
      href={PROPERTY.lineUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on LINE — book a private viewing"
      className="inline-flex fixed right-4 md:right-6 z-[60] items-center gap-2.5 bg-[var(--cta-bg,#3D5A4C)] hover:bg-[var(--cta-bg-hover,#4a6e5d)] text-pure-white px-5 py-3.5 rounded-full font-sans text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
      style={{
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)',
        boxShadow:
          '0 12px 32px -8px rgba(31,27,22,0.28), 0 4px 12px rgba(31,27,22,0.12)',
      }}
    >
      <LineIcon size={18} />
      <span>{lang === 'th' ? 'ทักไลน์ · นัดชมห้อง' : 'LINE · Book a viewing'}</span>
      <span
        aria-hidden="true"
        className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-pure-white"
      >
        <span className="absolute inset-0 rounded-full bg-pure-white/60 animate-ping" />
      </span>
    </a>
  );
}
