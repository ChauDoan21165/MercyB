/**
 * Teacher Mercy — Challenge Timing Decision Policy
 *
 * Decides WHEN Teacher Mercy should launch a challenge — a harder-than-
 * comfort-zone task that pushes the learner to grow beyond their current level.
 *
 * A challenge is different from a correction, a drill, or an encouragement:
 *   Correction  = "You said X wrong, here's the right way."
 *   Drill       = "Let's practice this pattern 5 times to build the habit."
 *   Encouragement = "Nice recovery after that struggle."
 *   Challenge   = "Try saying this in past tense" or "Can you explain why
 *                  you chose that word?" — it's a growth exercise.
 *
 * This module layers ON TOP of correction timing (teacherMercyCorrectionTiming.ts),
 * encouragement timing (encouragementTimingPolicy.ts), drill timing (drillTimingPolicy.ts),
 * and suppression rules (suppressionRules.ts). It answers a different question:
 * "Given the learner's current state, recent performance, and session context,
 *  is NOW the right moment to push their ceiling with a challenge?"
 *
 * Design principles:
 *   1. Challenge as growth, not punishment — challenges are invitations to
 *      stretch, not penalties for mistakes.
 *   2. Timing matters — challenging too soon overwhelms; too late lets
 *      the learner plateau.
 *   3. Learner-aware — shy learners need challenges delivered gently;
 *      overconfident learners need challenges to expose blind spots.
 *   4. Zone of proximal development — challenges should be just beyond
 *      the learner's current capability, not far beyond it.
 *   5. Session rhythm — challenges are earned by consistent correctness,
 *      not doled out mechanically.
 *   6. Vietnamese-first — all rationale is produced in Vietnamese for the
 *      learner-facing layer; English rationale is for telemetry.
 *
 * Pure functions — no I/O, no side effects, deterministic.
 */

import type { LearnerConfidence } from "./teacherMercyCorrectionTiming";

// ─── Challenge Decision Types ──────────────────────────────────────────────

/**
 * The four challenge timing decisions Teacher Mercy can make.
 *
 * CHALLENGE_NOW      — launch a challenge right now, in this turn.
 * CHALLENGE_SOON     — queue a challenge for ~3 turns from now; let the
 *                      learner experience a few more successes first.
 * CHALLENGE_AT_END   — save the challenge for the end-of-lesson review /
 *                      synthesis phase where the learner has full context.
 * NO_CHALLENGE       — not the right time; continue normal conversation.
 */
export type ChallengeDecision =
  | "CHALLENGE_NOW"
  | "CHALLENGE_SOON"
  | "CHALLENGE_AT_END"
  | "NO_CHALLENGE";

/**
 * The type of challenge that triggered the consideration.
 * This informs what KIND of challenge to generate — not just "try harder"
 * but a specific growth target.
 */
export type ChallengeSignal =
  | "plateau_push"
  | "overconfidence_exposure"
  | "beginner_one_step_harder"
  | "pattern_extension"
  | "synthesis_challenge"
  | "none";

/**
 * Input context for the challenge timing decision.
 */
export type ChallengeTimingInput = {
  /** How many consecutive turns has the learner been correct at their current CEFR level. */
  consecutiveCorrectAtLevel: number;
  /** How many turns have passed since the last challenge was launched (or Infinity if none yet). */
  turnsSinceLastChallenge: number;
  /** Total challenges launched in this session. */
  challengesThisSession: number;
  /** Total conversation turns in this session so far. */
  totalTurnsInSession: number;
  /** The learner's apparent confidence level. */
  learnerConfidence: LearnerConfidence;
  /** Whether the learner is showing frustration signals. */
  isShowingFrustration: boolean;
  /** Known CEFR level (null = unknown, treated as beginner). */
  cefrLevel: string | null;
  /** Whether the learner is making the same errors repeatedly without self-correcting (blind spot). */
  hasUnnoticedRepeatedErrors: boolean;
  /** How many times the repeated error has occurred recently. */
  unnoticedErrorCount: number;
  /** Total corrections delivered in this session so far. */
  totalCorrectionsInSession: number;
  /** Approximate % through the current lesson (0–100). */
  currentLessonProgress: number;
};

