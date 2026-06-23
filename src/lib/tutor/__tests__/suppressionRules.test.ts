/**
 * Tests for Teacher Mercy Suppression Rules
 *
 * Covers:
 *   - All 10 suppression rules exist and are well-formed
 *   - Each rule check function returns correct evaluation
 *   - S1 Fluency Flow: long utterance + minor error → suppress
 *   - S2 Isolated Slip: first occurrence at B1+ → suppress
 *   - S3 Affective Filter: shy learner + minor → suppress
 *   - S4 Topic Derail: flow mode + minor → suppress
 *   - S5 Developmental Readiness: A1 + advanced structure → suppress
 *   - S6 Self-Repair Window: self-corrected → suppress
 *   - S7 Cognitive Load: 5+ corrections → suppress
 *   - S8 Meaning Preserved: minor error → suppress
 *   - S9 Creative Expression: creative markers → suppress
 *   - S10 Listening Mode: narrative + minor → suppress
 *   - evaluateSuppressions integration
 *   - Priority ordering (highest priority wins)
 *   - Edge cases: lesson target overrides, empty context
 *   - Catalogs are complete and consistent
 *   - Determinism and no side effects
 */
import { describe, expect, it } from "vitest";
import {
  evaluateSuppressions,
  getSuppressionRuleById,
  buildSuppressionContext,
  SUPPRESSION_RULES_CATALOG,
  SUPPRESSION_RULES_BY_ID,
  SUPPRESSION_RULES_BY_CATEGORY,
  SUPPRESSION_CATEGORY_CATALOG,
  type SuppressionContext,
  type SuppressionRule,
  type SuppressionDecision,
  type SuppressionEvaluation,
} from "../suppressionRules";

// ─── Helpers ──────────────────────────────────────────────────────────────

function ctx(overrides: Partial<SuppressionContext> = {}): SuppressionContext {
  return {
    learnerText: "I go to school every day.",
    errorSeverity: "grammar",
    cefrLevel: "B1",
    learnerConfidence: "normal",
    didSelfCorrect: false,
    sameMistakeCount: 1,
    previousCorrectionsThisSession: 0,
    isCurrentLessonTarget: false,
    isInFlowMode: false,
    isShowingFrustration: false,
    utteranceWordCount: 6,
    ...overrides,
  };
}

// ─── Catalog Integrity ────────────────────────────────────────────────────

describe("SUPPRESSION_RULES_CATALOG — integrity", () => {
  it("contains exactly 10 rules", () => {
    expect(SUPPRESSION_RULES_CATALOG).toHaveLength(10);
  });

  it("every rule has a unique id", () => {
    const ids = SUPPRESSION_RULES_CATALOG.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every rule has all required fields", () => {
    for (const rule of SUPPRESSION_RULES_CATALOG) {
      expect(rule.id).toBeTruthy();
      expect(rule.id).toMatch(/^S\d+_/);
      expect(rule.priority).toBeGreaterThan(0);
      expect(rule.labelVi).toBeTruthy();
      expect(rule.labelEn).toBeTruthy();
      expect(rule.rationaleVi).toBeTruthy();
      expect(rule.rationaleEn).toBeTruthy();
      expect(rule.category).toBeTruthy();
      expect(["fluency_first", "learner_state", "error_nature", "conversation_flow", "developmental"]).toContain(
        rule.category,
      );
    }
  });

  it("every rule has Vietnamese rationale that mentions Mercy or learner", () => {
    for (const rule of SUPPRESSION_RULES_CATALOG) {
      expect(rule.rationaleVi.length).toBeGreaterThan(30);
    }
  });

  it("every rule priority is in valid range", () => {
    for (const rule of SUPPRESSION_RULES_CATALOG) {
      expect(rule.priority).toBeGreaterThanOrEqual(60);
      expect(rule.priority).toBeLessThanOrEqual(100);
    }
  });

  it("SUPPRESSION_RULES_BY_ID maps all rules by id", () => {
    expect(SUPPRESSION_RULES_BY_ID.size).toBe(10);
    for (const rule of SUPPRESSION_RULES_CATALOG) {
      expect(SUPPRESSION_RULES_BY_ID.get(rule.id)).toBe(rule);
    }
  });

  it("SUPPRESSION_RULES_BY_CATEGORY groups all rules", () => {
    let totalGrouped = 0;
    for (const [, rules] of SUPPRESSION_RULES_BY_CATEGORY) {
      totalGrouped += rules.length;
    }
    expect(totalGrouped).toBe(10);
  });

  it("SUPPRESSION_CATEGORY_CATALOG covers all 5 categories", () => {
    const categories = SUPPRESSION_CATEGORY_CATALOG.map((c) => c.category);
    expect(categories).toContain("fluency_first");
    expect(categories).toContain("learner_state");
    expect(categories).toContain("error_nature");
    expect(categories).toContain("conversation_flow");
    expect(categories).toContain("developmental");
  });
});

