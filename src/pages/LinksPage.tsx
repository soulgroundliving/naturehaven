import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import usePageMeta from '@/hooks/usePageMeta';
import { PROPERTY } from '@/data/propertyFacts';
import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';
import SiteMenuOverlay from '@/components/SiteMenuOverlay';
import FilmDialog from '@/components/FilmDialog';
import { lineMessageUrl } from '@/lib/lineMessage';
import {
  LineIcon,
  InstagramIcon,
  FacebookIcon,
  TikTokIcon,
  LocationPin,
  BookOpenIcon,
  HomeIcon,
  EditIcon,
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

const TABS = ['contact', 'explore', 'follow'] as const;
type TabKey = (typeof TABS)[number];
const SWIPE_PX = 50;

const rule = 'border-dark-charcoal/15';
const serif = 'font-serif text-dark-charcoal';
const arrow = 'flex-none text-dark-charcoal/45 transition-transform duration-500 group-hover:translate-x-1';

// The "master link" (ลิงค์แม่) — one URL for every Nature Haven channel,
// meant to live in a social bio (Instagram/Facebook/TikTok) or get shared
// directly. Three pages behind one masthead — contact, explore, follow — so
// every destination stays on one screen without shrinking the type. The
// page is in the URL (?tab=), so a bio can link straight to "follow".
//
// Deliberately NOT built on an external bio-link tool: this is a real,
// brand-styled, prerendered route on the site we already own.
const LinksPage: React.FC = () => {
  const { lang, toggle } = useLanguage();
  const l = TR.links;
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuTriggerRef = React.useRef<HTMLButtonElement>(null);
  const [filmOpen, setFilmOpen] = React.useState(false);
  const filmTriggerRef = React.useRef<HTMLButtonElement>(null);
  const [params, setParams] = useSearchParams();
  const touchStart = React.useRef<{ x: number; y: number } | null>(null);

  const requested = params.get('tab');
  const tab: TabKey = TABS.find((key) => key === requested) ?? 'contact';

  const goTo = React.useCallback(
    (key: TabKey, focus = false) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (key === 'contact') next.delete('tab');
          else next.set('tab', key);
          return next;
        },
        { replace: true },
      );
      if (focus) requestAnimationFrame(() => document.getElementById(`links-tab-${key}`)?.focus());
    },
    [setParams],
  );

  const step = (from: TabKey, by: number, focus: boolean) => {
    const next = TABS[(TABS.indexOf(from) + by + TABS.length) % TABS.length];
    goTo(next, focus);
  };

  const onTabKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowRight') step(tab, 1, true);
    else if (event.key === 'ArrowLeft') step(tab, -1, true);
    else if (event.key === 'Home') goTo(TABS[0], true);
    else if (event.key === 'End') goTo(TABS[TABS.length - 1], true);
    else return;
    event.preventDefault();
  };

  // A horizontal swipe on the page moves to the neighbouring page; a mostly
  // vertical or short gesture (a tap, a scroll) is left alone.
  const onTouchStart = (event: React.TouchEvent) => {
    const t = event.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (event: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const t = event.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < SWIPE_PX || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    const to = TABS.indexOf(tab) + (dx < 0 ? 1 : -1);
    if (to >= 0 && to < TABS.length) goTo(TABS[to]);
  };

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

  const tabLabels: Record<TabKey, string> = {
    contact: l.tabContact[lang],
    explore: l.tabExplore[lang],
    follow: l.tabFollow[lang],
  };

  interface Dest {
    label: string;
    sub: string;
    href: string;
    external: boolean;
    Icon: IconType;
    image?: string;
  }
  const line: Dest = { label: l.line[lang], sub: l.lineSub[lang], href: PROPERTY.lineUrl, external: true, Icon: LineIcon, image: '/assets/unit-overview.jpg' };
  const website: Dest = { label: l.website[lang], sub: l.websiteSub[lang], href: '/', external: false, Icon: HomeIcon, image: '/assets/hero-room.jpg' };
  const rooms: Dest = { label: l.rooms[lang], sub: l.roomsSub[lang], href: '/residence', external: false, Icon: HomeIcon };
  const instagram: Dest = { label: l.instagram[lang], sub: l.instagramSub[lang], href: PROPERTY.instagramUrl, external: true, Icon: InstagramIcon };
  const facebook: Dest = { label: l.facebook[lang], sub: l.facebookSub[lang], href: PROPERTY.facebookUrl, external: true, Icon: FacebookIcon };
  const tiktok: Dest = { label: l.tiktok[lang], sub: l.tiktokSub[lang], href: PROPERTY.tiktokUrl, external: true, Icon: TikTokIcon };
  const googleMap: Dest = { label: l.googleMap[lang], sub: l.mapsSub[lang], href: PROPERTY.mapsUrl, external: true, Icon: LocationPin };
  const featured: Dest = { label: l.recommendedArticle[lang], sub: l.designNotesSub[lang], href: '/journal/design-notes-01', external: false, Icon: BookOpenIcon };
  const journalHub: Dest = { label: l.journalHub[lang], sub: l.journalSub[lang], href: '/journal', external: false, Icon: EditIcon };

  const plate = ({ label, sub, href, external, image }: Dest) => (
    <DestLink href={href} external={external} newTab={l.newTab[lang]} className="group flex min-h-0 flex-1 flex-col">
      <span className="relative block min-h-[64px] flex-1 overflow-hidden short:min-h-[44px] bg-light-warm-grey ring-1 ring-inset ring-dark-charcoal/10 md:max-h-[300px]" aria-hidden="true">
        <span
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
          style={{ backgroundImage: `url('${image}')` }}
        />
      </span>
      <span className="mt-2 flex flex-none items-start justify-between gap-2">
        <span className="min-w-0">
          <span className={`${serif} block text-[18px] leading-tight min-[360px]:text-[20px] md:text-[26px]`}>{label}</span>
          <span className="mt-0.5 block font-sans text-[11.5px] leading-snug text-dark-charcoal/65 min-[360px]:text-[12px] md:text-sm">{sub}</span>
        </span>
        <ArrowRight size={15} className={`${arrow} mt-1.5`} />
      </span>
    </DestLink>
  );

  const listRow = ({ label, sub, href, external, Icon }: Dest) => (
    <li key={href} className={`border-b ${rule}`}>
      <DestLink href={href} external={external} newTab={l.newTab[lang]} className="group flex min-h-[46px] items-center gap-3 py-2 short:min-h-[36px] short:py-1 md:min-h-12">
        <Icon size={16} className="flex-none text-sage-green/80" />
        <span className={`${serif} text-[16px] leading-tight min-[360px]:text-[17px] md:text-xl`}>{label}</span>
        <span className="ml-auto text-right font-sans text-[11px] leading-snug text-dark-charcoal/62 md:text-sm">{sub}</span>
        <ArrowRight size={13} className={arrow} />
      </DestLink>
    </li>
  );

  // The opening clip: a nature plate that opens the film full screen. The
  // layout is a plain div (like the link plates) with a transparent button laid
  // over it: iPhone Safari lays out a <button> used as a flex container badly —
  // the picture came up as an empty box there while a tap still worked.
  const filmPlate = (
    <div className="group relative flex min-h-0 flex-1 flex-col">
      <span className="relative block min-h-[64px] flex-1 overflow-hidden bg-light-warm-grey ring-1 ring-inset ring-dark-charcoal/10 short:min-h-[44px] md:max-h-[300px]" aria-hidden="true">
        <span
          className="absolute inset-0 bg-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
          style={{ backgroundImage: "url('/assets/hero-video-poster.jpg')", backgroundPosition: '50% 82%' }}
        />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-pure-white/85 text-sage-green shadow-sm transition-transform duration-300 group-hover:scale-105 short:h-10 short:w-10">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5-11-6.5z" /></svg>
          </span>
        </span>
      </span>
      <span className="mt-2 flex flex-none items-start justify-between gap-2" aria-hidden="true">
        <span className="min-w-0">
          <span className={`${serif} block text-[18px] leading-tight min-[360px]:text-[20px] md:text-[26px]`}>{l.filmTitle[lang]}</span>
          <span className="mt-0.5 block font-sans text-[11.5px] leading-snug text-dark-charcoal/65 min-[360px]:text-[12px] md:text-sm">{l.filmSub[lang]}</span>
        </span>
        <span className="mt-1 flex-none font-sans text-[11px] text-dark-charcoal/55 md:text-sm">{l.filmPlay[lang]}</span>
      </span>
      <button
        ref={filmTriggerRef}
        type="button"
        onClick={() => setFilmOpen(true)}
        aria-haspopup="dialog"
        aria-label={`${l.filmTitle[lang]} — ${l.filmSub[lang]}. ${l.filmPlay[lang]}`}
        className="absolute inset-0 z-10 cursor-pointer"
      />
    </div>
  );

  // Inactive pages are display:none, not unmounted: every link stays in the
  // prerendered HTML, and `hidden` alone would lose to the flex class.
  const panel = (key: TabKey, children: React.ReactNode) => (
    <div
      id={`links-panel-${key}`}
      role="tabpanel"
      aria-labelledby={`links-tab-${key}`}
      className={tab === key ? 'flex min-h-0 flex-1 flex-col' : 'hidden'}
    >
      <div className="flex min-h-0 flex-1 flex-col motion-safe:animate-tab-in">{children}</div>
    </div>
  );

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

      <div className="flex w-full max-w-[560px] items-center justify-end gap-1 px-4 pt-1 md:max-w-[720px] md:pt-5">
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
                className={`min-h-9 px-2 uppercase ${lang === code ? 'text-dark-charcoal underline underline-offset-[6px]' : 'text-dark-charcoal/65'}`}
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
      <FilmDialog
        open={filmOpen}
        onClose={() => setFilmOpen(false)}
        triggerRef={filmTriggerRef}
        src="/assets/links/what-is-nature-haven.mp4"
        poster="/assets/links/what-is-nature-haven-poster.webp"
        title={l.filmTitle[lang]}
        closeLabel={l.filmClose[lang]}
      />

      <main className="flex w-full max-w-[560px] flex-1 flex-col px-5 md:max-w-[720px] md:px-10">
        <header className="flex flex-col items-center pt-1 text-center short:pt-0 md:pt-6">
          <LeafIcon size={13} className="text-sage-green/50" />
          <h1 className={`${serif} mt-2 text-[28px] leading-none tracking-[0.07em] min-[360px]:text-[32px] md:mt-4 md:text-[56px]`}>Nature Haven</h1>
          <p className="mt-2.5 font-sans text-[9px] font-medium uppercase tracking-[0.5em] text-sage-green min-[360px]:text-[10px] md:mt-4 md:text-xs">
            {l.heroTagline[lang]}
          </p>
        </header>

        <section className="mt-4 text-center short:mt-2 md:mt-6">
          <p className={`${serif} text-[15px] leading-snug min-[360px]:text-[16px] md:text-2xl`}>
            {l.heroHeading[lang].split(' · ').map((part, i) => (
              <React.Fragment key={part}>
                {i > 0 && ' · '}
                <span className="inline-block">{part}</span>
              </React.Fragment>
            ))}
          </p>
          <p className="mt-1 font-sans text-[11px] leading-relaxed text-dark-charcoal/65 short:hidden md:mt-2 md:text-sm">{l.heroBody[lang]}</p>
        </section>

        {/* The three pages */}
        <div
          role="tablist"
          aria-label={l.tabsLabel[lang]}
          onKeyDown={onTabKeyDown}
          className={`mt-2 flex justify-center gap-7 border-b ${rule} md:mt-5 md:gap-12`}
        >
          {TABS.map((key) => {
            const selected = key === tab;
            return (
              <button
                key={key}
                id={`links-tab-${key}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`links-panel-${key}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => goTo(key)}
                className={`-mb-px min-h-11 short:min-h-9 border-b px-1 font-sans text-[13px] tracking-[0.04em] transition-colors duration-300 md:min-h-12 md:text-base ${
                  selected ? 'border-sage-green font-medium text-dark-charcoal' : 'border-transparent text-dark-charcoal/60 hover:text-dark-charcoal'
                }`}
              >
                {tabLabels[key]}
              </button>
            );
          })}
        </div>

        <div
          className="flex min-h-[220px] flex-1 flex-col pt-3 [touch-action:pan-y] md:pt-4"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {panel(
            'contact',
            <>
              {plate(line)}
              <div className="mt-3 flex-none md:mt-6">
                <p className="mb-1.5 text-center font-sans text-[11px] text-dark-charcoal/60 md:text-xs">{l.lineQuickIntro[lang]}</p>
                <div className={`grid grid-cols-3 divide-x divide-dark-charcoal/10 border-y ${rule}`}>
                  {quickMessages.map(({ key, label, text }, i) => (
                    <a
                      key={key}
                      href={lineMessageUrl(text)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex min-h-12 items-center justify-center px-1.5 py-2 text-center font-sans text-[12px] leading-tight transition-colors duration-300 hover:bg-sage-green/10 md:min-h-14 md:text-sm ${
                        i === 0 ? 'bg-sage-green/[0.08] font-medium text-sage-green' : 'text-dark-charcoal/75'
                      }`}
                    >
                      {label}
                      <span className="sr-only"> {l.newTab[lang]}</span>
                    </a>
                  ))}
                </div>
              </div>
            </>,
          )}
          {panel(
            'explore',
            <>
              {plate(website)}
              <ul className={`mt-2 flex-none border-t ${rule}`}>{[rooms, googleMap, featured, journalHub].map(listRow)}</ul>
            </>,
          )}
          {panel(
            'follow',
            <>
              {filmPlate}
              <ul className={`mt-2 flex-none border-t ${rule}`}>{[instagram, facebook, tiktok].map(listRow)}</ul>
            </>,
          )}
        </div>

        <a
          href={PROPERTY.lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-3 flex min-h-12 flex-none items-center justify-center gap-3 border-y border-sage-green/40 py-2.5 short:mt-2 short:min-h-11 short:py-1.5 font-sans text-[13px] tracking-[0.02em] text-sage-green transition-colors duration-300 hover:bg-sage-green/10 md:mt-5 md:text-base"
        >
          <LineIcon size={15} />
          {l.addLine[lang]}
          <ArrowRight size={13} className="transition-transform duration-500 group-hover:translate-x-1" />
          <span className="sr-only"> {l.newTab[lang]}</span>
        </a>

        <footer className="flex-none pb-3 pt-3 text-center short:pb-1 short:pt-1.5 md:pb-4 md:pt-4">
          <p className="mx-auto max-w-[320px] font-sans text-[9px] leading-tight text-dark-charcoal/62 min-[360px]:text-[10px]">{l.aiNote[lang]}</p>
          <p className="mt-0.5 flex items-center justify-center gap-4 font-sans text-[9.5px] text-dark-charcoal/68 min-[360px]:text-[10px]">
            <a href={PROPERTY.privacyUrl} target="_blank" rel="noopener noreferrer" className="inline-block py-1 underline-offset-4 hover:underline">
              {TR.footer.privacy[lang]}
            </a>
            <a href={PROPERTY.termsUrl} target="_blank" rel="noopener noreferrer" className="inline-block py-1 underline-offset-4 hover:underline">
              {TR.footer.terms[lang]}
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
};

export default LinksPage;
