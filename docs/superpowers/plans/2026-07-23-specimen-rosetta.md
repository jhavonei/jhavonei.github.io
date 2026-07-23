# Specimen Rosetta (jhavonei.me) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build jhavonei.me — a monochrome research-dossier portfolio whose landing hero (a 50k-particle spider lily wreathed in manifesto rings) is itself the site navigation.

**Architecture:** SvelteKit (Svelte 5 runes) fully prerendered via adapter-static, deployed to GitHub Pages. A persistent root layout owns the Three.js particle canvas, BLACK/WHITE mode, sound, and transition orchestration; pages are "documents" composed from shared dossier chrome. Content is markdown (mdsvex) collections.

**Tech Stack:** Svelte 5, SvelteKit 2, adapter-static, TypeScript, Vite + Vitest (jsdom), Three.js (dynamic import), mdsvex, @fontsource (IBM Plex Mono, Archivo Narrow), GitHub REST + jogruber contributions API, GitHub Actions → Pages.

**Authority:** The spec at `docs/superpowers/specs/2026-07-23-jhavonei-portfolio-design.md` is binding. The mockups in `.superpowers/brainstorm/mockups/` are the visual source of truth (tokens, chrome, ledger, lily plate). WovenLight physics constants (spec §3.4) may not be altered.

**Environment notes for the executor:**
- Windows 11, shell is **PowerShell 5.1** — `&&` does not exist; chain with `;` or separate calls. Node.js LTS and Git are **not installed** — Task 1 handles this.
- Project root: `c:\Users\gehen\Desktop\Jhavonei\portfolio`. Remote: `https://github.com/jhavonei/jhavonei.github.io.git` (branch `main`, currently only CNAME + README — preserve CNAME).
- Do not push until the final task; commit locally throughout.

---

## File structure

```
portfolio/
  package.json  svelte.config.js  vite.config.ts  tsconfig.json  .gitignore  .npmrc
  static/           CNAME · robots.txt · og/ (generated plates)
  scripts/          og-plates.mjs
  .github/workflows/deploy.yml
  src/
    app.html  app.css  app.d.ts
    content/
      work/   v01-nocturne-engine.md … v04-grimoire-parser.md
      notes/  n001-building-the-specimen.md
    lib/
      config/    site.ts (constants) · copy.ts (all authored text) · routes.ts (route registry)
      systems/   mode.svelte.ts · prefs.ts · transitions.ts · sound.ts
      three/     anatomy.ts (stamen dirs) · rng.ts · lilyGeometry.ts · SpecimenCanvas.svelte
      hero/      Rings.svelte · Callouts.svelte · EclipseDisc.svelte · StaticPlate.svelte
      chrome/    HeaderRows · FooterStrip · Breadcrumb · OpeningLine · Stamp · TypedText · DrawnLine · Seo (.svelte)
      plants/    Datura · Digitalis · Belladonna · Oleander · Aconitum · index.ts
      doc/       DocumentPage.svelte · Ledger.svelte · LedgerRow.svelte
      content/   index.ts (collection loaders)
      repository/ githubClient.ts · ProfileCard.svelte · DotMatrix.svelte · RepoLedger.svelte
    routes/
      +layout.ts  +layout.svelte  +error.svelte  +page.svelte (hero)
      work/+page.svelte
      notes/+page.svelte  notes/[slug]/+page.svelte  notes/[slug]/+page.ts
      author/+page.svelte
      correspondence/+page.svelte
      repository/+page.svelte
      sitemap.xml/+server.ts
```

Boundaries: `three/` knows nothing of routes; `systems/` knows nothing of components; pages consume `chrome/` + `doc/` + `config/` only. All colors via CSS tokens — hard-coded colors are a defect.

---

## Phase 0 — Foundation

### Task 1: Prerequisites + git init + commit the design record

**Files:** Create: `.gitignore`

- [ ] **Step 1: Verify/install Node and Git**

Run: `node --version; git --version`
If either fails, install (per-user, no admin):
`winget install --id OpenJS.NodeJS.LTS -e --accept-source-agreements --accept-package-agreements; winget install --id Git.Git -e --accept-source-agreements --accept-package-agreements`
Then **open a fresh shell** (PATH refresh) and re-verify. Expected: Node ≥ 20, git ≥ 2.40. If winget is unavailable, stop and ask the user to install Node LTS + Git manually.

- [ ] **Step 2: Init repo wired to the existing remote**

```powershell
git init -b main
git remote add origin https://github.com/jhavonei/jhavonei.github.io.git
git fetch origin
git merge origin/main --allow-unrelated-histories
```

Expected: working tree now also contains `CNAME` (content `jhavonei.me`) and `README.md`. Do not delete them; `CNAME` moves to `static/` in Task 2.

- [ ] **Step 3: Create `.gitignore`**

```gitignore
node_modules/
.svelte-kit/
build/
static/og/
.DS_Store
vite.config.ts.timestamp-*
```

Note: `.superpowers/` and `docs/` are intentionally committed — they are the design record.

- [ ] **Step 4: Commit**

```powershell
git add -A
git commit -m "chore: design record (spec, plan, mockups) + gitignore"
```

### Task 2: Project scaffold

**Files:** Create: `package.json`, `svelte.config.js`, `vite.config.ts`, `tsconfig.json`, `.npmrc`, `src/app.html`, `src/app.d.ts`, `src/routes/+layout.ts`, `src/routes/+layout.svelte`, `src/routes/+page.svelte` (stub), `static/CNAME`

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "jhavonei-portfolio",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "node scripts/og-plates.mjs && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "check": "svelte-check --tsconfig ./tsconfig.json"
  },
  "devDependencies": {
    "@fontsource/archivo-narrow": "^5.2.5",
    "@fontsource/ibm-plex-mono": "^5.2.5",
    "@resvg/resvg-js": "^2.6.2",
    "@sveltejs/adapter-static": "^3.0.8",
    "@sveltejs/kit": "^2.22.0",
    "@sveltejs/vite-plugin-svelte": "^5.1.0",
    "@types/three": "^0.178.0",
    "jsdom": "^26.1.0",
    "mdsvex": "^0.12.6",
    "svelte": "^5.35.0",
    "svelte-check": "^4.2.0",
    "three": "^0.178.0",
    "typescript": "^5.8.0",
    "vite": "^6.3.5",
    "vitest": "^3.2.0"
  }
}
```

(`og-plates.mjs` exists from Task 26; until then run `npx vite build` directly when a step says so.)

- [ ] **Step 2: Write `svelte.config.js`**

```js
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],
  preprocess: [vitePreprocess(), mdsvex({ extensions: ['.md'] })],
  kit: {
    adapter: adapter({ fallback: '404.html' }),
    prerender: { handleHttpError: 'warn' }
  }
};
export default config;
```

- [ ] **Step 3: Write `vite.config.ts`**

```ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
    globals: true
  }
});
```

- [ ] **Step 4: Write `tsconfig.json`, `.npmrc`, `src/app.d.ts`**

`tsconfig.json`:

```json
{
  "extends": "./.svelte-kit/tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "moduleResolution": "bundler",
    "allowJs": true,
    "checkJs": false,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "sourceMap": true
  }
}
```

`.npmrc`: `engine-strict=true`

`src/app.d.ts`:

```ts
declare global {
  namespace App {}
}
declare module '*.md' {
  import type { Component } from 'svelte';
  export const metadata: Record<string, unknown>;
  const component: Component;
  export default component;
}
export {};
```

- [ ] **Step 5: Write `src/app.html`** (pre-hydration mode class prevents WHITE-flash)

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%sveltekit.assets%/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script>
      try { if (localStorage.getItem('jhv:mode') === 'white') document.documentElement.classList.add('white'); } catch (e) {}
    </script>
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>
```

- [ ] **Step 6: Stub routes + move CNAME**

`src/routes/+layout.ts`:

```ts
export const prerender = true;
export const trailingSlash = 'never';
```

`src/routes/+layout.svelte` (minimal for now; replaced in Task 18):

```svelte
<script lang="ts">
  let { children } = $props();
</script>
{@render children()}
```

`src/routes/+page.svelte` (stub, replaced in Task 13):

```svelte
<h1>SPECIMEN PENDING</h1>
```

Move CNAME: `Move-Item CNAME static/CNAME` (creates `static/` first: `New-Item -ItemType Directory -Force static`). Verify content is exactly `jhavonei.me`.

- [ ] **Step 7: Install and smoke-test**

Run: `npm install` then `npx vite build`
Expected: build succeeds, `build/index.html` exists, `build/CNAME` exists.

- [ ] **Step 8: Commit**

```powershell
git add -A
git commit -m "feat: sveltekit scaffold (svelte 5, adapter-static, mdsvex, vitest)"
```

### Task 3: Design tokens, fonts, paper physics (`app.css`)

**Files:** Create: `src/app.css`, `static/favicon.svg` · Modify: `src/routes/+layout.svelte`

- [ ] **Step 1: Write `src/app.css`** — tokens exactly per spec §9 / mockups:

```css
/* ── tokens: BLACK (canonical) ── */
:root {
  --paper: #0a0a0a;
  --paper-raise: #101010;
  --ink: #c8c8c4;
  --ink-strong: #efefec;
  --ink-faint: rgba(200, 200, 196, 0.38);
  --hairline: rgba(200, 200, 196, 0.16);
  --hairline-strong: rgba(200, 200, 196, 0.34);
  --dot: rgba(200, 200, 196, 0.1);
  --accent: #efefec;
  --ease-reveal: cubic-bezier(0.2, 0.65, 0.3, 0.9);
  --ease-wipe: cubic-bezier(0.7, 0, 0.2, 1);
  --font-mono: 'IBM Plex Mono', ui-monospace, monospace;
  --font-display: 'Archivo Narrow', sans-serif;
}
/* ── WHITE twin ── */
html.white {
  --paper: #e9e7e2;
  --paper-raise: #efede8;
  --ink: #1c1c1a;
  --ink-strong: #0a0a0a;
  --ink-faint: rgba(28, 28, 26, 0.42);
  --hairline: rgba(28, 28, 26, 0.18);
  --hairline-strong: rgba(28, 28, 26, 0.38);
  --dot: rgba(28, 28, 26, 0.12);
  --accent: #0a0a0a;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.55;
  letter-spacing: 0.02em;
  background-image: radial-gradient(var(--dot) 1px, transparent 1px);
  background-size: 26px 26px;
  transition: background-color 0.6s ease, color 0.6s ease;
  min-height: 100vh;
}
/* film grain */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 90;
  opacity: 0.5;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E");
}
a { color: var(--ink-strong); text-decoration: none; }
a:focus-visible, button:focus-visible {
  outline: 1.5px solid var(--accent);
  outline-offset: 3px;
}
::selection { background: var(--ink-strong); color: var(--paper); }

/* ── shared dossier furniture ── */
.row {
  display: flex; justify-content: space-between; align-items: baseline;
  border-bottom: 1px solid var(--hairline-strong);
  padding: 6px 2px; text-transform: uppercase;
  color: var(--ink-strong); font-weight: 500;
}
.row .mid { color: var(--ink-faint); font-weight: 300; }
.row.sub { color: var(--ink); font-weight: 400; border-bottom-color: var(--hairline); }
.seal {
  cursor: pointer; user-select: none; border: 1px solid var(--hairline-strong);
  padding: 2px 10px; font: inherit; background: transparent; color: var(--ink-strong);
  text-transform: uppercase; letter-spacing: 0.12em;
}
.seal:hover { background: var(--ink-strong); color: var(--paper); }
.display {
  font-family: var(--font-display); font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.16em;
  color: var(--ink-strong); line-height: 1;
}
.label { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.14em; color: var(--ink-faint); }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

- [ ] **Step 2: Import fonts + css in `src/routes/+layout.svelte`**

```svelte
<script lang="ts">
  import '@fontsource/ibm-plex-mono/300.css';
  import '@fontsource/ibm-plex-mono/400.css';
  import '@fontsource/ibm-plex-mono/500.css';
  import '@fontsource/ibm-plex-mono/300-italic.css';
  import '@fontsource/archivo-narrow/500.css';
  import '@fontsource/archivo-narrow/600.css';
  import '../app.css';
  let { children } = $props();
</script>
{@render children()}
```

- [ ] **Step 3: Write `static/favicon.svg`** (registration-dot mark)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#0a0a0a"/><circle cx="16" cy="16" r="5" fill="none" stroke="#efefec" stroke-width="1.5"/><circle cx="16" cy="16" r="1.6" fill="#efefec"/></svg>
```

- [ ] **Step 4: Verify** — Run: `npx vite build` (succeeds); then `npm run dev` briefly: stub page shows dark paper, dot grid, grain.

- [ ] **Step 5: Commit** — `git add -A; git commit -m "feat: design tokens, fonts, paper physics"`

---

## Phase 1 — Config, systems, content

### Task 4: Anatomy constants, route registry, site config, authored copy

**Files:** Create: `src/lib/three/anatomy.ts`, `src/lib/config/routes.ts`, `src/lib/config/site.ts`, `src/lib/config/copy.ts` · Test: `src/lib/config/routes.test.ts`

- [ ] **Step 1: Write `src/lib/three/anatomy.ts`** — stamen directions (unit vectors from mockup Rev.B tip coordinates; +y is up):

```ts
/** Six stamen directions. Index = fig number (0 = Fig.00 inverter, 1–5 = routes). */
export const STAMEN_DIRS: readonly [number, number][] = [
  [-0.63, 0.78], // Fig.00 — Invert
  [0.63, 0.78],  // Fig.01 — Work
  [0.97, 0.24],  // Fig.02 — Field Notes
  [0.75, -0.66], // Fig.03 — The Author
  [-0.75, -0.66],// Fig.04 — Correspondence
  [-0.97, 0.24]  // Fig.05 — Repository
];
export const STAMEN_LEN = 1.9;
export const PETAL_LEN = 1.35;
```

- [ ] **Step 2: Write `src/lib/config/routes.ts`**

```ts
import { STAMEN_DIRS } from '$lib/three/anatomy';

export interface RouteDef {
  path: string;
  doc: string;      // "DOC.002"
  fig: number;      // 1..5
  title: string;    // display title
  short: string;    // callout label text
  plant: string;    // plants/ registry key
  latin: string;
  openingKey: keyof typeof import('./copy').openingLines;
}

export const ROUTES: RouteDef[] = [
  { path: '/work', doc: 'DOC.002', fig: 1, title: 'Work', short: 'Work', plant: 'datura', latin: 'Datura stramonium', openingKey: 'work' },
  { path: '/notes', doc: 'DOC.003', fig: 2, title: 'Field Notes', short: 'Field Notes', plant: 'digitalis', latin: 'Digitalis purpurea', openingKey: 'notes' },
  { path: '/author', doc: 'DOC.004', fig: 3, title: 'The Author', short: 'The Author', plant: 'belladonna', latin: 'Atropa belladonna', openingKey: 'author' },
  { path: '/correspondence', doc: 'DOC.005', fig: 4, title: 'Correspondence', short: 'Correspondence', plant: 'oleander', latin: 'Nerium oleander', openingKey: 'correspondence' },
  { path: '/repository', doc: 'DOC.006', fig: 5, title: 'Repository', short: 'Repository', plant: 'aconitum', latin: 'Aconitum napellus', openingKey: 'repository' }
];

export const routeByPath = (p: string): RouteDef | undefined =>
  ROUTES.find((r) => r.path === p || p.startsWith(r.path + '/'));

/** Departure direction for a route (its stamen's unit vector). */
export const directionFor = (p: string): [number, number] => {
  const r = routeByPath(p);
  return r ? [...STAMEN_DIRS[r.fig]] as [number, number] : [0, 1];
};
```

- [ ] **Step 3: Write `src/lib/config/site.ts`**

```ts
export const site = {
  name: 'JHAVONEI',
  origin: 'https://jhavonei.me',
  year: '2026',
  identityLine: 'GROWN IN THE DARK · READ IN THE LIGHT',
  availabilityLine: 'AVAILABLE FOR COMMISSIONS · COLLABORATIONS · CORRESPONDENCE',
  email: 'hey@jhavonei.me',
  /** Empty string ⇒ form hidden, mailto shown instead. Paste Formspree endpoint when created. */
  formspreeEndpoint: '',
  github: { handle: 'jhavonei' },
  socials: [
    { name: 'GitHub', url: 'https://github.com/jhavonei' },
    { name: 'X', url: 'https://x.com/jhavonei' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/jhavonei' },
    { name: 'Instagram', url: 'https://www.instagram.com/jhavonei' }
  ],
  author: { habitat: 'REMOTE · EARTH', activeSince: '2026' }
} as const;
```

