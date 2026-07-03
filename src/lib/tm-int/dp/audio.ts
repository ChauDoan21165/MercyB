import type { DpEvidencePacket, DpInput } from "./types";

const PRODUCT_FAILURE_AUDIO_FACTS = new Set(["AudioUnavailable", "AudioDurationZero", "AudioPlaybackFailed"]);

function packetIdFor(observationPacketId: string, factCount: number): string {
  return `dp-audio-000001-${observationPacketId}-${factCount}`;
}

export function buildAudioDecisionEvidence(
  observationPacket: DpInput,
  createdAt = observationPacket.createdAt,
): DpEvidencePacket {
  const sourceFacts = observationPacket.facts.filter((fact) => PRODUCT_FAILURE_AUDIO_FACTS.has(fact.factType));

  return {
    schemaVersion: "tm-int-dp-evidence-v1",
    packetId: packetIdFor(observationPacket.packetId, sourceFacts.length),
    createdAt,
    source: "tm-int-dp",
    teachingCaseId: "TC-000001",
    observationPacketId: observationPacket.packetId,
    evidence: sourceFacts.length
      ? [
          {
            tmIntId: "DP-AUDIO-000001",
            reason: "product_failure_audio",
            confidence: 0.99,
            placement_validity: "invalid_listening",
            teacher_action: "retest_required",
            sourceObservationPacketId: observationPacket.packetId,
            sourceFacts,
          },
        ]
      : [],
  };
}
