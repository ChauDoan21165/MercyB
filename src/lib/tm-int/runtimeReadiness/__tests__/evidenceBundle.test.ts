import { describe, expect, test } from "vitest";
import {
  isRuntimeEvidenceBundle,
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
});
