import { detectAudioObservations } from "./detectors/audio";
import { detectLearningObservation } from "./detectors/learning";
import { detectSpeechObservations } from "./detectors/speech";
import type { ObservationFact, ObservationPacket, ObservationPacketFixtureName } from "./types";

function stablePacketId(facts: ObservationFact[]): string {
  const basis = facts
    .map((fact) => `${fact.capabilityId}:${fact.factType}:${fact.context.requestedUrl ?? ""}:${fact.context.taskId ?? ""}`)
    .join("|");
  let hash = 0;
  for (let i = 0; i < basis.length; i += 1) {
    hash = (hash * 31 + basis.charCodeAt(i)) >>> 0;
  }
  return `obs-packet-${hash.toString(16).padStart(8, "0")}`;
}

export function createObservationPacket(facts: ObservationFact[], createdAt = new Date().toISOString()): ObservationPacket {
  return {
    schemaVersion: "tm-int-obs-packet-v1",
    packetId: stablePacketId(facts),
    createdAt,
    source: "tm-int-obs",
    facts: facts.map((fact) => ({ ...fact, context: { ...fact.context }, metrics: fact.metrics ? { ...fact.metrics } : undefined })),
  };
}

export function createObservationPacketFixture(
  fixtureName: ObservationPacketFixtureName,
  observedAt = "2026-07-03T00:00:00.000Z",
): ObservationPacket {
  if (fixtureName === "dp-citation") {
    return createObservationPacket([
      ...detectAudioObservations({
        requestedUrl: "",
        durationSeconds: 0,
        route: "/placement/test/:sessionId",
        taskId: "listening-a2-class-delay-1",
      }, observedAt),
      ...detectSpeechObservations({
        permissionState: "denied",
        route: "/placement/test/:sessionId",
        taskId: "speaking-a2-intro-1",
      }, observedAt),
      detectLearningObservation({
        action: "answer",
        route: "/placement/test/:sessionId",
        taskId: "transfer::item-1",
        responseTimeMs: 1900,
        correct: true,
      }, observedAt),
      detectLearningObservation({
        action: "answer",
        route: "/placement/test/:sessionId",
        taskId: "transfer::item-2",
        responseTimeMs: 2100,
        correct: true,
      }, observedAt),
    ], observedAt);
  }

  throw new Error(`Unknown observation packet fixture: ${fixtureName satisfies never}`);
}

export function validateObservationPacket(packet: ObservationPacket): string[] {
  const failures: string[] = [];
  if (packet.schemaVersion !== "tm-int-obs-packet-v1") failures.push("schemaVersion must be tm-int-obs-packet-v1");
  if (!packet.packetId.trim()) failures.push("packetId is required");
  if (!packet.createdAt.trim()) failures.push("createdAt is required");
  if (packet.source !== "tm-int-obs") failures.push("source must be tm-int-obs");
  if (!Array.isArray(packet.facts)) failures.push("facts must be an array");
  for (const fact of packet.facts ?? []) {
    if (!fact.capabilityId) failures.push("fact.capabilityId is required");
    if (!fact.factType) failures.push("fact.factType is required");
    if (!fact.observedAt) failures.push("fact.observedAt is required");
    if (!fact.message) failures.push("fact.message is required");
  }
  return failures;
}
