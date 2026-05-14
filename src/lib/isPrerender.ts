// True while tools/prerender.mjs is rendering us inside puppeteer. The script
// injects `window.__PRERENDER__ = true` before the page navigates; on real
// client loads this property does not exist, so the check is falsy and the
// app behaves normally.
//
// Use to skip work that has no SEO value and either bloats the static HTML
// or breaks in a headless context: <Canvas> scenes, <video> autoplay, the
// intro overlay, cursor-follow effects, etc.
export const isPrerender = (): boolean =>
  typeof window !== 'undefined' && window.__PRERENDER__ === true;