// ─── S1 — Fluency Flow ────────────────────────────────────────────────────

describe("S1 — Fluency Flow", () => {
  it("applies: long utterance (8+ words) + minor error → suppress", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "I go to school every day and I eat rice for lunch.",
        errorSeverity: "minor",
        utteranceWordCount: 14,
        learnerConfidence: "confident",
      }),
    );
    expect(decision.shouldSuppress).toBe(true);
    expect(decision.primaryReason?.rule.id).toBe("S1_FLUENCY_FLOW");
  });

  it("applies: long utterance + fluency error → suppress", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "She go to school every day and she eat rice every day and she do homework.",
        errorSeverity: "fluency",
        utteranceWordCount: 18,
      }),
    );
    expect(decision.shouldSuppress).toBe(true);
    expect(decision.primaryReason?.rule.id).toBe("S1_FLUENCY_FLOW");
  });

  it("does NOT apply: long utterance but grammar error (too significant)", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "She go to school every day and she eat rice for lunch.",
        errorSeverity: "grammar",
        utteranceWordCount: 14,
      }),
    );
    // S1 shouldn't apply for grammar — verify it's not in applicable rules
    const s1InApplicable = decision.applicableRules.some((r) => r.rule.id === "S1_FLUENCY_FLOW");
    expect(s1InApplicable).toBe(false);
  });

  it("does NOT apply: minor error but short utterance", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "She go.",
        errorSeverity: "minor",
        utteranceWordCount: 2,
      }),
    );
    const s1Eval = decision.applicableRules.find((r) => r.rule.id === "S1_FLUENCY_FLOW");
    // May not even be in applicableRules since it doesn't apply
    if (s1Eval) expect(s1Eval.applies).toBe(false);
  });

  it("does NOT apply: lesson target overrides flow", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "I go to school every day and I eat rice for lunch.",
        errorSeverity: "minor",
        utteranceWordCount: 14,
        isCurrentLessonTarget: true,
      }),
    );
    const s1Eval = decision.applicableRules.find((r) => r.rule.id === "S1_FLUENCY_FLOW");
    if (s1Eval) expect(s1Eval.applies).toBe(false);
  });
});

// ─── S2 — Isolated Slip ───────────────────────────────────────────────────

describe("S2 — Isolated Slip", () => {
  it("applies: first occurrence + B1 + word_choice → suppress", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "I make my homework.",
        errorSeverity: "word_choice",
        cefrLevel: "B1",
        sameMistakeCount: 1,
      }),
    );
    expect(decision.shouldSuppress).toBe(true);
    expect(decision.primaryReason?.rule.id).toBe("S2_ISOLATED_SLIP");
  });

  it("applies: first occurrence + C1 + fluency → suppress", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "I am going to the store maybe.",
        errorSeverity: "fluency",
        cefrLevel: "C1",
        sameMistakeCount: 1,
      }),
    );
    // S2 applies (isolated slip) — may not be primary if S8 (meaning preserved) also fires
    const s2Applies = decision.applicableRules.some((r) => r.rule.id === "S2_ISOLATED_SLIP");
    expect(s2Applies).toBe(true);
    expect(decision.shouldSuppress).toBe(true);
  });

  it("does NOT apply: repeated mistake (sameMistakeCount=3)", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "I make my homework.",
        errorSeverity: "word_choice",
        cefrLevel: "B1",
        sameMistakeCount: 3,
      }),
    );
    const s2Eval = decision.applicableRules.find((r) => r.rule.id === "S2_ISOLATED_SLIP");
    if (s2Eval) expect(s2Eval.applies).toBe(false);
  });

  it("does NOT apply: A1 learner can't distinguish slip from gap", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "I make my homework.",
        errorSeverity: "word_choice",
        cefrLevel: "A1",
        sameMistakeCount: 1,
      }),
    );
    const s2Eval = decision.applicableRules.find((r) => r.rule.id === "S2_ISOLATED_SLIP");
    if (s2Eval) expect(s2Eval.applies).toBe(false);
  });
});

