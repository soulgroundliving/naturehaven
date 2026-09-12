// Single source of truth for Nature Haven property data.
// FAQ UI (FAQSection.tsx) and route-specific JSON-LD (structuredData.ts)
// derive from here. When content changes, update here so schemas + UI stay in sync.

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
  // Confirmed project map/directions link. This is a location pin, not proof of
  // a customer-facing office or Google Business Profile eligibility.
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
  // Privacy policy is THIS site's own (/privacy, src/pages/PrivacyPage.tsx) —
  // it used to point straight at the tenant app's privacy.html, which
  // documents an entirely different data set (KYC, CCTV, meters, gamification
  // etc.) that a marketing-site visitor never triggers. That page still
  // exists and governs the tenant app + booking flow once someone leaves via
  // LINE — PrivacyPage links out to it (tenantAppPrivacyUrl) for that step.
  privacyUrl: '/privacy',
  tenantAppPrivacyUrl: 'https://the-green-haven.vercel.app/privacy',
  // Terms of service is still the operating company's shared doc — out of
  // scope for the privacy-policy split above (owner asked about privacy only).
  termsUrl: 'https://the-green-haven.vercel.app/terms',
  // October 2026 = reservations/bookings open (this ISO date feeds
  // AggregateOffer.availabilityStarts in structuredData.ts — tools/test-landing-seo.mjs
  // asserts it stays '2026-10-01', so change that test too if this ever moves).
  // Actual move-in is November 2026 — a separate fact, stated in prose (FAQ 'open',
  // hero tagline, decision-summary Move-in field) rather than a second schema field.
  // Owner-clarified 2026-09-11: the two dates are intentionally different milestones.
  availableFrom: '2026-10-01',
  moveInFrom: '2026-11-01',
  totalUnits: 20,
  hasElevator: false,
} as const;

// Computed display labels for the two dates above — every "November 2026" /
// "October 2026" shown anywhere on the site should come from these, not be
// retyped, after a prior bug where the two milestones got mixed up in copy
// (see the 2026-09-11 owner clarification comment above).
const TH_MONTHS = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
const EN_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function monthYearLabel(iso: string): { en: string; th: string } {
  const [y, m] = iso.split('-').map(Number);
  return { en: `${EN_MONTHS[m - 1]} ${y}`, th: `${TH_MONTHS[m - 1]} ${y + 543}` };
}
export const MOVE_IN_LABEL = monthYearLabel(PROPERTY.moveInFrom);
export const AVAILABLE_FROM_LABEL = monthYearLabel(PROPERTY.availableFrom);

// Every unit is pet-friendly. Opening price has two tiers by floor: upper
// floors (3–4) are the entry rate at 6,900 THB/mo; lower floors (1–2) are
// 7,200 THB/mo. 20 units total · 5 per floor.
export const PRICE_FROM = 6900;
export const PRICE_TO = 7200;

// Owner-confirmed public Landing rate (2026-08-23). This marketing constant does
// not change The Green Haven's operational billing source; align that system
// separately through its authorized, audited path before treating it as billing SoT.
export const PET_FEE_MONTHLY = 500;

// Owner-confirmed 2026-09-11. Rent covers Wi-Fi, cleaning and A/C maintenance;
// electricity and water are metered and billed separately at these per-unit
// rates. There is no separate common-area fee.
export const ELECTRICITY_RATE_PER_UNIT = 6;
export const WATER_RATE_PER_UNIT = 20;
export const HAS_COMMON_FEE = false;

// Owner-confirmed 2026-09-11. NEST has 20 rooms but only ~16 practical parking
// spaces around the building — do NOT state or imply a 1-room-to-1-space
// guarantee anywhere on the site.
export const PARKING_CAPACITY_APPROX = 16;

// Owner-confirmed 2026-09-12 (previously proposed but unconfirmed as of
// 2026-09-11 — now approved for publication). A reserved space on top of the
// free first-come-first-served spaces above.
export const RESERVED_PARKING_FEE_MONTHLY = 300;

