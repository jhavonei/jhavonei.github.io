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
  const Plant = $derived(plants[route.plant]);
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
  <OpeningLine text={openingLines[route.openingKey as keyof typeof openingLines]} />
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