/**
 * The challenge timing decision with full rationale.
 */
export type ChallengeTimingResult = {
  /** The chosen challenge decision. */
  decision: ChallengeDecision;
  /** The signal that triggered this decision (or "none"). */
  signal: ChallengeSignal;
  /**
   * Human-readable reason for the decision, in English (for telemetry/logging).
   * Vietnamese-facing explanations belong in the response generation layer.
   */
  reason: string;
  /** Machine-readable reason code for telemetry/analytics. */
  reasonCode: string;
  /**
   * For CHALLENGE_SOON: suggested number of turns to wait before launching.
   * undefined for all other decisions.
   */
  suggestAfterTurns?: number;
  /**
   * The target skill or domain for the challenge (tag for challenge generator).
   * undefined when decision is NO_CHALLENGE.
   */
  suggestedChallengeTarget?: string;
};

// ─── CEFR Level Utilities ──────────────────────────────────────────────────

function isBeginnerLevel(cefrLevel: string | null): boolean {
  if (!cefrLevel) return true;
  const upper = cefrLevel.toUpperCase();
  return upper === "A1" || upper === "A2";
}

function isAdvancedLevel(cefrLevel: string | null): boolean {
  if (!cefrLevel) return false;
  const upper = cefrLevel.toUpperCase();
  return upper === "B2" || upper === "C1" || upper === "C2";
}

/**
 * The CEFR level one step above the current level.
 * Used to determine the "zone of proximal development" — what the learner
 * is ready to attempt but hasn't mastered yet.
 */
function oneStepUpCefr(cefrLevel: string | null): string {
  if (!cefrLevel) return "A2";
  const upper = cefrLevel.toUpperCase();
  const map: Record<string, string> = {
    "A1": "A2",
    "A2": "B1",
    "B1": "B2",
    "B2": "C1",
    "C1": "C2",
    "C2": "C2", // ceiling — challenge stays at C2 with harder material
  };
  return map[upper] ?? "B1";
}

// ─── Core Decision Gates ───────────────────────────────────────────────────

/**
 * C1 — Plateau Detection Gate
 *
 * If the learner has been correct at their current level for a sustained
 * stretch (≥6 consecutive turns for B1+, ≥4 for A1–A2), it's time to
 * challenge them one step harder. A learner who never faces a challenge
 * never grows — they stay comfortable and plateau.
 *
 * The plateau threshold is lower for beginners because their growth
 * curve is steeper — they should be challenged more frequently.
 *
 * Exception: skip if we just challenged (< 2 turns ago) — let the
 * previous challenge's learning sink in first.
 */
function checkPlateauDetectionGate(
  input: ChallengeTimingInput,
): ChallengeTimingResult | null {
  const plateauThreshold = isBeginnerLevel(input.cefrLevel) ? 4 : 6;

  if (input.consecutiveCorrectAtLevel < plateauThreshold) return null;

  // Don't stack challenges — let the previous one breathe
  if (input.turnsSinceLastChallenge < 2) return null;

  return {
    decision: "CHALLENGE_NOW",
    signal: "plateau_push",
    reason:
      `Learner has been correct for ${input.consecutiveCorrectAtLevel} consecutive turns at ${input.cefrLevel ?? "unknown"} level — challenging to push beyond the current plateau toward ${oneStepUpCefr(input.cefrLevel)}.`,
    reasonCode: "challenge_plateau_detection",
    suggestedChallengeTarget: oneStepUpCefr(input.cefrLevel),
  };
}

/**
 * C2 — Overconfidence Exposure Gate
 *
 * If a confident learner is making the same error repeatedly (≥3 times)
 * but not self-correcting or noticing (hasUnnoticedRepeatedErrors), a
 * challenge exposes their blind spot more effectively than another correction.
 *
 * Confident learners can tune out corrections ("I know that, just a slip").
 * A challenge that forces them to USE the pattern correctly reveals the gap
 * more powerfully than a direct correction would.
 *
 * Exception: skip if we just challenged recently (< 3 turns) — overconfidence
 * exposure is a strong signal but spacing still matters.
 */
