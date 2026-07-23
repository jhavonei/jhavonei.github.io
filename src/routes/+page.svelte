<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import SpecimenCanvas from '$lib/three/SpecimenCanvas.svelte';
  import Rings from '$lib/hero/Rings.svelte';
  import Callouts from '$lib/hero/Callouts.svelte';
  import AssemblyRite, { type RitePhase } from '$lib/hero/AssemblyRite.svelte';
  import EclipseDisc from '$lib/hero/EclipseDisc.svelte';
  import HeaderRows from '$lib/chrome/HeaderRows.svelte';
  import FooterStrip from '$lib/chrome/FooterStrip.svelte';
  import Seo from '$lib/chrome/Seo.svelte';
  import StaticPlate from '$lib/hero/StaticPlate.svelte';
  import { prefersReducedMotion } from '$lib/systems/prefs';
  import { site } from '$lib/config/site';
  import { transitions } from '$lib/systems/transitions';
  import { directionFor } from '$lib/config/routes';
  import { ROUTES } from '$lib/config/routes';

  let canvas: { getApi: () => ReturnType<typeof SpecimenCanvas.prototype.getApi> } | undefined = $state();
  let eclipseRef: { eclipse: (fn?: () => void) => Promise<void> } | undefined = $state();
  let tips: { x: number; y: number }[] = $state([]);
  let focused: number | null = $state(null);
  let degraded = $state(false);
  let reduced = $state(false);
  let rite: RitePhase = $state('idle'); // idle until mount so SSR ships chrome + links
  let arrivedFromInterior = $state(false);
  let mounted = $state(false);

  const visible = (p: RitePhase[]) => !mounted || p.includes(rite) || rite === 'idle' || arrivedFromInterior;
  const isCoarse = () => typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches;

  onMount(() => {
    mounted = true;
    reduced = prefersReducedMotion();
    const from = transitions.consumeLastDeparture();
    arrivedFromInterior = !!(from && from !== '/');
    if (!arrivedFromInterior) rite = 'paper';
    const un = transitions.registerDepart(async (dir) => {
      await canvas?.getApi()?.disintegrate(dir);
    });
    if (arrivedFromInterior && from) {
      requestAnimationFrame(() => canvas?.getApi()?.condense(directionFor(from)));
    }
    return un;
  });
</script>

<Seo title={site.name} description="Jhavonei — creative technologist. A catalogue of instruments, field notes, and correspondence, grown in the dark." />

<div class="stage" class:veiled={mounted && rite === 'paper' && !arrivedFromInterior}>
  <AssemblyRite
    enabled={!arrivedFromInterior}
    onphase={(p) => (rite = p)}
    assemble={(ms) => canvas?.getApi()?.assemble(ms) ?? Promise.resolve()}
    finish={() => canvas?.getApi()?.finishAssembly()} />
  <EclipseDisc bind:this={eclipseRef} />
  {#if reduced || degraded}
    <StaticPlate ontips={(t) => (tips = t)} />
  {:else}
    <div class:hidden={!visible(['particles', 'rings', 'callouts'])}>
      <SpecimenCanvas
        bind:this={canvas}
        count={isCoarse() ? 12_000 : 50_000}
        startScattered={!arrivedFromInterior}
        ontips={(t) => (tips = t)}
        ondegrade={() => (degraded = true)} />
    </div>
  {/if}
  <div class:dim={!visible(['rings', 'callouts'])}>
    <Rings slowed={focused != null} />
  </div>
  <!-- Callouts always in DOM: real <a> for keyboard, crawler, no-JS -->
  <div class:dim={!visible(['callouts'])}>
    <Callouts
      {tips}
      onfocus={(f) => { focused = f; canvas?.getApi()?.setFocus(f); }}
      onnavigate={(path) => goto(path)}
      oninvert={() => eclipseRef?.eclipse(() => canvas?.getApi()?.flickerInvert())} />
  </div>
  <!-- Chrome always in DOM: footer strip is the no-JS nav path -->
  <div class="chrome top" class:dim={!visible(['chrome', 'particles', 'rings', 'callouts'])}>
    <HeaderRows doc="DOC.001" figLabel="The Specimen" />
  </div>
  <div class="chrome bottom" class:dim={!visible(['chrome', 'particles', 'rings', 'callouts'])}>
    <FooterStrip />
  </div>
  <!-- noscript catalogue for crawlers that skip client JS entirely -->
  <noscript>
    <nav class="ns-nav" aria-label="Catalogue">
      {#each ROUTES as r}
        <a href={r.path}>Fig.0{r.fig} — {r.short}</a>
      {/each}
    </nav>
  </noscript>
</div>

<style>
  .stage { position: relative; height: 100vh; overflow: hidden; transition: opacity 0.3s var(--ease-reveal); }
  .veiled { opacity: 0; }
  .hidden { visibility: hidden; }
  .dim { opacity: 0; pointer-events: none; }
  .chrome { position: absolute; left: 0; right: 0; z-index: 3; padding: 20px 34px; }
  .chrome.top { top: 0; }
  .chrome.bottom { bottom: 0; padding-top: 0; }
  .chrome.bottom :global(.strip) { margin-top: 0; }
  .ns-nav {
    position: absolute; bottom: 80px; left: 34px; z-index: 4;
    display: flex; flex-wrap: wrap; gap: 12px;
    font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.14em;
  }
</style>
