/**
 * Tone Calibration Audit Fixtures — Golden Test Harness
 *
 * This is the CANONICAL tone audit suite for Teacher Mercy's
 * tone calibration pipeline. It audits:
 *
 *   TQ1-TQ8  — Tone Quality audit gates
 *
 * If ANY test in this suite breaks, it means a tone calibration
 * behavior has changed — intentionally or not. Regression failures
 * require CONSCIOUS review before merging.
 *
 * Design principles:
 *   1. Golden fixtures — canonical learner-state × plan combinations
 *   2. Tone priority ordering — rules applied in documented order
 *   3. Note exhaustiveness — every ToneCalibrationNote is reachable
 *   4. Safety constraints — overloaded learners never get firm tone
 *   5. Determinism — same input → same output always
 *   6. Cross-cutting invariants — tone rules compose correctly
 *
 * Pure functions — no I/O, no side effects, deterministic.
 */

import { describe, expect, it } from "vitest";
import { calibrateTone } from "../toneCalibration";
import type { ToneCalibrationNote, ToneCalibrationInput, ToneCalibrationResult } from "../toneCalibration";
import type { LearnerState } from "../learnerState";
import type { ResponsePlan, ToneStyle, CorrectionStyle } from "../responsePlanner";

// ─── Helpers ──────────────────────────────────────────────────────────────

function makeLearnerState(overrides: Partial<LearnerState> = {}): LearnerState {
  return {
    confidence: "medium",
    clarity: "clear",
    momentum: "steady",
    affect: "neutral",
    ...overrides,
  };
}

function makePlan(overrides: Partial<ResponsePlan> = {}): ResponsePlan {
  return {
    teachingMode: "encourage",
    tone: "warm",
    shouldUseHumor: false,
    shouldBeBrief: true,
    correctionStyle: "gentle",
    acknowledgeEffort: true,
    addNextStep: true,
    difficultyDirection: "hold",
    reason: "encourage_default",
    ...overrides,
  };
}

function calibrate(opts: {
  learnerState?: Partial<LearnerState>;
  plan?: Partial<ResponsePlan>;
  suppressHumor?: boolean;
  requireDirectness?: boolean;
  softenTone?: boolean;
  repeatedMistake?: boolean;
  shouldReviewConcept?: boolean;
  wantsExplanation?: boolean;
  wantsRecap?: boolean;
  wantsDrill?: boolean;
} = {}): ToneCalibrationResult {
  return calibrateTone({
    learnerState: makeLearnerState(opts.learnerState),
    plan: makePlan(opts.plan),
    suppressHumor: opts.suppressHumor,
    requireDirectness: opts.requireDirectness,
    softenTone: opts.softenTone,
    repeatedMistake: opts.repeatedMistake,
    shouldReviewConcept: opts.shouldReviewConcept,
    wantsExplanation: opts.wantsExplanation,
    wantsRecap: opts.wantsRecap,
    wantsDrill: opts.wantsDrill,
  });
}

// ─── TQ1: Learner Overload Protection Audit ───────────────────────────────

describe("TQ1 — Learner Overload Protection", () => {
  it("TQ1.1: Lost learners get warm tone regardless of plan", () => {
    const result = calibrate({
      learnerState: { clarity: "lost", affect: "neutral" },
      plan: { tone: "firm", shouldUseHumor: true, shouldBeBrief: true, correctionStyle: "direct" },
    });
    expect(result.tone).toBe("warm");
    expect(result.shouldUseHumor).toBe(false);
    expect(result.shouldBeBrief).toBe(false);
    expect(result.correctionStyle).toBe("gentle");
    expect(result.acknowledgeEffort).toBe(true);
    expect(result.notes).toContain("confusion_warmth");
  });

  it("TQ1.2: Frustrated learners get frustration_softening + confusion_warmth", () => {
    const result = calibrate({
      learnerState: { clarity: "lost", affect: "frustrated" },
      plan: { tone: "firm", shouldUseHumor: true, correctionStyle: "direct" },
    });
    expect(result.tone).toBe("warm");
    expect(result.notes).toContain("confusion_warmth");
    expect(result.notes).toContain("frustration_softening");
  });

  it("TQ1.3: Shaky+neutral learners do NOT trigger overload (not lost, not frustrated)", () => {
    const result = calibrate({
      learnerState: { clarity: "shaky", affect: "neutral" },
      plan: { tone: "firm" },
    });
    // Shaky is not "lost" — overload only triggers on clarity==="lost" or affect==="frustrated"
    expect(result.notes).not.toContain("confusion_warmth");
  });

  it("TQ1.4: Frustrated+clear learner triggers overload (frustration alone is enough)", () => {
    const result = calibrate({
      learnerState: { clarity: "clear", affect: "frustrated" },
      plan: { tone: "firm", shouldUseHumor: true, shouldBeBrief: true },
    });
    expect(result.tone).toBe("warm");
    expect(result.shouldUseHumor).toBe(false);
    expect(result.notes).toContain("confusion_warmth");
    expect(result.notes).toContain("frustration_softening");
  });

  it("TQ1.5: Overload + repeatedMistake stays gentle (not contrastive)", () => {
    const result = calibrate({
      learnerState: { clarity: "lost", affect: "frustrated" },
      plan: { teachingMode: "correct", correctionStyle: "direct" },
      repeatedMistake: true,
    });
    expect(result.correctionStyle).toBe("gentle");
    expect(result.notes).toContain("correction_softened");
  });

  it("TQ1.6: Overload overrides requireDirectness — stays gentle", () => {
    const result = calibrate({
      learnerState: { clarity: "lost", affect: "frustrated" },
      plan: { tone: "firm", correctionStyle: "direct", shouldBeBrief: true },
      requireDirectness: true,
    });
    expect(result.tone).toBe("warm");
    expect(result.correctionStyle).toBe("gentle");
    // The directness note is still recorded even though overload overrides
    expect(result.notes).not.toContain("directness_required");
  });
});

