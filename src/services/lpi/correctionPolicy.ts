export type PolicySeverity = "high" | "medium" | "low";

export type PolicyInput = {
  detectorTag: string | null;
  severity: PolicySeverity;
  recurrenceCount: number;
  sessionErrorDensity: number;
  consecutiveErrors: number;
  correctionsThisBurst: number;
};

export type PolicyDecision = {
  action: "correct_now" | "defer_to_recap" | "log_silently";
  reason: string;
};

export type LpiPolicyMode = "off" | "shadow" | "active";

export const BURST_CONSECUTIVE_ERROR_THRESHOLD = 4;
export const REPEAT_RECURRENCE_THRESHOLD = 2;
export const HIGH_ERROR_DENSITY_THRESHOLD = 0.6;

export function decideCorrection(input: PolicyInput): PolicyDecision {
  if (input.recurrenceCount === 0) {
    return { action: "correct_now", reason: "first_occurrence_teach_cause" };
  }

  if (input.consecutiveErrors >= BURST_CONSECUTIVE_ERROR_THRESHOLD) {
    return input.correctionsThisBurst === 0
      ? { action: "correct_now", reason: "burst_cap_one" }
      : { action: "defer_to_recap", reason: "burst_cap_exceeded" };
  }

  if (input.recurrenceCount >= REPEAT_RECURRENCE_THRESHOLD) {
    return { action: "defer_to_recap", reason: "repeat_tag_no_hammer" };
  }

  if (input.sessionErrorDensity > HIGH_ERROR_DENSITY_THRESHOLD && input.severity === "low") {
    return { action: "log_silently", reason: "density_low_severity" };
  }

  if (input.sessionErrorDensity > HIGH_ERROR_DENSITY_THRESHOLD) {
    return { action: "defer_to_recap", reason: "density_defer" };
  }

  return { action: "correct_now", reason: "default" };
}

export function resolveLpiPolicyMode(rawMode: string | null | undefined): LpiPolicyMode {
  if (rawMode === "shadow" || rawMode === "active") return rawMode;
  return "off";
}

export function applyCorrectionPolicyDecision(
  mode: LpiPolicyMode,
  decision: PolicyDecision,
): { shouldRenderCorrection: boolean; shouldQueueRecap: boolean; shouldLogSilently: boolean } {
  if (mode !== "active") {
    return {
      shouldRenderCorrection: true,
      shouldQueueRecap: false,
      shouldLogSilently: false,
    };
  }

  return {
    shouldRenderCorrection: decision.action === "correct_now",
    shouldQueueRecap: decision.action === "defer_to_recap",
    shouldLogSilently: decision.action === "log_silently",
  };
}
