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
