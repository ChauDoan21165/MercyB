// Speak detailed-scoring gate (premium/trial + per-session cap).
//
// The by-ear self-compare loop (hear model, record self, replay, compare by
// ear) is ALWAYS free — it lives in SelfCompareRecorder and never touches this
// gate. This module only governs the COST-bearing Azure per-word/per-phoneme
// detailed scoring: it is premium/trial-gated and capped per session.
//
// Honest-by-construction: when the gate blocks (not premium, or cap reached)
// the caller shows NO score and NO fake number — never a silent downgrade to a
// pretend measurement. Pure + deterministic; no env, no network, no React, so
// it is trivially unit-testable.

/** Per-session ceiling on Azure detailed-scoring attempts for a premium user. */
export const SPEAK_DETAIL_SESSION_CAP = 12;

/** Warm Vietnamese message shown when a premium learner exhausts the cap. The
 *  by-ear compare stays available, so the learner is never dead-ended. */
export const SPEAK_DETAIL_CAP_MESSAGE_VI =
  "Bạn đã dùng hết lượt chấm chi tiết hôm nay. " +
  "Bạn vẫn có thể nghe mẫu và nghe lại giọng của mình để tự so sánh.";

export type SpeakDetailGateInput = {
  /** Feature-flag gate. When false, legacy behavior (no premium/cap gating). */
  premiumGateEnabled: boolean;
  /** Is the current user premium OR on an active trial. */
  isPremiumOrTrial: boolean;
  /** How many detailed-scoring results have already landed this session. */
  detailUsed: number;
  /** Override the cap (tests). Defaults to SPEAK_DETAIL_SESSION_CAP. */
  cap?: number;
};

export type SpeakDetailGateResult = {
  /** The premium/cap gate permits a detailed-scoring attempt. Callers still AND
   *  this with their own preconditions (Azure flag, recorded audio, session). */
  gateAllows: boolean;
  /** Premium learner who has used up the per-session cap. Drives the warm
   *  "out of detailed scoring" message. */
  capReached: boolean;
  /** Blocked because the learner is not premium/trial (gate enabled). Free
   *  users get the free by-ear compare, never a fake number. */
  premiumBlocked: boolean;
};

/**
 * Resolve whether the cost-bearing detailed scorer may run this attempt.
 *
 * Gate OFF → legacy: always allow (existing Azure-flag/audio/session checks
 * remain the only guards). Gate ON → require premium/trial AND under the
 * per-session cap. `capReached` only ever true for a premium learner — a free
 * learner is `premiumBlocked`, not "capped".
 */
export function resolveSpeakDetailGate(
  input: SpeakDetailGateInput,
): SpeakDetailGateResult {
  if (!input.premiumGateEnabled) {
    return { gateAllows: true, capReached: false, premiumBlocked: false };
  }
  const cap = input.cap ?? SPEAK_DETAIL_SESSION_CAP;
  const premiumBlocked = !input.isPremiumOrTrial;
  const capReached = !premiumBlocked && input.detailUsed >= cap;
  return {
    gateAllows: !premiumBlocked && !capReached,
    capReached,
    premiumBlocked,
  };
}
