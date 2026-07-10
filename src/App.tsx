import { Suspense, lazy, useEffect, useRef, useState, Component, type ReactNode } from 'react';

class OrbErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import LoadingOverlay from '@/components/LoadingOverlay';
import GrainOverlay from '@/components/GrainOverlay';
import MagneticCursor from '@/components/MagneticCursor';
import MarqueeStrip from '@/components/MarqueeStrip';
import Navigation from '@/components/Navigation';
import ScrollProgressBar from '@/components/ScrollProgressBar';
import SectionDots from '@/components/SectionDots';
import FloatingLineChat from '@/components/FloatingLineChat';
import StickyMobileCTA from '@/components/StickyMobileCTA';
import LineLinkGuard from '@/components/LineLinkGuard';
import { useTimeOfDay } from '@/contexts/TimeOfDayContext';
import useSectionObserver from '@/hooks/useSectionObserver';
import { isPrerender } from '@/lib/isPrerender';
import { scrollToTarget } from '@/lib/scrollTo';

// Code-split the 3D scene — three + r3f + drei is ~1MB. Body CSS gradient
// paints the sky immediately while this chunk loads.
const OrbScene = lazy(() => import('@/components/orb/OrbScene'));

// Hero + scroll-pinned sections stay eager so ScrollTrigger has DOM refs immediately.
import HeroSection from '@/sections/HeroSection';
import AmenitiesSection from '@/sections/AmenitiesSection';

// Below-fold sections lazy-loaded — reduces initial JS parse time significantly.
const AboutSection      = lazy(() => import('@/sections/AboutSection'));
const InvitationSection = lazy(() => import('@/sections/InvitationSection'));
const CollectionsSection = lazy(() => import('@/sections/CollectionsSection'));
const ResidencesSection = lazy(() => import('@/sections/ResidencesSection'));
const LocationSection   = lazy(() => import('@/sections/LocationSection'));
const SmartLivingSection   = lazy(() => import('@/sections/SmartLivingSection'));
// TestimonialsSection intentionally NOT rendered until real residents exist
// (owner decision 2026-07-03 — "เอาตามความจริง": no placeholder quotes while
// the brand is selling transparency). The component + TR copy stay in the
// repo for re-wiring after opening.
const JournalSection       = lazy(() => import('@/sections/JournalSection'));
const FAQSection           = lazy(() => import('@/sections/FAQSection'));
const ContactSection    = lazy(() => import('@/sections/ContactSection'));
const FooterSection     = lazy(() => import('@/sections/FooterSection'));

gsap.registerPlugin(ScrollTrigger);

