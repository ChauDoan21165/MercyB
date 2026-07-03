import { describe, expect, it } from "vitest";
import { buildLearningBehaviorDpPacket } from "../dp/learningBehaviorFamily";
import { judgeReplayLearningBehaviorFamily, runLearningBehaviorFamilyPipeline } from "../judge/learningBehaviorFamily";
import { runLearningSignalEngine } from "../learning-signals";
import { buildLearningBehaviorLmPacket } from "../lm/learningBehaviorFamily";
import { createObservationPacket } from "../obs/evidencePacket";
import { detectLearningObservation } from "../obs/detectors/learning";
import type { ObservationFact, ObservationPacket } from "../obs/types";
import { buildLearningBehaviorPedPacket } from "../ped/learningBehaviorFamily";

const OBSERVED_AT = "2026-07-03T00:00:00.000Z";

function packetFor(facts: ObservationFact[]): ObservationPacket {
  return createObservationPacket(facts, OBSERVED_AT);
}

function answerFact(taskId: string, responseTimeMs: number, correct: boolean, confidenceRating?: number): ObservationFact {
  return detectLearningObservation(
    {
      action: "answer",
      responseTimeMs,
      correct,
      route: "/placement/test/:sessionId",
      taskId,
      confidenceRating,
    },
    OBSERVED_AT,
  );
}

function hintFact(taskId: string): ObservationFact {
  return detectLearningObservation({ action: "hint", route: "/placement/test/:sessionId", taskId }, OBSERVED_AT);
}

function signalKeys(packet: ObservationPacket): string[] {
  return runLearningSignalEngine(packet).signals.map((signal) => signal.signal_key);
}

describe("Learning Behavior Family v1", () => {
  it("covers each capability positive case", () => {
    const packet = packetFor([
      answerFact("hesitation-1", 3600, true),
      answerFact("self-correct-1", 1000, false),
      answerFact("self-correct-1", 1600, true),
      hintFact("hint-1"),
      hintFact("hint-2"),
      answerFact("misconception-1", 1500, false),
      answerFact("misconception-1", 2100, false),
      answerFact("retrieval-1", 5600, true),
      answerFact("struggle::item-1", 1200, false),
      answerFact("struggle::item-2", 1400, false),
      answerFact("struggle::item-3", 2200, true),
      answerFact("attention-1", 2200, true),
      answerFact("attention-2", 2400, false),
      answerFact("attention-3", 2600, true),
      answerFact("confidence-1", 1700, true, 5),
      answerFact("overload-1", 4600, false),
      answerFact("overload-2", 4900, false),
      hintFact("overload-help"),
      answerFact("transfer::item-1", 1900, true),
      answerFact("transfer::item-2", 2000, true),
    ]);

    expect(new Set(signalKeys(packet))).toEqual(new Set([
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
    ]));
  });

  it("covers each capability negative case", () => {
    const cases: Array<[string, ObservationPacket, string]> = [
      ["productive_hesitation", packetFor([answerFact("no-hesitation", 3600, true), hintFact("no-hesitation")]), "productive_hesitation"],
      ["healthy_self_correction", packetFor([answerFact("wrong-only", 1000, false)]), "healthy_self_correction"],
      ["hint_dependency", packetFor([hintFact("one-hint")]), "hint_dependency"],
      ["misconception_recurrence", packetFor([answerFact("wrong-a", 1500, false), answerFact("wrong-b", 2100, false)]), "misconception_recurrence"],
      ["retrieval_success", packetFor([answerFact("short-correct", 1200, true)]), "retrieval_success"],
      ["productive_struggle", packetFor([answerFact("struggle-lite", 1200, false), answerFact("struggle-lite", 2000, true)]), "productive_struggle"],
      ["sustained_attention", packetFor([answerFact("attn-1", 2200, true), answerFact("attn-2", 2400, true)]), "sustained_attention"],
      ["confidence_calibration", packetFor([answerFact("miscalibrated", 1600, false, 5)]), "confidence_calibration"],
      ["cognitive_overload", packetFor([answerFact("slow-wrong-1", 4600, false), answerFact("slow-wrong-2", 4900, false)]), "cognitive_overload"],
      ["transfer_success", packetFor([answerFact("transfer-one::item-1", 1900, true)]), "transfer_success"],
    ];

    for (const [name, packet, forbiddenSignal] of cases) {
      expect(signalKeys(packet), name).not.toContain(forbiddenSignal);
    }
  });

  it("preserves alternatives through DP and PED and stores STM without mastery reduction", () => {
    const signalPacket = runLearningSignalEngine(packetFor([
      answerFact("overload-1", 4600, false),
      answerFact("overload-2", 4900, false),
      hintFact("overload-help"),
    ]));
    const dp = buildLearningBehaviorDpPacket(signalPacket, OBSERVED_AT);
    const ped = buildLearningBehaviorPedPacket(dp, OBSERVED_AT);
    const lm = buildLearningBehaviorLmPacket(ped, OBSERVED_AT);

    expect(dp.interpretations[0]).toMatchObject({
      signal_key: "cognitive_overload",
      interpretation: "learning_behavior_signal_observed",
      no_learner_weakness_inference: true,
      no_mastery_reduction_from_single_event: true,
    });
    expect(dp.interpretations[0]?.alternatives).toContain("product_latency_issue");
    expect(ped.actions[0]).toMatchObject({
      signal_key: "cognitive_overload",
      preserve_alternatives: true,
      explainable: true,
      do_not_lower_placement_from_single_event: true,
    });
    expect(lm.memories[0]).toMatchObject({
      signal_key: "cognitive_overload",
      memory_type: "stm_learning_behavior_observation",
      mastery_reduced: false,
    });
  });

  it("Judge replay is deterministic and avoids unsafe learner inference", () => {
    const judge = judgeReplayLearningBehaviorFamily(packetFor([
      answerFact("struggle::item-1", 1200, false),
      answerFact("struggle::item-2", 1400, false),
      answerFact("struggle::item-3", 2200, true),
      hintFact("support-1"),
      hintFact("support-2"),
    ]));
    const serialized = JSON.stringify(judge);

    expect(judge.pass).toBe(true);
    expect(judge.deterministic).toBe(true);
    expect(judge.failures).toEqual([]);
    expect(serialized).not.toMatch(/lazy|careless|low ability|bad learner|poor learner|weakness inferred|mastery_reduced":true/i);
    expect(serialized).not.toMatch(/"verified":true/i);
  });

  it("full pipeline emits aligned DP, PED, and LM records", () => {
    const output = runLearningBehaviorFamilyPipeline(packetFor([answerFact("confidence-1", 1800, true, 5)]));

    expect(output.signals.signals[0]?.signal_key).toBe("confidence_calibration");
    expect(output.dp.interpretations[0]?.source_edu_id).toBe("EDU-LS-000008");
    expect(output.ped.actions[0]?.teacher_action).toBe("ask_reflection_and_calibrate_with_followup");
    expect(output.lm.memories[0]?.status).toBe("observed_needs_teacher_interpretation");
  });
});
