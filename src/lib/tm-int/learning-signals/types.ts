import type { EduLearningSignalId, EduLearningSignalKey } from "../edu";
import type { ObservationFact, ObservationPacket } from "../obs/types";

export type LearningSignalConfidence = "low" | "medium" | "high";

export type NormalizedLearningSignal = {
  signal_id: string;
  signal_key: EduLearningSignalKey;
  source_edu_id: EduLearningSignalId;
  confidence: LearningSignalConfidence;
  evidence: ObservationFact[];
  alternatives: readonly string[];
  no_psychology: true;
  no_learner_ability_conclusion: true;
};

export type LearningSignalEngineInput = ObservationPacket;

export type LearningSignalEngineOutput = {
  schemaVersion: "tm-int-learning-signals-v1";
  source: "tm-int-learning-signal-engine";
  observationPacketId: string;
  signals: NormalizedLearningSignal[];
};
