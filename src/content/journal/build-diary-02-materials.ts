import type { Article } from '@/data/journalTypes';

// Built from our real social post — the six-slide "Quiet by construction"
// carousel (C8) — plus the materials list its last slides promise. The slides
// are typographic cards (origin 'drawing'), copied from the marketing pack as
// WebP under new filenames.
const SLIDES = '/assets/journal/build-diary-02-materials';

const article: Article = {
  slug: 'build-diary-02-materials',
  category: { en: 'Build Diary', th: 'บันทึกการสร้าง' },
  title: {
    en: 'Build Diary #2 — quiet by construction: the real materials, named one by one',
    th: 'Build Diary #2 — ความเงียบที่มาจากโครงสร้าง วัสดุจริง บอกชื่อทีละชิ้น',
  },
  excerpt: {
    en: 'The calm of a room does not come from decoration — it comes from what you cannot see. Six cards from our post, then the full list of real materials, named down to the colour code on the tin.',
    th: 'ความสงบของห้องไม่ได้มาจากการตกแต่ง แต่มาจากสิ่งที่คุณมองไม่เห็น หกใบจากโพสต์ของเรา แล้วตามด้วยรายการวัสดุจริงฉบับเต็ม บอกชื่อถึงระดับเบอร์สีบนกระป๋อง',
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
        th: 'ความสงบของห้อง ไม่ได้มาจากการตกแต่ง แต่มาจากสิ่งที่คุณมองไม่เห็น นี่คือโพสต์ที่พาคุณมาที่นี่ — ปัดดูได้เลย แล้วอ่านรายการวัสดุจริงฉบับเต็มด้านล่าง',
        en: 'The calm of a room does not come from decoration — it comes from what you cannot see. This is the post that brought you here: swipe through it, then read the full list of real materials below.',
      },
    },
    {
      type: 'gallery',
      label: { th: 'โพสต์ความเงียบที่มาจากโครงสร้าง หกสไลด์', en: 'The quiet-by-construction post, six slides' },
      size: 'narrow',
      items: [
        {
          src: `${SLIDES}/materials-1.webp`,
          alt: { th: 'สไลด์ 1 จาก 6: ความเงียบที่มาจากโครงสร้าง — รายละเอียดที่ทำให้การอยู่จริง เงียบและทน', en: 'Slide 1 of 6: Quiet that comes from structure — the details that make everyday living quiet and durable' },
          width: 1080,
          height: 1350,
          origin: 'drawing',
        },
        {
          src: `${SLIDES}/materials-2.webp`,
          alt: { th: 'สไลด์ 2 จาก 6: พื้น SPC เดินแล้วนุ่ม เก็บเสียง และทนต่อการใช้งาน', en: 'Slide 2 of 6: SPC flooring that is soft underfoot, absorbs sound and stands up to daily use' },
          width: 1080,
          height: 1350,
          origin: 'drawing',
        },
        {
          src: `${SLIDES}/materials-3.webp`,
          alt: { th: 'สไลด์ 3 จาก 6: สีทาผนัง low-VOC กลิ่นน้อย เผื่อจมูกที่ไวของน้องและคนแพ้ง่าย', en: 'Slide 3 of 6: Low-VOC wall paint with little odour, for sensitive pet and human noses' },
          width: 1080,
          height: 1350,
          origin: 'drawing',
        },
        {
          src: `${SLIDES}/materials-4.webp`,
          alt: { th: 'สไลด์ 4 จาก 6: ล็อกหลายจุด น้ำอุ่นกันลวก — ประตูดิจิทัลล็อกหลายจุด และเครื่องทำน้ำอุ่นที่มีระบบกันลวก', en: 'Slide 4 of 6: Multi-point locks and a scald-safe water heater' },
          width: 1080,
          height: 1350,
          origin: 'drawing',
        },
        {
          src: `${SLIDES}/materials-5.webp`,
          alt: { th: 'สไลด์ 5 จาก 6: บอกชื่อวัสดุจริงทีละชิ้น — ฉบับเต็มบนเว็บระบุวัสดุจริงถึงระดับเบอร์สีบนกระป๋อง', en: 'Slide 5 of 6: Real materials, named one by one — the full version on the site names them down to the colour code on the tin' },
          width: 1080,
          height: 1350,
          origin: 'drawing',
        },
        {
          src: `${SLIDES}/materials-6.webp`,
          alt: { th: 'สไลด์ 6 จาก 6: อ่านฉบับเต็มใน Journal — พื้น ผนัง บิลต์อิน ทางเข้าตึก พร้อมเหตุผลเบื้องหลังการเลือกทุกชิ้น', en: 'Slide 6 of 6: Read the full version in the Journal — floor, walls, built-ins, the entrance, with the reasoning behind every choice' },
          width: 1080,
          height: 1350,
          origin: 'drawing',
        },
      ],
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
