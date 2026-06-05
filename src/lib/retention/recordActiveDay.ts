// src/lib/retention/recordActiveDay.ts
//
// THE canonical "active day" choke point for the retention_loop outcome signal.
//
// One definition the whole retention number rides on: each verified-live core
// learner action calls recordActiveDay(). It fires at most ONE retention_loop
// 'completed' per local calendar day per device, carrying a `local_day` payload
// so B's get_feature_outcome RPC can dedup DISTINCT active days per user on the
// same grain (the RPC regex-guards YYYY-MM-DD and fail-closed drops rows lacking
// a well-formed local_day).
//
// Wire NEW surfaces by calling this — never by adding another
// emitFeatureOutcome('retention_loop', …). Only verified-live, runtime-bound
// call sites should call it (no dead-code wiring).
//
// Dark + fail-safe: emitFeatureOutcome is authenticated-only, gated behind the
// DB-backed RETENTION_OUTCOME_EVENTS flag, and fire-and-forget. recordActiveDay
// itself never throws — telemetry must never break a learner action.

import { emitFeatureOutcome } from "@/lib/analytics";

// Own once-per-local-day stamp, independent of the points/streak stamp
// (mb.points.lastDaily) so it works for surfaces that don't award points.
const LAST_ACTIVE_DAY_KEY = "mb.retention.lastActiveLocalDay";

// Device-LOCAL calendar day, YYYY-MM-DD (getFullYear/getMonth/getDate, NOT UTC
// toISOString). Mirrors pointsService.localDayStr and gamification toIsoDate;
// near-midnight UTC+7 users must bucket on their own local day.
function localDayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Record that the current learner was actively engaged today. Idempotent per
 * local calendar day per device: the first call of the day stamps localStorage
 * and emits one `retention_loop` 'completed' (with `{ local_day }`); subsequent
 * calls the same day are no-ops. Fire-and-forget, never throws, no-op when the
 * RETENTION_OUTCOME_EVENTS flag is off or the user is unauthenticated.
 */
export function recordActiveDay(): void {
  try {
    const today = localDayKey(new Date());
    let last: string | null = null;
    try {
      last = localStorage.getItem(LAST_ACTIVE_DAY_KEY);
    } catch {
      // storage unavailable (private mode / SSR) — fall through and emit once
      // for this call rather than throw; dedup just degrades to best-effort.
    }
    if (last === today) return; // already counted this local day on this device

    try {
      localStorage.setItem(LAST_ACTIVE_DAY_KEY, today);
    } catch {
      // ignore — see above
    }

    // Same local-day value used for the dedup stamp above and the payload, so
    // producer day-grain == payload day-grain == B's server DISTINCT-day key.
    void emitFeatureOutcome("retention_loop", "completed", { local_day: today });
  } catch {
    // fire-and-forget — never break the learner action that called us
  }
}
