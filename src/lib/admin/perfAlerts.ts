// Pure helpers for slow-route detection. Mirrored in
// supabase/functions/_shared/perfDetection.ts. Test these from src;
// keep both files in lockstep.

import { PERF_ALERT_RULES } from "@/config/perfBudget";

export type PerfAlertDecision =
  | { send: false; reason: "below_threshold" | "deduped" | "insufficient_data" }
  | { send: true; severity: "alert" };

export interface PerfAlertInput {
  currentP95Ms: number;
  thresholdMs: number;
  sampleCount: number;
  recentAlerts: { sent_at: string }[];
  now?: Date;
  /** Override dedup window (hours). Defaults to PERF_ALERT_RULES.DEDUP_HOURS. */
  dedupHours?: number;
  /** Override min sample count. Defaults to PERF_ALERT_RULES.MIN_SAMPLES. */
  minSamples?: number;
}

/**
 * Decide whether perf-alert should send a fresh alert for one route +
 * metric combination.
 *
 *   - insufficient_data when sample count < min
 *   - below_threshold when P95 hasn't crossed the alert ceiling
 *   - deduped when an alert was sent within the dedup window
 *   - send: alert otherwise
 */
export function decidePerfAlert(input: PerfAlertInput): PerfAlertDecision {
  const minSamples = input.minSamples ?? PERF_ALERT_RULES.MIN_SAMPLES;
  if (input.sampleCount < minSamples) {
    return { send: false, reason: "insufficient_data" };
  }
  if (input.currentP95Ms < input.thresholdMs) {
    return { send: false, reason: "below_threshold" };
  }
  const now = input.now ?? new Date();
  const dedupHours = input.dedupHours ?? PERF_ALERT_RULES.DEDUP_HOURS;
  const sorted = [...input.recentAlerts].sort(
    (a, b) => Date.parse(b.sent_at) - Date.parse(a.sent_at),
  );
  const newest = sorted[0];
  if (newest) {
    const ageHours = (now.getTime() - Date.parse(newest.sent_at)) / 3_600_000;
    if (ageHours < dedupHours) {
      return { send: false, reason: "deduped" };
    }
  }
  return { send: true, severity: "alert" };
}
