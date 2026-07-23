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
