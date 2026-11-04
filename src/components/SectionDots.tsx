// Vertical dot nav — fixed right edge, shows which of the 10 main sections is
// active. Fades in after user scrolls past the hero. Each dot is an <a> tag
// so keyboard users can jump directly to any section.
import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';

// Labels live in TR.nav.sections, in this order.
const SECTION_IDS = [
  'hero', 'about', 'collections', 'residences', 'amenities',
  'journal', 'location', 'smart-living', 'faq', 'contact',
];

interface SectionDotsProps {
  activeSection: string;
  isPastHero: boolean;
  onDotClick: (id: string) => void;
}

export default function SectionDots({ activeSection, isPastHero, onDotClick }: SectionDotsProps) {
  const { lang } = useLanguage();
  const labels = TR.nav.sections[lang];
  const active = isPastHero ? activeSection : 'hero';

  return (
    <nav
      aria-label={TR.nav.sectionsLabel[lang]}
      className={`fixed right-5 top-1/2 -translate-y-1/2 z-[90] flex flex-col gap-3 transition-opacity duration-500 hidden lg:flex ${
        isPastHero ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {SECTION_IDS.map((id, i) => (
        <a
          key={id}
          href={`#${id}`}
          aria-label={labels[i]}
          onClick={(e) => { e.preventDefault(); onDotClick(id); }}
          className="group relative flex items-center justify-end gap-2"
        >
          {/* Tooltip label */}
          <span className="absolute right-6 whitespace-nowrap font-sans text-[10px] uppercase tracking-[0.1em] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
            style={{ color: 'var(--text-on-bg, #2B2B2B)' }}>
            {labels[i]}
          </span>
          {/* Dot */}
          <span
            className={`block rounded-full transition-all duration-300 ${
              active === id
                ? 'w-2.5 h-2.5 bg-[var(--cta-bg,#3D5A4C)]'
                : 'w-1.5 h-1.5 bg-current opacity-25 group-hover:opacity-60'
            }`}
            style={{ color: 'var(--text-on-bg, #2B2B2B)' }}
          />
        </a>
      ))}
    </nav>
  );
}
