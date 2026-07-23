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
      const applyMode = () => {
        const dark = mode.current === 'black';
        material.blending = dark ? THREE.NormalBlending : THREE.AdditiveBlending;
        material.opacity = dark ? 1.0 : 0.8;
        material.color.setHex(dark ? INK.black : INK.white);
        material.needsUpdate = true;
      };
      paintColors();
      applyMode();

      const mouse = { x: 0, y: 0 };
      const onMove = (e: MouseEvent) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      };
      window.addEventListener('mousemove', onMove);

      // phase machine: 'assembling' | 'idle' | 'departing' | 'condensing' | 'hidden'
      let phase: string = 'idle';
      let phaseT0 = 0, phaseMs = 0, phaseDir: [number, number] = [0, 1];
      let phaseDone: (() => void) | null = null;
      const startPhase = (p: string, ms: number) =>
        new Promise<void>((res) => { phase = p; phaseMs = ms; phaseT0 = performance.now(); phaseDone = res; });

      api = {
        assemble: (ms = 1500) => startPhase('assembling', ms),
        finishAssembly: () => { pos.set(orig); vel.fill(0); phase = 'idle'; phaseDone?.(); phaseDone = null; },
        disintegrate: (dir, ms = 700) => { phaseDir = dir; return startPhase('departing', ms); },
        condense: (dir, ms = 700) => {
          phaseDir = dir;
          for (let k = 0; k < n; k++) {
            pos[k * 3] = orig[k * 3] - dir[0] * 8 + (Math.random() - 0.5) * 3;
            pos[k * 3 + 1] = orig[k * 3 + 1] - dir[1] * 8 + (Math.random() - 0.5) * 3;
            pos[k * 3 + 2] = orig[k * 3 + 2] + (Math.random() - 0.5) * 3;
          }
          material.opacity = mode.current === 'black' ? 1.0 : 0.8;
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

        if (phase === 'assembling' || phase === 'condensing') {
          const raw = Math.min((now - phaseT0) / phaseMs, 1);
          for (let k = 0; k < n; k++) {
            const stag = phase === 'assembling' ? (lily.filament[k] % 6) * 0.06 : 0;
            const t = ease(Math.min(Math.max((raw - stag) / (1 - stag || 1), 0), 1));
            if (phase === 'assembling') {
              pos[k * 3] = scatter[k * 3] + (orig[k * 3] - scatter[k * 3]) * t;
              pos[k * 3 + 1] = scatter[k * 3 + 1] + (orig[k * 3 + 1] - scatter[k * 3 + 1]) * t;
              pos[k * 3 + 2] = scatter[k * 3 + 2] + (orig[k * 3 + 2] - scatter[k * 3 + 2]) * t;
            } else {
              pos[k * 3] += (orig[k * 3] - pos[k * 3]) * 0.12;
              pos[k * 3 + 1] += (orig[k * 3 + 1] - pos[k * 3 + 1]) * 0.12;
              pos[k * 3 + 2] += (orig[k * 3 + 2] - pos[k * 3 + 2]) * 0.12;
            }
          }
          if (raw >= 1) { if (phase === 'condensing') pos.set(orig); phase = 'idle'; phaseDone?.(); phaseDone = null; }
        } else if (phase === 'departing') {
          const raw = Math.min((now - phaseT0) / phaseMs, 1);
          for (let k = 0; k < n; k++) {
            const px = pos[k * 3], py = pos[k * 3 + 1];
            const d = Math.hypot(px, py) || 1;
            pos[k * 3] += (px / d) * 0.04 + phaseDir[0] * 0.12;
            pos[k * 3 + 1] += (py / d) * 0.04 + phaseDir[1] * 0.12;
            pos[k * 3 + 2] += 0.06; // toward camera
          }
          material.opacity *= 0.96;
          if (raw >= 1) { phase = 'hidden'; phaseDone?.(); phaseDone = null; }
        } else if (phase === 'idle') {
          // ── WovenLight physics, ported 1:1 (flat arrays) ──
          const mx = mouse.x * 3, my = mouse.y * 3;
          for (let k = 0; k < n; k++) {
            const ix = k * 3, iy = ix + 1, iz = ix + 2;
            const dx = pos[ix] - mx, dy = pos[iy] - my, dz = pos[iz];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (dist < 1.5 && dist > 0) {
              const force = (1.5 - dist) * 0.01;
              vel[ix] += (dx / dist) * force;
              vel[iy] += (dy / dist) * force;
              vel[iz] += (dz / dist) * force;
            }
            vel[ix] += (orig[ix] - pos[ix]) * 0.001;
            vel[iy] += (orig[iy] - pos[iy]) * 0.001;
            vel[iz] += (orig[iz] - pos[iz]) * 0.001;
            vel[ix] *= 0.95; vel[iy] *= 0.95; vel[iz] *= 0.95;
            pos[ix] += vel[ix]; pos[iy] += vel[iy]; pos[iz] += vel[iz];
          }
        }
        geometry.attributes.position.needsUpdate = true;

        points.rotation.y = elapsed * 0.05;                       // contract
        const s = 1 + 0.025 * Math.sin((elapsed * 2 * Math.PI) / 7); // breathing
        points.scale.setScalar(s);

        // project stamen tips → screen px for the callout layer
        const v = new THREE.Vector3();
        const yAxis = new THREE.Vector3(0, 1, 0);
        const tips = lily.tips.map(([x, y, z]) => {
          v.set(x * s, y * s, z * s).applyAxisAngle(yAxis, points.rotation.y).project(camera);
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
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('resize', onResize);
        geometry.dispose(); material.dispose(); renderer.dispose();
        host.contains(renderer.domElement) && host.removeChild(renderer.domElement);
      };
    })();
    return () => { disposed = true; cleanup(); };
  });
</script>

<div class="canvas-host" bind:this={host} aria-hidden="true"></div>

<style>
  .canvas-host { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
</style>