// Owner-confirmed 2026-09-12. Paid via PromptPay at time of booking; credited
// toward the move-in total (deposit + advance rent) if the booking proceeds
// to a signed contract. Refunded if properly cancelled; forfeited on a
// no-show with no notice.
export const BOOKING_FEE = 500;

export const PETS_POLICY = {
  th: 'เลี้ยงสัตว์ได้ทั้งตึก ไม่จำกัดชั้น — รับสัตว์เลี้ยงขนาดเล็ก 1–2 ตัวต่อห้อง',
  en: 'Pet-friendly throughout the entire building — no floor restrictions. Small pets, 1–2 per unit.',
} as const;

export const UNITS = [
  {
    id: 'floor-4', label: 'Floor 4', floor: 4,
    sqm: 25.2, bedrooms: 1, bathrooms: 1, hasKitchen: false, hasBalcony: true,
    petsAllowed: true, priceOpening: 6900,
  },
  {
    id: 'floor-3', label: 'Floor 3', floor: 3,
    sqm: 25.2, bedrooms: 1, bathrooms: 1, hasKitchen: false, hasBalcony: true,
    petsAllowed: true, priceOpening: 6900,
  },
  {
    id: 'floor-2', label: 'Floor 2', floor: 2,
    sqm: 25.2, bedrooms: 1, bathrooms: 1, hasKitchen: false, hasBalcony: true,
    petsAllowed: true, priceOpening: 7200,
  },
  {
    id: 'floor-1', label: 'Floor 1', floor: 1,
    sqm: 25.2, bedrooms: 1, bathrooms: 1, hasKitchen: false, hasBalcony: true,
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
    a_th: `ชั้น 3-4 เริ่มต้น ${PRICE_FROM.toLocaleString('en-US')} บาท/เดือน และชั้น 1-2 ${PRICE_TO.toLocaleString('en-US')} บาท/เดือน — ยิ่งชั้นสูง (เดินขึ้นมากกว่า ไม่มีลิฟต์) ค่าเช่ายิ่งเบากว่า ราคานี้ยังไม่รวมค่าน้ำค่าไฟ ยืนยันห้องว่างล่าสุดและนัดชมทาง LINE`,
    a_en: `From ${PRICE_FROM.toLocaleString('en-US')} THB/month on floors 3–4, and ${PRICE_TO.toLocaleString('en-US')} THB/month on floors 1–2 — the higher the floor (more stairs, no elevator), the lower the rent. Electricity and water are metered separately. Confirm current availability and book a viewing on LINE.`,
  },
  {
    id: 'inclusive',
    q_th: 'ค่าเช่ารวมอะไรบ้าง?',
    q_en: "What's included in the rent?",
    a_th: `ค่าเช่ารวม Wi-Fi (AIS Fiber), บริการทำความสะอาดพื้นที่ส่วนกลาง (ปีละ 2 ครั้ง) และบริการล้างแอร์ไว้แล้ว ส่วนค่าไฟฟ้าคิดตามหน่วยจริง ${ELECTRICITY_RATE_PER_UNIT} บาท/หน่วย และค่าน้ำ ${WATER_RATE_PER_UNIT} บาท/หน่วย (แยกจากค่าเช่า ตามการใช้งานจริง) ไม่มีค่าส่วนกลางเพิ่มเติม`,
    a_en: `Rent includes Wi-Fi (AIS Fiber), common-area cleaning (twice a year), and A/C maintenance. Electricity and water are metered and billed separately by actual usage — ${ELECTRICITY_RATE_PER_UNIT} THB/unit and ${WATER_RATE_PER_UNIT} THB/unit. There is no additional common-area fee.`,
  },
  {
    id: 'size',
    q_th: 'ห้องขนาดเท่าไหร่?',
    q_en: 'How big is each unit?',
    a_th: '25.2 ตร.ม. สี่เหลี่ยมผืนผ้า · 1 ห้องนอน · 1 ห้องน้ำ · ตู้เก็บของอเนกประสงค์พร้อมเคาน์เตอร์วางไมโครเวฟ (ติดตู้เย็น) · ซิงก์ล้างจานที่ระเบียง · ระเบียงส่วนตัว · ทางเข้าทิศเหนือ–ระเบียงทิศใต้ รับลมธรรมชาติตลอดปี',
    a_en: '25.2 sqm rectangular plan · 1 bedroom · 1 bathroom · a multi-purpose storage cabinet with a microwave station next to the refrigerator · dish sink on the balcony · private balcony · north entrance, south balcony for year-round airflow.',
  },
  {
    id: 'kitchen',
    q_th: 'มีครัวไหม?',
    q_en: 'Is there a kitchen?',
    a_th: 'ไม่มีครัวเต็มรูปแบบหรือเตาทำอาหาร — ในห้องมีตู้เก็บของอเนกประสงค์ 2 บานเปิดเข้าหากึ่งกลาง พร้อมชั้นวางของภายใน 2 ชั้น และเคาน์เตอร์ด้านบนสำหรับวางไมโครเวฟ ตั้งอยู่ติดตู้เย็น ใช้เก็บของครัวหรือของใช้ส่วนตัวได้อย่างยืดหยุ่น ส่วนซิงก์ล้างจานอยู่ที่ระเบียง',
    a_en: 'There is no full kitchen or cooking stove — the room has a multi-purpose storage cabinet with two doors that open toward the centre, two internal shelves, and a countertop sized for a microwave, positioned next to the refrigerator. It flexibly stores kitchen items or personal belongings. The dish sink is on the balcony.',
  },
  // Owner-confirmed 2026-09-12, refined 2026-09-12 with the full allow/ban
  // breakdown. Rule is based on the EFFECT of the activity (smoke / oil
  // vapour / open flame / strong odour), not the energy source — an
  // induction stove and an air fryer have no open flame but are banned
  // anyway because of the heat/smell/oil vapour they produce. Rice cookers,
  // toasters, and other electric cooking appliances are explicitly
  // undecided pending an electrical-load/safety review — do not describe
  // them as either allowed or banned.
  {
    id: 'cooking',
    q_th: 'ทำอาหารในห้องได้ไหม?',
    q_en: 'Can I cook in the room?',
    a_th: 'อุ่นได้ เตรียมได้ เก็บได้ — ใช้ไมโครเวฟ กาต้มน้ำไฟฟ้า หรือเครื่องชงกาแฟได้ตามปกติ อุ่นข้าว อาหารกล่อง ซุปสำเร็จรูป หรือของแช่แข็งได้สบาย แต่ไม่อนุญาตให้ทอด ผัด เจียว ปิ้ง ย่าง คั่ว หรือทำอาหารที่มีควัน ไอน้ำมัน หรือกลิ่นแรง และห้ามใช้เตาแก๊ส เตาเปลวไฟ/เตาถ่าน/เตา Camping กระทะไฟฟ้าสำหรับทอด-ผัด หม้อทอดไร้น้ำมัน และเตาแม่เหล็กไฟฟ้า (แม้ไม่มีเปลวไฟ แต่ให้ความร้อน/กลิ่น/ไอน้ำมันสูง) ส่วนหม้อหุงข้าว เครื่องปิ้งขนมปัง และอุปกรณ์ทำอาหารไฟฟ้าอื่น ๆ อยู่ระหว่างตรวจสอบเรื่องโหลดไฟและกฎความปลอดภัยของอาคาร ยังไม่ยืนยัน',
    a_en: 'Yes, for heating, preparing, and storing food — a microwave, electric kettle, or coffee machine are fine, and you can reheat rice, boxed meals, instant soup, or frozen food. Frying, stir-frying, pan-frying, grilling, roasting, or any cooking that produces smoke, oil vapor, or strong smells is not permitted — this includes gas stoves, open-flame or charcoal stoves, camping stoves, electric frying pans used for frying, air fryers, and induction stoves (no open flame, but still high heat, smell, and oil vapor). Rice cookers, toasters, and other electric cooking appliances are still under review for electrical load and building safety rules.',
  },
  {
    id: 'smoking',
    q_th: 'สูบบุหรี่ได้ไหม?',
    q_en: 'Can I smoke?',
    a_th: 'ไม่อนุญาตให้สูบบุหรี่ภายในอาคารหรือในห้องพักทุกกรณี สูบได้เฉพาะในพื้นที่สูบบุหรี่ที่จัดไว้ให้เท่านั้น',
    a_en: 'Smoking is not allowed inside the building or in any unit — it is permitted only in the designated smoking area.',
  },
  {
    id: 'pets',
    q_th: 'รับสัตว์เลี้ยงไหม?',
    q_en: 'Are pets allowed?',
    a_th: `เลี้ยงได้ทั้งตึก ไม่กำหนดว่าชั้นไหน — ทุกห้องรับสัตว์เลี้ยงขนาดเล็ก–กลาง 1–2 ตัวต่อห้อง มีค่าสัตว์เลี้ยง ${PET_FEE_MONTHLY.toLocaleString('en-US')} บาท/ตัว/เดือน`,
    a_en: `Yes — pets are welcome throughout the entire building, with no floor restrictions. Small–medium pets, 1–2 per unit; the monthly fee is ${PET_FEE_MONTHLY.toLocaleString('en-US')} THB per pet.`,
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
    a_th: `ค่าใช้จ่ายวันเข้าอยู่มี 3 ส่วน — ค่าจอง ${BOOKING_FEE} บาท (ชำระผ่าน PromptPay ตอนกดจอง คืนได้หากแจ้งยกเลิกตามกำหนด แต่ริบหากไม่มาตามนัดโดยไม่แจ้งล่วงหน้า และหักลบเป็นส่วนหนึ่งของยอดด้านล่างเมื่อทำสัญญา) เงินประกันความเสียหาย 1 เดือน (เท่ากับค่าเช่าห้องนั้น คืนเต็มจำนวนเมื่อสิ้นสุดสัญญาหากไม่มีความเสียหายและไม่มีค้างชำระ) และค่าเช่าล่วงหน้า 1 เดือน`,
    a_en: `Move-in costs have three parts — a ${BOOKING_FEE} THB booking fee (paid via PromptPay when you book; refundable if you cancel with notice, forfeited on a no-show, and credited toward the total below once you sign), a one-month security deposit (equal to your unit's rent, fully refundable at lease end if there's no damage or unpaid balance), and one month of advance rent.`,
  },
  {
    id: 'parking',
    q_th: 'มีที่จอดรถไหม?',
    q_en: 'Is parking available?',
    a_th: `มีที่จอดรถสำหรับผู้พักอาศัยที่ลงทะเบียนรถ — พื้นที่จอดฟรีประมาณ ${PARKING_CAPACITY_APPROX} คันรอบอาคาร (จากทั้งหมด ${PROPERTY.totalUnits} ห้อง) ให้บริการแบบมาก่อนได้จอดก่อน ไม่ได้การันตีว่าทุกห้องจะมีที่จอดประจำ หากต้องการที่จอดแบบจองประจำ มีค่าบริการเพิ่มเดือนละ ${RESERVED_PARKING_FEE_MONTHLY} บาท`,
    a_en: `Yes — free parking is available for registered residents, with approximately ${PARKING_CAPACITY_APPROX} spaces around the building (out of ${PROPERTY.totalUnits} units total), on a first-come, first-served basis. A dedicated space per unit is not guaranteed. A reserved space is available for an additional ${RESERVED_PARKING_FEE_MONTHLY} THB/month.`,
  },
  {
    id: 'open',
    q_th: 'เปิดให้เข้าอยู่เมื่อไหร่?',
    q_en: 'When can I move in?',
    a_th: `เปิดให้จองตั้งแต่${AVAILABLE_FROM_LABEL.th} · พร้อมเข้าอยู่จริง${MOVE_IN_LABEL.th}`,
    a_en: `Reservations open ${AVAILABLE_FROM_LABEL.en} · actual move-in from ${MOVE_IN_LABEL.en}.`,
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
    q_th: 'อพาร์ทเม้นท์สายไหมอยู่แถวไหน?',
    q_en: 'Where is Nature Haven located?',
    a_th: 'Nature Haven เป็นอพาร์ทเมนท์สายไหมในกรุงเทพฯ ตั้งอยู่บนถนนเฉลิมพงษ์ ย่านสงบ เป็นส่วนตัว และเดินทางสะดวก',
    a_en: 'Nature Haven is an apartment in Sai Mai, Bangkok, on Chaloem Phong Road — a quiet, private neighborhood that is still well-connected.',
  },
  // Owner-confirmed 2026-09-12 — proactive disclosure so residents don't
  // mistake normal, out-of-our-control neighborhood ambience for a defect
  // in the building's own sound insulation.
  {
    id: 'ambientNoise',
    q_th: 'ห้องกันเสียงดีแค่ไหน มีเสียงรบกวนจากภายนอกไหม?',
    q_en: 'How soundproof are the rooms — is there any outside noise?',
    a_th: 'ห้องออกแบบมาเพื่อกันเสียงตั้งแต่โครงสร้าง — ผนังก่ออิฐมวลเบาฉาบทั้งสองด้านทุกห้อง ผนังกั้นห้องก่อเต็มความสูงและฉาบปิดช่องเหนือฝ้าเรียบร้อยทุกห้อง ประตูมียางกันเสียงและซีลหนา หน้าต่างกระจก 6 มิล อย่างไรก็ตาม ด้วยทำเลที่ตั้ง ผู้พักอาศัยอาจได้ยินเสียงจากภายนอกเป็นครั้งคราว เช่น เสียงพลุช่วงเทศกาลปีใหม่ (จากระยะไกล) เสียงสุนัขเห่า/หอนในบางวัน และเสียงเวทีดนตรีจากหมู่บ้านใกล้เคียงในบางโอกาส ทางโครงการแจ้งไว้ล่วงหน้าเพื่อให้ผู้สนใจเข้าอยู่ประเมินได้ตามความเหมาะสมก่อนตัดสินใจจอง',
    a_en: "Every unit is built for sound insulation from the structure up — plastered lightweight-brick partition walls on both sides in every room, built full-height and sealed above the ceiling line, plus sealed doors with thick rubber gaskets and 6mm glass windows. That said, given the surrounding area, residents may occasionally hear outside sounds — distant fireworks around the New Year holiday, occasional dog barking or howling on some days, and occasional live music from a neighboring village's event stage. We'd rather you know this before booking than be surprised by it after moving in.",
  },
] as const;

export type FaqItem = (typeof FAQ_ITEMS)[number];

// Nearby places + distances — moved here from LocationSection.tsx (was a
// component-local const), since the same distances are also stated in prose
// in src/content/journal/saimai-in-numbers.ts. That article isn't imported
// from here (it's editorial narrative, not a data consumer) — if a distance
// below ever changes, re-check that article by hand.
export const NEARBY_ESSENTIALS = [
  { name: 'Big C', distance: '280 m' },
  { name: 'CGH Sai Mai Hospital', distance: '300 m' },
  { name: 'Wongsakorn Market', distance: '700 m' },
  { name: 'Makro Sai Mai', distance: '750 m' },
  { name: 'BTS Khu Khot', distance: '5 km · ~15 min by taxi' },
] as const;

export const LIFESTYLE_SURROUNDINGS = [
  { name: 'Saimai Avenue', distance: '1 km' },
  { name: 'Maruay Market', distance: '4.4 km' },
  { name: 'AC Sai Mai Market', distance: '5 km' },
  { name: 'Foodland', distance: '3.3 km' },
  { name: 'Save One Go Market', distance: '7 km' },
  { name: 'Market Place Theprak', distance: '9.7 km' },
] as const;
