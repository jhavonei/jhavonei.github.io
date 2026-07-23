<script lang="ts">
  let { text, base = 0, step = 0.05, tag = 'span' } = $props<{
    text: string; base?: number; step?: number; tag?: string;
  }>();
</script>

<svelte:element this={tag} class="typed" aria-label={text}>
  {#each text.split('') as char, i}
    <span class="ch" aria-hidden="true" style="animation-delay: {base + i * step}s"
      >{char === ' ' ? ' ' : char}</span>
  {/each}
</svelte:element>

<style>
  .typed { display: inline-block; }
  .ch {
    display: inline-block; opacity: 0; transform: translateY(0.6em);
    animation: rise 1.2s var(--ease-reveal) forwards;
  }
  @keyframes rise { to { opacity: 1; transform: translateY(0); } }
  @media (prefers-reduced-motion: reduce) { .ch { opacity: 1; transform: none; animation: none; } }
</style>
