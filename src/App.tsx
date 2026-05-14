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
import FloatingLineChat from '@/components/FloatingLineChat';
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

  useEffect(() => {
    const handleScroll = () => setIsPastHero(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Feature 7: frosted section lift-in on scroll
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
            toggleActions: 'play none none none',
          },
        });
      });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    // Skip smooth scroll entirely for users who prefer reduced motion —
    // Lenis's RAF-driven easing is exactly the kind of vestibular cue
    // those users opt out of. Native scroll keeps ScrollTrigger working.
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (reducedMotion) return;

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
        <LoadingOverlay onComplete={() => setIntroComplete(true)} />
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
      <FloatingLineChat />
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
        <HeroSection lenisRef={lenisRef} />
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