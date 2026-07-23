<script lang="ts">
  import '@fontsource/ibm-plex-mono/300.css';
  import '@fontsource/ibm-plex-mono/400.css';
  import '@fontsource/ibm-plex-mono/500.css';
  import '@fontsource/ibm-plex-mono/300-italic.css';
  import '@fontsource/archivo-narrow/500.css';
  import '@fontsource/archivo-narrow/600.css';
  import '../app.css';
  import { onNavigate } from '$app/navigation';
  import { onMount } from 'svelte';
  import { mode } from '$lib/systems/mode.svelte';
  import { prefersReducedMotion } from '$lib/systems/prefs';
  import { directionFor } from '$lib/config/routes';
  import { transitions } from '$lib/systems/transitions';
  import { navSound } from '$lib/systems/sound';

  let { children } = $props();
  let exhaling = $state(false);

  onMount(() => mode.init());

  onNavigate(async (nav) => {
    const from = nav.from?.url.pathname;
    const to = nav.to?.url.pathname;
    if (!from || !to || from === to || prefersReducedMotion()) return;
    navSound();
    if (from === '/') {
      transitions.noteDeparture('/');
      await transitions.depart(directionFor(to));
    } else {
      transitions.noteDeparture(from);
      exhaling = true;
      await new Promise((r) => setTimeout(r, 250));
      exhaling = false;
    }
  });
</script>

<div class="page" class:exhaling>{@render children()}</div>

<style>
  .page { min-height: 100vh; transition: opacity 0.25s var(--ease-wipe), transform 0.25s var(--ease-wipe); }
  .exhaling { opacity: 0; transform: translateY(8px); }
</style>
