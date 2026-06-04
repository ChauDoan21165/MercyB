import { describe, expect, it } from "vitest";

import {
  buildEnglishPronunciationFeedbackDisplay,
  type EnglishPronunciationScoreResult,
} from "../englishPronunciationFeedback";

function result(overrides: Partial<EnglishPronunciationScoreResult>): EnglishPronunciationScoreResult {
  return {
    mode: "azure-batch",
    provider: "azure",
    overallScore: 82,
    words: [],
    phonemeScores: [],
    ...overrides,
  };
}

describe("buildEnglishPronunciationFeedbackDisplay", () => {
  it("flags final stop deletion with a specific final /t,d/ category", () => {
    const feedback = buildEnglishPronunciationFeedbackDisplay({
      targetSentence: "I bought a hat yesterday.",
      result: result({
        overallScore: 78,
        words: [
          { word: "I", accuracyScore: 96, phonemes: [{ phoneme: "ay", accuracyScore: 95 }] },
          {
            word: "bought",
            accuracyScore: 62,
            phonemes: [
              { phoneme: "b", accuracyScore: 92 },
              { phoneme: "ɔ", accuracyScore: 90 },
              { phoneme: "t", accuracyScore: 54 },
            ],
          },
        ],
      }),
    });

    expect(feedback?.items[0].category).toBe("final_t_d_deletion");
    expect(feedback?.items[0].status).toBe("try_again");
  });

  it("flags final /t/ and /d/ deletion when Azure has explicit final-stop evidence", () => {
    const feedback = buildEnglishPronunciationFeedbackDisplay({
      targetSentence: "I want that red hat.",
      result: result({
        overallScore: 78,
        words: [
          {
            word: "hat",
            accuracyScore: 67,
            phonemes: [
              { phoneme: "h", accuracyScore: 91 },
              { phoneme: "ae", accuracyScore: 90 },
              { phoneme: "t", accuracyScore: 52 },
            ],
          },
        ],
      }),
    });

    expect(feedback?.items[0]).toMatchObject({
      category: "final_t_d_deletion",
      status: "try_again",
      targetWord: "hat",
    });
  });

  it("flags final /k/ deletion when Azure has explicit final-k evidence", () => {
    const feedback = buildEnglishPronunciationFeedbackDisplay({
      targetSentence: "Read this book.",
      result: result({
        overallScore: 82,
        words: [
          {
            word: "book",
            accuracyScore: 69,
            phonemes: [
              { phoneme: "b", accuracyScore: 93 },
              { phoneme: "ʊ", accuracyScore: 91 },
              { phoneme: "k", accuracyScore: 50 },
            ],
          },
        ],
      }),
    });

    expect(feedback?.items[0]).toMatchObject({
      category: "final_k_deletion",
      status: "try_again",
      targetWord: "book",
    });
  });

  it("flags consonant clusters", () => {
    const feedback = buildEnglishPronunciationFeedbackDisplay({
      targetSentence: "Please stretch the street sign.",
      result: result({
        overallScore: 74,
        words: [
          { word: "Please", accuracyScore: 95, phonemes: [{ phoneme: "p", accuracyScore: 94 }, { phoneme: "l", accuracyScore: 92 }] },
          {
            word: "stretch",
            accuracyScore: 61,
            phonemes: [
              { phoneme: "s", accuracyScore: 52 },
              { phoneme: "t", accuracyScore: 51 },
              { phoneme: "r", accuracyScore: 88 },
              { phoneme: "e", accuracyScore: 80 },
              { phoneme: "ch", accuracyScore: 83 },
            ],
          },
        ],
      }),
    });

    expect(feedback?.items[0].category).toBe("consonant_cluster");
  });

  it("flags expanded initial cluster simplification targets", () => {
    const feedback = buildEnglishPronunciationFeedbackDisplay({
      targetSentence: "The square is small.",
      result: result({
        overallScore: 76,
        words: [
          {
            word: "square",
            accuracyScore: 66,
            phonemes: [
              { phoneme: "s", accuracyScore: 55 },
              { phoneme: "k", accuracyScore: 54 },
              { phoneme: "w", accuracyScore: 88 },
              { phoneme: "eh", accuracyScore: 86 },
              { phoneme: "r", accuracyScore: 87 },
            ],
          },
        ],
      }),
    });

    expect(feedback?.items[0]).toMatchObject({
      category: "consonant_cluster",
      status: "try_again",
      targetWord: "square",
    });
  });

  it("flags the TH sound", () => {
    const feedback = buildEnglishPronunciationFeedbackDisplay({
      targetSentence: "Think about the other thing.",
      result: result({
        overallScore: 79,
        words: [
          {
            word: "Think",
            accuracyScore: 58,
            phonemes: [
              { phoneme: "th", accuracyScore: 49 },
              { phoneme: "ih", accuracyScore: 90 },
              { phoneme: "ng", accuracyScore: 91 },
              { phoneme: "k", accuracyScore: 94 },
            ],
          },
        ],
      }),
    });

    expect(feedback?.items[0].category).toBe("theta_sound");
    expect(feedback?.items[0].status).toBe("try_again");
  });

  it("flags SH versus S confusion only with explicit SH phoneme evidence", () => {
    const feedback = buildEnglishPronunciationFeedbackDisplay({
      targetSentence: "She bought a shirt.",
      result: result({
        overallScore: 80,
        words: [
          {
            word: "shirt",
            accuracyScore: 70,
            phonemes: [
              { phoneme: "sh", accuracyScore: 51 },
              { phoneme: "er", accuracyScore: 91 },
              { phoneme: "t", accuracyScore: 89 },
            ],
          },
        ],
      }),
    });

    expect(feedback?.items[0]).toMatchObject({
      category: "sh_s_contrast",
      status: "try_again",
      targetWord: "shirt",
    });
  });

  it("flags V versus W confusion only with explicit target phoneme evidence", () => {
    const feedback = buildEnglishPronunciationFeedbackDisplay({
      targetSentence: "Visit my village.",
      result: result({
        overallScore: 83,
        words: [
          {
            word: "Visit",
            accuracyScore: 71,
            phonemes: [
              { phoneme: "v", accuracyScore: 49 },
              { phoneme: "ih", accuracyScore: 92 },
              { phoneme: "z", accuracyScore: 90 },
              { phoneme: "ih", accuracyScore: 91 },
              { phoneme: "t", accuracyScore: 88 },
            ],
          },
        ],
      }),
    });

    expect(feedback?.items[0]).toMatchObject({
      category: "v_w_contrast",
      status: "try_again",
      targetWord: "visit",
    });
  });

  it("abstains for SH and V/W patterns when Azure phoneme evidence is missing", () => {
    expect(
      buildEnglishPronunciationFeedbackDisplay({
        targetSentence: "She bought a shirt.",
        result: result({
          overallScore: 86,
          words: [
            {
              word: "shirt",
              accuracyScore: 72,
              phonemes: [
                { phoneme: "er", accuracyScore: 91 },
                { phoneme: "t", accuracyScore: 88 },
              ],
            },
          ],
        }),
      }),
    ).toBeNull();

    expect(
      buildEnglishPronunciationFeedbackDisplay({
        targetSentence: "Visit my village.",
        result: result({
          overallScore: 86,
          words: [
            {
              word: "Visit",
              accuracyScore: 72,
              phonemes: [
                { phoneme: "ih", accuracyScore: 92 },
                { phoneme: "z", accuracyScore: 90 },
                { phoneme: "ih", accuracyScore: 91 },
                { phoneme: "t", accuracyScore: 88 },
              ],
            },
          ],
        }),
      }),
    ).toBeNull();
  });

  it("flags final -s endings", () => {
    const feedback = buildEnglishPronunciationFeedbackDisplay({
      targetSentence: "I bought two books.",
      result: result({
        overallScore: 81,
        words: [
          {
            word: "books",
            accuracyScore: 64,
            phonemes: [
              { phoneme: "b", accuracyScore: 94 },
              { phoneme: "ʊ", accuracyScore: 89 },
              { phoneme: "k", accuracyScore: 92 },
              { phoneme: "s", accuracyScore: 57 },
            ],
          },
        ],
      }),
    });

    expect(feedback?.items[0].category).toBe("ending_s");
  });

  it("shows correct feedback when the matched sound is clear", () => {
    const feedback = buildEnglishPronunciationFeedbackDisplay({
      targetSentence: "I bought two books.",
      result: result({
        overallScore: 95,
        words: [
          {
            word: "books",
            accuracyScore: 96,
            phonemes: [
              { phoneme: "b", accuracyScore: 95 },
              { phoneme: "ʊ", accuracyScore: 94 },
              { phoneme: "k", accuracyScore: 96 },
              { phoneme: "s", accuracyScore: 95 },
            ],
          },
        ],
      }),
    });

    expect(feedback?.items[0].category).toBe("ending_s");
    expect(feedback?.items[0].status).toBe("correct");
  });

  it("flags final -ed endings", () => {
    const feedback = buildEnglishPronunciationFeedbackDisplay({
      targetSentence: "I worked late.",
      result: result({
        overallScore: 80,
        words: [
          {
            word: "worked",
            accuracyScore: 66,
            phonemes: [
              { phoneme: "w", accuracyScore: 91 },
              { phoneme: "er", accuracyScore: 90 },
              { phoneme: "k", accuracyScore: 93 },
              { phoneme: "t", accuracyScore: 56 },
            ],
          },
        ],
      }),
    });

    expect(feedback?.items[0].category).toBe("ending_ed");
  });

  it("flags curated word-stress targets", () => {
    const feedback = buildEnglishPronunciationFeedbackDisplay({
      targetSentence: "a greenhouse",
      result: result({
        overallScore: 76,
        words: [
          {
            word: "a",
            accuracyScore: 95,
            phonemes: [{ phoneme: "a", accuracyScore: 94 }],
          },
          {
            word: "greenhouse",
            accuracyScore: 78,
            phonemes: [
              { phoneme: "g", accuracyScore: 94 },
              { phoneme: "r", accuracyScore: 93 },
              { phoneme: "iy", accuracyScore: 90 },
              { phoneme: "n", accuracyScore: 91 },
              { phoneme: "h", accuracyScore: 92 },
              { phoneme: "aw", accuracyScore: 91 },
              { phoneme: "s", accuracyScore: 89 },
            ],
          },
        ],
      }),
    });

    expect(feedback?.items[0].category).toBe("word_stress");
  });

  it("abstains when the evidence is local fallback or too weak", () => {
    expect(
      buildEnglishPronunciationFeedbackDisplay({
        targetSentence: "I bought a hat yesterday.",
        result: {
          mode: "local-fallback",
          provider: "local",
          overallScore: 100,
          words: [],
        },
      }),
    ).toBeNull();

    expect(
      buildEnglishPronunciationFeedbackDisplay({
        targetSentence: "I bought a hat yesterday.",
        result: result({
          overallScore: 58,
          words: [
            {
              word: "bought",
              accuracyScore: 58,
              phonemes: [
                { phoneme: "b", accuracyScore: 61 },
                { phoneme: "ɔ", accuracyScore: 58 },
                { phoneme: "t", accuracyScore: 60 },
              ],
            },
          ],
        }),
      }),
    ).toBeNull();
  });
});
