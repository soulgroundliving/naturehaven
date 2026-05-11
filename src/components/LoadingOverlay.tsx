import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface Props {
  onComplete: () => void;
}

export default function LoadingOverlay({ onComplete }: Props) {
  const leftRef  = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const seamRef  = useRef<HTMLDivElement>(null);
  const cbRef    = useRef(onComplete);
  cbRef.current  = onComplete;

  useEffect(() => {
    const tl = gsap.timeline({ onComplete: () => cbRef.current() });

    // Brand moment — name fades in
    tl.from(brandRef.current, {
      opacity: 0,
      y: 12,
      duration: 0.9,
      ease: 'power2.out',
    }, 0.35)

    // Hold — let the name breathe
    // (implicit pause from next keyframe starting at 1.8)

    // Brand fades down — door is about to open
    .to(brandRef.current, {
      opacity: 0,
      y: -6,
      duration: 0.45,
      ease: 'power2.in',
    }, 1.8)

    // Door seam — thin warm line appears at center
    .fromTo(seamRef.current,
      { scaleY: 0, transformOrigin: 'top center', opacity: 1 },
      { scaleY: 1, duration: 0.38, ease: 'power3.out' },
      2.1
    )

    // Panels split apart — door opens
    .to(leftRef.current, {
      x: '-100%',
      duration: 1.15,
      ease: 'power3.inOut',
    }, 2.35)
    .to(rightRef.current, {
      x: '100%',
      duration: 1.15,
      ease: 'power3.inOut',
    }, 2.35)

    // Seam fades as panels move
    .to(seamRef.current, {
      opacity: 0,
      duration: 0.3,
    }, 2.45);

    return () => { tl.kill(); };
  }, []);

  return (
    <div className="fixed inset-0 z-[200]" aria-hidden="true">
      {/* Left door panel */}
      <div
        ref={leftRef}
        className="absolute left-0 top-0 w-1/2 h-full"
        style={{ background: '#15191A' }}
      />

      {/* Right door panel */}
      <div
        ref={rightRef}
        className="absolute right-0 top-0 w-1/2 h-full"
        style={{ background: '#15191A' }}
      />

      {/* Door seam — warm light at the crack */}
      <div
        ref={seamRef}
        className="absolute top-0 h-full pointer-events-none"
        style={{
          left: 'calc(50% - 1px)',
          width: '1px',
          transform: 'scaleY(0)',
          background:
            'linear-gradient(to bottom, transparent 0%, rgba(195,170,120,0.55) 18%, rgba(210,185,135,0.7) 50%, rgba(195,170,120,0.55) 82%, transparent 100%)',
          boxShadow: '0 0 18px 4px rgba(200,175,125,0.25)',
        }}
      />

      {/* Brand — centered over both panels */}
      <div
        ref={brandRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <div className="text-center">
          {/* Top rule */}
          <div className="w-8 h-px mx-auto mb-5" style={{ background: 'rgba(255,255,255,0.25)' }} />

          {/* Location tag */}
          <p
            className="font-sans uppercase mb-4"
            style={{
              fontSize: '9px',
              letterSpacing: '0.26em',
              color: 'rgba(255,255,255,0.35)',
            }}
          >
            Quiet Living · Saimai · Bangkok
          </p>

          {/* Name */}
          <h2
            className="font-serif"
            style={{
              fontSize: 'clamp(2.4rem, 6vw, 4.5rem)',
              lineHeight: 1,
              color: 'rgba(255,255,255,0.88)',
              letterSpacing: '-0.01em',
            }}
          >
            Nature Haven
          </h2>

          {/* Bottom rule */}
          <div className="w-8 h-px mx-auto mt-5" style={{ background: 'rgba(255,255,255,0.15)' }} />
        </div>
      </div>
    </div>
  );
}
