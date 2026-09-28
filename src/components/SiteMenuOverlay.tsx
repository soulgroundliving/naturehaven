import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Close } from '@/components/icons';
import { PROPERTY } from '@/data/propertyFacts';
import useDialog from '@/hooks/useDialog';
import type { Lang } from '@/contexts/LanguageContext';
import { TR } from '@/lib/translations';

interface SiteMenuOverlayProps {
  open: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  lang: Lang;
}

// A full-site menu for standalone routes (this file starts on /links; any
// future non-homepage page can reuse it) that aren't inside App.tsx's own
// <Navigation>, so its anchor items are homepage-qualified ("/#about") rather
// than bare ("#about") — clicking one navigates home and the App-mount hash
// effect (App.tsx) scrolls to the section once it mounts.
const MenuPanel: React.FC<Omit<SiteMenuOverlayProps, 'open'>> = ({ onClose, triggerRef, lang }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialog(dialogRef, onClose);

  // Mounted only while open, so cleanup = "just closed": hand focus back to
  // the hamburger that opened it (useDialog leaves that to the opener).
  useEffect(() => {
    const trigger = triggerRef.current;
    return () => trigger?.focus();
  }, [triggerRef]);

  const navLabels = TR.nav.links[lang];
  const navLinks = [
    { label: navLabels[0], href: '/#about' },
    { label: navLabels[1], href: '/#collections' },
    { label: navLabels[2], href: '/residence' },
    { label: navLabels[3], href: '/#amenities' },
    { label: navLabels[4], href: '/#journal' },
    { label: navLabels[5], href: '/#location' },
    { label: navLabels[6], href: '/#contact' },
  ];
  const secondaryLinks = [
    { label: TR.links.line[lang], href: PROPERTY.lineUrl },
    { label: TR.links.maps[lang], href: PROPERTY.mapsUrl },
  ];

  return createPortal(
    <div
      ref={dialogRef}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label={TR.links.menuTitle[lang]}
      tabIndex={-1}
      className="fixed inset-0 z-[200] bg-[#F5F3EF]"
    >
      <div className="flex h-full flex-col overflow-y-auto p-8">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-12 min-w-12 p-2 text-dark-charcoal"
            aria-label={TR.links.menuClose[lang]}
          >
            <Close size={28} />
          </button>
        </div>

        <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center gap-7 py-6">
          <div className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={onClose}
                className="font-serif text-[28px] leading-tight text-dark-charcoal transition-opacity duration-300 hover:opacity-60"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="h-px w-full bg-dark-charcoal/15" />

          <div className="flex flex-col gap-4">
            {secondaryLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="flex min-h-11 items-center justify-between font-sans text-[16px] text-dark-charcoal/85 transition-opacity duration-300 hover:opacity-60"
              >
                <span>
                  {item.label}
                  <span className="sr-only"> {TR.links.newTab[lang]}</span>
                </span>
                <span aria-hidden="true" className="text-[15px] opacity-60">↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

const SiteMenuOverlay: React.FC<SiteMenuOverlayProps> = ({ open, ...rest }) =>
  open ? <MenuPanel {...rest} /> : null;

export default SiteMenuOverlay;