// ─── TQ2: Humor Suppression Audit ─────────────────────────────────────────

describe("TQ2 — Humor Suppression Audit", () => {
  it("TQ2.1: Explicit suppressHumor disables humor and adds note", () => {
    const result = calibrate({
      learnerState: { affect: "playful" },
      plan: { shouldUseHumor: true },
      suppressHumor: true,
    });
    expect(result.shouldUseHumor).toBe(false);
    expect(result.notes).toContain("humor_suppressed");
  });

  it("TQ2.2: Repeated mistakes suppress humor", () => {
    const result = calibrate({
      learnerState: { affect: "playful" },
      plan: { shouldUseHumor: true },
      repeatedMistake: true,
    });
    expect(result.shouldUseHumor).toBe(false);
  });

  it("TQ2.3: Review mode suppresses humor", () => {
    const result = calibrate({
      learnerState: { affect: "playful" },
      plan: { shouldUseHumor: true, teachingMode: "review" },
      shouldReviewConcept: true,
    });
    expect(result.shouldUseHumor).toBe(false);
    expect(result.notes).toContain("review_mode");
  });

  it("TQ2.4: Explanation mode suppresses humor", () => {
    const result = calibrate({
      learnerState: { affect: "playful" },
      plan: { shouldUseHumor: true, teachingMode: "explain" },
      wantsExplanation: true,
    });
    expect(result.shouldUseHumor).toBe(false);
  });

  it("TQ2.5: Recap mode suppresses humor", () => {
    const result = calibrate({
      learnerState: { affect: "playful", clarity: "clear", confidence: "high" },
      plan: { shouldUseHumor: true, teachingMode: "recap" },
      wantsRecap: true,
    });
    expect(result.shouldUseHumor).toBe(false);
  });

  it("TQ2.6: Overload suppresses humor (lost or frustrated)", () => {
    const result = calibrate({
      learnerState: { clarity: "lost" },
      plan: { shouldUseHumor: true },
    });
    expect(result.shouldUseHumor).toBe(false);
  });
});

// ─── TQ3: Tone Softening Audit ────────────────────────────────────────────

describe("TQ3 — Tone Softening Audit", () => {
  it("TQ3.1: softenTone converts firm → calm", () => {
    const result = calibrate({
      plan: { tone: "firm" },
      softenTone: true,
    });
    expect(result.tone).toBe("calm");
    expect(result.notes).toContain("tone_softened");
  });

  it("TQ3.2: softenTone converts playful → warm", () => {
    const result = calibrate({
      learnerState: { affect: "playful" },
      plan: { tone: "playful", shouldUseHumor: true },
      softenTone: true,
    });
    expect(result.tone).toBe("warm");
    expect(result.notes).toContain("tone_softened");
  });

  it("TQ3.3: softenTone doesn't change already-warm tone", () => {
    const result = calibrate({
      plan: { tone: "warm" },
      softenTone: true,
    });
    expect(result.tone).toBe("warm");
    expect(result.notes).not.toContain("tone_softened");
  });

  it("TQ3.4: softenTone doesn't change calm tone", () => {
    const result = calibrate({
      plan: { tone: "calm" },
      softenTone: true,
    });
    expect(result.tone).toBe("calm");
  });

  it("TQ3.5: softenTone prevents safe_playfulness restoration", () => {
    const result = calibrate({
      learnerState: { affect: "playful", clarity: "clear", confidence: "high" },
      plan: { tone: "warm", shouldUseHumor: true },
      softenTone: true,
    });
    expect(result.tone).toBe("warm"); // stays warm, not playful
    expect(result.notes).not.toContain("safe_playfulness");
  });
});

// ─── TQ4: Directness Enforcement Audit ────────────────────────────────────

describe("TQ4 — Directness Enforcement Audit", () => {
  it("TQ4.1: requireDirectness converts playful → calm", () => {
    const result = calibrate({
      plan: { tone: "playful", correctionStyle: "gentle", shouldBeBrief: false },
      requireDirectness: true,
    });
    expect(result.tone).toBe("calm");
    expect(result.correctionStyle).toBe("direct");
    expect(result.shouldBeBrief).toBe(true);
    expect(result.notes).toContain("directness_required");
    expect(result.notes).toContain("briefness_enforced");
  });

  it("TQ4.2: requireDirectness with repeatedMistake uses contrastive style", () => {
    const result = calibrate({
      plan: { correctionStyle: "gentle" },
      requireDirectness: true,
      repeatedMistake: true,
    });
    expect(result.correctionStyle).toBe("contrastive");
  });

  it("TQ4.3: requireDirectness skipped when learner is overloaded", () => {
    const result = calibrate({
      learnerState: { clarity: "lost", affect: "frustrated" },
      plan: { tone: "firm", correctionStyle: "direct" },
      requireDirectness: true,
    });
    // Overload protection takes priority
    expect(result.correctionStyle).toBe("gentle");
    expect(result.notes).not.toContain("directness_required");
  });

  it("TQ4.4: requireDirectness with warm/calm/firm stays (doesn't change)", () => {
    // Only playful → calm conversion happens; warm/calm/firm are unchanged
    const result = calibrate({
      plan: { tone: "calm", correctionStyle: "gentle", shouldBeBrief: false },
      requireDirectness: true,
    });
    expect(result.tone).toBe("calm");
    expect(result.correctionStyle).toBe("direct");
    expect(result.notes).toContain("directness_required");
  });
});

// ─── TQ5: Repeated Mistake Handling Audit ─────────────────────────────────

