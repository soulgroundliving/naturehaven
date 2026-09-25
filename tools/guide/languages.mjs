// Thai, and the night: what is drawn on the plan is in the reader's language, and the words stay readable
// when the page goes dark.
import { VIEWPORTS } from '../lib/guide-driver.mjs';

const luminance = ([r, g, b]) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

export default async function run({ check, driver }) {
  const thai = await driver.openGuide({ lang: 'th', viewport: VIEWPORTS.phone });
  const constraints = await driver.goTo(thai.page, 2);
  check('in Thai the hint and the door names are Thai', constraints.hint === 'แตะที่ประตู', String(constraints.hint));
  const drawn = await thai.page.evaluate(() => [...document.querySelectorAll('[data-testid="journal-guide"] svg text')].map((t) => t.textContent));
  check('in Thai the plan labels its doors, and how each opens, in Thai', ['ประตูทางเข้า', 'ห้องน้ำ', 'ระเบียง', 'เปิดออก', 'เปิดเข้า', 'บานเลื่อน'].every((name) => drawn.includes(name)), drawn.join(' | '));
  const labels = await driver.doorLabels(thai.page);
  check('in Thai a door says it is closed in Thai', Object.values(labels).every((label) => label.includes('ปิดอยู่')), JSON.stringify(labels));
  const brief = await driver.goTo(thai.page, 1);
  const drawnZones = await thai.page.evaluate(() => [...document.querySelectorAll('[data-testid="journal-guide"] svg text')].map((t) => t.textContent));
  check('in Thai the brief names its zones in Thai', ['นอน', 'ทำงาน', 'ครัว', 'เก็บของ', 'ทางเข้า'].every((zone) => drawnZones.includes(zone)), `${drawnZones.join(' | ')} (${brief.title})`);
  await thai.page.close();

  const night = await driver.openGuide({ tod: 'night', viewport: VIEWPORTS.phone });
  await driver.goTo(night.page, 1);
  // The site starts every page in its day palette and blends to the one asked for over 600ms (index.css .card-surface).
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // The night card is white at 9% (timeOfDay.ts cardBg): its colour is what it lets through, so read it blended over the sky.
  const colours = await night.page.evaluate(() => {
    const parse = (value) => {
      const text = value.trim();
      if (text.startsWith('#')) {
        const hex = text.length === 4 ? [...text.slice(1)].map((c) => c + c).join('') : text.slice(1);
        return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)).concat(1);
      }
      const [r, g, b, a = 1] = text.match(/[\d.]+/g).map(Number);
      return [r, g, b, a];
    };
    const over = ([r, g, b, a], [br, bg, bb]) => [r * a + br * (1 - a), g * a + bg * (1 - a), b * a + bb * (1 - a)];
    const sky = parse(getComputedStyle(document.documentElement).getPropertyValue('--sky-to'));
    const card = document.querySelector('[data-testid="guide-card"]');
    const bar = document.querySelector('[data-testid="guide-page-label"]');
    return {
      sky: sky.slice(0, 3),
      card: over(parse(getComputedStyle(card).backgroundColor), sky),
      title: parse(getComputedStyle(card.querySelector('h2')).color).slice(0, 3),
      body: parse(getComputedStyle(card.querySelector('div.mt-3 p') ?? card.querySelector('h2')).color).slice(0, 3),
      label: parse(getComputedStyle(bar).color).slice(0, 3),
    };
  });
  check('at night the card is dark and its title and words are light', luminance(colours.card) < 0.35 && luminance(colours.title) > 0.6 && luminance(colours.body) > 0.55, JSON.stringify(colours));
  check('at night the counter on top is light on the dark page', luminance(colours.label) > 0.5 && luminance(colours.sky) < 0.35, JSON.stringify(colours));
  // A keyboard user's focus ring is the palette's call-to-action colour (slate at night), not a fixed sage that is 1.5:1 on the night card.
  await night.page.keyboard.press('Tab');
  const ring = await night.page.evaluate(() => {
    const el = document.activeElement;
    const style = getComputedStyle(el);
    const hex = getComputedStyle(document.documentElement).getPropertyValue('--cta-bg').trim();
    const rgb = `rgb(${[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(', ')})`;
    return { on: el.getAttribute('data-action'), colour: style.outlineColor, wanted: rgb, width: style.outlineWidth, line: style.outlineStyle };
  });
  check('at night the keyboard focus ring is the call-to-action colour of the night palette (slate), 2px solid', ring.colour === ring.wanted && ring.width === '2px' && ring.line === 'solid', JSON.stringify(ring));
  await night.page.close();
}
