import React, { useEffect, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ScrollProgressBar from '@/components/ScrollProgressBar';
import LineLinkGuard from '@/components/LineLinkGuard';
import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';
import { PROPERTY } from '@/data/propertyFacts';

// Lightweight chrome for /journal routes. Deliberately does NOT reuse the
// homepage Navigation/Lenis/GSAP machinery — those are tuned around the hero
// intro and section anchors. Journal pages are plain scrolling documents.
const JournalShell: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { lang, toggle } = useLanguage();
  const { pathname } = useLocation();

  // index.html locks scrolling before React mounts (#nh-prelock) so iOS
  // Safari can't restore a stale scroll position. On the homepage the
  // LoadingOverlay releases it — journal routes must release it themselves
  // or the page stays frozen.
  useEffect(() => {
    document.getElementById('nh-prelock')?.remove();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="relative min-h-screen">
      <ScrollProgressBar />
      <LineLinkGuard />
      <header className="fixed top-0 left-0 right-0 z-[100] bg-white/85 backdrop-blur-xl shadow-sm">
        <div className="container-main flex h-16 items-center justify-between">
          <Link to="/" className="font-serif text-lg text-dark-charcoal">
            Nature Haven
          </Link>
          <div className="flex items-center gap-5 md:gap-7">
            <Link
              to="/journal"
              className="font-sans text-xs uppercase tracking-[0.12em] text-dark-charcoal/70 transition-colors duration-300 hover:text-dark-charcoal"
            >
              {TR.journal.navLabel[lang]}
            </Link>
            <Link
              to="/places"
              className="font-sans text-xs uppercase tracking-[0.12em] text-dark-charcoal/70 transition-colors duration-300 hover:text-dark-charcoal"
            >
              {lang === 'th' ? 'ไปไหนดี' : 'Neighbourhood'}
            </Link>
            <Link
              to="/"
              className="hidden sm:block font-sans text-xs uppercase tracking-[0.12em] text-dark-charcoal/70 transition-colors duration-300 hover:text-dark-charcoal"
            >
              {TR.journal.backHome[lang]}
            </Link>
            <button
              onClick={toggle}
              className="flex items-center gap-1 font-sans text-[10px] uppercase tracking-[0.1em] text-dark-charcoal/60 transition-colors duration-300 hover:text-dark-charcoal"
              aria-label="Switch language"
            >
              <span style={{ opacity: lang === 'en' ? 1 : 0.4 }}>EN</span>
              <span className="mx-0.5 opacity-30">·</span>
              <span style={{ opacity: lang === 'th' ? 1 : 0.4 }}>TH</span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-[1] pt-16">{children}</main>

      <footer className="relative z-[1] frosted-page backdrop-blur-xl border-t sec-border">
        <div className="container-main flex flex-col items-center justify-between gap-3 py-8 text-center md:flex-row md:text-left">
          <p className="font-sans text-xs sec-text-60">
            © {new Date().getFullYear()} {PROPERTY.legalName} · Nature Haven — Saimai, Bangkok
          </p>
          <div className="flex items-center gap-6">
            <Link to="/" className="font-sans text-xs uppercase tracking-[0.1em] sec-text-70 transition-opacity duration-300 hover:opacity-70">
              {TR.journal.backHome[lang]}
            </Link>
            <a
              href={PROPERTY.lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-xs uppercase tracking-[0.1em] sec-text-70 transition-opacity duration-300 hover:opacity-70"
            >
              LINE
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default JournalShell;
