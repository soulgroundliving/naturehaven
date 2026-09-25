// Contrast measured from what the browser actually painted, not from what the CSS says it should paint.
//
// A screenshot is decoded (a small PNG reader: 8-bit RGB or RGBA, no interlace, which is what Chromium writes),
// the background behind a piece of text is taken as the most common colour inside its box (the glyphs are a minority
// of the pixels), and the text colour is what the browser computed for it. Two bugs in this project got past
// checks that read the CSS - white text on a beige zone at night, and dark text on a dark sky from 04:45 to 18:25 -
// because a colour is only as good as what is under it.
import { inflateSync } from 'node:zlib';

const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

/** Decode a PNG into { width, height, at(x, y) -> [r, g, b] } (alpha is composited over white; screenshots are opaque). */
export function decodePng(buffer) {
  if (!buffer.subarray(0, 8).equals(SIGNATURE)) throw new Error('not a PNG');
  let offset = 8;
  let header = null;
  const chunks = [];
  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    const body = buffer.subarray(offset + 8, offset + 8 + length);
    if (type === 'IHDR') header = { width: body.readUInt32BE(0), height: body.readUInt32BE(4), depth: body[8], colour: body[9], interlace: body[12] };
    if (type === 'IDAT') chunks.push(body);
    if (type === 'IEND') break;
    offset += 12 + length;
  }
  if (!header || header.depth !== 8 || header.interlace !== 0 || ![2, 6].includes(header.colour)) throw new Error(`unsupported PNG ${JSON.stringify(header)}`);
  const bytes = header.colour === 6 ? 4 : 3;
  const stride = header.width * bytes;
  const raw = inflateSync(Buffer.concat(chunks));
  const pixels = Buffer.alloc(stride * header.height);
  for (let y = 0; y < header.height; y += 1) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let x = 0; x < stride; x += 1) {
      const left = x >= bytes ? pixels[y * stride + x - bytes] : 0;
      const up = y > 0 ? pixels[(y - 1) * stride + x] : 0;
      const upLeft = y > 0 && x >= bytes ? pixels[(y - 1) * stride + x - bytes] : 0;
      let value = line[x];
      if (filter === 1) value += left;
      else if (filter === 2) value += up;
      else if (filter === 3) value += Math.floor((left + up) / 2);
      else if (filter === 4) {
        const p = left + up - upLeft;
        const pa = Math.abs(p - left);
        const pb = Math.abs(p - up);
        const pc = Math.abs(p - upLeft);
        value += pa <= pb && pa <= pc ? left : pb <= pc ? up : upLeft;
      }
      pixels[y * stride + x] = value & 0xff;
    }
  }
  return {
    width: header.width,
    height: header.height,
    at(x, y) {
      const i = y * stride + x * bytes;
      if (bytes === 3) return [pixels[i], pixels[i + 1], pixels[i + 2]];
      const a = pixels[i + 3] / 255;
      return [0, 1, 2].map((c) => Math.round(pixels[i + c] * a + 255 * (1 - a)));
    },
  };
}

const linear = (v) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const luminance = ([r, g, b]) => 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);

/** WCAG contrast ratio of two [r, g, b] colours. */
export function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** The most common colour in a box of the picture (channels rounded to multiples of 4, so a smooth gradient still has a mode). */
export function modeColour(png, box) {
  const counts = new Map();
  const x0 = Math.max(0, Math.floor(box.x));
  const y0 = Math.max(0, Math.floor(box.y));
  const x1 = Math.min(png.width, Math.ceil(box.x + box.w));
  const y1 = Math.min(png.height, Math.ceil(box.y + box.h));
  for (let y = y0; y < y1; y += 1) {
    for (let x = x0; x < x1; x += 1) {
      const rgb = png.at(x, y);
      const key = rgb.map((v) => v >> 2).join(',');
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  if (!counts.size) throw new Error(`empty box ${JSON.stringify(box)}`);
  const [best] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  return best.split(',').map((v) => Number(v) * 4 + 2);
}

/** Parse "rgb(...)", "rgba(...)" into [r, g, b, a]. */
export function parseColour(text) {
  const [r, g, b, a = 1] = text.match(/[\d.]+/g).map(Number);
  return [r, g, b, a];
}

/** A colour with alpha laid over an opaque one. */
export function over([r, g, b, a], [br, bg, bb]) {
  return [r * a + br * (1 - a), g * a + bg * (1 - a), b * a + bb * (1 - a)];
}

/**
 * The contrast of the text (or icon) matched by `selector`: its computed colour (`fill` for SVG text) against what is
 * painted behind it. The page must have deviceScaleFactor 1 so the picture's pixels are the page's CSS pixels.
 */
export async function contrastOf(page, selector, png, { text: wanted } = {}) {
  const found = await page.evaluate(({ s, only }) => {
    const el = [...document.querySelectorAll(s)].find((node) => only === undefined || node.textContent === only);
    if (!el) return null;
    const box = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return { box: { x: box.left, y: box.top, w: box.width, h: box.height }, colour: el instanceof SVGElement ? style.fill : style.color };
  }, { s: selector, only: wanted });
  if (!found) return { ratio: NaN, note: `no element for ${selector}` };
  const background = modeColour(png, found.box);
  const text = over(parseColour(found.colour), background);
  return { ratio: ratio(text, background), background, text };
}
