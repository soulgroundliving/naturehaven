import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PROPERTY } from '@/data/propertyFacts';
import { isInAppBrowser } from '@/lib/inAppBrowser';

const COPY = {
  title: { en: 'Opening LINE from here can fail', th: 'เปิดไลน์จากตรงนี้อาจไม่สำเร็จ' },
  body: {
    en: 'This page is open inside an app (Facebook/Instagram) that often blocks the LINE link. Try the button below. If nothing opens, copy our ID and search for it in LINE, or tap ⋯ in the top corner and choose "Open in Browser".',
    th: 'หน้านี้เปิดอยู่ในแอป (Facebook/Instagram) ซึ่งมักบล็อกลิงก์ไลน์ ลองกดปุ่มด้านล่างได้เลย ถ้าไม่เปิด ให้คัดลอกไอดีแล้วค้นหาในไลน์ หรือแตะ ⋯ มุมบนแล้วเลือก "เปิดในเบราว์เซอร์"',
  },
  open: { en: 'Try opening LINE', th: 'ลองเปิดไลน์โดยตรง' },
  copy: { en: 'Copy ID', th: 'คัดลอกไอดี' },
  copied: { en: 'Copied!', th: 'คัดลอกแล้ว!' },
  manual: {
    en: 'Could not copy automatically. The ID is selected: press and hold it, then choose Copy.',
    th: 'คัดลอกอัตโนมัติไม่ได้ ไอดีถูกเลือกไว้แล้ว แตะค้างที่ไอดีแล้วเลือก "คัดลอก"',
  },
  close: { en: 'Close', th: 'ปิด' },
} as const;

type CopyState = 'idle' | 'copied' | 'manual';

function selectNode(node: HTMLElement | null) {
  if (!node) return;
  const selection = window.getSelection();
  if (!selection) return;
  const range = document.createRange();
  range.selectNodeContents(node);
  selection.removeAllRanges();
  selection.addRange(range);
}

// Intercepts taps on LINE links while inside a known-broken in-app browser
// (see src/lib/inAppBrowser.ts) and shows a fallback instead of letting the
// tap silently fail or hang on a blank page. The dialog offers both paths:
// a direct link (may or may not work in the webview) and the LINE ID to copy.
export default function LineLinkGuard() {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const idRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!isInAppBrowser()) return;

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest('a[href]') as HTMLAnchorElement | null;
      if (!link) return;
      if (link.hasAttribute('data-line-guard-pass')) return; // the dialog's own "open LINE" link
      if (!/lin\.ee|line\.me/i.test(link.href)) return;
      e.preventDefault();
      setCopyState('idle');
      setOpen(true);
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PROPERTY.lineId);
      setCopyState('copied');
      return;
    } catch {
      // Clipboard API is often missing or denied in FB/IG webviews — try the legacy path.
    }
    selectNode(idRef.current);
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    setCopyState(ok ? 'copied' : 'manual');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="line-guard-title"
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 px-4 pb-6 sm:items-center"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-pure-white p-6 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="line-guard-title" className="font-serif text-lg text-dark-charcoal">
          {COPY.title[lang]}
        </h3>
        <p className="mt-3 font-sans text-sm leading-relaxed text-dark-charcoal/70">
          {COPY.body[lang]}
        </p>
        <p
          ref={idRef}
          onClick={() => selectNode(idRef.current)}
          className="mt-4 select-all rounded-lg bg-dark-charcoal/5 px-4 py-3 font-sans text-base font-medium tracking-wide text-dark-charcoal"
        >
          {PROPERTY.lineId}
        </p>
        <a
          href={PROPERTY.lineUrl}
          data-line-guard-pass
          className="mt-4 block w-full rounded-full bg-[var(--cta-bg,#3D5A4C)] px-6 py-3 font-sans text-sm font-medium text-pure-white transition-opacity duration-200 hover:opacity-90"
        >
          {COPY.open[lang]}
        </a>
        <button
          onClick={handleCopy}
          className="mt-3 w-full rounded-full border border-dark-charcoal/25 px-6 py-3 font-sans text-sm font-medium text-dark-charcoal transition-colors duration-200 hover:bg-dark-charcoal/5"
        >
          {copyState === 'copied' ? COPY.copied[lang] : COPY.copy[lang]}
        </button>
        <p aria-live="polite" className="mt-2 min-h-[1.25rem] font-sans text-xs text-dark-charcoal/70">
          {copyState === 'manual' ? COPY.manual[lang] : ''}
        </p>
        <button
          onClick={() => setOpen(false)}
          className="mt-1 w-full py-2 font-sans text-xs uppercase tracking-[0.1em] text-dark-charcoal/50"
        >
          {COPY.close[lang]}
        </button>
      </div>
    </div>
  );
}
