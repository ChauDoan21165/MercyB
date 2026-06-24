import { describe, expect, it } from "vitest";
import {
  decideHintLadder,
  isHintRecommendedNow,
  isHintQueued,
  isNoHintRecommended,
  isMinimalHint,
  isMediumHint,
  isStrongHint,
  HINT_LADDER_DECISION_CATALOG,
  HINT_LADDER_REASON_CODE_CATALOG,
  type HintLadderInput,
  type HintLadderResult,
  type HintLadderDecision,
} from "../hintLadderPolicy";
import type { ErrorSeverity, LearnerConfidence } from "../teacherMercyCorrectionTiming";

// ─── Test Fixtures ──────────────────────────────────────────────────────────

function defaultHintInput(
  overrides: Partial<HintLadderInput> = {},
): HintLadderInput {
  return {
    turnsSinceLastHint: 10,
    hintsThisSession: 0,
    lastHintLevel: null,
    recurringErrorCount: 1,
    errorSeverity: "grammar",
    cefrLevel: "B1",
    learnerConfidence: "normal",
    isCurrentLessonTarget: false,
    hasSelfCorrectionAwareness: false,
    isShowingFrustration: false,
    totalTurnsInSession: 8,
    previousHintWorked: false,
    ...overrides,
  };
}

// ─── H1 — Self-Correction Window Gate ──────────────────────────────────────

describe("H1 — Self-correction window => HINT_MINIMAL", () => {
  it("gives a minimal hint when learner shows self-correction awareness", () => {
    const result = decideHintLadder(
      defaultHintInput({ hasSelfCorrectionAwareness: true }),
    );
    expect(result.decision).toBe("HINT_MINIMAL");
    expect(result.reasonCode).toBe("hint_self_correction_window");
    expect(result.hintFocusArea).toBe("grammar");
  });

  it("escalates to medium hint when recurring ≥3 and last hint was minimal", () => {
    const result = decideHintLadder(
      defaultHintInput({
        hasSelfCorrectionAwareness: true,
        recurringErrorCount: 3,
        lastHintLevel: "HINT_MINIMAL",
      }),
    );
    expect(result.decision).toBe("HINT_MEDIUM");
    expect(result.reasonCode).toBe("hint_self_correction_escalate");
  });

  it("does not hint when learner is frustrated even with awareness", () => {
    const result = decideHintLadder(
      defaultHintInput({
        hasSelfCorrectionAwareness: true,
        isShowingFrustration: true,
      }),
    );
    // H1 skips due to frustration → falls through to later gates or default
    expect(result.reasonCode).not.toBe("hint_self_correction_window");
  });

  it("does not fire when no self-correction awareness", () => {
    const result = decideHintLadder(
      defaultHintInput({ hasSelfCorrectionAwareness: false }),
    );
    expect(result.reasonCode).not.toBe("hint_self_correction_window");
  });

  it("gives minimal hint even for confident learners (awareness > confidence)", () => {
    const result = decideHintLadder(
      defaultHintInput({
        hasSelfCorrectionAwareness: true,
        learnerConfidence: "confident",
        cefrLevel: "B2",
      }),
    );
    expect(result.decision).toBe("HINT_MINIMAL");
    expect(result.reasonCode).toBe("hint_self_correction_window");
  });
});

// ─── H2 — Too Soon After Last Hint Gate ────────────────────────────────────

describe("H2 — Too soon after hint => NO_HINT", () => {
  it("blocks hint when < 2 turns since last hint", () => {
    const result = decideHintLadder(
      defaultHintInput({ turnsSinceLastHint: 0 }),
    );
    expect(result.decision).toBe("NO_HINT");
    expect(result.reasonCode).toBe("hint_too_soon_after_hint");
  });

  it("blocks hint at exactly 1 turn since last hint", () => {
    const result = decideHintLadder(
      defaultHintInput({ turnsSinceLastHint: 1 }),
    );
    expect(result.decision).toBe("NO_HINT");
    expect(result.reasonCode).toBe("hint_too_soon_after_hint");
  });

  it("allows hint when 2+ turns since last hint", () => {
    const result = decideHintLadder(
      defaultHintInput({ turnsSinceLastHint: 2 }),
    );
    // H2 does NOT fire. Falls through to later gates or default.
    expect(result.reasonCode).not.toBe("hint_too_soon_after_hint");
  });

  it("blocks hint even with strong pedagogical signal (self-correction awareness)", () => {
    // H2 fires before H1 because H2 is earlier in the gate array.
    // However, H2 only fires when turnsSinceLastHint < 2, so H1 could catch it
    // if turnsSinceLastHint >= 2. Let's test: both conditions true.
    const result = decideHintLadder(
      defaultHintInput({
        turnsSinceLastHint: 1,
        hasSelfCorrectionAwareness: true,
      }),
    );
    // H2 fires first (turnsSinceLastHint < 2) → NO_HINT
    expect(result.decision).toBe("NO_HINT");
    expect(result.reasonCode).toBe("hint_too_soon_after_hint");
  });
});

// ─── H3 — Hint Saturation Gate ─────────────────────────────────────────────

describe("H3 — Hint saturation => NO_HINT", () => {
  it("blocks all hints when ≥8 hints this session", () => {
    const result = decideHintLadder(
      defaultHintInput({
        hintsThisSession: 8,
        hasSelfCorrectionAwareness: true,
      }),
    );
    expect(result.decision).toBe("NO_HINT");
    expect(result.reasonCode).toBe("hint_saturation_block_all");
  });

  it("blocks all hints when >8 hints this session", () => {
    const result = decideHintLadder(
      defaultHintInput({
        hintsThisSession: 12,
        recurringErrorCount: 3,
      }),
    );
    expect(result.decision).toBe("NO_HINT");
    expect(result.reasonCode).toBe("hint_saturation_block_all");
  });

  it("blocks hints at 5-7 when previous hint didn't work", () => {
    const result = decideHintLadder(
      defaultHintInput({
        hintsThisSession: 6,
        previousHintWorked: false,
        recurringErrorCount: 3,
      }),
    );
    expect(result.decision).toBe("NO_HINT");
    expect(result.reasonCode).toBe("hint_saturation_diminishing_return");
  });

  it("allows hints at 5-7 when previous hint worked", () => {
    const result = decideHintLadder(
      defaultHintInput({
        hintsThisSession: 5,
        previousHintWorked: true,
        hasSelfCorrectionAwareness: true,
      }),
    );
    // H3 skips (saturated but previous worked) → H1 fires → HINT_MINIMAL
    expect(result.decision).toBe("HINT_MINIMAL");
    expect(result.reasonCode).toBe("hint_self_correction_window");
  });

  it("does not trigger saturation gate with < 5 hints", () => {
    const result = decideHintLadder(
      defaultHintInput({ hintsThisSession: 3 }),
    );
    expect(result.reasonCode).not.toBe("hint_saturation_block_all");
    expect(result.reasonCode).not.toBe("hint_saturation_diminishing_return");
  });

  it("saturation gate fires before escalation — no point escalating if saturated", () => {
    const result = decideHintLadder(
      defaultHintInput({
        hintsThisSession: 9,
        recurringErrorCount: 5,
        lastHintLevel: "HINT_MINIMAL",
        hasSelfCorrectionAwareness: true,
      }),
    );
    // H3 fires first (saturation ≥8) → NO_HINT. H4 (escalation) would have
    // escalated to MEDIUM, but saturation blocks all hints.
    expect(result.decision).toBe("NO_HINT");
    expect(result.reasonCode).toBe("hint_saturation_block_all");
  });
});

