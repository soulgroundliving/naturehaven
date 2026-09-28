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

type IconType = React.FC<{ className?: string; size?: number }>;

interface DestLinkProps {
  href: string;
  external: boolean;
  newTab: string;
  className: string;
  children: React.ReactNode;
}

// One destination = one real link. External ones open a new tab (and say so
// to a screen reader); internal ones stay in the single-page app.
const DestLink: React.FC<DestLinkProps> = ({ href, external, newTab, className, children }) =>
  external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <span className="sr-only"> {newTab}</span>
    </a>
  ) : (
    <Link to={href} className={className}>
      {children}
    </Link>
  );

// The "master link" (ลิงค์แม่) — one URL for every Nature Haven channel,
// meant to live in a social bio (Instagram/Facebook/TikTok) or get shared
// directly. Composed as three tiers of weight — contact + rooms, the
// outward channels, the editorial reads — so it reads as part of the site
// rather than a directory of links. New channels are added to `dest` and
// dropped into the tier they belong to.
//
// Deliberately NOT built on an external bio-link tool: this is a real,
// brand-styled, prerendered route on the site we already own.
const LinksPage: React.FC = () => {
  const { lang, toggle } = useLanguage();
  const l = TR.links;
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuTriggerRef = React.useRef<HTMLButtonElement>(null);

  // index.html hard-locks scroll before React mounts (#nh-prelock →
  // `html, body { overflow: hidden !important }`) so iOS restores at the top,
  // not mid-page. The homepage App and JournalShell release it on mount; this
  // standalone route must too, or /links can't scroll. Matches JournalShell.tsx.
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

  const quickMessages = [
    { key: 'price', label: l.lineQuickPrice[lang], text: l.lineQuickPriceMsg[lang] },
    { key: 'vacancy', label: l.lineQuickVacancy[lang], text: l.lineQuickVacancyMsg[lang] },
    { key: 'tour', label: l.lineQuickTour[lang], text: l.lineQuickTourMsg[lang] },
  ];

  const dest: Record<
    'line' | 'rooms' | 'instagram' | 'facebook' | 'tiktok' | 'googleMap' | 'journalHub' | 'featured',
    { label: string; sub: string; href: string; external: boolean; Icon: IconType; image: string }
  > = {
    line: { label: l.line[lang], sub: l.lineSub[lang], href: PROPERTY.lineUrl, external: true, Icon: LineIcon, image: '/assets/balcony-view.jpg' },
    rooms: { label: l.rooms[lang], sub: l.roomsSub[lang], href: '/residence', external: false, Icon: HomeIcon, image: '/assets/unit-overview.jpg' },
    instagram: { label: l.instagram[lang], sub: l.instagramSub[lang], href: PROPERTY.instagramUrl, external: true, Icon: InstagramIcon, image: '' },
    facebook: { label: l.facebook[lang], sub: l.facebookSub[lang], href: PROPERTY.facebookUrl, external: true, Icon: FacebookIcon, image: '' },
    tiktok: { label: l.tiktok[lang], sub: l.tiktokSub[lang], href: PROPERTY.tiktokUrl, external: true, Icon: TikTokIcon, image: '' },
    googleMap: { label: l.googleMap[lang], sub: l.mapsSub[lang], href: PROPERTY.mapsUrl, external: true, Icon: LocationPin, image: '' },
    journalHub: { label: l.journalHub[lang], sub: l.journalSub[lang], href: '/journal', external: false, Icon: EditIcon, image: '/assets/room-3d-render.jpg' },
    featured: { label: l.recommendedArticle[lang], sub: l.designNotesSub[lang], href: '/journal/design-notes-01', external: false, Icon: BookOpenIcon, image: '/assets/design-notes-01-hero.jpg' },
  };

  const hairline = 'border-dark-charcoal/10';
  const heading = 'font-serif text-dark-charcoal';

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col items-center overflow-x-hidden">
      <div
        className="absolute inset-0 -z-10 bg-[#F5F1EA] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/links-leaf-bg.webp')" }}
      />

      <div className="flex w-full max-w-[560px] items-center justify-end gap-1 px-4 pt-1.5 md:max-w-[720px] md:pt-5">
        <div className="flex items-center font-sans text-[11px] uppercase tracking-[0.12em] md:text-xs">
          {(['en', 'th'] as const).map((code, i) => (
            <React.Fragment key={code}>
              {i > 0 && <span aria-hidden="true" className="text-dark-charcoal/30">·</span>}
              <button
                type="button"
                onClick={() => lang !== code && toggle()}
                aria-pressed={lang === code}
                lang={code}
                aria-label={code === 'en' ? 'English' : 'ภาษาไทย'}
                className={`min-h-9 px-2 ${lang === code ? 'text-dark-charcoal underline underline-offset-[6px]' : 'text-dark-charcoal/65'}`}
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
          className="flex h-9 w-9 items-center justify-center text-dark-charcoal/80"
        >
          <Menu size={19} />
        </button>
      </div>

      <SiteMenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} triggerRef={menuTriggerRef} lang={lang} />

      <main className="flex w-full max-w-[560px] flex-1 flex-col px-5 md:max-w-[720px] md:px-8">
        {/* 1 · Brand — calm, mostly air */}
        <header className="flex flex-col items-center pt-7 text-center md:pt-14">
          <LeafIcon size={14} className="text-sage-green/55" />
          <h1 className={`${heading} mt-3 text-[34px] leading-none tracking-[0.06em] md:text-[52px]`}>Nature Haven</h1>
          <p className="mt-3 font-sans text-[10px] font-medium uppercase tracking-[0.45em] text-sage-green md:text-xs">
            {l.heroTagline[lang]}
          </p>
        </header>

        {/* 2 · Project status — a statement, not a banner */}
        <section className={`mt-9 border-t ${hairline} pt-5 text-center md:mt-12`}>
          <p className={`${heading} text-[15px] leading-snug min-[360px]:text-[16px] md:text-xl`}>
            {l.heroHeading[lang].split(' · ').map((part, i) => (
              <React.Fragment key={part}>
                {i > 0 && ' · '}
                <span className="inline-block">{part}</span>
              </React.Fragment>
            ))}
          </p>
          <p className="mt-1.5 font-sans text-[12px] leading-relaxed text-dark-charcoal/70 [text-wrap:balance] md:text-sm">{l.heroBody[lang]}</p>
        </section>

        {/* 3 · Primary actions — one grouped control, first action leads */}
        <section aria-label={l.lineQuickIntro[lang]} className="mt-7 md:mt-9">
          <p className="mb-2 text-center font-sans text-[11px] text-dark-charcoal/65 md:text-xs">{l.lineQuickIntro[lang]}</p>
          <div className="grid grid-cols-3 divide-x divide-sage-green/25 overflow-hidden rounded-md border border-sage-green/45 bg-pure-white/55">
            {quickMessages.map(({ key, label, text }, i) => (
              <a
                key={key}
                href={lineMessageUrl(text)}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex min-h-12 items-center justify-center px-1.5 py-2.5 text-center font-sans text-[12px] font-medium leading-tight transition-colors duration-200 md:min-h-14 md:text-sm ${
                  i === 0 ? 'bg-sage-green text-pure-white hover:bg-sage-green/90' : 'text-sage-green hover:bg-sage-green/10'
                }`}
              >
                {label}
                <span className="sr-only"> {l.newTab[lang]}</span>
              </a>
            ))}
          </div>
        </section>

        {/* 4 · Contact + rooms — the two destinations most visitors want */}
        <section aria-labelledby="links-primary" className="mt-9 md:mt-12">
          <h2 id="links-primary" className="sr-only">{l.groupPrimary[lang]}</h2>
          <div className="grid grid-cols-2 gap-3 md:gap-5">
            {([dest.line, dest.rooms] as const).map(({ label, sub, href, external, Icon, image }) => (
              <DestLink
                key={href}
                href={href}
                external={external}
                newTab={l.newTab[lang]}
                className={`group flex flex-col overflow-hidden rounded-md border ${hairline} bg-pure-white/75 transition-shadow duration-300 hover:shadow-md`}
              >
                <span
                  className="block aspect-[4/3] bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.03]"
                  style={{ backgroundImage: `url('${image}')` }}
                  aria-hidden="true"
                />
                <span className="flex flex-1 flex-col p-3 md:p-4">
                  <span className="flex items-center gap-1.5 text-sage-green">
                    <Icon size={15} />
                    <span className={`${heading} text-[16px] leading-tight md:text-xl`}>{label}</span>
                  </span>
                  <span className="mt-1 flex items-end justify-between gap-2">
                    <span className="font-sans text-[11.5px] leading-snug text-dark-charcoal/70 md:text-sm">{sub}</span>
                    <ArrowRight size={14} className="mb-0.5 flex-none text-dark-charcoal/50 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </span>
              </DestLink>
            ))}
          </div>
        </section>

        {/* 5 · Outward channels — quieter, typographic */}
        <section aria-labelledby="links-channels" className="mt-8 md:mt-10">
          <h2 id="links-channels" className="sr-only">{l.groupChannels[lang]}</h2>
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-3">
            {([dest.instagram, dest.facebook, dest.tiktok, dest.googleMap] as const).map(({ label, sub, href, external, Icon }) => (
              <DestLink
                key={href}
                href={href}
                external={external}
                newTab={l.newTab[lang]}
                className={`group flex items-start justify-between gap-2 rounded-md border ${hairline} bg-pure-white/45 p-3 transition-colors duration-200 hover:bg-pure-white/80`}
              >
                <span className="min-w-0">
                  <Icon size={17} className="text-sage-green" />
                  <span className={`${heading} mt-2 block text-[15px] leading-tight`}>{label}</span>
                  <span className="mt-0.5 block font-sans text-[11px] leading-snug text-dark-charcoal/70">{sub}</span>
                </span>
                <ArrowRight size={13} className="mt-0.5 flex-none text-dark-charcoal/40 transition-transform duration-300 group-hover:translate-x-0.5" />
              </DestLink>
            ))}
          </div>
        </section>

        {/* 6 · Editorial — the featured read leads, the hub follows as a line */}
        <section aria-labelledby="links-editorial" className="mt-9 md:mt-12">
          <h2 id="links-editorial" className="sr-only">{l.groupEditorial[lang]}</h2>
          <DestLink
            href={dest.featured.href}
            external={dest.featured.external}
            newTab={l.newTab[lang]}
            className={`group block overflow-hidden rounded-md border ${hairline} bg-pure-white/75 transition-shadow duration-300 hover:shadow-md`}
          >
            <span
              className="block aspect-[16/8] bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.02]"
              style={{ backgroundImage: `url('${dest.featured.image}')` }}
              aria-hidden="true"
            />
            <span className="flex items-center justify-between gap-3 p-3.5 md:p-5">
              <span className="min-w-0">
                <span className={`${heading} block text-[17px] leading-tight md:text-2xl`}>{dest.featured.label}</span>
                <span className="mt-1 block font-sans text-[12px] leading-snug text-dark-charcoal/70 md:text-sm">{dest.featured.sub}</span>
              </span>
              <ArrowRight size={16} className="flex-none text-dark-charcoal/50 transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </DestLink>

          <DestLink
            href={dest.journalHub.href}
            external={dest.journalHub.external}
            newTab={l.newTab[lang]}
            className={`group mt-3 flex items-center gap-3 border-y ${hairline} py-3 md:py-4`}
          >
            <span
              className="block h-12 w-12 flex-none rounded-sm bg-cover bg-center md:h-14 md:w-14"
              style={{ backgroundImage: `url('${dest.journalHub.image}')` }}
              aria-hidden="true"
            />
            <span className="min-w-0 flex-1">
              <span className={`${heading} block text-[15px] leading-tight md:text-lg`}>{dest.journalHub.label}</span>
              <span className="mt-0.5 block font-sans text-[11.5px] leading-snug text-dark-charcoal/70 md:text-sm">{dest.journalHub.sub}</span>
            </span>
            <ArrowRight size={15} className="flex-none text-dark-charcoal/45 transition-transform duration-300 group-hover:translate-x-0.5" />
          </DestLink>
        </section>

        {/* 7 · Contact — a quiet, confident close */}
        <a
          href={PROPERTY.lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-9 flex min-h-12 items-center justify-center gap-2.5 rounded-md border border-sage-green/60 bg-pure-white/50 px-4 py-3 font-sans text-[13px] font-medium text-sage-green transition-colors duration-200 hover:bg-sage-green hover:text-pure-white md:mt-12 md:text-base"
        >
          <LineIcon size={16} />
          {l.addLine[lang]}
          <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          <span className="sr-only"> {l.newTab[lang]}</span>
        </a>

        {/* 8 · Footer — a small editorial / legal note */}
        <footer className="mt-10 pb-7 text-center md:mt-14">
          <p className="font-serif text-[12px] italic text-sage-green/80">{l.footerTagline[lang]}</p>
          <p className="mx-auto mt-2 max-w-[300px] font-sans text-[10px] leading-relaxed text-dark-charcoal/65">{l.aiNote[lang]}</p>
          <p className="mt-1 flex items-center justify-center gap-4 font-sans text-[10px] text-dark-charcoal/70">
            <a href={PROPERTY.privacyUrl} target="_blank" rel="noopener noreferrer" className="inline-block py-1.5 underline-offset-4 hover:underline">
              {TR.footer.privacy[lang]}
            </a>
            <a href={PROPERTY.termsUrl} target="_blank" rel="noopener noreferrer" className="inline-block py-1.5 underline-offset-4 hover:underline">
              {TR.footer.terms[lang]}
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
};

export default LinksPage;
