import type { Collection } from '@/data/collectionTypes';

// Collection 04 — The Functional Zones
// The bathroom and the balcony: worry engineered away.
const collection: Collection = {
  slug: 'functional-zones',
  index: '04',
  title: {
    en: 'The Functional Zones',
    th: 'สเปซส่วนตัวที่ไร้ความกังวล',
  },
  essence: {
    en: 'A bathroom and balcony considered to the last degree — nothing left to worry about.',
    th: 'ห้องน้ำและระเบียงที่คิดเผื่อไว้หมดแล้ว — จนคุณไม่เหลืออะไรต้องกังวล',
  },
  manifesto: {
    en: 'The rooms you use every day should ask nothing of you. So we did the thinking in advance — from the height of a tap, to the tilt of a bottle ledge, to the thickness of a balcony frame.',
    th: 'พื้นที่ที่คุณใช้ทุกวันไม่ควรมีเรื่องให้ต้องคิด เราจึงคิดแทนให้ทั้งหมดล่วงหน้า — ตั้งแต่ความสูงของก๊อกน้ำ องศาของชั้นวางขวด ไปจนถึงความหนาของกรอบบานเลื่อนที่ระเบียง',
  },
  hero: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1400&fit=crop&auto=format&q=80',
  heroAlt: {
    en: 'Minimal bathroom with natural light',
    th: 'ห้องน้ำมินิมอลรับแสงธรรมชาติ',
  },
  details: [
    {
      label: 'The Basin',
      title: { en: 'A basin measured to the hand', th: 'อ่างล้างหน้าที่คำนวณทุกระยะ' },
      body: {
        en: 'A rounded stainless tap set at a deliberate height — low enough to wash your face without your hair falling forward, clear enough that fingers never pinch, tall enough to fill a small bottle. An oval mirror, a floating shelf beneath the basin, and a two-tier stainless towel rail, in case there are two of you.',
        th: 'ก๊อกน้ำสแตนเลสทรงมน ตั้งความสูงมาแล้วอย่างจงใจ — ก้มล้างหน้าโดยผมไม่บังหน้า เปิดน้ำโดยนิ้วไม่เบียด มือไม่ชนมุมในเช้าที่เร่งรีบ และสูงพอจะกรอกขวดน้ำใบเล็กได้ กระจกวงรีติดผนัง ชั้นลอยใต้ซิงก์สำหรับของจุกจิก และราวผ้าสแตนเลส 2 ชั้น เผื่อไว้สำหรับการอยู่กันสองคน',
      },
    },
    {
      label: 'The Throne',
      title: { en: 'The D-shape', th: 'สุขภัณฑ์ทรง D' },
      body: {
        en: 'A one-piece D-shape closet — comfortable through the long sits, seamless underneath so nothing collects, plumbed straight down to the tank so odour has no way back. The bidet set is stainless throughout, gentle on the skin.',
        th: 'สุขภัณฑ์แบบชิ้นเดียวทรง D รับสรีระให้นั่งนานได้โดยไม่ชา ขอบด้านใต้เป็นแบบ seamless ไร้ซอกให้คราบสะสม ทำความสะอาดง่าย และท่อเดินตรงลงถังโดยตรง — กลิ่นจึงไม่มีทางย้อนกลับขึ้นมา สายชำระสแตนเลสทั้งชุด น้ำนุ่ม ไม่บาดผิว',
      },
      spec: {
        en: 'One-piece · D-shape · seamless rim · direct-to-tank',
        th: 'ชิ้นเดียว · ทรง D · ขอบ seamless · ท่อตรงลงถัง',
      },
    },
    {
      label: 'The Shower',
      title: { en: 'Warm water you can trust', th: 'น้ำอุ่นที่ไว้ใจได้' },
      body: {
        en: 'The water heater comes from a century-old, world-standard maker, TIS-certified, with constant-temperature control — on the days you want to stand there and let your thoughts run, no sudden scald will interrupt.',
        th: 'เครื่องทำน้ำอุ่นจากแบรนด์อายุกว่าร้อยปีมาตรฐานระดับโลก ผ่าน มอก. พร้อมระบบรักษาอุณหภูมิคงที่ — วันที่อยากยืนอาบนาน ๆ ให้ความคิดไหลไป จะไม่มีจังหวะน้ำร้อนลวกมาขัดจังหวะ',
      },
    },
    {
      label: 'The Dry Room',
      title: { en: 'A bathroom that stays dry', th: 'ห้องน้ำที่แห้งเสมอ' },
      body: {
        en: 'Matte 60 × 60 floor tiles graded so water leaves completely; a metre-high masonry ledge behind the closet, tilted so bottles never sit in a puddle; an oversized extractor fan that closes its own louvres when idle, insect-meshed like the drain; and a UPVC door with enlarged vents so humidity leaves quickly.',
        th: 'พื้นกระเบื้องผิวด้าน 60 × 60 เทระดับให้น้ำไหลออกหมดไม่ขังเป็นแอ่ง ชั้นวางขวดก่อหลังสุขภัณฑ์สูง 1 เมตร เอียงองศาไว้ให้น้ำไม่ค้าง พัดลมระบายอากาศตัวใหญ่ข้างโซนอาบน้ำ ปิดบานเกล็ดเองเมื่อไม่ทำงาน พร้อมตาข่ายกันแมลง ฝาท่อแบบกันแมลง และประตู UPVC เจาะช่องระบายอากาศกว้างกว่ามาตรฐาน ให้ความชื้นออกไวเป็นพิเศษ',
      },
      spec: {
        en: 'Floor 60×60 matte · walls 30×60 white · full-fall slope, no pooling',
        th: 'พื้น 60×60 ผิวด้าน · ผนังขาว 30×60 · slope เต็มผืน ไร้น้ำขัง',
      },
    },
    {
      label: 'The Balcony',
      title: { en: 'The engineered balcony', th: 'ระเบียงนวัตกรรม' },
      body: {
        en: 'A specially developed slider: a 10 cm aluminium frame, 6 mm green-tinted glass, built-in pet mesh and hook locks top and bottom — better against rain and insects than the standard kind. Inside: a dish sink with a low tap, a drying rail, a floor drain, matte anti-slip tiles on a full-fall slope, and a raised threshold for everyone’s safety.',
        th: 'บานเลื่อนรุ่นพัฒนาพิเศษ กรอบอะลูมิเนียมหนา 10 ซม. กระจกเขียวใสหนา 6 มม. มุ้งกันสัตว์เลี้ยงในตัว และตัวล็อกตะขอทั้งบน-ล่าง — กันฝนสาดและกันแมลงได้เหนือกว่าบานทั่วไป ภายในระเบียงมีซิงก์ล้างจานพร้อมก๊อกด้านล่าง ราวตากผ้า ตะแกรงระบายน้ำ พื้นกระเบื้องด้านกันลื่นเทลาดไม่ขังน้ำ และฐานระเบียงยกสูงขึ้นเพื่อความปลอดภัยของทุกชีวิต',
      },
      spec: {
        en: 'Aluminium frame 10 cm · glass 6 mm · built-in pet mesh · hook locks top + bottom',
        th: 'กรอบอะลูมิเนียม 10 ซม. · กระจก 6 มม. · มุ้งกันสัตว์ในตัว · ล็อกตะขอบน-ล่าง',
      },
    },
  ],
};

export default collection;
