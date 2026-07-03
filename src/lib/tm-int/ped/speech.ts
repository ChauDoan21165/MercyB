import type { SpeechDpEvidencePacket } from "../dp/speech";

export type SpeechPedCapabilityId = "PED-SPEECH-000001";

export type SpeechTeacherDecision = {
  tmIntId: SpeechPedCapabilityId;
  exclude_speaking_score: true;
  offer_text_fallback: true;
  offer_mic_retry: true;
  continue_remaining_sections: true;
  show_supportive_message: true;
  reason: "product_or_permission_block";
  sourceDpPacketId: string;
};

export type SpeechPedDecisionPacket = {
  schemaVersion: "tm-int-ped-speech-decision-v1";
  packetId: string;
  createdAt: string;
  source: "tm-int-ped";
  teachingCaseId: "TC-000002";
  dpPacketId: string;
  decisions: SpeechTeacherDecision[];
};

export function buildSpeechPedDecision(
  dpPacket: SpeechDpEvidencePacket,
  createdAt = dpPacket.createdAt,
): SpeechPedDecisionPacket {
  const hasSpeechBlock = dpPacket.evidence.some((evidence) => evidence.reason === "product_or_permission_block");

  return {
    schemaVersion: "tm-int-ped-speech-decision-v1",
    packetId: `ped-speech-000001-${dpPacket.packetId}`,
    createdAt,
    source: "tm-int-ped",
    teachingCaseId: "TC-000002",
    dpPacketId: dpPacket.packetId,
    decisions: hasSpeechBlock
      ? [
          {
            tmIntId: "PED-SPEECH-000001",
            exclude_speaking_score: true,
            offer_text_fallback: true,
            offer_mic_retry: true,
            continue_remaining_sections: true,
            show_supportive_message: true,
            reason: "product_or_permission_block",
            sourceDpPacketId: dpPacket.packetId,
          },
        ]
      : [],
  };
}
