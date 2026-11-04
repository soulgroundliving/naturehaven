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

// Header links: nowrap + 44 px tall; tighter tracking below sm so the Thai row fits a 320 px phone.
const NAV_LINK = 'whitespace-nowrap py-3.5 font-sans text-xs uppercase tracking-[0.04em] sm:tracking-[0.12em] text-dark-charcoal/70 transition-colors duration-300 hover:text-dark-charcoal';
const JournalShell: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { lang, toggle } = useLanguage();
  const { pathname } = useLocation();

  // index.html locks scrolling before React mounts (#nh-prelock) so iOS
  // Safari can't restore a stale scroll position. App.tsx releases it for
  // the homepage — journal routes mount this shell instead, so they must
  // release it themselves or the page stays frozen.
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
        <div className="container-main flex h-16 items-center justify-between gap-2">
          <Link to="/" className="shrink-0 whitespace-nowrap font-serif text-[15px] min-[360px]:text-base sm:text-lg text-dark-charcoal">
            Nature Haven
          </Link>
          <div className="flex min-w-0 items-center gap-2 min-[360px]:gap-3 sm:gap-5 md:gap-7">
            <Link to="/journal" className={NAV_LINK}>
              {TR.journal.navLabel[lang]}
            </Link>
            <Link to="/places" className={NAV_LINK}>
              {/* "Neighbourhood" is too wide for a 320 px phone; the short form keeps EN/TH on screen */}
              {lang === 'th' ? 'ไปไหนดี' : (
                <>
                  <span className="sm:hidden">Nearby</span>
                  <span className="hidden sm:inline">Neighbourhood</span>
                </>
              )}
            </Link>
            <Link to="/" className={`hidden sm:block ${NAV_LINK}`}>
              {TR.journal.backHome[lang]}
            </Link>
            <button
              type="button"
              onClick={toggle}
              className="group -mr-1 flex min-h-11 shrink-0 items-center gap-0.5 px-1 font-sans text-[10px] uppercase tracking-[0.06em] sm:tracking-[0.1em]"
              aria-label="Switch language"
            >
              <span className={lang === 'en' ? 'text-dark-charcoal underline underline-offset-4' : 'text-dark-charcoal/70 transition-colors duration-300 group-hover:text-dark-charcoal'}>EN</span>
              <span aria-hidden="true" className="text-dark-charcoal/40">·</span>
              <span className={lang === 'th' ? 'text-dark-charcoal underline underline-offset-4' : 'text-dark-charcoal/70 transition-colors duration-300 group-hover:text-dark-charcoal'}>TH</span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-[1] pt-16">{children}</main>

      <footer className="relative z-[1] frosted-page backdrop-blur-xl border-t sec-border">
        <div className="container-main flex flex-col items-center justify-between gap-3 py-8 text-center md:flex-row md:text-left">
          <p className="font-sans text-xs sec-text-60">
            © {new Date().getFullYear()} {PROPERTY.legalName} · Nature Haven — {lang === 'th' ? 'สายไหม กรุงเทพฯ' : 'Saimai, Bangkok'}
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
        {/* Legal — docs live on the operating company's system (the-green-haven.vercel.app),
            same split used on the homepage FooterSection and /links. */}
        <div className="container-main flex items-center justify-center gap-6 pb-6">
          <a
            href={PROPERTY.privacyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[11px] sec-text-55 hover:opacity-70 transition-opacity duration-300"
          >
            {TR.footer.privacy[lang]}
          </a>
          <a
            href={PROPERTY.termsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[11px] sec-text-55 hover:opacity-70 transition-opacity duration-300"
          >
            {TR.footer.terms[lang]}
          </a>
        </div>
      </footer>
    </div>
  );
};

export default JournalShell;
