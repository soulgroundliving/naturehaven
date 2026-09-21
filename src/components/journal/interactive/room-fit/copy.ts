import type { DoorId, PieceId, Placement, Rotation } from '@/lib/roomFit';
import { COMPASS, frontSide, headSide } from '@/lib/roomFitCompass';
import { requiredCm, wholeCm } from '@/lib/roomStandards';
import type { CompassPoint, Side } from '@/lib/roomFitCompass';
import type { Bilingual } from '@/data/journalTypes';
import type { LangCode } from '@/lib/journalBlocks';

// Every word the room-arranging game shows, in one place — edit the copy here.
// Numbers that come from the article's slides (90 cm walkway, 120 cm beside the
// bed, the piece sizes) are read from src/lib/roomFit.ts, never typed twice.

const t = (en: string, th: string): Bilingual => ({ en, th });

export const PIECE_NAME: Record<PieceId, Bilingual> = {
  bed: t('Bed', 'เตียง'),
  closet: t('Closet', 'ตู้เสื้อผ้า'),
  kitchen: t('Kitchen', 'ครัว'),
  fridge: t('Fridge', 'ตู้เย็น'),
  table: t('Table', 'โต๊ะ'),
  shelf: t('Shelf', 'ชั้นวาง'),
};

// What each piece is, with the heights from the article's measurements table. The fridge being
// single-door and the shelf's two halves are the owner's description of the real room.
export const PIECE_NOTE: Record<PieceId, Bilingual> = {
  bed: t('Head against a wall; you get in from a long side · 45 cm high', 'หัวเตียงชิดผนัง ขึ้นลงทางด้านยาว สูง 45 ซม.'),
  closet: t('Wardrobe, its doors open on the front · 240 cm tall', 'ตู้เสื้อผ้า เปิดประตูทางด้านหน้า สูง 240 ซม.'),
  kitchen: t('Kitchen counter along a wall · 100 cm high', 'เคาน์เตอร์ครัวชิดผนัง สูง 100 ซม.'),
  fridge: t('Single-door fridge, its door opens on the front', 'ตู้เย็น 1 บาน เปิดประตูทางด้านหน้า'),
  table: t('Long desk along a wall, the chair on its front · 70 cm high', 'โต๊ะยาวชิดผนัง วางเก้าอี้ด้านหน้า สูง 70 ซม.'),
  shelf: t('Shoe rack in the lower half, storage above · 240 cm tall', 'ตู้รองเท้าครึ่งล่าง ที่เก็บของครึ่งบน สูง 240 ซม.'),
};

const COMPASS_NAME: Record<CompassPoint, Bilingual> = {
  north: t('north', 'ทิศเหนือ'),
  east: t('east', 'ทิศตะวันออก'),
  south: t('south', 'ทิศใต้'),
  west: t('west', 'ทิศตะวันตก'),
};

// What is at each side of the plan as drawn: the balcony and bathroom are at the top, the front door at the bottom.
const SIDE_NAME: Record<Side, Bilingual> = {
  up: t('the balcony end', 'ฝั่งระเบียง'),
  down: t('the front-door end', 'ฝั่งประตูห้อง'),
  left: t('the left wall', 'ผนังซ้าย'),
  right: t('the right wall', 'ผนังขวา'),
};

/** Which way a piece faces — or, for the bed, where its head is — by the article's compass, and by what is there. */
export function facingLabel(id: PieceId, rot: Rotation, lang: LangCode): string {
  const side = id === 'bed' ? headSide(rot) : frontSide(rot);
  const point = COMPASS_NAME[COMPASS[side]][lang];
  const there = SIDE_NAME[side][lang];
  if (id === 'bed') return lang === 'th' ? `หัวเตียงไปทาง${point} (${there})` : `Head towards the ${point} (${there})`;
  return lang === 'th' ? `หันหน้าไปทาง${point} (${there})` : `Faces ${point} (${there})`;
}

