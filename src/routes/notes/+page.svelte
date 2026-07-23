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
  .nrow:hover { background: color-mix(in srgb, var(--ink) 6%, transparent); }
  .nrow .v, .nrow .c, .nrow .y { color: var(--ink-faint); font-size: 11px; }
  .nrow .t { color: var(--ink-strong); font-weight: 500; letter-spacing: 0.1em; }
  .nrow.sealed { border-bottom-style: dashed; grid-template-columns: 64px 1fr 110px; }
  .nrow.sealed .t { color: var(--ink-faint); font-weight: 300; }
  @media (max-width: 700px) { .nrow { grid-template-columns: 52px 1fr; } .nrow .c, .nrow .y { display: none; } }
</style>
