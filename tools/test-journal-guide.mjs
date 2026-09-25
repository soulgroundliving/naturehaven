// Behaviour test for the page-by-page reader of Design Notes #01 (?guide).
//
// Starts the Vite dev server, opens the real article in headless Chromium and reads it the way a visitor does:
// a phone held upright, real taps on doors, real touch drags in the game, Tab and Escape, and the colours it paints
// at every hour of the site's day. Complements
// tools/__tests__/journalGuide.test.ts, which proves how the article is cut into pages on paper; this proves
// what the screen shows of it.
//
//   npm run test:guide
//   TEST_BASE_URL=https://naturehaven-living.vercel.app npm run test:guide   (the deployed site, no dev server)
//
//   exit 0  every check passed
//   exit 1  a check failed (each is listed)
//   exit 2  the harness could not run (server or browser did not start)
//
// The page-driving helpers are in tools/lib/guide-driver.mjs; each part of the reader that is exercised is a
// module in tools/guide/, in the order it runs.
import { createChecks, startHarness } from './lib/dev-harness.mjs';
import { createGuideDriver } from './lib/guide-driver.mjs';
import runContrast from './guide/contrast.mjs';
import runDialog from './guide/dialog.mjs';
import runDoors from './guide/doors.mjs';
import runGame from './guide/game.mjs';
import runLanguages from './guide/languages.mjs';
import runLayout from './guide/layout.mjs';
import runPages from './guide/pages.mjs';
import runUrl from './guide/url.mjs';

const { check, finish } = createChecks('journal-guide');
const { browser, base, stop } = await startHarness({ label: 'journal-guide', port: 4179, probe: '/journal/design-notes-01' });
const driver = createGuideDriver({ browser, base });

const SECTIONS = [runPages, runUrl, runDoors, runGame, runDialog, runLayout, runLanguages, runContrast];

try {
  // Warm-up: the first dev request compiles the reader's chunks and can trigger a dependency reload.
  const warm = await driver.openGuide();
  await warm.page.close();

  for (const section of SECTIONS) await section({ check, driver });
} catch (error) {
  check('the test run completed', false, error.stack ?? String(error));
} finally {
  await stop();
}

finish();
