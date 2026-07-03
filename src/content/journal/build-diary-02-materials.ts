import type { Article } from '@/data/journalTypes';

const article: Article = {
  slug: 'build-diary-02-materials',
  category: { en: 'Build Diary', th: 'บันทึกการสร้าง' },
  title: {
    en: 'Build Diary #2 — the actual materials, named one by one',
    th: 'Build Diary #2 — วัสดุจริงที่เลือกแล้ว บอกชื่อทีละชิ้น',
  },
  excerpt: {
    en: 'We promised to show the real materials. Here they are — floor, walls, built-ins, and the entrance — with the actual product names and the reasoning behind each choice.',
    th: 'ฉบับที่แล้วเราสัญญาว่าจะพาดูวัสดุจริง — นี่คือรายการทั้งหมด พื้น ผนัง บิลต์อิน และทางเข้าตึก พร้อมชื่อจริงของวัสดุและเหตุผลที่เลือกทีละชิ้น',
  },
  date: '2026-07-03',
  readMinutes: 5,
  hero: '/assets/design-materials-detail.jpg',
  heroAlt: {
    en: 'Close-up of Nature Haven material palette — pale wood and warm neutrals',
    th: 'ดีเทลวัสดุของ Nature Haven — ไม้โทนอ่อนและสีกลางโทนอบอุ่น',
  },
  blocks: [
    {
      type: 'p',
      text: {
        th: 'ในบันทึกฉบับที่แล้ว เราทิ้งท้ายไว้ว่าฉบับหน้าจะพาไปดูวัสดุจริงที่เลือกแล้ว — วันนี้ตามสัญญา และเราตั้งใจบอก "ชื่อจริง" ของทุกอย่าง เพราะเชื่อว่าความโปร่งใสไม่ได้อยู่ที่คำโฆษณา แต่อยู่ที่รายละเอียดที่กล้าเขียนลงกระดาษ',
        en: 'The last entry ended with a promise: next time, the real materials. Today we keep it — and we are naming everything specifically, because we believe transparency lives in the details you are willing to put in writing, not in slogans.',
      },
    },
    {
      type: 'h2',
      text: { th: 'พื้นและผนัง — โทนอ่อนที่ตั้งใจ', en: 'Floor and walls — a deliberately pale palette' },
    },
    {
      type: 'p',
      text: {
        th: 'พื้นทุกห้องเป็น SPC โทนอ่อน — เลือกเพราะทนน้ำ ทนรอยขีดข่วน และดูแลง่าย ซึ่งสำคัญเป็นพิเศษในตึกที่ทุกห้องเลี้ยงสัตว์ได้ ผนังภายในใช้สีโทนสว่าง Nippon Paint เบอร์ OW 2154P — ใช่ เราบอกเบอร์สีเลย ถ้าอยากรู้ว่าห้องคุณจะเป็นสีอะไร ไปเปิดดูได้ทันที',
        en: 'Every floor is pale-tone SPC — chosen for water resistance, scratch resistance, and easy care, which matters twice as much in a building where every unit welcomes pets. Interior walls are Nippon Paint OW 2154P, a soft light tone — yes, that is the actual paint code. If you want to know exactly what colour your room will be, you can look it up right now.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'ภายนอกตึกใช้จานสีเดียวกันทั้งหลัง: ผนังหลักโทน Berry Scent · กรอบระเบียงและคานโทน Sandcastle · ลูกกรงเหล็กโทน Cedarwood · มือจับและโคมไฟโทน Dark Bronze — สี่สี จบ ไม่มีสีที่ห้า ความสงบของตึกเริ่มจากวินัยของจานสี',
        en: 'The exterior uses one palette for the whole building: main walls in Berry Scent · balcony frames and beams in Sandcastle · steel railings in Cedarwood · handles and lamps in Dark Bronze. Four colours, and no fifth. A building feels calm when its palette has discipline.',
      },
    },
    {
      type: 'h2',
      text: { th: 'บิลต์อินที่อากาศในห้องขอบคุณ', en: 'Built-ins your indoor air will thank' },
    },
    {
      type: 'p',
      text: {
        th: 'เฟอร์นิเจอร์บิลต์อินทั้งหมดเป็นลามิเนต HMR มาตรฐาน E1 โทนไม้ธรรมชาติ — HMR คือบอร์ดทนความชื้นสูง เหมาะกับอากาศเมืองไทย ส่วน E1 คือมาตรฐานการปล่อยสารฟอร์มัลดีไฮด์ระดับต่ำ พูดง่าย ๆ คืออากาศในห้องสะอาดกว่า สำหรับทั้งคุณและสัตว์เลี้ยงที่ใช้เวลาในห้องมากกว่าคุณเสียอีก',
        en: 'All built-in furniture is HMR laminate to E1 standard, in a natural wood tone. HMR means high moisture resistance — right for Thai humidity. E1 is the low-formaldehyde emission standard — in plain words, cleaner indoor air, for you and for the animal who spends even more hours in the room than you do.',
      },
    },
    {
      type: 'pull',
      text: {
        th: 'วัสดุที่ดีไม่ได้แค่สวยวันส่งมอบ — มันต้องซื่อสัตย์กับปีที่ห้า',
        en: 'Good materials are not about looking right on handover day — they have to stay honest in year five.',
      },
    },
    {
      type: 'h2',
      text: { th: 'ทางเข้าตึกที่คิดจบแล้ว', en: 'An entrance that has been thought all the way through' },
    },
    {
      type: 'p',
      text: {
        th: 'ประตูทางเข้าหลักเป็นกระจกนิรภัย (tempered) กรอบอลูมิเนียมสองบาน กว้างรวม 160 ซม. — บานเปิดกว้าง 110 ซม. เผื่อวันขนของเข้าหรือเข็นเฟอร์นิเจอร์ชิ้นใหญ่ มีช่องแสงเหนือประตูให้โถงบันไดสว่างด้วยแสงธรรมชาติ ล็อกด้วย Digital Door Lock รองรับสแกนใบหน้า สแกนนิ้ว รหัส และคีย์การ์ด',
        en: 'The main entrance is tempered glass in a two-leaf aluminium frame, 160 cm in total — the operable leaf is 110 cm wide, sized for moving days and large furniture. A transom window above the door lets natural light into the stairwell, and the digital door lock accepts face scan, fingerprint, PIN, and key card.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'เหนือประตูมีกันสาดยื่นออกมา 1.50 เมตร ฝ้าใต้กันสาดกรุไม้เทียมโทน Cedarwood พร้อมไฟ Warm White 3000K — องศาแสงเดียวกับไฟทางเดินทั้งตึก วันฝนตกคุณจะยืนกดล็อกหน้าประตูโดยไม่เปียก และกลับบ้านกี่โมงตึกก็ต้อนรับด้วยแสงอุ่นเสมอ ส่วนราวระเบียงเป็นเหล็กสูง 0.90–1.00 เมตร ซี่ห่างเพียง 8–10 ซม. ตามแนวคิดเดียวกันทั้งตึก: อบอุ่น ปลอดภัย เป็นส่วนตัว',
        en: 'Above the door, a canopy extends 1.50 metres, its underside clad in Cedarwood-tone composite with 3000K warm-white light — the same colour temperature as every walkway in the building. On a rainy day you unlock the door without getting wet, and whatever time you come home, the building greets you in warm light. Balcony railings are steel, 0.90–1.00 m high with gaps of just 8–10 cm — the same idea running through the whole building: warm, safe, private.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'บันทึกฉบับหน้า: ความคืบหน้างานจริงจากหน้าไซต์ ระหว่างนี้ถ้ามีวัสดุหรือดีเทลไหนที่อยากให้เจาะลึก ทักมาทาง LINE ได้เลย — เราอ่านทุกข้อความ',
        en: 'Next entry: real progress from the site. Until then, if there is a material or detail you want us to go deeper on, tell us on LINE — we read everything.',
      },
    },
  ],
};

export default article;
