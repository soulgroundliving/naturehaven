import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DIALOG_SURFACE } from '../../src/components/journal/dialogSurface.ts';
import { getContinuousPalette } from '../../src/lib/timeOfDay.ts';

// The full-screen dialogs (the reader, the game) are painted with the page's sky. The `sec-*` text colours are made for a
// frosted panel, not for the bare sky - which is dark at dawn and at sunset while the text stays dark. The surface lays
// the palette's own frosted veil (--sec-bg) under the text. This measures the whole day, minute by five minutes,
// with the site's own palette blending, so an edit to a palette that breaks the contract fails here.

type Rgb = [number, number, number];
const parse = (value: string): [number, number, number, number] => {
  const text = value.trim();
  if (text.startsWith('#')) {
    const hex = text.length === 4 ? [...text.slice(1)].map((c) => c + c).join('') : text.slice(1);
    return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16), 1];
  }
  const [r, g, b, a = 1] = (text.match(/[\d.]+/g) ?? []).map(Number);
  return [r, g, b, a];
};
const over = ([r, g, b, a]: [number, number, number, number], [br, bg, bb]: Rgb): Rgb => [r * a + br * (1 - a), g * a + bg * (1 - a), b * a + bb * (1 - a)];
const linear = (v: number) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const luminance = ([r, g, b]: Rgb) => 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
const ratio = (a: Rgb, b: Rgb) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const mix = (a: Rgb, b: Rgb, t: number): Rgb => [a[0] * (1 - t) + b[0] * t, a[1] * (1 - t) + b[1] * t, a[2] * (1 - t) + b[2] * t];

// The top of the dialog is where the counter and the icons sit: the first ~12% of a gradient whose middle stop is at 55%.
function worstOverTheDay(veiled: boolean) {
  let worst = { text: Infinity, at: '' };
  for (let minute = 0; minute < 24 * 60; minute += 5) {
    const palette = getContinuousPalette(new Date(2026, 5, 1, Math.floor(minute / 60), minute % 60));
    const from = parse(palette.skyFrom).slice(0, 3) as Rgb;
    const via = parse(palette.skyVia).slice(0, 3) as Rgb;
    const bar = mix(from, via, 0.11 / 0.55);
    const ground = veiled ? over(parse(palette.secBg), bar) : bar;
    for (const token of [palette.secText, palette.secText70, palette.secText80]) {
      const contrast = ratio(over(parse(token), ground), ground);
      if (contrast < worst.text) worst = { text: contrast, at: `${String(Math.floor(minute / 60)).padStart(2, '0')}:${String(minute % 60).padStart(2, '0')} ${palette.slot}` };
    }
  }
  return worst;
}

test('with the veil the dialogs\' text is at least 4.5:1 at every minute of the day', () => {
  const worst = worstOverTheDay(true);
  assert.ok(worst.text >= 4.5, `worst ${worst.text.toFixed(2)}:1 at ${worst.at}`);
});

test('without the veil it is not - so the check above can fail (this is the bug it guards: 1.0:1 around dawn and dusk)', () => {
  const worst = worstOverTheDay(false);
  assert.ok(worst.text < 2, `worst ${worst.text.toFixed(2)}:1 at ${worst.at}`);
});

test('the surface is the veil over the sky, in that order (the first layer paints on top)', () => {
  assert.ok(DIALOG_SURFACE.startsWith('linear-gradient(var(--sec-bg'), 'it starts with the veil');
  assert.ok(DIALOG_SURFACE.includes(', linear-gradient(180deg, var(--sky-from'), 'and the sky is the layer under it');
  assert.ok(DIALOG_SURFACE.indexOf('--sec-bg') < DIALOG_SURFACE.indexOf('--sky-from'), 'the veil comes before the sky');
});