export const DOOR_NAME: Record<DoorId, Bilingual> = {
  entrance: t('the front door', 'ประตูทางเข้า'),
  bathroom: t('the bathroom door', 'ประตูห้องน้ำ'),
  balcony: t('the balcony door', 'ประตูระเบียง'),
};

// How each door works, as the plan draws it: none of them swings into the living area.
const DOOR_KIND: Record<DoorId, Bilingual> = {
  entrance: t('swings out to the corridor', 'เปิดออกไปทางเดินนอกห้อง'),
  bathroom: t('swings into the bathroom', 'เปิดเข้าห้องน้ำ'),
  balcony: t('a double sliding door', 'บานเลื่อนสองบาน'),
};

/** What a screen reader says of a door: which it is, how it works, whether it is open, and what pressing does. */
export function doorToggleLabel(id: DoorId, open: boolean, lang: LangCode): string {
  const name = DOOR_NAME[id][lang];
  if (lang === 'th') return `${name} ${DOOR_KIND[id].th}: ${open ? 'เปิดอยู่ กดเพื่อปิด' : 'ปิดอยู่ กดเพื่อเปิด'}`;
  return `${name.charAt(0).toUpperCase()}${name.slice(1)}, ${DOOR_KIND[id].en}: ${open ? 'open. Press to close.' : 'closed. Press to open.'}`;
}

export const AREA_LABEL = {
  balcony: t('Balcony', 'ระเบียง'),
  bathroom: t('Bathroom', 'ห้องน้ำ'),
  entrance: t('Front door', 'ประตูห้อง'),
};

export const COPY = {
  boardLabel: t('Plan of the 25.2 sqm room, in centimetres', 'แปลนห้อง 25.2 ตร.ม. หน่วยเป็นเซนติเมตร'),
  howTo: t(
    'Drag a piece on the plan — or select it and use the arrow keys (Shift for bigger steps) and R to turn it.',
    'ลากชิ้นส่วนบนแปลน หรือเลือกแล้วใช้ปุ่มลูกศร (กด Shift เพื่อขยับทีละมาก) และ R เพื่อหมุน',
  ),
  pieceRole: t('movable piece', 'ชิ้นส่วนที่ขยับได้'),
  selected: t('Selected', 'ที่เลือก'),
  nothingSelected: t('Select a piece to move it.', 'เลือกชิ้นส่วนเพื่อเริ่มขยับ'),
  rotate: t('Turn 90°', 'หมุน 90°'),
  moveUp: t('Move up', 'ขยับขึ้น'),
  moveDown: t('Move down', 'ขยับลง'),
  moveLeft: t('Move left', 'ขยับซ้าย'),
  moveRight: t('Move right', 'ขยับขวา'),
  reset: t('Start over', 'เริ่มใหม่'),
  showPlan: t('Show our plan', 'ดูแปลนของเรา'),
  hidePlan: t('Hide our plan', 'ซ่อนแปลนของเรา'),
  routeLegend: t('Dashed line: the widest walk from the front door', 'เส้นประ: ทางเดินที่กว้างที่สุดจากประตูห้อง'),
  disclaimer: t(
    'Door positions and the fridge’s size are estimates read off the plan; the widths are our own standard. For play — not a building specification.',
    'ตำแหน่งประตูและขนาดตู้เย็นเป็นค่าประมาณจากแปลน ส่วนความกว้างเป็นมาตรฐานของเราเอง เพื่อการเล่น ไม่ใช่ข้อกำหนดก่อสร้าง',
  ),
  playFullScreen: t('Play full screen', 'เล่นเต็มจอ'),
  playHint: t('The plan and its buttons together on the whole screen, so nothing needs scrolling.', 'แปลนกับปุ่มอยู่ด้วยกันเต็มจอ ไม่ต้องเลื่อนหน้า'),
  playLabel: t('Arrange the room', 'ลองจัดห้อง'),
  close: t('Close', 'ปิด'),
  doors: t('Doors', 'ประตู'),
  openDoors: t('Open the doors', 'เปิดประตูทั้งหมด'),
  closeDoors: t('Close the doors', 'ปิดประตูทั้งหมด'),
  showDetails: t('Show the rules and widths', 'ดูกฎและความกว้าง'),
  hideDetails: t('Hide the rules and widths', 'ซ่อนกฎและความกว้าง'),
  checking: t('checking…', 'กำลังตรวจ…'),
  holds: t('holds', 'ผ่าน'),
  fails: t('does not hold', 'ไม่ผ่าน'),
};

