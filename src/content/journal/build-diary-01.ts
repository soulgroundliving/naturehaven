import type { Article } from '@/data/journalTypes';

const article: Article = {
  slug: 'build-diary-01',
  category: { en: 'Build Diary', th: 'บันทึกการสร้าง' },
  title: {
    en: 'Build Diary #1 — what is already decided, on the road to September 2026',
    th: 'Build Diary #1 — สิ่งที่เคาะแล้ว ระหว่างทางสู่กันยายน 2026',
  },
  excerpt: {
    en: 'A record kept as the building rises. This first entry covers what has already been decided — the pricing structure, the all-inclusive rent, solar power for the common areas — and what comes next.',
    th: 'บันทึกที่เก็บไว้ระหว่างตึกค่อย ๆ เป็นรูปเป็นร่าง ฉบับแรกนี้ว่าด้วยสิ่งที่เคาะแล้ว — โครงสร้างราคา ค่าเช่าแบบรวมทุกอย่าง พลังงานโซลาร์สำหรับพื้นที่ส่วนกลาง — และสิ่งที่กำลังดำเนินต่อไป',
  },
  date: '2026-06-19',
  readMinutes: 4,
  hero: '/assets/sustainability-solar.jpg',
  heroAlt: {
    en: 'Solar panels — part of Nature Haven\'s common-area energy plan',
    th: 'แผงโซลาร์เซลล์ — ส่วนหนึ่งของแผนพลังงานส่วนกลางของ Nature Haven',
  },
  blocks: [
    {
      type: 'p',
      text: {
        th: 'เราเลือกเปิดบันทึกของตึกไว้ตั้งแต่ตอนที่มันกำลังก่อร่างขึ้นจริง — เขียนเก็บไว้ทีละฉบับระหว่างทาง เพื่อให้ผู้ที่กำลังพิจารณาบ้านหลังต่อไปได้เห็นความคิดเบื้องหลัง ไม่ใช่แค่ห้องที่เสร็จสมบูรณ์แล้ว นี่คือบันทึกฉบับที่หนึ่ง',
        en: 'We chose to keep this record open while the building actually rises — written entry by entry along the way, so that anyone considering where to live next can see the thinking, not only the finished rooms. This is entry one.',
      },
    },
    {
      type: 'h2',
      text: { th: 'สิ่งที่เคาะแล้ว', en: 'What is locked in' },
    },
    {
      type: 'p',
      text: {
        th: 'เงื่อนไขทางการค้าทั้งหมดเคาะแล้ว ทุกยูนิตเลี้ยงสัตว์ได้ เริ่มต้นที่ 6,900 บาทต่อเดือนแบบรวมทุกอย่าง ไม่มีค่าธรรมเนียมแฝง ค่าสัตว์เลี้ยงเป็นอัตรารายเดือนต่อตัว แจ้งชัดเจนตรงไปตรงมาตั้งแต่แรก — กติกาเดียวกันทุกห้อง ไม่ใช่ข้อยกเว้นที่ต้องต่อรองเป็นราย ๆ ค่าเช่ารวม Wi-Fi (AIS Fiber) บริการทำความสะอาด และดูแลแอร์ไว้แล้ว ตัวเลขเดียวครอบคลุมทั้งเดือน สัญญาเช่ามีระยะ 12 เดือน โดยมีค่ามัดจำ ค่าเช่าล่วงหน้า และค่าประกันตามปกติ ตัวเลขทั้งหมดข้างต้นพูดครั้งเดียวและตรงกันทุกที่ที่คุณจะพบเจอ — ส่วนยอดมัดจำและราคาที่แท้จริงของแต่ละชั้น เราแจ้งให้เป็นการส่วนตัวเมื่อมีผู้สนใจ',
        en: 'The commercial terms are settled. Every residence is pet-friendly, from 6,900 THB a month, all-inclusive — no hidden fees; the pet fee is a clear per-animal monthly rate, stated upfront: one rule for every home, never an exception to negotiate. Rent already carries Wi-Fi (AIS Fiber), cleaning, and air-conditioning service, so one figure covers the month. The lease runs twelve months, with a deposit, advance rent, and a security deposit as usual. Every number above is stated once, and it will match wherever you encounter it — the deposit figures and the exact rate for each floor are shared privately, on request.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'และยังมีอีกหนึ่งความตั้งใจที่เงียบกว่าเรื่องอื่น — พื้นที่ส่วนกลางออกแบบให้ทำงานร่วมกับพลังงานโซลาร์ แสงแดดเดียวกันที่ให้ความอบอุ่นแก่ระเบียงคุณยามเช้า คือส่วนหนึ่งของแสงเดียวกันที่ช่วยให้ทางเดินสว่างอยู่ยามค่ำ กลไกเล็ก ๆ แต่บ่งบอกทิศทางที่ตึกนี้ตั้งใจจะเดินต่อไป',
        en: 'There is one more commitment, quieter than the others: the common areas are designed to draw on solar power. The same sun that warms your balcony each morning is, in part, the same light that keeps the walkways lit after dark — a small mechanism, but it marks the direction this building intends to keep moving.',
      },
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
        th: 'ตอนนี้โฟกัสอยู่ที่งานภายใน — ให้ห้องจริงยืนอยู่ในมาตรฐานเดียวกับภาพเรนเดอร์ที่เคยแสดงไว้: ไม้โทนอ่อน ผนังครีมอบอุ่น แสงซ่อนเหนือหัวเตียง และระเบียงที่เป็นของยูนิตนั้นจริง ๆ บันทึกฉบับหน้าจะบอกชื่อวัสดุจริงที่เลือกแล้ว',
        en: 'The present focus is interior work — holding the finished rooms to the same standard as the renderings already shown: pale wood, warm cream walls, concealed light above the headboard, a balcony that genuinely belongs to the unit it serves. The next entry names the actual materials chosen.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'เปิดให้เข้าอยู่กันยายน 2026 หากมีคำถามที่อยากให้บันทึกฉบับต่อไปตอบ ทักทายเราได้ทาง LINE',
        en: 'Move-in opens September 2026. Questions for the next entry are always welcome, on LINE.',
      },
    },
  ],
};

export default article;
