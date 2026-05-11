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

  // Sparkle particle colour — must contrast with the hero background so the
  // sparkles are actually visible (white sparkles on a light day sky = invisible)
  sparkleColor: string;
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
  orbTint: [1.0, 1.0, 1.0],      // clear — bubble colour comes from iridescence
  overlayOpacity: 0.45,
  lightColor: '#FFE7C4',
  sparkleColor: '#FFD700',       // gold — vivid against cream sky
  lightIntensity: 1.2,
  lightAngle: [-2.5, 1.5, 1.5], // low east, warm rim
  ambientIntensity: 0.45,
  envPreset: 'dawn',
  envMapIntensity: 2.2,
  glassTransmission: 0.97,  // near-total — bubble is almost entirely see-through
  glassIridescence: 0.95,   // maximum soap-bubble rainbow shimmer
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
  orbTint: [1.0, 1.0, 1.0],      // clear — bubble colour comes from iridescence
  overlayOpacity: 0.42,
  lightColor: '#FFFFFF',
  sparkleColor: '#6090C0',       // soft blue — visible against light grey sky
  lightIntensity: 1.8,            // strong directional = visible specular + iridescence hit
  lightAngle: [-2, 2, 2],        // angled so highlights cross the bubble face
  ambientIntensity: 0.08,         // very low — prevents IBL from washing out shimmer
  envPreset: 'night',             // dark IBL reflects visibly on bubble surface
  envMapIntensity: 4.5,           // very high — night blues show strongly on the thin film
  glassTransmission: 0.97,        // near-total — bubble is almost entirely see-through
  glassIridescence: 1.0,          // full soap-bubble rainbow shimmer
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
  sparkleColor: '#FF7744',       // warm orange — vivid against the purple-orange sky
  lightIntensity: 1.4,
  lightAngle: [-3.5, 0.5, 1], // long horizontal from low west
  ambientIntensity: 0.4,
  envPreset: 'sunset',
  envMapIntensity: 2.4,
  glassTransmission: 0.96,
  glassIridescence: 0.90,   // strong rainbow on warm sunset tones
  textOnBg: '#FFFFFF',
  textMuted: '#F5E8D8',
  ctaBg: '#3D5A4C',     // brand sage holds against warm sky
  ctaBgHover: '#4A6E5D',
  textShadow:
    '0 2px 4px rgba(0,0,0,0.55), 0 0 14px rgba(0,0,0,0.35)',
  mood: 'warm',
  tagline: 'ปิดวันด้วยใจที่เบา',
  secText: '#2B2B2B',
  secText60: 'rgba(43,43,43,0.60)',
  secText70: 'rgba(43,43,43,0.70)',
  secText80: 'rgba(43,43,43,0.80)',
  secText90: 'rgba(43,43,43,0.90)',
  secText55: 'rgba(43,43,43,0.55)',
  secBorder: 'rgba(43,43,43,0.15)',
  secBg: 'rgba(255,255,255,0.62)',
  cardBg: 'rgba(255,255,255,0.76)',
};

