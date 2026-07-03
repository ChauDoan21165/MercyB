import type { LearningObservationInput, ObservationFact } from "../types";

export function detectLearningObservation(input: LearningObservationInput, observedAt = new Date().toISOString()): ObservationFact {
  if (input.action === "answer") {
    return {
      capabilityId: "OBS-LEARNING-000004",
      factType: "AssessmentAnswerSubmitted",
      severity: "info",
      observedAt,
      context: {
        route: input.route,
        taskId: input.taskId,
        learnerAction: "answered",
      },
      metrics: {
        responseTimeMs: input.responseTimeMs,
        correct: input.correct ? 1 : 0,
        productLatencyMs: input.productLatencyMs ?? 0,
        accidentalTap: input.accidentalTap ? 1 : 0,
        questionTooEasy: input.questionTooEasy ? 1 : 0,
        priorKnowledge: input.priorKnowledge ? 1 : 0,
      },
      message: "Assessment answer timing and correctness observed.",
    };
  }

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
