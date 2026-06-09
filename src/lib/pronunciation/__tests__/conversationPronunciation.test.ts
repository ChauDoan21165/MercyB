import { describe, it, expect, vi } from "vitest";
import { readFileSync } from "node:fs";

import {
  CONVERSATION_PHONEME_FLAG_THRESHOLD,
  scoreConversationTurn,
  type ConversationPronunciationResult,
} from "@/lib/pronunciation/conversationPronunciation";
import type { NormalizedPronunciationScoreResult } from "@/lib/pronunciation/cloudScorer";

function realBlob(): Blob {
  // > MIN_REAL_AUDIO_BYTES so it counts as a real attempt.
  return new Blob([new Uint8Array(2000)], { type: "audio/webm" });
}

function azureResult(
  overrides: Partial<NormalizedPronunciationScoreResult> = {},
): NormalizedPronunciationScoreResult {
  return {
    mode: "azure_phoneme_batch",
    provider: "azure",
    overallScore: 72,
    wordScores: [
      {
        word: "think",
        heard: "tink",
        score: 55,
        status: "close",
        phonemes: [
          { phoneme: "th", score: 40 },
          { phoneme: "ih", score: 95 },
          { phoneme: "ng", score: 92 },
          { phoneme: "k", score: 94 },
        ],
      },
    ],
    phonemeScores: [{ word: "think", phoneme: "th", score: 40 }],
    messageKey: "pronunciation.score.azure_phoneme_batch",
    labelKind: "pronunciation_detail",
    useLocalFallback: false,
    ...overrides,
  };
}

function localFallback(): NormalizedPronunciationScoreResult {
  return {
    mode: "local_sentence_match",
    provider: "local",
    overallScore: 80,
    messageKey: "pronunciation.score.local_sentence_match",
    labelKind: "sentence_match",
    useLocalFallback: true,
  };
}

describe("scoreConversationTurn — real-attempt cost discipline", () => {
  it("scores ONLY a real learner attempt (skips empty audio entirely)", async () => {
    const scoreImpl = vi.fn(async () => azureResult());

    const empty = await scoreConversationTurn({
      audioBlob: new Blob([]),
      target: "I think so",
      step7Enabled: true,
      userJwt: "jwt",
      scoreImpl,
    });
    expect(scoreImpl).not.toHaveBeenCalled();
    expect(empty.quality).toBe("no_audio");
    expect(empty.shouldAskRetry).toBe(true);
    expect(empty.overallScore).toBeNull();

    const real = await scoreConversationTurn({
      audioBlob: realBlob(),
      target: "I think so",
      step7Enabled: true,
      userJwt: "jwt",
      scoreImpl,
    });
    expect(scoreImpl).toHaveBeenCalledTimes(1);
    expect(real.quality).toBe("ok");
  });

  it("never fabricates a score for empty / failed / non-Azure audio", async () => {
    // Empty audio.
    const noAudio = await scoreConversationTurn({
      audioBlob: null,
      target: "I think so",
      step7Enabled: true,
      scoreImpl: vi.fn(async () => azureResult()),
    });
    expect(noAudio.overallScore).toBeNull();
    expect(noAudio.words).toEqual([]);

    // Scorer threw.
    const threw = await scoreConversationTurn({
      audioBlob: realBlob(),
      target: "I think so",
      step7Enabled: true,
      scoreImpl: vi.fn(async () => {
        throw new Error("network");
      }),
    });
    expect(threw.overallScore).toBeNull();
    expect(threw.shouldAskRetry).toBe(true);

    // Non-Azure local fallback → low confidence, no number.
    const local = await scoreConversationTurn({
      audioBlob: realBlob(),
      target: "I think so",
      step7Enabled: true,
      scoreImpl: vi.fn(async () => localFallback()),
    });
    expect(local.quality).toBe("low_confidence");
    expect(local.overallScore).toBeNull();
    expect(local.shouldAskRetry).toBe(true);
  });
});

