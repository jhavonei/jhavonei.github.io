# Spec / plan deviations

Running log of intentional or forced deviations from the implementation plan.

| When | Task | Deviation | Reason |
|------|------|-----------|--------|
| 2026-07-23 | T2+T3 | Tokens/fonts landed in the same commit as scaffold | Parallel write race; content correct per plan |
| 2026-07-23 | T4–T7 | Phase 1 systems/content batched into fewer commits than plan's per-task commits | Throughput; behavior matches plan |
| 2026-07-23 | T7 | Work frontmatter field `class` → `taxonomy` | mdsvex generates `const { class } = metadata` which is a JS reserved-word parse error. Display label remains "Class:" |
| 2026-07-23 | T8–T27 | Remaining tasks batched into one implementation commit | Same behavior as plan; individual commit messages collapsed for delivery speed |
| 2026-07-23 | T13 | Mode polling in animate loop instead of `$effect` inside async `onMount` | `$effect` must run during component init; async Three.js import is outside that context. Behavior identical |
| 2026-07-23 | T14 | Ring "slows to legible" implemented as pause-on-focus | Plan-documented refinement of spec §3 |
| 2026-07-23 | T14/T17 | Hover row bg uses `color-mix(in srgb, var(--ink) 6%, transparent)` instead of hard-coded `rgba(128,128,128,0.06)` | Keeps monochrome token doctrine |
| 2026-07-23 | T24 | Ring-unwind handoff is OpeningLine typing after particle stream, not a literal text morph | Plan self-review notes this as deliberate v1 polish deferral |
| 2026-07-23 | T27 | Deploy workflow committed; **push and Pages source setting NOT done** | Owner instruction: do not push/deploy without asking |
| 2026-07-23 | env | Node 24.18.0 (plan asked ≥20 LTS) | winget installed current LTS |
| 2026-07-23 | T16 | Eclipse disc uses token hex literals `#e9e7e2` / `#0a0a0a` for opposite paper | Plan requires opposite tone before CSS class flips; values identical to `--paper` twins |
| 2026-07-23 | T23 | StaticPlate uses full Rev.B lily paths from mockup | Completed as plan specified |
| 2026-07-23 | T27 | Deploy workflow present; push not executed | Owner will push after audit |
| 2026-07-23 | spec §3.4 | **Owner decision:** cursor repulsion removed from hero idle physics; continuous `rotation.y = t*0.05` replaced with gentle ±0.1 rad sway | Dispersal made stamen nodes hard to click; bloom now holds form, callouts hold position. Supersedes the frozen-constants contract by owner order |
| 2026-07-23 | spec §6.4 | Public email `hey@jhavonei.me` → `contact@jhavonei.me` | Owner decision |
