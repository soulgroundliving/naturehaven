import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navigation from '@/components/Navigation';
import useSectionObserver from '@/hooks/useSectionObserver';

import HeroSection from '@/sections/HeroSection';
import AboutSection from '@/sections/AboutSection';
import ResidencesSection from '@/sections/ResidencesSection';
import AmenitiesSection from '@/sections/AmenitiesSection';
import LocationSection from '@/sections/LocationSection';
import DesignSection from '@/sections/DesignSection';
import SmartLivingSection from '@/sections/SmartLivingSection';
import ContactSection from '@/sections/ContactSection';
import FooterSection from '@/sections/FooterSection';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const lenisRef = useRef<Lenis | null>(null);

  const sectionIds = [
    'about',
    'residences',
    'amenities',
    'location',
    'design',
    'design-philosophy',
    'smart-living',
    'contact',
    'footer',
  ];
  const activeSection = useSectionObserver(sectionIds);

  useEffect(() => {
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
      <Navigation lenisRef={lenisRef} activeSection={activeSection} />
      <main>
        <HeroSection lenisRef={lenisRef} />
        <AboutSection />
        <ResidencesSection />
        <AmenitiesSection />
        <LocationSection />
        <DesignSection />
        <SmartLivingSection />
        <ContactSection />
        <FooterSection />
      </main>
    </div>
  );
}

export default App;