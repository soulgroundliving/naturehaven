import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Lang = 'en' | 'th';

interface LanguageContextValue {
  lang: Lang;
  toggle: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);
const STORAGE_KEY = 'nh_lang';

// Default = Thai (owner decision 2026-07-03): the audience is Thai renters in
// Saimai, and the prerendered crawler snapshots should carry the Thai
// keywords. ?lang= param and a stored preference still win.
function readInitialLang(): Lang {
  if (typeof window === 'undefined') return 'th';
  const params = new URLSearchParams(window.location.search);
  const p = params.get('lang');
  if (p === 'en' || p === 'th') return p;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'th') return stored as Lang;
  } catch {}
  return 'th';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('th');

  useEffect(() => {
    setLang(readInitialLang());
  }, []);

  const toggle = () => {
    setLang(prev => {
      const next = prev === 'en' ? 'th' : 'en';
      try { localStorage.setItem(STORAGE_KEY, next); } catch {}
      return next;
    });
  };

  const value = useMemo<LanguageContextValue>(() => ({ lang, toggle }), [lang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