function checkOverconfidenceExposureGate(
  input: ChallengeTimingInput,
): ChallengeTimingResult | null {
  if (input.learnerConfidence !== "confident") return null;
  if (!input.hasUnnoticedRepeatedErrors) return null;
  if (input.unnoticedErrorCount < 3) return null;

  // Don't challenge if we just did — let them absorb
  if (input.turnsSinceLastChallenge < 3) return null;

  return {
    decision: "CHALLENGE_NOW",
    signal: "overconfidence_exposure",
    reason:
      `Confident learner with ${input.unnoticedErrorCount} unnoticed repeated errors — launching challenge to expose the blind spot more powerfully than a correction would.`,
    reasonCode: "challenge_overconfidence_exposure",
    suggestedChallengeTarget: "error-pattern-application",
  };
}

/**
 * C3 — Too Soon After Challenge Gate
 *
 * If we challenged very recently (< 4 turns ago), don't challenge again.
 * Challenges need absorption time — back-to-back challenges feel like
 * an interrogation, not a growth opportunity.
 *
 * The spacing for challenges (4 turns) is wider than for drills (3 turns)
 * because challenges are mentally more demanding — they require the
 * learner to stretch, not just practice.
 */
function checkTooSoonAfterChallengeGate(
  input: ChallengeTimingInput,
): ChallengeTimingResult | null {
  if (input.turnsSinceLastChallenge >= 4) return null;

  return {
    decision: "NO_CHALLENGE",
    signal: "none",
    reason:
      `Only ${input.turnsSinceLastChallenge} turn(s) since last challenge — too soon. Challenges need absorption time before the next one.`,
    reasonCode: "challenge_too_soon_after_challenge",
  };
}

/**
 * C4 — Challenge Saturation Gate
 *
 * If we've already launched several challenges this session (≥3), be
 * selective. More challenges don't mean more growth — they can mean
 * more fatigue. Reserve further challenges for the strongest pedagogical
 * signals (plateau, overconfidence).
 *
 * At ≥5 challenges in a session, block all further challenges —
 * the session is already challenge-rich; save any remaining ones
 * for the next session.
 *
 * Plateau detection (C1) and overconfidence exposure (C2) fire before
 * this gate, so the strongest signals still get through at 3–4 challenges.
 */
function checkChallengeSaturationGate(
  input: ChallengeTimingInput,
): ChallengeTimingResult | null {
  if (input.challengesThisSession < 3) return null;

  // At 5+ challenges, block everything — save for next session
  if (input.challengesThisSession >= 5) {
    return {
      decision: "NO_CHALLENGE",
      signal: "none",
      reason:
        `Already ${input.challengesThisSession} challenges in this session — blocking further challenges to prevent fatigue. Save remaining stretch goals for next session.`,
      reasonCode: "challenge_saturation_block_all",
    };
  }

  // At 3–4 challenges, be selective — only the strongest signals pass
  // (C1 and C2 fire before C4 in the gate array, so they've already
  // been checked. If we reach here, the signal is weaker.)
  return {
    decision: "NO_CHALLENGE",
    signal: "none",
    reason:
      `Already ${input.challengesThisSession} challenges this session — reserving further challenges for strong pedagogical signals only.`,
    reasonCode: "challenge_saturation_selective",
  };
}

/**
 * C5 — Shy Learner Gate
 *
 * Shy learners need challenges delivered gently and after a longer
 * conversational warm-up. Don't challenge now — queue it for
 * 3–4 turns from now.
 *
 * A shy learner who gets challenged immediately may withdraw or feel
 * put on the spot. Queue the challenge for later so they can mentally
 * prepare and feel like they're "ready" rather than "tested."
 *
 * Shy learners still get plateau challenges (C1 fires before C5),
 * but the delivery is through this gate's gentler channel.
 */
function checkShyLearnerGate(
  input: ChallengeTimingInput,
): ChallengeTimingResult | null {
  if (input.learnerConfidence !== "shy") return null;

  // Shy learners need the longest gap — ≥6 turns
  if (input.turnsSinceLastChallenge < 6) {
    return {
      decision: "NO_CHALLENGE",
      signal: "none",
      reason:
        `Shy learner with only ${input.turnsSinceLastChallenge} turns since last challenge — need ≥6 turns of conversational space for comfort.`,
      reasonCode: "challenge_shy_learner_space",
    };
  }

  // Queue it gently — not now, but soon
  return {
    decision: "CHALLENGE_SOON",
    signal: "plateau_push",
    reason:
      `Shy learner — queue challenge for 3 turns from now to introduce it gently and let the learner feel ready.`,
    reasonCode: "challenge_shy_learner_gentle",
    suggestAfterTurns: 3,
    suggestedChallengeTarget: oneStepUpCefr(input.cefrLevel),
  };
}

