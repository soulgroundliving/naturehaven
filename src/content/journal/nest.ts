import type { Article } from '@/data/journalTypes';

const article: Article = {
  slug: 'nest-tang-man',
  category: { en: 'Founder Notes', th: 'บันทึกผู้ก่อตั้ง' },
  title: {
    en: "NEST · Tang Man — the story behind our first building's name",
    th: 'NEST · ตั้งมั่น — เรื่องราวเบื้องหลังชื่ออาคารแรกของเรา',
  },
  excerpt: {
    en: 'Some names just point at a place. Others say what kind of intention it was built with. This is the story behind NEST · Tang Man, and the first intention we wanted to leave with Nature Haven’s first building.',
    th: 'บางชื่อมีไว้เรียกสถานที่ ส่วนบางชื่อบอกว่าสิ่งนั้นถูกสร้างขึ้นด้วยความตั้งใจแบบไหน นี่คือที่มาของชื่อ NEST · ตั้งมั่น และความตั้งใจแรกที่เราอยากฝากไว้กับอาคารหลังแรกของ Nature Haven',
  },
  date: '2026-09-18',
  readMinutes: 6,
  hero: '/assets/corridor-approach.jpg',
  heroAlt: {
    en: 'The corridor approach to NEST, Nature Haven’s first building',
    th: 'ทางเดินเข้าสู่อาคาร NEST อาคารแรกของ Nature Haven',
  },
  blocks: [
    {
      type: 'p',
      text: {
        th: 'บางชื่อมีไว้เพื่อเรียกสถานที่ ส่วนบางชื่อมีไว้เพื่อบอกว่าสิ่งนั้นถูกสร้างขึ้นมาด้วยความตั้งใจแบบไหน',
        en: 'Some names exist only to point at a place. Others exist to say what kind of intention that place was built with.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'ก่อนจะมี Nature Haven ก่อนจะมีอาคารหลังแรก ก่อนที่เราจะรู้ว่าโครงการนี้จะเติบโตไปถึงไหน มีเพียงความตั้งใจของคนสองคน เราอยากสร้างบางสิ่งที่ดี และอยากดูแลมันให้ดี เราไม่รู้ว่าการเริ่มต้นครั้งนี้จะพาเราไปไกลแค่ไหน แต่เรารู้ว่าเราอยากเริ่มต้นมันอย่างตั้งใจ',
        en: "Before there was Nature Haven, before there was a first building, before we knew how far this project would grow, there was only the intention of two people. We wanted to build something good, and we wanted to take good care of it. We didn't know then how far this beginning would take us — but we knew we wanted to start it deliberately.",
      },
    },
    {
      type: 'p',
      text: {
        th: 'และเมื่อถึงวันที่อาคารแรกกำลังจะเกิดขึ้นจริง เราจึงไม่อยากเรียกมันเพียงด้วยชื่อที่บอกว่า "นี่คืออาคารหลังแรก" เราอยากให้ชื่อของมันเก็บเรื่องราวของการเริ่มต้นเอาไว้ด้วย',
        en: 'So when the day came that the first building was about to be real, we didn\'t want to call it something that only said "this is building number one." We wanted its name to hold the story of that beginning too.',
      },
    },
    {
      type: 'h2',
      text: { th: 'ทำไมถึงชื่อ NEST', en: 'Why NEST?' },
    },
    {
      type: 'p',
      text: {
        th: 'เราจึงเลือกคำว่า NEST — Nest คือรัง สถานที่เล็ก ๆ ที่ถูกสร้างขึ้นเพื่อเป็นที่พักพิง เป็นพื้นที่สำหรับเริ่มต้นชีวิต และเป็นพื้นที่ที่สิ่งมีชีวิตสามารถเติบโตได้ก่อนที่จะออกไปพบโลกที่กว้างขึ้น',
        en: 'So we chose the word NEST. A nest is a small place built to be a shelter — a space to begin life in, and a space where a living thing can grow before it goes out to meet a wider world.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'สำหรับเรา NEST จึงเป็นภาพแทนของรังแรกของเราสองคน สิ่งเล็ก ๆ ที่เราเริ่มสร้างร่วมกัน เป็นทั้งพื้นที่สำหรับพัก พื้นที่สำหรับเรียนรู้ พื้นที่สำหรับทดลอง และพื้นที่สำหรับเติบโต',
        en: 'For us, NEST is a picture of our own first nest — a small thing the two of us began building together. A space to rest in, to learn in, to try things in, and to grow in.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'Nature Haven เองก็เริ่มต้นในลักษณะเดียวกัน มันไม่ได้เกิดขึ้นจากคำตอบที่สมบูรณ์แบบตั้งแต่วันแรก แต่ค่อย ๆ เติบโตจากการตัดสินใจเล็ก ๆ มากมาย จากสิ่งที่เราเรียนรู้ จากสิ่งที่เราเปลี่ยนใจ และจากความตั้งใจที่จะทำให้สิ่งที่อยู่ตรงหน้าในวันนี้ดีขึ้นกว่าเมื่อวาน NEST จึงเป็นสัญลักษณ์ของการเริ่มต้นแบบนั้น',
        en: "Nature Haven itself began the same way. It didn't arrive as a perfect answer on day one — it grew, slowly, out of many small decisions: out of what we learned, out of what we changed our minds about, and out of the intention to make what's in front of us today a little better than yesterday. NEST is a symbol of that kind of beginning.",
      },
    },
    {
      type: 'p',
      text: {
        th: 'แต่เรายังรู้สึกว่าชื่อเดียวไม่สามารถบอกความหมายทั้งหมดที่เราอยากฝากไว้กับอาคารหลังนี้ได้ เราจึงให้มันมีอีกชื่อหนึ่ง',
        en: "But we still felt that one name couldn't carry the whole meaning we wanted to leave with this building. So we gave it a second name.",
      },
    },
    {
      type: 'h2',
      text: { th: 'ตั้งมั่น — เจตจำนงเบื้องหลังสิ่งที่เราสร้าง', en: 'Tang Man — the intention behind what we build' },
    },
    {
      type: 'p',
      text: {
        th: 'คำว่า "ตั้งมั่น" สำหรับเรา ไม่ได้หมายถึงการยืนอยู่กับที่ แต่หมายถึงการมีเจตจำนงที่ชัดเจน ก่อนที่เราจะสร้างพื้นที่ให้คนอื่นอยู่อาศัย เราอยากตั้งเจตจำนงของผู้สร้างไว้เสียก่อนว่า เราจะสร้างสิ่งนี้ด้วยความตั้งใจ',
        en: "The word \"Tang Man\" (ตั้งมั่น), for us, doesn't mean standing still. It means holding a clear intention. Before we built a space for anyone else to live in, we wanted to set the builder's intention first: that we would build this with care.",
      },
    },
    {
      type: 'p',
      text: {
        th: 'เราจะใส่ใจกับรายละเอียด แม้บางอย่างอาจไม่มีใครสังเกตเห็น เราจะรับผิดชอบต่อสิ่งที่เราเลือกสร้าง เราจะไม่มองอาคารเป็นเพียงสิ่งปลูกสร้างที่สร้างเสร็จแล้วจบลง และเราจะพยายามดูแลสิ่งที่เราเริ่มต้นขึ้นมาให้เติบโตอย่างดี',
        en: 'We would pay attention to details, even ones no one might ever notice. We would take responsibility for what we chose to build. We would not treat a building as something finished the moment construction ends — and we would try to take care of what we started, so it grows well.',
      },
    },
    {
      type: 'pull',
      text: {
        th: 'สิ่งที่ผู้สร้างใส่ลงไปในจุดเริ่มต้น จะค่อย ๆ ปรากฏออกมาในสิ่งที่เขาสร้าง',
        en: 'What a builder puts into the beginning slowly shows itself in what they build.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'นั่นคือเหตุผลที่เราตั้งชื่อภาษาไทยว่า "ตั้งมั่น" เพื่อเตือนตัวเราเองว่า ก่อนจะสร้างอะไรให้คนอื่น เราต้องรู้ก่อนว่าเรากำลังสร้างมันด้วยเจตนาอะไร',
        en: "That's why we named it \"Tang Man\" in Thai — to remind ourselves that before building anything for someone else, we first need to know what intention we're building it with.",
      },
    },
    {
      type: 'h2',
      text: { th: 'สองชื่อ จุดเริ่มต้นเดียว', en: 'Two names. One beginning.' },
    },
    {
      type: 'p',
      text: {
        th: 'NEST บอกถึงจุดเริ่มต้นของการเติบโต ตั้งมั่น บอกถึงเจตจำนงของผู้สร้าง หนึ่งคือสิ่งที่เรากำลังสร้าง อีกหนึ่งคือหลักที่เราอยากยึดไว้ในขณะที่มันเติบโต และเมื่อสองความหมายนี้อยู่ด้วยกัน มันจึงกลายเป็นชื่อของอาคารแรกของ Nature Haven — NEST · ตั้งมั่น',
        en: "NEST speaks to the beginning of growth. Tang Man speaks to the intention of the builder. One is what we're building; the other is the principle we want to hold onto while it grows. Put the two meanings together, and they become the name of Nature Haven's first building — NEST · Tang Man.",
      },
    },
    {
      type: 'p',
      text: {
        th: 'เราอยากให้อาคารนี้เป็นจุดเริ่มต้นที่ดี สำหรับคนที่กำลังเริ่มต้นชีวิตช่วงหนึ่ง กำลังสร้างงาน กำลังสร้างความสัมพันธ์ กำลังสร้างครอบครัว กำลังค้นหาตัวเอง หรือเพียงกำลังมองหาสถานที่ที่ทำให้รู้สึกว่าตัวเองสามารถหยุดพัก และค่อย ๆ เติบโตได้',
        en: 'We want this building to be a good beginning — for someone starting a new chapter of life, building a career, building a relationship, building a family, still finding themselves, or simply looking for a place that lets them stop, rest, and grow at their own pace.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'เราไม่ได้คาดหวังว่า NEST จะเป็นสถานที่ที่ทุกคนจะอยู่ตลอดไป เพราะรังเองก็ไม่ได้มีไว้เพื่อกักขังการเติบโต มันมีไว้เพื่อให้เราได้พัก ได้รับการดูแล สร้างรากฐาน และเมื่อถึงเวลา ก็พร้อมที่จะเติบโตออกไป นั่นคือความหมายของ NEST สำหรับเรา',
        en: "We don't expect NEST to be the place everyone stays forever. A nest was never meant to hold growth in — it exists so we can rest, be looked after, build a foundation, and, when the time comes, be ready to grow beyond it. That's what NEST means to us.",
      },
    },
    {
      type: 'p',
      text: {
        th: 'และนั่นคือสิ่งที่เราอยากให้อาคารแรกของ Nature Haven เป็น ไม่ใช่เพียงจุดเริ่มต้นของโครงการ แต่เป็นจุดเริ่มต้นที่เราตั้งใจจะทำให้ดี',
        en: "And that's what we want the first building of Nature Haven to be — not merely the start of a project, but a beginning we intend to make good.",
      },
    },
    {
      type: 'pull',
      text: {
        th: 'สร้างด้วยความตั้งใจ เติบโตด้วยความใส่ใจ',
        en: 'To build with intention. To grow with care.',
      },
    },
    {
      type: 'p',
      text: {
        th: 'NEST · ตั้งมั่น จุดเริ่มต้นแรกของ Nature Haven',
        en: 'NEST · Tang Man — the first beginning of Nature Haven.',
      },
    },
  ],
};

export default article;
