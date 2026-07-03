import type { LmInput, LmMemoryPacket } from "./types";

export function buildListeningAttemptMemory(pedPacket: LmInput, createdAt = pedPacket.createdAt): LmMemoryPacket {
  const shouldInvalidate = pedPacket.decisions.some(
    (decision) => decision.exclude_listening_score && decision.offer_retest && decision.reason === "product_failure_audio",
  );

  return {
    schemaVersion: "tm-int-lm-memory-v1",
    packetId: `lm-audio-000001-${pedPacket.packetId}`,
    createdAt,
    source: "tm-int-lm",
    teachingCaseId: "TC-000001",
    pedPacketId: pedPacket.packetId,
    listeningAttempts: shouldInvalidate
      ? [
          {
            tmIntId: "LM-AUDIO-000001",
            status: "invalid",
            reason: "product_failure",
            retest_pending: true,
            sourcePedPacketId: pedPacket.packetId,
          },
        ]
      : [],
  };
}
