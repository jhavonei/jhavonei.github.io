const safe = <T>(fn: () => T, fallback: T): T => {
  try { return fn(); } catch { return fallback; }
};
export const hasVisited = () => safe(() => localStorage.getItem('jhv:visited') === '1', false);
export const markVisited = () => safe(() => localStorage.setItem('jhv:visited', '1'), undefined);
export const isSoundArmed = () => safe(() => localStorage.getItem('jhv:sound') === '1', false);
export const setSoundArmed = (v: boolean) => safe(() => localStorage.setItem('jhv:sound', v ? '1' : '0'), undefined);
export const prefersReducedMotion = () =>
  safe(() => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches, false);