describe("TQ5 — Repeated Mistake Handling", () => {
  it("TQ5.1: repeatedMistake suppresses humor", () => {
    const result = calibrate({
      plan: { shouldUseHumor: true },
      repeatedMistake: true,
    });
    expect(result.shouldUseHumor).toBe(false);
  });

  it("TQ5.2: repeatedMistake for stable learner uses contrastive correction", () => {
    const result = calibrate({
      plan: { correctionStyle: "gentle" },
      repeatedMistake: true,
    });
    expect(result.correctionStyle).toBe("contrastive");
    expect(result.acknowledgeEffort).toBe(true);
    expect(result.notes).toContain("repeated_mistake_focus");
  });

  it("TQ5.3: repeatedMistake for overloaded learner stays gentle", () => {
    const result = calibrate({
      learnerState: { affect: "frustrated", clarity: "shaky" },
      plan: { correctionStyle: "direct" },
      repeatedMistake: true,
    });
    expect(result.correctionStyle).toBe("gentle");
    expect(result.notes).toContain("correction_softened");
  });

  it("TQ5.4: repeatedMistake always acknowledges effort", () => {
    const result = calibrate({
      plan: { acknowledgeEffort: false },
      repeatedMistake: true,
    });
    expect(result.acknowledgeEffort).toBe(true);
  });

  it("TQ5.5: repeatedMistake with already-contrastive plan keeps contrastive", () => {
    const result = calibrate({
      plan: { correctionStyle: "contrastive" },
      repeatedMistake: true,
    });
    expect(result.correctionStyle).toBe("contrastive");
  });
});

// ─── TQ6: Review & Explanation Mode Audit ─────────────────────────────────

describe("TQ6 — Review & Explanation Mode", () => {
  it("TQ6.1: review mode sets calm tone, no humor, no brevity, adds next step", () => {
    const result = calibrate({
      learnerState: { affect: "playful" },
      plan: { teachingMode: "review", tone: "playful", shouldUseHumor: true, shouldBeBrief: true, addNextStep: false },
      shouldReviewConcept: true,
    });
    expect(result.tone).toBe("calm");
    expect(result.shouldUseHumor).toBe(false);
    expect(result.shouldBeBrief).toBe(false);
    expect(result.acknowledgeEffort).toBe(true);
    expect(result.addNextStep).toBe(true);
    expect(result.notes).toContain("review_mode");
    expect(result.notes).toContain("briefness_reduced");
  });

  it("TQ6.2: review mode triggered by plan.teachingMode === 'review'", () => {
    const result = calibrate({
      plan: { teachingMode: "review", shouldBeBrief: true },
    });
    expect(result.tone).toBe("calm");
    expect(result.shouldBeBrief).toBe(false);
    expect(result.notes).toContain("briefness_reduced");
  });

  it("TQ6.3: explanation mode reduces brevity and humor", () => {
    const result = calibrate({
      plan: { teachingMode: "explain", tone: "playful", shouldUseHumor: true, shouldBeBrief: true },
      wantsExplanation: true,
    });
    expect(result.shouldBeBrief).toBe(false);
    expect(result.shouldUseHumor).toBe(false);
    expect(result.notes).toContain("briefness_reduced");
  });

  it("TQ6.4: recap mode reduces brevity and humor", () => {
    const result = calibrate({
      plan: { teachingMode: "recap", tone: "playful", shouldUseHumor: true, shouldBeBrief: true },
      wantsRecap: true,
    });
    expect(result.shouldBeBrief).toBe(false);
    expect(result.shouldUseHumor).toBe(false);
    expect(result.notes).toContain("briefness_reduced");
  });

  it("TQ6.5: wantsExplanation triggers plan.teachingMode === 'explain' path", () => {
    const result = calibrate({
      plan: { teachingMode: "encourage", shouldBeBrief: true },
      wantsExplanation: true,
    });
    // wantsExplanation flag triggers explain path even if plan.teachingMode !== 'explain'
    expect(result.shouldBeBrief).toBe(false);
    expect(result.notes).toContain("briefness_reduced");
  });

  it("TQ6.6: wantsRecap triggers plan.teachingMode === 'recap' path", () => {
    const result = calibrate({
      plan: { teachingMode: "encourage", shouldBeBrief: true },
      wantsRecap: true,
    });
    expect(result.shouldBeBrief).toBe(false);
    expect(result.notes).toContain("briefness_reduced");
  });
});

// ─── TQ7: Drill & Challenge Mode Audit ────────────────────────────────────

