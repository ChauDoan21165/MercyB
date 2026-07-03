import { describe, expect, it } from "vitest";
import { buildLearningDecisionEvidence } from "../dp/learning";
import { judgeReplayTeachingCase000003, runTeachingCaseLearningPipeline } from "../judge/replay";
import { buildAssessmentBehaviorMemory } from "../lm/learning";
import { createObservationPacket } from "../obs/evidencePacket";
import { detectLearningObservation } from "../obs/detectors/learning";
import type { ObservationFact, ObservationPacket } from "../obs/types";
import { buildLearningPedDecision } from "../ped/learning";

const OBSERVED_AT = "2026-07-03T00:00:00.000Z";

function packetFor(facts: ObservationFact[]): ObservationPacket {
  return createObservationPacket(facts, OBSERVED_AT);
}

function answerFact(responseTimeMs: number, correct: boolean, options: {
  taskId?: string;
  productLatencyMs?: number;
  accidentalTap?: boolean;
  questionTooEasy?: boolean;
  priorKnowledge?: boolean;
} = {}): ObservationFact {
  return detectLearningObservation(
    {
      action: "answer",
      responseTimeMs,
      correct,
      route: "/placement/test/:sessionId",
      taskId: options.taskId ?? `assessment-item-${responseTimeMs}-${correct ? "correct" : "wrong"}`,
      productLatencyMs: options.productLatencyMs,
      accidentalTap: options.accidentalTap,
      questionTooEasy: options.questionTooEasy,
      priorKnowledge: options.priorKnowledge,
    },
    OBSERVED_AT,
  );
}

describe("TC-000003 Rapid Guessing During Assessment", () => {
  it("OBS records assessment answer timing and correctness facts", () => {
    const fact = answerFact(900, false, { accidentalTap: true });

    expect(fact).toMatchObject({
      capabilityId: "OBS-LEARNING-000004",
      factType: "AssessmentAnswerSubmitted",
      severity: "info",
    });
    expect(fact.metrics).toMatchObject({ responseTimeMs: 900, correct: 0, accidentalTap: 1 });
  });

  it("DP emits possible_rapid_guessing for repeated quick wrong submissions", () => {
    const dp = buildLearningDecisionEvidence(packetFor([
      answerFact(700, false, { taskId: "item-1" }),
      answerFact(850, false, { taskId: "item-2" }),
      answerFact(900, false, { taskId: "item-3" }),
    ]), OBSERVED_AT);

    expect(dp.evidence[0]).toMatchObject({
      tmIntId: "DP-LEARNING-000001",
      reason: "possible_rapid_guessing",
      confidence: "high",
      assessment_validity: "questionable",
    });
    expect(dp.evidence[0]?.alternative_explanations).toEqual([
      "product_latency_issue",
      "accidental_tap",
      "question_too_easy",
      "prior_knowledge",
    ]);
  });

  it("fast correct due easy item or prior knowledge is not flagged", () => {
    const output = runTeachingCaseLearningPipeline(packetFor([
      answerFact(500, true, { taskId: "easy-1", questionTooEasy: true }),
      answerFact(650, true, { taskId: "known-1", priorKnowledge: true }),
    ]));

    expect(output.dp.evidence).toEqual([]);
    expect(output.ped.decisions).toEqual([]);
    expect(output.lm.assessmentBehaviorObservations).toEqual([]);
  });

  it("accidental tap alternative is preserved while followup is requested", () => {
    const dp = buildLearningDecisionEvidence(packetFor([
      answerFact(1100, false, { taskId: "tap-1", accidentalTap: true }),
      answerFact(1200, false, { taskId: "tap-2", productLatencyMs: 250 }),
    ]), OBSERVED_AT);
    const ped = buildLearningPedDecision(dp, OBSERVED_AT);
    const lm = buildAssessmentBehaviorMemory(ped, OBSERVED_AT);

    expect(dp.evidence[0]?.confidence).toBe("medium");
    expect(dp.evidence[0]?.alternative_explanations).toContain("accidental_tap");
    expect(dp.evidence[0]?.alternative_explanations).toContain("product_latency_issue");
    expect(ped.decisions[0]).toMatchObject({
      pause_assessment_flow: true,
      ask_confidence_check_question: true,
      offer_encouragement: true,
      optionally_slow_pacing: true,
      do_not_immediately_lower_placement: true,
    });
    expect(lm.assessmentBehaviorObservations[0]).toMatchObject({
      status: "needs_followup",
      reason: "possible_rapid_guessing",
      skill_mastery_reduced: false,
    });
  });

  it("normal thoughtful response does not trigger rapid guessing", () => {
    const judge = judgeReplayTeachingCase000003(packetFor([
      answerFact(4500, false, { taskId: "thoughtful-1" }),
      answerFact(5200, true, { taskId: "thoughtful-2" }),
    ]));

    expect(judge.pass).toBe(true);
    expect(judge.first.dp.evidence).toEqual([]);
    expect(judge.first.ped.decisions).toEqual([]);
    expect(judge.first.lm.assessmentBehaviorObservations).toEqual([]);
  });

  it("does not infer learner laziness, carelessness, or low ability", () => {
    const judge = judgeReplayTeachingCase000003(packetFor([
      answerFact(700, false, { taskId: "item-1" }),
      answerFact(850, false, { taskId: "item-2" }),
    ]));
    const text = JSON.stringify(judge);

    expect(judge.pass).toBe(true);
    expect(text).toContain("possible_rapid_guessing");
    expect(text).not.toMatch(/lazy|careless|low ability|weakness|skill mastery reduced|lowered mastery/i);
    expect(text).not.toMatch(/"verified":true/i);
  });

  it("Judge replay is deterministic for rapid guessing", () => {
    const judge = judgeReplayTeachingCase000003(packetFor([
      answerFact(700, false, { taskId: "item-1" }),
      answerFact(850, false, { taskId: "item-2" }),
      answerFact(900, false, { taskId: "item-3" }),
    ]));

    expect(judge.pass).toBe(true);
    expect(judge.deterministic).toBe(true);
    expect(judge.failures).toEqual([]);
    expect(judge.first.dp.evidence[0]?.reason).toBe("possible_rapid_guessing");
    expect(judge.first.ped.decisions[0]?.pause_assessment_flow).toBe(true);
    expect(judge.first.lm.assessmentBehaviorObservations[0]?.status).toBe("needs_followup");
  });
});