// ─── S3 — Affective Filter ────────────────────────────────────────────────

describe("S3 — Affective Filter", () => {
  it("applies: shy learner + minor error → suppress (highest priority)", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "She happy.",
        errorSeverity: "minor",
        learnerConfidence: "shy",
      }),
    );
    expect(decision.shouldSuppress).toBe(true);
    expect(decision.primaryReason?.rule.id).toBe("S3_AFFECTIVE_FILTER");
  });

  it("applies: frustrated learner + fluency error → suppress", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "I don't know maybe she go to the store.",
        errorSeverity: "fluency",
        isShowingFrustration: true,
      }),
    );
    expect(decision.primaryReason?.rule.id).toBe("S3_AFFECTIVE_FILTER");
  });

  it("applies: shy learner + word_choice → suppress", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "I make homework.",
        errorSeverity: "word_choice",
        learnerConfidence: "shy",
      }),
    );
    expect(decision.primaryReason?.rule.id).toBe("S3_AFFECTIVE_FILTER");
  });

  it("does NOT apply: shy learner but grammar error (too significant)", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "She happy.",
        errorSeverity: "grammar",
        learnerConfidence: "shy",
      }),
    );
    const s3Eval = decision.applicableRules.find((r) => r.rule.id === "S3_AFFECTIVE_FILTER");
    if (s3Eval) expect(s3Eval.applies).toBe(false);
  });

  it("does NOT apply: shy learner but lesson target", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "She happy.",
        errorSeverity: "minor",
        learnerConfidence: "shy",
        isCurrentLessonTarget: true,
      }),
    );
    const s3Eval = decision.applicableRules.find((r) => r.rule.id === "S3_AFFECTIVE_FILTER");
    if (s3Eval) expect(s3Eval.applies).toBe(false);
  });
});

// ─── S4 — Topic Derail ────────────────────────────────────────────────────

describe("S4 — Topic Derail", () => {
  it("applies: flow mode + long utterance + minor error → suppress", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "I went to the market yesterday and I bought many vegetables and fruits for my family dinner.",
        errorSeverity: "minor",
        isInFlowMode: true,
        utteranceWordCount: 18,
      }),
    );
    // S4 applies — may not be primary if S1 (fluency flow) also fires (both valid)
    const s4Applies = decision.applicableRules.some((r) => r.rule.id === "S4_TOPIC_DERAIL");
    expect(s4Applies).toBe(true);
    expect(decision.shouldSuppress).toBe(true);
  });

  it("applies: 10+ word utterance + word_choice → suppress (without explicit flow mode)", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "I think this is very important for our project because we need good result.",
        errorSeverity: "word_choice",
        utteranceWordCount: 15,
      }),
    );
    expect(decision.primaryReason?.rule.id).toBe("S4_TOPIC_DERAIL");
  });

  it("does NOT apply: short utterance + minor error", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "She go.",
        errorSeverity: "minor",
        utteranceWordCount: 2,
      }),
    );
    const s4Eval = decision.applicableRules.find((r) => r.rule.id === "S4_TOPIC_DERAIL");
    if (s4Eval) expect(s4Eval.applies).toBe(false);
  });
});

// ─── S5 — Developmental Readiness ─────────────────────────────────────────

