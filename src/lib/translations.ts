import type { Lang } from '@/contexts/LanguageContext';

type T = { en: string; th: string };
function pick(t: T, lang: Lang): string { return t[lang]; }
export { pick };

export const TR = {
  nav: {
    links: {
      en: ['PHILOSOPHY', 'LOOKBOOK', 'RESIDENCES', 'AMENITIES', 'JOURNAL', 'LOCATION', 'CONTACT'],
      th: ['ปรัชญา', 'คอลเลกชัน', 'ห้องพัก', 'สิ่งอำนวย', 'บันทึก', 'ทำเล', 'ติดต่อ'],
    },
  },
  cta: {
    mobileBar: {
      en: 'Request Private Viewing · LINE',
      th: 'นัดชมห้องส่วนตัว · ทัก LINE',
    },
  },
  links: {
    subtitle: { en: 'Every way to reach us, in one place', th: 'รวมทุกช่องทางไว้ที่เดียว' },
    pageDescription: {
      en: 'All Nature Haven channels — LINE, the Journal, the site, and directions — in one link.',
      th: 'รวมทุกช่องทางของ Nature Haven — LINE, บันทึกจากเฮเวน, เว็บไซต์ และแผนที่ — ไว้ในลิงก์เดียว',
    },
    line: { en: 'Chat on LINE', th: 'ทักไลน์' },
    lineSub: { en: 'Reserve a viewing · ask us anything', th: 'นัดชมห้อง · ถามอะไรก็ได้' },
    instagram: { en: 'Follow on Instagram', th: 'ติดตามใน Instagram' },
    instagramSub: { en: '@naturehaven_official', th: '@naturehaven_official' },
    facebook: { en: 'Follow on Facebook', th: 'ติดตามใน Facebook' },
    facebookSub: { en: 'Nature Haven สายไหม', th: 'Nature Haven สายไหม' },
    tiktok: { en: 'Follow on TikTok', th: 'ติดตามใน TikTok' },
    tiktokSub: { en: '@nature.haven9', th: '@nature.haven9' },
    journal: { en: 'The Haven Journal', th: 'บันทึกจากเฮเวน' },
    journalSub: { en: 'Stories from the build', th: 'เรื่องเล่าระหว่างสร้าง' },
    home: { en: 'Nature Haven — full site', th: 'เว็บไซต์ Nature Haven' },
    homeSub: { en: 'Rooms, pricing, amenities', th: 'ห้องพัก ราคา สิ่งอำนวยความสะดวก' },
    maps: { en: 'Get directions', th: 'ดูแผนที่ / นำทาง' },
    mapsSub: { en: 'Sai Mai, Bangkok', th: 'สายไหม กรุงเทพฯ' },
  },
  journal: {
    navLabel: { en: 'Journal', th: 'บันทึกจากเฮเวน' },
    sectionLabel: { en: 'The Haven Journal', th: 'บันทึกจากเฮเวน' },
    sectionHeadline: {
      en: 'Notes on quiet living,\nwritten while we build',
      th: 'เรื่องเล่าการอยู่อย่างสงบ\nเขียนไประหว่างสร้างไป',
    },
    indexIntro: {
      en: 'Stories from the making of Nature Haven — quiet living, life with pets, the neighbourhood, and honest build diaries on the road to September 2026.',
      th: 'เรื่องเล่าระหว่างการสร้าง Nature Haven — การอยู่อย่างสงบ ชีวิตกับสัตว์เลี้ยง ย่านสายไหม และบันทึกการสร้างแบบตรงไปตรงมา จนถึงกันยายน 2026',
    },
    readAll: { en: 'Read all stories', th: 'อ่านบทความทั้งหมด' },
    readMin: { en: 'min read', th: 'นาที' },
    byLine: { en: 'By the Nature Haven team', th: 'โดยทีม Nature Haven' },
    backHome: { en: 'Home', th: 'หน้าแรก' },
    related: { en: 'More from the Journal', th: 'บทความอื่นจากบันทึก' },
    ctaTitle: { en: 'Want to see the space in person?', th: 'อยากเห็นห้องจริงไหม?' },
    ctaBody: {
      en: 'Reserve a viewing via LINE — opening September 2026.',
      th: 'นัดชมห้องตัวอย่างผ่าน LINE — เปิดให้เข้าอยู่กันยายน 2026',
    },
    ctaButton: { en: 'Chat on LINE', th: 'ทักไลน์เลย' },
    share: {
      label: { en: 'Share', th: 'แชร์' },
      copyLink: { en: 'Copy link', th: 'คัดลอกลิงก์' },
      copied: { en: 'Copied!', th: 'คัดลอกแล้ว' },
    },
  },
  lookbook: {
    sectionLabel: { en: 'The Architectural Lookbook', th: 'The Architectural Lookbook' },
    sectionHeadline: {
      en: 'Five collections\nof thoughtfulness.',
      th: 'ห้าคอลเลกชัน\nแห่งความใส่ใจ',
    },
    intro: {
      en: 'Not a spec sheet — a lookbook. Every considered detail of the residence, arranged as five small collections you can wander through, one at a time.',
      th: 'เราไม่เล่าด้วยตารางสเปกยาว ๆ แต่เรียงความใส่ใจทั้งหมดไว้เป็นห้าคอลเลกชันเล็ก ๆ ให้คุณค่อย ๆ เปิดดูทีละเรื่อง',
    },
    collectionWord: { en: 'Collection', th: 'คอลเลกชัน' },
    openCollection: { en: 'View the collection', th: 'เปิดดูคอลเลกชัน' },
    backToLookbook: { en: 'The Lookbook', th: 'The Lookbook' },
    prevCollection: { en: 'Previous', th: 'ก่อนหน้า' },
    nextCollection: { en: 'Next collection', th: 'คอลเลกชันถัดไป' },
    detailsWord: { en: 'The details', th: 'รายละเอียดทั้งหมด' },
    ctaTitle: { en: 'See these details in person', th: 'อยากเห็นรายละเอียดเหล่านี้ด้วยตาตัวเอง?' },
    ctaBody: {
      en: 'Private viewings by appointment — message us on LINE.',
      th: 'เปิดชมห้องแบบส่วนตัวตามนัดหมาย — ทักเราทาง LINE ได้เลย',
    },
    ctaButton: { en: 'Request Private Viewing', th: 'นัดชมห้องส่วนตัว' },
  },
  hero: {
    labelWords: {
      en: ['A', 'Quiet', 'Luxury', 'Residence', '·', 'Pet-Friendly', '·', 'Saimai,', 'Bangkok'],
      th: ['Quiet', 'Luxury', 'Residence', '·', 'เลี้ยงสัตว์ได้ทั้งตึก', '·', 'สายไหม,', 'กรุงเทพฯ'],
    },
    subtitle: {
      en: 'A residence shaped by intention — where life, and the ones you love, gently return to a natural rhythm.',
      th: 'ที่พักที่ออกแบบด้วยเจตนา — ที่ซึ่งชีวิตและสัตว์เลี้ยงที่คุณรักค่อยๆ กลับคืนสู่จังหวะธรรมชาติ',
    },
    cta: {
      en: 'Private viewings by appointment · Opening September 2026',
      th: 'เปิดชมห้องส่วนตัวตามนัดหมาย · พร้อมเข้าอยู่ กันยายน 2569',
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
      en: 'Designed for calm, crafted for privacy, and quietly connected to Sai Mai Road. Available from September 2026.',
      th: 'ออกแบบเพื่อความสงบ สร้างเพื่อความเป็นส่วนตัว และเชื่อมต่อกับถนนสายไหมอย่างเงียบงาม พร้อมเข้าอยู่กันยายน 2569',
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
    kitchen: { en: 'Kitchenette + sink on the balcony', th: 'มุมครัวในตัว + ซิงก์ที่ระเบียง' },
    unitsTotal: { en: 'units total', th: 'ยูนิตรวม' },
    floors: { en: 'floors', th: 'ชั้น' },
    termsTitle: { en: 'Terms', th: 'เงื่อนไข' },
    contractLabel: { en: 'Contract', th: 'สัญญา' },
    contractValue: { en: 'Annual (12 months)', th: 'รายปี (12 เดือน)' },
    moveinLabel: { en: 'Move-in', th: 'เข้าอยู่' },
    moveinValue: { en: '1-month deposit + 1-month advance', th: 'มัดจำ 1 เดือน + ล่วงหน้า 1 เดือน' },
    availableLabel: { en: 'Available from', th: 'พร้อมเข้าอยู่' },
    availableValue: { en: 'September 2026', th: 'กันยายน 2569' },
    allinclusive: {
      en: 'All-inclusive — amenities, Wi-Fi, cleaning & A/C service covered in monthly rate.',
      th: 'ราคาเดียวครบ — รวมสิ่งอำนวยความสะดวก, Wi-Fi, ทำความสะอาด และล้างแอร์',
    },
    pricingLabel: { en: 'Pricing', th: 'ราคา' },
    pricingNote: { en: 'Opening rates · shared privately via LINE', th: 'ราคาเปิดตัว · แจ้งแบบส่วนตัวทาง LINE' },
    privateBody: {
      en: 'Current rates, floor availability and opening offers are shared privately — message us on LINE and we will arrange a viewing around your schedule.',
      th: 'ราคาแต่ละชั้น ห้องที่ว่าง และข้อเสนอช่วงเปิดตัว เราแจ้งให้แบบส่วนตัว — ทัก LINE แล้วเรานัดเวลาเข้าชมห้องตามที่คุณสะดวก',
    },
    openingRate: { en: 'Opening Rate', th: 'ราคาเปิดตัว' },
    petsEverywhere: { en: 'Pet-friendly — the whole building', th: 'เลี้ยงสัตว์ได้ทั้งตึก ไม่จำกัดชั้น' },
    petsEverywhereSub: { en: 'No floor restrictions — small pets (1–2 per unit) welcome in every home, on every floor.', th: 'ไม่กำหนดว่าชั้นไหน — ทุกห้องทุกชั้นรับสัตว์เลี้ยงขนาดเล็ก 1–2 ตัวต่อห้อง' },
    floorWord: { en: 'Floor', th: 'ชั้น' },
    fromLabel: { en: 'From', th: 'เริ่มต้น' },
    tierCta: { en: 'Book a viewing', th: 'นัดชมห้อง' },
    unitsPerFloor: { en: '5 units', th: '5 ห้อง' },
    ctaLabel: { en: 'Ready to see it in person?', th: 'อยากเห็นห้องจริงด้วยตาตัวเอง?' },
    ctaButton: { en: 'Request Private Viewing', th: 'นัดชมห้องส่วนตัว' },
    galleryBedroom: { en: 'Bedroom', th: 'ห้องนอน' },
    galleryBathroom: { en: 'Bathroom', th: 'ห้องน้ำ' },
    galleryKitchen: { en: 'Kitchen', th: 'ครัว' },
    galleryBalcony: { en: 'Balcony', th: 'ระเบียง' },
    essentialsTitle: { en: 'In-Room Essentials', th: 'สิ่งที่มาพร้อมในห้อง' },
    essentialsSub: { en: 'Every element is selected with purpose.', th: 'ทุกองค์ประกอบคัดสรรด้วยความตั้งใจ' },
    essentials: {
      en: [
        'Formica built-ins throughout (soft-close)',
        'Sleep Happy 10″ pocket-spring mattress — 5-star hotel grade',
        'Work desk / wardrobe / shelving / chair',
        'Full-length mirror',
        'Air conditioner',
        'Refrigerator & microwave',
        'Water heater',
        'Full blackout curtains',
        'Air ventilation system',
      ],
      th: [
        'เฟอร์นิเจอร์บิ้วอิน Formica ทั้งห้อง (soft-close)',
        'ที่นอน Sleep Happy Pocket Spring 10 นิ้ว — มาตรฐานโรงแรม 5 ดาว',
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
        { label: 'Parking', desc: 'One covered bay per residence — no searching, no waiting.' },
        { label: 'Pocket Garden', desc: 'A communal garden to slow down in. Green, quiet, yours.' },
        { label: 'Laundry & Dryer', desc: 'Washers and dryers on site, with a drinking-water refill station.' },
        { label: 'Cleaning Service', desc: 'Common areas professionally maintained every six months.' },
        { label: 'A/C Maintenance', desc: 'Serviced annually — no extra cost, no surprises.' },
      ],
      th: [
        { label: 'ที่จอดรถ', desc: 'ที่จอดมีหลังคา ประจำห้องละ 1 คัน — ไม่ต้องหา ไม่ต้องรอ' },
        { label: 'สวนกระเป๋า', desc: 'สวนส่วนกลาง — สีเขียว สงบ เป็นของคุณ' },
        { label: 'ซักผ้า & อบผ้า', desc: 'เครื่องซักและเครื่องอบในอาคาร พร้อมจุดเติมน้ำดื่ม' },
        { label: 'บริการทำความสะอาด', desc: 'ทำความสะอาดพื้นที่ส่วนกลางโดยมืออาชีพทุก 6 เดือน' },
        { label: 'บริการล้างแอร์', desc: 'ล้างแอร์ปีละครั้ง — ไม่มีค่าใช้จ่ายเพิ่ม ไม่มีเซอร์ไพร์ส์' },
      ],
    },
    ctaTag: { en: 'All included', th: 'รวมทุกอย่าง' },
    ctaHeadline: { en: 'Ready when\nyou are.', th: 'พร้อมเมื่อ\nคุณพร้อม' },
    ctaBody: {
      en: 'Come see it in person — every detail here has already been handled.',
      th: 'มาเห็นด้วยตาตัวเอง — ทุกรายละเอียดที่นี่ได้รับการดูแลไว้แล้ว',
    },
    ctaButton: { en: 'Request Private Viewing', th: 'นัดชมห้องส่วนตัว' },
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
  smart: {
    leftLabel: { en: 'Quietly Connected', th: 'เชื่อมต่ออย่างเงียบงาม' },
    leftHeadline: {
      en: 'Managed simply,\nthrough one\napplication.',
      th: 'จัดการง่าย\nผ่านแอป\nเดียว',
    },
    leftBody: {
      en: 'Smart Living gathers everything you might ever need — bookings, payments, maintenance, even the air around you — into a single quiet surface, with a personal assistant on LINE who remembers, reminds, and knows the neighbourhood.',
      th: 'Smart Living รวบรวมทุกสิ่งที่คุณต้องการ — การจอง การชำระเงิน การแจ้งซ่อม แม้แต่อากาศรอบข้าง — ไว้ในพื้นที่เดียวที่เงียบงาม พร้อมผู้ช่วยส่วนตัวใน LINE ที่ช่วยจำ ช่วยเตือน และรู้จักย่านนี้เป็นอย่างดี',
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
    headline: { en: 'Request a private viewing.', th: 'นัดชมห้องส่วนตัว — อย่างเงียบ ๆ' },
    steps: {
      en: [
        { num: '01', title: 'Explore', body: 'Browse the residences. Decide if Nature Haven is the right fit.' },
        { num: '02', title: 'Reach out', body: "Message us on LINE. We'll answer questions and arrange a viewing." },
        { num: '03', title: 'Reserve', body: 'Pay the deposit via PromptPay to hold your unit.' },
        { num: '04', title: 'Move in', body: 'Sign the lease. Residences open from September 2026.' },
      ],
      th: [
        { num: '01', title: 'สำรวจ', body: 'ดูห้องพัก ตัดสินใจว่า Nature Haven เหมาะกับคุณไหม' },
        { num: '02', title: 'ติดต่อ', body: 'ส่งข้อความทาง LINE เราจะตอบคำถามและนัดชมห้อง' },
        { num: '03', title: 'จอง', body: 'ชำระมัดจำผ่าน PromptPay เพื่อยึดห้องของคุณ' },
        { num: '04', title: 'ย้ายเข้า', body: 'เซ็นสัญญา พร้อมเข้าอยู่กันยายน 2569' },
      ],
    },
    lineNote: { en: 'We answer fastest on LINE.', th: 'เราตอบเร็วที่สุดทาง LINE' },
  },
  footer: {
    headline: { en: 'Nature Haven — Quiet Living in Saimai', th: 'Nature Haven — ที่พักเงียบสงบในสายไหม' },
    sub: { en: 'A residence shaped by intention.', th: 'ที่พักที่ออกแบบด้วยเจตนา' },
    copyright: { en: '© 2026 Nature Haven. All rights reserved.', th: '© 2569 Nature Haven สงวนสิทธิ์ทั้งหมด' },
    allChannels: { en: 'All Channels', th: 'ช่องทางทั้งหมด' },
  },
} as const;