/**
 * C6 — Frustration Protection Gate
 *
 * If the learner is showing frustration signals, do NOT challenge.
 * A challenge during frustration feels punishing — the learner is
 * already struggling, and asking them to "try something harder" is
 * demotivating.
 *
 * When frustration subsides and the learner shows a correct turn,
 * a gentle challenge can be queued for later — but only if the
 * learner has had time to reset.
 *
 * A human teacher would never pile a harder task onto a frustrated
 * student — they'd first calm the frustration, rebuild confidence,
 * THEN offer the stretch opportunity.
 */
function checkFrustrationProtectionGate(
  input: ChallengeTimingInput,
): ChallengeTimingResult | null {
  if (!input.isShowingFrustration) return null;

  // Frustrated learner — no challenge period
  return {
    decision: "NO_CHALLENGE",
    signal: "none",
    reason:
      `Learner is showing frustration — challenging now would feel punishing, not growth-oriented. Focus on support and recovery first.`,
    reasonCode: "challenge_frustration_defer",
  };
}

/**
 * C7 — Beginner One-Step-Harder Gate
 *
 * Beginners (A1–A2) who have shown consistent correctness (≥3 turns)
 * benefit from gentle "one step harder" challenges. These are small
 * stretches — not "speak in past perfect" but "try saying that sentence
 * with a different subject."
 *
 * Beginner challenges should be frequent but small — each one a tiny
 * step beyond the current level. Without challenges, beginners stay
 * in their narrow comfort zone indefinitely.
 *
 * Limit: don't challenge more than once every 3 turns even for beginners.
 */
function checkBeginnerOneStepHarderGate(
  input: ChallengeTimingInput,
): ChallengeTimingResult | null {
  if (!isBeginnerLevel(input.cefrLevel)) return null;
  if (input.consecutiveCorrectAtLevel < 3) return null;

  // Don't challenge too frequently — space by 3 turns minimum
  if (input.turnsSinceLastChallenge < 3) return null;

  return {
    decision: "CHALLENGE_NOW",
    signal: "beginner_one_step_harder",
    reason:
      `Beginner (${input.cefrLevel ?? "unknown"}) with ${input.consecutiveCorrectAtLevel} consecutive correct turns — launching a small one-step-harder challenge to prevent comfort-zone stagnation.`,
    reasonCode: "challenge_beginner_one_step_harder",
    suggestedChallengeTarget: oneStepUpCefr(input.cefrLevel),
  };
}

/**
 * C8 — Lesson Completion Synthesis Gate
 *
 * If the learner is near the end of the lesson (≥80% progress), save
 * the challenge for the end-of-lesson synthesis phase. A mid-lesson
 * challenge can derail the lesson flow; at the end, the learner has
 * full context and the challenge can serve as a capstone.
 *
 * Exception: plateau detection (C1) and overconfidence exposure (C2)
 * fire before this gate, so strong growth signals still generate
 * immediate challenges even near lesson end.
 */
function checkLessonCompletionSynthesisGate(
  input: ChallengeTimingInput,
): ChallengeTimingResult | null {
  if (input.currentLessonProgress < 80) return null;

  return {
    decision: "CHALLENGE_AT_END",
    signal: "synthesis_challenge",
    reason:
      `Lesson ${input.currentLessonProgress}% complete — saving challenge for end-of-lesson synthesis phase where the learner has full context.`,
    reasonCode: "challenge_lesson_completion_synthesis",
  };
}

// ─── Default Fallback ──────────────────────────────────────────────────────

