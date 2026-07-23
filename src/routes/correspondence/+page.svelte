<script lang="ts">
  import DocumentPage from '$lib/doc/DocumentPage.svelte';
  import Stamp from '$lib/chrome/Stamp.svelte';
  import { ROUTES } from '$lib/config/routes';
  import { site } from '$lib/config/site';
  const route = ROUTES[3];
  let sending = $state(false);
  let result: 'ok' | 'fail' | null = $state(null);

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    if (!site.formspreeEndpoint) return;
    sending = true; result = null;
    try {
      const res = await fetch(site.formspreeEndpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(e.target as HTMLFormElement)
      });
      result = res.ok ? 'ok' : 'fail';
      if (res.ok) (e.target as HTMLFormElement).reset();
    } catch { result = 'fail'; }
    sending = false;
  }
</script>

<DocumentPage
  {route}
  subtitle="Channels · all monitored"
  description="Correspondence with Jhavonei — email, transmission form, and the stamped index of socials. Available all over the world.">
  <div class="channels">
    <div class="row"><span>Email on</span><a class="mid strong" href={`mailto:${site.email}`}>{site.email.toUpperCase()}</a><span></span></div>
    <div class="row"><span>Availability</span><span class="mid">{site.availabilityLine}</span><span></span></div>
    {#each site.socials as s}
      <div class="row sub"><span>{s.name}</span><a class="mid" href={s.url} rel="me noopener" target="_blank">{s.url.replace('https://', '').toUpperCase()} ↗</a><span></span></div>
    {/each}
  </div>

  {#if site.formspreeEndpoint}
    <form class="transmit" onsubmit={submit} aria-label="Transmission form">
      <h2 class="label">Transmit below</h2>
      <label class="frow"><span class="label">From (email)</span><input name="email" type="email" required /></label>
      <label class="frow"><span class="label">Subject</span><input name="subject" type="text" required /></label>
      <label class="frow"><span class="label">Message</span><textarea name="message" rows="6" required></textarea></label>
      <button class="seal" disabled={sending}>{sending ? 'Transmitting…' : 'Transmit'}</button>
      <div aria-live="polite" class="result">
        {#if result === 'ok'}<Stamp>Transmission received — expect correspondence</Stamp>{/if}
        {#if result === 'fail'}<span class="label">Transmission failed — use <a href={`mailto:${site.email}`}>{site.email}</a></span>{/if}
      </div>
    </form>
  {:else}
    <p class="label">The transmission form is sealed until its relay is configured — write to <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
  {/if}
</DocumentPage>

<style>
  .channels { margin-bottom: 34px; }
  .channels .strong { color: var(--ink-strong); }
  .transmit { max-width: 560px; display: grid; gap: 16px; }
  .frow { display: grid; gap: 4px; }
  input, textarea {
    background: transparent; border: none; border-bottom: 1px solid var(--hairline-strong);
    color: var(--ink-strong); font-family: var(--font-mono); font-size: 13px; padding: 6px 2px;
  }
  input:focus, textarea:focus { outline: none; border-bottom-color: var(--accent); }
  .transmit .seal { justify-self: start; }
  .result { min-height: 28px; }
</style>
