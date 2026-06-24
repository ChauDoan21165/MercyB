/**
 * Tests for Encouragement Timing Decision Policy
 *
 * Covers:
 *   - E1: Significant improvement → ENCOURAGE_NOW
 *   - E2: Struggle recovery → ENCOURAGE_NOW
 *   - E3: Too soon after encouragement → NO_ENCOURAGE
 *   - E4: Encouragement saturation → NO_ENCOURAGE for minor signals
 *   - E5: Correction-heavy session balance → ENCOURAGE_NOW
 *   - E6: Shy learner gentle encouragement → ENCOURAGE_SOON
 *   - E7: Frustration → NO_ENCOURAGE / ENCOURAGE_SOON on recovery
 *   - E8: Beginner milestones → ENCOURAGE_NOW
 *   - Default: conservative NO_ENCOURAGE
 *   - Gate priority order: E1 before E2, E3 blocks both
 *   - Convenience helpers: isEncouragementRecommendedNow, isEncouragementQueued, isNoEncouragementRecommended
 *   - Catalogs: all 3 decisions + all 12 reason codes present
 *   - Edge cases: null cefrLevel, extreme values, empty session, first turn
 *
 * Pure functions — no I/O, no side effects, deterministic.
 */
import { describe, expect, it } from "vitest";
import {
  decideEncouragementTiming,
  isEncouragementRecommendedNow,
  isEncouragementQueued,
  isNoEncouragementRecommended,
  ENCOURAGEMENT_TIMING_DECISION_CATALOG,
  ENCOURAGEMENT_TIMING_REASON_CODE_CATALOG,
  type EncouragementTimingInput,
  type EncouragementTimingResult,
  type EncouragementDecision,
  type EncouragementSignal,
} from "../encouragementTimingPolicy";

// ─── Test Fixtures ──────────────────────────────────────────────────────────

function defaultInput(
  overrides: Partial<EncouragementTimingInput> = {},
): EncouragementTimingInput {
  return {
    hasSignificantImprovement: false,
    encouragementSignal: "none",
    turnsSinceLastEncouragement: 10,
    encouragementsThisSession: 1,
    wasStruggling: false,
    learnerConfidence: "normal",
    isShowingFrustration: false,
    cefrLevel: "B1",
    totalCorrectionsInSession: 2,
    didSelfCorrect: false,
    isCorrectTurn: false,
    consecutiveCorrectTurns: 1,
    ...overrides,
  };
}

// ─── E1 — Significant Improvement Gate ──────────────────────────────────────

describe("E1 — Significant improvement => ENCOURAGE_NOW", () => {
  it("encourages immediately when learner shows significant improvement", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        hasSignificantImprovement: true,
        encouragementSignal: "significant_improvement",
      }),
    );
    expect(result.decision).toBe("ENCOURAGE_NOW");
    expect(result.reasonCode).toBe("encourage_significant_improvement");
    expect(result.suggestedPraiseTag).toBe("improvement_recognition");
    expect(result.signal).toBe("significant_improvement");
  });

  it("encourages immediately for self-correction success", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        hasSignificantImprovement: true,
        encouragementSignal: "self_correction_success",
      }),
    );
    expect(result.decision).toBe("ENCOURAGE_NOW");
    expect(result.reasonCode).toBe("encourage_significant_improvement");
    expect(result.suggestedPraiseTag).toBe("self_correction_praise");
  });

  it("encourages immediately for correct new pattern usage", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        hasSignificantImprovement: true,
        encouragementSignal: "correct_new_pattern",
      }),
    );
    expect(result.decision).toBe("ENCOURAGE_NOW");
    expect(result.suggestedPraiseTag).toBe("new_pattern_acknowledgment");
  });

  it("encourages for sustained accuracy with significant improvement flag", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        hasSignificantImprovement: true,
        encouragementSignal: "sustained_accuracy",
        consecutiveCorrectTurns: 5,
      }),
    );
    expect(result.decision).toBe("ENCOURAGE_NOW");
    expect(result.suggestedPraiseTag).toBe("sustained_accuracy_recognition");
  });

  it("skips encouragement if we literally just encouraged (turnsSinceLastEncouragement = 0)", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        hasSignificantImprovement: true,
        encouragementSignal: "significant_improvement",
        turnsSinceLastEncouragement: 0,
      }),
    );
    // E1 skips → falls to E3 (too soon) → NO_ENCOURAGE
    expect(result.decision).toBe("NO_ENCOURAGE");
    expect(result.reasonCode).toBe("encourage_too_soon_after_encouragement");
  });

  it("encourages for significant improvement even with many encouragements this session (E1 overrides E4)", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        hasSignificantImprovement: true,
        encouragementSignal: "significant_improvement",
        encouragementsThisSession: 6,
      }),
    );
    expect(result.decision).toBe("ENCOURAGE_NOW");
  });
});

