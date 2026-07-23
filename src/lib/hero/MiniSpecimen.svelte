<script lang="ts">
  import { onMount } from 'svelte';
  import { mode } from '$lib/systems/mode.svelte';
  import { prefersReducedMotion } from '$lib/systems/prefs';
  import { mulberry32 } from '$lib/three/rng';

  type Variant = 'faber' | 'vagans' | 'aurata' | 'nuntia' | 'radix';
  interface Pt { x: number; y: number; g: number; f: number; u: number; ph: number; r0: number }
  interface Frame { x: number; y: number; g: number; size: number }

  let { variant, size = 120 }: { variant: Variant; size?: number } = $props();
  let host: HTMLCanvasElement;

  // ── miniature lily sampler (2D, ~850 pts, deterministic) ──
  function sampleLily(rng: () => number): Pt[] {
    const pts: Pt[] = [];
    const PET = 0.62, W = 0.3, STAM = 0.95;
    for (let i = 0; i < 620; i++) {
      const k = i % 6, th = Math.PI / 2 + (k * Math.PI) / 3;
      const u = Math.pow(rng(), 0.7);
      const w = W * Math.sin(Math.PI * Math.min(u * 1.05, 1)) * (1 - 0.35 * u);
      const roll = rng();
      let v: number, g: number;
      if (roll < 0.44) { v = (roll < 0.22 ? 1 : -1) * (w / 2) * (0.97 + 0.06 * rng()); g = 0.65 + 0.3 * rng(); }
      else if (roll < 0.56) { v = (rng() - 0.5) * w * 0.06; g = 0.5 + 0.2 * rng(); }
      else { v = (rng() * 2 - 1) * w * 0.44; g = 0.2 + 0.15 * rng(); }
      const r = u * PET;
      pts.push({ x: Math.cos(th) * r - Math.sin(th) * v, y: Math.sin(th) * r + Math.cos(th) * v, g, f: 6, u, ph: rng() * Math.PI * 2, r0: 0 });
    }
    for (let s = 0; s < 6; s++) {
      const th = Math.PI / 2 + Math.PI / 6 + (s * Math.PI) / 3;
      for (let i = 0; i < 26; i++) {
        const u = i / 25, r = u * STAM, bow = 0.05 * Math.sin(Math.PI * u);
        pts.push({ x: Math.cos(th) * r - Math.sin(th) * bow, y: Math.sin(th) * r + Math.cos(th) * bow, g: 0.85, f: s, u, ph: rng() * Math.PI * 2, r0: 0 });
      }
      for (let i = 0; i < 12; i++) {
        const a = rng() * Math.PI * 2, rr = rng() * 0.035;
        pts.push({ x: Math.cos(th) * STAM + Math.cos(a) * rr, y: Math.sin(th) * STAM + Math.sin(a) * rr, g: 0.9, f: s, u: 1, ph: rng() * Math.PI * 2, r0: 0 });
      }
    }
    for (const p of pts) p.r0 = Math.hypot(p.x, p.y);
    return pts;
  }

  // ── varieties: passive motion only, no state ──
  const varieties: Record<Variant, (p: Pt, t: number) => Frame> = {
    faber(p, t) {
      const rot = t * 0.12, br = 1 + 0.035 * Math.sin((t * 2 * Math.PI) / 6);
      const c = Math.cos(rot), s = Math.sin(rot);
      return { x: (p.x * c - p.y * s) * br, y: (p.x * s + p.y * c) * br, g: p.g, size: 1 };
    },
    vagans(p, t) {
      const cycle = (Math.sin((t * 2 * Math.PI) / 12 - Math.PI / 2) + 1) / 2;
      const amt = Math.pow(cycle, 1.6) * 0.16;
      return { x: p.x + Math.sin(t * 0.7 + p.ph) * amt, y: p.y + Math.cos(t * 0.6 + p.ph * 1.3) * amt, g: p.g * (1 - amt * 1.6), size: 1 };
    },
    aurata(p, t) {
      const wave = Math.sin(t * 1.4 - p.r0 * 5.5);
      const lift = Math.max(0, wave);
      return { x: p.x * (1 + 0.02 * lift), y: p.y * (1 + 0.02 * lift), g: p.g * (0.55 + 0.5 * lift), size: 1 + 0.5 * lift };
    },
    nuntia(p, t) {
      let g = p.g, sz = 1;
      if (p.f < 6) {
        const head = (t / 2.2 + p.f * 0.37) % 1.25;
        const d = Math.abs(p.u - head);
        if (d < 0.09) { g = Math.min(1, p.g + (1 - d / 0.09)); sz = 1 + (1 - d / 0.09) * 1.4; }
        else g = p.g * 0.55;
      } else g = p.g * (0.8 + 0.2 * Math.sin(t * 0.9));
      return { x: p.x, y: p.y, g, size: sz };
    },
    radix(p, t) {
      const cycle = (Math.sin((t * 2 * Math.PI) / 9 - Math.PI / 2) + 1) / 2;
      const snap = Math.pow(cycle, 2.2) * 0.85;
      const grid = 0.13;
      const gx = Math.round(p.x / grid) * grid, gy = Math.round(p.y / grid) * grid;
      return { x: p.x + (gx - p.x) * snap, y: p.y + (gy - p.y) * snap, g: p.g * (1 - snap * 0.25), size: 1 + snap * 0.4 };
    }
  };

  onMount(() => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const S = size * dpr;
    host.width = S; host.height = S;
    const ctx = host.getContext('2d');
    if (!ctx) return;
    const pts = sampleLily(mulberry32(7));
    const half = S / 2, scale = S * 0.46;
    const motion = varieties[variant];
    const reduced = prefersReducedMotion();
    let raf = 0;
    const t0 = performance.now();

    const draw = (t: number) => {
      // WHITE mode (dark ink on light paper) needs a raised alpha floor and
      // slightly larger points, or the dim wash reads as nothing at all.
      const white = mode.current === 'white';
      const ink = white ? '28,28,26' : '200,200,196';
      const alpha = (g: number) => (white ? 0.3 + 0.7 * Math.min(1, g) : Math.min(1, g));
      const sizeGain = white ? 1.25 : 1;
      ctx.clearRect(0, 0, S, S);
      for (const p of pts) {
        const m = motion(p, t);
        ctx.fillStyle = `rgba(${ink},${alpha(m.g)})`;
        const r = Math.max(1, (S / 360) * 0.9) * m.size * sizeGain;
        ctx.fillRect(half + m.x * scale - r / 2, half - m.y * scale - r / 2, r, r);
      }
    };

    if (reduced) { draw(0); return; }
    const frame = () => {
      draw((performance.now() - t0) / 1000);
      raf = requestAnimationFrame(frame);
    };
    frame();
    return () => cancelAnimationFrame(raf);
  });
</script>

<canvas bind:this={host} style="width: {size}px; height: {size}px" aria-hidden="true"></canvas>