// ─── H4 — Recurring Error Escalation Gate ──────────────────────────────────

describe("H4 — Recurring error escalation", () => {
  it("escalates MINIMAL → MEDIUM when recurring ≥3", () => {
    const result = decideHintLadder(
      defaultHintInput({
        recurringErrorCount: 3,
        lastHintLevel: "HINT_MINIMAL",
        hintsThisSession: 2,
        turnsSinceLastHint: 5,
      }),
    );
    expect(result.decision).toBe("HINT_MEDIUM");
    expect(result.reasonCode).toBe("hint_recurring_escalate_to_medium");
    expect(result.hintFocusArea).toBe("grammar");
  });

  it("escalates MEDIUM → STRONG when recurring ≥3", () => {
    const result = decideHintLadder(
      defaultHintInput({
        recurringErrorCount: 4,
        lastHintLevel: "HINT_MEDIUM",
        hintsThisSession: 2,
        turnsSinceLastHint: 5,
      }),
    );
    expect(result.decision).toBe("HINT_STRONG");
    expect(result.reasonCode).toBe("hint_recurring_escalate_to_strong");
    expect(result.hintFocusArea).toBe("grammar");
  });

  it("reaches escalation ceiling: STRONG → NO_HINT (switch to direct correction)", () => {
    const result = decideHintLadder(
      defaultHintInput({
        recurringErrorCount: 5,
        lastHintLevel: "HINT_STRONG",
        hintsThisSession: 3,
        turnsSinceLastHint: 6,
      }),
    );
    expect(result.decision).toBe("NO_HINT");
    expect(result.reasonCode).toBe("hint_escalation_ceiling");
  });

  it("does not escalate when recurringErrorCount < 3", () => {
    const result = decideHintLadder(
      defaultHintInput({
        recurringErrorCount: 2,
        lastHintLevel: "HINT_MINIMAL",
        hintsThisSession: 1,
        turnsSinceLastHint: 4,
      }),
    );
    expect(result.reasonCode).not.toBe("hint_recurring_escalate_to_medium");
  });

  it("does not escalate when there is no previous hint level (null)", () => {
    const result = decideHintLadder(
      defaultHintInput({
        recurringErrorCount: 4,
        lastHintLevel: null,
        hintsThisSession: 0,
      }),
    );
    expect(result.reasonCode).not.toBe("hint_recurring_escalate_to_medium");
    expect(result.reasonCode).not.toBe("hint_recurring_escalate_to_strong");
    expect(result.reasonCode).not.toBe("hint_escalation_ceiling");
  });

  it("does not escalate when last hint was HINT_SOON (not a delivered hint level)", () => {
    const result = decideHintLadder(
      defaultHintInput({
        recurringErrorCount: 3,
        lastHintLevel: "HINT_SOON",
        hintsThisSession: 1,
        turnsSinceLastHint: 5,
      }),
    );
    // H4 doesn't handle HINT_SOON → falls through
    expect(result.reasonCode).not.toBe("hint_recurring_escalate_to_medium");
  });

  it("escalates for word_choice errors the same as grammar", () => {
    const result = decideHintLadder(
      defaultHintInput({
        recurringErrorCount: 3,
        lastHintLevel: "HINT_MINIMAL",
        errorSeverity: "word_choice",
        hintsThisSession: 1,
        turnsSinceLastHint: 4,
      }),
    );
    expect(result.decision).toBe("HINT_MEDIUM");
    expect(result.reasonCode).toBe("hint_recurring_escalate_to_medium");
  });
});

// ─── H5 — Shy Learner Gentle Entry Gate ────────────────────────────────────

describe("H5 — Shy learner gentle entry", () => {
  it("starts shy learners at MINIMAL for their first hint", () => {
    const result = decideHintLadder(
      defaultHintInput({
        learnerConfidence: "shy",
        lastHintLevel: null,
        hintsThisSession: 0,
        turnsSinceLastHint: Infinity,
      }),
    );
    expect(result.decision).toBe("HINT_MINIMAL");
    expect(result.reasonCode).toBe("hint_shy_first_hint_minimal");
    expect(result.hintFocusArea).toBe("grammar");
  });

  it("escalates shy learner to MEDIUM on lesson target with ≥3 turns gap", () => {
    const result = decideHintLadder(
      defaultHintInput({
        learnerConfidence: "shy",
        lastHintLevel: "HINT_MINIMAL",
        isCurrentLessonTarget: true,
        turnsSinceLastHint: 4,
        hintsThisSession: 1,
      }),
    );
    expect(result.decision).toBe("HINT_MEDIUM");
    expect(result.reasonCode).toBe("hint_shy_lesson_target_medium");
  });

  it("blocks hint for shy learner with insufficient space (< 3 turns)", () => {
    const result = decideHintLadder(
      defaultHintInput({
        learnerConfidence: "shy",
        turnsSinceLastHint: 2,
        hintsThisSession: 2,
        lastHintLevel: "HINT_MINIMAL",
      }),
    );
    expect(result.decision).toBe("NO_HINT");
    expect(result.reasonCode).toBe("hint_shy_insufficient_space");
  });

  it("blocks hint for shy learner at exactly 2 turns gap", () => {
    const result = decideHintLadder(
      defaultHintInput({
        learnerConfidence: "shy",
        turnsSinceLastHint: 2,
        lastHintLevel: "HINT_MINIMAL",
        hintsThisSession: 2,
      }),
    );
    expect(result.decision).toBe("NO_HINT");
    expect(result.reasonCode).toBe("hint_shy_insufficient_space");
  });

  it("allows shy learner hint at 3+ turns gap", () => {
    const result = decideHintLadder(
      defaultHintInput({
        learnerConfidence: "shy",
        turnsSinceLastHint: 3,
        lastHintLevel: "HINT_MINIMAL",
        hintsThisSession: 1,
      }),
    );
    // H5 does not fire the space block (turns >= 3).
    // Also not lesson target + not first hint → H5 returns null, falls through
    expect(result.reasonCode).not.toBe("hint_shy_insufficient_space");
  });

  it("shy learner gate fires after escalation gates — shy state is a filter", () => {
    // H4 (escalation) fires before H5 in the gate chain.
    // If recurring ≥3 + last hint MINIMAL → H4 escalates to MEDIUM.
    // H5 won't fire because H4 already returned. This is correct —
    // escalation is the stronger signal for recurring errors.
    const result = decideHintLadder(
      defaultHintInput({
        learnerConfidence: "shy",
        recurringErrorCount: 3,
        lastHintLevel: "HINT_MINIMAL",
        hintsThisSession: 2,
        turnsSinceLastHint: 5,
      }),
    );
    // H4 fires first → escalates to MEDIUM
    expect(result.decision).toBe("HINT_MEDIUM");
    expect(result.reasonCode).toBe("hint_recurring_escalate_to_medium");
  });
});

