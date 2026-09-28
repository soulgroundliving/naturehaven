import React from 'react';
import { Link } from 'react-router-dom';
import usePageMeta from '@/hooks/usePageMeta';
import { PROPERTY } from '@/data/propertyFacts';
import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';
import SiteMenuOverlay from '@/components/SiteMenuOverlay';
import AiRenderBadge from '@/components/AiRenderBadge';
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

  // `render`: the photo is an AI visualization (the building isn't built yet —
  // see AiRenderBadge), so the thumbnail carries an "AI" tag.
  const cards = [
    {
      key: 'line',
      label: l.line[lang],
      sub: l.lineSub[lang],
      href: PROPERTY.lineUrl,
      external: true,
      Icon: LineIcon,
      image: '/assets/balcony-view.jpg',
      render: true,
    },
    {
      key: 'rooms',
      label: l.rooms[lang],
      sub: l.roomsSub[lang],
      href: '/residence',
      external: false,
      Icon: HomeIcon,
      image: '/assets/unit-overview.jpg',
      render: true,
    },
    {
      key: 'instagram',
      label: l.instagram[lang],
      sub: l.instagramSub[lang],
      href: PROPERTY.instagramUrl,
      external: true,
      Icon: InstagramIcon,
      image: '/assets/about-minimal-room.jpg',
      render: true,
    },
    {
      key: 'facebook',
      label: l.facebook[lang],
      sub: l.facebookSub[lang],
      href: PROPERTY.facebookUrl,
      external: true,
      Icon: FacebookIcon,
      image: '/assets/corridor-approach.jpg',
      render: true,
    },
    {
      key: 'tiktok',
      label: l.tiktok[lang],
      sub: l.tiktokSub[lang],
      href: PROPERTY.tiktokUrl,
      external: true,
      Icon: TikTokIcon,
      image: '/assets/hero-room.jpg',
      render: true,
    },
    {
      key: 'googleMap',
      label: l.googleMap[lang],
      sub: l.mapsSub[lang],
      href: PROPERTY.mapsUrl,
      external: true,
      Icon: LocationPin,
      image: '/assets/location-area-map.webp',
      render: false,
    },
    {
      key: 'journalHub',
      label: l.journalHub[lang],
      sub: l.journalSub[lang],
      href: '/journal',
      external: false,
      Icon: EditIcon,
      image: '/assets/room-3d-render.jpg',
      render: true,
    },
    {
      key: 'recommendedArticle',
      label: l.recommendedArticle[lang],
      sub: l.designNotesSub[lang],
      href: '/journal/design-notes-01',
      external: false,
      Icon: BookOpenIcon,
      image: '/assets/design-notes-01-hero.jpg',
      render: true,
    },
  ] as const;

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col items-center overflow-x-hidden bg-[#F5F1EA]">
      <div className="z-10 flex w-full items-center justify-between border-b border-dark-charcoal/8 bg-[#F5F1EA] px-4 py-2 md:px-10 md:py-4">
        <span className="font-serif text-[15px] text-dark-charcoal md:text-xl">Nature Haven</span>
        <div className="flex items-center gap-3.5">
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
      </div>

      <SiteMenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} triggerRef={menuTriggerRef} lang={lang} />

      {/* Hero: a real interior photo grounds the "mini-app of the site"
          feel the flat leaf-bg version lacked — a soft cream scrim keeps
          the copy readable and fades the photo into the card grid below. */}
      <div
        className="relative w-full bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/hero-living-space.jpg')" }}
      >
        <AiRenderBadge className="absolute left-2 top-1.5 !px-1.5 !py-0.5 !text-[8px] md:left-6 md:top-4 md:!px-2.5 md:!py-1 md:!text-[11px]" />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(245,241,234,0.55) 0%, rgba(245,241,234,0.88) 70%, #F5F1EA 100%)' }}
        />
        <div className="relative mx-auto flex w-full max-w-[480px] flex-col items-center px-6 pb-2 pt-3 text-center md:max-w-[640px] md:pb-4 md:pt-8">
          <LeafIcon size={16} className="mb-0.5 text-sage-green/70 md:mb-2 md:h-7 md:w-7" />
          <h1 className="font-serif text-[20px] leading-none text-dark-charcoal md:text-[52px]">Nature Haven</h1>
          <p className="mt-1 font-sans text-[9px] font-medium uppercase tracking-[0.3em] text-sage-green md:mt-3 md:text-sm">
            {l.heroTagline[lang]}
          </p>
          <p className="mt-1.5 font-serif text-[14px] text-dark-charcoal md:mt-6 md:text-2xl">{l.heroHeading[lang]}</p>
          <p className="mt-1 max-w-[320px] font-sans text-[10.5px] leading-snug text-dark-charcoal/80 md:mt-3 md:max-w-[520px] md:text-base md:leading-relaxed">
            {l.heroBody[lang]}
          </p>
        </div>
      </div>

      <div className="w-full max-w-[520px] px-3 pt-1 md:max-w-[720px] md:px-6 md:pt-2 lg:max-w-[1040px]">
        <p className="mb-1 text-center font-sans text-[9.5px] text-dark-charcoal/75 md:mb-3 md:text-sm">{l.lineQuickIntro[lang]}</p>
        <div className="mb-1.5 flex gap-1.5 md:mb-4 md:gap-4">
          {quickMessages.map(({ key, label, text }) => (
            <a
              key={key}
              href={lineMessageUrl(text)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-full border border-sage-green/35 bg-pure-white py-1.5 text-center font-sans text-[10px] font-medium text-sage-green md:py-3 md:text-base transition-transform duration-150 hover:-translate-y-0.5"
            >
              {label}
              <span className="sr-only"> {l.newTab[lang]}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="w-full max-w-[520px] px-3 pb-2.5 md:max-w-[720px] md:px-6 md:pb-4 lg:max-w-[1040px]">
        <div className="grid grid-cols-2 gap-2 md:gap-4 lg:grid-cols-4">
          {cards.map(({ key, label, sub, href, external, Icon, image, render }) => {
            const content = (
              <>
                <div
                  className="relative min-h-[46px] flex-none md:min-h-[104px] bg-cover bg-center"
                  style={{ backgroundImage: `url('${image}')`, width: '32%' }}
                >
                  {render && (
                    <span className="absolute bottom-0.5 left-0.5 rounded bg-black/60 px-1 font-sans text-[7px] font-medium leading-[10px] text-white/90 md:text-[10px] md:leading-4">
                      <span aria-hidden="true">AI</span>
                      <span className="sr-only">{l.aiTag[lang]}</span>
                    </span>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-between gap-1 p-1.5 md:gap-2 md:p-4">
                  <span className="flex min-w-0 items-center gap-1">
                    <span className="flex h-4 w-4 flex-none items-center justify-center text-sage-green md:h-6 md:w-6 md:[&_svg]:h-5 md:[&_svg]:w-5">
                      <Icon size={11} />
                    </span>
                    <span className="min-w-0 break-words font-serif text-[0.6875rem] leading-tight text-dark-charcoal md:text-lg">{label}</span>
                  </span>
                  {/* The description still exists for anyone using a screen
                      reader — visually dropped to keep every card, photo
                      and label on one screen on the smallest phones; from the
                      md breakpoint up there is room, so it shows. */}
                  <span className="sr-only md:not-sr-only md:block md:font-sans md:text-sm md:leading-snug md:text-dark-charcoal/75">
                    {sub}
                    {external && <span className="sr-only"> {l.newTab[lang]}</span>}
                  </span>
                  <span className="flex h-4 w-4 flex-none items-center justify-center self-end rounded-full bg-light-warm-grey text-dark-charcoal/70 md:h-8 md:w-8 md:[&_svg]:h-4 md:[&_svg]:w-4 transition-transform duration-200 group-hover:translate-x-0.5">
                    <ArrowRight size={9} />
                  </span>
                </div>
              </>
            );
            const className =
              'group flex overflow-hidden rounded-xl border border-dark-charcoal/8 bg-pure-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md';
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

        <div className="mt-2.5 flex items-center justify-center gap-2 md:mt-5 md:gap-4">
          <span className="h-px w-8 bg-dark-charcoal/20" />
          <span className="font-serif text-[12px] italic text-sage-green/80 md:text-xl">{l.footerTagline[lang]}</span>
          <LeafIcon size={11} className="text-sage-green/60" />
          <span className="h-px w-8 bg-dark-charcoal/20" />
        </div>

        <div className="mt-1 flex items-center justify-center gap-4 pb-1">
          <a
            href={PROPERTY.privacyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans inline-block py-1 text-[9.5px] leading-none md:text-sm text-dark-charcoal/75 hover:text-dark-charcoal transition-colors duration-200"
          >
            {TR.footer.privacy[lang]}
          </a>
          <a
            href={PROPERTY.termsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans inline-block py-1 text-[9.5px] leading-none md:text-sm text-dark-charcoal/75 hover:text-dark-charcoal transition-colors duration-200"
          >
            {TR.footer.terms[lang]}
          </a>
        </div>
      </div>
    </div>
  );
};

export default LinksPage;
