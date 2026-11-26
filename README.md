# 🎂 Teni's Birthday Website

A personal birthday website built for Teni (Kim Tin Tin / "Giggles"). It's a single-page flow: a playful mail-themed intro → an envelope-opening animation → a confetti celebration popup → a birthday letter page with background music.

**Live site:** https://oyebintan.github.io/Teni-Birthday/
**Repo:** https://github.com/Oyebintan/Teni-Birthday

> This README exists so a new session can understand the project without re-reading every file. Read this first; only open the actual source files for the specific section you're changing.

---

## How it works (3 "pages", one HTML file)

Everything lives in `index.html` as three `<section class="page">` elements inside `<main id="app">`. Only one page is visible at a time — `js/script.js` toggles the `.active` class and the `inert` attribute via `showPage()`. There is no routing/URL change; it's all one page with JS-driven visibility.

1. **`#pageOne` – "You've got mail"** (welcome page)
   - Looping typewriter animation ("a mail!") in `#typingTitle`.
   - Button `#collectMail` → calls `showPage(pageTwo)`.

2. **`#pageTwo` – "Open your letter"** (envelope page)
   - Button `#openLetter` → on click:
     - Starts `#birthdayMusic` (the `<audio>` element, `assets/music/birthday-song.mp3`).
     - Shows `#celebration` overlay and fires confetti (`createConfetti()`).
     - After a 3.5s delay, calls `showPage(pageThree)` and hides the celebration overlay.

3. **Celebration popup** (`#celebration`, overlay, not a "page")
   - "BREAKING NEWS — It's World Giggle Day!" message + confetti pieces (generated dynamically in `createConfetti()`, appended to `#confetti`).

4. **`#pageThree` – The birthday letter** (final page, does not auto-scroll out)
   - Music toggle button `#musicToggle` (icon-only, top of page).
   - Decorative balloon SVGs (desktop only, hidden on small screens via CSS).
   - `.letter-card` — the actual birthday message, styled like an email (topbar dots, TO/SUBJECT meta row, letter body). **This is the text you'll most often be asked to edit.**

All three pages share one fixed background (`.backdrop` with `.glow-a/b/c` + floating hearts/sparkles in `#floaties`) so colors never jump between pages.

---

## File structure

```
index.html          Main (and only) page — all 3 sections + celebration overlay + <audio>
css/style.css        All styling (~1400 lines, see "CSS map" below)
js/script.js         All behavior (~170 lines, see "JS map" below)
assets/images/
  page-01.svg         Illustration for page 1 (mailbox + paper plane)
  page-02.svg          Illustration for page 2 (sealed letter)
  image-frame.svg      ⚠️ NOT referenced anywhere in the HTML/CSS — unused, safe to ignore or delete
assets/music/
  birthday-song.mp3                              Actually used (referenced by <audio id="birthdayMusic">)
  Teni, Olamide - Zion (SPOTISAVER).mp3            ⚠️ Unused extra file, not wired up anywhere
  Godswill James - Birthday Prayer (SPOTISAVER).mp3 ⚠️ Unused extra file, not wired up anywhere
birthday.html        ⚠️ Empty file (0 bytes) — not linked from anywhere, leftover/unused
```

---

## CSS map (`css/style.css`)

Organized top-to-bottom in clearly marked sections (search for the exact heading text to jump there):

| Section | Line (approx.) | What's there |
|---|---|---|
| `:root` variables | 1–24 | Color palette, fonts, easing curves — **change the color scheme here** |
| SHARED BACKGROUND | 82 | The glow blobs + floating hearts/sparkles behind every page |
| PAGES + TRANSITIONS | 147 | `.page` / `.active` / `inert` fade logic |
| TYPOGRAPHY | 216 | Headings, eyebrow text, body text sizing |
| BUTTON | 250 | `.primary-btn` shared button style |
| SHARED LAYOUT | 307 | Mobile-first `.split-layout` (text + illustration columns) |
| PAGE 1 | 378 | Welcome page specific styling |
| PAGE 2 | 414 | Envelope page specific styling (incl. seal, envelope float animation) |
| CELEBRATION POPUP | 493 | Confetti container + popup card |
| PAGE 3 | 603 | Letter page: music button (650), letter card (732), balloons (909) |
| BURST HEARTS | 942 | Click-effect hearts |
| DESKTOP (≥860px) | 967 | All desktop-only overrides live here — mobile styles above are the default |
| KEYFRAMES | 1285 | All `@keyframes` animations |
| ACCESSIBILITY | 1393 | `prefers-reduced-motion` overrides |

**Design is mobile-first.** Base rules target phones; the `DESKTOP (≥860px)` block near the bottom overrides layout for wider screens. There are also narrower breakpoints inside the PAGE 3 section for short/landscape phones (e.g. iPhone SE).

---

## JS map (`js/script.js`)

Short file, read top to bottom — roughly these blocks:

- **Element lookups** (top) — all `getElementById` calls.
- **`showPage(page)`** — the only navigation mechanism; toggles `.active` + `inert` across all `.page` sections.
- **Typewriter loop** — types/deletes `"a mail!"` on page 1, calls itself via `setTimeout` forever.
- **`collectMail` click** → `showPage(pageTwo)`.
- **`createConfetti()`** — builds 100 colored confetti `<span>` pieces with randomized position/size/timing, appended to `#confetti`.
- **`openLetter` click** (the big one) — guarded by `celebrationStarted` so it only runs once:
  1. Plays `birthdayMusic`.
  2. Shows `.celebration-overlay` + fires confetti.
  3. After 3.5s: reveals page 3, hides the overlay, then clears confetti DOM after another 1s.
- **`musicToggle` click** — play/pause toggle for the background music.

### ⚠️ Known mismatch to be aware of
`#musicToggle` in `index.html` is an **icon-only** button (an SVG with a slash-through-note icon + a `.music-ring` pulse span, no text). But `script.js` sets `musicToggle.textContent = "♫ Music on"` / `"♫ Play music"` / `"♫ Music off"` in three places. Setting `.textContent` on that button will **wipe out the SVG icon** and replace it with plain text, which likely isn't the intended look. This looks like the HTML was redesigned to an icon button after the JS was written and the JS wasn't updated to match (e.g. toggling an `aria-pressed`/class instead of textContent). Worth fixing next time music-button behavior comes up.

---

## Conventions / things to know before editing

- **Letter text** lives in `#letterBody` in `index.html` (~line 257–301). Edit the `<p>` tags directly; keep `.letter-greeting`, `.letter-signoff`, and `.signature` classes on the right paragraphs since CSS styles them differently.
- **Page `<title>`** still says "For Zion ❤️" (`index.html` line 8) even though the content is for Teni — likely leftover from an earlier template/name. Flag before assuming it's intentional.
- **Colors**: all colors are CSS custom properties in `:root` (`--pink`, `--wine`, `--dark-wine`, etc.) — change the palette by editing variables, not individual rules.
- **Fonts**: Google Fonts loaded in `index.html` `<head>` — `Playfair Display` (display/headings), `DM Sans` (body), `Caveat` (handwritten accents). Referenced via `--font-display` / `--font-body` / `--font-hand`.
- **No build step.** This is plain HTML/CSS/JS — open `index.html` directly or serve the folder; no npm/bundler involved.
- **Hosting**: GitHub Pages, served from the repo root (see live link above).

## Workflow note for future sessions

The user edits the live GitHub repo directly and may have changed things since the last session. **Always re-clone/re-fetch the repo at the start of a session rather than trusting local memory of the code**, and check the live Pages URL if a visual check is cheaper than reading the code.
