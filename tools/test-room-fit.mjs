// Behaviour test for the room-arranging game in Design Notes #01.
//
// Starts the Vite dev server, opens the real article in headless Chromium and
// plays the game the way a visitor does: real mouse drags, real touch drags, the
// keyboard, and the on-screen arrow buttons. Complements
// tools/__tests__/roomFit.test.ts, which proves the rules on paper; this proves
// the screen lets you play them.
//
//   npm run test:room-fit
//   TEST_BASE_URL=https://naturehaven-living.vercel.app npm run test:room-fit   (the deployed site, no dev server)
//
//   exit 0  every check passed
//   exit 1  a check failed (each is listed)
//   exit 2  the harness could not run (server or browser did not start)
//
// The page-driving helpers are in tools/lib/room-fit-driver.mjs; each part of the game that is played
// is a module in tools/room-fit/, in the order it runs.
import { createChecks, startHarness } from './lib/dev-harness.mjs';
import { createDriver } from './lib/room-fit-driver.mjs';
import runDesktop from './room-fit/desktop.mjs';
import runDoors from './room-fit/doors.mjs';
import runDragCost from './room-fit/drag-cost.mjs';
import runKeyboard from './room-fit/keyboard.mjs';
import runLanguage from './room-fit/language.mjs';
import runPhone from './room-fit/phone.mjs';
import runNight from './room-fit/night.mjs';

const { check, finish } = createChecks('room-fit');
const { browser, base, stop } = await startHarness({ label: 'room-fit', port: 4178, probe: '/journal/design-notes-01' });
const driver = createDriver({ browser, base });

const SECTIONS = [runDesktop, runDoors, runDragCost, runKeyboard, runLanguage, runPhone, runNight];

try {
  // Warm-up: the first dev request compiles the game's chunk and can trigger a dependency reload.
  const warm = await driver.openArticle();
  await driver.startGame(warm.page);
  await warm.page.close();

  for (const section of SECTIONS) await section({ check, driver });
} catch (error) {
  check('the test run completed', false, error.stack ?? String(error));
} finally {
  await stop();
}

finish();
