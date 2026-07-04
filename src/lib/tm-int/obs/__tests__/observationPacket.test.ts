import { describe, expect, it } from "vitest";
import { detectLearningObservation } from "../detectors/learning";
import { detectSpeechObservations } from "../detectors/speech";
import { createObservationPacket, createObservationPacketFixture, validateObservationPacket } from "../evidencePacket";
import { OBS_INT_SPRINT1_WORKPACKS, validateObsSprint1Workpacks } from "../workpacks";

describe("OBS INT evidence packets and workpacks", () => {
  it("creates valid fact-only observation packets", () => {
    const facts = [
      ...detectSpeechObservations({ permissionState: "denied", timedOut: true, timeoutMs: 3000 }),
      detectLearningObservation({ action: "retry", route: "/placement/test/:sessionId" }),
      detectLearningObservation({ action: "skip", route: "/placement/test/:sessionId" }),
      detectLearningObservation({ action: "hint", route: "/placement/test/:sessionId" }),
    ];
    const packet = createObservationPacket(facts, "2026-07-03T00:00:00.000Z");

    expect(validateObservationPacket(packet)).toEqual([]);
    expect(packet.schemaVersion).toBe("tm-int-obs-packet-v1");
    expect(packet.facts.map((fact) => fact.factType)).toEqual([
      "MicPermissionDenied",
      "SpeechTimeout",
      "RetryObserved",
      "SkipObserved",
      "HintUsed",
    ]);
    expect(JSON.stringify(packet)).not.toMatch(/verified|weakness|lazy|motivation/i);
  });

  it("creates deterministic DP citation observation fixtures", () => {
    const first = createObservationPacketFixture("dp-citation");
    const second = createObservationPacketFixture("dp-citation");

    expect(first.packetId).toBe(second.packetId);
    expect(validateObservationPacket(first)).toEqual([]);
    expect(first.facts.map((fact) => fact.factType)).toEqual([
      "AudioUnavailable",
      "AudioDurationZero",
      "MicPermissionDenied",
      "AssessmentAnswerSubmitted",
      "AssessmentAnswerSubmitted",
    ]);
    expect(first.facts.map((fact) => fact.context.taskId)).toEqual([
      "listening-a2-class-delay-1",
      "listening-a2-class-delay-1",
      "speaking-a2-intro-1",
      "transfer::item-1",
      "transfer::item-2",
    ]);
    expect(JSON.stringify(first)).not.toMatch(/verified|weakness|lazy|motivation/i);
  });

  it("seeds 12 workpack-ready rows with verified false", () => {
    expect(OBS_INT_SPRINT1_WORKPACKS).toHaveLength(12);
    expect(validateObsSprint1Workpacks()).toEqual([]);
    expect(new Set(OBS_INT_SPRINT1_WORKPACKS.map((wp) => wp.semantic_key)).size).toBe(12);
    expect(OBS_INT_SPRINT1_WORKPACKS.every((wp) => wp.status === "workpack_ready" && wp.verified === false)).toBe(true);
  });
});
