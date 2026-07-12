import type { Article } from '@/data/journalTypes';

const article: Article = {
  slug: 'quiet-by-design',
  category: { en: 'Quiet Living', th: 'อยู่อย่างสงบ' },
  title: {
    en: 'Quiet by design — why a 20-unit building with no elevator is the point',
    th: 'เงียบโดยตั้งใจ — ทำไมตึก 20 ห้องที่ไม่มีลิฟต์ ถึงเป็นความตั้งใจ ไม่ใช่ข้อจำกัด',
  },
  excerpt: {
    en: 'Every decision at Nature Haven starts from one question: does it make daily life quieter? This is the reasoning behind the low-rise form, moving the wet work out to the balcony, and the all-inclusive rent.',
    th: 'ทุกการตัดสินใจของ Nature Haven เริ่มจากคำถามเดียว: มันทำให้ชีวิตประจำวันเงียบขึ้นไหม — นี่คือเหตุผลเบื้องหลังตึกเตี้ย การย้ายงานล้างไปไว้ที่ระเบียง และค่าเช่าที่รวมทุกอย่าง',
  },
  date: '2026-07-03',
  readMinutes: 5,
  hero: '/assets/room-view-in.jpg',
  heroAlt: {
    en: 'Nature Haven bedroom — view into the room toward the private balcony',
    th: 'ห้องพัก Nature Haven — มุมมองเข้าห้อง เห็นระเบียงส่วนตัว',
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
        th: 'เราเริ่มออกแบบจากคำถามเดียว: ต้องมีกี่ห้อง ชีวิตข้างในถึงยังเงียบอยู่ คำตอบของเราคือยี่สิบ พอให้มีเพื่อนบ้าน แต่ไม่มากพอให้กลายเป็นทางผ่าน',
        en: 'We began the design with a single question: how few units can this building hold and still feel calm inside? Our answer was twenty — enough for neighbours, never enough to feel like a corridor of strangers.',
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
        th: 'ที่นี่ไม่มีลิฟต์ — และการไม่มีคือการตัดสินใจ ไม่ใช่การประหยัด ตึกเตี้ยที่ไร้ลิฟต์หมายถึงไม่มีเสียงเครื่องจักรผ่านผนังตอนตีสอง ไม่มีคนแปลกหน้าหยุดพักที่หน้าห้องคุณ และงบส่วนกลางที่ไม่ต้องแบกภาระบำรุงรักษาของสิ่งใหญ่ขนาดนั้นไปตลอดอายุตึก',
        en: 'There is no elevator here — and that absence is a decision, not an economy. A low-rise with no elevator means no machinery humming through the wall at two in the morning, no strangers pausing on your landing, and a shared budget that never has to carry the lifetime maintenance of something so large.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'มันยังทำให้ราคามีความซื่อตรงในตัวมันเอง — ชั้นที่ต้องใช้แรงขาเดินมากกว่า เริ่มต้นที่ 6,900 บาทต่อเดือน ส่วนชั้นล่างขยับสูงขึ้นมาเพียงเล็กน้อย เดินมากขึ้น จ่ายน้อยลง — กติกาเงียบ ๆ ข้อเดียว และตัวเลขของแต่ละชั้นเราแจ้งให้เป็นการส่วนตัวเมื่อมีผู้สนใจ',
        en: 'It also lends the pricing a certain honesty: the floors that ask more of your legs begin at 6,900 THB a month, and the floors below sit only slightly above it. More stairs, less rent — one quiet rule, and the exact figure for each floor is shared privately, by request.',
      },
    },
    {
      type: 'h2',
      text: { th: '25.2 ตร.ม. ที่ห้องนอนได้เป็นห้องนอนจริง ๆ', en: '25.2 square metres where the bedroom is actually a bedroom' },
    },
    {
      type: 'p',
      text: {
        th: 'ทุกยูนิตมีขนาด 25.2 ตร.ม. — หนึ่งห้องนอน หนึ่งห้องน้ำ ระเบียงส่วนตัว และมุมครัวในตัวที่ย้ายซิงก์ล้างจานออกไปพักอยู่ที่ระเบียง แทนที่จะอยู่ข้างเตียง เป็นการย้ายเล็ก ๆ ที่ให้ผลลัพธ์ไม่เล็กเลย: ไม่มีจานกองใกล้หมอน ไม่มีมุมชื้นในพื้นที่ที่คุณใช้ชีวิตจริง และแสงยามเช้าจากระเบียงเข้าถึงห้องโดยไม่รบกวนใคร',
        en: 'Every residence measures 25.2 sqm — one bedroom, one bathroom, a private balcony, and an in-room kitchenette whose dish sink rests outside on the balcony rather than beside the bed. It is a small relocation with an outsized effect: no plates gathering near the pillow, no damp corner in the room where you actually live, and morning light reaching in from the balcony without disturbing anyone.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'และยังมีความเงียบอีกชั้นหนึ่งที่ไม่ได้อยู่ในผนัง แต่อยู่ในใบแจ้งหนี้ — ค่าเช่ารวม Wi-Fi (AIS Fiber) บริการทำความสะอาด และดูแลแอร์ไว้แล้ว ตัวเลขเดียว จ่ายครั้งเดียวต่อเดือน ไม่มีอะไรงอกขึ้นกลางทางให้ต้องคิดคำนวณ — ทางสายกลาง ในรูปแบบของใบแจ้งหนี้',
        en: 'There is a last, quieter register too — not in the walls, but in the bill. Rent already includes Wi-Fi (AIS Fiber), cleaning, and air-conditioning service. One figure, once a month, nothing appearing mid-cycle to be reckoned with — a middle path, written as an invoice.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'Nature Haven เปิดให้เข้าอยู่กันยายน 2026 หากสิ่งแรกที่คุณอยากได้ยินตอนกลับถึงบ้านคือความว่างเปล่าของเสียง นี่คือตึกที่สร้างขึ้นเพื่อความปรารถนานั้นโดยเฉพาะ',
        en: 'Nature Haven opens in September 2026. If the first thing you wish to hear on returning home is nothing at all, this is the building made for that wish.',
      },
    },
  ],
};

export default article;
