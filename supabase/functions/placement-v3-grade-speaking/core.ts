import {
  CEFR_LEVELS,
  CEFRSubskill,
  type CEFRAssessment,
  type CEFRLevel,
  type CEFRSubskillScore,
  type L1InterferenceFlag,
} from "../_shared/cefr/types.ts";
import {
  type AiCallInput,
  type AiCallResult,
  type GradeSpeakingRequest,
  type GradeSpeakingResponse,
  type ModelTrace,
  type PronunciationAssessment,
  type TranscriptSubskills,
} from "./types.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const MAX_RESPONSE_CHARS = 6_000;
const MIN_RESPONSE_CHARS = 1;
const MAX_OUTPUT_TOKENS = 1_000;
const DEFAULT_MODEL = "gpt-4o-mini";
const TRANSCRIPT_WEIGHT = 0.7;
const PRONUNCIATION_WEIGHT = 0.3;
const MIN_USABLE_PRONUNCIATION_CONFIDENCE = 0.35;

export type Deps = {
  callAi: (input: AiCallInput) => Promise<AiCallResult>;
  scorePronunciation: (
    request: GradeSpeakingRequest,
  ) => Promise<PronunciationAssessment>;
};

type ValidationResult =
  | { ok: true; value: GradeSpeakingRequest }
  | { ok: false; status: number; error: string; errorCode: string };

type TranscriptAssessment = {
  level: CEFRLevel;
  confidence: number;
  subskills: TranscriptSubskills;
  strengths: string[];
  gaps: string[];
  l1InterferenceFlags: L1InterferenceFlag[];
  recommendedFocusAreas: string[];
};

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
    return json(errorBody(validated.error, validated.errorCode), validated.status);
  }

  const result = await gradeSpeakingSample(validated.value, deps);
  if (!result.ok) {
    const status = result.errorCode === "ai_unavailable" ? 503 : 422;
    return json(result, status);
  }
  return json(result);
}