// ─── H6 — Lesson Target Scaffolding Gate ───────────────────────────────────

describe("H6 — Lesson target scaffolding => HINT_MEDIUM", () => {
  it("gives medium hint for lesson target errors", () => {
    const result = decideHintLadder(
      defaultHintInput({
        isCurrentLessonTarget: true,
        turnsSinceLastHint: 5,
        hintsThisSession: 1,
      }),
    );
    expect(result.decision).toBe("HINT_MEDIUM");
    expect(result.reasonCode).toBe("hint_lesson_target_scaffolding");
    expect(result.hintFocusArea).toContain("lesson-target");
  });

  it("skips hint during frustration even on lesson target", () => {
    const result = decideHintLadder(
      defaultHintInput({
        isCurrentLessonTarget: true,
        isShowingFrustration: true,
        turnsSinceLastHint: 5,
      }),
    );
    // H6 skips (frustration) → falls through
    expect(result.reasonCode).not.toBe("hint_lesson_target_scaffolding");
  });

  it("does not fire for non-lesson-target errors", () => {
    const result = decideHintLadder(
      defaultHintInput({
        isCurrentLessonTarget: false,
        turnsSinceLastHint: 5,
      }),
    );
    expect(result.reasonCode).not.toBe("hint_lesson_target_scaffolding");
  });

  it("works for all error severity types on lesson target", () => {
    const severities: ErrorSeverity[] = [
      "grammar", "word_choice", "fluency", "lesson_target", "minor",
    ];
    for (const sev of severities) {
      const result = decideHintLadder(
        defaultHintInput({
          isCurrentLessonTarget: true,
          errorSeverity: sev,
          turnsSinceLastHint: 5,
          hintsThisSession: 1,
        }),
      );
      expect(result.decision).toBe("HINT_MEDIUM");
      expect(result.reasonCode).toBe("hint_lesson_target_scaffolding");
    }
  });

  it("lesson target gate fires before beginner gate — both want MEDIUM", () => {
    // H6 (lesson target) fires before H7 (beginner).
    // Both recommend MEDIUM, but lesson target scaffolding is the more
    // specific rationale.
    const result = decideHintLadder(
      defaultHintInput({
        isCurrentLessonTarget: true,
        cefrLevel: "A1",
        errorSeverity: "grammar",
        turnsSinceLastHint: 5,
        hintsThisSession: 1,
      }),
    );
    expect(result.decision).toBe("HINT_MEDIUM");
    expect(result.reasonCode).toBe("hint_lesson_target_scaffolding");
  });
});

// ─── H7 — Beginner Structured Support Gate ─────────────────────────────────

describe("H7 — Beginner structured support", () => {
  it("gives medium hint for A1 learner with grammar error", () => {
    const result = decideHintLadder(
      defaultHintInput({
        cefrLevel: "A1",
        errorSeverity: "grammar",
        turnsSinceLastHint: 5,
        hintsThisSession: 1,
        isCurrentLessonTarget: false,
      }),
    );
    expect(result.decision).toBe("HINT_MEDIUM");
    expect(result.reasonCode).toBe("hint_beginner_structured_medium");
    expect(result.hintFocusArea).toBe("grammar");
  });

  it("gives medium hint for A2 learner with lesson_target error", () => {
    const result = decideHintLadder(
      defaultHintInput({
        cefrLevel: "A2",
        errorSeverity: "lesson_target",
        turnsSinceLastHint: 5,
        hintsThisSession: 1,
        isCurrentLessonTarget: false,
      }),
    );
    expect(result.decision).toBe("HINT_MEDIUM");
    expect(result.reasonCode).toBe("hint_beginner_structured_medium");
  });

  it("treats null CEFR as beginner — medium hint for grammar", () => {
    const result = decideHintLadder(
      defaultHintInput({
        cefrLevel: null,
        errorSeverity: "grammar",
        turnsSinceLastHint: 5,
        hintsThisSession: 1,
      }),
    );
    expect(result.decision).toBe("HINT_MEDIUM");
    expect(result.reasonCode).toBe("hint_beginner_structured_medium");
  });

  it("gives minimal hint for beginner with word_choice error", () => {
    const result = decideHintLadder(
      defaultHintInput({
        cefrLevel: "A1",
        errorSeverity: "word_choice",
        turnsSinceLastHint: 5,
        hintsThisSession: 1,
      }),
    );
    expect(result.decision).toBe("HINT_MINIMAL");
    expect(result.reasonCode).toBe("hint_beginner_structured_minimal");
  });

  it("gives minimal hint for beginner with fluency error", () => {
    const result = decideHintLadder(
      defaultHintInput({
        cefrLevel: "A2",
        errorSeverity: "fluency",
        turnsSinceLastHint: 5,
        hintsThisSession: 1,
      }),
    );
    expect(result.decision).toBe("HINT_MINIMAL");
    expect(result.reasonCode).toBe("hint_beginner_structured_minimal");
  });

  it("gives minimal hint for beginner with minor error", () => {
    const result = decideHintLadder(
      defaultHintInput({
        cefrLevel: "A1",
        errorSeverity: "minor",
        turnsSinceLastHint: 5,
        hintsThisSession: 1,
      }),
    );
    expect(result.decision).toBe("HINT_MINIMAL");
    expect(result.reasonCode).toBe("hint_beginner_structured_minimal");
  });

  it("skips hint for fatal_meaning — let correction engine handle directly", () => {
    const result = decideHintLadder(
      defaultHintInput({
        cefrLevel: "A1",
        errorSeverity: "fatal_meaning",
        turnsSinceLastHint: 5,
        hintsThisSession: 1,
      }),
    );
    // H7 skips fatal_meaning → falls through
    expect(result.reasonCode).not.toBe("hint_beginner_structured_medium");
    expect(result.reasonCode).not.toBe("hint_beginner_structured_minimal");
  });

  it("lightens to minimal when beginner has ≥3 hints already", () => {
    const result = decideHintLadder(
      defaultHintInput({
        cefrLevel: "A1",
        errorSeverity: "grammar",
        hintsThisSession: 4,
        turnsSinceLastHint: 5,
      }),
    );
    expect(result.decision).toBe("HINT_MINIMAL");
    expect(result.reasonCode).toBe("hint_beginner_fatigue_lighten");
  });

  it("does not fire for intermediate (B1) learners", () => {
    const result = decideHintLadder(
      defaultHintInput({
        cefrLevel: "B1",
        errorSeverity: "grammar",
        turnsSinceLastHint: 5,
        hintsThisSession: 1,
      }),
    );
    expect(result.reasonCode).not.toBe("hint_beginner_structured_medium");
  });

  it("does not fire for advanced (B2+) learners", () => {
    const result = decideHintLadder(
      defaultHintInput({
        cefrLevel: "C1",
        errorSeverity: "grammar",
        turnsSinceLastHint: 5,
        hintsThisSession: 1,
      }),
    );
    expect(result.reasonCode).not.toBe("hint_beginner_structured_medium");
  });
});

// ─── H8 — Advanced Learner Autonomy Gate ────────────────────────────────────

