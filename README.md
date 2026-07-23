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

## Domain + email setup (Namecheap — verified state 2026-07-23)

DNS is on **Namecheap BasicDNS** (`dns1/dns2.registrar-servers.com`). No
Cloudflare account is involved. As of the audit the domain had **no A records
and no MX records** — both must be added for the site and email to work.

### 1. Point jhavonei.me at GitHub Pages

Namecheap → Domain List → `jhavonei.me` → **Advanced DNS** → Host Records.
Delete any parking/URL-redirect records, then add:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | @ | 185.199.108.153 | Automatic |
| A | @ | 185.199.109.153 | Automatic |
| A | @ | 185.199.110.153 | Automatic |
| A | @ | 185.199.111.153 | Automatic |
| CNAME | www | jhavonei.github.io. | Automatic |

### 2. GitHub Pages settings (one time)

Repo `jhavonei/jhavonei.github.io` → Settings → Pages:
- **Source: GitHub Actions**
- **Custom domain: `jhavonei.me`** → Save (required for workflow deploys —
  the `static/CNAME` file alone is not honored by Actions-based Pages)
- After DNS propagates (minutes–hours): tick **Enforce HTTPS**

### 3. Email `contact@jhavonei.me` → Gmail

Namecheap → Domain List → `jhavonei.me` → **Domain** tab → *Redirect Email*:
add `contact` → your Gmail, Save. Namecheap then auto-adds its
`eforward*.registrar-servers.com` MX records under Advanced DNS
(Mail Settings switches to "Email Forwarding"). Verify with:
`Resolve-DnsName jhavonei.me -Type MX` — non-empty means it took.
Note: forwarding is receive-only; replies come from your Gmail address.

### 4. Remaining owner setup

1. **Form**: create a free Formspree form, paste its endpoint into
   `formspreeEndpoint` in `src/lib/config/site.ts`. Empty endpoint = form
   sealed, mailto shown.
2. **Socials**: confirm handles in `site.ts` (all default to `jhavonei`).
3. **Content**: replace the four `placeholder: true` entries in
   `src/content/work/` with real projects as they become public.
