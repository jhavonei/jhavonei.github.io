<script lang="ts">
  let { size = 120 } = $props<{ size?: number }>();
</script>

<figure class="plant" style="height: {size}px">
  <svg viewBox="0 0 92 120" height={size} role="img" aria-label="Nerium oleander, line drawing">
    <g fill="none" stroke="currentColor" stroke-width="0.8">
      <path d="M46,116 C 46,86 46,60 46,42" />
      <path d="M46,66 C 34,60 24,58 12,62 C 24,70 36,71 46,66" />
      <path opacity="0.4" d="M42,65 L16,62" />
      <path d="M46,80 C 58,74 68,72 80,76 C 68,84 56,85 46,80" />
      <path opacity="0.4" d="M50,79 L76,76" />
      <g>
        <path d="M46,42 C 40,36 40,28 46,24 C 44,30 45,36 46,42" />
        <path d="M46,42 C 52,36 52,28 46,24 C 48,30 47,36 46,42" transform="rotate(72 46 33)" />
        <path d="M46,42 C 52,36 52,28 46,24 C 48,30 47,36 46,42" transform="rotate(144 46 33)" />
        <path d="M46,42 C 52,36 52,28 46,24 C 48,30 47,36 46,42" transform="rotate(216 46 33)" />
        <path d="M46,42 C 52,36 52,28 46,24 C 48,30 47,36 46,42" transform="rotate(288 46 33)" />
        <circle cx="46" cy="33" r="1.5" fill="currentColor" stroke="none" />
      </g>
    </g>
  </svg>
</figure>

<style>
  .plant { margin: 0; color: var(--ink); transform-origin: 50% 95%; animation: sway 9s ease-in-out infinite; }
  @keyframes sway { 0%, 100% { transform: rotate(-0.6deg); } 50% { transform: rotate(0.6deg); } }
  @media (prefers-reduced-motion: reduce) { .plant { animation: none; } }
</style>