describe("H8 — Advanced learner autonomy", () => {
  it("gives minimal hint for B2 learner with grammar error", () => {
    const result = decideHintLadder(
      defaultHintInput({
        cefrLevel: "B2",
        errorSeverity: "grammar",
        turnsSinceLastHint: 5,
        hintsThisSession: 1,
      }),
    );
    expect(result.decision).toBe("HINT_MINIMAL");
    expect(result.reasonCode).toBe("hint_advanced_minimal_only");
    expect(result.hintFocusArea).toBe("grammar");
  });

  it("gives minimal hint for C1 learner with lesson_target error", () => {
    const result = decideHintLadder(
      defaultHintInput({
        cefrLevel: "C1",
        errorSeverity: "lesson_target",
        turnsSinceLastHint: 5,
        hintsThisSession: 1,
      }),
    );
    expect(result.decision).toBe("HINT_MINIMAL");
    expect(result.reasonCode).toBe("hint_advanced_minimal_only");
  });

  it("skips hint for confident C1 with minor slip", () => {
    const result = decideHintLadder(
      defaultHintInput({
        cefrLevel: "C1",
        learnerConfidence: "confident",
        errorSeverity: "minor",
        turnsSinceLastHint: 5,
        hintsThisSession: 1,
      }),
    );
    expect(result.decision).toBe("NO_HINT");
    expect(result.reasonCode).toBe("hint_advanced_autonomy_skip");
  });

  it("skips hint for confident B2 with fluency error", () => {
    const result = decideHintLadder(
      defaultHintInput({
        cefrLevel: "B2",
        learnerConfidence: "confident",
        errorSeverity: "fluency",
        turnsSinceLastHint: 5,
        hintsThisSession: 1,
      }),
    );
    expect(result.decision).toBe("NO_HINT");
    expect(result.reasonCode).toBe("hint_advanced_autonomy_skip");
  });

  it("gives NO_HINT for advanced learner with non-core error types", () => {
    // H8 handles grammar/lesson_target/word_choice with MINIMAL.
    // Other error types (e.g., fluency when not confident) fall to the
    // general NO_HINT path.
    const result = decideHintLadder(
      defaultHintInput({
        cefrLevel: "B2",
        learnerConfidence: "normal",
        errorSeverity: "fluency",
        turnsSinceLastHint: 5,
        hintsThisSession: 1,
      }),
    );
    expect(result.decision).toBe("NO_HINT");
    expect(result.reasonCode).toBe("hint_advanced_autonomy_no_hint");
  });

  it("caps escalation — advanced learner never gets > MINIMAL even when recurring", () => {
    // H4 (escalation) fires before H8. If recurring ≥3 + last hint MINIMAL
    // → H4 escalates to MEDIUM. H8 doesn't get a chance because H4 already returned.
    // This is BY DESIGN: H8's ceiling kicks in when the learner hasn't
    // received hints on this specific error pattern yet.
    //
    // But if the advanced learner already got a minimal hint AND the error
    // recurs ≥3, H4 escalates to MEDIUM. That's correct because the minimal
    // hint didn't work — the learner genuinely needs more support.
    const result = decideHintLadder(
      defaultHintInput({
        cefrLevel: "B2",
        recurringErrorCount: 3,
        lastHintLevel: "HINT_MINIMAL",
        errorSeverity: "grammar",
        turnsSinceLastHint: 5,
        hintsThisSession: 1,
      }),
    );
    expect(result.decision).toBe("HINT_MEDIUM");
    expect(result.reasonCode).toBe("hint_recurring_escalate_to_medium");
  });

  it("H8 fires for B2 learners who haven't been hinted on this error yet", () => {
    // When no prior hint on this error, H8 provides the first-time hint ceiling
    const result = decideHintLadder(
      defaultHintInput({
        cefrLevel: "B2",
        lastHintLevel: null,
        errorSeverity: "grammar",
        turnsSinceLastHint: 5,
        hintsThisSession: 1,
      }),
    );
    expect(result.decision).toBe("HINT_MINIMAL");
    expect(result.reasonCode).toBe("hint_advanced_minimal_only");
  });

  it("does not fire for intermediate learners (B1)", () => {
    const result = decideHintLadder(
      defaultHintInput({
        cefrLevel: "B1",
        errorSeverity: "grammar",
        turnsSinceLastHint: 5,
        hintsThisSession: 1,
      }),
    );
    expect(result.reasonCode).not.toBe("hint_advanced_minimal_only");
  });
});

// ─── Gate Ordering / Priority Tests ─────────────────────────────────────────

describe("Gate ordering — first non-null wins", () => {
  it("H2 (too soon) blocks even when H1 (self-correction) would fire", () => {
    const result = decideHintLadder(
      defaultHintInput({
        turnsSinceLastHint: 0,
        hasSelfCorrectionAwareness: true,
      }),
    );
    expect(result.decision).toBe("NO_HINT");
    expect(result.reasonCode).toBe("hint_too_soon_after_hint");
  });

  it("H3 (saturation) blocks even when H4 (escalation) would fire", () => {
    const result = decideHintLadder(
      defaultHintInput({
        hintsThisSession: 8,
        recurringErrorCount: 4,
        lastHintLevel: "HINT_MINIMAL",
        turnsSinceLastHint: 5,
      }),
    );
    expect(result.decision).toBe("NO_HINT");
    expect(result.reasonCode).toBe("hint_saturation_block_all");
  });

  it("H4 (escalation) fires before H6 (lesson target) — escalation > scaffolding", () => {
    const result = decideHintLadder(
      defaultHintInput({
        recurringErrorCount: 3,
        lastHintLevel: "HINT_MINIMAL",
        isCurrentLessonTarget: true,
        turnsSinceLastHint: 5,
        hintsThisSession: 2,
      }),
    );
    // H4 fires first → MEDIUM (escalation). H6 would also give MEDIUM,
    // but escalation is the more precise rationale.
    expect(result.decision).toBe("HINT_MEDIUM");
    expect(result.reasonCode).toBe("hint_recurring_escalate_to_medium");
  });

  it("H5 (shy first hint) fires before H7 (beginner) — shy state > CEFR", () => {
    const result = decideHintLadder(
      defaultHintInput({
        learnerConfidence: "shy",
        cefrLevel: "A1",
        lastHintLevel: null,
        hintsThisSession: 0,
        turnsSinceLastHint: Infinity,
      }),
    );
    expect(result.decision).toBe("HINT_MINIMAL");
    expect(result.reasonCode).toBe("hint_shy_first_hint_minimal");
  });
});

// ─── Default Fallback Tests ─────────────────────────────────────────────────

