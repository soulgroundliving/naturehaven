// Section 6 — night: the selection and the pieces stay visible against a dark floor.
import { sleep } from '../lib/dev-harness.mjs';

export default async function run({ check, driver }) {
  const { openArticle, startGame, focusPiece } = driver;

  // ── 6. night: the selection and the pieces stay visible against a dark floor ─
  // Fixed dark, the selection ring measured 1.3:1 against the night floor (3:1 is the floor for a
  // focus indicator), and a piece's edge 1.4-1.9:1. Both now follow the theme's text colour.
  const luminance = (colour) => {
    const [r, g, b] = colour
      .match(/\d+(\.\d+)?/g)
      .slice(0, 3)
      .map((channel) => {
        const c = Number(channel) / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
      });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const strokes = async (tod) => {
    const themed = await openArticle({ tod });
    await startGame(themed.page);
    await focusPiece(themed.page, 'kitchen');
    await sleep(900); // the theme's colours ease over 600 ms
    const found = await themed.page.evaluate(() => {
      const ring = getComputedStyle(document.querySelector('[data-testid="room-fit-selection"]'));
      const piece = getComputedStyle(document.querySelector('[data-piece="bed"] rect'));
      const slot = getComputedStyle(document.querySelector('[data-testid="space-meter"] > [data-filled="true"]'));
      const empty = getComputedStyle(document.querySelector('[data-testid="space-meter"] > [data-filled="false"]'));
      return { ring: ring.stroke, piece: piece.stroke, pieceOpacity: piece.strokeOpacity, slot: slot.borderTopColor, emptySlot: empty.borderTopColor };
    });
    await themed.page.close();
    return found;
  };
  const dayStrokes = await strokes('day');
  const nightStrokes = await strokes('night');
  check(
    'the selection ring follows the theme: dark by day, light at night',
    luminance(dayStrokes.ring) < 0.2 && luminance(nightStrokes.ring) > 0.6,
    JSON.stringify({ dayStrokes, nightStrokes }),
  );
  check(
    'every piece is outlined in the theme\'s text colour, so its edge shows against the floor in both themes',
    luminance(dayStrokes.piece) < 0.2 && luminance(nightStrokes.piece) > 0.6 && Number(nightStrokes.pieceOpacity) >= 0.6,
    JSON.stringify({ dayStrokes, nightStrokes }),
  );
  // The meter's green fill measured about 1.3:1 against the night card, so a filled slot is told from an empty one by its
  // outline: the theme's text colour when filled, its faint border when empty.
  const alphaOf = (colour) => Number((colour.match(/[\d.]+/g) ?? [])[3] ?? 1);
  check(
    'a filled slot of the width meter is outlined in the theme\'s text colour and an empty one only faintly, so the level reads on the card in both themes',
    luminance(dayStrokes.slot) < 0.2 && luminance(nightStrokes.slot) > 0.6 && alphaOf(dayStrokes.slot) >= 0.6 && alphaOf(nightStrokes.slot) >= 0.6 && alphaOf(dayStrokes.emptySlot) <= 0.3 && alphaOf(nightStrokes.emptySlot) <= 0.3,
    JSON.stringify({ day: [dayStrokes.slot, dayStrokes.emptySlot], night: [nightStrokes.slot, nightStrokes.emptySlot] }),
  );
}
