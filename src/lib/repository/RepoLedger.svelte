<script lang="ts">
  import type { GhRepo } from './githubClient';
  let { repos } = $props<{ repos: GhRepo[] }>();
  const ago = (iso: string) => {
    const d = Math.round((Date.now() - +new Date(iso)) / 86_400_000);
    return d === 0 ? 'today' : d === 1 ? '1 day ago' : d < 30 ? `${d} days ago` : d < 365 ? `${Math.round(d / 30)} mo ago` : `${Math.round(d / 365)} y ago`;
  };
</script>

<div class="rledger">
  {#each repos as r (r.name)}
    <a class="rrow" href={r.html_url} target="_blank" rel="noopener">
      <span class="t">{r.name}</span>
      <span class="c">{r.language ?? '—'}</span>
      <span class="c">★ {r.stargazers_count}</span>
      <span class="y">{ago(r.pushed_at)}</span>
    </a>
  {/each}
</div>

<style>
  .rledger { border-top: 1px solid var(--hairline-strong); }
  .rrow {
    display: grid; grid-template-columns: 1fr 140px 80px 110px; gap: 14px;
    padding: 11px 6px; border-bottom: 1px solid var(--hairline);
    text-transform: uppercase; letter-spacing: 0.06em; color: inherit;
  }
  .rrow:hover { background: color-mix(in srgb, var(--ink) 6%, transparent); }
  .rrow .t { color: var(--ink-strong); font-weight: 500; }
  .rrow .c, .rrow .y { color: var(--ink-faint); font-size: 11px; }
  @media (max-width: 640px) { .rrow { grid-template-columns: 1fr 80px; } .rrow .c:first-of-type, .rrow .y { display: none; } }
</style>
