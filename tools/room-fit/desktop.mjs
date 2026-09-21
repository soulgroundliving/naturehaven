// Section 1 — the game on a desktop, in English, played with a real mouse: the start, the winning plan, breaking one rule at a time, the width panel, the plan outline, the walls.
import { FINAL_PLAN, LIVING, START_LAYOUT, footprintOf, headRectOf } from '../../src/lib/roomFit.ts';

export default async function run({ check, driver }) {
  const { FRAME, DESKTOP, sameSpot, allAt, sameRect, spaceLine, spaceOf, rectOf, openArticle, readGame, pieceOf, settle, showBoard, startGame, grabPoint, dragBy, placeLikeThePlan, focusPiece, wellMentions } = driver;

  // ── 1. desktop, English, mouse ──────────────────────────────────────────────
  const { page, problems } = await openArticle();

  const before = await page.evaluate((frame) => {
    const el = document.querySelector(frame);
    return { state: el.dataset.jnInteractiveState, loaded: Boolean(document.querySelector('[data-testid="room-fit"]')), text: el.textContent };
  }, FRAME);
  check(
    'the game is not loaded while far from the viewport, and its rules are already on the page as text',
    before.state === 'static' &&
      !before.loaded &&
      before.text.includes('25.2 sqm') &&
      before.text.includes('120 cm beside the bed') &&
      before.text.includes('Room to live in'),
    JSON.stringify({ state: before.state, loaded: before.loaded }),
  );

  const start = await startGame(page);
  const frameState = await page.$eval(FRAME, (el) => el.dataset.jnInteractiveState);
  check('the game loads on demand once it is near the viewport', frameState === 'live', frameState);
  check(
    'it starts with everything fitting and the room not working: 2 of 5, walkway failing',
    start.passed === 2 && start.won === false && start.rules.fit === true && start.rules.walk === false && start.progress === '2 of 5 rules hold',
    JSON.stringify(start),
  );
  check('the five rules are listed in the order the article gives them', Object.keys(start.rules).join() === 'fit,doors,walk,use,bed', Object.keys(start.rules).join());
  check('the six pieces start where the game says', allAt(start.pieces, START_LAYOUT), JSON.stringify(start.pieces));
  // "Room to live in": the brief's spaces, measured in the arrangement on the board — apart from the furniture.
  check(
    '"Room to live in" lists the seven spaces in reading order and measures the start: walkway 50, closet 5, kitchen 25 fall short; the rest are fine',
    start.spaces.map((s) => s.id).join() === 'bedside,walk,closet,kitchen,fridge,table,shelf' &&
      start.spaces.map(spaceLine).join() === 'bedside:150:comfortable,walk:50:tight!,closet:5:tight!,kitchen:25:tight!,fridge:150:comfortable,table:120:comfortable,shelf:70:standard',
    start.spaces.map(spaceLine).join(),
  );
  check(
    'a space that falls short says what it needs ("needs 90"); one that meets the game says nothing',
    start.spaces.map((sp) => `${sp.id}:${sp.shortText ?? '-'}`).join() === 'bedside:-,walk:needs 90,closet:needs 90,kitchen:needs 90,fridge:-,table:-,shelf:-',
    start.spaces.map((sp) => `${sp.id}:${sp.shortText ?? '-'}`).join(),
  );
  await page.click('[data-space="closet"] summary');
  const tightMeaning = await page.$eval('[data-space="closet"] [data-testid="space-meaning"]', (el) => el.textContent.trim());
  check(
    'a "Tight" space says what is wrong with that space: for the closet, the doors and choosing clothes',
    tightMeaning === 'Under what we accept. Hard to open the doors and stand to choose clothes.',
    tightMeaning,
  );
  await page.click('[data-space="closet"] summary'); // close it again: a later check opens this row itself
  const routes = await page.$$eval('[data-testid="room-fit-route"]', (lines) => lines.map((l) => ({ points: l.getAttribute('points').split(' ').length, cls: l.getAttribute('class') })));
  check(
    'a route is drawn to the bathroom and to the balcony, red while the walkway fails',
    routes.length === 2 && routes.every((r) => r.points >= 5 && r.cls.includes('stroke-destructive')),
    JSON.stringify(routes),
  );

  // The balcony door is a double sliding door that fills its exit: two panels across a 120 cm opening, 10 cm in from each side.
  const balconyDoor = await page.$eval('[data-testid="room-fit-balcony-door"]', (el) => el.getAttribute('d'));
  check('the balcony door is drawn as two sliding panels that fill its 120 cm exit', balconyDoor === 'M10 157H74M66 163H130', String(balconyDoor));

  // Directions come from the article's own compass (slide 3: S at the top of the plan, N at the bottom).
  const compass = await page.$$eval('[data-testid="room-fit-compass"] text', (nodes) =>
    nodes.map((n) => ({ letter: n.textContent.trim(), x: Number(n.getAttribute('x')), y: Number(n.getAttribute('y')) })),
  );
  const letterAt = Object.fromEntries(compass.map((c) => [c.letter, c]));
  check(
    'a compass rose sits on the plan the way slide 3 draws it: S at the top, N at the bottom, east on the left, west on the right',
    compass.length === 4 && letterAt.S?.y < letterAt.N?.y && letterAt.E?.x < letterAt.W?.x,
    JSON.stringify(compass),
  );
  // The single-door fridge is a piece of its own (55 x 55) beside the 140 x 45 counter, and the bed has its head against a wall.
  const drawn = await page.evaluate(() => {
    const size = (id) => {
      const rect = document.querySelector(`[data-piece="${id}"] rect`);
      return { w: Number(rect.getAttribute('width')), h: Number(rect.getAttribute('height')) };
    };
    return { fridge: size('fridge'), counter: size('kitchen'), caption: document.querySelector('[data-piece="fridge"] text')?.textContent.trim() ?? null, parts: document.querySelectorAll('[data-part="fridge"]').length };
  });
  const headAtStart = await rectOf(page, '[data-piece="bed"] [data-part="head"]').catch(() => null);
  check(
    'the fridge is drawn as a piece of its own (55×55) beside the counter (140×45, turned), and the bed with its head bar',
    JSON.stringify(drawn) === JSON.stringify({ fridge: { w: 55, h: 55 }, counter: { w: 45, h: 140 }, caption: 'Fridge', parts: 0 }) && sameRect(headAtStart, headRectOf(START_LAYOUT.bed)),
    JSON.stringify({ drawn, headAtStart }),
  );

  // Dragging every piece onto the final plan wins.
  // The order matters to a mouse: the fridge's spot covers most of the counter's start, and the table's covers the rest, so they go first.
  for (const id of ['fridge', 'kitchen', 'table', 'shelf', 'closet', 'bed']) await placeLikeThePlan(page, id);
  const solved = await settle(page);
  check('every piece lands exactly on the plan (dropped on the 5 cm grid)', allAt(solved.pieces, FINAL_PLAN), JSON.stringify(solved.pieces));
  check(
    'with the plan in place all five rules hold and the verdict says so',
    solved.passed === 5 && solved.won && Object.values(solved.rules).every(Boolean) && solved.progress === '5 of 5 rules hold' && solved.verdict.startsWith('All five hold'),
    JSON.stringify(solved),
  );
  check('the walkway rule prints the true narrowest gap (95 cm: the bed to the fridge, which stands 10 cm proud of the units)', solved.walkDetail === 'narrowest 95 cm', String(solved.walkDetail));
  check(
    '"Room to live in" agrees with the rules: every space is at least "just right" — the walkway at exactly that, the rest comfortable',
    solved.spaces.map(spaceLine).join() === 'bedside:150:comfortable,walk:95:standard,closet:150:comfortable,kitchen:150:comfortable,fridge:95:comfortable,table:105:comfortable,shelf:150:comfortable',
    solved.spaces.map(spaceLine).join(),
  );
  const routeColours = await page.$$eval('[data-testid="room-fit-route"]', (lines) => lines.map((l) => l.getAttribute('class')));
  check('the routes turn green once the walkway holds', routeColours.length === 2 && routeColours.every((c) => c.includes('stroke-sage-green')), JSON.stringify(routeColours));
  // As on the plan (slides 4 and 7), down the right wall from the balcony end: the table, the fridge, the counter, and last the shelf by the front door.
  const run = Object.fromEntries(['table', 'fridge', 'kitchen', 'shelf'].map((id) => [id, footprintOf(id, solved.pieces[id])]));
  check(
    'in the final plan the fridge follows the table, then the counter, then the shelf beside the front door — end to end, as drawn',
    run.fridge.y0 === run.table.y1 && run.kitchen.y0 === run.fridge.y1 && run.shelf.y0 === run.kitchen.y1 && run.shelf.y1 === 715,
    JSON.stringify(run),
  );

  // Break ONLY the walkway: the bed 65 cm nearer the top wall leaves 85 cm between them (to the balcony door),
  // and every quick rule still passes.
  // Right after letting go, the one thing between the visitor and a false "you win" is that the game
  // has not measured the walkway yet — it must say so rather than quote the score it had.
  await showBoard(page);
  await dragBy(page, 'bed', 0, -65);
  const unchecked = await readGame(page);
  check(
    'right after a move the game does not claim a win it has not checked',
    !unchecked.won && unchecked.progress !== '5 of 5 rules hold' && !unchecked.verdict.startsWith('All five hold'),
    JSON.stringify(unchecked),
  );
  const narrowed = await settle(page);
  check(
    'once measured it says which rule broke: only the walkway, at 85 cm',
    narrowed.rules.walk === false && narrowed.passed === 4 && narrowed.walkDetail === 'narrowest 85 cm',
    JSON.stringify(narrowed),
  );
  check(
    '"Room to live in" names the same break in its own words: the walkway is "Minimum" at 85 cm — room to squeeze through, short of the 90 asked for — and nothing else is short',
    spaceLine(spaceOf(narrowed, 'walk')) === 'walk:85:minimum!' && narrowed.spaces.filter((s) => !s.ok).length === 1,
    narrowed.spaces.map(spaceLine).join(),
  );
  await dragBy(page, 'bed', 0, 65);
  const restored = await settle(page);
  check('moving it back wins again', restored.won && restored.passed === 5 && allAt(restored.pieces, FINAL_PLAN), JSON.stringify(restored));

  // The panel follows every move, and grades the width rather than only passing or failing it: the closet
  // stepped 100 cm towards the bed leaves exactly 90 in front of it (the bed's foot is at y 470, the closet's front edge at 560).
  await showBoard(page);
  await focusPiece(page, 'closet');
  for (let i = 0; i < 4; i += 1) {
    await page.keyboard.down('Shift');
    await page.keyboard.press('ArrowUp');
    await page.keyboard.up('Shift');
  }
  const closetNear = await settle(page);
  const nearLine = await page.$eval('[data-testid="room-fit-selected-space"]', (el) => el.textContent.trim());
  check(
    'the closet 100 cm nearer the bed leaves 90 cm in front of it — "Just right", still enough, so the room still works — and the selected piece says so',
    spaceLine(spaceOf(closetNear, 'closet')) === 'closet:90:standard' && closetNear.won && nearLine === 'Room in front: 90 cm · Just right',
    JSON.stringify({ closet: spaceLine(spaceOf(closetNear, 'closet')), won: closetNear.won, nearLine }),
  );
  await page.keyboard.press('ArrowUp');
  const closetShort = await settle(page);
  check(
    'five cm more and it is "Minimum" (85 cm): the panel marks it short and the "room to use each piece" rule fails with it',
    spaceLine(spaceOf(closetShort, 'closet')) === 'closet:85:minimum!' && closetShort.rules.use === false && closetShort.passed === 4,
    JSON.stringify({ closet: spaceLine(spaceOf(closetShort, 'closet')), rules: closetShort.rules }),
  );
  // Each space explains itself: what the width means to use, where the tiers start, and what the game asks.
  await page.click('[data-space="closet"] summary');
  const explained = await page.$eval('[data-space="closet"]', (li) => ({
    open: li.querySelector('details').open,
    meaning: li.querySelector('[data-testid="space-meaning"]').textContent.trim(),
    thresholds: li.querySelector('[data-testid="space-thresholds"]').textContent.trim(),
    asked: li.querySelector('[data-testid="space-asked"]').textContent.trim(),
  }));
  check(
    'opening a space says what its width means to use, where each tier starts, and what the game asks for',
    explained.open &&
      explained.meaning === 'It works for one person, but only just: no room to carry things or to stay at ease.' &&
      explained.thresholds === 'Tight under 60 · Minimum 60 · Just right 90 · Comfortable 120 cm' &&
      explained.asked === 'The game asks for at least Just right (90 cm)',
    JSON.stringify(explained),
  );
  await focusPiece(page, 'closet');
  await page.keyboard.press('ArrowDown');
  for (let i = 0; i < 4; i += 1) {
    await page.keyboard.down('Shift');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.up('Shift');
  }
  const closetHome = await settle(page);
  check(
    'nudged back to the wall the closet is comfortable again and the plan wins',
    allAt(closetHome.pieces, FINAL_PLAN) && closetHome.won && spaceLine(spaceOf(closetHome, 'closet')) === 'closet:150:comfortable',
    JSON.stringify({ won: closetHome.won, closet: spaceLine(spaceOf(closetHome, 'closet')) }),
  );

  // A squeeze between two corners is a diagonal, not a multiple of 5: the bed at (40, 265) leaves 64.03 cm. It is
  // printed as whole centimetres, rounded DOWN, and the panel and the rule say the same number.
  await showBoard(page);
  await dragBy(page, 'bed', 40, -45);
  const diagonal = await settle(page);
  check(
    'a diagonal squeeze prints whole centimetres, rounded down, the same in the panel and in the rule (the bed at 40, 265 leaves 64.03)',
    spaceLine(spaceOf(diagonal, 'walk')) === 'walk:64:tight!' && spaceOf(diagonal, 'walk').cmText === '64 cm' && diagonal.walkDetail === 'narrowest 64 cm',
    JSON.stringify({ walk: spaceOf(diagonal, 'walk'), detail: diagonal.walkDetail }),
  );
  await dragBy(page, 'bed', -40, 45);
  const undone = await settle(page);
  check('moving the bed back puts the plan back', allAt(undone.pieces, FINAL_PLAN) && undone.won, JSON.stringify(undone.pieces));

  // Where the numbers come from is said in the game — as our own standard, never as WELL's. Structural, not a word list:
  // every mention of WELL must sit inside the note about the numbers, and that note must say it is not a requirement.
  const wellEn = await wellMentions(page);
  check(
    'WELL is mentioned only in the note about where the numbers come from, and that note calls the widths Nature Haven\'s own standard and "not a WELL requirement"',
    wellEn.total === 1 && wellEn.outside.length === 0 && /not a WELL requirement/.test(wellEn.note) && /Nature Haven.s own working standard/.test(wellEn.note),
    JSON.stringify({ total: wellEn.total, outside: wellEn.outside }),
  );
  check(
    'the note says only two widths have a published counterpart, and that the NKBA one-cook aisle sits between our just-right and comfortable',
    /Two of them can be set beside published guidance/.test(wellEn.note) && /107 cm \(NKBA\)/.test(wellEn.note) && /sits between the two/.test(wellEn.note) && /61 cm \(24 in\)/.test(wellEn.note),
    wellEn.note,
  );
  // On a wide screen the board stays in view while the long column of checks beside it scrolls — until the
  // column ends and the board goes with it, so this reads a row in the middle of the list, not the last.
  const sticky = await page.evaluate(() => {
    const wrapper = document.querySelector('[data-testid="room-fit"] svg[role="group"]').parentElement;
    document.querySelector('[data-space="closet"]').scrollIntoView({ block: 'center', behavior: 'instant' });
    const box = document.querySelector('[data-testid="room-fit"] svg[role="group"]').getBoundingClientRect();
    return { position: getComputedStyle(wrapper).position, top: Math.round(box.top), bottom: Math.round(box.bottom), viewport: innerHeight };
  });
  check(
    'reading a space in the middle of the panel, the whole board is still on screen beside it (sticky on a wide screen)',
    sticky.position === 'sticky' && sticky.top >= 64 && sticky.bottom <= sticky.viewport,
    JSON.stringify(sticky),
  );

  // One drag can undo it.
  await showBoard(page);
  await dragBy(page, 'bed', 75, 0);
  const broken = await settle(page);
  check(
    'sliding the bed into the middle breaks the walkway rule and takes the win away',
    broken.rules.walk === false && broken.won === false && broken.passed < 5 && broken.walkDetail === 'narrowest 75 cm',
    JSON.stringify(broken),
  );
  check(
    'and the panel shows what the bed took: the walkway 75 cm, 20 cm left in front of the fridge, 30 in front of the table — all "Tight"',
    spaceLine(spaceOf(broken, 'walk')) === 'walk:75:tight!' && spaceLine(spaceOf(broken, 'fridge')) === 'fridge:20:tight!' && spaceLine(spaceOf(broken, 'table')) === 'table:30:tight!',
    broken.spaces.map(spaceLine).join(),
  );

  // "Show our plan" draws the outlines, states the plan's own number, and survives a reset.
  await page.click('[data-action="toggle-plan"]');
  const ghost = await page.evaluate(() => {
    const toggle = document.querySelector('[data-action="toggle-plan"]');
    return {
      outlines: document.querySelectorAll('[data-testid="room-fit-ghost"] rect').length,
      caption: document.querySelector('[data-testid="room-fit-our-plan"]')?.textContent ?? '',
      label: toggle.textContent.trim(),
      hasPressed: toggle.hasAttribute('aria-pressed'), // a button whose LABEL changes must not also carry a pressed state
      directions: [...document.querySelectorAll('[data-testid="room-fit-our-plan-directions"] li')].map((li) => li.textContent.trim()),
      labels: [...document.querySelectorAll('[data-testid="room-fit-ghost"] text')].map((t) => t.textContent.trim()),
    };
  });
  // Five pieces are on their spots and only the bed is not: a ghost label printed over a piece's own caption comes out garbled.
  check('the plan outline is labelled only where a piece is NOT yet on its spot (here: just the bed)', JSON.stringify(ghost.labels) === JSON.stringify(['Bed']), JSON.stringify(ghost.labels));
  check(
    '"Show our plan" states which way each piece faces, in the article\'s compass: the bed\'s head east, the closet south, the right-wall units (table, fridge, counter, shelf) east',
    JSON.stringify(ghost.directions) ===
      JSON.stringify([
        'Bed — Head towards the east (the left wall)',
        'Closet — Faces south (the balcony end)',
        'Table — Faces east (the left wall)',
        'Fridge — Faces east (the left wall)',
        'Kitchen — Faces east (the left wall)',
        'Shelf — Faces east (the left wall)',
      ]),
    JSON.stringify(ghost.directions),
  );
  check(
    '"Show our plan" outlines the six pieces, states the plan\'s own walkway, and its label — not aria-pressed — carries the state',
    ghost.outlines === 6 && ghost.label === 'Hide our plan' && ghost.hasPressed === false && /narrowest walkway 95 cm/.test(ghost.caption),
    JSON.stringify(ghost),
  );
  await page.click('[data-action="reset"]');
  const reset = await settle(page);
  const ghostAfterReset = await page.$('[data-testid="room-fit-ghost"]');
  check('"Start over" puts every piece back and returns to 2 of 5', allAt(reset.pieces, START_LAYOUT) && reset.passed === 2 && !reset.won, JSON.stringify(reset));
  check('"Start over" keeps the plan outline the visitor asked to see, now labelled on all six pieces', ghostAfterReset !== null && (await page.$$('[data-testid="room-fit-ghost"] text')).length === 6);
  await page.click('[data-action="toggle-plan"]');
  check('hiding the plan removes the outlines and the caption', (await page.$('[data-testid="room-fit-ghost"]')) === null && (await page.$('[data-testid="room-fit-our-plan"]')) === null);

  // Pieces stop at the walls, and letting go outside the board ends the drag.
  await showBoard(page);
  const grip = await grabPoint(page, 'shelf');
  await page.mouse.move(grip.x, grip.y);
  await page.mouse.down();
  await page.mouse.move(DESKTOP.width - 4, DESKTOP.height - 4, { steps: 8 });
  await page.mouse.up();
  const cornered = footprintOf('shelf', await pieceOf(page, 'shelf'));
  check('a piece dragged past the walls stops against them', cornered.x1 === LIVING.x1 && cornered.y1 === LIVING.y1, JSON.stringify(cornered));
  const parked = await pieceOf(page, 'shelf');
  // A drag that never ended would carry the piece along when the pointer next passes over it — so pass over it.
  const parkedAt = await grabPoint(page, 'shelf');
  await page.mouse.move(parkedAt.x - 60, parkedAt.y - 60, { steps: 4 });
  await page.mouse.move(parkedAt.x, parkedAt.y, { steps: 6 });
  await page.mouse.move(parkedAt.x - 40, parkedAt.y - 90, { steps: 6 });
  check('letting go outside the board ends the drag — the piece does not follow the pointer back over it', sameSpot(await pieceOf(page, 'shelf'), parked));

  check('no console errors or page errors while playing with the mouse', problems.length === 0, problems.join(' | '));
  await page.close();
}
