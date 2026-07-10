// WP-001 born observable — axes registry, standard observation events, stable digest.
import { describe, it, expect } from "vitest";
import { OBSERVATION_CAPABILITIES, capabilityById } from "@/lib/tm-int/obs/registry";
import { validateObservationPacket } from "@/lib/tm-int/obs/evidencePacket";
import { ObservationEventBus } from "@/lib/tm-int/obs/eventBus";
import { PREDICTION_AXES, predictionAxisById } from "@/lib/tm-int/pred/registry";
import { predictionRecordedFact, surpriseResolvedFact, predictionObservationPacket } from "@/lib/tm-int/pred/observe";
import { buildThesisFixture } from "@/lib/tm-int/pred/fixtures";

describe("WP-001: born observable", () => {
  it("registers prediction axes, each backed by a real obs capability", () => {
    expect(PREDICTION_AXES).toHaveLength(3);
    for (const axis of PREDICTION_AXES) {
      expect(predictionAxisById(axis.axisId)).toEqual(axis);
      expect(capabilityById(axis.backingCapability)).not.toBeNull();
    }
    // The three prediction capabilities exist in the shared registry.
    const predIds = OBSERVATION_CAPABILITIES.filter((c) => c.domain === "prediction").map((c) => c.id);
    expect(predIds).toEqual(["OBS-PRED-000001", "OBS-PRED-000002", "OBS-PRED-000003"]);
  });

  it("emits standard observation facts on the shared bus", () => {
    const bus = new ObservationEventBus();
    const seen: string[] = [];
    const unsub = bus.subscribe((fact) => seen.push(fact.factType));

    const { rows, resolutions } = buildThesisFixture();
    bus.publish(predictionRecordedFact(rows[0]));
    bus.publish(surpriseResolvedFact(resolutions[0]));
    unsub();

    expect(seen).toContain("PredictionRecorded");
    expect(seen).toContain("SurpriseResolved");
    // Facts validate as a normal observation packet.
    expect(validateObservationPacket(predictionObservationPacket(rows, resolutions))).toEqual([]);
  });

  it("digests stable fixtures deterministically (same packetId across runs)", () => {
    const first = buildThesisFixture();
    const second = buildThesisFixture();
    const p1 = predictionObservationPacket(first.rows, first.resolutions);
    const p2 = predictionObservationPacket(second.rows, second.resolutions);
    expect(p1.packetId).toBe(p2.packetId);
    expect(p1).toStrictEqual(p2);
  });

  it("observation facts carry no learner text — only labels, scalars, and a PII-free anchor", () => {
    const { rows, resolutions } = buildThesisFixture();
    const serialized = JSON.stringify(predictionObservationPacket(rows, resolutions));
    // No raw learner sentences leak; the anchor is the synthetic session id only.
    expect(serialized).not.toMatch(/coffee|school|yesterday|bought/i);
    expect(serialized).toMatch(/pred::wp001-thesis::/);
  });
});
