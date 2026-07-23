import { describe, expect, it } from 'vitest';
import { ROUTES, directionFor, routeByPath } from './routes';
import { STAMEN_DIRS } from '$lib/three/anatomy';
import { openingLines } from './copy';

describe('route registry', () => {
  it('defines five routes with unique figs 1..5 and docs', () => {
    expect(ROUTES).toHaveLength(5);
    expect(new Set(ROUTES.map((r) => r.fig))).toEqual(new Set([1, 2, 3, 4, 5]));
    expect(new Set(ROUTES.map((r) => r.doc)).size).toBe(5);
  });
  it('every route has an opening line', () => {
    for (const r of ROUTES) expect(openingLines[r.openingKey]).toBeTruthy();
  });
  it('directionFor returns the stamen unit vector, and up for unknown', () => {
    expect(directionFor('/work')).toEqual([...STAMEN_DIRS[1]]);
    expect(directionFor('/notes/some-slug')).toEqual([...STAMEN_DIRS[2]]);
    expect(directionFor('/nope')).toEqual([0, 1]);
  });
  it('stamen dirs are unit length', () => {
    for (const [x, y] of STAMEN_DIRS) expect(Math.hypot(x, y)).toBeCloseTo(1, 1);
  });
  it('routeByPath matches nested paths', () => {
    expect(routeByPath('/notes/n001')?.fig).toBe(2);
  });
});
