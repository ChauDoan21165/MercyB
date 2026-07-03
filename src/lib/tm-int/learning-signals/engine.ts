import { eduDefinitionById, type EduLearningSignalId, type EduLearningSignalKey } from "../edu";
import type { ObservationFact } from "../obs/types";
import type { LearningSignalEngineInput, LearningSignalEngineOutput, NormalizedLearningSignal } from "./types";

const PAUSE_THRESHOLD_MS = 3000;
const RETRIEVAL_DELAY_THRESHOLD_MS = 5000;
const HINT_DEPENDENCY_THRESHOLD = 2;
const RECURRENCE_THRESHOLD = 2;
const THOUGHTFUL_RESPONSE_THRESHOLD_MS = 2000;
const COGNITIVE_OVERLOAD_THRESHOLD_MS = 4000;

function answerFacts(facts: ObservationFact[]): ObservationFact[] {
  return facts.filter((fact) => fact.factType === "AssessmentAnswerSubmitted");
}

function hintFacts(facts: ObservationFact[]): ObservationFact[] {
  return facts.filter((fact) => fact.factType === "HintUsed");
}

function taskAnchor(fact: ObservationFact): string {
  return fact.context.taskId ?? fact.context.route ?? "unanchored";
}

function conceptAnchor(fact: ObservationFact): string {
  return taskAnchor(fact).split("::")[0] ?? taskAnchor(fact);
}

function isCorrect(fact: ObservationFact): boolean {
  return fact.metrics?.correct === 1;
}

function responseTimeMs(fact: ObservationFact): number {
  return fact.metrics?.responseTimeMs ?? 0;
}

function confidenceRating(fact: ObservationFact): number | null {
  const rating = fact.metrics?.confidenceRating;
  return typeof rating === "number" && rating >= 0 ? rating : null;
}

function signal(
  index: number,
  signalKey: EduLearningSignalKey,
  sourceEduId: EduLearningSignalId,
  confidence: NormalizedLearningSignal["confidence"],
  evidence: ObservationFact[],
): NormalizedLearningSignal {
  const definition = eduDefinitionById(sourceEduId);
  if (!definition) {
    throw new Error(`Missing EDU definition for ${sourceEduId}`);
  }

  return {
    signal_id: `ls-${sourceEduId.toLowerCase()}-${index}`,
    signal_key: signalKey,
    source_edu_id: sourceEduId,
    confidence,
    evidence,
    alternatives: definition.alternative_explanations,
    no_psychology: true,
    no_learner_ability_conclusion: true,
  };
}

function noHintForTask(hints: ObservationFact[], fact: ObservationFact): boolean {
  return !hints.some((hint) => taskAnchor(hint) === taskAnchor(fact));
}

function buildProductiveHesitationSignals(facts: ObservationFact[]): NormalizedLearningSignal[] {
  const hints = hintFacts(facts);
  return answerFacts(facts)
    .filter((fact) => isCorrect(fact) && responseTimeMs(fact) >= PAUSE_THRESHOLD_MS && noHintForTask(hints, fact))
    .map((fact, index) => signal(index, "productive_hesitation", "EDU-LS-000001", "medium", [fact]));
}

function buildHealthySelfCorrectionSignals(facts: ObservationFact[]): NormalizedLearningSignal[] {
  const byTask = new Map<string, ObservationFact[]>();
  for (const fact of answerFacts(facts)) {
    const key = taskAnchor(fact);
    byTask.set(key, [...(byTask.get(key) ?? []), fact]);
  }

  const signals: NormalizedLearningSignal[] = [];
  for (const taskFacts of byTask.values()) {
    const wrongIndex = taskFacts.findIndex((fact) => !isCorrect(fact));
    const correctAfterWrong = wrongIndex >= 0 ? taskFacts.slice(wrongIndex + 1).find(isCorrect) : undefined;
    if (wrongIndex >= 0 && correctAfterWrong) {
      signals.push(signal(signals.length, "healthy_self_correction", "EDU-LS-000002", "high", [
        taskFacts[wrongIndex],
        correctAfterWrong,
      ]));
    }
  }
  return signals;
}

function buildHintDependencySignals(facts: ObservationFact[]): NormalizedLearningSignal[] {
  const hints = hintFacts(facts);
  return hints.length >= HINT_DEPENDENCY_THRESHOLD
    ? [signal(0, "hint_dependency", "EDU-LS-000003", hints.length >= 3 ? "high" : "medium", hints)]
    : [];
}

function buildMisconceptionRecurrenceSignals(facts: ObservationFact[]): NormalizedLearningSignal[] {
  const wrongByTask = new Map<string, ObservationFact[]>();
  for (const fact of answerFacts(facts).filter((answer) => !isCorrect(answer))) {
    const key = taskAnchor(fact);
    wrongByTask.set(key, [...(wrongByTask.get(key) ?? []), fact]);
  }

  const signals: NormalizedLearningSignal[] = [];
  for (const wrongFacts of wrongByTask.values()) {
    if (wrongFacts.length >= RECURRENCE_THRESHOLD) {
      signals.push(signal(signals.length, "misconception_recurrence", "EDU-LS-000004", "medium", wrongFacts));
    }
  }
  return signals;
}

