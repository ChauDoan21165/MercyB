import {
  CEFR_LEVELS,
  CEFRSubskill,
  type CEFRAssessment,
  type CEFRLevel,
  type CEFRSubskillScore,
  type L1InterferenceFlag,
} from "../_shared/cefr/types.ts";
import { buildWritingGradePrompt } from "../_shared/cefr/promptBuilder.ts";
import type {
  AiTraceProvider,
  GradeWritingRequest,
  GradeWritingResponse,
  ModelTrace,
  TargetLanguage,
} from "./types.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const MAX_RESPONSE_CHARS = 6_000;
const MIN_RESPONSE_CHARS = 10;
const MAX_OUTPUT_TOKENS = 1_200;
const DEFAULT_MODEL = "gpt-4o-mini";

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

export type Deps = {
  callAi: (input: AiCallInput) => Promise<AiCallResult>;
};

type ValidationResult =
  | { ok: true; value: GradeWritingRequest }
  | { ok: false; status: number; error: string; errorCode: string };

export async function handleRequest(
  req: Request,
  deps: Deps,
): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json(errorBody("Only POST is supported.", "method_not_allowed"), 405);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json(errorBody("Invalid JSON body.", "invalid_json"), 400);
  }

  const validated = validateRequest(body);
  if (!validated.ok) {
    return json(
      errorBody(validated.error, validated.errorCode),
      validated.status,
    );
  }

  const result = await gradeWritingSample(validated.value, deps);
  if (!result.ok) {
    const status = result.errorCode === "ai_unavailable" ? 503 : 422;
    return json(result, status);
  }
  return json(result);
}

export async function gradeWritingSample(
  request: GradeWritingRequest,
  deps: Deps,
): Promise<GradeWritingResponse> {
  const prompts = buildWritingGradePrompt(request);
  const aiResult = await deps.callAi({
    ...prompts,
    maxTokens: MAX_OUTPUT_TOKENS,
    temperature: 0.1,
  });

  if (!aiResult.ok || aiResult.provider === "none") {
    return errorBody("CEFR grading is temporarily unavailable.", "ai_unavailable");
  }

  const assessmentResult = projectAssessment(aiResult.json);
  if (!assessmentResult.ok) {
    return errorBody(assessmentResult.error, "invalid_ai_response");
  }

  return {
    ok: true,
    assessment: assessmentResult.assessment,
    modelTrace: {
      provider: aiResult.provider,
      model: aiResult.model || DEFAULT_MODEL,
      latencyMs: Math.max(0, Math.round(aiResult.latencyMs)),
      tokensInput: estimateTokens(`${prompts.systemPrompt}\n${prompts.userMessage}`),
      tokensOutput: estimateTokens(aiResult.raw || JSON.stringify(aiResult.json)),
    },
  };
}

export function validateRequest(body: unknown): ValidationResult {
  if (!isRecord(body)) {
    return {
      ok: false,
      status: 400,
      error: "Request body must be a JSON object.",
      errorCode: "invalid_body",
    };
  }

  const promptId = clean(body.promptId);
  const taskText = clean(body.taskText);
  const userResponse = clean(body.userResponse);
  const targetLanguage = body.targetLanguage;
  const userId =
    typeof body.userId === "string"
      ? body.userId.trim()
      : body.userId === null
        ? null
        : undefined;

  if (!promptId) {
    return fieldError("promptId is required.", "missing_prompt_id");
  }
  if (!taskText) {
    return fieldError("taskText is required.", "missing_task_text");
  }
  if (targetLanguage !== "en" && targetLanguage !== "vi") {
    return fieldError(
      "targetLanguage must be either en or vi.",
      "invalid_target_language",
    );
  }
  if (
    userResponse.length < MIN_RESPONSE_CHARS ||
    userResponse.length > MAX_RESPONSE_CHARS
  ) {
    return {
      ok: false,
      status: 422,
      error: `userResponse must be ${MIN_RESPONSE_CHARS}-${MAX_RESPONSE_CHARS} characters.`,
      errorCode: "invalid_response_length",
    };
  }

  return {
    ok: true,
    value: {
      promptId,
      taskText,
      userResponse,
      userId,
      targetLanguage: targetLanguage as TargetLanguage,
    },
  };
}