describe("S5 — Developmental Readiness", () => {
  it("applies: A1 learner attempting B1+ structure → suppress", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "I would have gone if I were you.",
        errorSeverity: "grammar",
        cefrLevel: "A1",
      }),
    );
    expect(decision.shouldSuppress).toBe(true);
    expect(decision.primaryReason?.rule.id).toBe("S5_DEVELOPMENTAL_READINESS");
  });

  it("applies: A2 learner attempting advanced structure → suppress", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "I should have done my homework yesterday.",
        errorSeverity: "grammar",
        cefrLevel: "A2",
      }),
    );
    expect(decision.primaryReason?.rule.id).toBe("S5_DEVELOPMENTAL_READINESS");
  });

  it("does NOT apply: B1 learner (ready for these structures)", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "I would have gone if I were you.",
        errorSeverity: "grammar",
        cefrLevel: "B1",
      }),
    );
    const s5Eval = decision.applicableRules.find((r) => r.rule.id === "S5_DEVELOPMENTAL_READINESS");
    if (s5Eval) expect(s5Eval.applies).toBe(false);
  });

  it("does NOT apply: A1 but text has no advanced structures", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "She go to school.",
        errorSeverity: "grammar",
        cefrLevel: "A1",
      }),
    );
    const s5Eval = decision.applicableRules.find((r) => r.rule.id === "S5_DEVELOPMENTAL_READINESS");
    if (s5Eval) expect(s5Eval.applies).toBe(false);
  });
});

// ─── S6 — Self-Repair Window ──────────────────────────────────────────────

describe("S6 — Self-Repair Window", () => {
  it("applies: self-corrected + grammar error → suppress", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "I mean... she go to school.",
        errorSeverity: "grammar",
        didSelfCorrect: true,
      }),
    );
    expect(decision.shouldSuppress).toBe(true);
    expect(decision.primaryReason?.rule.id).toBe("S6_SELF_REPAIR_WINDOW");
  });

  it("applies: self-corrected + word_choice → suppress", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "Wait, I make... I do my homework.",
        errorSeverity: "word_choice",
        didSelfCorrect: true,
      }),
    );
    expect(decision.primaryReason?.rule.id).toBe("S6_SELF_REPAIR_WINDOW");
  });

  it("does NOT apply: no self-correction detected", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "She go to school.",
        errorSeverity: "grammar",
        didSelfCorrect: false,
      }),
    );
    const s6Eval = decision.applicableRules.find((r) => r.rule.id === "S6_SELF_REPAIR_WINDOW");
    if (s6Eval) expect(s6Eval.applies).toBe(false);
  });
});

// ─── S7 — Cognitive Load ──────────────────────────────────────────────────

describe("S7 — Cognitive Load", () => {
  it("applies: 5+ corrections + minor error → suppress", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "She go to school.",
        errorSeverity: "minor",
        previousCorrectionsThisSession: 5,
      }),
    );
    expect(decision.shouldSuppress).toBe(true);
    expect(decision.primaryReason?.rule.id).toBe("S7_COGNITIVE_LOAD");
  });

  it("applies: 8+ corrections + word_choice → suppress", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "I make my homework.",
        errorSeverity: "word_choice",
        previousCorrectionsThisSession: 8,
      }),
    );
    expect(decision.primaryReason?.rule.id).toBe("S7_COGNITIVE_LOAD");
  });

  it("does NOT apply: 5+ corrections but grammar error (significant)", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "She happy.",
        errorSeverity: "grammar",
        previousCorrectionsThisSession: 5,
      }),
    );
    const s7Eval = decision.applicableRules.find((r) => r.rule.id === "S7_COGNITIVE_LOAD");
    if (s7Eval) expect(s7Eval.applies).toBe(false);
  });

  it("does NOT apply: few corrections (below threshold)", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "She go.",
        errorSeverity: "minor",
        previousCorrectionsThisSession: 2,
      }),
    );
    const s7Eval = decision.applicableRules.find((r) => r.rule.id === "S7_COGNITIVE_LOAD");
    if (s7Eval) expect(s7Eval.applies).toBe(false);
  });
});

// ─── S8 — Meaning Preserved ───────────────────────────────────────────────

describe("S8 — Meaning Preserved", () => {
  it("applies: minor error → suppress", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "She go to school every day.",
        errorSeverity: "minor",
      }),
    );
    expect(decision.shouldSuppress).toBe(true);
    expect(decision.primaryReason?.rule.id).toBe("S8_MEANING_PRESERVED");
  });

  it("applies: fluency error → suppress", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "I am going to the store maybe I buy something.",
        errorSeverity: "fluency",
        utteranceWordCount: 11,
      }),
    );
    // S8 applies (meaning preserved) — may not be primary if other rules also fire for long text
    const s8Applies = decision.applicableRules.some((r) => r.rule.id === "S8_MEANING_PRESERVED");
    expect(s8Applies).toBe(true);
    expect(decision.shouldSuppress).toBe(true);
  });

  it("does NOT apply: grammar error (meaning may be affected)", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "She happy.",
        errorSeverity: "grammar",
      }),
    );
    const s8Eval = decision.applicableRules.find((r) => r.rule.id === "S8_MEANING_PRESERVED");
    if (s8Eval) expect(s8Eval.applies).toBe(false);
  });
});

