import type { SpeechComparisonResult, SpeechIntent } from "./speechTypes";

export function mapSpeechIntent(
  transcript: string,
  result: SpeechComparisonResult,
): SpeechIntent {
  if (!transcript.trim()) return "NO_SPEECH";

  if (result.matchScore >= 0.92) return "SUCCESS";
  if (result.matchScore >= 0.78) return "SUCCESS_CLOSE";
  if (result.matchScore >= 0.62) return "RETRY_WORD";
  if (result.matchScore >= 0.4) return "RETRY_PHRASE";
  return "RETRY_SLOW";
}