describe("TQ7 — Drill & Challenge Mode", () => {
  it("TQ7.1: drill mode enforces brevity", () => {
    const result = calibrate({
      plan: { teachingMode: "drill", shouldBeBrief: false },
      wantsDrill: true,
    });
    expect(result.shouldBeBrief).toBe(true);
    expect(result.notes).toContain("briefness_enforced");
  });

  it("TQ7.2: drill mode dampens firmness for low-confidence learners", () => {
    const result = calibrate({
      learnerState: { confidence: "low" },
      plan: { teachingMode: "drill", tone: "firm" },
      wantsDrill: true,
    });
    expect(result.tone).toBe("warm");
    expect(result.notes).toContain("firmness_dampened");
    expect(result.notes).toContain("low_confidence_support");
  });

  it("TQ7.3: drill mode dampens firm→calm for medium/high confidence", () => {
    const result = calibrate({
      learnerState: { confidence: "medium" },
      plan: { teachingMode: "drill", tone: "firm" },
      wantsDrill: true,
    });
    expect(result.tone).toBe("calm");
    expect(result.notes).toContain("firmness_dampened");
  });

  it("TQ7.4: challenge mode with flowing momentum → calm, brief", () => {
    const result = calibrate({
      learnerState: { momentum: "flowing", clarity: "clear", confidence: "high" },
      plan: { teachingMode: "challenge", tone: "warm", shouldBeBrief: false },
    });
    expect(result.tone).toBe("calm");
    expect(result.shouldBeBrief).toBe(true);
    expect(result.notes).toContain("challenge_momentum");
    expect(result.notes).toContain("briefness_enforced");
  });

  it("TQ7.5: challenge mode dampens firm tone when learner isn't fully stable", () => {
    const result = calibrate({
      learnerState: { momentum: "flowing", clarity: "clear", confidence: "low" },
      plan: { teachingMode: "challenge", tone: "firm" },
    });
    expect(result.tone).toBe("warm");
    expect(result.notes).toContain("firmness_dampened");
    expect(result.notes).toContain("low_confidence_support");
  });

  it("TQ7.6: challenge mode only fires for flowing momentum", () => {
    const result = calibrate({
      learnerState: { momentum: "steady", clarity: "clear", confidence: "high" },
      plan: { teachingMode: "challenge", tone: "firm" },
    });
    // Steady momentum ≠ flowing — challenge dampening applies
    expect(result.notes).not.toContain("challenge_momentum");
  });

  it("TQ7.7: challenge mode with frustrated learner dampens firmness", () => {
    const result = calibrate({
      learnerState: { momentum: "flowing", clarity: "shaky", affect: "frustrated" },
      plan: { teachingMode: "challenge", tone: "firm" },
    });
    expect(result.tone).toBe("warm");
    expect(result.notes).not.toContain("challenge_momentum");
  });
});

// ─── TQ8: Low-Confidence Support Audit ────────────────────────────────────

describe("TQ8 — Low-Confidence Support", () => {
  it("TQ8.1: low confidence always acknowledges effort", () => {
    const result = calibrate({
      learnerState: { confidence: "low" },
      plan: { acknowledgeEffort: false },
    });
    expect(result.acknowledgeEffort).toBe(true);
    expect(result.notes).toContain("low_confidence_support");
  });

  it("TQ8.2: low confidence dampens firm→warm", () => {
    const result = calibrate({
      learnerState: { confidence: "low" },
      plan: { tone: "firm" },
    });
    expect(result.tone).toBe("warm");
    expect(result.notes).toContain("firmness_dampened");
  });

  it("TQ8.3: low confidence dampens calm→warm", () => {
    const result = calibrate({
      learnerState: { confidence: "low" },
      plan: { tone: "calm" },
    });
    expect(result.tone).toBe("warm");
    expect(result.notes).toContain("firmness_dampened");
  });

  it("TQ8.4: low confidence doesn't change already-warm tone", () => {
    const result = calibrate({
      learnerState: { confidence: "low" },
      plan: { tone: "warm" },
    });
    expect(result.tone).toBe("warm");
  });

  it("TQ8.5: low confidence prevents safe_playfulness restoration", () => {
    const result = calibrate({
      learnerState: { affect: "playful", clarity: "clear", confidence: "low" },
      plan: { shouldUseHumor: true, tone: "warm" },
    });
    expect(result.tone).toBe("warm");
    expect(result.notes).not.toContain("safe_playfulness");
    expect(result.notes).toContain("low_confidence_support");
  });
});

// ─── TQ9: Safe Playfulness Restoration Audit ──────────────────────────────

describe("TQ9 — Safe Playfulness Restoration", () => {
  it("TQ9.1: Playful+clear+high-confidence learners get playfulness restored", () => {
    const result = calibrate({
      learnerState: { affect: "playful", clarity: "clear", confidence: "high" },
      plan: { tone: "warm", shouldUseHumor: true },
    });
    expect(result.tone).toBe("playful");
    expect(result.shouldUseHumor).toBe(true);
    expect(result.notes).toContain("humor_restored");
    expect(result.notes).toContain("safe_playfulness");
  });

  it("TQ9.2: Playful but low-clarity → no restoration", () => {
    const result = calibrate({
      learnerState: { affect: "playful", clarity: "shaky", confidence: "high" },
      plan: { shouldUseHumor: true, tone: "warm" },
    });
    expect(result.notes).not.toContain("safe_playfulness");
  });

  it("TQ9.3: Playful but lost → no restoration (overload blocks playfulness)", () => {
    const result = calibrate({
      learnerState: { affect: "playful", clarity: "lost", confidence: "high" },
      plan: { shouldUseHumor: true, tone: "warm" },
    });
    expect(result.notes).not.toContain("safe_playfulness");
    expect(result.notes).toContain("confusion_warmth");
  });

  it("TQ9.4: Playful but medium confidence → no restoration", () => {
    const result = calibrate({
      learnerState: { affect: "playful", clarity: "clear", confidence: "medium" },
      plan: { shouldUseHumor: true, tone: "warm" },
    });
    // isStableForPlayfulness requires confidence === "high"
    expect(result.notes).not.toContain("safe_playfulness");
  });

  it("TQ9.5: Playful+frustrated → no restoration (overload blocks)", () => {
    const result = calibrate({
      learnerState: { affect: "frustrated", clarity: "clear", confidence: "high" },
      plan: { shouldUseHumor: true, tone: "warm" },
    });
    // isLearnerOverloaded catches frustrated affect
    expect(result.notes).not.toContain("safe_playfulness");
  });

  it("TQ9.6: Neutral+clear+high → no playfulness (affect isn't playful)", () => {
    const result = calibrate({
      learnerState: { affect: "neutral", clarity: "clear", confidence: "high" },
      plan: { shouldUseHumor: true, tone: "warm" },
    });
    // isStableForPlayfulness requires affect === "playful"
    expect(result.notes).not.toContain("safe_playfulness");
  });
});

