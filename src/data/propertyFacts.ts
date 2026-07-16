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
  // Confirmed 2026-07-12 from owner-shared pin (maps.app.goo.gl/vG5CV42xX6bqJ1Vs8)
  // — the Nest building. Google's base map is outdated in this area; these are the
  // real coordinates, so the "directions" link drops the pin on the actual building.
  latitude: 13.9266178,
  longitude: 100.6829022,
  // Google Business Profile listing share link — opens the named "Nature Haven"
  // place (reviews, hours, directions), not just a bare pin. Used on /links +
  // as hasMap/sameAs in the JSON-LD. Supersedes the earlier coordinate-pin link.
  mapsUrl: 'https://maps.app.goo.gl/cGk79bn9tuBktvad9',
  // Permanent add-friend deep link, derived from the OA basic ID — it never
  // regenerates the way lin.ee short links do (create-new-link mints a fresh
  // code each time). Using line.me directly also skips the lin.ee → line.me
  // redirect hop that hangs in FB/IG in-app webviews (see inAppBrowser.ts).
  lineUrl: 'https://line.me/R/ti/p/@929pthtt',
  // LINE OA ID for the manual "Add Friends → Search ID" fallback (LineLinkGuard),
  // shown when an in-app browser (Facebook/Instagram) can't hand off to LINE.
  lineId: '@929pthtt',
  instagramUrl: 'https://www.instagram.com/naturehaven_official/',
  facebookUrl: 'https://www.facebook.com/share/1E49MQVqhr/?mibextid=wwXIfr',
  tiktokUrl: 'https://www.tiktok.com/@nature.haven9',
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
    sqm: 25.2, bedrooms: 1, bathrooms: 1, hasKitchen: true, hasBalcony: true,
    petsAllowed: true, priceOpening: 6900,
  },
  {
    id: 'floor-3', label: 'Floor 3', floor: 3,
    sqm: 25.2, bedrooms: 1, bathrooms: 1, hasKitchen: true, hasBalcony: true,
    petsAllowed: true, priceOpening: 6900,
  },
  {
    id: 'floor-2', label: 'Floor 2', floor: 2,
    sqm: 25.2, bedrooms: 1, bathrooms: 1, hasKitchen: true, hasBalcony: true,
    petsAllowed: true, priceOpening: 7200,
  },
  {
    id: 'floor-1', label: 'Floor 1', floor: 1,
    sqm: 25.2, bedrooms: 1, bathrooms: 1, hasKitchen: true, hasBalcony: true,
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
    a_th: 'เริ่มต้น 6,900 บาท/เดือน แบบรวมทุกอย่าง — ราคาแต่ละชั้นและข้อเสนอช่วงเปิดตัว เราแจ้งแบบส่วนตัวทาง LINE พร้อมนัดชมห้อง',
    a_en: 'From 6,900 THB/month, all-inclusive — per-floor rates and opening offers are shared privately via LINE, along with your viewing appointment.',
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
    a_th: '25.2 ตร.ม. สี่เหลี่ยมผืนผ้า · 1 ห้องนอน · 1 ห้องน้ำ · มุมครัวในตัว (ตู้เย็น ไมโครเวฟ เตาไฟฟ้า) · ซิงก์ล้างจานที่ระเบียง · ระเบียงส่วนตัว · ทางเข้าทิศเหนือ–ระเบียงทิศใต้ รับลมธรรมชาติตลอดปี',
    a_en: '25.2 sqm rectangular plan · 1 bedroom · 1 bathroom · in-room kitchenette (fridge, microwave, electric stove) · dish sink on the balcony · private balcony · north entrance, south balcony for year-round airflow.',
  },
  {
    id: 'pets',
    q_th: 'รับสัตว์เลี้ยงไหม?',
    q_en: 'Are pets allowed?',
    a_th: 'เลี้ยงได้ทั้งตึก ไม่กำหนดว่าชั้นไหน — ทุกห้องรับสัตว์เลี้ยงขนาดเล็ก–กลาง 1–2 ตัวต่อห้อง มีค่าสัตว์เลี้ยงรายเดือนต่อตัว (แจ้งยอดทาง LINE)',
    a_en: 'Yes — pets are welcome throughout the entire building, with no floor restrictions. Small–medium pets, 1–2 per unit; a monthly per-pet fee applies (details on LINE).',
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
    a_th: 'มีค่ามัดจำ ค่าเช่าล่วงหน้า และค่าประกัน (ชำระวันเข้าอยู่) รวมถึงค่าจองที่หักคืนในยอดเมื่อทำสัญญา — ยอดละเอียดแจ้งเป็นการส่วนตัวทาง LINE',
    a_en: 'A deposit, advance rent, and a security deposit (paid on move-in), plus a booking fee that is credited toward your move-in total. Exact amounts are shared privately on LINE.',
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
    a_th: 'ติดต่อทาง LINE เท่านั้น — กดปุ่ม "นัดชมห้องส่วนตัว" บนหน้าเว็บ แล้วทีมงานจะดูแลต่อให้ทั้งหมด',
    a_en: 'LINE only — tap "Request Private Viewing" anywhere on the site and we will take care of the rest.',
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
