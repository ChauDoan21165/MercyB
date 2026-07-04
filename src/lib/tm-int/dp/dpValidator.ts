import type { TeacherContext } from "../runtime";
import type { DpEvidenceBasedDecision, DpLearnerPerformanceClaim } from "./decisionContract";

export type DpDecisionValidationFailureCode =
  | "missing_teacher_context"
  | "missing_teacher_context_reference"
  | "teacher_context_reference_mismatch"
  | "missing_evidence_citation"
  | "unknown_observation_citation"
  | "unknown_learning_signal_citation"
  | "claim_observation_not_declared"
  | "claim_learning_signal_not_declared"
  | "product_failure_as_learner_weakness"
  | "learner_weakness_without_evidence"
  | "invalid_confidence_level"
  | "ped_allowed_without_rationale"
  | "recommendation_missing_rationale"
  | "unsupported_inference";

export type DpDecisionValidationFailure = {
  code: DpDecisionValidationFailureCode;
  path: string;
  reason: string;
};

export type DpDecisionValidationResult = {
  pass: boolean;
  failures: DpDecisionValidationFailure[];
};

const VALID_CONFIDENCE_LEVELS = new Set(["low", "medium", "high"]);
const LEARNER_WEAKNESS_PATTERN =
  /weak listening|weak speaking|poor learner|bad learner|bad comprehension|poor pronunciation|low ability|lazy|careless|learner weakness/i;
const UNSUPPORTED_INFERENCE_PATTERN =
  /must be|clearly is|obviously|always|never tries|does not care|lazy|careless|low ability/i;

function nonEmpty(values: readonly string[]): boolean {
  return values.some((value) => value.trim().length > 0);
}

function hasClaimEvidence(claim: DpLearnerPerformanceClaim): boolean {
  return nonEmpty(claim.citedObservationIds) || nonEmpty(claim.citedLearningSignalIds);
}

function knownObservationIds(context: TeacherContext | undefined): Set<string> {
  const ids = new Set<string>();
  if (context?.observationSummary.packetId) ids.add(context.observationSummary.packetId);
  return ids;
}

function knownLearningSignalIds(context: TeacherContext | undefined): Set<string> {
  return new Set(context?.learningSignals.map((signal) => signal.signal_key) ?? []);
}

function addUndeclaredClaimCitationFailures(decision: DpEvidenceBasedDecision): DpDecisionValidationFailure[] {
  const failures: DpDecisionValidationFailure[] = [];
  const declaredObservations = new Set(decision.citedObservationIds);
  const declaredSignals = new Set(decision.citedLearningSignalIds);

  for (const [index, claim] of decision.learnerPerformanceClaims.entries()) {
    for (const observationId of claim.citedObservationIds) {
      if (!declaredObservations.has(observationId)) {
        failures.push({
          code: "claim_observation_not_declared",
          path: `learnerPerformanceClaims.${index}.citedObservationIds`,
          reason: `Learner performance claim cited observation ${observationId} that is not declared on the DP decision.`,
        });
      }
    }

    for (const signalId of claim.citedLearningSignalIds) {
      if (!declaredSignals.has(signalId)) {
        failures.push({
          code: "claim_learning_signal_not_declared",
          path: `learnerPerformanceClaims.${index}.citedLearningSignalIds`,
          reason: `Learner performance claim cited learning signal ${signalId} that is not declared on the DP decision.`,
        });
      }
    }
  }

  return failures;
}

function addUnknownCitationFailures(
  decision: DpEvidenceBasedDecision,
  teacherContext: TeacherContext | undefined,
): DpDecisionValidationFailure[] {
  if (!teacherContext) return [];

  const failures: DpDecisionValidationFailure[] = [];
  const observations = knownObservationIds(teacherContext);
  const signals = knownLearningSignalIds(teacherContext);

  for (const observationId of decision.citedObservationIds) {
    if (!observations.has(observationId)) {
      failures.push({
        code: "unknown_observation_citation",
        path: "citedObservationIds",
        reason: `DP cited unknown observation id ${observationId}.`,
      });
    }
  }

  for (const signalId of decision.citedLearningSignalIds) {
    if (!signals.has(signalId)) {
      failures.push({
        code: "unknown_learning_signal_citation",
        path: "citedLearningSignalIds",
        reason: `DP cited unknown learning signal id ${signalId}.`,
      });
    }
  }

  for (const [index, claim] of decision.learnerPerformanceClaims.entries()) {
    for (const observationId of claim.citedObservationIds) {
      if (!observations.has(observationId)) {
        failures.push({
          code: "unknown_observation_citation",
          path: `learnerPerformanceClaims.${index}.citedObservationIds`,
          reason: `DP learner performance claim cited unknown observation id ${observationId}.`,
        });
      }
    }

    for (const signalId of claim.citedLearningSignalIds) {
      if (!signals.has(signalId)) {
        failures.push({
          code: "unknown_learning_signal_citation",
          path: `learnerPerformanceClaims.${index}.citedLearningSignalIds`,
          reason: `DP learner performance claim cited unknown learning signal id ${signalId}.`,
        });
      }
    }
  }

  return failures;
}

