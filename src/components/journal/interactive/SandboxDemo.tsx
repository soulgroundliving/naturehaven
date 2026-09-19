import { useState } from 'react';
import type { InteractiveProps } from './registry';

// Dev-only stand-in for a real interactive piece. It proves the lazy-load,
// props and fallback plumbing without shipping a fake game, and gives
// tools/test-journal-blocks.mjs something to click.
export default function SandboxDemo({ lang, reducedMotion }: InteractiveProps) {
  const [taps, setTaps] = useState(0);
  return (
    <div data-testid="sandbox-demo" className="flex items-center gap-4 rounded-lg border sec-border p-4">
      <button
        type="button"
        onClick={() => setTaps((n) => n + 1)}
        className="rounded-full bg-sage-green px-5 py-2 font-sans text-sm text-pure-white"
      >
        {lang === 'th' ? 'แตะเพื่อนับ' : 'Tap to count'}
      </button>
      <p className="font-sans text-sm sec-text-80" data-testid="sandbox-demo-count">
        {taps}
      </p>
      <p className="font-sans text-xs sec-text-60">reduced-motion: {String(reducedMotion)}</p>
    </div>
  );
}