function buildRetrievalSuccessSignals(facts: ObservationFact[]): NormalizedLearningSignal[] {
  return answerFacts(facts)
    .filter((fact) => isCorrect(fact) && responseTimeMs(fact) >= RETRIEVAL_DELAY_THRESHOLD_MS)
    .map((fact, index) => signal(index, "retrieval_success", "EDU-LS-000005", "medium", [fact]));
}

function buildProductiveStruggleSignals(facts: ObservationFact[]): NormalizedLearningSignal[] {
  const byConcept = new Map<string, ObservationFact[]>();
  for (const fact of answerFacts(facts)) {
    const key = conceptAnchor(fact);
    byConcept.set(key, [...(byConcept.get(key) ?? []), fact]);
  }

  const signals: NormalizedLearningSignal[] = [];
  for (const conceptFacts of byConcept.values()) {
    const correctIndex = conceptFacts.findIndex(isCorrect);
    const wrongBeforeCorrect = correctIndex >= 0 ? conceptFacts.slice(0, correctIndex).filter((fact) => !isCorrect(fact)) : [];
    if (wrongBeforeCorrect.length >= 2) {
      signals.push(signal(signals.length, "productive_struggle", "EDU-LS-000006", "medium", [
        ...wrongBeforeCorrect,
        conceptFacts[correctIndex],
      ]));
    }
  }
  return signals;
}

function buildSustainedAttentionSignals(facts: ObservationFact[]): NormalizedLearningSignal[] {
  const thoughtfulAnswers = answerFacts(facts).filter((fact) => responseTimeMs(fact) >= THOUGHTFUL_RESPONSE_THRESHOLD_MS);
  return thoughtfulAnswers.length >= 3
    ? [signal(0, "sustained_attention", "EDU-LS-000007", "medium", thoughtfulAnswers)]
    : [];
}

function buildConfidenceCalibrationSignals(facts: ObservationFact[]): NormalizedLearningSignal[] {
  return answerFacts(facts)
    .filter((fact) => {
      const rating = confidenceRating(fact);
      return rating !== null && ((rating >= 4 && isCorrect(fact)) || (rating <= 2 && !isCorrect(fact)));
    })
    .map((fact, index) => signal(index, "confidence_calibration", "EDU-LS-000008", "medium", [fact]));
}

function buildCognitiveOverloadSignals(facts: ObservationFact[]): NormalizedLearningSignal[] {
  const slowWrongAnswers = answerFacts(facts).filter(
    (fact) => !isCorrect(fact) && responseTimeMs(fact) >= COGNITIVE_OVERLOAD_THRESHOLD_MS,
  );
  const hints = hintFacts(facts);

  return slowWrongAnswers.length >= 2 && hints.length > 0
    ? [signal(0, "cognitive_overload", "EDU-LS-000009", "medium", [...slowWrongAnswers, ...hints])]
    : [];
}

function buildTransferSuccessSignals(facts: ObservationFact[]): NormalizedLearningSignal[] {
  const correctByConcept = new Map<string, ObservationFact[]>();
  for (const fact of answerFacts(facts).filter(isCorrect)) {
    const key = conceptAnchor(fact);
    correctByConcept.set(key, [...(correctByConcept.get(key) ?? []), fact]);
  }

  const signals: NormalizedLearningSignal[] = [];
  for (const conceptFacts of correctByConcept.values()) {
    const distinctTasks = new Set(conceptFacts.map(taskAnchor));
    if (distinctTasks.size >= 2) {
      signals.push(signal(signals.length, "transfer_success", "EDU-LS-000010", "medium", conceptFacts));
    }
  }
  return signals;
}

export function runLearningSignalEngine(input: LearningSignalEngineInput): LearningSignalEngineOutput {
  const signals = [
    ...buildProductiveHesitationSignals(input.facts),
    ...buildHealthySelfCorrectionSignals(input.facts),
    ...buildHintDependencySignals(input.facts),
    ...buildMisconceptionRecurrenceSignals(input.facts),
    ...buildRetrievalSuccessSignals(input.facts),
    ...buildProductiveStruggleSignals(input.facts),
    ...buildSustainedAttentionSignals(input.facts),
    ...buildConfidenceCalibrationSignals(input.facts),
    ...buildCognitiveOverloadSignals(input.facts),
    ...buildTransferSuccessSignals(input.facts),
  ];

  return {
    schemaVersion: "tm-int-learning-signals-v1",
    source: "tm-int-learning-signal-engine",
    observationPacketId: input.packetId,
    signals,
  };
}
