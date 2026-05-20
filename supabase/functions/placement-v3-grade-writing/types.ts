import type {
  CEFRAssessment,
  CEFRLevel,
} from "../_shared/cefr/types.ts";

export type TargetLanguage = "en" | "vi";
export type AiTraceProvider = "openai" | "gemini";

export type GradeWritingRequest = {
  promptId: string;
  taskText: string;
  userResponse: string;
  userId?: string | null;
  targetLanguage: TargetLanguage;
};

export type ModelTrace = {
  provider: AiTraceProvider;
  model: string;
  latencyMs: number;
  tokensInput: number;
  tokensOutput: number;
};

export type GradeWritingSuccess = {
  ok: true;
  assessment: CEFRAssessment;
  modelTrace: ModelTrace;
};

export type GradeWritingError = {
  ok: false;
  error: string;
  errorCode: string;
};

export type GradeWritingResponse = GradeWritingSuccess | GradeWritingError;

export type FixturePromptMeta = {
  promptId: string;
  taskText: string;
  expectedLevel: CEFRLevel;
};