- [ ] **Step 4: Write `src/lib/config/copy.ts`** — all authored text (original; reference-poster text must not appear):

```ts
/** Manifesto rings, outer → inner. Trailing separators intentional (ring loops). */
export const rings = [
  'EVERYTHING HERE WAS GROWN IN THE DARK AND PRESSED INTO THE RECORD · WHAT SURVIVES THE PRESSING IS THE WORK · ',
  'A SITE IS NOT A PAGE · IT IS A SPECIMEN OF ITS AUTHOR · HANDLE IT ACCORDINGLY · ',
  'TOUCH NOTHING CARELESSLY · EVERYTHING HERE IS ALIVE · '
];

export const openingLines = {
  work: 'WHAT SURVIVES THE PRESSING IS THE WORK · EVERYTHING ELSE WAS PRACTICE',
  notes: 'OBSERVATIONS TAKEN IN LOW LIGHT · ACCURACY NOT GUARANTEED · HONESTY IS',
  author: 'THE SPECIMEN DECLINED TO BE PHOTOGRAPHED · THE AURA AGREED TO SIT',
  correspondence: 'EVERY TRANSMISSION IS READ · SOME ARE ANSWERED · ALL ARE PRESSED',
  repository: "THE GARDEN'S ROOT SYSTEM · EXPOSED FOR INSPECTION"
} as const;

export const notFoundLine = 'SPECIMEN ESCAPED · THE CATALOGUE CONTINUES WITHOUT IT';

export const bio = [
  'The author builds instruments, not products. Small, deliberate machines — for reading, for listening, for looking too closely — grown in the dark hours and pressed into public record only when they survive handling.',
  'Method over mood: every piece here began as a field question, was prototyped past the point of good sense, and was catalogued the moment it stopped being fragile. What you are reading is the herbarium, not the greenhouse.',
  'The author is available, within reason, to people building strange and careful things. See Correspondence.'
];

export const traits = [
  'NOCTURNAL BY PRACTICE',
  'PRECISION OVER ORNAMENT',
  'CODE AS PRESSING MEDIUM',
  'MONOCHROME CONSTITUTION',
  'HANDLE WITH CURIOSITY'
];
```

- [ ] **Step 5: Write failing test `src/lib/config/routes.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { ROUTES, directionFor, routeByPath } from './routes';
import { STAMEN_DIRS } from '$lib/three/anatomy';
import { openingLines } from './copy';

describe('route registry', () => {
  it('defines five routes with unique figs 1..5 and docs', () => {
    expect(ROUTES).toHaveLength(5);
    expect(new Set(ROUTES.map((r) => r.fig))).toEqual(new Set([1, 2, 3, 4, 5]));
    expect(new Set(ROUTES.map((r) => r.doc)).size).toBe(5);
  });
  it('every route has an opening line', () => {
    for (const r of ROUTES) expect(openingLines[r.openingKey]).toBeTruthy();
  });
  it('directionFor returns the stamen unit vector, and up for unknown', () => {
    expect(directionFor('/work')).toEqual([...STAMEN_DIRS[1]]);
    expect(directionFor('/notes/some-slug')).toEqual([...STAMEN_DIRS[2]]);
    expect(directionFor('/nope')).toEqual([0, 1]);
  });
  it('stamen dirs are unit length', () => {
    for (const [x, y] of STAMEN_DIRS) expect(Math.hypot(x, y)).toBeCloseTo(1, 1);
  });
  it('routeByPath matches nested paths', () => {
    expect(routeByPath('/notes/n001')?.fig).toBe(2);
  });
});
```

- [ ] **Step 6: Run** `npx vitest run src/lib/config` — Expected: PASS (files written in steps 1–4 satisfy it; if you wrote the test first it fails with unresolved imports, then passes).

- [ ] **Step 7: Commit** — `git add -A; git commit -m "feat: anatomy, route registry, site config, authored copy"`

### Task 5: BLACK/WHITE mode store (TDD)

**Files:** Create: `src/lib/systems/mode.svelte.ts` · Test: `src/lib/systems/mode.test.ts`

- [ ] **Step 1: Write failing test `src/lib/systems/mode.test.ts`**

```ts
import { beforeEach, describe, expect, it } from 'vitest';
import { createMode } from './mode.svelte';

describe('mode store', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });
  it('defaults to black even if OS prefers light', () => {
    const m = createMode();
    m.init();
    expect(m.current).toBe('black');
    expect(document.documentElement.classList.contains('white')).toBe(false);
  });
  it('toggle flips to white, sets class, persists', () => {
    const m = createMode();
    m.init();
    m.toggle();
    expect(m.current).toBe('white');
    expect(document.documentElement.classList.contains('white')).toBe(true);
    expect(localStorage.getItem('jhv:mode')).toBe('white');
  });
  it('init restores persisted white', () => {
    localStorage.setItem('jhv:mode', 'white');
    const m = createMode();
    m.init();
    expect(m.current).toBe('white');
    expect(document.documentElement.classList.contains('white')).toBe(true);
  });
});
```

- [ ] **Step 2: Run to verify failure** — `npx vitest run src/lib/systems` — Expected: FAIL (module not found).

- [ ] **Step 3: Write `src/lib/systems/mode.svelte.ts`**

```ts
export type Mode = 'black' | 'white';
const KEY = 'jhv:mode';
const inBrowser = () => typeof document !== 'undefined';

export function createMode() {
  let current = $state<Mode>('black');
  const apply = (m: Mode) => {
    if (inBrowser()) document.documentElement.classList.toggle('white', m === 'white');
  };
  return {
    get current() { return current; },
    init() {
      if (!inBrowser()) return;
      current = localStorage.getItem(KEY) === 'white' ? 'white' : 'black';
      apply(current);
    },
    toggle() {
      current = current === 'black' ? 'white' : 'black';
      if (inBrowser()) localStorage.setItem(KEY, current);
      apply(current);
    }
  };
}
/** App-wide singleton. */
export const mode = createMode();
```

- [ ] **Step 4: Run to verify pass** — `npx vitest run src/lib/systems` — Expected: PASS (3 tests).

- [ ] **Step 5: Commit** — `git add -A; git commit -m "feat: BLACK/WHITE mode store (canonical black, persisted)"`

### Task 6: Prefs (visited rite, sound armed) (TDD)

**Files:** Create: `src/lib/systems/prefs.ts` · Test: `src/lib/systems/prefs.test.ts`

- [ ] **Step 1: Write failing test `src/lib/systems/prefs.test.ts`**

```ts
import { beforeEach, describe, expect, it } from 'vitest';
import { hasVisited, markVisited, isSoundArmed, setSoundArmed, prefersReducedMotion } from './prefs';

describe('prefs', () => {
  beforeEach(() => localStorage.clear());
  it('visited flag round-trips', () => {
    expect(hasVisited()).toBe(false);
    markVisited();
    expect(hasVisited()).toBe(true);
  });
  it('sound armed round-trips and defaults off', () => {
    expect(isSoundArmed()).toBe(false);
    setSoundArmed(true);
    expect(isSoundArmed()).toBe(true);
    setSoundArmed(false);
    expect(isSoundArmed()).toBe(false);
  });
  it('prefersReducedMotion is boolean and safe in jsdom', () => {
    expect(typeof prefersReducedMotion()).toBe('boolean');
  });
});
```

- [ ] **Step 2: Run** `npx vitest run src/lib/systems/prefs.test.ts` — Expected: FAIL.

- [ ] **Step 3: Write `src/lib/systems/prefs.ts`**

```ts
const safe = <T>(fn: () => T, fallback: T): T => {
  try { return fn(); } catch { return fallback; }
};
export const hasVisited = () => safe(() => localStorage.getItem('jhv:visited') === '1', false);
export const markVisited = () => safe(() => localStorage.setItem('jhv:visited', '1'), undefined);
export const isSoundArmed = () => safe(() => localStorage.getItem('jhv:sound') === '1', false);
export const setSoundArmed = (v: boolean) => safe(() => localStorage.setItem('jhv:sound', v ? '1' : '0'), undefined);
export const prefersReducedMotion = () =>
  safe(() => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches, false);
```

- [ ] **Step 4: Run** — Expected: PASS. **Step 5: Commit** — `git add -A; git commit -m "feat: prefs (visited, sound, reduced-motion)"`

### Task 7: Content collections + placeholder specimens (TDD)

**Files:** Create: `src/lib/content/index.ts`, `src/content/work/v01-nocturne-engine.md`, `v02-choir-of-small-machines.md`, `v03-field-recorder.md`, `v04-grimoire-parser.md`, `src/content/notes/n001-building-the-specimen.md` · Test: `src/lib/content/index.test.ts`

- [ ] **Step 1: Write the four work files.** `src/content/work/v01-nocturne-engine.md`:

```markdown
---
index: V.01
title: Nocturne Engine
class: Web Instrument
year: '2026'
status: live
stack: [SvelteKit, Three.js, WebAudio]
role: Everything
links: { exhibit: '', source: '' }
placeholder: true
blurb: >-
  A browser instrument that plays only after dark: it reads local sunset time
  and refuses to make a sound before dusk. Built to ask whether software can
  keep hours — and whether patience is a feature.
---
```

`v02-choir-of-small-machines.md`:

```markdown
---
index: V.02
title: Choir of Small Machines
class: AI Experiment
year: '2026'
status: live
stack: [SvelteKit, Three.js, ONNX Runtime]
role: Everything
links: { exhibit: '', source: '' }
placeholder: true
blurb: >-
  An ensemble of tiny language models given one instrument each, improvising
  against a metronome no one can hear. Built to ask whether coordination
  without communication is still music.
---
```

`v03-field-recorder.md`:

```markdown
---
index: V.03
title: Field Recorder
class: Tooling
year: '2025'
status: live
stack: [TypeScript, CLI]
role: Everything
links: { exhibit: '', source: '' }
placeholder: true
blurb: >-
  A notebook that timestamps everything and forgives nothing: a command-line
  field journal whose entries cannot be edited, only annotated. The record is
  the point.
---
```

`v04-grimoire-parser.md`:

```markdown
---
index: V.04
title: Grimoire Parser
class: Library
year: '2025'
status: archived
stack: [TypeScript]
role: Everything
links: { exhibit: '', source: '' }
placeholder: true
blurb: >-
  A parser for documents that were never meant to be parsed — marginalia,
  crossings-out, second thoughts. Archived when it started finding meaning
  that was not there.
---
```

- [ ] **Step 2: Write `src/content/notes/n001-building-the-specimen.md`** (real content, honest from day one):

```markdown
---
index: N.001
title: Building the Specimen
field: Method
date: '2026-07-23'
---

This site began as six reference images and a rule: monochrome, or nothing.

The landing flower is a port of a particle system originally wrapped around a
torus knot. The physics did not change — repulsion, spring, damping, all kept
to the original constants — only the body changed. It turns out a spider lily
is mostly a torus knot with better posture.

The catalogue numbering (V.01, N.001, DOC.002) is not decoration. Slots that
say SEALED are real slots; the record is built to have gaps. A portfolio that
admits what is missing is more honest than one that pretends to be finished.

This note is the first entry in the record. It documents the record. The
snake is aware it is eating its tail; the snake considers this a feature.
```

- [ ] **Step 3: Write failing test `src/lib/content/index.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { workEntries, noteEntries, sealedAfter } from './index';

describe('content collections', () => {
  it('loads work entries sorted by index', () => {
    expect(workEntries.length).toBeGreaterThanOrEqual(4);
    const idx = workEntries.map((w) => w.index);
    expect(idx).toEqual([...idx].sort());
    expect(workEntries[0].title).toBe('Nocturne Engine');
  });
  it('loads notes with slugs derived from filenames', () => {
    expect(noteEntries.length).toBeGreaterThanOrEqual(1);
    expect(noteEntries[0].slug).toBe('n001-building-the-specimen');
    expect(noteEntries[0].index).toBe('N.001');
  });
  it('sealedAfter continues the numbering', () => {
    expect(sealedAfter('V.04', 2)).toEqual(['V.05', 'V.06']);
    expect(sealedAfter('N.001', 2)).toEqual(['N.002', 'N.003']);
  });
});
```

- [ ] **Step 4: Run** `npx vitest run src/lib/content` — Expected: FAIL (module not found).

- [ ] **Step 5: Write `src/lib/content/index.ts`**

```ts
export interface WorkMeta {
  index: string; title: string; class: string; year: string;
  status: 'live' | 'archived'; stack: string[]; role: string;
  links?: { exhibit?: string; source?: string };
  placeholder?: boolean; blurb: string;
}
export interface NoteMeta {
  index: string; title: string; field: string; date: string; slug: string;
}

const workMods = import.meta.glob('/src/content/work/*.md', { eager: true }) as Record<
  string, { metadata: WorkMeta }
>;
export const workEntries: WorkMeta[] = Object.values(workMods)
  .map((m) => m.metadata)
  .sort((a, b) => a.index.localeCompare(b.index));

const noteMods = import.meta.glob('/src/content/notes/*.md', { eager: true }) as Record<
  string, { metadata: Omit<NoteMeta, 'slug'> }
>;
export const noteEntries: NoteMeta[] = Object.entries(noteMods)
  .map(([path, m]) => ({ ...m.metadata, slug: path.split('/').pop()!.replace(/\.md$/, '') }))
  .sort((a, b) => a.index.localeCompare(b.index));

/** "V.04" → ["V.05","V.06"]; zero-padding preserved ("N.001" → "N.002"). */
export function sealedAfter(lastIndex: string, slots: number): string[] {
  const m = lastIndex.match(/^([A-Z]+\.)(\d+)$/);
  if (!m) return [];
  const [, prefix, num] = m;
  return Array.from({ length: slots }, (_, i) =>
    `${prefix}${String(Number(num) + i + 1).padStart(num.length, '0')}`
  );
}
```

- [ ] **Step 6: Run** — Expected: PASS. **Step 7: Commit** — `git add -A; git commit -m "feat: content collections + placeholder specimens"`

---

## Phase 2 — Dossier chrome

### Task 8: Micro-motion primitives — TypedText, DrawnLine, Stamp

**Files:** Create: `src/lib/chrome/TypedText.svelte`, `src/lib/chrome/DrawnLine.svelte`, `src/lib/chrome/Stamp.svelte`

- [ ] **Step 1: Write `src/lib/chrome/TypedText.svelte`** — staggered char reveal, WovenLight timing contract (`delay = i * step + base`, 1.2s, reveal ease):

```svelte
<script lang="ts">
  let { text, base = 0, step = 0.05, tag = 'span' } = $props<{
    text: string; base?: number; step?: number; tag?: string;
  }>();
</script>

<svelte:element this={tag} class="typed" aria-label={text}>
  {#each text.split('') as char, i}
    <span class="ch" aria-hidden="true" style="animation-delay: {base + i * step}s"
      >{char === ' ' ? ' ' : char}</span>
  {/each}
</svelte:element>

<style>
  .typed { display: inline-block; }
  .ch {
    display: inline-block; opacity: 0; transform: translateY(0.6em);
    animation: rise 1.2s var(--ease-reveal) forwards;
  }
  @keyframes rise { to { opacity: 1; transform: translateY(0); } }
  @media (prefers-reduced-motion: reduce) { .ch { opacity: 1; transform: none; animation: none; } }
</style>
```

- [ ] **Step 2: Write `src/lib/chrome/DrawnLine.svelte`** — hairline that draws itself:

```svelte
<script lang="ts">
  let { width = '100%', delay = 0, duration = 0.6, strong = false } = $props<{
    width?: string; delay?: number; duration?: number; strong?: boolean;
  }>();
</script>

<div class="drawn" class:strong style="width: {width}; animation-delay: {delay}s; animation-duration: {duration}s"></div>

<style>
  .drawn {
    height: 1px; background: var(--hairline); transform: scaleX(0); transform-origin: left;
    animation: draw var(--ease-reveal) forwards;
  }
  .drawn.strong { background: var(--hairline-strong); }
  @keyframes draw { to { transform: scaleX(1); } }
  @media (prefers-reduced-motion: reduce) { .drawn { transform: none; animation: none; } }
</style>
```

- [ ] **Step 3: Write `src/lib/chrome/Stamp.svelte`** — settle-in stamp (scale 1.3→1, rotate −8°):

