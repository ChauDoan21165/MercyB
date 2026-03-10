import type { SpeechComparisonResult, SpeechIntent } from "./speechTypes";

function quoteWords(words: string[], limit = 2): string {
  return words.slice(0, limit).join(" ");
}

export function buildSpeechFeedback(
  intent: SpeechIntent,
  result: SpeechComparisonResult,
): string {
  switch (intent) {
    case "SUCCESS":
      return "Beautiful. You said the sentence clearly.";

    case "SUCCESS_CLOSE":
      return "Good attempt. Try once more slowly and clearly.";

    case "RETRY_WORD":
      return result.missingWords.length > 0
        ? `Good attempt. Try once more and include "${quoteWords(result.missingWords)}".`
        : "Good attempt. Try once more slowly and clearly.";

    case "RETRY_PHRASE":
      return "You're getting there. Read the full sentence once, then try again.";

    case "RETRY_SLOW":
      return "Take a calm breath and try one short part at a time.";

    case "NO_SPEECH":
      return "We could not hear the sentence clearly. Try once more, slowly and close to the microphone.";

    default:
      return "Try once more slowly.";
  }
}