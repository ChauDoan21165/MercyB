// supabase/functions/writing-feedback/core.ts
//
// Deno-free core for the writing-feedback edge function. Vitest can
// import this directly under Node and exercise the request handler
// with fake deps. The Deno entry point in `index.ts` wires the real
// `chatJsonWithFailover` + Supabase admin client.
//
// Contract:
//   POST /functions/v1/writing-feedback
//   Authorization: Bearer <user-jwt>
//   Body: { prompt_id, submission_text, time_spent_seconds }
//
//   200 → { score, summary_vi, summary_en, corrections, vocabulary,
//           grammar, cultural_notes_vi, cultural_notes_en }
//   400 → { error, message, message_vi }
//   401 → { error: "auth_required" }
//   429 → rate-limit body
//
// Cost cap: max 1000 output tokens per call (enforced by Deps.callAi).

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const MAX_OUTPUT_TOKENS = 1000;
const MAX_SUBMISSION_LEN = 8_000;
const MIN_SUBMISSION_LEN = 20;
const RATE_LIMIT_MAX_CALLS = 20;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

// ── Types ─────────────────────────────────────────────────────────────

export interface PromptContext {
  id: string;
  title_en: string;
  scenario_en: string;
  target_words_min: number;
  target_words_max: number;
}

export interface AiCallInput {
  systemPrompt: string;
  userMessage: string;
  maxTokens: number;
}

export interface AiCallResult {
  ok: boolean;
  json: Record<string, unknown>;
  raw: string;
}

export interface Deps {
  /** Resolves the JWT and returns the user, or null on failure. */
  getUserFromAuthHeader: (req: Request) => Promise<{ id: string } | null>;
  /** Throws an Error with message "RATE_LIMIT_EXCEEDED" when the bucket is full. */
  rateLimit: (key: string, max: number, windowMs: number) => Promise<void>;
  /** Look up the prompt — production reads from the static dataset. */
  getPromptById: (promptId: string) => PromptContext | null;
  /** Wraps chatJsonWithFailover. Receives a token cap and the rendered prompt. */
  callAi: (input: AiCallInput) => Promise<AiCallResult>;
  /** Audit hook — best-effort log of the call. Never throws. */
  logCall: (params: {
    userId: string;
    promptId: string;
    submissionLen: number;
    timeSpentSeconds: number;
    score: number | null;
    status: "ok" | "ai_error" | "validation_error" | "rate_limited";
  }) => Promise<void>;
}

// ── Public entry ──────────────────────────────────────────────────────

