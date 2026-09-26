import type { Article } from '@/data/journalTypes';

// Built from our real social post — the five-slide Build Diary #1 carousel
// (C10) — plus the details its slides point to. The slides are typographic
// cards (origin 'drawing'), copied from the marketing pack as WebP under new
// filenames. Slide 4 is the corrected one (move-in November 2569).
const SLIDES = '/assets/journal/build-diary-01';

const article: Article = {
  slug: 'build-diary-01',
  category: { en: 'Build Diary', th: 'บันทึกการสร้าง' },
  title: {
    en: 'Build Diary #1 — what is already decided, on the road to November 2026',
    th: 'Build Diary #1 — สิ่งที่เคาะแล้ว ระหว่างทางสู่พฤศจิกายน 2026',
  },
  excerpt: {
    en: 'A record kept as the building rises. The first entry: what is already decided — one clear rent, one rule for every home, solar power for the common areas — as five cards from our post and a short list.',
    th: 'บันทึกที่เก็บไว้ระหว่างตึกค่อย ๆ เป็นรูปเป็นร่าง ฉบับแรกว่าด้วยสิ่งที่เคาะแล้ว — ค่าเช่าที่ชัดเจน กติกาเดียวกันทุกห้อง โซลาร์เซลล์พื้นที่ส่วนกลาง — เป็นห้าใบจากโพสต์ของเรากับรายการสั้น ๆ',
  },
  date: '2026-06-19',
  readMinutes: 2,
  hero: '/assets/sustainability-solar.jpg',
  heroAlt: {
    en: 'Solar panels — part of Nature Haven’s common-area energy plan',
    th: 'แผงโซลาร์เซลล์ — ส่วนหนึ่งของแผนพลังงานส่วนกลางของ Nature Haven',
  },
  blocks: [
    {
      type: 'p',
      text: {
        th: 'เราเปิดบันทึกของตึกไว้ตั้งแต่ตอนที่มันกำลังก่อร่างขึ้นจริง เพื่อให้ผู้ที่กำลังพิจารณาบ้านหลังต่อไปเห็นความคิดเบื้องหลัง ไม่ใช่แค่ห้องที่เสร็จแล้ว นี่คือฉบับแรก — โพสต์ที่พาคุณมาที่นี่ปัดดูได้ด้านล่าง และรายละเอียดอยู่ในรายการถัดไป',
        en: 'We keep this record open while the building actually rises, so anyone considering where to live next can see the thinking, not only the finished rooms. This is entry one — the post that brought you here is below, and the details follow in the list after it.',
      },
    },
    {
      type: 'gallery',
      label: { th: 'โพสต์ Build Diary #1 ห้าสไลด์', en: 'The Build Diary #1 post, five slides' },
      size: 'narrow',
      items: [
        {
          src: `${SLIDES}/diary-1.webp`,
          alt: { th: 'สไลด์ 1 จาก 5: Build Diary #1 — บันทึกระหว่างตึกค่อย ๆ เป็นรูปเป็นร่าง ฉบับแรก สิ่งที่เคาะแล้ว', en: 'Slide 1 of 5: Build Diary #1 — a record kept as the building takes shape; the first entry, what is decided' },
          width: 1080,
          height: 1350,
          origin: 'drawing',
        },
        {
          src: `${SLIDES}/diary-2.webp`,
          alt: { th: 'สไลด์ 2 จาก 5: โครงสร้างราคาเคาะแล้ว — ค่าเช่าตัวเลขเดียว แจ้งชัดเจนตรงไปตรงมาตั้งแต่แรก กติกาเดียวกันทุกห้อง', en: 'Slide 2 of 5: The pricing structure is settled — one clear rent, stated plainly from the start, one rule for every home' },
          width: 1080,
          height: 1350,
          origin: 'drawing',
        },
        {
          src: `${SLIDES}/diary-3.webp`,
          alt: { th: 'สไลด์ 3 จาก 5: โซลาร์เซลล์พื้นที่ส่วนกลาง — พลังงานแสงอาทิตย์สำหรับพื้นที่ส่วนกลางของตึก', en: 'Slide 3 of 5: Solar panels for the common areas — solar power for the building’s shared spaces' },
          width: 1080,
          height: 1350,
          origin: 'drawing',
        },
        {
          src: `${SLIDES}/diary-4.webp`,
          alt: { th: 'สไลด์ 4 จาก 5: พฤศจิกายน 2569 เปิดเข้าอยู่ — ระหว่างทาง เราบันทึกทุกความคืบหน้าไว้ใน Journal', en: 'Slide 4 of 5: November 2026, move-in opens — along the way we record every step of progress in the Journal' },
          width: 1080,
          height: 1350,
          origin: 'drawing',
        },
        {
          src: `${SLIDES}/diary-5.webp`,
          alt: { th: 'สไลด์ 5 จาก 5: ตามอ่าน Build Diary — สิ่งที่ตัดสินใจแล้ว และสิ่งที่กำลังดำเนินต่อไป ฉบับเต็มอยู่บนเว็บ', en: 'Slide 5 of 5: Follow the Build Diary — what is decided and what comes next, in full on the site' },
          width: 1080,
          height: 1350,
          origin: 'drawing',
        },
      ],
    },
    {
      type: 'h2',
      text: { th: 'สิ่งที่เคาะแล้ว', en: 'What is locked in' },
    },
    {
      type: 'table',
      caption: {
        th: 'ที่เคาะแล้วและบอกตรง ๆ ตั้งแต่ก่อนวันเปิด',
        en: 'Settled, and stated plainly before opening day',
      },
      rowHeader: true,
      rows: [
        [
          { th: 'ค่าเช่า', en: 'Rent' },
          {
            th: 'เริ่มต้น 6,900 บาทต่อเดือน เป็นตัวเลขเดียวที่แจ้งตรงไปตรงมา ราคาต่อชั้นอยู่บนเว็บ และไม่มีค่าส่วนกลางเพิ่มเติม',
            en: 'From 6,900 THB a month — one clear figure, stated plainly. The rate for each floor is on the site, and there is no extra common-area fee.',
          },
        ],
        [
          { th: 'รวมอยู่ในค่าเช่า', en: 'Included in rent' },
          {
            th: 'Wi-Fi บริการทำความสะอาดห้อง และดูแลแอร์ ส่วนค่าน้ำค่าไฟแยกตามมิเตอร์ที่ใช้จริง',
            en: 'Wi-Fi, in-unit cleaning and A/C maintenance. Electricity and water are metered separately, by actual use.',
          },
        ],
        [
          { th: 'สัตว์เลี้ยง', en: 'Pets' },
          {
            th: 'ทุกห้องทุกชั้นเลี้ยงได้ กติกาเดียวกันทั้งตึก — สุนัขและแมว ตัวเต็มวัยไม่เกิน 15 กก. ไม่เกิน 2 ตัวต่อห้อง มีค่าสัตว์เลี้ยงรายเดือนต่อตัว ไม่ใช่ข้อยกเว้นที่ต้องต่อรองเป็นราย ๆ',
            en: 'Every unit on every floor is pet-friendly, under one rule for the whole building — dogs and cats up to 15 kg full-grown, two per home at most, with a monthly pet fee per animal. Never an exception to negotiate.',
          },
        ],
        [
          { th: 'สัญญาและวันเข้าอยู่', en: 'Lease and move-in' },
          {
            th: 'สัญญา 12 เดือน ค่าใช้จ่ายวันเข้าอยู่คือค่าจอง เงินประกันความเสียหาย 1 เดือน และค่าเช่าล่วงหน้า 1 เดือน เปิดเข้าอยู่พฤศจิกายน 2569',
            en: 'A twelve-month lease. Move-in costs are a booking fee, a one-month security deposit and one month of advance rent. Move-in opens in November 2026.',
          },
        ],
        [
          { th: 'โซลาร์เซลล์', en: 'Solar power' },
          {
            th: 'สำหรับพื้นที่ส่วนกลางของตึกเท่านั้น ไม่ได้หมายถึงค่าไฟในห้องพัก ซึ่งยังคิดตามมิเตอร์จริง',
            en: 'For the building’s common areas only — not the rooms, whose electricity is still metered and billed at actual use.',
          },
        ],
      ],
    },
    {
      type: 'pull',
      text: {
        th: 'สิ่งที่พูดอย่างตรงไปตรงมาก่อนวันเปิดตัว มีค่ามากกว่าสิ่งใดที่พิมพ์ออกมาภายหลัง',
        en: 'What is said honestly before opening day is worth more than anything printed after it.',
      },
    },
    {
      type: 'h2',
      text: { th: 'สิ่งที่กำลังดำเนินต่อไป', en: 'What comes next' },
    },
    {
      type: 'p',
      text: {
        th: 'ตอนนี้โฟกัสอยู่ที่งานภายใน — ให้ห้องจริงยืนอยู่ในมาตรฐานเดียวกับภาพเรนเดอร์ที่เคยแสดงไว้ ฉบับที่สองบอกชื่อวัสดุจริงที่เลือกแล้ว หากมีคำถามที่อยากให้ฉบับต่อไปตอบ ทักเราทาง LINE ได้เลย',
        en: 'The present focus is interior work — holding the finished rooms to the same standard as the renderings already shown. Entry two names the actual materials chosen. If there is a question you would like a later entry to answer, message us on LINE.',
      },
    },
  ],
};

export default article;
