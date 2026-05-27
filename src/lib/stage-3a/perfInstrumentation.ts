/**
 * Stage 3A — Performance instrumentation.
 *
 * Lightweight duration measurement + Sentry breadcrumbs around the
 * two hot paths in the "What I'm Weak At" surface:
 *
 *   1. `aggregateLocalWeaknesses()` — pure read of three localStorage
 *      buckets. Should be sub-millisecond on healthy storage.
 *   2. `<LocalWeaknessMap />` mount-to-first-paint — driven by the
 *      aggregator plus any per-row rendering work.
 *
 * If either path breaches its threshold (50 ms / 100 ms respectively),
 * we emit a Sentry breadcrumb. We never emit a captureException — the
 * adapters already tolerate corrupted localStorage and return safe
 * defaults; a slow run is a degraded-but-working state, not an error.
 *
 * Hard privacy invariants:
 *   - Breadcrumb data is bucket SIZES + duration only. Never the tag
 *     strings, never user-content payloads, never user IDs.
 *   - No tracking events / analytics / network calls. Sentry
 *     breadcrumbs are client-only by design; they only travel to
 *     Sentry alongside a real captureException, of which Stage 3A
 *     emits zero.
 */

import { addBreadcrumb } from "../monitoring/captureException.js";

import {
  aggregateLocalWeaknesses,
  type LocalWeaknessMap,
} from "./aggregator.js";

/** Milliseconds. Aggregator should be near-zero; >50 ms means the
 * localStorage ring buffers have grown pathological or the JSON parse
 * is dragging. Worth one breadcrumb so we can spot it in Sentry. */
export const AGGREGATOR_SLOW_THRESHOLD_MS = 50;

/** Milliseconds. UI mount-to-first-paint floor. Above this we want a
 * breadcrumb to investigate; the screen is one scroll-stop so even a
 * 100 ms render is notable. */
export const UI_MOUNT_SLOW_THRESHOLD_MS = 100;

/** Stable Sentry category strings — kept here so the test can assert
 * against them without duplicating literals. */
export const PERF_BREADCRUMB_CATEGORY = {
  aggregator: "stage3a.perf.aggregator",
  uiMount: "stage3a.perf.ui_mount",
} as const;

/**
 * Counts-only breadcrumb payload. Never carries the raw signal:
 * `l1Count` is the length of the L1 ring buffer (not the tag
 * strings); `placementCount` is the size of the placement snapshot's
 * `weaknesses` array; `pronunciationCount` is the length of the
 * pronunciation ring buffer.
 */
export interface AggregatorPerfData {
  durationMs: number;
  l1Count: number;
  placementCount: number;
  pronunciationCount: number;
}

/**
 * Instrumented wrapper around the pure `aggregateLocalWeaknesses`.
 *
 * Callers preferring the un-instrumented function (e.g. server-side
 * code, tests that fake the clock) can still import the original from
 * `./aggregator`. Production reads should go through this wrapper so
 * Sentry sees breadcrumbs on pathological local storage.
 */
export function aggregateLocalWeaknessesInstrumented(): LocalWeaknessMap {
  const start = nowMs();
  const map = aggregateLocalWeaknesses();
  const durationMs = nowMs() - start;

  if (durationMs > AGGREGATOR_SLOW_THRESHOLD_MS) {
    addBreadcrumb({
      category: PERF_BREADCRUMB_CATEGORY.aggregator,
      level: "warning",
      message: "stage3a aggregator slow",
      data: {
        durationMs: Math.round(durationMs),
        l1Count: map.topL1Patterns.length,
        placementCount: map.placementWeaknesses.length,
        pronunciationCount: map.topPronunciationPainPoints.length,
      } satisfies AggregatorPerfData,
    });
  }

  return map;
}

/**
 * Emit a breadcrumb for a UI mount-to-first-paint measurement.
 *
 * Exposed as a standalone helper so the UI component (lands in a
 * sibling PR) can call it from a `useEffect(() => { … }, [])` without
 * coupling this file to React. Keeping this React-free means the
 * server-side renderers and tests don't need to mount anything.
 *
 *   const start = performance.now();
 *   useEffect(() => {
 *     reportUiMountPerf(performance.now() - start);
 *   }, []);
 */
export function reportUiMountPerf(durationMs: number): void {
  if (!Number.isFinite(durationMs) || durationMs <= UI_MOUNT_SLOW_THRESHOLD_MS) {
    return;
  }
  addBreadcrumb({
    category: PERF_BREADCRUMB_CATEGORY.uiMount,
    level: "warning",
    message: "stage3a ui mount slow",
    data: { durationMs: Math.round(durationMs) },
  });
}

function nowMs(): number {
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    return performance.now();
  }
  return Date.now();
}
