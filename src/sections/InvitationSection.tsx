import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const PenNib = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);

const InvitationSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const card  = sectionRef.current.querySelector('.inv-card');
      const pen   = sectionRef.current.querySelector('.inv-pen');
      const rule  = sectionRef.current.querySelector('.inv-rule');
      const lines = sectionRef.current.querySelectorAll('.inv-line');
      const seal  = sectionRef.current.querySelector('.inv-seal');

      // ── Entry: card + text reveal — reverses on scroll back ──────
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      })
        .from(card, { opacity: 0, y: 32, scale: 0.984, duration: 0.9, ease: 'power3.out' })
        .from(lines, { opacity: 0, y: 10, duration: 0.55, stagger: 0.15, ease: 'power2.out' }, '-=0.5')
        .from(seal,  { opacity: 0, scale: 0.82, duration: 0.6, ease: 'back.out(1.7)' });

      // ── Pen + rule — bidirectional via onUpdate + quickSetter ───────
      // quickSetter bypasses GSAP's tween engine so reverse scroll works
      // correctly with Lenis (no lag tween fighting the smooth scroll).
      if (!pen || !rule) return;
      gsap.set(pen,  { left: '0%', opacity: 0 });
      gsap.set(rule, { scaleX: 0, transformOrigin: 'left center' });

      const setPenLeft    = gsap.quickSetter(pen,  'left',    '%');
      const setPenOpacity = gsap.quickSetter(pen,  'opacity');
      const setRuleScale  = gsap.quickSetter(rule, 'scaleX');

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 68%',
        end:   'top 18%',
        onUpdate: (self) => {
          const p = self.progress;
          setPenLeft(p * 96);
          setRuleScale(p);
          // fade in at start only — stays visible once drawn
          setPenOpacity(p < 0.06 ? p / 0.06 : 1);
        },
        // Ensure pen stays at end-state when scrolled past trigger
        onLeave: () => { setPenLeft(96); setRuleScale(1); setPenOpacity(1); },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="section-padding"
      aria-label="A Gentle Invitation"
    >
      <div className="container-main flex justify-center">
        <div
          className="inv-card relative w-full max-w-[580px] rounded-2xl px-6 py-10 sm:px-10 sm:py-14 md:px-16 md:py-20"
          style={{
            background: 'linear-gradient(148deg, #FDFAF6 0%, #F5EDE0 100%)',
            boxShadow:
              '0 14px 52px rgba(43,43,43,0.09), 0 2px 10px rgba(43,43,43,0.04), inset 0 1px 0 rgba(255,255,255,0.9)',
            transform: 'rotate(-0.6deg)',
          }}
        >
          {/* Folded corner — stationery detail */}
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 w-10 h-10 pointer-events-none rounded-tr-2xl"
            style={{
              background:
                'linear-gradient(225deg, rgba(43,43,43,0.07) 50%, transparent 50%)',
            }}
          />

          {/* Label */}
          <p
            className="section-label mb-8 tracking-[0.22em]"
            style={{ color: '#9B8A78' }}
          >
            A Gentle Invitation
          </p>

          {/* Pen riding the ink rule */}
          <div className="relative h-px mb-11" style={{ overflow: 'visible' }}>
            <div
              className="inv-rule absolute inset-0"
              style={{
                background: '#9B8A78',
                opacity: 0.28,
                transformOrigin: 'left center',
              }}
            />
            <div
              className="inv-pen absolute top-1/2 -translate-y-1/2"
              style={{ color: '#9B8A78' }}
            >
              <PenNib />
            </div>
          </div>

          {/* Invitation copy */}
          <div
            className="font-serif italic leading-[1.65] text-dark-charcoal"
            style={{ fontSize: 'clamp(1.3rem, 3.5vw, 1.65rem)' }}
          >
            <p className="inv-line">Nature Haven</p>
            <p className="inv-line">is not made for everyone.</p>
            <p className="inv-line" style={{ marginTop: '1.1em' }}>
              It is for those
            </p>
            <p className="inv-line">who know what matters—</p>
            <p className="inv-line">and choose to live with it.</p>
          </div>

          {/* NH monogram */}
          <div
            className="inv-seal mt-12 flex items-center gap-3"
            aria-hidden="true"
          >
            <div
              className="h-px flex-1"
              style={{ background: '#9B8A78', opacity: 0.22 }}
            />
            <span
              className="font-serif text-xs tracking-[0.38em]"
              style={{ color: '#9B8A78', opacity: 0.55 }}
            >
              N H
            </span>
            <div
              className="h-px flex-1"
              style={{ background: '#9B8A78', opacity: 0.22 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvitationSection;
