import { createClient } from "@supabase/supabase-js";
import { firstL1HintFromIssues, type L1HintPayload } from "../../../api/_lib/l1HintAdapter";
import { chatJsonWithFailover } from "../../../src/pages-functions/aiProvider";
import { asString, envValue, json, optionsResponse, readJsonBody, type PagesContext } from "../../../src/pages-functions/http";
import { failureJson, logFunctionFailure } from "../../../src/pages-functions/failureLog";

type GrammarBody = {
  text?: string;
  context?: string;
  mode?: string;
  englishLevel?: string;
  focus?: string;
  isRevisionAttempt?: boolean;
  originalText?: string;
  userId?: string;
};

const L1_FLAG_KEY = "feedbackL1DetectorEnabled";
const methodNotAllowedHeaders = { Allow: "POST" };

function buildSystemPrompt(level: string, isRevision: boolean): string {
  return [
    "You are Teacher Mercy, a warm and precise English teacher for Vietnamese learners.",
    "Your job: correct and enhance the learner English sentence, then explain what changed and why.",
    level ? `Learner English level: ${level}. Adjust explanation complexity accordingly.` : "Assume intermediate level.",
    isRevision ? "This is a revision attempt — be encouraging and note what improved." : "",
    "",
    "Return ONLY valid JSON:",
    `{
  "correctedText": "fix grammar errors only, keep learner meaning",
  "enhancedText": "more natural fluent English version",
  "explanation": "1-2 sentence explanation of main change in simple English",
  "feedback": "warm 1-sentence encouragement",
  "grammarPoints": ["past simple", "subject-verb agreement"],
  "tenseAnalysis": { "likelyMainTense": "past simple" },
  "issues": [{ "original": "wrong part", "corrected": "fixed part", "reason": "why" }]
}`,
    "",
    "Rules: correctedText fixes errors only. enhancedText makes it sound native. Only 1-3 grammarPoints. Be warm never condescending.",
  ].filter(Boolean).join("\n");
}

async function isL1FlagEnabled(env: PagesContext["env"], userId: string): Promise<boolean> {
  const supabaseUrl = envValue(env, "SUPABASE_URL") || envValue(env, "VITE_SUPABASE_URL");
  const supabaseAnonKey = envValue(env, "SUPABASE_ANON_KEY") || envValue(env, "VITE_SUPABASE_ANON_KEY");
  if (!supabaseUrl || !supabaseAnonKey || !userId) return false;

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase
      .from("feature_flags_public")
      .select("is_enabled, enabled_user_ids")
      .eq("flag_key", L1_FLAG_KEY)
      .maybeSingle();
    if (error || !data) return false;

    const cohort = Array.isArray(data.enabled_user_ids) ? data.enabled_user_ids : [];
    if (cohort.includes(userId)) return true;
    return !!data.is_enabled;
  } catch (err) {
    console.warn("[pages:grammar] feature flag lookup failed", err);
    return false;
  }
}

function methodNotAllowed(): Response {
  return json({ ok: false, error: "Method not allowed" }, 405, methodNotAllowedHeaders);
}

export function onRequestOptions(): Response {
  return optionsResponse();
}

export function onRequestGet(): Response {
  return methodNotAllowed();
}

export async function onRequestPost(context: PagesContext): Promise<Response> {
  const { env, request } = context;
  try {
    const body = await readJsonBody<GrammarBody>(request);
    const text = asString(body.text, 1200);
    const level = asString(body.englishLevel, 50);
    const focus = asString(body.focus, 200);
    const originalText = asString(body.originalText, 1200);
    const contextText = asString(body.context, 900);
    const isRevision = Boolean(body.isRevisionAttempt);

    if (!text) {
      return failureJson(context, "/api/mercy/grammar", "grammar", 400, "missing_text", {
        ok: false,
        error: "Missing text",
      });
    }
    if (!envValue(env, "OPENAI_API_KEY") && !envValue(env, "GEMINI_API_KEY") && !envValue(env, "DEEPSEEK_API_KEY")) {
      return failureJson(context, "/api/mercy/grammar", "grammar", 503, "missing_ai_provider_key", {
        ok: false,
        error: "Missing AI provider key",
      });
    }

    const userMessage = [
      originalText && originalText !== text ? `Original: ${originalText}` : "",
      `Sentence: ${text}`,
      contextText ? `Context: ${contextText}` : "",
      focus ? `Focus: ${focus}` : "",
    ].filter(Boolean).join("\n");

    const result = await chatJsonWithFailover({
      env,
      systemPrompt: buildSystemPrompt(level, isRevision),
      userMessage,
      timeoutMs: 15000,
      providerOrder: envValue(env, "AI_GRAMMAR_PROVIDER_ORDER") || envValue(env, "AI_PROVIDER_ORDER"),
      openaiModel: envValue(env, "OPENAI_GRAMMAR_MODEL") || "gpt-4o-mini",
      deepseekModel: envValue(env, "DEEPSEEK_GRAMMAR_MODEL") || "deepseek-chat",
      geminiModel: envValue(env, "GEMINI_GRAMMAR_MODEL") || undefined,
      temperature: 0.15,
      maxTokens: 800,
    });

    if (!result.ok) {
      const feedback =
        result.errorKind === "rate_limit"
          ? "Grammar service is busy. Please try again."
          : result.errorKind === "timeout"
            ? "Grammar check took too long. Please try again."
            : result.errorKind === "parse_error"
              ? "Grammar service had a temporary error."
              : "Grammar service temporarily unavailable.";
      logFunctionFailure({
        context,
        request,
        route: "/api/mercy/grammar",
        mode: "grammar",
        status: 200,
        errorClass: `provider_${result.errorKind}`,
      });
      return json({ ok: false, correctedText: text, feedback }, 200);
    }

    const parsed = result.json as {
      correctedText?: string;
      enhancedText?: string;
      explanation?: string;
      feedback?: string;
      grammarPoints?: unknown;
      tenseAnalysis?: { likelyMainTense?: string };
      issues?: unknown;
    };
    const issues = Array.isArray(parsed.issues) ? parsed.issues : [];

    const userId = asString(body.userId, 64);
    let l1Hint: L1HintPayload | null = null;
    try {
      if (userId && await isL1FlagEnabled(env, userId)) {
        l1Hint = firstL1HintFromIssues(
          issues as Array<{ original?: string; corrected?: string }>,
        );
      }
    } catch (err) {
      console.warn("[pages:grammar] L1 hint generation failed:", err);
    }

    return json({
      ok: true,
      correctedText: parsed.correctedText || text,
      enhancedText: parsed.enhancedText || parsed.correctedText || text,
      explanation: parsed.explanation || "",
      feedback: parsed.feedback || "Good effort! Keep going.",
      grammarPoints: Array.isArray(parsed.grammarPoints) ? parsed.grammarPoints : [],
      tenseAnalysis: parsed.tenseAnalysis || {},
      issues,
      ...(l1Hint ? { l1Hint } : {}),
    });
  } catch (err) {
    logFunctionFailure({
      context,
      request,
      route: "/api/mercy/grammar",
      mode: "grammar",
      status: 200,
      errorClass: "unexpected_error",
      detail: { errorName: err instanceof Error ? err.name : "unknown" },
    });
    return json({
      ok: false,
      error: "Internal server error",
      feedback: "Grammar help had a temporary error. Please try again.",
    }, 200);
  }
}
