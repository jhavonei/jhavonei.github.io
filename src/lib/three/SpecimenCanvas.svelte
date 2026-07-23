<script lang="ts">
  import { onMount } from 'svelte';
  import { buildLily, FILAMENT } from './lilyGeometry';
  import { mode } from '$lib/systems/mode.svelte';

  let {
    count = 50_000,
    startScattered = false,
    ontips = (_: { x: number; y: number }[]) => {},
    ondegrade = () => {}
  } = $props<{
    count?: number;
    startScattered?: boolean;
    ontips?: (tips: { x: number; y: number }[]) => void;
    ondegrade?: () => void;
  }>();

  let host: HTMLDivElement;
  let disposed = false;

  // rite/transition API — parent calls via bind:this
  let api: {
    assemble: (ms?: number) => Promise<void>;
    finishAssembly: () => void;
    disintegrate: (dir: [number, number], ms?: number) => Promise<void>;
    condense: (dir: [number, number], ms?: number) => Promise<void>;
    setFocus: (fig: number | null) => void;
    flickerInvert: () => void;
  } | null = $state(null);
  export function getApi() { return api; }

  // Readiness gate: Three.js loads via async import, so parent calls can arrive
  // before `api` exists. Every public method awaits readiness; cleanup resolves
  // the gate too so awaiters never hang if the canvas dies first.
  let readyResolve!: () => void;
  const whenReady = new Promise<void>((r) => (readyResolve = r));
  export async function assemble(ms?: number) { await whenReady; if (disposed) return; return api?.assemble(ms); }
  export async function finishAssembly() { await whenReady; if (disposed) return; api?.finishAssembly(); }
  export async function disintegrate(dir: [number, number], ms?: number) { await whenReady; if (disposed) return; return api?.disintegrate(dir, ms); }
  export async function condense(dir: [number, number], ms?: number) { await whenReady; if (disposed) return; return api?.condense(dir, ms); }
  export async function setFocus(fig: number | null) { await whenReady; if (disposed) return; api?.setFocus(fig); }
  export async function flickerInvert() { await whenReady; if (disposed) return; api?.flickerInvert(); }

  const INK = { black: 0xc8c8c4, white: 0x1c1c1a } as const;

  onMount(() => {
    let cleanup = () => {};
    (async () => {
      const THREE = await import('three');
      if (disposed) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, host.clientWidth / host.clientHeight, 0.1, 1000);
      camera.position.z = 5;
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(host.clientWidth, host.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      host.appendChild(renderer.domElement);

      const lily = buildLily(count);
      const n = lily.count;
      const pos = new Float32Array(lily.positions);           // live
      const orig = lily.positions;                            // rest pose
      const vel = new Float32Array(n * 3);
      const scatter = new Float32Array(n * 3);                // assembly start
      {
        const r = () => (Math.random() - 0.5) * 14;
        for (let k = 0; k < n * 3; k++) scatter[k] = r();
      }
      if (startScattered) pos.set(scatter);
      const colors = new Float32Array(n * 3);
      const focusMul = new Float32Array(n).fill(1);

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.02, vertexColors: true, transparent: true
      });
      const points = new THREE.Points(geometry, material);
      scene.add(points);

      const paintColors = () => {
        for (let k = 0; k < n; k++) {
          const g = lily.grays[k] * focusMul[k];
          colors[k * 3] = g; colors[k * 3 + 1] = g; colors[k * 3 + 2] = g;
        }
        geometry.attributes.color.needsUpdate = true;
      };
      const baseOpacity = () => (mode.current === 'black' ? 1.0 : 0.85);
      const applyMode = () => {
        const dark = mode.current === 'black';
        // NormalBlending in BOTH modes: additive dark-on-light sums past white
        // and renders invisible — dark ink on light paper needs alpha blending.
        material.blending = THREE.NormalBlending;
        material.opacity = baseOpacity();
        material.color.setHex(dark ? INK.black : INK.white);
        material.needsUpdate = true;
      };
      paintColors();
      applyMode();

      // phase machine: 'assembling' | 'idle' | 'departing' | 'condensing' | 'hidden'
      let phase: string = 'idle';
      let phaseT0 = 0, phaseMs = 0, phaseDir: [number, number] = [0, 1];
      let phaseDone: (() => void) | null = null;
      const startPhase = (p: string, ms: number) =>
        new Promise<void>((res) => {
          phaseDone?.(); // a superseded phase must release its awaiter
          phase = p; phaseMs = ms; phaseT0 = performance.now(); phaseDone = res;
        });

      api = {
        assemble: (ms = 1500) => { vel.fill(0); return startPhase('assembling', ms); },
        finishAssembly: () => { pos.set(orig); vel.fill(0); phase = 'idle'; phaseDone?.(); phaseDone = null; },
        // Dive INTO the clicked branch: the world slides opposite the stamen
        // direction and toward the camera, so the chosen tip sweeps through
        // screen center and past the viewer.
        disintegrate: (dir, ms = 900) => { phaseDir = dir; return startPhase('departing', ms); },
        // Arrival home reverses the dive: start displaced inside that branch,
        // settle back to center.
        condense: (dir, ms = 900) => {
          phaseDir = dir;
          pos.set(orig); vel.fill(0);
          return startPhase('condensing', ms);
        },
        setFocus: (fig) => {
          for (let k = 0; k < n; k++) {
            const f = lily.filament[k];
            focusMul[k] = fig == null ? 1 : f === fig ? 1.3 : f === FILAMENT.PETALS || f === FILAMENT.CORE ? 0.85 : 0.7;
          }
          paintColors();
        },
        flickerInvert: () => {
          const dark = mode.current === 'black';
          material.color.setHex(dark ? INK.white : INK.black);
          setTimeout(() => !disposed && applyMode(), 120);
        }
      };
      readyResolve();

      const clock = new THREE.Clock();
      const ease = (t: number) => 1 - Math.pow(1 - t, 3);
      let frames = 0, fpsT0 = performance.now(), degraded = false;
      let lastMode = mode.current;

      const animate = () => {
        if (disposed) return;
        requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();
        const now = performance.now();

        // poll mode (avoid $effect inside async onMount)
        if (mode.current !== lastMode) {
          lastMode = mode.current;
          applyMode();
        }

        if (phase === 'assembling') {
          const raw = Math.min((now - phaseT0) / phaseMs, 1);
          for (let k = 0; k < n; k++) {
            const stag = (lily.filament[k] % 6) * 0.06;
            const t = ease(Math.min(Math.max((raw - stag) / (1 - stag || 1), 0), 1));
            pos[k * 3] = scatter[k * 3] + (orig[k * 3] - scatter[k * 3]) * t;
            pos[k * 3 + 1] = scatter[k * 3 + 1] + (orig[k * 3 + 1] - scatter[k * 3 + 1]) * t;
            pos[k * 3 + 2] = scatter[k * 3 + 2] + (orig[k * 3 + 2] - scatter[k * 3 + 2]) * t;
          }
          if (raw >= 1) {
            vel.fill(0); // lerp ignores velocity — clear residuals or the bloom sheds a dust halo
            phase = 'idle'; phaseDone?.(); phaseDone = null;
          }
        } else if (phase === 'departing') {
          const raw = Math.min((now - phaseT0) / phaseMs, 1);
          const e = raw * raw * raw; // ease-in: the dive accelerates
          points.position.set(-phaseDir[0] * 2.6 * e, -phaseDir[1] * 2.6 * e, 3.8 * e);
          for (let k = 0; k < n; k++) {
            const ix = k * 3, iy = ix + 1;
            const px = pos[ix], py = pos[iy];
            const d = Math.hypot(px, py) || 1;
            pos[ix] += (px / d) * 0.012; // light radial shed for texture
            pos[iy] += (py / d) * 0.012;
          }
          material.opacity = baseOpacity() * (raw < 0.55 ? 1 : Math.max(0, 1 - (raw - 0.55) / 0.45));
          if (raw >= 1) { phase = 'hidden'; phaseDone?.(); phaseDone = null; }
        } else if (phase === 'condensing') {
          const raw = Math.min((now - phaseT0) / phaseMs, 1);
          const remain = Math.pow(1 - raw, 3); // ease-out: the return decelerates
          points.position.set(-phaseDir[0] * 2.6 * remain, -phaseDir[1] * 2.6 * remain, 3.8 * remain);
          material.opacity = baseOpacity() * Math.min(1, raw / 0.4);
          if (raw >= 1) {
            points.position.set(0, 0, 0);
            material.opacity = baseOpacity();
            phase = 'idle'; phaseDone?.(); phaseDone = null;
          }
        } else if (phase === 'idle') {
          // Owner decision 2026-07-23: cursor repulsion removed — the specimen
          // holds its form so the stamen nodes stay stable and clickable.
          // Spring + damping retained so residual velocities settle to rest.
          for (let k = 0; k < n; k++) {
            const ix = k * 3, iy = ix + 1, iz = ix + 2;
            vel[ix] += (orig[ix] - pos[ix]) * 0.001;
            vel[iy] += (orig[iy] - pos[iy]) * 0.001;
            vel[iz] += (orig[iz] - pos[iz]) * 0.001;
            vel[ix] *= 0.95; vel[iy] *= 0.95; vel[iz] *= 0.95;
            pos[ix] += vel[ix]; pos[iy] += vel[iy]; pos[iz] += vel[iz];
          }
        }
        geometry.attributes.position.needsUpdate = true;

        // Owner decision 2026-07-23: continuous rotation replaced with a gentle
        // sway (±0.1 rad) so the bloom stays face-on and callouts hold position.
        points.rotation.y = 0.1 * Math.sin(elapsed * 0.15);
        const s = 1 + 0.025 * Math.sin((elapsed * 2 * Math.PI) / 7); // breathing
        points.scale.setScalar(s);

        // project stamen tips → screen px for the callout layer
        const v = new THREE.Vector3();
        const yAxis = new THREE.Vector3(0, 1, 0);
        const tips = lily.tips.map(([x, y, z]) => {
          v.set(x * s, y * s, z * s).applyAxisAngle(yAxis, points.rotation.y).add(points.position).project(camera);
          return { x: (v.x + 1) / 2 * host.clientWidth, y: (1 - v.y) / 2 * host.clientHeight };
        });
        ontips(tips);

        // fps watchdog (first 90 frames after idle begins)
        if (!degraded && phase === 'idle' && frames < 90) {
          frames++;
          if (frames === 90) {
            const fps = 90 / ((performance.now() - fpsT0) / 1000);
            if (fps < 40 && count <= 12_000) { degraded = true; ondegrade(); }
          }
        } else if (phase !== 'idle') { frames = 0; fpsT0 = performance.now(); }

        renderer.render(scene, camera);
      };
      animate();

      const onResize = () => {
        camera.aspect = host.clientWidth / host.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(host.clientWidth, host.clientHeight);
      };
      window.addEventListener('resize', onResize);

      cleanup = () => {
        window.removeEventListener('resize', onResize);
        geometry.dispose(); material.dispose(); renderer.dispose();
        host.contains(renderer.domElement) && host.removeChild(renderer.domElement);
      };
    })();
    return () => { disposed = true; readyResolve(); cleanup(); };
  });
</script>

<div class="canvas-host" bind:this={host} aria-hidden="true"></div>

<style>
  .canvas-host { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
</style>
