<script lang="ts">
  let { width = '100%', delay = 0, duration = 0.6, strong = false } = $props<{
    width?: string; delay?: number; duration?: number; strong?: boolean;
  }>();
</script>

<div class="drawn" class:strong style="width: {width}; animation-delay: {delay}s; animation-duration: {duration}s"></div>

<style>
  .drawn {
    height: 1px; background: var(--hairline); transform: scaleX(0); transform-origin: left;
    animation: draw var(--ease-reveal) forwards;
  }
  .drawn.strong { background: var(--hairline-strong); }
  @keyframes draw { to { transform: scaleX(1); } }
  @media (prefers-reduced-motion: reduce) { .drawn { transform: none; animation: none; } }
</style>
