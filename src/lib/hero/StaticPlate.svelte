<script lang="ts">
  import { onMount } from 'svelte';
  import { STAMEN_DIRS, STAMEN_LEN } from '$lib/three/anatomy';
  let { ontips = (_: { x: number; y: number }[]) => {} } = $props<{
    ontips?: (tips: { x: number; y: number }[]) => void;
  }>();
  onMount(() => {
    const push = () => {
      const cx = innerWidth / 2, cy = innerHeight / 2, sc = Math.min(innerWidth, innerHeight) * 0.18;
      ontips(STAMEN_DIRS.map(([x, y]) => ({ x: cx + x * STAMEN_LEN * sc, y: cy - y * STAMEN_LEN * sc })));
    };
    push();
    addEventListener('resize', push);
    return () => removeEventListener('resize', push);
  });
</script>

<!-- Rev.B lily plate from hero-direction-v2 mockup (rings/callouts are live components) -->
<div class="plate" aria-hidden="true">
  <svg class="fig" viewBox="0 0 820 660">
    <g transform="translate(410,330)">
      <g class="breathe">
        <!-- petals with midribs -->
        <g fill="none" stroke="currentColor" stroke-width="0.9">
          <g>
            <path d="M0,0 C 13,-42 20,-88 3,-130 C -15,-88 -10,-42 0,0" />
            <path opacity="0.4" d="M0,-10 L0,-120" />
            <path opacity="0.4" d="M2,-30 C 6,-55 8,-80 2,-105" />
            <path opacity="0.4" d="M-2,-30 C -6,-55 -8,-80 -2,-105" />
          </g>
          {#each [60, 120, 180, 240, 300] as deg}
            <g transform="rotate({deg})">
              <path d="M0,0 C 13,-42 20,-88 3,-130 C -15,-88 -10,-42 0,0" />
              <path opacity="0.4" d="M0,-10 L0,-120" />
              <path opacity="0.4" d="M2,-30 C 6,-55 8,-80 2,-105" />
              <path opacity="0.4" d="M-2,-30 C -6,-55 -8,-80 -2,-105" />
            </g>
          {/each}
        </g>
        <!-- 6 stamens: 5 routes + hollow Fig.00 inverter -->
        <g fill="none" stroke="currentColor" stroke-width="0.8">
          <path d="M0,0 C 38,-62 78,-115 120,-148" />
          <circle cx="120" cy="-148" r="2.6" fill="currentColor" stroke="none" />
          <path d="M0,0 C 69,-22 125,-40 172,-43" />
          <circle cx="172" cy="-43" r="2.6" fill="currentColor" stroke="none" />
          <path d="M0,0 C 50,52 95,92 130,115" />
          <circle cx="130" cy="115" r="2.6" fill="currentColor" stroke="none" />
          <path d="M0,0 C -50,52 -95,92 -130,115" />
          <circle cx="-130" cy="115" r="2.6" fill="currentColor" stroke="none" />
          <path d="M0,0 C -69,-22 -125,-40 -172,-43" />
          <circle cx="-172" cy="-43" r="2.6" fill="currentColor" stroke="none" />
          <path d="M0,0 C -38,-62 -78,-115 -120,-148" />
          <circle cx="-120" cy="-148" r="2.6" fill="none" stroke="currentColor" stroke-width="0.9" />
          <circle r="4.5" stroke-width="0.9" />
        </g>
      </g>
    </g>
  </svg>
</div>

<style>
  .plate {
    position: absolute; inset: 0; display: grid; place-items: center;
    color: var(--ink); pointer-events: none;
  }
  .fig {
    width: min(92vmin, 700px); height: min(92vmin, 700px);
  }
  .breathe {
    transform-box: fill-box; transform-origin: center;
    animation: breathe 7s ease-in-out infinite;
  }
  @keyframes breathe {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.025); }
  }
  @media (prefers-reduced-motion: reduce) {
    .breathe { animation: none; }
  }
</style>