const NIGHT: TimePalette = {
  slot: 'night',
  skyFrom: '#0E1A28',
  skyVia: '#152937',
  skyTo: '#1A2A2E',
  orbTint: [0.95, 0.97, 1.0], // faint cool hint, mostly clear
  overlayOpacity: 0.90,
  lightColor: '#9FB8D9',
  sparkleColor: '#C8D8F0',       // cool silver-blue — visible against dark navy
  lightIntensity: 0.7,
  lightAngle: [0.5, 4, 0.5], // top-down moon
  ambientIntensity: 0.25,
  envPreset: 'night',
  envMapIntensity: 2.8,
  glassTransmission: 0.96,
  glassIridescence: 0.80,   // visible rainbow shimmer against the dark sky
  textOnBg: '#F5F1EA',
  textMuted: '#A8B4BC',
  ctaBg: '#5C7A8E',     // cool slate — sage gets lost on dark navy sky
  ctaBgHover: '#465E70',
  textShadow:
    '0 2px 4px rgba(0,0,0,0.6), 0 0 14px rgba(0,0,0,0.4)',
  mood: 'still',
  tagline: 'พักผ่อนในที่ของตัวเอง',
  secText: '#F5F1EA',
  secText60: 'rgba(245,241,234,0.65)',
  secText70: 'rgba(245,241,234,0.75)',
  secText80: 'rgba(245,241,234,0.85)',
  secText90: 'rgba(245,241,234,0.92)',
  secText55: 'rgba(245,241,234,0.60)',
  secBorder: 'rgba(245,241,234,0.20)',
  // Dark glass — guarantees cream text is readable regardless of video brightness.
  // rgba(white) panels let video bleed through and create near-white bg that hides cream text.
  secBg: 'rgba(6,12,24,0.74)',
  cardBg: 'rgba(255,255,255,0.09)',
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

// ── Continuous interpolation ──────────────────────────────────────────────────
// Blends two palettes by progress t ∈ [0,1].
// Numeric + color fields lerp smoothly; discrete strings snap at t=0.5.

function lerpNum(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpTuple3(
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): [number, number, number] {
  return [lerpNum(a[0], b[0], t), lerpNum(a[1], b[1], t), lerpNum(a[2], b[2], t)];
}

function lerpHex(a: string, b: string, t: number): string {
  const ch = (n: number) => Math.round(n).toString(16).padStart(2, '0');
  const [ar, ag, ab_] = [parseInt(a.slice(1,3),16), parseInt(a.slice(3,5),16), parseInt(a.slice(5,7),16)];
  const [br, bg, bb_] = [parseInt(b.slice(1,3),16), parseInt(b.slice(3,5),16), parseInt(b.slice(5,7),16)];
  return `#${ch(lerpNum(ar,br,t))}${ch(lerpNum(ag,bg,t))}${ch(lerpNum(ab_,bb_,t))}`;
}

function lerpRgba(a: string, b: string, t: number): string {
  const nums = (s: string) => (s.match(/[\d.]+/g) ?? ['0','0','0','1']).map(Number);
  const [ar, ag, ab_, aa] = nums(a);
  const [br, bg, bb_, ba] = nums(b);
  return `rgba(${Math.round(lerpNum(ar,br,t))},${Math.round(lerpNum(ag,bg,t))},${Math.round(lerpNum(ab_,bb_,t))},${lerpNum(aa??1,ba??1,t).toFixed(2)})`;
}

function lerpColor(a: string, b: string, t: number): string {
  if (a.startsWith('#') && b.startsWith('#')) return lerpHex(a, b, t);
  if (a.startsWith('rgb')) return lerpRgba(a, b, t);
  return t < 0.5 ? a : b;
}

function snap<T>(a: T, b: T, t: number): T { return t < 0.5 ? a : b; }

export function interpolatePalettes(a: TimePalette, b: TimePalette, t: number): TimePalette {
  return {
    slot:              snap(a.slot, b.slot, t),
    skyFrom:           lerpColor(a.skyFrom, b.skyFrom, t),
    skyVia:            lerpColor(a.skyVia, b.skyVia, t),
    skyTo:             lerpColor(a.skyTo, b.skyTo, t),
    orbTint:           lerpTuple3(a.orbTint, b.orbTint, t),
    overlayOpacity:    lerpNum(a.overlayOpacity, b.overlayOpacity, t),
    lightColor:        lerpColor(a.lightColor, b.lightColor, t),
    sparkleColor:      lerpColor(a.sparkleColor, b.sparkleColor, t),
    lightIntensity:    lerpNum(a.lightIntensity, b.lightIntensity, t),
    lightAngle:        lerpTuple3(a.lightAngle, b.lightAngle, t),
    ambientIntensity:  lerpNum(a.ambientIntensity, b.ambientIntensity, t),
    envPreset:         snap(a.envPreset, b.envPreset, t),
    envMapIntensity:   lerpNum(a.envMapIntensity, b.envMapIntensity, t),
    glassTransmission: lerpNum(a.glassTransmission, b.glassTransmission, t),
    glassIridescence:  lerpNum(a.glassIridescence, b.glassIridescence, t),
    textOnBg:          lerpColor(a.textOnBg, b.textOnBg, t),
    textMuted:         lerpColor(a.textMuted, b.textMuted, t),
    ctaBg:             lerpColor(a.ctaBg, b.ctaBg, t),
    ctaBgHover:        lerpColor(a.ctaBgHover, b.ctaBgHover, t),
    textShadow:        snap(a.textShadow, b.textShadow, t),
    mood:              snap(a.mood, b.mood, t),
    tagline:           snap(a.tagline, b.tagline, t),
    secText:           lerpColor(a.secText, b.secText, t),
    secText60:         lerpColor(a.secText60, b.secText60, t),
    secText70:         lerpColor(a.secText70, b.secText70, t),
    secText80:         lerpColor(a.secText80, b.secText80, t),
    secText90:         lerpColor(a.secText90, b.secText90, t),
    secText55:         lerpColor(a.secText55, b.secText55, t),
    secBorder:         lerpColor(a.secBorder, b.secBorder, t),
    secBg:             lerpColor(a.secBg, b.secBg, t),
    cardBg:            lerpColor(a.cardBg, b.cardBg, t),
  };
}

// Keyframe hours → pure palette anchors.
// Entry at 29 = 5 am next day so night→morning wraps correctly.
const KEYFRAMES: ReadonlyArray<{ hour: number; slot: TimeOfDay }> = [
  { hour:  5, slot: 'morning' },
  { hour: 11, slot: 'day'     },
  { hour: 17, slot: 'sunset'  },
  { hour: 20, slot: 'night'   },
  { hour: 29, slot: 'morning' },
];

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// Returns a fully interpolated palette for the exact current minute.
// Use this instead of TIME_PALETTES[getTimeOfDay()] for live rendering.
export function getContinuousPalette(date: Date = new Date()): TimePalette {
  const h = date.getHours() + date.getMinutes() / 60;
  const nh = h < 5 ? h + 24 : h; // normalise: midnight–4:59 → 24–28.x

  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    const from = KEYFRAMES[i];
    const to   = KEYFRAMES[i + 1];
    if (nh >= from.hour && nh < to.hour) {
      const raw = (nh - from.hour) / (to.hour - from.hour);
      return interpolatePalettes(TIME_PALETTES[from.slot], TIME_PALETTES[to.slot], easeInOut(raw));
    }
  }

  return TIME_PALETTES['morning'];
}
