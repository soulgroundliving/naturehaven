import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function MagneticCursor() {
  const orbRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const orb = orbRef.current;
    const dot = dotRef.current;
    if (!orb || !dot) return;

    document.body.style.cursor = 'none';

    const xOrb = gsap.quickSetter(orb, 'x', 'px');
    const yOrb = gsap.quickSetter(orb, 'y', 'px');
    const xDot = gsap.quickSetter(dot, 'x', 'px');
    const yDot = gsap.quickSetter(dot, 'y', 'px');

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let ox = mx, oy = my;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      xDot(mx);
      yDot(my);
    };

    const tick = () => {
      ox += (mx - ox) * 0.1;
      oy += (my - oy) * 0.1;
      xOrb(ox);
      yOrb(oy);
    };

    window.addEventListener('mousemove', onMove);
    gsap.ticker.add(tick);

    // Delegated magnetic hover — tracks entry/exit on button/a without per-element listeners
    let hovering = false;

    const onOver = (e: MouseEvent) => {
      const hit = (e.target as HTMLElement).closest('button, a');
      if (hit && !hovering) {
        hovering = true;
        gsap.to(orb, { scale: 3.2, opacity: 0.18, duration: 0.35, ease: 'power2.out' });
      } else if (!hit && hovering) {
        hovering = false;
        gsap.to(orb, { scale: 1, opacity: 0.6, duration: 0.35, ease: 'power2.out' });
      }
    };

    window.addEventListener('mouseover', onOver);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      gsap.ticker.remove(tick);
      document.body.style.cursor = '';
    };
  }, []);

  return (
    <>
      {/* Lagging orb — mix-blend-mode:difference works on any bg */}
      <div
        ref={orbRef}
        className="fixed top-0 left-0 pointer-events-none z-[600]"
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: 'white',
          transform: 'translate(-50%, -50%)',
          mixBlendMode: 'difference',
          opacity: 0.6,
          willChange: 'transform',
        }}
        aria-hidden="true"
      />
      {/* Precise dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[600]"
        style={{
          width: 4,
          height: 4,
          borderRadius: '50%',
          background: 'white',
          transform: 'translate(-50%, -50%)',
          mixBlendMode: 'difference',
          willChange: 'transform',
        }}
        aria-hidden="true"
      />
    </>
  );
}
