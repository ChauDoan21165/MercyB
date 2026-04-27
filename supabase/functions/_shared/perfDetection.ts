// PATH: supabase/functions/_shared/perfDetection.ts
//
// Deno-side mirror of src/lib/admin/perfAlerts.ts. Same pattern as
// latencyDetection.ts and sloConfig.ts: edge functions can't reach the
// React app's src/, so the rules are duplicated and the canonical
// tests live next to the src/ copy.
//
// IF YOU CHANGE ONE FILE, CHANGE THE OTHER.

export const PERF_ALERT_RULES = {
  LCP_ALERT_MS: 4000,
  ALERT_WINDOW_HOURS: 1,
  MIN_SAMPLES: 10,
  DEDUP_HOURS: 4,
} as const;

export type PerfAlertDecision =
  | { send: false; reason: "below_threshold" | "deduped" | "insufficient_data" }
  | { send: true; severity: "alert" };

export interface PerfAlertInput {
  currentP95Ms: number;
  thresholdMs: number;
  sampleCount: number;
  recentAlerts: { sent_at: string }[];
  now?: Date;
  dedupHours?: number;
  minSamples?: number;
}

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
