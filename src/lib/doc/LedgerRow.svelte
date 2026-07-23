<script lang="ts">
  import { slide } from 'svelte/transition';
  import type { WorkMeta } from '$lib/content';
  let { entry, open = false, ontoggle = () => {} } = $props<{
    entry: WorkMeta; open?: boolean; ontoggle?: () => void;
  }>();
  const anchor = $derived(entry.index.replace('.', '').toLowerCase()); // V.02 → v02
</script>

<div class="lrow-wrap" id={anchor}>
  <button class="lrow" aria-expanded={open} onclick={ontoggle}>
    <span class="v">{entry.index}</span>
    <span class="t">{entry.title}</span>
    <span class="c">Class: {entry.taxonomy}</span>
    <span class="y">{entry.year}</span>
    <span class="s" class:live={entry.status === 'live'}>{entry.status}</span>
  </button>
  {#if open}
    <div class="ldetail" transition:slide={{ duration: 350, easing: (t) => 1 - Math.pow(1 - t, 3) }}>
      <div>
        <p class="blurb">{entry.blurb}</p>
        <div class="meta label">
          Stack — {entry.stack.join(' · ')}<br />
          Role — {entry.role}<br />
          {#if entry.links?.exhibit}<a href={entry.links.exhibit}>Exhibit ↗</a> · {/if}
          {#if entry.links?.source}<a href={entry.links.source}>Source ↗</a>{/if}
        </div>
      </div>
      <div class="thumb">
        <span class="label">{entry.placeholder ? 'Specimen pending verification' : `Exhibit ${entry.index}`}</span>
      </div>
    </div>
  {/if}
</div>

<style>
  .lrow {
    display: grid; grid-template-columns: 64px 1fr 200px 70px 90px; gap: 14px;
    width: 100%; padding: 13px 6px; border: none; border-bottom: 1px solid var(--hairline);
    background: transparent; color: inherit; font: inherit; text-align: left; cursor: pointer;
    text-transform: uppercase; letter-spacing: 0.06em; align-items: baseline;
  }
  .lrow:hover, .lrow[aria-expanded='true'] { background: color-mix(in srgb, var(--ink) 6%, transparent); }
  .v { color: var(--ink-faint); }
  .t { color: var(--ink-strong); font-weight: 500; letter-spacing: 0.1em; }
  .c, .y { color: var(--ink-faint); font-size: 11px; }
  .s { font-size: 10px; letter-spacing: 0.16em; text-align: right; color: var(--ink-faint); }
  .s.live { color: var(--ink); }
  .s.live::before { content: '● '; font-size: 8px; }
  .ldetail {
    display: grid; grid-template-columns: 1.4fr 1fr; gap: 24px;
    padding: 6px 6px 24px 84px; border-bottom: 1px solid var(--hairline);
  }
  .blurb { font-weight: 300; font-size: 12px; max-width: 52ch; }
  .meta { margin-top: 10px; line-height: 2; }
  .thumb {
    border: 1px solid var(--hairline-strong); min-height: 120px; position: relative;
    background: repeating-linear-gradient(45deg, transparent, transparent 6px, var(--hairline) 6px, var(--hairline) 7px);
  }
  .thumb .label { position: absolute; bottom: 6px; right: 8px; font-size: 9px; }
  @media (max-width: 760px) {
    .lrow { grid-template-columns: 52px 1fr 70px; }
    .c, .s { display: none; }
    .ldetail { grid-template-columns: 1fr; padding-left: 6px; }
  }
</style>