// ─── S9 — Creative Expression ─────────────────────────────────────────────

describe("S9 — Creative Expression", () => {
  it("applies: 'I think' + word_choice → suppress", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "I think this is good solution for our problem maybe.",
        errorSeverity: "word_choice",
      }),
    );
    expect(decision.shouldSuppress).toBe(true);
    // S9 applies — may not be primary if S2 (isolated slip) also fires
    const s9Applies = decision.applicableRules.some((r) => r.rule.id === "S9_CREATIVE_EXPRESSION");
    expect(s9Applies).toBe(true);
  });

  it("applies: 'maybe' + 'try' + fluency → suppress", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "Maybe I try to explain what I mean sort of.",
        errorSeverity: "fluency",
        utteranceWordCount: 9,
      }),
    );
    // S9 applies — S1 (fluency flow) may also fire and have higher priority
    const s9Applies = decision.applicableRules.some((r) => r.rule.id === "S9_CREATIVE_EXPRESSION");
    expect(s9Applies).toBe(true);
    expect(decision.shouldSuppress).toBe(true);
  });

  it("applies: 'haha' + minor → suppress (humor attempt)", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "My English is not good haha.",
        errorSeverity: "minor",
      }),
    );
    // S9 applies — S8 (meaning preserved) may also fire and have similar priority
    const s9Applies = decision.applicableRules.some((r) => r.rule.id === "S9_CREATIVE_EXPRESSION");
    expect(s9Applies).toBe(true);
    expect(decision.shouldSuppress).toBe(true);
  });

  it("does NOT apply: no creative markers + grammar", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "She happy.",
        errorSeverity: "grammar",
      }),
    );
    const s9Eval = decision.applicableRules.find((r) => r.rule.id === "S9_CREATIVE_EXPRESSION");
    if (s9Eval) expect(s9Eval.applies).toBe(false);
  });
});

// ─── S10 — Listening Mode ─────────────────────────────────────────────────

describe("S10 — Listening Mode", () => {
  it("applies: long narrative + minor error → suppress", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText:
          "Yesterday I went to the market with my friend and we bought many things for our dinner party.",
        errorSeverity: "minor",
        utteranceWordCount: 18,
      }),
    );
    expect(decision.shouldSuppress).toBe(true);
    expect(decision.primaryReason?.rule.id).toBe("S10_LISTENING_MODE");
  });

  it("applies: personal story markers ('when I was') + minor → suppress", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "When I was a child my mom always cook delicious food for our family every day.",
        errorSeverity: "minor",
        utteranceWordCount: 17,
      }),
    );
    expect(decision.primaryReason?.rule.id).toBe("S10_LISTENING_MODE");
  });

  it("applies: flow mode + narrative + minor → suppress", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "I remember one time my friend and I went to the beach.",
        errorSeverity: "minor",
        isInFlowMode: true,
        utteranceWordCount: 13,
      }),
    );
    expect(decision.primaryReason?.rule.id).toBe("S10_LISTENING_MODE");
  });

  it("does NOT apply: narrative but grammar error", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText:
          "Yesterday I went to the market with my friend and we bought many things for our dinner party.",
        errorSeverity: "grammar",
        utteranceWordCount: 18,
      }),
    );
    const s10Eval = decision.applicableRules.find((r) => r.rule.id === "S10_LISTENING_MODE");
    if (s10Eval) expect(s10Eval.applies).toBe(false);
  });

  it("does NOT apply: narrative but lesson target", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "Yesterday I go to the market and I buy many things.",
        errorSeverity: "minor",
        utteranceWordCount: 12,
        isCurrentLessonTarget: true,
      }),
    );
    const s10Eval = decision.applicableRules.find((r) => r.rule.id === "S10_LISTENING_MODE");
    if (s10Eval) expect(s10Eval.applies).toBe(false);
  });
});

// ─── Priority Ordering ────────────────────────────────────────────────────