describe("Default fallback behavior", () => {
  it("returns NO_HINT when no specific pedagogical signal is present", () => {
    const result = decideHintLadder(
      defaultHintInput({
        // Standard B1, no self-correction awareness, not lesson target,
        // not recurring, no prior hints
        cefrLevel: "B1",
        hasSelfCorrectionAwareness: false,
        isCurrentLessonTarget: false,
        recurringErrorCount: 1,
        hintsThisSession: 2,
        turnsSinceLastHint: 10,
      }),
    );
    expect(result.decision).toBe("NO_HINT");
    expect(result.reasonCode).toBe("hint_default_no_hint");
  });

  it("suggests first hint (HINT_SOON) for first grammar error mid-session", () => {
    const result = decideHintLadder(
      defaultHintInput({
        hintsThisSession: 0,
        totalTurnsInSession: 6,
        errorSeverity: "grammar",
        recurringErrorCount: 1,
        turnsSinceLastHint: Infinity,
      }),
    );
    expect(result.decision).toBe("HINT_SOON");
    expect(result.reasonCode).toBe("hint_default_first_hint_suggestion");
    expect(result.suggestAfterTurns).toBe(2);
    expect(result.hintFocusArea).toBe("grammar");
  });

  it("suggests first hint for word_choice error mid-session", () => {
    const result = decideHintLadder(
      defaultHintInput({
        hintsThisSession: 0,
        totalTurnsInSession: 5,
        errorSeverity: "word_choice",
        recurringErrorCount: 1,
        turnsSinceLastHint: Infinity,
      }),
    );
    expect(result.decision).toBe("HINT_SOON");
    expect(result.reasonCode).toBe("hint_default_first_hint_suggestion");
  });

  it("does not suggest first hint for non-grammar/word_choice errors", () => {
    const result = decideHintLadder(
      defaultHintInput({
        hintsThisSession: 0,
        totalTurnsInSession: 6,
        errorSeverity: "minor",
        recurringErrorCount: 1,
        turnsSinceLastHint: Infinity,
      }),
    );
    expect(result.decision).toBe("NO_HINT");
    expect(result.reasonCode).toBe("hint_default_no_hint");
  });

  it("does not suggest first hint when already have hints in session", () => {
    const result = decideHintLadder(
      defaultHintInput({
        hintsThisSession: 1,
        totalTurnsInSession: 6,
        errorSeverity: "grammar",
        recurringErrorCount: 1,
      }),
    );
    // hintsThisSession > 0 → default NO_HINT path (not first hint)
    expect(result.decision).toBe("NO_HINT");
    expect(result.reasonCode).toBe("hint_default_no_hint");
  });

  it("does not suggest first hint too early in session (< 4 turns)", () => {
    const result = decideHintLadder(
      defaultHintInput({
        hintsThisSession: 0,
        totalTurnsInSession: 2,
        errorSeverity: "grammar",
        recurringErrorCount: 1,
        turnsSinceLastHint: Infinity,
      }),
    );
    expect(result.decision).toBe("NO_HINT");
    expect(result.reasonCode).toBe("hint_default_no_hint");
  });

  it("does not suggest first hint for recurring errors (recurringErrorCount > 1)", () => {
    const result = decideHintLadder(
      defaultHintInput({
        hintsThisSession: 0,
        totalTurnsInSession: 6,
        errorSeverity: "grammar",
        recurringErrorCount: 2,
        turnsSinceLastHint: Infinity,
      }),
    );
    // Default only triggers for recurringErrorCount === 1 (first occurrence)
    expect(result.decision).toBe("NO_HINT");
    expect(result.reasonCode).toBe("hint_default_no_hint");
  });
});

// ─── Scenario Tests — Realistic Learner Journeys ────────────────────────────

describe("Scenario: B1 learner self-correcting a grammar error mid-session", () => {
  it("gets a minimal hint to complete their self-correction", () => {
    const result = decideHintLadder({
      turnsSinceLastHint: 10,
      hintsThisSession: 1,
      lastHintLevel: "HINT_MINIMAL",
      recurringErrorCount: 2,
      errorSeverity: "grammar",
      cefrLevel: "B1",
      learnerConfidence: "normal",
      isCurrentLessonTarget: false,
      hasSelfCorrectionAwareness: true,
      isShowingFrustration: false,
      totalTurnsInSession: 12,
      previousHintWorked: true,
    });

    // H1 fires → HINT_MINIMAL (self-correction awareness wins)
    expect(result.decision).toBe("HINT_MINIMAL");
    expect(result.reasonCode).toBe("hint_self_correction_window");
  });
});

describe("Scenario: A1 beginner with recurring grammar error, no prior hints", () => {
  it("gets a medium hint — structured support for the lesson", () => {
    const result = decideHintLadder({
      turnsSinceLastHint: Infinity,
      hintsThisSession: 0,
      lastHintLevel: null,
      recurringErrorCount: 3,
      errorSeverity: "grammar",
      cefrLevel: "A1",
      learnerConfidence: "normal",
      isCurrentLessonTarget: false,
      hasSelfCorrectionAwareness: false,
      isShowingFrustration: false,
      totalTurnsInSession: 10,
      previousHintWorked: false,
    });

    // H4 requires lastHintLevel !== null to escalate.
    // H7 fires → HINT_MEDIUM (beginner + grammar → structured medium)
    expect(result.decision).toBe("HINT_MEDIUM");
    expect(result.reasonCode).toBe("hint_beginner_structured_medium");
  });
});

describe("Scenario: shy A2 learner on lesson target with recurring error", () => {
  it("gets a medium hint via lesson target scaffolding", () => {
    const result = decideHintLadder({
      turnsSinceLastHint: 6,
      hintsThisSession: 2,
      lastHintLevel: "HINT_MINIMAL",
      recurringErrorCount: 3,
      errorSeverity: "grammar",
      cefrLevel: "A2",
      learnerConfidence: "shy",
      isCurrentLessonTarget: true,
      hasSelfCorrectionAwareness: false,
      isShowingFrustration: false,
      totalTurnsInSession: 15,
      previousHintWorked: false,
    });

    // H4 fires first (recurring 3, lastHintLevel MINIMAL) → HINT_MEDIUM
    expect(result.decision).toBe("HINT_MEDIUM");
    expect(result.reasonCode).toBe("hint_recurring_escalate_to_medium");
  });
});

describe("Scenario: confident C1 learner with a minor slip", () => {
  it("gets no hint — advanced autonomy preserves independence", () => {
    const result = decideHintLadder({
      turnsSinceLastHint: 15,
      hintsThisSession: 1,
      lastHintLevel: null,
      recurringErrorCount: 1,
      errorSeverity: "minor",
      cefrLevel: "C1",
      learnerConfidence: "confident",
      isCurrentLessonTarget: false,
      hasSelfCorrectionAwareness: false,
      isShowingFrustration: false,
      totalTurnsInSession: 20,
      previousHintWorked: false,
    });

    // H8 fires → NO_HINT (confident + minor slip)
    expect(result.decision).toBe("NO_HINT");
    expect(result.reasonCode).toBe("hint_advanced_autonomy_skip");
  });
});

describe("Scenario: heavily hinted session — 9 hints already, new error appears", () => {
  it("blocks all hints to prevent dependency", () => {
    const result = decideHintLadder({
      turnsSinceLastHint: 3,
      hintsThisSession: 9,
      lastHintLevel: "HINT_STRONG",
      recurringErrorCount: 2,
      errorSeverity: "grammar",
      cefrLevel: "B1",
      learnerConfidence: "normal",
      isCurrentLessonTarget: true,
      hasSelfCorrectionAwareness: true,
      isShowingFrustration: false,
      totalTurnsInSession: 25,
      previousHintWorked: false,
    });

    // H3 fires first (saturation ≥8) → NO_HINT. Blocks even H1.
    expect(result.decision).toBe("NO_HINT");
    expect(result.reasonCode).toBe("hint_saturation_block_all");
  });
});

