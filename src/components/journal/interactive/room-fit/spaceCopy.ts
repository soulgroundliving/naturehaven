import type { Bilingual } from '@/data/journalTypes';
import type { LangCode } from '@/lib/journalBlocks';
import { CLEAR_CAP } from '@/lib/roomFit';
import { SPACE_STANDARDS, requiredCm, shortOf, tierOf, wholeCm } from '@/lib/roomStandards';
import type { BriefZone, SpaceId, Tier } from '@/lib/roomStandards';

// The words for the width standards (src/lib/roomStandards.ts): what a tier is called, what a
// space is for, where the numbers come from. Every number a sentence quotes is read from the
// standards, never typed twice — change a threshold there and the words follow.

const t = (en: string, th: string): Bilingual => ({ en, th });

export const TIER_NAME: Record<Tier, Bilingual> = {
  tight: t('Tight', 'แคบ'),
  minimum: t('Minimum', 'พอใช้'),
  standard: t('Just right', 'พอดี'),
  comfortable: t('Comfortable', 'สบาย'),
};

export const TIER_MEANING: Record<Tier, Bilingual> = {
  tight: t('Under what we accept.', 'ต่ำกว่าที่เรารับได้'),
  minimum: t('It works for one person, but only just: no room to carry things or to stay at ease.', 'ใช้ได้สำหรับคนเดียวแต่แค่พอ ไม่มีที่ถือของหรืออยู่ให้สบาย'),
  standard: t('Our standard: one person uses it freely, carrying things, without having to think about it.', 'มาตรฐานของเรา คนหนึ่งคนใช้ได้คล่อง ถือของได้ โดยไม่ต้องคิด'),
  comfortable: t('Room to spare: you can use it with a basket, a bag, or someone beside you.', 'เหลือเฟือ ใช้ได้แม้ถือตะกร้า ถือกระเป๋า หรือมีอีกคนอยู่ข้าง ๆ'),
};

/** What "tight" means for each space in particular, said after the general line. */
export const TIGHT_MEANING: Record<SpaceId, Bilingual> = {
  bedside: t('Hard to get in and out of bed.', 'ขึ้นลงเตียงลำบาก'),
  walk: t('You have to squeeze past.', 'ต้องเบียดผ่านไป'),
  closet: t('Hard to open the doors and stand to choose clothes.', 'เปิดประตูตู้และยืนเลือกเสื้อผ้าลำบาก'),
  kitchen: t('Hard to stand at the counter and turn.', 'ยืนทำอาหารและหมุนตัวลำบาก'),
  fridge: t('The door will not swing open properly.', 'ประตูตู้เย็นเปิดได้ไม่เต็มที่'),
  table: t('Hard to pull the chair out and sit down.', 'ดึงเก้าอี้ออกมานั่งลำบาก'),
  shelf: t('Hard to bend down and put shoes on.', 'ก้มใส่รองเท้าลำบาก'),
};

/** The zones of the article's Brief slide, plus the walk between them. */
export const ZONE_NAME: Record<BriefZone, Bilingual> = {
  sleeping: t('Sleeping', 'นอน'),
  circulation: t('Circulation', 'ทางเดิน'),
  wardrobe: t('Wardrobe', 'เก็บเสื้อผ้า'),
  cooking: t('Cooking', 'ทำอาหาร'),
  working: t('Working', 'ทำงาน'),
  entry: t('Entry and storage', 'ทางเข้า · เก็บของ'),
};

export const SPACE_WHERE: Record<SpaceId, Bilingual> = {
  bedside: t('beside the bed', 'ข้างเตียง'),
  walk: t('the walkway, at its narrowest', 'ตรงจุดที่แคบสุด'),
  closet: t('in front of the closet', 'หน้าตู้เสื้อผ้า'),
  kitchen: t('in front of the kitchen counter', 'หน้าเคาน์เตอร์ครัว'),
  fridge: t('in front of the fridge', 'หน้าตู้เย็น'),
  table: t('in front of the table, for the chair', 'หน้าโต๊ะ ที่วางเก้าอี้'),
  shelf: t('in front of the shoe shelf', 'หน้าตู้รองเท้า'),
};

export const SPACE_FOR: Record<SpaceId, Bilingual> = {
  bedside: t('Getting in and out of bed, making it, getting dressed.', 'ขึ้นลงเตียง จัดเตียง แต่งตัว'),
  walk: t('Walking through the room, carrying things.', 'เดินผ่านห้อง ถือของ'),
  closet: t('Opening the doors and standing to choose clothes.', 'เปิดประตูตู้และยืนเลือกเสื้อผ้า'),
  kitchen: t('Standing at the counter to cook, with room to turn.', 'ยืนทำอาหารที่เคาน์เตอร์ และหมุนตัวได้'),
  fridge: t('Swinging the door open and reaching in.', 'เปิดประตูตู้เย็นแล้วหยิบของ'),
  table: t('Pulling the chair out, sitting down and getting up.', 'ดึงเก้าอี้ นั่ง และลุก'),
  shelf: t('Taking shoes on and off, reaching the shelves.', 'ถอด-ใส่รองเท้า และหยิบของบนชั้น'),
};