describe("scoreConversationTurn — structured data for Lane A", () => {
  it("returns overall score, word scores, flagged phonemes, and a Vietnamese interference pattern", async () => {
    const result = await scoreConversationTurn({
      audioBlob: realBlob(),
      target: "I think so",
      step7Enabled: true,
      userJwt: "jwt",
      scoreImpl: vi.fn(async () => azureResult()),
    });

    expect(result.provider).toBe("azure");
    expect(result.mode).toBe("english-pronunciation-conversation");
    expect(typeof result.overallScore).toBe("number");
    expect(result.words.length).toBeGreaterThan(0);

    const allPhonemes = result.words.flatMap((w) => w.phonemes);
    const flagged = allPhonemes.filter((p) => p.flagged);
    expect(flagged.length).toBeGreaterThan(0);
    const withPattern = flagged.find((p) => p.vietnameseInterferencePattern);
    expect(withPattern).toBeTruthy();
    expect(withPattern?.learnerFacingHint).toBeTruthy();
  });

  it("flags 'th' said as /t/ with a Vietnamese-specific hint", async () => {
    const result = await scoreConversationTurn({
      audioBlob: realBlob(),
      target: "I think so",
      step7Enabled: true,
      userJwt: "jwt",
      scoreImpl: vi.fn(async () => azureResult()),
    });
    const think = result.words.find((w) => w.word === "think");
    const th = think?.phonemes.find((p) => p.phoneme === "th");
    expect(th?.flagged).toBe(true);
    expect(th?.vietnameseInterferencePattern ?? "").toMatch(/th|θ/i);
    expect(th?.learnerFacingHint ?? "").toBeTruthy();
  });

  it("flags a dropped final consonant (-s in 'books')", async () => {
    const result = await scoreConversationTurn({
      audioBlob: realBlob(),
      target: "I like books",
      step7Enabled: true,
      userJwt: "jwt",
      scoreImpl: vi.fn(async () =>
        azureResult({
          overallScore: 74,
          wordScores: [
            {
              word: "books",
              heard: "book",
              score: 60,
              status: "close",
              phonemes: [
                { phoneme: "b", score: 95 },
                { phoneme: "uh", score: 93 },
                { phoneme: "k", score: 92 },
                { phoneme: "s", score: 8 },
              ],
            },
          ],
          phonemeScores: [{ word: "books", phoneme: "s", score: 8 }],
        }),
      ),
    });
    const books = result.words.find((w) => w.word === "books");
    const s = books?.phonemes.find((p) => p.phoneme === "s");
    expect(s?.flagged).toBe(true);
    expect(s?.vietnameseInterferencePattern ?? "").toBeTruthy();
    expect(s?.learnerFacingHint ?? "").toBeTruthy();
  });

  it("flags a dropped final -ed ending ('walked')", async () => {
    const result = await scoreConversationTurn({
      audioBlob: realBlob(),
      target: "I walked home",
      step7Enabled: true,
      userJwt: "jwt",
      scoreImpl: vi.fn(async () =>
        azureResult({
          overallScore: 76,
          wordScores: [
            {
              word: "walked",
              heard: "walk",
              score: 62,
              status: "close",
              phonemes: [
                { phoneme: "w", score: 95 },
                { phoneme: "ao", score: 93 },
                { phoneme: "k", score: 90 },
                { phoneme: "ed", score: 5 },
              ],
            },
          ],
          phonemeScores: [{ word: "walked", phoneme: "ed", score: 5 }],
        }),
      ),
    });
    const walked = result.words.find((w) => w.word === "walked");
    const ed = walked?.phonemes.find((p) => p.phoneme === "ed");
    expect(ed?.flagged).toBe(true);
    expect(ed?.vietnameseInterferencePattern ?? "").toBeTruthy();
    expect(ed?.learnerFacingHint ?? "").toBeTruthy();
  });

  it("echoes cost/cap metadata when the caller provides it", async () => {
    const result = await scoreConversationTurn({
      audioBlob: realBlob(),
      target: "I think so",
      step7Enabled: true,
      userJwt: "jwt",
      costCap: { remaining: 4, limit: 12 },
      scoreImpl: vi.fn(async () => azureResult()),
    });
    expect(result.costCap).toEqual({ remaining: 4, limit: 12 });
  });

  it("is consumable as the stable Lane A integration contract", async () => {
    const result: ConversationPronunciationResult = await scoreConversationTurn({
      audioBlob: realBlob(),
      target: "I think so",
      step7Enabled: true,
      userJwt: "jwt",
      scoreImpl: vi.fn(async () => azureResult()),
    });
    // The exact keys Lane A branches on.
    expect(result).toMatchObject({
      provider: "azure",
      mode: "english-pronunciation-conversation",
      quality: "ok",
      shouldAskRetry: false,
    });
    expect(Array.isArray(result.words)).toBe(true);
  });
});

describe("scoreConversationTurn — isolation from tone scoring", () => {
  it("defines its own flag threshold (not a tone threshold)", () => {
    expect(typeof CONVERSATION_PHONEME_FLAG_THRESHOLD).toBe("number");
  });

  it("does NOT import or reuse any tone scorer / tone threshold logic", () => {
    const src = readFileSync(
      "src/lib/pronunciation/conversationPronunciation.ts",
      "utf8",
    );
    expect(src).not.toMatch(/scoreTone|vietnameseToneScorer|toneContourScorer/);
    expect(src).not.toMatch(/TONE_[A-Z_]*THRESHOLD/);
  });
});
