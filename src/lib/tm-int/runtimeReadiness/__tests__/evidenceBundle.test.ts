import { describe, expect, test } from "vitest";
import {
  isRuntimeEvidenceBundle,
  missingRuntimeEvidenceBundleFields,
  observationIdsFromBundle,
  RUNTIME_EVIDENCE_BUNDLE_REQUIRED_FIELDS,
  RUNTIME_EVIDENCE_BUNDLE_SCHEMA_VERSION,
  signalKeysFromBundle,
  type PartialRuntimeEvidenceBundle,
  type RuntimeEvidenceBundleRequiredField,
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

  test("rejects malformed nested evidence inside the canonical envelope", () => {
    const bundle = createValidRuntimeEvidenceBundle();

    expect(isRuntimeEvidenceBundle({
      ...bundle,
      obsPacket: { ...bundle.obsPacket, schemaVersion: "not-obs" as never },
    })).toBe(false);
    expect(isRuntimeEvidenceBundle({
      ...bundle,
      runtimeDecision: { ...bundle.runtimeDecision, signalKeys: undefined as never },
    })).toBe(false);
    expect(isRuntimeEvidenceBundle({
      ...bundle,
      replay: { ...bundle.replay, deterministic: undefined as never },
    })).toBe(false);
  });

  test("reports missing canonical DP input envelope fields", () => {
    const bundle = createValidRuntimeEvidenceBundle();

    for (const field of RUNTIME_EVIDENCE_BUNDLE_REQUIRED_FIELDS) {
      const partial = { ...bundle } as PartialRuntimeEvidenceBundle;
      delete partial[field as RuntimeEvidenceBundleRequiredField];

      expect(missingRuntimeEvidenceBundleFields(partial)).toEqual([field]);
      expect(isRuntimeEvidenceBundle(partial)).toBe(false);
    }
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

  test("normalizes signal keys from emitted learning signals", () => {
    const bundle = createValidRuntimeEvidenceBundle();
    const sourceSignal = {
      signal_key: "productive_hesitation",
      source_edu_id: "EDU-LS-000001",
      confidence: "medium",
      evidenceCount: 1,
      alternatives: ["question_too_easy"],
    } as const;
    const keys = signalKeysFromBundle({
      ...bundle,
      learningSignals: [sourceSignal],
      dpDecision: { ...bundle.dpDecision, signalKeys: ["dp_signal"] },
      pedDecision: { ...bundle.pedDecision, signalKeys: ["ped_signal"] },
      runtimeDecision: { ...bundle.runtimeDecision, signalKeys: ["runtime_signal"] },
    });

    expect(Array.from(keys)).toEqual(expect.arrayContaining([
      sourceSignal.signal_key,
    ]));
    expect(keys.has("dp_signal")).toBe(false);
    expect(keys.has("ped_signal")).toBe(false);
    expect(keys.has("runtime_signal")).toBe(false);
  });
});