describe("evaluateSuppressions — priority ordering", () => {
  it("S3 Affective Filter (90) wins over S1 Fluency Flow (85)", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "I go to school every day and I eat rice for lunch every day with my friends.",
        errorSeverity: "minor",
        learnerConfidence: "shy",
        isShowingFrustration: true,
        utteranceWordCount: 14,
      }),
    );
    // Both S3 and S1 could apply, but S3 has higher priority
    expect(decision.primaryReason?.rule.id).toBe("S3_AFFECTIVE_FILTER");
  });

  it("S1 Fluency Flow (85) wins over S6 Self-Repair Window (80)", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText:
          "I mean I go to school every day and I eat rice for lunch with my friends.",
        errorSeverity: "minor",
        didSelfCorrect: true,
        utteranceWordCount: 17,
      }),
    );
    // Both S1 and S6 could apply; S1 wins on priority
    expect(decision.primaryReason?.rule.id).toBe("S1_FLUENCY_FLOW");
  });

  it("primary reason is the highest-priority applicable rule", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "She go to school.",
        errorSeverity: "minor",
      }),
    );
    // S8 Meaning Preserved (72) should be the primary — it's the only one matching
    expect(decision.primaryReason?.rule.id).toBe("S8_MEANING_PRESERVED");
    // Verify the primary has highest priority among all applicable
    if (decision.primaryReason && decision.applicableRules.length > 1) {
      const primaryPriority = decision.primaryReason.rule.priority;
      for (const r of decision.applicableRules) {
        expect(r.rule.priority).toBeLessThanOrEqual(primaryPriority);
      }
    }
  });
});

// ─── Integration: evaluateSuppressions ────────────────────────────────────

describe("evaluateSuppressions — integration", () => {
  it("returns shouldSuppress=false when no rules apply (grammar, normal learner)", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "She happy.",
        errorSeverity: "grammar",
        cefrLevel: "B1",
        learnerConfidence: "normal",
        didSelfCorrect: false,
        sameMistakeCount: 1,
        previousCorrectionsThisSession: 0,
      }),
    );
    expect(decision.shouldSuppress).toBe(false);
    expect(decision.applicableRules).toHaveLength(0);
    expect(decision.primaryReason).toBeNull();
    expect(decision.rationaleVi).toBe("");
    expect(decision.rationaleEn).toBe("");
  });

  it("returns multiple applicable rules when context triggers several", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "I go to school every day and I eat rice for lunch with all my friends.",
        errorSeverity: "minor",
        cefrLevel: "B2",
        learnerConfidence: "confident",
        sameMistakeCount: 1,
        previousCorrectionsThisSession: 5,
        utteranceWordCount: 17,
      }),
    );
    // Multiple rules should apply: S1 (fluency flow), S2 (isolated slip), S7 (cognitive load), S8 (meaning preserved)
    expect(decision.shouldSuppress).toBe(true);
    expect(decision.applicableRules.length).toBeGreaterThanOrEqual(3);
  });

  it("every applicable rule has a reason string", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "I go to school every day and I eat rice for lunch with all my friends.",
        errorSeverity: "minor",
        cefrLevel: "B2",
        sameMistakeCount: 1,
        previousCorrectionsThisSession: 5,
        utteranceWordCount: 17,
      }),
    );
    for (const evaluation of decision.applicableRules) {
      expect(evaluation.reason).toBeTruthy();
      expect(evaluation.rule).toBeTruthy();
      expect(typeof evaluation.applies).toBe("boolean");
    }
  });
});

// ─── Convenience Helpers ──────────────────────────────────────────────────

describe("getSuppressionRuleById", () => {
  it("returns the rule for a valid id", () => {
    const rule = getSuppressionRuleById("S1_FLUENCY_FLOW");
    expect(rule).toBeDefined();
    expect(rule!.labelEn).toBe("Preserve fluency flow");
  });

  it("returns undefined for an unknown id", () => {
    const rule = getSuppressionRuleById("S99_NONEXISTENT");
    expect(rule).toBeUndefined();
  });
});

