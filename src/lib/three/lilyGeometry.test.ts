import { describe, expect, it } from 'vitest';
import { buildLily, FILAMENT } from './lilyGeometry';
import { STAMEN_LEN } from './anatomy';

describe('buildLily', () => {
  const lily = buildLily(10_000, 7);
  it('produces exactly the requested count', () => {
    expect(lily.count).toBe(10_000);
    expect(lily.positions.length).toBe(30_000);
    expect(lily.grays.length).toBe(10_000);
    expect(lily.filament.length).toBe(10_000);
  });
  it('is deterministic for a given seed', () => {
    const again = buildLily(10_000, 7);
    expect(again.positions[0]).toBe(lily.positions[0]);
    expect(again.positions[29_999]).toBe(lily.positions[29_999]);
  });
  it('exports six stamen tips at full reach', () => {
    expect(lily.tips).toHaveLength(6);
    for (const [x, y] of lily.tips) {
      expect(Math.hypot(x, y)).toBeGreaterThan(STAMEN_LEN * 0.85);
    }
  });
  it('roughly honors the point budget (≈70% petals)', () => {
    let petals = 0;
    for (const f of lily.filament) if (f === FILAMENT.PETALS) petals++;
    expect(petals / lily.count).toBeGreaterThan(0.6);
    expect(petals / lily.count).toBeLessThan(0.8);
  });
  it('keeps grays in a monochrome band', () => {
    for (let i = 0; i < 200; i++) {
      expect(lily.grays[i]).toBeGreaterThanOrEqual(0.4);
      expect(lily.grays[i]).toBeLessThanOrEqual(1.0);
    }
  });
});