export async function handleRequest(
  req: Request,
  deps: Deps,
): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  // 1. Auth.
  const user = await deps.getUserFromAuthHeader(req);
  if (!user) {
    return json(
      {
        error: "auth_required",
        message: "Sign in to get writing feedback.",
        message_vi: "Vui lòng đăng nhập để nhận phản hồi.",
      },
      401,
    );
  }
  const userId = user.id;

  // 2. Per-user rate limit. The AI cost is real money; cap aggressively.
  try {
    await deps.rateLimit(
      `writing-feedback:${userId}`,
      RATE_LIMIT_MAX_CALLS,
      RATE_LIMIT_WINDOW_MS,
    );
  } catch (err) {
    if (err instanceof Error && err.message === "RATE_LIMIT_EXCEEDED") {
      await safeLog(deps, {
        userId,
        promptId: "",
        submissionLen: 0,
        timeSpentSeconds: 0,
        score: null,
        status: "rate_limited",
      });
      return json(
        {
          error: "rate_limit_exceeded",
          message: "Too many feedback requests in the last hour.",
          message_vi: "Bạn đã yêu cầu phản hồi quá nhiều lần trong một giờ qua.",
          retry_after_seconds: 3600,
        },
        429,
      );
    }
    console.error("[writing-feedback] rateLimit error", err);
  }

  // 3. Parse + validate body.
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const promptId = typeof body.prompt_id === "string" ? body.prompt_id : "";
  const submissionText =
    typeof body.submission_text === "string" ? body.submission_text : "";
  const timeSpentSeconds =
    typeof body.time_spent_seconds === "number" ? body.time_spent_seconds : 0;

  if (!promptId) {
    await safeLog(deps, {
      userId,
      promptId: "",
      submissionLen: submissionText.length,
      timeSpentSeconds,
      score: null,
      status: "validation_error",
    });
    return json(
      {
        error: "missing_prompt_id",
        message: "prompt_id is required.",
        message_vi: "Thiếu mã đề bài.",
      },
      400,
    );
  }

  if (
    submissionText.length < MIN_SUBMISSION_LEN ||
    submissionText.length > MAX_SUBMISSION_LEN
  ) {
    await safeLog(deps, {
      userId,
      promptId,
      submissionLen: submissionText.length,
      timeSpentSeconds,
      score: null,
      status: "validation_error",
    });
    return json(
      {
        error: "invalid_submission_length",
        message: `Submission must be ${MIN_SUBMISSION_LEN}–${MAX_SUBMISSION_LEN} characters.`,
        message_vi: `Bài viết phải dài từ ${MIN_SUBMISSION_LEN} đến ${MAX_SUBMISSION_LEN} ký tự.`,
      },
      400,
    );
  }

  const prompt = deps.getPromptById(promptId);
  if (!prompt) {
    await safeLog(deps, {
      userId,
      promptId,
      submissionLen: submissionText.length,
      timeSpentSeconds,
      score: null,
      status: "validation_error",
    });
    return json({ error: "unknown_prompt" }, 404);
  }

  // 4. Build the AI prompt and call.
  const aiInput = buildAiInput(prompt, submissionText);
  let aiResult: AiCallResult;
  try {
    aiResult = await deps.callAi(aiInput);
  } catch (err) {
    console.error("[writing-feedback] callAi threw", err);
    await safeLog(deps, {
      userId,
      promptId,
      submissionLen: submissionText.length,
      timeSpentSeconds,
      score: null,
      status: "ai_error",
    });
    return json(
      {
        error: "ai_unavailable",
        message: "Feedback service is temporarily unavailable.",
        message_vi: "Dịch vụ phản hồi đang tạm gián đoạn.",
      },
      503,
    );
  }

  if (!aiResult.ok) {
    await safeLog(deps, {
      userId,
      promptId,
      submissionLen: submissionText.length,
      timeSpentSeconds,
      score: null,
      status: "ai_error",
    });
    return json(
      {
        error: "ai_unavailable",
        message: "Feedback service is temporarily unavailable.",
        message_vi: "Dịch vụ phản hồi đang tạm gián đoạn.",
      },
      503,
    );
  }

  // 5. Project the AI JSON into the public response. The shape is
  //    forgiving — missing arrays default to empty so a partial answer
  //    still gives the user *something*.
  const projected = projectAiResponse(aiResult.json);

  await safeLog(deps, {
    userId,
    promptId,
    submissionLen: submissionText.length,
    timeSpentSeconds,
    score: projected.score,
    status: "ok",
  });

  return json(projected, 200);
}

// ── AI prompt construction ───────────────────────────────────────────

export function buildAiInput(
  prompt: PromptContext,
  submissionText: string,
): AiCallInput {
  const systemPrompt =
    "You are a Vietnamese-first English writing coach. The learner is " +
    "Vietnamese-speaking and may have intermediate English. Respond ONLY " +
    "with a single JSON object — no prose before or after. Provide " +
    "feedback that is honest, kind, and culturally aware. Vietnamese " +
    "explanations come first; English explanations are concise and " +
    "natural. Score the submission 0–100 based on (a) how well it " +
    "addresses the prompt, (b) appropriate tone for the scenario, " +
    "(c) grammar and clarity. Identify up to 6 specific corrections, " +
    "3–5 vocabulary upgrades, the most important grammar issues, and " +
    "any cultural notes that would help a Vietnamese learner navigate " +
    "the scenario in a US context.";

  const schema =
    'Return JSON with keys: "score" (int 0-100), "summary_vi" (string), ' +
    '"summary_en" (string), "corrections" (array of {original, suggested, ' +
    'reason_vi, reason_en}), "vocabulary" (array of {user_word, better, ' +
    'context_vi, context_en}), "grammar" (array of {snippet, rule_vi, ' +
    'rule_en, corrected}), "cultural_notes_vi" (array of strings), ' +
    '"cultural_notes_en" (array of strings).';

  const userMessage = [
    `Prompt title: ${prompt.title_en}`,
    `Scenario: ${prompt.scenario_en}`,
    `Target word count: ${prompt.target_words_min}–${prompt.target_words_max}`,
    "",
    "Learner submission:",
    "---",
    submissionText,
    "---",
    "",
    schema,
  ].join("\n");

  return { systemPrompt, userMessage, maxTokens: MAX_OUTPUT_TOKENS };
}

