// FILE: mercy-ai.ts
// PATH: api/mercy-ai.ts
// VERSION: v1.3.1-supabase-auth
// NOTE: Uses Supabase Auth bearer token verification instead of shared secret.

import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import {
  buildDeepSeekSpeakFollowUp,
  isRecord,
  norm,
  SPEAK_REPEAT_CLARIFICATION,
  toSpeakRecentTurns,
} from "./_lib/deepseekSpeak";
import type { SpeakFollowUpError } from "./_lib/deepseekSpeak";
import {
  buildAiConversationTurn,
  normalizeAiConversationHistory,
} from "./_lib/aiConversation";
import {
  readAdminLevel,
  resolveConversationEntitlementAccess,
} from "./_lib/conversationEntitlement";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Prefer server-only env names first. Fall back to VITE_* only if needed.
const supabaseUrl =
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";

const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

const requestLog = new Map<string, number[]>();

function isRateLimited(key: string, limit = 12, windowMs = 60_000): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;

  const requests = requestLog.get(key) ?? [];
  const recentRequests = requests.filter((ts) => ts > windowStart);

  if (recentRequests.length >= limit) {
    requestLog.set(key, recentRequests);
    return true;
  }

  recentRequests.push(now);
  requestLog.set(key, recentRequests);
  return false;
}

function safeJson(res: VercelResponse, status: number, obj: unknown) {
  res.status(status);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.send(JSON.stringify(obj));
}

function getIP(req: VercelRequest): string {
  const vercelForwardedFor = req.headers["x-vercel-forwarded-for"];
  const realIp = req.headers["x-real-ip"];
  const forwardedFor = req.headers["x-forwarded-for"];

  const pick = (value: string | string[] | undefined): string => {
    if (typeof value === "string") return value.split(",")[0].trim();
    if (Array.isArray(value)) return value[0]?.split(",")[0].trim() ?? "";
    return "";
  };

  return (
    pick(vercelForwardedFor) ||
    pick(realIp) ||
    pick(forwardedFor) ||
    req.socket?.remoteAddress ||
    "unknown"
  );
}

function getBearerToken(req: VercelRequest): string {
  const auth = req.headers.authorization;
  if (!auth || typeof auth !== "string") return "";

  const [scheme, token] = auth.split(" ");
  if (scheme !== "Bearer" || !token) return "";

  return token.trim();
}

