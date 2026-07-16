import { useFrame } from '@react-three/fiber';
import { Environment, Sparkles, Sphere } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { TimePalette } from '@/lib/timeOfDay';

// Self-hosted drei HDR environment maps (public/hdri/), pulled from
// pmndrs/drei-assets. Serving them from our own origin avoids the flaky
// raw.githack.com CDN that drei's `preset=` fetches from (it 503s while its
// cache warms) and lets the CSP keep connect-src locked to 'self'.
const ENV_FILES: Record<TimePalette['envPreset'], string> = {
  dawn: '/hdri/kiara_1_dawn_1k.hdr',
  studio: '/hdri/studio_small_03_1k.hdr',
  sunset: '/hdri/venice_sunset_1k.hdr',
  night: '/hdri/dikhololo_night_1k.hdr',
};

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
  const sparkleCount = reducedFidelity ? 90 : 270;

  return (
    <>
      <ambientLight intensity={palette.ambientIntensity} />
      <directionalLight
        position={palette.lightAngle}
        intensity={palette.lightIntensity}
        color={palette.lightColor}
      />
      <Environment files={ENV_FILES[palette.envPreset]} />
      <Sparkles
        count={sparkleCount}
        speed={0.5}
        opacity={palette.slot === 'night' ? 0.7 : 0.6}
        size={2.5}
        scale={[3.5, 3.5, 3.5]}
        color={palette.sparkleColor}
        noise={1}
      />
      <group ref={groupRef}>
        <Sphere ref={meshRef} args={[1, segments, segments]}>
          {/* Soap-bubble shell: near-total transmission (you see straight through),
              maximum iridescence (thin-film rainbow shimmer), water-soap IOR,
              very thin shell thickness. The rainbow interference makes the bubble
              visible on any background without needing a dark backdrop. */}
          <meshPhysicalMaterial
            color={orbColor}
            roughness={0}
            metalness={0.22}
            transmission={palette.glassTransmission}
            thickness={0.12}
            ior={1.35}
            attenuationColor={attenuation}
            attenuationDistance={30}
            iridescence={palette.glassIridescence}
            iridescenceIOR={1.8}
            clearcoat={1}
            clearcoatRoughness={0}
            envMapIntensity={palette.envMapIntensity}
          />
        </Sphere>
      </group>
    </>
  );
}
