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
import { useTimeOfDay } from '@/contexts/TimeOfDayContext';
import VideoBackground from '@/components/VideoBackground';
import FloatingLineChat from '@/components/FloatingLineChat';
import useSectionObserver from '@/hooks/useSectionObserver';

// Code-split the 3D scene — three + r3f + drei is ~1MB. Body CSS gradient
// paints the sky immediately while this chunk loads.
const OrbScene = lazy(() => import('@/components/orb/OrbScene'));

import HeroSection from '@/sections/HeroSection';
import AboutSection from '@/sections/AboutSection';
import InvitationSection from '@/sections/InvitationSection';
import RoomJourneySection from '@/sections/RoomJourneySection';
import ResidencesSection from '@/sections/ResidencesSection';
import AmenitiesSection from '@/sections/AmenitiesSection';
import LocationSection from '@/sections/LocationSection';
import DesignSection from '@/sections/DesignSection';
import SmartLivingSection from '@/sections/SmartLivingSection';
import FAQSection from '@/sections/FAQSection';
import ContactSection from '@/sections/ContactSection';
import FooterSection from '@/sections/FooterSection';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const { palette } = useTimeOfDay();
  const lenisRef = useRef<Lenis | null>(null);
  const [introComplete, setIntroComplete] = useState(false);

  const sectionIds = [
    'about',
    'residences',
    'amenities',
    'location',
    'design',
    'smart-living',
    'faq',
    'contact',
    'footer',
  ];
  const activeSection = useSectionObserver(sectionIds);

  // Feature 7: frosted section lift-in on scroll
  useEffect(() => {
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
      <Navigation lenisRef={lenisRef} activeSection={activeSection} palette={palette} />
      <VideoBackground />
      <OrbErrorBoundary>
        <Suspense fallback={null}>
          <OrbScene />
        </Suspense>
      </OrbErrorBoundary>
      <main id="main" className="relative z-[1]">
        <HeroSection lenisRef={lenisRef} />
        <MarqueeStrip />
        <AboutSection />
        <InvitationSection />
        <RoomJourneySection />
        <ResidencesSection />
        <MarqueeStrip speed={28} />
        <AmenitiesSection />
        <LocationSection />
        <DesignSection />
        <SmartLivingSection />
        <FAQSection />
        <ContactSection />
        <FooterSection />
      </main>
      <FloatingLineChat />
    </div>
  );
}

export default App;