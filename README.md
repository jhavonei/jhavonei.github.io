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

## Domain + email (Namecheap — verified live 2026-07-23)

DNS is on **Namecheap BasicDNS** (`dns1/dns2.registrar-servers.com`); no
Cloudflare involved. Verified working:

- **A records** `@` → 185.199.108–111.153 (GitHub Pages) ✓
- **Pages**: Source = GitHub Actions, custom domain `jhavonei.me`,
  HTTPS enforced — set via API during launch ✓
- **Site live** at https://jhavonei.me ✓
- **MX records**: Namecheap Email Forwarding active
  (`eforward1–5.registrar-servers.com`) ✓

**Email check still owed:** MX proves the forwarding *service* is on, not that
the `contact@` alias exists. In Namecheap → Domain List → `jhavonei.me` →
Domain tab → *Redirect Email*, confirm there is a row `contact` → your inbox
(add it if missing), then send a test mail to `contact@jhavonei.me`.
Forwarding is receive-only; replies go out from your own address.

### Remaining owner setup

1. **Form**: create a free Formspree form, paste its endpoint into
   `formspreeEndpoint` in `src/lib/config/site.ts`. Empty endpoint = form
   sealed, mailto shown.
2. **Socials**: confirm handles in `site.ts` (all default to `jhavonei`).
3. **Content**: replace the four `placeholder: true` entries in
   `src/content/work/` with real projects as they become public.
