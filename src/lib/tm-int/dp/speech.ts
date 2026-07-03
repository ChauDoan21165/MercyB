import type { ObservationFact, ObservationPacket } from "../obs/types";

export type SpeechDpCapabilityId = "DP-SPEECH-000001";
export type SpeechDecisionReason = "product_or_permission_block";
export type SpeakingResultValidity = "invalid_speaking";
export type SpeechDecisionConfidence = "high";

export type SpeechDecisionEvidence = {
  tmIntId: SpeechDpCapabilityId;
  reason: SpeechDecisionReason;
  confidence: SpeechDecisionConfidence;
  speaking_result_validity: SpeakingResultValidity;
  sourceObservationPacketId: string;
  sourceFacts: ObservationFact[];
};

export type SpeechDpEvidencePacket = {
  schemaVersion: "tm-int-dp-speech-evidence-v1";
  packetId: string;
  createdAt: string;
  source: "tm-int-dp";
  teachingCaseId: "TC-000002";
  observationPacketId: string;
  evidence: SpeechDecisionEvidence[];
};

const SPEECH_BLOCK_FACTS = new Set(["MicPermissionDenied", "SpeechTimeout"]);

export function buildSpeechDecisionEvidence(
  observationPacket: ObservationPacket,
  createdAt = observationPacket.createdAt,
): SpeechDpEvidencePacket {
  const sourceFacts = observationPacket.facts.filter((fact) => SPEECH_BLOCK_FACTS.has(fact.factType));

  return {
    schemaVersion: "tm-int-dp-speech-evidence-v1",
    packetId: `dp-speech-000001-${observationPacket.packetId}-${sourceFacts.length}`,
    createdAt,
    source: "tm-int-dp",
    teachingCaseId: "TC-000002",
    observationPacketId: observationPacket.packetId,
    evidence: sourceFacts.length
      ? [
          {
            tmIntId: "DP-SPEECH-000001",
            reason: "product_or_permission_block",
            confidence: "high",
            speaking_result_validity: "invalid_speaking",
            sourceObservationPacketId: observationPacket.packetId,
            sourceFacts,
          },
        ]
      : [],
  };
}
