import type { Article } from '@/data/journalTypes';

const article: Article = {
  slug: 'saimai-in-numbers',
  category: { en: 'Neighborhood', th: 'ย่านสายไหม' },
  title: {
    en: 'Sai Mai, measured in metres — what "quiet but convenient" actually means',
    th: 'สายไหมในระยะเมตร — "เงียบแต่สะดวก" จริงแค่ไหน',
  },
  excerpt: {
    en: 'We describe this neighbourhood in metres, not adjectives — the actual distances, measured from our front gate.',
    th: 'เราขอเล่าย่านนี้ด้วยระยะทางจริง แทนคำบรรยาย — ทุกระยะวัดจากหน้าประตูของเรา',
  },
  date: '2026-07-02',
  readMinutes: 4,
  hero: '/assets/location-area-map-th-16x9.jpg',
  heroOrigin: 'ai',
  heroAlt: {
    en: 'Map (Thai labels) of the drive to Nature Haven, Sai Mai, Bangkok, from BTS Khu Khot — the building is an AI illustration',
    th: 'แผนที่ทางมา Nature Haven ย่านสายไหม กรุงเทพฯ จาก BTS คูคต — ภาพอาคารเป็นภาพจำลอง (AI)',
  },
  blocks: [
    {
      type: 'p',
      text: {
        th: 'คำว่า "เงียบ" "สะดวก" "ทำเลดี" จะมีน้ำหนักก็ต่อเมื่อมีตัวเลขรองรับ และนี่คือตัวเลขจริง วัดจากหน้าประตูของเราเอง',
        en: 'Quiet, convenient, well-located — words like these carry weight only when numbers stand behind them. So here they are, measured from our own front gate.',
      },
    },
    {
      type: 'h2',
      text: { th: 'รัศมี 750 เมตร — ชีวิตประจำวันทั้งหมด', en: 'Within 750 metres — the whole daily routine' },
    },
    {
      type: 'p',
      text: {
        th: 'Big C อยู่ห่าง 280 เมตร ไว้ซื้อของเข้าบ้าน ตลาดวงศกร 700 เมตร ไว้ซื้อของสด Makro สายไหม 750 เมตร ไว้ซื้อยกลัง และระยะทางที่เราให้น้ำหนักมากที่สุดตอนเลือกที่ดินผืนนี้ — โรงพยาบาล CGH สายไหม ห่างเพียง 300 เมตร ใกล้พอให้ยามฉุกเฉินไปถึงได้จริง',
        en: 'The larger errand: Big C at 280 m. Fresh ingredients: Wongsakorn Market at 700 m. A bulk run: Makro Sai Mai at 750 m. And the distance we weighed most heavily when choosing this land — CGH Sai Mai Hospital, just 300 m away, close enough that "in case of emergency" remains a real plan rather than a reassuring phrase.',
      },
    },
    {
      type: 'pull',
      text: {
        th: 'ของจำเป็นอยู่ใกล้ ชีวิตก็ไม่ต้องรีบ',
        en: 'With the essentials close, life need not hurry.',
      },
    },
    {
      type: 'h2',
      text: { th: 'ไกลออกไปอีกนิด สำหรับวันที่ช้าลง', en: 'A little further, for the slower days' },
    },
    {
      type: 'p',
      text: {
        th: 'Saimai Avenue คอมมูนิตี้มอลล์ อยู่ห่างออกไป 1 กม. มีร้านอาหารและคาเฟ่ไว้นั่งเย็นวันศุกร์ Foodland 3.3 กม. สำหรับของนำเข้า ตลาดมารวย 4.4 กม. และตลาดเอซี สายไหม 5 กม. สำหรับบ่ายที่อยากเดินตลาดจริง ๆ ทั้งหมดอยู่ในระยะขับรถ 10 นาที หรือนั่งมอเตอร์ไซค์รับจ้างไปไม่นาน',
        en: 'Saimai Avenue, the community mall, sits 1 km away — restaurants and cafés for a Friday evening. Foodland at 3.3 km for imported goods, Maruay Market at 4.4 km, and AC Sai Mai Market at 5 km for an afternoon spent properly wandering a market. All within a ten-minute drive, or a short ride away.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'ส่วนรถไฟฟ้า — BTS คูคต อยู่ห่างประมาณ 5 กม. ราว 15 นาทีโดยแท็กซี่หรือมอเตอร์ไซค์รับจ้าง นี่คือสิ่งที่ต้องแลก และเราขอบอกตรง ๆ ว่าสายไหมไม่ได้อยู่ติดรถไฟฟ้า สิ่งที่ได้กลับมาคือความเงียบ ค่าเช่าที่เบากว่า และของจำเป็นในระยะเดิน เราเลือกแบบนี้ และเชื่อว่าคงมีคนที่เลือกเหมือนกัน',
        en: 'As for the train — BTS Khu Khot lies roughly 5 km away, around fifteen minutes by taxi or motorbike. This is the trade-off, stated without dressing it up: Sai Mai does not sit beside the BTS line. In return: quiet, a lighter rent, and the essentials within walking distance. We chose this trade, and we believe others will choose it too.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'อยากลองมาเดินดูเองก่อนตัดสินใจ หรืออยากได้เส้นทางและข้อมูลย่าน ถามเราได้ทาง LINE',
        en: 'If you would like to walk it yourself before you decide — if you would like directions or local tips, ask us on LINE.',
      },
    },
  ],
};

export default article;