// ─── E2 — Struggle Recovery Gate ───────────────────────────────────────────

describe("E2 — Struggle recovery => ENCOURAGE_NOW", () => {
  it("encourages immediately when struggling learner produces a correct turn", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        wasStruggling: true,
        isCorrectTurn: true,
      }),
    );
    expect(result.decision).toBe("ENCOURAGE_NOW");
    expect(result.reasonCode).toBe("encourage_struggle_recovery");
    expect(result.signal).toBe("struggle_recovery");
    expect(result.suggestedPraiseTag).toBe("struggle_recovery");
  });

  it("does NOT fire if the turn is not correct (still struggling)", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        wasStruggling: true,
        isCorrectTurn: false,
      }),
    );
    // Falls through to default → NO_ENCOURAGE
    expect(result.decision).toBe("NO_ENCOURAGE");
  });

  it("does NOT fire if wasStruggling is false (routine correctness)", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        wasStruggling: false,
        isCorrectTurn: true,
      }),
    );
    // Falls through to default → NO_ENCOURAGE
    expect(result.decision).toBe("NO_ENCOURAGE");
  });

  it("defers to E7 (frustration gate) when struggling AND frustrated — doesn't fire E2", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        wasStruggling: true,
        isCorrectTurn: true,
        isShowingFrustration: true,
      }),
    );
    // E2 skips (frustrated), falls through to E7 → ENCOURAGE_SOON
    expect(result.decision).toBe("ENCOURAGE_SOON");
    expect(result.reasonCode).toBe("encourage_frustration_recovery_gentle");
  });

  it("does NOT fire if we just encouraged (turnsSinceLastEncouragement < 1)", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        wasStruggling: true,
        isCorrectTurn: true,
        turnsSinceLastEncouragement: 0,
      }),
    );
    // E2 skips (too soon) → E3 → NO_ENCOURAGE
    expect(result.decision).toBe("NO_ENCOURAGE");
  });
});

// ─── E3 — Too Soon After Encouragement Gate ────────────────────────────────

describe("E3 — Too soon after encouragement => NO_ENCOURAGE", () => {
  it("blocks encouragement when < 3 turns since last encouragement", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        turnsSinceLastEncouragement: 1,
        isCorrectTurn: true,
      }),
    );
    expect(result.decision).toBe("NO_ENCOURAGE");
    expect(result.reasonCode).toBe("encourage_too_soon_after_encouragement");
  });

  it("blocks at exactly 2 turns", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        turnsSinceLastEncouragement: 2,
        isCorrectTurn: true,
      }),
    );
    expect(result.decision).toBe("NO_ENCOURAGE");
    expect(result.reasonCode).toBe("encourage_too_soon_after_encouragement");
  });

  it("allows encouragement at exactly 3 turns (gate doesn't fire)", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        turnsSinceLastEncouragement: 3,
        hasSignificantImprovement: true,
        encouragementSignal: "significant_improvement",
      }),
    );
    // E3 doesn't fire → E1 fires → ENCOURAGE_NOW
    expect(result.decision).toBe("ENCOURAGE_NOW");
  });

  it("blocks at 0 turns (just encouraged)", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        turnsSinceLastEncouragement: 0,
        hasSignificantImprovement: true,
        encouragementSignal: "significant_improvement",
      }),
    );
    // E1 skips (internal < 1 check) → E2 doesn't fire → E3 blocks
    expect(result.decision).toBe("NO_ENCOURAGE");
  });
});

