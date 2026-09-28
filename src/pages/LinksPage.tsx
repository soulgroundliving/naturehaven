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
  ArrowRight,
  LeafIcon,
  Menu,
} from '@/components/icons';

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
// directly. Composed like an editorial page rather than a directory: a
// masthead, one line of project status, two image plates (contact, rooms),
// a quiet index of outward channels, and the journal. Structure comes from
// rules, spacing and type — not from boxes.
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

  const plates = [
    { key: 'line', label: l.line[lang], sub: l.lineSub[lang], href: PROPERTY.lineUrl, external: true, image: '/assets/balcony-view.jpg' },
    { key: 'rooms', label: l.rooms[lang], sub: l.roomsSub[lang], href: '/residence', external: false, image: '/assets/unit-overview.jpg' },
  ];

  const index: { key: string; label: string; sub: string; href: string; Icon: React.FC<{ className?: string; size?: number }> }[] = [
    { key: 'instagram', label: l.instagram[lang], sub: l.instagramSub[lang], href: PROPERTY.instagramUrl, Icon: InstagramIcon },
    { key: 'facebook', label: l.facebook[lang], sub: l.facebookSub[lang], href: PROPERTY.facebookUrl, Icon: FacebookIcon },
    { key: 'tiktok', label: l.tiktok[lang], sub: l.tiktokSub[lang], href: PROPERTY.tiktokUrl, Icon: TikTokIcon },
    { key: 'googleMap', label: l.googleMap[lang], sub: l.mapsSub[lang], href: PROPERTY.mapsUrl, Icon: LocationPin },
  ];

  const rule = 'border-dark-charcoal/15';
  const serif = 'font-serif text-dark-charcoal';
  const arrow = 'flex-none text-dark-charcoal/45 transition-transform duration-500 group-hover:translate-x-1';

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col items-center overflow-x-hidden">
      <div
        className="absolute inset-0 -z-10 bg-[#F5F1EA] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/links-leaf-bg.webp')" }}
      />
      {/* A cream veil that thickens down the page: the leaf shadow stays as
          atmosphere behind the masthead, and the reading area sits on calm ground. */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: 'linear-gradient(180deg, rgba(245,241,234,0) 0%, rgba(245,241,234,0.55) 35%, rgba(245,241,234,0.92) 70%)' }}
      />

      <div className="flex w-full max-w-[560px] items-center justify-end gap-1 px-4 pt-1.5 md:max-w-[720px] md:pt-5">
        <div className="flex items-center font-sans text-[11px] uppercase tracking-[0.14em] md:text-xs">
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
          className="flex h-9 w-9 items-center justify-center text-dark-charcoal/75"
        >
          <Menu size={19} />
        </button>
      </div>

      <SiteMenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} triggerRef={menuTriggerRef} lang={lang} />

      <main className="flex w-full max-w-[560px] flex-1 flex-col px-6 md:max-w-[720px] md:px-10">
        {/* Masthead */}
        <header className="flex flex-col items-center pt-10 text-center md:pt-16">
          <LeafIcon size={13} className="text-sage-green/50" />
          <h1 className={`${serif} mt-4 text-[38px] leading-none tracking-[0.07em] md:text-[60px]`}>Nature Haven</h1>
          <p className="mt-4 font-sans text-[10px] font-medium uppercase tracking-[0.5em] text-sage-green md:text-xs">
            {l.heroTagline[lang]}
          </p>
        </header>

        {/* Project status */}
        <section className="mt-12 text-center md:mt-16">
          <p className={`${serif} text-[16px] leading-snug min-[360px]:text-[17px] md:text-2xl`}>
            {l.heroHeading[lang].split(' · ').map((part, i) => (
              <React.Fragment key={part}>
                {i > 0 && ' · '}
                <span className="inline-block">{part}</span>
              </React.Fragment>
            ))}
          </p>
          <p className="mt-2 font-sans text-[12px] leading-relaxed text-dark-charcoal/65 md:text-sm">{l.heroBody[lang]}</p>
        </section>

        {/* Ask — three ways in, ruled rather than boxed */}
        <section aria-label={l.lineQuickIntro[lang]} className="mt-12 md:mt-14">
          <p className="mb-3 text-center font-sans text-[11px] text-dark-charcoal/60 md:text-xs">{l.lineQuickIntro[lang]}</p>
          <div className={`grid grid-cols-3 divide-x divide-dark-charcoal/10 border-y ${rule}`}>
            {quickMessages.map(({ key, label, text }, i) => (
              <a
                key={key}
                href={lineMessageUrl(text)}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex min-h-14 items-center justify-center px-1.5 py-3 text-center font-sans text-[12px] leading-tight transition-colors duration-300 hover:bg-sage-green/10 md:text-sm ${
                  i === 0 ? 'bg-sage-green/[0.08] font-medium text-sage-green' : 'text-dark-charcoal/75'
                }`}
              >
                {label}
                <span className="sr-only"> {l.newTab[lang]}</span>
              </a>
            ))}
          </div>
        </section>

        {/* Contact + rooms — two plates, tall crops, captions on the page */}
        <section aria-labelledby="links-primary" className="mt-14 md:mt-20">
          <h2 id="links-primary" className="sr-only">{l.groupPrimary[lang]}</h2>
          <div className="grid grid-cols-2 gap-4 md:gap-8">
            {plates.map(({ key, label, sub, href, external, image }) => (
              <DestLink key={key} href={href} external={external} newTab={l.newTab[lang]} className="group block">
                <span className="block aspect-[4/5] overflow-hidden bg-light-warm-grey ring-1 ring-inset ring-dark-charcoal/10" aria-hidden="true">
                  <span
                    className="block h-full w-full bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
                    style={{ backgroundImage: `url('${image}')` }}
                  />
                </span>
                <span className="mt-3 flex items-start justify-between gap-2">
                  <span className="min-w-0">
                    <span className={`${serif} block text-[18px] leading-tight md:text-2xl`}>{label}</span>
                    <span className="mt-1 block font-sans text-[11.5px] leading-snug text-dark-charcoal/65 md:text-sm">{sub}</span>
                  </span>
                  <ArrowRight size={14} className={`${arrow} mt-1.5`} />
                </span>
              </DestLink>
            ))}
          </div>
        </section>

        {/* Outward channels — a quiet index */}
        <section aria-labelledby="links-channels" className="mt-14 md:mt-20">
          <h2 id="links-channels" className="sr-only">{l.groupChannels[lang]}</h2>
          <ul className={`border-t ${rule}`}>
            {index.map(({ key, label, sub, href, Icon }) => (
              <li key={key} className={`border-b ${rule}`}>
                <DestLink href={href} external newTab={l.newTab[lang]} className="group flex min-h-14 items-center gap-3 py-3">
                  <Icon size={15} className="flex-none text-sage-green/70" />
                  <span className={`${serif} text-[16px] leading-tight md:text-xl`}>{label}</span>
                  <span className="ml-auto text-right font-sans text-[11.5px] leading-snug text-dark-charcoal/60 md:text-sm">{sub}</span>
                  <ArrowRight size={13} className={arrow} />
                </DestLink>
              </li>
            ))}
          </ul>
        </section>

        {/* Journal — the featured read as a full-width plate, the hub as a line */}
        <section aria-labelledby="links-editorial" className="mt-14 md:mt-20">
          <h2 id="links-editorial" className="sr-only">{l.groupEditorial[lang]}</h2>
          <DestLink href="/journal/design-notes-01" external={false} newTab={l.newTab[lang]} className="group block">
            <span className="block aspect-[16/9] overflow-hidden bg-light-warm-grey ring-1 ring-inset ring-dark-charcoal/10" aria-hidden="true">
              <span
                className="block h-full w-full bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
                style={{ backgroundImage: "url('/assets/design-notes-01-hero.jpg')" }}
              />
            </span>
            <span className="mt-3.5 flex items-start justify-between gap-3">
              <span className="min-w-0">
                <span className={`${serif} block text-[21px] leading-tight md:text-3xl`}>{l.recommendedArticle[lang]}</span>
                <span className="mt-1 block font-sans text-[12px] leading-snug text-dark-charcoal/65 md:text-sm">{l.designNotesSub[lang]}</span>
              </span>
              <ArrowRight size={15} className={`${arrow} mt-2`} />
            </span>
          </DestLink>

          <DestLink
            href="/journal"
            external={false}
            newTab={l.newTab[lang]}
            className={`group mt-8 flex min-h-14 items-center gap-3 border-y ${rule} py-3`}
          >
            <span className={`${serif} text-[16px] leading-tight md:text-xl`}>{l.journalHub[lang]}</span>
            <span className="ml-auto text-right font-sans text-[11.5px] leading-snug text-dark-charcoal/60 md:text-sm">{l.journalSub[lang]}</span>
            <ArrowRight size={13} className={arrow} />
          </DestLink>
        </section>

        {/* Contact — a ruled line, not a button */}
        <a
          href={PROPERTY.lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-14 flex min-h-14 items-center justify-center gap-3 border-y border-sage-green/40 py-3 font-sans text-[13px] tracking-[0.02em] text-sage-green transition-colors duration-300 hover:bg-sage-green/10 md:mt-20 md:text-base"
        >
          <LineIcon size={15} />
          {l.addLine[lang]}
          <ArrowRight size={13} className="transition-transform duration-500 group-hover:translate-x-1" />
          <span className="sr-only"> {l.newTab[lang]}</span>
        </a>

        {/* Footer note */}
        <footer className="mt-14 pb-8 text-center md:mt-20">
          <p className="font-serif text-[12px] italic text-sage-green/80">{l.footerTagline[lang]}</p>
          <p className="mx-auto mt-2 max-w-[300px] font-sans text-[10px] leading-relaxed text-dark-charcoal/60">{l.aiNote[lang]}</p>
          <p className="mt-1 flex items-center justify-center gap-4 font-sans text-[10px] text-dark-charcoal/65">
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
