<script lang="ts">
  let { delay = 0, children } = $props<{ delay?: number; children: import('svelte').Snippet }>();
</script>

<span class="stamp" style="animation-delay: {delay}s">{@render children()}</span>

<style>
  .stamp {
    display: inline-block; border: 1.5px solid var(--accent); color: var(--accent);
    padding: 2px 10px; text-transform: uppercase; letter-spacing: 0.2em; font-size: 10px;
    opacity: 0; transform: rotate(-8deg) scale(1.3);
    animation: settle 0.25s var(--ease-wipe) forwards;
  }
  @keyframes settle { to { opacity: 1; transform: rotate(-8deg) scale(1); } }
  @media (prefers-reduced-motion: reduce) { .stamp { opacity: 1; transform: rotate(-8deg); animation: none; } }
</style>
