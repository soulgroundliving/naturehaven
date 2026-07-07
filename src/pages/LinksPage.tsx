import React from 'react';
import { Link } from 'react-router-dom';
import usePageMeta from '@/hooks/usePageMeta';
import { PROPERTY } from '@/data/propertyFacts';
import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';
import { LineIcon, InstagramIcon, FacebookIcon, TikTokIcon, LocationPin, ArrowRight } from '@/components/icons';

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
  const { lang } = useLanguage();
  const l = TR.links;

  usePageMeta({
    title: 'Nature Haven — ช่องทางทั้งหมด',
    description: l.pageDescription[lang],
    canonical: `${PROPERTY.url}/links`,
    ogImage: `${PROPERTY.url}/og-image.jpg`,
  });

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${PROPERTY.latitude},${PROPERTY.longitude}`;

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
      Icon: ArrowRight,
    },
    {
      key: 'home',
      label: l.home[lang],
      sub: l.homeSub[lang],
      href: '/',
      external: false,
      primary: false,
      Icon: ArrowRight,
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
    <div className="min-h-screen flex flex-col items-center px-6 py-16 md:py-24" style={{ background: '#F5F1EA' }}>
      <div className="w-full max-w-[420px] flex flex-col items-center">
        <p className="font-serif text-[13px] tracking-[0.35em] text-dark-charcoal/70 mb-3">N · H</p>
        <h1 className="font-serif text-3xl text-dark-charcoal text-center leading-tight">Nature Haven</h1>
        <p className="font-sans text-[13px] text-dark-charcoal/60 mt-2 text-center">{l.subtitle[lang]}</p>

        <div className="w-full flex flex-col gap-3 mt-10">
          {items.map(({ key, label, sub, href, external, primary, Icon }) =>
            external ? (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center gap-4 w-full rounded-2xl px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 ${
                  primary
                    ? 'bg-sage-green text-pure-white shadow-md'
                    : 'bg-pure-white text-dark-charcoal border border-dark-charcoal/10 shadow-sm'
                }`}
              >
                <span
                  className={`flex-none inline-flex items-center justify-center w-10 h-10 rounded-full ${
                    primary ? 'bg-white/15' : 'bg-sage-green/10 text-sage-green'
                  }`}
                >
                  <Icon size={18} />
                </span>
                <span className="flex-1 text-left">
                  <span className="block font-sans text-[15px] font-medium">{label}</span>
                  <span className={`block font-sans text-[12px] ${primary ? 'text-white/75' : 'text-dark-charcoal/55'}`}>
                    {sub}
                  </span>
                </span>
              </a>
            ) : (
              <Link
                key={key}
                to={href}
                className="group flex items-center gap-4 w-full rounded-2xl px-5 py-4 bg-pure-white text-dark-charcoal border border-dark-charcoal/10 shadow-sm transition-all duration-200 hover:-translate-y-0.5"
              >
                <span className="flex-none inline-flex items-center justify-center w-10 h-10 rounded-full bg-sage-green/10 text-sage-green">
                  <Icon size={16} />
                </span>
                <span className="flex-1 text-left">
                  <span className="block font-sans text-[15px] font-medium">{label}</span>
                  <span className="block font-sans text-[12px] text-dark-charcoal/55">{sub}</span>
                </span>
              </Link>
            )
          )}
        </div>

        <p className="font-sans text-[11px] text-dark-charcoal/40 mt-12 text-center">
          {PROPERTY.legalName} · {PROPERTY.locality}, {PROPERTY.region}
        </p>
      </div>
    </div>
  );
};

export default LinksPage;
