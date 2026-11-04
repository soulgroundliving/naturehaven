import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';

// A slim editorial dateline on the page surface, right under the cover.
// What / where / size / price moved onto the hero itself (owner 2026-11-05),
// so this keeps only the move-in month — stated as expected, not promised.
export default function IdentityStrip() {
  const { lang } = useLanguage();
  return (
    <div className="px-6 pt-6 pb-4 text-center md:pt-7 md:pb-5">
      <p
        className="font-sans text-[12px] md:text-[13px] uppercase tracking-[0.16em] leading-[1.9] opacity-70"
        style={{ color: 'var(--text-on-bg, #2B2B2B)' }}
      >
        {TR.hero.moveIn[lang]}
      </p>
    </div>
  );
}