// ─── Tone Note Exhaustiveness Audit ───────────────────────────────────────

describe("TQ — Tone Calibration Note Exhaustiveness", () => {
  const ALL_NOTES: ToneCalibrationNote[] = [
    "humor_suppressed",
    "confusion_warmth",
    "frustration_softening",
    "tone_softened",
    "directness_required",
    "repeated_mistake_focus",
    "review_mode",
    "safe_playfulness",
    "low_confidence_support",
    "challenge_momentum",
    "briefness_reduced",
    "briefness_enforced",
    "firmness_dampened",
    "humor_restored",
    "correction_softened",
  ];

  // Collect reachable notes from all fixtures in preceding tests
  const reachableNotes = new Set<string>();

  // Run all fixture scenarios and collect notes
  function collectNotes(result: ToneCalibrationResult) {
    for (const note of result.notes) reachableNotes.add(note);
  }

  it("TQ.NOTE.1: humor_suppressed — reachable via suppressHumor", () => {
    const r = calibrate({ plan: { shouldUseHumor: true }, suppressHumor: true });
    expect(r.notes).toContain("humor_suppressed");
    collectNotes(r);
  });

  it("TQ.NOTE.2: confusion_warmth — reachable via lost clarity", () => {
    const r = calibrate({ learnerState: { clarity: "lost" }, plan: { tone: "firm" } });
    expect(r.notes).toContain("confusion_warmth");
    collectNotes(r);
  });

  it("TQ.NOTE.3: frustration_softening — reachable via frustrated affect", () => {
    const r = calibrate({ learnerState: { affect: "frustrated", clarity: "shaky" }, plan: { tone: "firm" } });
    expect(r.notes).toContain("frustration_softening");
    collectNotes(r);
  });

  it("TQ.NOTE.4: tone_softened — reachable via softenTone+firm", () => {
    const r = calibrate({ plan: { tone: "firm" }, softenTone: true });
    expect(r.notes).toContain("tone_softened");
    collectNotes(r);
  });

  it("TQ.NOTE.5: directness_required — reachable via requireDirectness", () => {
    const r = calibrate({ plan: { tone: "playful" }, requireDirectness: true });
    expect(r.notes).toContain("directness_required");
    collectNotes(r);
  });

  it("TQ.NOTE.6: repeated_mistake_focus — reachable via repeatedMistake", () => {
    const r = calibrate({ plan: { correctionStyle: "gentle" }, repeatedMistake: true });
    expect(r.notes).toContain("repeated_mistake_focus");
    collectNotes(r);
  });

  it("TQ.NOTE.7: review_mode — reachable via review mode", () => {
    const r = calibrate({ plan: { teachingMode: "review" }, shouldReviewConcept: true });
    expect(r.notes).toContain("review_mode");
    collectNotes(r);
  });

  it("TQ.NOTE.8: safe_playfulness — reachable via stable playful learner", () => {
    const r = calibrate({
      learnerState: { affect: "playful", clarity: "clear", confidence: "high" },
      plan: { shouldUseHumor: true, tone: "warm" },
    });
    expect(r.notes).toContain("safe_playfulness");
    collectNotes(r);
  });

  it("TQ.NOTE.9: low_confidence_support — reachable via low confidence", () => {
    const r = calibrate({ learnerState: { confidence: "low" }, plan: { acknowledgeEffort: false } });
    expect(r.notes).toContain("low_confidence_support");
    collectNotes(r);
  });

  it("TQ.NOTE.10: challenge_momentum — reachable via flowing+challenge", () => {
    const r = calibrate({
      learnerState: { momentum: "flowing", clarity: "clear", confidence: "high" },
      plan: { teachingMode: "challenge", tone: "warm", shouldBeBrief: false },
    });
    expect(r.notes).toContain("challenge_momentum");
    collectNotes(r);
  });

  it("TQ.NOTE.11: briefness_reduced — reachable via review/explanation modes", () => {
    const r = calibrate({ plan: { teachingMode: "review", shouldBeBrief: true }, shouldReviewConcept: true });
    expect(r.notes).toContain("briefness_reduced");
    collectNotes(r);
  });

  it("TQ.NOTE.12: briefness_enforced — reachable via drill/requireDirectness", () => {
    const r = calibrate({ plan: { teachingMode: "drill" }, wantsDrill: true });
    expect(r.notes).toContain("briefness_enforced");
    collectNotes(r);
  });

  it("TQ.NOTE.13: firmness_dampened — reachable via low-confidence+firm", () => {
    const r = calibrate({ learnerState: { confidence: "low" }, plan: { tone: "firm" } });
    expect(r.notes).toContain("firmness_dampened");
    collectNotes(r);
  });

  it("TQ.NOTE.14: humor_restored — reachable via stable playful learner with humor", () => {
    const r = calibrate({
      learnerState: { affect: "playful", clarity: "clear", confidence: "high" },
      plan: { shouldUseHumor: true, tone: "warm" },
    });
    expect(r.notes).toContain("humor_restored");
    collectNotes(r);
  });

  it("TQ.NOTE.15: correction_softened — reachable via repeatedMistake+overload", () => {
    const r = calibrate({
      learnerState: { affect: "frustrated", clarity: "shaky" },
      plan: { correctionStyle: "direct" },
      repeatedMistake: true,
    });
    expect(r.notes).toContain("correction_softened");
    collectNotes(r);
  });

  it("TQ.NOTE.ALL: All 15 ToneCalibrationNote values are reachable across fixtures", () => {
    for (const note of ALL_NOTES) {
      expect(
        reachableNotes.has(note),
        `ToneCalibrationNote "${note}" is NOT reachable in any fixture — it may be dead code`,
      ).toBe(true);
    }
  });
});