/**
 * Default challenge timing decision when no specific gate fires.
 *
 * Conservative default: NO_CHALLENGE. Challenges should be triggered
 * by specific pedagogical signals — plateau, overconfidence, beginner
 * stretch — not as a default behavior.
 *
 * One exception: if no challenges have been launched this session
 * AND the learner has been consistently correct for a while
 * AND we're mid-session, suggest a challenge soon to introduce
 * the concept of stretch goals.
 */
function defaultChallengeTiming(
  input: ChallengeTimingInput,
): ChallengeTimingResult {
  // No challenges yet + sustained correctness mid-session → gentle nudge
  if (
    input.challengesThisSession === 0 &&
    input.consecutiveCorrectAtLevel >= 5 &&
    input.turnsSinceLastChallenge >= 100 && // effectively "never challenged"
    input.totalTurnsInSession >= 8 &&
    !input.isShowingFrustration
  ) {
    return {
      decision: "CHALLENGE_SOON",
      signal: "plateau_push",
      reason:
        `No challenges yet this session with ${input.consecutiveCorrectAtLevel} consecutive correct turns — suggesting a gentle challenge to introduce stretch goals.`,
      reasonCode: "challenge_default_first_challenge_suggestion",
      suggestAfterTurns: 3,
      suggestedChallengeTarget: oneStepUpCefr(input.cefrLevel),
    };
  }

  return {
    decision: "NO_CHALLENGE",
    signal: "none",
    reason:
      "No specific pedagogical signal justifying a challenge at this moment — continue normal conversation.",
    reasonCode: "challenge_default_no_challenge",
  };
}

// ─── Public API ────────────────────────────────────────────────────────────

/**
 * The ordered list of gates that determine challenge timing.
 * Gates are evaluated in order; the first non-null result wins.
 *
 * Priority hierarchy:
 *   1. Plateau detection — sustained correctness at current level → challenge now (C1)
 *   2. Overconfidence exposure — confident learner with blind spots → challenge now (C2)
 *   3. Too soon after challenge — never back-to-back challenges (C3)
 *   4. Challenge saturation — be selective after many challenges (C4)
 *   5. Shy learner — gentle, delayed challenges (C5)
 *   6. Frustration protection — never challenge a frustrated learner (C6)
 *   7. Beginner one-step-harder — frequent small stretches (C7)
 *   8. Lesson completion synthesis — save for end-of-lesson capstone (C8)
 *   9. Default — conservative NO_CHALLENGE
 *
 * Design rationale for C3/C4 before C5/C6/C7:
 *   Spacing and saturation are hard constraints — no matter how shy the
 *   learner or how much they need a stretch, back-to-back challenges
 *   are never effective. C1/C2 fire first because plateau and overconfidence
 *   are the strongest pedagogical signals — they override gentler delivery
 *   concerns (though C1/C2 each carry their own internal spacing checks).
 */
const GATES: ReadonlyArray<
  (input: ChallengeTimingInput) => ChallengeTimingResult | null
> = [
  checkPlateauDetectionGate,
  checkOverconfidenceExposureGate,
  checkTooSoonAfterChallengeGate,
  checkChallengeSaturationGate,
  checkShyLearnerGate,
  checkFrustrationProtectionGate,
  checkBeginnerOneStepHarderGate,
  checkLessonCompletionSynthesisGate,
];

/**
 * Decide whether to launch a challenge right now, soon, at lesson end, or not at all.
 *
 * Pure function — deterministic, no side effects, no I/O.
 *
 * @returns A ChallengeTimingResult with the chosen decision and rationale.
 */
export function decideChallengeTiming(
  input: ChallengeTimingInput,
): ChallengeTimingResult {
  for (const gate of GATES) {
    const result = gate(input);
    if (result !== null) return result;
  }

  return defaultChallengeTiming(input);
}

/**
 * Convenience: check whether a challenge is recommended now
 * (as opposed to later or not at all).
 */
export function isChallengeRecommendedNow(
  result: ChallengeTimingResult,
): boolean {
  return result.decision === "CHALLENGE_NOW";
}

/**
 * Convenience: check whether a challenge is queued for later
 * (CHALLENGE_SOON or CHALLENGE_AT_END).
 */
export function isChallengeQueued(
  result: ChallengeTimingResult,
): boolean {
  return result.decision === "CHALLENGE_SOON" || result.decision === "CHALLENGE_AT_END";
}

