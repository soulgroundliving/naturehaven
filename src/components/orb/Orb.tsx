// SMOKE TEST: bare hot-pink sphere — no drei, no Suspense, no transmission.
// If this shows up, drei or transmission was the issue. If still invisible,
// the Canvas/R3F itself isn't rendering.
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Orb({ palette, controlsRef, reducedFidelity }: OrbProps) {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 3, 3]} intensity={1.5} />
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </>
  );
}