// ─── E4 — Encouragement Saturation Gate ────────────────────────────────────

describe("E4 — Encouragement saturation => NO_ENCOURAGE for minor signals", () => {
  it("blocks beginner milestone encouragement when already ≥4 encouragements this session", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        encouragementsThisSession: 4,
        cefrLevel: "A1",
        isCorrectTurn: true,
        // No significant improvement, no struggle — just basic beginner success
      }),
    );
    // E4 fires before E8 (beginner gate) → NO_ENCOURAGE
    expect(result.decision).toBe("NO_ENCOURAGE");
    expect(result.reasonCode).toBe("encourage_saturation_selective");
  });

  it("allows significant improvement through saturation (E1 fires before E4)", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        encouragementsThisSession: 5,
        hasSignificantImprovement: true,
        encouragementSignal: "significant_improvement",
      }),
    );
    // E1 fires first → ENCOURAGE_NOW (even with saturation)
    expect(result.decision).toBe("ENCOURAGE_NOW");
  });

  it("allows struggle recovery through saturation (E2 fires before E4)", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        encouragementsThisSession: 5,
        wasStruggling: true,
        isCorrectTurn: true,
      }),
    );
    // E2 fires first → ENCOURAGE_NOW
    expect(result.decision).toBe("ENCOURAGE_NOW");
  });

  it("does NOT block when encouragements < 4 (gate doesn't fire)", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        encouragementsThisSession: 3,
        cefrLevel: "A1",
        isCorrectTurn: true,
      }),
    );
    // E4 doesn't fire → falls to E8 → ENCOURAGE_NOW
    expect(result.decision).toBe("ENCOURAGE_NOW");
    expect(result.reasonCode).toBe("encourage_beginner_milestone");
  });
});

// ─── E5 — Correction Heavy Session Gate ────────────────────────────────────

describe("E5 — Correction-heavy session balance => ENCOURAGE_NOW", () => {
  it("encourages on a correct turn after ≥6 corrections to balance the session", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        totalCorrectionsInSession: 7,
        isCorrectTurn: true,
      }),
    );
    expect(result.decision).toBe("ENCOURAGE_NOW");
    expect(result.reasonCode).toBe("encourage_correction_heavy_session_balance");
    expect(result.suggestedPraiseTag).toBe("correction_heavy_balance");
  });

  it("does NOT fire if totalCorrectionsInSession < 6", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        totalCorrectionsInSession: 5,
        isCorrectTurn: true,
      }),
    );
    // Falls through → default NO_ENCOURAGE (no other gate matches)
    expect(result.decision).toBe("NO_ENCOURAGE");
  });

  it("does NOT fire if the turn is not correct (nothing to balance)", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        totalCorrectionsInSession: 8,
        isCorrectTurn: false,
      }),
    );
    expect(result.decision).toBe("NO_ENCOURAGE");
  });

  it("allows a 2-turn gap between encouragements even in heavy sessions", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        totalCorrectionsInSession: 10,
        isCorrectTurn: true,
        turnsSinceLastEncouragement: 1,
      }),
    );
    // E5 internal check: turnsSinceLastEncouragement < 2 → skips
    // Falls to E3 (too soon) → NO_ENCOURAGE
    expect(result.decision).toBe("NO_ENCOURAGE");
  });

  it("fires at 3 turns gap in heavy session (E3 allows, E5 fires)", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        totalCorrectionsInSession: 8,
        isCorrectTurn: true,
        turnsSinceLastEncouragement: 3,
      }),
    );
    expect(result.decision).toBe("ENCOURAGE_NOW");
  });
});

