import type {
  CEFRAssessment,
  CEFRLevel,
  CEFRSubskillScore,
} from "../_shared/cefr/types.ts";

export type TargetLanguage = "en" | "vi";
export type AiTraceProvider = "openai" | "gemini";

export type GradeSpeakingRequest = {
  promptId: string;
  taskText: string;
  userResponse: string;
  userId?: string | null;
  targetLanguage: TargetLanguage;
  audioStoragePath?: string | null;
  audioBase64?: string | null;
  audioContentType?: string | null;
  responseDurationMs?: number | null;
  accent?: "us" | "uk" | "au" | "ca";
};

export type ModelTrace = {
  provider: AiTraceProvider | "none";
  model: string;
  latencyMs: number;
  tokensInput: number;
  tokensOutput: number;
  fallback?: boolean;
  errorCode?: string;
};

export type GradeSpeakingSuccess = {
  ok: true;
  assessment: CEFRAssessment;
  pronunciation: PronunciationAssessment;
  modelTrace: ModelTrace;
};

export type GradeSpeakingError = {
  ok: false;
  error: string;
  errorCode: string;
  modelTrace?: ModelTrace;
};

export type GradeSpeakingResponse = GradeSpeakingSuccess | GradeSpeakingError;

export type AiCallInput = {
  systemPrompt: string;
  userMessage: string;
  maxTokens: number;
  temperature: number;
};

export type AiCallResult = {
  ok: boolean;
  json: Record<string, unknown>;
  raw: string;
  provider: AiTraceProvider | "none";
  model: string;
  latencyMs: number;
};

export type TranscriptSubskills = {
  grammar: CEFRSubskillScore;
  vocabulary: CEFRSubskillScore;
  fluency: CEFRSubskillScore;
};

export type NormalizedPhonemeScore = {
  word: string;
  phoneme: string;
  score: number;
  status: "correct" | "close" | "wrong";
};

export type NormalizedWordPronunciation = {
  word: string;
  heard: string;
  score: number;
  status: "correct" | "close" | "wrong";
  phonemes: NormalizedPhonemeScore[];
};

export type PronunciationAssessment = {
  ok: true;
  provider: "azure";
  score: number;
  level: CEFRLevel;
  confidence: number;
  wordScores: NormalizedWordPronunciation[];
  phonemeScores: NormalizedPhonemeScore[];
  flags: PronunciationFlag[];
  rawReason?: string;
} | {
  ok: false;
  provider: "azure";
  score: 0;
  level: "A1";
  confidence: 0;
  wordScores: [];
  phonemeScores: [];
  flags: PronunciationFlag[];
  rawReason: string;
};

export type PronunciationFlag = {
  pattern: string;
  severity: "low" | "med" | "high";
  examples: string[];
};

export type AzurePhonemeResponse = {
  ok?: boolean;
  score?: number | string | null;
  word_scores?: Array<{
    word?: string;
    heard?: string;
    score?: number | string | null;
    status?: string;
    phonemes?: Array<{ phoneme?: string; score?: number | string | null }>;
  }>;
  provider?: string;
  audio_seconds?: number;
  cost_usd_cents?: number;
  use_local?: boolean;
  reason?: string;
};
