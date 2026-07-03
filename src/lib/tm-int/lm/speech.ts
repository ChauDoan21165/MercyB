import type { SpeechPedDecisionPacket } from "../ped/speech";

export type SpeechLmCapabilityId = "LM-SPEECH-000001";

export type SpeakingAttempt = {
  tmIntId: SpeechLmCapabilityId;
  status: "invalid";
  reason: "mic_permission_or_device_block";
  retest_pending: true;
  sourcePedPacketId: string;
};

export type SpeechLmMemoryPacket = {
  schemaVersion: "tm-int-lm-speech-memory-v1";
  packetId: string;
  createdAt: string;
  source: "tm-int-lm";
  teachingCaseId: "TC-000002";
  pedPacketId: string;
  speakingAttempts: SpeakingAttempt[];
};

export function buildSpeakingAttemptMemory(
  pedPacket: SpeechPedDecisionPacket,
  createdAt = pedPacket.createdAt,
): SpeechLmMemoryPacket {
  const shouldInvalidate = pedPacket.decisions.some(
    (decision) => decision.exclude_speaking_score && decision.offer_text_fallback && decision.reason === "product_or_permission_block",
  );

  return {
    schemaVersion: "tm-int-lm-speech-memory-v1",
    packetId: `lm-speech-000001-${pedPacket.packetId}`,
    createdAt,
    source: "tm-int-lm",
    teachingCaseId: "TC-000002",
    pedPacketId: pedPacket.packetId,
    speakingAttempts: shouldInvalidate
      ? [
          {
            tmIntId: "LM-SPEECH-000001",
            status: "invalid",
            reason: "mic_permission_or_device_block",
            retest_pending: true,
            sourcePedPacketId: pedPacket.packetId,
          },
        ]
      : [],
  };
}
