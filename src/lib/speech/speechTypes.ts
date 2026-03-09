export type SpeechAnalysisResponse = {
  transcript: string;
  normalizedTranscript: string;
  normalizedTarget: string;
  matchScore: number;
  missingWords: string[];
  extraWords: string[];
  message: string;
};

export type SpeechAnalyzeRequestMeta = {
  roomId: string;
  lineId: string;
  targetText: string;
};