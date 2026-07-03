import type { LearningDpEvidencePacket } from "../dp/learning";

export type LearningPedCapabilityId = "PED-LEARNING-000001";

export type LearningTeacherDecision = {
  tmIntId: LearningPedCapabilityId;
  pause_assessment_flow: true;
  ask_confidence_check_question: true;
  offer_encouragement: true;
  optionally_slow_pacing: true;
  do_not_immediately_lower_placement: true;
  reason: "possible_rapid_guessing";
  sourceDpPacketId: string;
};

export type LearningPedDecisionPacket = {
  schemaVersion: "tm-int-ped-learning-decision-v1";
  packetId: string;
  createdAt: string;
  source: "tm-int-ped";
  teachingCaseId: "TC-000003";
  dpPacketId: string;
  decisions: LearningTeacherDecision[];
};

export function buildLearningPedDecision(
  dpPacket: LearningDpEvidencePacket,
  createdAt = dpPacket.createdAt,
): LearningPedDecisionPacket {
  const hasRapidGuessingPattern = dpPacket.evidence.some((evidence) => evidence.reason === "possible_rapid_guessing");

  return {
    schemaVersion: "tm-int-ped-learning-decision-v1",
    packetId: `ped-learning-000001-${dpPacket.packetId}`,
    createdAt,
    source: "tm-int-ped",
    teachingCaseId: "TC-000003",
    dpPacketId: dpPacket.packetId,
    decisions: hasRapidGuessingPattern
      ? [
          {
            tmIntId: "PED-LEARNING-000001",
            pause_assessment_flow: true,
            ask_confidence_check_question: true,
            offer_encouragement: true,
            optionally_slow_pacing: true,
            do_not_immediately_lower_placement: true,
            reason: "possible_rapid_guessing",
            sourceDpPacketId: dpPacket.packetId,
          },
        ]
      : [],
  };
}