export function projectAssessment(
  raw: Record<string, unknown>,
): { ok: true; assessment: CEFRAssessment } | { ok: false; error: string } {
  const overallRaw = isRecord(raw.overall) ? raw.overall : {};
  const overallLevel = readLevel(overallRaw.level);
  if (!overallLevel) return { ok: false, error: "Missing overall.level." };

  const subskillsRaw = isRecord(raw.subskills) ? raw.subskills : {};
  const grammar = readSubskill(subskillsRaw[CEFRSubskill.Grammar]);
  const vocabulary = readSubskill(subskillsRaw[CEFRSubskill.Vocabulary]);
  const coherence = readSubskill(subskillsRaw[CEFRSubskill.Coherence]);
  const taskAchievement = readSubskill(
    subskillsRaw[CEFRSubskill.TaskAchievement],
  );
  if (!grammar || !vocabulary || !coherence || !taskAchievement) {
    return { ok: false, error: "Missing or invalid subskill assessment." };
  }

  return {
    ok: true,
    assessment: {
      overall: {
        level: overallLevel,
        confidence: clampConfidence(overallRaw.confidence),
      },
      subskills: {
        [CEFRSubskill.Grammar]: grammar,
        [CEFRSubskill.Vocabulary]: vocabulary,
        [CEFRSubskill.Coherence]: coherence,
        [CEFRSubskill.TaskAchievement]: taskAchievement,
      },
      strengths: cleanStringArray(raw.strengths, 4),
      gaps: cleanStringArray(raw.gaps, 4),
      l1InterferenceFlags: readFlags(raw.l1InterferenceFlags),
      recommendedFocusAreas: cleanStringArray(raw.recommendedFocusAreas, 3),
    },
  };
}

export function cefrDistance(a: CEFRLevel, b: CEFRLevel): number {
  return Math.abs(CEFR_LEVELS.indexOf(a) - CEFR_LEVELS.indexOf(b));
}

export function estimateTokens(text: string): number {
  const trimmed = clean(text);
  if (!trimmed) return 0;
  return Math.max(1, Math.ceil(trimmed.length / 4));
}

function readSubskill(value: unknown): CEFRSubskillScore | null {
  if (!isRecord(value)) return null;
  const level = readLevel(value.level);
  if (!level) return null;
  return {
    level,
    confidence: clampConfidence(value.confidence),
    notes: clean(value.notes).slice(0, 500),
  };
}

function readFlags(value: unknown): L1InterferenceFlag[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 6).flatMap((item) => {
    if (!isRecord(item)) return [];
    const pattern = clean(item.pattern);
    const severity =
      item.severity === "low" || item.severity === "med" || item.severity === "high"
        ? item.severity
        : "low";
    const examples = cleanStringArray(item.examples, 4);
    if (!pattern || examples.length === 0) return [];
    return [{ pattern, severity, examples }];
  });
}

function readLevel(value: unknown): CEFRLevel | null {
  return typeof value === "string" && (CEFR_LEVELS as readonly string[]).includes(value)
    ? (value as CEFRLevel)
    : null;
}

function clampConfidence(value: unknown): number {
  const n = typeof value === "number" && Number.isFinite(value) ? value : 0.5;
  return Math.max(0, Math.min(1, Number(n.toFixed(3))));
}

function cleanStringArray(value: unknown, max: number): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => clean(item))
    .filter(Boolean)
    .slice(0, max);
}

function fieldError(error: string, errorCode: string): ValidationResult {
  return { ok: false, status: 400, error, errorCode };
}

function errorBody(error: string, errorCode: string): GradeWritingResponse {
  return { ok: false, error, errorCode };
}

function json(data: GradeWritingResponse | { ok?: true }, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
    },
  });
}

function clean(value: unknown): string {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export const PLACEMENT_V3_WRITING_LIMITS = {
  MAX_OUTPUT_TOKENS,
  MAX_RESPONSE_CHARS,
  MIN_RESPONSE_CHARS,
} as const;

export type { ModelTrace };

