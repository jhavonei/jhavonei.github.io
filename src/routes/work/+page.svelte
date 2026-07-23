<script lang="ts">
  import DocumentPage from '$lib/doc/DocumentPage.svelte';
  import Ledger from '$lib/doc/Ledger.svelte';
  import { ROUTES } from '$lib/config/routes';
  import { workEntries } from '$lib/content';
  const route = ROUTES[0];
</script>

<DocumentPage
  {route}
  subtitle={`Catalogue of built things · ${workEntries.length} entries · 2 slots pending`}
  description="Catalogued projects of Jhavonei — instruments, experiments, and tooling, indexed and pressed into the record.">
  <Ledger entries={workEntries} />
</DocumentPage>