```svelte
<script lang="ts">
  let { delay = 0, children } = $props<{ delay?: number; children: import('svelte').Snippet }>();
</script>

<span class="stamp" style="animation-delay: {delay}s">{@render children()}</span>

<style>
  .stamp {
    display: inline-block; border: 1.5px solid var(--accent); color: var(--accent);
    padding: 2px 10px; text-transform: uppercase; letter-spacing: 0.2em; font-size: 10px;
    opacity: 0; transform: rotate(-8deg) scale(1.3);
    animation: settle 0.25s var(--ease-wipe) forwards;
  }
  @keyframes settle { to { opacity: 1; transform: rotate(-8deg) scale(1); } }
  @media (prefers-reduced-motion: reduce) { .stamp { opacity: 1; transform: rotate(-8deg); animation: none; } }
</style>
```

- [ ] **Step 4: Verify** — `npx vite build` succeeds (components compile; visual check happens in Task 9).

- [ ] **Step 5: Commit** — `git add -A; git commit -m "feat: micro-motion primitives (typed, drawn, stamp)"`

### Task 9: HeaderRows, FooterStrip, Breadcrumb, OpeningLine

**Files:** Create: `src/lib/chrome/HeaderRows.svelte`, `src/lib/chrome/FooterStrip.svelte`, `src/lib/chrome/Breadcrumb.svelte`, `src/lib/chrome/OpeningLine.svelte`

- [ ] **Step 1: Write `src/lib/chrome/HeaderRows.svelte`**

```svelte
<script lang="ts">
  import { site } from '$lib/config/site';
  let { doc, figLabel } = $props<{ doc: string; figLabel: string }>();
</script>

<header>
  <div class="row">
    <span>{site.name}</span>
    <span class="mid">{site.identityLine}</span>
    <span>{site.year}</span>
  </div>
  <div class="row sub">
    <span>{doc}</span>
    <span class="mid">{figLabel}</span>
    <span aria-hidden="true">●</span>
  </div>
</header>
```

- [ ] **Step 2: Write `src/lib/chrome/FooterStrip.svelte`** — the semantic nav + Fig.00 + sound seal + colophon (sound seal is inert until Task 22 wires `sound.ts`):

```svelte
<script lang="ts">
  import { ROUTES } from '$lib/config/routes';
  import { mode } from '$lib/systems/mode.svelte';
  import { page } from '$app/state';
  let { onSoundToggle = () => {}, soundOn = false } = $props<{
    onSoundToggle?: () => void; soundOn?: boolean;
  }>();
</script>

<footer class="strip">
  <nav aria-label="Catalogue">
    {#each ROUTES as r}
      <a href={r.path} aria-current={page.url.pathname === r.path ? 'page' : undefined}
        >Fig.0{r.fig} {r.short}</a>
    {/each}
  </nav>
  <div class="ops">
    <button class="seal" onclick={() => mode.toggle()}>Fig.00 ⇄ {mode.current === 'black' ? 'White' : 'Black'}</button>
    <button class="seal" onclick={onSoundToggle} aria-pressed={soundOn}>Sound {soundOn ? '●' : '○'}</button>
  </div>
  <div class="colophon label">BLACKWHITE · JHAVONEI.ME · ALL OVER THE WORLD</div>
</footer>

<style>
  .strip {
    display: flex; flex-wrap: wrap; gap: 10px 22px; align-items: baseline;
    border-top: 1px solid var(--hairline-strong);
    padding: 10px 0 4px; margin-top: 40px;
    font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.14em;
  }
  nav { display: flex; flex-wrap: wrap; gap: 4px 18px; }
  nav a { color: var(--ink-faint); }
  nav a:hover, nav a[aria-current='page'] { color: var(--ink-strong); }
  .ops { display: flex; gap: 10px; margin-left: auto; }
  .colophon { flex-basis: 100%; color: var(--ink-faint); }
</style>
```

- [ ] **Step 3: Write `src/lib/chrome/Breadcrumb.svelte`**

```svelte
<a href="/" class="crumb label">⟵ Return to specimen</a>

<style>
  .crumb { display: inline-block; margin-bottom: 6px; }
  .crumb:hover { color: var(--ink-strong); }
</style>
```

- [ ] **Step 4: Write `src/lib/chrome/OpeningLine.svelte`**

```svelte
<script lang="ts">
  import TypedText from './TypedText.svelte';
  let { text } = $props<{ text: string }>();
</script>

<p class="openline"><TypedText {text} step={0.012} /></p>

<style>
  .openline {
    border-bottom: 1px dashed var(--hairline);
    padding: 10px 0; margin-bottom: 22px;
    font-size: 10.5px; letter-spacing: 0.3em; text-transform: uppercase;
    color: var(--ink-faint); white-space: nowrap; overflow: hidden;
  }
</style>
```

- [ ] **Step 5: Verify + commit** — `npx vite build` succeeds; `git add -A; git commit -m "feat: dossier chrome (header rows, footer strip, breadcrumb, opening line)"`

### Task 10: The poison garden — five guardian plant SVGs

**Files:** Create: `src/lib/plants/Datura.svelte`, `Digitalis.svelte`, `Belladonna.svelte`, `Oleander.svelte`, `Aconitum.svelte`, `src/lib/plants/index.ts`

All five share the same skeleton: stroke-only hairline drawing, `currentColor`, slow sway. Props: `size` (px height, default 120).

- [ ] **Step 1: Write `src/lib/plants/Datura.svelte`** (trumpet bloom — from mockup Doc.002):

```svelte
<script lang="ts">
  let { size = 120 } = $props<{ size?: number }>();
</script>

<figure class="plant" style="height: {size}px">
  <svg viewBox="0 0 92 120" height={size} role="img" aria-label="Datura stramonium, line drawing">
    <g fill="none" stroke="currentColor" stroke-width="0.8">
      <path d="M46,116 C 45,90 44,66 46,44" />
      <path d="M46,44 C 36,38 30,24 33,8 C 40,16 44,20 46,26 C 48,20 52,16 59,8 C 62,24 56,38 46,44" />
      <path opacity="0.4" d="M46,44 C 43,32 42,22 44,12" />
      <path opacity="0.4" d="M46,44 C 49,32 50,22 48,12" />
      <path d="M46,78 C 34,74 24,76 16,84 C 26,88 38,86 46,78" />
      <path opacity="0.4" d="M46,78 C 36,79 28,81 20,84" />
      <circle cx="33" cy="8" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="59" cy="8" r="1.4" fill="currentColor" stroke="none" />
    </g>
  </svg>
</figure>

<style>
  .plant { margin: 0; color: var(--ink); transform-origin: 50% 95%; animation: sway 9s ease-in-out infinite; }
  @keyframes sway { 0%, 100% { transform: rotate(-0.6deg); } 50% { transform: rotate(0.6deg); } }
  @media (prefers-reduced-motion: reduce) { .plant { animation: none; } }
</style>
```

- [ ] **Step 2: Write the other four**, identical skeleton (same `<style>` block; change only the svg contents and aria-label).

`Digitalis.svelte` (foxglove — bells on a raceme):

```svelte
<svg viewBox="0 0 92 120" height={size} role="img" aria-label="Digitalis purpurea, line drawing">
  <g fill="none" stroke="currentColor" stroke-width="0.8">
    <path d="M46,116 C 47,84 48,48 50,10" />
    <path d="M49,22 C 42,20 38,25 39,31 C 44,34 49,31 49,26" />
    <path d="M50,38 C 41,36 36,42 38,49 C 44,52 50,48 50,42" />
    <path d="M49,56 C 39,54 34,61 37,68 C 44,71 50,66 50,60" />
    <path d="M48,74 C 38,73 33,80 36,87 C 43,90 49,85 49,78" />
    <path opacity="0.4" d="M43,28 L46,29 M42,45 L45,46 M41,63 L44,64 M40,81 L43,82" />
    <path d="M46,98 C 36,94 27,96 20,102 C 29,106 40,104 46,98" />
  </g>
</svg>
```

`Belladonna.svelte` (nightshade — branch, star calyx, one berry):

```svelte
<svg viewBox="0 0 92 120" height={size} role="img" aria-label="Atropa belladonna, line drawing">
  <g fill="none" stroke="currentColor" stroke-width="0.8">
    <path d="M46,116 C 46,88 44,62 40,40 M40,40 C 38,28 40,18 46,10 M40,40 C 30,34 24,26 24,16" />
    <path d="M40,58 C 30,52 22,52 14,58 C 22,64 32,64 40,58" />
    <path d="M44,78 C 54,72 62,72 70,78 C 62,84 52,84 44,78" />
    <path d="M46,10 l3,-4 M46,10 l4,2 M46,10 l-1,-5 M46,10 l-4,-1 M46,10 l-2,4" opacity="0.7" />
    <circle cx="58" cy="30" r="5" />
    <path opacity="0.4" d="M58,25 C 55,27 54,30 55,33" />
    <path d="M52,26 L46,18" opacity="0.6" />
  </g>
</svg>
```

`Oleander.svelte` (lanceolate leaf pair + five-petal pinwheel):

```svelte
<svg viewBox="0 0 92 120" height={size} role="img" aria-label="Nerium oleander, line drawing">
  <g fill="none" stroke="currentColor" stroke-width="0.8">
    <path d="M46,116 C 46,86 46,60 46,42" />
    <path d="M46,66 C 34,60 24,58 12,62 C 24,70 36,71 46,66" />
    <path opacity="0.4" d="M42,65 L16,62" />
    <path d="M46,80 C 58,74 68,72 80,76 C 68,84 56,85 46,80" />
    <path opacity="0.4" d="M50,79 L76,76" />
    <g>
      <path d="M46,42 C 40,36 40,28 46,24 C 44,30 45,36 46,42" />
      <path d="M46,42 C 52,36 52,28 46,24 C 48,30 47,36 46,42" transform="rotate(72 46 33)" />
      <path d="M46,42 C 52,36 52,28 46,24 C 48,30 47,36 46,42" transform="rotate(144 46 33)" />
      <path d="M46,42 C 52,36 52,28 46,24 C 48,30 47,36 46,42" transform="rotate(216 46 33)" />
      <path d="M46,42 C 52,36 52,28 46,24 C 48,30 47,36 46,42" transform="rotate(288 46 33)" />
      <circle cx="46" cy="33" r="1.5" fill="currentColor" stroke="none" />
    </g>
  </g>
</svg>
```

`Aconitum.svelte` (monkshood — hooded helmet raceme):

```svelte
<svg viewBox="0 0 92 120" height={size} role="img" aria-label="Aconitum napellus, line drawing">
  <g fill="none" stroke="currentColor" stroke-width="0.8">
    <path d="M46,116 C 46,86 46,54 46,16" />
    <path d="M46,16 C 39,16 35,23 37,30 C 40,35 47,35 52,31 C 55,26 52,18 46,16" />
    <path opacity="0.5" d="M39,27 C 42,30 47,31 51,29" />
    <path d="M45,42 C 38,42 35,48 37,54 C 41,58 47,57 50,53 C 52,48 50,43 45,42" />
    <path d="M47,64 C 41,65 38,70 40,75 C 44,78 49,77 51,73 C 52,69 51,65 47,64" />
    <path d="M46,90 C 36,84 30,84 22,88 M46,90 C 40,80 38,74 40,66" opacity="0.6" />
    <path d="M46,96 C 56,90 62,90 70,94 M46,96 C 52,86 54,80 52,72" opacity="0.6" />
  </g>
</svg>
```

- [ ] **Step 3: Write `src/lib/plants/index.ts`**

```ts
import type { Component } from 'svelte';
import Datura from './Datura.svelte';
import Digitalis from './Digitalis.svelte';
import Belladonna from './Belladonna.svelte';
import Oleander from './Oleander.svelte';
import Aconitum from './Aconitum.svelte';

export const plants: Record<string, Component<{ size?: number }>> = {
  datura: Datura,
  digitalis: Digitalis,
  belladonna: Belladonna,
  oleander: Oleander,
  aconitum: Aconitum
};
```

- [ ] **Step 4: Verify + commit** — `npx vite build`; `git add -A; git commit -m "feat: poison garden (five guardian plant specimens)"`

### Task 11: DocumentPage — the interior page shell

**Files:** Create: `src/lib/doc/DocumentPage.svelte`, `src/lib/chrome/Seo.svelte`

- [ ] **Step 1: Write `src/lib/chrome/Seo.svelte`**

```svelte
<script lang="ts">
  import { site } from '$lib/config/site';
  import { page } from '$app/state';
  let { title, description } = $props<{ title: string; description: string }>();
  const url = $derived(site.origin + page.url.pathname);
  const og = $derived(`${site.origin}/og${page.url.pathname === '/' ? '/index' : page.url.pathname}.png`);
</script>

<svelte:head>
  <title>{title === site.name ? title : `${title} — ${site.name}`}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={url} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={url} />
  <meta property="og:image" content={og} />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>
```

- [ ] **Step 2: Write `src/lib/doc/DocumentPage.svelte`**

```svelte
<script lang="ts">
  import type { RouteDef } from '$lib/config/routes';
  import { openingLines } from '$lib/config/copy';
  import { plants } from '$lib/plants';
  import HeaderRows from '$lib/chrome/HeaderRows.svelte';
  import FooterStrip from '$lib/chrome/FooterStrip.svelte';
  import Breadcrumb from '$lib/chrome/Breadcrumb.svelte';
  import OpeningLine from '$lib/chrome/OpeningLine.svelte';
  import Seo from '$lib/chrome/Seo.svelte';
  let { route, subtitle, description, children } = $props<{
    route: RouteDef; subtitle: string; description: string;
    children: import('svelte').Snippet;
  }>();
  const Plant = plants[route.plant];
</script>

<Seo title={route.title} {description} />

<div class="sheet">
  <HeaderRows doc={route.doc} figLabel={`Fig.0${route.fig} — ${route.title}`} />
  <div class="doc-head">
    <div>
      <Breadcrumb />
      <h1 class="display doc-title">{route.title}</h1>
      <p class="label doc-sub">Fig.0{route.fig} · {subtitle}</p>
    </div>
    <figure class="guardian">
      <Plant size={120} />
      <figcaption class="label latin">{route.latin}</figcaption>
    </figure>
  </div>
  <OpeningLine text={openingLines[route.openingKey]} />
  <main>{@render children()}</main>
  <FooterStrip />
</div>

<style>
  .sheet { max-width: 1080px; margin: 0 auto; padding: 28px 34px 40px; }
  .doc-head {
    display: flex; justify-content: space-between; align-items: flex-end; gap: 20px;
    padding: 26px 0 14px;
  }
  .doc-title { font-size: clamp(34px, 6vw, 52px); margin-top: 6px; }
  .doc-sub { margin-top: 8px; }
  .guardian { margin: 0; text-align: center; }
  .latin { font-style: italic; margin-top: 2px; }
  @media (max-width: 640px) { .doc-head { align-items: flex-start; } .guardian { display: none; } }
</style>
```

Note: on narrow screens the guardian hides rather than crowding the title — the plant still appears in OG plates and desktop.

- [ ] **Step 3: Verify + commit** — `npx vite build`; `git add -A; git commit -m "feat: DocumentPage interior shell + Seo"`

---

## Phase 3 — The hero

### Task 12: Seeded RNG + procedural lily point cloud (TDD)

**Files:** Create: `src/lib/three/rng.ts`, `src/lib/three/lilyGeometry.ts` · Test: `src/lib/three/lilyGeometry.test.ts`

- [ ] **Step 1: Write `src/lib/three/rng.ts`**

```ts
/** Deterministic PRNG (mulberry32). Same seed ⇒ same sequence, all platforms. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
```

- [ ] **Step 2: Write failing test `src/lib/three/lilyGeometry.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { buildLily, FILAMENT } from './lilyGeometry';
import { STAMEN_LEN } from './anatomy';

describe('buildLily', () => {
  const lily = buildLily(10_000, 7);
  it('produces exactly the requested count', () => {
    expect(lily.count).toBe(10_000);
    expect(lily.positions.length).toBe(30_000);
    expect(lily.grays.length).toBe(10_000);
    expect(lily.filament.length).toBe(10_000);
  });
  it('is deterministic for a given seed', () => {
    const again = buildLily(10_000, 7);
    expect(again.positions[0]).toBe(lily.positions[0]);
    expect(again.positions[29_999]).toBe(lily.positions[29_999]);
  });
  it('exports six stamen tips at full reach', () => {
    expect(lily.tips).toHaveLength(6);
    for (const [x, y] of lily.tips) {
      expect(Math.hypot(x, y)).toBeGreaterThan(STAMEN_LEN * 0.85);
    }
  });
  it('roughly honors the point budget (≈70% petals)', () => {
    let petals = 0;
    for (const f of lily.filament) if (f === FILAMENT.PETALS) petals++;
    expect(petals / lily.count).toBeGreaterThan(0.6);
    expect(petals / lily.count).toBeLessThan(0.8);
  });
  it('keeps grays in a monochrome band', () => {
    for (let i = 0; i < 200; i++) {
      expect(lily.grays[i]).toBeGreaterThanOrEqual(0.4);
      expect(lily.grays[i]).toBeLessThanOrEqual(1.0);
    }
  });
});
```