function hasProductIssueContext(decision: DpEvidenceBasedDecision, teacherContext: TeacherContext | undefined): boolean {
  return decision.productIssueHandling.productIssuePresent || Boolean(teacherContext?.productIssues.length);
}

function containsLearnerWeakness(value: unknown): boolean {
  return LEARNER_WEAKNESS_PATTERN.test(JSON.stringify(value));
}

function containsUnsupportedInference(value: unknown): boolean {
  return UNSUPPORTED_INFERENCE_PATTERN.test(JSON.stringify(value));
}

export function validateDpDecision(
  decision: DpEvidenceBasedDecision,
  teacherContext?: TeacherContext,
): DpDecisionValidationResult {
  const failures: DpDecisionValidationFailure[] = [];

  if (!teacherContext) {
    failures.push({
      code: "missing_teacher_context",
      path: "teacherContext",
      reason: "DP validation requires the Teacher Context consumed by the decision.",
    });
  }

  if (!decision.sourceTeacherContextRef) {
    failures.push({
      code: "missing_teacher_context_reference",
      path: "sourceTeacherContextRef",
      reason: "DP decisions must reference the Teacher Context they consumed.",
    });
  } else if (
    teacherContext &&
    (
      decision.sourceTeacherContextRef.schemaVersion !== teacherContext.schemaVersion ||
      decision.sourceTeacherContextRef.observationPacketId !== teacherContext.observationSummary.packetId
    )
  ) {
    failures.push({
      code: "teacher_context_reference_mismatch",
      path: "sourceTeacherContextRef",
      reason: "DP Teacher Context reference does not match the supplied Teacher Context.",
    });
  }

  if (!nonEmpty(decision.citedObservationIds) && !nonEmpty(decision.citedLearningSignalIds)) {
    failures.push({
      code: "missing_evidence_citation",
      path: "citedObservationIds",
      reason: "DP decisions must cite at least one observation id or learning signal id.",
    });
  }

  failures.push(...addUnknownCitationFailures(decision, teacherContext));
  failures.push(...addUndeclaredClaimCitationFailures(decision));

  if (!VALID_CONFIDENCE_LEVELS.has(decision.confidenceLevel)) {
    failures.push({
      code: "invalid_confidence_level",
      path: "confidenceLevel",
      reason: "DP confidence level must be low, medium, or high.",
    });
  }

  if (!decision.recommendation.rationale.trim()) {
    failures.push({
      code: "recommendation_missing_rationale",
      path: "recommendation.rationale",
      reason: "DP recommendation must include a rationale.",
    });
  }

  if (decision.pedAllowedToAct && !decision.recommendation.rationale.trim()) {
    failures.push({
      code: "ped_allowed_without_rationale",
      path: "pedAllowedToAct",
      reason: "PED cannot act from DP unless the DP recommendation has rationale.",
    });
  }

  for (const [index, claim] of decision.learnerPerformanceClaims.entries()) {
    if (claim.claimType === "learner_weakness" && (!claim.supported || !hasClaimEvidence(claim) || !claim.rationale.trim())) {
      failures.push({
        code: "learner_weakness_without_evidence",
        path: `learnerPerformanceClaims.${index}`,
        reason: "Learner weakness claims require cited evidence and rationale.",
      });
    }

    if (!claim.supported || containsUnsupportedInference(claim)) {
      failures.push({
        code: "unsupported_inference",
        path: `learnerPerformanceClaims.${index}`,
        reason: "DP learner performance claim includes unsupported inference.",
      });
    }
  }

  if (
    hasProductIssueContext(decision, teacherContext) &&
    (
      decision.productIssueHandling.classifiedAsLearnerWeakness ||
      !decision.productIssueHandling.handledAsProductIssue ||
      containsLearnerWeakness({
        productIssueHandling: decision.productIssueHandling,
        learnerPerformanceClaims: decision.learnerPerformanceClaims,
        explanation: decision.explanation,
        recommendation: decision.recommendation,
      })
    )
  ) {
    failures.push({
      code: "product_failure_as_learner_weakness",
      path: "productIssueHandling",
      reason: "Product failures must remain product issues and cannot be classified as learner weakness.",
    });
  }

  if (containsUnsupportedInference({ explanation: decision.explanation, recommendation: decision.recommendation })) {
    failures.push({
      code: "unsupported_inference",
      path: "explanation",
      reason: "DP explanation or recommendation includes unsupported inference.",
    });
  }

  return {
    pass: failures.length === 0,
    failures,
  };
}
