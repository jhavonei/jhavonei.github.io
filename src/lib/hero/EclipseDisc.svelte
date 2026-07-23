<script lang="ts">
  import { mode } from '$lib/systems/mode.svelte';
  import { whumphSound } from '$lib/systems/sound';
  let running = $state(false);
  // Twin paper values — must match --paper tokens in app.css (BLACK / WHITE)
  let targetPaper = $state('var(--paper)');

  /** Expand a disc of the opposite paper tone from center, flip mode at apex, fade disc. */
  export async function eclipse(canvasFlicker?: () => void) {
    if (running) return;
    // Opposite of current mode (token values from app.css §tokens)
    targetPaper = mode.current === 'black' ? '#e9e7e2' : '#0a0a0a';
    running = true;
    canvasFlicker?.();
    whumphSound();
    await new Promise((r) => setTimeout(r, 450)); // disc mid-expansion
    mode.toggle();
    await new Promise((r) => setTimeout(r, 450));
    running = false;
  }
</script>

{#if running}
  <div class="disc" style="--target: {targetPaper}" aria-hidden="true"></div>
{/if}

<style>
  .disc {
    position: fixed; inset: 0; z-index: 40; pointer-events: none;
    background: radial-gradient(circle at 50% 50%, var(--target) 0%, var(--target) var(--r, 0%), transparent var(--r, 0%));
    animation: grow 0.9s var(--ease-wipe) forwards;
  }
  @keyframes grow { from { --r: 0%; } to { --r: 150%; } }
</style>

<svelte:head>
  <style>
    @property --r { syntax: '<percentage>'; inherits: false; initial-value: 0%; }
  </style>
</svelte:head>
