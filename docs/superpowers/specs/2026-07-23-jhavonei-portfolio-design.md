# jhavonei.me — "The Specimen Rosetta"

**Design spec · Doc.000 · 2026-07-23**
Personal portfolio for Jhavonei — creative technologist. Static SvelteKit site deployed to GitHub Pages (`jhavonei/jhavonei.github.io`, CNAME `jhavonei.me`).

---

## 1. Concept

The site is a **research dossier from a poison garden**: a scientific-diagram-styled, PhD-field-paper catalogue of the author's work, rendered in a strict monochrome doctrine. There is no navigation menu anywhere. The landing page is a single living instrument — **the Specimen Rosetta**: a full red spider lily (*Lycoris radiata*) grown from a 50,000-point particle system, breathing at the center of three counter-rotating rings of manifesto text. The lily's six stamens are the interface: five carry figure-callout routes; the sixth inverts the world between BLACK and WHITE.

Every page is a numbered document in the same catalogue. Every route is guarded by its own dangerous plant. The visitor is a reader handling a specimen archive.

### Design doctrine (rules, not suggestions)

1. **Monochrome only.** One ink color per mode, expressed through opacity steps. No hue anywhere — including imagery (halftoned/grayscaled) and the particle system.
2. **Twin modes.** Every screen exists as a BLACK and WHITE twin. BLACK is canonical.
3. **Type is texture.** Two families only: typewriter mono (labels, body, data) and condensed grotesk (display). Repeated text may be used as pattern/aura, not just information.
4. **Dossier furniture everywhere.** Justified header rows, hairline rules, figure callouts with leader lines, versioning language (V.01, DOC.002, FIG.03), stamps, registration dots.
5. **Paper physics.** Dot-grid ground, film-grain overlay, halftone treatments. Surfaces feel printed, not rendered.
6. **Scientific linework.** Ornaments are stroke-only botanical/instrument drawings at hairline weights.
7. **Aphoristic voice.** All copy reads like manifesto, field notes, or liner notes — never marketing.
8. **Cinema with restraint.** Motion is theatrical at transitions and whisper-quiet at rest. Nothing bounces; things assemble, breathe, disintegrate, unwind.

---

## 2. Information architecture

No nav bar, no hamburger, no menu. The hero is the nav. The only secondary chrome on any page is the slim dossier **footer strip** — a semantic `<nav>` styled as catalogue furniture (routes + Fig.00 + SOUND seal + colophon) — which doubles as the crawler/screen-reader/no-JS path. Interior pages additionally get a "⟵ RETURN TO SPECIMEN" breadcrumb (back to `/`).

| Route | Doc № | Fig | Title | Guardian plant |
|---|---|---|---|---|
| `/` | Doc.001 | — | The Specimen (hero) | *Lycoris radiata* (the centerpiece itself) |
| `/work` | Doc.002 | Fig.01 | Work | *Datura stramonium* |
| `/notes` | Doc.003 | Fig.02 | Field Notes | *Digitalis purpurea* |
| `/author` | Doc.004 | Fig.03 | The Author | *Atropa belladonna* |
| `/correspondence` | Doc.005 | Fig.04 | Correspondence | *Nerium oleander* |
| `/repository` | Doc.006 | Fig.05 | Repository | *Aconitum napellus* |

Fig.00 is not a route: it is the mode inverter (see §4).

404 page: styled as "DOC. NOT FOUND — SPECIMEN ESCAPED", with a wilted-lily line drawing and the return breadcrumb. (GitHub Pages serves `404.html`; SvelteKit prerenders it.)

---

## 3. The hero — Specimen Rosetta (`/`)

### Anatomy

- **The lily**: full flower — six lanceolate petals with midrib linework, six long recurved stamens — built from ~50,000 particles (Three.js `Points`). Idle: slow breathing (scale 1→1.025, ~7s), slow Y-rotation, particles shiver away from the cursor and return (physics identical to WovenLight, §3.4).
- **The rings**: three concentric rings of manifesto text (SVG `textPath`, HTML layer above the WebGL canvas) counter-rotating at reading speed (outer ~200s/rev, middle reverse ~100s, inner ~140s). The rings are the aura; they drift subtly apart when the cursor approaches the bloom.
- **Callouts**: five stamen tips carry leader lines to labels — `Fig.01 — Work`, `Fig.02 — Field Notes`, `Fig.03 — The Author`, `Fig.04 — Correspondence`, `Fig.05 — Repository`. Labels are real `<a>` elements. The sixth stamen ends in a hollow circle labelled `Fig.00 — Invert ⇄`.
- **Dossier chrome**: justified header rows top (`JHAVONEI · <identity line> · 2026` / `DOC.001 · THE SPECIMEN`), footer strip bottom (semantic nav + `SOUND ●` seal + colophon). Registration dots scattered at fixed positions.

