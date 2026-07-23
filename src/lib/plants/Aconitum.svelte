<script lang="ts">
  let { size = 120 } = $props<{ size?: number }>();
</script>

<figure class="plant" style="height: {size}px">
  <svg viewBox="0 0 92 120" height={size} role="img" aria-label="Aconitum napellus, line drawing">
    <g fill="none" stroke="currentColor" stroke-width="0.8">
      <path d="M46,116 C 46,86 46,54 46,16" />
      <path d="M46,16 C 39,16 35,23 37,30 C 40,35 47,35 52,31 C 55,26 52,18 46,16" />
      <path opacity="0.5" d="M39,27 C 42,30 47,31 51,29" />
      <path d="M45,42 C 38,42 35,48 37,54 C 41,58 47,57 50,53 C 52,48 50,43 45,42" />
      <path d="M47,64 C 41,65 38,70 40,75 C 44,78 49,77 51,73 C 52,69 51,65 47,64" />
      <path d="M46,90 C 36,84 30,84 22,88 M46,90 C 40,80 38,74 40,66" opacity="0.6" />
      <path d="M46,96 C 56,90 62,90 70,94 M46,96 C 52,86 54,80 52,72" opacity="0.6" />
    </g>
  </svg>
</figure>

<style>
  .plant { margin: 0; color: var(--ink); transform-origin: 50% 95%; animation: sway 9s ease-in-out infinite; }
  @keyframes sway { 0%, 100% { transform: rotate(-0.6deg); } 50% { transform: rotate(0.6deg); } }
  @media (prefers-reduced-motion: reduce) { .plant { animation: none; } }
</style>
