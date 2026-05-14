# CLAUDE.md — Nature Haven Landing Site

Loaded at every session start. Follow exactly.

## Stack (do not introduce new frameworks without approval)

| Layer | What's used |
|---|---|
| Framework | React 19 + Vite 7 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v3 + CSS custom properties |
| Animation | GSAP 3 + ScrollTrigger · Lenis (smooth scroll) |
| 3D | Three.js + @react-three/fiber + @react-three/drei (lazy-loaded ~1 MB) |
| Deploy | Vercel — push `main` → auto-deploy |
| Live URL | https://naturehaven-living.vercel.app |
| Repo | https://github.com/soulgroundliving/naturehaven |

**No Firebase, no LIFF, no backend** — public marketing site only.

---

## Build / Deploy commands

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server (Vite HMR) |
| `npm run build` | `tsc -b && vite build && node tools/prerender.mjs` — typecheck, bundle, then puppeteer snapshot |
| `npm run build:client-only` | Same minus the prerender step. Use when debugging build issues unrelated to SSG. |
| `npm run prerender` | Just re-run the puppeteer snapshot against an existing `dist/`. |
| `npm run lint` | ESLint check |
| `git push origin main` | Triggers Vercel auto-deploy |

**Verify always on Vercel** (`naturehaven-living.vercel.app`), never localhost — no auth issues here but keep the habit consistent with the main project.

QA time-of-day slots via query param: `?tod=morning|day|sunset|night`

### SSG (puppeteer prerender)

`tools/prerender.mjs` runs after `vite build` to capture the rendered DOM into `dist/index.html`. Without this step the deployed HTML is `<div id="root"></div>` and crawlers see nothing.

How it works:
1. Launches headless Chrome via `@prerenderer/prerenderer` + `@prerenderer/renderer-puppeteer`.
2. Spins up an Express server pointed at `dist/`, navigates to `/`.
3. Forces `prefers-reduced-motion: reduce` and injects `window.__PRERENDER__ = true` before the page mounts.
4. Waits 4 s for lazy chunks (10 lazy sections) to load + initial GSAP timelines to no-op.
5. Captures `document.documentElement.outerHTML` and overwrites `dist/index.html`.

Client opt-outs (via `src/lib/isPrerender.ts`):
- `<VideoBackground>` — remote CloudFront video that would slow puppeteer; not useful in static HTML
- `<OrbScene>` — WebGL canvas; not useful in static HTML
- `<LoadingOverlay>` — `introComplete` starts `true` during prerender so the snapshot shows real content, not a splash

Anything else (TimeOfDay context, Lenis, GSAP reveals) is already gated by `useEffect` or `prefers-reduced-motion` and works correctly.

Browser binary selection (see top of `tools/prerender.mjs`):
- **Linux CI** (Vercel sets `VERCEL=1`) → `@sparticuz/chromium` — Lambda-optimised, smaller, bundles the system libs the Vercel build container is missing. Vercel's default Chromium image rejects vanilla `puppeteer`.
- **Local dev** (Windows / macOS) → puppeteer's bundled Chromium, downloaded on `npm install`.

Vercel cost: first cold build ~+15 s for `@sparticuz/chromium` install. Cached builds: ~5 s extra. No runtime cost — output is just static HTML.

If the prerender step fails, the build fails — same exit-1 contract as TypeScript / Vite. Verify with `grep "Nature Haven" dist/index.html | wc -l` (should be ≥ 10).

---

## Architecture

### Time-of-day adaptive system (the core feature)

Everything visual on this site re-themes based on the visitor's local clock.

```
src/lib/timeOfDay.ts          ← palette definitions + interpolation engine
src/contexts/TimeOfDayContext.tsx  ← provider: live tick, CSS var injection, ?tod= override
src/index.css                 ← CSS utility classes that consume the vars
```

#### How it works end-to-end

1. **`timeOfDay.ts`** defines 4 pure keyframe palettes:
   - `morning` 05:00–11:00 · `day` 11:00–17:00 · `sunset` 17:00–20:00 · `night` 20:00–05:00
   - Each palette has: sky gradient (skyFrom/Via/To), section text/bg tokens (secText*), 3D lighting values, CTA colours, glass material tuning.

2. **`getContinuousPalette(date?)`** — returns a fully *interpolated* palette for the exact current minute, blending between adjacent keyframes with ease-in-out. This makes sky and section colours shift gradually in real time instead of snapping at hour boundaries.

3. **`TimeOfDayProvider`** mounts once, reads the clock, calls `getContinuousPalette()`, then sets a `setInterval(60_000)` to re-blend every minute. Results are injected as CSS custom properties on `<html>` via `applyCSSVars()`. `data-tod` and `data-mood` attributes on `<html>` track the active slot name.

4. **CSS vars** consumed by `.frosted-section`, `.card-surface`, `.sec-text`, `.sec-text-80` etc. in `index.css`. Any component that sits on a frosted section must use these classes — hardcoded colours will not adapt.

