import type { Article } from '@/data/journalTypes';

const article: Article = {
  slug: 'quiet-by-design',
  category: { en: 'Quiet Living', th: 'อยู่อย่างสงบ' },
  title: {
    en: 'Quiet by design — why a 20-unit building with no elevator is the point',
    th: 'เงียบโดยตั้งใจ — ทำไมตึก 20 ห้องที่ไม่มีลิฟต์ ถึงเป็นความตั้งใจ ไม่ใช่ข้อจำกัด',
  },
  excerpt: {
    en: 'Every decision at Nature Haven starts from one question: does it make daily life quieter? This is the reasoning behind the low-rise form, the separate kitchen, and the all-inclusive rent.',
    th: 'ทุกการตัดสินใจของ Nature Haven เริ่มจากคำถามเดียว: มันทำให้ชีวิตประจำวันเงียบขึ้นไหม — นี่คือเหตุผลเบื้องหลังตึกเตี้ย ครัวแยก และค่าเช่าที่รวมทุกอย่าง',
  },
  date: '2026-07-03',
  readMinutes: 5,
  hero: '/assets/about-minimal-room.jpg',
  heroAlt: {
    en: 'Minimal warm-toned room interior at Nature Haven',
    th: 'ห้องพักโทนอบอุ่นสไตล์มินิมอลของ Nature Haven',
  },
  blocks: [
    {
      type: 'p',
      text: {
        th: 'เสียงแรกที่คุณได้ยินเมื่อเปิดประตูห้อง ควรเป็นเสียงของตัวเอง — ประโยคนี้อยู่ในหัวเราตั้งแต่วันแรกที่ร่างแบบ Nature Haven และมันอธิบายได้ว่าทำไมตึกนี้ถึง "เล็ก" อย่างตั้งใจ: low-rise 4 ชั้น เพียง 20 ห้อง ชั้นละ 5 ห้อง ในซอยที่สงบของย่านสายไหม',
        en: 'The first sound you hear when you open your door should be your own. That sentence has guided Nature Haven since the first sketch, and it explains why this building is deliberately small: a low-rise of 4 floors, just 20 units, 5 per floor, on a quiet street in Sai Mai.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'ที่พักส่วนใหญ่ถูกออกแบบจากคำถามว่า "ใส่ห้องได้กี่ห้อง" — เราเริ่มจากคำถามกลับด้าน: ต้องมีกี่ห้อง ชีวิตข้างในถึงยังเงียบอยู่ คำตอบของเราคือยี่สิบ พอให้มีเพื่อนบ้าน แต่ไม่มากพอให้กลายเป็นทางผ่าน',
        en: 'Most rental buildings begin with the question "how many rooms can we fit?" We started from the opposite direction: how few units can this building hold and still feel calm inside? Our answer was twenty — enough for neighbours, never enough to feel like a corridor of strangers.',
      },
    },
    {
      type: 'pull',
      text: {
        th: 'ความเงียบไม่ใช่ของตกแต่ง — มันคือโครงสร้าง',
        en: 'Quiet is not a finish. It is structure.',
      },
    },
    {
      type: 'h2',
      text: { th: 'ทำไมไม่มีลิฟต์', en: 'Why there is no elevator' },
    },
    {
      type: 'p',
      text: {
        th: 'คำถามที่เราได้รับบ่อยที่สุดข้อหนึ่งคือ "มีลิฟต์ไหม" — ไม่มี และนั่นคือการตัดสินใจ ไม่ใช่การประหยัด ตึกเตี้ยที่ไม่มีลิฟต์หมายถึงไม่มีเสียงเครื่องจักรทำงานข้างห้องคุณตอนตีสอง ไม่มีคนแปลกหน้ารอหน้าประตูชั้นคุณ และค่าส่วนกลางที่ไม่ต้องแบกค่าบำรุงรักษาระบบใหญ่ตลอดอายุตึก',
        en: 'One of the questions we hear most often is "is there an elevator?" There is not — and that is a decision, not a cost-saving. A low-rise without an elevator means no machinery humming beside your wall at 2 a.m., no strangers waiting on your floor, and shared costs that never have to carry heavy mechanical maintenance for the life of the building.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'มันยังทำให้ราคาตรงไปตรงมา: ชั้นบนสุด (ชั้น 4) คือเรทเริ่มต้น 6,900 บาท/เดือน แล้วเพิ่มชั้นละ 200 บาทลงมาจนถึงชั้น 1 ที่ 7,500 บาท — เดินบันไดมากขึ้น จ่ายน้อยลง เดินน้อยลง จ่ายเพิ่มขึ้น กติกาเดียว เข้าใจได้ในประโยคเดียว',
        en: 'It also makes pricing honest: the top floor (4) is the entry rate at 6,900 THB/month, increasing 200 THB per floor down to 7,500 on the ground floor. More stairs, lower rent; fewer stairs, a little more. One rule, understood in one sentence.',
      },
    },
    {
      type: 'h2',
      text: { th: '31.5 ตร.ม. ที่ห้องนอนได้เป็นห้องนอนจริง ๆ', en: '31.5 square metres where the bedroom is actually a bedroom' },
    },
    {
      type: 'p',
      text: {
        th: 'ทุกยูนิตคือ 31.5 ตร.ม. — 1 ห้องนอน 1 ห้องน้ำ ครัวแยก และระเบียงส่วนตัว การแยกครัวออกจากห้องนอนฟังดูเป็นเรื่องเล็ก แต่มันคือเส้นแบ่งระหว่าง "ห้องเช่า" กับ "บ้าน": กลิ่นอาหารไม่ค้างบนหมอน เสื้อผ้าไม่ต้องอยู่ร่วมห้องกับกระทะ และตอนเช้าแสงจากระเบียงเข้าถึงพื้นที่นั่งเล่นโดยไม่ต้องปลุกใคร',
        en: 'Every unit is 31.5 sqm — one bedroom, one bathroom, a separate kitchen, and a private balcony. Separating the kitchen sounds minor, but it is the line between a rented room and a home: cooking smells never settle on your pillow, your clothes never share a wall with the stove, and morning light from the balcony reaches the living space without waking anyone.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'ความเงียบข้อสุดท้ายไม่ได้อยู่ในผนัง แต่อยู่ในบิล: ค่าเช่ารวม Wi-Fi (AIS Fiber) บริการทำความสะอาด และบริการล้างแอร์ไว้แล้ว เดือนหนึ่งจ่ายครั้งเดียว ไม่มีตัวเลขงอกกลางเดือนให้ต้องคิด — นั่นคือ "ทางสายกลาง" ในเวอร์ชันของใบแจ้งหนี้',
        en: 'The last kind of quiet is not in the walls but in the bill: rent includes Wi-Fi (AIS Fiber), cleaning service, and A/C maintenance. One payment a month, no numbers sprouting mid-month — the middle path, in invoice form.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'Nature Haven เปิดให้เข้าอยู่กันยายน 2026 — ถ้าเสียงแรกที่คุณอยากได้ยินตอนกลับถึงห้องคือความเงียบ เรากำลังสร้างที่แบบนั้นอยู่',
        en: 'Nature Haven opens in September 2026. If the first thing you want to hear when you come home is nothing at all — that is exactly what we are building.',
      },
    },
  ],
};

export default article;
