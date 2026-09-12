import type { Collection } from '@/data/collectionTypes';

// Collection 03 — Ergonomic & Pet-Friendly
// The hidden details: every distance calculated for two species.
const collection: Collection = {
  slug: 'ergonomic-pet-friendly',
  index: '03',
  title: {
    en: 'Ergonomic & Pet-Friendly',
    th: 'การออกแบบเพื่อมนุษย์และสัตว์เลี้ยง',
  },
  essence: {
    en: 'Every centimetre calculated — for the people and the animals who share it.',
    th: 'ทุกเซนติเมตรผ่านการคำนวณ — เพื่อคนและสัตว์เลี้ยงที่ใช้บ้านหลังเดียวกัน',
  },
  manifesto: {
    en: 'This home has two species of resident. So every distance is calculated — the height of a chair, the sightline from the bed, the position of a switch — precise for your body, and safe for their curiosity, at the same time.',
    th: 'บ้านหลังนี้มีผู้อยู่อาศัยสองสายพันธุ์ เราจึงคำนวณทุกระยะ — ความสูงของเก้าอี้ ระดับสายตาจากเตียง ตำแหน่งของสวิตช์ — ให้พอดีกับสรีระของคุณ และปลอดภัยกับความซนของพวกเขา ในเวลาเดียวกัน',
  },
  hero: '/assets/room-view-out.jpg',
  heroAlt: {
    en: 'Looking out from the bedroom — the 3-metre desk, quiet storage cabinet and built-ins in one view',
    th: 'มุมมองออกจากห้องนอน — เห็นโต๊ะยาว 3 เมตร ตู้เก็บของเงียบ และตู้บิ้วอินในภาพเดียว',
  },
  details: [
    {
      label: 'The 3-Metre Worktop',
      title: { en: 'The three-metre worktop', th: 'โต๊ะปลายเตียงยาว 3 เมตร' },
      body: {
        en: 'A steel-reinforced built-in desk runs the full width of the room, topped in HMR laminate by Formica, with a 75 cm seat height calculated so feet rest flat on the floor — and so a TV or projector on the desk meets your eyeline from bed, no craning.',
        th: 'โต๊ะบิ้วอินเสริมโครงเหล็กยาวตลอดปลายเตียง ผิวลามิเนต HMR โดย Formica พร้อมเก้าอี้สูง 75 ซม. — ระยะที่คำนวณแล้วว่าเท้าวางถึงพื้นพอดี นั่งทำงานนานแค่ไหนก็ไม่เมื่อยขา และเมื่อวางทีวีหรือโปรเจกเตอร์บนโต๊ะ ระดับสายตาจากเตียงจะพอดี ไม่ต้องแหงนคอ',
      },
      spec: {
        en: '3 m long · steel-reinforced · HMR + Formica · 75 cm seat height',
        th: 'ยาว 3 ม. · เสริมโครงเหล็ก · HMR + Formica · เก้าอี้สูง 75 ซม.',
      },
    },
    {
      label: 'The Landing',
      title: { en: 'The landing cabinet', th: 'ตู้ใบแรกที่ประตู' },
      body: {
        en: 'A ceiling-height cabinet at the door: three open shelves above for keys, books and pet food; a three-tier shoe rack below, floated 10 cm off the floor so hurried mornings never stub a toe. The three entrance switches sit flush in the cabinet face.',
        th: 'ตู้บิ้วอินชิดฝ้าข้างประตู ครึ่งบนวางของ 3 ชั้น — กุญแจ หนังสือ อาหารของน้อง ๆ — ครึ่งล่างเป็นชั้นรองเท้า 3 ชั้นกว้าง 60 ซม. ยกลอยจากพื้น 10 ซม. จะได้ไม่เตะชนตอนรีบออกจากบ้าน สวิตช์ไฟทางเข้า 3 จุดฝังเรียบไปกับตัวตู้',
      },
    },
    {
      label: 'The Wardrobe',
      title: { en: 'The full-height wardrobe', th: 'ตู้เสื้อผ้าเต็มผนัง' },
      body: {
        en: 'A 150 × 240 cm three-door wardrobe to the ceiling — blanket storage above, a full hanging rail, four drawers for the personal things — with a full-length mirror alongside for the last look before leaving.',
        th: 'ตู้เสื้อผ้า 150 × 240 ซม. สามบานชิดฝ้า — ชั้นบนสุดเก็บผ้าห่มและของตามฤดู ราวแขวนเต็มช่วง ลิ้นชัก 4 บานสำหรับของส่วนตัว และข้างตู้คือกระจกเต็มตัว สำหรับมองความเรียบร้อยก่อนออกจากบ้าน',
      },
      spec: {
        en: 'HMR + laminate throughout',
        th: 'HMR + Laminate ทั้งเซ็ต',
      },
    },
    {
      label: 'The Quiet Cabinet',
      title: { en: 'The quiet cabinet', th: 'ตู้เก็บของที่ไม่ส่งเสียง' },
      body: {
        en: 'A two-door inverter refrigerator — freezer separated, near-silent, frugal with power — set off the bed’s end with a 90 cm walkway. Beside it, a multi-purpose storage cabinet: two grooved doors that open toward the centre, two internal shelves, and a countertop sized for a microwave — flexible enough for kitchen items or everyday belongings. There is no cooking hob, and cooking that produces smoke, open flame, or heavy odor isn’t permitted in the room — smoking is limited to the building’s designated smoking area.',
        th: 'ตู้เย็น 2 ประตูแยกช่องแช่แข็ง ระบบอินเวอร์เตอร์เสียงเบา ประหยัดไฟ ตั้งเยื้องปลายเตียงโดยเว้นทางเดินกว้าง 90 ซม. ถัดกันคือตู้เก็บของอเนกประสงค์: บานเซาะร่อง 2 บานเปิดเข้าหากึ่งกลาง ชั้นวางของภายใน 2 ชั้น และเคาน์เตอร์ด้านบนสำหรับวางไมโครเวฟ — ใช้เก็บของครัวหรือของใช้ส่วนตัวได้ยืดหยุ่น ห้องพักไม่มีเตาทำอาหาร และไม่อนุญาตให้ทำอาหารที่ก่อควัน เปิดเปลวไฟ หรือมีกลิ่นรบกวนภายในห้อง ส่วนการสูบบุหรี่อนุญาตเฉพาะในพื้นที่สูบบุหรี่ที่จัดไว้ให้เท่านั้น',
      },
    },
    {
      label: 'The Touchpoints',
      title: { en: 'The daily touchpoints', th: 'จุดที่มือแตะทุกวัน' },
      body: {
        en: 'Every built-in is faced in Formica one shade deeper than the floor, on soft-close hardware throughout. Switches are Schneider AvatarOn A, mounted high beyond a pet’s reach; beside the bed, an ArtDNA panel gathers switch, socket and charging port in one place — the phone charges without leaving the bed.',
        th: 'บิ้วอินทั้งห้องปิดผิว Formica โทนเข้มกว่าสีพื้นหนึ่งระดับ บานเปิดนุ่มแบบ soft-close ทุกบาน สวิตช์ Schneider AvatarOn A สีขาว ติดตั้งยกสูงจากพื้นให้พ้นมือ (และเท้า) ของน้อง ๆ ส่วนข้างหัวเตียงคือแผง ArtDNA ที่รวมสวิตช์ ปลั๊ก และพอร์ตชาร์จไว้ในจุดเดียว — ชาร์จโทรศัพท์ได้โดยไม่ต้องลุกจากเตียง',
      },
      spec: {
        en: 'Formica throughout · soft-close everywhere · Schneider AvatarOn A · ArtDNA bedside',
        th: 'Formica ทั้งห้อง · soft-close ทุกบาน · Schneider AvatarOn A · ArtDNA หัวเตียง',
      },
    },
  ],
};

export default collection;
