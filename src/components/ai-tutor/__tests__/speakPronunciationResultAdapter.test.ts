import { describe, expect, it } from "vitest";
import type { NormalizedPronunciationScoreResult } from "@/lib/pronunciation/cloudScorer";
import { adaptSpeakPronunciationResult } from "../speakPronunciationResultAdapter";

function localResult(
  overrides: Partial<NormalizedPronunciationScoreResult> = {},
): NormalizedPronunciationScoreResult {
  return {
    mode: "local_sentence_match",
    provider: "local",
    overallScore: 100,
    wordScores: [],
    messageKey: "pronunciation.score.local_sentence_match",
    labelKind: "sentence_match",
    useLocalFallback: true,
    ...overrides,
  };
}

function azureResult(
  overrides: Partial<NormalizedPronunciationScoreResult> = {},
): NormalizedPronunciationScoreResult {
  return {
    mode: "azure_phoneme_batch",
    provider: "azure",
    overallScore: 86.4,
    wordScores: [
      {
        word: "bought",
        heard: "bought",
        score: 82.2,
        status: "close",
        phonemes: [
          { phoneme: "b", score: 96 },
          { phoneme: "ɔ", score: 74.4 },
        ],
      },
    ],
    phonemeScores: [
      { word: "bought", phoneme: "b", score: 96 },
      { word: "bought", phoneme: "ɔ", score: 74.4 },
    ],
    messageKey: "pronunciation.score.azure_phoneme_batch",
    labelKind: "pronunciation_detail",
    useLocalFallback: false,
    ...overrides,
  };
}

