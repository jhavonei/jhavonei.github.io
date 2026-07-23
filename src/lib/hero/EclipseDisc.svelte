<script lang="ts">
  import { onMount } from 'svelte';
  import { mode } from '$lib/systems/mode.svelte';
  import { eclipse } from '$lib/systems/eclipse';
  import { whumphSound } from '$lib/systems/sound';
  import { prefersReducedMotion } from '$lib/systems/prefs';

  let running = $state(false);
  let melting = $state(false);
  let targetPaper = $state('#e9e7e2');

  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

  /** The eclipse rite: an iris of the opposite paper tone opens from the
   *  lily's center until it covers the world (700ms), the mode flips while
   *  everything is hidden beneath it, then the disc melts away (500ms) —
   *  revealing the twin already in place. Nothing pops; the only visible
   *  changes are the iris edge and the gentle reveal. */
  async function run(flicker?: () => void) {
    if (running) return;
    if (prefersReducedMotion()) { mode.toggle(); return; }
    // Twin paper values — must match the --paper tokens in app.css
    targetPaper = mode.current === 'black' ? '#e9e7e2' : '#0a0a0a';
    running = true;
    melting = false;
    whumphSound();
    flicker?.();
    await wait(700);      // iris fully open, world covered
    mode.toggle();        // swap the twin beneath the cover
    await wait(80);       // let tokens settle before the reveal
    melting = true;       // disc fades — background matches, so only content fades in
    await wait(500);
    running = false;
    melting = false;
  }

  onMount(() => eclipse.register(run));
</script>

{#if running}
  <div class="disc" class:melting style="--target: {targetPaper}" aria-hidden="true"></div>
{/if}

<style>
  .disc {
    position: fixed; inset: 0; z-index: 40; pointer-events: none;
    background: var(--target);
    clip-path: circle(0% at 50% 50%);
    animation: iris 0.7s var(--ease-wipe) forwards;
  }
  .disc.melting {
    animation: none;
    clip-path: circle(120% at 50% 50%);
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  @keyframes iris {
    to { clip-path: circle(120% at 50% 50%); }
  }
</style>
