import { useEffect, useRef } from 'react';

// 1px progress bar anchored to top of viewport. Fills left-to-right as user
// scrolls the full page. Color follows --cta-bg from the time-of-day palette.
export default function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const update = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = total > 0 ? (scrolled / total) * 100 : 0;
      bar.style.transform = `scaleX(${pct / 100})`;
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[200] h-px pointer-events-none"
    >
      <div
        ref={barRef}
        className="h-full origin-left"
        style={{
          background: 'var(--cta-bg, #3D5A4C)',
          transform: 'scaleX(0)',
          transition: 'transform 0.05s linear',
        }}
      />
    </div>
  );
}
