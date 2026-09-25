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

## Journal articles

An article is ONE file, `src/content/journal/<slug>.ts` — the filename IS the route slug (prerender derives its route list from the directory; register the article in `src/data/journal.ts` and add it to `public/sitemap.xml`, which `npm run test:seo` checks). It holds metadata plus a list of typed **blocks**. Every text is bilingual `{ en, th }`. Types: `src/data/journalTypes.ts` · renderer: `src/components/journal/` · pure helpers: `src/lib/journalBlocks.ts`.

| Block | Use it for | Notes |
|---|---|---|
| `p` `h2` `h3` `pull` | prose | `h2`/`h3` get stable anchor ids from their English text (`#01-the-plan`); override with `id` |
| `list` | bullets, steps | `ordered: true` for numbered |
| `callout` | an aside | `tone`: note · tip · caution |
| `image` | one figure | real `width`/`height`, `alt`, **`origin` (required)**; `size`: narrow 480 · reading 720 · wide 1000 |
| `gallery` | a swipeable set — a carousel post, a series of views | native scroll-snap; every slide is in the DOM |
| `video` | a self-hosted clip | `poster` required, `preload="none"`; `ambient: true` = silent loop, plays only while visible, never under reduced-motion |
| `table` | specs, comparisons | real `<table>`; a cell is a plain string when identical in both languages |
| `choice` | content that changes by situation ("which describes you?") | tab set; **every option is in the DOM** so crawlers read all of them; the chunk loads only on pages that use it, and until it arrives (or if it never does) the options render as plain stacked sections — no condition is ever hidden by a failed import |
| `details` | many conditions, terms, an FAQ | native `<details>` |
| `interactive` | a game, calculator, simulator | see below |

Article-level: `layout: { toc?, hero? }` (a table of contents appears on its own from 4 `h2` sections; `hero: 'none'` for pieces that open with a video or an interactive) · `heroOrigin`. Section headings get anchors (`#01-the-plan`), and a shared `/journal/<slug>#section` link opens at that section.

**Rules the code enforces**
- `origin` (`photo` · `drawing` · `render` · `ai`) is **required on every image, gallery item and video**, and `render`/`ai` show a visible badge — "AI and 3D renders are always disclosed" is a compile error to skip for body media. **The one exception is the hero:** `heroOrigin` is optional, only the article page shows its badge (cards and tiles never do), and the existing articles' heroes have not been audited — that is an open owner decision, not a guarantee.
- `alt`, real `width`/`height`, and non-empty `items` / `rows` / `options` are required by the types; both languages must be filled and every table row as wide as its header (`npm run test:journal` checks the rest).
- Assets live in `public/assets/journal/<slug>/` as WebP, same-site paths only: the CSP is `img-src 'self' data:` + `frame-src 'none'`, so external images and iframes are blocked (YouTube/Vimeo embeds need a CSP change and an owner decision — not supported yet). **Never overwrite an asset under `/assets`:** it is served `immutable` for a year, so a changed picture needs a new filename or returning visitors keep the old one.
- A clip with speech needs `tracks` (WebVTT captions) — the type cannot know.

**An interactive piece** (game, calculator): write `src/components/journal/interactive/<Name>.tsx` (default export, props `{ lang, reducedMotion }`), register it in `interactive/registry.ts`, then use `{ type: 'interactive', id, title, description }`. `description` is real content — it is what crawlers, no-JS readers, the prerendered snapshot and a failed load see. It loads only when scrolled near, runs same-origin (no iframe), and a crash falls back to the description.

