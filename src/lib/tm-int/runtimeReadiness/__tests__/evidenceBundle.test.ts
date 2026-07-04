import { describe, expect, test } from "vitest";
import {
  isRuntimeEvidenceBundle,
  observationIdsFromBundle,
  RUNTIME_EVIDENCE_BUNDLE_SCHEMA_VERSION,
  type PartialRuntimeEvidenceBundle,
} from "../evidenceBundle";
import { createValidRuntimeEvidenceBundle } from "../fixtureBuilder";

describe("runtime evidence bundle schema", () => {
  test("accepts the canonical RuntimeEvidenceBundle envelope", () => {
    const bundle = createValidRuntimeEvidenceBundle();

    expect(bundle.schemaVersion).toBe(RUNTIME_EVIDENCE_BUNDLE_SCHEMA_VERSION);
    expect(isRuntimeEvidenceBundle(bundle)).toBe(true);
  });

  test("rejects partial evidence that is not the canonical DP input envelope", () => {
    const partial: PartialRuntimeEvidenceBundle = {
      schemaVersion: RUNTIME_EVIDENCE_BUNDLE_SCHEMA_VERSION,
      contractId: "RR-001",
      runtimeEvent: createValidRuntimeEvidenceBundle().runtimeEvent,
    };

    expect(isRuntimeEvidenceBundle(partial)).toBe(false);
  });

  test("normalizes observation ids from runtime and OBS source evidence", () => {
    const bundle = createValidRuntimeEvidenceBundle();
    const requestedUrl = "/audio/placement-v3/listening-a2-class-delay-1.mp3";
    const ids = observationIdsFromBundle({
      ...bundle,
      runtimeEvent: { ...bundle.runtimeEvent, observationIds: ["runtime-observation"] },
      obsPacket: {
        ...bundle.obsPacket,
        facts: bundle.obsPacket.facts.map((fact, index) =>
          index === 0 ? { ...fact, context: { ...fact.context, requestedUrl } } : fact,
        ),
      },
    });

    expect(Array.from(ids)).toEqual(expect.arrayContaining([
      bundle.obsPacket.packetId,
      "runtime-observation",
      requestedUrl,
    ]));
  });
});
