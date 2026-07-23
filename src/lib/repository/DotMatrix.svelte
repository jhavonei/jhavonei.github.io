<script lang="ts">
  import { contributionLevels, type ContribDay } from './githubClient';
  let { days } = $props<{ days: ContribDay[] }>();
  const RADII = [0.7, 1.2, 1.7, 2.3, 2.9];
  const weeks = $derived.by(() => {
    const w: ContribDay[][] = [];
    for (let i = 0; i < days.length; i += 7) w.push(days.slice(i, i + 7));
    return w;
  });
</script>

<svg class="matrix" viewBox="0 0 {weeks.length * 10} 76" role="img"
  aria-label="One year of contributions as a dot matrix">
  {#each weeks as week, x}
    {#each week as day, y}
      <circle cx={x * 10 + 5} cy={y * 10 + 8} r={RADII[contributionLevels(day.count)]}
        fill="currentColor" opacity={day.count === 0 ? 0.18 : 0.9}>
        <title>{day.date}: {day.count}</title>
      </circle>
    {/each}
  {/each}
</svg>

<style>
  .matrix { width: 100%; color: var(--ink); border: 1px solid var(--hairline); padding: 8px; }
</style>
