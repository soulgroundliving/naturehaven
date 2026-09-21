// Section 4 — language: Thai, and switching language mid-game.
import { sleep } from '../lib/dev-harness.mjs';

export default async function run({ check, driver }) {
  const { allAt, spaceLine, openArticle, settle, startGame, focusPiece, wellMentions } = driver;

  // ── 4. language: Thai, and switching mid-game ───────────────────────────────
  const lang = await openArticle({ lang: 'en' });
  const lp = lang.page;
  await startGame(lp);
  await focusPiece(lp, 'shelf');
  await lp.keyboard.down('Shift');
  await lp.keyboard.press('ArrowUp');
  await lp.keyboard.up('Shift');
  const english = await settle(lp);
  await lp.evaluate(() => document.querySelector('button[aria-label="Switch language"]').click());
  await sleep(400);
  const thai = await settle(lp);
  const thaiText = await lp.evaluate(() => ({
    board: document.querySelector('svg[role="group"]')?.getAttribute('aria-label'),
    walkLabel: document.querySelector('[data-rule="walk"] p')?.textContent ?? '',
    shelf: document.querySelector('[data-piece="shelf"]')?.getAttribute('aria-label') ?? '',
    note: document.querySelector('[data-testid="room-fit-selected-note"] p')?.textContent.trim() ?? '',
    facing: document.querySelector('[data-testid="room-fit-facing"]')?.textContent.trim() ?? '',
    fridge: document.querySelector('[data-piece="fridge"] text')?.textContent.trim() ?? '',
    spacesTitle: document.querySelector('[data-testid="room-fit-spaces"] h4')?.textContent.trim() ?? '',
    tiers: [...document.querySelectorAll('[data-testid="space-tier"]')].map((el) => el.textContent.trim()),
    shorts: [...document.querySelectorAll('[data-testid="space-short"]')].map((el) => el.textContent.trim()),
  }));
  const wellTh = await wellMentions(lp);
  check(
    'switching to Thai retitles the game and keeps every piece where the visitor put it',
    thai.progress === `ผ่าน ${english.passed} จาก 5 ข้อ` && thaiText.board.startsWith('แปลนห้อง 25.2 ตร.ม.') && thaiText.walkLabel.includes('ทางเดินกว้างอย่างน้อย 90 ซม.') && thaiText.shelf.includes('ห่างผนังซ้าย') && allAt(thai.pieces, english.pieces),
    JSON.stringify({ progress: thai.progress, ...thaiText }),
  );
  check(
    'in Thai the shelf is described (shoe rack below, storage above), its direction is stated by the compass, and the fridge is labelled',
    thaiText.note === 'ตู้รองเท้าครึ่งล่าง ที่เก็บของครึ่งบน สูง 240 ซม.' && thaiText.facing === 'หันหน้าไปทางทิศเหนือ (ฝั่งประตูห้อง)' && thaiText.shelf.includes('หันหน้าไปทางทิศเหนือ') && thaiText.fridge === 'ตู้เย็น',
    JSON.stringify(thaiText),
  );
  check(
    'in Thai the panel is titled "พื้นที่ใช้สอย" and grades every space with the four Thai names — while measuring exactly what it measured in English',
    thaiText.spacesTitle === 'พื้นที่ใช้สอย' &&
      thaiText.tiers.length === 7 &&
      thaiText.tiers.every((name) => ['แคบ', 'พอใช้', 'พอดี', 'สบาย'].includes(name)) &&
      thai.spaces.map(spaceLine).join() === english.spaces.map(spaceLine).join(),
    JSON.stringify({ title: thaiText.spacesTitle, tiers: thaiText.tiers, thai: thai.spaces.map(spaceLine).join(), english: english.spaces.map(spaceLine).join() }),
  );
  check(
    'in Thai a short space says "ต้องการ 90", and WELL still appears only in the note — which says the widths are "ไม่ใช่ข้อกำหนดของ WELL"',
    thaiText.shorts.length > 0 &&
      thaiText.shorts.every((text) => /^ต้องการ \d+$/.test(text)) &&
      wellTh.total === 1 &&
      wellTh.outside.length === 0 &&
      /ไม่ใช่ข้อกำหนดของ WELL/.test(wellTh.note),
    JSON.stringify({ shorts: thaiText.shorts, total: wellTh.total, outside: wellTh.outside }),
  );
  check('no console errors or page errors switching language', lang.problems.length === 0, lang.problems.join(' | '));
  await lp.close();
}