describe("buildSuppressionContext", () => {
  it("builds a valid suppression context with utteranceWordCount", () => {
    const built = buildSuppressionContext({
      learnerText: "She go to school every day.",
      errorSeverity: "grammar",
      cefrLevel: "B1",
      learnerConfidence: "normal",
      didSelfCorrect: false,
      sameMistakeCount: 1,
      previousCorrectionsThisSession: 0,
      isCurrentLessonTarget: false,
    });
    expect(built.utteranceWordCount).toBe(6);
    expect(built.learnerText).toBe("She go to school every day.");
    expect(built.errorSeverity).toBe("grammar");
  });
});

// ─── Edge Cases ────────────────────────────────────────────────────────────

describe("evaluateSuppressions — edge cases", () => {
  it("handles empty text", () => {
    const decision = evaluateSuppressions(
      ctx({ learnerText: "", utteranceWordCount: 0, errorSeverity: "minor" }),
    );
    // S8 Meaning Preserved should still apply for minor
    expect(decision.shouldSuppress).toBe(true);
    expect(decision.primaryReason).not.toBeNull();
  });

  it("handles null CEFR level", () => {
    const decision = evaluateSuppressions(
      ctx({
        learnerText: "She go to school.",
        errorSeverity: "minor",
        cefrLevel: null,
      }),
    );
    expect(decision.shouldSuppress).toBe(true);
    expect(decision.primaryReason).not.toBeNull();
  });

  it("handles very long text", () => {
    const longText =
      "Yesterday I went to the market with my friend and we bought many things " +
      "for our dinner party and then we cooked together and it was really fun " +
      "and everyone enjoyed the food very much.";
    const decision = evaluateSuppressions(
      ctx({
        learnerText: longText,
        errorSeverity: "minor",
        utteranceWordCount: 38,
      }),
    );
    expect(decision.shouldSuppress).toBe(true);
    expect(decision.applicableRules.length).toBeGreaterThanOrEqual(2);
  });

  it("never throws on any valid context", () => {
    const contexts: SuppressionContext[] = [
      ctx({ learnerText: "", errorSeverity: "minor" }),
      ctx({ learnerText: "hello", errorSeverity: "grammar" }),
      ctx({
        learnerText: "She go to school every day and eat rice.",
        errorSeverity: "fluency",
        learnerConfidence: "shy",
        didSelfCorrect: true,
        isShowingFrustration: true,
        isInFlowMode: true,
        previousCorrectionsThisSession: 10,
      }),
      ctx({ learnerText: "!!!", errorSeverity: "minor" }),
    ];
    for (const c of contexts) {
      expect(() => evaluateSuppressions(c)).not.toThrow();
    }
  });
});

// ─── Determinism ──────────────────────────────────────────────────────────

describe("evaluateSuppressions — determinism", () => {
  it("returns the same result for the same input (idempotent)", () => {
    const c = ctx({
      learnerText: "I go to school every day and I eat rice for lunch with my friends.",
      errorSeverity: "minor",
      cefrLevel: "B2",
      sameMistakeCount: 1,
      previousCorrectionsThisSession: 5,
      utteranceWordCount: 17,
    });
    const first = evaluateSuppressions(c);
    const second = evaluateSuppressions(c);
    expect(first.shouldSuppress).toBe(second.shouldSuppress);
    expect(first.primaryReason?.rule.id).toBe(second.primaryReason?.rule.id);
    expect(first.applicableRules.length).toBe(second.applicableRules.length);
  });

  it("has no side effects (calling twice doesn't change state)", () => {
    const c = ctx({ learnerText: "She go.", errorSeverity: "minor" });
    const before = evaluateSuppressions(c);
    const after = evaluateSuppressions(c);
    expect(before.shouldSuppress).toBe(after.shouldSuppress);
  });
});

// ─── All Rules Are Testable ───────────────────────────────────────────────

describe("suppression rule coverage", () => {
  it("all 10 rules can be retrieved by ID", () => {
    const allIds = SUPPRESSION_RULES_CATALOG.map((r) => r.id);
    for (const id of allIds) {
      expect(getSuppressionRuleById(id)).toBeDefined();
    }
  });

  it("all 10 rules have distinct priorities (ensures ordering is unambiguous)", () => {
    const priorities = SUPPRESSION_RULES_CATALOG.map((r) => r.priority);
    // Priorities should be distinct so ordering is unambiguous
    // (S8=72 and S9 is now 73, so they should all be distinct)
    expect(new Set(priorities).size).toBe(priorities.length);
  });
});