export function progress(passed: number, total: number, lang: LangCode): string {
  return lang === 'th' ? `ผ่าน ${passed} จาก ${total} ข้อ` : `${passed} of ${total} rules hold`;
}

/** What the headline says: a win, pieces standing on each other, or "fits, but does not work yet". */
export type VerdictKind = 'won' | 'overlap' | 'open';

export function verdict(kind: VerdictKind, lang: LangCode): string {
  switch (kind) {
    case 'won':
      return lang === 'th'
        ? 'ผ่านครบ ห้องนี้ไม่ใช่แค่ใส่ของได้ แต่ใช้งานได้จริง'
        : 'All five hold. The room does not just fit everything — it works.';
    case 'overlap':
      return lang === 'th'
        ? 'มีชิ้นที่ซ้อนกันอยู่ ให้ทุกชิ้นมีพื้นที่ของตัวเองก่อน'
        : 'Some pieces are on top of each other. Give each one its own floor first.';
    case 'open':
      return lang === 'th'
        ? 'ใส่ของได้ครบแล้ว แต่ห้องยังใช้งานไม่ได้ ลองย้ายให้ผ่านทุกข้อ'
        : 'Everything fits, and the room still does not work. Move things until every rule holds.';
  }
}

/** `y` is measured from the wall shared with the bathroom and balcony. */
export function positionLabel(name: string, x: number, y: number, lang: LangCode): string {
  return lang === 'th'
    ? `${name} ห่างผนังซ้าย ${x} ซม. ห่างผนังฝั่งห้องน้ำและระเบียง ${y} ซม.`
    : `${name}: ${x} cm from the left wall, ${y} cm from the bathroom and balcony wall`;
}

/** Where a piece is and which way it faces — what a screen reader says, and what a piece is labelled with. */
export function placeLabel(id: PieceId, placement: Placement, topOfLiving: number, lang: LangCode): string {
  return `${positionLabel(PIECE_NAME[id][lang], placement.x, placement.y - topOfLiving, lang)}, ${facingLabel(id, placement.rot, lang)}`;
}

export function ourPlanCaption(width: number, lang: LangCode): string {
  return lang === 'th'
    ? `แปลนสุดท้ายของเรา ทางเดินแคบสุด ${wholeCm(width)} ซม.`
    : `Our final plan: narrowest walkway ${wholeCm(width)} cm`;
}

const join = (names: string[], lang: LangCode) => names.join(lang === 'th' ? ' ' : ', ');

export interface RuleView {
  id: 'fit' | 'doors' | 'walk' | 'use' | 'bed';
  label: Bilingual;
  ok: boolean;
  /** One short line: the number, or what is wrong. */
  detail: string;
}

export function ruleLabels(walkMin: number, bedSide: number): Record<RuleView['id'], Bilingual> {
  return {
    fit: t('Nothing overlaps', 'ไม่มีชิ้นไหนซ้อนกัน'),
    doors: t('Doors stay clear', 'ประตูโล่ง'),
    walk: t(`Walkways at least ${walkMin} cm wide`, `ทางเดินกว้างอย่างน้อย ${walkMin} ซม.`),
    use: t('Room to use each piece', 'มีที่ใช้งานหน้าของแต่ละชิ้น'),
    bed: t(`${bedSide} cm free beside the bed`, `ข้างเตียงว่าง ${bedSide} ซม.`),
  };
}

