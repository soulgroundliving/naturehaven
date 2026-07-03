import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const ITEMS = [
  'Nature Haven',
  'Quiet Living',
  'Saimai · Bangkok',
  'September 2026',
  'Pet-Friendly',
  'All-Inclusive',
  '25 m²',
  '20 Units',
  'Private Balcony',
];

interface Props {
  speed?: number;
}

export default function MarqueeStrip({ speed = 38 }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const track = trackRef.current;
    if (!track) return;
    const half = track.scrollWidth / 2;
    gsap.fromTo(
      track,
      { x: 0 },
      { x: -half, duration: half / speed, ease: 'none', repeat: -1 }
    );
  }, { scope: wrapRef });

  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div
      ref={wrapRef}
      className="overflow-hidden py-3"
      style={{
        borderTop: '1px solid var(--sec-border, rgba(255,255,255,0.1))',
        borderBottom: '1px solid var(--sec-border, rgba(255,255,255,0.1))',
      }}
      aria-hidden="true"
    >
      <div
        ref={trackRef}
        className="flex items-center whitespace-nowrap"
        style={{ willChange: 'transform' }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center">
            <span
              className="font-sans uppercase px-7"
              style={{
                fontSize: '9px',
                letterSpacing: '0.22em',
                color: 'var(--text-on-bg, rgba(255,255,255,0.4))',
              }}
            >
              {item}
            </span>
            <span
              style={{
                fontSize: '9px',
                color: 'var(--text-on-bg, rgba(255,255,255,0.2))',
              }}
            >
              ·
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
