import type { ObservationFact, ObservationPacket } from "../obs/types";

export type LearningDpCapabilityId = "DP-LEARNING-000001";
export type RapidGuessingReason = "possible_rapid_guessing";
export type RapidGuessingConfidence = "medium" | "high";
export type AssessmentValidity = "questionable";
export type RapidGuessingAlternativeExplanation =
  | "product_latency_issue"
  | "accidental_tap"
  | "question_too_easy"
  | "prior_knowledge";

export type LearningDecisionEvidence = {
  tmIntId: LearningDpCapabilityId;
  reason: RapidGuessingReason;
  confidence: RapidGuessingConfidence;
  assessment_validity: AssessmentValidity;
  alternative_explanations: RapidGuessingAlternativeExplanation[];
  sourceObservationPacketId: string;
  sourceFacts: ObservationFact[];
};

export type LearningDpEvidencePacket = {
  schemaVersion: "tm-int-dp-learning-evidence-v1";
  packetId: string;
  createdAt: string;
  source: "tm-int-dp";
  teachingCaseId: "TC-000003";
  observationPacketId: string;
  evidence: LearningDecisionEvidence[];
};

const MIN_RESPONSE_TIME_MS = 1500;
const MIN_QUICK_WRONG_COUNT = 2;
const ALTERNATIVE_EXPLANATIONS: RapidGuessingAlternativeExplanation[] = [
  "product_latency_issue",
  "accidental_tap",
  "question_too_easy",
  "prior_knowledge",
];

function isAnswerFact(fact: ObservationFact): boolean {
  return fact.factType === "AssessmentAnswerSubmitted";
}

function responseTimeMs(fact: ObservationFact): number {
  return fact.metrics?.responseTimeMs ?? Number.POSITIVE_INFINITY;
}

function isCorrect(fact: ObservationFact): boolean {
  return fact.metrics?.correct === 1;
}

function confidenceFor(quickWrongFacts: ObservationFact[]): RapidGuessingConfidence {
  const averageResponseTime =
    quickWrongFacts.reduce((sum, fact) => sum + responseTimeMs(fact), 0) / Math.max(quickWrongFacts.length, 1);
  return quickWrongFacts.length >= 3 || averageResponseTime < 1000 ? "high" : "medium";
}

export function buildLearningDecisionEvidence(
  observationPacket: ObservationPacket,
  createdAt = observationPacket.createdAt,
): LearningDpEvidencePacket {
  const answerFacts = observationPacket.facts.filter(isAnswerFact);
  const quickWrongFacts = answerFacts.filter((fact) => responseTimeMs(fact) < MIN_RESPONSE_TIME_MS && !isCorrect(fact));

  return {
    schemaVersion: "tm-int-dp-learning-evidence-v1",
    packetId: `dp-learning-000001-${observationPacket.packetId}-${quickWrongFacts.length}`,
    createdAt,
    source: "tm-int-dp",
    teachingCaseId: "TC-000003",
    observationPacketId: observationPacket.packetId,
    evidence:
      quickWrongFacts.length >= MIN_QUICK_WRONG_COUNT
        ? [
            {
              tmIntId: "DP-LEARNING-000001",
              reason: "possible_rapid_guessing",
              confidence: confidenceFor(quickWrongFacts),
              assessment_validity: "questionable",
              alternative_explanations: ALTERNATIVE_EXPLANATIONS,
              sourceObservationPacketId: observationPacket.packetId,
              sourceFacts: quickWrongFacts,
            },
          ]
        : [],
  };
}
