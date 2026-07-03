import type { ObservationFact, SpeechObservationInput } from "../types";

export function detectSpeechObservations(input: SpeechObservationInput, observedAt = new Date().toISOString()): ObservationFact[] {
  const facts: ObservationFact[] = [];
  const context = { route: input.route, taskId: input.taskId };

  if (input.permissionState === "denied") {
    facts.push({
      capabilityId: "OBS-SPEECH-000001",
      factType: "MicPermissionDenied",
      severity: "warning",
      observedAt,
      context,
      message: "Microphone permission was denied.",
    });
  }

  if (input.timedOut) {
    facts.push({
      capabilityId: "OBS-SPEECH-000002",
      factType: "SpeechTimeout",
      severity: "warning",
      observedAt,
      context,
      metrics: typeof input.timeoutMs === "number" ? { timeoutMs: input.timeoutMs } : undefined,
      message: "Speech capture timed out.",
    });
  }

  return facts;
}
