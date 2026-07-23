<script lang="ts">
  import { onMount } from 'svelte';
  import type { WorkMeta } from '$lib/content';
  import { sealedAfter } from '$lib/content';
  import LedgerRow from './LedgerRow.svelte';
  let { entries, sealedSlots = 2 } = $props<{ entries: WorkMeta[]; sealedSlots?: number }>();
  let openIndex: string | null = $state(null);
  const sealed = $derived(sealedAfter(entries[entries.length - 1]?.index ?? 'V.00', sealedSlots));
  const toAnchor = (i: string) => i.replace('.', '').toLowerCase();

  onMount(() => {
    const fromHash = location.hash.slice(1); // "v02"
    const hit = entries.find((e: WorkMeta) => toAnchor(e.index) === fromHash);
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
