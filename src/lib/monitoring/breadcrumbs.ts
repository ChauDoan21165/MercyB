/**
 * Path: src/lib/monitoring/breadcrumbs.ts
 *
 * Domain-specific Sentry breadcrumb helpers. These wrap `addBreadcrumb`
 * with a stable category + a typed payload so feature code stays one
 * line per event ("speak attempt started for room hello_world") without
 * each caller having to remember the breadcrumb shape.
 *
 * Design rules:
 *   - Never pass raw user input. Pass identifiers + structured fields.
 *   - Stay under ~5 fields per crumb — Sentry truncates large payloads.
 *   - Use `info` level by default; `warning` only when the event
 *     correlates with a degraded path (e.g., cloud scoring fell back to
 *     local).
 */

import { addBreadcrumb } from "./captureException";

export function breadcrumbMercyPanel(action: "open" | "close" | "tab_change", data?: {
  tab?: string;
  source?: string;
}): void {
  addBreadcrumb({
    category: "mercy.panel",
    level: "info",
    message: `mercy panel ${action}`,
    data: { action, ...(data ?? {}) },
  });
}

export function breadcrumbSpeakAttempt(
  phase: "start" | "finish" | "fallback",
  data?: {
    roomId?: string;
    targetLength?: number;
    score?: number;
    cloud?: boolean;
    reason?: string;
  },
): void {
  addBreadcrumb({
    category: "speak.attempt",
    level: phase === "fallback" ? "warning" : "info",
    message: `speak ${phase}`,
    data: { phase, ...(data ?? {}) },
  });
}

/**
 * Recommendation engine breadcrumb. Fired at every recommendation
 * fetch (Home cards + Mercy chat) so a future Sentry event includes
 * "what was the user being shown when this happened?" Privacy: pass
 * coarse signals only — recommendation type/id is fine, the user's
 * weakest phoneme list is NOT (could correlate with private struggle
 * patterns). The `signal` field is a short tag like "weak_phoneme" /
 * "consistency" / "cooldown" — never raw scores.
 */
export function breadcrumbRecommendation(
  surface: "home_practice" | "home_drill" | "mercy_chat",
  result: "served" | "no_signal" | "cooldown" | "flag_off" | "error",
  data?: {
    recommendation_type?: string;
    /** Stable id like "weak_phoneme_drill:th". Safe — no PII. */
    recommendation_id?: string;
    /** Short tag describing why this was chosen. */
    signal?: string;
    /** Error message when result === "error". */
    reason?: string;
  },
): void {
  addBreadcrumb({
    category: "recommendation",
    level: result === "error" ? "warning" : "info",
    message: `recommendation ${surface} ${result}`,
    data: { surface, result, ...(data ?? {}) },
  });
}

/**
 * Streaming-pronunciation lifecycle breadcrumb. The streaming path
 * has multiple failure modes (WS open, first-partial timeout, mid-
 * stream error) so the breadcrumb captures the phase + reason. Used
 * by useStreamingPronunciation; the post-recording fallback path
 * already emits `breadcrumbSpeakAttempt`.
 */
export function breadcrumbStreamingPronunciation(
  phase: "start" | "first_partial" | "stop" | "fallback" | "error",
  data?: {
    reason?: string;
    elapsed_ms?: number;
  },
): void {
  addBreadcrumb({
    category: "speak.streaming",
    level: phase === "fallback" || phase === "error" ? "warning" : "info",
    message: `streaming pronunciation ${phase}`,
    data: { phase, ...(data ?? {}) },
  });
}
