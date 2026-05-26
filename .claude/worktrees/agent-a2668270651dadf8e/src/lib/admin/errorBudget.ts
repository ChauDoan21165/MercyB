// Error budget + burn-rate calculation.
//
// Given an SLO (e.g. "99% within 3000ms over 28 days"), compute:
//   - good_count, bad_count, total_count over the window
//   - actual_percent = good / total
//   - budget_total_percent = 1 - target_percent (e.g. 1.0 for 99%)
//   - budget_consumed_percent = (1 - actual_percent) / budget_total_percent
//   - burn_rate (over a smaller window) = how fast we're burning vs linear
//
// Pure functions live at the top of the file so the cron AND the
// dashboard can reuse the exact same math. The async `calculateErrorBudget`
// at the bottom hits Supabase and feeds those values into the pure layer.

import { supabase } from "@/lib/supabaseClient";
import {
  BUDGET_STATUS_BANDS,
  BURN_RATE_RULES,
  getSloById,
  MIN_BURN_SAMPLES,
  type SloDefinition,
} from "@/config/slos";

export type BudgetStatus =
  | "healthy"
  | "warning"
  | "critical"
  | "exhausted"
  | "no_data";

export interface BudgetResult {
  slo_id: string;
  total_count: number;
  good_count: number;
  bad_count: number;
  actual_percent: number;
  target_percent: number;
  budget_remaining_percent: number;
  burn_rate_per_hour: number;
  projected_exhaustion_at: string | null;
  status: BudgetStatus;
}

export interface ClassifyBudgetInput {
  slo: SloDefinition;
  totalCount: number;
  goodCount: number;
  /** Bad count in a smaller "burn window" (e.g. last hour) for burn rate. */
  burnWindowBadCount?: number;
  burnWindowTotalCount?: number;
  burnWindowHours?: number;
  now?: Date;
}

/**
 * Pure budget math. Returns "no_data" when sample count is too low to trust.
 * Burn rate compares the bad-rate observed in the last `burnWindowHours`
 * against the linear bad-rate the SLO budget allows over its full window.
 */
export function classifyBudget(input: ClassifyBudgetInput): BudgetResult {
  const slo = input.slo;
  const total = input.totalCount;
  const good = Math.min(total, input.goodCount);
  const bad = Math.max(0, total - good);

  if (total < MIN_BURN_SAMPLES) {
    return {
      slo_id: slo.id,
      total_count: total,
      good_count: good,
      bad_count: bad,
      actual_percent: total === 0 ? 100 : (good / total) * 100,
      target_percent: slo.target_percent,
      budget_remaining_percent: 100,
      burn_rate_per_hour: 0,
      projected_exhaustion_at: null,
      status: "no_data",
    };
  }

  const actualPercent = (good / total) * 100;
  const budgetTotal = Math.max(0.0001, 100 - slo.target_percent);
  const consumedPercent = ((100 - actualPercent) / budgetTotal) * 100;
  const remainingPercent = Math.max(0, 100 - consumedPercent);

  const burnRate = computeBurnRate({
    sloBudgetPercent: budgetTotal,
    burnWindowBadCount: input.burnWindowBadCount,
    burnWindowTotalCount: input.burnWindowTotalCount,
    burnWindowHours: input.burnWindowHours,
  });

  const projectedExhaustionAt = projectExhaustion({
    remainingPercent,
    burnRate,
    now: input.now ?? new Date(),
  });

  return {
    slo_id: slo.id,
    total_count: total,
    good_count: good,
    bad_count: bad,
    actual_percent: round2(actualPercent),
    target_percent: slo.target_percent,
    budget_remaining_percent: round2(remainingPercent),
    burn_rate_per_hour: round2(burnRate),
    projected_exhaustion_at: projectedExhaustionAt,
    status: classifyStatus(remainingPercent),
  };
}

export function classifyStatus(remainingPercent: number): BudgetStatus {
  if (remainingPercent <= 0) return "exhausted";
  const consumed = 100 - remainingPercent;
  if (consumed >= BUDGET_STATUS_BANDS.CRITICAL_PERCENT) return "critical";
  if (consumed >= BUDGET_STATUS_BANDS.WARNING_PERCENT) return "warning";
  return "healthy";
}

/**
 * Burn rate = observed_bad_rate / allowed_bad_rate.
 * A burn rate of 1× means we're consuming budget linearly — exactly on
 * pace to hit zero at the end of the window. 14.4× would exhaust the
 * 28-day budget in under 2 days.
 *
 * Returns 0 when the burn window is empty or sample count is too low to
 * trust the rate.
 */
export function computeBurnRate(input: {
  sloBudgetPercent: number;
  burnWindowBadCount?: number;
  burnWindowTotalCount?: number;
  burnWindowHours?: number;
}): number {
  const total = input.burnWindowTotalCount ?? 0;
  const bad = input.burnWindowBadCount ?? 0;
  if (total < MIN_BURN_SAMPLES) return 0;
  if (input.sloBudgetPercent <= 0) return 0;

  const observedBadPercent = (bad / total) * 100;
  const allowedBadPercent = input.sloBudgetPercent;
  return observedBadPercent / allowedBadPercent;
}

/**
 * Project when the remaining budget would hit zero given the current
 * per-hour burn rate. burnRate is already a multiple of "linear", so
 * we still need to convert "linear over the SLO window" into hours.
 *
 * We approximate: at burn rate B, the budget that remains is consumed
 * in (remaining_percent / B) percent-hours. Translating that into
 * actual hours requires the SLO's window (in hours).
 *
 * Returns null when burn rate is ≤ 0 or remaining is exhausted.
 */
