// PATH: supabase/functions/_shared/sloConfig.ts
//
// Deno-side mirror of src/config/slos.ts and src/lib/admin/errorBudget.ts.
// Same trade-off as latencyDetection.ts: edge functions can't import
// from src/, the rules are short, the canonical tests in
// src/lib/admin/__tests__/errorBudget.test.ts cover the algorithm.
//
// IF YOU CHANGE ONE FILE, CHANGE THE OTHER.

export interface SloDefinition {
  id: string;
  name_en: string;
  name_vi: string;
  success_criteria: string;
  target_percent: number;
  window_days: number;
  data_source: "latency_events" | "sentry_snapshot" | "pg_stat_snapshot" | "pending";
  kind: "latency_threshold" | "rate_threshold";
  operation?: string;
  good_threshold_ms?: number;
}

export const SLOS: SloDefinition[] = [
  {
    id: "azure_phoneme_p99",
    name_en: "Pronunciation scoring fast + reliable",
    name_vi: "Chấm phát âm nhanh + ổn định",
    success_criteria: "99% of azure-phoneme requests within 3 seconds",
    target_percent: 99.0,
    window_days: 28,
    data_source: "latency_events",
    kind: "latency_threshold",
    operation: "azure-phoneme.total",
    good_threshold_ms: 3000,
  },
  {
    id: "ai_chat_p99",
    name_en: "Mercy chat fast + reliable",
    name_vi: "Mercy chat nhanh + ổn định",
    success_criteria: "99% of ai-chat requests within 5 seconds",
    target_percent: 99.0,
    window_days: 28,
    data_source: "latency_events",
    kind: "latency_threshold",
    operation: "ai-chat.total",
    good_threshold_ms: 5000,
  },
  {
    id: "mercy_tts_p99",
    name_en: "Teacher Mercy TTS fast + reliable",
    name_vi: "Teacher Mercy TTS nhanh + ổn định",
    success_criteria: "99% of mercy-tts requests within 8 seconds",
    target_percent: 99.0,
    window_days: 28,
    data_source: "latency_events",
    kind: "latency_threshold",
    operation: "mercy-tts.total",
    good_threshold_ms: 8000,
  },
  {
    id: "app_crash_rate",
    name_en: "App stability",
    name_vi: "Độ ổn định ứng dụng",
    success_criteria: "Crash-free sessions ≥ 99.9% over the last 7 days",
    target_percent: 99.9,
    window_days: 7,
    data_source: "sentry_snapshot",
    kind: "rate_threshold",
  },
  {
    id: "db_query_p95",
    name_en: "Database responsive",
    name_vi: "Database phản hồi nhanh",
    success_criteria: "≥99% of admin queries finish under 500ms (24h window)",
    target_percent: 99.0,
    window_days: 1,
    data_source: "pg_stat_snapshot",
    kind: "latency_threshold",
    good_threshold_ms: 500,
  },
];

export const BURN_RATE_RULES = {
  FAST_WINDOW_HOURS: 1,
  FAST_THRESHOLD_X: 14.4,
  SLOW_WINDOW_HOURS: 6,
  SLOW_THRESHOLD_X: 6.0,
} as const;

export const MIN_BURN_SAMPLES = 20;
export const ALERT_DEDUP_HOURS = 6;
export const BUDGET_STATUS_BANDS = {
  CRITICAL_PERCENT: 80,
  WARNING_PERCENT: 50,
} as const;
export const INCIDENT_AUTO_RESOLVE_HOURS = 4;

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

export function classifyStatus(remainingPercent: number): BudgetStatus {
  if (remainingPercent <= 0) return "exhausted";
  const consumed = 100 - remainingPercent;
  if (consumed >= BUDGET_STATUS_BANDS.CRITICAL_PERCENT) return "critical";
  if (consumed >= BUDGET_STATUS_BANDS.WARNING_PERCENT) return "warning";
  return "healthy";
}

export function computeBurnRate(input: {
  sloBudgetPercent: number;
  burnWindowBadCount?: number;
  burnWindowTotalCount?: number;
}): number {
  const total = input.burnWindowTotalCount ?? 0;
  const bad = input.burnWindowBadCount ?? 0;
  if (total < MIN_BURN_SAMPLES) return 0;
  if (input.sloBudgetPercent <= 0) return 0;
  const observedBadPercent = (bad / total) * 100;
  return observedBadPercent / input.sloBudgetPercent;
}

export type BurnAlertDecision =
  | { send: false; reason: "below_thresholds" | "deduped" | "paused" }
  | { send: true; severity: "fast" | "slow" };

export function decideBurnAlert(input: {
  fastBurnRate: number;
  slowBurnRate: number;
  recentAlerts: { sent_at: string; severity: string }[];
  pausedUntil: string | null;
  now?: Date;
}): BurnAlertDecision {
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
    if (ageHours < ALERT_DEDUP_HOURS) {
      return { send: false, reason: "deduped" };
    }
  }

  return { send: true, severity: fastTriggered ? "fast" : "slow" };
}