export const SPACES_COPY = {
  title: t('Room to live in', 'พื้นที่ใช้สอย'),
  intro: t(
    'The floor no piece stands on, measured in your arrangement: how wide each space really is, against our standard.',
    'พื้นที่ว่างที่ไม่มีเฟอร์นิเจอร์วางอยู่ วัดจากห้องที่คุณจัด ว่าแต่ละที่กว้างจริงเท่าไร เทียบกับมาตรฐานของเรา',
  ),
  askedFor: t('The game asks for at least', 'เกมต้องการอย่างน้อย'),
  sourcesTitle: t('Where these numbers come from', 'ตัวเลขเหล่านี้มาจากไหน'),
  checking: t('checking…', 'กำลังตรวจ…'),
  needs: t('needs', 'ต้องการ'),
  inFront: t('Room in front', 'พื้นที่ด้านหน้า'),
  besideBed: t('Room beside the bed', 'พื้นที่ข้างเตียง'),
};

/**
 * Where the numbers come from. The widths that are ours are read from the standards; the ADA and NKBA figures are theirs.
 * The comparison in the last sentence (107 cm between our 90 and 120) is pinned by roomStandards.test.ts.
 */
export function standardsNote(lang: LangCode): string {
  const { walk, kitchen } = SPACE_STANDARDS;
  if (lang === 'th') {
    return `ความกว้างเหล่านี้คือมาตรฐานการทำงานของ Nature Haven ยึดเจตนารมณ์ของ universal design (WELL v2 · Accessibility and Universal Design) ไม่ใช่ข้อกำหนดของ WELL มีสองค่าที่เทียบกับแนวปฏิบัติที่เผยแพร่ได้ ทางสัญจรที่เข้าถึงได้กว้าง 91 ซม. (36 นิ้ว) และลดได้เหลือ 81 ซม. (32 นิ้ว) ในช่วงยาวไม่เกิน 61 ซม. (24 นิ้ว) (ADA Standards) เราตั้งทางเดินไว้ที่ ${walk.standard} และเรียก ${walk.minimum} ว่าพอใช้ ส่วนทางเดินในครัวกว้าง 91 ซม. และช่องทำงานของคนทำอาหารคนเดียว 107 ซม. (NKBA) หน้าเคาน์เตอร์เราตั้งไว้ที่ ${kitchen.standard} และเรียก ${kitchen.comfortable} ว่าสบาย ช่อง 107 จึงอยู่ระหว่างสองค่านี้ ค่าที่เหลือเป็นดุลพินิจของเราสำหรับห้อง 25.2 ตร.ม.`;
  }
  return `These widths are Nature Haven’s own working standard, designed in the spirit of universal design (WELL v2, Accessibility and Universal Design). They are not a WELL requirement. Two of them can be set beside published guidance. An accessible route is 91 cm (36 in) wide and may narrow to 81 cm (32 in) for a stretch of up to 61 cm (24 in) (ADA Standards); we ask ${walk.standard} for a walkway and call ${walk.minimum} the minimum. A kitchen walkway is 91 cm and a one-cook work aisle 107 cm (NKBA); in front of the counter we ask ${kitchen.standard} and call ${kitchen.comfortable} comfortable, so the one-cook aisle sits between the two. The rest are our own judgement for a 25.2 sqm room.`;
}
/** "80 cm" / "150+ cm": whole centimetres, rounded down; a measurement stops at the cap, past which no tier changes. */
export function cmLabel(cm: number, lang: LangCode): string {
  const unit = lang === 'th' ? 'ซม.' : 'cm';
  return cm >= CLEAR_CAP ? `${CLEAR_CAP}+ ${unit}` : `${wholeCm(cm)} ${unit}`;
}

/** The tiers of one space with the width each starts at: "Tight under 80 · Minimum 80 · Just right 90 · Comfortable 120 cm". */
export function thresholdsLine(space: SpaceId, lang: LangCode): string {
  const s = SPACE_STANDARDS[space];
  const unit = lang === 'th' ? 'ซม.' : 'cm';
  const under = lang === 'th' ? 'ต่ำกว่า' : 'under';
  return [
    `${TIER_NAME.tight[lang]} ${under} ${s.minimum}`,
    `${TIER_NAME.minimum[lang]} ${s.minimum}`,
    `${TIER_NAME.standard[lang]} ${s.standard}`,
    `${TIER_NAME.comfortable[lang]} ${s.comfortable}`,
  ].join(' · ') + ` ${unit}`;
}

/** What the game asks of a space: "The game asks for at least Just right (90 cm)". */
export function requirementLine(space: SpaceId, lang: LangCode): string {
  const s = SPACE_STANDARDS[space];
  const unit = lang === 'th' ? 'ซม.' : 'cm';
  return `${SPACES_COPY.askedFor[lang]} ${TIER_NAME[s.required][lang]} (${requiredCm(space)} ${unit})`;
}

/** What the selected piece leaves around it: "Room in front: 90 cm · Just right", and what it still needs when that is not enough. */
export function selectedSpaceLine(space: SpaceId, cm: number, lang: LangCode): string {
  const where = space === 'bedside' ? SPACES_COPY.besideBed : SPACES_COPY.inFront;
  const short = shortOf(space, cm);
  const needs = short === null ? '' : ` · ${SPACES_COPY.needs[lang]} ${short}`;
  return `${where[lang]}: ${cmLabel(cm, lang)} · ${TIER_NAME[tierOf(space, cm)][lang]}${needs}`;
}
