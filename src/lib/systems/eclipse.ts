import { mode } from './mode.svelte';

type EclipseFn = (flicker?: () => void) => Promise<void>;

let impl: EclipseFn | null = null;

/** The root layout's EclipseDisc registers itself here; any Fig.00 control
 *  routes through `request` so inversion is the same rite everywhere.
 *  Falls back to a plain toggle if no disc is mounted (tests, SSR edge). */
export const eclipse = {
  register(fn: EclipseFn): () => void {
    impl = fn;
    return () => { if (impl === fn) impl = null; };
  },
  async request(flicker?: () => void): Promise<void> {
    if (impl) await impl(flicker);
    else mode.toggle();
  }
};
