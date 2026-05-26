// Slow-degradation detection. Compares the rolling 1-hour P95 against
// the 7-day baseline P95 and classifies the result.
//
// Pure logic in `classifyDegradation` so it's easy to unit test; the
// async wrapper `detectLatencyDegradation` does the Supabase RPC calls
// and feeds the values in. The same `classifyDegradation` is used by
// the admin dashboard (live status cards) AND the alert cron — one
// function, one definition of "alert."

import {
  ALERT_DEDUP_MINUTES,
  DEGRADATION_BANDS,
  LATENCY_THRESHOLDS,
  MIN_SAMPLES_FOR_ALERT,
  SUSTAINED_ESCALATION_COUNT,
  SUSTAINED_WINDOW_MINUTES,
  type LatencyOperation,
} from "@/config/latencyThresholds";
import { supabase } from "@/lib/supabaseClient";

export type DegradationStatus =
  | "healthy"
  | "warning"
  | "alert"
  | "insufficient_data";

export interface DegradationResult {
  operation: LatencyOperation | string;
  current_p95_ms: number;
  baseline_p95_ms: number;
  increase_percent: number;
  sample_count: number;
  status: DegradationStatus;
}

export interface ClassifyInput {
  operation: LatencyOperation | string;
  currentP95Ms: number;
  baselineP95Ms: number;
  sampleCount: number;
  /** Absolute alert ceiling — passed in so tests can override. */
  alertCeilingMs?: number;
  /** Min sample count required to trust the reading. */
  minSamples?: number;
}

/**
 * Classify a P95 reading. Returns a percent change relative to baseline
 * and a status band:
 *   - "insufficient_data" — under MIN_SAMPLES_FOR_ALERT samples
 *   - "healthy"           — within HEALTHY_PERCENT of baseline
 *   - "warning"           — WARNING_MIN..ALERT_MIN above baseline
 *   - "alert"             — above ALERT_MIN OR above absolute ceiling
 *
 * The absolute ceiling catches drift: if baseline silently creeps from
 * 1500 → 4000, percentage rules alone would never fire.
 */
export function classifyDegradation(input: ClassifyInput): DegradationResult {
  const minSamples = input.minSamples ?? MIN_SAMPLES_FOR_ALERT;
  const operation = input.operation;

  if (input.sampleCount < minSamples) {
    return {
      operation,
      current_p95_ms: input.currentP95Ms,
      baseline_p95_ms: input.baselineP95Ms,
      increase_percent: 0,
      sample_count: input.sampleCount,
      status: "insufficient_data",
    };
  }

  const baseline = Math.max(1, input.baselineP95Ms);
  const increasePercent = Number(
    (((input.currentP95Ms - baseline) / baseline) * 100).toFixed(2),
  );

  // Absolute ceiling check first — wins over percentage rules.
  if (
    typeof input.alertCeilingMs === "number" &&
    input.currentP95Ms >= input.alertCeilingMs
  ) {
    return {
      operation,
      current_p95_ms: input.currentP95Ms,
      baseline_p95_ms: baseline,
      increase_percent: increasePercent,
      sample_count: input.sampleCount,
      status: "alert",
    };
  }

  if (increasePercent <= DEGRADATION_BANDS.HEALTHY_PERCENT) {
    return {
      operation,
      current_p95_ms: input.currentP95Ms,
      baseline_p95_ms: baseline,
      increase_percent: increasePercent,
      sample_count: input.sampleCount,
      status: "healthy",
    };
  }

  if (increasePercent < DEGRADATION_BANDS.ALERT_MIN_PERCENT) {
    return {
      operation,
      current_p95_ms: input.currentP95Ms,
      baseline_p95_ms: baseline,
      increase_percent: increasePercent,
      sample_count: input.sampleCount,
      status: "warning",
    };
  }

  return {
    operation,
    current_p95_ms: input.currentP95Ms,
    baseline_p95_ms: baseline,
    increase_percent: increasePercent,
    sample_count: input.sampleCount,
    status: "alert",
  };
}