// ─── E6 — Shy Learner Gate ─────────────────────────────────────────────────

describe("E6 — Shy learner gentle encouragement => ENCOURAGE_SOON", () => {
  it("queues gentle encouragement for shy learners after a gap", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        learnerConfidence: "shy",
        turnsSinceLastEncouragement: 6,
        isCorrectTurn: true,
      }),
    );
    expect(result.decision).toBe("ENCOURAGE_SOON");
    expect(result.reasonCode).toBe("encourage_shy_learner_gentle");
    expect(result.suggestAfterTurns).toBe(2);
    expect(result.suggestedPraiseTag).toBe("gentle_encouragement");
  });

  it("does NOT fire for shy learners if encouraged recently (< 5 turns)", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        learnerConfidence: "shy",
        turnsSinceLastEncouragement: 4,
        isCorrectTurn: true,
      }),
    );
    // E6 internal check: < 5 turns → null → falls through
    expect(result.decision).toBe("NO_ENCOURAGE");
  });

  it("queues encouragement for shy learners with consecutive correct turns", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        learnerConfidence: "shy",
        turnsSinceLastEncouragement: 7,
        isCorrectTurn: false,
        consecutiveCorrectTurns: 2,
      }),
    );
    expect(result.decision).toBe("ENCOURAGE_SOON");
    expect(result.reasonCode).toBe("encourage_shy_learner_gentle");
  });

  it("does NOT fire for non-shy learners (gate not triggered)", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        learnerConfidence: "normal",
        turnsSinceLastEncouragement: 10,
        isCorrectTurn: true,
      }),
    );
    // E6 doesn't fire → falls through to default
    expect(result.decision).toBe("NO_ENCOURAGE");
  });

  it("significant improvement overrides shy learner pacing — E1 fires first", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        learnerConfidence: "shy",
        hasSignificantImprovement: true,
        encouragementSignal: "significant_improvement",
        turnsSinceLastEncouragement: 6,
      }),
    );
    // E1 fires before E6
    expect(result.decision).toBe("ENCOURAGE_NOW");
    expect(result.reasonCode).toBe("encourage_significant_improvement");
  });
});

// ─── E7 — Frustration Gate ─────────────────────────────────────────────────

describe("E7 — Frustration => NO_ENCOURAGE or ENCOURAGE_SOON on recovery", () => {
  it("defers encouragement when learner is frustrated and correct (gentle recovery)", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        isShowingFrustration: true,
        isCorrectTurn: true,
        wasStruggling: true,
      }),
    );
    expect(result.decision).toBe("ENCOURAGE_SOON");
    expect(result.reasonCode).toBe("encourage_frustration_recovery_gentle");
    expect(result.suggestAfterTurns).toBe(3);
    expect(result.suggestedPraiseTag).toBe("struggle_recovery");
  });

  it("blocks encouragement entirely when frustrated and NOT correct", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        isShowingFrustration: true,
        isCorrectTurn: false,
        wasStruggling: true,
      }),
    );
    expect(result.decision).toBe("NO_ENCOURAGE");
    expect(result.reasonCode).toBe("encourage_frustration_defer");
  });

  it("blocks encouragement when learner is frustrated without struggle history", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        isShowingFrustration: true,
        isCorrectTurn: true,
        wasStruggling: false,
      }),
    );
    // Frustrated + correct but no struggle = first clause doesn't match (wasStruggling is false)
    // Falls to second clause → NO_ENCOURAGE (frustration + not correct-like context)
    expect(result.decision).toBe("NO_ENCOURAGE");
    expect(result.reasonCode).toBe("encourage_frustration_defer");
  });

  it("does NOT fire when learner is not frustrated", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        isShowingFrustration: false,
        isCorrectTurn: true,
      }),
    );
    // E7 doesn't fire → falls through
    expect(result.reasonCode).not.toBe("encourage_frustration_defer");
  });
});

// ─── E8 — Beginner Milestone Gate ──────────────────────────────────────────

