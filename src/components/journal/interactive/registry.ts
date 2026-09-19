import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import type { LangCode } from '@/lib/journalBlocks';

/** Props every interactive piece (game, calculator, simulator) receives. */
export interface InteractiveProps {
  lang: LangCode;
  /** The visitor asked for less motion: no autoplay, no continuous animation. */
  reducedMotion: boolean;
}

type Loader = () => Promise<{ default: ComponentType<InteractiveProps> }>;

// Register a piece here:   'room-fit': () => import('./RoomFit'),
// then use { type: 'interactive', id: 'room-fit', … } in any article.
//
// Pieces load on demand (when scrolled near), so a game costs nothing on the
// pages that do not have one. They run as ordinary same-origin components:
// no iframe, so the site CSP (frame-src 'none') does not need to change.
const LOADERS: Record<string, Loader> = {
  // Design Notes #01: arrange the 25.2 sqm room yourself (rules: src/lib/roomFit.ts).
  'room-fit': () => import('./room-fit/RoomFit'),
  // Dev-only stand-ins used by /journal-sandbox and tools/test-journal-blocks.mjs.
  // `import.meta.env.DEV` is a build-time constant, so this branch — and the
  // chunks behind it — are dropped from the production bundle.
  ...(import.meta.env.DEV
    ? {
        'sandbox-demo': () => import('./SandboxDemo'),
        'sandbox-crash': () => import('./SandboxCrash'),
      }
    : {}),
};

/**
 * Registered pieces, wrapped in React.lazy once at module load (wrapping does
 * not fetch anything — the chunk downloads when the piece first renders).
 */
export const INTERACTIVES: Readonly<Record<string, LazyExoticComponent<ComponentType<InteractiveProps>> | undefined>> =
  Object.fromEntries(Object.entries(LOADERS).map(([id, load]) => [id, lazy(load)]));
