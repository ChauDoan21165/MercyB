// PATH: supabase/functions/_shared/latencyDetection.ts
//
// Deno-side mirror of the pure detection logic in
// src/lib/admin/latencyAlerts.ts. The logic is intentionally duplicated
// instead of cross-imported because edge functions can't reach into
// the React app's src/ tree, and the rules are short enough that the
// risk of drift is bounded by the shared test suite.
//
// IF YOU CHANGE ONE FILE, CHANGE THE OTHER. Tests in
// src/lib/admin/__tests__/latencyAlerts.test.ts cover the canonical
// behaviour; mirror any new branch here.

export type DegradationStatus =
  | "healthy"
  | "warning"
  | "alert"
  | "insufficient_data";

export interface OperationThreshold {
  label: string;
  labelVi: string;
  baselineMs: number;
  alertMs: number;
}

export const LATENCY_THRESHOLDS: Record<string, OperationThreshold> = {
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

export const MONITORED_OPERATIONS = [
  "azure-phoneme.total",
  "azure-phoneme.azure-call",
  "ai-chat.total",
  "ai-chat.llm-call",
  "mercy-tts.total",
  "mercy-tts.elevenlabs-call",
] as const;

export const DEGRADATION_BANDS = {
  HEALTHY_PERCENT: 20,
  WARNING_MIN_PERCENT: 30,
  WARNING_MAX_PERCENT: 50,
  ALERT_MIN_PERCENT: 50,
} as const;

export const ALERT_DEDUP_MINUTES = 30;
export const SUSTAINED_ESCALATION_COUNT = 3;
export const SUSTAINED_WINDOW_MINUTES = 60;
export const MIN_SAMPLES_FOR_ALERT = 5;

export interface ClassifyInput {
  operation: string;
  currentP95Ms: number;
  baselineP95Ms: number;
  sampleCount: number;
  alertCeilingMs?: number;
  minSamples?: number;
}

export interface DegradationResult {
  operation: string;
  current_p95_ms: number;
  baseline_p95_ms: number;
  increase_percent: number;
  sample_count: number;
  status: DegradationStatus;
}

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