- [ ] **Step 3: Run to verify failure** — `npx vitest run src/lib/three` — Expected: FAIL (lilyGeometry not found).

- [ ] **Step 4: Write `src/lib/three/lilyGeometry.ts`**

```ts
import { mulberry32 } from './rng';
import { PETAL_LEN, STAMEN_DIRS, STAMEN_LEN } from './anatomy';

export const FILAMENT = { PETALS: 6, CORE: 7 } as const; // 0..5 = stamen fig index

export interface LilyPointCloud {
  positions: Float32Array; // xyz per point
  grays: Float32Array;     // 0..1 per point
  filament: Uint8Array;    // 0..5 stamen, 6 petals, 7 core/haze
  tips: [number, number, number][]; // world tip per stamen fig 0..5
  count: number;
}

const PETAL_W = 0.34;
const RECURVE = 0.55;
const STAMEN_Z = [0.0, 0.3, 0.5, 0.15]; // bezier z profile (arcs toward camera)

function cubic(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
}

export function buildLily(count = 50_000, seed = 7): LilyPointCloud {
  const rng = mulberry32(seed);
  const positions = new Float32Array(count * 3);
  const grays = new Float32Array(count);
  const filament = new Uint8Array(count);

  const nPetal = Math.floor(count * 0.7);
  const nStamen = Math.floor(count * 0.22);
  const nCore = count - nPetal - nStamen;
  const perStamen = Math.floor(nStamen / 6);

  // precompute stamen bezier control points (xy from dir, z from profile)
  const ctrl = STAMEN_DIRS.map(([dx, dy]) => ({
    x: [0, dx * 0.5, dx * 1.3, dx * STAMEN_LEN],
    y: [0, dy * 0.5, dy * 1.3, dy * STAMEN_LEN],
    z: STAMEN_Z
  }));
  const tips: [number, number, number][] = ctrl.map((c) => [c.x[3], c.y[3], c.z[3]]);

  let i = 0;
  const put = (x: number, y: number, z: number, g: number, f: number) => {
    positions[i * 3] = x; positions[i * 3 + 1] = y; positions[i * 3 + 2] = z;
    grays[i] = g; filament[i] = f; i++;
  };
  const j = () => (rng() - 0.5) * 0.012; // positional jitter

  // ── petals: six lanceolate recurved blades at 90° + k·60° ──
  for (let p = 0; p < nPetal; p++) {
    const k = p % 6;
    const th = (Math.PI / 2) + k * (Math.PI / 3);
    const dirX = Math.cos(th), dirY = Math.sin(th);
    const u = Math.pow(rng(), 0.7); // denser at base
    const w = PETAL_W * Math.sin(Math.PI * Math.min(u * 1.05, 1)) * (1 - 0.35 * u);
    const v = (rng() * 2 - 1) * w * 0.5;
    const r = u * PETAL_LEN;
    const z = -RECURVE * u * u * (1.8 * u - 0.8); // lifts, then curls behind
    put(dirX * r - dirY * v + j(), dirY * r + dirX * v + j(), z + j(),
        0.55 + 0.35 * rng(), FILAMENT.PETALS);
  }

  // ── stamens: six bezier filaments + anther cluster at tip ──
  for (let s = 0; s < 6; s++) {
    const c = ctrl[s];
    const nAnther = Math.floor(perStamen * 0.25);
    const nFil = perStamen - nAnther;
    for (let q = 0; q < nFil; q++) {
      const t = rng();
      put(cubic(c.x[0], c.x[1], c.x[2], c.x[3], t) + j(),
          cubic(c.y[0], c.y[1], c.y[2], c.y[3], t) + j(),
          cubic(c.z[0], c.z[1], c.z[2], c.z[3], t) + j(),
          0.7 + 0.3 * rng(), s);
    }
    for (let q = 0; q < nAnther; q++) {
      const g = () => (rng() + rng() + rng() - 1.5) * 0.045; // approx gaussian
      put(tips[s][0] + g(), tips[s][1] + g(), tips[s][2] + g(), 0.8 + 0.2 * rng(), s);
    }
  }

  // ── core + pollen haze ──
  for (let q = i; i < count; ) {
    const near = rng() < 0.5;
    if (near) {
      const g = () => (rng() + rng() - 1) * 0.09;
      put(g(), g(), 0.1 + rng() * 0.15, 0.75 + 0.25 * rng(), FILAMENT.CORE);
    } else {
      const s = Math.floor(rng() * 6);
      const g = () => (rng() - 0.5) * 0.5;
      put(tips[s][0] * (0.7 + 0.3 * rng()) + g(), tips[s][1] * (0.7 + 0.3 * rng()) + g(),
          tips[s][2] + g() * 0.3, 0.4 + 0.2 * rng(), FILAMENT.CORE);
    }
  }

  return { positions, grays, filament, tips, count };
}
```

- [ ] **Step 5: Run to verify pass** — `npx vitest run src/lib/three` — Expected: PASS (5 tests).

- [ ] **Step 6: Commit** — `git add -A; git commit -m "feat: procedural lily point cloud (seeded, budgeted, tips exported)"`

### Task 13: SpecimenCanvas — the ported WovenLight physics

**Files:** Create: `src/lib/three/SpecimenCanvas.svelte` · Modify: `src/routes/+page.svelte`

**Contract (spec §3.4 — constants may not change):** repulsion radius `1.5`, force `(1.5 − d) * 0.01`; spring `* 0.001`; damping `* 0.95`; `rotation.y = t * 0.05`; size `0.02`; mouse world = `(mouse.x * 3, mouse.y * 3, 0)`; BLACK ⇒ NormalBlending/opacity 1.0, WHITE ⇒ AdditiveBlending/opacity 0.8. Flat-array math replaces the original's per-particle `Vector3` allocations — behavior identical, garbage-free.

- [ ] **Step 1: Write `src/lib/three/SpecimenCanvas.svelte`**

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { buildLily, FILAMENT } from './lilyGeometry';
  import { mode } from '$lib/systems/mode.svelte';

  let {
    count = 50_000,
    ontips = (_: { x: number; y: number }[]) => {},
    ondegrade = () => {}
  } = $props<{
    count?: number;
    ontips?: (tips: { x: number; y: number }[]) => void;
    ondegrade?: () => void;
  }>();

  let host: HTMLDivElement;
  let disposed = false;

  // rite/transition API — parent calls via bind:this
  let api: {
    assemble: (ms?: number) => Promise<void>;
    finishAssembly: () => void;
    disintegrate: (dir: [number, number], ms?: number) => Promise<void>;
    condense: (dir: [number, number], ms?: number) => Promise<void>;
    setFocus: (fig: number | null) => void;
    flickerInvert: () => void;
  } | null = $state(null);
  export function getApi() { return api; }

  const INK = { black: 0xc8c8c4, white: 0x1c1c1a } as const;

  onMount(() => {
    let cleanup = () => {};
    (async () => {
      const THREE = await import('three');
      if (disposed) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, host.clientWidth / host.clientHeight, 0.1, 1000);
      camera.position.z = 5;
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(host.clientWidth, host.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      host.appendChild(renderer.domElement);

      const lily = buildLily(count);
      const n = lily.count;
      const pos = new Float32Array(lily.positions);           // live
      const orig = lily.positions;                            // rest pose
      const vel = new Float32Array(n * 3);
      const scatter = new Float32Array(n * 3);                // assembly start
      {
        const r = () => (Math.random() - 0.5) * 14;
        for (let k = 0; k < n * 3; k++) scatter[k] = r();
      }
      const colors = new Float32Array(n * 3);
      const focusMul = new Float32Array(n).fill(1);

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.02, vertexColors: true, transparent: true
      });
      const points = new THREE.Points(geometry, material);
      scene.add(points);

      const paintColors = () => {
        for (let k = 0; k < n; k++) {
          const g = lily.grays[k] * focusMul[k];
          colors[k * 3] = g; colors[k * 3 + 1] = g; colors[k * 3 + 2] = g;
        }
        geometry.attributes.color.needsUpdate = true;
      };
      const applyMode = () => {
        const dark = mode.current === 'black';
        material.blending = dark ? THREE.NormalBlending : THREE.AdditiveBlending;
        material.opacity = dark ? 1.0 : 0.8;
        material.color.setHex(dark ? INK.black : INK.white);
        material.needsUpdate = true;
      };
      paintColors();
      applyMode();
      $effect(() => { void mode.current; applyMode(); });

      const mouse = { x: 0, y: 0 };
      const onMove = (e: MouseEvent) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      };
      window.addEventListener('mousemove', onMove);

      // phase machine: 'assembling' | 'idle' | 'departing' | 'condensing' | 'hidden'
      let phase: string = 'idle';
      let phaseT0 = 0, phaseMs = 0, phaseDir: [number, number] = [0, 1];
      let phaseDone: (() => void) | null = null;
      const startPhase = (p: string, ms: number) =>
        new Promise<void>((res) => { phase = p; phaseMs = ms; phaseT0 = performance.now(); phaseDone = res; });

      api = {
        assemble: (ms = 1500) => startPhase('assembling', ms),
        finishAssembly: () => { pos.set(orig); vel.fill(0); phase = 'idle'; phaseDone?.(); phaseDone = null; },
        disintegrate: (dir, ms = 700) => { phaseDir = dir; return startPhase('departing', ms); },
        condense: (dir, ms = 700) => {
          phaseDir = dir;
          for (let k = 0; k < n; k++) {
            pos[k * 3] = orig[k * 3] - dir[0] * 8 + (Math.random() - 0.5) * 3;
            pos[k * 3 + 1] = orig[k * 3 + 1] - dir[1] * 8 + (Math.random() - 0.5) * 3;
            pos[k * 3 + 2] = orig[k * 3 + 2] + (Math.random() - 0.5) * 3;
          }
          material.opacity = mode.current === 'black' ? 1.0 : 0.8;
          return startPhase('condensing', ms);
        },
        setFocus: (fig) => {
          for (let k = 0; k < n; k++) {
            const f = lily.filament[k];
            focusMul[k] = fig == null ? 1 : f === fig ? 1.3 : f === FILAMENT.PETALS || f === FILAMENT.CORE ? 0.85 : 0.7;
          }
          paintColors();
        },
        flickerInvert: () => {
          const dark = mode.current === 'black';
          material.color.setHex(dark ? INK.white : INK.black);
          setTimeout(() => !disposed && applyMode(), 120);
        }
      };

      const clock = new THREE.Clock();
      const ease = (t: number) => 1 - Math.pow(1 - t, 3);
      let frames = 0, fpsT0 = performance.now(), degraded = false;

      const animate = () => {
        if (disposed) return;
        requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();
        const now = performance.now();

        if (phase === 'assembling' || phase === 'condensing') {
          const raw = Math.min((now - phaseT0) / phaseMs, 1);
          const from = phase === 'assembling' ? scatter : pos;
          for (let k = 0; k < n; k++) {
            const stag = phase === 'assembling' ? (lily.filament[k] % 6) * 0.06 : 0;
            const t = ease(Math.min(Math.max((raw - stag) / (1 - stag || 1), 0), 1));
            if (phase === 'assembling') {
              pos[k * 3] = scatter[k * 3] + (orig[k * 3] - scatter[k * 3]) * t;
              pos[k * 3 + 1] = scatter[k * 3 + 1] + (orig[k * 3 + 1] - scatter[k * 3 + 1]) * t;
              pos[k * 3 + 2] = scatter[k * 3 + 2] + (orig[k * 3 + 2] - scatter[k * 3 + 2]) * t;
            } else {
              pos[k * 3] += (orig[k * 3] - pos[k * 3]) * 0.12;
              pos[k * 3 + 1] += (orig[k * 3 + 1] - pos[k * 3 + 1]) * 0.12;
              pos[k * 3 + 2] += (orig[k * 3 + 2] - pos[k * 3 + 2]) * 0.12;
            }
          }
          if (raw >= 1) { if (phase === 'condensing') pos.set(orig); phase = 'idle'; phaseDone?.(); phaseDone = null; }
        } else if (phase === 'departing') {
          const raw = Math.min((now - phaseT0) / phaseMs, 1);
          for (let k = 0; k < n; k++) {
            const px = pos[k * 3], py = pos[k * 3 + 1];
            const d = Math.hypot(px, py) || 1;
            pos[k * 3] += (px / d) * 0.04 + phaseDir[0] * 0.12;
            pos[k * 3 + 1] += (py / d) * 0.04 + phaseDir[1] * 0.12;
            pos[k * 3 + 2] += 0.06; // toward camera
          }
          material.opacity *= 0.96;
          if (raw >= 1) { phase = 'hidden'; phaseDone?.(); phaseDone = null; }
        } else if (phase === 'idle') {
          // ── WovenLight physics, ported 1:1 (flat arrays) ──
          const mx = mouse.x * 3, my = mouse.y * 3;
          for (let k = 0; k < n; k++) {
            const ix = k * 3, iy = ix + 1, iz = ix + 2;
            const dx = pos[ix] - mx, dy = pos[iy] - my, dz = pos[iz];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (dist < 1.5 && dist > 0) {
              const force = (1.5 - dist) * 0.01;
              vel[ix] += (dx / dist) * force;
              vel[iy] += (dy / dist) * force;
              vel[iz] += (dz / dist) * force;
            }
            vel[ix] += (orig[ix] - pos[ix]) * 0.001;
            vel[iy] += (orig[iy] - pos[iy]) * 0.001;
            vel[iz] += (orig[iz] - pos[iz]) * 0.001;
            vel[ix] *= 0.95; vel[iy] *= 0.95; vel[iz] *= 0.95;
            pos[ix] += vel[ix]; pos[iy] += vel[iy]; pos[iz] += vel[iz];
          }
        }
        geometry.attributes.position.needsUpdate = true;

        points.rotation.y = elapsed * 0.05;                       // contract
        const s = 1 + 0.025 * Math.sin((elapsed * 2 * Math.PI) / 7); // breathing
        points.scale.setScalar(s);

        // project stamen tips → screen px for the callout layer
        const v = new THREE.Vector3();
        const tips = lily.tips.map(([x, y, z]) => {
          v.set(x * s, y * s, z * s).applyAxisAngle(new THREE.Vector3(0, 1, 0), points.rotation.y).project(camera);
          return { x: (v.x + 1) / 2 * host.clientWidth, y: (1 - v.y) / 2 * host.clientHeight };
        });
        ontips(tips);

        // fps watchdog (first 90 frames after idle begins)
        if (!degraded && phase === 'idle' && frames < 90) {
          frames++;
          if (frames === 90) {
            const fps = 90 / ((performance.now() - fpsT0) / 1000);
            if (fps < 40 && count <= 12_000) { degraded = true; ondegrade(); }
          }
        } else if (phase !== 'idle') { frames = 0; fpsT0 = performance.now(); }

        renderer.render(scene, camera);
      };
      animate();

      const onResize = () => {
        camera.aspect = host.clientWidth / host.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(host.clientWidth, host.clientHeight);
      };
      window.addEventListener('resize', onResize);

      cleanup = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('resize', onResize);
        geometry.dispose(); material.dispose(); renderer.dispose();
        host.contains(renderer.domElement) && host.removeChild(renderer.domElement);
      };
    })();
    return () => { disposed = true; cleanup(); };
  });
</script>

<div class="canvas-host" bind:this={host} aria-hidden="true"></div>

<style>
  .canvas-host { position: absolute; inset: 0; z-index: 0; }
</style>
```

- [ ] **Step 2: Temporary visual check.** Replace `src/routes/+page.svelte` stub:

```svelte
<script lang="ts">
  import SpecimenCanvas from '$lib/three/SpecimenCanvas.svelte';
</script>
<div style="position: relative; height: 100vh">
  <SpecimenCanvas />
