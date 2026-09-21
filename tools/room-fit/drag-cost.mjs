// Section 2 — dragging stays cheap: the walkway is measured when the piece stops, not for every step of a drag.
import { sleep } from '../lib/dev-harness.mjs';

export default async function run({ check, driver }) {
  const { spaceOf, openArticle, readGame, settle, startGame, scaleOf, grabPoint } = driver;

  // ── 2. dragging stays cheap: the walkway is measured when the piece stops ───
  // The route search is heavy on a mid-range phone (100-250 ms). Run for every 5 cm of a drag it
  // would keep the main thread busy for most of the drag, so it waits for a pause.
  const cheap = await openArticle();
  const cp = cheap.page;
  await startGame(cp);
  const routeCount = (target) => target.$$eval('[data-testid="room-fit-route"]', (lines) => lines.length);
  const startRoutes = await routeCount(cp);

  const hold = await grabPoint(cp, 'bed');
  const cheapScale = await scaleOf(cp);
  await cp.mouse.move(hold.x, hold.y);
  await cp.mouse.down();
  for (let step = 1; step <= 30; step += 1) {
    await cp.mouse.move(hold.x, hold.y - (150 * cheapScale.y * step) / 30); // slide the bed 150 cm up, over the table
    await sleep(25);
  }
  const held = await readGame(cp); // still holding: well inside the pause the game waits for
  check(
    'while a piece is held the quick rules keep up with it: the bed over the table breaks "nothing overlaps" at once',
    held.rules.fit === false && held.settled === false,
    JSON.stringify(held),
  );
  check(
    'while a piece is held the walking route steps aside instead of being re-measured for every move',
    startRoutes === 2 && (await routeCount(cp)) === 0,
    `routes: ${startRoutes} at the start, ${await routeCount(cp)} while held`,
  );
  check('while a piece is held the header does not quote a score it has not checked', held.progress === 'checking…' && !held.won, JSON.stringify(held));
  check(
    'while a piece is held the panel keeps the quick spaces live, but shows the walkway as still being checked rather than quoting the last one',
    spaceOf(held, 'walk').pending && spaceOf(held, 'walk').cmText === '…' && spaceOf(held, 'walk').tierText === 'checking…' && held.spaces.filter((s) => s.id !== 'walk').every((s) => !s.pending && /\d/.test(s.cmText)),
    JSON.stringify(held.spaces),
  );
  await cp.mouse.up();
  const released = await settle(cp);
  check(
    'once the piece stops the walkway is measured and the route comes back',
    (await routeCount(cp)) === 2 && /^narrowest \d+ cm$/.test(released.walkDetail) && /^\d of 5 rules hold$/.test(released.progress),
    JSON.stringify(released),
  );
  check('no console errors or page errors while dragging under load', cheap.problems.length === 0, cheap.problems.join(' | '));
  await cp.close();
}