/** One word for each rule, for the row of five in the full-screen game's sheet. */
export const RULE_SHORT: Record<RuleView['id'], Bilingual> = {
  fit: t('Apart', 'ไม่ซ้อน'),
  doors: t('Doors', 'ประตู'),
  walk: t('Walk', 'ทางเดิน'),
  use: t('Use', 'ที่ใช้งาน'),
  bed: t('Bed', 'เตียง'),
};

export const RULE_HELP: Record<RuleView['id'], Bilingual> = {
  fit: t('No two pieces can stand on the same floor.', 'ไม่มีสองชิ้นไหนยืนทับที่เดียวกันได้'),
  doors: t(
    'The front, bathroom and balcony doors need floor in front of them.',
    'ประตูทางเข้า ห้องน้ำ และระเบียง ต้องมีพื้นที่โล่งหน้าประตู',
  ),
  walk: t(
    'From the front door to the bathroom and to the balcony, the narrowest point of the widest route.',
    'จากประตูห้องไปห้องน้ำและระเบียง ตรงที่แคบที่สุดของเส้นทางที่กว้างที่สุด',
  ),
  // The widths come from the standards (roomStandards.ts), so this can never disagree with the rule.
  use: t(
    `Closet ${requiredCm('closet')} cm, kitchen ${requiredCm('kitchen')}, fridge ${requiredCm('fridge')}, table ${requiredCm('table')} (the chair), shelf ${requiredCm('shelf')} — in front of each.`,
    `หน้าตู้เสื้อผ้า ${requiredCm('closet')} ซม. ครัว ${requiredCm('kitchen')} ตู้เย็น ${requiredCm('fridge')} โต๊ะ ${requiredCm('table')} (ที่วางเก้าอี้) ชั้นวาง ${requiredCm('shelf')} ซม.`,
  ),
  bed: t(
    'Along at least one long side, so you can get in and make the bed.',
    'ตามด้านยาวอย่างน้อยหนึ่งด้าน เพื่อขึ้นลงและจัดเตียงได้',
  ),
};

export function fitDetail(overlapping: PieceId[], lang: LangCode): string {
  if (overlapping.length === 0) return lang === 'th' ? 'ทั้งหกชิ้นอยู่แยกกัน' : 'all six stand apart';
  const names = overlapping.map((id) => PIECE_NAME[id][lang]);
  return lang === 'th' ? `ซ้อนกัน: ${join(names, lang)}` : `overlapping: ${join(names, lang)}`;
}

export function doorsDetail(blocked: DoorId[], lang: LangCode): string {
  if (blocked.length === 0) return lang === 'th' ? 'ทุกประตูโล่ง' : 'all three are clear';
  const names = blocked.map((id) => DOOR_NAME[id][lang]);
  return lang === 'th' ? `ถูกบัง: ${join(names, lang)}` : `blocked: ${join(names, lang)}`;
}

export function walkDetail(width: number, lang: LangCode): string {
  if (width <= 0) return lang === 'th' ? 'เดินไปไม่ถึง' : 'no way through';
  return lang === 'th' ? `แคบสุด ${wholeCm(width)} ซม.` : `narrowest ${wholeCm(width)} cm`;
}

export function useDetail(cramped: PieceId[], lang: LangCode): string {
  if (cramped.length === 0) return lang === 'th' ? 'ทุกชิ้นใช้งานได้' : 'every piece is usable';
  const names = cramped.map((id) => PIECE_NAME[id][lang]);
  return lang === 'th' ? `หน้าไม่พอ: ${join(names, lang)}` : `no room in front of: ${join(names, lang)}`;
}

export function bedDetail(ok: boolean, lang: LangCode): string {
  if (ok) return lang === 'th' ? 'ขึ้นลงเตียงได้' : 'you can get in and out';
  return lang === 'th' ? 'ทั้งสองข้างยาวถูกบัง' : 'both long sides are blocked';
}
