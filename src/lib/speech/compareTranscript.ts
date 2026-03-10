import { normalizeText, tokenize } from "./normalizeText";
import type { SpeechComparisonResult } from "./speechTypes";

function countWords(words: string[]): Map<string, number> {
  const map = new Map<string, number>();

  for (const word of words) {
    map.set(word, (map.get(word) ?? 0) + 1);
  }

  return map;
}

function expandWordDiff(
  targetCounts: Map<string, number>,
  transcriptCounts: Map<string, number>,
  mode: "missing" | "extra",
): string[] {
  const result: string[] = [];
  const source = mode === "missing" ? targetCounts : transcriptCounts;
  const other = mode === "missing" ? transcriptCounts : targetCounts;

  for (const [word, count] of source.entries()) {
    const otherCount = other.get(word) ?? 0;
    const diff = count - otherCount;

    if (diff > 0) {
      for (let i = 0; i < diff; i += 1) {
        result.push(word);
      }
    }
  }

  return result;
}

export function compareTranscript(
  targetText: string,
  transcript: string,
): SpeechComparisonResult {
  const normalizedTarget = normalizeText(targetText);
  const normalizedTranscript = normalizeText(transcript);

  const targetWords = tokenize(targetText);
  const transcriptWords = tokenize(transcript);

  const targetCounts = countWords(targetWords);
  const transcriptCounts = countWords(transcriptWords);

  const missingWords = expandWordDiff(targetCounts, transcriptCounts, "missing");
  const extraWords = expandWordDiff(targetCounts, transcriptCounts, "extra");

  const totalTargetWords = targetWords.length;
  const penalty = missingWords.length + extraWords.length;

  const matchScore =
    totalTargetWords === 0
      ? 0
      : Math.max(0, (totalTargetWords - penalty) / totalTargetWords);

  return {
    normalizedTarget,
    normalizedTranscript,
    matchScore: Number(matchScore.toFixed(2)),
    missingWords,
    extraWords,
  };
}