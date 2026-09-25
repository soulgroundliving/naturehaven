import type { Bilingual } from '@/data/journalTypes';
import type { GuideDrawnStage } from '@/lib/journalGuide';
import type { DoorId } from '@/lib/roomFit';

const t = (en: string, th: string): Bilingual => ({ en, th });

// Interface words only. Everything a guide page SAYS is the article's own text (journalGuide.ts); this is
// what the buttons and the labels drawn on the plan are called.
export const GUIDE_COPY = {
  close: t('Close', 'ปิด'),
  back: t('Back', 'ย้อนกลับ'),
  next: t('Next', 'ถัดไป'),
  dialogLabel: t('Read page by page', 'อ่านทีละหน้า'),
  tapADoor: t('Tap a door', 'แตะที่ประตู'),
  pageOf: t('Page', 'หน้า'),
};

/** The door labels drawn on the plan: short enough to sit beside their door. The full sentence is DOOR_KIND, read on focus. */
export const DOOR_LABEL: Record<DoorId, { name: Bilingual; how: Bilingual }> = {
  entrance: { name: t('Front door', 'ประตูทางเข้า'), how: t('opens out', 'เปิดออก') },
  bathroom: { name: t('Bathroom', 'ห้องน้ำ'), how: t('opens in', 'เปิดเข้า') },
  balcony: { name: t('Balcony', 'ระเบียง'), how: t('slides', 'บานเลื่อน') },
};

/**
 * What each drawing is, for someone who cannot see it. The article's own slides carry alt text, but a drawn
 * page drops its slide (journalGuide.ts), and the slide's words describe the slide - the constraints one
 * lists a window and plumbing this page does not draw - so each drawing is described as drawn.
 * tools/__tests__/guideCopy.test.ts holds the final one to the final plan's geometry.
 */
export const PICTURE_LABEL: Record<GuideDrawnStage, Bilingual> = {
  plan: t(
    'Plan of the empty room, 350 by 720 centimetres, 25.2 square metres: the balcony and the bathroom at the top, the front door at the bottom right',
    'แปลนห้องเปล่า กว้าง 350 ยาว 720 เซนติเมตร รวม 25.2 ตารางเมตร ระเบียงและห้องน้ำอยู่ด้านบน ประตูทางเข้าอยู่มุมขวาล่าง',
  ),
  brief: t(
    'The plan divided into zones: sleeping down the left side, and working, cooking, storage and entry one below the other down the right side',
    'แปลนที่แบ่งเป็นโซน ด้านซ้ายเป็นที่นอน ด้านขวาเรียงจากบนลงล่างเป็นทำงาน ครัว เก็บของ และทางเข้า',
  ),
  constraints: t(
    "The plan with its three doors marked: a double sliding door to the balcony and the bathroom door at the top, the front door at the bottom right. Each door can be opened and shut.",
    'แปลนที่ทำเครื่องหมายประตูทั้งสามบาน ประตูบานเลื่อนคู่ไประเบียงและประตูห้องน้ำอยู่ด้านบน ประตูทางเข้าอยู่มุมขวาล่าง เปิดและปิดได้ทุกบาน',
  ),
  layout: t(
    'The plan with each piece of furniture in place and the clear floor it needs marked round it',
    'แปลนที่วางเฟอร์นิเจอร์แต่ละชิ้นแล้ว พร้อมพื้นที่ว่างที่แต่ละชิ้นต้องการ',
  ),
  final: t(
    'The final plan: the bed against the left wall; the table, the fridge, the kitchen counter and the shelf down the right wall; the closet at the bottom left',
    'แปลนสุดท้าย เตียงชิดผนังซ้าย โต๊ะ ตู้เย็น เคาน์เตอร์ครัว และชั้นวางเรียงตามผนังขวา ตู้เสื้อผ้าอยู่มุมซ้ายล่าง',
  ),
};

/** "03 / 08". */
export function pageLabel(index: number, count: number): string {
  return `${String(index + 1).padStart(2, '0')} / ${String(count).padStart(2, '0')}`;
}

/** "Page 3 of 8: The Constraints" - what a screen reader says when the page changes. */
export function pageAnnouncement(index: number, count: number, title: string, lang: 'en' | 'th'): string {
  return lang === 'th' ? `หน้า ${index + 1} จาก ${count}: ${title}` : `Page ${index + 1} of ${count}: ${title}`;
}

/** A length as the plan prints it. */
export const cm = (n: number, lang: 'en' | 'th'): string => (lang === 'th' ? `${n} ซม.` : `${n} cm`);
/** An area in square metres as the plan prints it. */
export const sqm = (n: number, lang: 'en' | 'th'): string => (lang === 'th' ? `${n} ตร.ม.` : `${n} sqm`);
