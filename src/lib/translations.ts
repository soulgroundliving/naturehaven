import type { Lang } from '@/contexts/LanguageContext';
import {
  PRICE_FROM,
  PRICE_TO,
  ELECTRICITY_RATE_PER_UNIT,
  WATER_RATE_PER_UNIT,
  PET_FEE_MONTHLY,
  PARKING_CAPACITY_APPROX,
  BOOKING_FEE,
  MOVE_IN_LABEL,
  AVAILABLE_FROM_LABEL,
} from '@/data/propertyFacts';

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
    instagram: { en: 'Instagram', th: 'Instagram' },
    instagramSub: { en: '@naturehaven_official', th: '@naturehaven_official' },
    facebook: { en: 'Facebook', th: 'Facebook' },
    facebookSub: { en: 'Nature Haven สายไหม', th: 'Nature Haven สายไหม' },
    tiktok: { en: 'TikTok', th: 'TikTok' },
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
      en: 'Stories from the making of Nature Haven — quiet living, life with pets, the neighbourhood, and honest build diaries on the road to move-in in November 2026.',
      th: 'เรื่องเล่าระหว่างการสร้าง Nature Haven — การอยู่อย่างสงบ ชีวิตกับสัตว์เลี้ยง ย่านสายไหม และบันทึกการสร้างแบบตรงไปตรงมา จนถึงวันเข้าอยู่พฤศจิกายน 2026',
    },
    readAll: { en: 'Read all stories', th: 'อ่านบทความทั้งหมด' },
    filterAll: { en: 'All', th: 'ทั้งหมด' },
    filterLabel: { en: 'Filter by category', th: 'กรองตามหมวด' },
    readMin: { en: 'min read', th: 'นาที' },
    byLine: { en: 'By the Nature Haven team', th: 'โดยทีม Nature Haven' },
    backHome: { en: 'Home', th: 'หน้าแรก' },
    related: { en: 'More from the Journal', th: 'บทความอื่นจากบันทึก' },
    ctaTitle: { en: 'Want to see the space in person?', th: 'อยากเห็นห้องจริงไหม?' },
    ctaBody: {
      en: 'Reserve a viewing via LINE — bookings open October, move-in November 2026.',
      th: 'นัดชมห้องตัวอย่างผ่าน LINE — เปิดจองตุลาคม พร้อมเข้าอยู่พฤศจิกายน 2026',
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
      en: `Apartment · Pet-friendly · Saimai\nMove in ${MOVE_IN_LABEL.en}`,
      th: `อพาร์ทเม้นท์สายไหม · เลี้ยงสัตว์ได้ทั้งตึก\nพร้อมเข้าอยู่ ${MOVE_IN_LABEL.th}`,
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
      en: 'Designed for calm, crafted for privacy, and quietly connected to Sai Mai Road. Available from November 2026.',
      th: 'อพาร์ทเมนท์สร้างใหม่ในสายไหม ออกแบบเพื่อความสงบและความเป็นส่วนตัว พร้อมเข้าอยู่พฤศจิกายน 2569',
    },
    aboutButton: { en: 'View Residences', th: 'ดูห้องพัก' },
  },
  // /about shell (AboutPage.tsx) — structure only, no invented content.
  // Section labels are structural (requested directly), the body copy under
  // each is an explicit placeholder marker, not a first draft. Do not treat
  // any string here as real founder/brand copy.
  aboutPage: {
    metaTitle: { en: 'About Nature Haven (in progress)', th: 'เกี่ยวกับ Nature Haven (กำลังจัดทำ)' },
    metaDescription: {
      en: 'This page is being written and is not yet public.',
      th: 'หน้านี้อยู่ระหว่างจัดทำเนื้อหา ยังไม่เผยแพร่ต่อสาธารณะ',
    },
    eyebrow: { en: 'About', th: 'เกี่ยวกับเรา' },
    draftNote: {
      en: 'This page is still being written. The structure below is ready — the words are not. Every section is a placeholder until the owner provides real content.',
      th: 'หน้านี้ยังอยู่ระหว่างจัดทำ โครงสร้างด้านล่างพร้อมแล้ว แต่ยังไม่มีข้อความจริง ทุกส่วนเป็นเพียงตัวยึดพื้นที่ รอเนื้อหาจริงจากเจ้าของโครงการ',
    },
    placeholderBody: {
      en: 'Awaiting content from the project owner — no real copy has been written for this section yet.',
      th: 'รอเนื้อหาจากเจ้าของโครงการ — ยังไม่มีการเขียนข้อความจริงในส่วนนี้',
    },
    // Structure updated 2026-09-12 (owner decision) — was Why We Started /
    // Who We Are / What Nature Means / Our Standard.
    sections: {
      en: ['Why We Started', 'What We Believe', 'What Nature Means', 'How We Choose to Build'],
      th: ['ทำไมเราเริ่มทำโครงการนี้', 'สิ่งที่เราเชื่อ', 'Nature หมายถึงอะไรสำหรับเรา', 'แนวทางการสร้างของเรา'],
    },
  },
  residences: {
    sectionLabel: { en: 'Residences', th: 'ห้องพัก' },
    sectionHeadline: {
      en: 'Spaces designed for real living — comfortable, intentional, and meant to last.',
      th: 'พื้นที่ที่ออกแบบมาเพื่อการใช้ชีวิตจริง — สะดวกสบาย ตั้งใจ และยั่งยืน',
    },
    decisionTitle: { en: 'The essentials, before you ask.', th: 'ข้อมูลสำคัญ ก่อนตัดสินใจ' },
    decisionIntro: {
      en: 'A clear starting point for your first conversation. Current availability and exact move-in figures are confirmed privately on LINE.',
      th: 'สรุปข้อมูลสำคัญสำหรับเริ่มต้นคุย ห้องว่างล่าสุดและยอดค่าใช้จ่ายวันเข้าอยู่ยืนยันเป็นรายบุคคลทาง LINE',
    },
    decisionPriceLabel: { en: 'Rent, by floor', th: 'ค่าเช่าตามชั้น' },
    decisionPriceDetail: {
      en: `Floors 3–4: ${PRICE_FROM.toLocaleString('en-US')} · Floors 1–2: ${PRICE_TO.toLocaleString('en-US')}. Availability confirmed on LINE.`,
      th: `ชั้น 3-4: ${PRICE_FROM.toLocaleString('en-US')} · ชั้น 1-2: ${PRICE_TO.toLocaleString('en-US')} บาท ยืนยันห้องว่างทาง LINE`,
    },
    decisionSizeLabel: { en: 'Room size', th: 'ขนาดห้อง' },
    decisionSizeDetail: { en: 'One bedroom, one bathroom, multi-purpose storage cabinet and private balcony.', th: '1 ห้องนอน 1 ห้องน้ำ ตู้เก็บของอเนกประสงค์ และระเบียงส่วนตัว' },
    decisionLeaseLabel: { en: 'Lease', th: 'สัญญาเช่า' },
    decisionLeaseDetail: { en: 'Annual contract; move-in costs are confirmed on LINE.', th: 'สัญญารายปี และยืนยันค่าใช้จ่ายวันเข้าอยู่ทาง LINE' },
    decisionMoveinLabel: { en: 'Move-in', th: 'พร้อมเข้าอยู่' },
    decisionMoveinDetail: {
      en: `From ${MOVE_IN_LABEL.en} (reservations open ${AVAILABLE_FROM_LABEL.en.split(' ')[0]}).`,
      th: `${MOVE_IN_LABEL.th} (เปิดจอง${AVAILABLE_FROM_LABEL.th.split(' ')[0]})`,
    },
    decisionIncludedLabel: { en: 'Monthly rate', th: 'ค่าเช่ารายเดือน' },
    decisionIncludedDetail: {
      en: `Wi-Fi, cleaning & A/C included. Electricity ${ELECTRICITY_RATE_PER_UNIT} · water ${WATER_RATE_PER_UNIT} THB/unit, metered.`,
      th: `รวม Wi-Fi ทำความสะอาด ล้างแอร์ ค่าไฟ ${ELECTRICITY_RATE_PER_UNIT} · ค่าน้ำ ${WATER_RATE_PER_UNIT} บาท/หน่วย คิดตามจริง`,
    },
    decisionCostNote: {
      en: `Move-in costs: a ${BOOKING_FEE} THB booking fee (credited toward the total once you sign), a one-month security deposit, and one month of advance rent. Current room availability and viewing times are confirmed on LINE.`,
      th: `ค่าใช้จ่ายวันเข้าอยู่: ค่าจอง ${BOOKING_FEE} บาท (หักลบเป็นส่วนหนึ่งของยอดเมื่อทำสัญญา) เงินประกันความเสียหาย 1 เดือน และค่าเช่าล่วงหน้า 1 เดือน — ห้องว่างล่าสุดและเวลานัดชม ยืนยันทาง LINE`,
    },
    suitableForTitle: { en: 'Suitable For', th: 'เหมาะสำหรับ' },
    suitableFor: {
      en: ['1–2 residents', 'Working professionals', 'Couples', 'Those who value quiet living'],
      th: ['1–2 คน', 'คนทำงาน', 'คู่รัก', 'ผู้ที่รักความสงบ'],
    },
    spaceTitle: { en: 'Space & Layout', th: 'พื้นที่และผังห้อง' },
    sqm: { en: 'sq.m.', th: 'ตร.ม.' },
    bedroom: { en: '1 Bedroom / 1 Bathroom', th: '1 ห้องนอน / 1 ห้องน้ำ' },
    kitchen: { en: 'Storage cabinet + microwave station, sink on the balcony', th: 'ตู้เก็บของอเนกประสงค์ + ที่วางไมโครเวฟ, ซิงก์ที่ระเบียง' },
    unitsTotal: { en: 'units total', th: 'ยูนิตรวม' },
    floors: { en: 'floors', th: 'ชั้น' },
    termsTitle: { en: 'Terms', th: 'เงื่อนไข' },
    contractLabel: { en: 'Contract', th: 'สัญญา' },
    contractValue: { en: 'Annual (12 months)', th: 'รายปี (12 เดือน)' },
    moveinLabel: { en: 'Move-in', th: 'เข้าอยู่' },
    moveinValue: {
      en: `${BOOKING_FEE} THB booking fee + 1 mo. deposit + 1 mo. advance`,
      th: `ค่าจอง ${BOOKING_FEE} บาท + เงินประกัน 1 เดือน + ค่าเช่าล่วงหน้า 1 เดือน`,
    },
    availableLabel: { en: 'Available from', th: 'พร้อมเข้าอยู่' },
    availableValue: { en: MOVE_IN_LABEL.en, th: MOVE_IN_LABEL.th },
    utilitiesLabel: { en: 'Utilities', th: 'ค่าน้ำ-ค่าไฟ' },
    utilitiesValue: {
      en: `Electricity ${ELECTRICITY_RATE_PER_UNIT} · Water ${WATER_RATE_PER_UNIT} THB/unit (metered)`,
      th: `ไฟ ${ELECTRICITY_RATE_PER_UNIT} · น้ำ ${WATER_RATE_PER_UNIT} บาท/หน่วย (ตามจริง)`,
    },
    parkingLabel: { en: 'Parking', th: 'ที่จอดรถ' },
    parkingValue: {
      en: `~${PARKING_CAPACITY_APPROX} spaces, first-come, first-served`,
      th: `ประมาณ ${PARKING_CAPACITY_APPROX} คัน มาก่อนได้จอดก่อน`,
    },
    allinclusive: {
      en: 'Wi-Fi, cleaning & A/C service are included in the rent. Electricity and water are metered separately — no common fee.',
      th: 'ค่าเช่ารวม Wi-Fi ทำความสะอาด และล้างแอร์ไว้แล้ว ส่วนค่าน้ำค่าไฟคิดตามหน่วยจริงแยกต่างหาก — ไม่มีค่าส่วนกลาง',
    },
    pricingLabel: { en: 'Pricing', th: 'ราคา' },
    pricingNote: { en: 'By floor · opening rate', th: 'ตามชั้น · ราคาเปิดตัว' },
    floorTierUpper: { en: 'Floors 3–4', th: 'ชั้น 3-4' },
    floorTierLower: { en: 'Floors 1–2', th: 'ชั้น 1-2' },
    floorTierUpperNote: { en: 'More stairs, no elevator — the entry rate.', th: 'เดินขึ้นมากกว่า ไม่มีลิฟต์ — ราคาเริ่มต้น' },
    floorTierLowerNote: { en: 'Closer to the entrance.', th: 'ใกล้ทางเข้ามากกว่า' },
    privateBody: {
      en: 'Rates above are per floor, all-in before utilities. Current room availability and viewing times are confirmed on LINE.',
      th: 'ราคาข้างต้นคือราคาต่อชั้น ยังไม่รวมค่าน้ำค่าไฟ ห้องที่ว่างล่าสุดและเวลานัดชม ยืนยันทาง LINE',
    },
    openingRate: { en: 'Opening Rate', th: 'ราคาเปิดตัว' },
    petsEverywhere: { en: 'Pet-friendly — the whole building', th: 'อพาร์ทเมนท์เลี้ยงสัตว์ได้ทั้งตึก ไม่จำกัดชั้น' },
    petsEverywhereSub: { en: 'No floor restrictions — small pets (1–2 per unit) welcome in every home, on every floor.', th: 'ไม่กำหนดว่าชั้นไหน — ทุกห้องทุกชั้นรับสัตว์เลี้ยงขนาดเล็ก 1–2 ตัวต่อห้อง' },
    petFeeNote: {
      en: `Monthly pet fee: ${PET_FEE_MONTHLY.toLocaleString('en-US')} THB per pet.`,
      th: `ค่าสัตว์เลี้ยง ${PET_FEE_MONTHLY.toLocaleString('en-US')} บาท/ตัว/เดือน`,
    },
    floorWord: { en: 'Floor', th: 'ชั้น' },
    fromLabel: { en: 'From', th: 'เริ่มต้น' },
    tierCta: { en: 'Book a viewing', th: 'นัดชมห้อง' },
    unitsPerFloor: { en: '5 units', th: '5 ห้อง' },
    ctaLabel: { en: 'Ready to see it in person?', th: 'อยากเห็นห้องจริงด้วยตาตัวเอง?' },
    ctaButton: { en: 'Request Private Viewing', th: 'นัดชมห้องส่วนตัว' },
    galleryBedroom: { en: 'Bedroom', th: 'ห้องนอน' },
    galleryBathroom: { en: 'Bathroom', th: 'ห้องน้ำ' },
    galleryKitchen: { en: 'Storage', th: 'ที่เก็บของ' },
    galleryBalcony: { en: 'Balcony', th: 'ระเบียง' },
    essentialsTitle: { en: 'In-Room Essentials', th: 'สิ่งที่มาพร้อมในห้อง' },
    essentialsSub: { en: 'Every element is selected with purpose.', th: 'ทุกองค์ประกอบคัดสรรด้วยความตั้งใจ' },
    essentials: {
      en: [
        'Built-in furniture throughout (soft-close)',
        '10″ pocket-spring mattress — 5-star hotel grade',
        'Work desk / wardrobe / shelving / chair',
        'Full-length mirror',
        'Air conditioner',
        'Refrigerator & microwave',
        'Water heater',
        'Full UV-blocking curtains',
        'Air ventilation system',
      ],
      th: [
        'เฟอร์นิเจอร์บิ้วอินทั้งห้อง (soft-close)',
        'ที่นอน Pocket Spring 10 นิ้ว — มาตรฐานโรงแรม 5 ดาว',
        'โต๊ะทำงาน / ตู้เสื้อผ้า / ชั้นวาง / เก้าอี้',
        'กระจกบานใหญ่',
        'เครื่องปรับอากาศ',
        'ตู้เย็น & ไมโครเวฟ',
        'เครื่องทำน้ำอุ่น',
        'ม่านกัน UV สมบูรณ์',
        'ระบบระบายอากาศ',
      ],
    },
  },
  residencePage: {
    // Chrome for the standalone /residence route — the shared facts/pricing
    // content itself lives in TR.residences via ResidenceDetails.tsx.
    eyebrow: { en: 'The Residence', th: 'ห้องพัก' },
    metaTitle: {
      en: 'The Residence — 25.2 sqm, pet-friendly | Nature Haven',
      th: 'ห้องเช่าสายไหม 25.2 ตร.ม. เลี้ยงสัตว์ได้ | Nature Haven',
    },
    metaDescription: {
      en: 'A 25.2 sqm one-bedroom home in Sai Mai, Bangkok — pet-friendly, from 6,900 THB/month. Room facts, pricing by floor, and what is included, in one place.',
      th: 'ห้องเช่า 25.2 ตร.ม. 1 ห้องนอน ย่านสายไหม กรุงเทพฯ เลี้ยงสัตว์ได้ เริ่มต้น 6,900 บาท/เดือน รวมข้อมูลห้อง ราคาตามชั้น และสิ่งที่ค่าเช่าครอบคลุมไว้ในที่เดียว',
    },
    designLinkTitle: { en: 'See the design decisions behind this room', th: 'ดูการออกแบบเบื้องหลังห้องนี้' },
    designLinkBody: {
      en: 'Every detail above — the orientation, the balcony, the bathroom — is explained chapter by chapter in the Architectural Lookbook.',
      th: 'ทุกรายละเอียดข้างต้น — การวางผัง ระเบียง ห้องน้ำ — อธิบายไว้ทีละคอลเลกชันใน The Architectural Lookbook',
    },
  },
  amenities: {
    sectionLabel: { en: 'Amenities', th: 'สิ่งอำนวยความสะดวก' },
    headline: {
      en: 'Everything in place,\nbefore you arrive.',
      th: 'ทุกอย่างพร้อมแล้ว\nก่อนที่คุณจะมาถึง',
    },
    subtext: {
      en: 'Every item below is included in your monthly rate — stated clearly from day one.',
      th: 'ทุกอย่างรวมอยู่ในค่าเช่ารายเดือน — แจ้งชัดเจนตั้งแต่วันแรก',
    },
    scrollHint: { en: 'Scroll', th: 'เลื่อน' },
    items: {
      en: [
        { label: 'Parking', desc: `Registered residents · ~${PARKING_CAPACITY_APPROX} spaces around the building · first-come, first-served.` },
        { label: 'Pocket Garden', desc: 'A communal garden to slow down in. Green, quiet, yours.' },
        { label: 'Laundry & Dryer', desc: 'Washers and dryers on site, with a drinking-water refill station.' },
        { label: 'Cleaning Service', desc: 'In-unit cleaning included — twice a year for units with a pet, once a year without.' },
        { label: 'A/C Maintenance', desc: 'Serviced on a regular schedule — at least yearly, or sooner based on condition — included in your rate.' },
      ],
      th: [
        { label: 'ที่จอดรถ', desc: `สำหรับผู้พักอาศัยที่ลงทะเบียน · พื้นที่จอดจริงประมาณ ${PARKING_CAPACITY_APPROX} คันรอบอาคาร · มาก่อนได้จอดก่อน` },
        { label: 'สวนกระเป๋า', desc: 'สวนส่วนกลาง — สีเขียว สงบ เป็นของคุณ' },
        { label: 'ซักผ้า & อบผ้า', desc: 'เครื่องซักและเครื่องอบในอาคาร พร้อมจุดเติมน้ำดื่ม' },
        { label: 'บริการทำความสะอาด', desc: 'ทำความสะอาดห้องพักรวมอยู่ในค่าเช่า — ปีละ 2 ครั้งสำหรับห้องที่เลี้ยงสัตว์ ปีละครั้งสำหรับห้องที่ไม่เลี้ยงสัตว์' },
        { label: 'บริการล้างแอร์', desc: 'ล้างแอร์ตามรอบ อย่างน้อยปีละครั้ง หรือเร็วกว่านั้นตามสภาพ รวมอยู่ในค่าเช่าแล้ว' },
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
      th: 'อพาร์ทเม้นท์สายไหมในย่านสงบ — แต่ใกล้ชิดกับสิ่งอำนวยความสะดวกในชีวิตประจำวัน',
    },
    nearbyTitle: { en: 'Nearby Essentials', th: 'สถานที่ใกล้เคียง' },
    lifestyleTitle: { en: 'Lifestyle Surroundings', th: 'ห้างร้านและตลาดรอบข้าง' },
    guideLink: { en: 'See the full neighbourhood guide', th: 'ดูคู่มือย่านฉบับเต็ม' },
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
        { title: 'Energy-conscious design', body: 'Cross-ventilation, UV-blocking curtains and inverter cooling — designed to use less from day one.' },
        { title: 'Long-term material durability', body: 'Selected for how they age — quietly, without losing their character.' },
      ],
      th: [
        { title: 'ใช้พลังงานโซลาร์', body: 'โซลาร์เซลล์บนหลังคาช่วยลดการใช้ไฟฟ้าในพื้นที่ส่วนกลาง ลดรอยเท้าคาร์บอนตลอดปี' },
        { title: 'ดีไซน์ประหยัดพลังงาน', body: 'การระบายอากาศไขว้ ม่านกัน UV และแอร์อินเวอร์เตอร์ — ออกแบบมาให้ใช้ไฟน้อยตั้งแต่วันแรก' },
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
    headline: { en: 'Request a private viewing.', th: 'นัดชมห้องส่วนตัว' },
    steps: {
      en: [
        { num: '01', title: 'Explore', body: 'Browse the residences. Decide if Nature Haven is the right fit.' },
        { num: '02', title: 'Reach out', body: "Message us on LINE. We'll answer questions and arrange a viewing." },
        { num: '03', title: 'Reserve', body: 'Pay the deposit via PromptPay to hold your unit.' },
        { num: '04', title: 'Move in', body: 'Sign the lease. Residences open from November 2026.' },
      ],
      th: [
        { num: '01', title: 'สำรวจ', body: 'ดูห้องพัก ตัดสินใจว่า Nature Haven เหมาะกับคุณไหม' },
        { num: '02', title: 'ติดต่อ', body: 'ส่งข้อความทาง LINE เราจะตอบคำถามและนัดชมห้อง' },
        { num: '03', title: 'จอง', body: 'ชำระมัดจำผ่าน PromptPay เพื่อยึดห้องของคุณ' },
        { num: '04', title: 'ย้ายเข้า', body: 'เซ็นสัญญา พร้อมเข้าอยู่พฤศจิกายน 2569' },
      ],
    },
    ctaButton: { en: 'Request a private viewing on LINE', th: 'นัดชมห้องส่วนตัวผ่าน LINE' },
    lineNote: { en: 'We answer fastest on LINE.', th: 'เราตอบเร็วที่สุดทาง LINE' },
    appointmentNote: {
      en: 'There is no walk-in office. After we connect on LINE, we will confirm a time to meet you at the project.',
      th: 'โครงการไม่มีสำนักงานสำหรับ walk-in กรุณาทัก LINE ก่อน แล้วเราจะยืนยันเวลานัดพบที่โครงการ',
    },
  },
  footer: {
    headline: { en: 'Nature Haven — Quiet Living in Saimai', th: 'Nature Haven — ที่พักเงียบสงบในสายไหม' },
    sub: { en: 'A residence shaped by intention.', th: 'ที่พักที่ออกแบบด้วยเจตนา' },
    copyright: { en: '© 2026 Nature Haven. All rights reserved.', th: '© 2569 Nature Haven สงวนสิทธิ์ทั้งหมด' },
    allChannels: { en: 'All Channels', th: 'ช่องทางทั้งหมด' },
    privacy: { en: 'Privacy Policy', th: 'นโยบายความเป็นส่วนตัว' },
    terms: { en: 'Terms of Service', th: 'ข้อตกลงการใช้งาน' },
  },
  cookieNotice: {
    message: {
      en: "This site stores your language choice in your browser and uses cookieless, first-party analytics. See our",
      th: 'เว็บไซต์นี้จัดเก็บภาษาที่คุณเลือกไว้ในเบราว์เซอร์ และใช้ระบบวิเคราะห์แบบไม่ใช้คุกกี้ อ่านรายละเอียดเพิ่มเติมได้ที่',
    },
    accept: { en: 'Accept All', th: 'ยอมรับทั้งหมด' },
    reject: { en: 'Reject', th: 'ปฏิเสธ' },
    customize: { en: 'Customize', th: 'เลือกเอง' },
  },
} as const;