</div>
```

Run `npm run dev`, open http://localhost:5173. Expected: breathing monochrome lily of particles, cursor repels particles which spring back, slow Y rotation. Note in the task log what you saw.

- [ ] **Step 3: Commit** — `git add -A; git commit -m "feat: SpecimenCanvas — WovenLight physics ported 1:1 onto the lily"`

### Task 14: Rings, Callouts, and the hero page

**Files:** Create: `src/lib/hero/Rings.svelte`, `src/lib/hero/Callouts.svelte` · Modify: `src/routes/+page.svelte`

- [ ] **Step 1: Write `src/lib/hero/Rings.svelte`** — three counter-rotating manifesto rings (mockup Rev.B geometry):

```svelte
<script lang="ts">
  import { rings } from '$lib/config/copy';
  let { slowed = false } = $props<{ slowed?: boolean }>();
  const radii = [282, 252, 224];
  const cls = ['spin slow', 'spin rev', 'spin'];
</script>

<svg class="rings" viewBox="0 0 660 660" class:slowed aria-hidden="true">
  <g transform="translate(330,330)">
    <defs>
      {#each radii as r, i}
        <path id="ring{i}" d="M0,{-r} A{r},{r} 0 1,1 -0.01,{-r}" />
      {/each}
    </defs>
    {#each rings as textLoop, i}
      <g class={cls[i]}>
        <text class="ringtext"><textPath href="#ring{i}">{textLoop.repeat(2)}</textPath></text>
      </g>
    {/each}
    <circle class="faint" r="296" stroke-dasharray="1 6" />
    <circle class="faint" r="208" />
  </g>
</svg>

<style>
  .rings { position: absolute; inset: 0; margin: auto; width: min(92vmin, 700px); height: min(92vmin, 700px); z-index: 1; pointer-events: none; }
  .ringtext { font-family: var(--font-mono); font-size: 9.5px; letter-spacing: 0.3em; fill: var(--ink-faint); text-transform: uppercase; }
  .faint { fill: none; stroke: var(--hairline-strong); stroke-width: 0.7; }
  .spin { transform-box: fill-box; transform-origin: center; animation: spin 140s linear infinite; }
  .spin.rev { animation: spinrev 100s linear infinite; }
  .spin.slow { animation-duration: 200s; }
  .slowed .spin { animation-play-state: paused; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes spinrev { to { transform: rotate(-360deg); } }
  @media (prefers-reduced-motion: reduce) { .spin { animation: none; } }
</style>
```

(Slowing is implemented as pause-on-focus — legibility beats simulation; note this refinement of spec §3 "slows".)

- [ ] **Step 2: Write `src/lib/hero/Callouts.svelte`** — real `<a>` labels tracking projected tips; Fig.00 is a button:

```svelte
<script lang="ts">
  import { ROUTES } from '$lib/config/routes';
  import { mode } from '$lib/systems/mode.svelte';
  let { tips = [], onfocus = (_: number | null) => {}, onnavigate = (_: string) => {}, oninvert = () => {} } =
    $props<{
      tips?: { x: number; y: number }[];
      onfocus?: (fig: number | null) => void;
      onnavigate?: (path: string) => void;
      oninvert?: () => void;
    }>();
  let focusedFig: number | null = $state(null);
  let armedFig: number | null = $state(null); // mobile two-tap

  const label = (fig: number) => (fig === 0 ? 'Fig.00 — Invert ⇄' : `Fig.0${fig} — ${ROUTES[fig - 1].short}`);
  const off = (fig: number) => {
    const t = tips[fig];
    if (!t) return '';
    const dx = t.x > (typeof innerWidth !== 'undefined' ? innerWidth : 1000) / 2 ? 14 : -14;
    return `left: ${t.x + dx}px; top: ${t.y - 10}px; ${dx < 0 ? 'transform: translateX(-100%);' : ''}`;
  };
  function enter(fig: number) { focusedFig = fig; onfocus(fig === 0 ? null : fig); }
  function leave() { focusedFig = null; armedFig = null; onfocus(null); }
  function activate(e: Event, fig: number) {
    e.preventDefault();
    if (fig === 0) { oninvert(); return; }
    // touch: first tap arms, second commits
    if (matchMedia('(pointer: coarse)').matches && armedFig !== fig) { armedFig = fig; enter(fig); return; }
    onnavigate(ROUTES[fig - 1].path);
  }
</script>

<div class="callouts">
  {#each [1, 2, 3, 4, 5] as fig}
    <a
      href={ROUTES[fig - 1].path}
      class="callout label"
      class:hot={focusedFig === fig || armedFig === fig}
      style={off(fig)}
      onmouseenter={() => enter(fig)}
      onmouseleave={leave}
      onclick={(e) => activate(e, fig)}>{label(fig)}</a>
  {/each}
  <button
    class="callout label inverter"
    class:hot={focusedFig === 0}
    style={off(0)}
    onmouseenter={() => enter(0)}
    onmouseleave={leave}
    onclick={(e) => activate(e, 0)}
    aria-label="Invert to {mode.current === 'black' ? 'white' : 'black'} mode">Fig.00 — Invert ⇄</button>
</div>

<style>
  .callouts { position: absolute; inset: 0; z-index: 2; }
  .callout {
    position: absolute; white-space: nowrap; padding: 10px 12px; /* enlarged hit area */
    color: var(--ink-faint); background: transparent; border: none; cursor: pointer;
    font-family: var(--font-mono); font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.14em;
  }
  .callout.hot, .callout:hover, .callout:focus-visible { color: var(--ink-strong); }
  .inverter { font-style: italic; }
</style>
```

- [ ] **Step 3: Write the hero page `src/routes/+page.svelte`** (rite comes in Task 15 — for now assemble immediately):

```svelte
<script lang="ts">
  import { goto } from '$app/navigation';
  import SpecimenCanvas from '$lib/three/SpecimenCanvas.svelte';
  import Rings from '$lib/hero/Rings.svelte';
  import Callouts from '$lib/hero/Callouts.svelte';
  import HeaderRows from '$lib/chrome/HeaderRows.svelte';
  import FooterStrip from '$lib/chrome/FooterStrip.svelte';
  import Seo from '$lib/chrome/Seo.svelte';
  import StaticPlate from '$lib/hero/StaticPlate.svelte';
  import { mode } from '$lib/systems/mode.svelte';
  import { prefersReducedMotion } from '$lib/systems/prefs';
  import { site } from '$lib/config/site';
  import { onMount } from 'svelte';

  let canvas: SpecimenCanvas | undefined = $state();
  let tips: { x: number; y: number }[] = $state([]);
  let focused: number | null = $state(null);
  let degraded = $state(false);
  let reduced = $state(false);
  onMount(() => { reduced = prefersReducedMotion(); });

  const isCoarse = () => typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches;
</script>

<Seo title={site.name} description="Jhavonei — creative technologist. A catalogue of instruments, field notes, and correspondence, grown in the dark." />

<div class="stage">
  {#if reduced || degraded}
    <StaticPlate ontips={(t) => (tips = t)} />
  {:else}
    <SpecimenCanvas
      bind:this={canvas}
      count={isCoarse() ? 12_000 : 50_000}
      ontips={(t) => (tips = t)}
      ondegrade={() => (degraded = true)} />
  {/if}
  <Rings slowed={focused != null} />
  <Callouts
    {tips}
    onfocus={(f) => { focused = f; canvas?.getApi()?.setFocus(f); }}
    onnavigate={(path) => goto(path)}
    oninvert={() => mode.toggle()} />
  <div class="chrome top"><HeaderRows doc="DOC.001" figLabel="The Specimen" /></div>
  <div class="chrome bottom"><FooterStrip /></div>
</div>

<style>
  .stage { position: relative; height: 100vh; overflow: hidden; }
  .chrome { position: absolute; left: 0; right: 0; z-index: 3; padding: 20px 34px; }
  .chrome.top { top: 0; }
  .chrome.bottom { bottom: 0; padding-top: 0; }
</style>
```

`StaticPlate` doesn't exist yet — create a minimal placeholder now (fleshed out in Task 23), `src/lib/hero/StaticPlate.svelte`:

```svelte
<script lang="ts">
  let { ontips = (_: { x: number; y: number }[]) => {} } = $props();
  import { onMount } from 'svelte';
  import { STAMEN_DIRS, STAMEN_LEN } from '$lib/three/anatomy';
  onMount(() => {
    const push = () => {
      const cx = innerWidth / 2, cy = innerHeight / 2, sc = Math.min(innerWidth, innerHeight) * 0.18;
      ontips(STAMEN_DIRS.map(([x, y]) => ({ x: cx + x * STAMEN_LEN * sc, y: cy - y * STAMEN_LEN * sc })));
    };
    push();
    addEventListener('resize', push);
    return () => removeEventListener('resize', push);
  });
</script>
<div class="plate" aria-hidden="true"></div>
<style>.plate { position: absolute; inset: 0; }</style>
```

- [ ] **Step 4: Verify** — `npm run dev`: lily + rings + labels tracking stamen tips; hover brightens a filament, pauses rings; click navigates (target pages 404 until Phase 4 — expected); Fig.00 inverts to WHITE. `npx vite build` succeeds.

- [ ] **Step 5: Commit** — `git add -A; git commit -m "feat: hero — rings, tracked callouts, mode inverter"`

### Task 15: The assembly rite

**Files:** Create: `src/lib/hero/AssemblyRite.svelte` · Modify: `src/routes/+page.svelte`

- [ ] **Step 1: Write `src/lib/hero/AssemblyRite.svelte`** — phase choreographer; renders nothing itself:

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { hasVisited, markVisited, prefersReducedMotion } from '$lib/systems/prefs';

  export type RitePhase = 'paper' | 'chrome' | 'particles' | 'rings' | 'callouts' | 'idle';

  let { onphase = (_: RitePhase) => {}, assemble = async (_ms: number) => {}, finish = () => {} } =
    $props<{
      onphase?: (p: RitePhase) => void;
      assemble?: (ms: number) => Promise<void>;
      finish?: () => void;
    }>();

  let done = false;
  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

  async function run() {
    const quick = hasVisited();
    const t = (full: number, abbrev: number) => (quick ? abbrev : full);
    onphase('paper'); await wait(t(300, 100));
    if (done) return;
    onphase('chrome'); await wait(t(600, 150));
    if (done) return;
    onphase('particles'); await assemble(t(1500, 600));
    if (done) return;
    onphase('rings'); await wait(t(500, 100));
    if (done) return;
    onphase('callouts'); await wait(t(600, 100));
    if (done) return;
    onphase('idle');
    markVisited();
  }

  function skip() {
    if (done) return;
    done = true;
    finish();
    onphase('idle');
    markVisited();
  }

  onMount(() => {
    if (prefersReducedMotion()) { skip(); return; }
    run().then(() => (done = true));
    const onKey = () => skip();
    const onClick = () => skip();
    addEventListener('keydown', onKey);
    addEventListener('pointerdown', onClick, { capture: true });
    return () => { done = true; removeEventListener('keydown', onKey); removeEventListener('pointerdown', onClick, { capture: true } as any); };
  });
</script>
```

- [ ] **Step 2: Wire into `src/routes/+page.svelte`.** Add to the script block:

```ts
import AssemblyRite, { type RitePhase } from '$lib/hero/AssemblyRite.svelte';
let rite: RitePhase = $state('paper');
const visible = (p: RitePhase[]) => p.includes(rite) || rite === 'idle';
```

In the markup, wrap the stage children with phase gates and add the rite (canvas mounts hidden until 'particles'):

```svelte
<div class="stage" class:veiled={rite === 'paper'}>
  <AssemblyRite
    onphase={(p) => (rite = p)}
    assemble={(ms) => canvas?.getApi()?.assemble(ms) ?? Promise.resolve()}
    finish={() => canvas?.getApi()?.finishAssembly()} />
  {#if reduced || degraded}
    <StaticPlate ontips={(t) => (tips = t)} />
  {:else}
    <div class:hidden={!visible(['particles', 'rings', 'callouts'])}>
      <SpecimenCanvas ... (unchanged props) />
    </div>
  {/if}
  {#if visible(['rings', 'callouts'])}<Rings slowed={focused != null} />{/if}
  {#if visible(['callouts'])}<Callouts ... (unchanged props) />{/if}
  {#if visible(['chrome', 'particles', 'rings', 'callouts'])}
    <div class="chrome top"><HeaderRows doc="DOC.001" figLabel="The Specimen" /></div>
    <div class="chrome bottom"><FooterStrip /></div>
  {/if}
</div>
```

Add styles:

```css
.veiled { opacity: 0; }
.stage { transition: opacity 0.3s var(--ease-reveal); }
.hidden { visibility: hidden; }
```

Also call `canvas.getApi()?.assemble(...)` only once the canvas exists: the rite's `assemble` callback already guards with `?? Promise.resolve()`; additionally change SpecimenCanvas mount so particles start at `scatter` positions when an `startScattered` prop is true. Add to SpecimenCanvas props: `startScattered = false`, and after buffers are built: `if (startScattered) pos.set(scatter);` — pass `startScattered={true}` from the hero page.

- [ ] **Step 3: Verify** — `npm run dev` with DevTools → Application → clear `jhv:visited`. Reload: paper → chrome rows → particle assembly → rings → callouts. Click mid-rite skips to idle. Reload again: abbreviated (~1s). **Step 4: Commit** — `git add -A; git commit -m "feat: assembly rite (skippable, abbreviated on return)"`

### Task 16: Fig.00 — the eclipse wipe

**Files:** Create: `src/lib/hero/EclipseDisc.svelte` · Modify: `src/routes/+page.svelte`

- [ ] **Step 1: Write `src/lib/hero/EclipseDisc.svelte`**

```svelte
<script lang="ts">
  import { mode } from '$lib/systems/mode.svelte';
  let running = $state(false);
  let targetPaper = $state('#e9e7e2');

  /** Expand a disc of the opposite paper tone from center, flip mode at apex, fade disc. */
  export async function eclipse(canvasFlicker?: () => void) {
    if (running) return;
    targetPaper = mode.current === 'black' ? '#e9e7e2' : '#0a0a0a';
    running = true;
    canvasFlicker?.();
    await new Promise((r) => setTimeout(r, 450)); // disc mid-expansion
    mode.toggle();
    await new Promise((r) => setTimeout(r, 450));
    running = false;
  }
</script>

{#if running}
  <div class="disc" style="--target: {targetPaper}" aria-hidden="true"></div>
{/if}

<style>
  .disc {
    position: fixed; inset: 0; z-index: 40; pointer-events: none;
    background: radial-gradient(circle at 50% 50%, var(--target) 0%, var(--target) var(--r, 0%), transparent var(--r, 0%));
    animation: grow 0.9s var(--ease-wipe) forwards;
  }
  @keyframes grow { from { --r: 0%; } to { --r: 150%; } }
  /* @property registration for animatable --r */
</style>

<svelte:head>
  <style>
    @property --r { syntax: '<percentage>'; inherits: false; initial-value: 0%; }
  </style>
</svelte:head>
```

(If `@property` is unsupported the disc simply appears without the sweep and the 0.6s token transition still carries the change — acceptable degradation.)

- [ ] **Step 2: Wire into the hero page**: add `let eclipseRef: EclipseDisc | undefined = $state();`, render `<EclipseDisc bind:this={eclipseRef} />` inside the stage, and change the Callouts `oninvert` to:

```ts
oninvert={() => eclipseRef?.eclipse(() => canvas?.getApi()?.flickerInvert())}
```

Also wire the FooterStrip Fig.00 on the hero page the same way: pass nothing — FooterStrip's own `mode.toggle()` stays as the plain fallback used on interior pages; on the hero the theatrical path is the callout.

- [ ] **Step 3: Verify** — click Fig.00: disc sweeps from lily center, world inverts to WHITE mid-sweep, particles/type/paper all swap; persists across reload. **Step 4: Commit** — `git add -A; git commit -m "feat: eclipse wipe mode inversion"`

---

## Phase 4 — The documents

### Task 17: /work — the Ledger

**Files:** Create: `src/lib/doc/Ledger.svelte`, `src/lib/doc/LedgerRow.svelte`, `src/routes/work/+page.svelte`

- [ ] **Step 1: Write `src/lib/doc/LedgerRow.svelte`** — one row + drop-down tab panel:

```svelte
<script lang="ts">
  import { slide } from 'svelte/transition';
  import type { WorkMeta } from '$lib/content';
  let { entry, open = false, ontoggle = () => {} } = $props<{
    entry: WorkMeta; open?: boolean; ontoggle?: () => void;
  }>();
  const anchor = entry.index.replace('.', '').toLowerCase(); // V.02 → v02
</script>

<div class="lrow-wrap" id={anchor}>
  <button class="lrow" aria-expanded={open} onclick={ontoggle}>
    <span class="v">{entry.index}</span>
    <span class="t">{entry.title}</span>
    <span class="c">Class: {entry.class}</span>
    <span class="y">{entry.year}</span>
    <span class="s" class:live={entry.status === 'live'}>{entry.status}</span>
  </button>
  {#if open}
    <div class="ldetail" transition:slide={{ duration: 350, easing: (t) => 1 - Math.pow(1 - t, 3) }}>
      <div>
        <p class="blurb">{entry.blurb}</p>
        <div class="meta label">
          Stack — {entry.stack.join(' · ')}<br />
          Role — {entry.role}<br />
          {#if entry.links?.exhibit}<a href={entry.links.exhibit}>Exhibit ↗</a> · {/if}
          {#if entry.links?.source}<a href={entry.links.source}>Source ↗</a>{/if}
        </div>
      </div>
      <div class="thumb">
        <span class="label">{entry.placeholder ? 'Specimen pending verification' : `Exhibit ${entry.index}`}</span>
      </div>
    </div>
  {/if}
</div>

<style>
  .lrow {
    display: grid; grid-template-columns: 64px 1fr 200px 70px 90px; gap: 14px;
    width: 100%; padding: 13px 6px; border: none; border-bottom: 1px solid var(--hairline);
    background: transparent; color: inherit; font: inherit; text-align: left; cursor: pointer;
    text-transform: uppercase; letter-spacing: 0.06em; align-items: baseline;
  }
  .lrow:hover, .lrow[aria-expanded='true'] { background: rgba(128, 128, 128, 0.06); }
  .v { color: var(--ink-faint); }
  .t { color: var(--ink-strong); font-weight: 500; letter-spacing: 0.1em; }
  .c, .y { color: var(--ink-faint); font-size: 11px; }
  .s { font-size: 10px; letter-spacing: 0.16em; text-align: right; color: var(--ink-faint); }
  .s.live { color: var(--ink); }
  .s.live::before { content: '● '; font-size: 8px; }
  .ldetail {
    display: grid; grid-template-columns: 1.4fr 1fr; gap: 24px;
    padding: 6px 6px 24px 84px; border-bottom: 1px solid var(--hairline);
  }
  .blurb { font-weight: 300; font-size: 12px; max-width: 52ch; }
  .meta { margin-top: 10px; line-height: 2; }
  .thumb {
    border: 1px solid var(--hairline-strong); min-height: 120px; position: relative;
    background: repeating-linear-gradient(45deg, transparent, transparent 6px, var(--hairline) 6px, var(--hairline) 7px);
  }
  .thumb .label { position: absolute; bottom: 6px; right: 8px; font-size: 9px; }
  @media (max-width: 760px) {
    .lrow { grid-template-columns: 52px 1fr 70px; }
    .c, .s { display: none; }
    .ldetail { grid-template-columns: 1fr; padding-left: 6px; }
  }
</style>
```

- [ ] **Step 2: Write `src/lib/doc/Ledger.svelte`** — list + sealed slots + URL-hash sync:

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import type { WorkMeta } from '$lib/content';
  import { sealedAfter } from '$lib/content';
  import LedgerRow from './LedgerRow.svelte';
  let { entries, sealedSlots = 2 } = $props<{ entries: WorkMeta[]; sealedSlots?: number }>();
  let openIndex: string | null = $state(null);
  const sealed = sealedAfter(entries[entries.length - 1]?.index ?? 'V.00', sealedSlots);
  const toAnchor = (i: string) => i.replace('.', '').toLowerCase();

  onMount(() => {
    const fromHash = location.hash.slice(1); // "v02"
    const hit = entries.find((e) => toAnchor(e.index) === fromHash);
    if (hit) { openIndex = hit.index; document.getElementById(fromHash)?.scrollIntoView(); }
  });
  function toggle(e: WorkMeta) {
    openIndex = openIndex === e.index ? null : e.index;
    history.replaceState(null, '', openIndex ? `#${toAnchor(e.index)}` : location.pathname);
  }
  function onKeydown(ev: KeyboardEvent) { if (ev.key === 'Escape') openIndex = null; }
</script>

<svelte:window onkeydown={onKeydown} />

<div class="ledger" role="list">
  {#each entries as entry (entry.index)}
    <LedgerRow {entry} open={openIndex === entry.index} ontoggle={() => toggle(entry)} />
  {/each}
  {#each sealed as idx}
    <div class="sealedrow" role="listitem">
      <span class="v">{idx}</span>
      <span class="t">— Specimen pending —</span>
      <span class="s">Sealed</span>
    </div>
  {/each}
</div>

<style>
  .ledger { border-top: 1px solid var(--hairline-strong); }
  .sealedrow {
    display: grid; grid-template-columns: 64px 1fr 90px; gap: 14px;
    padding: 13px 6px; border-bottom: 1px dashed var(--hairline);
    text-transform: uppercase; letter-spacing: 0.06em;
  }
  .sealedrow .v, .sealedrow .s { color: var(--ink-faint); font-size: 11px; }
  .sealedrow .t { color: var(--ink-faint); font-weight: 300; }
  .sealedrow .s { text-align: right; letter-spacing: 0.16em; }
</style>
```

- [ ] **Step 3: Write `src/routes/work/+page.svelte`**

```svelte
<script lang="ts">
  import DocumentPage from '$lib/doc/DocumentPage.svelte';
  import Ledger from '$lib/doc/Ledger.svelte';
  import { ROUTES } from '$lib/config/routes';
  import { workEntries } from '$lib/content';
  const route = ROUTES[0];
  const live = workEntries.filter((w) => w.status === 'live').length;
</script>

<DocumentPage
  {route}
  subtitle={`Catalogue of built things · ${workEntries.length} entries · 2 slots pending`}
  description="Catalogued projects of Jhavonei — instruments, experiments, and tooling, indexed and pressed into the record.">
  <Ledger entries={workEntries} />
</DocumentPage>
```

- [ ] **Step 4: Verify** — `npm run dev` → `/work`: ledger renders, row click drops the tab open (one at a time), hash updates to `#v02`, reload with hash reopens the row, Escape closes, sealed V.05/V.06 shown. `npx vite build` passes.

- [ ] **Step 5: Commit** — `git add -A; git commit -m "feat: work ledger with drop-down tabs and hash deep-links"`

### Task 18: /notes — index + long-form documents

**Files:** Create: `src/routes/notes/+page.svelte`, `src/routes/notes/[slug]/+page.ts`, `src/routes/notes/[slug]/+page.svelte`

- [ ] **Step 1: Write `src/routes/notes/+page.svelte`**

```svelte
<script lang="ts">
  import DocumentPage from '$lib/doc/DocumentPage.svelte';
  import { ROUTES } from '$lib/config/routes';
  import { noteEntries, sealedAfter } from '$lib/content';
  const route = ROUTES[1];
  const sealed = sealedAfter(noteEntries[noteEntries.length - 1]?.index ?? 'N.000', 2);
</script>

<DocumentPage
  {route}
  subtitle={`Research log · ${noteEntries.length} entries`}
  description="Field notes and research observations — essays from the workbench, taken in low light.">
  <div class="nledger">
    {#each noteEntries as n (n.index)}
      <a class="nrow" href={`/notes/${n.slug}`}>
        <span class="v">{n.index}</span>
        <span class="t">{n.title}</span>
        <span class="c">Field: {n.field}</span>
        <span class="y">{n.date}</span>
      </a>
    {/each}
    {#each sealed as idx}
      <div class="nrow sealed"><span class="v">{idx}</span><span class="t">— Entry pending —</span><span class="c">Sealed</span></div>
    {/each}
  </div>
</DocumentPage>

<style>
  .nledger { border-top: 1px solid var(--hairline-strong); }
  .nrow {
    display: grid; grid-template-columns: 64px 1fr 180px 110px; gap: 14px;
    padding: 13px 6px; border-bottom: 1px solid var(--hairline);
    text-transform: uppercase; letter-spacing: 0.06em; color: inherit;
  }
  .nrow:hover { background: rgba(128, 128, 128, 0.06); }
  .nrow .v, .nrow .c, .nrow .y { color: var(--ink-faint); font-size: 11px; }
  .nrow .t { color: var(--ink-strong); font-weight: 500; letter-spacing: 0.1em; }
  .nrow.sealed { border-bottom-style: dashed; grid-template-columns: 64px 1fr 110px; }
  .nrow.sealed .t { color: var(--ink-faint); font-weight: 300; }
  @media (max-width: 700px) { .nrow { grid-template-columns: 52px 1fr; } .nrow .c, .nrow .y { display: none; } }
</style>
```

- [ ] **Step 2: Write `src/routes/notes/[slug]/+page.ts`**

```ts
import { error } from '@sveltejs/kit';
import { noteEntries } from '$lib/content';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => noteEntries.map((n) => ({ slug: n.slug }));

export const load: PageLoad = async ({ params }) => {
  const meta = noteEntries.find((n) => n.slug === params.slug);
  if (!meta) throw error(404, 'Entry not found');
  const mod = await import(`../../../content/notes/${params.slug}.md`);
  return { meta, content: mod.default };
};
```

- [ ] **Step 3: Write `src/routes/notes/[slug]/+page.svelte`**

```svelte
<script lang="ts">
  import DocumentPage from '$lib/doc/DocumentPage.svelte';
  import { ROUTES } from '$lib/config/routes';
  let { data } = $props();
  const route = ROUTES[1];
</script>

<DocumentPage
  {route}
  subtitle={`${data.meta.index} · Field: ${data.meta.field} · ${data.meta.date}`}
  description={`Field note ${data.meta.index} — ${data.meta.title}.`}>
  <article class="note">
    <h2 class="display">{data.meta.title}</h2>
    <data.content />
  </article>
</DocumentPage>

<style>
  .note { max-width: 68ch; }
  .note h2 { font-size: clamp(24px, 4vw, 34px); margin: 8px 0 22px; }
  .note :global(p) { font-weight: 300; margin-bottom: 1.2em; }
  .note :global(h2), .note :global(h3) {
    font-family: var(--font-display); text-transform: uppercase; letter-spacing: 0.12em;
    color: var(--ink-strong); margin: 1.6em 0 0.6em;
  }
  .note :global(a) { border-bottom: 1px solid var(--hairline-strong); }
  .note :global(blockquote) { border-left: 1px solid var(--hairline-strong); padding-left: 16px; color: var(--ink-faint); }
  .note :global(code) { border: 1px solid var(--hairline); padding: 0 4px; font-size: 12px; }
</style>
```

- [ ] **Step 4: Verify** — `/notes` lists N.001 + sealed; clicking opens the long-form page with rendered markdown. `npx vite build` prerenders `/notes/n001-building-the-specimen`.

- [ ] **Step 5: Commit** — `git add -A; git commit -m "feat: field notes index + long-form note documents"`

### Task 19: /author — the aura is the portrait

**Files:** Create: `src/routes/author/+page.svelte`

- [ ] **Step 1: Write `src/routes/author/+page.svelte`**

```svelte
<script lang="ts">
  import DocumentPage from '$lib/doc/DocumentPage.svelte';
  import Belladonna from '$lib/plants/Belladonna.svelte';
  import { ROUTES } from '$lib/config/routes';
  import { site } from '$lib/config/site';
  import { bio, traits } from '$lib/config/copy';
  const route = ROUTES[2];
</script>

<DocumentPage
  {route}
  subtitle="Specimen data · unphotographed"
  description="The author — creative technologist. Classification, habitat, and constitution of the specimen behind the catalogue.">
  <div class="aura">
    <div class="portrait">
      <svg class="aurang" viewBox="0 0 400 400" aria-hidden="true">
        <defs><path id="aring" d="M200,30 A170,170 0 1,1 199.99,30" /></defs>
        <g class="spin">
          <text><textPath href="#aring">{(site.identityLine + ' · ').repeat(4)}</textPath></text>
        </g>
      </svg>
      <div class="plantbox"><Belladonna size={200} /></div>
      {#each traits as t, i}
        <span class="trait label" style="top: {[8, 26, 50, 72, 88][i]}%; {i % 2 ? 'right: -4%' : 'left: -4%'}">{t}</span>
      {/each}
    </div>
    <div class="data">
      <table class="specdata">
        <tbody>
          <tr><th class="label">Classification</th><td>CREATIVE TECHNOLOGIST</td></tr>
          <tr><th class="label">Habitat</th><td>{site.author.habitat}</td></tr>
          <tr><th class="label">Active since</th><td>{site.author.activeSince}</td></tr>
          <tr><th class="label">Correspondence</th><td><a href="/correspondence">Fig.04 ⟶</a></td></tr>
        </tbody>
      </table>
      {#each bio as p}<p class="biop">{p}</p>{/each}
    </div>
  </div>
</DocumentPage>

<style>
  .aura { display: grid; grid-template-columns: 1fr 1.2fr; gap: 44px; align-items: start; }
  .portrait { position: relative; aspect-ratio: 1; max-width: 420px; }
  .aurang { position: absolute; inset: 0; width: 100%; height: 100%; }
  .aurang text { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.32em; fill: var(--ink-faint); }
  .spin { transform-box: fill-box; transform-origin: center; animation: spin 160s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .plantbox { position: absolute; inset: 0; display: grid; place-items: center; }
  .trait { position: absolute; white-space: nowrap; }
  .specdata { border-collapse: collapse; margin-bottom: 22px; width: 100%; }
  .specdata th, .specdata td { border-bottom: 1px solid var(--hairline); padding: 8px 14px 8px 0; text-align: left; }
  .specdata td { color: var(--ink-strong); letter-spacing: 0.08em; }
  .biop { font-weight: 300; max-width: 58ch; margin-bottom: 1.1em; }
  @media (max-width: 800px) { .aura { grid-template-columns: 1fr; } .trait { display: none; } }
  @media (prefers-reduced-motion: reduce) { .spin { animation: none; } }
</style>
```

- [ ] **Step 2: Verify + commit** — `/author` shows belladonna ringed by the identity line with trait callouts, spec table legible. `git add -A; git commit -m "feat: author page — the aura is the portrait"`

### Task 20: /correspondence

**Files:** Create: `src/routes/correspondence/+page.svelte`

- [ ] **Step 1: Write `src/routes/correspondence/+page.svelte`**

```svelte
<script lang="ts">
  import DocumentPage from '$lib/doc/DocumentPage.svelte';
  import Stamp from '$lib/chrome/Stamp.svelte';
  import { ROUTES } from '$lib/config/routes';
  import { site } from '$lib/config/site';
  const route = ROUTES[3];
  let sending = $state(false);
  let result: 'ok' | 'fail' | null = $state(null);

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    if (!site.formspreeEndpoint) return;
    sending = true; result = null;
    try {
      const res = await fetch(site.formspreeEndpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(e.target as HTMLFormElement)
      });
      result = res.ok ? 'ok' : 'fail';
      if (res.ok) (e.target as HTMLFormElement).reset();
    } catch { result = 'fail'; }
    sending = false;
  }
</script>

<DocumentPage
  {route}
  subtitle="Channels · all monitored"
  description="Correspondence with Jhavonei — email, transmission form, and the stamped index of socials. Available all over the world.">
  <div class="channels">
    <div class="row"><span>Email on</span><a class="mid strong" href={`mailto:${site.email}`}>{site.email.toUpperCase()}</a><span></span></div>
    <div class="row"><span>Availability</span><span class="mid">{site.availabilityLine}</span><span></span></div>
    {#each site.socials as s}
      <div class="row sub"><span>{s.name}</span><a class="mid" href={s.url} rel="me noopener" target="_blank">{s.url.replace('https://', '').toUpperCase()} ↗</a><span></span></div>
    {/each}
  </div>

  {#if site.formspreeEndpoint}
    <form class="transmit" onsubmit={submit} aria-label="Transmission form">
      <h2 class="label">Transmit below</h2>
      <label class="frow"><span class="label">From (email)</span><input name="email" type="email" required /></label>
      <label class="frow"><span class="label">Subject</span><input name="subject" type="text" required /></label>
      <label class="frow"><span class="label">Message</span><textarea name="message" rows="6" required></textarea></label>
      <button class="seal" disabled={sending}>{sending ? 'Transmitting…' : 'Transmit'}</button>
      <div aria-live="polite" class="result">
        {#if result === 'ok'}<Stamp>Transmission received — expect correspondence</Stamp>{/if}
        {#if result === 'fail'}<span class="label">Transmission failed — use <a href={`mailto:${site.email}`}>{site.email}</a></span>{/if}
      </div>
    </form>
  {:else}
    <p class="label">The transmission form is sealed until its relay is configured — write to <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
  {/if}
</DocumentPage>

<style>
  .channels { margin-bottom: 34px; }
  .channels .strong { color: var(--ink-strong); }
  .transmit { max-width: 560px; display: grid; gap: 16px; }
  .frow { display: grid; gap: 4px; }
  input, textarea {
    background: transparent; border: none; border-bottom: 1px solid var(--hairline-strong);
    color: var(--ink-strong); font-family: var(--font-mono); font-size: 13px; padding: 6px 2px;
  }
  input:focus, textarea:focus { outline: none; border-bottom-color: var(--accent); }
  .transmit .seal { justify-self: start; }
  .result { min-height: 28px; }
</style>
```

- [ ] **Step 2: Verify + commit** — with empty endpoint the sealed-form line shows and mailto works; set a dummy endpoint locally to see the form render. `git add -A; git commit -m "feat: correspondence — channels, transmission form, availability"`

### Task 21: GitHub client (TDD)

**Files:** Create: `src/lib/repository/githubClient.ts` · Test: `src/lib/repository/githubClient.test.ts`

- [ ] **Step 1: Write failing test `src/lib/repository/githubClient.test.ts`**

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cachedJson, getProfile, getRepos, getContributions, contributionLevels } from './githubClient';

const ok = (data: unknown) => Promise.resolve(new Response(JSON.stringify(data), { status: 200 }));

describe('githubClient', () => {
  beforeEach(() => sessionStorage.clear());

  it('cachedJson caches by key with TTL', async () => {
    const fetcher = vi.fn(() => ok({ a: 1 }));
    expect(await cachedJson('k1', 'https://x', fetcher)).toEqual({ a: 1 });
    expect(await cachedJson('k1', 'https://x', fetcher)).toEqual({ a: 1 });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('cachedJson throws on http error without caching', async () => {
    const bad = vi.fn(() => Promise.resolve(new Response('nope', { status: 500 })));
    await expect(cachedJson('k2', 'https://x', bad)).rejects.toThrow();
    expect(sessionStorage.getItem('jhv:gh:k2')).toBeNull();
  });

  it('getProfile/getRepos/getContributions map fields', async () => {
    const profile = await getProfile('jhavonei', () =>
      ok({ login: 'jhavonei', avatar_url: 'a', created_at: '2026-01-01T00:00:00Z', followers: 2, public_repos: 3 }));
    expect(profile.login).toBe('jhavonei');
    const repos = await getRepos('jhavonei', () =>
      ok([{ name: 'r', language: 'TypeScript', stargazers_count: 1, pushed_at: '2026-07-01T00:00:00Z', html_url: 'u', fork: false }]));
    expect(repos[0].name).toBe('r');
    const days = await getContributions('jhavonei', () =>
      ok({ total: { '2026': 9 }, contributions: [{ date: '2026-07-01', count: 3, level: 2 }] }));
    expect(days[0]).toEqual({ date: '2026-07-01', count: 3, level: 2 });
  });

  it('contributionLevels maps counts to radius steps 0..4', () => {
    expect(contributionLevels(0)).toBe(0);
    expect(contributionLevels(1)).toBe(1);
    expect(contributionLevels(4)).toBe(2);
    expect(contributionLevels(9)).toBe(3);
    expect(contributionLevels(20)).toBe(4);
  });
});
```

- [ ] **Step 2: Run** `npx vitest run src/lib/repository` — Expected: FAIL.

- [ ] **Step 3: Write `src/lib/repository/githubClient.ts`**

```ts
export interface GhProfile { login: string; avatar_url: string; created_at: string; followers: number; public_repos: number; }
export interface GhRepo { name: string; language: string | null; stargazers_count: number; pushed_at: string; html_url: string; }
export interface ContribDay { date: string; count: number; level: number; }

type Fetcher = (url: string) => Promise<Response>;
const TTL = 60 * 60 * 1000;

export async function cachedJson<T>(key: string, url: string, fetcher: Fetcher = fetch): Promise<T> {
  const sk = `jhv:gh:${key}`;
  try {
    const hit = sessionStorage.getItem(sk);
    if (hit) {
      const { t, data } = JSON.parse(hit);
      if (Date.now() - t < TTL) return data as T;
    }
  } catch { /* storage unavailable — fall through to network */ }
  const res = await fetcher(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const data = (await res.json()) as T;
  try { sessionStorage.setItem(sk, JSON.stringify({ t: Date.now(), data })); } catch { /* ignore */ }
  return data;
}

export const getProfile = (handle: string, f?: Fetcher) =>
  cachedJson<GhProfile>(`profile:${handle}`, `https://api.github.com/users/${handle}`, f);

export const getRepos = async (handle: string, f?: Fetcher) => {
  const raw = await cachedJson<(GhRepo & { fork: boolean })[]>(
    `repos:${handle}`, `https://api.github.com/users/${handle}/repos?sort=pushed&per_page=30`, f);
  return raw.filter((r) => !r.fork);
};

export const getContributions = async (handle: string, f?: Fetcher) => {
  const raw = await cachedJson<{ contributions: ContribDay[] }>(
    `contrib:${handle}`, `https://github-contributions-api.jogruber.de/v4/${handle}?y=last`, f);
  return raw.contributions;
};

/** Count → dot radius step (0..4) for the dot-matrix. */
export const contributionLevels = (count: number): number =>
  count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 12 ? 3 : 4;
```

- [ ] **Step 4: Run** — Expected: PASS (4 tests). **Step 5: Commit** — `git add -A; git commit -m "feat: github client (cached, injectable, level mapping)"`

### Task 22: /repository — specimen ID card

**Files:** Create: `src/lib/repository/ProfileCard.svelte`, `src/lib/repository/DotMatrix.svelte`, `src/lib/repository/RepoLedger.svelte`, `src/routes/repository/+page.svelte`

- [ ] **Step 1: Write `src/lib/repository/ProfileCard.svelte`**

```svelte
<script lang="ts">
  import type { GhProfile } from './githubClient';
  let { profile } = $props<{ profile: GhProfile }>();
  const joined = new Date(profile.created_at).getFullYear();
</script>

<div class="card">
  <div class="halftone"><img src={profile.avatar_url} alt="" loading="lazy" /></div>
  <div class="fields">
    <div class="row sub"><span class="label">Handle</span><span>@{profile.login}</span></div>
    <div class="row sub"><span class="label">Catalogued</span><span>{joined}</span></div>
    <div class="row sub"><span class="label">Followers</span><span>{profile.followers}</span></div>
    <div class="row sub"><span class="label">Public specimens</span><span>{profile.public_repos}</span></div>
  </div>
</div>

<style>
  .card { display: flex; gap: 24px; align-items: flex-start; border: 1px solid var(--hairline-strong); padding: 18px; }
  .halftone { width: 96px; height: 96px; overflow: hidden; border: 1px solid var(--hairline-strong); position: relative; }
  .halftone img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(1) contrast(1.15); }
  .halftone::after {
    content: ''; position: absolute; inset: 0;
    background-image: radial-gradient(var(--paper) 1px, transparent 1px);
    background-size: 4px 4px; mix-blend-mode: multiply;
  }
  html.white .halftone::after { mix-blend-mode: screen; }
  .fields { flex: 1; }
</style>
```

- [ ] **Step 2: Write `src/lib/repository/DotMatrix.svelte`**

```svelte
<script lang="ts">
  import { contributionLevels, type ContribDay } from './githubClient';
  let { days } = $props<{ days: ContribDay[] }>();
  const RADII = [0.7, 1.2, 1.7, 2.3, 2.9];
  const weeks = $derived.by(() => {
    const w: ContribDay[][] = [];
    for (let i = 0; i < days.length; i += 7) w.push(days.slice(i, i + 7));
    return w;
  });
</script>

<svg class="matrix" viewBox="0 0 {weeks.length * 10} 76" role="img"
  aria-label="One year of contributions as a dot matrix">
  {#each weeks as week, x}
    {#each week as day, y}
      <circle cx={x * 10 + 5} cy={y * 10 + 8} r={RADII[contributionLevels(day.count)]}
        fill="currentColor" opacity={day.count === 0 ? 0.18 : 0.9}>
        <title>{day.date}: {day.count}</title>
      </circle>
    {/each}
  {/each}
</svg>

<style>
  .matrix { width: 100%; color: var(--ink); border: 1px solid var(--hairline); padding: 8px; }
</style>
```

- [ ] **Step 3: Write `src/lib/repository/RepoLedger.svelte`**

```svelte
<script lang="ts">
  import type { GhRepo } from './githubClient';
  let { repos } = $props<{ repos: GhRepo[] }>();
  const ago = (iso: string) => {
    const d = Math.round((Date.now() - +new Date(iso)) / 86_400_000);
    return d === 0 ? 'today' : d === 1 ? '1 day ago' : d < 30 ? `${d} days ago` : d < 365 ? `${Math.round(d / 30)} mo ago` : `${Math.round(d / 365)} y ago`;
  };
</script>

<div class="rledger">
  {#each repos as r (r.name)}
    <a class="rrow" href={r.html_url} target="_blank" rel="noopener">
      <span class="t">{r.name}</span>
      <span class="c">{r.language ?? '—'}</span>
      <span class="c">★ {r.stargazers_count}</span>
      <span class="y">{ago(r.pushed_at)}</span>
    </a>
  {/each}
</div>

<style>
  .rledger { border-top: 1px solid var(--hairline-strong); }
  .rrow {
    display: grid; grid-template-columns: 1fr 140px 80px 110px; gap: 14px;
    padding: 11px 6px; border-bottom: 1px solid var(--hairline);
    text-transform: uppercase; letter-spacing: 0.06em; color: inherit;
  }
  .rrow:hover { background: rgba(128, 128, 128, 0.06); }
  .rrow .t { color: var(--ink-strong); font-weight: 500; }
  .rrow .c, .rrow .y { color: var(--ink-faint); font-size: 11px; }
  @media (max-width: 640px) { .rrow { grid-template-columns: 1fr 80px; } .rrow .c:first-of-type, .rrow .y { display: none; } }
</style>
```

- [ ] **Step 4: Write `src/routes/repository/+page.svelte`** — three independent feeds, skeleton + severed states:

```svelte
<script lang="ts">
  import DocumentPage from '$lib/doc/DocumentPage.svelte';
  import ProfileCard from '$lib/repository/ProfileCard.svelte';
  import DotMatrix from '$lib/repository/DotMatrix.svelte';
  import RepoLedger from '$lib/repository/RepoLedger.svelte';
  import { getContributions, getProfile, getRepos } from '$lib/repository/githubClient';
  import { ROUTES } from '$lib/config/routes';
  import { site } from '$lib/config/site';
  import { onMount } from 'svelte';
  const route = ROUTES[4];
  const h = site.github.handle;

  let profile = $state<Awaited<ReturnType<typeof getProfile>> | null>(null);
  let days = $state<Awaited<ReturnType<typeof getContributions>> | null>(null);
  let repos = $state<Awaited<ReturnType<typeof getRepos>> | null>(null);
  let failed = $state({ profile: false, days: false, repos: false });

  onMount(() => {
    getProfile(h).then((p) => (profile = p)).catch(() => (failed.profile = true));
    getContributions(h).then((d) => (days = d)).catch(() => (failed.days = true));
    getRepos(h).then((r) => (repos = r)).catch(() => (failed.repos = true));
  });
</script>

<DocumentPage
  {route}
  subtitle={`github.com/${h} · live feed`}
  description="The root system — Jhavonei's GitHub presence: contributions as a dot matrix, public repositories as a ledger.">
  <div class="blocks" aria-live="polite">
    <section>
      <h2 class="label">Specimen ID</h2>
      {#if profile}<ProfileCard {profile} />
      {:else if failed.profile}<p class="label severed">Feed severed — consult the source ↗</p>
      {:else}<div class="skel" style="height: 134px"></div>{/if}
    </section>
    <section>
      <h2 class="label">A year of pressings</h2>
      {#if days}<DotMatrix {days} />
      {:else if failed.days}<p class="label severed">Feed severed — consult the source ↗</p>
      {:else}<div class="skel" style="height: 96px"></div>{/if}
    </section>
    <section>
      <h2 class="label">Public specimens</h2>
      {#if repos}<RepoLedger {repos} />
      {:else if failed.repos}<p class="label severed">Feed severed — consult the source ↗</p>
      {:else}<div class="skel" style="height: 180px"></div>{/if}
    </section>
    <a class="seal cta" href={`https://github.com/${h}`} target="_blank" rel="noopener">Open repository ↗</a>
  </div>
</DocumentPage>

<style>
  .blocks { display: grid; gap: 30px; }
  h2 { margin-bottom: 10px; }
  .skel { border: 1px solid var(--hairline); animation: pulse 1.6s ease-in-out infinite; }
  @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
  .severed { border: 1px dashed var(--hairline-strong); padding: 14px; }
  .cta { justify-self: start; padding: 8px 22px; letter-spacing: 0.2em; }
</style>
```

- [ ] **Step 5: Verify** — `/repository` shows skeletons then live data (network on); throttle/offline shows severed states independently. `npx vite build` passes (all fetches are inside `onMount` — SSR-safe).

- [ ] **Step 6: Commit** — `git add -A; git commit -m "feat: repository — specimen ID, dot matrix, repo ledger, severed states"`

### Task 23: 404 — the escaped specimen + full StaticPlate

**Files:** Create: `src/routes/+error.svelte` · Modify: `src/lib/hero/StaticPlate.svelte`

- [ ] **Step 1: Write `src/routes/+error.svelte`**

```svelte
<script lang="ts">
  import HeaderRows from '$lib/chrome/HeaderRows.svelte';
  import FooterStrip from '$lib/chrome/FooterStrip.svelte';
  import { notFoundLine } from '$lib/config/copy';
</script>

<svelte:head><title>DOC. NOT FOUND — JHAVONEI</title></svelte:head>

<div class="sheet">
  <HeaderRows doc="DOC.???" figLabel="Specimen escaped" />
  <div class="void">
    <svg viewBox="0 0 200 160" width="200" aria-hidden="true">
      <g fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.6">
        <path d="M100,150 C 98,120 96,96 100,70" />
        <path d="M100,70 C 88,66 80,50 86,30 C 94,44 98,52 100,58" />
        <path d="M100,70 C 112,62 118,44 112,26 C 106,40 102,52 100,60" transform="rotate(14 100 70)" />
        <path d="M60,140 C 70,138 80,139 88,144" opacity="0.4" />
      </g>
    </svg>
    <h1 class="display">Doc. not found</h1>
    <p class="label">{notFoundLine}</p>
    <a href="/" class="seal">⟵ Return to specimen</a>
  </div>
  <FooterStrip />
</div>

<style>
  .sheet { max-width: 1080px; margin: 0 auto; padding: 28px 34px 40px; min-height: 100vh; display: flex; flex-direction: column; }
  .void { flex: 1; display: grid; place-content: center; justify-items: center; gap: 14px; text-align: center; color: var(--ink); }
  .void h1 { font-size: clamp(28px, 5vw, 44px); }
</style>
```

- [ ] **Step 2: Flesh out `src/lib/hero/StaticPlate.svelte`** — replace the placeholder plate `<div>` with the full Rev.B lily SVG (petals with midribs, six stamens, hollow Fig.00 tip), centered, sized `min(92vmin, 700px)`. Copy the `<svg class="fig">` lily group from `.superpowers/brainstorm/mockups/hero-direction-v2.html` (the `<g transform="translate(410,330)">` block **without** the text-ring defs, callout lines, and labels — those are live components), convert attribute classes: `class="stroke"` → `stroke="currentColor" fill="none"`, `class="faint"` → add `opacity="0.4"`, `class="dotfill"` → `fill="currentColor" stroke="none"`. Keep the existing `ontips` resize logic — it already feeds Callouts.

- [ ] **Step 3: Verify** — visit `/nope` in dev (error page renders); set OS reduced-motion (or DevTools emulation) and load `/`: static lily plate + working callout labels, no particles. `npx vite build` produces `build/404.html`.

- [ ] **Step 4: Commit** — `git add -A; git commit -m "feat: 404 escaped specimen + full static lily plate"`

---

## Phase 5 — Theater (transitions + sound)

### Task 24: Route transition orchestrator

**Files:** Create: `src/lib/systems/transitions.ts` · Test: `src/lib/systems/transitions.test.ts` · Modify: `src/routes/+layout.svelte`, `src/routes/+page.svelte`

- [ ] **Step 1: Write failing test `src/lib/systems/transitions.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { transitions } from './transitions';

describe('transition orchestrator', () => {
  it('runs a registered depart handler and clears it on unregister', async () => {
    let called: [number, number] | null = null;
    const un = transitions.registerDepart(async (dir) => { called = dir; });
    await transitions.depart([1, 0]);
    expect(called).toEqual([1, 0]);
    un();
    called = null;
    await transitions.depart([0, 1]); // no handler — resolves immediately
    expect(called).toBeNull();
  });
  it('records the last departed path for arrival choreography', () => {
    transitions.noteDeparture('/work');
    expect(transitions.consumeLastDeparture()).toBe('/work');
    expect(transitions.consumeLastDeparture()).toBeNull();
  });
});
```

- [ ] **Step 2: Run** `npx vitest run src/lib/systems/transitions.test.ts` — Expected: FAIL.

- [ ] **Step 3: Write `src/lib/systems/transitions.ts`**

```ts
type Dir = [number, number];
type DepartFn = (dir: Dir) => Promise<void>;

let departFn: DepartFn | null = null;
let lastDeparture: string | null = null;

export const transitions = {
  /** Hero registers its disintegration here. Returns unregister. */
  registerDepart(fn: DepartFn): () => void {
    departFn = fn;
    return () => { if (departFn === fn) departFn = null; };
  },
  async depart(dir: Dir): Promise<void> {
    if (departFn) await departFn(dir);
  },
  noteDeparture(path: string) { lastDeparture = path; },
  consumeLastDeparture(): string | null {
    const p = lastDeparture; lastDeparture = null; return p;
  }
};
```

- [ ] **Step 4: Run** — Expected: PASS.

- [ ] **Step 5: Wire the orchestrator in `src/routes/+layout.svelte`** (final form of the layout):

```svelte
<script lang="ts">
  import '@fontsource/ibm-plex-mono/300.css';
  import '@fontsource/ibm-plex-mono/400.css';
  import '@fontsource/ibm-plex-mono/500.css';
  import '@fontsource/ibm-plex-mono/300-italic.css';
  import '@fontsource/archivo-narrow/500.css';
  import '@fontsource/archivo-narrow/600.css';
  import '../app.css';
  import { onNavigate } from '$app/navigation';
  import { onMount } from 'svelte';
  import { mode } from '$lib/systems/mode.svelte';
  import { prefersReducedMotion } from '$lib/systems/prefs';
  import { directionFor } from '$lib/config/routes';
  import { transitions } from '$lib/systems/transitions';
  import { navSound } from '$lib/systems/sound';

  let { children } = $props();
  let exhaling = $state(false);

  onMount(() => mode.init());

  onNavigate(async (nav) => {
    const from = nav.from?.url.pathname;
    const to = nav.to?.url.pathname;
    if (!from || !to || from === to || prefersReducedMotion()) return;
    navSound();
    if (from === '/') {
      transitions.noteDeparture('/');
      await transitions.depart(directionFor(to));   // lily disintegrates toward the route
    } else {
      transitions.noteDeparture(from);
      exhaling = true;                               // page exhale
      await new Promise((r) => setTimeout(r, 250));
      exhaling = false;
    }
  });
</script>

<div class="page" class:exhaling>{@render children()}</div>

<style>
  .page { min-height: 100vh; }
  .exhaling { opacity: 0; transform: translateY(8px); transition: opacity 0.25s var(--ease-wipe), transform 0.25s var(--ease-wipe); }
</style>
```

(`navSound` doesn't exist until Task 25 — create a stub now in `src/lib/systems/sound.ts`: `export const navSound = () => {};` so this compiles; Task 25 replaces it.)

- [ ] **Step 6: Register the hero's depart + arrival condense in `src/routes/+page.svelte`.** Add to the script:

```ts
import { transitions } from '$lib/systems/transitions';
import { directionFor } from '$lib/config/routes';

onMount(() => {
  const un = transitions.registerDepart(async (dir) => {
    await canvas?.getApi()?.disintegrate(dir);
  });
  // arriving home from an interior page: condense instead of full rite
  const from = transitions.consumeLastDeparture();
  if (from && from !== '/') {
    canvas?.getApi()?.condense(directionFor(from));
  }
  return un;
});
```

And in `AssemblyRite` usage: skip the rite when arriving from interior — pass a new prop `enabled={!arrivedFromInterior}` (compute `const arrivedFromInterior = …consumeLastDeparture…` **once** in the script before both uses; when disabled, AssemblyRite calls `skip()` on mount — add `let { enabled = true } = $props()` and `if (!enabled) { skip(); return; }` at the top of its `onMount`).

Note the ordering trap: `consumeLastDeparture()` clears itself — call it once, store the result, use it for both the rite gate and the condense call.

- [ ] **Step 7: Verify** — dev: click Fig.01 on the hero: lily blasts toward Work's direction, Work document fades in; footer-strip between interior pages: exhale swap; breadcrumb back to `/`: particles condense from Work's direction, no full rite. Browser back/forward behave the same.

- [ ] **Step 8: Commit** — `git add -A; git commit -m "feat: cinematic route transitions (disintegrate, exhale, condense)"`

### Task 25: Sound — procedural, opt-in

**Files:** Create (replace stub): `src/lib/systems/sound.ts` · Modify: `src/lib/chrome/FooterStrip.svelte`, `src/lib/hero/Callouts.svelte`

- [ ] **Step 1: Write `src/lib/systems/sound.ts`**

```ts
import { isSoundArmed, setSoundArmed } from './prefs';

let ctx: AudioContext | null = null;
let droneNodes: { gain: GainNode } | null = null;
let armed = false;

function ensureCtx(): AudioContext | null {
  if (typeof AudioContext === 'undefined') return null;
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function startDrone(c: AudioContext) {
  const gain = c.createGain();
  gain.gain.value = 0;
  gain.connect(c.destination);
  for (const [freq, g] of [[55, 0.012], [55.4, 0.009], [110.2, 0.004]] as const) {
    const o = c.createOscillator();
    o.type = 'sine'; o.frequency.value = freq;
    const og = c.createGain(); og.gain.value = g;
    o.connect(og).connect(gain); o.start();
  }
  const noise = c.createBufferSource();
  const buf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.3;
  noise.buffer = buf; noise.loop = true;
  const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 120;
  const ng = c.createGain(); ng.gain.value = 0.02;
  noise.connect(lp).connect(ng).connect(gain); noise.start();
  gain.gain.linearRampToValueAtTime(1, c.currentTime + 2);
  droneNodes = { gain };
}

/** One-shot helpers — silent when not armed. */
function blip(build: (c: AudioContext, out: GainNode) => void, peak: number, ms: number) {
  if (!armed) return;
  const c = ensureCtx(); if (!c) return;
  const out = c.createGain();
  out.gain.setValueAtTime(peak, c.currentTime);
  out.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + ms / 1000);
  out.connect(c.destination);
  build(c, out);
}

export const hoverSound = () => blip((c, out) => {
  const n = c.createBufferSource();
  const b = c.createBuffer(1, c.sampleRate * 0.09, c.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  n.buffer = b;
  const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 5200; bp.Q.value = 2;
  n.connect(bp).connect(out); n.start();
}, 0.05, 90);

export const navSound = () => blip((c, out) => {
  const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = 180;
  o.frequency.exponentialRampToValueAtTime(70, c.currentTime + 0.12);
  o.connect(out); o.start(); o.stop(c.currentTime + 0.14);
}, 0.22, 140);

export const whumphSound = () => blip((c, out) => {
  const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = 60;
  o.connect(out); o.start(); o.stop(c.currentTime + 0.45);
}, 0.3, 420);

export function isArmed() { return armed; }
/** Must be called from a user gesture. */
export function toggleSound(): boolean {
  armed = !armed;
  setSoundArmed(armed);
  if (armed) { const c = ensureCtx(); if (c && !droneNodes) startDrone(c); droneNodes?.gain.gain.linearRampToValueAtTime(1, c!.currentTime + 1); }
  else if (ctx && droneNodes) droneNodes.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
  return armed;
}
/** Persisted preference is written by toggleSound via setSoundArmed; audio always
 *  starts disarmed on a fresh visit because the AudioContext needs a user gesture. */
export const wasPreviouslyArmed = () => isSoundArmed();
```

- [ ] **Step 2: Wire the seal.** In `FooterStrip.svelte` replace the sound button handler block: import `{ toggleSound, isArmed }`, hold `let on = $state(false)`, `onclick={() => (on = toggleSound())}`, label `Sound {on ? '●' : '○'}` (drop the `onSoundToggle`/`soundOn` props). In `Callouts.svelte` `enter()`, call `hoverSound()`.

- [ ] **Step 3: Verify** — dev: silent by default; click SOUND ●: faint drone rises; hovering stamens hisses; navigating thocks; toggling off silences within ~300ms. **Step 4: Commit** — `git add -A; git commit -m "feat: opt-in procedural sound (drone, hiss, thock, whumph)"`

---

## Phase 6 — Ship

### Task 26: OG plates, sitemap, robots

**Files:** Create: `scripts/og-plates.mjs`, `src/routes/sitemap.xml/+server.ts`, `static/robots.txt`

- [ ] **Step 1: Write `scripts/og-plates.mjs`** — renders a BLACK dossier plate per route at build:

```js
import { Resvg } from '@resvg/resvg-js';
import { mkdirSync, writeFileSync } from 'node:fs';

const routes = [
  ['index', 'THE SPECIMEN', 'DOC.001'],
  ['work', 'WORK', 'DOC.002 · FIG.01'],
  ['notes', 'FIELD NOTES', 'DOC.003 · FIG.02'],
  ['author', 'THE AUTHOR', 'DOC.004 · FIG.03'],
  ['correspondence', 'CORRESPONDENCE', 'DOC.005 · FIG.04'],
  ['repository', 'REPOSITORY', 'DOC.006 · FIG.05']
];

const plate = (title, doc) => `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#0a0a0a"/>
  ${Array.from({ length: 24 }, (_, x) => Array.from({ length: 13 }, (_, y) =>
    `<circle cx="${60 + x * 46}" cy="${60 + y * 42}" r="1.4" fill="#c8c8c4" opacity="0.12"/>`).join('')).join('')}
  <line x1="60" y1="120" x2="1140" y2="120" stroke="#c8c8c4" stroke-opacity="0.34"/>
  <line x1="60" y1="520" x2="1140" y2="520" stroke="#c8c8c4" stroke-opacity="0.34"/>
  <text x="60" y="100" font-family="monospace" font-size="30" letter-spacing="6" fill="#efefec">JHAVONEI</text>
  <text x="1140" y="100" text-anchor="end" font-family="monospace" font-size="30" letter-spacing="6" fill="#c8c8c4">2026</text>
  <text x="60" y="360" font-family="monospace" font-size="86" letter-spacing="14" fill="#efefec">${title}</text>
  <text x="60" y="560" font-family="monospace" font-size="22" letter-spacing="5" fill="#c8c8c4">${doc} · GROWN IN THE DARK · READ IN THE LIGHT</text>
  <text x="1140" y="560" text-anchor="end" font-family="monospace" font-size="22" letter-spacing="5" fill="#c8c8c4">JHAVONEI.ME</text>
</svg>`;

mkdirSync('static/og', { recursive: true });
for (const [slug, title, doc] of routes) {
  const png = new Resvg(plate(title, doc), { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  writeFileSync(`static/og/${slug}.png`, png);
}
console.log(`og-plates: wrote ${routes.length} plates`);
```

Run: `node scripts/og-plates.mjs` — Expected: `static/og/*.png` (6 files). (`npm run build` now also works end-to-end, since Task 2's build script calls this.)

- [ ] **Step 2: Write `src/routes/sitemap.xml/+server.ts`**

```ts
import { ROUTES } from '$lib/config/routes';
import { noteEntries } from '$lib/content';
import { site } from '$lib/config/site';

export const prerender = true;

export function GET() {
  const urls = ['/', ...ROUTES.map((r) => r.path), ...noteEntries.map((n) => `/notes/${n.slug}`)];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${site.origin}${u}</loc></url>`).join('\n')}
</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
```

- [ ] **Step 3: Write `static/robots.txt`**

```
User-agent: *
Allow: /
Sitemap: https://jhavonei.me/sitemap.xml
```

- [ ] **Step 4: Verify + commit** — `npm run build` (full script incl. plates) passes; `build/sitemap.xml` and `build/og/` exist. `git add -A; git commit -m "feat: og plates, sitemap, robots"`

### Task 27: Deploy — GitHub Actions → Pages + README

**Files:** Create: `.github/workflows/deploy.yml` · Modify: `README.md`

- [ ] **Step 1: Write `.github/workflows/deploy.yml`**

```yaml
name: Deploy to Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm test
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: build }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Rewrite `README.md`**

```markdown
# jhavonei.me — The Specimen Rosetta

Personal portfolio of Jhavonei. Monochrome research-dossier: a 50k-particle
spider lily is the navigation. Svelte 5 + SvelteKit, static, GitHub Pages.

Design record: `docs/superpowers/specs/` (spec) · `docs/superpowers/plans/`
(build plan) · `.superpowers/brainstorm/mockups/` (visual source of truth).

## Develop

    npm install
    npm run dev       # http://localhost:5173
    npm test          # vitest
    npm run build     # og plates + static build → build/

## Deploy

Push to `main` → GitHub Actions builds and deploys to Pages (custom domain
`jhavonei.me` via `static/CNAME`). One-time setting: repo → Settings → Pages →
Source = **GitHub Actions**.

## Post-launch setup (owner)

1. **Email** `hey@jhavonei.me`: add the domain to Cloudflare (or ImprovMX),
   enable Email Routing, route `hey@` → your Gmail, add the MX/TXT records they
   give you at your DNS host. Until then, set `email` in
   `src/lib/config/site.ts` to a live address.
2. **Form**: create a free Formspree form, paste its endpoint into
   `formspreeEndpoint` in `src/lib/config/site.ts`. Empty endpoint = form
   sealed, mailto shown.
3. **Socials**: confirm handles in `site.ts` (all default to `jhavonei`).
4. **Content**: replace the four `placeholder: true` entries in
   `src/content/work/` with real projects as they become public.
```

- [ ] **Step 3: Final gate** — run all of:

```powershell
npm test          # all suites pass
npm run check     # svelte-check: no errors
npm run build     # plates + prerender all routes
npm run preview   # manual pass: rite, all 5 routes, eclipse, ledger, notes, 404 (/nope), WHITE mode on every page
```

Also verify in preview with DevTools mobile emulation (coarse pointer): two-tap navigation; and with reduced-motion emulation: static plate everywhere.

- [ ] **Step 4: Commit + push + deploy**

```powershell
git add -A
git commit -m "feat: deploy workflow + readme"
git push -u origin main
```

Then confirm with the user before/that: repo Settings → Pages → Source = GitHub Actions (needs their GitHub login). Watch the Actions run; site live at https://jhavonei.me.

---

## Plan self-review notes

- **Spec coverage**: doctrine/tokens (T3), routes+fiction (T4), mode twin (T5, T16), rite (T15), physics contract (T13), rings/callouts/hit-targets/two-tap (T14), poison garden (T10), interior chrome + opening lines (T11), work ledger + hash tabs (T17), notes long-form (T18), author aura (T19), correspondence channels/form (T20), repository three feeds + severed states (T21–22), 404 (T23), transitions incl. condense-return (T24), sound (T25), reduced-motion + mobile degrade (T13/T14/T23), SEO/OG/sitemap (T11/T26), perf budgets (T13 watchdog, DPR cap, dynamic three import), deploy+CNAME+README/email steps (T27). Sealed slots: T7/T17/T18.
- **Deliberate deviations from spec, both minor**: ring "slows to legible" implemented as pause-on-focus (T14); ring-unwind handoff is expressed as the destination's OpeningLine typing in after the particle stream (T24) rather than a literal text morph — the full morph is a polish candidate, not v1.
- **Known risks for the executor**: exact Svelte 5 prop/typing syntax may need minor adjustment against the installed minor version; `@property --r` sweep degrades gracefully; jogruber contributions API is third-party (already fenced by severed states). None block the plan.





