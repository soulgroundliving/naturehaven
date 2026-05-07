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

  // Multiply-blend overlay opacity over the video bg — night is stronger
  overlayOpacity: number;

  // DirectionalLight on the orb scene
  lightColor: string;
  lightIntensity: number;
  lightAngle: [number, number, number]; // x, y, z direction in world space
  ambientIntensity: number;

  // drei <Environment preset="..."> — IBL hemisphere driving glass refraction
  envPreset: 'dawn' | 'studio' | 'sunset' | 'night';

  // envMapIntensity for meshPhysicalMaterial — lower for bright slots to prevent
  // IBL reflections from bleaching out the glass transmission effect
  envMapIntensity: number;

  // Glass material tuning — light-background slots need lower transmission so
  // the sphere has visible material presence rather than disappearing into sky.
  // Boost iridescence to compensate: colour-play keeps it feeling glassy even
  // when it's less see-through.
  glassTransmission: number; // 0..1 (0.96 = maximum transparency, night)
  glassIridescence: number;  // 0..1 (higher = more rainbow shimmer)

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

  // Frosted section tokens — used by all bg-pure-white/30 sections
  secText: string;     // primary text on frosted sections
  secText60: string;   // label / muted text
  secText70: string;   // sub-body / secondary copy
  secText80: string;   // body copy
  secText90: string;   // high-contrast text
  secText55: string;   // faint / decorative text
  secBorder: string;   // divider / border lines
  secBg: string;       // frosted section background (rgba)
  cardBg: string;      // elevated card surface on frosted sections
}

const MORNING: TimePalette = {
  slot: 'morning',
  skyFrom: '#E8E4D9',
  skyVia: '#F5EDDF',
  skyTo: '#DEDCD0',
  orbTint: [0.98, 0.93, 0.85],   // warm peach tint — stands out against cream sky
  overlayOpacity: 0.45,
  lightColor: '#FFE7C4',
  lightIntensity: 1.0,
  lightAngle: [-2.5, 1.5, 1.5], // low east, warm rim
  ambientIntensity: 0.28,
  envPreset: 'dawn',
  envMapIntensity: 1.8,
  glassTransmission: 0.65,  // semi-glass — cream sky gives no contrast for full transparency
  glassIridescence: 0.68,   // strong shimmer compensates for lower transmission
  textOnBg: '#2B2B2B',
  textMuted: '#5C5650',
  ctaBg: '#3D5A4C',     // brand sage — works on cream sky
  ctaBgHover: '#4A6E5D',
  textShadow:
    '0 1px 2px rgba(255,255,255,0.6), 0 0 18px rgba(255,255,255,0.55)',
  mood: 'fresh',
  tagline: 'ตื่นมารับวันใหม่ที่นี่',
  secText: '#2B2B2B',
  secText60: 'rgba(43,43,43,0.60)',
  secText70: 'rgba(43,43,43,0.70)',
  secText80: 'rgba(43,43,43,0.80)',
  secText90: 'rgba(43,43,43,0.90)',
  secText55: 'rgba(43,43,43,0.55)',
  secBorder: 'rgba(43,43,43,0.15)',
  secBg: 'rgba(255,255,255,0.55)',
  cardBg: 'rgba(255,255,255,0.88)',
};