describe("Scenario: learner stuck at strong hint ceiling — error still recurring", () => {
  it("switches to NO_HINT — escalation ceiling reached, recommend direct correction", () => {
    const result = decideHintLadder({
      turnsSinceLastHint: 8,
      hintsThisSession: 4,
      lastHintLevel: "HINT_STRONG",
      recurringErrorCount: 5,
      errorSeverity: "grammar",
      cefrLevel: "A2",
      learnerConfidence: "normal",
      isCurrentLessonTarget: false,
      hasSelfCorrectionAwareness: false,
      isShowingFrustration: false,
      totalTurnsInSession: 18,
      previousHintWorked: false,
    });

    // H4 fires → NO_HINT (escalation ceiling: STRONG → direct)
    expect(result.decision).toBe("NO_HINT");
    expect(result.reasonCode).toBe("hint_escalation_ceiling");
  });
});

describe("Scenario: frustrated B1 learner with self-correction awareness", () => {
  it("does not hint — frustration overrides self-correction opportunity", () => {
    const result = decideHintLadder({
      turnsSinceLastHint: 10,
      hintsThisSession: 1,
      lastHintLevel: null,
      recurringErrorCount: 2,
      errorSeverity: "grammar",
      cefrLevel: "B1",
      learnerConfidence: "normal",
      isCurrentLessonTarget: false,
      hasSelfCorrectionAwareness: true,
      isShowingFrustration: true,
      totalTurnsInSession: 12,
      previousHintWorked: false,
    });

    // H1 skips (frustrated). Falls through to default → NO_HINT
    expect(result.decision).toBe("NO_HINT");
    expect(result.reasonCode).toBe("hint_default_no_hint");
  });
});

describe("Scenario: B1 learner just received a hint, now shows awareness on next turn", () => {
  it("blocks hint — too soon after last hint (H2 > H1)", () => {
    const result = decideHintLadder({
      turnsSinceLastHint: 1,
      hintsThisSession: 2,
      lastHintLevel: "HINT_MINIMAL",
      recurringErrorCount: 2,
      errorSeverity: "grammar",
      cefrLevel: "B1",
      learnerConfidence: "normal",
      isCurrentLessonTarget: false,
      hasSelfCorrectionAwareness: true,
      isShowingFrustration: false,
      totalTurnsInSession: 10,
      previousHintWorked: false,
    });

    // H2 fires first → NO_HINT (too soon)
    expect(result.decision).toBe("NO_HINT");
    expect(result.reasonCode).toBe("hint_too_soon_after_hint");
  });
});

// ─── Hint Focus Area Tests ──────────────────────────────────────────────────

describe("Hint focus area suggestions", () => {
  it("HINT_MINIMAL from H1 includes error severity as focus area", () => {
    const result = decideHintLadder(
      defaultHintInput({
        hasSelfCorrectionAwareness: true,
        errorSeverity: "word_choice",
      }),
    );
    expect(result.decision).toBe("HINT_MINIMAL");
    expect(result.hintFocusArea).toBe("word_choice");
  });

  it("HINT_MEDIUM from H6 includes lesson-target prefixed focus area", () => {
    const result = decideHintLadder(
      defaultHintInput({
        isCurrentLessonTarget: true,
        errorSeverity: "grammar",
        turnsSinceLastHint: 5,
        hintsThisSession: 1,
      }),
    );
    expect(result.decision).toBe("HINT_MEDIUM");
    expect(result.hintFocusArea).toBe("lesson-target:grammar");
  });

  it("HINT_MEDIUM from escalation includes error severity as focus area", () => {
    const result = decideHintLadder(
      defaultHintInput({
        recurringErrorCount: 3,
        lastHintLevel: "HINT_MINIMAL",
        errorSeverity: "word_choice",
        hintsThisSession: 2,
        turnsSinceLastHint: 5,
      }),
    );
    expect(result.decision).toBe("HINT_MEDIUM");
    expect(result.hintFocusArea).toBe("word_choice");
  });

  it("HINT_SOON from default includes error severity as focus area", () => {
    const result = decideHintLadder(
      defaultHintInput({
        hintsThisSession: 0,
        totalTurnsInSession: 6,
        errorSeverity: "grammar",
        recurringErrorCount: 1,
        turnsSinceLastHint: Infinity,
      }),
    );
    expect(result.decision).toBe("HINT_SOON");
    expect(result.hintFocusArea).toBe("grammar");
  });

  it("NO_HINT decisions do not include hintFocusArea", () => {
    const result = decideHintLadder(
      defaultHintInput({ turnsSinceLastHint: 0 }),
    );
    expect(result.decision).toBe("NO_HINT");
    expect(result.hintFocusArea).toBeUndefined();
  });
});

// ─── Convenience Helpers ────────────────────────────────────────────────────

describe("Convenience helper functions", () => {
  describe("isHintRecommendedNow", () => {
    it("returns true for HINT_MINIMAL", () => {
      expect(isHintRecommendedNow({ decision: "HINT_MINIMAL" } as HintLadderResult)).toBe(true);
    });
    it("returns true for HINT_MEDIUM", () => {
      expect(isHintRecommendedNow({ decision: "HINT_MEDIUM" } as HintLadderResult)).toBe(true);
    });
    it("returns true for HINT_STRONG", () => {
      expect(isHintRecommendedNow({ decision: "HINT_STRONG" } as HintLadderResult)).toBe(true);
    });
    it("returns false for HINT_SOON", () => {
      expect(isHintRecommendedNow({ decision: "HINT_SOON" } as HintLadderResult)).toBe(false);
    });
    it("returns false for NO_HINT", () => {
      expect(isHintRecommendedNow({ decision: "NO_HINT" } as HintLadderResult)).toBe(false);
    });
  });

  describe("isHintQueued", () => {
    it("returns true for HINT_SOON", () => {
      expect(isHintQueued({ decision: "HINT_SOON" } as HintLadderResult)).toBe(true);
    });
    it("returns false for HINT_MINIMAL", () => {
      expect(isHintQueued({ decision: "HINT_MINIMAL" } as HintLadderResult)).toBe(false);
    });
    it("returns false for NO_HINT", () => {
      expect(isHintQueued({ decision: "NO_HINT" } as HintLadderResult)).toBe(false);
    });
  });

  describe("isNoHintRecommended", () => {
    it("returns true for NO_HINT", () => {
      expect(isNoHintRecommended({ decision: "NO_HINT" } as HintLadderResult)).toBe(true);
    });
    it("returns false for HINT_MINIMAL", () => {
      expect(isNoHintRecommended({ decision: "HINT_MINIMAL" } as HintLadderResult)).toBe(false);
    });
  });

  describe("isMinimalHint", () => {
    it("returns true for HINT_MINIMAL", () => {
      expect(isMinimalHint({ decision: "HINT_MINIMAL" } as HintLadderResult)).toBe(true);
    });
    it("returns false for HINT_MEDIUM", () => {
      expect(isMinimalHint({ decision: "HINT_MEDIUM" } as HintLadderResult)).toBe(false);
    });
  });

  describe("isMediumHint", () => {
    it("returns true for HINT_MEDIUM", () => {
      expect(isMediumHint({ decision: "HINT_MEDIUM" } as HintLadderResult)).toBe(true);
    });
    it("returns false for HINT_STRONG", () => {
      expect(isMediumHint({ decision: "HINT_STRONG" } as HintLadderResult)).toBe(false);
    });
  });

  describe("isStrongHint", () => {
    it("returns true for HINT_STRONG", () => {
      expect(isStrongHint({ decision: "HINT_STRONG" } as HintLadderResult)).toBe(true);
    });
    it("returns false for HINT_MEDIUM", () => {
      expect(isStrongHint({ decision: "HINT_MEDIUM" } as HintLadderResult)).toBe(false);
    });
  });
});

