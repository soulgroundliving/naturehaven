import type { Article } from '@/data/journalTypes';

// This entry does NOT correspond to any real Facebook/Instagram post —
// earlier versions claimed it was "built from a six-slide carousel" (C8),
// but no such post was ever published anywhere except this site.
// Owner-clarified 2026-09-27 (same finding as build-diary-01.ts): rewritten
// as the site's own recap of the real materials, with no claim of a
// social-media source.
const article: Article = {
  slug: 'build-diary-02-materials',
  category: { en: 'Build Diary', th: 'บันทึกการสร้าง' },
  title: {
    en: 'Build Diary #2 — quiet by construction: the real materials, named one by one',
    th: 'Build Diary #2 — ความเงียบที่มาจากโครงสร้าง วัสดุจริง บอกชื่อทีละชิ้น',
  },
  excerpt: {
    en: 'The calm of a room does not come from decoration — it comes from what you cannot see. The full list of real materials, named down to the colour code on the tin.',
    th: 'ความสงบของห้องไม่ได้มาจากการตกแต่ง แต่มาจากสิ่งที่มองไม่เห็น รายการวัสดุจริงฉบับเต็ม ละเอียดถึงเบอร์สีบนกระป๋อง',
  },
  date: '2026-07-03',
  readMinutes: 3,
  hero: '/assets/design-materials-detail.jpg',
  heroAlt: {
    en: 'Close-up of Nature Haven material palette — pale wood and warm neutrals',
    th: 'รายละเอียดวัสดุของ Nature Haven — ไม้โทนอ่อนกับสีเรียบโทนอุ่น',
  },
  blocks: [
    {
      type: 'p',
      text: {
        th: 'ความสงบของห้อง ไม่ได้มาจากการตกแต่ง แต่มาจากสิ่งที่มองไม่เห็น ฉบับนี้บอกชื่อวัสดุจริงที่เลือกใช้ทีละชิ้น',
        en: 'The calm of a room does not come from decoration — it comes from what you cannot see. Here are the real materials, named one by one.',
      },
    },
    {
      type: 'h2',
      text: { th: 'รายการวัสดุจริง', en: 'The real materials' },
    },
    {
      type: 'table',
      caption: {
        th: 'วัสดุที่เลือกแล้ว ระบุตามที่ใช้จริง',
        en: 'The materials chosen, specified as used',
      },
      rowHeader: true,
      rows: [
        [
          { th: 'พื้น', en: 'Floor' },
          {
            th: 'SPC โทนอ่อนทุกห้อง เนื้อวัสดุใหม่ 100% ไม่ผสมเนื้อรีไซเคิล — เดินนุ่ม เก็บเสียง ทนน้ำ ทนรอยขีดข่วน ดูแลง่าย ซึ่งสำคัญในตึกที่เลี้ยงสัตว์ได้ทุกห้อง',
            en: 'Pale-tone SPC in every unit, 100% virgin material with no recycled content — soft underfoot, sound-absorbing, water- and scratch-resistant, easy to keep. Those qualities matter doubly in a building where every unit welcomes a pet.',
          },
        ],
        [
          { th: 'ผนังภายใน', en: 'Interior walls' },
          {
            th: 'สี Nippon Paint เบอร์ OW 2154P โทนสว่าง สูตร low-VOC กลิ่นน้อย เผื่อจมูกที่ไวของน้องและคนแพ้ง่าย อยากเห็นสีจริงก่อนมาดูห้อง ใช้เบอร์นี้เทียบได้เลย',
            en: 'Nippon Paint OW 2154P, a soft, light tone in a low-VOC formula with little odour, for sensitive pet and human noses. Named exactly as it appears on the tin, should you wish to see the colour before you arrive.',
          },
        ],
        [
          { th: 'ภายนอกตึก', en: 'Exterior' },
          {
            th: 'ทั้งตึกใช้สีชุดเดียว สี่สีเท่านั้น — ผนังหลัก Berry Scent กรอบระเบียงและคาน Sandcastle ลูกกรงเหล็ก Cedarwood มือจับและโคมไฟ Dark Bronze',
            en: 'One palette for the whole building, four colours and nothing beyond — main walls Berry Scent, balcony frames and beams Sandcastle, steel railings Cedarwood, handles and lamps Dark Bronze.',
          },
        ],
        [
          { th: 'บิวท์อิน', en: 'Built-ins' },
          {
            th: 'ลามิเนต HMR มาตรฐาน E1 โทนไม้ธรรมชาติ (HMR ทนความชื้นสูง เหมาะกับอากาศเมืองไทย · E1 ปล่อยฟอร์มัลดีไฮด์ต่ำ)',
            en: 'HMR laminate to E1 standard in a natural wood tone. HMR means high moisture resistance, suited to the Thai climate; E1 means low formaldehyde emission.',
          },
        ],
        [
          { th: 'สวิตช์ไฟ', en: 'Switches' },
          {
            th: 'Schneider AvatarOn A ติดสูง พ้นระยะสัตว์เลี้ยง',
            en: 'Schneider AvatarOn A, mounted high beyond a pet’s reach.',
          },
        ],
        [
          { th: 'ล็อกและน้ำอุ่น', en: 'Locks and hot water' },
          {
            th: 'ประตูล็อกดิจิทัลแบบหลายจุด และเครื่องทำน้ำอุ่นที่มีระบบกันลวก',
            en: 'A multi-point digital door lock, and a water heater with scald protection.',
          },
        ],
        [
          { th: 'ทางเข้าตึก', en: 'Entrance' },
          {
            th: 'ประตูกระจกนิรภัยสองบาน กรอบอะลูมิเนียม กว้างรวม 160 ซม. บานที่เปิดกว้าง 110 ซม. เผื่อวันขนย้าย · ช่องแสงเหนือประตูส่งแสงถึงโถงบันได · ล็อกดิจิทัลเปิดด้วยใบหน้า ลายนิ้วมือ รหัส หรือคีย์การ์ด',
            en: 'Tempered glass in a two-leaf aluminium frame, 160 cm across; the operable leaf opens to 110 cm for moving day. A transom window lets daylight reach the stairwell, and the digital lock reads a face, a fingerprint, a PIN or a key card.',
          },
        ],
        [
          { th: 'กันสาดและไฟ', en: 'Canopy and light' },
          {
            th: 'กันสาดยื่น 1.50 ม. ฝ้าใต้กันสาดกรุวัสดุเทียมโทน Cedarwood ไฟ Warm White 3000K อุณหภูมิแสงเดียวกับทางเดินทุกจุดในตึก',
            en: 'A 1.50 m canopy, its underside in Cedarwood-tone composite, lit at 3000K warm white — the same temperature as every walkway in the building.',
          },
        ],
        [
          { th: 'ราวระเบียง', en: 'Balcony railings' },
          {
            th: 'เหล็กสูง 0.90–1.00 ม. ช่องห่างเพียง 8–10 ซม.',
            en: 'Steel, 0.90–1.00 m high, with gaps of only 8–10 cm.',
          },
        ],
      ],
    },
    {
      type: 'pull',
      text: {
        th: 'วัสดุที่ดี ไม่ได้วัดกันที่วันส่งมอบ แต่วัดกันที่ปีที่ห้า',
        en: 'Good materials are not about looking right on handover day — they have to stay honest in year five.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'อยากให้เจาะลึกวัสดุหรือรายละเอียดชิ้นไหนเพิ่ม บอกเราได้ทาง LINE',
        en: 'A material or detail you would like us to go deeper on? Tell us on LINE.',
      },
    },
  ],
};

export default article;
