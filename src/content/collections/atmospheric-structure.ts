import type { Collection } from '@/data/collectionTypes';

// Collection 01 — Atmospheric & Structure
// The building, the orientation, and the air itself.
const collection: Collection = {
  slug: 'atmospheric-structure',
  index: '01',
  title: {
    en: 'Atmospheric & Structure',
    th: 'สเปซที่หายใจร่วมกับธรรมชาติ',
  },
  essence: {
    en: '25.2 m² set on the north–south wind line — nature does the quiet work.',
    th: 'ห้อง 25.2 ตร.ม. ที่วางตัวตามแนวลมเหนือ–ใต้ — ให้ธรรมชาติทำงานแทนเครื่องปรับอากาศ',
  },
  manifesto: {
    en: 'Before the first material was chosen, we chose the direction of the wind. Every residence sits on a north–south line — the door receives the breeze, the balcony releases it — and the whole is wrapped in a structure and a paint that are safe to breathe, for every life in the room.',
    th: 'ก่อนจะเลือกวัสดุชิ้นแรก เราเลือกทิศของลมก่อน ห้องทุกห้องวางตัวในแนวเหนือ–ใต้ ประตูรับลมเข้า ระเบียงปล่อยลมออก อากาศจึงหมุนเวียนเองตลอดปี จากนั้นจึงห่อทั้งหมดด้วยโครงสร้างและสีที่ปลอดภัยต่อลมหายใจของทุกชีวิตในห้อง',
  },
  hero: '/assets/corridor-approach.jpg',
  heroAlt: {
    en: 'The building corridor — warm recessed light, digital-locked doors, open to the breeze and greenery',
    th: 'โถงทางเดินของอาคาร — ไฟ warm light ประตูพร้อมล็อกดิจิทัล เปิดรับลมและแนวต้นไม้',
  },
  details: [
    {
      label: 'The Orientation',
      title: { en: 'Planned around the wind', th: 'วางผังตามทิศลม' },
      body: {
        en: 'The entrance faces north, the balcony south — aligned with Bangkok’s prevailing breeze, so air moves straight through the room all year. The room stays open and fresh without leaning on machines.',
        th: 'ประตูทางเข้าหันทิศเหนือ ระเบียงหันทิศใต้ — ตรงแนวลมประจำของกรุงเทพฯ พอดี ลมจึงไหลผ่านห้องได้ตรง ๆ ตลอดทั้งปี ห้องโปร่ง ไม่อับ โดยไม่ต้องพึ่งเครื่องจักรตลอดเวลา',
      },
      spec: {
        en: '25.2 m² rectangular plan · bedroom 3.5 × 5.6 m · 2.40 m ceiling',
        th: '25.2 ตร.ม. สี่เหลี่ยมผืนผ้า · ห้องนอน 3.5 × 5.6 ม. · ฝ้าสูง 2.40 ม.',
      },
    },
    {
      label: 'The Envelope',
      title: { en: 'A wall that keeps the heat out', th: 'ผนังที่ช่วยกันร้อน' },
      body: {
        en: 'Aerated lightweight-block walls slow the heat before it ever enters; a premium gypsum ceiling closes the envelope. The room is cool by construction — not only by compressor.',
        th: 'ผนังอิฐมวลเบาหน่วงความร้อนได้ดีกว่าอิฐทั่วไป ปิดฝ้าด้วยยิปซัมเกรดพรีเมียม — ห้องจึงเย็นตั้งแต่ระดับโครงสร้าง ไม่ใช่แค่จากแอร์',
      },
      spec: {
        en: 'AAC lightweight block · premium gypsum ceiling',
        th: 'อิฐมวลเบา · ฝ้ายิปซัมเกรดพรีเมียม',
      },
    },
    {
      label: 'The Finish',
      title: { en: 'A finish that is safe to breathe', th: 'สีที่ปลอดภัยต่อลมหายใจ' },
      body: {
        en: 'Inside and out, Nippon Green Grade in a soft white-cream — semi-gloss to matte, low-odour, and safe for both you and your animals from the first day you move in.',
        th: 'ทั้งภายในและภายนอกใช้สี Nippon รุ่น Green Grade โทนขาว-ครีม กึ่งเงา-ด้าน ไร้กลิ่นฉุนรบกวน ปลอดภัยต่อสุขภาพของคุณและสัตว์เลี้ยง — ตั้งแต่วันแรกที่ย้ายเข้า',
      },
      spec: {
        en: 'Nippon Paint Green Grade · semi-gloss / matte · interior + exterior',
        th: 'Nippon Paint Green Grade · กึ่งเงา / ด้าน · ภายใน + ภายนอก',
      },
    },
    {
      label: 'The Light',
      title: { en: 'Light that follows your day', th: 'แสงที่ปรับตามจังหวะชีวิต' },
      body: {
        en: 'Four corner LED downlights switch in pairs, and the central lamp shifts across three colour temperatures by its own remote, from anywhere in the room — work light to bedtime warmth in a few seconds.',
        th: 'ดาวน์ไลท์ LED 4 จุดตามมุมห้อง เปิดเป็นคู่ได้ตามโซน และโคมกลางห้องปรับได้ 3 โทนสีพร้อมอุณหภูมิแสง สั่งด้วยรีโมทเฉพาะจากตรงไหนก็ได้ในห้อง — จากแสงทำงานตอนบ่าย ถึงแสงอุ่นก่อนนอน ในไม่กี่วินาที',
      },
    },
    {
      label: 'The Invisible Grid',
      title: { en: 'The grid you never see', th: 'โครงข่ายที่เดินสายไว้ให้แล้ว' },
      body: {
        en: 'Outlets in every corner of the room, plus pre-run wiring for private Wi-Fi and a LAN line for the television. Nothing to drill, nothing to trail across the floor.',
        th: 'ปลั๊กไฟครบทุกมุมห้อง พร้อมเดินสายรองรับ Wi-Fi ส่วนตัว และสาย LAN สำหรับทีวี — อยากติดตั้งอะไรเพิ่ม ไม่ต้องเจาะ ไม่ต้องลากสายเองแม้แต่เส้นเดียว',
      },
    },
    {
      label: 'The Approach',
      title: { en: 'The way home', th: 'เส้นทางกลับบ้าน' },
      body: {
        en: 'A 1.6-metre corridor in soft cream tile, warm recessed light along the way, access-key entry, CCTV and perimeter lighting through the night — and one covered parking bay per residence.',
        th: 'ทางเดินภายในอาคารกว้าง 1.6 เมตร ปูกระเบื้องโทนครีมเงานวล ไฟ warm light ฝังตามทาง ประตูอาคารเข้าด้วย access key พร้อมกล้องวงจรปิดและไฟรอบอาคารตลอดคืน — และที่จอดรถมีหลังคา ห้องละ 1 คัน',
      },
    },
  ],
};

export default collection;
