import type { Collection } from '@/data/collectionTypes';

// Collection 05 — The Engineered Balcony
// The south-facing outdoor edge, thought through to the last hook and slope.
const collection: Collection = {
  slug: 'the-balcony',
  index: '05',
  title: {
    en: 'The Engineered Balcony',
    th: 'ระเบียง อีกห้องหนึ่งของบ้าน',
  },
  essence: {
    en: 'The outdoor edge — where the wet work, the drying and the fresh air live, thought through to the last hook and slope.',
    th: 'มุมกลางแจ้งของบ้าน ไว้ล้าง ไว้ตาก ไว้รับลม',
  },
  manifesto: {
    en: 'The balcony is the south end of the room’s north–south airflow, so we engineered it like a room of its own: the dishes and the damp live out here, not by your bed, and every fitting is chosen so the open edge stays safe, dry and quiet.',
    th: 'ระเบียงคือปลายทิศใต้ของแนวลมเหนือ–ใต้ที่ผ่านห้อง เราจึงออกแบบให้เหมือนอีกห้องหนึ่ง จานชามและความชื้นอยู่ข้างนอกนี้ ไม่ใช่ข้างเตียง และเลือกทุกชิ้นให้ระเบียงปลอดภัย แห้ง และเงียบ',
  },
  hero: '/assets/balcony-view.jpg',
  heroAlt: {
    en: 'The private balcony — stainless dish sink, wall-mounted drying rail, black railing and the engineered slider frame',
    th: 'ระเบียงส่วนตัว — ซิงก์ล้างจานสแตนเลส ราวตากผ้าติดผนัง ราวกันตกสีดำ และกรอบบานเลื่อน',
  },
  details: [
    {
      label: 'The Slider',
      title: { en: 'A slider built to keep the weather out', th: 'บานเลื่อนที่กันฝนกันลม' },
      body: {
        en: 'A 10 cm aluminium frame, 6 mm green-tinted glass, and hook locks top and bottom — it closes tight, so rain rarely drives in and the frame does not rattle. A pet mesh is built into the same track, so the breeze comes through while your animals stay safely inside.',
        th: 'บานเลื่อนกรอบอะลูมิเนียมหนา 10 ซม. กระจกเขียวใสหนา 6 มม. ล็อกตะขอบน-ล่าง — ปิดแล้วแน่น ฝนสาดเข้าได้ยาก กรอบไม่สั่น ในรางเดียวกันมีมุ้งกันสัตว์เลี้ยง เปิดรับลมได้ โดยที่น้อง ๆ ยังอยู่ในห้องอย่างปลอดภัย',
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
        en: 'A full stainless dish sink with a low tap and its own under-shelf, plus a wall-mounted drying rail. It is the quiet reason the room inside always stays a room, never a kitchen.',
        th: 'ซิงก์ล้างจานสแตนเลสเต็มตัว พร้อมก๊อกด้านล่างและชั้นวางในตัว และราวตากผ้าติดผนัง ห้องด้านในจึงเป็นห้องพักเสมอ ไม่กลายเป็นครัว',
      },
    },
    {
      label: 'The Ground',
      title: { en: 'A floor that never holds water', th: 'พื้นที่น้ำไม่ขัง' },
      body: {
        en: 'Matte anti-slip tile on a full-fall slope drains completely into a meshed floor drain — nothing pools, nothing grows. The balcony base is raised a step above the room, a small line that keeps water, and everyone, on the right side of the door.',
        th: 'พื้นกระเบื้องผิวด้านกันลื่น เทลาดเต็มผืนให้น้ำไหลลงตะแกรงระบายที่มีตาข่ายจนหมด — ไม่มีแอ่งขัง ไม่มีคราบสะสม ฐานระเบียงยกสูงขึ้นจากห้องหนึ่งขั้น ขั้นเล็ก ๆ ที่กันทั้งน้ำและทุกชีวิตให้อยู่ถูกฝั่งของประตู',
      },
      spec: {
        en: 'Matte anti-slip tile · full-fall slope · meshed floor drain · raised threshold',
        th: 'กระเบื้องด้านกันลื่น · เทลาดเต็มผืน · ตะแกรงระบายมีตาข่าย · ฐานยกสูง',
      },
    },
    {
      label: 'The Finish',
      title: { en: 'Part of the building, not an afterthought', th: 'เป็นส่วนหนึ่งของอาคาร ไม่ใช่ของแถม' },
      body: {
        en: 'The balcony wears the same exterior paint as the building itself, so it reads as part of the building rather than a leftover ledge.',
        th: 'ระเบียงใช้สีเดียวกับผนังภายนอกของอาคาร จึงดูเป็นส่วนหนึ่งของอาคาร ไม่ใช่ขอบที่เหลือ ๆ ไว้',
      },
    },
  ],
};

export default collection;
