import { beforeEach, describe, expect, it } from 'vitest';
import { createMode } from './mode.svelte';

describe('mode store', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });
  it('defaults to black even if OS prefers light', () => {
    const m = createMode();
    m.init();
    expect(m.current).toBe('black');
    expect(document.documentElement.classList.contains('white')).toBe(false);
  });
  it('toggle flips to white, sets class, persists', () => {
    const m = createMode();
    m.init();
    m.toggle();
    expect(m.current).toBe('white');
    expect(document.documentElement.classList.contains('white')).toBe(true);
    expect(localStorage.getItem('jhv:mode')).toBe('white');
  });
  it('init restores persisted white', () => {
    localStorage.setItem('jhv:mode', 'white');
    const m = createMode();
    m.init();
    expect(m.current).toBe('white');
    expect(document.documentElement.classList.contains('white')).toBe(true);
  });
});