describe("E8 — Beginner milestones => ENCOURAGE_NOW", () => {
  it("encourages A1 learner on any correct turn", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        cefrLevel: "A1",
        isCorrectTurn: true,
      }),
    );
    expect(result.decision).toBe("ENCOURAGE_NOW");
    expect(result.reasonCode).toBe("encourage_beginner_milestone");
    expect(result.suggestedPraiseTag).toBe("beginner_milestone");
    expect(result.signal).toBe("beginner_basic_success");
  });

  it("encourages A2 learner on correct turn", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        cefrLevel: "A2",
        isCorrectTurn: true,
      }),
    );
    expect(result.decision).toBe("ENCOURAGE_NOW");
    expect(result.reasonCode).toBe("encourage_beginner_milestone");
  });

  it("encourages null cefrLevel (treated as beginner) on correct turn", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        cefrLevel: null,
        isCorrectTurn: true,
      }),
    );
    expect(result.decision).toBe("ENCOURAGE_NOW");
    expect(result.reasonCode).toBe("encourage_beginner_milestone");
  });

  it("encourages beginner after self-correction even if turn isn't fully correct", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        cefrLevel: "A1",
        isCorrectTurn: false,
        didSelfCorrect: true,
      }),
    );
    expect(result.decision).toBe("ENCOURAGE_NOW");
    expect(result.reasonCode).toBe("encourage_beginner_self_correction");
    expect(result.suggestedPraiseTag).toBe("self_correction_praise");
  });

  it("does NOT over-encourage beginners (< 2 turn gap)", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        cefrLevel: "A1",
        isCorrectTurn: true,
        turnsSinceLastEncouragement: 1,
      }),
    );
    // E8 internal check: < 2 turns → null → falls to E3 → NO_ENCOURAGE
    expect(result.decision).toBe("NO_ENCOURAGE");
  });

  it("does NOT fire for B1 learners (not beginner)", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        cefrLevel: "B1",
        isCorrectTurn: true,
      }),
    );
    // E8 doesn't fire → falls to default
    expect(result.decision).toBe("NO_ENCOURAGE");
  });
});

// ─── Default Fallback ──────────────────────────────────────────────────────

describe("Default — conservative NO_ENCOURAGE", () => {
  it("returns NO_ENCOURAGE when no gate fires", () => {
    const result = decideEncouragementTiming(defaultInput());
    expect(result.decision).toBe("NO_ENCOURAGE");
    expect(result.reasonCode).toBe("encourage_default_no_encourage");
    expect(result.signal).toBe("none");
  });

  it("suggests first encouragement after sustained accuracy with no prior encouragements", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        encouragementsThisSession: 0,
        consecutiveCorrectTurns: 5,
        turnsSinceLastEncouragement: Infinity,
      }),
    );
    expect(result.decision).toBe("ENCOURAGE_SOON");
    expect(result.reasonCode).toBe("encourage_default_first_warmth");
    expect(result.suggestAfterTurns).toBe(2);
    expect(result.suggestedPraiseTag).toBe("sustained_accuracy_recognition");
  });
});

// ─── Gate Priority Order ───────────────────────────────────────────────────