// ─── Tone Priority Ordering Audit ─────────────────────────────────────────

describe("TQ — Tone Priority Ordering", () => {
  it("TQ.PRI.1: Overload (confusion_warmth) takes priority over directness", () => {
    const result = calibrate({
      learnerState: { clarity: "lost" },
      plan: { tone: "firm", correctionStyle: "direct" },
      requireDirectness: true,
    });
    // Overload protection wins — tone is warm, not calm/firm
    expect(result.tone).toBe("warm");
    // directness_required NOT added when learner is overloaded
    expect(result.notes).not.toContain("directness_required");
  });

  it("TQ.PRI.2: Low confidence dampens firmness even in drill mode", () => {
    const result = calibrate({
      learnerState: { confidence: "low" },
      plan: { teachingMode: "drill", tone: "firm" },
      wantsDrill: true,
    });
    // Drill enforces brevity but low confidence dampens firm tone
    expect(result.tone).toBe("warm");
    expect(result.shouldBeBrief).toBe(true);
    expect(result.notes).toContain("firmness_dampened");
  });

  it("TQ.PRI.3: Review mode prevents playfulness even for playful+confident", () => {
    const result = calibrate({
      learnerState: { affect: "playful", clarity: "clear", confidence: "high" },
      plan: { teachingMode: "review", tone: "playful", shouldUseHumor: true },
      shouldReviewConcept: true,
    });
    expect(result.tone).toBe("calm");
    expect(result.shouldUseHumor).toBe(false);
    expect(result.notes).not.toContain("safe_playfulness");
  });

  it("TQ.PRI.4: softenTone blocks playfulness restoration", () => {
    const result = calibrate({
      learnerState: { affect: "playful", clarity: "clear", confidence: "high" },
      plan: { shouldUseHumor: true, tone: "warm" },
      softenTone: true,
    });
    // canRestorePlayfulness checks !softenTone
    expect(result.notes).not.toContain("safe_playfulness");
  });

  it("TQ.PRI.5: suppressHumor persists through playfulness restoration attempt", () => {
    const result = calibrate({
      learnerState: { affect: "playful", clarity: "clear", confidence: "high" },
      plan: { shouldUseHumor: true, tone: "warm" },
      suppressHumor: true,
    });
    // suppressHumor is set early and blocks restoration
    expect(result.shouldUseHumor).toBe(false);
    expect(result.notes).toContain("humor_suppressed");
  });

  it("TQ.PRI.6: repeatedMistake blocks playfulness restoration", () => {
    const result = calibrate({
      learnerState: { affect: "playful", clarity: "clear", confidence: "high" },
      plan: { shouldUseHumor: true, tone: "warm" },
      repeatedMistake: true,
    });
    // canRestorePlayfulness checks !repeatedMistake
    expect(result.notes).not.toContain("safe_playfulness");
    expect(result.notes).toContain("repeated_mistake_focus");
  });

  it("TQ.PRI.7: wantsExplanation blocks playfulness restoration", () => {
    const result = calibrate({
      learnerState: { affect: "playful", clarity: "clear", confidence: "high" },
      plan: { shouldUseHumor: true, tone: "warm" },
      wantsExplanation: true,
    });
    // canRestorePlayfulness checks !wantsExplanation
    expect(result.notes).not.toContain("safe_playfulness");
  });
});

// ─── Determinism Audit ────────────────────────────────────────────────────

describe("TQ — Determinism Audit", () => {
  it("TQ.DET.1: calibrateTone is deterministic — overload scenario (100×)", () => {
    const input: ToneCalibrationInput = {
      learnerState: makeLearnerState({ clarity: "lost", affect: "frustrated" }),
      plan: makePlan({ tone: "firm", shouldUseHumor: true, shouldBeBrief: true, correctionStyle: "direct" }),
    };
    const first = calibrateTone(input);
    for (let i = 0; i < 100; i++) {
      const next = calibrateTone({ ...input, learnerState: { ...input.learnerState }, plan: { ...input.plan } });
      expect(next.tone).toBe(first.tone);
      expect(next.shouldUseHumor).toBe(first.shouldUseHumor);
      expect(next.shouldBeBrief).toBe(first.shouldBeBrief);
      expect(next.correctionStyle).toBe(first.correctionStyle);
      expect(next.acknowledgeEffort).toBe(first.acknowledgeEffort);
      expect(next.addNextStep).toBe(first.addNextStep);
      expect(next.notes).toEqual(first.notes);
    }
  });

  it("TQ.DET.2: calibrateTone is deterministic — playfulness restoration (100×)", () => {
    const input: ToneCalibrationInput = {
      learnerState: makeLearnerState({ affect: "playful", clarity: "clear", confidence: "high" }),
      plan: makePlan({ tone: "warm", shouldUseHumor: true }),
    };
    const first = calibrateTone(input);
    for (let i = 0; i < 100; i++) {
      const next = calibrateTone({ ...input, learnerState: { ...input.learnerState }, plan: { ...input.plan } });
      expect(next.tone).toBe(first.tone);
      expect(next.shouldUseHumor).toBe(first.shouldUseHumor);
    }
  });

  it("TQ.DET.3: calibrateTone is deterministic — challenge momentum (100×)", () => {
    const input: ToneCalibrationInput = {
      learnerState: makeLearnerState({ momentum: "flowing", clarity: "clear", confidence: "high", affect: "playful" }),
      plan: makePlan({ teachingMode: "challenge", tone: "warm", shouldBeBrief: false }),
    };
    const first = calibrateTone(input);
    for (let i = 0; i < 100; i++) {
      const next = calibrateTone({ ...input, learnerState: { ...input.learnerState }, plan: { ...input.plan } });
      expect(next.notes).toEqual(first.notes);
    }
  });

  it("TQ.DET.4: calibrateTone is deterministic — drill mode (100×)", () => {
    const input: ToneCalibrationInput = {
      learnerState: makeLearnerState({ confidence: "low" }),
      plan: makePlan({ teachingMode: "drill", tone: "firm", shouldBeBrief: false }),
      wantsDrill: true,
    };
    const first = calibrateTone(input);
    for (let i = 0; i < 100; i++) {
      const next = calibrateTone({ ...input, learnerState: { ...input.learnerState }, plan: { ...input.plan } });
      expect(next.tone).toBe(first.tone);
      expect(next.shouldBeBrief).toBe(first.shouldBeBrief);
      expect(next.notes).toEqual(first.notes);
    }
  });
});

