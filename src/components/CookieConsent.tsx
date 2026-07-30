import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';
import { PROPERTY } from '@/data/propertyFacts';

const STORAGE_KEY = 'nh_cookie_notice_ack';

// PDPA-style notice, not a blocking consent gate — this site sets no
// tracking cookies (Vercel Web Analytics is cookieless, see src/main.tsx).
// What it DOES store in the browser is functional only: language preference
// (localStorage `nh_lang`) and the one-time intro-skip flag (sessionStorage
// `nh_intro_done`). The copy says exactly that — no generic "we use cookies
// to improve your experience" line, since that wouldn't be true here.
export default function CookieConsent() {
  const { lang } = useLanguage();
  const t = TR.cookieNotice;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== '1') setVisible(true);
    } catch {
      // Private browsing / storage blocked — can't persist a dismissal flag,
      // so don't show a notice the visitor could never permanently close.
    }
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label={lang === 'th' ? 'การแจ้งเตือนเรื่องการจัดเก็บข้อมูล' : 'Cookie notice'}
      className="fixed left-4 right-4 sm:right-auto sm:max-w-sm z-[55] bg-pure-white rounded-2xl px-5 py-4 font-sans bottom-[calc(env(safe-area-inset-bottom,0px)+84px)] md:bottom-[calc(env(safe-area-inset-bottom,0px)+16px)]"
      style={{
        boxShadow: '0 12px 32px -8px rgba(31,27,22,0.28), 0 4px 12px rgba(31,27,22,0.12)',
      }}
    >
      <p className="text-[13px] leading-relaxed text-dark-charcoal">
        {t.message[lang]}{' '}
        <a
          href={PROPERTY.privacyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-sage-green transition-colors duration-200"
        >
          {lang === 'th' ? 'นโยบายความเป็นส่วนตัว' : 'Privacy Policy'}
        </a>
      </p>
      <button
        type="button"
        onClick={dismiss}
        className="mt-3 inline-flex items-center rounded-full bg-[var(--cta-bg,#3D5A4C)] hover:bg-[var(--cta-bg-hover,#4a6e5d)] text-pure-white px-4 py-2 text-[13px] font-medium transition-colors duration-200"
      >
        {t.accept[lang]}
      </button>
    </div>
  );
}
