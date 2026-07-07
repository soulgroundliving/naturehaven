import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PROPERTY } from '@/data/propertyFacts';
import { isInAppBrowser } from '@/lib/inAppBrowser';

const COPY = {
  title: { en: 'Opening LINE from here can fail', th: 'เปิดไลน์จากตรงนี้อาจไม่สำเร็จ' },
  body: {
    en: 'This page is open inside an app (Facebook/Instagram) that often blocks the LINE link. Tap ⋯ in the top corner and choose "Open in Browser", or add us on LINE by searching this ID:',
    th: 'หน้านี้เปิดอยู่ในแอป (Facebook/Instagram) ซึ่งมักบล็อกลิงก์ไลน์ วิธีแก้: แตะปุ่ม ⋯ มุมบนแล้วเลือก "เปิดในเบราว์เซอร์" หรือเพิ่มเพื่อนเราในไลน์โดยค้นหาไอดีนี้:',
  },
  copy: { en: 'Copy ID', th: 'คัดลอกไอดี' },
  copied: { en: 'Copied!', th: 'คัดลอกแล้ว!' },
  close: { en: 'Close', th: 'ปิด' },
} as const;

// Intercepts taps on LINE links while inside a known-broken in-app browser
// (see src/lib/inAppBrowser.ts) and shows a fallback instead of letting the
// tap silently fail or hang on a blank page.
export default function LineLinkGuard() {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isInAppBrowser()) return;

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest('a[href]') as HTMLAnchorElement | null;
      if (!link) return;
      if (!/lin\.ee|line\.me/i.test(link.href)) return;
      e.preventDefault();
      setCopied(false);
      setOpen(true);
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  if (!open) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PROPERTY.lineId);
      setCopied(true);
    } catch {
      // Clipboard API unavailable — the ID is already visible to copy by hand.
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 px-4 pb-6 sm:items-center"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-pure-white p-6 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-serif text-lg text-dark-charcoal">{COPY.title[lang]}</h3>
        <p className="mt-3 font-sans text-sm leading-relaxed text-dark-charcoal/70">
          {COPY.body[lang]}
        </p>
        <p className="mt-4 rounded-lg bg-dark-charcoal/5 px-4 py-3 font-sans text-base font-medium tracking-wide text-dark-charcoal">
          {PROPERTY.lineId}
        </p>
        <button
          onClick={handleCopy}
          className="mt-4 w-full rounded-full bg-[var(--cta-bg,#3D5A4C)] px-6 py-3 font-sans text-sm font-medium text-pure-white transition-opacity duration-200 hover:opacity-90"
        >
          {copied ? COPY.copied[lang] : COPY.copy[lang]}
        </button>
        <button
          onClick={() => setOpen(false)}
          className="mt-3 w-full font-sans text-xs uppercase tracking-[0.1em] text-dark-charcoal/50"
        >
          {COPY.close[lang]}
        </button>
      </div>
    </div>
  );
}
