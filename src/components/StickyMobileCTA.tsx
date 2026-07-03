import { useEffect, useState } from 'react';
import { PROPERTY } from '@/data/propertyFacts';
import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';

// Mobile-only conversion bar — slides up after the visitor scrolls past the
// hero. On small screens this replaces the desktop floating LINE pill
// (FloatingLineChat), which stays desktop-only to avoid stacking two CTAs.
export default function StickyMobileCTA() {
  const { lang } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 1.1);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <a
      href={PROPERTY.lineUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`md:hidden fixed inset-x-0 bottom-0 z-[90] flex items-center justify-center gap-2 bg-[var(--cta-bg,#3D5A4C)] text-pure-white font-sans text-sm font-medium px-6 pt-4 shadow-[0_-2px_12px_rgba(0,0,0,0.10)] transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}
    >
      {TR.cta.mobileBar[lang]}
    </a>
  );
}
