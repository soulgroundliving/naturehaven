import { useCallback, useEffect, useRef, type MouseEvent, type PointerEvent } from 'react';

const FIRST_REPEAT_MS = 350;
const REPEAT_MS = 80;

/**
 * Press-and-hold for a nudge button: acts once on press, then repeats while held.
 * A mouse or finger acts on pointer-down; a click with `detail === 0` is a
 * keyboard activation (Enter / Space), so it acts there instead — never twice.
 */
export default function useHoldRepeat(action: () => void) {
  const latest = useRef(action);
  const timers = useRef<{ first?: number; repeat?: number }>({});

  useEffect(() => {
    latest.current = action;
  });

  const stop = useCallback(() => {
    window.clearTimeout(timers.current.first);
    window.clearInterval(timers.current.repeat);
    timers.current = {};
  }, []);

  useEffect(() => stop, [stop]);

  return {
    onPointerDown: (event: PointerEvent) => {
      if (event.button !== 0) return;
      stop(); // a second finger on the same button must not orphan the first one's timers
      latest.current();
      timers.current.first = window.setTimeout(() => {
        timers.current.repeat = window.setInterval(() => latest.current(), REPEAT_MS);
      }, FIRST_REPEAT_MS);
    },
    onPointerUp: stop,
    onPointerLeave: stop,
    onPointerCancel: stop,
    onClick: (event: MouseEvent) => {
      if (event.detail === 0) latest.current();
    },
  };
}