### States

| State | Behavior |
|---|---|
| Idle | Breathing, ring rotation, cursor shiver. |
| Hover stamen/label | That filament's particles brighten & tighten; nearest ring slows so its phrase is legible; label "types" itself (caret sweep). Other filaments dim slightly. |
| Click route | Transition rite (§7.2). |
| Hover Fig.00 | Lily's particles briefly show their inverted tone, a preview flicker. |
| Click Fig.00 | Eclipse wipe (§4). |
| Touch (mobile) | No hover exists: first tap on a stamen/label plays the hover state (focus + brighten + legible ring); second tap on the same target commits the navigation. Tapping elsewhere clears focus. |

**Hit targets**: the real interactive elements are the `<a>` labels; each anchor's hit area is enlarged to cover its leader line and stamen-tip region (invisible overlay polygons kept in sync with the projected tip positions), so clicking "the flower" and clicking "the label" are the same act. The canvas itself receives no pointer events.

### Assembly rite (first load)

3–4s, skippable by any click/keypress; ~1s abbreviated version on repeat visits (flag in `localStorage`).

1. Black paper + grain fade in (300ms).
2. Header rows type/stamp themselves, hairlines draw left→right (600ms).
3. Particles stream in from screen edges and condense into the lily (1.5s, staggered by filament).
4. Rings fade in and spin up from 0 to reading speed (800ms, overlapping).
5. Leader lines draw, labels type in sequence Fig.01→Fig.05, then Fig.00 (600ms).

### WovenLight port contract (1:1 movement)

Port `WovenCanvas` logic to a Svelte 5 component (`SpecimenCanvas.svelte`) keeping these constants exactly, so movement/feel is identical:

- `particleCount = 50_000` (desktop) — geometry sampled from the **lily point cloud** instead of `TorusKnotGeometry`, mapped by `i % pointCount` exactly as the original maps torus vertices.
- Cursor repulsion: radius `1.5` world units, force `(1.5 − dist) * 0.01` along the away-vector.
- Return spring: `(original − current) * 0.001` per frame.
- Damping: `velocity *= 0.95` per frame.
- Rotation: `points.rotation.y = elapsedTime * 0.05`.
- `PointsMaterial size 0.02`, transparent; **blending by mode**: `NormalBlending`/opacity 1.0 in BLACK, `AdditiveBlending`/opacity 0.8 in WHITE (inherits the original's dark/light split).
- **Doctrine override**: vertex colors are monochrome — per-particle gray value jittered in a narrow band (no HSL rainbow). Resize + cleanup handling as in the original.
- Text-reveal timing from `WovenLightHero` reused for all typed/staggered text: delay `i * 0.1 + base`, duration `1.2s`, ease `cubic-bezier(0.2, 0.65, 0.3, 0.9)` (Svelte transitions, not framer-motion).

Optimization allowance: the per-particle `THREE.Vector3` allocations in the original's loop may be rewritten as flat-array math — behavior identical, garbage-free. **Physics constants may not change.**

### Lily geometry

Generated procedurally at load (deterministic, seeded): six petals as parametric lanceolate surfaces (recurved), six stamens as cubic-bezier tubes ending in anther clusters, plus a sparse "pollen haze" (~4% of points scattered near tips). Point budget split ≈ 70% petals / 22% stamens / 8% core+haze. Stamen tip world positions are exported for callout anchoring (projected to screen space each frame for the HTML labels).

---

## 4. BLACK ⇄ WHITE twin system

- **Canonical mode: BLACK.** First visit always opens BLACK regardless of OS preference. Choice persists in `localStorage` (`mode: "black" | "white"`).
- All color is expressed through CSS custom properties (§9); mode is a class on `<html>`. The WebGL layer reads the same tokens (uniform update on toggle).
- **Eclipse wipe** (Fig.00 click): a disc of the opposite paper tone expands from the lily's center behind the particles, wiping the page tone across ~900ms; particles and type invert as the front passes them. Sound (if enabled): low *whumph*. The lily itself never disappears — it is the eclipse's pupil.
- Every component must be built against tokens only; hard-coded colors are a review-blocking defect.

---

## 5. Interior page chrome (shared)

Every interior page is a "document" with:

1. **Header rows** — `JHAVONEI · <identity line> · 2026` / `DOC.00N · FIG.0N — <TITLE>`.
2. **Breadcrumb** — `⟵ RETURN TO SPECIMEN`.
3. **Guardian plant** — the route's plant as a stroke-only SVG specimen drawing (hand-authored, one per route), with Latin name caption. Idle micro-motion: a barely-perceptible sway (2–3px, ~9s loop). It is also the page's transition anchor (§7.2).
4. **Opening line** — one authored aphorism set as a full-width rule of letter-spaced small caps under the header. During the arrival transition the unwinding ring text visually hands off to this line (crossfade morph); the line itself is per-page authored copy.
5. **Display title** — condensed grotesk, huge, tracked out.
6. **Footer strip** — semantic `<nav>` with all five routes + Fig.00 toggle + `SOUND ●` + colophon (`BLACKWHITE · JHAVONEI.ME · ALL OVER THE WORLD`).

---

## 6. Pages

### 6.1 `/work` — Doc.002 — The Ledger

Projects as dense archival index rows: `V.01 · TITLE · CLASS: <taxonomy> · YEAR · STATUS`. Statuses: `● LIVE`, `ARCHIVED`, `SEALED` (pending slots). Always render 2 sealed slots after the last real entry.

**Row expansion — "drop-down tab":** clicking a row drops open an in-place panel (height-animated, paper-unfolding easing) containing: description (2–4 sentences, doctrine voice), meta block (STACK / ROLE / EXHIBIT links out), and an exhibit frame (screenshot halftoned monochrome; hover restores the original image — the one sanctioned use of color, as "evidence"). One row open at a time; opening another closes the previous. Open state syncs to the URL hash (`/work#v02`) so rows are deep-linkable. No separate project pages in v1.

Content source: markdown files with frontmatter (§10). Placeholder entries at launch (V.01–V.04: *Nocturne Engine*, *Choir of Small Machines*, *Field Recorder*, *Grimoire Parser*) are clearly fictional seeds to be replaced — each carries `placeholder: true` and renders a small `SPECIMEN PENDING VERIFICATION` stamp.

### 6.2 `/notes` — Doc.003 — Field Notes

Writing/research log. Same ledger grammar as Work: `N.001 · TITLE · FIELD: <topic> · DATE`. Clicking a note navigates to `/notes/<slug>` — long-form deserves its own document page: measure ~68ch, mono body at comfortable size, headings in condensed caps, figures captioned `FIG. N`, footnotes as `[N]` sidenotes on wide screens. Notes are markdown (mdsvex). Launches with one seeded placeholder note (about the building of this site — honest content from day one) plus sealed slots.

### 6.3 `/author` — Doc.004 — The Author

No portrait — **the aura is the portrait**: the belladonna specimen large, wreathed by a single slow ring of repeated text (the identity line as texture). Content:

- A specimen-data table: `CLASSIFICATION: CREATIVE TECHNOLOGIST · HABITAT: <city/remote> · ACTIVE SINCE: <year> · TOOLING: <short list>` — the one deliberately legible block for recruiters. HABITAT/ACTIVE SINCE values are configurable constants (§16).
- Bio in doctrine voice: 3 short aphoristic paragraphs (drafted by Claude, edited by Jhavonei at will).
- A `TRAITS` list styled as figure callouts around the belladonna.

### 6.4 `/correspondence` — Doc.005

Dossier-footer grammar promoted to a full page:

```
EMAIL ON            HEY@JHAVONEI.ME
(FORM)              TRANSMIT BELOW
AVAILABLE           ALL OVER THE WORLD
```

- **Email**: `hey@jhavonei.me` as mailto. Requires DNS email forwarding → Gmail (Cloudflare Email Routing or ImprovMX free tier); setup steps documented in the repo README. Until forwarding is live, the build constant may point to the Gmail address.
- **Form**: typewriter-styled (label rows, underline inputs, monospace caret) posting to Formspree free tier (account setup documented; endpoint is a configurable constant). Success state: `TRANSMISSION RECEIVED — EXPECT CORRESPONDENCE` stamp animation. Failure state degrades to showing the mailto.
- **Socials**: stamped index rows — GitHub, X/Twitter, LinkedIn, Instagram. Handles are configurable constants, defaulting to `jhavonei` (LinkedIn URL to be confirmed at build).
- **Availability line**: `AVAILABLE FOR COMMISSIONS · COLLABORATIONS · CORRESPONDENCE` (editable constant).

### 6.5 `/repository` — Doc.006

GitHub presence as a specimen ID card, all fetched client-side at runtime, all restyled monochrome:

1. **Profile header**: avatar (CSS-halftoned + grayscale), handle, join date, follower/repo counts — stamped card layout. Source: `GET https://api.github.com/users/jhavonei` (unauthenticated, 60 req/h/IP is ample).
2. **Contribution dot-matrix**: past year of contributions redrawn on our dot-grid — intensity = dot radius steps (not color). Source: `https://github-contributions-api.jogruber.de/v4/jhavonei` (third-party; see risk note).
3. **Repo ledger**: public repos as ledger rows (`NAME · LANGUAGE · ★ N · LAST COMMIT`), sorted by recency. Source: `GET https://api.github.com/users/jhavonei/repos?sort=pushed&per_page=30`.
4. **CTA seal**: large `OPEN REPOSITORY ↗` stamp → `github.com/jhavonei`.

**Degradation**: every block has a skeleton state (pulsing hairline boxes) and a failure state (`FEED SEVERED — CONSULT THE SOURCE ↗` with the CTA). The third-party contributions API failing must not affect the other blocks. Responses cached in `sessionStorage` (1h TTL) to be polite to rate limits.

---

## 7. Motion & transition system

### 7.1 Grammar

- Easings: `cubic-bezier(0.2, 0.65, 0.3, 0.9)` (the WovenLight ease) for reveals; a sharper `cubic-bezier(0.7, 0, 0.2, 1)` for wipes/collapses. No spring/bounce.
- Typed text (caret sweep), drawn lines (`stroke-dashoffset`), stamps (scale 1.3→1 + rotate settle, 250ms) are the three micro-motion primitives, reused everywhere.

### 7.2 Route transitions (the theater)

- **Leaving `/` (click stamen)**: callout label stamps itself → lily disintegrates, particles streaming toward/past the camera biased in the stamen's direction (~700ms) → nearest ring visually unwinds into a horizontal line while the view settles onto the destination document, where the line crossfades into that page's opening line → guardian plant draws itself in (~500ms). Total ≤ 1.4s. Implemented with SvelteKit client-side navigation: the WebGL canvas persists in the root layout and plays the disintegration while the DOM swaps under it.
- **Interior → interior** (via footer strip): lighter rite — page exhales (fades + 8px drift), guardian plants crossfade, opening lines swap with a typed wipe (~500ms).
- **Interior → `/` (breadcrumb)**: particles re-condense into the lily from the direction of the departed page (~700ms).
- Browser back/forward get the same transitions (SvelteKit `onNavigate` + View Transitions API where available, JS-driven fallback otherwise).

### 7.3 Reduced motion

`prefers-reduced-motion: reduce` ⇒ assembly rite replaced by a plain fade-in of a **static SVG lily plate** (no particle sim), ring rotation stopped (rings still rendered), transitions become 200ms crossfades, breathing/sway disabled. All content and navigation identical.

---

## 8. Sound (opt-in)

Silent by default. A `SOUND ●` seal in the footer strip arms audio (Web Audio API, persisted per `localStorage`):

- **Bed**: near-subliminal dark ambient drone (−38 LUFS-ish, filtered noise + low sine, generated procedurally — no audio files needed).
- **Hover**: faint particle hiss (filtered noise burst) on stamen/label hover.
- **Navigate**: paper-stamp *thock* on route commit; low *whumph* on eclipse wipe.
- Master mute the instant the seal is clicked off; audio context only created after the opt-in gesture (autoplay-policy compliant).

---

## 9. Typography & design tokens

**Faces** (self-hosted via `@fontsource`, subset to latin):

- `IBM Plex Mono` (300/400/500 + italic 300) — body, labels, data, rings.
- `Archivo Narrow` (500/600) — display titles, uppercase, tracked `+0.12em`–`+0.16em`.

**Token set** (CSS custom properties; BLACK values / WHITE values):

- `--paper` `#0a0a0a` / `#e9e7e2` · `--paper-raise` `#101010` / `#efede8`
- `--ink` `#c8c8c4` / `#1c1c1a` · `--ink-strong` `#efefec` / `#0a0a0a` · `--ink-faint` 38–42% α ink
- `--hairline` 16–18% α ink · `--hairline-strong` 34–38% α ink · `--dot` 10–12% α ink
- Spacing on a 13px mono grid; dot-grid ground at 26px pitch; grain overlay via inline-SVG `feTurbulence` data-URI at ~0.5 opacity, `mix-blend-mode: overlay`.

The mockups in `.superpowers/brainstorm/mockups/` are the visual source of truth for these values.

---

## 10. Content model

```
src/content/
  work/  v01-nocturne-engine.md   (frontmatter: index "V.01", title, class, year,
                                   status: live|archived, stack[], role, links{exhibit,source},
                                   placeholder: bool)
  notes/ n001-building-the-specimen.md  (index "N.001", title, field, date, sealed: bool)
site.config.ts  — all configurable constants (§16)
copy.ts         — manifesto rings, opening lines per route, identity line, bio, availability
```

Markdown processed by mdsvex. Adding a project = adding one file; index numbers are authored in frontmatter (not derived), because gaps and sealed slots are part of the fiction.

---

## 11. Copy (drafted by Claude, owned by Jhavonei)

**Voice rules**: aphoristic, declarative, slightly ominous, never salesy; botanical/archival metaphor; ALL-CAPS mono for furniture, sentence case for long-form. Original writing only — the "opening lines…" passage seen in the reference posters and mockups is mood-board material and must not ship.

**Identity line** — final pick happens at build; drafted candidates:

1. `GROWN IN THE DARK · READ IN THE LIGHT` ← default
2. `INSTRUMENTS FOR DARK ROOMS`
3. `FIELD RESEARCH IN LIGHT AND CODE`
4. `BUILDER OF DELICATE MACHINES`

**Manifesto rings** — draft (one ring each, refined at build):

- Outer: `EVERYTHING HERE WAS GROWN IN THE DARK AND PRESSED INTO THE RECORD · WHAT SURVIVES THE PRESSING IS THE WORK ·`
- Middle: `A SITE IS NOT A PAGE · IT IS A SPECIMEN OF ITS AUTHOR · HANDLE IT ACCORDINGLY ·`
- Inner: `TOUCH NOTHING CARELESSLY · EVERYTHING HERE IS ALIVE ·`

**Opening lines**: one per route, drafted during build, each ≤ 90 characters.

---

## 12. Technical architecture

- **Svelte 5 (runes) + SvelteKit + `@sveltejs/adapter-static`**, full prerender; TypeScript; Vite. Three.js as the only heavyweight runtime dep (imported dynamically so interior-first visits don't pay for it until the hero mounts). No React, no framer-motion, no Tailwind — hand-written CSS against the token sheet.
- **Layout strategy**: root `+layout.svelte` owns the persistent WebGL canvas, grain, dot-grid, mode state, sound engine, and transition orchestrator; pages render into it.

```
src/lib/
  three/  lilyGeometry.ts  (procedural point cloud, seeded)
          SpecimenCanvas.svelte  (ported WovenLight physics + disintegration/condense rites)
  chrome/ HeaderRows / FooterStrip / Breadcrumb / OpeningLine / Stamp / TypedText / DrawnLine
  plants/ Datura / Digitalis / Belladonna / Oleander / Aconitum  (.svelte SVG specimens)
  hero/   Rings.svelte · Callouts.svelte · AssemblyRite.ts
  systems/ mode.svelte.ts (BLACK/WHITE store) · sound.ts · transitions.ts · reducedMotion.ts
  repository/ githubClient.ts · DotMatrix / RepoLedger / ProfileCard (.svelte)
  ledger/ Ledger.svelte · LedgerRow.svelte  (shared by work & notes)
```

- Each unit above is independently understandable: geometry knows nothing of Svelte; canvas knows nothing of routes; transitions orchestrate via a small event contract (`depart(direction) → Promise`, `arrive(direction) → Promise`); pages consume chrome components and content only.
- **State**: Svelte 5 runes stores — `mode`, `soundArmed`, `visited` (rite abbreviation), `transitionPhase`. All persisted keys namespaced `jhv:`.

---

## 13. Accessibility & SEO

- All navigation is real `<a>` elements (callout labels, footer strip); stamens are decorative duplicates of the labels, `aria-hidden`. Keyboard: Tab reaches labels in Fig order, visible focus style = stamp outline; Escape closes open ledger rows; rite skippable via any key.
- Landmarks: `header`/`nav`/`main`/`footer` per page; `aria-live="polite"` for GitHub feed states and form results. Form inputs properly labelled; contrast: `--ink` on `--paper` ≥ 7:1 in both modes (values in §9 comply; verify in build).
- Canvas is `aria-hidden`; the site is fully usable with JS-rendered DOM only (particles are decoration). Prerendered HTML means content is crawlable; per-page `<title>`/meta description/OpenGraph card (a static BLACK plate image per route, generated during build); sitemap + robots.
- Reduced-motion path per §7.3.

---

## 14. Performance budgets

- Desktop: 50k particles @ 60fps target on mid-tier GPU; mobile: 12k particles, DPR capped at 2, target ≥ 40fps — measured in the first second of the rite; if below, live-degrade to the static plate (the §7.3 fallback, sans rite).
- First route HTML+CSS ≤ 60KB gzip before Three.js; Three.js chunk lazy-loaded ≈ 150KB gzip; fonts subset ≤ 90KB total; no other third-party JS. Lighthouse (reduced-motion pass): ≥ 95 across the board.

---

## 15. Deployment & prerequisites

- **Machine prerequisites (currently missing — install first)**: Node.js LTS ≥ 20 and Git for Windows. Neither is present on this machine; nothing else blocks local dev.
- Repo: work happens in `c:\Users\gehen\Desktop\Jhavonei\portfolio`, pushed to `jhavonei/jhavonei.github.io` `main`. GitHub Actions workflow: build (`vite build`, prerender) → deploy to Pages. `CNAME` file (`jhavonei.me`) preserved in `static/`. `.superpowers/` and `docs/` excluded from the built site but kept in the repo; add `.superpowers/` to `.gitignore` only if the mockups shouldn't be committed (default: commit them — they're the design record).
- DNS already points `jhavonei.me` at Pages (CNAME file exists today). Email forwarding (`hey@` → Gmail) via Cloudflare Email Routing or ImprovMX — steps in README; Formspree endpoint created by Jhavonei, pasted into `site.config.ts`.

---

## 16. Configurable constants (`site.config.ts`)

`identityLine`, `availabilityLine`, `email` (default `hey@jhavonei.me`), `formspreeEndpoint`, `github.handle` (`jhavonei`), `socials{x, linkedin, instagram}` (default handles `jhavonei`; LinkedIn URL confirmed at build), `author.habitat`, `author.activeSince`, `copy.*` (rings, opening lines, bio).

---

## 17. Decisions log

| Decision | Choice |
|---|---|
| Identity | Creative technologist; no portrait — "the aura is the portrait" |
| Stack | Svelte 5 + SvelteKit static, Three.js direct, no React |
| Hero | Plates A+C fusion — full lily + manifesto rings; 6th stamen = Fig.00 invert |
| Arrival | Full assembly rite, skippable, abbreviated on repeat |
| Modes | Always BLACK first; localStorage persist; eclipse wipe |
| Interior | Shared dossier chrome + poison garden; approved plant assignments |
| Work | Ledger rows with drop-down tab expansion, hash-linkable; no project pages in v1 |
| Notes | Ledger + long-form document pages (mdsvex) |
| Repository | Profile card + contribution dot-matrix + repo ledger + CTA seal, client-side |
| Correspondence | hey@jhavonei.me + Formspree form + socials + availability |
| Copy | Claude drafts everything, original writing, doctrine voice |
| Sound | Opt-in procedural ambient + micro-sounds |
| Mobile | Full rite at 12k particles; tap-to-focus, second tap navigates |
| Content | Starting from zero — placeholder specimens marked as pending |

## 18. Out of scope (v1)

Project detail pages, RSS, analytics, CMS, i18n, blog comments, WebGPU renderer, custom cursor (revisit in v2), OG image automation beyond static plates.
