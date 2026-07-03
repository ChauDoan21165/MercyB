import type { EduLearningSignalKey } from "../edu";
import type { LearningSignalEngineOutput, NormalizedLearningSignal } from "../learning-signals";

export type LearningBehaviorDpCapabilityId = "DP-LBF-V1-000001";

export type LearningBehaviorInterpretation = {
  tmIntId: LearningBehaviorDpCapabilityId;
  familyId: "LEARNING-BEHAVIOR-FAMILY-v1";
  signal_key: EduLearningSignalKey;
  interpretation: "learning_behavior_signal_observed";
  confidence: NormalizedLearningSignal["confidence"];
  evidence: NormalizedLearningSignal["evidence"];
  alternatives: NormalizedLearningSignal["alternatives"];
  source_edu_id: NormalizedLearningSignal["source_edu_id"];
  no_learner_weakness_inference: true;
  no_mastery_reduction_from_single_event: true;
};

export type LearningBehaviorDpPacket = {
  schemaVersion: "tm-int-dp-learning-behavior-v1";
  packetId: string;
  createdAt: string;
  source: "tm-int-dp";
  familyId: "LEARNING-BEHAVIOR-FAMILY-v1";
  signalPacketId: string;
  interpretations: LearningBehaviorInterpretation[];
};

export function buildLearningBehaviorDpPacket(
  signalPacket: LearningSignalEngineOutput,
  createdAt = new Date().toISOString(),
): LearningBehaviorDpPacket {
  return {
    schemaVersion: "tm-int-dp-learning-behavior-v1",
    packetId: `dp-lbf-v1-${signalPacket.observationPacketId}-${signalPacket.signals.length}`,
    createdAt,
    source: "tm-int-dp",
    familyId: "LEARNING-BEHAVIOR-FAMILY-v1",
    signalPacketId: signalPacket.observationPacketId,
    interpretations: signalPacket.signals.map((signal) => ({
      tmIntId: "DP-LBF-V1-000001",
      familyId: "LEARNING-BEHAVIOR-FAMILY-v1",
      signal_key: signal.signal_key,
      interpretation: "learning_behavior_signal_observed",
      confidence: signal.confidence,
      evidence: signal.evidence,
      alternatives: signal.alternatives,
      source_edu_id: signal.source_edu_id,
      no_learner_weakness_inference: true,
      no_mastery_reduction_from_single_event: true,
    })),
  };
}
