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
| `npm run build` | `tsc -b && vite build` — production bundle |
| `npm run lint` | ESLint check |
| `git push origin main` | Triggers Vercel auto-deploy |

**Verify always on Vercel** (`naturehaven-living.vercel.app`), never localhost — no auth issues here but keep the habit consistent with the main project.

QA time-of-day slots via query param: `?tod=morning|day|sunset|night`

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

- `robots.txt` currently blocks all crawlers (stealth mode pre-launch)
- OG image placeholder at `/og-image.jpg` — replace with real shot before launch
- Thai + English copy mixed intentionally; `lang="th"` on `<html>`

---

## What NOT to do

- ❌ Don't add `display: none` slots — the orb scene hides gracefully via ErrorBoundary
- ❌ Don't hardcode colours that should adapt — use `.sec-text`, `.frosted-section` etc.
- ❌ Don't introduce React Query / Zustand / other state libs — no server state here
- ❌ Don't add Firebase / LIFF — this site has no backend
- ❌ Don't animate `width`, `height`, `top`, `left` — compositor properties only
