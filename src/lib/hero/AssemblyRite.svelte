<script lang="ts">
  import { onMount } from 'svelte';
  import { hasVisited, markVisited, prefersReducedMotion } from '$lib/systems/prefs';

  export type RitePhase = 'paper' | 'chrome' | 'particles' | 'rings' | 'callouts' | 'idle';

  let {
    enabled = true,
    onphase = (_: RitePhase) => {},
    assemble = async (_ms: number) => {},
    finish = () => {}
  } = $props<{
    enabled?: boolean;
    onphase?: (p: RitePhase) => void;
    assemble?: (ms: number) => Promise<void>;
    finish?: () => void;
  }>();

  let done = false;
  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

  async function run() {
    const quick = hasVisited();
    const t = (full: number, abbrev: number) => (quick ? abbrev : full);
    onphase('paper'); await wait(t(300, 100));
    if (done) return;
    onphase('chrome'); await wait(t(600, 150));
    if (done) return;
    onphase('particles'); await assemble(t(1500, 600));
    if (done) return;
    onphase('rings'); await wait(t(500, 100));
    if (done) return;
    onphase('callouts'); await wait(t(600, 100));
    if (done) return;
    onphase('idle');
    markVisited();
  }

  function skip() {
    if (done) return;
    done = true;
    finish();
    onphase('idle');
    markVisited();
  }

  onMount(() => {
    if (!enabled || prefersReducedMotion()) { skip(); return; }
    run().then(() => (done = true));
    const onKey = () => skip();
    const onClick = () => skip();
    addEventListener('keydown', onKey);
    addEventListener('pointerdown', onClick, { capture: true });
    return () => {
      done = true;
      removeEventListener('keydown', onKey);
      removeEventListener('pointerdown', onClick, { capture: true } as EventListenerOptions);
    };
  });
</script>
