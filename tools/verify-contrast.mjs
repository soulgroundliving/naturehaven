#!/usr/bin/env node
/**
 * verify-contrast.mjs
 * Validates WCAG AA contrast for every time-of-day palette slot.
 *
 * Model:
 *   1. Start with GRADIENT_BG (worst-case mid-point of each slot's sky gradient)
 *   2. Blend secBg overlay on top (alpha composite)
 *   3. Blend each secText* value on that effective background
 *   4. Compute contrast ratio vs effective background
 *
 * Standards:
 *   AA_NORMAL = 4.5:1  (body copy: secText, secText80, secText90)
 *   AA_LARGE  = 3.0:1  (labels / icons: secText55, secText60, secText70)
 *
 * Exit 0 = all pass. Exit 1 = at least one failure.
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, '../src/lib/timeOfDay.ts');

// Worst-case mid-point RGB for each slot's background gradient
// (sample from the actual CSS gradient used in naturehaven)
const GRADIENT_BG = {
  morning: [240, 238, 232],
  day:     [232, 233, 234],
  sunset:  [196, 134, 106],
  night:   [15,  35,  55],
};

// Which tokens to check and their WCAG standard
const TOKEN_STANDARDS = {
  secText55: 'AA_LARGE',
  secText60: 'AA_LARGE',
  secText70: 'AA_LARGE',
  secText80: 'AA_NORMAL',
  secText90: 'AA_NORMAL',
  secText:   'AA_NORMAL',
};

const AA_NORMAL = 4.5;
const AA_LARGE  = 3.0;

// ── WCAG math ──────────────────────────────────────────────────────────────

function linearize(c) {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function relativeLuminance([r, g, b]) {
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

function contrastRatio(rgb1, rgb2) {
  const L1 = relativeLuminance(rgb1);
  const L2 = relativeLuminance(rgb2);
  const lighter = Math.max(L1, L2);
  const darker  = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Alpha-composite src (with alpha) over dst (opaque RGB)
function alphaBlend([r, g, b], alpha, [dr, dg, db]) {
  return [
    Math.round(r * alpha + dr * (1 - alpha)),
    Math.round(g * alpha + dg * (1 - alpha)),
    Math.round(b * alpha + db * (1 - alpha)),
  ];
}

// ── Parser ─────────────────────────────────────────────────────────────────

function parseRgba(str) {
  const m = str.match(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/);
  if (!m) return null;
  return { rgb: [+m[1], +m[2], +m[3]], alpha: +m[4] };
}

function parseOpacity(str) {
  const m = str.trim().match(/^([\d.]+)$/);
  return m ? +m[1] : null;
}

function extractPalettes(src) {
  const slots = ['MORNING', 'DAY', 'SUNSET', 'NIGHT'];
  const result = {};

  for (const slot of slots) {
    const key = slot.toLowerCase();
    // Match `const MORNING: TimePalette = {` or `const MORNING =`
    const re = new RegExp(`(?:const|export const)\\s+${slot}\\s*[=:]`);
    const match = re.exec(src);
    let blockStart = match ? match.index : -1;
    if (blockStart === -1) throw new Error(`Cannot find palette block for ${slot}`);
    const openBrace = src.indexOf('{', blockStart);
    let depth = 0;
    let end = openBrace;
    for (let i = openBrace; i < src.length; i++) {
      if (src[i] === '{') depth++;
      else if (src[i] === '}') { depth--; if (depth === 0) { end = i; break; } }
    }
    const block = src.slice(openBrace, end + 1);
    result[key] = parseBlock(block);
  }
  return result;
}

function parseBlock(block) {
  const palette = {};

  const secBgM = block.match(/secBg:\s*'([^']+)'/);
  if (secBgM) {
    const parsed = parseRgba(secBgM[1]);
    if (parsed) palette.secBg = parsed;
  }

  const secTextM = block.match(/(?<![a-zA-Z0-9])secText:\s*'([^']+)'/);
  if (secTextM) {
    const parsed = parseRgba(secTextM[1]);
    if (parsed) palette.secText = parsed;
    else {
      const op = parseOpacity(secTextM[1]);
      if (op !== null) palette.secText = { rgb: [43, 43, 43], alpha: op };
    }
  }

  for (const suffix of ['55', '60', '70', '80', '90']) {
    const re = new RegExp(`secText${suffix}:\\s*'([^']+)'`);
    const m = block.match(re);
    if (m) {
      const parsed = parseRgba(m[1]);
      if (parsed) {
        palette[`secText${suffix}`] = parsed;
      } else {
        const op = parseOpacity(m[1]);
        if (op !== null) palette[`secText${suffix}`] = { rgb: [43, 43, 43], alpha: op };
      }
    }
  }

  return palette;
}

// ── Main ───────────────────────────────────────────────────────────────────

const src = readFileSync(SRC, 'utf8');
const palettes = extractPalettes(src);

let anyFail = false;
const rows = [];

for (const [slot, palette] of Object.entries(palettes)) {
  const gradBg = GRADIENT_BG[slot];

  let effectiveBg = gradBg;
  if (palette.secBg) {
    effectiveBg = alphaBlend(palette.secBg.rgb, palette.secBg.alpha, gradBg);
  }

  for (const [token, standard] of Object.entries(TOKEN_STANDARDS)) {
    const tokenPalette = palette[token];
    if (!tokenPalette) {
      rows.push({ slot, token, ratio: null, required: standard, pass: null, note: 'missing' });
      continue;
    }

    const textRgb = alphaBlend(tokenPalette.rgb, tokenPalette.alpha, effectiveBg);
    const ratio = contrastRatio(textRgb, effectiveBg);
    const required = standard === 'AA_NORMAL' ? AA_NORMAL : AA_LARGE;
    const pass = ratio >= required;

    if (!pass) anyFail = true;

    rows.push({ slot, token, ratio: ratio.toFixed(2), required: required.toFixed(1), pass, alpha: tokenPalette.alpha });
  }
}

// ── Report ─────────────────────────────────────────────────────────────────

const RESET = '\x1b[0m';
const RED   = '\x1b[31m';
const GREEN = '\x1b[32m';
const BOLD  = '\x1b[1m';
const DIM   = '\x1b[2m';

console.log(`\n${BOLD}WCAG Contrast Audit — time-of-day palettes${RESET}`);
console.log('─'.repeat(70));
console.log(`${'Slot'.padEnd(10)}${'Token'.padEnd(14)}${'Alpha'.padEnd(8)}${'Ratio'.padEnd(10)}${'Req'.padEnd(8)}Result`);
console.log('─'.repeat(70));

let lastSlot = '';
for (const r of rows) {
  if (r.slot !== lastSlot) {
    if (lastSlot) console.log('');
    lastSlot = r.slot;
  }
  if (r.pass === null) {
    console.log(`${r.slot.padEnd(10)}${r.token.padEnd(14)}${'—'.padEnd(8)}${'—'.padEnd(10)}${'—'.padEnd(8)}${DIM}MISSING${RESET}`);
    continue;
  }
  const result = r.pass ? `${GREEN}✓ PASS${RESET}` : `${RED}✗ FAIL${RESET}`;
  console.log(
    `${r.slot.padEnd(10)}${r.token.padEnd(14)}${r.alpha.toFixed(2).padEnd(8)}${(r.ratio + ':1').padEnd(10)}${(r.required + ':1').padEnd(8)}${result}`
  );
}

console.log('─'.repeat(70));
if (anyFail) {
  console.log(`\n${RED}${BOLD}✗ Contrast check FAILED — raise opacity values in timeOfDay.ts${RESET}`);
  console.log(`  Minimum for AA_LARGE  (3.0:1): ~0.50 on dark bg, ~0.65 on light bg`);
  console.log(`  Minimum for AA_NORMAL (4.5:1): ~0.65 on dark bg, ~0.72 on light bg\n`);
  process.exit(1);
} else {
  console.log(`\n${GREEN}${BOLD}✓ All contrast checks passed${RESET}\n`);
  process.exit(0);
}
