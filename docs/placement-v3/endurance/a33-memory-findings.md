# A33 Placement v3 Memory Findings

Date: 2026-05-20

## Node Runner Memory

100-run local/session campaign:

- Heap start: 13.24 MB
- Heap end: 13.71 MB
- Net change: +0.47 MB

Final 25-run stability batch:

- Heap start: 13.40 MB
- Heap end: 17.11 MB
- Net change: +3.71 MB

The 100-run campaign did not show accumulating heap growth. The shorter final
25-run batch ended higher, but it was a fast single process run without forced
GC, so this is not enough evidence to call a leak. It should be watched in a
longer wall-clock staging burn-in with provider calls enabled.

## Browser Monitor

Added `src/lib/placement/v3/enduranceMemoryMonitor.ts`.

It tracks:

- JS heap snapshots when exposed by Chromium.
- active event listeners patched through `EventTarget`.
- unresolved timers patched through `setTimeout`, `setInterval`,
  `clearTimeout`, and `clearInterval`.
- active fetch count and total fetch count.
- placement-related localStorage and sessionStorage keys.

The monitor is intentionally opt-in and does not change production placement
behavior unless installed by a harness.

## Current Finding

No deterministic memory leak was proven in local/session-mode. Real browser
heap growth under production network latency remains an open staging concern.

