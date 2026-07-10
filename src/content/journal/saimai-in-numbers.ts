import type { Article } from '@/data/journalTypes';

const article: Article = {
  slug: 'saimai-in-numbers',
  category: { en: 'Neighborhood', th: 'ย่านสายไหม' },
  title: {
    en: 'Sai Mai, measured in metres — what "quiet but convenient" actually means',
    th: 'สายไหมวัดเป็นเมตร — "เงียบแต่สะดวก" ของจริงหน้าตาเป็นแบบนี้',
  },
  excerpt: {
    en: '"Quiet neighbourhood" may be the most overused phrase in Thai real estate. In its place, the actual distances — measured from our front gate.',
    th: '"ย่านสงบ" อาจเป็นวลีที่ถูกใช้จนเปลืองที่สุดในวงการที่พักไทย เราขอแทนที่ด้วยระยะทางจริง วัดจากหน้าประตูโครงการ',
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
        th: 'ประกาศที่พักในกรุงเทพฯ เกือบทุกแห่งอ้างสิ่งเดียวกัน — เงียบ สะดวก ทำเลดี วลีเหล่านี้ไร้น้ำหนักจนกว่าจะมีตัวเลขรองรับ นี่คือตัวเลขจริง วัดจากหน้าประตูโครงการของเราเอง — ระยะทางที่จะกำหนดชีวิตประจำวันของคุณในย่านสายไหม',
        en: 'Every rental listing in Bangkok claims the same thing: quiet, convenient, well-located. The phrase carries no weight until numbers stand behind it — so here they are, measured from our own front gate: the real distances that will shape daily life in Sai Mai.',
      },
    },
    {
      type: 'h2',
      text: { th: 'รัศมี 750 เมตร — ชีวิตประจำวันทั้งหมด', en: 'Within 750 metres — the whole daily routine' },
    },
    {
      type: 'p',
      text: {
        th: 'กาแฟยามเช้า: Café Amazon อยู่ตรงหน้าโครงการ เพียงไม่กี่ก้าวจากประตู ของใช้ชิ้นใหญ่: Big C ระยะ 280 เมตร วัตถุดิบสด: ตลาดวงศกร 700 เมตร ซื้อยกลัง: Makro สายไหม 750 เมตร และระยะทางที่เราให้น้ำหนักมากที่สุดตอนเลือกที่ดินผืนนี้ — โรงพยาบาล CGH สายไหม ห่างเพียง 300 เมตร ใกล้พอที่คำว่า "กรณีฉุกเฉิน" จะยังเป็นแผนการจริง ไม่ใช่แค่คำปลอบใจ',
        en: 'Morning coffee: Café Amazon sits directly in front of the property, a few steps from the door. The larger errand: Big C at 280 m. Fresh ingredients: Wongsakorn Market at 700 m. A bulk run: Makro Sai Mai at 750 m. And the distance we weighed most heavily when choosing this land — CGH Sai Mai Hospital, just 300 m away, close enough that "in case of emergency" remains a real plan rather than a reassuring phrase.',
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
      text: { th: 'ไกลออกไปอีกนิด สำหรับวันที่ช้าลง', en: 'A little further, for the slower days' },
    },
    {
      type: 'p',
      text: {
        th: 'Saimai Avenue คอมมูนิตี้มอลล์อยู่ห่างออกไป 1 กิโลเมตร — ร้านอาหารและคาเฟ่สำหรับเย็นวันศุกร์ Foodland ระยะ 3.3 กม. สำหรับของนำเข้า ตลาดมารวย 4.4 กม. และตลาดเอซี สายไหม 5 กม. สำหรับบ่ายวันที่อยากเดินเล่นในตลาดจริง ๆ ทั้งหมดอยู่ในระยะขับรถสิบนาที หรือนั่งวินไปไม่นาน',
        en: 'Saimai Avenue, the community mall, sits 1 km away — restaurants and cafés for a Friday evening. Foodland at 3.3 km for imported goods, Maruay Market at 4.4 km, and AC Sai Mai Market at 5 km for an afternoon spent properly wandering a market. All within a ten-minute drive, or a short ride away.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'ส่วนรถไฟฟ้า — BTS คูคต อยู่ห่างประมาณ 5 กิโลเมตร ราวสิบห้านาทีโดยแท็กซี่หรือวินมอเตอร์ไซค์ นี่คือ trade-off ที่เราบอกตรง ๆ โดยไม่ปรุงแต่ง: สายไหมไม่ใช่ย่านที่อยู่ติดแนวรถไฟฟ้า สิ่งที่ได้กลับมาคือความเงียบที่แท้จริง ค่าเช่าที่เบากว่า และชีวิตประจำวันทั้งหมดอยู่ในระยะเดิน เป็นการแลกที่เราเลือกอย่างตั้งใจ ด้วยความเชื่อว่าผู้อยู่อาศัยที่เหมาะกับบ้านหลังนี้จะเลือกแบบเดียวกัน',
        en: 'As for the train — BTS Khu Khot lies roughly 5 km away, around fifteen minutes by taxi or motorbike. This is the trade-off, stated without dressing it up: Sai Mai does not sit beside the BTS line. In return, it offers a quiet that is real, a rent that is lighter, and an entire daily routine within walking distance. It is a trade we made deliberately, on the belief that the resident this home suits would choose the same way.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'หากอยากวัดระยะด้วยเท้าของคุณเอง การนัดชมห้องสามารถรวมการเดินสำรวจย่านไปด้วยกันได้ — นัดหมายผ่าน LINE',
        en: 'To measure it with your own feet, a viewing can include a walk through the neighbourhood — arranged on LINE.',
      },
    },
  ],
};

export default article;
