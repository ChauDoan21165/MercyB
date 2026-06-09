import { describe, it, expect, vi } from "vitest";

import { scoreConversationTurn } from "@/lib/pronunciation/conversationPronunciation";
import {
  resolveSpeakDetailGate,
  SPEAK_DETAIL_SESSION_CAP,
} from "@/lib/pronunciation/speakDetailGate";
import type { NormalizedPronunciationScoreResult } from "@/lib/pronunciation/cloudScorer";

/**
 * Hard cost-control PROOF for Azure Speech spend (audit G163789098).
 *
 * One auditable suite that pins the five invariants that keep pronunciation /
 * TTS from silently burning Azure money:
 *   1. Azure pronunciation scoring runs ONLY on a real learner attempt.
 *   2. An exhausted per-session cap does NOT call Azure.
 *   3. A free (non-premium/trial) user does NOT call Azure detailed scoring.
 *   4. Low-confidence / empty audio does NOT produce a fabricated score.
 *
 * Invariant "a TTS cache HIT does NOT call Azure again" is proven in the
 * mercy-tts edge-function suite (supabase/functions/mercy-tts/__tests__/
 * core.test.ts → "serves cached audio without calling Azure"); it is not
 * re-imported here to keep this app-side suite off the edge-function tsconfig.
 *
 * These guard the EXISTING, wired controls (the premium/trial + per-session
 * gate, the conversation real-attempt guard). The separate
 * `azure-phoneme-stream` function now has its OWN hard cost controls
 * (pre-connection rate limit + trial/premium gate + shared global daily $
 * cap, plus a per-session Azure-pass cap and empty/poor-audio skip) proven
 * in supabase/functions/azure-phoneme-stream/__tests__/costControls.test.ts;
 * that Deno-free suite is kept off this app-side tsconfig.
 */

function realBlob(): Blob {
  return new Blob([new Uint8Array(2000)], { type: "audio/webm" });
}

function azureResult(): NormalizedPronunciationScoreResult {
  return {
    mode: "azure_phoneme_batch",
    provider: "azure",
    overallScore: 80,
    wordScores: [
      { word: "think", heard: "think", score: 90, status: "correct", phonemes: [{ phoneme: "th", score: 90 }] },
    ],
    phonemeScores: [{ word: "think", phoneme: "th", score: 90 }],
    messageKey: "pronunciation.score.azure_phoneme_batch",
    labelKind: "pronunciation_detail",
    useLocalFallback: false,
  };
}

function localFallback(): NormalizedPronunciationScoreResult {
  return {
    mode: "local_sentence_match",
    provider: "local",
    overallScore: 75,
    messageKey: "pronunciation.score.local_sentence_match",
    labelKind: "sentence_match",
    useLocalFallback: true,
  };
}

/**
 * Faithful model of the caller's decision in AiTutor.tsx: Azure detailed
 * scoring runs only when the premium/cap gate allows AND there is a real
 * recorded attempt. The scorer spy stands in for the Azure network call.
 */
function attemptDetailedScore(args: {
  gateAllows: boolean;
  hasRealAudio: boolean;
  azureScorer: () => void;
}) {
  if (!args.gateAllows || !args.hasRealAudio) return;
  args.azureScorer();
}

describe("Azure cost controls — hard proof", () => {
  it("1. scores ONLY a real learner attempt (empty audio never calls Azure)", async () => {
    const azure = vi.fn(async () => azureResult());

    await scoreConversationTurn({
      audioBlob: new Blob([]), // empty
      target: "I think so",
      step7Enabled: true,
      userJwt: "jwt",
      scoreImpl: azure,
    });
    expect(azure).not.toHaveBeenCalled();

    await scoreConversationTurn({
      audioBlob: realBlob(),
      target: "I think so",
      step7Enabled: true,
      userJwt: "jwt",
      scoreImpl: azure,
    });
    expect(azure).toHaveBeenCalledTimes(1);
  });

  it("2. an exhausted per-session cap does NOT call Azure", () => {
    const azure = vi.fn();
    const gate = resolveSpeakDetailGate({
      premiumGateEnabled: true,
      isPremiumOrTrial: true,
      detailUsed: SPEAK_DETAIL_SESSION_CAP, // at the cap
    });
    expect(gate.gateAllows).toBe(false);
    expect(gate.capReached).toBe(true);
    attemptDetailedScore({ gateAllows: gate.gateAllows, hasRealAudio: true, azureScorer: azure });
    expect(azure).not.toHaveBeenCalled();
  });

  it("3. a free (non-premium/trial) user does NOT call Azure detailed scoring", () => {
    const azure = vi.fn();
    const gate = resolveSpeakDetailGate({
      premiumGateEnabled: true,
      isPremiumOrTrial: false, // free
      detailUsed: 0,
    });
    expect(gate.gateAllows).toBe(false);
    expect(gate.premiumBlocked).toBe(true);
    attemptDetailedScore({ gateAllows: gate.gateAllows, hasRealAudio: true, azureScorer: azure });
    expect(azure).not.toHaveBeenCalled();
  });

  it("3b. a premium learner under the cap DOES run one Azure attempt (control)", () => {
    const azure = vi.fn();
    const gate = resolveSpeakDetailGate({
      premiumGateEnabled: true,
      isPremiumOrTrial: true,
      detailUsed: 0,
    });
    expect(gate.gateAllows).toBe(true);
    attemptDetailedScore({ gateAllows: gate.gateAllows, hasRealAudio: true, azureScorer: azure });
    expect(azure).toHaveBeenCalledTimes(1);
  });

  it("4. low-confidence / empty audio does NOT produce a fabricated score", async () => {
    // Empty audio → no number.
    const empty = await scoreConversationTurn({
      audioBlob: null,
      target: "I think so",
      step7Enabled: true,
      scoreImpl: vi.fn(async () => azureResult()),
    });
    expect(empty.overallScore).toBeNull();
    expect(empty.shouldAskRetry).toBe(true);

    // Non-Azure local fallback → low confidence, still no number.
    const local = await scoreConversationTurn({
      audioBlob: realBlob(),
      target: "I think so",
      step7Enabled: true,
      scoreImpl: vi.fn(async () => localFallback()),
    });
    expect(local.overallScore).toBeNull();
    expect(local.quality).toBe("low_confidence");
    expect(local.shouldAskRetry).toBe(true);
  });
});
