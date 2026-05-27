/**
 * Route-level performance instrumentation.
 *
 * Generic helper for measuring route mount-to-first-paint across the
 * app's high-traffic surfaces. Mirrors the Stage 3A/3B perf pattern
 * (`src/lib/stage-3a/perfInstrumentation.ts`,
 * `src/stage-3b/perfInstrumentation.ts`) but is route-agnostic:
 * callers pass a stable `routeName` so a single Sentry category
 * (`route.perf.mount`) covers every wired-up route.
 *
 * Posture (inherited from the Stage 3A/3B precedents):
 *   - Breadcrumb-only. Zero `captureException`. A slow mount is
 *     degraded-but-working, not an error.
 *   - Counts-only payload: `{ routeName, durationMs }`. The route
 *     name is a low-cardinality static string the call site picks;
 *     it MUST NOT carry user IDs, ids of dynamic route params, or
 *     any free text from the page.
 *   - No tracking events / analytics / network. Sentry breadcrumbs
 *     are client-only by design.
 *
 * Observer-only contract for callers: the instrumentation MUST NOT
 * change route behavior. Concrete shape used at every call site is
 * a single `useEffect(() => { reportRouteMountPerf("…", elapsed); },
 * [])` with the `elapsed` computed from a `useRef`-captured start.
 * No state mutation, no UI change, no conditional rendering.
 */

import { addBreadcrumb } from "./captureException";

/** Milliseconds. Route mount-to-first-paint floor. Above this we want
 * a breadcrumb so we can investigate; below, the surface is healthy
 * and the breadcrumb would be noise. Mirrors the Stage 3A/3B UI mount
 * threshold so the three categories line up in Sentry filters. */
export const ROUTE_MOUNT_SLOW_THRESHOLD_MS = 100;

/** Stable Sentry category — kept here so tests assert against it
 * without duplicating the string. Single category across all routes
 * (the `routeName` field disambiguates) keeps Sentry filtering
 * one-step. */
export const ROUTE_PERF_BREADCRUMB_CATEGORY = "route.perf.mount" as const;

/** Counts-only breadcrumb payload. `routeName` is a static low-
 * cardinality identifier provided by the call site (e.g. `"home"`,
 * `"ai_tutor"`, `"practice_phoneme_drill"`) — never a dynamic
 * route-param value, never user-content, never an id. */
export interface RouteMountPerfData {
  routeName: string;
  durationMs: number;
}

/**
 * Emit a breadcrumb for a route mount-to-first-paint measurement.
 *
 * React-free by design so call sites stay simple:
 *
 *   const startRef = useRef(performance.now());
 *   useEffect(() => {
 *     reportRouteMountPerf("home", performance.now() - startRef.current);
 *   }, []);
 *
 * No-op when:
 *   - `durationMs` is not a finite number
 *   - `durationMs` is at or under the threshold (the healthy case)
 *   - Sentry isn't initialized in the current build (handled inside
 *     `addBreadcrumb`)
 */
export function reportRouteMountPerf(
  routeName: string,
  durationMs: number,
): void {
  if (!Number.isFinite(durationMs) || durationMs <= ROUTE_MOUNT_SLOW_THRESHOLD_MS) {
    return;
  }
  addBreadcrumb({
    category: ROUTE_PERF_BREADCRUMB_CATEGORY,
    level: "warning",
    message: "route mount slow",
    data: {
      routeName,
      durationMs: Math.round(durationMs),
    } satisfies RouteMountPerfData,
  });
}
