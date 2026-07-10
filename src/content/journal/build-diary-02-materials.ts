import type { Article } from '@/data/journalTypes';

const article: Article = {
  slug: 'build-diary-02-materials',
  category: { en: 'Build Diary', th: 'บันทึกการสร้าง' },
  title: {
    en: 'Build Diary #2 — the actual materials, named one by one',
    th: 'Build Diary #2 — วัสดุจริงที่เลือกแล้ว บอกชื่อทีละชิ้น',
  },
  excerpt: {
    en: 'The materials, named plainly — floor, walls, built-ins, and the entrance — with the actual product names and the reasoning behind each choice.',
    th: 'วัสดุจริง บอกชื่อตรงไปตรงมา — พื้น ผนัง บิลต์อิน และทางเข้าตึก พร้อมชื่อผลิตภัณฑ์จริงและเหตุผลเบื้องหลังการเลือกแต่ละชิ้น',
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
        th: 'บันทึกฉบับนี้บอกสิ่งที่ฉบับก่อนเพียงชี้ทางไว้ — วัสดุจริงที่เลือกแล้ว ระบุอย่างตรงไปตรงมา เพราะความโปร่งใสอยู่ที่รายละเอียดซึ่งกล้าเขียนลงกระดาษ ไม่ใช่คำโฆษณาสวยหรู',
        en: 'This entry names what the last one only pointed toward — the actual materials, specified plainly, because transparency lives in the details a builder is willing to commit to paper, not in a slogan.',
      },
    },
    {
      type: 'h2',
      text: { th: 'พื้นและผนัง — โทนอ่อนที่ตั้งใจ', en: 'Floor and walls — a deliberately pale palette' },
    },
    {
      type: 'p',
      text: {
        th: 'พื้นทุกห้องเป็น SPC โทนอ่อน เลือกเพราะทนน้ำ ทนรอยขีดข่วน และดูแลรักษาง่าย คุณสมบัติที่สำคัญเป็นสองเท่าในตึกที่ทุกห้องต้อนรับสัตว์เลี้ยง ผนังภายในใช้สี Nippon Paint เบอร์ OW 2154P โทนสว่างนุ่มนวล ระบุไว้ตรงตามที่ปรากฏบนกระป๋องสี เผื่อคุณอยากเห็นสีจริงก่อนจะมาถึง',
        en: 'Every floor is pale-tone SPC, chosen for its resistance to water and scratches and for how easily it is kept — qualities that matter doubly in a building where every unit welcomes a pet. The interior walls carry Nippon Paint OW 2154P, a soft, light tone, named here exactly as it appears on the tin, should you wish to see the colour for yourself before you arrive.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'ภายนอกตึกใช้จานสีเดียวกันทั้งหลัง — ผนังหลักโทน Berry Scent กรอบระเบียงและคานโทน Sandcastle ลูกกรงเหล็กโทน Cedarwood มือจับและโคมไฟโทน Dark Bronze สี่สีเท่านั้น ไม่มีสีที่ห้า ตึกมักดูสงบกว่าเมื่อจานสีของมันมีวินัย',
        en: 'The exterior draws from one palette for the entire building: the main walls in Berry Scent, balcony frames and beams in Sandcastle, steel railings in Cedarwood, handles and lamps in Dark Bronze. Four colours, and nothing beyond them — a building tends to feel calmer when its palette is disciplined.',
      },
    },
    {
      type: 'h2',
      text: { th: 'บิลต์อินที่เลือกเพราะอากาศที่มันทิ้งไว้', en: 'Built-ins chosen for the air they leave behind' },
    },
    {
      type: 'p',
      text: {
        th: 'เฟอร์นิเจอร์บิลต์อินทั้งหมดเป็นลามิเนต HMR มาตรฐาน E1 โทนไม้ธรรมชาติ HMR หมายถึงทนความชื้นสูง เหมาะกับสภาพอากาศเมืองไทย ส่วน E1 คือมาตรฐานการปล่อยสารฟอร์มัลดีไฮด์ต่ำ พูดง่าย ๆ คืออากาศภายในห้องสะอาดกว่า สำหรับทั้งคุณและสัตว์เลี้ยงที่ใช้เวลาอยู่ในห้องมากกว่าคุณเสียอีก',
        en: 'All built-in furniture is HMR laminate to E1 standard, in a natural wood tone. HMR denotes high moisture resistance, suited to the Thai climate; E1 denotes low formaldehyde emission — plainly put, cleaner air inside the room, for you and for the animal who spends even more hours in it than you do.',
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
        th: 'ประตูทางเข้าหลักเป็นกระจกนิรภัยกรอบอลูมิเนียมสองบาน กว้างรวม 160 ซม. บานที่เปิดใช้งานกว้าง 110 ซม. เผื่อไว้สำหรับวันขนย้ายและเฟอร์นิเจอร์ชิ้นใหญ่ ช่องแสงเหนือประตูนำแสงธรรมชาติเข้าสู่โถงบันได และล็อกดิจิทัลอ่านได้ทั้งใบหน้า ลายนิ้วมือ รหัสผ่าน และคีย์การ์ด',
        en: 'The main entrance is tempered glass set in a two-leaf aluminium frame, 160 cm across; the operable leaf opens to 110 cm, wide enough for moving day and the largest furniture. A transom window above lets daylight reach the stairwell, and the digital lock reads a face, a fingerprint, a PIN, or a key card.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'เหนือประตูมีกันสาดยื่นออกมา 1.50 เมตร ฝ้าใต้กันสาดกรุวัสดุเทียมโทน Cedarwood พร้อมไฟ Warm White 3000K อุณหภูมิแสงเดียวกับทางเดินทุกจุดในตึก ค่ำคืนฝนตก คุณปลดล็อกประตูได้โดยไม่โดนฝนแม้แต่หยดเดียว และไม่ว่าจะกลับถึงตึกเวลาใด แสงที่ต้อนรับคุณก็ยังเป็นแสงอุ่นเดิม ราวระเบียงเป็นเหล็กสูง 0.90–1.00 เมตร ช่องห่างเพียง 8–10 ซม. — เจตนาเดียวกันที่วิ่งผ่านทั้งตึก: อบอุ่น ปลอดภัย และเป็นส่วนตัว เรียงตามลำดับนี้',
        en: 'Above it, a canopy reaches out 1.50 metres, its underside finished in Cedarwood-tone composite and lit at 3000K warm white — the same temperature as every walkway in the building. On a wet evening, the door is unlocked without a drop of rain; at any hour, the light that meets you is the same warm one. Balcony railings stand 0.90–1.00 m, with gaps of only 8–10 cm between them — the same intention carried through the whole building: warmth, safety, and privacy, in that order.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'บันทึกฉบับหน้าจะติดตามความคืบหน้าจริงจากหน้าไซต์ วัสดุหรือรายละเอียดใดที่อยากให้เจาะลึกกว่านี้ แจ้งเราได้ทาง LINE',
        en: 'The next entry follows real progress from the site. A material or detail worth going deeper on is always welcome to raise, on LINE.',
      },
    },
  ],
};

export default article;
