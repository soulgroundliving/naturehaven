// The "try it" page: the real game, played with a real touch, on the same screen as the reader's own strip.
import { VIEWPORTS } from '../lib/guide-driver.mjs';

export default async function run({ check, driver }) {
  const { page, problems } = await driver.openGuide({ viewport: VIEWPORTS.phone });
  const before = await driver.goTo(page, 6);
  const pieces = await driver.gamePieces(page);
  check('the game page is the game (six pieces on a plan) with no article text over it', before.hasGame && before.card === null && Object.keys(pieces).length === 6, JSON.stringify(Object.keys(pieces)));
  check('there is one game on the page, not this one and another behind it', (await page.evaluate(() => document.querySelectorAll('[data-testid="room-fit"]').length)) === 1);

  // A finger drags a piece by as far as the finger went. (This once passed with the piece moving a third of the way:
  // without touch-action the browser took the touch to pan the page and cancelled the drag half way.)
  await page.evaluate(() => {
    window.__cancels = 0;
    document.addEventListener('pointercancel', () => (window.__cancels += 1), true);
  });
  const start = pieces;
  const scale = await driver.boardScale(page);
  const from = await driver.pieceMiddle(page, 'bed');
  const TRAVEL = 60;
  await driver.touchDrag(page, from, { x: from.x, y: from.y + TRAVEL });
  const moved = await driver.gamePieces(page);
  const slack = 5 * scale + 4; // pieces snap to a 5cm grid; a few pixels for the rounding of a touch
  const dy = (moved.bed.y - start.bed.y) * scale;
  const dx = (moved.bed.x - start.bed.x) * scale;
  check(`a finger drags a piece by as far as it went (${TRAVEL}px down: the bed moved ${dy.toFixed(1)}px down, ${dx.toFixed(1)}px across)`, Math.abs(dy - TRAVEL) <= slack && Math.abs(dx) <= slack, JSON.stringify({ dy, dx, slack, start: start.bed, moved: moved.bed }));
  check('...and the browser never took the touch from it (no pointercancel)', (await page.evaluate(() => window.__cancels)) === 0, String(await page.evaluate(() => window.__cancels)));
  check('...and only that piece moved', Object.keys(start).filter((id) => id !== 'bed').every((id) => JSON.stringify(start[id]) === JSON.stringify(moved[id])), JSON.stringify(moved));
  const after = await driver.read(page);
  check('the strip on top did not move while a piece was dragged', after.bars.next.x === before.bars.next.x && after.bars.next.y === before.bars.next.y);

  // Turning the phone swaps the game's layout, and the control that had focus goes with it: focus must stay in the reader.
  await page.evaluate((selector) => document.querySelector(`${selector} [data-testid="room-fit"] button`)?.focus(), driver.DIALOG);
  const focusedBefore = await page.evaluate((selector) => Boolean(document.activeElement?.closest(`${selector} [data-testid="room-fit"]`)), driver.DIALOG);
  await page.setViewport(VIEWPORTS.landscape);
  await new Promise((resolve) => setTimeout(resolve, 400));
  const focusedAfter = await page.evaluate((selector) => ({ inside: Boolean(document.activeElement?.closest(selector)), tag: document.activeElement?.tagName }), driver.DIALOG);
  check('turning the phone on its side keeps focus in the reader', focusedBefore && focusedAfter.inside, JSON.stringify([focusedBefore, focusedAfter]));
  await page.setViewport(VIEWPORTS.phone);
  await new Promise((resolve) => setTimeout(resolve, 300));

  await driver.next(page);
  check('Next leaves the game for the final plan', (await driver.read(page)).stage === 'final');
  await driver.back(page);
  const kept = await driver.gamePieces(page);
  check('coming back, the arrangement is as it was left', JSON.stringify(kept.bed) === JSON.stringify(moved.bed), JSON.stringify([kept.bed, moved.bed]));
  check('the game ran clean', problems.length === 0, problems.join(' | '));
  await page.close();
}
