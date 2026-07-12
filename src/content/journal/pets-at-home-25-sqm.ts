import type { Article } from '@/data/journalTypes';

const article: Article = {
  slug: 'pets-at-home-25-sqm',
  category: { en: 'Pet Life', th: 'ชีวิตกับสัตว์เลี้ยง' },
  title: {
    en: 'Pets on every floor — how 25.2 sqm becomes home for both of you',
    th: 'เลี้ยงสัตว์ได้ทุกชั้น — ทำอย่างไรให้ 25.2 ตร.ม. เป็นบ้านของทั้งคุณและเขา',
  },
  excerpt: {
    en: 'No pet floor, no pet wing — the whole building welcomes small pets, one or two per residence. A single rule, applied evenly, and a layout considered for four legs as much as two.',
    th: 'ไม่มีชั้นสัตว์เลี้ยง ไม่มีปีกพิเศษ — ทั้งตึกต้อนรับสัตว์เลี้ยงขนาดเล็ก หนึ่งถึงสองตัวต่อห้อง กติกาเดียวที่ใช้เท่ากันทุกที่ และเลย์เอาต์ที่คิดมาเพื่อสี่ขาไม่น้อยไปกว่าสองขา',
  },
  date: '2026-06-26',
  readMinutes: 6,
  hero: '/assets/room-view-out.jpg',
  heroAlt: {
    en: 'Nature Haven bedroom — view from the bed toward the entrance, desk and wardrobe',
    th: 'ห้องพัก Nature Haven — มุมมองออกห้อง เห็นโต๊ะทำงานและตู้เสื้อผ้า',
  },
  blocks: [
    {
      type: 'p',
      text: {
        th: 'ไม่มีชั้นให้ต้องเลือก และไม่มีข้อยกเว้นให้ต้องกังวล — ที่ Nature Haven ทุกห้องในทุกชั้นต้อนรับสัตว์เลี้ยงขนาดเล็ก หนึ่งถึงสองตัวต่อห้อง ไม่ใช่สิทธิพิเศษที่กันไว้แค่มุมใดมุมหนึ่งของตึก แต่เป็นคำตอบเดียวกันทั้งอาคาร',
        en: 'There is no floor to choose and no exception to navigate: at Nature Haven, every unit on every level welcomes small pets, one or two per residence. Not a feature reserved for a corner of the building — the whole address, built around the same answer.',
      },
    },
    {
      type: 'h2',
      text: { th: 'ทำไมทั้งตึก ไม่ใช่แค่บางชั้น', en: 'Why the whole building, not a "pet floor"' },
    },
    {
      type: 'p',
      text: {
        th: 'เราตัดสินใจตั้งแต่แบบร่างแรกว่าสัตว์เลี้ยงอยู่ได้ทั้งตึก ไม่ใช่แค่บางชั้นหรือบางปีก — เพราะคนที่ใช้ชีวิตร่วมกับสัตว์เลี้ยงควรได้เป็นเจ้าของบ้านเต็มตัว ไม่ใช่แขกในบ้านของตัวเอง กติกาของเราจึงมีชุดเดียวสำหรับผู้อยู่อาศัยทุกคน ชัดเจนพอที่เพื่อนบ้าน ไม่ว่าจะมีสัตว์เลี้ยงหรือไม่ จะอยู่ร่วมตึกเดียวกันได้จริง',
        en: 'We decided from the first draft that pets belong to the whole building, not to a floor or a wing — because someone who shares their life with an animal should be fully at home, never a guest in their own building. So there is one rule for every resident, clear enough that neighbours — with an animal or without — can genuinely share the building.',
      },
    },
    {
      type: 'pull',
      text: {
        th: 'บ้านที่ดีสำหรับสัตว์เลี้ยง เริ่มจากกติกาที่แฟร์กับเพื่อนบ้าน',
        en: 'A good home for pets starts with rules that are fair to neighbours.',
      },
    },
    {
      type: 'h2',
      text: { th: 'เลย์เอาต์ที่คิดเผื่อสี่ขา', en: 'A layout that thinks in four legs' },
    },
    {
      type: 'p',
      text: {
        th: 'แต่ละยูนิตขนาด 25.2 ตร.ม. มีโซนนอน ห้องน้ำ มุมครัวในตัว และระเบียงส่วนตัว — และสำหรับบ้านที่มีสัตว์เลี้ยง ความใส่ใจอยู่ในรายละเอียดเล็ก ๆ เหล่านี้: อาหารของคุณและของเขาเก็บไว้สูงหลังบานตู้บิลต์อินที่ปิดมิดชิด พ้นจากจมูกที่อยากรู้อยากเห็น ซิงก์ล้างจานพักอยู่ที่ระเบียงแทนที่จะอยู่ข้างเตียง ประตูห้องน้ำที่ปิดได้ให้ความเป็นส่วนตัวเมื่อต้องการ และระเบียงเองก็กลายเป็นมุมอาบแดดที่สัตว์เลี้ยงส่วนใหญ่เลือกเป็นของตัวเองภายในสัปดาห์แรก',
        en: 'Each 25.2 sqm residence holds a sleeping zone, a bathroom, an in-room kitchenette, and a private balcony — and for a pet household, the consideration lives in the details. Food, yours and theirs, stays up high behind closed built-in doors, away from curious noses. The dish sink rests on the balcony rather than beside the bed. A bathroom door that closes gives you privacy on demand. And the balcony itself becomes the sunbathing spot most animals claim as their own within the first week.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'ที่ชั้นล่างมีสวนส่วนกลาง — พื้นที่สีเขียวเล็ก ๆ ที่เป็นจุดเปลี่ยนบรรยากาศให้ทั้งสองสายพันธุ์ และเพราะตึกสูงเพียงสี่ชั้น การพาลงไปเดินเล่นยามเย็นจึงเป็นเพียงบันไดไม่กี่ขั้น ไม่ใช่การรอคอยลิฟต์',
        en: 'At ground level, a common garden offers a small green pocket — a change of scenery for both species. And because the building rises only four floors, the evening walk down is a short flight of stairs, never a wait for an elevator.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'แม้แต่เรื่องเอกสารก็คิดมาอย่างละเอียดไม่ต่างจากตัวห้อง — แอปสำหรับลูกบ้านเก็บประวัติสัตว์เลี้ยงไว้ในที่เดียวกับสัญญาและบิลของคุณ ทะเบียนและประวัติวัคซีนอยู่ในที่เดียว ไม่ต้องมีสมุดวัคซีนตกค้างอยู่ในลิ้นชักอีกต่อไป',
        en: 'The paperwork has been considered as carefully as the room: the resident app holds pet records alongside your lease and your bills — registration and history in one place, with no vaccination booklet left loose in a drawer.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'Nature Haven เปิดให้เข้าอยู่กันยายน 2026 ตั้งแต่วันแรก คำต้อนรับที่หน้าประตูมีความหมายตามตัวอักษร — สำหรับผู้อยู่อาศัยทั้งสองขา และสี่ขา',
        en: 'Nature Haven opens in September 2026. From the first day, the welcome at the door is meant literally — for residents on two legs, and on four.',
      },
    },
  ],
};

export default article;
