import { useCallback, useEffect, useRef } from 'react';

const ENTRY = 'overlay';

/**
 * A full-screen overlay the Back gesture dismisses — Android's Back button, the swipe on iOS — instead of
 * leaving the page and losing whatever was open. The overlay gets a history entry of its own (same URL, so
 * the router sees no navigation): Back pops it, and that pop is the dismissal.
 *
 * `enter()` when it opens. `leave()` to close it from inside (Escape, a close button): it takes the entry
 * back off and the pop then dismisses; with no entry to take off it dismisses at once.
 */
export default function useBackDismiss(open: boolean, dismiss: () => void) {
  const latest = useRef(dismiss);
  const pushed = useRef(false);
  useEffect(() => {
    latest.current = dismiss;
  });

  useEffect(() => {
    if (!open) return;
    const onBack = () => {
      pushed.current = false;
      latest.current();
    };
    window.addEventListener('popstate', onBack);
    return () => window.removeEventListener('popstate', onBack);
  }, [open]);

  const enter = useCallback(() => {
    try {
      window.history.pushState({ [ENTRY]: true }, '');
      pushed.current = true;
    } catch {
      pushed.current = false; // it still opens; Back then leaves the page, as it would have
    }
  }, []);

  const leave = useCallback(() => {
    if (pushed.current && window.history.state?.[ENTRY]) window.history.back();
    else latest.current();
  }, []);

  return { enter, leave };
}