5. **3D scene** (`OrbScene.tsx` + `Orb.tsx`) reads `palette` from `useTimeOfDay()` directly and passes lighting + material values to Three.js on each re-render. The orb re-lights on every 60 s tick.

6. **QA override**: `?tod=sunset` forces a pure keyframe palette and disables the live tick. Remove the param to return to live interpolation.

#### Adding a new keyframe slot

1. Add a new `const NEW_SLOT: TimePalette = { ... }` in `timeOfDay.ts`
2. Add it to `TIME_PALETTES` and `TimeOfDay` type
3. Add an entry to `KEYFRAMES` array with its hour
4. `getContinuousPalette` picks it up automatically
5. QA via `?tod=new_slot`

#### Palette token rules (readability)

| Slot | secText | secBg opacity | Notes |
|---|---|---|---|
| morning | `#2B2B2B` dark | 55% | Light sky → dark text on light frosted panels |
| day | `#2B2B2B` dark | 55% | Same |
| sunset | `#2B2B2B` dark | 62% | Warm tan sky composites to ~2:1 with white text — MUST use dark |
| night | `#F5F1EA` cream | 20% | Dark navy sky → light text on near-transparent panels |

**Rule**: if `secBg` composites to luminance > 0.35, use dark secText. If < 0.20, use light secText.

---

### Page structure

All sections are in `src/sections/`. Order in `src/pages/Home.tsx`:

| Section | File | Notes |
|---|---|---|
| Hero | `HeroSection.tsx` | Full-screen video bg + OrbScene (lazy) + GSAP reveal |
| About | `AboutSection.tsx` | Frosted section |
| Invitation | `InvitationSection.tsx` | |
| Residences | `ResidencesSection.tsx` | Room types |
| Amenities | `AmenitiesSection.tsx` | |
| Location | `LocationSection.tsx` | Map embed + frosted |
| Design | `DesignSection.tsx` | |
| Smart Living | `SmartLivingSection.tsx` | |
| FAQ | `FAQSection.tsx` | Accordion (Radix) |
| Contact | `ContactSection.tsx` | LINE CTA |
| Footer | `FooterSection.tsx` | |

### Key components

- **`VideoBackground`** — fixed hero video; `overlayOpacity` CSS var controls darkness
- **`OrbScene` / `Orb`** — lazy R3F scene; uses `useTimeOfDay()` for real-time 3D lighting
- **`Navigation`** — receives `palette` prop; `.nav-on-hero` class applies `text-shadow-hero` var
- **`FloatingLineChat`** — sticky LINE chat button

### 3D scene (important!)

- Loaded via `React.lazy()` — ~1 MB chunk, loads after paint
- `OrbScene` wraps `Orb` in an `OrbErrorBoundary` — if Three.js fails (mobile GPU limits), it silently disappears; page is fully functional without it
- `glassTransmission`, `glassIridescence`, `lightIntensity`, `ambientIntensity`, `envPreset`, `envMapIntensity` all come from the active palette
- **Do not hardcode lighting values in Orb.tsx** — they must come from `useTimeOfDay()`

---

## Aesthetic rules (Muji Minimal)

- Typography: **DM Serif Display** (headings) + **Outfit** (body, weight 300)
- Palette tokens are in `tailwind.config.js` under `extend.colors`: `dark-charcoal`, `sage-green`, `warm-brown`, `subtle-taupe`, `pure-white`
- **Do not hardcode hex** in components — use Tailwind tokens or CSS vars
- `.section-padding`, `.container-main`, `.headline-lg/md/sm`, `.body-text` utility classes defined in `index.css` — use them
- Motion: GSAP only for scroll-driven reveals; CSS `transition: 600ms ease` for colour changes; no layout-bound animation
- **No generic template look** — every section needs intentional hierarchy and editorial spacing

---

## Crawler / SEO state

- `robots.txt` currently blocks all crawlers (stealth mode pre-launch). Flip to `Allow: /` before launch.
- `<meta name="robots" content="noindex, nofollow" />` in `index.html` is the second gate — remove the `noindex` value (or drop the meta) at launch.
- OG image placeholder at `/og-image.jpg` — replace with real shot before launch
- Thai + English copy mixed intentionally; `lang="th"` on `<html>`
- **SSG is live**: `npm run build` produces a fully-prerendered `dist/index.html` (~179 KB, all 13 sections, 11 K words of HTML). When the noindex gates flip, crawlers + social previewers see real content immediately. See the `SSG (puppeteer prerender)` block under Build commands.

---

## What NOT to do

- ❌ Don't add `display: none` slots — the orb scene hides gracefully via ErrorBoundary
- ❌ Don't hardcode colours that should adapt — use `.sec-text`, `.frosted-section` etc.
- ❌ Don't introduce React Query / Zustand / other state libs — no server state here
- ❌ Don't add Firebase / LIFF — this site has no backend
- ❌ Don't animate `width`, `height`, `top`, `left` — compositor properties only
