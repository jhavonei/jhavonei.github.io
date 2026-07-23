<script lang="ts">
  import DocumentPage from '$lib/doc/DocumentPage.svelte';
  import ProfileCard from '$lib/repository/ProfileCard.svelte';
  import DotMatrix from '$lib/repository/DotMatrix.svelte';
  import RepoLedger from '$lib/repository/RepoLedger.svelte';
  import { getContributions, getProfile, getRepos } from '$lib/repository/githubClient';
  import { ROUTES } from '$lib/config/routes';
  import { site } from '$lib/config/site';
  import { onMount } from 'svelte';
  const route = ROUTES[4];
  const h = site.github.handle;

  let profile = $state<Awaited<ReturnType<typeof getProfile>> | null>(null);
  let days = $state<Awaited<ReturnType<typeof getContributions>> | null>(null);
  let repos = $state<Awaited<ReturnType<typeof getRepos>> | null>(null);
  let failed = $state({ profile: false, days: false, repos: false });

  onMount(() => {
    getProfile(h).then((p) => (profile = p)).catch(() => (failed.profile = true));
    getContributions(h).then((d) => (days = d)).catch(() => (failed.days = true));
    getRepos(h).then((r) => (repos = r)).catch(() => (failed.repos = true));
  });
</script>

<DocumentPage
  {route}
  subtitle={`github.com/${h} · live feed`}
  description="The root system — Jhavonei's GitHub presence: contributions as a dot matrix, public repositories as a ledger.">
  <div class="blocks" aria-live="polite">
    <section>
      <h2 class="label">Specimen ID</h2>
      {#if profile}<ProfileCard {profile} />
      {:else if failed.profile}<p class="label severed">Feed severed — consult the source ↗</p>
      {:else}<div class="skel" style="height: 134px"></div>{/if}
    </section>
    <section>
      <h2 class="label">A year of pressings</h2>
      {#if days}<DotMatrix {days} />
      {:else if failed.days}<p class="label severed">Feed severed — consult the source ↗</p>
      {:else}<div class="skel" style="height: 96px"></div>{/if}
    </section>
    <section>
      <h2 class="label">Public specimens</h2>
      {#if repos}<RepoLedger {repos} />
      {:else if failed.repos}<p class="label severed">Feed severed — consult the source ↗</p>
      {:else}<div class="skel" style="height: 180px"></div>{/if}
    </section>
    <a class="seal cta" href={`https://github.com/${h}`} target="_blank" rel="noopener">Open repository ↗</a>
  </div>
</DocumentPage>

<style>
  .blocks { display: grid; gap: 30px; }
  h2 { margin-bottom: 10px; }
  .skel { border: 1px solid var(--hairline); animation: pulse 1.6s ease-in-out infinite; }
  @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
  .severed { border: 1px dashed var(--hairline-strong); padding: 14px; }
  .cta { justify-self: start; padding: 8px 22px; letter-spacing: 0.2em; }
</style>
