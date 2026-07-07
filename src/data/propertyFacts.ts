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
  // LINE OA ID for manual "Add Friends → Search ID" fallback — used when an
  // in-app browser (Facebook/Instagram) blocks the lin.ee → line.me redirect.
  // Verify: the lin.ee link 301s to https://line.me/R/ti/p/@929pthtt
  lineId: '@929pthtt',
  instagramUrl: 'https://www.instagram.com/naturehaven_official/',
  availableFrom: '2026-09-01',
  totalUnits: 20,
  hasElevator: false,
} as const;

// Every unit is pet-friendly. Opening price has two tiers by floor: upper
// floors (3–4) are the entry rate at 6,900 THB/mo; lower floors (1–2) are
// 7,200 THB/mo. 20 units total · 5 per floor.
export const PRICE_FROM = 6900;

export const PETS_POLICY = {
  th: 'เลี้ยงสัตว์ได้ทั้งตึก ไม่จำกัดชั้น — รับสัตว์เลี้ยงขนาดเล็ก 1–2 ตัวต่อห้อง',
  en: 'Pet-friendly throughout the entire building — no floor restrictions. Small pets, 1–2 per unit.',
} as const;

export const UNITS = [
  {
    id: 'floor-4', label: 'Floor 4', floor: 4,
    sqm: 25, bedrooms: 1, bathrooms: 1, hasKitchen: true, hasBalcony: true,
    petsAllowed: true, priceOpening: 6900,
  },
  {
    id: 'floor-3', label: 'Floor 3', floor: 3,
    sqm: 25, bedrooms: 1, bathrooms: 1, hasKitchen: true, hasBalcony: true,
    petsAllowed: true, priceOpening: 6900,
  },
  {
    id: 'floor-2', label: 'Floor 2', floor: 2,
    sqm: 25, bedrooms: 1, bathrooms: 1, hasKitchen: true, hasBalcony: true,
    petsAllowed: true, priceOpening: 7200,
  },
  {
    id: 'floor-1', label: 'Floor 1', floor: 1,
    sqm: 25, bedrooms: 1, bathrooms: 1, hasKitchen: true, hasBalcony: true,
    petsAllowed: true, priceOpening: 7200,
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
    a_th: 'เลี้ยงสัตว์ได้ทั้งตึก · ราคาสองระดับตามชั้น — ชั้น 3–4 อยู่ที่ 6,900 บาท/เดือน ชั้น 1–2 อยู่ที่ 7,200 บาท/เดือน',
    a_en: 'Pet-friendly throughout the building. Two rates by floor — floors 3–4 at 6,900 THB/month, floors 1–2 at 7,200 THB/month.',
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
    a_th: '25 ตร.ม. · 1 ห้องนอน · 1 ห้องน้ำ · ครัวแยก · ระเบียงส่วนตัว',
    a_en: '25 sqm · 1 bedroom · 1 bathroom · separate kitchen · private balcony.',
  },
  {
    id: 'pets',
    q_th: 'รับสัตว์เลี้ยงไหม?',
    q_en: 'Are pets allowed?',
    a_th: 'เลี้ยงได้ทั้งตึก ไม่กำหนดว่าชั้นไหน — ทุกห้องทุกชั้นรับสัตว์เลี้ยงขนาดเล็ก 1–2 ตัวต่อห้อง',
    a_en: 'Yes — pets are welcome throughout the entire building, with no floor restrictions. Small pets, 1–2 per unit.',
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
    a_th: 'เปิดให้เข้าอยู่กันยายน 2026',
    a_en: 'Available from September 2026.',
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
    a_th: 'ไม่มีลิฟต์ — เป็น low-rise 4 ชั้น ออกแบบเพื่อความเป็นส่วนตัวและประหยัดพลังงาน',
    a_en: 'No elevator — low-rise 4 floors, designed for privacy and energy efficiency.',
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
