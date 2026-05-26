// Service Level Objectives (SLOs) for MercyBlade.
//
// SLO = a target percentage of "good" requests within a rolling window.
// Error budget = (1 - target_percent) of requests are allowed to be bad.
// Burn rate = how fast the budget is being consumed relative to "linear."
//
// Burn-rate intuition: if the budget is 1% of requests over 28 days, a
// burn rate of 1× exhausts it in exactly 28 days; 14.4× exhausts it in
// 28/14.4 = ~2 days. The 14.4 number comes from Google's SRE workbook
// (1-hour window, 2% budget burn → page).
//
// Companion modules:
//   - src/lib/admin/errorBudget.ts (calculation)
//   - src/lib/admin/incidentLog.ts (auto incident records)
//   - src/pages/admin/SloDashboard.tsx + SloDetail.tsx (UI)
//   - supabase/functions/error-budget-alert/ (burn-rate alerts)

export type SloDataSource =
  | "latency_events"   // P95-style query against latency_events
  | "sentry_snapshot"  // pulled from a sentry_crash_rate_snapshots table
  | "pg_stat_snapshot" // pulled from a db_p95_snapshots table
  | "pending";         // defined but not yet wired

export type SloKind = "latency_threshold" | "rate_threshold";

export interface SloDefinition {
  /** Stable id used in URLs, alert dedup, incident records. */
  id: string;
  /** Human-readable English name (admin dashboard). */
  name_en: string;
  /** Vietnamese name (Chau primary). */
  name_vi: string;
  /** What "good" means in plain terms. */
  success_criteria: string;
  /** Target percentage of requests that must be "good." */
  target_percent: number;
  /** Window length over which the target applies. */
  window_days: number;
  /** Where the metric comes from. */
  data_source: SloDataSource;
  /** Latency or rate. */
  kind: SloKind;
  /** Operation name in latency_events (for latency_events sources only). */
  operation?: string;
  /** "Good" threshold in milliseconds (for latency_threshold). */
  good_threshold_ms?: number;
}

export const SLOS: SloDefinition[] = [
  {
    id: "azure_phoneme_p99",
    name_en: "Pronunciation scoring fast + reliable",
    name_vi: "Chấm phát âm nhanh + ổn định",
    success_criteria:
      "99% of azure-phoneme requests complete successfully within 3 seconds",
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
    success_criteria:
      "99% of ai-chat requests complete successfully within 5 seconds",
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
    success_criteria:
      "99% of mercy-tts requests complete successfully within 8 seconds",
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
    success_criteria:
      "Crash-free sessions ≥ 99.9% over the last 7 days (Sentry-sourced)",
    target_percent: 99.9,
    window_days: 7,
    data_source: "sentry_snapshot",
    kind: "rate_threshold",
  },
  {
    id: "db_query_p95",
    name_en: "Database responsive",
    name_vi: "Database phản hồi nhanh",
    success_criteria:
      "≥99% of admin queries finish under 500ms (24-hour window, pg_stat_statements snapshot)",
    target_percent: 99.0,
    window_days: 1,
    data_source: "pg_stat_snapshot",
    kind: "latency_threshold",
    good_threshold_ms: 500,
  },
];

export function getSloById(id: string): SloDefinition | undefined {
  return SLOS.find((s) => s.id === id);
}

/** Burn-rate thresholds — Google SRE workbook defaults. */
export const BURN_RATE_RULES = {
  /** 1-hour window: above this burn rate, alert immediately (would exhaust in <2d). */
  FAST_WINDOW_HOURS: 1,
  FAST_THRESHOLD_X: 14.4,
  /** 6-hour window: above this burn rate, alert (would exhaust in <5d). */
  SLOW_WINDOW_HOURS: 6,
  SLOW_THRESHOLD_X: 6.0,
} as const;

/** Min sample count required before any burn-rate alert fires. */
export const MIN_BURN_SAMPLES = 20;

/** Dedup window for burn-rate alerts (per SLO). */
export const ALERT_DEDUP_HOURS = 6;

/** Status bands for the dashboard hero card. */
export const BUDGET_STATUS_BANDS = {
  /** > this percent burned → critical. */
  CRITICAL_PERCENT: 80,
  /** > this percent burned → warning. */
  WARNING_PERCENT: 50,
} as const;

/** How long the SLO must be 'healthy' before an incident auto-resolves. */
export const INCIDENT_AUTO_RESOLVE_HOURS = 4;