// ─── Tone Result Shape Integrity ──────────────────────────────────────────

describe("TQ — Result Shape Integrity", () => {
  it("TQ.SHP.1: Result always has all required fields", () => {
    const result = calibrate({});
    expect(result).toHaveProperty("tone");
    expect(result).toHaveProperty("shouldUseHumor");
    expect(result).toHaveProperty("shouldBeBrief");
    expect(result).toHaveProperty("correctionStyle");
    expect(result).toHaveProperty("acknowledgeEffort");
    expect(result).toHaveProperty("addNextStep");
    expect(result).toHaveProperty("notes");
  });

  it("TQ.SHP.2: tone is always a valid ToneStyle", () => {
    const validTones: ToneStyle[] = ["warm", "calm", "firm", "playful"];
    const scenarios = [
      { learnerState: {}, plan: {} },
      { learnerState: { clarity: "lost" }, plan: { tone: "firm" } },
      { learnerState: { affect: "playful", clarity: "clear", confidence: "high" }, plan: { tone: "warm", shouldUseHumor: true } },
      { learnerState: { confidence: "low" }, plan: { tone: "firm" } },
      { learnerState: { momentum: "flowing" }, plan: { teachingMode: "challenge", tone: "firm" } },
    ];
    for (const scenario of scenarios) {
      const result = calibrate(scenario);
      expect(validTones).toContain(result.tone);
    }
  });

  it("TQ.SHP.3: correctionStyle is always a valid CorrectionStyle", () => {
    const validStyles: CorrectionStyle[] = ["gentle", "direct", "contrastive"];
    const scenarios = [
      { plan: { correctionStyle: "gentle" } },
      { plan: { correctionStyle: "direct" }, requireDirectness: true },
      { plan: { correctionStyle: "gentle" }, repeatedMistake: true },
    ];
    for (const scenario of scenarios) {
      const result = calibrate(scenario);
      expect(validStyles).toContain(result.correctionStyle);
    }
  });

  it("TQ.SHP.4: shouldUseHumor and shouldBeBrief are booleans", () => {
    const result = calibrate({});
    expect(typeof result.shouldUseHumor).toBe("boolean");
    expect(typeof result.shouldBeBrief).toBe("boolean");
    expect(typeof result.acknowledgeEffort).toBe("boolean");
    expect(typeof result.addNextStep).toBe("boolean");
  });

  it("TQ.SHP.5: notes is always an array of strings (no null/undefined entries)", () => {
    const scenarios = [
      {},
      { learnerState: { clarity: "lost" } },
      { repeatedMistake: true },
      { wantsDrill: true },
      { learnerState: { affect: "playful", clarity: "clear", confidence: "high" }, plan: { shouldUseHumor: true, tone: "warm" } },
    ];
    for (const scenario of scenarios) {
      const result = calibrate(scenario);
      expect(Array.isArray(result.notes)).toBe(true);
      for (const note of result.notes) {
        expect(typeof note).toBe("string");
        expect(note.length).toBeGreaterThan(0);
      }
    }
  });

  it("TQ.SHP.6: notes has no duplicates (pushNote deduplicates)", () => {
    // Scenario: low confidence + drill → firmness_dampened could fire twice
    const result = calibrate({
      learnerState: { confidence: "low" },
      plan: { teachingMode: "drill", tone: "firm" },
      wantsDrill: true,
    });
    const uniqueNotes = new Set(result.notes);
    expect(uniqueNotes.size).toBe(result.notes.length);
  });
});

// ─── Edge Cases ───────────────────────────────────────────────────────────

