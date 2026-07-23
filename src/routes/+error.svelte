<script lang="ts">
  import HeaderRows from '$lib/chrome/HeaderRows.svelte';
  import FooterStrip from '$lib/chrome/FooterStrip.svelte';
  import { notFoundLine } from '$lib/config/copy';
</script>

<svelte:head><title>DOC. NOT FOUND — JHAVONEI</title></svelte:head>

<div class="sheet">
  <HeaderRows doc="DOC.???" figLabel="Specimen escaped" />
  <div class="void">
    <svg viewBox="0 0 200 160" width="200" aria-hidden="true">
      <g fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.6">
        <path d="M100,150 C 98,120 96,96 100,70" />
        <path d="M100,70 C 88,66 80,50 86,30 C 94,44 98,52 100,58" />
        <path d="M100,70 C 112,62 118,44 112,26 C 106,40 102,52 100,60" transform="rotate(14 100 70)" />
        <path d="M60,140 C 70,138 80,139 88,144" opacity="0.4" />
      </g>
    </svg>
    <h1 class="display">Doc. not found</h1>
    <p class="label">{notFoundLine}</p>
    <a href="/" class="seal">⟵ Return to specimen</a>
  </div>
  <FooterStrip />
</div>

<style>
  .sheet { max-width: 1080px; margin: 0 auto; padding: 28px 34px 40px; min-height: 100vh; display: flex; flex-direction: column; }
  .void { flex: 1; display: grid; place-content: center; justify-items: center; gap: 14px; text-align: center; color: var(--ink); }
  .void h1 { font-size: clamp(28px, 5vw, 44px); }
</style>
