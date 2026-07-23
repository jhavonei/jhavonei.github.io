import { isSoundArmed, setSoundArmed } from './prefs';

let ctx: AudioContext | null = null;
let droneNodes: { gain: GainNode } | null = null;
let armed = false;

function ensureCtx(): AudioContext | null {
  if (typeof AudioContext === 'undefined') return null;
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function startDrone(c: AudioContext) {
  const gain = c.createGain();
  gain.gain.value = 0;
  gain.connect(c.destination);
  for (const [freq, g] of [[55, 0.012], [55.4, 0.009], [110.2, 0.004]] as const) {
    const o = c.createOscillator();
    o.type = 'sine'; o.frequency.value = freq;
    const og = c.createGain(); og.gain.value = g;
    o.connect(og).connect(gain); o.start();
  }
  const noise = c.createBufferSource();
  const buf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.3;
  noise.buffer = buf; noise.loop = true;
  const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 120;
  const ng = c.createGain(); ng.gain.value = 0.02;
  noise.connect(lp).connect(ng).connect(gain); noise.start();
  gain.gain.linearRampToValueAtTime(1, c.currentTime + 2);
  droneNodes = { gain };
}

/** One-shot helpers — silent when not armed. */
function blip(build: (c: AudioContext, out: GainNode) => void, peak: number, ms: number) {
  if (!armed) return;
  const c = ensureCtx(); if (!c) return;
  const out = c.createGain();
  out.gain.setValueAtTime(peak, c.currentTime);
  out.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + ms / 1000);
  out.connect(c.destination);
  build(c, out);
}

export const hoverSound = () => blip((c, out) => {
  const n = c.createBufferSource();
  const b = c.createBuffer(1, c.sampleRate * 0.09, c.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  n.buffer = b;
  const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 5200; bp.Q.value = 2;
  n.connect(bp).connect(out); n.start();
}, 0.05, 90);

export const navSound = () => blip((c, out) => {
  const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = 180;
  o.frequency.exponentialRampToValueAtTime(70, c.currentTime + 0.12);
  o.connect(out); o.start(); o.stop(c.currentTime + 0.14);
}, 0.22, 140);

export const whumphSound = () => blip((c, out) => {
  const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = 60;
  o.connect(out); o.start(); o.stop(c.currentTime + 0.45);
}, 0.3, 420);

export function isArmed() { return armed; }
/** Must be called from a user gesture. */
export function toggleSound(): boolean {
  armed = !armed;
  setSoundArmed(armed);
  if (armed) {
    const c = ensureCtx();
    if (c && !droneNodes) startDrone(c);
    if (c && droneNodes) droneNodes.gain.gain.linearRampToValueAtTime(1, c.currentTime + 1);
  } else if (ctx && droneNodes) {
    droneNodes.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
  }
  return armed;
}
/** Persisted preference is written by toggleSound via setSoundArmed; audio always
 *  starts disarmed on a fresh visit because the AudioContext needs a user gesture. */
export const wasPreviouslyArmed = () => isSoundArmed();
