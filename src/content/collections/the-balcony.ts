import type { Collection } from '@/data/collectionTypes';

// Collection 05 — The Engineered Balcony
// The south-facing outdoor edge, thought through to the last hook and slope.
const collection: Collection = {
  slug: 'the-balcony',
  index: '05',
  title: {
    en: 'The Engineered Balcony',
    th: 'ระเบียงนวัตกรรม',
  },
  essence: {
    en: 'The outdoor edge — where the wet work, the drying and the fresh air live, thought through to the last hook and slope.',
    th: 'ขอบกลางแจ้งของบ้าน — ที่อยู่ของงานเปียก ราวตากผ้า และอากาศบริสุทธิ์ คิดมาแล้วทุกตะขอและทุกองศา',
  },
  manifesto: {
    en: 'The balcony is the south end of the room’s north–south airflow — and the place where a residence is usually neglected. Not here. This one is engineered like a room of its own: the dishes and the damp live out here, not by your bed, and every fitting is chosen so the open edge stays safe, dry and quiet.',
    th: 'ระเบียงคือปลายทิศใต้ของแนวลมเหนือ–ใต้ที่ไหลผ่านห้อง และมักเป็นจุดที่ที่พักส่วนใหญ่ปล่อยผ่าน — แต่ที่นี่ไม่ใช่ เราออกแบบมันเหมือนอีกห้องหนึ่ง: งานล้างและความชื้นถูกย้ายมาอยู่ตรงนี้ ไม่ใช่ข้างเตียง และทุกชิ้นส่วนถูกเลือกมาเพื่อให้ขอบกลางแจ้งนี้ปลอดภัย แห้ง และเงียบสงบ',
  },
  hero: '/assets/balcony-view.jpg',
  heroAlt: {
    en: 'The private balcony — stainless dish sink, wall-mounted drying rail, black railing and the engineered slider frame',
    th: 'ระเบียงส่วนตัวจริงของโครงการ — ซิงก์ล้างจานสแตนเลส ราวตากผ้าติดผนัง ราวกันตกสีดำ และกรอบบานเลื่อนนวัตกรรม',
  },
  details: [
    {
      label: 'The Slider',
      title: { en: 'A slider built to keep the weather out', th: 'บานเลื่อนที่กันทุกอย่างไว้ข้างนอก' },
      body: {
        en: 'A specially developed door: a 10 cm aluminium frame, 6 mm green-tinted glass, and hook locks top and bottom — heavier and tighter than the standard kind, so rain never drives in and the frame never rattles. A pet mesh is built into the same track, so the breeze comes through while your animals stay safely inside.',
        th: 'บานเลื่อนรุ่นพัฒนาพิเศษ กรอบอะลูมิเนียมหนา 10 ซม. กระจกเขียวใสหนา 6 มม. และตัวล็อกตะขอทั้งบน-ล่าง — หนาและแน่นกว่าบานทั่วไป ฝนจึงไม่สาดเข้า กรอบไม่สั่นคลอน และมีมุ้งกันสัตว์เลี้ยงในรางเดียวกัน เปิดรับลมได้โดยที่น้อง ๆ ยังอยู่ในห้องอย่างปลอดภัย',
      },
      spec: {
        en: 'Aluminium frame 10 cm · glass 6 mm green-tinted · built-in pet mesh · hook locks top + bottom',
        th: 'กรอบอะลูมิเนียม 10 ซม. · กระจก 6 มม. เขียวใส · มุ้งกันสัตว์ในตัว · ล็อกตะขอบน-ล่าง',
      },
    },
    {
      label: 'The Outdoor Sink',
      title: { en: 'The wet work, kept outside', th: 'งานเปียก อยู่ข้างนอก' },
      body: {
        en: 'A full stainless dish sink with a low tap and its own under-shelf, plus a wall-mounted drying rail — the washing-up and the damp live out here in the fresh air, not beside your bed. It is the quiet reason the room inside always stays a room, never a kitchen.',
        th: 'ซิงก์ล้างจานสแตนเลสเต็มตัวพร้อมก๊อกด้านล่างและชั้นวางในตัว พร้อมราวตากผ้าติดผนัง — งานล้างและความชื้นถูกย้ายมาอยู่กลางแจ้งตรงนี้ ไม่ใช่ข้างเตียง มันคือเหตุผลเงียบ ๆ ที่ทำให้ห้องด้านในยังเป็นห้องพักเสมอ ไม่กลายเป็นครัว',
      },
    },
    {
      label: 'The Ground',
      title: { en: 'A floor that never holds water', th: 'พื้นที่ไม่เคยขังน้ำ' },
      body: {
        en: 'Matte anti-slip tile on a full-fall slope drains completely into a meshed floor drain — nothing pools, nothing grows. The balcony base is raised a step above the room, a small line that keeps water, and everyone, on the right side of the door.',
        th: 'พื้นกระเบื้องผิวด้านกันลื่น เทลาดเต็มผืนให้น้ำไหลลงตะแกรงระบายที่มีตาข่ายจนหมด — ไม่มีแอ่งขัง ไม่มีคราบสะสม ฐานระเบียงยกสูงขึ้นจากห้องหนึ่งขั้น เส้นเล็ก ๆ ที่กันทั้งน้ำและทุกชีวิตให้อยู่ถูกฝั่งของประตู',
      },
      spec: {
        en: 'Matte anti-slip tile · full-fall slope · meshed floor drain · raised threshold',
        th: 'กระเบื้องด้านกันลื่น · slope เต็มผืน · ตะแกรงระบายมีตาข่าย · ฐานยกสูง',
      },
    },
    {
      label: 'The Finish',
      title: { en: 'Part of the building, not an afterthought', th: 'เป็นส่วนหนึ่งของอาคาร ไม่ใช่ของแถม' },
      body: {
        en: 'The balcony wears the same exterior paint as the building itself, so it reads as architecture rather than a leftover ledge — a calm, finished edge that belongs to the whole quiet composition.',
        th: 'ระเบียงใช้สีเดียวกับผนังภายนอกของอาคาร จึงดูเป็นงานสถาปัตยกรรม ไม่ใช่ขอบที่เหลือ ๆ ไว้ — เป็นขอบที่เรียบร้อย สงบ และเป็นส่วนหนึ่งขององค์ประกอบทั้งหมด',
      },
    },
  ],
};

export default collection;
