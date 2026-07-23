<script lang="ts">
  let { size = 120 } = $props<{ size?: number }>();
</script>

<figure class="plant" style="height: {size}px">
  <svg viewBox="0 0 92 120" height={size} role="img" aria-label="Digitalis purpurea, line drawing">
    <g fill="none" stroke="currentColor" stroke-width="0.8">
      <path d="M46,116 C 47,84 48,48 50,10" />
      <path d="M49,22 C 42,20 38,25 39,31 C 44,34 49,31 49,26" />
      <path d="M50,38 C 41,36 36,42 38,49 C 44,52 50,48 50,42" />
      <path d="M49,56 C 39,54 34,61 37,68 C 44,71 50,66 50,60" />
      <path d="M48,74 C 38,73 33,80 36,87 C 43,90 49,85 49,78" />
      <path opacity="0.4" d="M43,28 L46,29 M42,45 L45,46 M41,63 L44,64 M40,81 L43,82" />
      <path d="M46,98 C 36,94 27,96 20,102 C 29,106 40,104 46,98" />
    </g>
  </svg>
</figure>

<style>
  .plant { margin: 0; color: var(--ink); transform-origin: 50% 95%; animation: sway 9s ease-in-out infinite; }
  @keyframes sway { 0%, 100% { transform: rotate(-0.6deg); } 50% { transform: rotate(0.6deg); } }
  @media (prefers-reduced-motion: reduce) { .plant { animation: none; } }
</style>
