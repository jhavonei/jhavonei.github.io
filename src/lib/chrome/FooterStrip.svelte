<script lang="ts">
  import { ROUTES } from '$lib/config/routes';
  import { mode } from '$lib/systems/mode.svelte';
  import { page } from '$app/state';
  import { toggleSound } from '$lib/systems/sound';
  let on = $state(false);
</script>

<footer class="strip">
  <nav aria-label="Catalogue">
    {#each ROUTES as r}
      <a href={r.path} aria-current={page.url.pathname === r.path ? 'page' : undefined}
        >Fig.0{r.fig} {r.short}</a>
    {/each}
  </nav>
  <div class="ops">
    <button class="seal" onclick={() => mode.toggle()}>Fig.00 ⇄ {mode.current === 'black' ? 'White' : 'Black'}</button>
    <button class="seal" onclick={() => (on = toggleSound())} aria-pressed={on}>Sound {on ? '●' : '○'}</button>
  </div>
  <div class="colophon label">BLACKWHITE · JHAVONEI.ME · ALL OVER THE WORLD</div>
</footer>

<style>
  .strip {
    display: flex; flex-wrap: wrap; gap: 10px 22px; align-items: baseline;
    border-top: 1px solid var(--hairline-strong);
    padding: 10px 0 4px; margin-top: 40px;
    font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.14em;
  }
  nav { display: flex; flex-wrap: wrap; gap: 4px 18px; }
  nav a { color: var(--ink-faint); }
  nav a:hover, nav a[aria-current='page'] { color: var(--ink-strong); }
  .ops { display: flex; gap: 10px; margin-left: auto; }
  .colophon { flex-basis: 100%; color: var(--ink-faint); }
</style>