The first real piece is **`room-fit`** (Design Notes #01, section 06): drag the six real-size pieces (bed, closet, kitchen counter, fridge, table, shoe shelf) onto the real 25.2 sqm plan until five rules hold — nothing overlaps · doors clear · walkways ≥ 90 cm · room to use each piece · 120 cm beside the bed — while **"Room to live in"** measures how wide each of the brief's spaces really is in the visitor's arrangement and grades it: tight / minimum / just right / comfortable. Split so the rules can be tested on plain Node: **rules and geometry** in `src/lib/roomFit.ts`, the **width standards** — the one place the tier thresholds live, which the rules, the panel and the words all read — in `src/lib/roomStandards.ts`, the **widest-route search** in `src/lib/roomFitRoute.ts` and the **key mapping** in `room-fit/pieceKeys.ts` and the **compass words** in `src/lib/roomFitCompass.ts` (all pure, no DOM; covered by `tools/__tests__/roomFit.test.ts`, `pieceKeys.test.ts`, `roomStandards.test.ts` and `roomFitCompass.test.ts`, which check the words against the geometry), the **screen** in `interactive/room-fit/` (`RoomFit` chooses the setting · `useRoomFitGame` state and rules · `RoomBoard` pointer/touch/keyboard · `PieceShape` incl. the bed's head · `SpacesPanel` = "Room to live in" · `RoomBackdrop` incl. the compass rose · `GhostPlan` · `OurPlan` · `RulesList` · `PieceControls`), and **every word it shows** in `room-fit/copy.ts` (and `room-fit/spaceCopy.ts` for the width panel) (edit the copy there; numbers from the article come from `roomFit.ts`, never typed twice — the wall openings are even drawn from `DOOR_ZONES`, so the picture cannot disagree with the rules). Three things worth knowing before you touch it: the walkway is *measured* (narrowest point of the widest route from the front door, on a 2.5 cm lattice — exact for the 5 cm grid pieces snap to), not a rule of thumb; that measurement is heavy on a mid-range phone (100-250 ms), so it runs **once the pieces have held still for 150 ms**, never per drag step — until then the four quick rules stay live, the route is hidden, and the header says "checking…" instead of quoting a score it has not verified (a `useDeferredValue` version looked equivalent and blocked the thread for most of a drag; `test:room-fit` guards this); and the door positions, the fridge's size (55×55 cm; its height is unknown, so the article's table says "—"), the pillars and the door zones are **estimates read off the plan** — the balcony door is a **double sliding door that fills its exit (120 cm, centred; read off a site photo, the owner's slides draw it narrower)**, which the game's own footnote says. The width standards (minimum / just right / comfortable, cm — walk 80/90/120 · bedside 60/90/120 · closet 60/90/120 · kitchen 70/90/120 · fridge 55/70/90 · table 60/70/90 · shelf 40/50/90) are **Nature Haven's own working numbers**, drawn in the spirit of universal design (WELL v2 Accessibility and Universal Design); only two have a published counterpart (walkway ↔ ADA 91 cm route / 81 cm at a point; kitchen ↔ NKBA 91 cm walkway / 107 cm one-cook aisle), the rest are our own judgement — they are **not a WELL requirement**, and no copy may say WELL specifies them (`test:room-fit` asserts it). The game asks "just right" of every space, except beside the bed, which asks "comfortable" (120 cm: the article's own number). The final plan follows slides 4 and 7 — bed head at the left wall; down the right wall the table, the **fridge**, the kitchen counter and the shelf by the front door — the fridge is a **piece of its own** (55×55) that sticks out 10 cm past the 45 cm units, which makes the plan's narrowest walkway 95 cm (bed to fridge) (the shelf is a shoe rack below, storage above: description only, nothing to draw in plan view). **Directions** ("faces east", "head towards the east") come from `src/lib/roomFitCompass.ts` and the compass rose on the plan; slide 3 prints only N (bottom) and S (top), so east on the left and west on the right were *deduced* — **the owner confirmed them against the building (2026-09-20)**; if that ever changes it is a one-line fix (`COMPASS`) that the tests then follow.

**Three settings, one game (2026-09-21).** `RoomFit.tsx` holds one `useRoomFitGame` (state, the five rules, the spaces) and picks how to show it: **inline** (`RoomFitInline`) from 1024 px up — the board sticky beside the rules; **compact** (`RoomFitCompact`) below 1024 px — a picture of the plan, the score and one button, because stacked, the turn button ended up 1.7 screens below the board and every rotation meant scrolling (the owner, on a phone); and **full screen** (`RoomFitPlay`, a dialog in a portal — `useDialog`: page scroll locked, Escape closes, Tab trapped, focus given back to the button that opened it) opened from either. Full screen is *upright* (`PlayHeader` · plan + `PlayRail` · `PlaySheet` at the foot) or, when the screen is wider than tall (`min-aspect-ratio: 6/5`: a desktop, a tablet or phone on its side), *wide* (plan as tall as the screen, the rail, and the rules in `PlayPanel` — no sheet). Two things that cost a round each: a class that sets `display` beats the `hidden` attribute (the sheet body used to stay on screen while "hidden" and squeezed the plan to a strip — `test:room-fit` now checks the *drawn* state), and picking a piece up must never change how tall anything is, or the plan rescales under the finger (the header is always two lines, the sheet's verdict keeps a two-line slot). **Doors** (`DoorsLayer`; geometry in `src/lib/roomFitDoors.ts`, proved on plain Node by `roomFitDoors.test.ts`): drawn as the owner's plan draws them — the front door hinged left swinging OUT to the corridor, the bathroom door hinged left swinging INTO the bathroom, the balcony a double slider — a click, tap or Enter/Space toggles one, a button toggles all, and opening a door never changes the rules (none swings into the living area). Door state lives in the game, so it survives opening and closing full screen and "Start over". The swing directions and the balcony frame width (120 cm) are estimates until the owner confirms them. The full-screen dialog also (all found by the independent review, each with a test that goes red without it): pushes a history entry of its own, so a phone's Back gesture closes the game instead of leaving the article and losing it (`RoomFit.tsx`; same URL, so React Router sees no navigation — its `ScrollToTop` reacts to `pathname` only); makes `#root` `inert` while it is up (`aria-modal` alone is not honoured everywhere — VoiceOver on iOS); keeps **pinch-zoom** (`touch-action: pinch-zoom` on the dialog and `pan-y pinch-zoom` on its scrollers — `none` had switched zoom off over the whole game, measured with a two-finger touch sequence, which matters to a visitor with low vision; the article-only touchstart guard in `RoomBoard` is why an *inline* piece cannot start a pinch, and a second finger anywhere on the plan ends a piece drag so a pinch never carries a piece); and leaves a spacer as tall as the game in the article while it is up, or the page shrinks and, on closing, scroll anchoring leaves the reader ~120 px from where they were. A door's focus ring is the `group/door` variant — `focus-visible:[&>rect]:` compiles to `.x>rect:focus-visible`, which never matches.

**The page-by-page reader (2026-09-25; open to everyone since 2026-09-26 by a button under the article's title — a `?guide` link does the same).** The long article put the game a scroll away from its own controls, so `design-notes-01` also has an eight-page reader (`article.guide` in the article file: which section each page is, and its `stage`): one section's words under a picture, changing together; page 7 is the real game (its own `useRoomFitGame`, played through `PlayStage` — the same stage the full-screen dialog uses). Nothing in it is written twice: `src/lib/journalGuide.ts` (pure; `tools/__tests__/journalGuide.test.ts`) cuts the pages out of the article's own blocks — a page is the blocks between its h2 and the next, so editing the article edits the guide — and the drawn stages (`plan brief constraints layout final`, `components/journal/guide/GuideStage.tsx`, one entry per stage in a `Record` so a new stage cannot compile without a drawing) draw from the same `roomFit.ts` geometry the rules use. A page whose stage draws its own picture drops the section's own image (`01-plan-2.webp` is a marketing cover card that carries the article's title); `slide` and `measurements` pages draw nothing and lead with the section's own image, origin badge and all. Blocks are drawn by `renderBlock.tsx` — the same renderer as the long page, so a new block type shows up in both. **The URL is the whole state**: open exactly when it has `?guide` (not `=0`/`=false`) and the article has pages; the button under the title ("Read page by page · 8 pages", `ArticleView.tsx`; it shows only on an article that has a guide) pushes `?guide=1`, so Back closes the reader, and the close button pops that entry (`navigate(-1)`: no dead step of the same page) and gives focus back to the button; a reader opened by a link has no entry of ours, so closing replaces the URL without the flag (a reload does not reopen it) and focus goes to the article's heading. The button fetches the reader (and the game inside it) on pointer-enter, pointer-down and focus, so nothing is downloaded until a finger is near it; it is white on the palette's call-to-action colour (7.6:1 by day, 4.5:1 at night — the site's own pairing, and not much room). It is lazy (the game is not in the article's bundle) behind a `BlockBoundary` (a stale chunk after a deploy leaves the article whole and shows a dismissible notice — without it a failed import blanked the page). **What cost a round (read before touching it):** (1) the dialogs are painted with `dialogSurface.ts` — the sky **under the palette's frosted veil** (`--sec-bg`): the `sec-*` text colours are made for a frosted panel, and on the bare sky they were 1.0-1.4:1 from 04:45 to 18:25 every day (the counter and icons invisible; the full-screen game's heading too). Every earlier test ran at `tod=day` and `tod=night` and never saw it — `tools/guide/contrast.mjs` now measures painted pixels at all five slots, `dialogSurface.test.ts` the whole day; (2) a dialog needs `touch-action: pinch-zoom` or the browser pans the page and cancels a finger dragging a piece (measured: a 100 px drag moved the bed 17 px — and the test that 'passed' only asked whether it moved at all; it now asks how far); (3) labels are sized in plan units (about half a pixel per cm on a phone, less with browser bars up), so they are short ("Balcony", not "Balcony door") and 20-26 units; the plan must get most of the height — the card is capped at 40 dvh and scrolls inside itself with a faded last line, and on a screen too short for both (a desktop zoomed to 400%) the page scrolls as a whole; (4) a light opaque zone fill under a theme-coloured label went white-on-beige at night, so every zone fill is translucent; (5) DoorsLayer's own button is ~24 px tall at that scale, so the dashed marker round each door is the tap target — pointer-only, the door's real button stays DoorsLayer's; its focus ring is `non-scaling-stroke` (screen pixels) and a held key toggles a door once; (6) Back and Next are `aria-disabled`, not `disabled` (a disabled button cannot keep focus at the ends); the bar's segments are `tabindex=-1` 28 px targets drawn as a border (so Windows high contrast keeps them), which `useDialog`'s Tab trap used to count as stops (it now ignores `tabindex=-1` of every kind — shared with the game's dialog); an overflowing card is a `tabIndex=0` named region; the counter is one live region ("Page 3 of 8: title", replaced whole) and describes the dialog; the dialog carries `lang`; focus is rescued when a layout swap drops it; (7) `splitNumber` only takes a number of at most two digits followed by a spaced dash or `.`/`:` and a space — `3-bedroom plans`, `24-hour access`, `2.5 m ceilings` and `10:30 check-in` are words; (8) port 4190 is one Node's `fetch` refuses ("bad port"), which made the dev-harness probe fail for a while. Known gaps: the try page's lead-in paragraph is not shown (the game's header says the task); the site-wide `<html lang="th">` does not follow the language toggle (tracked separately); sage focus rings elsewhere on the site are 1.5-2.3:1 at night.

**A new block type:** add it to the union in `journalTypes.ts` — `tsc` then fails until `renderLeaf.tsx` / `JournalBlocks.tsx` handle it.

**Preview and tests**
- `npm run dev` → `/journal-sandbox`: every block on one page (dev-only, never in the production build; source `src/content/journal-sandbox/kitchen-sink.ts`).
- `npm run test:journal` — unit tests (`tools/__tests__/`, Node's built-in runner, type-checked by `tsc -b`) + a two-layer contract over EVERY article (`tools/test-journal-content.mjs`; run `npm run build` first). **Source layer** (`src/lib/journalContract.ts`, both languages): no empty text, no empty arrays, rectangular tables, unique tab ids, same-site paths only, every referenced file exists in `public/`. **Output layer** (the prerendered `dist/` pages): alt + size on every image, video poster + `preload="none"`, unique DOM ids, TOC anchors resolve, every block type the source uses actually rendered, interactive ids registered, no literal `**` from a pasted draft. It is **not** part of `npm run build`, so it only protects an article when someone runs it — run it before pushing article changes.
- `npm run test:journal:ui` — starts the dev server and drives the sandbox in headless Chromium: gallery, tabs, details, video, lazy interactive, TOC jump, `#section` deep link, language switch, reduced motion — and two failure drills (the tab-set chunk failing to download, an interactive piece that throws). `/journal-sandbox?crash` adds the throwing piece.
- `npm run test:room-fit` — (split into `tools/test-room-fit.mjs`, which runs one module per part of the game from `tools/room-fit/` in order, and `tools/lib/room-fit-driver.mjs`, the helpers that drive the page; add a check to the module it belongs to) opens the real article in headless Chromium and plays the game: real mouse drags to the winning plan, wall clamping, releasing outside the board, the "Room to live in" panel (every space's cm and tier at the start, in the final plan, with the closet nudged to exactly 90 and then 85 cm, and with the bed pushed into the middle; its details open; Thai; the walkway shown as "checking…" while a piece is held), the board staying in view beside the long column on a wide screen, no false "you win" right after a move that only broke the walkway, the route stepping aside while a piece is held, keyboard (5 cm / Shift 25 cm / R — also from a Thai layout, and Ctrl/Alt/Cmd shortcuts left to the browser), the on-screen arrow buttons incl. press-and-hold and a two-finger press that must not leave a timer running, spoken position announcements, night-theme ring and outline colours, Show plan / Start over, Thai and switching language mid-game, the doors (a click, a button, Enter/Space; drawn as the plan draws them; the rules untouched; kept through "Start over"), the full-screen dialog on a desktop (covers the page, one game, Tab stays inside, Escape gives focus back), and the phone: on 390 px the article holds a card and no board, *Play full screen* puts the plan, the turn button, the arrow keys, the doors button and the result on ONE screen with no scrolling, a real tap selects and turns a piece, a real touch drag moves it by exactly as far as it went without scrolling the page, the sheet scrolls itself, closing/Escape give back the page, the focus and the game as it was left — and the same on 360×640 and 375×550 phones, a tablet held upright, and a phone on its side (the wide layout). Shares `tools/lib/dev-harness.mjs` with the test above.
- `npm run test:guide` — (`tools/test-journal-guide.mjs` runs one module per part of the reader from `tools/guide/`; the helpers are `tools/lib/guide-driver.mjs` and `tools/lib/contrast.mjs`, a small PNG reader that measures what was painted) opens the article with `?guide` and checks: the way in (a "Read page by page · 8 pages" button in both languages, only on an article that has a guide, 44 px tall and inside a 320 px screen, fetching the reader only as a pointer approaches, a tap pushing an entry that Back or the close button pops with focus returned to the button and no dead step, and Enter / Escape from the keyboard); no reader without the flag, with `=0`/`=false`, or on an article with no guide; eight pages in the article's order, each carrying the article's own lines in English and Thai and none of the next page's, and never a picture inside the words; each drawing described as drawn; the bar, the counter and Back/Next/jump; the strip on top never moving between pages; the URL (closing clears the flag by replacing the entry, a navigation opens and Back closes, a flag left on another article does nothing, a reader that will not load leaves the article whole with a dismissible notice); the doors opened by a real tap on the far corner of their marker and from the keyboard (a held key toggles once), and kept when you turn the page; the game page played with a real touch drag that must travel as far as the finger with no `pointercancel`, and focus surviving a rotation; the dialog holding the page (inert, scroll locked, Tab and Shift+Tab wrap, Enter on Next to the end keeps focus, Escape and Close give everything back and focus the heading); eleven screens (390×844 down to 320×568, browser bars up, a tablet, phones on their side, a desktop at 100%, 200% and 400% zoom) with nothing spilling and a plan big enough to read; a long page fading its last line and always opening at its top; Thai labels and units; the night palette and focus ring; and **contrast measured from pixels at all five palette slots** for the reader, the game heading inside it and the game's own full-screen dialog. Mutation-tested: every one of 50 deliberate bugs turned a named check red (run in groups: one bug can hide another's check).

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
- Thai + English copy mixed intentionally. `index.html` ships `<html lang="th">` (the default, and what the prerendered snapshots carry); `LanguageProvider` then keeps `document.documentElement.lang` on the active language so screen readers pick the right voice (WCAG 3.1.1) — the page-level `lang` lives there, not in components (a `lang` on an inline foreign-language passage is a separate, fine thing)
- **SSG is live**: `npm run build` produces a fully-prerendered `dist/index.html` (~179 KB, all 13 sections, 11 K words of HTML). When the noindex gates flip, crawlers + social previewers see real content immediately. See the `SSG (puppeteer prerender)` block under Build commands.

---

## What NOT to do

- ❌ Don't add `display: none` slots — the orb scene hides gracefully via ErrorBoundary
- ❌ Don't hardcode colours that should adapt — use `.sec-text`, `.frosted-section` etc.
- ❌ Don't introduce React Query / Zustand / other state libs — no server state here
- ❌ Don't add Firebase / LIFF — this site has no backend
- ❌ Don't animate `width`, `height`, `top`, `left` — compositor properties only
