# Nature Haven — Design System

> Quiet living in Saimai.
> A residence shaped by intention —
> where life gently returns to its natural rhythm.

Nature Haven is a 20-unit, low-rise private residence in Saimai (Bangkok), available from **August 2026**. It is positioned as a MUJI-inspired, calm-centered home for working professionals, couples, and quiet-living enthusiasts. The brand operates across three surfaces:

1. **Marketing landing site** — tells the story of the residence, layout, rental terms, and location.
2. **Smart Living app** — a tenant utility for booking & payments, maintenance, air-quality monitoring, and pet vaccination tracking.
3. **Line OA / collateral** — short reservation prompts and seasonal updates.

This design system codifies the visual and verbal language across all three so any agent or designer can produce on-brand work without rebuilding the rules each time.

---

## Sources

> ⚠️ **The codebase mounted at `nature-haven/` was empty at the time this system was generated.** The system is built from the supplied brand brief (copy, layout, materials, rental terms) and from the brand's stated reference points: MUJI minimal living, a soft-light Thai-residential context, and the wall-paint reference NP OW 2154P. **Please re-attach the codebase, Figma, or any photography you have so this system can be tightened against the real visual reality.** Substitutions made along the way are flagged inline.

- Brand brief: provided in chat (residence philosophy, rental details, in-room essentials, location, design & materials, sustainability)
- Codebase: `nature-haven/` (mounted, currently empty — please re-import)
- Figma: not provided
- Photography: not provided (placeholders used)

---

## Index

| File | Purpose |
|---|---|
| `README.md` | This file — brand context, content fundamentals, visual foundations, iconography. |
| `SKILL.md` | Agent-Skills-compatible entry point. Read first when used as a downloaded skill. |
| `colors_and_type.css` | All design tokens (color, type, spacing, radii, shadow, motion). Import this before anything else. |
| `fonts/` | (none required — IBM Plex Sans Thai Looped + Plex Serif loaded from Google Fonts) |
| `assets/` | Logos, marks, photographic placeholders, illustration scraps. |
| `preview/` | Design-system tab cards (type / color / spacing / components / brand). |
| `ui_kits/marketing/` | Marketing landing UI kit (hero, residences, location, contact). |
| `ui_kits/app/` | Smart Living tenant app UI kit (home, booking, maintenance, air quality). |

---

## Content Fundamentals

Nature Haven's voice is **quiet, contemplative, deliberate**. Copy is set in short lines, often broken poetically with em-dashes (—) and ellipses of thought rather than commas. The brand speaks *to* a reader who already understands what matters; it does not sell.

### Tone

- **Calm, never urgent.** No exclamation marks. No "Limited time!" framing. The opening rate is shown as a quiet aside, not a hook.
- **First-person plural, sparingly.** "Our Philosophy", "we" is rare; the brand prefers third-person observation: *"True comfort is never excessive."*
- **You-addressing reserved for invitations.** "Reserve your space quietly." — used at the end, not as a hammer.
- **Bilingual, with Thai handled with the same restraint as English.** Mixed Thai/English is allowed inline (e.g. *"ชั้น 1–2 — 5,800 THB / month"*).

### Casing and punctuation

- **Sentence case** for headings and UI; never all-caps except in the rare eyebrow label.
- **Em-dash (—) is the brand's signature punctuation.** It separates thought-units in display copy. Use sparingly in UI.
- **Periods are optional** at the end of standalone display lines.
- **Numbers** keep their unit attached: `31.5 sq.m.`, `5,800 THB / month`, `280 m`. No abbreviations like "sqm" — always `sq.m.` with periods.
- **Ranges** use an en-dash with spaces: `1–2 residents`, `ชั้น 1–2`.

### Vocabulary

- Preferred: *quiet, calm, intention, gentle, thoughtfully, stillness, balance, rhythm, ease, residence, space*.
- Avoided: *luxury, premium, exclusive, world-class, smart-home* (use *Smart Living* only as the product name), *amenities* (use *facilities* or *essentials*).
- Don't write "MUJI-style" — write **MUJI-inspired** or **MUJI minimal living** (the brand's own framing).

### Voice examples

> **Hero:** *Quiet Living in Saimai — A residence shaped by intention.*
> **Section opener:** *True comfort is never excessive. It is found in stillness.*
> **CTA:** *Reserve your space quietly.*
> **App empty state:** *Nothing to attend to right now. The day is yours.*
> **Form error:** *We couldn't reach the server. Try again, gently.* (← in-app, lighter touch is fine)

### Emoji and decorative glyphs

- **No emoji in product UI or marketing copy.** The Line OA `👉` from the brief is the only sanctioned exception, and only in chat surfaces.
- The **horizontal rule (`⸻`)** in source copy maps to the brand's hairline divider in design — render it as a 1px ink-line, never as the literal glyph.
- Numbered lists are fine. Bullets prefer a hairline `—` over `•`.

---

## Visual Foundations

### Palette

A warm, paper-toned ground; ink for text; a single muted moss accent. Wood enters through imagery and built-in laminate references rather than as a UI color.