describe("Gate priority order", () => {
  it("E1 (significant improvement) fires before E5 (correction-heavy)", () => {
    // Situation that could trigger both E1 and E5
    const result = decideEncouragementTiming(
      defaultInput({
        hasSignificantImprovement: true,
        encouragementSignal: "significant_improvement",
        totalCorrectionsInSession: 10,
        isCorrectTurn: true,
      }),
    );
    // E1 should win: immediate encouragement for improvement
    expect(result.decision).toBe("ENCOURAGE_NOW");
    expect(result.reasonCode).toBe("encourage_significant_improvement");
  });

  it("E2 (struggle recovery) fires before E5 (correction-heavy)", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        wasStruggling: true,
        isCorrectTurn: true,
        totalCorrectionsInSession: 10,
      }),
    );
    // E2 should win
    expect(result.decision).toBe("ENCOURAGE_NOW");
    expect(result.reasonCode).toBe("encourage_struggle_recovery");
  });

  it("E3 (too soon) blocks even correction-heavy session encouragement", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        totalCorrectionsInSession: 10,
        isCorrectTurn: true,
        turnsSinceLastEncouragement: 1,
      }),
    );
    // E5 skips (< 2 turn gap internal) → E3 blocks → NO_ENCOURAGE
    expect(result.decision).toBe("NO_ENCOURAGE");
    expect(result.reasonCode).toBe("encourage_too_soon_after_encouragement");
  });

  it("E5 (correction-heavy) fires before E8 (beginner) for B1 learners", () => {
    // At B1, E8 doesn't fire, so E5 fires for correction-heavy correct turn
    const result = decideEncouragementTiming(
      defaultInput({
        cefrLevel: "B1",
        totalCorrectionsInSession: 7,
        isCorrectTurn: true,
      }),
    );
    expect(result.decision).toBe("ENCOURAGE_NOW");
    expect(result.reasonCode).toBe("encourage_correction_heavy_session_balance");
  });
});

// ─── Convenience Helpers ───────────────────────────────────────────────────

describe("Convenience helpers", () => {
  it("isEncouragementRecommendedNow returns true for ENCOURAGE_NOW", () => {
    const result: EncouragementTimingResult = {
      decision: "ENCOURAGE_NOW",
      signal: "significant_improvement",
      reason: "test",
      reasonCode: "encourage_significant_improvement",
    };
    expect(isEncouragementRecommendedNow(result)).toBe(true);
    expect(isEncouragementQueued(result)).toBe(false);
    expect(isNoEncouragementRecommended(result)).toBe(false);
  });

  it("isEncouragementQueued returns true for ENCOURAGE_SOON", () => {
    const result: EncouragementTimingResult = {
      decision: "ENCOURAGE_SOON",
      signal: "beginner_basic_success",
      reason: "test",
      reasonCode: "encourage_shy_learner_gentle",
      suggestAfterTurns: 2,
    };
    expect(isEncouragementRecommendedNow(result)).toBe(false);
    expect(isEncouragementQueued(result)).toBe(true);
    expect(isNoEncouragementRecommended(result)).toBe(false);
  });

  it("isNoEncouragementRecommended returns true for NO_ENCOURAGE", () => {
    const result: EncouragementTimingResult = {
      decision: "NO_ENCOURAGE",
      signal: "none",
      reason: "test",
      reasonCode: "encourage_default_no_encourage",
    };
    expect(isEncouragementRecommendedNow(result)).toBe(false);
    expect(isEncouragementQueued(result)).toBe(false);
    expect(isNoEncouragementRecommended(result)).toBe(true);
  });
});

// ─── Catalogs ──────────────────────────────────────────────────────────────