describe("adaptSpeakPronunciationResult", () => {
  it("maps local sentence-match results to local-fallback display mode", () => {
    expect(adaptSpeakPronunciationResult(localResult())).toEqual({
      mode: "local-fallback",
      provider: "local",
      overallScore: 100,
    });
  });

  it("maps disabled/provider fallback results to local-fallback display mode", () => {
    const result = adaptSpeakPronunciationResult(
      localResult({
        overallScore: 72,
        useLocalFallback: true,
      }),
    );

    expect(result).toEqual({
      mode: "local-fallback",
      provider: "local",
      overallScore: 72,
    });
  });

  it("maps Azure batch with phoneme evidence to azure-batch display mode", () => {
    const result = adaptSpeakPronunciationResult(azureResult());

    expect(result).toMatchObject({
      mode: "azure-batch",
      provider: "azure",
      overallScore: 86.4,
    });
    expect(result?.phonemeScores).toEqual([
      { word: "bought", phoneme: "b", accuracyScore: 96 },
      { word: "bought", phoneme: "ɔ", accuracyScore: 74.4 },
    ]);
    expect(result?.words).toEqual([
      {
        word: "bought",
        accuracyScore: 82.2,
        phonemes: [
          { phoneme: "b", accuracyScore: 96 },
          { phoneme: "ɔ", accuracyScore: 74.4 },
        ],
      },
    ]);
  });

  it("maps azure_phoneme_batch to azure-batch only when real phoneme evidence exists", () => {
    const result = adaptSpeakPronunciationResult(
      azureResult({
        phonemeScores: [{ word: "hat", phoneme: "h", score: 97 }],
        wordScores: [
          {
            word: "hat",
            heard: "hat",
            score: 94,
            status: "correct",
            phonemes: [{ phoneme: "h", score: 97 }],
          },
        ],
      }),
    );

    expect(result?.mode).toBe("azure-batch");
    expect(result?.provider).toBe("azure");
    expect(result?.phonemeScores).toEqual([
      { word: "hat", phoneme: "h", accuracyScore: 97 },
    ]);
  });

  it("degrades Azure word-score-only results to local-fallback display mode", () => {
    const result = adaptSpeakPronunciationResult(
      azureResult({
        wordScores: [
          {
            word: "bought",
            heard: "bought",
            score: 78,
            status: "correct",
            phonemes: [],
          },
        ],
        phonemeScores: [],
      }),
    );

    expect(result).toEqual({
      mode: "local-fallback",
      provider: "local",
      overallScore: 86.4,
    });
    expect(result?.phonemeScores).toBeUndefined();
    expect(result?.words).toBeUndefined();
  });

  it("degrades malformed or missing phoneme detail safely", () => {
    const result = adaptSpeakPronunciationResult(
      azureResult({
        phonemeScores: [
          { word: "bought", phoneme: "", score: 90 },
          { word: "bought", phoneme: "b", score: Number.NaN },
        ],
      }),
    );

    expect(result).toEqual({
      mode: "local-fallback",
      provider: "local",
      overallScore: 86.4,
    });
  });

  it("maps score fields to accuracyScore fields", () => {
    const result = adaptSpeakPronunciationResult(
      azureResult({
        overallScore: 91.7,
        wordScores: [
          {
            word: "students",
            heard: "students",
            score: 88.5,
            status: "close",
            phonemes: [{ phoneme: "s", score: 63.25 }],
          },
        ],
        phonemeScores: [{ word: "students", phoneme: "s", score: 63.25 }],
      }),
    );

    expect(result?.overallScore).toBe(91.7);
    expect(result?.words?.[0].accuracyScore).toBe(88.5);
    expect(result?.words?.[0].phonemes?.[0].accuracyScore).toBe(63.25);
    expect(result?.phonemeScores?.[0].accuracyScore).toBe(63.25);
  });

  it("drops Azure word accuracy below the read-back confidence floor", () => {
    const result = adaptSpeakPronunciationResult(
      azureResult({
        wordScores: [
          {
            word: "bought",
            heard: "bought",
            score: 49.9,
            status: "wrong",
            phonemes: [{ phoneme: "b", score: 96 }],
          },
          {
            word: "hat",
            heard: "hat",
            score: 50,
            status: "close",
            phonemes: [{ phoneme: "h", score: 91 }],
          },
        ],
        phonemeScores: [
          { word: "bought", phoneme: "b", score: 96 },
          { word: "hat", phoneme: "h", score: 91 },
        ],
      }),
    );

    expect(result?.mode).toBe("azure-batch");
    expect(result?.words).toEqual([
      {
        word: "hat",
        accuracyScore: 50,
        phonemes: [{ phoneme: "h", accuracyScore: 91 }],
      },
    ]);
  });

  it("does not create fake phoneme scores from word scores", () => {
    const result = adaptSpeakPronunciationResult(
      azureResult({
        wordScores: [
          {
            word: "students",
            heard: "students",
            score: 88.5,
            status: "close",
            phonemes: [],
          },
        ],
        phonemeScores: undefined,
      }),
    );

    expect(result?.mode).toBe("local-fallback");
    expect(result?.phonemeScores).toBeUndefined();
    expect(result?.words).toBeUndefined();
  });

  it("does not create fake tone contour evidence from phoneme or word scores", () => {
    const result = adaptSpeakPronunciationResult(azureResult());

    expect(result?.toneContour).toBeUndefined();
  });

  it("passes match rising and falling tone contour evidence", () => {
    expect(
      adaptSpeakPronunciationResult({
        ...azureResult(),
        toneContour: {
          bucket: "match",
          score: 91,
          confidence: 0.82,
          expectedContour: "rising",
        },
      })?.toneContour,
    ).toEqual({
      bucket: "match",
      score: 91,
      confidence: 0.82,
      expectedContour: "rising",
    });

    expect(
      adaptSpeakPronunciationResult({
        ...azureResult(),
        toneContour: {
          bucket: "match",
          score: null,
          confidence: 0.76,
          expectedContour: "falling",
        },
      })?.toneContour,
    ).toEqual({
      bucket: "match",
      score: null,
      confidence: 0.76,
      expectedContour: "falling",
    });
  });

  it("passes mismatch rising and falling tone contour evidence", () => {
    expect(
      adaptSpeakPronunciationResult({
        ...azureResult(),
        toneContour: {
          bucket: "mismatch",
          score: 22,
          confidence: 0.81,
          expectedContour: "rising",
        },
      })?.toneContour,
    ).toEqual({
      bucket: "mismatch",
      score: 22,
      confidence: 0.81,
      expectedContour: "rising",
    });

    expect(
      adaptSpeakPronunciationResult({
        ...azureResult(),
        toneContour: {
          bucket: "mismatch",
          score: 31,
          confidence: 0.72,
          expectedContour: "falling",
        },
      })?.toneContour,
    ).toEqual({
      bucket: "mismatch",
      score: 31,
      confidence: 0.72,
      expectedContour: "falling",
    });
  });

  it("drops uncertain tone contour evidence", () => {
    const result = adaptSpeakPronunciationResult({
      ...azureResult(),
      toneContour: {
        bucket: "uncertain",
        score: 0,
        confidence: 0.3,
        expectedContour: "rising",
      },
    });

    expect(result?.toneContour).toBeUndefined();
  });

  it("drops flat and unknown expected tone contours", () => {
    expect(
      adaptSpeakPronunciationResult({
        ...azureResult(),
        toneContour: {
          bucket: "match",
          score: 80,
          confidence: 0.8,
          expectedContour: "flat",
        },
      })?.toneContour,
    ).toBeUndefined();

    expect(
      adaptSpeakPronunciationResult({
        ...azureResult(),
        toneContour: {
          bucket: "match",
          score: 80,
          confidence: 0.8,
          expectedContour: "unknown",
        },
      })?.toneContour,
    ).toBeUndefined();
  });

  it("drops tone contour evidence below the confidence threshold", () => {
    const result = adaptSpeakPronunciationResult({
      ...azureResult(),
      toneContour: {
        bucket: "match",
        score: 80,
        confidence: 0.64,
        expectedContour: "rising",
      },
    });

    expect(result?.toneContour).toBeUndefined();
  });

  it("ignores non-display contract fields after mapping", () => {
    const result = adaptSpeakPronunciationResult(azureResult());

    expect(result).not.toHaveProperty("heard");
    expect(result).not.toHaveProperty("status");
    expect(result).not.toHaveProperty("messageKey");
    expect(result).not.toHaveProperty("useLocalFallback");
    expect(result).not.toHaveProperty("labelKind");
  });
});
