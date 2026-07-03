import type { PedDecisionPacket, PedInput } from "./types";

export function buildAudioPedDecision(dpPacket: PedInput, createdAt = dpPacket.createdAt): PedDecisionPacket {
  const hasProductFailure = dpPacket.evidence.some((evidence) => evidence.reason === "product_failure_audio");

  return {
    schemaVersion: "tm-int-ped-decision-v1",
    packetId: `ped-audio-000001-${dpPacket.packetId}`,
    createdAt,
    source: "tm-int-ped",
    teachingCaseId: "TC-000001",
    dpPacketId: dpPacket.packetId,
    decisions: hasProductFailure
      ? [
          {
            tmIntId: "PED-AUDIO-000001",
            exclude_listening_score: true,
            offer_retest: true,
            continue_remaining_sections: true,
            show_support_message: true,
            reason: "product_failure_audio",
            sourceDpPacketId: dpPacket.packetId,
          },
        ]
      : [],
  };
}