describe("Catalogs", () => {
  it("ENCOURAGEMENT_TIMING_DECISION_CATALOG has entries for all 3 decisions", () => {
    const decisions = ENCOURAGEMENT_TIMING_DECISION_CATALOG.map((c) => c.decision);
    expect(decisions).toContain("ENCOURAGE_NOW");
    expect(decisions).toContain("ENCOURAGE_SOON");
    expect(decisions).toContain("NO_ENCOURAGE");
    expect(decisions).toHaveLength(3);
  });

  it("ENCOURAGEMENT_TIMING_DECISION_CATALOG entries have all required fields", () => {
    for (const entry of ENCOURAGEMENT_TIMING_DECISION_CATALOG) {
      expect(entry.decision).toBeTruthy();
      expect(entry.titleEn).toBeTruthy();
      expect(entry.titleVi).toBeTruthy();
      expect(entry.descriptionVi).toBeTruthy();
    }
  });

  it("ENCOURAGEMENT_TIMING_REASON_CODE_CATALOG covers all 12 reason codes", () => {
    const codes = ENCOURAGEMENT_TIMING_REASON_CODE_CATALOG.map((c) => c.reasonCode);
    expect(codes).toContain("encourage_significant_improvement");
    expect(codes).toContain("encourage_struggle_recovery");
    expect(codes).toContain("encourage_too_soon_after_encouragement");
    expect(codes).toContain("encourage_saturation_selective");
    expect(codes).toContain("encourage_correction_heavy_session_balance");
    expect(codes).toContain("encourage_shy_learner_gentle");
    expect(codes).toContain("encourage_frustration_recovery_gentle");
    expect(codes).toContain("encourage_frustration_defer");
    expect(codes).toContain("encourage_beginner_milestone");
    expect(codes).toContain("encourage_beginner_self_correction");
    expect(codes).toContain("encourage_default_first_warmth");
    expect(codes).toContain("encourage_default_no_encourage");
    expect(codes).toHaveLength(12);
  });

  it("ENCOURAGEMENT_TIMING_REASON_CODE_CATALOG entries have all required fields", () => {
    for (const entry of ENCOURAGEMENT_TIMING_REASON_CODE_CATALOG) {
      expect(entry.reasonCode).toBeTruthy();
      expect(entry.decision).toBeTruthy();
      expect(entry.descriptionVi).toBeTruthy();
    }
  });
});

// ─── Edge Cases ────────────────────────────────────────────────────────────

describe("Edge cases", () => {
  it("handles extreme turnsSinceLastEncouragement (Infinity = never encouraged)", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        turnsSinceLastEncouragement: Infinity,
        cefrLevel: "A1",
        isCorrectTurn: true,
      }),
    );
    expect(result.decision).toBe("ENCOURAGE_NOW");
  });

  it("handles zero encouragements in session (first-time state)", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        encouragementsThisSession: 0,
        cefrLevel: "A1",
        isCorrectTurn: true,
      }),
    );
    // Beginner gets their first encouragement
    expect(result.decision).toBe("ENCOURAGE_NOW");
  });

  it("handles confident learner with correct turn — no encouragement by default", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        learnerConfidence: "confident",
        isCorrectTurn: true,
      }),
    );
    // Confident learners don't need routine encouragement
    expect(result.decision).toBe("NO_ENCOURAGE");
  });

  it("handles high cefrLevel (C1) with correct turn — no routine encouragement", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        cefrLevel: "C1",
        isCorrectTurn: true,
      }),
    );
    expect(result.decision).toBe("NO_ENCOURAGE");
  });

  it("handles self-correction by non-beginner — no encouragement by default", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        cefrLevel: "B1",
        didSelfCorrect: true,
        isCorrectTurn: true,
      }),
    );
    // Self-correction alone (without significant improvement flag) doesn't trigger encouragement at B1
    expect(result.decision).toBe("NO_ENCOURAGE");
  });

  it("handles empty session state (all zeroes)", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        encouragementsThisSession: 0,
        turnsSinceLastEncouragement: Infinity,
        totalCorrectionsInSession: 0,
        consecutiveCorrectTurns: 1,
      }),
    );
    expect(result.decision).toBe("NO_ENCOURAGE");
  });

  it("handles very high corrections + very high encouragements (extreme session)", () => {
    const result = decideEncouragementTiming(
      defaultInput({
        totalCorrectionsInSession: 15,
        encouragementsThisSession: 8,
        isCorrectTurn: true,
        turnsSinceLastEncouragement: 10,
      }),
    );
    // E4 blocks (saturation), E5 would fire but E4 comes first in gate order
    // Wait — E5 (correction-heavy) fires before E4 (saturation) actually? No:
    // Gate order: E1, E2, E3, E4, E5, E6, E7, E8
    // E3 doesn't trigger (10 >= 3), E4 triggers (8 >= 4) → NO_ENCOURAGE
    // E5 never reached
    expect(result.decision).toBe("NO_ENCOURAGE");
    expect(result.reasonCode).toBe("encourage_saturation_selective");
  });
});
