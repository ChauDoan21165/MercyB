// Per-operation latency baselines + alert thresholds.
//
// These numbers are seed values: the cron uses the rolling 7-day P95
// as the *primary* baseline, and falls back to `baselineMs` here when
// there isn't enough history yet (cold start, brand new operation).
//
// `alertMs` is an absolute floor — even when the rolling baseline is
// low, P95 above this number always triggers an alert. Catches the
// case where baseline drift hides a real problem.

export type LatencyOperation =
  | "azure-phoneme.total"
  | "azure-phoneme.azure-call"
  | "ai-chat.total"
  | "ai-chat.llm-call"
  | "mercy-tts.total"
  | "mercy-tts.elevenlabs-call"
  | "mercy-guide.total";

export interface OperationThreshold {
  /** Display name used in alert emails + admin dashboard. */
  label: string;
  /** Seed baseline for cold-start when no rolling baseline exists yet. */
  baselineMs: number;
  /** Absolute alert ceiling — P95 above this is always degraded. */
  alertMs: number;
  /** Vietnamese label for the admin email body (Chau reads VI primary). */
  labelVi: string;
}

export const LATENCY_THRESHOLDS: Record<LatencyOperation, OperationThreshold> = {
  "azure-phoneme.total": {
    label: "Pronunciation scoring (full request)",
    labelVi: "Chấm phát âm (toàn bộ request)",
    baselineMs: 1500,
    alertMs: 3000,
  },
  "azure-phoneme.azure-call": {
    label: "Azure Pronunciation API call",
    labelVi: "Gọi Azure Pronunciation API",
    baselineMs: 800,
    alertMs: 1800,
  },
  "ai-chat.total": {
    label: "Mercy chat (full request)",
    labelVi: "Mercy chat (toàn bộ request)",
    baselineMs: 2500,
    alertMs: 5000,
  },
  "ai-chat.llm-call": {
    label: "OpenAI/Gemini call",
    labelVi: "Gọi OpenAI/Gemini",
    baselineMs: 2000,
    alertMs: 4000,
  },
  "mercy-tts.total": {
    label: "Teacher Mercy TTS (full request)",
    labelVi: "Teacher Mercy TTS (toàn bộ request)",
    baselineMs: 1200,
    alertMs: 8000,
  },
  "mercy-tts.elevenlabs-call": {
    label: "ElevenLabs TTS API call",
    labelVi: "Gọi ElevenLabs TTS API",
    baselineMs: 4500,
    alertMs: 8000,
  },
  "mercy-guide.total": {
    label: "Mercy guide (full request)",
    labelVi: "Mercy guide (toàn bộ request)",
    baselineMs: 2500,
    alertMs: 5000,
  },
};

/** Operations the alert cron actively watches. */
export const MONITORED_OPERATIONS: readonly LatencyOperation[] = [
  "azure-phoneme.total",
  "azure-phoneme.azure-call",
  "ai-chat.total",
  "ai-chat.llm-call",
  "mercy-tts.total",
  "mercy-tts.elevenlabs-call",
];

export const DEGRADATION_BANDS = {
  /** P95 within this band of baseline = healthy (green). */
  HEALTHY_PERCENT: 20,
  /** P95 30–50% above baseline = warning (yellow). */
  WARNING_MIN_PERCENT: 30,
  WARNING_MAX_PERCENT: 50,
  /** P95 above this percent of baseline = alert (red). */
  ALERT_MIN_PERCENT: 50,
} as const;

export const ALERT_DEDUP_MINUTES = 30;
export const SUSTAINED_ESCALATION_COUNT = 3;
export const SUSTAINED_WINDOW_MINUTES = 60;
/** Minimum samples required in the 1-hour window to trust the P95. */
export const MIN_SAMPLES_FOR_ALERT = 5;
