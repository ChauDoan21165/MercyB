import type { NormalizedPronunciationScoreResult } from "@/lib/pronunciation/cloudScorer";
import type { SpeakPronunciationResult } from "./SpeakPracticeMode";
import { hasDisplayableReadBackWordAccuracy } from "./readBackWordScores";

type ToneContourCandidate = {
  bucket?: unknown;
  score?: unknown;
  confidence?: unknown;
  expectedContour?: unknown;
};

type NormalizedPronunciationScoreResultWithTone =
  NormalizedPronunciationScoreResult & {
    toneContour?: ToneContourCandidate;
  };

function finiteScore(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function textValue(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function toLocalFallback(
  result: NormalizedPronunciationScoreResultWithTone | null | undefined,
): SpeakPronunciationResult {
  return {
    mode: "local-fallback",
    provider: "local",
    overallScore: finiteScore(result?.overallScore),
    ...toneContourDisplay(result?.toneContour),
  };
}

function toneContourDisplay(
  toneContour: ToneContourCandidate | undefined,
): Pick<SpeakPronunciationResult, "toneContour"> {
  if (!toneContour) return {};

  const bucket = toneContour.bucket;
  const expectedContour = toneContour.expectedContour;
  const confidence = finiteScore(toneContour.confidence);

  if (bucket !== "match" && bucket !== "mismatch") return {};
  if (expectedContour !== "rising" && expectedContour !== "falling") return {};
  if (confidence === undefined || confidence < 0.65) return {};

  return {
    toneContour: {
      bucket,
      expectedContour,
      confidence,
      score: finiteScore(toneContour.score) ?? null,
    },
  };
}

export function adaptSpeakPronunciationResult(
  result: NormalizedPronunciationScoreResultWithTone | null | undefined,
): SpeakPronunciationResult | null {
  if (!result) return null;

  const flatPhonemeScores = Array.isArray(result.phonemeScores)
    ? result.phonemeScores
        .map((score) => {
          const phoneme = textValue(score.phoneme);
          const accuracyScore = finiteScore(score.score);
          if (!phoneme || accuracyScore === undefined) return null;
          return {
            phoneme,
            accuracyScore,
            word: textValue(score.word),
          };
        })
        .filter((score): score is NonNullable<typeof score> => score !== null)
    : [];

  const hasAzurePhonemeEvidence =
    result.mode === "azure_phoneme_batch" &&
    result.provider === "azure" &&
    result.labelKind === "pronunciation_detail" &&
    flatPhonemeScores.length > 0;

  if (!hasAzurePhonemeEvidence) {
    return toLocalFallback(result);
  }

  const words = Array.isArray(result.wordScores)
    ? result.wordScores
        .map((wordScore) => {
          const word = textValue(wordScore.word);
          if (!word) return null;
          const wordAccuracyScore = finiteScore(wordScore.score);
          if (!hasDisplayableReadBackWordAccuracy(wordAccuracyScore)) return null;

          const phonemes = Array.isArray(wordScore.phonemes)
            ? wordScore.phonemes
                .map((phonemeScore) => {
                  const phoneme = textValue(phonemeScore.phoneme);
                  const accuracyScore = finiteScore(phonemeScore.score);
                  if (!phoneme || accuracyScore === undefined) return null;
                  return { phoneme, accuracyScore };
                })
                .filter((score): score is NonNullable<typeof score> => score !== null)
            : undefined;

          return {
            word,
            accuracyScore: wordAccuracyScore,
            ...(phonemes && phonemes.length > 0 ? { phonemes } : {}),
          };
        })
        .filter((word): word is NonNullable<typeof word> => word !== null)
    : [];

  return {
    mode: "azure-batch",
    provider: "azure",
    overallScore: finiteScore(result.overallScore),
    phonemeScores: flatPhonemeScores,
    ...toneContourDisplay(result.toneContour),
    ...(words.length > 0 ? { words } : {}),
  };
}
