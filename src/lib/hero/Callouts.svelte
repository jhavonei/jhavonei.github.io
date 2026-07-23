<script lang="ts">
  import { ROUTES } from '$lib/config/routes';
  import { mode } from '$lib/systems/mode.svelte';
  import { hoverSound } from '$lib/systems/sound';
  let { tips = [], onfocus = (_: number | null) => {}, onnavigate = (_: string) => {}, oninvert = () => {} } =
    $props<{
      tips?: { x: number; y: number }[];
      onfocus?: (fig: number | null) => void;
      onnavigate?: (path: string) => void;
      oninvert?: () => void;
    }>();
  let focusedFig: number | null = $state(null);
  let armedFig: number | null = $state(null); // mobile two-tap

  const label = (fig: number) => (fig === 0 ? 'Fig.00 — Invert ⇄' : `Fig.0${fig} — ${ROUTES[fig - 1].short}`);
  const off = (fig: number) => {
    const t = tips[fig];
    if (!t) return '';
    const dx = t.x > (typeof innerWidth !== 'undefined' ? innerWidth : 1000) / 2 ? 14 : -14;
    return `left: ${t.x + dx}px; top: ${t.y - 10}px; ${dx < 0 ? 'transform: translateX(-100%);' : ''}`;
  };
  function enter(fig: number) {
    focusedFig = fig;
    onfocus(fig === 0 ? null : fig);
    hoverSound();
  }
  function leave() { focusedFig = null; armedFig = null; onfocus(null); }
  function activate(e: Event, fig: number) {
    e.preventDefault();
    if (fig === 0) { oninvert(); return; }
    // touch: first tap arms, second commits
    if (matchMedia('(pointer: coarse)').matches && armedFig !== fig) { armedFig = fig; enter(fig); return; }
    onnavigate(ROUTES[fig - 1].path);
  }
</script>

<div class="callouts">
  {#each [1, 2, 3, 4, 5] as fig}
    <a
      href={ROUTES[fig - 1].path}
      class="callout label"
      class:hot={focusedFig === fig || armedFig === fig}
      class:unplaced={!tips[fig]}
      style={off(fig)}
      onmouseenter={() => enter(fig)}
      onmouseleave={leave}
      onfocus={() => enter(fig)}
      onblur={leave}
      onclick={(e) => activate(e, fig)}>{label(fig)}</a>
  {/each}
  <button
    class="callout label inverter"
    class:hot={focusedFig === 0}
    class:unplaced={!tips[0]}
    style={off(0)}
    onmouseenter={() => enter(0)}
    onmouseleave={leave}
    onfocus={() => enter(0)}
    onblur={leave}
    onclick={(e) => activate(e, 0)}
    aria-label="Invert to {mode.current === 'black' ? 'white' : 'black'} mode">Fig.00 — Invert ⇄</button>
</div>

<style>
  .callouts { position: absolute; inset: 0; z-index: 2; }
  .callout {
    position: absolute; white-space: nowrap; padding: 10px 12px; /* enlarged hit area */
    color: var(--ink); background: transparent; border: none; cursor: pointer;
    font-family: var(--font-mono); font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.14em;
    /* paper-colored halo so labels stay legible over particles and ring text */
    text-shadow: 0 0 4px var(--paper), 0 0 8px var(--paper), 0 0 14px var(--paper), 0 0 22px var(--paper);
  }
  .callout.hot, .callout:hover, .callout:focus-visible { color: var(--ink-strong); }
  /* no projected tip yet (pre-hydration / first frames): keep focusable, don't paint a stack in the corner */
  .callout.unplaced { visibility: hidden; }
  .inverter { font-style: italic; }
</style>