export async function gradeSpeakingSample(
  request: GradeSpeakingRequest,
  deps: Deps,
): Promise<GradeSpeakingResponse> {
  const prompts = buildSpeakingGradePrompt(request);
  const [aiResult, pronunciation] = await Promise.all([
    deps.callAi({
      ...prompts,
      maxTokens: MAX_OUTPUT_TOKENS,
      temperature: 0.1,
    }),
    deps.scorePronunciation(request),
  ]);

  if (!aiResult.ok || aiResult.provider === "none") {
    return errorBody(
      "CEFR speaking grading is temporarily unavailable.",
      "ai_unavailable",
      buildModelTrace(aiResult, prompts, "ai_unavailable"),
    );
  }

  const transcriptResult = projectTranscriptAssessment(aiResult.json);
  if (!transcriptResult.ok) {
    return errorBody(
      transcriptResult.error,
      "invalid_ai_response",
      buildModelTrace(aiResult, prompts, "invalid_ai_response"),
    );
  }

  const assessment = combineAssessment(transcriptResult.assessment, pronunciation);
  return {
    ok: true,
    assessment,
    pronunciation,
    modelTrace: buildModelTrace(aiResult, prompts),
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
  const audioStoragePath = typeof body.audioStoragePath === "string" ? body.audioStoragePath.trim() : null;
  const audioBase64 = typeof body.audioBase64 === "string" ? body.audioBase64.trim() : null;
  const audioContentType = typeof body.audioContentType === "string" ? body.audioContentType.trim() : null;
  const responseDurationMs = typeof body.responseDurationMs === "number" && Number.isFinite(body.responseDurationMs)
    ? Math.max(0, Math.round(body.responseDurationMs))
    : null;
  const userId =
    typeof body.userId === "string"
      ? body.userId.trim()
      : body.userId === null
        ? null
        : undefined;
  const accent = ["us", "uk", "au", "ca"].includes(String(body.accent))
    ? body.accent as GradeSpeakingRequest["accent"]
    : "us";

  if (!promptId) return fieldError("promptId is required.", "missing_prompt_id");
  if (!taskText) return fieldError("taskText is required.", "missing_task_text");
  if (targetLanguage !== "en" && targetLanguage !== "vi") {
    return fieldError("targetLanguage must be either en or vi.", "invalid_target_language");
  }
  if (userResponse.length < MIN_RESPONSE_CHARS || userResponse.length > MAX_RESPONSE_CHARS) {
    return {
      ok: false,
      status: 422,
      error: `userResponse must be ${MIN_RESPONSE_CHARS}-${MAX_RESPONSE_CHARS} characters.`,
      errorCode: "invalid_response_length",
    };
  }
  if (!audioStoragePath && !audioBase64) {
    return fieldError("audioStoragePath or audioBase64 is required.", "missing_audio");
  }

  return {
    ok: true,
    value: {
      promptId,
      taskText,
      userResponse,
      userId,
      targetLanguage: targetLanguage as GradeSpeakingRequest["targetLanguage"],
      audioStoragePath,
      audioBase64,
      audioContentType,
      responseDurationMs,
      accent,
    },
  };
}

export function buildSpeakingGradePrompt(request: GradeSpeakingRequest) {
  return {
    systemPrompt: [
      "You are MercyBlade's Placement V3 speaking transcript CEFR grader.",
      "Grade only transcript language control: grammar, vocabulary, and fluency.",
      "Do not grade pronunciation; Azure phoneme scoring supplies pronunciation.",
      "Return strict JSON with overall.level, overall.confidence, subskills.grammar, subskills.vocabulary, subskills.fluency, strengths, gaps, l1InterferenceFlags, recommendedFocusAreas.",
    ].join("\n"),
    userMessage: JSON.stringify({
      promptId: request.promptId,
      taskText: request.taskText,
      transcript: request.userResponse,
      targetLanguage: request.targetLanguage,
    }),
  };
}

export function projectTranscriptAssessment(
  raw: Record<string, unknown>,
): { ok: true; assessment: TranscriptAssessment } | { ok: false; error: string } {
  const overallRaw = isRecord(raw.overall) ? raw.overall : {};
  const level = readLevel(overallRaw.level);
  if (!level) return { ok: false, error: "Missing overall.level." };
  const subskillsRaw = isRecord(raw.subskills) ? raw.subskills : {};
  const grammar = readSubskill(subskillsRaw.grammar);
  const vocabulary = readSubskill(subskillsRaw.vocabulary);
  const fluency = readSubskill(subskillsRaw.fluency);
  if (!grammar || !vocabulary || !fluency) {
    return { ok: false, error: "Missing grammar, vocabulary, or fluency subskill." };
  }
  return {
    ok: true,
    assessment: {
      level,
      confidence: clampConfidence(overallRaw.confidence),
      subskills: { grammar, vocabulary, fluency },
      strengths: cleanStringArray(raw.strengths, 4),
      gaps: cleanStringArray(raw.gaps, 4),
      l1InterferenceFlags: readFlags(raw.l1InterferenceFlags),
      recommendedFocusAreas: cleanStringArray(raw.recommendedFocusAreas, 3),
    },
  };
}

export function combineAssessment(
  transcript: TranscriptAssessment,
  pronunciation: PronunciationAssessment,
): CEFRAssessment {
  const pronunciationUsable =
    pronunciation.ok && pronunciation.confidence >= MIN_USABLE_PRONUNCIATION_CONFIDENCE;
  const overallLevel = pronunciationUsable
    ? weightedSpeakingLevel(transcript.level, pronunciation.level, pronunciation.confidence)
    : transcript.level;
  const pronunciationSubskill: CEFRSubskillScore = {
    level: pronunciation.level,
    confidence: pronunciation.confidence,
    notes: pronunciationNotes(pronunciation, pronunciationUsable),
  };
  const subskills = {
    [CEFRSubskill.Grammar]: transcript.subskills.grammar,
    [CEFRSubskill.Vocabulary]: transcript.subskills.vocabulary,
    [CEFRSubskill.Coherence]: transcript.subskills.fluency,
    [CEFRSubskill.TaskAchievement]: transcript.subskills.fluency,
    fluency: transcript.subskills.fluency,
    pronunciation: pronunciationSubskill,
  } as unknown as CEFRAssessment["subskills"];

  const flags = mergeFlags(transcript.l1InterferenceFlags, pronunciation.flags);
  return {
    overall: {
      level: overallLevel,
      confidence: speakingConfidence(transcript, pronunciation, pronunciationUsable),
    },
    subskills,
    strengths: [
      ...transcript.strengths,
      ...(pronunciation.ok && pronunciation.score >= 85
        ? ["Pronunciation is supported by high Azure phoneme accuracy."]
        : []),
    ].slice(0, 5),
    gaps: [
      ...transcript.gaps,
      ...(pronunciation.ok && pronunciation.score < 70
        ? ["Pronunciation accuracy lowers the speaking placement estimate."]
        : []),
      ...(!pronunciation.ok ? ["Pronunciation evidence is unavailable; retry audio scoring."] : []),
      ...(pronunciation.ok && !pronunciationUsable
        ? ["Pronunciation evidence was low confidence; retry audio scoring for a firmer estimate."]
        : []),
    ].slice(0, 5),
    l1InterferenceFlags: flags,
    recommendedFocusAreas: [
      ...transcript.recommendedFocusAreas,
      ...(pronunciation.flags.length > 0 ? ["vn_l1_pronunciation_patterns"] : []),
    ].slice(0, 4),
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

function weightedSpeakingLevel(
  transcriptLevel: CEFRLevel,
  pronunciationLevel: CEFRLevel,
  pronunciationConfidence: number,
): CEFRLevel {
  const transcriptIndex = levelIndex(transcriptLevel);
  const pronunciationIndex = levelIndex(pronunciationLevel);
  // Transcript grammar/vocabulary/fluency carries most CEFR signal; Azure
  // pronunciation is a bounded 30% modifier so weak phoneme evidence informs
  // learner feedback without overpowering the language-control grade.
  const weighted = Math.round(
    transcriptIndex * TRANSCRIPT_WEIGHT + pronunciationIndex * PRONUNCIATION_WEIGHT,
  );
  const bounded = pronunciationConfidence >= 0.6 && pronunciationIndex <= transcriptIndex - 2
    ? Math.min(weighted, transcriptIndex - 1)
    : weighted;
  return CEFR_LEVELS[Math.max(0, Math.min(CEFR_LEVELS.length - 1, bounded))];
}

function speakingConfidence(
  transcript: TranscriptAssessment,
  pronunciation: PronunciationAssessment,
  pronunciationUsable: boolean,
): number {
  if (!pronunciation.ok) {
    return clampConfidence(transcript.confidence * 0.85);
  }
  if (!pronunciationUsable) {
    return clampConfidence(transcript.confidence * 0.9);
  }
  const disagreementPenalty =
    cefrDistance(transcript.level, pronunciation.level) >= 2 ? 0.08 : 0;
  return clampConfidence(
    transcript.confidence * TRANSCRIPT_WEIGHT +
      pronunciation.confidence * PRONUNCIATION_WEIGHT -
      disagreementPenalty,
  );
}

function pronunciationNotes(
  pronunciation: PronunciationAssessment,
  pronunciationUsable: boolean,
): string {
  if (!pronunciation.ok) {
    return `Azure phoneme scoring unavailable: ${pronunciation.rawReason}`;
  }
  const evidence =
    `Azure per-phoneme pronunciation accuracy ${pronunciation.score}/100 across ${pronunciation.phonemeScores.length} phonemes.`;
  return pronunciationUsable
    ? evidence
    : `${evidence} Evidence confidence is low, so pronunciation did not lower the overall CEFR level.`;
}

function levelIndex(level: CEFRLevel): number {
  const index = CEFR_LEVELS.indexOf(level);
  return index >= 0 ? index : 0;
}

function mergeFlags(
  transcriptFlags: L1InterferenceFlag[],
  pronunciationFlags: L1InterferenceFlag[],
): L1InterferenceFlag[] {
  const byPattern = new Map<string, L1InterferenceFlag>();
  for (const flag of [...transcriptFlags, ...pronunciationFlags]) {
    const previous = byPattern.get(flag.pattern);
    byPattern.set(flag.pattern, {
      pattern: flag.pattern,
      severity: maxSeverity(previous?.severity, flag.severity),
      examples: [...new Set([...(previous?.examples ?? []), ...flag.examples])].slice(0, 4),
    });
  }
  return [...byPattern.values()].slice(0, 8);
}

function maxSeverity(a: L1InterferenceFlag["severity"] | undefined, b: L1InterferenceFlag["severity"]) {
  const order = { low: 0, med: 1, high: 2 };
  return !a || order[b] > order[a] ? b : a;
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
  return Math.max(0, Math.min(1, Number(n.toFixed(2))));
}

function cleanStringArray(value: unknown, max: number): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(clean).filter(Boolean).slice(0, max);
}

function fieldError(error: string, errorCode: string): ValidationResult {
  return { ok: false, status: 400, error, errorCode };
}

function buildModelTrace(
  aiResult: AiCallResult,
  prompts: { systemPrompt: string; userMessage: string },
  errorCode?: string,
): ModelTrace {
  return {
    provider: aiResult.provider,
    model: clean(aiResult.model) || DEFAULT_MODEL,
    latencyMs: Math.max(0, Math.round(aiResult.latencyMs)),
    tokensInput: estimateTokens(`${prompts.systemPrompt}\n${prompts.userMessage}`),
    tokensOutput: estimateTokens(aiResult.raw || JSON.stringify(aiResult.json)),
    ...(errorCode ? { fallback: true, errorCode } : {}),
  };
}

function errorBody(
  error: string,
  errorCode: string,
  modelTrace?: ModelTrace,
): GradeSpeakingResponse {
  return {
    ok: false,
    error,
    errorCode,
    ...(modelTrace ? { modelTrace } : {}),
  };
}

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
