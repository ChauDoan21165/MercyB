import type { EduLearningSignalKey } from "../edu";
import type { LearningBehaviorPedPacket } from "../ped/learningBehaviorFamily";

export type LearningBehaviorLmCapabilityId = "LM-LBF-V1-000001";

export type LearningBehaviorMemoryRecord = {
  tmIntId: LearningBehaviorLmCapabilityId;
  signal_key: EduLearningSignalKey;
  memory_type: "stm_learning_behavior_observation";
  status: "observed_needs_teacher_interpretation";
  mastery_reduced: false;
  sourcePedPacketId: string;
};

export type LearningBehaviorLmPacket = {
  schemaVersion: "tm-int-lm-learning-behavior-v1";
  packetId: string;
  createdAt: string;
  source: "tm-int-lm";
  familyId: "LEARNING-BEHAVIOR-FAMILY-v1";
  pedPacketId: string;
  memories: LearningBehaviorMemoryRecord[];
};

export function buildLearningBehaviorLmPacket(
  pedPacket: LearningBehaviorPedPacket,
  createdAt = pedPacket.createdAt,
): LearningBehaviorLmPacket {
  return {
    schemaVersion: "tm-int-lm-learning-behavior-v1",
    packetId: `lm-lbf-v1-${pedPacket.packetId}`,
    createdAt,
    source: "tm-int-lm",
    familyId: "LEARNING-BEHAVIOR-FAMILY-v1",
    pedPacketId: pedPacket.packetId,
    memories: pedPacket.actions.map((action) => ({
      tmIntId: "LM-LBF-V1-000001",
      signal_key: action.signal_key,
      memory_type: "stm_learning_behavior_observation",
      status: "observed_needs_teacher_interpretation",
      mastery_reduced: false,
      sourcePedPacketId: pedPacket.packetId,
    })),
  };
}
