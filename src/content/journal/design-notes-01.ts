import type { Article, ArticleBlock, Bilingual, BlockSize, MediaOrigin } from '@/data/journalTypes';

// The seven carousel slides, converted to WebP (1080×1350). Each one sits
// beside the section it illustrates. Slide 5 is the only one that is not line
// art — its four pictures are 3D layout studies, so it is disclosed as a render.
const SLIDES = '/assets/journal/design-notes-01';
const slide = (file: string, alt: Bilingual, caption: Bilingual, size: BlockSize = 'narrow', origin: MediaOrigin = 'drawing'): ArticleBlock => ({
  type: 'image',
  src: `${SLIDES}/${file}.webp`,
  alt,
  caption,
  width: 1080,
  height: 1350,
  origin,
  size,
});

const article: Article = {
  slug: 'design-notes-01',
  category: { en: 'Design Notes', th: 'บันทึกการออกแบบ' },
  title: {
    en: 'How We Design a Room',
    th: 'เราออกแบบห้องหนึ่งห้องอย่างไร',
  },
  excerpt: {
    en: 'A room does not begin with furniture — it begins with a plan. How one Nature Haven room developed from its first studies in 2023 to the plan we use today, and the decisions behind every line.',
    th: 'ห้องหนึ่งห้องไม่ได้เริ่มจากเฟอร์นิเจอร์ แต่เริ่มจากแปลน นี่คือเส้นทางของห้อง Nature Haven หนึ่งห้อง ตั้งแต่การศึกษาชุดแรกในปี 2023 จนถึงแปลนที่เราใช้อยู่ในวันนี้ และการตัดสินใจเบื้องหลังทุกเส้น',
  },
  date: '2026-09-19',
  readMinutes: 5,
  hero: '/assets/design-notes-01-hero.jpg',
  heroAlt: {
    en: 'The bare floor plan of a Nature Haven room, four layout studies from 2023 to 2026, and the final plan',
    th: 'แปลนพื้นเปล่าของห้อง Nature Haven ภาพทดลองจัดวางสี่เวอร์ชันตั้งแต่ปี 2023 ถึง 2026 และแปลนสุดท้าย',
  },
  // The hero includes the four Furnish Master studies, so it carries the render badge.
  heroOrigin: 'render',
  blocks: [
    {
      type: 'p',
      text: {
        th: 'ห้องหนึ่งห้องไม่ได้เริ่มต้นจากเฟอร์นิเจอร์',
        en: 'A room does not begin with furniture.',
      },
    },
    {
      type: 'pull',
      text: {
        th: 'แต่เริ่มต้นจากแปลน',
        en: 'It begins with a plan.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'ก่อนจะวางเตียง ก่อนจะวัดตู้เสื้อผ้า ก่อนที่เคาน์เตอร์ครัวจะได้ตำแหน่งของมัน ยังมีเงื่อนไขชุดหนึ่งที่กำหนดไว้ก่อนแล้วว่าห้องนี้จะเป็นอะไรได้บ้าง',
        en: 'Before a bed is placed, before a wardrobe is measured, before a kitchen counter takes its position, there is a set of conditions that defines what the room can become.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'สำหรับ Nature Haven เรามองห้องเป็นโจทย์ของพื้นที่ สัดส่วน การเคลื่อนไหว และการใช้งานในชีวิตประจำวัน',
        en: 'For Nature Haven, we approached the room as a problem of space, proportion, movement, and everyday use.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'นี่คือเส้นทางที่ห้องหนึ่งห้องพัฒนาจากการศึกษาชุดแรกในปี 2023 จนเป็นแปลนที่เราใช้อยู่ในวันนี้',
        en: 'This is how one room developed from its early studies in 2023 to the plan we use today.',
      },
    },

    {
      type: 'h2',
      text: { th: '01 — แปลน (The Plan)', en: '01 — The Plan' },
    },
    {
      type: 'p',
      text: {
        th: 'ทุกการออกแบบเริ่มจากการทำความเข้าใจตัวพื้นที่',
        en: 'Every design starts with understanding the space itself.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'สิ่งแรกที่เรามองไม่ใช่การตกแต่ง เฟอร์นิเจอร์ หรือสีสัน แต่คือตัวห้อง',
        en: 'The first thing we looked at was not decoration, furniture, or colour. It was the room.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'ขนาดของห้อง ผนัง ช่องเปิด ทางเข้า ระเบียง ห้องน้ำ และทิศที่ห้องหันไป',
        en: 'Its dimensions. Its walls. Its openings. Its entrance. Its balcony. Its bathroom. Its orientation.',
      },
    },
    slide(
      '01-plan',
      {
        en: 'Floor plan of the empty 25.2 sqm room, with the balcony and bathroom at the top',
        th: 'แปลนพื้นของห้องเปล่า 25.2 ตร.ม. มีระเบียงและห้องน้ำอยู่ด้านบน',
      },
      { en: 'The bare plan. Before furniture, there is the space.', th: 'แปลนเปล่า ก่อนจะมีเฟอร์นิเจอร์ ต้องมีพื้นที่ก่อน' },
    ),
    {
      type: 'p',
      text: {
        th: 'แปลนพื้นจึงกลายเป็นชั้นฐานที่ทุกการตัดสินใจถัดมาต่อยอดขึ้นไป ก่อนจะถามว่า “ตรงนี้ควรวางอะไร” เราถามก่อนว่า:',
        en: 'The floor plan becomes the base layer from which every other decision follows. Before asking “what should go here?”, we first asked:',
      },
    },
    {
      type: 'pull',
      text: {
        th: 'มีอะไรอยู่ตรงนี้แล้วบ้าง',
        en: 'What is already here?',
      },
    },

    {
      type: 'h2',
      text: { th: '02 — โจทย์ (The Brief)', en: '02 — The Brief' },
    },
    {
      type: 'p',
      text: {
        th: 'ห้องเล็กก็ยังต้องทำหน้าที่หลายอย่าง ต้องรองรับทั้งการนอน การทำงาน การทำอาหาร การเก็บของ การเตรียมตัว และการเคลื่อนที่ในชีวิตประจำวัน โดยที่แต่ละหน้าที่ไม่ต้องแย่งพื้นที่เดียวกัน',
        en: 'A small room still has to do many things. It needs to support sleep, work, cooking, storage, getting ready, and everyday movement — without each function competing for the same space.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'แทนที่จะมองห้องเป็นแค่กองเฟอร์นิเจอร์ เราแบ่งห้องออกเป็นโซนการใช้งานก่อน',
        en: 'Instead of treating the room simply as a collection of furniture, we first divided it into functional zones.',
      },
    },
    slide(
      '02-brief',
      {
        en: 'The plan divided into zones: sleeping, working, cooking, storage, wardrobe, entry, bathroom and balcony',
        th: 'แปลนที่แบ่งเป็นโซน ได้แก่ โซนนอน โซนทำงาน โซนครัว โซนเก็บของ ตู้เสื้อผ้า ทางเข้า ห้องน้ำ และระเบียง',
      },
      { en: 'The Brief. One room. Multiple functions.', th: 'โจทย์ ห้องเดียว หลายหน้าที่' },
    ),
    {
      type: 'p',
      text: {
        th: 'โซนนอน — พื้นที่สำหรับพักผ่อนและฟื้นตัวโดยเฉพาะ',
        en: 'Sleeping — a dedicated area for rest and recovery.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'โซนทำงาน — ที่สำหรับนั่ง จดจ่อ อ่านหนังสือ หรือทำงานจากที่บ้าน',
        en: 'Working — a place to sit, focus, study, or work from home.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'โซนครัว — ครัวขนาดกะทัดรัดที่ออกแบบรอบกิจวัตรพื้นฐานของการเตรียมอาหาร',
        en: 'Cooking — a compact kitchen area designed around the basic routines of preparing food.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'โซนเก็บของ — ที่สำหรับสิ่งของที่ต้องอยู่ในห้อง โดยไม่ยึดห้องไปทั้งห้อง',
        en: 'Storage — space for the things that need to live in the room without taking over the room.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'ทางเข้า / จุดเตรียมตัว — จุดเปลี่ยนระหว่างข้างนอกกับข้างใน ทั้งรองเท้า ของใช้ส่วนตัว และการเตรียมตัวก่อนออกจากห้อง',
        en: 'Entry / getting ready — the transition between outside and inside, including shoes, personal belongings, and getting ready before leaving.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'ห้องน้ำ — โซนใช้งานที่ตำแหน่งตายตัว มีข้อกำหนดและข้อจำกัดของตัวเอง',
        en: 'Bathroom — a fixed functional zone with its own requirements and limitations.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'ระเบียง / พื้นที่กลางแจ้ง — ส่วนต่อขยายของห้องที่เชื่อมภายในเข้ากับภายนอก',
        en: 'Balcony / outdoor — an extension of the room that connects the interior with the outside.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'โซนเหล่านี้ไม่ใช่ห้องแยกกัน แต่เป็นวิธีถามคำถามที่ใช้งานได้จริงกว่า:',
        en: 'These zones are not separate rooms. They are a way of asking a more practical question:',
      },
    },
    {
      type: 'pull',
      text: {
        th: 'ห้องนี้ต้องทำอะไรได้บ้าง',
        en: 'What does this room need to be able to do?',
      },
    },

    {
      type: 'h2',
      text: { th: '03 — ข้อจำกัด (The Constraints)', en: '03 — The Constraints' },
    },
    {
      type: 'p',
      text: {
        th: 'เมื่อกำหนดหน้าที่ของห้องได้แล้ว เราต้องทำงานกับสิ่งที่ขยับไม่ได้',
        en: 'Once the functions were defined, we had to work with what could not be moved.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'ทางเข้ามีตำแหน่งตายตัว หน้าต่างกำหนดว่าแสงธรรมชาติเข้ามาทางไหน ระเบียงกำหนดความสัมพันธ์ระหว่างข้างในกับข้างนอก ห้องน้ำคือโซนเปียกที่ย้ายไม่ได้ ส่วนผนังและโครงสร้างจำกัดสิ่งที่แก้ไขได้ องค์ประกอบเหล่านี้กลายเป็นข้อจำกัดของแปลน',
        en: 'The entrance has a fixed position. Windows define where natural light enters. The balcony determines the relationship between inside and outside. The bathroom establishes a fixed wet zone. Walls and structural conditions limit what can be changed. These elements became the constraints of the plan.',
      },
    },
    slide(
      '03-constraints',
      {
        en: 'The plan with the fixed elements marked: window, ventilation, plumbing and wet zone, sliding door, doors and pillars',
        th: 'แปลนที่ระบุสิ่งที่ย้ายไม่ได้ ได้แก่ หน้าต่าง ช่องระบายอากาศ ท่อน้ำและโซนเปียก ประตูบานเลื่อน ประตู และเสา',
      },
      { en: 'The Constraints. Not everything can move.', th: 'ข้อจำกัด ไม่ใช่ทุกอย่างที่ย้ายได้' },
      'reading',
    ),
    {
      type: 'p',
      text: {
        th: 'การวางแผนที่ดีไม่ใช่การแกล้งทำเป็นว่าทุกความเป็นไปได้ยังเปิดอยู่ แต่คือการเข้าใจขอบเขตก่อน แล้วใช้พื้นที่ภายในขอบเขตนั้นให้เกิดประโยชน์มากที่สุด',
        en: 'Good planning is not about pretending that every possibility is available. It is about understanding the boundaries first, then making the most of the space within them.',
      },
    },

    {
      type: 'h2',
      text: { th: '04 — การจัดวาง (The Layout)', en: '04 — The Layout' },
    },
    {
      type: 'p',
      text: {
        th: 'เมื่อเข้าใจโจทย์และข้อจำกัดแล้ว จึงถึงเวลาวางเฟอร์นิเจอร์ ตำแหน่งของสิ่งหนึ่งส่งผลต่อทุกอย่างรอบตัวมัน',
        en: 'Only after understanding the brief and the constraints could the furniture be placed. The position of one object affects everything around it.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'ขยับเตียง พื้นที่ข้างเตียงก็เปลี่ยน ขยับตู้เสื้อผ้า ระยะว่างหน้าตู้ก็เปลี่ยน ขยับครัว ความสัมพันธ์ระหว่างการทำอาหาร ทางสัญจร และส่วนที่เหลือของห้องก็เปลี่ยนตาม',
        en: 'Moving the bed changes the space beside the bed. Moving the wardrobe changes the clearance in front of it. Moving the kitchen changes the relationship between cooking, circulation, and the rest of the room.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'การจัดวางจึงไม่ใช่แค่การถามว่า:',
        en: 'So the layout was not simply about asking:',
      },
    },
    {
      type: 'pull',
      text: {
        th: '“เฟอร์นิเจอร์ชิ้นนี้ใส่ได้ไหม”',
        en: '“Can this furniture fit?”',
      },
    },
    {
      type: 'p',
      text: {
        th: 'แต่คือการถามว่า:',
        en: 'It was about asking:',
      },
    },
    {
      type: 'pull',
      text: {
        th: '“พอทุกอย่างใส่ได้แล้ว ห้องยังใช้งานได้ไหม”',
        en: '“Can the room still work once everything fits?”',
      },
    },
    {
      type: 'p',
      text: {
        th: 'เรามองระยะว่างระหว่างองค์ประกอบหลักของห้อง ทั้งรอบเตียง ระหว่างเตียงกับตู้เสื้อผ้า ระหว่างเตียงกับครัว รอบโซนทำงาน และทุกจุดที่ต้องมีการเคลื่อนไหวในชีวิตประจำวัน',
        en: 'We looked at the clearances between the major elements of the room — around the bed, between the bed and wardrobe, between the bed and kitchen, around the working area, and wherever everyday movement needed to happen.',
      },
    },
    slide(
      '04-layout',
      {
        en: 'The plan with the furniture placed and the clearances around the bed marked: 120 cm, 90 cm and 120 cm',
        th: 'แปลนที่วางเฟอร์นิเจอร์แล้ว พร้อมระบุระยะว่างรอบเตียง 120 ซม. 90 ซม. และ 120 ซม.',
      },
      { en: 'The Layout. Furniture follows the room.', th: 'การจัดวาง เฟอร์นิเจอร์ตามห้อง' },
      'reading',
    ),
    {
      type: 'p',
      text: {
        th: 'พื้นที่ว่างระหว่างสิ่งของสำคัญพอ ๆ กับตัวสิ่งของเอง ห้องหนึ่งอาจใส่ทุกอย่างได้ในทางเทคนิค แต่ก็ยังรู้สึกว่าใช้งานไม่ได้เลย',
        en: 'These spaces between objects are just as important as the objects themselves. A room can technically contain everything and still feel impossible to use.',
      },
    },

    {
      type: 'h2',
      text: { th: '05 — การทดลองซ้ำ (The Iterations)', en: '05 — The Iterations' },
    },
    {
      type: 'p',
      text: {
        th: 'ห้องไม่ได้มาถึงรูปแบบปัจจุบันในก้าวเดียว เราศึกษาและทดลองพื้นที่นี้มาตั้งแต่ปี 2023 โดยใช้ Furnish Master ลองแปลนหลายเวอร์ชันตลอดหลายปีที่ผ่านมา',
        en: 'The room did not arrive at its current form in one step. We have been studying and testing the space since 2023. Using Furnish Master, different versions of the plan were explored over the years.',
      },
    },
    {
      type: 'p',
      text: {
        th: '2023 — การสำรวจห้องและความเป็นไปได้ของมันในช่วงแรก',
        en: '2023 — an early exploration of the room and its possibilities.',
      },
    },
    {
      type: 'p',
      text: {
        th: '2024 — อีกขั้นของการทดลองว่าพื้นที่นี้จัดระเบียบได้อย่างไร',
        en: '2024 — another stage of testing how the space could be organised.',
      },
    },
    {
      type: 'p',
      text: {
        th: '2025 — พัฒนาต่อเมื่อโครงการและความต้องการชัดเจนขึ้น',
        en: '2025 — further development as the project and its requirements became clearer.',
      },
    },
    {
      type: 'p',
      text: {
        th: '2026 — แปลนเวอร์ชันต้นปี 2026 ที่พัฒนามาไกลแล้ว แต่ยังไม่ใช่แปลนสุดท้าย',
        en: '2026 — an early-2026 version of the plan: already significantly developed, but still before the final one.',
      },
    },
    slide(
      '05-iterations',
      {
        en: 'Four 3D layout studies of the room, from 2023, 2024, 2025 and 2026',
        th: 'ภาพทดลองจัดวางห้องแบบ 3 มิติสี่เวอร์ชัน จากปี 2023 2024 2025 และ 2026',
      },
      { en: 'The Iterations. We tried it on screen first.', th: 'การทดลองซ้ำ เราลองบนหน้าจอก่อน' },
      'narrow',
      'render',
    ),
    {
      type: 'callout',
      tone: 'note',
      title: { en: 'About these pictures', th: 'เกี่ยวกับภาพเหล่านี้' },
      text: {
        en: 'They are 3D layout studies made in Furnish Master — not photographs of the finished room.',
        th: 'เป็นภาพทดลองจัดวางแบบ 3 มิติจาก Furnish Master ไม่ใช่ภาพถ่ายของห้องที่สร้างเสร็จ',
      },
    },
    {
      type: 'p',
      text: {
        th: 'การทดลองเหล่านี้ไม่ได้นำเสนอเป็นชุดของคำตอบที่สมบูรณ์แบบ แต่เป็นบันทึกของเวอร์ชันที่มาก่อนเวอร์ชันปัจจุบัน คุณค่าของการย้อนกลับไปดูไม่ได้อยู่ที่การเห็นว่าอะไรเปลี่ยนไปเท่านั้น',
        en: 'These studies are not presented as a collection of perfect answers. They are records of the versions that came before the current one. The value of looking back is not simply seeing what changed.',
      },
    },
    {
      type: 'pull',
      text: {
        th: 'แต่คือการเห็นว่าห้องหนึ่งห้องค่อย ๆ ชัดเจนขึ้นอย่างไร เมื่อมีข้อมูลมากขึ้น',
        en: 'It is seeing how a room becomes more defined as more information becomes available.',
      },
    },

    {
      type: 'h2',
      text: { th: '06 — การวัดขนาด (The Measurements)', en: '06 — The Measurements' },
    },
    {
      type: 'p',
      text: {
        th: 'เมื่อการจัดวางลงตัว ขนาดก็กลายเป็นเรื่องสำคัญอย่างยิ่ง ห้องอาจดูกว้างในแบบวาด แต่ห้องจริงต้องรองรับของจริงที่มีขนาดจริง',
        en: 'Once the layout was established, dimensions became critical. A room may look spacious in a drawing. But a real room has to accommodate real objects with real dimensions.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'เตียงมีความยาวและความลึก ตู้เสื้อผ้ามีความลึกที่กระทบพื้นที่ใช้สอยด้านหน้า ครัวมีพื้นที่ตายตัว โต๊ะ ตู้รองเท้า ที่เก็บของ และของบิลต์อินทั้งหมดล้วนกินพื้นที่จริง',
        en: 'The bed has a length and a depth. The wardrobe has a depth that affects the usable space in front of it. The kitchen has a fixed footprint. The desk, shoe cabinet, storage, and built-ins all occupy physical space.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'เราจึงทำงานกับขนาดในสามทิศทาง:',
        en: 'So we work with dimensions in three directions:',
      },
    },
    {
      type: 'pull',
      text: {
        th: 'L × D × H — ความยาว ความลึก ความสูง',
        en: 'L × D × H — Length. Depth. Height.',
      },
    },
    slide(
      '06-measurements',
      {
        en: 'The plan with its overall dimensions, 350 by 720 cm, beside the size of each piece of furniture',
        th: 'แปลนพร้อมขนาดรวม 350 คูณ 720 ซม. และขนาดของเฟอร์นิเจอร์แต่ละชิ้น',
      },
      { en: 'The Measurements. Small numbers. Big consequences.', th: 'การวัดขนาด ตัวเลขเล็ก ๆ ผลใหญ่ ๆ' },
      'reading',
    ),
    {
      type: 'table',
      caption: { en: 'The room, in centimetres', th: 'ตัวห้อง หน่วยเป็นเซนติเมตร' },
      head: [{ en: 'Space', th: 'พื้นที่' }, { en: 'Width', th: 'กว้าง' }, { en: 'Length', th: 'ยาว' }],
      rowHeader: true,
      rows: [
        [{ en: 'Whole room (25.2 sqm)', th: 'ทั้งห้อง (25.2 ตร.ม.)' }, '350', '720'],
        [{ en: 'Balcony', th: 'ระเบียง' }, '140', '160'],
        [{ en: 'Bathroom', th: 'ห้องน้ำ' }, '210', '160'],
        [{ en: 'Living area', th: 'พื้นที่ใช้สอย' }, '350', '560'],
      ],
    },
    {
      type: 'table',
      caption: { en: 'The pieces, in centimetres', th: 'เฟอร์นิเจอร์แต่ละชิ้น หน่วยเป็นเซนติเมตร' },
      head: [{ en: 'Piece', th: 'ชิ้น' }, 'L', 'D', 'H'],
      rowHeader: true,
      rows: [
        [{ en: 'Kitchen', th: 'ครัว' }, '195', '45', '100'],
        [{ en: 'Wall', th: 'ผนัง' }, '260', '10', '240'],
        [{ en: 'Table', th: 'โต๊ะ' }, '300', '45', '70'],
        [{ en: 'Shelf', th: 'ชั้นวาง' }, '60', '45', '240'],
        [{ en: 'Bed', th: 'เตียง' }, '200', '160', '45'],
        [{ en: 'Closet', th: 'ตู้เสื้อผ้า' }, '150', '60', '240'],
      ],
    },
    {
      type: 'p',
      text: {
        th: 'ตัวเลขทำให้แบบวาดขยับจากการจัดวางเชิงนามธรรม ไปเป็นสิ่งที่สร้างได้ ตกแต่งได้ และใช้งานได้จริง',
        en: 'The measurements allow the drawing to move from an abstract arrangement into something that can actually be built, furnished, and used.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'ตัวเลขเหล่านี้คือทั้งหมดที่ต้องใช้ ลองจัดห้องเดียวกันนี้ด้วยตัวเองดู',
        en: 'Those numbers are all it takes. Try arranging the same room yourself.',
      },
    },
    {
      type: 'interactive',
      id: 'room-fit',
      title: { en: 'Arrange the room yourself', th: 'ลองจัดห้องเอง' },
      description: {
        en: 'The same 25.2 sqm room, with the five pieces at the real sizes from the table above. At the start everything fits — and the room still does not work. Drag the pieces (or select one and use the arrow keys, and R to turn it) until all five rules hold: nothing overlaps, the doors stay clear, the walkways are at least 90 cm wide, each piece has room to be used, and there is 120 cm beside the bed.',
        th: 'ห้อง 25.2 ตร.ม. เดียวกัน กับเฟอร์นิเจอร์ห้าชิ้นขนาดจริงตามตารางด้านบน ตอนเริ่มทุกชิ้นใส่ได้พอดี แต่ห้องยังใช้งานไม่ได้ ลากชิ้นส่วน (หรือเลือกแล้วใช้ปุ่มลูกศร และกด R เพื่อหมุน) จนผ่านครบห้าข้อ ได้แก่ ไม่มีชิ้นไหนซ้อนกัน ประตูโล่ง ทางเดินกว้างอย่างน้อย 90 ซม. ทุกชิ้นมีที่ใช้งานหน้าตัวเอง และข้างเตียงว่าง 120 ซม.',
      },
      size: 'wide',
      minHeight: 640,
    },

    {
      type: 'h2',
      text: { th: '07 — แปลนสุดท้าย (The Final Plan)', en: '07 — The Final Plan' },
    },
    {
      type: 'p',
      text: {
        th: 'หลังผ่านการทดลองซ้ำ การวัดขนาด ข้อจำกัด และการตัดสินใจเรื่องการจัดวาง แปลนก็มาถึงรูปแบบสุดท้าย นี่คือเวอร์ชันที่รวมทุกอย่างเข้าด้วยกัน',
        en: 'After the iterations, measurements, constraints, and layout decisions, the plan reaches its final form. This is the version that brings everything together.',
      },
    },
    slide(
      '07-final-plan',
      {
        en: 'The final floor plan with every piece of furniture in its place',
        th: 'แปลนสุดท้ายที่เฟอร์นิเจอร์ทุกชิ้นอยู่ในตำแหน่งของมัน',
      },
      { en: 'The Final Plan. Every piece earns its place.', th: 'แปลนสุดท้าย ทุกชิ้นมีเหตุผลของที่ที่มันอยู่' },
    ),
    {
      type: 'p',
      text: {
        th: 'เฟอร์นิเจอร์มีตำแหน่งที่แน่นอน โซนการใช้งานมีที่ของมัน ระยะว่างถูกพิจารณาแล้ว และขนาดถูกสรุปแล้ว',
        en: 'The furniture has a defined position. The functional zones have their place. The clearances have been considered. The dimensions have been resolved.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'แปลนจึงไม่ใช่แค่ความคิดว่าห้องหนึ่งอาจใช้งานได้อย่างไรอีกต่อไป มันกลายเป็นแปลนที่ห้องจริงสามารถถูกสร้างขึ้นมาจากมันได้',
        en: 'And the plan is no longer just an idea of how a room might work. It becomes the plan from which the room can actually be made.',
      },
    },

    {
      type: 'h2',
      text: { th: 'บันทึกของการตัดสินใจ', en: 'A record of decisions' },
    },
    {
      type: 'p',
      text: {
        th: 'แปลนพื้นดูเรียบง่ายได้เมื่อทำเสร็จแล้ว สี่เหลี่ยมหนึ่งรูป ผนังไม่กี่ด้าน เตียง ครัว ตู้เสื้อผ้า โต๊ะ',
        en: 'A floor plan can look simple when it is finished. A rectangle. A few walls. A bed. A kitchen. A wardrobe. A desk.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'แต่ทุกเส้นคือการตัดสินใจ ทุกระยะส่งผลต่อระยะอื่น ทุกองค์ประกอบที่ตายตัวเปลี่ยนสิ่งที่เป็นไปได้ในที่อื่น และทุกเวอร์ชันของแปลนมีข้อมูลที่เวอร์ชันก่อนหน้าไม่มี',
        en: 'But every line represents a decision. Every distance affects another distance. Every fixed element changes what is possible somewhere else. And every version of the plan carries information that the previous version did not have.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'เพราะอย่างนี้ เราจึงไม่มองแปลนพื้นเป็นแค่แบบวาด',
        en: 'That is why we don’t see a floor plan simply as a drawing.',
      },
    },
    {
      type: 'pull',
      text: {
        th: 'เรามองมันเป็นบันทึกของการตัดสินใจ',
        en: 'We see it as a record of decisions.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'Design Notes #01 — เราออกแบบห้องหนึ่งห้องอย่างไร จากการศึกษาชุดแรกในปี 2023 สู่แปลนที่เราใช้อยู่ในวันนี้',
        en: 'Design Notes #01 — How We Design a Room. From the first studies in 2023 to the plan we use today.',
      },
    },
  ],
};

export default article;
