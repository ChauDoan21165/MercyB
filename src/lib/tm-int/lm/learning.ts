import type { LearningPedDecisionPacket } from "../ped/learning";

export type LearningLmCapabilityId = "LM-LEARNING-000001";

export type AssessmentBehaviorObservation = {
  tmIntId: LearningLmCapabilityId;
  status: "needs_followup";
  reason: "possible_rapid_guessing";
  skill_mastery_reduced: false;
  sourcePedPacketId: string;
};

export type LearningLmMemoryPacket = {
  schemaVersion: "tm-int-lm-learning-memory-v1";
  packetId: string;
  createdAt: string;
  source: "tm-int-lm";
  teachingCaseId: "TC-000003";
  pedPacketId: string;
  assessmentBehaviorObservations: AssessmentBehaviorObservation[];
};

export function buildAssessmentBehaviorMemory(
  pedPacket: LearningPedDecisionPacket,
  createdAt = pedPacket.createdAt,
): LearningLmMemoryPacket {
  const needsFollowup = pedPacket.decisions.some(
    (decision) => decision.pause_assessment_flow && decision.reason === "possible_rapid_guessing",
  );

  return {
    schemaVersion: "tm-int-lm-learning-memory-v1",
    packetId: `lm-learning-000001-${pedPacket.packetId}`,
    createdAt,
    source: "tm-int-lm",
    teachingCaseId: "TC-000003",
    pedPacketId: pedPacket.packetId,
    assessmentBehaviorObservations: needsFollowup
      ? [
          {
            tmIntId: "LM-LEARNING-000001",
            status: "needs_followup",
            reason: "possible_rapid_guessing",
            skill_mastery_reduced: false,
            sourcePedPacketId: pedPacket.packetId,
          },
        ]
      : [],
  };
}
