import type { Article } from '@/data/journalTypes';
import demoMp4 from './demo.mp4';
import demoWebm from './demo.webm';

// Two encodings of the same clip: the browser plays the first it supports.
const DEMO_SOURCES = [
  { src: demoWebm, type: 'video/webm' },
  { src: demoMp4, type: 'video/mp4' },
] as const;

// DEV-ONLY — served at /journal-sandbox by `npm run dev` and never part of the
// production build (see src/main.tsx). One article that uses every block type,
// so a new block or a style change can be checked by eye in a single place,
// and so tools/test-journal-blocks.mjs has something to drive.
//
// It lives outside src/content/journal/ on purpose: that directory is the
// source of truth for real routes, the sitemap and the prerender list.

const article: Article = {
  slug: 'sandbox',
  category: { en: 'Sandbox', th: 'สนามทดลอง' },
  title: { en: 'Every block, one page', th: 'ทุกบล็อกในหน้าเดียว' },
  excerpt: {
    en: 'A development page that exercises every Journal block type.',
    th: 'หน้าสำหรับนักพัฒนา ใช้ทดสอบบล็อกทุกชนิดของ Journal',
  },
  date: '2026-09-20',
  readMinutes: 1,
  hero: '/assets/hero-room.jpg',
  heroAlt: { en: 'A Nature Haven room', th: 'ห้องพัก Nature Haven' },
  heroOrigin: 'ai',
  layout: { toc: true },
  blocks: [
    { type: 'p', text: { en: 'A paragraph of body text in the reading column.', th: 'ย่อหน้าเนื้อหาในคอลัมน์อ่าน' } },
    { type: 'pull', text: { en: 'A pull quote carries the one line worth remembering.', th: 'ข้อความเด่นคือประโยคเดียวที่อยากให้จำ' } },

    { type: 'h2', text: { en: 'Text blocks', th: 'บล็อกข้อความ' } },
    { type: 'h3', text: { en: 'A sub-heading', th: 'หัวข้อย่อย' } },
    {
      type: 'list',
      items: [
        { en: 'First point of an unordered list', th: 'ข้อแรกของรายการ' },
        { en: 'Second point', th: 'ข้อสอง' },
      ],
    },
    {
      type: 'list',
      ordered: true,
      items: [
        { en: 'Step one', th: 'ขั้นแรก' },
        { en: 'Step two', th: 'ขั้นที่สอง' },
      ],
    },
    { type: 'callout', tone: 'note', title: { en: 'Note', th: 'หมายเหตุ' }, text: { en: 'A neutral aside.', th: 'ข้อความประกอบทั่วไป' } },
    { type: 'callout', tone: 'tip', title: { en: 'Tip', th: 'เคล็ดลับ' }, text: { en: 'A practical suggestion.', th: 'คำแนะนำที่นำไปใช้ได้' } },
    { type: 'callout', tone: 'caution', title: { en: 'Caution', th: 'ข้อควรระวัง' }, text: { en: 'Something to watch for.', th: 'สิ่งที่ควรระวัง' } },
    // No title: the tone must still be stated in words, not only by the border colour.
    { type: 'callout', tone: 'tip', text: { en: 'A tip with no title of its own.', th: 'เคล็ดลับที่ไม่มีหัวข้อ' } },

    { type: 'h2', text: { en: 'Images', th: 'รูปภาพ' } },
    {
      type: 'image',
      src: '/assets/corridor-approach.jpg',
      alt: { en: 'A corridor', th: 'โถงทางเดิน' },
      width: 1086,
      height: 1448,
      origin: 'ai',
      size: 'narrow',
      caption: { en: 'AI-generated, narrow column', th: 'ภาพ AI คอลัมน์แคบ' },
    },
    {
      type: 'image',
      src: '/assets/room-3d-render.jpg',
      alt: { en: 'A 3D render of the room', th: 'ภาพเรนเดอร์ 3 มิติของห้อง' },
      width: 1216,
      height: 871,
      origin: 'render',
      caption: { en: 'A 3D render, reading column', th: 'ภาพเรนเดอร์ คอลัมน์อ่าน' },
    },
    {
      type: 'image',
      src: '/assets/unit-overview.jpg',
      alt: { en: 'A room opening toward its balcony', th: 'ห้องที่เปิดออกสู่ระเบียง' },
      width: 1528,
      height: 1029,
      origin: 'photo',
      size: 'wide',
      caption: { en: 'No badge for a photograph. Wide column.', th: 'ภาพถ่ายไม่มีป้าย คอลัมน์กว้าง' },
    },

    { type: 'h2', text: { en: 'Gallery', th: 'แกลเลอรี' } },
    {
      type: 'gallery',
      label: { en: 'Five views of the room', th: 'ห้าภาพของห้อง' },
      size: 'wide',
      items: [
        { src: '/assets/corridor-approach.jpg', alt: { en: 'The approach', th: 'โถงทางเดิน' }, width: 1086, height: 1448, origin: 'ai', caption: { en: 'The approach', th: 'โถงทางเดิน' } },
        { src: '/assets/room-view-in.jpg', alt: { en: 'Looking out', th: 'มองภายนอก' }, width: 1181, height: 1332, origin: 'ai', caption: { en: 'Looking out', th: 'มองภายนอก' } },
        { src: '/assets/room-view-out.jpg', alt: { en: 'Looking in', th: 'มองภายใน' }, width: 1299, height: 1211, origin: 'ai', caption: { en: 'Looking in', th: 'มองภายใน' } },
        { src: '/assets/bathroom-functional.jpg', alt: { en: 'The bath', th: 'ห้องน้ำ' }, width: 1080, height: 1456, origin: 'ai', caption: { en: 'The bath', th: 'ห้องน้ำ' } },
        { src: '/assets/balcony-view.jpg', alt: { en: 'The balcony', th: 'ระเบียง' }, width: 1086, height: 1448, origin: 'ai', caption: { en: 'The balcony', th: 'ระเบียง' } },
      ],
    },

    { type: 'h2', text: { en: 'Table', th: 'ตาราง' } },
    {
      type: 'table',
      caption: { en: 'Sizes in centimetres', th: 'ขนาดเป็นเซนติเมตร' },
      head: [{ en: 'Piece', th: 'ชิ้น' }, 'L', 'D', 'H'],
      rowHeader: true,
      rows: [
        [{ en: 'Bed', th: 'เตียง' }, '200', '160', '45'],
        [{ en: 'Wardrobe', th: 'ตู้เสื้อผ้า' }, '150', '60', '240'],
      ],
    },

    { type: 'h2', text: { en: 'Video', th: 'วิดีโอ' } },
    {
      type: 'video',
      sources: [...DEMO_SOURCES],
      poster: '/assets/hero-video-poster.jpg',
      width: 480,
      height: 270,
      label: { en: 'A test-pattern clip', th: 'คลิปทดสอบ' },
      origin: 'render',
      caption: { en: 'A self-hosted clip with controls', th: 'คลิปที่โฮสต์เอง มีปุ่มควบคุม' },
    },
    {
      type: 'video',
      sources: [...DEMO_SOURCES],
      poster: '/assets/hero-video-poster.jpg',
      width: 480,
      height: 270,
      label: { en: 'A silent looping clip', th: 'คลิปวนซ้ำไม่มีเสียง' },
      origin: 'render',
      ambient: true,
      size: 'narrow',
    },

    { type: 'h2', text: { en: 'Conditions', th: 'เงื่อนไข' } },
    {
      type: 'choice',
      label: { en: 'Which describes you?', th: 'คุณเป็นแบบไหน?' },
      defaultId: 'remote',
      options: [
        {
          id: 'student',
          label: { en: 'Student', th: 'นักศึกษา' },
          blocks: [{ type: 'p', text: { en: 'Content for the student option.', th: 'เนื้อหาสำหรับนักศึกษา' } }],
        },
        {
          id: 'remote',
          label: { en: 'Works from home', th: 'ทำงานที่บ้าน' },
          blocks: [
            { type: 'p', text: { en: 'Content for the work-from-home option.', th: 'เนื้อหาสำหรับคนทำงานที่บ้าน' } },
            { type: 'callout', text: { en: 'Any leaf block works inside an option.', th: 'บล็อกชนิดใดก็ใส่ในตัวเลือกได้' } },
          ],
        },
        {
          id: 'pets',
          label: { en: 'Has a pet', th: 'เลี้ยงสัตว์' },
          blocks: [{ type: 'p', text: { en: 'Content for the pet option.', th: 'เนื้อหาสำหรับคนเลี้ยงสัตว์' } }],
        },
      ],
    },
    {
      type: 'details',
      summary: { en: 'A collapsed condition', th: 'เงื่อนไขที่พับอยู่' },
      blocks: [{ type: 'p', text: { en: 'Hidden until opened, present in the page either way.', th: 'ซ่อนจนกว่าจะเปิด แต่อยู่ในหน้าเสมอ' } }],
    },
    {
      type: 'details',
      summary: { en: 'A condition that starts open', th: 'เงื่อนไขที่เปิดอยู่' },
      open: true,
      blocks: [{ type: 'p', text: { en: 'Open by default.', th: 'เปิดไว้ตั้งแต่แรก' } }],
    },

    { type: 'h2', text: { en: 'Interactive', th: 'โต้ตอบ' } },
    {
      type: 'interactive',
      id: 'sandbox-demo',
      title: { en: 'A registered piece', th: 'ชิ้นที่ลงทะเบียนแล้ว' },
      description: {
        en: 'Loads when scrolled near. This text is always on the page.',
        th: 'โหลดเมื่อเลื่อนเข้าใกล้ ข้อความนี้อยู่ในหน้าเสมอ',
      },
      minHeight: 96,
    },
    {
      type: 'interactive',
      id: 'not-registered',
      title: { en: 'An unregistered piece', th: 'ชิ้นที่ยังไม่ลงทะเบียน' },
      description: {
        en: 'No component is registered under this id, so only the description shows.',
        th: 'ไม่มีคอมโพเนนต์ที่ลงทะเบียนด้วย id นี้ จึงแสดงเฉพาะคำอธิบาย',
      },
    },
  ],
};

export default article;
