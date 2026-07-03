import type { ObservationFact, ObservationPacket } from "./types";

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
