import type { Lang } from '@/contexts/LanguageContext';
import {
  UNITS,
  PRICE_FROM,
  PRICE_TO,
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
    sectionsLabel: { en: 'Page sections', th: 'ส่วนต่าง ๆ ของหน้า' },
    // SectionDots, in SECTION_IDS order
    sections: {
      en: ['Hero', 'Philosophy', 'Lookbook', 'Residences', 'Amenities', 'Journal', 'Location', 'Smart Living', 'FAQ', 'Contact'],
      th: ['หน้าแรก', 'ปรัชญา', 'คอลเลกชัน', 'ห้องพัก', 'บริการ', 'บันทึก', 'ทำเล', 'Smart Living', 'คำถาม', 'ติดต่อ'],
    },
    links: {
      en: ['PHILOSOPHY', 'LOOKBOOK', 'RESIDENCES', 'AMENITIES', 'JOURNAL', 'LOCATION', 'CONTACT'],
      th: ['ปรัชญา', 'คอลเลกชัน', 'ห้องพัก', 'บริการ', 'บันทึก', 'ทำเล', 'ติดต่อ'],
    },
  },
  cta: {
    mobileBar: {
      en: 'Message us on LINE',
      th: 'คุยกับเราทาง LINE',
    },
  },
  links: {
    subtitle: { en: 'Every way to reach us, in one place', th: 'รวมทุกช่องทางไว้ที่เดียว' },
    pageDescription: {
      en: 'All Nature Haven channels — LINE, the Journal, the site, and directions — in one link.',
      th: 'รวมทุกช่องทางของ Nature Haven — LINE, บันทึกจากเฮเวน, เว็บไซต์ และแผนที่ — ไว้ในลิงก์เดียว',
    },
    heroHeading: {
      en: `Reservations expected from ${AVAILABLE_FROM_LABEL.en} · move-in around ${MOVE_IN_LABEL.en}`,
      th: `คาดว่าเปิดจอง${AVAILABLE_FROM_LABEL.th} · เข้าอยู่ช่วง${MOVE_IN_LABEL.th}`,
    },
    // First screen (2026-11-04): say what this is, what it costs and why it is different before
    // asking a question. Every fact is an existing constant or existing site copy.
    pitch: { en: 'A pet-friendly apartment building in Sai Mai', th: 'อพาร์ทเม้นท์\u200bเลี้ยงสัตว์ได้ทั้งตึก ในสายไหม' },
    sizePrice: {
      en: `${UNITS[0].sqm} sqm rooms · from ${PRICE_FROM.toLocaleString('en-US')} THB/month`,
      th: `ห้อง ${UNITS[0].sqm} ตร.ม. · เริ่มต้น ${PRICE_FROM.toLocaleString('en-US')} บาท/เดือน`,
    },
    // U+200B marks where a label may wrap; each part stays whole (LinksPage phrases())
    proofPets: { en: 'Pets on every floor', th: 'เลี้ยงสัตว์ได้\u200bทุกชั้น' },
    // Not 'no common fee': see the common-area fee note in propertyFacts.ts
    proofCleaning: { en: 'Cleaning included', th: 'รวม\u200bทำความสะอาด' },
    proofBalcony: { en: 'Private balcony', th: 'ระเบียง\u200bส่วนตัว' },
    enterSite: { en: 'See the full website', th: 'ดูเว็บไซต์เต็ม' },
    sectionExplore: { en: 'Look around', th: 'สำรวจ' },
    sectionFollow: { en: 'Follow the build', th: 'ติดตามการสร้าง' },
    heroBody: {
      en: 'Build updates and room facts — as they happen.',
      th: 'อัปเดตการก่อสร้างและข้อมูลห้อง ตามที่เกิดขึ้นจริง',
    },
    footerTagline: { en: 'Live with Nature', th: 'Live with Nature' },
    lineQuickIntro: { en: 'Or start with one of these on LINE', th: 'หรือเริ่มด้วยข้อความเหล่านี้ใน LINE' },
    lineQuickPrice: { en: 'Ask pricing', th: 'ถามราคาห้อง' },
    lineQuickPriceMsg: { en: "Hi! I'd like to ask about room pricing.", th: 'สวัสดีครับ/ค่ะ ขอสอบถามราคาห้องพักหน่อยครับ/ค่ะ' },
    lineQuickVacancy: { en: 'Ask booking', th: 'ถามเรื่องจอง' },
    lineQuickVacancyMsg: { en: "Hi! I'd like to ask about reserving a room.", th: 'สวัสดีครับ/ค่ะ อยากสอบถามเรื่องการจองห้องครับ/ค่ะ' },
    lineQuickTour: { en: 'Room details', th: 'ขอรายละเอียดห้อง' },
    lineQuickTourMsg: { en: "Hi! Could you tell me more about the rooms?", th: 'สวัสดีครับ/ค่ะ ขอทราบรายละเอียดห้องหน่อยครับ/ค่ะ' },
    addLine: { en: 'Add us on LINE', th: 'เพิ่มเพื่อนใน LINE' },
    groupPrimary: { en: 'Contact and rooms', th: 'ติดต่อและห้องพัก' },
    groupChannels: { en: 'Social channels and map', th: 'ช่องทางออนไลน์และแผนที่' },
    groupEditorial: { en: 'Journal', th: 'บันทึกจากเฮเวน' },
    website: { en: 'Website', th: 'เว็บไซต์' },
    websiteSub: { en: 'Nature Haven home page', th: 'หน้าหลัก Nature Haven' },
    filmBrand: 'Nature Haven',
    filmBrandTh: 'เนเจอร์เฮฟเว่น',
    filmTitle: { en: 'What is Nature Haven', th: 'What is Nature Haven' },
    filmSub: { en: 'A short film', th: 'คลิปแนะนำสั้น ๆ' },
    filmPlay: { en: 'Play', th: 'เล่นคลิป' },
    filmClose: { en: 'Close video', th: 'ปิดวิดีโอ' },
    menuAria: { en: 'Open site menu', th: 'เปิดเมนูเว็บไซต์' },
    menuTitle: { en: 'Website menu', th: 'เมนูเว็บไซต์' },
    menuClose: { en: 'Close menu', th: 'ปิดเมนู' },
    designNotes: { en: 'Design Notes #01', th: 'Design Notes #01' },
    designNotesSub: { en: 'Our pick to read', th: 'บทความที่อยากแนะนำ' },
    // Short on purpose: at the narrowest phones (320px) the card's text
    // column is ~65px, and "Recommended" alone (11 letters) doesn't fit on
    // one line there and breaks mid-word ("Recommende" / "d"). "Featured"
    // (8 letters) fits cleanly at every width "Instagram" (9) already does.
    recommendedArticle: { en: 'Featured', th: 'บทความแนะนำ' },
    line: { en: 'Message us on LINE', th: 'คุยกับเราทาง LINE' },
    lineSub: { en: 'Ask us anything', th: 'ถามได้ทุกเรื่อง' },
    instagram: { en: 'Instagram', th: 'Instagram' },
    instagramSub: { en: 'Photos and mood', th: 'ภาพและบรรยากาศ' },
    facebook: { en: 'Facebook', th: 'Facebook' },
    facebookSub: { en: 'Build progress', th: 'ความคืบหน้าโครงการ' },
    tiktok: { en: 'TikTok', th: 'TikTok' },
    tiktokSub: { en: 'Short project clips', th: 'คลิปสั้นจากโครงการ' },
    journal: { en: 'The Haven Journal', th: 'บันทึกจากเฮเวน' },
    journalSub: { en: 'Articles and stories', th: 'บทความและเรื่องราว' },
    journalHub: { en: 'The Haven Journal', th: 'บันทึกจากเฮเวน' },
    rooms: { en: 'Rooms', th: 'ห้องและราคา' },
    roomsSub: { en: 'Details and pricing', th: 'รายละเอียดและราคา' },
    newTab: { en: '(opens in a new tab)', th: '(เปิดในแท็บใหม่)' },
    aiNote: { en: 'Images are AI-generated visualizations (except the map)', th: 'ภาพประกอบเป็นภาพจำลองด้วย AI (ยกเว้นแผนที่)' },
    maps: { en: 'Get directions', th: 'ดูแผนที่ / นำทาง' },
    mapsSub: { en: 'Location and route', th: 'ที่ตั้งและการเดินทาง' },
    googleMap: { en: 'Google Maps', th: 'Google Maps' },
    // Chat-first Contact tab (2026-09-30). The Thai side of each `q*` entry is always what
    // actually gets SENT to Green (the LINE bot reads Thai keywords only) — the English side
    // is a gloss for EN-language visitors, never sent. Every Thai string here was run through
    // the-green-haven's real classifier before shipping (see project memory for the mapping);
    // re-verify against a fresh `functions/_greenIntent.js` before editing any of them, since
    // Green's keyword rules change independently of this site.
    chatPrompt: { en: 'What would you like to know first?', th: 'อยากรู้เรื่องไหนก่อน?' },
    chatHint: { en: 'Opens LINE with this message ready — tap send there.', th: 'เปิด LINE พร้อมข้อความนี้ แล้วกดส่งได้เลย' },
    chatSend: { en: 'Send in LINE', th: 'ส่งใน LINE' },
    chatOther: { en: 'Or pick another question', th: 'หรือเลือกคำถามอื่น' },
    qProject: { en: 'The project', th: 'ขอรายละเอียดโครงการ' },
    // "NEST" (not "Nature Nest") is the owner-ratified public building name — matches the live
    // Journal article's own spelling. Keep it on price/availability (scopes the answer to that
    // one building); keep it OFF qProject (a building name there narrows the 6-card overview
    // down to one building's own carousel instead).
    qPrice: { en: 'Room prices', th: 'ราคาห้อง NEST' },
    qAvailability: { en: 'Availability', th: 'มีห้องว่างไหม NEST' },
    qPets: { en: 'Pets allowed?', th: 'เลี้ยงสัตว์ได้ไหม' },
    qLocation: { en: 'Location', th: 'ที่ตั้งอยู่ไหน' },
    qBooking: { en: 'Booking opens', th: 'เปิดจองเมื่อไหร่' },
    qNearby: { en: "What's nearby?", th: 'หาในย่าน' },
    nestStory: { en: 'Why "NEST"?', th: 'ทำไมชื่อ NEST' },
    nestStorySub: { en: "The founder's story", th: 'เรื่องราวจากผู้ก่อตั้ง' },
    watchFilm: { en: 'What is Nature Haven — watch the film', th: 'What is Nature Haven — ดูคลิปแนะนำ' },
  },
  journal: {
    navLabel: { en: 'Journal', th: 'บันทึกจากเฮเวน' },
    sectionLabel: { en: 'The Haven Journal', th: 'บันทึกจากเฮเวน' },
    sectionHeadline: {
      en: 'Notes on quiet living,\nwritten while we build',
      th: 'เรื่องของการอยู่อย่างสงบ\nเขียนระหว่างที่เราสร้าง',
    },
    indexIntro: {
      en: `Stories from the making of Nature Haven — quiet living, life with pets, the neighbourhood, and honest build diaries on the road to move-in, expected ${MOVE_IN_LABEL.en}.`,
      th: `เรื่องเล่าระหว่างที่เราสร้าง Nature Haven — การอยู่อย่างสงบ ชีวิตกับสัตว์เลี้ยง ย่านสายไหม และบันทึกการสร้างตามจริง ไปจนถึงวันเข้าอยู่ ซึ่งคาดไว้ช่วง${MOVE_IN_LABEL.th}`,
    },
    readAll: { en: 'Read all stories', th: 'อ่านบทความทั้งหมด' },
    filterAll: { en: 'All', th: 'ทั้งหมด' },
    filterLabel: { en: 'Filter by category', th: 'กรองตามหมวด' },
    readMin: { en: 'min read', th: 'นาที' },
    byLine: { en: 'By the Nature Haven team', th: 'โดยทีม Nature Haven' },
    // The page-by-page reader of an article that has one (article.guide): the button that opens it, and its page count.
    guide: {
      open: { en: 'Read page by page', th: 'อ่านทีละหน้า' },
      pages: { en: 'pages', th: 'หน้า' },
    },
    backHome: { en: 'Home', th: 'หน้าแรก' },
    related: { en: 'More from the Journal', th: 'อ่านต่อในบันทึกจากเฮเวน' },
    ctaTitle: { en: 'Questions about the room?', th: 'มีคำถามเกี่ยวกับห้องไหม?' },
    ctaBody: {
      en: `Message us on LINE — move-in expected from ${MOVE_IN_LABEL.en}.`,
      th: `ถามเราได้ทาง LINE — คาดว่าเข้าอยู่ได้ตั้งแต่${MOVE_IN_LABEL.th}`,
    },
    ctaButton: { en: 'Message us on LINE', th: 'คุยกับเราทาง LINE' },
    share: {
      label: { en: 'Share', th: 'แชร์' },
      copyLink: { en: 'Copy link', th: 'คัดลอกลิงก์' },
      copied: { en: 'Copied!', th: 'คัดลอกแล้ว' },
    },
    // Chrome strings for the article block renderer (src/components/journal/).
    blocks: {
      toc: { en: 'On this page', th: 'สารบัญ' },
      galleryPrev: { en: 'Previous', th: 'ก่อนหน้า' },
      galleryNext: { en: 'Next', th: 'ถัดไป' },
      interactiveTag: { en: 'Interactive', th: 'ลองเล่น' },
      interactiveLoading: { en: 'Loading…', th: 'กำลังโหลด…' },
      interactiveFailed: {
        en: 'This interactive piece could not load. The description above still applies.',
        th: 'ส่วนนี้โหลดไม่สำเร็จ อ่านคำอธิบายด้านบนแทนได้',
      },
      renderBadge: { en: '3D render', th: 'ภาพเรนเดอร์ 3 มิติ' },
      // Shown when a callout has a tone but no title, so the tone is never conveyed by colour alone.
      tone: {
        tip: { en: 'Tip', th: 'เคล็ดลับ' },
        caution: { en: 'Caution', th: 'ข้อควรระวัง' },
      },
    },
  },
  lookbook: {
    sectionLabel: { en: 'The Architectural Lookbook', th: 'The Architectural Lookbook' },
    sectionHeadline: {
      en: 'Five collections\nof thoughtfulness.',
      th: 'ห้าเรื่องเล็ก ๆ\nที่เราใส่ใจ',
    },
    intro: {
      en: 'Not a spec sheet — a lookbook. Every considered detail of the residence, arranged as five small collections you can wander through, one at a time.',
      th: 'ไม่ใช่ตารางสเปก แต่คือรายละเอียดที่เราคิดไว้ ห้าเรื่อง ค่อย ๆ เปิดดูทีละเรื่อง',
    },
    collectionWord: { en: 'Collection', th: 'คอลเลกชัน' },
    openCollection: { en: 'View the collection', th: 'เปิดดูคอลเลกชัน' },
    backToLookbook: { en: 'The Lookbook', th: 'The Lookbook' },
    prevCollection: { en: 'Previous', th: 'ก่อนหน้า' },
    nextCollection: { en: 'Next collection', th: 'คอลเลกชันถัดไป' },
    detailsWord: { en: 'The details', th: 'รายละเอียดทั้งหมด' },
    ctaTitle: { en: 'Want to know more about these details?', th: 'อยากรู้รายละเอียดเหล่านี้เพิ่มไหม?' },
    ctaBody: {
      en: 'Ask us anything — message us on LINE.',
      th: 'ถามเราได้ทุกเรื่องทาง LINE',
    },
    ctaButton: { en: 'Message us on LINE', th: 'คุยกับเราทาง LINE' },
  },
  hero: {
    labelWords: {
      en: ['A', 'Quiet', 'Living', 'Residence', '·', 'Pet-Friendly', '·', 'Saimai,', 'Bangkok'],
      th: ['Quiet', 'Living', 'Residence', '·', 'เลี้ยงสัตว์ได้ทั้งตึก', '·', 'สายไหม', 'กรุงเทพฯ'],
    },
    subtitle: {
      en: 'A residence shaped by intention — where life, and the ones you love, gently return to a natural rhythm.',
      th: 'ที่พักที่คิดมาทุกจุด ให้ชีวิตและสัตว์เลี้ยงที่คุณรักค่อย ๆ กลับสู่จังหวะที่เป็นธรรมชาติ',
    },
    // The four facts a visitor needs on the first screen: what, where, size,
    // price. Price is the floor range, not "เริ่ม" (an open owner question).
    facts: {
      en: [`Pet-friendly apartments · Sai Mai, Bangkok`, `25.2 sqm · ${PRICE_FROM.toLocaleString('en-US')}–${PRICE_TO.toLocaleString('en-US')} THB/month`],
      th: [`อพาร์ทเม้นท์เลี้ยงสัตว์ได้ทั้งตึก · สายไหม`, `25.2 ตร.ม. · ${PRICE_FROM.toLocaleString('en-US')}–${PRICE_TO.toLocaleString('en-US')} บาท/เดือน`],
    },
    // "Expected": the move-in month is a forecast, not a promise.
    moveIn: {
      en: `Move-in expected ${MOVE_IN_LABEL.en}`,
      th: `คาดว่าเข้าอยู่ได้ ${MOVE_IN_LABEL.th}`,
    },
    scroll: { en: 'Scroll to explore', th: 'เลื่อนเพื่อสำรวจ' },
  },
  about: {
    philosophyLabel: { en: 'Our Philosophy', th: 'ปรัชญาของเรา' },
    philosophyHeadline: {
      en: 'True comfort is\nnever excessive.',
      th: 'ความสบายที่แท้จริง\nอยู่ที่ความพอดี',
    },
    philosophyBody: {
      en: 'It is found in stillness — in spaces that are thoughtfully designed, and in a quiet balance that allows each day to unfold with ease.',
      th: 'อยู่ในความเงียบ ในห้องที่วางมาพอดี และในวันที่ไม่ต้องรีบ',
    },
    aboutLabel: { en: 'About', th: 'เกี่ยวกับเรา' },
    aboutHeadline: {
      en: 'A newly built private\nresidence inspired\nby MUJI minimal living.',
      th: 'ที่พักสร้างใหม่\nเป็นส่วนตัว\nในแบบมินิมอล',
    },
    aboutBody: {
      en: `Designed for calm, crafted for privacy, and quietly connected to Sai Mai Road. Expected from ${MOVE_IN_LABEL.en}.`,
      th: `ตั้งอยู่ในสายไหม ออกแบบเพื่อความสงบและความเป็นส่วนตัว คาดว่าพร้อมเข้าอยู่${MOVE_IN_LABEL.th}`,
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
      th: 'ห้องที่อยู่ได้ทุกวันอย่างสบาย — และอยู่ได้อีกนาน',
    },
    decisionTitle: { en: 'The essentials, before you ask.', th: 'ข้อมูลสำคัญ ก่อนตัดสินใจ' },
    decisionIntro: {
      en: 'A clear starting point for your first conversation. Current availability and exact move-in figures are confirmed privately on LINE.',
      th: 'เริ่มคุยจากตรงนี้ได้ ส่วนห้องว่างและยอดเงินวันเข้าอยู่ เราแจ้งให้ทราบทาง LINE',
    },
    decisionPriceLabel: { en: 'Rent, by floor', th: 'ค่าเช่าตามชั้น' },
    decisionPriceDetail: {
      en: `Floors 3–4: ${PRICE_FROM.toLocaleString('en-US')} · Floors 1–2: ${PRICE_TO.toLocaleString('en-US')}.`,
      th: `ชั้น 3-4: ${PRICE_FROM.toLocaleString('en-US')} · ชั้น 1-2: ${PRICE_TO.toLocaleString('en-US')} บาท`,
    },
    decisionSizeLabel: { en: 'Room size', th: 'ขนาดห้อง' },
    decisionSizeDetail: { en: 'One bedroom, one bathroom, multi-purpose storage cabinet and private balcony.', th: '1 ห้องนอน 1 ห้องน้ำ ตู้เก็บของอเนกประสงค์ และระเบียงส่วนตัว' },
    decisionLeaseLabel: { en: 'Lease', th: 'สัญญาเช่า' },
    decisionLeaseDetail: { en: 'Annual contract; move-in costs are below.', th: 'สัญญารายปี ค่าใช้จ่ายวันเข้าอยู่ดูด้านล่าง' },
    decisionMoveinLabel: { en: 'Move-in', th: 'พร้อมเข้าอยู่' },
    decisionMoveinDetail: {
      en: `Expected from ${MOVE_IN_LABEL.en}.`,
      th: `คาดว่า${MOVE_IN_LABEL.th}`,
    },
    decisionIncludedLabel: { en: 'Monthly rate', th: 'ค่าเช่ารายเดือน' },
    decisionIncludedDetail: {
      en: 'Wi-Fi, cleaning & A/C included. Electricity and water are metered separately, by actual usage.',
      th: 'รวม Wi-Fi ทำความสะอาด ล้างแอร์ · ค่าน้ำค่าไฟแยกตามมิเตอร์ที่ใช้จริง',
    },
    decisionCostNote: {
      en: `Move-in costs: a ${BOOKING_FEE} THB booking fee (credited toward the total once you sign), a two-month security deposit, and one month of advance rent.`,
      th: `ค่าใช้จ่ายวันเข้าอยู่: ค่าจอง ${BOOKING_FEE} บาท (หักเป็นส่วนหนึ่งของยอดเมื่อทำสัญญา) เงินประกันความเสียหาย 2 เดือน และค่าเช่าล่วงหน้า 1 เดือน`,
    },
    suitableForTitle: { en: 'Suitable For', th: 'เหมาะสำหรับ' },
    suitableFor: {
      en: [
        '1–2 residents',
        'Working professionals',
        'Couples',
        'Those who value quiet living',
        'Pet owners',
        'Those looking for a long-term stay',
        'Those who enjoy simple home cooking',
      ],
      th: [
        '1–2 คน',
        'คนทำงาน',
        'คู่รัก',
        'คนที่ชอบความสงบ',
        'คนเลี้ยงสัตว์',
        'คนที่อยากอยู่ยาว',
        'คนที่ชอบทำอาหารง่าย ๆ',
      ],
    },
    spaceTitle: { en: 'Space & Layout', th: 'พื้นที่และผังห้อง' },
    sqm: { en: 'sq.m.', th: 'ตร.ม.' },
    bedroom: { en: '1 Bedroom / 1 Bathroom', th: '1 ห้องนอน / 1 ห้องน้ำ' },
    kitchen: { en: 'Storage cabinet + microwave station, sink on the balcony', th: 'ตู้เก็บของอเนกประสงค์และที่วางไมโครเวฟ ซิงก์อยู่ที่ระเบียง' },
    unitsTotal: { en: 'units total', th: 'ห้อง' },
    floors: { en: 'floors', th: 'ชั้น' },
    termsTitle: { en: 'Terms', th: 'เงื่อนไข' },
    contractLabel: { en: 'Contract', th: 'สัญญา' },
    contractValue: { en: 'Annual (12 months)', th: 'รายปี (12 เดือน)' },
    moveinLabel: { en: 'Move-in', th: 'ชำระวันเข้าอยู่' },
    moveinValue: {
      en: `${BOOKING_FEE} THB booking fee + 2 mo. deposit + 1 mo. advance`,
      th: `ค่าจอง ${BOOKING_FEE} บาท + เงินประกัน 2 เดือน + ค่าเช่าล่วงหน้า 1 เดือน`,
    },
    availableLabel: { en: 'Available from', th: 'พร้อมเข้าอยู่' },
    availableValue: { en: MOVE_IN_LABEL.en, th: MOVE_IN_LABEL.th },
    utilitiesLabel: { en: 'Utilities', th: 'ค่าน้ำ-ค่าไฟ' },
    utilitiesValue: {
      en: 'Metered separately, by actual usage',
      th: 'แยกตามมิเตอร์ที่ใช้จริง',
    },
    parkingLabel: { en: 'Parking', th: 'ที่จอดรถ' },
    parkingValue: {
      en: `Enough spaces for all ${PARKING_CAPACITY_APPROX} units`,
      th: `เพียงพอสำหรับทุกห้อง (${PARKING_CAPACITY_APPROX} ห้อง)`,
    },
    allinclusive: {
      en: 'Wi-Fi, cleaning & A/C service are included in the rent. Electricity and water are metered separately.',
      th: 'ค่าเช่ารวม Wi-Fi ทำความสะอาด และล้างแอร์ไว้แล้ว ส่วนค่าน้ำค่าไฟคิดตามหน่วยจริงแยกต่างหาก',
    },
    pricingLabel: { en: 'Pricing', th: 'ราคา' },
    pricingNote: { en: 'By floor · opening rate', th: 'ตามชั้น · ราคาเปิดตัว' },
    floorTierUpper: { en: 'Floors 3–4', th: 'ชั้น 3-4' },
    floorTierLower: { en: 'Floors 1–2', th: 'ชั้น 1-2' },
    floorTierUpperNote: { en: 'More stairs, no elevator — the entry rate.', th: 'เดินขึ้นมากกว่า ไม่มีลิฟต์ — ราคาเริ่มต้น' },
    floorTierLowerNote: { en: 'Closer to the entrance.', th: 'ใกล้ทางเข้ามากกว่า' },
    privateBody: {
      en: 'Rates above are by floor, all-in before utilities.',
      th: 'ราคาข้างต้นแยกตามชั้น ยังไม่รวมค่าน้ำค่าไฟ',
    },
    openingRate: { en: 'Opening Rate', th: 'ราคาเปิดตัว' },
    petsEverywhere: { en: 'Pet-friendly — the whole building', th: 'อพาร์ทเมนท์เลี้ยงสัตว์ได้ทั้งตึก' },
    petsEverywhereSub: { en: 'No floor restrictions — dogs (up to 15 kg), cats, rabbits and hamsters (one per unit, per the Bangkok pet ordinance) are welcome in every home, on every floor.', th: 'ทุกห้องทุกชั้นรับสุนัข (ไม่เกิน 15 กก.) แมว กระต่าย และหนูแฮมสเตอร์ 1 ตัวต่อห้องตามข้อบัญญัติ กทม.' },
    // "Pets we welcome" card — source: house rules (Nest) §4.2–4.6 + pet guide,
    // owner decision 2026-09-21. The test is adult weight by breed standard,
    // never a list of breeds. The floor tips are the guide's recommendations
    // (not rules) and are worded as such.
    petsWelcome: {
      label: { en: 'Pets we welcome', th: 'รับสัตว์อะไรบ้าง' },
      title: {
        en: 'Dogs, cats, rabbits and hamsters — small to medium, at home in 25 sqm.',
        th: 'สุนัข แมว กระต่าย และหนูแฮมสเตอร์ ตัวเล็กถึงกลาง ที่อยู่สบายในห้อง 25 ตร.ม.',
      },
      weightNum: { en: '15', th: '15' },
      weightUnit: { en: 'kg', th: 'กก.' },
      weightCaption: { en: 'full-grown, by breed standard', th: 'ตัวเต็มวัย ตามมาตรฐานสายพันธุ์' },
      lead: {
        en: 'We accept dogs, cats, rabbits and hamsters — other species not at this time. We keep no list of approved breeds: a full-grown dog weighs up to 15 kg by its breed standard, checked on the day you register. We measure the adult because a 4 kg puppy today can be 30 kg next year — and one pet per home, as the Bangkok pet ordinance sets.',
        th: 'เรารับสุนัข แมว กระต่าย และหนูแฮมสเตอร์ (ชนิดอื่นยังไม่รับ) ไม่มีรายชื่อสายพันธุ์ สุนัขมีเกณฑ์เดียว คือน้ำหนักตัวเต็มวัยตามมาตรฐานสายพันธุ์ไม่เกิน 15 กก. พิจารณา ณ วันลงทะเบียน ที่วัดตัวเต็มวัยเพราะลูกสุนัข 4 กก. วันนี้ อาจเป็น 30 กก. ในปีหน้า และเลี้ยงได้ 1 ตัวต่อห้องตามข้อบัญญัติ กทม.',
      },
      groups: {
        en: [
          {
            title: 'Dogs',
            body: 'A small-to-medium dog fits a 25.2 sqm home the way it fits a person: a bed of its own, a private balcony, and a flight of stairs that is easy to climb together — the building has no elevator. Dogs that go out for two or more walks a day are happiest on floors 1–2 (a suggestion, not a rule).',
          },
          {
            title: 'Cats',
            body: 'Cats suit a home this size, and floors 3–4 are quieter for them (again, a suggestion). From the second floor up we ask for a fall-safe balcony net within 14 days of moving in, and we help arrange the installer.',
          },
          {
            title: 'Before move-in',
            body: 'Register every pet with its vaccination book in the app before you move in. We ask that a pet does not bark or cry continuously, and that you keep the pet and your home clean so no smell reaches the neighbours — the walls are built for quiet, and the neighbours are part of the home too.',
          },
        ],
        th: [
          {
            title: 'สุนัข',
            body: 'สุนัขตัวเล็กถึงกลางอยู่ในห้อง 25.2 ตร.ม. ได้พอดีตัว มีที่นอนของตัวเอง มีระเบียงส่วนตัว และบันไดที่ขึ้นลงด้วยกันได้สบาย (อาคารไม่มีลิฟต์) น้องที่ออกเดินวันละ 2 รอบขึ้นไปอยู่ชั้น 1–2 จะสบายกว่า (เป็นคำแนะนำ ไม่ใช่ข้อบังคับ)',
          },
          {
            title: 'แมว',
            body: 'แมวเหมาะกับห้องขนาดนี้ และชั้น 3–4 เงียบกว่าสำหรับน้อง (เป็นคำแนะนำเช่นกัน) ตั้งแต่ชั้น 2 ขึ้นไป ขอให้ติดตาข่ายกันตกที่ระเบียงภายใน 14 วันหลังเข้าอยู่ เราช่วยหาช่างให้',
          },
          {
            title: 'ก่อนย้ายเข้า',
            body: 'ลงทะเบียนน้องทุกตัวพร้อมสมุดวัคซีนในแอปก่อนเข้าอยู่ ขอให้น้องไม่เห่าหรือร้องต่อเนื่อง และดูแลน้องกับห้องให้สะอาด ไม่ให้กลิ่นไปถึงเพื่อนบ้าน ผนังของเราสร้างมาเพื่อความเงียบ และเพื่อนบ้านก็เป็นส่วนหนึ่งของบ้านเช่นกัน',
          },
        ],
      },
    },
    petFeeNote: {
      en: `Monthly pet fee: ${PET_FEE_MONTHLY.toLocaleString('en-US')} THB per pet.`,
      th: `ค่าสัตว์เลี้ยง ${PET_FEE_MONTHLY.toLocaleString('en-US')} บาท/ตัว/เดือน`,
    },
    floorWord: { en: 'Floor', th: 'ชั้น' },
    fromLabel: { en: 'From', th: 'เริ่มต้น' },
    tierCta: { en: 'Ask about this floor', th: 'สอบถามชั้นนี้' },
    unitsPerFloor: { en: '5 units', th: '5 ห้อง' },
    ctaLabel: { en: 'Want to know more about the room?', th: 'อยากรู้เรื่องห้องเพิ่มไหม?' },
    ctaButton: { en: 'Message us on LINE', th: 'คุยกับเราทาง LINE' },
    galleryBedroom: { en: 'Bedroom', th: 'ห้องนอน' },
    galleryBathroom: { en: 'Bathroom', th: 'ห้องน้ำ' },
    galleryKitchen: { en: 'Storage', th: 'ที่เก็บของ' },
    galleryBalcony: { en: 'Balcony', th: 'ระเบียง' },
    essentialsTitle: { en: 'In-Room Essentials', th: 'สิ่งที่มาพร้อมในห้อง' },
    essentialsSub: { en: 'Every piece chosen for daily use.', th: 'ทุกชิ้นเลือกมาเพื่อใช้จริง' },
    essentials: {
      en: [
        'Built-in furniture throughout (soft-close)',
        '10″ pocket-spring mattress',
        'Work desk / wardrobe / shelving / chair',
        'Full-length mirror',
        'Air conditioner',
        'Refrigerator & microwave',
        'Water heater',
        'Full UV-blocking curtains',
        'Air ventilation system',
      ],
      th: [
        'เฟอร์นิเจอร์บิวท์อินทั้งห้อง (soft-close)',
        'ที่นอน Pocket Spring 10 นิ้ว',
        'โต๊ะทำงาน / ตู้เสื้อผ้า / ชั้นวาง / เก้าอี้',
        'กระจกเต็มตัว',
        'เครื่องปรับอากาศ',
        'ตู้เย็นและไมโครเวฟ',
        'เครื่องทำน้ำอุ่น',
        'ม่านกัน UV เต็มบาน',
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
    designLinkTitle: { en: 'See the design decisions behind this room', th: 'ดูว่าห้องนี้ออกแบบมาอย่างไร' },
    designLinkBody: {
      en: 'Every detail above — the orientation, the balcony, the bathroom — is explained chapter by chapter in the Architectural Lookbook.',
      th: 'ทุกรายละเอียดข้างต้น — การวางผัง ระเบียง ห้องน้ำ — อธิบายไว้ทีละคอลเลกชันใน The Architectural Lookbook',
    },
  },
  amenities: {
    sectionLabel: { en: 'Amenities', th: 'บริการ' },
    headline: {
      en: 'Everything in place,\nbefore you arrive.',
      th: 'ทุกอย่างจะพร้อม\nก่อนวันที่คุณมาถึง',
    },
    subtext: {
      en: 'Every item below is included in your monthly rate.',
      th: 'รายการด้านล่างรวมอยู่ในค่าเช่ารายเดือน',
    },
    scrollHint: { en: 'Scroll', th: 'เลื่อน' },
    items: {
      en: [
        { label: 'Parking', desc: `Enough spaces around the building for all ${PARKING_CAPACITY_APPROX} units.` },
        { label: 'Pocket Garden', desc: 'A communal garden to slow down in. Green, quiet, yours.' },
        { label: 'Laundry & Dryer', desc: 'Washers and dryers on site, with a drinking-water refill station.' },
        { label: 'Cleaning Service', desc: 'In-unit cleaning — every 3 months for units with a pet, every 6 months without.' },
        { label: 'A/C Maintenance', desc: 'Serviced on a regular schedule — every 6 months for units with a pet, yearly without.' },
      ],
      th: [
        { label: 'ที่จอดรถ', desc: `พื้นที่จอดรอบอาคารเพียงพอสำหรับทุกห้อง (${PARKING_CAPACITY_APPROX} ห้อง)` },
        { label: 'สวนหย่อม', desc: 'สวนส่วนกลางไว้นั่งพัก เขียวและเงียบ' },
        { label: 'ซักผ้าและอบผ้า', desc: 'เครื่องซักและเครื่องอบในอาคาร พร้อมจุดเติมน้ำดื่ม' },
        { label: 'บริการทำความสะอาด', desc: 'ทำความสะอาดในห้อง — ห้องมีสัตว์เลี้ยงทุก 3 เดือน · ห้องทั่วไปทุก 6 เดือน' },
        { label: 'บริการล้างแอร์', desc: 'ล้างแอร์ตามรอบ — ห้องมีสัตว์เลี้ยงทุก 6 เดือน · ห้องทั่วไปปีละครั้ง' },
      ],
    },
    ctaTag: { en: 'All included', th: 'รวมทุกอย่าง' },
    ctaHeadline: { en: 'The right home\nstarts with a talk.', th: 'บ้านที่ใช่\nเริ่มจากได้คุยกัน' },
    ctaBody: {
      en: 'Ask us about any detail on LINE.',
      th: 'สงสัยตรงไหน ถามเราได้ทาง LINE',
    },
    ctaButton: { en: 'Message us on LINE', th: 'คุยกับเราทาง LINE' },
  },
  location: {
    sectionLabel: { en: 'Location', th: 'ทำเล' },
    sectionHeadline: {
      en: 'Set in a peaceful neighborhood — yet effortlessly close to everyday essentials.',
      th: 'ย่านสงบในสายไหม — แต่สิ่งที่ต้องใช้ทุกวันอยู่ไม่ไกล',
    },
    nearbyTitle: { en: 'Nearby Essentials', th: 'สถานที่ใกล้เคียง' },
    lifestyleTitle: { en: 'Lifestyle Surroundings', th: 'ห้างร้านและตลาดรอบข้าง' },
    guideLink: { en: 'See the full neighbourhood guide', th: 'ดูคู่มือย่านฉบับเต็ม' },
  },
  smart: {
    leftLabel: { en: 'Quietly Connected', th: 'Quietly Connected' },
    leftHeadline: {
      en: 'Managed simply,\nthrough one\napplication.',
      th: 'จัดการง่าย\nผ่านแอป\nเดียว',
    },
    leftBody: {
      en: 'Bookings, payments, maintenance, even the air around you — gathered in one quiet app, with an assistant on LINE who remembers, reminds, and knows the neighbourhood.',
      th: 'จอง จ่าย แจ้งซ่อม ไปจนถึงดูคุณภาพอากาศ — รวมไว้ในแอปเดียว พร้อมผู้ช่วยใน LINE ที่ช่วยจำ ช่วยเตือน และรู้จักย่านนี้ดี',
    },
    features: {
      en: [
        { label: 'Digital door lock', sub: 'Unit & building' },
        { label: 'CCTV security', sub: '24/7 monitoring' },
        { label: 'Wi-Fi', sub: 'Included in rent' },
      ],
      th: [
        { label: 'ดิจิทัลล็อก', sub: 'ห้องและอาคาร' },
        { label: 'กล้องวงจรปิด', sub: 'ตรวจจับตลอด 24 ชม.' },
        { label: 'Wi-Fi', sub: 'รวมในค่าเช่า' },
      ],
    },
    appLabel: { en: 'In the app', th: 'ในแอป' },
    // The phone mockup's own screen text
    phone: {
      greeting: { en: 'Good morning.', th: 'อรุณสวัสดิ์' },
      search: { en: 'Search the residence…', th: 'ค้นหาในโครงการ…' },
      tiles: {
        en: [
          { title: 'Booking', sub: 'Common spaces' },
          { title: 'Payments', sub: 'Auto · LINE Pay' },
          { title: 'My Door', sub: 'Open · Lock' },
          { title: 'Maintenance', sub: 'Request anytime' },
          { title: 'Pet', sub: 'Vaccinations' },
          { title: 'Air Quality', sub: 'PM2.5 · 18' },
        ],
        th: [
          { title: 'จองพื้นที่', sub: 'พื้นที่ส่วนกลาง' },
          { title: 'ชำระเงิน', sub: 'Auto · LINE Pay' },
          { title: 'ประตูห้อง', sub: 'เปิด · ล็อก' },
          { title: 'แจ้งซ่อม', sub: 'แจ้งได้ทุกเมื่อ' },
          { title: 'สัตว์เลี้ยง', sub: 'ประวัติวัคซีน' },
          { title: 'คุณภาพอากาศ', sub: 'PM2.5 · 18' },
        ],
      },
    },
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
    rightLabel: { en: 'Sustainable by Intention', th: 'Sustainable by Intention' },
    rightHeadline: {
      en: 'Built to last —\nnot to impress.',
      th: 'สร้างให้อยู่ได้นาน —\nไม่ใช่เพื่อโชว์',
    },
    sustainable: {
      en: [
        { title: 'Energy-conscious design', body: 'Cross-ventilation, UV-blocking curtains and inverter cooling — designed to use less from day one.' },
        { title: 'Long-term material durability', body: 'Selected for how they age — quietly, without losing their character.' },
      ],
      th: [
        { title: 'ออกแบบให้ใช้ไฟน้อย', body: 'ลมผ่านห้องได้ ม่านกัน UV และแอร์อินเวอร์เตอร์ — ใช้ไฟน้อยลงตั้งแต่วันแรก' },
        { title: 'วัสดุที่อยู่ได้นาน', body: 'เลือกวัสดุที่ค่อย ๆ เก่าอย่างงาม — โดยไม่เสียเสน่ห์ของตัวเอง' },
      ],
    },
  },
  testimonials: {
    sectionLabel: { en: 'Residents', th: 'ผู้อยู่อาศัย' },
    sectionHeadline: { en: 'Life inside Nature Haven.', th: 'ชีวิตใน Nature Haven' },
  },
  invitation: {
    label: { en: 'A Gentle Invitation', th: 'A Gentle Invitation' },
    lines: {
      en: ['Nature Haven', 'is not made for everyone.', 'It is for those', 'who know what matters—', 'and choose to live with it.'],
      th: ['Nature Haven', 'ไม่ได้สร้างมาสำหรับทุกคน', 'แต่สำหรับคนที่', 'รู้ว่าอะไรสำคัญ—', 'และเลือกอยู่กับสิ่งนั้น'],
    },
  },
  faq: {
    sectionLabel: { en: 'FAQ', th: 'คำถาม' },
    headline: { en: 'Frequently Asked Questions', th: 'คำถามที่พบบ่อย' },
  },
  contact: {
    sectionLabel: { en: 'Contact', th: 'ติดต่อ' },
    headline: { en: 'Ask us anything.', th: 'ถามเราได้ทุกเรื่อง' },
    steps: {
      en: [
        { num: '01', title: 'Explore', body: 'Browse the residences. Decide if Nature Haven is the right fit.' },
        { num: '02', title: 'Reach out', body: "Message us on LINE. We'll answer your questions." },
        { num: '03', title: 'Reserve', body: `Pay the ${BOOKING_FEE} THB booking fee via PromptPay to secure your place in the queue to view and sign.` },
        { num: '04', title: 'Move in', body: `Sign the lease. Residences are expected to open from ${MOVE_IN_LABEL.en}.` },
      ],
      th: [
        { num: '01', title: 'สำรวจ', body: 'ดูข้อมูลห้อง ว่าเหมาะกับคุณไหม' },
        { num: '02', title: 'ติดต่อ', body: 'ส่งข้อความถึงเราทาง LINE แล้วเราตอบทุกคำถาม' },
        { num: '03', title: 'จองคิว', body: `ชำระค่าจองคิว ${BOOKING_FEE} บาทผ่าน PromptPay เพื่อรับคิวเข้าชมห้องและทำสัญญา` },
        { num: '04', title: 'ย้ายเข้า', body: `เซ็นสัญญา คาดว่าพร้อมเข้าอยู่${MOVE_IN_LABEL.th}` },
      ],
    },
    ctaButton: { en: 'Message us on LINE', th: 'คุยกับเราทาง LINE' },
    lineNote: { en: 'We answer fastest on LINE.', th: 'เราตอบเร็วที่สุดทาง LINE' },
    appointmentNote: {
      en: 'There is no walk-in office — please message us on LINE and we will reply there.',
      th: 'เราไม่มีสำนักงานให้แวะ ติดต่อเราทาง LINE ได้เลย',
    },
  },
  footer: {
    headline: { en: 'Nature Haven — Quiet Living in Saimai', th: 'Nature Haven — ที่พักเงียบสงบในสายไหม' },
    sub: { en: 'A residence shaped by intention.', th: 'ที่พักที่ออกแบบอย่างตั้งใจ' },
    copyright: { en: '© 2026 Nature Haven. All rights reserved.', th: '© 2569 Nature Haven สงวนสิทธิ์ทั้งหมด' },
    allChannels: { en: 'All Channels', th: 'ช่องทางทั้งหมด' },
    privacy: { en: 'Privacy Policy', th: 'นโยบายความเป็นส่วนตัว' },
    terms: { en: 'Terms of Service', th: 'ข้อตกลงการใช้งาน' },
    address: { en: 'Sai Mai, Bangkok', th: 'สายไหม กรุงเทพฯ' },
    country: { en: 'Thailand', th: 'ประเทศไทย' },
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
