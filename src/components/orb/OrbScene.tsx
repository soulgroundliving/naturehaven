import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTimeOfDay } from '@/contexts/TimeOfDayContext';
import Orb, { type OrbControls } from './Orb';

gsap.registerPlugin(ScrollTrigger);

// Glass orb fixed across the viewport. Travels lightly with scroll (sin-curve
// horizontal drift) and morphs scale/tilt at section anchors. Footer fades it
// out so the closing copy isn't competing with motion.
export default function OrbScene() {
  const { palette } = useTimeOfDay();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Frame-driven targets — refs avoid React re-renders for scroll updates
  const controlsRef = useRef<OrbControls>({ scale: 1, tilt: 0, reducedMotion: false });

  const reducedFidelity = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(pointer: coarse)').matches;
  }, []);

  useEffect(() => {
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    controlsRef.current.reducedMotion = reducedMotion;

    if (!containerRef.current || !wrapperRef.current) return;

    const container = containerRef.current;
    const wrapper = wrapperRef.current;

    const isMobile = window.matchMedia('(max-width: 767px)').matches;

    const ctx = gsap.context(() => {
      // Center the orb absolutely; xPercent/yPercent are -50 so future `x`
      // animations compose with centering instead of clobbering it.
      gsap.set(container, { xPercent: -50, yPercent: -50 });

      // Hero alignment — shift orb so its centre sits on the "Nature Haven" h1.
      // The heading centre is above the viewport midpoint; we measure the gap at
      // page-load (scroll=0) and animate back to y=0 as the hero exits.
      const heroH1 = document.querySelector<HTMLElement>('#hero h1');
      const heroOffset = heroH1
        ? (heroH1.getBoundingClientRect().top + heroH1.getBoundingClientRect().height / 2) -
          window.innerHeight / 2
        : -80;
      gsap.set(container, { y: heroOffset });

      // On mobile, skip the continuous scrub — it fires on each native scroll
      // frame and stacks with WebGL paint cost. Instead:
      //   1. Hold the orb at the H1 anchor for 3 s after the LoadingOverlay
      //      finishes opening (~3.5 s after page load — so delay 6.5 s).
      //   2. Then begin a soft, continuous up-down "breathing" oscillation
      //      between the "Nature" and "Haven" lines. Amplitude = H1 height
      //      / 4 so each extreme of the cycle lands roughly on a line of
      //      the title regardless of viewport size.
      //   3. Sine ease + symmetric down/centre/up/centre keyframes give a
      //      true sine-wave feel without per-frame onUpdate work.
      //
      // Killed when the user scrolls past hero (onLeave snaps y to 0); a
      // fresh oscillation is spun up on onEnterBack so revisiting hero
      // restores the breathing motion without a 6.5 s wait.
      if (isMobile) {
        const amplitude = heroH1
          ? heroH1.getBoundingClientRect().height / 4
          : 30;

        let oscillate: gsap.core.Tween | null = null;
        const startOscillate = () => {
          oscillate = gsap.to(container, {
            // Linear-velocity legs between centre and each extreme, with a
            // 0.75s hold AT each extreme so the orb settles before reversing
            // direction. Previously it reversed instantly at the top/bottom
            // and read as a bounce. Cycle is centre → down → hold → centre
            // → up → hold → centre (repeat). GSAP treats two consecutive
            // keyframes with the same target as a pause.
            keyframes: [
              { y: heroOffset + amplitude, duration: 2.5  },  // → down
              { y: heroOffset + amplitude, duration: 0.75 },  // hold (down)
              { y: heroOffset,             duration: 2.5  },  // → centre
              { y: heroOffset - amplitude, duration: 2.5  },  // → up
              { y: heroOffset - amplitude, duration: 0.75 },  // hold (up)
              { y: heroOffset,             duration: 2.5  },  // → centre
            ],
            ease: 'none',
            repeat: -1,
          });
        };
        const delayedStart = gsap.delayedCall(6.5, startOscillate);

        ScrollTrigger.create({
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          onLeave: () => {
            delayedStart.kill();
            oscillate?.kill();
            oscillate = null;
            gsap.set(container, { y: 0 });
          },
          onEnterBack: () => {
            gsap.set(container, { y: heroOffset });
            if (!oscillate) startOscillate();
          },
        });
      } else {
        const setOrbY = gsap.quickSetter(container, 'y', 'px');
        ScrollTrigger.create({
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
          onUpdate: (self) => {
            setOrbY(heroOffset * (1 - self.progress));
          },
        });
      }

      // Section-anchored states (scale + tilt) — set targets; Orb lerps toward
      // them each frame via controlsRef.
      ScrollTrigger.create({
        trigger: '#about',
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          controlsRef.current.scale = 1;
          controlsRef.current.tilt = 0.14;
        },
        onLeaveBack: () => {
          controlsRef.current.scale = 1;
          controlsRef.current.tilt = 0;
        },
      });

      ScrollTrigger.create({
        trigger: '#design',
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          controlsRef.current.scale = 1.4;
          controlsRef.current.tilt = 0;
        },
        onLeaveBack: () => {
          controlsRef.current.scale = 1;
          controlsRef.current.tilt = 0.14;
        },
      });

      ScrollTrigger.create({
        trigger: '#smart-living',
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          controlsRef.current.scale = 0.7;
          controlsRef.current.tilt = 0;
        },
        onLeaveBack: () => {
          controlsRef.current.scale = 1.4;
          controlsRef.current.tilt = 0;
        },
      });

      // Subtle horizontal drift across the whole scroll range (sin curve).
      // Desktop only — on mobile the per-frame quickSetter call adds work
      // while the user is already paint-bound from VideoBackground + R3F.
      if (!reducedMotion && !isMobile) {
        const drift = gsap.quickSetter(container, 'x', 'vw');
        ScrollTrigger.create({
          trigger: 'main',
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: (st) => {
            drift(Math.sin(st.progress * Math.PI * 2) * 5);
          },
        });
      }

      // Fade in on load — orb materialises gently instead of popping.
      // Target < 1 on light slots so the bubble reads as delicate/ethereal.
      const targetOpacity = palette.slot === 'night' || palette.slot === 'sunset' ? 1 : 0.72;
      gsap.to(wrapper, {
        opacity: targetOpacity,
        duration: 2,
        delay: 0.5,
        ease: 'power2.inOut',
      });

      // Footer fade — orb retreats so closing copy stands alone. Desktop
      // only: on mobile the scrub fires every native scroll frame near the
      // footer and stutters. Mobile users see the orb remain at its last
      // section state through to the end of the page.
      if (!isMobile) {
        gsap.to(wrapper, {
          opacity: 0,
          scrollTrigger: {
            trigger: 'footer',
            start: 'top 80%',
            end: 'top 20%',
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0,
      }}
    >
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '60vmin',
          height: '60vmin',
          willChange: 'transform',
        }}
      >
        <Canvas
          dpr={reducedFidelity ? [1, 1.5] : [1, 2]}
          camera={{ position: [0, 0, 4], fov: 35 }}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            <Orb
              palette={palette}
              controlsRef={controlsRef}
              reducedFidelity={reducedFidelity}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
