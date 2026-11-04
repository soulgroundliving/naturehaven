// Single source of truth for Nature Haven property data.
// FAQ UI (FAQSection.tsx) and route-specific JSON-LD (structuredData.ts)
// derive from here. When content changes, update here so schemas + UI stay in sync.

export const PROPERTY = {
  name: 'Nature Haven',
  legalName: 'The Green Haven',
  url: 'https://naturehaven-living.vercel.app',
  // Confirmed 2026-09-12 from the property's own Google Business listing
  // (maps.app.goo.gl/ZG7hr5w3du3CjXmeA → same pin as the coordinates below,
  // Nature Haven / naturehaven-living.vercel.app), house-number format
  // owner-confirmed as 21/2 — romanized here to match locality/region below.
  streetAddress: '21/2 Soi Chaloem Phong 21',
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
  // Booking opens December 2026 (availableFrom) and move-in is around March 2027 (moveInFrom) — owner 2026-10-11:
  // the structure is finished in November 2026, then December–February is the parking area, furniture, utilities,
  // floors and common areas. (2026-10-08 → 10-11 both were December: she could not confirm anything earlier.)
  // MONTH-LEVEL ONLY: the day is not confirmed, so '-01' below is a placeholder that only feeds
  // AggregateOffer.availabilityStarts in structuredData.ts (tools/test-landing-seo.mjs asserts it
  // stays '2026-12-01', so change that test too if this ever moves) and the month labels. Always
  // word it "expected" in copy. History: 2026-09-11/12 split Oct booking / 24 Nov move-in;
  // the 24 Nov day is retired (the Google Business listing still says it — owner edits that).
  availableFrom: '2026-12-01',
  moveInFrom: '2027-03-01',
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
// electricity and water are metered and billed separately.
// Common-area fee: the site said "none" until 2026-11-04, when the owner had it removed
// everywhere — the-green-haven product-facts §8 lists ค่าส่วนกลาง/ค่าขยะ as still undecided
// and marketing-hub lists a 40 THB/month garbage fee. Say nothing about it until DECISIONS.md does.
// Owner decision 2026-09-19: the public site does NOT show per-unit utility rates
// (say only "metered by actual usage" — the rates are answered on LINE), and does
// NOT say the Wi-Fi is "fiber" (no real service is installed yet, so it can't be claimed).

// Owner-confirmed 2026-09-27 — supersedes the 2026-09-11 figure of ~16.
// Parking now covers every unit (20 rooms, 20+ spaces): the site should state
// parking is sufficient for every unit rather than quoting the old shortfall.
export const PARKING_CAPACITY_APPROX = 20;

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
  th: 'เลี้ยงสัตว์ได้ทั้งตึก ไม่จำกัดชั้น — รับสุนัข (น้ำหนักตัวเต็มวัยไม่เกิน 15 กก. ตามมาตรฐานสายพันธุ์) แมว กระต่าย และหนูแฮมสเตอร์ 1 ตัวต่อห้องตามข้อบัญญัติ กทม.',
  en: 'Pet-friendly throughout the entire building — no floor restrictions. Dogs (up to 15 kg adult weight by breed standard), cats, rabbits and hamsters welcome, one per unit as the Bangkok pet ordinance sets.',
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
  'Free Wi-Fi',
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
    a_th: `ชั้น 3-4 เริ่มต้น ${PRICE_FROM.toLocaleString('en-US')} บาท/เดือน และชั้น 1-2 ${PRICE_TO.toLocaleString('en-US')} บาท/เดือน — ชั้นบนต้องเดินขึ้นไกลกว่า (ไม่มีลิฟต์) ค่าเช่าจึงถูกกว่า ราคานี้ยังไม่รวมค่าน้ำค่าไฟ ห้องว่างล่าสุด สอบถามได้ทาง LINE`,
    a_en: `From ${PRICE_FROM.toLocaleString('en-US')} THB/month on floors 3–4, and ${PRICE_TO.toLocaleString('en-US')} THB/month on floors 1–2 — the higher the floor (more stairs, no elevator), the lower the rent. Electricity and water are metered separately. Confirm current availability on LINE.`,
  },
  {
    id: 'inclusive',
    q_th: 'ค่าเช่ารวมอะไรบ้าง?',
    q_en: "What's included in the rent?",
    a_th: 'ค่าเช่ารวม Wi-Fi ทำความสะอาดในห้อง (ห้องมีสัตว์เลี้ยงทุก 3 เดือน ห้องทั่วไปทุก 6 เดือน) และล้างแอร์ (ห้องมีสัตว์เลี้ยงทุก 6 เดือน ห้องทั่วไปปีละครั้ง) ส่วนค่าน้ำค่าไฟแยกจากค่าเช่า คิดตามมิเตอร์ที่ใช้จริง',
    a_en: 'Rent includes Wi-Fi, in-unit cleaning (every 3 months for units with a pet, every 6 months without) and A/C servicing (every 6 months for units with a pet, yearly without). Electricity and water are metered and billed separately by actual usage.',
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
    a_th: 'ไม่มีครัวเต็มรูปแบบ และไม่มีเตาติดตั้งในห้อง ข้างตู้เย็นมีตู้เก็บของอเนกประสงค์ 2 บานเปิดเข้าหากึ่งกลาง ชั้นวางภายใน 2 ชั้น และเคาน์เตอร์ด้านบนไว้วางไมโครเวฟ ซิงก์ล้างจานอยู่ที่ระเบียง ทำอาหารเบา ๆ ด้วยเตาไฟฟ้าที่นำมาเองได้ (ดูข้อถัดไป)',
    a_en: 'There is no full kitchen and no built-in stove. Next to the refrigerator is a multi-purpose storage cabinet: two doors that open toward the center, two internal shelves, and a countertop sized for a microwave. The dish sink is on the balcony. Light cooking on an electric hob you bring yourself is allowed (see the next question).',
  },
  // Source of truth: the-green-haven house rules (Nest) §2.1–2.2, owner
  // decision 2026-09-21 — supersedes the 2026-09-12 blanket ban on induction
  // hobs. One electric / induction hob (1 burner, <= 1,500 W, bring your own)
  // is allowed; gas, grills and heavy-oil frying are not; strong odour/smoke
  // is out. Air fryers, rice cookers and toasters are NOT addressed by §2, so
  // this answer deliberately says nothing about them either way.
  {
    id: 'cooking',
    q_th: 'ทำอาหารในห้องได้ไหม?',
    q_en: 'Can I cook in the room?',
    a_th: 'ได้ แบบเบา ๆ — ห้องไม่มีครัวเต็มรูปแบบ แต่ใช้เตาไฟฟ้าหรือเตาแม่เหล็กไฟฟ้าได้ 1 หัว กำลังไม่เกิน 1,500 วัตต์ (นำมาเอง) พอสำหรับต้มและผัดตามปกติ และเป็นกำลังสูงสุดที่ระบบไฟของห้องรับได้อย่างปลอดภัย ห้ามใช้เตาแก๊ส เตาปิ้งย่าง และการทอดที่ใช้น้ำมันมาก ขอให้งดอาหารที่มีกลิ่นหรือควันแรงด้วย เพราะกลิ่นลอยไปตามทางเดินและระเบียงถึงเพื่อนบ้าน ส่วนอาหารสำเร็จรูป เดลิเวอรี และของที่ไม่ต้องปรุงด้วยความร้อน ทานได้ตามปกติ',
    a_en: 'Yes, lightly — there is no full kitchen, but you may use one electric or induction hob (a single burner, up to 1,500 W) that you bring yourself. That is enough for everyday boiling and stir-frying, and it is the most a room\'s electrical system can safely carry. Gas stoves, grills and deep or heavy-oil frying are not allowed, and please avoid cooking with strong odors or smoke — odors travel through the corridor and balconies to your neighbors. Ready-made meals, delivery and anything that needs no heating are always fine.',
  },
  {
    id: 'smoking',
    q_th: 'สูบบุหรี่ได้ไหม?',
    q_en: 'Can I smoke?',
    a_th: 'ห้ามสูบบุหรี่ในอาคารและในห้องทุกกรณี สูบได้เฉพาะจุดสูบบุหรี่ที่จัดไว้',
    a_en: 'Smoking is not allowed inside the building or in any unit — it is permitted only in the designated smoking area.',
  },
  {
    id: 'pets',
    q_th: 'รับสัตว์เลี้ยงไหม?',
    q_en: 'Are pets allowed?',
    a_th: `รับ — สุนัข แมว กระต่าย และหนูแฮมสเตอร์ เลี้ยงได้ทั้งตึก ไม่กำหนดว่าชั้นไหน สำหรับสุนัขเกณฑ์คือน้ำหนักตัวเต็มวัยตามมาตรฐานสายพันธุ์ ไม่เกิน 15 กก. (ไม่ใช่รายชื่อสายพันธุ์) 1 ตัวต่อห้องตามข้อบัญญัติ กทม. สัตว์ชนิดอื่นยังไม่รับ มีค่าสัตว์เลี้ยง ${PET_FEE_MONTHLY.toLocaleString('en-US')} บาท/ตัว/เดือน และขอให้ดูแลน้องและห้องให้สะอาด ไม่ให้มีกลิ่นรบกวนเพื่อนบ้าน`,
    a_en: `Yes — dogs, cats, rabbits and hamsters are welcome, on every floor. For dogs the criterion is full-grown weight by breed standard, up to 15 kg (we keep no list of breeds), and one pet per unit as the Bangkok pet ordinance sets. Other species are not accepted at this time. The monthly fee is ${PET_FEE_MONTHLY.toLocaleString('en-US')} THB per pet, and we ask you to keep the pet and the home clean so no smell reaches the neighbours.`,
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
    q_th: 'วันเข้าอยู่ต้องเตรียมเงินเท่าไหร่?',
    q_en: 'What deposit is required to move in?',
    a_th: `มี 3 ส่วน: ค่าจองคิว ${BOOKING_FEE} บาท · เงินประกันความเสียหาย 2 เดือน · ค่าเช่าล่วงหน้า 1 เดือน ค่าจองคิวชำระผ่าน PromptPay ตอนกดจอง และหักเป็นส่วนหนึ่งของยอดเมื่อทำสัญญา · คืนค่าจองคิวเต็มจำนวน: เมื่อเราไม่มีห้องในชั้นที่เลือก, การพิจารณาไม่ผ่าน, หรือเราเลื่อนวันเข้าอยู่แล้วคุณไม่อยากรอ (แจ้งขอคืนได้) · ไม่คืนค่าจองคิว: เมื่อยกเลิกเอง หรือไม่มาตามนัดโดยไม่แจ้งล่วงหน้า · เงินประกันเท่ากับค่าเช่าห้องนั้น 2 เดือน คืนเต็มจำนวนเมื่อจบสัญญา หากไม่มีความเสียหายและไม่มียอดค้าง`,
    a_en: `Three parts: a ${BOOKING_FEE} THB booking fee · a two-month security deposit · one month of advance rent. The booking fee is paid via PromptPay when you book and is credited toward the total once you sign. It is fully refunded if we can't offer a room on your chosen floor or your application isn't approved, and refunded in full on request if we push back the move-in date and you'd rather not wait. It is not refunded if you cancel on your own or don't show up without telling us. The deposit equals twice your unit's rent and is fully refundable at lease end if there's no damage or unpaid balance.`,
  },
  {
    id: 'parking',
    q_th: 'มีที่จอดรถไหม?',
    q_en: 'Is parking available?',
    a_th: `มีที่จอดรถเพียงพอสำหรับผู้พักอาศัยทุกห้อง — พื้นที่จอดฟรีรอบอาคารครอบคลุมทั้ง ${PROPERTY.totalUnits} ห้อง หากต้องการที่จอดแบบจองประจำ มีค่าบริการเพิ่มเดือนละ ${RESERVED_PARKING_FEE_MONTHLY} บาท`,
    a_en: `Yes — free parking is available for every resident, with enough spaces around the building to cover all ${PROPERTY.totalUnits} units. A reserved space is available for an additional ${RESERVED_PARKING_FEE_MONTHLY} THB/month.`,
  },
  {
    id: 'open',
    q_th: 'เปิดให้เข้าอยู่เมื่อไหร่?',
    q_en: 'When can I move in?',
    a_th: `คาดว่าเปิดจองช่วง${AVAILABLE_FROM_LABEL.th} และพร้อมเข้าอยู่ช่วง${MOVE_IN_LABEL.th} · ตอนนี้ตึกยังอยู่ระหว่างก่อสร้างและยังไม่มีห้องตัวอย่าง จะนัดชมห้องจริงเมื่อตึกเสร็จ`,
    a_en: `Reservations are expected to open from ${AVAILABLE_FROM_LABEL.en} and move-in from ${MOVE_IN_LABEL.en}. The building is still under construction and there is no sample room yet — viewings of the real rooms start once it is finished.`,
  },
  {
    id: 'contact',
    q_th: 'ติดต่อจองได้ทางไหน?',
    q_en: 'How do I reserve a unit?',
    a_th: 'ติดต่อทาง LINE เท่านั้น — กดปุ่ม "คุยกับเราทาง LINE" ตรงไหนก็ได้บนหน้าเว็บ แล้วเราดูแลต่อให้ทั้งหมด',
    a_en: 'LINE only — tap "Message us on LINE" anywhere on the site and we will take care of the rest.',
  },
  {
    id: 'elevator',
    q_th: 'มีลิฟต์ไหม?',
    q_en: 'Is there an elevator?',
    a_th: 'ไม่มีลิฟต์ อาคารสูง 4 ชั้น ขึ้นลงด้วยบันได ชั้นที่สูงกว่าจึงค่าเช่าเบากว่า',
    a_en: 'No elevator — the building is 4 floors, served by stairs, which is why the upper floors rent for less.',
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
    a_th: 'ห้องออกแบบมาเพื่อกันเสียงตั้งแต่โครงสร้าง — ผนังกั้นห้องทุกห้องเป็นอิฐมวลเบา ฉาบทั้งสองด้าน ก่อเต็มความสูงและฉาบปิดช่องเหนือฝ้า ประตูมียางกันเสียงและซีลหนา หน้าต่างกระจก 6 มม. อย่างไรก็ตาม ด้วยทำเลที่ตั้ง ผู้พักอาศัยอาจได้ยินเสียงจากภายนอกเป็นครั้งคราว เช่น เสียงพลุช่วงเทศกาลปีใหม่ (จากระยะไกล) เสียงสุนัขเห่า/หอนในบางวัน และเสียงเวทีดนตรีจากหมู่บ้านใกล้เคียงในบางโอกาส เราขอบอกไว้ก่อนจอง ดีกว่าให้มารู้หลังย้ายเข้า',
    a_en: "Every unit is built for sound insulation from the structure up — plastered lightweight-brick partition walls on both sides in every room, built full-height and sealed above the ceiling line, plus sealed doors with thick rubber gaskets and 6mm glass windows. That said, given the surrounding area, residents may occasionally hear outside sounds — distant fireworks around the New Year holiday, occasional dog barking or howling on some days, and occasional live music from a neighboring village's event stage. We'd rather you know this before booking than be surprised by it after moving in.",
  },
  // Owner-confirmed 2026-09-12 — proactive disclosure so prospective
  // residents self-select before booking rather than clash with the
  // quiet-community expectation after moving in.
  {
    id: 'noiseEtiquette',
    q_th: 'จัดปาร์ตี้หรือสังสรรค์เสียงดังได้ไหม?',
    q_en: 'Can I host parties or loud gatherings here?',
    a_th: 'Nature Haven เป็นที่พักอาศัย ไม่เหมาะกับการจัดปาร์ตี้หรือสังสรรค์เสียงดัง ย่านนี้เงียบ เราจึงอยากให้ช่วยกันรักษาไว้ ไม่ส่งเสียงรบกวนเพื่อนบ้าน โดยเฉพาะช่วงเวลาพักผ่อนของอาคาร 22:00–07:00 น. ให้ทุกคนพักได้อย่างสบายใจ',
    a_en: 'Nature Haven is a residential space first, not a venue for parties or loud gatherings. The surrounding community is quiet, so we ask every resident to help keep it that way — please avoid noise that could disturb neighbors, especially during the building\'s 22:00–07:00 quiet hours, so everyone can rest comfortably.',
  },
] as const;

