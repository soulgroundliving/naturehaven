// The constraints page: the doors of the plan open and shut under a real finger, say what they are, and stay as
// they were left when you read on and come back.
import { VIEWPORTS } from '../lib/guide-driver.mjs';

const IDS = ['entrance', 'bathroom', 'balcony'];
const SHUT = JSON.stringify({ entrance: false, bathroom: false, balcony: false });
const MIN_TARGET = 36; // px - a door is tapped with a thumb (WCAG 2.5.8 asks 24; a thumb wants more)

export default async function run({ check, driver }) {
  const { page, problems } = await driver.openGuide({ viewport: VIEWPORTS.phone });
  const others = [];
  for (const i of [0, 1, 3, 5, 7]) others.push((await driver.goTo(page, i)).hint);
  check('the "tap a door" hint is on the constraints page only', others.every((hint) => hint === null), JSON.stringify(others));

  const now = await driver.goTo(page, 2);
  check('the constraints page says to tap a door', now.hint === 'Tap a door', String(now.hint));
  check('every door starts shut', JSON.stringify(await driver.doorsOf(page)) === SHUT, JSON.stringify(await driver.doorsOf(page)));
  const labels = await driver.doorLabels(page);
  check('each door names itself, says how it works, and says it is closed', IDS.every((id) => /closed/i.test(labels[id] ?? '')), JSON.stringify(labels));
  const named = await page.evaluate(() => ['Front door', 'opens out', 'opens in', 'slides'].every((name) => [...document.querySelectorAll('[data-testid="journal-guide"] svg text')].some((t) => t.textContent === name)));
  check('the doors are named on the plan itself, with how each one opens', named);

  for (const id of IDS) {
    const marker = await driver.doorMarker(page, id);
    check(`the ${id} door's marker is big enough to tap (${Math.round(marker.w)}x${Math.round(marker.h)}px)`, marker.w >= MIN_TARGET && marker.h >= MIN_TARGET, JSON.stringify(marker));
    check(`the ${id} door's marker is what a finger meets near its corner`, marker.corner_is_marker, JSON.stringify(marker.corner));
    await driver.tap(page, marker.corner);
    const at = await driver.doorPoint(page, id);
    const open = await driver.doorsOf(page);
    check(`a tap on the marker opens the ${id} door and only that one`, IDS.every((door) => open[door] === (door === id)), JSON.stringify(open));
    check(`...and the door says it is open now`, /open\b/i.test((await driver.doorLabels(page))[id]) && !/closed/i.test((await driver.doorLabels(page))[id]), (await driver.doorLabels(page))[id]);
    await driver.tap(page, at);
    check(`a second tap shuts the ${id} door`, JSON.stringify(await driver.doorsOf(page)) === SHUT, JSON.stringify(await driver.doorsOf(page)));
  }

  const swing = () => page.$eval(`${driver.DIALOG} [data-door="entrance"] line`, (el) => [el.getAttribute('x2'), el.getAttribute('y2')].join());
  const closed = await swing();
  await driver.tap(page, await driver.doorPoint(page, 'entrance'));
  check('an open door is drawn open, not just labelled so', (await swing()) !== closed, closed);
  await driver.tap(page, await driver.doorPoint(page, 'balcony'));

  await driver.next(page);
  await driver.back(page);
  const kept = await driver.doorsOf(page);
  check('reading on and coming back leaves the doors as they were', kept.entrance && kept.balcony && !kept.bathroom, JSON.stringify(kept));

  const key = await page.evaluate(() => {
    const door = document.querySelector('[data-testid="journal-guide"] [data-door="bathroom"]');
    door.focus();
    return document.activeElement === door;
  });
  await page.keyboard.press('Enter');
  check('a door can be opened from the keyboard too', key && (await driver.doorsOf(page)).bathroom === true);
  // A key held down repeats. The door opens once - four key-downs without a key-up are one press and three repeats.
  const beforeHold = (await driver.doorsOf(page)).balcony;
  await page.evaluate((selector) => document.querySelector(`${selector} [data-door="balcony"]`).focus(), driver.DIALOG);
  for (let i = 0; i < 4; i += 1) await page.keyboard.down('Enter');
  await page.keyboard.up('Enter');
  await new Promise((resolve) => setTimeout(resolve, 150));
  check('a key held down toggles a door once, not on every repeat', (await driver.doorsOf(page)).balcony === !beforeHold, `${beforeHold} -> ${(await driver.doorsOf(page)).balcony}`);
  const ring = await page.$eval(`${driver.DIALOG} [data-door="entrance"] rect`, (el) => ({ effect: getComputedStyle(el).vectorEffect, width: getComputedStyle(el).strokeWidth }));
  check('the door focus ring is drawn in screen pixels (non-scaling), not plan units that shrink with the plan', ring.effect === 'non-scaling-stroke' && parseFloat(ring.width) >= 2, JSON.stringify(ring));
  check('the doors ran clean', problems.length === 0, problems.join(' | '));
  await page.close();
}
