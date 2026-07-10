import type { Article } from '@/data/journalTypes';

const article: Article = {
  slug: 'pets-at-home-25-sqm',
  category: { en: 'Pet Life', th: 'ชีวิตกับสัตว์เลี้ยง' },
  title: {
    en: 'Pets on every floor — how 25.2 sqm becomes home for both of you',
    th: 'เลี้ยงสัตว์ได้ทุกชั้น — ทำอย่างไรให้ 25.2 ตร.ม. เป็นบ้านของทั้งคุณและเขา',
  },
  excerpt: {
    en: 'No pet floors, no pet wings — the whole building welcomes small pets, 1–2 per unit. Here is why we chose one rule for everyone, and how the unit layout works for animals too.',
    th: 'ไม่มีชั้นสัตว์เลี้ยง ไม่มีโซนพิเศษ — ทั้งตึกรับสัตว์เลี้ยงขนาดเล็ก 1–2 ตัวต่อห้อง นี่คือเหตุผลที่เราเลือกกติกาเดียวสำหรับทุกคน และวิธีที่เลย์เอาต์ห้องทำงานให้สัตว์เลี้ยงด้วย',
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
        th: 'คำถามที่เราถูกถามบ่อยที่สุดตั้งแต่เปิดเพจคือคำถามเดียวกันเกือบทุกครั้ง: "เลี้ยงสัตว์ได้จริงไหม แล้วต้องอยู่ชั้นไหน" — คำตอบสั้นที่สุดที่เราตอบได้คือ ได้จริง และไม่ต้องเลือกชั้น เพราะที่ Nature Haven ทุกห้อง ทุกชั้น รับสัตว์เลี้ยงขนาดเล็ก 1–2 ตัวต่อห้อง',
        en: 'Since the day we announced the project, the most common question has been the same one: "Can I really keep a pet — and which floor do I have to live on?" The shortest honest answer: yes, really, and you don\'t choose a floor. At Nature Haven every unit on every floor welcomes small pets, 1–2 per unit.',
      },
    },
    {
      type: 'h2',
      text: { th: 'ทำไมทั้งตึก ไม่ใช่แค่บางชั้น', en: 'Why the whole building, not a "pet floor"' },
    },
    {
      type: 'p',
      text: {
        th: 'ที่พักจำนวนมากแก้โจทย์สัตว์เลี้ยงด้วยการกันโซน — ชั้นสัตว์เลี้ยง ปีกสัตว์เลี้ยง ราคาพิเศษ ผลข้างเคียงคือคนเลี้ยงสัตว์กลายเป็นพลเมืองชั้นสองของตึกตัวเอง เราไม่อยากให้ใครรู้สึกแบบนั้น จึงเลือกทางที่ยากกว่าแต่ตรงกว่า: กติกาเดียวกันทั้งตึก และทำให้กติกานั้นชัดพอที่เพื่อนบ้านทุกคน — มีสัตว์หรือไม่มี — อยู่ร่วมกันได้จริง',
        en: 'Most rentals solve the pet question by zoning — a pet floor, a pet wing, a pet premium. The side effect is that pet owners become second-class residents of their own building. We didn\'t want anyone to feel that, so we chose the harder, straighter path: one rule for the whole building, made clear enough that every neighbour — with or without an animal — can genuinely live with it.',
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
        th: 'ห้อง 25.2 ตร.ม. ของเรามีโซนนอน ห้องน้ำ มุมครัวในตัว และระเบียงส่วนตัว — สำหรับคนเลี้ยงสัตว์ ความใส่ใจอยู่ในรายละเอียด: อาหาร (ของคุณและของเขา) เก็บในตู้บิ้วอินด้านบนที่ปิดมิดชิด พ้นจมูกที่อยากรู้อยากเห็น ซิงก์ล้างจานอยู่ที่ระเบียงไม่ใช่ข้างเตียง ประตูห้องน้ำที่ปิดได้ให้พื้นที่เป็นส่วนตัวเมื่อต้องการ และระเบียงคือจุดอาบแดดประจำตัวที่สัตว์เลี้ยงส่วนใหญ่เลือกเองภายในสัปดาห์แรก',
        en: 'Each 25.2 sqm unit holds a sleeping zone, a bathroom, an in-room kitchenette, and a private balcony. For a pet household the thought is in the details: food — yours and theirs — stores up high in closed built-in cabinets away from curious noses, the dish sink sits out on the balcony rather than by the bed, a closable bathroom gives you privacy when you need it, and the balcony becomes the personal sunbathing spot most animals claim within the first week.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'ชั้นล่างของตึกมีสวนส่วนกลาง — พื้นที่สีเขียวเล็ก ๆ ที่ตั้งใจให้เป็นจุดเปลี่ยนอิริยาบถของทั้งคนและสัตว์ และเพราะเป็นตึก low-rise แค่ 4 ชั้น การพาเขาลงไปเดินเล่นตอนเย็นจึงเป็นบันไดไม่กี่ขั้น ไม่ใช่ภารกิจรอลิฟต์',
        en: 'At ground level there is a common garden — a small green pocket meant as a change of scenery for both species. And because the building is a 4-floor low-rise, the evening walk downstairs is a short flight of steps, not a mission of waiting for an elevator.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'เรื่องเอกสารก็คิดไว้แล้ว: แอปสำหรับลูกบ้านของเรามีระบบบันทึกข้อมูลสัตว์เลี้ยง — ทะเบียนและประวัติของเขาอยู่ในที่เดียวกับสัญญาและบิลของคุณ ไม่ต้องเก็บกระดาษวัคซีนไว้ในลิ้นชักอีกต่อไป',
        en: 'The paperwork is thought through too: our resident app includes pet records — their registration and history live in the same place as your lease and bills, no more vaccine booklets loose in a drawer.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'Nature Haven เปิดกันยายน 2026 และตั้งแต่วันแรก ป้ายหน้าตึกจะหมายความตามที่เขียนจริง ๆ: ยินดีต้อนรับ — ทั้งสองขาและสี่ขา',
        en: 'Nature Haven opens in September 2026, and from day one the sign at the door will mean exactly what it says: welcome — on two legs and four.',
      },
    },
  ],
};

export default article;