/**
 * Convenience: check whether no challenge is recommended at all.
 */
export function isNoChallengeRecommended(
  result: ChallengeTimingResult,
): boolean {
  return result.decision === "NO_CHALLENGE";
}

// ─── Catalogs ───────────────────────────────────────────────────────────────

export const CHALLENGE_TIMING_DECISION_CATALOG: ReadonlyArray<{
  decision: ChallengeDecision;
  titleEn: string;
  titleVi: string;
  descriptionVi: string;
}> = [
  {
    decision: "CHALLENGE_NOW",
    titleEn: "Challenge now",
    titleVi: "Thử thách ngay",
    descriptionVi: "Đưa ra một thử thách vừa sức ngay bây giờ — người học đã sẵn sàng để tiến lên.",
  },
  {
    decision: "CHALLENGE_SOON",
    titleEn: "Challenge soon",
    titleVi: "Thử thách lát nữa",
    descriptionVi: "Xếp lịch thử thách sau vài lượt — để người học có thời gian sẵn sàng tâm lý.",
  },
  {
    decision: "CHALLENGE_AT_END",
    titleEn: "Challenge at end",
    titleVi: "Thử thách cuối bài",
    descriptionVi: "Dành thử thách cho phần tổng kết cuối bài — khi người học đã có đầy đủ ngữ cảnh.",
  },
  {
    decision: "NO_CHALLENGE",
    titleEn: "No challenge",
    titleVi: "Không thử thách",
    descriptionVi: "Tiếp tục trò chuyện bình thường — chưa đến lúc phù hợp để thử thách.",
  },
];

export const CHALLENGE_TIMING_REASON_CODE_CATALOG: ReadonlyArray<{
  reasonCode: string;
  decision: ChallengeDecision;
  descriptionVi: string;
}> = [
  { reasonCode: "challenge_plateau_detection", decision: "CHALLENGE_NOW", descriptionVi: "Đang nói đúng liên tục — thử thách để phá vỡ trần hiện tại." },
  { reasonCode: "challenge_overconfidence_exposure", decision: "CHALLENGE_NOW", descriptionVi: "Người học tự tin nhưng có lỗi lặp không nhận ra — thử thách để lộ điểm mù." },
  { reasonCode: "challenge_too_soon_after_challenge", decision: "NO_CHALLENGE", descriptionVi: "Vừa thử thách xong — để người học hấp thụ đã." },
  { reasonCode: "challenge_saturation_selective", decision: "NO_CHALLENGE", descriptionVi: "Đã thử thách vài lần trong buổi — chỉ thử thách khi có tín hiệu mạnh." },
  { reasonCode: "challenge_saturation_block_all", decision: "NO_CHALLENGE", descriptionVi: "Đã thử thách nhiều trong buổi — để dành cho buổi sau." },
  { reasonCode: "challenge_shy_learner_space", decision: "NO_CHALLENGE", descriptionVi: "Người học nhút nhát — cần thêm không gian trò chuyện trước khi thử thách." },
  { reasonCode: "challenge_shy_learner_gentle", decision: "CHALLENGE_SOON", descriptionVi: "Người học nhút nhát — giới thiệu thử thách nhẹ nhàng, không áp lực." },
  { reasonCode: "challenge_frustration_defer", decision: "NO_CHALLENGE", descriptionVi: "Đang bực — thử thách lúc này giống như trừng phạt, không phải phát triển." },
  { reasonCode: "challenge_beginner_one_step_harder", decision: "CHALLENGE_NOW", descriptionVi: "Mới học, đang nói đúng — thử thách nhỏ để tiến lên một bước." },
  { reasonCode: "challenge_lesson_completion_synthesis", decision: "CHALLENGE_AT_END", descriptionVi: "Sắp hết bài — để dành thử thách cho phần tổng kết." },
  { reasonCode: "challenge_default_first_challenge_suggestion", decision: "CHALLENGE_SOON", descriptionVi: "Chưa có thử thách nào — gợi ý nhẹ nhàng để giới thiệu." },
  { reasonCode: "challenge_default_no_challenge", decision: "NO_CHALLENGE", descriptionVi: "Chưa có tín hiệu cần thử thách — tiếp tục trò chuyện." },
];
