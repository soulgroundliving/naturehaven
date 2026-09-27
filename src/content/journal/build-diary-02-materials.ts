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
    th: 'ความสงบของห้องไม่ได้มาจากการตกแต่ง แต่มาจากสิ่งที่คุณมองไม่เห็น รายการวัสดุจริงฉบับเต็ม บอกชื่อถึงระดับเบอร์สีบนกระป๋อง',
  },
  date: '2026-07-03',
  readMinutes: 3,
  hero: '/assets/design-materials-detail.jpg',
  heroAlt: {
    en: 'Close-up of Nature Haven material palette — pale wood and warm neutrals',
    th: 'ดีเทลวัสดุของ Nature Haven — ไม้โทนอ่อนและสีกลางโทนอบอุ่น',
  },
  blocks: [
    {
      type: 'p',
      text: {
        th: 'ความสงบของห้อง ไม่ได้มาจากการตกแต่ง แต่มาจากสิ่งที่คุณมองไม่เห็น นี่คือฉบับแรกที่บอกชื่อวัสดุจริงที่เลือกใช้ทีละชิ้น',
        en: 'The calm of a room does not come from decoration — it comes from what you cannot see. Here is the real materials, named one by one.',
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
            th: 'SPC โทนอ่อนทุกห้อง เนื้อ virgin 100% ไม่ผสมเนื้อรีไซเคิล — เดินแล้วนุ่ม เก็บเสียง ทนน้ำ ทนรอยขีดข่วน และดูแลง่าย คุณสมบัติที่สำคัญเป็นสองเท่าในตึกที่ทุกห้องต้อนรับสัตว์เลี้ยง',
            en: 'Pale-tone SPC in every unit, 100% virgin material with no recycled content — soft underfoot, sound-absorbing, water- and scratch-resistant, easy to keep. Those qualities matter doubly in a building where every unit welcomes a pet.',
          },
        ],
        [
          { th: 'ผนังภายใน', en: 'Interior walls' },
          {
            th: 'สี Nippon Paint เบอร์ OW 2154P โทนสว่างนุ่มนวล สูตร low-VOC กลิ่นน้อย เผื่อจมูกที่ไวของน้องและคนแพ้ง่าย ระบุตรงตามที่ปรากฏบนกระป๋องสี เผื่ออยากเห็นสีจริงก่อนมาถึง',
            en: 'Nippon Paint OW 2154P, a soft, light tone in a low-VOC formula with little odour, for sensitive pet and human noses. Named exactly as it appears on the tin, should you wish to see the colour before you arrive.',
          },
        ],
        [
          { th: 'ภายนอกตึก', en: 'Exterior' },
          {
            th: 'จานสีเดียวทั้งหลัง สี่สีเท่านั้น — ผนังหลัก Berry Scent, กรอบระเบียงและคาน Sandcastle, ลูกกรงเหล็ก Cedarwood, มือจับและโคมไฟ Dark Bronze ไม่มีสีที่ห้า',
            en: 'One palette for the whole building, four colours and nothing beyond — main walls Berry Scent, balcony frames and beams Sandcastle, steel railings Cedarwood, handles and lamps Dark Bronze.',
          },
        ],
        [
          { th: 'บิลต์อิน', en: 'Built-ins' },
          {
            th: 'ลามิเนต HMR มาตรฐาน E1 โทนไม้ธรรมชาติ HMR คือทนความชื้นสูง เหมาะกับอากาศเมืองไทย E1 คือปล่อยฟอร์มัลดีไฮด์ต่ำ',
            en: 'HMR laminate to E1 standard in a natural wood tone. HMR means high moisture resistance, suited to the Thai climate; E1 means low formaldehyde emission.',
          },
        ],
        [
          { th: 'สวิตช์ไฟ', en: 'Switches' },
          {
            th: 'Schneider AvatarOn A ยกสูงพ้นมือสัตว์เลี้ยง',
            en: 'Schneider AvatarOn A, mounted high beyond a pet’s reach.',
          },
        ],
        [
          { th: 'ล็อกและน้ำอุ่น', en: 'Locks and hot water' },
          {
            th: 'ประตูดิจิทัลล็อกหลายจุด และเครื่องทำน้ำอุ่นที่มีระบบกันลวก',
            en: 'A multi-point digital door lock, and a water heater with scald protection.',
          },
        ],
        [
          { th: 'ทางเข้าตึก', en: 'Entrance' },
          {
            th: 'กระจกนิรภัยกรอบอลูมิเนียมสองบาน กว้างรวม 160 ซม. บานที่เปิดใช้งานกว้าง 110 ซม. เผื่อวันขนย้าย ช่องแสงเหนือประตูนำแสงเข้าโถงบันได ล็อกดิจิทัลอ่านได้ทั้งใบหน้า ลายนิ้วมือ รหัสผ่าน และคีย์การ์ด',
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
        th: 'วัสดุที่ดีไม่ได้แค่สวยวันส่งมอบ — มันต้องซื่อสัตย์กับปีที่ห้า',
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
