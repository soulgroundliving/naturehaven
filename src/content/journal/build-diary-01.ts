import type { Article } from '@/data/journalTypes';

// This entry does NOT correspond to any real Facebook/Instagram post — earlier
// versions claimed it was "built from a five-slide carousel" (C10), but no
// such post was ever published anywhere except this site. Owner-clarified
// 2026-09-27: rewritten as the site's own recap of settled facts, with no
// claim of a social-media source. See build-diary-02-materials.ts, which may
// carry the same framing risk and hasn't been re-checked yet.
const article: Article = {
  slug: 'build-diary-01',
  category: { en: 'Build Diary', th: 'บันทึกการสร้าง' },
  title: {
    en: 'Build Diary #1 — what is already decided, on the road to December 2026',
    th: 'Build Diary #1 — สิ่งที่เคาะแล้ว ระหว่างทางสู่ธันวาคม 2026',
  },
  excerpt: {
    en: 'A record kept as the building rises. The first entry: what is already decided — one clear rent, one rule for every home.',
    th: 'บันทึกที่เก็บไว้ระหว่างตึกค่อย ๆ เป็นรูปเป็นร่าง ฉบับแรกว่าด้วยสิ่งที่เคาะแล้ว — ค่าเช่าที่ชัดเจน กติกาเดียวกันทุกห้อง',
  },
  date: '2026-06-19',
  readMinutes: 2,
  hero: '/assets/unit-overview.jpg',
  heroAlt: {
    en: 'A Nature Haven residence opening toward its private balcony',
    th: 'ห้องพัก Nature Haven ที่เปิดออกสู่ระเบียงส่วนตัว',
  },
  blocks: [
    {
      type: 'p',
      text: {
        th: 'เราเปิดบันทึกของตึกไว้ตั้งแต่ตอนที่มันกำลังก่อร่างขึ้นจริง เพื่อให้ผู้ที่กำลังพิจารณาบ้านหลังต่อไปเห็นความคิดเบื้องหลัง ไม่ใช่แค่ห้องที่เสร็จแล้ว นี่คือฉบับแรก — สรุปสิ่งที่เคาะแล้วก่อนวันเปิดตัว',
        en: 'We keep this record open while the building actually rises, so anyone considering where to live next can see the thinking, not only the finished rooms. This is entry one — a recap of what is already settled before opening day.',
      },
    },
    {
      type: 'h2',
      text: { th: 'สิ่งที่เคาะแล้ว', en: 'What is locked in' },
    },
    {
      type: 'table',
      caption: {
        th: 'ที่เคาะแล้วและบอกตรง ๆ ตั้งแต่ก่อนวันเปิด',
        en: 'Settled, and stated plainly before opening day',
      },
      rowHeader: true,
      rows: [
        [
          { th: 'ค่าเช่า', en: 'Rent' },
          {
            th: 'เริ่มต้น 6,900 บาทต่อเดือน เป็นตัวเลขเดียวที่แจ้งตรงไปตรงมา ราคาต่อชั้นอยู่บนเว็บ และไม่มีค่าส่วนกลางเพิ่มเติม',
            en: 'From 6,900 THB a month — one clear figure, stated plainly. The rate for each floor is on the site, and there is no extra common-area fee.',
          },
        ],
        [
          { th: 'รวมอยู่ในค่าเช่า', en: 'Included in rent' },
          {
            th: 'Wi-Fi บริการทำความสะอาดห้อง และดูแลแอร์ ส่วนค่าน้ำค่าไฟแยกตามมิเตอร์ที่ใช้จริง',
            en: 'Wi-Fi, in-unit cleaning and A/C maintenance. Electricity and water are metered separately, by actual use.',
          },
        ],
        [
          { th: 'สัตว์เลี้ยง', en: 'Pets' },
          {
            th: 'ทุกห้องทุกชั้นเลี้ยงได้ กติกาเดียวกันทั้งตึก — สุนัขและแมว ตัวเต็มวัยไม่เกิน 15 กก. ไม่เกิน 2 ตัวต่อห้อง มีค่าสัตว์เลี้ยงรายเดือนต่อตัว ไม่ใช่ข้อยกเว้นที่ต้องต่อรองเป็นราย ๆ',
            en: 'Every unit on every floor is pet-friendly, under one rule for the whole building — dogs and cats up to 15 kg full-grown, two per home at most, with a monthly pet fee per animal. Never an exception to negotiate.',
          },
        ],
        [
          { th: 'สัญญาและวันเข้าอยู่', en: 'Lease and move-in' },
          {
            th: 'สัญญา 12 เดือน ค่าใช้จ่ายวันเข้าอยู่คือค่าจอง เงินประกันความเสียหาย 2 เดือน และค่าเช่าล่วงหน้า 1 เดือน คาดว่าเปิดเข้าอยู่ธันวาคม 2569',
            en: 'A twelve-month lease. Move-in costs are a booking fee, a two-month security deposit and one month of advance rent. Move-in is expected to open in December 2026.',
          },
        ],
      ],
    },
    {
      type: 'pull',
      text: {
        th: 'สิ่งที่พูดอย่างตรงไปตรงมาก่อนวันเปิดตัว มีค่ามากกว่าสิ่งใดที่พิมพ์ออกมาภายหลัง',
        en: 'What is said honestly before opening day is worth more than anything printed after it.',
      },
    },
    {
      type: 'h2',
      text: { th: 'สิ่งที่กำลังดำเนินต่อไป', en: 'What comes next' },
    },
    {
      type: 'p',
      text: {
        th: 'ตอนนี้โฟกัสอยู่ที่งานภายใน — ให้ห้องจริงยืนอยู่ในมาตรฐานเดียวกับภาพเรนเดอร์ที่เคยแสดงไว้ ฉบับที่สองบอกชื่อวัสดุจริงที่เลือกแล้ว หากมีคำถามที่อยากให้ฉบับต่อไปตอบ ทักเราทาง LINE ได้เลย',
        en: 'The present focus is interior work — holding the finished rooms to the same standard as the renderings already shown. Entry two names the actual materials chosen. If there is a question you would like a later entry to answer, message us on LINE.',
      },
    },
  ],
};

export default article;
