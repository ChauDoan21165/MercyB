import { createClient } from "@supabase/supabase-js";
import {
  buildDeepSeekSpeakFollowUp,
  isRecord,
  norm,
  SPEAK_REPEAT_CLARIFICATION,
  toSpeakRecentTurns,
} from "../../api/_lib/deepseekSpeak";
import {
  buildAiConversationTurn,
  getAiConversationFailureDetail,
  normalizeAiConversationHistory,
} from "../../api/_lib/aiConversation";
import {
  readAdminLevel,
  resolveConversationEntitlementAccess,
} from "../../api/_lib/conversationEntitlement";
import {
  logConversationTurnCost,
  checkFreeConversationTurns,
} from "../../api/_lib/conversationCost";
import {
  asString,
  envValue,
  getBearerToken,
  json,
  optionsResponse,
  readJsonBody,
  type PagesContext,
} from "../../src/pages-functions/http";
import { chatJsonWithFailover } from "../../src/pages-functions/aiProvider";
import { failureJson } from "../../src/pages-functions/failureLog";
import { logMercyAiUsage } from "../../api/_lib/aiUsageLog";

type MercyAiBody = {
  mode?: string;
  learnerText?: string;
  explainLanguage?: string;
  transcript?: string;
  userText?: string;
  message?: string;
  text?: string;
  prompt?: string;
  lang?: string;
  scenarioId?: string;
  scenario?: Record<string, unknown>;
  grounding?: unknown;
  promptMetadata?: Record<string, unknown>;
  messages?: Array<{ role?: string; text?: string }>;
  turnCount?: number;
  context?: Record<string, unknown>;
  history?: Array<{ role?: string; text?: string }>;
};

const requestLog = new Map<string, number[]>();
const MERCY_AI_PROVIDER_ORDER = ["openai", "deepseek", "gemini"] as const;