function projectExhaustion(input: {
  remainingPercent: number;
  burnRate: number;
  now: Date;
}): string | null {
  if (input.remainingPercent <= 0) return null;
  if (input.burnRate <= 0) return null;
  // At burn rate B, consuming the remaining R% takes R / (B × hourly_rate)
  // hours. The hourly_rate is 100 / (window_hours), but window_hours is
  // unknown to this pure helper. Caller passes burnRate as already
  // normalized to "x linear" — so 1× means it'll take exactly the SLO
  // window length to consume 100% of budget. We assume a 28-day window
  // here for the projection display because the dashboard's burn-rate
  // chart uses 28 days; precise projection per-SLO requires the window
  // in hours which the cron already has.
  const hoursPerLinearWindow = 28 * 24;
  const hoursToExhaustion =
    (input.remainingPercent / 100) * (hoursPerLinearWindow / input.burnRate);
  const exhaustAt = new Date(input.now.getTime() + hoursToExhaustion * 3_600_000);
  return exhaustAt.toISOString();
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

// ── Burn-rate decision (used by the cron) ────────────────────────────

export type BurnAlertDecision =
  | { send: false; reason: "below_thresholds" | "deduped" | "paused" }
  | { send: true; severity: "fast" | "slow" };

export interface BurnAlertInput {
  fastBurnRate: number;
  slowBurnRate: number;
  recentAlerts: { sent_at: string; severity: string }[];
  pausedUntil: string | null;
  now?: Date;
}

/**
 * decideBurnAlert: fast window wins (it's the noisier-but-more-urgent
 * signal). Dedup window is global across severities — once we've paged,
 * don't page again for ALERT_DEDUP_HOURS.
 */
export function decideBurnAlert(input: BurnAlertInput): BurnAlertDecision {
  const now = input.now ?? new Date();

  if (input.pausedUntil) {
    const ms = Date.parse(input.pausedUntil);
    if (Number.isFinite(ms) && ms > now.getTime()) {
      return { send: false, reason: "paused" };
    }
  }

  const fastTriggered = input.fastBurnRate >= BURN_RATE_RULES.FAST_THRESHOLD_X;
  const slowTriggered = input.slowBurnRate >= BURN_RATE_RULES.SLOW_THRESHOLD_X;

  if (!fastTriggered && !slowTriggered) {
    return { send: false, reason: "below_thresholds" };
  }

  const sorted = [...input.recentAlerts].sort(
    (a, b) => Date.parse(b.sent_at) - Date.parse(a.sent_at),
  );
  const newest = sorted[0];
  if (newest) {
    const ageHours = (now.getTime() - Date.parse(newest.sent_at)) / 3_600_000;
    if (ageHours < 6) {
      return { send: false, reason: "deduped" };
    }
  }

  return { send: true, severity: fastTriggered ? "fast" : "slow" };
}

// ── Async layer (Supabase) ───────────────────────────────────────────

interface CountResult {
  good: number;
  total: number;
}

async function countLatencyOutcomes(
  operation: string,
  goodThresholdMs: number,
  sinceIso: string,
): Promise<CountResult> {
  const { data, error } = await supabase
    .from("latency_events")
    .select("duration_ms, status")
    .eq("operation", operation)
    .gte("recorded_at", sinceIso);
  if (error || !data) return { good: 0, total: 0 };
  let good = 0;
  let total = 0;
  for (const row of data as Array<{ duration_ms: number; status: string }>) {
    total++;
    if (row.status === "success" && row.duration_ms <= goodThresholdMs) good++;
  }
  return { good, total };
}

/**
 * Compute a full BudgetResult for one SLO. Currently wires:
 *   - latency_events sources via duration_ms + status
 *   - sentry_snapshot + pg_stat_snapshot are stubbed as no_data until
 *     a snapshot writer lands (tracked in docs/slo-handbook.md).
 */
export async function calculateErrorBudget(
  sloId: string,
): Promise<BudgetResult> {
  const slo = getSloById(sloId);
  if (!slo) {
    throw new Error(`Unknown SLO id: ${sloId}`);
  }

  if (slo.data_source !== "latency_events") {
    return {
      slo_id: slo.id,
      total_count: 0,
      good_count: 0,
      bad_count: 0,
      actual_percent: 100,
      target_percent: slo.target_percent,
      budget_remaining_percent: 100,
      burn_rate_per_hour: 0,
      projected_exhaustion_at: null,
      status: "no_data",
    };
  }

  if (!slo.operation || typeof slo.good_threshold_ms !== "number") {
    throw new Error(
      `SLO ${slo.id} is latency_events kind but missing operation/good_threshold_ms`,
    );
  }

  const windowSinceIso = new Date(
    Date.now() - slo.window_days * 24 * 60 * 60 * 1000,
  ).toISOString();
  const burnSinceIso = new Date(
    Date.now() - BURN_RATE_RULES.FAST_WINDOW_HOURS * 60 * 60 * 1000,
  ).toISOString();

  const [windowCounts, burnCounts] = await Promise.all([
    countLatencyOutcomes(slo.operation, slo.good_threshold_ms, windowSinceIso),
    countLatencyOutcomes(slo.operation, slo.good_threshold_ms, burnSinceIso),
  ]);

  return classifyBudget({
    slo,
    totalCount: windowCounts.total,
    goodCount: windowCounts.good,
    burnWindowBadCount: burnCounts.total - burnCounts.good,
    burnWindowTotalCount: burnCounts.total,
    burnWindowHours: BURN_RATE_RULES.FAST_WINDOW_HOURS,
  });
}

export async function calculateAllBudgets(): Promise<BudgetResult[]> {
  const { SLOS } = await import("@/config/slos");
  return Promise.all(SLOS.map((slo) => calculateErrorBudget(slo.id)));
}