const DAY: TimePalette = {
  slot: 'day',
  skyFrom: '#E8E9EA',
  skyVia: '#F0EEE8',
  skyTo: '#DCDED5',
  orbTint: [0.78, 0.87, 0.97],   // clear sky-blue tint — glass reads against grey sky
  overlayOpacity: 0.42,
  lightColor: '#D0E8FF',          // cool blue-white light — picks up the tint
  lightIntensity: 1.1,
  lightAngle: [0, 3, 1],
  ambientIntensity: 0.25,         // lower — reduces white wash on transmission
  envPreset: 'dawn',              // softer IBL than 'studio'
  envMapIntensity: 1.2,
  glassTransmission: 0.60,        // half-glass — light bg needs material presence
  glassIridescence: 0.75,         // strong shimmer gives glassy quality at low transmission
  textOnBg: '#2B2B2B',
  textMuted: '#5C5650',
  ctaBg: '#3D5A4C',     // brand sage — neutral baseline
  ctaBgHover: '#4A6E5D',
  textShadow:
    '0 1px 2px rgba(255,255,255,0.6), 0 0 18px rgba(255,255,255,0.55)',
  mood: 'crisp',
  tagline: 'ความสงบในทุกขณะ',
  secText: '#2B2B2B',
  secText60: 'rgba(43,43,43,0.60)',
  secText70: 'rgba(43,43,43,0.70)',
  secText80: 'rgba(43,43,43,0.80)',
  secText90: 'rgba(43,43,43,0.90)',
  secText55: 'rgba(43,43,43,0.55)',
  secBorder: 'rgba(43,43,43,0.15)',
  secBg: 'rgba(255,255,255,0.55)',
  cardBg: 'rgba(255,255,255,0.88)',
};

const SUNSET: TimePalette = {
  slot: 'sunset',
  skyFrom: '#3D2A3D',
  skyVia: '#C4866A',
  skyTo: '#E8B486',
  orbTint: [1.0, 0.97, 0.95], // faint warm hint, mostly clear
  overlayOpacity: 0.52,
  lightColor: '#FF9966',
  lightIntensity: 1.4,
  lightAngle: [-3.5, 0.5, 1], // long horizontal from low west
  ambientIntensity: 0.4,
  envPreset: 'sunset',
  envMapIntensity: 2.4,
  glassTransmission: 0.95,  // dark warm sky gives good contrast — nearly full transparency
  glassIridescence: 0.40,
  textOnBg: '#FFFFFF',
  textMuted: '#F5E8D8',
  ctaBg: '#3D5A4C',     // brand sage holds against warm sky
  ctaBgHover: '#4A6E5D',
  textShadow:
    '0 2px 4px rgba(0,0,0,0.55), 0 0 14px rgba(0,0,0,0.35)',
  mood: 'warm',
  tagline: 'ปิดวันด้วยใจที่เบา',
  secText: '#FFFFFF',
  secText60: 'rgba(255,255,255,0.60)',
  secText70: 'rgba(255,255,255,0.70)',
  secText80: 'rgba(255,255,255,0.80)',
  secText90: 'rgba(255,255,255,0.90)',
  secText55: 'rgba(255,255,255,0.55)',
  secBorder: 'rgba(255,255,255,0.15)',
  secBg: 'rgba(255,255,255,0.30)',
  cardBg: 'rgba(255,255,255,0.32)',
};

const NIGHT: TimePalette = {
  slot: 'night',
  skyFrom: '#0E1A28',
  skyVia: '#152937',
  skyTo: '#1A2A2E',
  orbTint: [0.95, 0.97, 1.0], // faint cool hint, mostly clear
  overlayOpacity: 0.78,
  lightColor: '#9FB8D9',
  lightIntensity: 0.7,
  lightAngle: [0.5, 4, 0.5], // top-down moon
  ambientIntensity: 0.25,
  envPreset: 'night',
  envMapIntensity: 2.8,
  glassTransmission: 0.96,  // maximum — dark navy sky shows off the glass perfectly
  glassIridescence: 0.35,
  textOnBg: '#F5F1EA',
  textMuted: '#A8B4BC',
  ctaBg: '#5C7A8E',     // cool slate — sage gets lost on dark navy sky
  ctaBgHover: '#465E70',
  textShadow:
    '0 2px 4px rgba(0,0,0,0.6), 0 0 14px rgba(0,0,0,0.4)',
  mood: 'still',
  tagline: 'พักผ่อนในที่ของตัวเอง',
  secText: '#F5F1EA',
  secText60: 'rgba(245,241,234,0.60)',
  secText70: 'rgba(245,241,234,0.70)',
  secText80: 'rgba(245,241,234,0.80)',
  secText90: 'rgba(245,241,234,0.90)',
  secText55: 'rgba(245,241,234,0.55)',
  secBorder: 'rgba(245,241,234,0.15)',
  secBg: 'rgba(255,255,255,0.20)',
  cardBg: 'rgba(255,255,255,0.24)',
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
