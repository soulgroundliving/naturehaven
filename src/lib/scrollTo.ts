import type Lenis from 'lenis';

/**
 * Scroll to a target (element, or a numeric Y position like 0 for "top") using
 * Lenis when available, falling back to native smooth scroll otherwise.
 *
 * Lenis is intentionally skipped on touch-primary devices (see App.tsx's
 * matchMedia('(hover: none) and (pointer: coarse)') check) — every nav click
 * that called `lenisRef.current.scrollTo(...)` with no else branch silently
 * did nothing on mobile as a result (bug report 2026-07-09: "กดไปส่วนไหนก็ไม่
 * เลื่อน ค้างอยู่บนสุด"). This fallback closes that gap.
 */
export function scrollToTarget(target: Element | number, lenis: Lenis | null, offset = 0) {
  if (lenis) {
    if (typeof target === 'number') lenis.scrollTo(target);
    // Lenis' type declares HTMLElement, but it only ever calls getBoundingClientRect
    // at runtime — any Element (what querySelector/getElementById return) works fine.
    else lenis.scrollTo(target as HTMLElement, { offset });
    return;
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' });
    return;
  }
  const top = target.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: 'smooth' });
}
