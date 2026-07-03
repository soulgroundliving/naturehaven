import type { Article } from '@/data/journalTypes';

const article: Article = {
  slug: 'saimai-in-numbers',
  category: { en: 'Neighborhood', th: 'ย่านสายไหม' },
  title: {
    en: 'Sai Mai, measured in metres — what "quiet but convenient" actually means',
    th: 'สายไหมวัดเป็นเมตร — "เงียบแต่สะดวก" ของจริงหน้าตาเป็นแบบนี้',
  },
  excerpt: {
    en: '"Quiet neighbourhood" is the most overused phrase in Thai real estate. So instead of adjectives, here are the actual distances from our front gate.',
    th: '"ย่านสงบ" คือคำที่ถูกใช้เปลืองที่สุดในวงการที่พัก เราเลยขอตอบด้วยตัวเลขแทนคำคุณศัพท์ — ระยะทางจริงวัดจากหน้าโครงการ',
  },
  date: '2026-07-02',
  readMinutes: 4,
  hero: '/assets/location-area-map.jpg',
  heroAlt: {
    en: 'Map of the area around Nature Haven, Sai Mai, Bangkok',
    th: 'แผนที่บริเวณรอบ Nature Haven ย่านสายไหม กรุงเทพฯ',
  },
  blocks: [
    {
      type: 'p',
      text: {
        th: 'ทุกประกาศที่พักในกรุงเทพฯ เขียนเหมือนกันหมดว่า "ย่านสงบ เดินทางสะดวก" — ประโยคนี้ไม่มีความหมายจนกว่าจะมีตัวเลขกำกับ เราเลยเดินออกไปหน้าโครงการแล้ววัดจริง: นี่คือระยะทางของชีวิตประจำวันของคุณที่สายไหม',
        en: 'Every rental listing in Bangkok says the same thing: "quiet area, convenient location." The sentence means nothing until numbers stand behind it. So here they are, measured from our front gate — the actual distances of your daily life in Sai Mai.',
      },
    },
    {
      type: 'h2',
      text: { th: 'รัศมี 750 เมตร — ชีวิตประจำวันทั้งหมด', en: 'Within 750 metres — the whole daily routine' },
    },
    {
      type: 'p',
      text: {
        th: 'กาแฟตอนเช้า: Café Amazon อยู่หน้าโครงการ ก้าวออกจากประตูก็ถึง ของเข้าบ้านชิ้นใหญ่: Big C 280 เมตร ของสดทำกับข้าว: ตลาดวงศกร 700 เมตร ซื้อยกลัง: Makro สายไหม 750 เมตร และข้อที่เราให้น้ำหนักที่สุดตอนเลือกที่ดิน — โรงพยาบาล CGH สายไหม อยู่ห่างเพียง 300 เมตร ใกล้พอที่คำว่า "เผื่อฉุกเฉิน" จะไม่ใช่แค่คำปลอบใจ',
        en: 'Morning coffee: Café Amazon is directly in front of the property — you step out and you are there. The big shop: Big C at 280 m. Fresh food: Wongsakorn Market at 700 m. Bulk runs: Makro Sai Mai at 750 m. And the number we weighed most when choosing this land — CGH Sai Mai Hospital at just 300 m, close enough that "in case of emergency" is a real plan, not a comforting phrase.',
      },
    },
    {
      type: 'pull',
      text: {
        th: 'ยิ่งของจำเป็นอยู่ใกล้เท่าไหร่ ชีวิตยิ่งช้าลงได้อย่างสบายใจเท่านั้น',
        en: 'The closer the essentials, the more comfortably life is allowed to slow down.',
      },
    },
    {
      type: 'h2',
      text: { th: 'โหมดสุดสัปดาห์ — ไกลออกไปอีกนิด', en: 'Weekend mode — a little further out' },
    },
    {
      type: 'p',
      text: {
        th: 'Saimai Avenue คอมมูนิตี้มอลล์อยู่ห่าง 1 กิโลเมตร — ร้านอาหารและคาเฟ่สำหรับเย็นวันศุกร์ Foodland 3.3 กม. สำหรับของนำเข้า ตลาดมารวย 4.4 กม. และตลาด เอซี สายไหม 5 กม. สำหรับวันที่อยากเดินตลาดจริง ๆ ทั้งหมดอยู่ในระยะที่ขับรถหรือเรียกวินไม่เกินสิบนาที',
        en: 'Saimai Avenue, the community mall, is 1 km away — restaurants and cafés for a Friday evening. Foodland at 3.3 km for imported goods, Maruay Market at 4.4 km, and AC Sai Mai Market at 5 km for a proper market wander. All within a ten-minute drive or motorbike ride.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'แล้วรถไฟฟ้า? BTS คูคต อยู่ห่างประมาณ 5 กิโลเมตร — ราว 15 นาทีโดยแท็กซี่หรือวิน นี่คือ trade-off ที่เราพูดตรง ๆ: สายไหมไม่ใช่ย่านติดรถไฟฟ้า แต่สิ่งที่ได้กลับมาคือความเงียบจริง ราคาที่เบากว่า และชีวิตประจำวันทั้งชุดในระยะเดิน เราเลือกฝั่งนี้อย่างตั้งใจ — และเชื่อว่าคนที่ใช่สำหรับที่นี่จะเลือกเหมือนกัน',
        en: 'And the train? BTS Khu Khot is about 5 km — roughly 15 minutes by taxi or motorbike. This is the trade-off, stated plainly: Sai Mai is not a next-to-the-BTS neighbourhood. What you get back is genuine quiet, a lighter rent, and an entire daily routine within walking distance. We chose this side of the trade deliberately — and we suspect the people this home is right for would choose it too.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'อยากมาวัดด้วยเท้าตัวเอง? นัดชมห้องแล้วเดินสำรวจย่านไปด้วยกันได้ — ทักมาทาง LINE',
        en: 'Want to measure it with your own feet? Book a viewing and walk the neighbourhood with us — message us on LINE.',
      },
    },
  ],
};

export default article;
