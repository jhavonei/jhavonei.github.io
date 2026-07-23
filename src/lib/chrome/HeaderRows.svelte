<script lang="ts">
  import { site } from '$lib/config/site';
  let { doc, figLabel } = $props<{ doc: string; figLabel: string }>();
</script>

<header>
  <div class="row">
    <span>{site.name}</span>
    <span class="mid">{site.identityLine}</span>
    <span>{site.year}</span>
  </div>
  <div class="row sub">
    <span>{doc}</span>
    <span class="mid">{figLabel}</span>
    <span aria-hidden="true">●</span>
  </div>
</header>
