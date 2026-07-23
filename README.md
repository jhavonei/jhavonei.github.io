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
