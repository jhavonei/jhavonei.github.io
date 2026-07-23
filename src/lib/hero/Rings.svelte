<script lang="ts">
  import { rings } from '$lib/config/copy';
  let { slowed = false } = $props<{ slowed?: boolean }>();
  const radii = [282, 252, 224];
  const cls = ['spin slow', 'spin rev', 'spin'];
</script>

<svg class="rings" viewBox="0 0 660 660" class:slowed aria-hidden="true">
  <g transform="translate(330,330)">
    <defs>
      {#each radii as r, i}
        <path id="ring{i}" d="M0,{-r} A{r},{r} 0 1,1 -0.01,{-r}" />
      {/each}
    </defs>
    {#each rings as textLoop, i}
      <g class={cls[i]}>
        <text class="ringtext"><textPath href="#ring{i}">{textLoop.repeat(2)}</textPath></text>
      </g>
    {/each}
    <circle class="faint" r="296" stroke-dasharray="1 6" />
    <circle class="faint" r="208" />
  </g>
</svg>

<style>
  .rings { position: absolute; inset: 0; margin: auto; width: min(92vmin, 700px); height: min(92vmin, 700px); z-index: 1; pointer-events: none; }
  .ringtext { font-family: var(--font-mono); font-size: 9.5px; letter-spacing: 0.3em; fill: var(--ink-faint); text-transform: uppercase; }
  .faint { fill: none; stroke: var(--hairline-strong); stroke-width: 0.7; }
  .spin { transform-box: fill-box; transform-origin: center; animation: spin 140s linear infinite; }
  .spin.rev { animation: spinrev 100s linear infinite; }
  .spin.slow { animation-duration: 200s; }
  .slowed .spin { animation-play-state: paused; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes spinrev { to { transform: rotate(-360deg); } }
  @media (prefers-reduced-motion: reduce) { .spin { animation: none; } }
</style>
