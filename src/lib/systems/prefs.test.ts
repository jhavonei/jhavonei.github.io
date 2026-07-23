import { beforeEach, describe, expect, it } from 'vitest';
import { hasVisited, markVisited, isSoundArmed, setSoundArmed, prefersReducedMotion } from './prefs';

describe('prefs', () => {
  beforeEach(() => localStorage.clear());
  it('visited flag round-trips', () => {
    expect(hasVisited()).toBe(false);
    markVisited();
    expect(hasVisited()).toBe(true);
  });
  it('sound armed round-trips and defaults off', () => {
    expect(isSoundArmed()).toBe(false);
    setSoundArmed(true);
    expect(isSoundArmed()).toBe(true);
    setSoundArmed(false);
    expect(isSoundArmed()).toBe(false);
  });
  it('prefersReducedMotion is boolean and safe in jsdom', () => {
    expect(typeof prefersReducedMotion()).toBe('boolean');
  });
});
