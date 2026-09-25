import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

// What Tab can land on. tabindex="-1" takes an element out of the Tab order whatever it is - a button included -
// so it must not count as the first or last stop: a trap that wraps to a stop Tab cannot reach lets focus
// walk out of the dialog from the real first one.
const FOCUSABLE = ['button:not([disabled])', '[href]', 'summary', '[tabindex]'].map((selector) => `${selector}:not([tabindex="-1"])`).join(', ');

const isShown = (el: HTMLElement) => el.getClientRects().length > 0;

/**
 * What a full-screen dialog owes the page under it: the page stops scrolling while it is open, is
 * inert (a screen reader does not read it, Tab and clicks do not reach it — `aria-modal` alone is not honoured
 * everywhere, VoiceOver on iOS for one), Escape closes it, Tab wraps inside it, and focus starts on it.
 * (Returning focus to whatever opened it is the opener's job: the button that opened it is replaced while
 * the dialog is up.)
 */
export default function useDialog(dialog: RefObject<HTMLElement | null>, onClose: () => void) {
  const close = useRef(onClose);
  useEffect(() => {
    close.current = onClose;
  });

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    const html = document.documentElement.style.overflow;
    const body = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    // The dialog is a portal on <body>, a sibling of the app's root, so making the root inert leaves it alone.
    const app = document.getElementById('root');
    const wasInert = app?.hasAttribute('inert') ?? false;
    app?.setAttribute('inert', '');
    node.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close.current();
        return;
      }
      if (event.key !== 'Tab') return;
      const stops = [...node.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(isShown);
      if (stops.length === 0) return;
      const first = stops[0];
      const last = stops[stops.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === node)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.documentElement.style.overflow = html;
      document.body.style.overflow = body;
      if (!wasInert) app?.removeAttribute('inert');
    };
  }, [dialog]);
}
