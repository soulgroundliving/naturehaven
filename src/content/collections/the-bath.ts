import type { Collection } from '@/data/collectionTypes';

// Collection 04 — The Private Bath
// The bathroom, engineered so it asks nothing of you.
// (The balcony split out into Collection 05 — 2026-07-10, owner call.)
const collection: Collection = {
  slug: 'the-bath',
  index: '04',
  title: {
    en: 'The Private Bath',
    th: 'ห้องน้ำส่วนตัว',
  },
  essence: {
    en: 'A bathroom considered to the last degree — nothing left to worry about.',
    th: 'ห้องน้ำที่ใช้ได้โดยไม่ต้องคิด',
  },
  manifesto: {
    en: 'The room you use most quietly should ask nothing of you. So we did the thinking in advance — from the height of a tap, to the tilt of a bottle ledge, to the fan that closes itself once the last of the damp has gone.',
    th: 'ห้องน้ำควรเป็นห้องที่ไม่ต้องคิดอะไร เราจึงคิดเผื่อไว้ก่อนทั้งหมด — ตั้งแต่ความสูงของก๊อกน้ำ องศาของชั้นวางขวด ไปจนถึงพัดลมที่ปิดตัวเองเมื่อความชื้นหมดไป',
  },
  hero: '/assets/bathroom-functional.jpg',
  heroAlt: {
    en: 'The bathroom — oval mirror, one-piece D-shape closet, constant-temperature shower and the tilted bottle ledge',
    th: 'ห้องน้ำ — กระจกวงรี สุขภัณฑ์ชิ้นเดียวทรง D ฝักบัวน้ำอุ่นอุณหภูมิคงที่ และชั้นวางขวดหลังโถ',
  },
  details: [
    {
      label: 'The Basin',
      title: { en: 'A basin measured to the hand', th: 'อ่างล้างหน้าที่คำนวณทุกระยะ' },
      body: {
        en: 'A rounded stainless tap set at a deliberate height — low enough to wash your face without your hair falling forward, clear enough that fingers never pinch, tall enough to fill a small bottle. An oval mirror, a floating shelf beneath the basin, and a two-tier stainless towel rail, in case there are two of you.',
        th: 'ก๊อกน้ำสแตนเลสทรงมน ตั้งความสูงให้พอดีมือ ล้างหน้าตอนเช้าที่รีบได้โดยมือไม่ชนขอบ และสูงพอกรอกขวดน้ำใบเล็ก ส่วนกระจกวงรี ชั้นลอยใต้ซิงก์ไว้วางของจุกจิก และราวผ้าสแตนเลส 2 ชั้น เผื่อไว้ถ้าอยู่กันสองคน',
      },
    },
    {
      label: 'The Throne',
      title: { en: 'The D-shape', th: 'สุขภัณฑ์ทรง D' },
      body: {
        en: 'A one-piece D-shape closet — comfortable to sit on, seamless underneath so nothing collects, plumbed straight down to the tank so odour stays down. The bidet set is stainless throughout.',
        th: 'สุขภัณฑ์แบบชิ้นเดียวทรง D นั่งสบาย ขอบด้านใต้แบบ seamless ไม่มีซอกให้คราบเกาะ ทำความสะอาดง่าย ท่อเดินตรงลงถัง กลิ่นจึงไม่ย้อนขึ้นมา สายชำระเป็นสแตนเลสทั้งชุด',
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
        en: 'The water heater comes from a well-established, TIS-certified maker, with constant-temperature control — on the days you want to stand there and let your thoughts run, no sudden scald will interrupt.',
        th: 'เครื่องทำน้ำอุ่นจากผู้ผลิตที่อยู่มานานและผ่าน มอก. พร้อมระบบรักษาอุณหภูมิคงที่ — วันที่อยากยืนอาบนาน ๆ ให้ความคิดไหลไป จะไม่มีน้ำร้อนลวกมาขัด',
      },
    },
    {
      label: 'The Dry Room',
      title: { en: 'A bathroom that stays dry', th: 'ห้องน้ำที่แห้งเสมอ' },
      body: {
        en: 'Matte 60 × 60 floor tiles graded so water leaves completely; a metre-high masonry ledge behind the closet, tilted so bottles never sit in a puddle; an oversized extractor fan that closes its own louvres when idle, insect-meshed like the drain; and a UPVC door with enlarged vents so humidity leaves quickly.',
        th: 'พื้นกระเบื้องผิวด้าน 60 × 60 เทลาดให้น้ำไม่ขัง ชั้นวางขวดก่อสูง 1 เมตรหลังสุขภัณฑ์ เอียงให้น้ำไม่ค้าง พัดลมระบายอากาศตัวใหญ่ข้างที่อาบน้ำ ปิดบานเกล็ดเองเมื่อไม่ใช้ มีตาข่ายกันแมลงเหมือนฝาท่อ และประตู UPVC มีช่องระบายอากาศกว้าง ให้ความชื้นออกได้เร็ว',
      },
      spec: {
        en: 'Floor 60×60 matte · walls 30×60 white · full-fall slope, no pooling',
        th: 'พื้น 60×60 ผิวด้าน · ผนังขาว 30×60 · เทลาดเต็มผืน น้ำไม่ขัง',
      },
    },
  ],
};

export default collection;
