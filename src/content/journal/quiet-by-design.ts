import type { Article } from '@/data/journalTypes';

const article: Article = {
  slug: 'quiet-by-design',
  category: { en: 'Quiet Living', th: 'อยู่อย่างสงบ' },
  title: {
    en: 'Quiet by design — why a 20-unit building with no elevator is the point',
    th: 'เงียบโดยตั้งใจ — ตึก 20 ห้องที่ไม่มีลิฟต์ ไม่ใช่ข้อจำกัด แต่คือสิ่งที่เราเลือก',
  },
  excerpt: {
    en: 'Every decision at Nature Haven starts from one question: does it make daily life quieter? This is the reasoning behind the low-rise form, moving the wet work out to the balcony, and what the rent covers.',
    th: 'ทุกอย่างที่นี่เริ่มจากคำถามเดียว ว่าชีวิตประจำวันจะเงียบขึ้นไหม — ที่มาของตึกเตี้ย ซิงก์ที่ระเบียง และสิ่งที่รวมอยู่ในค่าเช่า',
  },
  // What a search result shows (the title above stays the on-page heading). Leads with what a visitor searches — a quiet
  // place to rent in Sai Mai, and why there is no elevator — and ends with the brand name, not the journal's.
  seoTitle: {
    en: 'Quiet by design: why a 20-unit building has no elevator | Nature Haven',
    th: 'ห้องเช่าเงียบสงบ สายไหม: ทำไมตึก 20 ห้องไม่มีลิฟต์ | Nature Haven',
  },
  date: '2026-07-03',
  readMinutes: 5,
  hero: '/assets/room-view-in.jpg',
  heroAlt: {
    en: 'Nature Haven bedroom — view into the room toward the private balcony',
    th: 'ห้องที่ Nature Haven — มองจากประตูเข้าไปถึงระเบียงส่วนตัว',
  },
  blocks: [
    {
      type: 'p',
      text: {
        th: 'เสียงแรกที่ได้ยินเมื่อเปิดประตูห้อง ควรเป็นเสียงของตัวเอง ประโยคนี้อยู่กับเราตั้งแต่วันแรกที่ร่างแบบ Nature Haven ตึกจึงเล็กโดยตั้งใจ สี่ชั้น ชั้นละห้าห้อง รวมยี่สิบห้อง ในซอยเงียบของสายไหม',
        en: 'The first sound you hear when you open your door should be your own. That sentence has guided Nature Haven since the first sketch, and it explains why this building is deliberately small: a low-rise of 4 floors, just 20 units, 5 per floor, on a quiet street in Sai Mai.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'ตอนออกแบบ เราถามตัวเองว่า มีได้มากที่สุดกี่ห้อง ข้างในถึงยังเงียบอยู่ คำตอบคือยี่สิบ พอให้มีเพื่อนบ้าน แต่ไม่มากพอให้กลายเป็นทางผ่าน',
        en: 'The first question of the design was: how few units can this building hold and still feel calm inside? Our answer was twenty — enough for neighbours, never enough to feel like a corridor of strangers.',
      },
    },
    {
      type: 'pull',
      text: {
        th: 'ความเงียบไม่ใช่ของตกแต่ง แต่คือโครงสร้าง',
        en: 'Quiet is not a finish. It is structure.',
      },
    },
    {
      type: 'h2',
      text: { th: 'ทำไมไม่มีลิฟต์', en: 'Why there is no elevator' },
    },
    {
      type: 'p',
      text: {
        th: 'ที่นี่ไม่มีลิฟต์ เราตั้งใจ ไม่ใช่เพื่อประหยัด ไม่มีเสียงเครื่องจักรลอดผนังตอนตีสอง ไม่มีคนแปลกหน้ามายืนรอหน้าห้อง และงบส่วนกลางไม่ต้องแบกค่าดูแลลิฟต์ไปตลอดอายุตึก',
        en: 'There is no elevator here — and that absence is a decision, not an economy. A low-rise with no elevator means no machinery humming through the wall at two in the morning, no strangers pausing on your landing, and a shared budget that never has to carry the lifetime maintenance of something so large.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'ราคาก็ตามจำนวนขั้นบันได — ชั้น 3–4 ที่เดินขึ้นมากกว่า เริ่มต้นที่ 6,900 บาทต่อเดือน ส่วนชั้น 1–2 อยู่ที่ 7,200 บาท เดินมากขึ้น จ่ายน้อยลง',
        en: 'The price follows the stairs, too: floors 3–4, which ask more of your legs, begin at 6,900 THB a month, and floors 1–2 are 7,200. More stairs, less rent.',
      },
    },
    {
      type: 'h2',
      text: { th: '25.2 ตร.ม. ที่ห้องนอนยังเป็นห้องนอน', en: '25.2 square metres where the bedroom is actually a bedroom' },
    },
    {
      type: 'p',
      text: {
        th: 'ทุกห้องขนาด 25.2 ตร.ม. มีห้องนอน ห้องน้ำ ระเบียงส่วนตัว และตู้บิวท์อินอเนกประสงค์พร้อมที่วางไมโครเวฟ ซิงก์ล้างจานอยู่ที่ระเบียง ไม่ใช่ข้างเตียง เรื่องเล็ก แต่เปลี่ยนทั้งห้อง ไม่มีจานกองใกล้หมอน ไม่มีมุมชื้นในห้องนอน',
        en: 'Every residence measures 25.2 sqm — one bedroom, one bathroom, a private balcony, and a multi-purpose storage cabinet with a microwave station, whose dish sink rests outside on the balcony rather than beside the bed. A small move that changes the whole room: no plates gathering near the pillow, no damp corner in the bedroom.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'และยังมีความเงียบอีกชั้นหนึ่ง ไม่ได้อยู่ในผนัง แต่อยู่ในบิล ค่าเช่ารวม Wi-Fi บริการทำความสะอาด และดูแลแอร์ไว้แล้ว ส่วนค่าน้ำค่าไฟคิดตามมิเตอร์จริง',
        en: 'There is a last, quieter register too — not in the walls, but in the bill. Rent already includes Wi-Fi, cleaning, and air-conditioning service. Electricity and water are simply metered by actual usage.',
      },
    },
    {
      // The same facts the FAQ already states (src/data/propertyFacts.ts, "is it quiet?") — said here too, because this page
      // is titled for a quiet place to rent and must not promise more than the building can.
      type: 'callout',
      tone: 'note',
      title: { th: 'เรื่องเสียงจากภายนอก', en: 'About sound from outside' },
      text: {
        th: 'ข้างในตึกออกแบบให้เงียบ แต่ด้วยทำเล บางครั้งอาจได้ยินเสียงจากภายนอก เช่น พลุไกล ๆ ช่วงปีใหม่ สุนัขเห่าหรือหอนในบางวัน และเสียงเวทีดนตรีจากหมู่บ้านใกล้เคียงในบางโอกาส เราบอกไว้ก่อน เพื่อให้ได้ชั่งใจเอง',
        en: 'The building is designed to be quiet from the inside, but because of where it stands you may occasionally hear sound from outside — fireworks over the New Year festival (from a distance), dogs barking or howling on some days, and stage music from a neighbouring village on some occasions. We say so up front so you can judge for yourself before you decide.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'Nature Haven คาดว่าเปิดให้เข้าอยู่ช่วงมีนาคม 2027 ถ้าสิ่งแรกที่อยากได้ยินตอนกลับบ้านคือความเงียบ ตึกนี้สร้างมาเพื่อสิ่งนั้น',
        en: 'Nature Haven is expected to open around March 2027. If the first thing you wish to hear on returning home is nothing at all, this is the building made for that wish.',
      },
    },
  ],
};

export default article;