async function hasPremiumAiConversationAccess(accessToken: string, userId: string): Promise<boolean> {
  if (!supabaseUrl || !accessToken || !userId) return false;
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    const ip = getIP(req);

    if (req.method === "GET") {
      return safeJson(res, 200, { ok: true, hint: "POST { userText }" });
    }

    if (req.method !== "POST") {
      res.setHeader("Allow", "POST, GET");
      return safeJson(res, 405, { error: "Method Not Allowed" });
    }

    if (!supabase) {
      return safeJson(res, 500, {
        error: "Missing Supabase environment variables",
      });
    }

    const accessToken = getBearerToken(req);

    if (!accessToken) {
      return safeJson(res, 401, { error: "Missing bearer token" });
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(accessToken);

    if (userError || !user) {
      return safeJson(res, 401, { error: "Unauthorized" });
    }

    const rateLimitKey = user.id || ip;

    if (isRateLimited(rateLimitKey)) {
      return safeJson(res, 429, {
        error: "Too many requests. Please try again later.",
      });
    }

    const body = (req.body ?? {}) as Record<string, unknown>;
    const mode = norm(body.mode);

    if (mode === "speak-follow-up") {
      const transcript = norm(body.transcript || body.userText || body.message || body.text);
      if (!transcript) {
        return safeJson(res, 400, { error: "Missing transcript" });
      }
      if (transcript.length > 1000) {
        return safeJson(res, 400, { error: "Input too long" });
      }

      const context = isRecord(body.context) ? body.context : {};
      const result = await buildDeepSeekSpeakFollowUp({
        transcript,
        learnerLevel: norm(context.learnerLevel) || "beginner",
        currentTopic: norm(context.currentTopic),
        recentTurns: toSpeakRecentTurns(context.recentTurns),
      });
      if (result && "ok" in result && !(result as SpeakFollowUpError).ok) {
        // Provider infrastructure failure — surface as typed retryable error, not a canned clarification.
        return safeJson(res, 200, result as SpeakFollowUpError);
      }
      if (!result) {
        // result === null: AI worked but transcript was genuinely unclear → ask to repeat.
        return safeJson(res, 200, {
          question: SPEAK_REPEAT_CLARIFICATION,
          provider: "local-fallback",
          fallback: true,
        });
      }
      return safeJson(res, 200, result);
    }

    if (mode === "ai-conversation-turn") {
      if (!(await hasPremiumAiConversationAccess(accessToken, user.id))) {
        return safeJson(res, 403, { error: "Premium required" });
      }

      const learnerText = norm(body.learnerText || body.userText || body.message || body.text);
      if (!learnerText) {
        return safeJson(res, 400, { error: "Missing learnerText" });
      }
      if (learnerText.length > 1200) {
        return safeJson(res, 400, { error: "Input too long" });
      }

      const turnCount = Number(body.turnCount ?? 0);
      if (Number.isFinite(turnCount) && turnCount >= 50) {
        return safeJson(res, 400, { error: "Session turn cap reached" });
      }

      const result = await buildAiConversationTurn({
        scenarioId: norm(body.scenarioId) || "job-interview",
        learnerText,
        history: normalizeAiConversationHistory(body.history),
        turnCount: Number.isFinite(turnCount) ? turnCount : 0,
      });
      return safeJson(res, 200, result);
    }

    if (mode === "sentence-correction") {
      const learnerText = norm(body.learnerText || body.userText || body.text);
      if (!learnerText) {
        return safeJson(res, 400, { error: "Missing learnerText" });
      }
      if (learnerText.length > 500) {
        return safeJson(res, 400, { error: "Input too long" });
      }
      if (!process.env.OPENAI_API_KEY) {
        return safeJson(res, 500, { error: "Missing OPENAI_API_KEY" });
      }

      // Detect run-on sentences: ≥12 words AND (≥2 connective conjunctions OR ≥2 commas).
      // When detected, GPT is instructed to segment + correct per clause rather than abstain.
      const _runOnWords = learnerText.split(/\s+/).length;
      const _runOnConjs = (learnerText.match(/\b(?:and|but|so|because|or|yet|then|after|before|when|while|since|unless|although|though|however|moreover|furthermore|therefore|thus|hence|meanwhile|otherwise|besides|also|additionally|consequently|nevertheless|nonetheless)\b/gi) || []).length;
      const _runOnCommas = (learnerText.match(/,/g) || []).length;
      const isRunOn = _runOnWords >= 12 && (_runOnConjs >= 2 || _runOnCommas >= 2);

      const explainLang = norm(body.explainLanguage) === "en" ? "en" : "vi";
      const viAbstain =
        "Mercy chưa sửa chắc câu này. Bạn thử viết ngắn hơn, rõ hơn rồi gửi lại nhé.";
      const enAbstain =
        "Mercy could not correct this confidently. Try rewriting it more clearly.";
      // Exact copy used when a probable STT mishearing is detected but the intended word is unclear.
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
If the input is genuinely garbled or incomprehensible (not merely long or multi-clause), set "confident" to false.
Respond ONLY with valid JSON:
{"corrected":"<corrected sentence>","explanation":"<explanation>","grammarTip":"<tip>","confident":true}
On low-confidence: {"corrected":"","explanation":"${explainLang === "vi" ? viAbstain : enAbstain}","grammarTip":"","confident":false}`;

      try {
        const completion = await client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "developer", content: systemPrompt },
            { role: "user", content: learnerText },
          ],
          temperature: 0.25,
          max_tokens: isRunOn ? 400 : 220,
          response_format: { type: "json_object" },
        });
        const raw = completion.choices?.[0]?.message?.content ?? "{}";
        let parsed: { corrected?: string; explanation?: string; grammarTip?: string; confident?: boolean } = {};
        try { parsed = JSON.parse(raw); } catch { /* leave empty */ }
        const confident = parsed.confident !== false;
        return safeJson(res, 200, {
          corrected: norm(parsed.corrected) || (confident ? learnerText : ""),
          explanation: norm(parsed.explanation) || (confident ? "" : (explainLang === "vi" ? viAbstain : enAbstain)),
          grammarTip: norm(parsed.grammarTip) || "",
          confident,
        });
      } catch {
        return safeJson(res, 500, { error: "correction_failed" });
      }
    }

    if (!process.env.OPENAI_API_KEY) {
      return safeJson(res, 500, { error: "Missing OPENAI_API_KEY" });
    }

    const userText = norm(
      body.userText || body.message || body.text || body.prompt
    );
    const lang = body.lang === "vi" ? "vi" : "en";

    if (!userText) {
      return safeJson(res, 400, { error: "Missing userText" });
    }

    if (userText.length > 2000) {
      return safeJson(res, 400, { error: "Input too long" });
    }

    const context = isRecord(body.context) ? body.context : {};
    const roomTitle = norm(context.roomTitle);
    const roomId = norm(context.roomId);
    const keyword = norm(context.keyword);
    const entryId = norm(context.entryId);

    const history: Array<{ role: "user" | "assistant"; text: string }> =
      Array.isArray(body.history)
        ? body.history.slice(-6).map((m) => {
            const entry = isRecord(m) ? m : {};
            return {
              role: entry.role === "assistant" ? "assistant" : "user",
              text: norm(entry.text),
            };
          })
        : [];

    const ctxLine = [
      roomTitle || roomId ? `room=${roomTitle || roomId}` : null,
      keyword ? `kw=${keyword}` : null,
      entryId ? `entry=${entryId}` : null,
      lang ? `lang=${lang}` : null,
      user.id ? `uid=${user.id}` : null,
    ]
      .filter(Boolean)
      .join(" • ");

    const system = `You are Mercy Host inside a learning app.
Tone: calm, warm, practical. No hype. No emojis. No long essays.
Always output EXACTLY this format:

EN:
<2-6 short lines>

VI:
<2-6 short lines>

Rules:
- If user says hello/hi/xin chào: greet back politely and ask 1 short question.
- If user is vague: ask 1 clarifying question + give 1 next step.
- If user asks about VIP/tiers/pricing: say go to /tiers.
- If user asks "fix grammar:" then correct grammar + explain 1 rule briefly.
- Keep answers compact.`;

    const messages: Array<{ role: "developer" | "user" | "assistant"; content: string }> = [
      { role: "developer", content: system },
      ...(ctxLine ? [{ role: "developer" as const, content: `Context: ${ctxLine}` }] : []),
      ...history
        .filter((h) => h.text)
        .map((h) => ({ role: h.role, content: h.text })),
      { role: "user", content: userText },
    ];

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.4,
      max_tokens: 220,
    });

    const text = completion.choices?.[0]?.message?.content ?? "";
    return safeJson(res, 200, { text });
  } catch (e: any) {
    return safeJson(res, 500, {
      error: String(e?.message || e || "unknown_error"),
    });
  }
}