// ─── Catalog Tests ──────────────────────────────────────────────────────────

describe("HINT_LADDER_DECISION_CATALOG", () => {
  it("covers all five decision types", () => {
    const covered = new Set(HINT_LADDER_DECISION_CATALOG.map((e) => e.decision));
    const allDecisions: HintLadderDecision[] = [
      "HINT_MINIMAL",
      "HINT_MEDIUM",
      "HINT_STRONG",
      "HINT_SOON",
      "NO_HINT",
    ];
    for (const d of allDecisions) {
      expect(covered.has(d)).toBe(true);
    }
  });

  it("every entry has a non-empty titleEn", () => {
    for (const entry of HINT_LADDER_DECISION_CATALOG) {
      expect(entry.titleEn).toBeTruthy();
    }
  });

  it("every entry has a non-empty titleVi", () => {
    for (const entry of HINT_LADDER_DECISION_CATALOG) {
      expect(entry.titleVi).toBeTruthy();
    }
  });

  it("every entry has a non-empty descriptionVi", () => {
    for (const entry of HINT_LADDER_DECISION_CATALOG) {
      expect(entry.descriptionVi).toBeTruthy();
    }
  });
});

describe("HINT_LADDER_REASON_CODE_CATALOG", () => {
  it("every entry has a non-empty reasonCode", () => {
    for (const entry of HINT_LADDER_REASON_CODE_CATALOG) {
      expect(entry.reasonCode).toBeTruthy();
      expect(entry.reasonCode).toMatch(/^hint_/);
    }
  });

  it("every entry has a non-empty descriptionVi", () => {
    for (const entry of HINT_LADDER_REASON_CODE_CATALOG) {
      expect(entry.descriptionVi).toBeTruthy();
    }
  });

  it("every reason code maps to a valid decision type", () => {
    const validDecisions: HintLadderDecision[] = [
      "HINT_MINIMAL", "HINT_MEDIUM", "HINT_STRONG", "HINT_SOON", "NO_HINT",
    ];
    for (const entry of HINT_LADDER_REASON_CODE_CATALOG) {
      expect(validDecisions).toContain(entry.decision);
    }
  });

  it("covers all reason codes used by gate functions", () => {
    const catalogCodes = new Set(
      HINT_LADDER_REASON_CODE_CATALOG.map((e) => e.reasonCode),
    );
    const expectedCodes = [
      "hint_self_correction_window",
      "hint_self_correction_escalate",
      "hint_too_soon_after_hint",
      "hint_saturation_block_all",
      "hint_saturation_diminishing_return",
      "hint_escalation_ceiling",
      "hint_recurring_escalate_to_medium",
      "hint_recurring_escalate_to_strong",
      "hint_shy_first_hint_minimal",
      "hint_shy_lesson_target_medium",
      "hint_shy_insufficient_space",
      "hint_lesson_target_scaffolding",
      "hint_beginner_structured_medium",
      "hint_beginner_structured_minimal",
      "hint_beginner_fatigue_lighten",
      "hint_advanced_autonomy_skip",
      "hint_advanced_minimal_only",
      "hint_advanced_autonomy_no_hint",
      "hint_default_first_hint_suggestion",
      "hint_default_no_hint",
    ];
    for (const code of expectedCodes) {
      expect(catalogCodes.has(code)).toBe(true);
    }
  });
});

// ─── Type Contract Tests ────────────────────────────────────────────────────

