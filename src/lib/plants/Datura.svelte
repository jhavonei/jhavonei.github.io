<script lang="ts">
  let { size = 120 } = $props<{ size?: number }>();
</script>

<figure class="plant" style="height: {size}px">
  <svg viewBox="0 0 92 120" height={size} role="img" aria-label="Datura stramonium, line drawing">
    <g fill="none" stroke="currentColor" stroke-width="0.8">
      <path d="M46,116 C 45,90 44,66 46,44" />
      <path d="M46,44 C 36,38 30,24 33,8 C 40,16 44,20 46,26 C 48,20 52,16 59,8 C 62,24 56,38 46,44" />
      <path opacity="0.4" d="M46,44 C 43,32 42,22 44,12" />
      <path opacity="0.4" d="M46,44 C 49,32 50,22 48,12" />
      <path d="M46,78 C 34,74 24,76 16,84 C 26,88 38,86 46,78" />
      <path opacity="0.4" d="M46,78 C 36,79 28,81 20,84" />
      <circle cx="33" cy="8" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="59" cy="8" r="1.4" fill="currentColor" stroke="none" />
    </g>
  </svg>
</figure>

<style>
  .plant { margin: 0; color: var(--ink); transform-origin: 50% 95%; animation: sway 9s ease-in-out infinite; }
  @keyframes sway { 0%, 100% { transform: rotate(-0.6deg); } 50% { transform: rotate(0.6deg); } }
  @media (prefers-reduced-motion: reduce) { .plant { animation: none; } }
</style>
