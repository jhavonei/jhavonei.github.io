# Specimen Rosetta — audit checklist

Generated for owner review. **Not pushed.** Work is complete locally on `main`.

## Hard constraints

| Constraint | Where verified |
|------------|----------------|
| Monochrome only via CSS tokens | `src/app.css`; components use `var(--*)` |
| WovenLight physics frozen | `SpecimenCanvas.svelte`: radius 1.5, force 0.01, spring 0.001, damping 0.95, rot.y = t\*0.05, size 0.02 |
| BLACK default | `mode.svelte.ts`, `app.html` pre-hydration script |
| Real `<a>` navigation | Hero `Callouts.svelte`, `FooterStrip.svelte`, SSR always includes both |
| No reference-poster ring copy | `src/lib/config/copy.ts` rings/openings only |

## Routes (all prerendered)

| Path | Doc | Guardian |
|------|-----|----------|
| `/` | DOC.001 | Particle lily (or StaticPlate if reduced-motion) |
| `/work` | DOC.002 | Datura |
| `/notes` | DOC.003 | Digitalis |
| `/notes/n001-building-the-specimen` | long-form | — |
| `/author` | DOC.004 | Belladonna |
| `/correspondence` | DOC.005 | Oleander |
| `/repository` | DOC.006 | Aconitum |
| unknown | +error / 404.html shell | wilted line drawing |

## Verification commands (all green at finish)

```
npm test          # 25 tests
npm run check     # 0 errors
npm run build     # og plates + static → build/
npm run preview   # http://localhost:4173
```

## Visual checkpoints for auditor

1. **Assembly rite** — clear `localStorage` key `jhv:visited`, reload `/`
2. **Hover stamen** — filament brightens, rings pause, label hot
3. **Eclipse wipe** — Fig.00; WHITE persists across reload
4. **Ledger** — `/work`, open row, hash `#v02`, Escape closes, sealed V.05–V.06
5. **Notes** — index → long-form markdown
6. **Repository** — live feeds or severed offline
7. **404** — client-side unknown path shows DOC. NOT FOUND (SPA shell `404.html`)
8. **WHITE mode** — every page via Fig.00 in footer
9. **Mobile two-tap** — DevTools coarse pointer on callouts
10. **Reduced motion** — static Rev.B lily plate, no particle sim

## Owner post-launch (not done by build)

1. `git push -u origin main` (when ready)
2. GitHub → Settings → Pages → Source = **GitHub Actions**
3. Formspree endpoint → `src/lib/config/site.ts` `formspreeEndpoint`
4. Email routing `hey@jhavonei.me` → Gmail
5. Confirm social handles in `site.ts`
6. Replace placeholder work specimens

## Deviations

See `DEVIATIONS.md`.