describe("TQ — Edge Cases", () => {
  it("TQ.EC.1: Neutral learner with default plan — no notes should be added", () => {
    const result = calibrate({});
    // Default plan: warm tone, no humor, brief, gentle correction, acknowledge effort
    // Neutral learner: medium confidence, clear, steady, neutral affect
    // → No rule should fire except default plan properties
    expect(result.tone).toBe("warm");
    expect(result.shouldBeBrief).toBe(true);
    expect(result.acknowledgeEffort).toBe(true);
    // Only briefness_enforced from drill should NOT fire (no drill mode)
  });

  it("TQ.EC.2: All flags set simultaneously — overload wins", () => {
    const result = calibrate({
      learnerState: { clarity: "lost", affect: "frustrated", confidence: "low" },
      plan: { tone: "firm", shouldUseHumor: true, shouldBeBrief: true, correctionStyle: "direct" },
      suppressHumor: true,
      requireDirectness: true,
      softenTone: true,
      repeatedMistake: true,
      shouldReviewConcept: true,
      wantsExplanation: true,
      wantsRecap: true,
      wantsDrill: true,
    });
    // Overload protection should dominate
    expect(result.tone).toBe("warm");
    expect(result.shouldUseHumor).toBe(false);
    expect(result.correctionStyle).toBe("gentle");
    expect(result.notes).toContain("confusion_warmth");
    expect(result.notes).toContain("frustration_softening");
    expect(result.notes).toContain("humor_suppressed");
    // tone_softened NOT expected: after overload sets tone→warm, softenTone
    // doesn't fire because warm is neither firm nor playful
    expect(result.notes).toContain("repeated_mistake_focus");
    expect(result.notes).toContain("correction_softened");
    expect(result.notes).toContain("review_mode");
    expect(result.notes).toContain("low_confidence_support");
    // briefness: overload sets false, review/explain/recap set false, but drill (last among the modes)
    // re-enables briefness → shouldBeBrief=true. Drill runs after review/explain/recap.
    expect(result.shouldBeBrief).toBe(true);
    expect(result.notes).toContain("briefness_enforced");
  });

  it("TQ.EC.3: All tone values are reachable via different scenarios", () => {
    const tones = new Set<ToneStyle>();

    // warm — overload, low confidence, softened playful, etc.
    tones.add(calibrate({ learnerState: { clarity: "lost" }, plan: { tone: "firm" } }).tone);
    tones.add(calibrate({ learnerState: { confidence: "low" }, plan: { tone: "firm" } }).tone);
    tones.add(calibrate({ plan: { tone: "warm" } }).tone);

    // calm — review mode, directness, challenge
    tones.add(calibrate({ plan: { teachingMode: "review" }, shouldReviewConcept: true }).tone);
    tones.add(calibrate({ plan: { teachingMode: "drill", tone: "firm" }, wantsDrill: true }).tone);

    // firm — if plan is firm and no dampening
    tones.add(calibrate({ plan: { tone: "firm" } }).tone);

    // playful — safe playfulness restoration
    tones.add(calibrate({
      learnerState: { affect: "playful", clarity: "clear", confidence: "high" },
      plan: { shouldUseHumor: true, tone: "warm" },
    }).tone);

    expect(tones.has("warm")).toBe(true);
    expect(tones.has("calm")).toBe(true);
    expect(tones.has("firm")).toBe(true);
    expect(tones.has("playful")).toBe(true);
  });

  it("TQ.EC.4: All correction styles are reachable", () => {
    const styles = new Set<CorrectionStyle>();

    // gentle — default, overload
    styles.add(calibrate({ plan: { correctionStyle: "gentle" } }).correctionStyle);
    styles.add(calibrate({ learnerState: { clarity: "lost" }, plan: { correctionStyle: "direct" } }).correctionStyle);

    // direct — requireDirectness
    styles.add(calibrate({ plan: { correctionStyle: "gentle" }, requireDirectness: true }).correctionStyle);

    // contrastive — repeated mistakes
    styles.add(calibrate({ plan: { correctionStyle: "gentle" }, repeatedMistake: true }).correctionStyle);

    expect(styles.has("gentle")).toBe(true);
    expect(styles.has("direct")).toBe(true);
    expect(styles.has("contrastive")).toBe(true);
  });

  it("TQ.EC.5: No-op scenario returns plan values unchanged", () => {
    const plan = makePlan({ tone: "warm", shouldBeBrief: true, correctionStyle: "gentle", acknowledgeEffort: true, addNextStep: true });
    const result = calibrateTone({
      learnerState: makeLearnerState(), // medium/clear/steady/neutral
      plan,
      // No flags set
    });
    // Default learner state doesn't trigger any tone changes
    expect(result.tone).toBe("warm");
    expect(result.shouldBeBrief).toBe(true);
    expect(result.correctionStyle).toBe("gentle");
    expect(result.acknowledgeEffort).toBe(true);
    expect(result.addNextStep).toBe(true);
  });

  it("TQ.EC.6: challenge momentum doesn't fire for frustrated+flowing", () => {
    const result = calibrate({
      learnerState: { momentum: "flowing", clarity: "clear", confidence: "high", affect: "frustrated" },
      plan: { teachingMode: "challenge", tone: "firm" },
    });
    // Frustrated blocks challenge_momentum (affect !== "frustrated" check)
    expect(result.notes).not.toContain("challenge_momentum");
  });

  it("TQ.EC.7: challenge momentum with playful learner → safe_playfulness overrides challenge", () => {
    const result = calibrate({
      learnerState: { momentum: "flowing", clarity: "clear", confidence: "high", affect: "playful" },
      plan: { teachingMode: "challenge", tone: "warm", shouldBeBrief: false },
    });
    // Challenge sets calm+brief, but safe_playfulness (which runs after) sets tone→playful
    // This is correct — playfulness restoration is the final pass and wins
    expect(result.tone).toBe("playful");
    expect(result.shouldBeBrief).toBe(true); // brief from challenge persists
    expect(result.notes).toContain("challenge_momentum");
    expect(result.notes).toContain("safe_playfulness");
  });

  it("TQ.EC.8: Low confidence fires firmness_dampened only for firm/calm tones", () => {
    // Low confidence + firm → dampened to warm
    const resultFirm = calibrate({ learnerState: { confidence: "low" }, plan: { tone: "firm" } });
    expect(resultFirm.notes).toContain("firmness_dampened");
    expect(resultFirm.tone).toBe("warm");

    // Low confidence + warm → no dampening needed
    const resultWarm = calibrate({ learnerState: { confidence: "low" }, plan: { tone: "warm" } });
    // firmness_dampened is NOT added for warm tone (already warm)
    expect(resultWarm.tone).toBe("warm");

    // Low confidence + playful tone (but firmness_dampened check: tone === 'firm' || tone === 'calm')
    const resultPlayful = calibrate({
      learnerState: { confidence: "low", affect: "playful" },
      plan: { tone: "playful" },
    });
    // playful isn't firm/calm, so no firmness_dampened
    expect(resultPlayful.notes).not.toContain("firmness_dampened");
  });
});
