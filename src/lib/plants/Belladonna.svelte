<script lang="ts">
  let { size = 120 } = $props<{ size?: number }>();
</script>

<figure class="plant" style="height: {size}px">
  <svg viewBox="0 0 92 120" height={size} role="img" aria-label="Atropa belladonna, line drawing">
    <g fill="none" stroke="currentColor" stroke-width="0.8">
      <path d="M46,116 C 46,88 44,62 40,40 M40,40 C 38,28 40,18 46,10 M40,40 C 30,34 24,26 24,16" />
      <path d="M40,58 C 30,52 22,52 14,58 C 22,64 32,64 40,58" />
      <path d="M44,78 C 54,72 62,72 70,78 C 62,84 52,84 44,78" />
      <path d="M46,10 l3,-4 M46,10 l4,2 M46,10 l-1,-5 M46,10 l-4,-1 M46,10 l-2,4" opacity="0.7" />
      <circle cx="58" cy="30" r="5" />
      <path opacity="0.4" d="M58,25 C 55,27 54,30 55,33" />
      <path d="M52,26 L46,18" opacity="0.6" />
    </g>
  </svg>
</figure>

<style>
  .plant { margin: 0; color: var(--ink); transform-origin: 50% 95%; animation: sway 9s ease-in-out infinite; }
  @keyframes sway { 0%, 100% { transform: rotate(-0.6deg); } 50% { transform: rotate(0.6deg); } }
  @media (prefers-reduced-motion: reduce) { .plant { animation: none; } }
</style>
