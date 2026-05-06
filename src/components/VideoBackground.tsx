import { useEffect, useRef } from 'react';

// Cinematic looping video bg with manual fade-in/out logic. Sits at the
// fixed-viewport bottom of the z-stack:
//   body gradient (CSS fallback) → video → slot-tinted overlay → orb → main
//
// The orb canvas is also `position:fixed; z-index:0` and is rendered AFTER
// this component in App.tsx, so it paints on top (same z, later DOM order).
// `<main>` sits at z-[1] above everything, so section content always wins.
//
// Autoplay strategy: NO `autoPlay` attribute on the element — that causes
// iOS Safari to render a native play overlay when blocked, which the orb
// canvas sits on top of and blocks. Instead we call .play() in JS; if
// blocked we register a one-time touchstart unlock on the document so the
// video starts on the user's first interaction without any visible UI.

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4';

const FADE_SECONDS = 0.5;
const RESET_DELAY_MS = 100;

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // Respect prefers-reduced-motion: pause on first frame, no fade loop.
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
      .matches;
    if (reducedMotion) {
      v.pause();
      v.style.opacity = '1';
      return;
    }

    let rafId = 0;

    const tick = () => {
      const d = v.duration;
      if (d && !Number.isNaN(d)) {
        const t = v.currentTime;
        let op = 1;
        if (t < FADE_SECONDS) {
          op = t / FADE_SECONDS;
        } else if (t > d - FADE_SECONDS) {
          op = Math.max(0, (d - t) / FADE_SECONDS);
        }
        v.style.opacity = String(Math.max(0, Math.min(1, op)));
      }
      rafId = requestAnimationFrame(tick);
    };

    const onEnded = () => {
      v.style.opacity = '0';
      window.setTimeout(() => {
        v.currentTime = 0;
        v.play().catch(() => {});
      }, RESET_DELAY_MS);
    };

    const startFade = () => {
      rafId = requestAnimationFrame(tick);
    };

    v.addEventListener('ended', onEnded);

    // Try immediate play (works on desktop + some mobile browsers).
    v.play().then(startFade).catch(() => {
      // Blocked by browser policy (common on mobile before first interaction).
      // Register a one-time touch unlock — no native play UI shown this way.
      const unlock = () => {
        v.play().then(startFade).catch(() => {
          // Still blocked — CSS gradient fallback stays visible, acceptable.
        });
      };
      document.addEventListener('touchstart', unlock, { once: true, passive: true });
    });

    return () => {
      cancelAnimationFrame(rafId);
      v.removeEventListener('ended', onEnded);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
    >
      <video
        ref={videoRef}
        src={VIDEO_URL}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0 }}
      />
      {/* Slot-tinted sky overlay — fades from palette sky color at top to
          transparent at bottom so the landscape ground stays natural while
          the sky picks up the time-of-day tint. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, var(--sky-from, #E8E9EA) 0%, var(--sky-via, #F0EEE8) 40%, var(--sky-to, #DCDED5) 100%)',
          opacity: 'var(--overlay-opacity, 0.5)' as unknown as number,
          mixBlendMode: 'multiply',
        }}
      />
    </div>
  );
}
