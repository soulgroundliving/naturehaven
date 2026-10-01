import React from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
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
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuTriggerRef = React.useRef<HTMLButtonElement>(null);
  const [filmOpen, setFilmOpen] = React.useState(false);
  const filmTriggerRef = React.useRef<HTMLButtonElement>(null);
  const [sel, setSel] = React.useState(0);
  const [params, setParams] = useSearchParams();
  const touchStart = React.useRef<{ x: number; y: number } | null>(null);

  // "Enter the website" portal transition (Explore tab's hero photo → the real,
  // GSAP/3D-animated homepage at "/" — a deliberately different FEEL from this
  // plain bio-hub page, so the jump should read as stepping through, not a
  // flat route swap). Captures the photo's own on-screen rect, grows a clone
  // of it to fill the viewport while a cream veil fades in, then navigates —
  // skipped entirely for prefers-reduced-motion, where the <Link> just
  // navigates immediately like any other destination on this page.
  const heroImageRef = React.useRef<HTMLSpanElement>(null);
  const portalRef = React.useRef<HTMLDivElement>(null);
  const [portal, setPortal] = React.useState<{ rect: DOMRect; image: string; href: string } | null>(null);

  React.useLayoutEffect(() => {
    if (!portal || !portalRef.current) return;
    const el = portalRef.current;
    const veil = el.querySelector<HTMLElement>('.portal-veil');
    const tl = gsap.timeline({ onComplete: () => navigate(portal.href) });
    tl.set(el, { top: portal.rect.top, left: portal.rect.left, width: portal.rect.width, height: portal.rect.height });
    tl.to(el, { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight, duration: 0.6, ease: 'power3.inOut' }, 0);
    if (veil) tl.to(veil, { opacity: 1, duration: 0.45, ease: 'power1.in' }, 0.22);
    return () => {
      tl.kill();
    };
  }, [portal, navigate]);

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

  // The 7 opening questions for the Contact chat card, in tap order. `msg` is always the Thai
  // string — Green (the LINE bot) only reads Thai keywords, so an EN-language visitor's tap
  // must still send Thai; `label` follows the page language. Each was verified against
  // the-green-haven's real classifier before shipping (2026-09-30) — see project memory for
  // the exact intent each one resolves to, and re-verify before editing: Green's keyword rules
  // live in a separate repo and change independently of this site.
  const questionKeys = ['qProject', 'qPrice', 'qAvailability', 'qPets', 'qLocation', 'qBooking', 'qNearby'] as const;
  const questions = questionKeys.map((key) => ({ key, label: l[key][lang], msg: l[key].th }));
  // Named to avoid colliding with the tab-button loop's own `selected` (which tab is active) —
  // this is which chip is picked.
  const selectedQuestion = questions[sel];

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
  // `line` (Chat on LINE) no longer has its own plate on this page (the Contact tab is the chat
  // card now) — but `l.line`/`l.lineSub` stay in translations.ts because Navigation.tsx and
  // SiteMenuOverlay.tsx still read them.
  // The Explore hero: the room photo is now the "enter the website" portal (see heroPortal()
  // below), reusing the `website`/`websiteSub` copy that used to sit on its own removed plate —
  // nothing else on the site reads those two keys, confirmed by grep before reusing them here.
  const websiteHero: Dest = { label: l.website[lang], sub: l.websiteSub[lang], href: '/', external: false, Icon: HomeIcon, image: '/assets/hero-room.jpg' };
  // Rooms-and-pricing moved off the hero photo onto this plain tile (owner: 2026-10-01).
  const roomsPrice: Dest = { label: l.rooms[lang], sub: l.roomsSub[lang], href: '/residence', external: false, Icon: HomeIcon };
  const instagram: Dest = { label: l.instagram[lang], sub: l.instagramSub[lang], href: PROPERTY.instagramUrl, external: true, Icon: InstagramIcon };
  const facebook: Dest = { label: l.facebook[lang], sub: l.facebookSub[lang], href: PROPERTY.facebookUrl, external: true, Icon: FacebookIcon };
  const tiktok: Dest = { label: l.tiktok[lang], sub: l.tiktokSub[lang], href: PROPERTY.tiktokUrl, external: true, Icon: TikTokIcon };
  const googleMap: Dest = { label: l.googleMap[lang], sub: l.mapsSub[lang], href: PROPERTY.mapsUrl, external: true, Icon: LocationPin };
  const journalHub: Dest = { label: l.journalHub[lang], sub: l.journalSub[lang], href: '/journal', external: false, Icon: EditIcon };
  // The founder's own NEST-naming story (real article, live since 2026-09-18) — now the Follow
  // tab's lead plate, because "a visitor doesn't know what NEST means" is a real gap a generic
  // Instagram cover photo never addressed. Icon is unused by `plate()` but Dest requires it.
  const nestStory: Dest = { label: l.nestStory[lang], sub: l.nestStorySub[lang], href: '/journal/nest', external: false, Icon: HomeIcon, image: '/assets/corridor-approach.jpg' };

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

  // The Explore hero, specifically: same markup as plate() but a real <Link> (not DestLink,
  // the href is always internal "/") with a ref on the photo and an onClick that intercepts the
  // navigation to run the portal transition above. prefers-reduced-motion bails out of the
  // handler entirely so the <Link> just navigates normally, same as everywhere else on the page.
  const heroPortal = ({ label, sub, href, image }: Dest) => (
    <Link
      to={href}
      onClick={(event) => {
        const imageEl = heroImageRef.current;
        if (!imageEl || !image || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        event.preventDefault();
        setPortal({ rect: imageEl.getBoundingClientRect(), image, href });
      }}
      className="group flex min-h-0 flex-1 flex-col"
    >
      <span
        ref={heroImageRef}
        className="relative block min-h-[64px] flex-1 overflow-hidden short:min-h-[44px] bg-light-warm-grey ring-1 ring-inset ring-dark-charcoal/10 md:max-h-[300px]"
        aria-hidden="true"
      >
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
    </Link>
  );

  // A compact icon tile — three sit side by side under a tab's lead plate (Explore's Map/
  // Featured/Journal Hub; Follow's Instagram/Facebook/TikTok), reading as "also here" rather
  // than competing with the plate for top billing.
  const tile = ({ label, href, external, Icon }: Dest) => (
    <DestLink
      key={href}
      href={href}
      external={external}
      newTab={l.newTab[lang]}
      className="flex min-h-[72px] flex-col items-center justify-center gap-1.5 rounded-xl border border-dark-charcoal/15 py-2.5 text-center transition-colors duration-300 hover:border-sage-green/50 hover:bg-sage-green/5 short:min-h-[60px] short:py-2"
    >
      <Icon size={18} className="flex-none text-sage-green/80" />
      <span className="font-sans text-[11px] font-medium leading-tight text-dark-charcoal min-[360px]:text-[11.5px]">{label}</span>
    </DestLink>
  );

  // The Follow tab's lead plate is now the NEST story (see `nestStory` above), so the film is a
  // slim CTA row under the channel tiles instead of its own big plate — still one tap to the
  // same full-screen player, just no longer competing with the NEST story for top billing.
  const filmRow = (
    <button
      ref={filmTriggerRef}
      type="button"
      onClick={() => setFilmOpen(true)}
      aria-haspopup="dialog"
      aria-label={`${l.watchFilm[lang]} — ${l.filmTitle[lang]}, ${l.filmSub[lang]}`}
      className="group mt-3 flex min-h-11 w-full flex-none items-center justify-center gap-2 border-y border-sage-green/30 font-sans text-[12.5px] tracking-[0.01em] text-sage-green transition-colors duration-300 hover:bg-sage-green/10 short:mt-2 short:min-h-9"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="flex-none"><path d="M8 5.5v13l11-6.5-11-6.5z" /></svg>
      {l.watchFilm[lang]}
    </button>
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
      {portal && (
        <div ref={portalRef} className="fixed z-50 overflow-hidden pointer-events-none" aria-hidden="true">
          <span className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${portal.image}')` }} />
          <span className="portal-veil absolute inset-0 bg-[#F5F1EA] opacity-0" />
        </div>
      )}

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
            // The chat card: a preview of an actual LINE message, not a link list — picking a
            // chip fills the compose bar below with that question, and the round button opens
            // LINE with it ready to send (which also adds Nature Haven as a friend for a
            // visitor who isn't one yet).
            // md:max-h caps the card the same way plate()'s image caps at md:max-h-[300px] — without
            // it, the flex-1 spacer below the chips stretches to fill the tall desktop container and
            // leaves a dead gap above the compose bar.
            <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-dark-charcoal/10 bg-pure-white/55 p-3 short:p-2.5 md:max-h-[520px]">
              <div className="flex flex-none items-center gap-2 border-b border-dark-charcoal/10 pb-2 short:pb-1.5">
                <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-sage-green/10 short:h-6 short:w-6">
                  <LeafIcon size={13} className="text-sage-green/70" />
                </span>
                <span className={`${serif} text-[15px] short:text-[13.5px]`}>Nature Haven</span>
                <span className="ml-auto flex flex-none items-center gap-1 font-sans text-[10.5px] text-dark-charcoal/60">
                  <LineIcon size={12} className="text-sage-green" /> LINE
                </span>
              </div>
              <div className="mt-2.5 max-w-[80%] flex-none self-start rounded-2xl rounded-tl-sm border border-dark-charcoal/10 bg-pure-white px-3 py-2 font-sans text-[13.5px] leading-snug text-dark-charcoal short:mt-1.5 short:py-1.5 short:text-[12.5px]">
                {l.chatPrompt[lang]}
              </div>
              <div className="mt-2.5 flex flex-none flex-wrap justify-end gap-1.5 short:mt-1.5 short:gap-1">
                {questions.map((q, i) => (
                  <button
                    key={q.key}
                    type="button"
                    onClick={() => setSel(i)}
                    aria-pressed={i === sel}
                    className={`min-h-10 rounded-full border px-3 font-sans text-[12.5px] leading-tight transition-colors duration-300 short:min-h-8 short:px-2.5 short:text-[12px] ${
                      i === sel
                        ? 'border-sage-green bg-sage-green/10 font-medium text-dark-charcoal'
                        : 'border-dark-charcoal/20 bg-pure-white/70 text-dark-charcoal/80 hover:border-dark-charcoal/35'
                    }`}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
              <div className="min-h-2 flex-1 short:min-h-1" />
              <p className="flex-none text-center font-sans text-[10px] leading-snug text-dark-charcoal/60 short:hidden">{l.chatHint[lang]}</p>
              <div className="mt-1.5 flex min-h-[46px] flex-none items-center gap-2 rounded-full border border-dark-charcoal/20 bg-pure-white py-1.5 pl-3.5 pr-1.5 short:mt-1 short:min-h-[40px] short:py-1">
                <span aria-hidden="true" className="text-[17px] leading-none text-dark-charcoal/35">+</span>
                <span className="flex-1 truncate font-sans text-[13px] text-dark-charcoal">{selectedQuestion.msg}</span>
                <a
                  href={lineMessageUrl(selectedQuestion.msg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={l.chatSend[lang]}
                  className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-sage-green text-pure-white"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 19V5M5 12l7-7 7 7" />
                  </svg>
                  <span className="sr-only"> {l.newTab[lang]}</span>
                </a>
              </div>
            </div>,
          )}
          {panel(
            'explore',
            <>
              {heroPortal(websiteHero)}
              <p className="mt-4 flex-none text-center font-sans text-[10px] text-dark-charcoal/55 short:mt-3">{l.moreExplore[lang]}</p>
              <div className="mt-2 grid flex-none grid-cols-3 gap-2">{[googleMap, roomsPrice, journalHub].map(tile)}</div>
            </>,
          )}
          {panel(
            'follow',
            <>
              {plate(nestStory)}
              <p className="mt-4 flex-none text-center font-sans text-[10px] text-dark-charcoal/55 short:mt-3">{l.moreChannels[lang]}</p>
              <div className="mt-2 grid flex-none grid-cols-3 gap-2">{[instagram, facebook, tiktok].map(tile)}</div>
              {filmRow}
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
