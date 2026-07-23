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
