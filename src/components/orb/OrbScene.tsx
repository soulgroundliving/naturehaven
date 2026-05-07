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

    const ctx = gsap.context(() => {
      // Center the orb absolutely; xPercent/yPercent are -50 so future `x`
      // animations compose with centering instead of clobbering it.
      gsap.set(container, { xPercent: -50, yPercent: -50 });

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

      // Subtle horizontal drift across the whole scroll range (sin curve)
      if (!reducedMotion) {
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

      // Fade in on load — orb materialises gently instead of popping
      gsap.to(wrapper, {
        opacity: 1,
        duration: 2,
        delay: 0.5,
        ease: 'power2.inOut',
      });

      // Footer fade — orb retreats so closing copy stands alone
      gsap.to(wrapper, {
        opacity: 0,
        scrollTrigger: {
          trigger: 'footer',
          start: 'top 80%',
          end: 'top 20%',
          scrub: true,
        },
      });
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
          // Clip canvas to circle when sceneBg is active — hides the square
          // canvas corners so only the circular orb area is visible.
          borderRadius: palette.sceneBg ? '50%' : undefined,
          overflow: palette.sceneBg ? 'hidden' : undefined,
        }}
      >
        <Canvas
          dpr={reducedFidelity ? [1, 1.5] : [1, 2]}
          camera={{ position: [0, 0, 4], fov: 35 }}
          gl={{ antialias: true, alpha: true }}
        >
          {/* Deep atmospheric background for light-sky slots — gives the glass
              a dark surface to refract so it reads as glass rather than a
              white disc. Null for night/sunset where CSS sky provides contrast. */}
          {palette.sceneBg && (
            <color attach="background" args={[palette.sceneBg]} />
          )}
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
