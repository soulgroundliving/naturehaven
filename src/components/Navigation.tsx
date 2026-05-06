import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, Close } from './icons';

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
  { label: 'PHILOSOPHY', href: '#about' },
  { label: 'RESIDENCES', href: '#residences' },
  { label: 'AMENITIES', href: '#amenities' },
  { label: 'LOCATION', href: '#location' },
  { label: 'DESIGN', href: '#design' },
  { label: 'CONTACT', href: '#contact' },
];

const darkSections = ['contact', 'footer'];

interface NavigationProps {
  lenisRef: React.RefObject<any>;
  activeSection: string;
}

const Navigation: React.FC<NavigationProps> = ({ lenisRef, activeSection }) => {
  const navRef = useRef<HTMLElement>(null);
  const [isPastHero, setIsPastHero] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);

  const isOnDarkSection = darkSections.some((id) => activeSection.includes(id));
  const isDark = isOnDarkSection && isPastHero;

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const heroHeight = window.innerHeight * 0.8;

      setIsPastHero(currentY > heroHeight);

      if (currentY > lastScrollY.current && currentY > 200) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target && lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: -80 });
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          isHidden && isPastHero ? '-translate-y-full' : 'translate-y-0'
        } ${
          isPastHero
            ? 'bg-white/85 backdrop-blur-xl shadow-sm'
            : 'bg-transparent nav-on-hero'
        }`}
      >
        <div className="container-main flex items-center justify-between h-20">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (lenisRef.current) lenisRef.current.scrollTo(0);
            }}
            className={`font-serif text-lg transition-colors duration-500 ${
              isPastHero
                ? isDark
                  ? 'text-pure-white'
                  : 'text-dark-charcoal'
                : ''
            }`}
            style={
              !isPastHero ? { color: 'var(--text-on-bg, #FFFFFF)' } : undefined
            }
          >
            Nature Haven
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const sectionId = link.href.replace('#', '');
              const isActive = activeSection === sectionId;
              return (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className={`relative font-sans text-xs uppercase tracking-[0.05em] transition-colors duration-300 group ${
                    isPastHero
                      ? isDark
                        ? 'text-pure-white'
                        : 'text-dark-charcoal'
                      : ''
                  }`}
                  style={
                    !isPastHero
                      ? { color: 'var(--text-on-bg, #FFFFFF)' }
                      : undefined
                  }
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
                </button>
              );
            })}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className={`lg:hidden p-3 transition-colors duration-500 ${
              isPastHero
                ? isDark
                  ? 'text-pure-white'
                  : 'text-dark-charcoal'
                : ''
            }`}
            style={
              !isPastHero ? { color: 'var(--text-on-bg, #FFFFFF)' } : undefined
            }
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[200] bg-soft-taupe transition-all duration-500 lg:hidden ${
          mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="flex flex-col h-full p-8">
          <div className="flex justify-end">
            <button onClick={() => setMobileOpen(false)} className="p-2 text-dark-charcoal">
              <Close size={28} />
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-8">
            {navLinks.map((link, i) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="font-serif text-3xl md:text-4xl text-dark-charcoal transition-opacity duration-300 hover:opacity-60"
                style={{
                  opacity: mobileOpen ? 1 : 0,
                  transform: mobileOpen ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all 0.5s ease ${i * 0.1}s`,
                }}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;