// ── Response projection ──────────────────────────────────────────────

export function projectAiResponse(
  raw: Record<string, unknown>,
): {
  score: number;
  summary_vi: string;
  summary_en: string;
  corrections: Array<{
    original: string;
    suggested: string;
    reason_vi: string;
    reason_en: string;
  }>;
  vocabulary: Array<{
    user_word: string;
    better: string;
    context_vi: string;
    context_en: string;
  }>;
  grammar: Array<{
    snippet: string;
    rule_vi: string;
    rule_en: string;
    corrected: string;
  }>;
  cultural_notes_vi: string[];
  cultural_notes_en: string[];
} {
  const score = clampScore(raw.score);
  const summary_vi = stringOrEmpty(raw.summary_vi);
  const summary_en = stringOrEmpty(raw.summary_en);

  return {
    score,
    summary_vi: summary_vi || (summary_en ? summary_en : "Bài viết đã được chấm."),
    summary_en: summary_en || (summary_vi ? summary_vi : "Submission scored."),
    corrections: Array.isArray(raw.corrections)
      ? raw.corrections.flatMap((c) => projectCorrection(c)).slice(0, 6)
      : [],
    vocabulary: Array.isArray(raw.vocabulary)
      ? raw.vocabulary.flatMap((v) => projectVocab(v)).slice(0, 5)
      : [],
    grammar: Array.isArray(raw.grammar)
      ? raw.grammar.flatMap((g) => projectGrammar(g)).slice(0, 6)
      : [],
    cultural_notes_vi: Array.isArray(raw.cultural_notes_vi)
      ? raw.cultural_notes_vi.filter(
          (s): s is string => typeof s === "string",
        )
      : [],
    cultural_notes_en: Array.isArray(raw.cultural_notes_en)
      ? raw.cultural_notes_en.filter(
          (s): s is string => typeof s === "string",
        )
      : [],
  };
}

function projectCorrection(raw: unknown): Array<{
  original: string;
  suggested: string;
  reason_vi: string;
  reason_en: string;
}> {
  if (!raw || typeof raw !== "object") return [];
  const o = raw as Record<string, unknown>;
  const original = stringOrEmpty(o.original);
  const suggested = stringOrEmpty(o.suggested);
  if (!original || !suggested) return [];
  return [
    {
      original,
      suggested,
      reason_vi: stringOrEmpty(o.reason_vi),
      reason_en: stringOrEmpty(o.reason_en),
    },
  ];
}

function projectVocab(raw: unknown): Array<{
  user_word: string;
  better: string;
  context_vi: string;
  context_en: string;
}> {
  if (!raw || typeof raw !== "object") return [];
  const o = raw as Record<string, unknown>;
  const user_word = stringOrEmpty(o.user_word);
  const better = stringOrEmpty(o.better);
  if (!user_word || !better) return [];
  return [
    {
      user_word,
      better,
      context_vi: stringOrEmpty(o.context_vi),
      context_en: stringOrEmpty(o.context_en),
    },
  ];
}

function projectGrammar(raw: unknown): Array<{
  snippet: string;
  rule_vi: string;
  rule_en: string;
  corrected: string;
}> {
  if (!raw || typeof raw !== "object") return [];
  const o = raw as Record<string, unknown>;
  const snippet = stringOrEmpty(o.snippet);
  const corrected = stringOrEmpty(o.corrected);
  if (!snippet || !corrected) return [];
  return [
    {
      snippet,
      rule_vi: stringOrEmpty(o.rule_vi),
      rule_en: stringOrEmpty(o.rule_en),
      corrected,
    },
  ];
}

function clampScore(raw: unknown): number {
  const n = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function stringOrEmpty(raw: unknown): string {
  return typeof raw === "string" ? raw : "";
}

// ── Helpers ───────────────────────────────────────────────────────────

export function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function safeLog(
  deps: Deps,
  params: Parameters<Deps["logCall"]>[0],
): Promise<void> {
  try {
    await deps.logCall(params);
  } catch (err) {
    console.warn("[writing-feedback] logCall threw", err);
  }
}

export const WRITING_FEEDBACK_LIMITS = {
  MAX_OUTPUT_TOKENS,
  MAX_SUBMISSION_LEN,
  MIN_SUBMISSION_LEN,
  RATE_LIMIT_MAX_CALLS,
  RATE_LIMIT_WINDOW_MS,
} as const;
