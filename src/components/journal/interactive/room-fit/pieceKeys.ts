// What a key press means for the piece that has focus. Pure, so tools/__tests__/pieceKeys.test.ts
// runs it on plain Node.

export const KEY_STEP = 5;
export const KEY_STEP_BIG = 25;

export type KeyAction = { type: 'nudge'; dx: number; dy: number } | { type: 'rotate' };

interface KeyLike {
  key: string;
  code: string;
  shiftKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
}

const ARROWS: Record<string, readonly [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
};

export function keyAction(event: KeyLike): KeyAction | null {
  // Ctrl or Cmd+R reload the page, Alt or Cmd+Arrow navigate history: those belong to the browser.
  if (event.ctrlKey || event.metaKey || event.altKey) return null;
  if (Object.hasOwn(ARROWS, event.key)) {
    const [dx, dy] = ARROWS[event.key];
    const step = event.shiftKey ? KEY_STEP_BIG : KEY_STEP;
    return { type: 'nudge', dx: dx * step, dy: dy * step };
  }
  // `key` is the letter the layout prints, `code` the physical key. On a Thai layout the R key
  // types พ, so only the physical key answers "press R"; on Dvorak the printed letter still does.
  if (event.code === 'KeyR' || event.key.toLowerCase() === 'r') return { type: 'rotate' };
  return null;
}