export type FaqItem = (typeof FAQ_ITEMS)[number];

// Nearby places + distances — moved here from LocationSection.tsx (was a
// component-local const), since the same distances are also stated in prose
// in src/content/journal/saimai-in-numbers.ts. That article isn't imported
// from here (it's editorial narrative, not a data consumer) — if a distance
// below ever changes, re-check that article by hand.
// Thai names follow the saimai-in-numbers article; brand names stay in Latin script.
export const NEARBY_ESSENTIALS = [
  { name: { en: 'Big C', th: 'Big C' }, distance: { en: '280 m', th: '280 ม.' } },
  { name: { en: 'CGH Sai Mai Hospital', th: 'โรงพยาบาล CGH สายไหม' }, distance: { en: '300 m', th: '300 ม.' } },
  { name: { en: 'Wongsakorn Market', th: 'ตลาดวงศกร' }, distance: { en: '700 m', th: '700 ม.' } },
  { name: { en: 'Makro Sai Mai', th: 'Makro สายไหม' }, distance: { en: '750 m', th: '750 ม.' } },
  { name: { en: 'BTS Khu Khot', th: 'BTS คูคต' }, distance: { en: '5 km · ~15 min by taxi', th: '5 กม. · แท็กซี่ราว 15 นาที' } },
] as const;

export const LIFESTYLE_SURROUNDINGS = [
  { name: { en: 'Saimai Avenue', th: 'Saimai Avenue' }, distance: { en: '1 km', th: '1 กม.' } },
  { name: { en: 'Maruay Market', th: 'ตลาดมารวย' }, distance: { en: '4.4 km', th: '4.4 กม.' } },
  { name: { en: 'AC Sai Mai Market', th: 'ตลาดเอซี สายไหม' }, distance: { en: '5 km', th: '5 กม.' } },
  { name: { en: 'Foodland', th: 'Foodland' }, distance: { en: '3.3 km', th: '3.3 กม.' } },
  { name: { en: 'Save One Go Market', th: 'Save One Go Market' }, distance: { en: '7 km', th: '7 กม.' } },
  { name: { en: 'Market Place Theprak', th: 'Market Place Theprak' }, distance: { en: '9.7 km', th: '9.7 กม.' } },
] as const;
