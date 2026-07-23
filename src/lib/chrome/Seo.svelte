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
