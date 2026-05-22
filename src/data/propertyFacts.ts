// Single source of truth for Nature Haven property data.
// Both FAQ UI (FAQSection.tsx) and JSON-LD schemas (index.html) derive from here.
// When content changes, update here — schemas + UI stay in sync.

export const PROPERTY = {
  name: 'Nature Haven',
  legalName: 'The Green Haven',
  url: 'https://naturehaven-living.vercel.app',
  // TODO: replace streetAddress with confirmed address before launch
  streetAddress: '',
  locality: 'Sai Mai',
  region: 'Bangkok',
  postalCode: '10220',
  country: 'TH',
  // TODO: replace with confirmed coordinates once exact address is known
  latitude: 13.9135,
  longitude: 100.662,
  lineUrl: 'https://lin.ee/ZoujovB6',
  availableFrom: '2026-08-01',
  totalUnits: 20,
  hasElevator: false,
} as const;

export const UNITS = [
  {
    id: 'standard',
    label: 'Standard',
    unitRange: '1–2',
    sqm: 31.5,
    bedrooms: 1,
    bathrooms: 1,
    hasKitchen: true,
    hasBalcony: true,
    petsAllowed: false,
    priceOpening: 7000,
    priceRegular: 6000,
  },
  {
    id: 'pet-friendly',
    label: 'Pet Friendly',
    unitRange: '3–4',
    sqm: 31.5,
    bedrooms: 1,
    bathrooms: 1,
    hasKitchen: true,
    hasBalcony: true,
    petsAllowed: true,
    petPolicy: 'สัตว์เลี้ยงขนาดเล็ก 1–2 ตัว',
    priceOpening: 7800,
    priceRegular: 6500,
  },
] as const;

export const AMENITIES = [
  'Free Wi-Fi (AIS Fiber)',
  'Solar energy integration',
  'Digital door lock (unit & building)',
  '24/7 CCTV',
  'Smart app — bookings, payments, maintenance, pet records',
  'Cleaning service',
  'A/C maintenance service',
  'Common garden area',
] as const;

export const FAQ_ITEMS = [
  {
    id: 'price',
    q_th: 'ค่าเช่าต่อเดือนเท่าไหร่?',
    q_en: 'What is the monthly rent?',
    a_th: 'Standard (units 1–2) เริ่มต้น 7,000 บาท/เดือน · Pet-Friendly (units 3–4) 7,800 บาท/เดือน',
    a_en: 'Standard units 1–2 from 7,000 THB/month · Pet-friendly units 3–4 from 7,800 THB/month.',
  },
  {
    id: 'inclusive',
    q_th: 'ค่าเช่ารวมอะไรบ้าง?',
    q_en: "What's included in the rent?",
    a_th: 'ค่าเช่ารวม Wi-Fi (AIS Fiber), บริการทำความสะอาด, บริการล้างแอร์ และสิ่งอำนวยความสะดวกส่วนกลางทั้งหมด — จ่ายรายเดือนรวมทุกอย่าง',
    a_en: 'Monthly rate is all-inclusive: Wi-Fi, cleaning service, A/C maintenance, and all common amenities.',
  },
  {
    id: 'size',
    q_th: 'ห้องขนาดเท่าไหร่?',
    q_en: 'How big is each unit?',
    a_th: '31.5 ตร.ม. · 1 ห้องนอน · 1 ห้องน้ำ · ครัวแยก · ระเบียงส่วนตัว',
    a_en: '31.5 sqm · 1 bedroom · 1 bathroom · separate kitchen · private balcony.',
  },
  {
    id: 'pets',
    q_th: 'รับสัตว์เลี้ยงไหม?',
    q_en: 'Are pets allowed?',
    a_th: 'รับสัตว์เลี้ยงขนาดเล็ก 1–2 ตัว ใน units 3–4 (Pet-Friendly) เท่านั้น',
    a_en: 'Small pets (1–2 animals) are allowed in units 3–4 only.',
  },
  {
    id: 'contract',
    q_th: 'สัญญาเช่ากี่เดือน?',
    q_en: 'How long is the lease?',
    a_th: '12 เดือน (สัญญารายปี)',
    a_en: '12 months — annual contract.',
  },
  {
    id: 'deposit',
    q_th: 'เงินที่ต้องเตรียมวันเข้าอยู่?',
    q_en: 'What deposit is required to move in?',
    a_th: 'มัดจำ 1 เดือน + ค่าเช่าล่วงหน้า 1 เดือน',
    a_en: '1-month security deposit + 1-month advance rent.',
  },
  {
    id: 'open',
    q_th: 'เปิดให้เข้าอยู่เมื่อไหร่?',
    q_en: 'When can I move in?',
    a_th: 'เปิดให้เข้าอยู่สิงหาคม 2026',
    a_en: 'Available from August 2026.',
  },
  {
    id: 'contact',
    q_th: 'ติดต่อจองได้ทางไหน?',
    q_en: 'How do I reserve a unit?',
    a_th: 'ติดต่อทาง LINE เท่านั้น — กดปุ่ม "Reserve via LINE" ในส่วน Contact ด้านล่าง',
    a_en: 'LINE only — tap "Reserve via LINE" in the Contact section.',
  },
  {
    id: 'elevator',
    q_th: 'มีลิฟต์ไหม?',
    q_en: 'Is there an elevator?',
    a_th: 'ไม่มีลิฟต์ — เป็น low-rise 3 ชั้น ออกแบบเพื่อความเป็นส่วนตัวและประหยัดพลังงาน',
    a_en: 'No elevator — low-rise 3 floors, designed for privacy and energy efficiency.',
  },
  {
    id: 'location',
    q_th: 'Nature Haven อยู่ที่ไหน?',
    q_en: 'Where is Nature Haven located?',
    a_th: 'ย่านสายไหม กรุงเทพฯ — สงบ เป็นส่วนตัว เดินทางสะดวก',
    a_en: 'Sai Mai district, Bangkok — quiet, private, and well-connected.',
  },
] as const;

export type FaqItem = (typeof FAQ_ITEMS)[number];
