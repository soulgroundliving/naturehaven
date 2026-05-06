// Time-of-day palette system.
// 4 discrete slots derived from local clock; whole site re-paints + 3D scene
// re-lights when slot changes. Override via ?tod=morning|day|sunset|night for QA.

export type TimeOfDay = 'morning' | 'day' | 'sunset' | 'night';

export interface TimePalette {
  slot: TimeOfDay;

  // Sky gradient (top → middle → bottom) — drives hero bg
  skyFrom: string;
  skyVia: string;
  skyTo: string;

  // Glass orb tint — RGB 0..1 for Three.js MeshTransmissionMaterial.color
  orbTint: [number, number, number];

  // DirectionalLight on the orb scene
  lightColor: string;
  lightIntensity: number;
  lightAngle: [number, number, number]; // x, y, z direction in world space
  ambientIntensity: number;

  // drei <Environment preset="..."> — IBL hemisphere driving glass refraction
  envPreset: 'dawn' | 'studio' | 'sunset' | 'night';

  // Text legibility on the gradient bg
  textOnBg: string;
  textMuted: string;

  // CTA accent — slot-aware primary button bg
  // (most slots stay sage; night flips to cool slate so it reads on dark sky)
  ctaBg: string;
  ctaBgHover: string;

  // Hero text-shadow — gives text legibility over the busy video bg.
  // Light slots: white halo (dark text on bright video).
  // Dark slots: dark grounding (white/cream text on tinted dark video).
  textShadow: string;

  // Mood for copy/animation variants
  mood: 'fresh' | 'crisp' | 'warm' | 'still';
  tagline: string; // sub-headline shown below "Nature Haven"
}

const MORNING: TimePalette = {
  slot: 'morning',
  skyFrom: '#E8E4D9',
  skyVia: '#F5EDDF',
  skyTo: '#DEDCD0',
  orbTint: [0.92, 0.95, 0.88],
  lightColor: '#FFE7C4',
  lightIntensity: 1.1,
  lightAngle: [-2.5, 1.5, 1.5], // low east, warm rim
  ambientIntensity: 0.45,
  envPreset: 'dawn',
  textOnBg: '#2B2B2B',
  textMuted: '#5C5650',
  ctaBg: '#3D5A4C',     // brand sage — works on cream sky
  ctaBgHover: '#4A6E5D',
  textShadow:
    '0 1px 2px rgba(255,255,255,0.6), 0 0 18px rgba(255,255,255,0.55)',
  mood: 'fresh',
  tagline: 'ตื่นมารับวันใหม่ที่นี่',
};

const DAY: TimePalette = {
  slot: 'day',
  skyFrom: '#E8E9EA',
  skyVia: '#F0EEE8',
  skyTo: '#DCDED5',
  orbTint: [0.96, 0.98, 0.97],
  lightColor: '#FFF5E0',
  lightIntensity: 1.2,
  lightAngle: [0, 3, 1], // top-front, balanced
  ambientIntensity: 0.55,
  envPreset: 'studio',
  textOnBg: '#2B2B2B',
  textMuted: '#5C5650',
  ctaBg: '#3D5A4C',     // brand sage — neutral baseline
  ctaBgHover: '#4A6E5D',
  textShadow:
    '0 1px 2px rgba(255,255,255,0.6), 0 0 18px rgba(255,255,255,0.55)',
  mood: 'crisp',
  tagline: 'ความสงบในทุกขณะ',
};

const SUNSET: TimePalette = {
  slot: 'sunset',
  skyFrom: '#3D2A3D',
  skyVia: '#C4866A',
  skyTo: '#E8B486',
  orbTint: [1.0, 0.85, 0.78], // rose-gold
  lightColor: '#FF9966',
  lightIntensity: 1.4,
  lightAngle: [-3.5, 0.5, 1], // long horizontal from low west
  ambientIntensity: 0.4,
  envPreset: 'sunset',
  textOnBg: '#FFFFFF',
  textMuted: '#F5E8D8',
  ctaBg: '#3D5A4C',     // brand sage holds against warm sky
  ctaBgHover: '#4A6E5D',
  textShadow:
    '0 2px 4px rgba(0,0,0,0.55), 0 0 14px rgba(0,0,0,0.35)',
  mood: 'warm',
  tagline: 'ปิดวันด้วยใจที่เบา',
};

const NIGHT: TimePalette = {
  slot: 'night',
  skyFrom: '#0E1A28',
  skyVia: '#152937',
  skyTo: '#1A2A2E',
  orbTint: [0.78, 0.86, 0.92], // cool blue
  lightColor: '#9FB8D9',
  lightIntensity: 0.7,
  lightAngle: [0.5, 4, 0.5], // top-down moon
  ambientIntensity: 0.25,
  envPreset: 'night',
  textOnBg: '#F5F1EA',
  textMuted: '#A8B4BC',
  ctaBg: '#5C7A8E',     // cool slate — sage gets lost on dark navy sky
  ctaBgHover: '#465E70',
  textShadow:
    '0 2px 4px rgba(0,0,0,0.6), 0 0 14px rgba(0,0,0,0.4)',
  mood: 'still',
  tagline: 'พักผ่อนในที่ของตัวเอง',
};

export const TIME_PALETTES: Record<TimeOfDay, TimePalette> = {
  morning: MORNING,
  day: DAY,
  sunset: SUNSET,
  night: NIGHT,
};

// Hour ranges: 5–11 morning · 11–17 day · 17–20 sunset · 20–5 night
export function getTimeOfDay(date: Date = new Date()): TimeOfDay {
  const h = date.getHours();
  if (h >= 5 && h < 11) return 'morning';
  if (h >= 11 && h < 17) return 'day';
  if (h >= 17 && h < 20) return 'sunset';
  return 'night';
}

export function isValidSlot(s: string | null | undefined): s is TimeOfDay {
  return s === 'morning' || s === 'day' || s === 'sunset' || s === 'night';
}
