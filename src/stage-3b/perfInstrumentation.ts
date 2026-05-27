/**
 * Stage 3B — Performance instrumentation.
 *
 * Lightweight duration measurement + Sentry breadcrumbs around the
 * two hot paths in the "Suggested Practice" surface:
 *
 *   1. `selectSuggestedPractice()` — pure derivation of up to 3
 *      practice items from a Stage 3A weakness map. Should be
 *      sub-millisecond on healthy input.
 *   2. `<SuggestedPracticeList />` mount-to-first-paint — driven by
 *      the Stage 3A aggregator (already instrumented separately) plus
 *      this engine plus React's commit cost.
 *
 * If either path breaches its threshold (50 ms / 100 ms respectively),
 * we emit a Sentry breadcrumb. We never emit a `captureException` —
 * the engine returns `[]` rather than throwing on degraded input, so
 * a slow run is a degraded-but-working state, not an error.
 *
 * Hard privacy invariants (inherited from Stage 3A):
 *   - Breadcrumb data is counts + duration only. Never the source
 *     tags, never the rationale strings, never user IDs.
 *   - No tracking events / analytics / network calls. Sentry
 *     breadcrumbs are client-only by design; they only travel to
 *     Sentry alongside a real captureException, of which Stage 3B
 *     emits zero.
 *
 * This file deliberately mirrors `src/lib/stage-3a/perfInstrumentation.ts`
 * line-for-line where it can — same `addBreadcrumb` primitive, same
 * threshold-gated structure, same React-free `reportUiMountPerf`
 * helper shape. Diverging the pattern between 3A and 3B would force
 * future contributors to learn two perf conventions.
 */

import { addBreadcrumb } from "@/lib/monitoring/captureException";

import {
  selectSuggestedPractice,
  type Stage3AState,
} from "./suggestedPractice";
import type { SuggestedPracticeItem } from "./types";

/** Milliseconds. Engine is pure + bounded (≤3 items out, single-pass
 * read of three small arrays); >50 ms means something upstream has
 * grown pathological. Same shape as Stage 3A's aggregator threshold. */
export const ENGINE_SLOW_THRESHOLD_MS = 50;

/** Milliseconds. UI mount-to-first-paint floor. Above this we want a
 * breadcrumb to investigate; the surface is a single 3-row card so
 * even a 100 ms render is notable. */
export const UI_MOUNT_SLOW_THRESHOLD_MS = 100;

/** Stable Sentry category strings — kept here so the test can assert
 * against them without duplicating literals. */
export const PERF_BREADCRUMB_CATEGORY = {
  engine: "stage3b.perf.engine",
  uiMount: "stage3b.perf.ui_mount",
} as const;

/**
 * Counts-only breadcrumb payload. Never carries source tags or
 * rationale strings: `itemCount` is the total returned, the three
 * per-kind counts let us see whether one source dominates without
 * exposing which specific weaknesses fired.
 */
export interface EnginePerfData {
  durationMs: number;
  itemCount: number;
  l1Count: number;
  placementCount: number;
  pronunciationCount: number;
}

/**
 * Instrumented wrapper around the pure `selectSuggestedPractice`.
 *
 * Callers preferring the un-instrumented function (e.g. tests that
 * fake the clock) can still import the original from
 * `./suggestedPractice`. Production reads should go through this
 * wrapper so Sentry sees breadcrumbs on pathological input.
 */
export function selectSuggestedPracticeInstrumented(
  state: Stage3AState,
): SuggestedPracticeItem[] {
  const start = nowMs();
  const items = selectSuggestedPractice(state);
  const durationMs = nowMs() - start;

  if (durationMs > ENGINE_SLOW_THRESHOLD_MS) {
    addBreadcrumb({
      category: PERF_BREADCRUMB_CATEGORY.engine,
      level: "warning",
      message: "stage3b engine slow",
      data: {
        durationMs: Math.round(durationMs),
        itemCount: items.length,
        l1Count: items.filter((i) => i.kind === "l1").length,
        placementCount: items.filter((i) => i.kind === "placement").length,
        pronunciationCount: items.filter((i) => i.kind === "pronunciation")
          .length,
      } satisfies EnginePerfData,
    });
  }

  return items;
}

/**
 * Emit a breadcrumb for a UI mount-to-first-paint measurement.
 *
 * React-free by design so the list component can call it from a
 * `useEffect(() => { … }, [])` without coupling this file to React.
 *
 *   const startRef = useRef(performance.now());
 *   useEffect(() => {
 *     reportUiMountPerf(performance.now() - startRef.current);
 *   }, []);
 */
export function reportUiMountPerf(durationMs: number): void {
  if (!Number.isFinite(durationMs) || durationMs <= UI_MOUNT_SLOW_THRESHOLD_MS) {
    return;
  }
  addBreadcrumb({
    category: PERF_BREADCRUMB_CATEGORY.uiMount,
    level: "warning",
    message: "stage3b ui mount slow",
    data: { durationMs: Math.round(durationMs) },
  });
}

function nowMs(): number {
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    return performance.now();
  }
  return Date.now();
}
