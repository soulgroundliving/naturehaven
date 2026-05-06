import { useFrame } from '@react-three/fiber';
import { Environment, Sparkles, Sphere } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { TimePalette } from '@/lib/timeOfDay';

export interface OrbControls {
  // Target scale (group lerps toward this each frame). 1.0 default.
  scale: number;
  // Target tilt around X axis (radians). 0 default.
  tilt: number;
  // When true, skip auto-bob/rotate; snap to targets instead of lerp.
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

  // Cache color object so we don't allocate per frame
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
      // Snap to targets — no per-frame motion
      g.scale.setScalar(c.scale);
      g.rotation.x = c.tilt;
      g.position.y = 0;
      m.rotation.y = 0;
      return;
    }

    // Idle motion — gentle bob + slow Y rotation
    g.position.y = Math.sin(t * 0.6) * 0.08;
    m.rotation.y = t * 0.1;

    // Smooth lerp toward section-driven targets
    const k = 0.06;
    const cur = g.scale.x;
    const nextScale = cur + (c.scale - cur) * k;
    g.scale.setScalar(nextScale);
    g.rotation.x += (c.tilt - g.rotation.x) * k;
  });

  const segments = reducedFidelity ? 32 : 64;
  const sparkleCount = reducedFidelity ? 60 : 180;

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
        speed={0.35}
        opacity={palette.slot === 'night' ? 0.55 : 0.4}
        size={2}
        scale={[8, 12, 4]}
        color={palette.lightColor}
        noise={1}
      />
      <group ref={groupRef}>
        <Sphere ref={meshRef} args={[1, segments, segments]}>
          {/* meshPhysicalMaterial uses single-pass transmission — no FBO
              backbuffer required, so it actually draws on a transparent
              canvas. drei's MeshTransmissionMaterial samples the framebuffer
              and outputs nothing when the FB is alpha:0. */}
          <meshPhysicalMaterial
            color={orbColor}
            roughness={0.06}
            metalness={0}
            transmission={0.75}
            thickness={2}
            ior={1.5}
            attenuationColor={attenuation}
            attenuationDistance={2.5}
            iridescence={0.6}
            iridescenceIOR={1.3}
            clearcoat={1}
            clearcoatRoughness={0.02}
            envMapIntensity={1.6}
            transparent
            opacity={0.95}
          />
        </Sphere>
      </group>
    </>
  );
}
