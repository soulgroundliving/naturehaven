import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';
import { PROPERTY } from '@/data/propertyFacts';

const STORAGE_KEY = 'nh_cookie_consent';

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
  const [showCustomize, setShowCustomize] = useState(false);
  const [analyticsChecked, setAnalyticsChecked] = useState(true);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // Private browsing / storage blocked — can't persist a dismissal flag,
      // so don't show a notice the visitor could never permanently close.
    }
  }, []);

  if (!visible) return null;

  const handleAccept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ analytics: true, functional: true }));
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  const handleReject = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ analytics: false, functional: true }));
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  // Respects whatever the visitor left the "Analytics" checkbox set to —
  // unlike a plain Accept/Reject shortcut, this is the one path where the
  // checkbox state actually matters.
  const handleCustomizeSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ analytics: analyticsChecked, functional: true }));
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (showCustomize) {
    return (
      <div
        role="region"
        aria-label={lang === 'th' ? 'ตั้งค่าการจัดเก็บข้อมูล' : 'Cookie preferences'}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/30"
      >
        <div className="bg-pure-white rounded-2xl max-w-sm w-full px-6 py-6 font-sans"
          style={{
            boxShadow: '0 12px 32px -8px rgba(31,27,22,0.28), 0 4px 12px rgba(31,27,22,0.12)',
          }}
        >
          <h2 className="text-base font-semibold text-dark-charcoal mb-4">
            {lang === 'th' ? 'ตั้งค่าการจัดเก็บข้อมูล' : 'Cookie Preferences'}
          </h2>

          <div className="space-y-3 mb-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={true}
                disabled
                className="mt-1 w-4 h-4 rounded accent-sage-green cursor-not-allowed"
              />
              <div>
                <div className="text-[13px] font-medium text-dark-charcoal">
                  {lang === 'th' ? 'จำเป็น' : 'Functional'}
                </div>
                <p className="text-[12px] text-gray-600 mt-0.5">
                  {lang === 'th'
                    ? 'การตั้งค่าภาษา และฟีเจอร์พื้นฐาน (บังคับ)'
                    : 'Language preferences and essential features (always on)'
                  }
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={analyticsChecked}
                onChange={(e) => setAnalyticsChecked(e.target.checked)}
                className="mt-1 w-4 h-4 rounded accent-sage-green"
              />
              <div>
                <div className="text-[13px] font-medium text-dark-charcoal">
                  {lang === 'th' ? 'การวิเคราะห์' : 'Analytics'}
                </div>
                <p className="text-[12px] text-gray-600 mt-0.5">
                  {lang === 'th'
                    ? 'ช่วยให้เราเข้าใจวิธีใช้ของผู้เยี่ยมชม (ไม่มีคุกกี้)'
                    : 'Help us understand how visitors use this site (cookieless)'
                  }
                </p>
              </div>
            </label>
          </div>

          <p className="text-[12px] text-gray-600 mb-5">
            {lang === 'th'
              ? 'สำหรับรายละเอียดเพิ่มเติม โปรดอ่าน'
              : 'For more details, see our'
            }{' '}
            <a
              href={PROPERTY.privacyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-sage-green transition-colors"
            >
              {lang === 'th' ? 'นโยบายความเป็นส่วนตัว' : 'Privacy Policy'}
            </a>
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowCustomize(false)}
              className="flex-1 rounded-full bg-gray-100 hover:bg-gray-200 text-dark-charcoal px-4 py-2 text-[13px] font-medium transition-colors duration-200"
            >
              {lang === 'th' ? 'ย้อนกลับ' : 'Back'}
            </button>
            <button
              type="button"
              onClick={handleCustomizeSave}
              className="flex-1 rounded-full bg-[var(--cta-bg,#3D5A4C)] hover:bg-[var(--cta-bg-hover,#4a6e5d)] text-pure-white px-4 py-2 text-[13px] font-medium transition-colors duration-200"
            >
              {lang === 'th' ? 'บันทึกการตั้งค่า' : 'Save preferences'}
            </button>
          </div>
        </div>
      </div>
    );
  }

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
      <div className="mt-4 flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={handleReject}
          className="rounded-full bg-gray-100 hover:bg-gray-200 text-dark-charcoal px-4 py-2 text-[13px] font-medium transition-colors duration-200"
        >
          {t.reject[lang]}
        </button>
        <button
          type="button"
          onClick={() => setShowCustomize(true)}
          className="rounded-full bg-gray-100 hover:bg-gray-200 text-dark-charcoal px-4 py-2 text-[13px] font-medium transition-colors duration-200"
        >
          {t.customize[lang]}
        </button>
        <button
          type="button"
          onClick={handleAccept}
          className="rounded-full bg-[var(--cta-bg,#3D5A4C)] hover:bg-[var(--cta-bg-hover,#4a6e5d)] text-pure-white px-4 py-2 text-[13px] font-medium transition-colors duration-200"
        >
          {t.accept[lang]}
        </button>
      </div>
    </div>
  );
}
