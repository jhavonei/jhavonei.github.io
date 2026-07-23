<script lang="ts">
  import type { GhProfile } from './githubClient';
  let { profile } = $props<{ profile: GhProfile }>();
  const joined = $derived(new Date(profile.created_at).getFullYear());
</script>

<div class="card">
  <div class="halftone"><img src={profile.avatar_url} alt="" loading="lazy" /></div>
  <div class="fields">
    <div class="row sub"><span class="label">Handle</span><span>@{profile.login}</span></div>
    <div class="row sub"><span class="label">Catalogued</span><span>{joined}</span></div>
    <div class="row sub"><span class="label">Followers</span><span>{profile.followers}</span></div>
    <div class="row sub"><span class="label">Public specimens</span><span>{profile.public_repos}</span></div>
  </div>
</div>

<style>
  .card { display: flex; gap: 24px; align-items: flex-start; border: 1px solid var(--hairline-strong); padding: 18px; }
  .halftone { width: 96px; height: 96px; overflow: hidden; border: 1px solid var(--hairline-strong); position: relative; }
  .halftone img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(1) contrast(1.15); }
  .halftone::after {
    content: ''; position: absolute; inset: 0;
    background-image: radial-gradient(var(--paper) 1px, transparent 1px);
    background-size: 4px 4px; mix-blend-mode: multiply;
  }
  :global(html.white) .halftone::after { mix-blend-mode: screen; }
  .fields { flex: 1; }
</style>
