import { useFrame } from '@react-three/fiber';
import { Environment, Sparkles, Sphere } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { TimePalette } from '@/lib/timeOfDay';

export interface OrbControls {
  scale: number;
  tilt: number;
  reducedMotion: boolean;
}

interface OrbProps {
  palette: TimePalette;
  controlsRef: React.MutableRefObject<OrbControls>;
  reducedFidelity: boolean;
}

export default function Orb({ palette, controlsRef, reducedFidelity }: OrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const orbColor = useMemo(
    () => new THREE.Color(palette.orbTint[0], palette.orbTint[1], palette.orbTint[2]),
    [palette]
  );
  const attenuation = useMemo(() => new THREE.Color(palette.lightColor), [palette]);

  useFrame((state) => {
    const g = groupRef.current;
    const m = meshRef.current;
    if (!g || !m) return;
    const c = controlsRef.current;
    const t = state.clock.elapsedTime;

    if (c.reducedMotion) {
      g.scale.setScalar(c.scale);
      g.rotation.x = c.tilt;
      g.position.y = 0;
      m.rotation.y = 0;
      return;
    }

    g.position.y = Math.sin(t * 0.6) * 0.08;
    m.rotation.y = t * 0.1;

    const k = 0.06;
    const cur = g.scale.x;
    const nextScale = cur + (c.scale - cur) * k;
    g.scale.setScalar(nextScale);
    g.rotation.x += (c.tilt - g.rotation.x) * k;
  });

  const segments = reducedFidelity ? 32 : 64;
  const sparkleCount = reducedFidelity ? 180 : 540;

  return (
    <>
      <ambientLight intensity={palette.ambientIntensity} />
      <directionalLight
        position={palette.lightAngle}
        intensity={palette.lightIntensity}
        color={palette.lightColor}
      />
      <Environment preset={palette.envPreset} />
      <Sparkles
        count={sparkleCount}
        speed={0.5}
        opacity={palette.slot === 'night' ? 0.7 : 0.55}
        size={2.5}
        scale={[3.5, 3.5, 3.5]}
        color={palette.lightColor}
        noise={1}
      />
      <group ref={groupRef}>
        <Sphere ref={meshRef} args={[1, segments, segments]}>
          {/* Tinted glass with subtle transmission — single-pass shader keeps
              the surface visible on a transparent canvas. Iridescence +
              clearcoat give the peachweb glass shimmer; envMapIntensity boosts
              IBL reflection from the time-of-day Environment preset. */}
          <meshPhysicalMaterial
            color={orbColor}
            roughness={0}
            metalness={0}
            transmission={0.96}
            thickness={1.2}
            ior={1.52}
            attenuationColor={attenuation}
            attenuationDistance={8}
            iridescence={0.35}
            iridescenceIOR={1.3}
            clearcoat={1}
            clearcoatRoughness={0.02}
            envMapIntensity={2.8}
          />
        </Sphere>
      </group>
    </>
  );
}
