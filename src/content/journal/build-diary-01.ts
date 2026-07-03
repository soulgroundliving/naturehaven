import type { Article } from '@/data/journalTypes';

const article: Article = {
  slug: 'build-diary-01',
  category: { en: 'Build Diary', th: 'บันทึกการสร้าง' },
  title: {
    en: 'Build Diary #1 — what is already decided, on the road to September 2026',
    th: 'Build Diary #1 — สิ่งที่เคาะแล้ว ระหว่างทางสู่กันยายน 2026',
  },
  excerpt: {
    en: 'We are building in public. This first entry covers what is locked in — floor-based pricing, the all-inclusive rate, solar on the common areas — and what we are working on next.',
    th: 'เราตั้งใจสร้างแบบเปิดเผย — บันทึกฉบับแรกนี้เล่าสิ่งที่ตัดสินใจแล้ว: ราคาตามชั้น ค่าเช่ารวมทุกอย่าง โซลาร์ในส่วนกลาง และสิ่งที่กำลังทำต่อ',
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
        th: 'ตึกส่วนใหญ่เงียบจนถึงวันเปิด แล้วค่อยพูดทุกอย่างพร้อมกันในโบรชัวร์ — เราอยากลองทางกลับกัน: เล่าไปเรื่อย ๆ ระหว่างสร้าง ให้คนที่กำลังตัดสินใจได้เห็นวิธีคิด ไม่ใช่แค่ผลลัพธ์ นี่คือบันทึกฉบับแรก',
        en: 'Most buildings stay silent until opening day, then say everything at once in a brochure. We want to try the opposite: telling the story as we build, so anyone deciding where to live next can see how we think — not just the finished result. This is entry one.',
      },
    },
    {
      type: 'h2',
      text: { th: 'สิ่งที่เคาะแล้ว', en: 'What is locked in' },
    },
    {
      type: 'p',
      text: {
        th: 'หนึ่ง — ราคา: ทุกห้องเลี้ยงสัตว์ได้ และคิดราคาตามชั้น เริ่ม 6,900 บาท/เดือนที่ชั้น 4 เพิ่มชั้นละ 200 บาท จนถึง 7,500 ที่ชั้น 1 ไม่มีค่าธรรมเนียมซ่อน ไม่มี "ราคาพิเศษสำหรับสัตว์เลี้ยง" เพราะสัตว์เลี้ยงไม่ใช่ข้อยกเว้นของตึกนี้ตั้งแต่แรก',
        en: 'One — pricing: every unit is pet-friendly, priced by floor. From 6,900 THB/month on floor 4, +200 THB per floor, to 7,500 on floor 1. No hidden fees, no "pet premium" — because pets were never an exception in this building to begin with.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'สอง — บิลเดียวจบ: ค่าเช่ารวม Wi-Fi (AIS Fiber) บริการทำความสะอาด และบริการล้างแอร์ สาม — สัญญา 12 เดือน มัดจำ 1 เดือน + ล่วงหน้า 1 เดือน ตัวเลขทั้งหมดพูดครั้งเดียวและตรงกันทุกที่ที่เราสื่อสาร',
        en: 'Two — one bill: rent includes Wi-Fi (AIS Fiber), cleaning service, and A/C maintenance. Three — a 12-month lease with 1-month deposit + 1-month advance. Every number is said once, and matches everywhere we publish it.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'สี่ — พลังงาน: ส่วนกลางของตึกออกแบบให้ทำงานร่วมกับโซลาร์เซลล์ แสงแดดที่ทำให้ระเบียงคุณอุ่นตอนเช้า คือแสงเดียวกับที่ช่วยจ่ายไฟทางเดินตอนกลางคืน — เล็ก ๆ แต่เป็นทิศทางที่ตึกนี้จะเดินต่อ',
        en: 'Four — energy: the common areas are designed to work with solar. The same sun that warms your balcony in the morning helps light the walkways at night. A small thing, but it points where this building is headed.',
      },
    },
    {
      type: 'pull',
      text: {
        th: 'ความโปร่งใสก่อนวันเปิด คือของขวัญที่ดีที่สุดที่เราให้ผู้เช่ารุ่นแรกได้',
        en: 'Transparency before opening day is the best gift we can give our first residents.',
      },
    },
    {
      type: 'h2',
      text: { th: 'สิ่งที่กำลังทำ', en: 'What we are working on' },
    },
    {
      type: 'p',
      text: {
        th: 'ตอนนี้โฟกัสอยู่ที่งานภายใน — ให้ห้องจริงซื่อสัตย์กับภาพเรนเดอร์ที่คุณเห็น: ไม้โทนอ่อน ผนังครีมอุ่น แสงซ่อนใต้หัวเตียง และระเบียงที่เป็นของห้องคุณจริง ๆ บันทึกฉบับหน้าเราจะพาไปดูวัสดุจริงที่เลือกแล้ว',
        en: 'Right now the focus is interior work — making the real rooms honest to the renders you have seen: pale wood, warm cream walls, concealed light above the headboard, and a balcony that genuinely belongs to your unit. In the next entry we will show the actual materials we have chosen.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'เปิดให้เข้าอยู่กันยายน 2026 — ระหว่างนี้ถ้ามีคำถามที่อยากให้บันทึกฉบับต่อไปตอบ ทักมาทาง LINE ได้เลย เราอ่านทุกข้อความ',
        en: 'Move-in opens September 2026. Until then, if there is a question you want the next diary entry to answer, send it to us on LINE — we read everything.',
      },
    },
  ],
};

export default article;