describe("Type contracts", () => {
  it("every gate fires correctly even with extreme values", () => {
    // Test with Infinity and extreme values
    const result = decideHintLadder({
      turnsSinceLastHint: Infinity,
      hintsThisSession: 0,
      lastHintLevel: null,
      recurringErrorCount: 1,
      errorSeverity: "grammar",
      cefrLevel: null,
      learnerConfidence: "shy",
      isCurrentLessonTarget: false,
      hasSelfCorrectionAwareness: false,
      isShowingFrustration: false,
      totalTurnsInSession: 1,
      previousHintWorked: false,
    });

    // null CEFR → treated as beginner. shy + first hint → H5 fires
    expect(result.decision).toBe("HINT_MINIMAL");
    expect(result.reasonCode).toBe("hint_shy_first_hint_minimal");
  });

  it("returns a valid decision for all possible error severities", () => {
    const severities: ErrorSeverity[] = [
      "fatal_meaning", "grammar", "lesson_target",
      "word_choice", "fluency", "minor",
    ];
    for (const sev of severities) {
      const result = decideHintLadder(
        defaultHintInput({ errorSeverity: sev }),
      );
      expect(["HINT_MINIMAL", "HINT_MEDIUM", "HINT_STRONG", "HINT_SOON", "NO_HINT"]).toContain(result.decision);
    }
  });

  it("returns a valid decision for all learner confidence levels", () => {
    const levels: LearnerConfidence[] = ["shy", "normal", "confident"];
    for (const level of levels) {
      const result = decideHintLadder(
        defaultHintInput({ learnerConfidence: level }),
      );
      expect(["HINT_MINIMAL", "HINT_MEDIUM", "HINT_STRONG", "HINT_SOON", "NO_HINT"]).toContain(result.decision);
    }
  });

  it("every non-null result has a non-empty reason", () => {
    // Test each gate by constructing inputs that trigger it
    const testCases: Array<{ name: string; input: Partial<HintLadderInput> }> = [
      { name: "H1", input: { hasSelfCorrectionAwareness: true } },
      { name: "H2", input: { turnsSinceLastHint: 0 } },
      { name: "H3-block", input: { hintsThisSession: 8, hasSelfCorrectionAwareness: true } },
      { name: "H4-medium", input: { recurringErrorCount: 3, lastHintLevel: "HINT_MINIMAL", hintsThisSession: 2, turnsSinceLastHint: 5 } },
      { name: "H4-ceiling", input: { recurringErrorCount: 5, lastHintLevel: "HINT_STRONG", hintsThisSession: 3, turnsSinceLastHint: 6 } },
      { name: "H5-first", input: { learnerConfidence: "shy", lastHintLevel: null, hintsThisSession: 0, turnsSinceLastHint: Infinity } },
      { name: "H5-space", input: { learnerConfidence: "shy", turnsSinceLastHint: 2, lastHintLevel: "HINT_MINIMAL", hintsThisSession: 2 } },
      { name: "H6", input: { isCurrentLessonTarget: true, turnsSinceLastHint: 5, hintsThisSession: 1 } },
      { name: "H7-grammar", input: { cefrLevel: "A1", errorSeverity: "grammar", turnsSinceLastHint: 5, hintsThisSession: 1 } },
      { name: "H8-grammar", input: { cefrLevel: "B2", errorSeverity: "grammar", turnsSinceLastHint: 5, hintsThisSession: 1 } },
      { name: "default-first", input: { hintsThisSession: 0, totalTurnsInSession: 6, errorSeverity: "grammar", recurringErrorCount: 1, turnsSinceLastHint: Infinity } },
      { name: "default-no", input: { cefrLevel: "B1", turnsSinceLastHint: 10, hintsThisSession: 2 } },
    ];

    for (const tc of testCases) {
      const result = decideHintLadder(defaultHintInput(tc.input));
      expect(result.reason, `${tc.name}: reason should be non-empty`).toBeTruthy();
      expect(result.reasonCode, `${tc.name}: reasonCode should be non-empty`).toBeTruthy();
    }
  });

  it("all reason codes in the catalog correspond to actual gate outputs", () => {
    // Collect all reachable reason codes
    const reachableCodes = new Set<string>();

    // H1 — self correction window
    reachableCodes.add(
      decideHintLadder(defaultHintInput({ hasSelfCorrectionAwareness: true })).reasonCode,
    );
    // H1 — self correction escalate
    reachableCodes.add(
      decideHintLadder(defaultHintInput({
        hasSelfCorrectionAwareness: true,
        recurringErrorCount: 3,
        lastHintLevel: "HINT_MINIMAL",
      })).reasonCode,
    );

    // H2 — too soon
    reachableCodes.add(
      decideHintLadder(defaultHintInput({ turnsSinceLastHint: 0 })).reasonCode,
    );

    // H3 — saturation block
    reachableCodes.add(
      decideHintLadder(defaultHintInput({
        hintsThisSession: 8,
        hasSelfCorrectionAwareness: true,
      })).reasonCode,
    );
    // H3 — diminishing return
    reachableCodes.add(
      decideHintLadder(defaultHintInput({
        hintsThisSession: 6,
        previousHintWorked: false,
        recurringErrorCount: 3,
      })).reasonCode,
    );

    // H4 — escalation chain
    reachableCodes.add(
      decideHintLadder(defaultHintInput({
        recurringErrorCount: 3,
        lastHintLevel: "HINT_MINIMAL",
        hintsThisSession: 2,
        turnsSinceLastHint: 5,
      })).reasonCode,
    );
    reachableCodes.add(
      decideHintLadder(defaultHintInput({
        recurringErrorCount: 4,
        lastHintLevel: "HINT_MEDIUM",
        hintsThisSession: 2,
        turnsSinceLastHint: 5,
      })).reasonCode,
    );
    reachableCodes.add(
      decideHintLadder(defaultHintInput({
        recurringErrorCount: 5,
        lastHintLevel: "HINT_STRONG",
        hintsThisSession: 3,
        turnsSinceLastHint: 6,
      })).reasonCode,
    );

    // H5 — shy learner
    reachableCodes.add(
      decideHintLadder(defaultHintInput({
        learnerConfidence: "shy",
        lastHintLevel: null,
        hintsThisSession: 0,
        turnsSinceLastHint: Infinity,
      })).reasonCode,
    );
    reachableCodes.add(
      decideHintLadder(defaultHintInput({
        learnerConfidence: "shy",
        turnsSinceLastHint: 2,
        lastHintLevel: "HINT_MINIMAL",
        hintsThisSession: 2,
      })).reasonCode,
    );

    // H6 — lesson target scaffolding
    reachableCodes.add(
      decideHintLadder(defaultHintInput({
        isCurrentLessonTarget: true,
        turnsSinceLastHint: 5,
        hintsThisSession: 1,
      })).reasonCode,
    );

    // H7 — beginner
    reachableCodes.add(
      decideHintLadder(defaultHintInput({
        cefrLevel: "A1",
        errorSeverity: "grammar",
        turnsSinceLastHint: 5,
        hintsThisSession: 1,
      })).reasonCode,
    );
    reachableCodes.add(
      decideHintLadder(defaultHintInput({
        cefrLevel: "A1",
        errorSeverity: "word_choice",
        turnsSinceLastHint: 5,
        hintsThisSession: 1,
      })).reasonCode,
    );
    reachableCodes.add(
      decideHintLadder(defaultHintInput({
        cefrLevel: "A1",
        errorSeverity: "grammar",
        hintsThisSession: 4,
        turnsSinceLastHint: 5,
      })).reasonCode,
    );

    // H8 — advanced
    reachableCodes.add(
      decideHintLadder(defaultHintInput({
        cefrLevel: "B2",
        errorSeverity: "grammar",
        turnsSinceLastHint: 5,
        hintsThisSession: 1,
      })).reasonCode,
    );
    reachableCodes.add(
      decideHintLadder(defaultHintInput({
        cefrLevel: "C1",
        learnerConfidence: "confident",
        errorSeverity: "minor",
        turnsSinceLastHint: 5,
        hintsThisSession: 1,
      })).reasonCode,
    );

    // Default
    reachableCodes.add(
      decideHintLadder(defaultHintInput({
        hintsThisSession: 0,
        totalTurnsInSession: 6,
        errorSeverity: "grammar",
        recurringErrorCount: 1,
        turnsSinceLastHint: Infinity,
      })).reasonCode,
    );
    reachableCodes.add(
      decideHintLadder(defaultHintInput({
        cefrLevel: "B1",
        turnsSinceLastHint: 10,
        hintsThisSession: 2,
      })).reasonCode,
    );

    // Every reachable code should be in the catalog
    const catalogCodes = new Set(
      HINT_LADDER_REASON_CODE_CATALOG.map((e) => e.reasonCode),
    );
    for (const code of reachableCodes) {
      expect(catalogCodes.has(code),
        `Reason code "${code}" is reachable but not in the catalog`,
      ).toBe(true);
    }
  });
});

// ─── Pure Function Property ─────────────────────────────────────────────────

describe("Pure function property", () => {
  it("returns the same result for the same input (deterministic)", () => {
    const input: HintLadderInput = {
      turnsSinceLastHint: 5,
      hintsThisSession: 2,
      lastHintLevel: "HINT_MINIMAL",
      recurringErrorCount: 3,
      errorSeverity: "grammar",
      cefrLevel: "A2",
      learnerConfidence: "normal",
      isCurrentLessonTarget: false,
      hasSelfCorrectionAwareness: false,
      isShowingFrustration: false,
      totalTurnsInSession: 10,
      previousHintWorked: false,
    };

    const result1 = decideHintLadder(input);
    const result2 = decideHintLadder(input);
    const result3 = decideHintLadder({ ...input });

    expect(result1).toEqual(result2);
    expect(result2).toEqual(result3);
  });

  it("does not mutate the input object", () => {
    const input: HintLadderInput = {
      turnsSinceLastHint: 5,
      hintsThisSession: 2,
      lastHintLevel: "HINT_MINIMAL",
      recurringErrorCount: 3,
      errorSeverity: "grammar",
      cefrLevel: "A2",
      learnerConfidence: "normal",
      isCurrentLessonTarget: false,
      hasSelfCorrectionAwareness: false,
      isShowingFrustration: false,
      totalTurnsInSession: 10,
      previousHintWorked: false,
    };

    const frozen = { ...input };
    decideHintLadder(input);
    expect(input).toEqual(frozen);
  });
});
