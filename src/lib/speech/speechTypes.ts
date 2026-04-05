// PATH: src/lib/speech/speechTypes.ts

export type SpeechIntent =
  | "SUCCESS"
  | "SUCCESS_CLOSE"
  | "RETRY_WORD"
  | "RETRY_PHRASE"
  | "RETRY_SLOW"
  | "NO_SPEECH";

export type SpeechComparisonResult = {
  transcript: string;
  normalizedTranscript: string;
  normalizedTarget: string;
  matchScore: number;
  missingWords: string[];
  extraWords: string[];
  intent: SpeechIntent;
  message: string;
};

export type SpeechAnalysisResponse = SpeechComparisonResult;