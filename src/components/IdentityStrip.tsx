import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';

// The two identity facts that used to sit ON the hero photo (อพาร์ทเม้นท์ ·
// เลี้ยงสัตว์ได้ · สายไหม / พร้อมเข้าอยู่ กันยายน 2569). Owner call 2026-07-12:
// keep the hero Sansiri-clean but keep the facts visible — so they live here
// as a slim editorial dateline on the page surface, right under the cover.
// Reuses the existing TR.hero.cta key (two lines, \n-separated).
export default function IdentityStrip() {
  const { lang } = useLanguage();
  const [line1, line2] = TR.hero.cta[lang].split('\n');
  return (
    <div className="px-6 pt-6 pb-4 text-center md:pt-7 md:pb-5">
      <p
        className="font-sans text-[12px] md:text-[13px] uppercase tracking-[0.16em] leading-[1.9]"
        style={{ color: 'var(--text-on-bg, #2B2B2B)' }}
      >
        <span className="block md:inline opacity-85">{line1}</span>
        <span className="hidden md:inline mx-3 opacity-40">—</span>
        <span className="block md:inline opacity-60">{line2}</span>
      </p>
    </div>
  );
}