| Token | Hex | Role |
|---|---|---|
| `--paper` | `#F6F2EA` | Primary page ground (≈ NP OW 2154P) |
| `--paper-soft` | `#EFE9DD` | Secondary surface |
| `--linen` | `#E7DFCE` | Tonal band |
| `--sand` | `#D9CDB4` | Quiet block / divider |
| `--oak` | `#B89B73` | Wood reference (sparingly, in brand) |
| `--ink` | `#1F1B16` | Primary text |
| `--ink-3` | `#6B6359` | Secondary text |
| `--ink-line` | `#D8D1C2` | Hairline rule |
| `--moss` | `#6F7A5A` | Single muted accent (links, focus, CTA) |
| `--moss-soft` | `#B7BFA3` | Tinted accent surface, selection |

**Rule:** any view should be reducible to **paper + ink + at most one accent moment**. Wood and sand tones come *primarily through photography*, not chrome.

### Type

- **Display:** IBM Plex Serif, weight 300, tracked slightly tight. Used for hero, section openers, and pull-quotes. Italic is reserved for poetic asides.
- **Sans:** IBM Plex Sans Thai Looped (weight 300 body / 500 emphasis). The looped Thai face matches the warmth of the serif and renders Thai with traditional loops — true to the residence's Thai context.
- **Mono:** IBM Plex Mono, used only for unit numbers, prices, and metadata in the app.
- **Substitution flag:** *No font files were provided. IBM Plex Sans Thai Looped + IBM Plex Serif are loaded from Google Fonts as a close, restrained match for MUJI's typography. If the brand has a contracted face (e.g. a custom Thai display), please share it.*

Body weight is **light (300)** by default — heavier weights feel loud against the paper ground.

### Spacing

A 4 px ground with a generous step from `--sp-7 (48)` upward. Marketing layouts breathe — section padding is rarely under 96 px vertical. App layouts compress to a 16/24 grid.

### Backgrounds

- **Paper, always paper.** No gradients. No patterns. No textures beyond the optical warmth of `--paper`.
- **Photography is full-bleed where used.** Soft, natural daylight; no high contrast; no saturation boost.
- **Tonal blocks** (`--paper-soft`, `--linen`) are used to *separate sections vertically* — never as a card behind a single element.

### Borders, rules, and hairlines

The brand's primary structural element is the **1px hairline (`--ink-line`)**. Sections, cards, table rows, list items — all separated by hairlines, almost never by background changes. A heavier `--ink-line-2` is used for rule-and-eyebrow combos.

### Cards

- **No drop shadows in marketing.** Cards are paper-on-paper with a hairline border or none.
- **App cards** use `--sh-1` (a barely-there warm shadow) and `--r-3` (8 px) corners.
- **Radii are small.** `--r-2` (4 px) is the workhorse; `--r-pill` only for tags and the rare CTA pill.

### Shadows

Three soft, warm tints — never neutral gray, never blue. Designed to read as paper laid over paper. Inner shadow is reserved for inset surfaces (e.g. the air-quality dial in the app).

### Motion

- **Easing:** `cubic-bezier(0.32, 0.08, 0.24, 1)` — a quiet ease-out. No bounces, no overshoot.
- **Durations:** 160 / 240 / 420 ms. Anything slower feels stuck; anything faster feels mechanical.
- **Style:** crossfades and gentle slides (≤ 8 px). Never scale-up reveals. Never spring physics.
- **Hovers** dim opacity to 0.7 or shift to `--moss-deep`; they do not lift, scale, or shadow-up.
- **Press** flips to `--moss-deep` or `--paper-soft`; a 1 px translate-y for buttons is allowed.

### Transparency and blur

- Sparingly. The bottom-tab on the Smart Living app uses `backdrop-filter: blur(12px)` over `rgba(246,242,234,0.78)`.
- Never on marketing.

### Imagery

- Soft natural daylight. Color-temperature warm (≈ 5200K). Slight grain acceptable.
- People are framed at distance, in profile, or out of frame entirely.
- Material close-ups (wood grain, linen, ceramic, leaves) are encouraged for section breaks.

### Layout rules

- **One primary action per view.** Marketing CTAs sit at the end of a section, never sticky.
- **Eyebrows + serif headline + body** is the canonical section header pattern.
- **Lists run vertically with hairline separators**, not in cards.
- **Numbers right-align** in tables (rental, distances, dimensions).

---

## Iconography

Nature Haven uses a single thin-line icon system. The voice of the icon is the same as the voice of the type: quiet, drawn with a light hand, never decorative.

- **Library:** [Lucide](https://lucide.dev) at `1.5px` stroke, `24×24` view box. Loaded from CDN (`unpkg.com/lucide@latest`) — see `assets/icons.md`.
- **Substitution flag:** *No first-party icon set was provided. Lucide is the closest CDN match in stroke weight and tone. If the brand commissions a custom set, drop SVGs into `assets/icons/` and update the import path.*
- **Usage:** icons are 18 px in dense UI, 24 px in primary nav, 32 px in marketing module headers.
- **Color:** always `currentColor`. Never tinted.
- **Pairing:** an icon may sit beside a label, but never replace one — the brand prefers words.

### Glyph use

- **No emoji** in product surfaces.
- **Unicode characters** allowed:
  - `—` em-dash (signature punctuation)
  - `⸻` horizontal bar — *only in source copy*; render visually as a hairline
  - `·` middle dot for inline metadata separators
- **Logo:** a wordmark `Nature Haven` in IBM Plex Serif 300, plus a small `n.` mark for app icon use. See `assets/`.

---

For the agent entry-point, see `SKILL.md`.
