import React from 'react';
import { Link } from 'react-router-dom';
import usePageMeta from '@/hooks/usePageMeta';
import { PROPERTY } from '@/data/propertyFacts';
import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';
import { LineIcon, InstagramIcon, FacebookIcon, TikTokIcon, LocationPin, ChevronRight, HomeIcon, EditIcon } from '@/components/icons';

// The "master link" (ลิงค์แม่) — one URL for every Nature Haven channel,
// meant to live in a social bio (Instagram/Facebook/TikTok) or get shared
// directly. New channels are added as entries here as they go live; nothing
// else in the app needs to change when they do.
//
// Deliberately NOT built on an external bio-link tool: this is a real,
// brand-styled, prerendered route on the site we already own — no new
// subscription, no third-party branding, and it's crawlable like every
// other Journal page.
const LinksPage: React.FC = () => {
  const { lang, toggle } = useLanguage();
  const l = TR.links;

  // index.html hard-locks scroll before React mounts (#nh-prelock →
  // `html, body { overflow: hidden !important }`) so iOS restores at the top,
  // not mid-page. The homepage App and JournalShell release it on mount; this
  // standalone route must too, or /links can't scroll (only the first viewport
  // is reachable). Matches JournalShell.tsx.
  React.useEffect(() => {
    document.getElementById('nh-prelock')?.remove();
  }, []);

  usePageMeta({
    title: 'Nature Haven — ช่องทางทั้งหมด',
    description: l.pageDescription[lang],
    canonical: `${PROPERTY.url}/links`,
    ogImage: `${PROPERTY.url}/og-image.jpg`,
  });

  const mapsUrl = PROPERTY.mapsUrl;

  const items = [
    {
      key: 'line',
      label: l.line[lang],
      sub: l.lineSub[lang],
      href: PROPERTY.lineUrl,
      external: true,
      primary: true,
      Icon: LineIcon,
    },
    {
      key: 'instagram',
      label: l.instagram[lang],
      sub: l.instagramSub[lang],
      href: PROPERTY.instagramUrl,
      external: true,
      primary: false,
      Icon: InstagramIcon,
    },
    {
      key: 'facebook',
      label: l.facebook[lang],
      sub: l.facebookSub[lang],
      href: PROPERTY.facebookUrl,
      external: true,
      primary: false,
      Icon: FacebookIcon,
    },
    {
      key: 'tiktok',
      label: l.tiktok[lang],
      sub: l.tiktokSub[lang],
      href: PROPERTY.tiktokUrl,
      external: true,
      primary: false,
      Icon: TikTokIcon,
    },
    {
      key: 'journal',
      label: l.journal[lang],
      sub: l.journalSub[lang],
      href: '/journal',
      external: false,
      primary: false,
      Icon: EditIcon,
    },
    {
      key: 'home',
      label: l.home[lang],
      sub: l.homeSub[lang],
      href: '/',
      external: false,
      primary: false,
      Icon: HomeIcon,
    },
    {
      key: 'maps',
      label: l.maps[lang],
      sub: l.mapsSub[lang],
      href: mapsUrl,
      external: true,
      primary: false,
      Icon: LocationPin,
    },
  ] as const;

  return (
    <div className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-x-hidden">
      {/* iOS/IG-webview toolbars resize the visual viewport after paint, so this
          layer is sized to the wrapper's own box (inset-0 + wrapper's min-h-dvh)
          rather than to a background-size:cover on the flex wrapper itself —
          that combo previously left a gap once the address bar collapsed. */}
      <div
        className="absolute inset-0 -z-10 bg-[#F5F1EA] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/links-leaf-bg.webp')" }}
      />

      {/* flex items-center on the wrapper centers this column vertically, so
          leftover space above/below stays symmetric on tall screens instead of
          piling up underneath a top-anchored block. */}
      <button
        type="button"
        onClick={toggle}
        aria-label="Switch language"
        className="absolute right-5 top-5 z-10 flex items-center gap-1 font-sans text-[11px] uppercase tracking-[0.1em] text-dark-charcoal/60 transition-colors duration-200 hover:text-dark-charcoal"
      >
        <span style={{ opacity: lang === 'en' ? 1 : 0.4 }}>EN</span>
        <span className="mx-0.5 opacity-30">·</span>
        <span style={{ opacity: lang === 'th' ? 1 : 0.4 }}>TH</span>
      </button>

      <div className="relative mx-auto flex w-full max-w-[430px] flex-col items-center px-5 py-8">
        <p className="font-serif text-[13px] tracking-[0.35em] text-dark-charcoal/70 mb-0.5">N · H</p>
        <h1 className="font-serif text-2xl text-dark-charcoal text-center leading-tight">Nature Haven</h1>
        <p className="font-sans text-[13px] text-dark-charcoal/60 mt-0.5 text-center">{l.subtitle[lang]}</p>

        <div className="w-full flex flex-col gap-1 mt-2">
          {items.map(({ key, label, sub, href, external, primary, Icon }) =>
            external ? (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center gap-3.5 w-full rounded-xl px-3.5 py-1.5 transition-all duration-200 hover:-translate-y-0.5 ${
                  primary
                    ? 'bg-sage-green text-pure-white shadow-md'
                    : 'bg-pure-white text-dark-charcoal border border-dark-charcoal/10 shadow-sm'
                }`}
              >
                <span
                  className={`flex-none inline-flex items-center justify-center w-8 h-8 rounded-full ${
                    primary ? 'bg-white/15' : 'bg-sage-green/10 text-sage-green'
                  }`}
                >
                  <Icon size={15} />
                </span>
                <span className="flex-1 text-left">
                  <span className="block font-sans text-[15px] font-medium leading-tight">{label}</span>
                  <span className={`block font-sans text-[12px] leading-tight ${primary ? 'text-white/75' : 'text-dark-charcoal/55'}`}>
                    {sub}
                  </span>
                </span>
                <ChevronRight size={16} className={`flex-none ${primary ? 'text-white/70' : 'text-dark-charcoal/30'}`} />
              </a>
            ) : (
              <Link
                key={key}
                to={href}
                className="group flex items-center gap-3.5 w-full rounded-xl px-3.5 py-1.5 bg-pure-white text-dark-charcoal border border-dark-charcoal/10 shadow-sm transition-all duration-200 hover:-translate-y-0.5"
              >
                <span className="flex-none inline-flex items-center justify-center w-8 h-8 rounded-full bg-sage-green/10 text-sage-green">
                  <Icon size={15} />
                </span>
                <span className="flex-1 text-left">
                  <span className="block font-sans text-[15px] font-medium leading-tight">{label}</span>
                  <span className="block font-sans text-[12px] leading-tight text-dark-charcoal/55">{sub}</span>
                </span>
                <ChevronRight size={16} className="flex-none text-dark-charcoal/30" />
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default LinksPage;