function App() {
  const { palette } = useTimeOfDay();
  const lenisRef = useRef<Lenis | null>(null);
  // During puppeteer prerender, skip the intro overlay entirely so the
  // snapshotted HTML shows real content instead of a white-out splash.
  const prerendering = isPrerender();
  // Intro plays once per tab session — client-side nav to /journal and back
  // (or a same-tab revisit) must not replay the 3s overlay.
  const [introComplete, setIntroComplete] = useState(() => {
    if (prerendering) return true;
    try {
      return sessionStorage.getItem('nh_intro_done') === '1';
    } catch {
      return false;
    }
  });
  // When the intro is skipped, LoadingOverlay's onComplete never runs — the
  // pre-React scroll lock (#nh-prelock in index.html) must be released here.
  useEffect(() => {
    if (introComplete) document.getElementById('nh-prelock')?.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [isPastHero, setIsPastHero] = useState(false);

  const sectionIds = [
    'about',
    'collections',
    'residences',
    'amenities',
    'journal',
    'location',
    'smart-living',
    'faq',
    'contact',
    'footer',
  ];
  const activeSection = useSectionObserver(sectionIds);

  // ── Safari: prevent page drift during intro + handle bfcache restore ──────
  // Pre-React scroll lock lives in index.html (`#nh-prelock` <style>) so the
  // body can't scroll during HTML parse — iOS Safari ignores
  // scrollRestoration='manual' once paint commits, and used to open the page
  // mid-section. The lock is released by LoadingOverlay's onComplete handler.
  //
  // pageshow (persisted:true) fires when Safari restores a page from bfcache
  // (back/forward button). The inline <head> script doesn't re-run there,
  // so we reset explicitly from the event listener.
  useEffect(() => {
    if (prerendering) return;

    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        // bfcache restore triggers Safari's saved-scroll animation just like
        // a normal load. Same 60-frame pin as LoadingOverlay onComplete below
        // — three rAFs (~50ms) didn't outlast iOS's smooth-restore on phone.
        window.scrollTo(0, 0);
        let frame = 0;
        const pinTop = () => {
          window.scrollTo(0, 0);
          if (frame++ < 60) requestAnimationFrame(pinTop);
        };
        requestAnimationFrame(pinTop);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => ScrollTrigger.refresh())
        );
      }
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, [prerendering]);

  useEffect(() => {
    const handleScroll = () => setIsPastHero(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keep ScrollTrigger positions in sync with the REAL layout. Lazy sections
  // mounting above Amenities grow the page by thousands of px
  // after triggers are created; without an explicit refresh the triggers keep
  // their mount-time start/end and play out ~6,000px too early (verified live:
  // Amenities track sat at its END while the section was still 2,000px below
  // the viewport — the recurring "doesn't start at far left"). GSAP's own
  // autoRefreshEvents cover load/resize, not client-side route remounts with
  // Suspense chunks landing over several seconds. Debounced body
  // ResizeObserver closes the gap; AmenitiesSection.onRefresh then re-applies
  // its track x from the freshly computed progress, so a refresh is always
  // safe here (the historical §855d0e0 poison can no longer stick).
  useEffect(() => {
    if (prerendering) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const ro = new ResizeObserver(() => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => ScrollTrigger.refresh(), 250);
    });
    ro.observe(document.body);
    return () => {
      ro.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [prerendering]);

  // Feature 7: frosted section lift-in on scroll.
  // Skipped on mobile and for reduced-motion users. CSS (index.css) owns the
  // initial hidden state for desktop — opacity:0 + translateY(22px) via media
  // query — so sections are hidden before JS runs.
  //
  // IntersectionObserver drives the trigger instead of GSAP ScrollTrigger.
  // This keeps the frosted-section animation completely independent of GSAP's
  // scroll machinery — creating observers never calls ScrollTrigger.refresh(),
  // so the AmenitiesSection track stays at x:0 on load.
  useEffect(() => {
    const skip =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(max-width: 767px)').matches;
    if (skip) return; // CSS keeps sections at natural opacity:1 on these breakpoints

    const animated = new WeakSet<Element>();
    const tweens: gsap.core.Tween[] = [];

    // rootMargin '-10% bottom' ≈ GSAP's 'top 90%' — fires when element top
    // crosses 90% of viewport height from the top.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const section = entry.target as HTMLElement;
          if (animated.has(section)) return;
          animated.add(section);
          io.unobserve(section);
          tweens.push(
            gsap.to(section, { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' })
          );
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0 }
    );

    // Wire up sections already in the DOM
    document.querySelectorAll<HTMLElement>('.frosted-section').forEach(el => io.observe(el));

    // Watch for lazy sections — debounced so rapid DOM mutations don't flood
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    const mo = new MutationObserver(() => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        document.querySelectorAll<HTMLElement>('.frosted-section').forEach(el => {
          if (!animated.has(el)) io.observe(el);
        });
      }, 50);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      if (debounceTimer) clearTimeout(debounceTimer);
      io.disconnect();
      tweens.forEach(t => t.kill());
    };
  }, []);

  useEffect(() => {
    // Skip smooth scroll for reduced-motion users (vestibular safety) and
    // for touch-primary devices — Lenis easing fights native iOS momentum
    // scroll and makes the page feel sluggish on phones/tablets.
    const reducedMotion  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchPrimary = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (reducedMotion || isTouchPrimary) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // NOTE: we deliberately do NOT call ScrollTrigger.normalizeScroll() on
  // touch devices. It routes native touch-scroll through a virtual scroller
  // to make pinned/sticky ScrollTriggers behave — but the trade-off is a
  // sluggish, "sticky" scroll feel in the LINE in-app browser (reported:
  // "ปัดขึ้นติด ฝืดๆ"). The only scroll-hijack left anywhere is Amenities'
  // desktop horizontal track, which unpins via CSS on mobile — so phones
  // ride pure native momentum scroll and normalizeScroll is unnecessary.

  return (
    <div className="relative">
      {!introComplete && (
        <LoadingOverlay onComplete={() => {
          // Release the pre-React scroll lock and pin scrollY = 0 for ~1s.
          // iOS Safari ignores scrollRestoration='manual' once paint commits
          // and animates back to a remembered scroll position from the prior
          // visit — three rAFs (~50ms) didn't outlast that animation, so
          // users saw the page jerk to mid-RoomJourney before snapping to
          // hero. 60 frame-by-frame pins (~1s) outlast even a slow restore.
          document.getElementById('nh-prelock')?.remove();
          try { sessionStorage.setItem('nh_intro_done', '1'); } catch { /* private mode */ }
          window.scrollTo(0, 0);
          let frame = 0;
          const pinTop = () => {
            window.scrollTo(0, 0);
            if (frame++ < 60) requestAnimationFrame(pinTop);
          };
          requestAnimationFrame(pinTop);
          // No manual ScrollTrigger.refresh() here — GSAP's own ResizeObserver
          // already refreshes positions as lazy sections load during the intro.
          // An explicit refresh at this moment can fire onUpdate with a stale
          // transient progress (Safari URL-bar virtual scroll) and push the
          // AmenitiesSection track to its end position on first paint.
          setIntroComplete(true);
        }} />
      )}
      <GrainOverlay />
      <MagneticCursor />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-pure-white focus:text-dark-charcoal focus:rounded focus:shadow-lg focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-sage-green"
      >
        Skip to content
      </a>
      <ScrollProgressBar />
      <LineLinkGuard />
      <FloatingLineChat />
      <StickyMobileCTA />
      <Navigation lenisRef={lenisRef} activeSection={activeSection} palette={palette} />
      <SectionDots
        activeSection={activeSection}
        isPastHero={isPastHero}
        onDotClick={(id) => {
          if (id === 'hero') { scrollToTarget(0, lenisRef.current); return; }
          const target = document.getElementById(id);
          if (target) scrollToTarget(target, lenisRef.current, -80);
        }}
      />
      {/* The 3D orb is useless in the crawler snapshot AND slows puppeteer
          down (WebGL init). Skip during prerender — the real client mount
          re-renders the tree and it appears normally. The meadow video now
          lives inside HeroSection's framed block, not here. */}
      {!prerendering && (
        <OrbErrorBoundary>
          <Suspense fallback={null}>
            <OrbScene />
          </Suspense>
        </OrbErrorBoundary>
      )}
      <main id="main" className="relative z-[1]">
        <HeroSection />
        <MarqueeStrip />
        <Suspense fallback={null}>
          <AboutSection />
          <InvitationSection />
          <CollectionsSection />
          <ResidencesSection />
        </Suspense>
        <AmenitiesSection />
        <Suspense fallback={null}>
          <JournalSection />
          <LocationSection />
          <SmartLivingSection />
          <FAQSection />
          <ContactSection />
          <FooterSection />
        </Suspense>
      </main>
    </div>
  );
}

export default App;