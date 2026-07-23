import { mulberry32 } from './rng';
import { PETAL_LEN, STAMEN_DIRS, STAMEN_LEN } from './anatomy';

export const FILAMENT = { PETALS: 6, CORE: 7 } as const; // 0..5 = stamen fig index

export interface LilyPointCloud {
  positions: Float32Array; // xyz per point
  grays: Float32Array;     // 0..1 per point
  filament: Uint8Array;    // 0..5 stamen, 6 petals, 7 core/haze
  tips: [number, number, number][]; // world tip per stamen fig 0..5
  count: number;
}

const PETAL_W = 0.3;
const RECURVE = 0.35;
const STAMEN_Z = [0.0, 0.3, 0.5, 0.15]; // bezier z profile (arcs toward camera)

function cubic(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
}

export function buildLily(count = 50_000, seed = 7): LilyPointCloud {
  const rng = mulberry32(seed);
  const positions = new Float32Array(count * 3);
  const grays = new Float32Array(count);
  const filament = new Uint8Array(count);

  const nPetal = Math.floor(count * 0.7);
  const nStamen = Math.floor(count * 0.22);
  const nCore = count - nPetal - nStamen;
  const perStamen = Math.floor(nStamen / 6);

  // precompute stamen bezier control points (xy from dir, z from profile)
  const ctrl = STAMEN_DIRS.map(([dx, dy]) => ({
    x: [0, dx * 0.5, dx * 1.3, dx * STAMEN_LEN],
    y: [0, dy * 0.5, dy * 1.3, dy * STAMEN_LEN],
    z: STAMEN_Z
  }));
  const tips: [number, number, number][] = ctrl.map((c) => [c.x[3], c.y[3], c.z[3]]);

  let i = 0;
  const put = (x: number, y: number, z: number, g: number, f: number) => {
    positions[i * 3] = x; positions[i * 3 + 1] = y; positions[i * 3 + 2] = z;
    grays[i] = g; filament[i] = f; i++;
  };
  const j = () => (rng() - 0.5) * 0.005; // positional jitter (hairline, not fuzz)

  // ── petals: six lanceolate blades drawn as STROKES, not fill ──
  // Sampling mimics the mockup's linework: bright edges + midrib + two side
  // veins carry the form; a dim interior wash gives the pressed-flower body.
  for (let p = 0; p < nPetal; p++) {
    const k = p % 6;
    const th = (Math.PI / 2) + k * (Math.PI / 3);
    const dirX = Math.cos(th), dirY = Math.sin(th);
    const u = Math.pow(rng(), 0.7); // denser at base
    const w = PETAL_W * Math.sin(Math.PI * Math.min(u * 1.05, 1)) * (1 - 0.35 * u);
    const r = u * PETAL_LEN;
    const z = -RECURVE * u * u * (1.8 * u - 0.8); // lifts, then curls behind

    const roll = rng();
    let v: number, g: number;
    if (roll < 0.4) {
      // outline: both edges, razor-tight
      v = (roll < 0.2 ? 1 : -1) * (w / 2) * (0.985 + 0.03 * rng());
      g = 0.62 + 0.3 * rng();
    } else if (roll < 0.52) {
      // midrib
      v = (rng() - 0.5) * w * 0.05;
      g = 0.5 + 0.22 * rng();
    } else if (roll < 0.68) {
      // two side veins at quarter-width
      v = (roll < 0.6 ? 1 : -1) * w * 0.25 * (0.92 + 0.16 * rng());
      g = 0.42 + 0.2 * rng();
    } else {
      // faint interior wash
      v = (rng() * 2 - 1) * w * 0.46;
      g = 0.18 + 0.14 * rng();
    }
    put(dirX * r - dirY * v + j(), dirY * r + dirX * v + j(), z + j(), g, FILAMENT.PETALS);
  }

  // ── stamens: six bezier filaments + anther cluster at tip ──
  for (let s = 0; s < 6; s++) {
    const c = ctrl[s];
    const nAnther = Math.floor(perStamen * 0.25);
    const nFil = perStamen - nAnther;
    for (let q = 0; q < nFil; q++) {
      const t = rng();
      put(cubic(c.x[0], c.x[1], c.x[2], c.x[3], t) + j(),
          cubic(c.y[0], c.y[1], c.y[2], c.y[3], t) + j(),
          cubic(c.z[0], c.z[1], c.z[2], c.z[3], t) + j(),
          0.85 + 0.15 * rng(), s);
    }
    for (let q = 0; q < nAnther; q++) {
      const g = () => (rng() + rng() + rng() - 1.5) * 0.03; // tight anther knot
      put(tips[s][0] + g(), tips[s][1] + g(), tips[s][2] + g(), 0.85 + 0.15 * rng(), s);
    }
  }

  // ── core: a small bright knot at the throat (no scatter fog) ──
  while (i < count) {
    const g = () => (rng() + rng() - 1) * 0.07;
    put(g(), g(), 0.05 + rng() * 0.12, 0.7 + 0.25 * rng(), FILAMENT.CORE);
  }

  return { positions, grays, filament, tips, count };
}
