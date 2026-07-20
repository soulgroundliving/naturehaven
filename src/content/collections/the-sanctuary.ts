import type { Collection } from '@/data/collectionTypes';

// Collection 02 — The Sanctuary
// The bedroom, and the art of shutting the world out.
const collection: Collection = {
  slug: 'the-sanctuary',
  index: '02',
  title: {
    en: 'The Sanctuary',
    th: 'ความสงบและการพักผ่อนที่สมบูรณ์แบบ',
  },
  essence: {
    en: 'Close the door and the city softens — a bedroom quieted detail by detail.',
    th: 'เมื่อประตูปิดลง โลกภายนอกก็เบาลงตาม — ห้องนอนที่เก็บเสียงทีละจุด',
  },
  manifesto: {
    en: 'The truest luxury of rest is silence, so we chased it point by point — an acoustic-sealed door, a floor with its own cushioning layer, a mattress built to five-star-hotel standard — to give the night back to you.',
    th: 'ความหรูที่แท้จริงของการพักผ่อนคือความเงียบ เราจึงตามเก็บเสียงทีละจุด — เทปกันเสียงรอบบานประตู พื้นที่มีชั้นโฟมซับในตัว ไปจนถึงที่นอนมาตรฐานเดียวกับโรงแรมห้าดาว — เพื่อคืนค่ำคืนที่สมบูรณ์กลับมาให้คุณ',
  },
  hero: '/assets/room-view-in.jpg',
  heroAlt: {
    en: 'The bedroom looking toward the private balcony',
    th: 'ห้องนอนมองออกไปยังระเบียงส่วนตัว',
  },
  details: [
    {
      label: 'The Threshold',
      title: { en: 'A door against the noise', th: 'ประตูที่ตัดเสียง' },
      body: {
        en: 'A UPVC door sealed with acoustic tape — close it and the corridor falls away. Secured by an ETH digital lock: five bolts, waterproof, on the TT Lock system, connected to the building.',
        th: 'บานประตู UPVC ติดเทปกันเสียงรอบวง ปิดสนิทแล้วเสียงจากทางเดินเบาลงทันที ล็อกด้วย Digital Door Lock ของ ETH กลอน 5 จุด กันน้ำ ระบบ TT Lock เชื่อมกับระบบอาคารโดยตรง',
      },
      spec: {
        en: 'ETH digital lock · TT Lock · 1-yr unit / 3-yr board warranty',
        th: 'ETH Digital Door Lock · TT Lock · ประกันตัวเครื่อง 1 ปี / แผงวงจร 3 ปี',
      },
    },
    {
      label: 'The Ground',
      title: { en: 'A floor that walks quietly', th: 'พื้นที่เดินแล้วเงียบ' },
      body: {
        en: 'SPC flooring, 10 mm, in Oak White with an integrated foam underlay — soft underfoot, impact-quiet, kind to midnight walks.',
        th: 'พื้น SPC หนา 10 มม. สี Oak White มีชั้นโฟมซับเสียงในตัว — นุ่มใต้ฝ่าเท้า ซับแรงกระแทก เดินกลางดึกโดยไม่ปลุกทั้งห้อง',
      },
      spec: {
        en: 'SPC 10 mm — 0.5 wear layer + 9 core + 0.5 foam',
        th: 'SPC 10 มม. — wear layer 0.5 + core 9 + foam 0.5',
      },
    },
    {
      label: 'The Veil',
      title: { en: 'UV-blocking, without the cord', th: 'กัน UV และไร้สาย' },
      body: {
        en: 'Deep-cream UV-blocking curtains mounted flush to the ceiling, on a cordless hand-drawn rail — cleaner to the eye, and safer for pets, in one decision.',
        th: 'ม่านโทนครีมเข้มกัน UV ติดตั้งชิดฝ้าเพื่อเก็บแสงลอดด้านบน รางแบบจับเลื่อน ไม่มีสายห้อย — เรียบตากว่า และปลอดภัยกับสัตว์เลี้ยงกว่า ในการตัดสินใจเดียว',
      },
    },
    {
      label: 'The Masterpiece Bed',
      title: { en: 'The masterpiece bed', th: 'เตียงชิ้นเอกของห้อง' },
      body: {
        en: 'A Sleep Happy Atlantis Pro V2 — ten inches of pocket springs from the maker behind five-star hotels, breathable for the Thai climate — on a built-in bed with a metre-high full-wall headboard you can truly lean against, lit by a low striplight for the nights that don’t want the big lamp.',
        th: 'ที่นอน Sleep Happy รุ่น Atlantis Pro V2 พ็อกเก็ตสปริงหนา 10 นิ้ว จากผู้ผลิตที่ทำที่นอนให้โรงแรมห้าดาว ระบายอากาศดีเหมาะกับอากาศเมืองไทย วางบนเตียงบิ้วอินกรุหัวเตียงเต็มผนังสูง 1 เมตร — นั่งพิงอ่านหนังสือได้จริง วางของบนหัวเตียงได้ และมีไฟ striplight แสงสลัวสำหรับคืนที่ไม่อยากเปิดไฟดวงใหญ่',
      },
      spec: {
        en: 'Sleep Happy Atlantis Pro V2 · 10-inch pocket spring · 25-year standard · 1 m built-in headboard',
        th: 'Sleep Happy Atlantis Pro V2 · Pocket Spring 10 นิ้ว · มาตรฐานการใช้งาน 25 ปี · หัวเตียงบิ้วอินสูง 1 ม.',
      },
    },
    {
      label: 'The Air',
      title: { en: 'Cool air, easily kept', th: 'ความเย็นที่ดูแลง่าย' },
      body: {
        en: '12,000 BTU of cooling, chosen for easy self-cleaning — with a full professional service once a year, on the house.',
        th: 'เครื่องปรับอากาศ 12,000 BTU เลือกรุ่นที่เน้นถอดล้างง่าย ดูแลเบื้องต้นได้ด้วยตัวเอง และโครงการล้างใหญ่ให้ปีละครั้ง — เพราะอากาศสะอาดไม่ควรต้องรอช่าง',
      },
    },
  ],
};

export default collection;
