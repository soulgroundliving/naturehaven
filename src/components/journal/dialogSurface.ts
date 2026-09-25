// What a full-screen dialog over the article is painted with: the page's own sky, under the frosted-section veil.
//
// The `sec-*` text colours are written for frosted panels (src/lib/timeOfDay.ts, "CONTRAST CONTRACT"): they stay
// dark while the sky itself goes dark at dawn and at sunset. On the bare sky the reader's counter and icons were
// 1.0-1.4:1 - invisible - from 04:45 to 18:25 every day, and so was the full-screen game's heading. Nothing caught
// it, because the tests ran at `tod=day` and `tod=night`; tools/guide/contrast.mjs now runs every slot. With the
// veil the same text is 6.5:1 or better at every minute of the day (measured over the whole day, not sampled).
const VEIL = 'var(--sec-bg, rgba(255,255,255,0.86))';
const SKY = 'linear-gradient(180deg, var(--sky-from, #E8E9EA), var(--sky-via, #F0EEE8) 55%, var(--sky-to, #DCDED5))';

export const DIALOG_SURFACE = `linear-gradient(${VEIL}, ${VEIL}), ${SKY}`;
