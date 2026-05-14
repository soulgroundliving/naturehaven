/// <reference types="vite/client" />

// Set to `true` by tools/prerender.mjs inside puppeteer so client code can
// skip Canvas / autoplay / cursor-follow / intro overlay during the static
// snapshot pass. `undefined` on real client loads.
declare global {
  interface Window {
    __PRERENDER__?: boolean;
  }
}

export {};