/**
 * Decide whether the cron should send (or escalate) a fresh alert,
 * given the recent alert_history rows for this operation.
 *
 * Dedup rule: 1 alert per operation per ALERT_DEDUP_MINUTES.
 * Escalation rule: ≥ SUSTAINED_ESCALATION_COUNT alerts in the last
 *                  SUSTAINED_WINDOW_MINUTES → mark as 'sustained'
 *                  with hourly cadence instead.
 */
export type AlertDecision =
  | { send: false; reason: "deduped" | "paused" | "below_threshold" }
  | { send: true; severity: "alert" | "sustained" };

export interface AlertDecisionInput {
  status: DegradationStatus;
  recentAlerts: { sent_at: string; severity: string }[];
  pausedUntil: string | null;
  now?: Date;
}

export function decideAlert(input: AlertDecisionInput): AlertDecision {
  const now = input.now ?? new Date();

  if (input.status !== "alert") {
    return { send: false, reason: "below_threshold" };
  }

  if (input.pausedUntil) {
    const pausedUntilMs = Date.parse(input.pausedUntil);
    if (Number.isFinite(pausedUntilMs) && pausedUntilMs > now.getTime()) {
      return { send: false, reason: "paused" };
    }
  }

  // Most recent alert sets the dedup window.
  const sorted = [...input.recentAlerts].sort(
    (a, b) => Date.parse(b.sent_at) - Date.parse(a.sent_at),
  );
  const newest = sorted[0];
  if (newest) {
    const ageMinutes = (now.getTime() - Date.parse(newest.sent_at)) / 60_000;
    const dedupMinutes =
      newest.severity === "sustained" ? 60 : ALERT_DEDUP_MINUTES;
    if (ageMinutes < dedupMinutes) {
      return { send: false, reason: "deduped" };
    }
  }

  // Sustained-escalation check: count alerts in the last
  // SUSTAINED_WINDOW_MINUTES. If we're at or above the escalation
  // threshold, mark as 'sustained' and switch to hourly cadence.
  const windowStart = now.getTime() - SUSTAINED_WINDOW_MINUTES * 60_000;
  const recentInWindow = input.recentAlerts.filter(
    (a) => Date.parse(a.sent_at) >= windowStart,
  );
  const severity: "alert" | "sustained" =
    recentInWindow.length >= SUSTAINED_ESCALATION_COUNT - 1
      ? "sustained"
      : "alert";

  return { send: true, severity };
}

// ── Async helpers (live Supabase) ────────────────────────────────────

/**
 * Compute current vs baseline P95 for an operation and classify.
 * Used by the admin dashboard's live status cards.
 */
export async function detectLatencyDegradation(
  operation: LatencyOperation | string,
): Promise<DegradationResult> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const sevenDaysAgo = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000,
  ).toISOString();

  const [currentResp, baselineResp] = await Promise.all([
    supabase.rpc("compute_operation_p95", {
      p_operation: operation,
      p_since: oneHourAgo,
    }),
    supabase.rpc("compute_operation_p95", {
      p_operation: operation,
      p_since: sevenDaysAgo,
    }),
  ]);

  const current = (currentResp.data as { p95_ms?: number; sample_count?: number }[] | null)?.[0];
  const baseline = (baselineResp.data as { p95_ms?: number; sample_count?: number }[] | null)?.[0];

  const seedBaseline =
    LATENCY_THRESHOLDS[operation as LatencyOperation]?.baselineMs ?? 1000;
  const alertCeiling =
    LATENCY_THRESHOLDS[operation as LatencyOperation]?.alertMs;

  const baselineP95 =
    baseline && (baseline.sample_count ?? 0) >= MIN_SAMPLES_FOR_ALERT
      ? Number(baseline.p95_ms ?? 0)
      : seedBaseline;

  return classifyDegradation({
    operation,
    currentP95Ms: Number(current?.p95_ms ?? 0),
    baselineP95Ms: baselineP95,
    sampleCount: Number(current?.sample_count ?? 0),
    alertCeilingMs: alertCeiling,
  });
}
