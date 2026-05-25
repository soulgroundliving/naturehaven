import type { Lang } from '@/contexts/LanguageContext';

type T = { en: string; th: string };
function pick(t: T, lang: Lang): string { return t[lang]; }
export { pick };

export const TR = {
  nav: {
    links: {
      en: ['PHILOSOPHY', 'RESIDENCES', 'AMENITIES', 'LOCATION', 'DESIGN', 'FAQ', 'CONTACT'],
      th: ['ปรัชญา', 'ห้องพัก', 'สิ่งอำนวย', 'ทำเล', 'ดีไซน์', 'คำถาม', 'ติดต่อ'],
    },
  },
  hero: {
    labelWords: {
      en: ['Lite', 'Service', 'Apartment', '·', 'Saimai,', 'Bangkok'],
      th: ['ที่พักระดับ', 'พรีเมียม', '·', 'สายไหม,', 'กรุงเทพฯ'],
    },
    subtitle: {
      en: 'A residence shaped by intention — where life gently returns to its natural rhythm.',
      th: 'ที่พักที่ออกแบบด้วยเจตนา — ที่ซึ่งชีวิตค่อยๆ กลับคืนสู่จังหวะธรรมชาติ',
    },
    cta: {
      en: 'From 7,000 THB / mo · Available August 2026',
      th: 'เริ่มต้น 7,000 บาท / เดือน · พร้อมเข้าอยู่ สิงหาคม 2569',
    },
    scroll: { en: 'Scroll to explore', th: 'เลื่อนเพื่อสำรวจ' },
  },
  about: {
    philosophyLabel: { en: 'Our Philosophy', th: 'ปรัชญาของเรา' },
    philosophyHeadline: {
      en: 'True comfort is\nnever excessive.',
      th: 'ความสุขที่แท้จริง\nไม่เคยเกินพอดี',
    },
    philosophyBody: {
      en: 'It is found in stillness — in spaces that are thoughtfully designed, and in a quiet balance that allows each day to unfold with ease.',
      th: 'มันอยู่ในความสงบ — ในพื้นที่ที่ออกแบบมาอย่างใส่ใจ และในความสมดุลที่เงียบงาม ที่ให้ทุกวันดำเนินไปอย่างราบรื่น',
    },
    aboutLabel: { en: 'About', th: 'เกี่ยวกับเรา' },
    aboutHeadline: {
      en: 'A newly built private\nresidence inspired\nby MUJI minimal living.',
      th: 'ที่พักส่วนตัวสร้างใหม่\nได้รับแรงบันดาลใจจาก\nการใช้ชีวิตแบบมินิมอล',
    },
    aboutBody: {
      en: 'Designed for calm, crafted for privacy, and quietly connected to Sai Mai Road. Available from August 2026.',
      th: 'ออกแบบเพื่อความสงบ สร้างเพื่อความเป็นส่วนตัว และเชื่อมต่อกับถนนสายไหมอย่างเงียบงาม พร้อมเข้าอยู่สิงหาคม 2569',
    },
    aboutButton: { en: 'View Residences', th: 'ดูห้องพัก' },
  },
  residences: {
    sectionLabel: { en: 'Residences', th: 'ห้องพัก' },
    sectionHeadline: {
      en: 'Spaces designed for real living — comfortable, intentional, and meant to last.',
      th: 'พื้นที่ที่ออกแบบมาเพื่อการใช้ชีวิตจริง — สะดวกสบาย ตั้งใจ และยั่งยืน',
    },
    suitableForTitle: { en: 'Suitable For', th: 'เหมาะสำหรับ' },
    suitableFor: {
      en: ['1–2 residents', 'Working professionals', 'Couples', 'Those who value quiet living'],
      th: ['1–2 คน', 'คนทำงาน', 'คู่รัก', 'ผู้ที่รักความสงบ'],
    },
    spaceTitle: { en: 'Space & Layout', th: 'พื้นที่และผังห้อง' },
    sqm: { en: 'sq.m.', th: 'ตร.ม.' },
    bedroom: { en: '1 Bedroom / 1 Bathroom', th: '1 ห้องนอน / 1 ห้องน้ำ' },
    kitchen: { en: 'Separate kitchen with balcony', th: 'ครัวแยก พร้อมระเบียง' },
    unitsTotal: { en: 'units total', th: 'ยูนิตรวม' },
    floors: { en: 'floors', th: 'ชั้น' },
    termsTitle: { en: 'Terms', th: 'เงื่อนไข' },
    contractLabel: { en: 'Contract', th: 'สัญญา' },
    contractValue: { en: 'Annual (12 months)', th: 'รายปี (12 เดือน)' },
    moveinLabel: { en: 'Move-in', th: 'เข้าอยู่' },
    moveinValue: { en: '1-month deposit + 1-month advance', th: 'มัดจำ 1 เดือน + ล่วงหน้า 1 เดือน' },
    availableLabel: { en: 'Available from', th: 'พร้อมเข้าอยู่' },
    availableValue: { en: 'August 2026', th: 'สิงหาคม 2569' },
    allinclusive: {
      en: 'All-inclusive — amenities, Wi-Fi, cleaning & A/C service covered in monthly rate.',
      th: 'ราคาเดียวครบ — รวมสิ่งอำนวยความสะดวก, Wi-Fi, ทำความสะอาด และล้างแอร์',
    },
    pricingLabel: { en: 'Pricing', th: 'ราคา' },
    pricingNote: { en: 'Opening rate · August 2026 · 20 units', th: 'ราคาเปิดตัว · สิงหาคม 2569 · 20 ยูนิต' },
    openingRate: { en: 'Opening Rate', th: 'ราคาเปิดตัว' },
    tierFloors1: { en: 'Floors 1–2', th: 'ชั้น 1–2' },
    tierFloors2: { en: 'Floors 3–4', th: 'ชั้น 3–4' },
    tierNameStd: { en: 'Standard', th: 'มาตรฐาน' },
    tierNamePet: { en: 'Pet Friendly', th: 'เลี้ยงสัตว์ได้' },
    tierUnitsLabel: { en: 'Units available', th: 'จำนวนห้อง' },
    tierLocationLabel: { en: 'Location', th: 'ตำแหน่ง' },
    tierLocation1: { en: 'Ground & second floor', th: 'ชั้น 1 และ 2' },
    tierLocation2: { en: 'Third & fourth floor', th: 'ชั้น 3 และ 4' },
    tierPetsLabel: { en: 'Pets', th: 'สัตว์เลี้ยง' },
    tierPetsValue: { en: 'Small pets welcome (1–2 per unit)', th: 'รับสัตว์เลี้ยงขนาดเล็ก (1–2 ตัว)' },
    ctaLabel: { en: 'Ready to make it yours?', th: 'พร้อมจองห้องของคุณแล้วหรือยัง?' },
    ctaButton: { en: 'Reserve a Unit', th: 'จองห้องพัก' },
    galleryBedroom: { en: 'Bedroom', th: 'ห้องนอน' },
    galleryBathroom: { en: 'Bathroom', th: 'ห้องน้ำ' },
    galleryKitchen: { en: 'Kitchen', th: 'ครัว' },
    galleryBalcony: { en: 'Balcony', th: 'ระเบียง' },
    essentialsTitle: { en: 'In-Room Essentials', th: 'สิ่งที่มาพร้อมในห้อง' },
    essentialsSub: { en: 'Every element is selected with purpose.', th: 'ทุกองค์ประกอบคัดสรรด้วยความตั้งใจ' },
    essentials: {
      en: [
        'Built-in furniture (functional & minimal)',
        '5 ft bed with ergonomic mattress',
        'Work desk / wardrobe / shelving / chair',
        'Full-length mirror',
        'Air conditioner',
        'Refrigerator & microwave',
        'Water heater',
        'Full blackout curtains',
        'Air ventilation system',
      ],
      th: [
        'เฟอร์นิเจอร์บิลต์อิน (ใช้งานได้จริง มินิมอล)',
        'เตียง 5 ฟุต พร้อมที่นอน Ergonomic',
        'โต๊ะทำงาน / ตู้เสื้อผ้า / ชั้นวาง / เก้าอี้',
        'กระจกบานใหญ่',
        'เครื่องปรับอากาศ',
        'ตู้เย็น & ไมโครเวฟ',
        'เครื่องทำน้ำอุ่น',
        'ม่านบังแสงสมบูรณ์',
        'ระบบระบายอากาศ',
      ],
    },
  },
  amenities: {
    sectionLabel: { en: 'Amenities', th: 'สิ่งอำนวยความสะดวก' },
    headline: {
      en: 'Everything in place,\nbefore you arrive.',
      th: 'ทุกอย่างพร้อมแล้ว\nก่อนที่คุณจะมาถึง',
    },
    subtext: {
      en: 'Every item below is included in your monthly rate — nothing hidden, nothing extra.',
      th: 'ทุกอย่างรวมอยู่ในค่าเช่ารายเดือน — ไม่มีค่าใช้จ่ายซ่อน ไม่มีค่าเพิ่มเติม',
    },
    scrollHint: { en: 'Scroll', th: 'เลื่อน' },
    items: {
      en: [
        { label: 'Parking', desc: 'One dedicated bay per unit — no searching, no waiting.' },
        { label: 'Pocket Garden', desc: 'A communal garden to slow down in. Green, quiet, yours.' },
        { label: 'Laundry & Drying', desc: 'On-site facility, clean and always available.' },
        { label: 'Cleaning Service', desc: 'Common areas professionally maintained every six months.' },
        { label: 'A/C Maintenance', desc: 'Serviced annually — no extra cost, no surprises.' },
      ],
      th: [
        { label: 'ที่จอดรถ', desc: 'ที่จอดรถประจำห้อง — ไม่ต้องหา ไม่ต้องรอ' },
        { label: 'สวนกระเป๋า', desc: 'สวนส่วนกลาง — สีเขียว สงบ เป็นของคุณ' },
        { label: 'ซักผ้า & ตากผ้า', desc: 'สิ่งอำนวยความสะดวกในอาคาร สะอาด พร้อมใช้เสมอ' },
        { label: 'บริการทำความสะอาด', desc: 'ทำความสะอาดพื้นที่ส่วนกลางโดยมืออาชีพทุก 6 เดือน' },
        { label: 'บริการล้างแอร์', desc: 'ล้างแอร์ปีละครั้ง — ไม่มีค่าใช้จ่ายเพิ่ม ไม่มีเซอร์ไพร์ส์' },
      ],
    },
    ctaTag: { en: 'All included', th: 'รวมทุกอย่าง' },
    ctaHeadline: { en: 'Ready when\nyou are.', th: 'พร้อมเมื่อ\nคุณพร้อม' },
    ctaBody: {
      en: 'Reserve your unit and move in knowing every detail has already been handled.',
      th: 'จองห้องพักและย้ายเข้าอยู่ โดยรู้ว่าทุกรายละเอียดได้รับการดูแลแล้ว',
    },
    ctaButton: { en: 'Reserve a Unit', th: 'จองห้องพัก' },
  },
  location: {
    sectionLabel: { en: 'Location', th: 'ที่ตั้ง' },
    sectionHeadline: {
      en: 'Set in a peaceful neighborhood — yet effortlessly close to everyday essentials.',
      th: 'ตั้งอยู่ในย่านสงบ — แต่ใกล้ชิดกับสิ่งอำนวยความสะดวกในชีวิตประจำวัน',
    },
    nearbyTitle: { en: 'Nearby Essentials', th: 'สถานที่ใกล้เคียง' },
    lifestyleTitle: { en: 'Lifestyle Surroundings', th: 'ห้างร้านและตลาดรอบข้าง' },
  },
  design: {
    sectionLabel: { en: 'Design & Architecture', th: 'การออกแบบและสถาปัตยกรรม' },
    sectionHeadline: {
      en: 'Designed with intention. Built for calm.',
      th: 'ออกแบบด้วยเจตนา สร้างเพื่อความสงบ',
    },
    materialsTitle: { en: 'Design & Materials', th: 'ดีไซน์และวัสดุ' },
    materialsSub: { en: 'Every material chosen with care.', th: 'ทุกวัสดุคัดสรรอย่างใส่ใจ' },
    materials: {
      en: [
        'SPC flooring — light tone, soft contrast with furniture',
        'Soft light wall palette (Nippon Paint OW 2154P)',
        'Built-in HMR E1 laminate — natural wood tone',
        'Modern switch design',
      ],
      th: [
        'พื้น SPC — โทนอ่อน ตัดกับเฟอร์นิเจอร์อย่างนุ่มนวล',
        'สีผนังโทนสว่าง (Nippon Paint OW 2154P)',
        'เฟอร์นิเจอร์บิลต์อิน HMR E1 ลามิเนต — โทนไม้ธรรมชาติ',
        'สวิตช์ดีไซน์โมเดิร์น',
      ],
    },
    archTitle: { en: 'Architecture & Living Concept', th: 'แนวคิดสถาปัตยกรรมและการอยู่อาศัย' },
    archSpecs: {
      en: [
        '20-unit low-rise residence (no elevator)',
        'North–South airflow optimization',
        'Ergonomic layout planning',
        'Sky Hook feature for vertical utility use',
      ],
      th: [
        'อาคารพักอาศัย 20 ยูนิต ไม่สูง (ไม่มีลิฟต์)',
        'ออกแบบให้อากาศถ่ายเทในแนวเหนือ–ใต้',
        'การวางผังห้องตามหลักสรีรศาสตร์',
        'ฟีเจอร์ Sky Hook สำหรับการใช้งานแนวตั้ง',
      ],
    },
  },
  smart: {
    leftLabel: { en: 'Quietly Connected', th: 'เชื่อมต่ออย่างเงียบงาม' },
    leftHeadline: {
      en: 'Managed simply,\nthrough one\napplication.',
      th: 'จัดการง่าย\nผ่านแอป\nเดียว',
    },
    leftBody: {
      en: 'Smart Living gathers everything you might ever need — bookings, payments, maintenance, even the air around you — into a single quiet surface.',
      th: 'Smart Living รวบรวมทุกสิ่งที่คุณต้องการ — การจอง การชำระเงิน การแจ้งซ่อม แม้แต่อากาศรอบข้าง — ไว้ในพื้นที่เดียวที่เงียบงาม',
    },
    features: {
      en: [
        { label: 'Digital door lock', sub: 'Unit & building' },
        { label: 'CCTV security', sub: '24/7 monitoring' },
        { label: 'Free Wi-Fi', sub: 'AIS Fiber' },
      ],
      th: [
        { label: 'ดิจิทัลล็อค์', sub: 'ยูนิตและอาคาร' },
        { label: 'กล้องวงจรปิด', sub: 'ตรวจจับตลอด 24 ชม.' },
        { label: 'Wi-Fi ฟรี', sub: 'AIS Fiber' },
      ],
    },
    appLabel: { en: 'Also in-app', th: 'ในแอปยังมี' },
    appFeatures: {
      en: [
        { label: 'Bookings', sub: 'Common spaces' },
        { label: 'Payments', sub: 'Auto · LINE Pay' },
        { label: 'Maintenance', sub: 'Request anytime' },
        { label: 'Pet records', sub: 'Vaccination history' },
      ],
      th: [
        { label: 'จองพื้นที่', sub: 'พื้นที่ส่วนกลาง' },
        { label: 'ชำระเงิน', sub: 'Auto · LINE Pay' },
        { label: 'แจ้งซ่อม', sub: 'แจ้งได้ทุกเมื่อ' },
        { label: 'บันทึกสัตว์เลี้ยง', sub: 'ประวัติวัคซีน' },
      ],
    },
    rightLabel: { en: 'Sustainable by Intention', th: 'ยั่งยืนโดยเจตนา' },
    rightHeadline: {
      en: 'Built to last —\nnot to impress.',
      th: 'สร้างเพื่อความยั่งยืน —\nไม่ใช่เพื่อโชว์',
    },
    sustainable: {
      en: [
        { title: 'Solar energy integration', body: "Rooftop solar offsets common-area power, reducing the building's footprint year-round." },
        { title: 'Energy-conscious design', body: 'Cross-ventilation, blackout curtains and inverter cooling — designed to use less from day one.' },
        { title: 'Long-term material durability', body: 'Selected for how they age — quietly, without losing their character.' },
      ],
      th: [
        { title: 'ใช้พลังงานโซลาร์', body: 'โซลาร์เซลล์บนหลังคาช่วยลดการใช้ไฟฟ้าในพื้นที่ส่วนกลาง ลดรอยเท้าคาร์บอนตลอดปี' },
        { title: 'ดีไซน์ประหยัดพลังงาน', body: 'การระบายอากาศไขว้ ม่านบังแสง และแอร์อินเวอร์เตอร์ — ออกแบบมาให้ใช้ไฟน้อยตั้งแต่วันแรก' },
        { title: 'ความทนทานของวัสดุในระยะยาว', body: 'คัดเลือกตามวิธีที่มันจะเก่าอย่างงดงาม — โดยไม่สูญเสน่ห์' },
      ],
    },
  },
  testimonials: {
    sectionLabel: { en: 'Residents', th: 'ผู้อยู่อาศัย' },
    sectionHeadline: { en: 'Life inside Nature Haven.', th: 'ชีวิตใน Nature Haven' },
  },
  invitation: {
    label: { en: 'A Gentle Invitation', th: 'คำเชิญที่อ่อนโยน' },
    lines: {
      en: ['Nature Haven', 'is not made for everyone.', 'It is for those', 'who know what matters—', 'and choose to live with it.'],
      th: ['Nature Haven', 'ไม่ได้สร้างมาสำหรับทุกคน', 'มันสร้างมาเพื่อผู้ที่', 'รู้ว่าอะไรสำคัญ—', 'และเลือกที่จะอยู่กับมัน'],
    },
  },
  faq: {
    sectionLabel: { en: 'FAQ', th: 'คำถาม' },
    headline: { en: 'Frequently Asked Questions', th: 'คำถามที่พบบ่อย' },
  },
  contact: {
    sectionLabel: { en: 'Contact', th: 'ติดต่อ' },
    headline: { en: 'Reserve your space quietly.', th: 'จองพื้นที่ของคุณอย่างเงียบๆ' },
    steps: {
      en: [
        { num: '01', title: 'Explore', body: 'Browse the residences. Decide if Nature Haven is the right fit.' },
        { num: '02', title: 'Reach out', body: "Message us on LINE. We'll answer questions and arrange a viewing." },
        { num: '03', title: 'Reserve', body: 'Pay the deposit via PromptPay to hold your unit.' },
        { num: '04', title: 'Move in', body: 'Sign the lease. Residences open from August 2026.' },
      ],
      th: [
        { num: '01', title: 'สำรวจ', body: 'ดูห้องพัก ตัดสินใจว่า Nature Haven เหมาะกับคุณไหม' },
        { num: '02', title: 'ติดต่อ', body: 'ส่งข้อความทาง LINE เราจะตอบคำถามและนัดชมห้อง' },
        { num: '03', title: 'จอง', body: 'ชำระมัดจำผ่าน PromptPay เพื่อยึดห้องของคุณ' },
        { num: '04', title: 'ย้ายเข้า', body: 'เซ็นสัญญา พร้อมเข้าอยู่สิงหาคม 2569' },
      ],
    },
    lineNote: { en: 'We answer fastest on LINE.', th: 'เราตอบเร็วที่สุดทาง LINE' },
  },
  footer: {
    headline: { en: 'Nature Haven — Quiet Living in Saimai', th: 'Nature Haven — ที่พักเงียบสงบในสายไหม' },
    sub: { en: 'A residence shaped by intention.', th: 'ที่พักที่ออกแบบด้วยเจตนา' },
    copyright: { en: '© 2026 Nature Haven. All rights reserved.', th: '© 2569 Nature Haven สงวนสิทธิ์ทั้งหมด' },
  },
} as const;
