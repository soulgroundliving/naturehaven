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
import { useTimeOfDay } from '@/contexts/TimeOfDayContext';
import VideoBackground from '@/components/VideoBackground';
import useSectionObserver from '@/hooks/useSectionObserver';
import { isPrerender } from '@/lib/isPrerender';

// Code-split the 3D scene — three + r3f + drei is ~1MB. Body CSS gradient
// paints the sky immediately while this chunk loads.
const OrbScene = lazy(() => import('@/components/orb/OrbScene'));

// Hero + scroll-pinned sections stay eager so ScrollTrigger has DOM refs immediately.
import HeroSection from '@/sections/HeroSection';
import RoomJourneySection from '@/sections/RoomJourneySection';
import AmenitiesSection from '@/sections/AmenitiesSection';

// Below-fold sections lazy-loaded — reduces initial JS parse time significantly.
const AboutSection      = lazy(() => import('@/sections/AboutSection'));
const InvitationSection = lazy(() => import('@/sections/InvitationSection'));
const ResidencesSection = lazy(() => import('@/sections/ResidencesSection'));
const LocationSection   = lazy(() => import('@/sections/LocationSection'));
const DesignSection     = lazy(() => import('@/sections/DesignSection'));
const SmartLivingSection   = lazy(() => import('@/sections/SmartLivingSection'));
const TestimonialsSection  = lazy(() => import('@/sections/TestimonialsSection'));
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
  const [introComplete, setIntroComplete] = useState(prerendering);
  const [isPastHero, setIsPastHero] = useState(false);

  const sectionIds = [
    'about',
    'residences',
    'amenities',
    'testimonials',
    'location',
    'design',
    'smart-living',
    'faq',
    'contact',
    'footer',
  ];
  const activeSection = useSectionObserver(sectionIds);

  // ── Safari: prevent page drift during intro + handle bfcache restore ──────
  // On iOS Safari, the page behind a `position:fixed` overlay can still be
  // scrolled (URL bar collapse, momentum carry-over, etc.).  If scroll drifts
  // away from 0 before the overlay dismisses, every ScrollTrigger whose
  // `start` is already "past" fires simultaneously — causing all animations
  // to play at once.  Fix: lock body overflow while the overlay is up, then
  // reset scroll + refresh triggers the moment it comes down.
  //
  // pageshow (persisted:true) fires when Safari restores a page from bfcache
  // (back/forward button).  The inline <head> script doesn't re-run there,
  // so we reset explicitly from the event listener.
  useEffect(() => {
    if (prerendering) return;

    document.body.style.overflow = 'hidden';

    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        window.scrollTo(0, 0);
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

  // Feature 7: frosted section lift-in on scroll.
  // Skipped on mobile and for reduced-motion users — running 9+ simultaneous
  // backdrop-blur-xl repaints on every scroll direction change is the single
  // biggest source of jank on phones. Mobile users see frosted sections at
  // their final state from the start.
  useEffect(() => {
    const skip =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(max-width: 767px)').matches;
    if (skip) {
      gsap.set('.frosted-section', { opacity: 1, y: 0 });
      return;
    }
    gsap.set('.frosted-section', { opacity: 0, y: 22 });
    const ctx = gsap.context(() => {
      document.querySelectorAll<HTMLElement>('.frosted-section').forEach(section => {
        gsap.to(section, {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true,
            fastScrollEnd: true,
          },
        });
      });
    });
    return () => ctx.revert();
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

  return (
    <div className="relative">
      {!introComplete && (
        <LoadingOverlay onComplete={() => {
          // Release scroll lock, reset to top, let React unmount the overlay.
          // No manual ScrollTrigger.refresh() here — GSAP's own ResizeObserver
          // already refreshes positions as lazy sections load during the intro.
          // An explicit refresh at this moment can fire onUpdate with a stale
          // transient progress (Safari URL-bar virtual scroll) and push the
          // AmenitiesSection track to its end position on first paint.
          document.body.style.overflow = '';
          window.scrollTo(0, 0);
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
      <Navigation lenisRef={lenisRef} activeSection={activeSection} palette={palette} />
      <SectionDots
        activeSection={activeSection}
        isPastHero={isPastHero}
        onDotClick={(id) => {
          const target = document.getElementById(id);
          if (target && lenisRef.current) lenisRef.current.scrollTo(target, { offset: -80 });
          else if (id === 'hero' && lenisRef.current) lenisRef.current.scrollTo(0);
        }}
      />
      {/* Video + 3D Orb are useless in the crawler snapshot AND slow puppeteer
          down (remote video fetch + WebGL init). Skip them during prerender —
          real client mount re-renders the tree and they appear normally. */}
      {!prerendering && <VideoBackground />}
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
        </Suspense>
        <RoomJourneySection />
        <Suspense fallback={null}>
          <ResidencesSection />
        </Suspense>
        <MarqueeStrip speed={28} />
        <AmenitiesSection />
        <Suspense fallback={null}>
          <TestimonialsSection />
          <LocationSection />
          <DesignSection />
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