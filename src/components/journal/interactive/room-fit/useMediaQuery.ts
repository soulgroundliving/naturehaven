import { useCallback, useSyncExternalStore } from 'react';

/**
 * Whether a media query matches right now, kept current as the screen changes (turning a phone, resizing a
 * window). Before the browser can answer — the server, the prerender — it says no.
 */
export default function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
