<script lang="ts">
  import DocumentPage from '$lib/doc/DocumentPage.svelte';
  import MiniSpecimen from '$lib/hero/MiniSpecimen.svelte';
  import { ROUTES } from '$lib/config/routes';
  import { site } from '$lib/config/site';
  import { bio, traits } from '$lib/config/copy';
  const route = ROUTES[2];
</script>

<DocumentPage
  {route}
  subtitle="Specimen data · unphotographed"
  description="The author — creative technologist. Classification, habitat, and constitution of the specimen behind the catalogue.">
  <div class="aura">
    <div class="portrait">
      <svg class="aurang" viewBox="0 0 400 400" aria-hidden="true">
        <defs><path id="aring" d="M200,30 A170,170 0 1,1 199.99,30" /></defs>
        <g class="spin">
          <text><textPath href="#aring">{(site.identityLine + ' · ').repeat(4)}</textPath></text>
        </g>
      </svg>
      <div class="plantbox"><MiniSpecimen variant="aurata" size={220} /></div>
      {#each traits as t, i}
        <span class="trait label" style="top: {[8, 26, 50, 72, 88][i]}%; {i % 2 ? 'right: -4%' : 'left: -4%'}">{t}</span>
      {/each}
    </div>
    <div class="data">
      <table class="specdata">
        <tbody>
          <tr><th class="label">Classification</th><td>CREATIVE TECHNOLOGIST</td></tr>
          <tr><th class="label">Habitat</th><td>{site.author.habitat}</td></tr>
          <tr><th class="label">Active since</th><td>{site.author.activeSince}</td></tr>
          <tr><th class="label">Correspondence</th><td><a href="/correspondence">Fig.04 ⟶</a></td></tr>
        </tbody>
      </table>
      {#each bio as p}<p class="biop">{p}</p>{/each}
    </div>
  </div>
</DocumentPage>

<style>
  .aura { display: grid; grid-template-columns: 1fr 1.2fr; gap: 44px; align-items: start; }
  .portrait { position: relative; aspect-ratio: 1; max-width: 420px; }
  .aurang { position: absolute; inset: 0; width: 100%; height: 100%; }
  .aurang text { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.32em; fill: var(--ink-faint); }
  .spin { transform-box: fill-box; transform-origin: center; animation: spin 160s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .plantbox { position: absolute; inset: 0; display: grid; place-items: center; }
  .trait { position: absolute; white-space: nowrap; }
  .specdata { border-collapse: collapse; margin-bottom: 22px; width: 100%; }
  .specdata th, .specdata td { border-bottom: 1px solid var(--hairline); padding: 8px 14px 8px 0; text-align: left; }
  .specdata td { color: var(--ink-strong); letter-spacing: 0.08em; }
  .biop { font-weight: 300; max-width: 58ch; margin-bottom: 1.1em; }
  @media (max-width: 800px) { .aura { grid-template-columns: 1fr; } .trait { display: none; } }
  @media (prefers-reduced-motion: reduce) { .spin { animation: none; } }
</style>
