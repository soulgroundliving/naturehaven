import type { Article } from '@/data/journalTypes';

const article: Article = {
  slug: 'pets-at-home-25-sqm',
  category: { en: 'Pet Life', th: 'ชีวิตกับสัตว์เลี้ยง' },
  title: {
    en: 'Pets on every floor — how 25.2 sqm becomes home for both of you',
    th: 'เลี้ยงสัตว์ได้ทุกชั้น — ทำอย่างไรให้ 25.2 ตร.ม. เป็นบ้านของทั้งคุณและเขา',
  },
  excerpt: {
    en: 'No pet floor, no pet wing — the whole building welcomes dogs and cats, up to 15 kg full-grown by breed standard, two to a home at most. A single rule, applied evenly, and a layout considered for four legs as much as two.',
    th: 'ไม่มีชั้นสัตว์เลี้ยง ไม่มีปีกพิเศษ — ทั้งตึกต้อนรับทั้งสุนัขและแมว ตัวเต็มวัยตามมาตรฐานสายพันธุ์ไม่เกิน 15 กก. ไม่เกิน 2 ตัวต่อห้อง กติกาเดียวที่ใช้เท่ากันทุกที่ และเลย์เอาต์ที่คิดมาเพื่อสี่ขาไม่น้อยไปกว่าสองขา',
  },
  date: '2026-06-26',
  readMinutes: 7,
  hero: '/assets/room-view-out.jpg',
  heroAlt: {
    en: 'Nature Haven bedroom — view from the bed toward the entrance, desk and wardrobe',
    th: 'ห้องพัก Nature Haven — มุมมองออกห้อง เห็นโต๊ะทำงานและตู้เสื้อผ้า',
  },
  blocks: [
    {
      type: 'p',
      text: {
        th: 'ไม่มีชั้นให้ต้องเลือก และไม่มีข้อยกเว้นให้ต้องกังวล — ที่ Nature Haven ทุกห้องในทุกชั้นต้อนรับทั้งสุนัขและแมว ตัวเล็กถึงกลาง ไม่เกิน 2 ตัวต่อห้อง ไม่ใช่สิทธิพิเศษที่กันไว้แค่มุมใดมุมหนึ่งของตึก แต่เป็นคำตอบเดียวกันทั้งอาคาร',
        en: 'There is no floor to choose and no exception to navigate: at Nature Haven, every unit on every level welcomes dogs and cats, small to medium, up to two per residence. Not a feature reserved for a corner of the building — the whole address, built around the same answer.',
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
      text: { th: 'ตัวเล็กถึงกลาง — วัดกันที่ตัวเต็มวัย', en: 'Small to medium — measured at full-grown' },
    },
    {
      type: 'p',
      text: {
        th: 'เกณฑ์ของเรามีข้อเดียว คือน้ำหนักตัวเต็มวัยตามมาตรฐานสายพันธุ์ต้องไม่เกิน 15 กก. พิจารณา ณ วันลงทะเบียน — ไม่มีรายชื่อสายพันธุ์ที่รับหรือไม่รับ เราวัดที่ตัวเต็มวัยเพื่อความแฟร์กับทุกฝ่าย เพราะลูกสุนัข 4 กก. วันนี้ อาจเป็น 30 กก. ในปีหน้า ห้องเลี้ยงได้ไม่เกิน 2 ตัว และขอให้น้องไม่ส่งเสียงดังต่อเนื่องรบกวนเพื่อนบ้าน',
        en: 'Our test is a single number: full-grown weight, by breed standard, up to 15 kg, judged on the day you register. There is no list of breeds we accept or refuse. We measure the adult because it is fair to everyone — a 4 kg puppy today can be 30 kg next year. Up to two per home, and we ask that a pet does not bark or cry continuously and disturb the neighbours.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'หากมีเสียงรบกวนต่อเนื่องจริง เรามีกระบวนการสามขั้นที่ยุติธรรมกับทุกฝ่าย — โครงการแจ้งเจ้าของ นัดคุยหาทางแก้ร่วมกัน (การฝึก อุปกรณ์ การย้ายชั้น) และทบทวนสิทธิ์การเลี้ยงเป็นทางเลือกสุดท้ายเมื่อแก้ไม่ได้จริง ทุกขั้นมีบันทึกเป็นลายลักษณ์อักษร และเจ้าของมีโอกาสชี้แจงก่อนการตัดสินใดเสมอ',
        en: 'If noise does persist, there are three steps, fair to everyone: we tell the owner; we meet to find a fix together (training, equipment, a move to another floor); and only if nothing works do we review the right to keep the pet. Every step is recorded in writing, and the owner is always heard before any decision.',
      },
    },
    {
      type: 'h2',
      text: { th: 'เลย์เอาต์ที่คิดเผื่อสี่ขา', en: 'A layout that thinks in four legs' },
    },
    {
      type: 'p',
      text: {
        th: 'แต่ละยูนิตขนาด 25.2 ตร.ม. มีโซนนอน ห้องน้ำ ตู้เก็บของอเนกประสงค์ และระเบียงส่วนตัว — และสำหรับบ้านที่มีสัตว์เลี้ยง ความใส่ใจอยู่ในรายละเอียดเล็ก ๆ เหล่านี้: อาหารของคุณและของเขาเก็บไว้สูงหลังบานตู้บิลต์อินที่ปิดมิดชิด พ้นจากจมูกที่อยากรู้อยากเห็น ซิงก์ล้างจานพักอยู่ที่ระเบียงแทนที่จะอยู่ข้างเตียง ประตูห้องน้ำที่ปิดได้ให้ความเป็นส่วนตัวเมื่อต้องการ ส่วนระเบียงเป็นพื้นที่เปิดรับแดด — สำหรับบ้านที่เลี้ยงแมวตั้งแต่ชั้น 2 ขึ้นไป เราขอให้ติดตาข่ายกันตกที่ระเบียงภายใน 14 วันหลังเข้าอยู่ โครงการยินดีช่วยประสานช่างให้ กติกาข้อนี้มีเหตุผลเดียว คือไม่มีใครอยากเจอเหตุการณ์ที่ป้องกันได้',
        en: 'Each 25.2 sqm residence holds a sleeping zone, a bathroom, a multi-purpose storage cabinet, and a private balcony — and for a pet household, the consideration lives in the details. Food, yours and theirs, stays up high behind closed built-in doors, away from curious noses. The dish sink rests on the balcony rather than beside the bed. A bathroom door that closes gives you privacy on demand. And the balcony is an open, sun-washed space — for cat households from the second floor up, we ask for a fall-safe balcony net within 14 days of moving in, and we help arrange the installer. That rule exists for one reason: nobody wants to meet an accident that could have been prevented.',
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
      type: 'table',
      caption: {
        th: 'คำแนะนำเรื่องชั้น — ไม่ใช่ข้อบังคับ ทุกชั้นเลี้ยงได้เท่ากัน',
        en: 'A suggestion on floors — not a rule; every floor welcomes every pet',
      },
      head: [
        { th: 'น้อง', en: 'Your companion' },
        { th: 'ชั้นที่แนะนำ', en: 'Suggested floors' },
        { th: 'เพราะอะไร', en: 'Why' },
      ],
      rows: [
        [
          { th: 'แมว', en: 'Cats' },
          '3–4',
          { th: 'ไม่ต้องพาออกเดินทุกวัน และชั้นสูงเงียบกว่า', en: 'No daily walks to make, and the upper floors are quieter.' },
        ],
        [
          { th: 'สุนัขที่ออกเดินวันละ 2 รอบขึ้นไป', en: 'Dogs walked twice a day or more' },
          '1–2',
          { th: 'ขึ้น–ลงบันไดหลายรอบต่อวัน ชั้นล่างถนอมแรงทั้งคนและสุนัข', en: 'Several trips up and down the stairs a day — lower floors spare both of you.' },
        ],
        [
          { th: 'สุนัขสูงวัย หรือพันธุ์หลังยาวขาสั้น', en: 'Senior dogs, or long-backed short-legged breeds' },
          '1',
          { th: 'ข้อสะโพกและหมอนรองกระดูกไม่ควรเจอบันไดเป็นกิจวัตร', en: 'Hips and spines should not face stairs as a daily routine.' },
        ],
      ],
      rowHeader: true,
    },
    {
      type: 'p',
      text: {
        th: 'แม้แต่เรื่องเอกสารก็คิดมาอย่างละเอียดไม่ต่างจากตัวห้อง — แอปสำหรับลูกบ้านเก็บประวัติสัตว์เลี้ยงไว้ในที่เดียวกับสัญญาและบิลของคุณ ก่อนเข้าอยู่ น้องทุกตัวลงทะเบียนพร้อมสมุดวัคซีนในแอป ทะเบียนและประวัติวัคซีนอยู่ในที่เดียว ไม่ต้องมีสมุดวัคซีนตกค้างอยู่ในลิ้นชักอีกต่อไป',
        en: 'The paperwork has been considered as carefully as the room: the resident app holds pet records alongside your lease and your bills — every pet is registered with its vaccination book in the app before move-in, and the history lives in one place, with no booklet left loose in a drawer.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'Nature Haven เปิดให้เข้าอยู่พฤศจิกายน 2026 ตั้งแต่วันแรก คำต้อนรับที่หน้าประตูมีความหมายตามตัวอักษร — สำหรับผู้อยู่อาศัยทั้งสองขา และสี่ขา',
        en: 'Nature Haven opens in November 2026. From the first day, the welcome at the door is meant literally — for residents on two legs, and on four.',
      },
    },
  ],
};

export default article;
