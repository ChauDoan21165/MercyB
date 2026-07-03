import type { LearningObservationInput, ObservationFact } from "../types";

export function detectLearningObservation(input: LearningObservationInput, observedAt = new Date().toISOString()): ObservationFact {
  const context = {
    route: input.route,
    taskId: input.taskId,
    learnerAction: input.action === "retry" ? "retried" : input.action === "skip" ? "skipped" : "used_hint",
  } as const;

  if (input.action === "retry") {
    return {
      capabilityId: "OBS-LEARNING-000001",
      factType: "RetryObserved",
      severity: "info",
      observedAt,
      context,
      message: "Retry action observed.",
    };
  }

  if (input.action === "skip") {
    return {
      capabilityId: "OBS-LEARNING-000002",
      factType: "SkipObserved",
      severity: "info",
      observedAt,
      context,
      message: "Skip action observed.",
    };
  }

  return {
    capabilityId: "OBS-LEARNING-000003",
    factType: "HintUsed",
    severity: "info",
    observedAt,
    context,
    message: "Hint usage observed.",
  };
}