function boundedDetail(value: string, max = 500): string {
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

function errorDetail(error: unknown): Record<string, string> {
  if (error instanceof Error) {
    return {
      errorName: error.name,
      errorMessage: boundedDetail(error.message || "unknown_error"),
    };
  }
  return { errorMessage: boundedDetail(String(error ?? "unknown_error")) };
}

function hasAnyAiProviderKey(env: PagesContext["env"]): boolean {
  return Boolean(
    envValue(env, "OPENAI_API_KEY") ||
      envValue(env, "DEEPSEEK_API_KEY") ||
      envValue(env, "GEMINI_API_KEY"),
  );
}

function aiConversationFailureDetail(
  error: unknown,
  fallbackStage: string,
): Record<string, string | number | boolean | null | undefined> {
  const detail = getAiConversationFailureDetail(error);
  return {
    failureStage: detail.failureStage || fallbackStage,
    ...detail,
    ...(detail.errorName || detail.errorMessage ? {} : errorDetail(error)),
  };
}

function isRateLimited(key: string, limit = 12, windowMs = 60_000): boolean {
  const now = Date.now();
  const recent = (requestLog.get(key) ?? []).filter((ts) => ts > now - windowMs);
  if (recent.length >= limit) {
    requestLog.set(key, recent);
    return true;
  }
  recent.push(now);
  requestLog.set(key, recent);
  return false;
}

function getIp(request: Request): string {
  const forwarded =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for") ||
    "";
  return forwarded.split(",")[0]?.trim() || "unknown";
}

async function hasPremiumAiConversationAccess(
  env: PagesContext["env"],
  accessToken: string,
  userId: string,
): Promise<boolean> {
  const supabaseUrl = envValue(env, "SUPABASE_URL") || envValue(env, "VITE_SUPABASE_URL");
  const supabaseAnonKey = envValue(env, "SUPABASE_ANON_KEY") || envValue(env, "VITE_SUPABASE_ANON_KEY");
  if (!supabaseUrl || !supabaseAnonKey || !accessToken || !userId) return false;

  try {
    const [entitlementResult, profileResult] = await Promise.allSettled([
      fetch(`${supabaseUrl.replace(/\/$/, "")}/functions/v1/me-entitlement`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          apikey: supabaseAnonKey,
        },
      }),
      fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/profiles?select=admin_level&id=eq.${encodeURIComponent(userId)}&limit=1`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          apikey: supabaseAnonKey,
          Accept: "application/json",
        },
      }),
    ]);

    let entitlement: { is_premium?: unknown } | null = null;
    const entitlementResponse =
      entitlementResult.status === "fulfilled" ? entitlementResult.value : null;
    if (entitlementResponse?.ok) {
      entitlement = await entitlementResponse.json() as { is_premium?: unknown };
    }

    let adminLevel = 0;
    const profileResponse =
      profileResult.status === "fulfilled" ? profileResult.value : null;
    if (profileResponse?.ok) {
      const rows = await profileResponse.json() as Array<{ admin_level?: unknown }>;
      adminLevel = readAdminLevel(rows[0]?.admin_level);
    }

    return resolveConversationEntitlementAccess({ entitlement, adminLevel });
  } catch {
    return false;
  }
}

export function onRequestOptions(): Response {
  return optionsResponse();
}

export function onRequestGet(): Response {
  return json({ ok: true, hint: "POST { userText }" });
}

export async function onRequestPost(context: PagesContext): Promise<Response> {
  const { request, env } = context;
  const supabaseUrl = envValue(env, "SUPABASE_URL") || envValue(env, "VITE_SUPABASE_URL");
  const supabaseAnonKey = envValue(env, "SUPABASE_ANON_KEY") || envValue(env, "VITE_SUPABASE_ANON_KEY");
  if (!supabaseUrl || !supabaseAnonKey) {
    return failureJson(context, "/api/mercy-ai", "preauth", 500, "missing_supabase_env", {
      error: "Missing Supabase environment variables",
    });
  }

  const accessToken = getBearerToken(request);
  if (!accessToken) {
    return failureJson(context, "/api/mercy-ai", "preauth", 401, "missing_bearer", {
      error: "Missing bearer token",
    });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);
  if (userError || !user) {
    return failureJson(context, "/api/mercy-ai", "preauth", 401, "unauthorized", {
      error: "Unauthorized",
    });
  }

  if (isRateLimited(user.id || getIp(request))) {
    return failureJson(context, "/api/mercy-ai", "preauth", 429, "rate_limited", {
      error: "Too many requests. Please try again later.",
    });
  }

  const body = await readJsonBody<MercyAiBody>(request);
  const mode = norm(body.mode) || "host";
  const failure = (
    failureMode: string,
    status: number,
    errorClass: string,
    payload: unknown,
    detail: Record<string, string | number | boolean | null | undefined> = {},
  ): Response => failureJson(context, "/api/mercy-ai", failureMode, status, errorClass, payload, {
    ...detail,
    userId: user.id,
  });

  if (norm(body.mode) === "speak-follow-up") {
    const transcript = norm(body.transcript || body.userText || body.message || body.text);
    if (!transcript) {
      return failure(mode, 400, "missing_transcript", {
        error: "Missing transcript",
      });
    }
    if (transcript.length > 1000) {
      return failure(mode, 400, "input_too_long", {
        error: "Input too long",
      });
    }

    const speakContext = isRecord(body.context) ? body.context : {};
    const turnsOnTopic = typeof speakContext.turnsOnTopic === "number" ? Math.max(0, Math.floor(speakContext.turnsOnTopic)) : 0;
    const result = await buildDeepSeekSpeakFollowUp({
      transcript,
      learnerLevel: norm(speakContext.learnerLevel) || "beginner",
      currentTopic: norm(speakContext.currentTopic),
      recentTurns: toSpeakRecentTurns(speakContext.recentTurns),
      turnsOnTopic,
      env,
    });
    if (
      result &&
      "question" in result &&
      result.provider === "deepseek" &&
      result.usage &&
      (result.usage.inputTokens > 0 || result.usage.outputTokens > 0)
    ) {
      logMercyAiUsage(context, {
        userId: user.id,
        feature: "mercy-ai:speak-follow-up",
        provider: "deepseek",
        model: result.model,
        inputTokens: result.usage.inputTokens,
        outputTokens: result.usage.outputTokens,
        meta: {
          provider: "deepseek",
          cacheHitInputTokens: result.usage.cacheHitInputTokens ?? 0,
          cacheMissInputTokens: result.usage.cacheMissInputTokens ?? 0,
        },
      });
    }
    return json(result || {
      question: SPEAK_REPEAT_CLARIFICATION,
      provider: "local-fallback",
      fallback: true,
    });
  }

  if (norm(body.mode) === "ai-conversation-turn") {
    let turnAbort: AbortController | null = null;
    let turnTimer: ReturnType<typeof setTimeout> | null = null;
    let failureStage = "entitlement";
    try {
      const hasPremium = await hasPremiumAiConversationAccess(env, accessToken, user.id);
      if (!hasPremium) {
        const cfSupabaseUrl = envValue(env, "SUPABASE_URL") || envValue(env, "VITE_SUPABASE_URL") || "";
        const cfServiceKey = envValue(env, "SUPABASE_SERVICE_ROLE_KEY") || "";
        const freeAccess = await checkFreeConversationTurns(user.id, {
          supabaseUrl: cfSupabaseUrl,
          serviceKey: cfServiceKey,
        });
        if (!freeAccess.flagOn || !freeAccess.allowed) {
          return failure(mode, 403, "premium_required", {
            error: "Premium required",
          }, { failureStage });
        }
      }

      failureStage = "preflight";
      if (!hasAnyAiProviderKey(env)) {
        return failure(mode, 500, "missing_openai_key", {
          error: "Missing OPENAI_API_KEY",
        }, { failureStage });
      }

      const learnerText = asString(body.learnerText || body.userText || body.message || body.text, 1200);
      if (!learnerText) {
        return failure(mode, 400, "missing_learner_text", {
          error: "Missing learnerText",
        }, { failureStage });
      }

      const turnCount = Number(body.turnCount ?? 0);
      if (Number.isFinite(turnCount) && turnCount >= 50) {
        return failure(mode, 400, "session_turn_cap", {
          error: "Session turn cap reached",
        }, { failureStage });
      }

      // Bound the whole turn so a slow OpenAI subrequest returns OUR error fast
      // instead of the Cloudflare Pages Worker being killed at its platform
      // time/CPU limit (which serves an opaque HTML 502 the app can't observe —
      // see reports/mercy-ai-502-trace.md). MERCY_AI_TURN_TIMEOUT_MS is kept
      // safely under Cloudflare's limit; tune via env if needed.
      const turnTimeoutMs = Number(envValue(env, "MERCY_AI_TURN_TIMEOUT_MS")) || 22_000;
      turnAbort = new AbortController();
      turnTimer = setTimeout(() => turnAbort?.abort(), turnTimeoutMs);
      failureStage = "build_turn";
      const result = await buildAiConversationTurn({
        scenarioId: asString(body.scenarioId, 100) || "job-interview",
        learnerText,
        history: normalizeAiConversationHistory(body.history || body.messages),
        turnCount: Number.isFinite(turnCount) ? turnCount : 0,
        messages: Array.isArray(body.messages) ? body.messages : [],
        scenario: isRecord(body.scenario) ? body.scenario : null,
        grounding: body.grounding,
        promptMetadata: isRecord(body.promptMetadata) ? body.promptMetadata : null,
        env,
        signal: turnAbort.signal,
      });

      // Cost telemetry: log every turn for cost-per-session accounting.
      failureStage = "cost_logging";
      const cfSupabaseUrl = envValue(env, "SUPABASE_URL") || envValue(env, "VITE_SUPABASE_URL") || "";
      const cfServiceKey = envValue(env, "SUPABASE_SERVICE_ROLE_KEY") || "";
      console.log(
        `[conversation] turn cost: $${result.cost.estimatedUsd.toFixed(6)} USD` +
        ` tokens=${result.cost.totalTokens} uid=${user.id}`,
      );
      await logConversationTurnCost(
        {
          userId: user.id,
          model: result.model,
          tokensInput: result.cost.promptTokens,
          tokensOutput: result.cost.completionTokens,
          estimatedUsd: result.cost.estimatedUsd,
        },
        { supabaseUrl: cfSupabaseUrl, serviceKey: cfServiceKey },
      );

      // Additive: VND-costed, language-tagged spend to ai_usage_logs (the
      // CostMonitoring table). OpenAI-provider only; fire-and-forget.
      failureStage = "usage_logging";
      logMercyAiUsage(context, {
        userId: user.id,
        feature: "mercy-ai:ai-conversation-turn",
        model: result.model,
        inputTokens: result.cost.promptTokens,
        outputTokens: result.cost.completionTokens,
      });

      return json(result);
    } catch (err) {
      // Timed out on our own deadline → 504 (an observable, app-owned response)
      // rather than letting Cloudflare kill the Worker and serve its HTML 502.
      const detail = aiConversationFailureDetail(err, failureStage);
      const timedOut =
        turnAbort?.signal.aborted ||
        detail.timeout === true ||
        (err instanceof Error && /timed out/i.test(err.message));
      if (timedOut) {
        return failure(mode, 504, "ai_conversation_timeout", {
          error: "AI conversation timed out",
          timeout: true,
        }, {
          ...detail,
          timeout: true,
        });
      }
      return failure(mode, 502, "ai_conversation_failed", {
        error: err instanceof Error ? err.message : "AI conversation failed",
      }, detail);
    } finally {
      if (turnTimer) clearTimeout(turnTimer);
    }
  }

  if (norm(body.mode) === "sentence-correction") {
    const learnerText = asString(body.learnerText || body.userText || body.text, 500);
    if (!learnerText) {
      return failure(mode, 400, "missing_learner_text", {
        error: "Missing learnerText",
      });
    }
    if (!hasAnyAiProviderKey(env)) {
      return failure(mode, 500, "missing_openai_key", {
        error: "Missing OPENAI_API_KEY",
      });
    }

    const _runOnWords = learnerText.split(/\s+/).length;
    const _runOnConjs = (learnerText.match(/\b(?:and|but|so|because|or|yet|then|after|before|when|while|since|unless|although|though|however|moreover|furthermore|therefore|thus|hence|meanwhile|otherwise|besides|also|additionally|consequently|nevertheless|nonetheless)\b/gi) || []).length;
    const _runOnCommas = (learnerText.match(/,/g) || []).length;
    const isRunOn = _runOnWords >= 12 && (_runOnConjs >= 2 || _runOnCommas >= 2);

    const explainLang = norm(body.explainLanguage) === "en" ? "en" : "vi";
    const viAbstain = "Mercy chưa sửa chắc câu này. Bạn thử viết ngắn hơn, rõ hơn rồi gửi lại nhé.";
    const enAbstain = "Mercy could not correct this confidently. Try rewriting it more clearly.";
    const sttAbstain = "Mình chưa chắc bạn định nói gì — bạn gõ lại nhé?";
    const runOnInstruction = isRunOn
      ? `\nRun-on rule: The input appears to be a run-on sentence with multiple clauses. Do NOT set "confident" to false for this reason. Instead, break the clauses into separate sentences, correct the grammar in each one, and return all corrected sentences assembled as the "corrected" value. The explanation (in ${explainLang === "vi" ? "Vietnamese" : "English"}) should note that the run-on was split into proper sentences.`
      : "";
    const systemPrompt = `You are Mercy, an English-language tutor for Vietnamese learners.
Correct the learner's English sentence for grammar, tense, and natural phrasing.
Keep the learner's original meaning — do not rewrite from scratch.
Explain what changed and why in ${explainLang === "vi" ? "Vietnamese" : "English"} (1–2 sentences).
Give a grammar tip in ${explainLang === "vi" ? "Vietnamese" : "English"} (one line, start with "Mẹo:" or "Tip:").
STT-garble rule: If a content word is semantically impossible in its syntactic position — e.g. a degree adverb modifying a proper noun ("very Sunday", "so Monday") or a linking verb followed by a time noun used as an adjective ("feel week") — the word is almost certainly a speech-to-text mishearing. You MUST either (a) identify the intended word and fix it (e.g. "very Sunday" → "very sunny", "feel week" → "feel weak"), or (b) set "confident" to false with explanation "${sttAbstain}". NEVER approve such a sentence as correct.${runOnInstruction}
Fragment rule: For sentence fragments with no finite verb (e.g. "a good mother yesterday and invited her") — reconstruct the intended complete sentence, OR set "confident" to false. NEVER return a fragment as-is with confident:true.
If the input is genuinely garbled or incomprehensible (not merely long or multi-clause), set "confident" to false.
Respond ONLY with valid JSON:
{"corrected":"<corrected sentence>","explanation":"<explanation>","grammarTip":"<tip>","confident":true}
On low-confidence: {"corrected":"","explanation":"${explainLang === "vi" ? viAbstain : enAbstain}","grammarTip":"","confident":false}`;

    // Bound sentence correction below the client's 18s timeout so the UI receives
    // our typed 504 instead of a client-side abort or opaque platform 5xx.
    const correctionTimeoutMs = Number(envValue(env, "MERCY_AI_CORRECTION_TIMEOUT_MS")) || 12_000;
    let failureStage = "provider_request";
    try {
      failureStage = "provider_request";
      const corrResult = await chatJsonWithFailover({
        env,
        systemPrompt,
        userMessage: learnerText,
        openaiModel: "gpt-4o-mini",
        providerOrder: MERCY_AI_PROVIDER_ORDER,
        temperature: 0.25,
        maxTokens: isRunOn ? 400 : 220,
        timeoutMs: correctionTimeoutMs,
      });
      if (!corrResult.ok) {
        if (corrResult.providerErrorKind === "timeout") {
          return failure(mode, 504, "correction_timeout", {
            error: "Correction timed out",
            timeout: true,
          }, {
            provider: corrResult.failedProvider ?? corrResult.provider,
            failureStage: "provider_request",
            timeout: true,
            attempts: corrResult.attempts.join(","),
          });
        }
        return failure(mode, 500, "correction_provider_failed", {
          error: "correction_failed",
        }, {
          provider: corrResult.failedProvider ?? corrResult.provider,
          providerStatus: corrResult.providerStatus,
          upstreamStatus: corrResult.providerStatus,
          failureStage: corrResult.errorKind === "parse_error" ? "model_json" : "provider_response",
          errorKind: corrResult.errorKind,
          upstreamBody: boundedDetail(corrResult.upstreamBody || corrResult.raw),
          attempts: corrResult.attempts.join(","),
        });
      }
      failureStage = "model_json";
      const parsed = corrResult.json as {
        corrected?: string;
        explanation?: string;
        grammarTip?: string;
        confident?: boolean;
      };
      const confident = parsed.confident !== false;
      // Additive: VND-costed spend to ai_usage_logs. Only when usage present
      // (no fabricated numbers). Fire-and-forget.
      failureStage = "usage_logging";
      if (corrResult.usage && corrResult.provider !== "gemini") {
        logMercyAiUsage(context, {
          userId: user.id,
          feature: "mercy-ai:sentence-correction",
          provider: corrResult.provider === "none" ? undefined : corrResult.provider,
          model: corrResult.model || "gpt-4o-mini",
          inputTokens: corrResult.usage.inputTokens,
          outputTokens: corrResult.usage.outputTokens,
        });
      }
      return json({
        corrected: norm(parsed.corrected) || (confident ? learnerText : ""),
        explanation: norm(parsed.explanation) || (confident ? "" : (explainLang === "vi" ? viAbstain : enAbstain)),
        grammarTip: norm(parsed.grammarTip) || "",
        confident,
      });
    } catch (err) {
      const timedOut =
        (err instanceof Error && /timed out|abort/i.test(err.message));
      if (timedOut) {
        return failure(mode, 504, "correction_timeout", {
          error: "Correction timed out",
          timeout: true,
        }, {
          provider: "openai",
          failureStage,
          timeout: true,
          ...errorDetail(err),
        });
      }
      return failure(mode, 500, "correction_failed", {
        error: "correction_failed",
      }, {
        provider: "openai",
        failureStage,
        ...errorDetail(err),
      });
    }
  }

  if (!hasAnyAiProviderKey(env)) {
    return failure(mode, 500, "missing_openai_key", {
      error: "Missing OPENAI_API_KEY",
    });
  }

  const userText = asString(body.userText || body.message || body.text || body.prompt, 2000);
  const lang = body.lang === "vi" ? "vi" : "en";
  if (!userText) {
    return failure(mode, 400, "missing_user_text", {
      error: "Missing userText",
    });
  }

  const appContext = body.context && typeof body.context === "object" ? body.context : {};
  const roomTitle = asString(appContext.roomTitle, 200);
  const roomId = asString(appContext.roomId, 100);
  const keyword = asString(appContext.keyword, 100);
  const entryId = asString(appContext.entryId, 100);
  const history = Array.isArray(body.history)
    ? body.history.slice(-6).map((item) => ({
      role: item.role === "assistant" ? "assistant" : "user",
      content: asString(item.text, 2000),
    })).filter((item) => item.content)
    : [];

  const ctxLine = [
    roomTitle || roomId ? `room=${roomTitle || roomId}` : null,
    keyword ? `kw=${keyword}` : null,
    entryId ? `entry=${entryId}` : null,
    lang ? `lang=${lang}` : null,
    user.id ? `uid=${user.id}` : null,
  ].filter(Boolean).join(" | ");

  const system = `You are Mercy Host inside a learning app.
Tone: calm, warm, practical. No hype. No emojis. No long essays.
Return strict JSON only with one key, "text". The text value must use EXACTLY this format:

EN:
<2-6 short lines>

VI:
<2-6 short lines>

Rules:
- If user says hello/hi/xin chao: greet back politely and ask 1 short question.
- If user is vague: ask 1 clarifying question + give 1 next step.
- If user asks about VIP/tiers/pricing: say go to /tiers.
- If user asks "fix grammar:" then correct grammar + explain 1 rule briefly.
- Keep answers compact.`;

  const hostUserMessage = [
    ctxLine ? `Context: ${ctxLine}` : "",
    history.length
      ? `Recent history:\n${history.map((item) => `${item.role}: ${item.content}`).join("\n")}`
      : "",
    `User: ${userText}`,
  ].filter(Boolean).join("\n\n");

  const hostResult = await chatJsonWithFailover({
    env,
    systemPrompt: system,
    userMessage: hostUserMessage,
    openaiModel: "gpt-4o-mini",
    providerOrder: MERCY_AI_PROVIDER_ORDER,
    temperature: 0.4,
    maxTokens: 220,
    timeoutMs: 12_000,
  });

  if (!hostResult.ok) {
    return failure(mode, 502, "host_provider_failed", {
      error: hostResult.errorKind || "provider_failed",
    }, {
      provider: hostResult.failedProvider ?? hostResult.provider,
      providerStatus: hostResult.providerStatus,
      upstreamStatus: hostResult.providerStatus,
      errorKind: hostResult.errorKind,
      upstreamBody: boundedDetail(hostResult.upstreamBody || hostResult.raw),
      failureStage: hostResult.errorKind === "parse_error" ? "model_json" : "provider_response",
      attempts: hostResult.attempts.join(","),
    });
  }
  // Additive: VND-costed spend to ai_usage_logs for the Mercy-host chat path.
  // Only when usage present (no fabricated numbers). Fire-and-forget.
  if (hostResult.usage && hostResult.provider !== "gemini") {
    logMercyAiUsage(context, {
      userId: user.id,
      feature: "mercy-ai:host",
      provider: hostResult.provider === "none" ? undefined : hostResult.provider,
      model: hostResult.model || "gpt-4o-mini",
      inputTokens: hostResult.usage.inputTokens,
      outputTokens: hostResult.usage.outputTokens,
    });
  }
  return json({ text: norm(hostResult.json.text) });
}
