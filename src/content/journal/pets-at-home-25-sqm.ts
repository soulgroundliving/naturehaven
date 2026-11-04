import type { Article } from '@/data/journalTypes';

const article: Article = {
  slug: 'pets-at-home-25-sqm',
  category: { en: 'Pet Life', th: 'ชีวิตกับสัตว์เลี้ยง' },
  title: {
    en: 'Pets on every floor — how 25.2 sqm becomes home for both of you',
    th: 'เลี้ยงสัตว์ได้ทุกชั้น — 25.2 ตร.ม. ที่เป็นบ้านของทั้งคนและน้อง',
  },
  excerpt: {
    en: 'No pet floor, no pet wing — the whole building welcomes dogs (up to 15 kg full-grown by breed standard), cats, rabbits and hamsters, one per home, as the Bangkok pet ordinance sets. One rule for the whole building, and a room that thinks of four legs too.',
    th: 'ไม่มีชั้นหรือโซนเฉพาะสัตว์เลี้ยง — ทุกห้องเลี้ยงสุนัข แมว กระต่าย หรือหนูแฮมสเตอร์ได้ห้องละ 1 ตัว ตามข้อบัญญัติ กทม. สุนัขตัวเต็มวัยตามมาตรฐานสายพันธุ์ไม่เกิน 15 กก. กติกาเดียวกันทั้งตึก และห้องที่จัดไว้เผื่อเพื่อนสี่ขา',
  },
  date: '2026-06-26',
  readMinutes: 7,
  hero: '/assets/room-view-out.jpg',
  heroAlt: {
    en: 'Nature Haven bedroom — view from the bed toward the entrance, desk and wardrobe',
    th: 'ห้องที่ Nature Haven — มองจากเตียงไปทางประตู เห็นโต๊ะทำงานและตู้เสื้อผ้า',
  },
  blocks: [
    {
      type: 'p',
      text: {
        th: 'ที่นี่ไม่มีชั้นสำหรับสัตว์เลี้ยง เพราะเลี้ยงได้ทุกชั้น และไม่มีข้อยกเว้นให้ต้องกังวล ทุกห้องต้อนรับสุนัข แมว กระต่าย และหนูแฮมสเตอร์ ตัวเล็กถึงกลาง 1 ตัวต่อห้องตามข้อบัญญัติ กทม. ไม่ใช่สิทธิพิเศษของบางมุม แต่เป็นกติกาเดียวกันทั้งตึก',
        en: 'There is no floor to choose and no exception to navigate: at Nature Haven, every unit on every level welcomes dogs, cats, rabbits and hamsters, small to medium, one per home, as the Bangkok pet ordinance sets. Not a privilege for one corner, but the same rule across the whole building.',
      },
    },
    {
      type: 'h2',
      text: { th: 'ทำไมทั้งตึก ไม่ใช่แค่บางชั้น', en: 'Why the whole building, not a "pet floor"' },
    },
    {
      type: 'p',
      text: {
        th: 'เราตัดสินใจตั้งแต่แบบร่างแรกว่าสัตว์เลี้ยงอยู่ได้ทั้งตึก เพราะคนที่ใช้ชีวิตร่วมกับสัตว์เลี้ยงควรได้อยู่อย่างคนในบ้านเต็มตัว ไม่ใช่แขกในบ้านของตัวเอง กติกาจึงมีชุดเดียว ชัดพอให้เพื่อนบ้านทุกคน ไม่ว่าจะเลี้ยงสัตว์หรือไม่ อยู่ร่วมกันได้สบายใจ',
        en: 'We decided from the first draft that pets belong to the whole building, not to one floor — because someone who shares their life with an animal should be fully at home, never a guest in their own building. So there is one rule for everyone, clear enough that every neighbour, with an animal or without, can live together at ease.',
      },
    },
    {
      type: 'pull',
      text: {
        th: 'บ้านที่ดีสำหรับสัตว์เลี้ยง เริ่มจากกติกาที่เป็นธรรมกับเพื่อนบ้าน',
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
        th: 'เรารับสุนัข แมว กระต่าย และหนูแฮมสเตอร์ สำหรับสุนัข เกณฑ์ของเรามีข้อเดียว คือน้ำหนักตัวเต็มวัยตามมาตรฐานสายพันธุ์ต้องไม่เกิน 15 กก. พิจารณา ณ วันลงทะเบียน — ไม่มีรายชื่อสายพันธุ์ที่รับหรือไม่รับ เราวัดที่ตัวเต็มวัย เพราะลูกสุนัข 4 กก. วันนี้ อาจเป็น 30 กก. ในปีหน้า ห้องละ 1 ตัวตามข้อบัญญัติ กทม. และขอให้น้องไม่ส่งเสียงดังต่อเนื่องรบกวนเพื่อนบ้าน',
        en: 'We accept dogs, cats, rabbits and hamsters. For dogs our test is a single number: full-grown weight, by breed standard, up to 15 kg, judged on the day you register. There is no list of breeds we accept or refuse. We measure the adult because a 4 kg puppy today can be 30 kg next year. One per home, as the Bangkok pet ordinance sets, and we ask that a pet does not bark or cry continuously and disturb the neighbours.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'หากมีเสียงรบกวนต่อเนื่องจริง เรามีสามขั้นที่ใช้กับทุกคนเท่ากัน — เราแจ้งเจ้าของ นัดคุยหาทางแก้ร่วมกัน (การฝึก อุปกรณ์ การย้ายชั้น) และทบทวนสิทธิ์การเลี้ยงเป็นทางเลือกสุดท้ายเมื่อแก้ไม่ได้จริง ทุกขั้นมีบันทึกเป็นลายลักษณ์อักษร และเจ้าของได้ชี้แจงก่อนตัดสินใจทุกครั้ง',
        en: 'If noise does persist, there are three steps, the same for everyone: we tell the owner; we meet to find a fix together (training, equipment, a move to another floor); and only if nothing works do we review the right to keep the pet. Every step is recorded in writing, and the owner is always heard before any decision.',
      },
    },
    {
      type: 'h2',
      text: { th: 'ผังห้องที่คิดเผื่อเพื่อนสี่ขา', en: 'A layout that thinks in four legs' },
    },
    {
      type: 'p',
      text: {
        th: 'แต่ละห้องขนาด 25.2 ตร.ม. มีโซนนอน ห้องน้ำ ตู้บิวท์อิน และระเบียงส่วนตัว อาหารของคนและของน้องเก็บไว้ในตู้สูงที่ปิดสนิท ซิงก์ล้างจานอยู่ที่ระเบียง ไม่ใช่ข้างเตียง ประตูห้องน้ำปิดได้เมื่ออยากมีความเป็นส่วนตัว',
        en: 'Each 25.2 sqm residence holds a sleeping zone, a bathroom, a built-in cabinet, and a private balcony. Food, yours and theirs, stays up high behind closed built-in doors. The dish sink rests on the balcony rather than beside the bed. A bathroom door that closes gives you privacy on demand.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'ระเบียงเปิดรับแดด — สำหรับบ้านที่มีแมวตั้งแต่ชั้น 2 ขึ้นไป เราขอให้ติดตาข่ายกันตกที่ระเบียงภายใน 14 วันหลังเข้าอยู่ และยินดีช่วยประสานช่างให้ เพราะไม่มีใครอยากเจอเหตุที่ป้องกันได้',
        en: 'The balcony is open to the sun. For cat households from the second floor up, we ask for a fall-safe balcony net within 14 days of moving in, and we help arrange the installer — because nobody wants to meet an accident that could have been prevented.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'ที่ชั้นล่างมีสวนส่วนกลาง — พื้นที่สีเขียวเล็ก ๆ ให้ทั้งคนและน้องได้เปลี่ยนบรรยากาศ และเพราะตึกสูงเพียงสี่ชั้น การพาลงไปเดินเล่นยามเย็นจึงเป็นแค่บันไดไม่กี่ชั้น ไม่ใช่การยืนรอลิฟต์',
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
          { th: 'บันไดทุกวันไม่ดีต่อสะโพกและหลัง', en: 'Stairs every day are hard on hips and spines.' },
        ],
      ],
      rowHeader: true,
    },
    {
      type: 'p',
      text: {
        th: 'ก่อนเข้าอยู่ น้องทุกตัวลงทะเบียนพร้อมสมุดวัคซีนในแอปลูกบ้าน ประวัติอยู่ที่เดียวกับสัญญาและบิล ไม่ต้องตามหา',
        en: 'Before move-in, every pet is registered with its vaccination book in the resident app, so its history sits in one place with the lease and the bills — nothing to hunt for.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'Nature Haven คาดว่าเปิดให้เข้าอยู่ช่วงมีนาคม 2027 ตั้งแต่วันแรก ประตูบ้านเปิดต้อนรับจริง ๆ — ทั้งผู้อยู่อาศัยสองขา และสี่ขา',
        en: 'Nature Haven is expected to open around March 2027. From the first day, the welcome at the door is meant literally — for residents on two legs, and on four.',
      },
    },
  ],
};

export default article;
