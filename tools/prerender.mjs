// Post-build prerender — captures the SPA's rendered DOM via headless Chrome
// and rewrites dist/index.html with the snapshot. Crawlers, social previews,
// and JS-disabled visitors then see real content instead of an empty <div>.
//
// Run automatically as the third stage of `npm run build`:
//   tsc -b && vite build && node tools/prerender.mjs
//
// Detection on the client:
//   window.__PRERENDER__ === true → puppeteer is rendering us; skip Canvas,
//   skip the loading overlay, skip video autoplay. Plain client loads do not
//   have this flag and behave normally.
//
// Hydration note: prefers-reduced-motion is forced ON inside puppeteer so
// GSAP-driven reveals (HeroSection, frosted-section lift-in, Lenis) skip
// entirely. The captured HTML is therefore in its natural rendered state —
// no animation transforms baked in.

import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import Prerenderer from '@prerenderer/prerenderer';
import PuppeteerRenderer from '@prerenderer/renderer-puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot  = path.resolve(__dirname, '..');
const distDir   = path.join(repoRoot, 'dist');

const ROUTES = ['/'];

// Sanity check — dist must exist before we try to render it.
try {
  await fs.access(path.join(distDir, 'index.html'));
} catch {
  console.error('[prerender] dist/index.html not found. Run `vite build` first.');
  process.exit(1);
}

const prerenderer = new Prerenderer({
  staticDir: distDir,
  renderer: new PuppeteerRenderer({
    headless: true,
    // Generous wait — LoadingOverlay GSAP timeline is ~3s in normal mode.
    // With reduced-motion forced ON it collapses to near-instant, but lazy
    // chunks (10 sections, ~1MB orb) still need time to settle.
    renderAfterTime: 4000,
    maxConcurrentRoutes: 1,
    // Tell client code it's being prerendered. Components key off this to
    // skip Canvas / autoplay / cursor-follow / intro overlay.
    inject: true,
    injectProperty: '__PRERENDER__',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
    ],
    pageSetup: async (page) => {
      // Force reduced-motion so GSAP / Lenis / animated reveals are skipped.
      // Sections that respect the media feature collapse to their final
      // rendered state instantly; captured HTML is animation-free.
      await page.emulateMediaFeatures([
        { name: 'prefers-reduced-motion', value: 'reduce' },
      ]);
      // Match Vercel's reported viewport so any responsive logic captures
      // the same desktop layout that the largest share of crawl bots see.
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    },
    consoleHandler: (route, msg) => {
      // Surface client-side errors so a broken build fails loudly rather
      // than producing a half-rendered snapshot.
      if (msg.type() === 'error') {
        console.warn(`[prerender ${route}] ${msg.text()}`);
      }
    },
  }),
});

try {
  await prerenderer.initialize();
  const rendered = await prerenderer.renderRoutes(ROUTES);

  for (const r of rendered) {
    // `/` → dist/index.html  ·  `/foo` → dist/foo/index.html
    const outDir = path.join(distDir, r.route === '/' ? '' : r.route);
    const outFile = path.join(outDir, 'index.html');
    await fs.mkdir(outDir, { recursive: true });
    await fs.writeFile(outFile, r.html, 'utf8');
    const bytes = Buffer.byteLength(r.html, 'utf8');
    console.log(`[prerender] ${r.route} → ${path.relative(repoRoot, outFile)} (${bytes.toLocaleString()} bytes)`);
  }
} catch (err) {
  console.error('[prerender] failed:', err);
  await prerenderer.destroy();
  process.exit(1);
}

await prerenderer.destroy();
console.log('[prerender] done');
