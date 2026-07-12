import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, Close } from './icons';
import type { TimePalette } from '@/lib/timeOfDay';
import { useLanguage } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';
import { PROPERTY } from '@/data/propertyFacts';
import { scrollToTarget } from '@/lib/scrollTo';

gsap.registerPlugin(ScrollTrigger);

// contact section now has a fixed white background -- only footer is truly dark
const darkSections = ['footer'];

interface NavigationProps {
  lenisRef: React.RefObject<any>;
  activeSection: string;
  palette: TimePalette;
}

const Navigation: React.FC<NavigationProps> = ({ lenisRef, activeSection, palette }) => {
  const { lang, toggle } = useLanguage();
  const isLightSlot = palette.slot === 'day' || palette.slot === 'morning';
  const menuBg = isLightSlot ? '#F5F3EF' : '#0E0E0E';
  const menuText = isLightSlot ? '#2B2B2B' : '#F5F1EA';
  const menuClose = isLightSlot ? '#2B2B2B' : '#F5F1EA';
  const navRef = useRef<HTMLElement>(null);
  const [isPastHero, setIsPastHero] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isOnDarkSection = darkSections.some((id) => activeSection.includes(id));
  const isDark = isOnDarkSection && isPastHero;

  const navLabels = TR.nav.links[lang];
  const navLinks = [
    { label: navLabels[0], href: '#about' },
    { label: navLabels[1], href: '#collections' },
    { label: navLabels[2], href: '#residences' },
    { label: navLabels[3], href: '#amenities' },
    { label: navLabels[4], href: '#journal' },
    { label: navLabels[5], href: '#location' },
    { label: navLabels[6], href: '#contact' },
  ];

  // Second menu group (Sansiri-style density): standalone destinations.
  // /journal and /links are deliberate full-page navigations, so plain
  // anchors — every row leaves the homepage, hence the ↗ on all of them.
  const secondaryLinks = [
    { label: TR.links.journal[lang], href: '/journal' },
    { label: TR.footer.allChannels[lang], href: '/links' },
    { label: TR.links.maps[lang], href: PROPERTY.mapsUrl, external: true },
    { label: TR.links.line[lang], href: PROPERTY.lineUrl, external: true },
  ];

  useEffect(() => {
    // Header stays pinned through the whole scroll (Sansiri-style, owner call
    // 2026-07-12) — no hide-on-scroll; only the background flips past the hero.
    const handleScroll = () => {
      setIsPastHero(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) scrollToTarget(target, lenisRef.current, -80);
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          isPastHero
            ? 'bg-white/85 backdrop-blur-xl shadow-sm'
            : 'bg-transparent nav-on-hero'
        }`}
      >
        <div className="container-main flex items-center justify-between h-14 md:h-16">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget(0, lenisRef.current);
            }}
            className={`font-serif text-lg transition-colors duration-500 ${
              isPastHero ? (isDark ? 'text-pure-white' : 'text-dark-charcoal') : ''
            }`}
            style={!isPastHero ? { color: 'var(--text-on-bg, #FFFFFF)' } : undefined}
          >
            Nature Haven
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const sectionId = link.href.replace('#', '');
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                  className={`relative font-sans text-[13px] uppercase tracking-[0.05em] transition-colors duration-300 group ${
                    isPastHero ? (isDark ? 'text-pure-white' : 'text-dark-charcoal') : ''
                  }`}
                  style={!isPastHero ? { color: 'var(--text-on-bg, #FFFFFF)' } : undefined}
                >
                  <span className="relative">
                    {link.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-px bg-current transition-all duration-500 ease-out ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </span>
                  {isActive && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-sage-green" />
                  )}
                </a>
              );
            })}

            {/* Language toggle -- desktop */}
            <button
              onClick={toggle}
              className={`flex items-center gap-1 font-sans text-[10px] uppercase tracking-[0.1em] transition-colors duration-300 ${
                isPastHero
                  ? isDark
                    ? 'text-pure-white/70 hover:text-pure-white'
                    : 'text-dark-charcoal/60 hover:text-dark-charcoal'
                  : ''
              }`}
              style={!isPastHero ? { color: 'var(--text-on-bg, rgba(255,255,255,0.65))' } : undefined}
              aria-label="Switch language"
            >
              <span style={{ opacity: lang === 'en' ? 1 : 0.4 }}>EN</span>
              <span className="mx-0.5 opacity-30">·</span>
              <span style={{ opacity: lang === 'th' ? 1 : 0.4 }}>TH</span>
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className={`lg:hidden p-3 transition-colors duration-500 ${
              isPastHero ? (isDark ? 'text-pure-white' : 'text-dark-charcoal') : ''
            }`}
            style={!isPastHero ? { color: 'var(--text-on-bg, #FFFFFF)' } : undefined}
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[200] transition-all duration-500 lg:hidden ${
          mobileOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'
        }`}
        style={{ backgroundColor: menuBg }}
      >
        <div className="flex flex-col h-full p-8 overflow-y-auto">
          <div className="flex justify-end">
            <button onClick={() => setMobileOpen(false)} className="p-2" style={{ color: menuClose }} aria-label="Close menu">
              <Close size={28} />
            </button>
          </div>

          {/* Editorial two-group menu (Sansiri-style structure, our restraint):
              on-page sections first, then the standalone destinations with ↗. */}
          <div className="flex-1 flex w-full max-w-[420px] mx-auto flex-col justify-center gap-7 py-6">
            <div className="flex flex-col gap-5">
              {navLinks.map((link, i) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                  className="font-serif text-[28px] md:text-4xl leading-tight transition-opacity duration-300 hover:opacity-60"
                  style={{
                    color: menuText,
                    opacity: mobileOpen ? 1 : 0,
                    transform: mobileOpen ? 'translateY(0)' : 'translateY(20px)',
                    transition: `all 0.5s ease ${i * 0.07}s`,
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="h-px w-full" style={{ background: menuText, opacity: 0.15 }} />

            <div className="flex flex-col gap-4">
              {secondaryLinks.map((item, i) => (
                <a
                  key={item.href}
                  href={item.href}
                  {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="flex items-center justify-between font-sans text-[16px] transition-opacity duration-300 hover:opacity-60"
                  style={{
                    color: menuText,
                    opacity: mobileOpen ? 0.85 : 0,
                    transform: mobileOpen ? 'translateY(0)' : 'translateY(20px)',
                    transition: `all 0.5s ease ${(navLinks.length + i) * 0.07}s`,
                  }}
                >
                  <span>{item.label}</span>
                  <span aria-hidden="true" className="text-[15px] opacity-60">↗</span>
                </a>
              ))}
            </div>

            {/* Language toggle -- mobile */}
            <button
              onClick={toggle}
              className="self-start font-sans text-[13px] uppercase tracking-[0.15em]"
              style={{ color: menuText, opacity: 0.6 }}
              aria-label="Switch language"
            >
              <span style={{ opacity: lang === 'en' ? 1 : 0.4 }}>EN</span>
              <span className="mx-1.5 opacity-30">·</span>
              <span style={{ opacity: lang === 'th' ? 1 : 0.4 }}>TH</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
