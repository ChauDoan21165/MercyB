import { describe, expect, it } from "vitest";
import { createObservationPacket } from "../../obs/evidencePacket";
import { detectLearningObservation } from "../../obs/detectors/learning";
import type { ObservationFact, ObservationPacket } from "../../obs/types";
import { LEARNING_SIGNAL_MAPPINGS, runLearningSignalEngine } from "../index";

const OBSERVED_AT = "2026-07-03T00:00:00.000Z";

function packetFor(facts: ObservationFact[]): ObservationPacket {
  return createObservationPacket(facts, OBSERVED_AT);
}

function answerFact(taskId: string, responseTimeMs: number, correct: boolean): ObservationFact {
  return detectLearningObservation(
    {
      action: "answer",
      responseTimeMs,
      correct,
      route: "/placement/test/:sessionId",
      taskId,
    },
    OBSERVED_AT,
  );
}

function hintFact(taskId: string): ObservationFact {
  return detectLearningObservation(
    {
      action: "hint",
      route: "/placement/test/:sessionId",
      taskId,
    },
    OBSERVED_AT,
  );
}

describe("Learning Signal Engine", () => {
  it("registers the required EDU mappings", () => {
    expect(LEARNING_SIGNAL_MAPPINGS.map((mapping) => mapping.signal_key)).toEqual([
      "productive_hesitation",
      "healthy_self_correction",
      "hint_dependency",
      "misconception_recurrence",
      "retrieval_success",
      "productive_struggle",
      "sustained_attention",
      "confidence_calibration",
      "cognitive_overload",
      "transfer_success",
    ]);
  });

  it("maps pause plus final correct plus no hint to ProductiveHesitation", () => {
    const output = runLearningSignalEngine(packetFor([answerFact("item-1", 3600, true)]));

    expect(output.signals).toContainEqual(expect.objectContaining({
      signal_key: "productive_hesitation",
      source_edu_id: "EDU-LS-000001",
      confidence: "medium",
      no_psychology: true,
      no_learner_ability_conclusion: true,
    }));
    expect(output.signals.find((signal) => signal.signal_key === "productive_hesitation")?.evidence).toHaveLength(1);
  });

  it("maps wrong revised correct to HealthySelfCorrection", () => {
    const output = runLearningSignalEngine(packetFor([
      answerFact("item-2", 1200, false),
      answerFact("item-2", 1800, true),
    ]));

    expect(output.signals).toContainEqual(expect.objectContaining({
      signal_key: "healthy_self_correction",
      source_edu_id: "EDU-LS-000002",
      confidence: "high",
    }));
  });

  it("maps repeated hint usage to HintDependency", () => {
    const output = runLearningSignalEngine(packetFor([
      hintFact("item-3"),
      hintFact("item-4"),
      hintFact("item-5"),
    ]));

    expect(output.signals).toContainEqual(expect.objectContaining({
      signal_key: "hint_dependency",
      source_edu_id: "EDU-LS-000003",
      confidence: "high",
    }));
    expect(output.signals.find((signal) => signal.signal_key === "hint_dependency")?.evidence).toHaveLength(3);
  });

  it("maps same concept wrong repeatedly to MisconceptionRecurrence", () => {
    const output = runLearningSignalEngine(packetFor([
      answerFact("past-tense-concept", 1500, false),
      answerFact("past-tense-concept", 2100, false),
    ]));

    expect(output.signals).toContainEqual(expect.objectContaining({
      signal_key: "misconception_recurrence",
      source_edu_id: "EDU-LS-000004",
      confidence: "medium",
    }));
  });

  it("maps correct after delay to RetrievalSuccess", () => {
    const output = runLearningSignalEngine(packetFor([answerFact("item-6", 5600, true)]));

    expect(output.signals).toContainEqual(expect.objectContaining({
      signal_key: "retrieval_success",
      source_edu_id: "EDU-LS-000005",
      confidence: "medium",
    }));
  });

  it("does not emit psychology or learner ability conclusions", () => {
    const output = runLearningSignalEngine(packetFor([
      answerFact("item-7", 3600, true),
      answerFact("item-8", 1000, false),
      answerFact("item-8", 1600, true),
      hintFact("item-9"),
      hintFact("item-10"),
    ]));
    const serialized = JSON.stringify(output);

    expect(output.signals.every((signal) => signal.evidence.length > 0)).toBe(true);
    expect(output.signals.every((signal) => signal.alternatives.length > 0)).toBe(true);
    expect(output.signals.every((signal) => signal.no_psychology && signal.no_learner_ability_conclusion)).toBe(true);
    expect(serialized).not.toMatch(/lazy|careless|low ability|bad learner|poor learner|ability conclusion/i);
  });
});
