import React from 'react';
import { Link } from 'react-router-dom';
import usePageMeta from '@/hooks/usePageMeta';
import { PROPERTY } from '@/data/propertyFacts';
import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';
import SiteMenuOverlay from '@/components/SiteMenuOverlay';
import { lineMessageUrl } from '@/lib/lineMessage';
import {
  LineIcon,
  InstagramIcon,
  FacebookIcon,
  TikTokIcon,
  LocationPin,
  HomeIcon,
  EditIcon,
  BookOpenIcon,
  ArrowRight,
  LeafIcon,
  Menu,
} from '@/components/icons';

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
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuTriggerRef = React.useRef<HTMLButtonElement>(null);

  const quickMessages = [
    { key: 'price', label: l.lineQuickPrice[lang], text: l.lineQuickPriceMsg[lang] },
    { key: 'vacancy', label: l.lineQuickVacancy[lang], text: l.lineQuickVacancyMsg[lang] },
    { key: 'tour', label: l.lineQuickTour[lang], text: l.lineQuickTourMsg[lang] },
  ];

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
    ogImage: `${PROPERTY.url}/og-image-v2.jpg`,
    // A link hub has no content of its own — indexed, it showed up as a
    // second "Nature Haven" result under the homepage. Bios still work.
    robots: 'noindex, follow',
  });

  const cards = [
    {
      key: 'line',
      label: l.line[lang],
      sub: l.lineSub[lang],
      href: PROPERTY.lineUrl,
      external: true,
      Icon: LineIcon,
      image: '/assets/balcony-view.jpg',
    },
    {
      key: 'rooms',
      label: l.rooms[lang],
      sub: l.roomsSub[lang],
      href: '/residence',
      external: false,
      Icon: HomeIcon,
      image: '/assets/unit-overview.jpg',
    },
    {
      key: 'instagram',
      label: l.instagram[lang],
      sub: l.instagramSub[lang],
      href: PROPERTY.instagramUrl,
      external: true,
      Icon: InstagramIcon,
      image: '/assets/about-minimal-room.jpg',
    },
    {
      key: 'facebook',
      label: l.facebook[lang],
      sub: l.facebookSub[lang],
      href: PROPERTY.facebookUrl,
      external: true,
      Icon: FacebookIcon,
      image: '/assets/corridor-approach.jpg',
    },
    {
      key: 'tiktok',
      label: l.tiktok[lang],
      sub: l.tiktokSub[lang],
      href: PROPERTY.tiktokUrl,
      external: true,
      Icon: TikTokIcon,
      image: '/assets/hero-room.jpg',
    },
    {
      key: 'googleMap',
      label: l.googleMap[lang],
      sub: l.mapsSub[lang],
      href: PROPERTY.mapsUrl,
      external: true,
      Icon: LocationPin,
      image: '/assets/location-area-map.webp',
    },
    {
      key: 'journalHub',
      label: l.journalHub[lang],
      sub: l.journalSub[lang],
      href: '/journal',
      external: false,
      Icon: EditIcon,
      image: '/assets/room-3d-render.jpg',
    },
    {
      key: 'recommendedArticle',
      label: l.recommendedArticle[lang],
      sub: l.designNotesSub[lang],
      href: '/journal/design-notes-01',
      external: false,
      Icon: BookOpenIcon,
      image: '/assets/design-notes-01-hero.jpg',
    },
  ] as const;

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col items-center overflow-x-hidden">
      <div
        className="absolute inset-0 -z-10 bg-[#F5F1EA] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/links-leaf-bg.webp')" }}
      />

      <div className="flex w-full items-center justify-end gap-1 px-3 pt-1 md:px-10 md:pt-5">
        <div className="flex items-center font-sans text-[11px] uppercase tracking-[0.1em] md:text-sm">
          {(['en', 'th'] as const).map((code, i) => (
            <React.Fragment key={code}>
              {i > 0 && <span aria-hidden="true" className="text-dark-charcoal/40">·</span>}
              <button
                type="button"
                onClick={() => lang !== code && toggle()}
                aria-pressed={lang === code}
                lang={code}
                aria-label={code === 'en' ? 'English' : 'ภาษาไทย'}
                className={`min-h-9 px-2 ${lang === code ? 'font-semibold text-dark-charcoal underline underline-offset-4' : 'text-dark-charcoal/70'}`}
              >
                {code}
              </button>
            </React.Fragment>
          ))}
        </div>
        <button
          ref={menuTriggerRef}
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          aria-label={l.menuAria[lang]}
          className="flex h-9 w-9 items-center justify-center text-dark-charcoal md:h-11 md:w-11"
        >
          <Menu size={20} />
        </button>
      </div>

      <SiteMenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} triggerRef={menuTriggerRef} lang={lang} />

      <header className="flex w-full max-w-[480px] flex-col items-center px-6 pb-2 text-center roomy:pb-3 md:max-w-[640px] md:pb-6">
        <LeafIcon size={18} className="mb-1 text-sage-green/70 roomy:h-6 roomy:w-6 md:mb-2 md:h-8 md:w-8" />
        <h1 className="font-serif text-[26px] leading-none tracking-[0.05em] text-dark-charcoal roomy:text-[32px] md:text-[56px]">
          Nature Haven
        </h1>
        <p className="mt-1.5 font-sans text-[9px] font-medium uppercase tracking-[0.4em] text-sage-green roomy:text-[10px] md:mt-3 md:text-sm">
          {l.heroTagline[lang]}
        </p>
        <p className="mt-2 font-serif text-[14px] text-dark-charcoal roomy:mt-3 roomy:text-[16px] md:mt-6 md:text-2xl">
          {l.heroHeading[lang]}
        </p>
        <p className="mt-1 max-w-[320px] font-sans text-[10.5px] leading-snug text-dark-charcoal/80 roomy:text-[12px] md:mt-3 md:max-w-[520px] md:text-base md:leading-relaxed">
          {l.heroBody[lang]}
        </p>
      </header>

      <div className="w-full max-w-[520px] px-3 md:max-w-[720px] md:px-6 lg:max-w-[1040px]">
        <p className="mb-1 text-center font-sans text-[9.5px] text-dark-charcoal/75 md:mb-3 md:text-sm">{l.lineQuickIntro[lang]}</p>
        <div className="mb-1.5 flex gap-1.5 md:mb-4 md:gap-4">
          {quickMessages.map(({ key, label, text }) => (
            <a
              key={key}
              href={lineMessageUrl(text)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-full border border-sage-green/40 bg-pure-white/60 py-1.5 text-center font-sans text-[10px] font-medium text-sage-green transition-transform duration-150 hover:-translate-y-0.5 roomy:py-2 roomy:text-[11px] md:py-3 md:text-base"
            >
              {label}
              <span className="sr-only"> {l.newTab[lang]}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="flex w-full max-w-[520px] flex-1 flex-col px-3 pb-2 md:max-w-[720px] md:px-6 md:pb-4 lg:max-w-[1040px]">
        <div className="grid flex-1 auto-rows-fr grid-cols-2 gap-2 md:flex-none md:auto-rows-auto md:gap-4 lg:grid-cols-4">
          {cards.map(({ key, label, sub, href, external, Icon, image }) => {
            const content = (
              <>
                <div
                  className="min-h-[46px] w-[32%] flex-none bg-cover bg-center md:min-h-[104px]"
                  style={{ backgroundImage: `url('${image}')` }}
                  aria-hidden="true"
                />
                <div className="flex min-w-0 flex-1 flex-col justify-between gap-1 p-1.5 roomy:p-2 md:gap-2 md:p-4">
                  <span className="min-w-0">
                    <span className="flex min-w-0 items-center gap-1 roomy:gap-1.5 md:gap-2">
                      <span className="flex h-4 w-4 flex-none items-center justify-center text-sage-green roomy:h-5 roomy:w-5 roomy:[&_svg]:h-[18px] roomy:[&_svg]:w-[18px] md:h-6 md:w-6 md:[&_svg]:h-5 md:[&_svg]:w-5">
                        <Icon size={11} />
                      </span>
                      <span className="min-w-0 break-words font-serif text-[0.6875rem] leading-tight text-dark-charcoal roomy:text-[0.875rem] md:text-lg">
                        {label}
                      </span>
                    </span>
                    {/* Shown only when the screen is tall enough (roomy) —
                        otherwise kept for screen readers so every card, photo
                        and label still fits one screen on the shortest phones. */}
                    <span className="sr-only roomy:not-sr-only roomy:mt-1 roomy:line-clamp-2 roomy:block roomy:font-sans roomy:text-[10px] roomy:leading-snug roomy:text-dark-charcoal/75 md:line-clamp-none md:text-sm">
                      {sub}
                      {external && <span className="sr-only"> {l.newTab[lang]}</span>}
                    </span>
                  </span>
                  <span className="flex h-4 w-4 flex-none items-center justify-center self-end rounded-full border border-dark-charcoal/25 text-dark-charcoal/70 transition-transform duration-200 group-hover:translate-x-0.5 roomy:h-6 roomy:w-6 md:h-8 md:w-8 md:[&_svg]:h-4 md:[&_svg]:w-4">
                    <ArrowRight size={9} />
                  </span>
                </div>
              </>
            );
            const className =
              'group flex overflow-hidden rounded-xl border border-pure-white/70 bg-pure-white/85 shadow-sm backdrop-blur-[2px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md md:rounded-2xl';
            return external ? (
              <a key={key} href={href} target="_blank" rel="noopener noreferrer" className={className}>
                {content}
              </a>
            ) : (
              <Link key={key} to={href} className={className}>
                {content}
              </Link>
            );
          })}
        </div>

        <div className="mt-1.5 flex items-center justify-center gap-2 md:mt-5 md:gap-4">
          <span className="h-px w-8 bg-dark-charcoal/20" />
          <span className="font-serif text-[12px] italic text-sage-green/80 md:text-xl">{l.footerTagline[lang]}</span>
          <LeafIcon size={11} className="text-sage-green/60" />
          <span className="h-px w-8 bg-dark-charcoal/20" />
        </div>

        <p className="mt-1 text-center font-sans text-[8.5px] leading-tight text-dark-charcoal/70 md:text-xs">{l.aiNote[lang]}</p>

        <div className="mt-0.5 flex items-center justify-center gap-4">
          <a
            href={PROPERTY.privacyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block py-1 text-[9.5px] leading-none text-dark-charcoal/75 transition-colors duration-200 hover:text-dark-charcoal md:text-sm"
          >
            {TR.footer.privacy[lang]}
          </a>
          <a
            href={PROPERTY.termsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block py-1 text-[9.5px] leading-none text-dark-charcoal/75 transition-colors duration-200 hover:text-dark-charcoal md:text-sm"
          >
            {TR.footer.terms[lang]}
          </a>
        </div>
      </div>
    </div>
  );
};

export default LinksPage;
