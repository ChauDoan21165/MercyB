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
  const openAiKey = envValue(env, "OPENAI_API_KEY");
  const supabaseUrl = envValue(env, "SUPABASE_URL") || envValue(env, "VITE_SUPABASE_URL");
  const supabaseAnonKey = envValue(env, "SUPABASE_ANON_KEY") || envValue(env, "VITE_SUPABASE_ANON_KEY");
  if (!supabaseUrl || !supabaseAnonKey) {
    return json({ error: "Missing Supabase environment variables" }, 500);
  }

  const accessToken = getBearerToken(request);
  if (!accessToken) return json({ error: "Missing bearer token" }, 401);

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);
  if (userError || !user) return json({ error: "Unauthorized" }, 401);

  if (isRateLimited(user.id || getIp(request))) {
    return json({ error: "Too many requests. Please try again later." }, 429);
  }

  const body = await readJsonBody<MercyAiBody>(request);
  if (norm(body.mode) === "speak-follow-up") {
    const transcript = norm(body.transcript || body.userText || body.message || body.text);
    if (!transcript) return json({ error: "Missing transcript" }, 400);
    if (transcript.length > 1000) return json({ error: "Input too long" }, 400);

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
    return json(result || {
      question: SPEAK_REPEAT_CLARIFICATION,
      provider: "local-fallback",
      fallback: true,
    });
  }

  if (norm(body.mode) === "ai-conversation-turn") {
    const hasPremium = await hasPremiumAiConversationAccess(env, accessToken, user.id);
    if (!hasPremium) {
      const cfSupabaseUrl = envValue(env, "SUPABASE_URL") || envValue(env, "VITE_SUPABASE_URL") || "";
      const cfServiceKey = envValue(env, "SUPABASE_SERVICE_ROLE_KEY") || "";
      const freeAccess = await checkFreeConversationTurns(user.id, {
        supabaseUrl: cfSupabaseUrl,
        serviceKey: cfServiceKey,
      });
      if (!freeAccess.flagOn || !freeAccess.allowed) {
        return json({ error: "Premium required" }, 403);
      }
    }

    if (!openAiKey) return json({ error: "Missing OPENAI_API_KEY" }, 500);

    const learnerText = asString(body.learnerText || body.userText || body.message || body.text, 1200);
    if (!learnerText) return json({ error: "Missing learnerText" }, 400);

    const turnCount = Number(body.turnCount ?? 0);
    if (Number.isFinite(turnCount) && turnCount >= 50) {
      return json({ error: "Session turn cap reached" }, 400);
    }

    try {
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
      });

      // Cost telemetry: log every turn for cost-per-session accounting.
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

      return json(result);
    } catch (err) {
      return json({
        error: err instanceof Error ? err.message : "AI conversation failed",
      }, 502);
    }
  }

  if (norm(body.mode) === "sentence-correction") {
    const learnerText = asString(body.learnerText || body.userText || body.text, 500);
    if (!learnerText) return json({ error: "Missing learnerText" }, 400);
    if (!openAiKey) return json({ error: "Missing OPENAI_API_KEY" }, 500);

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

    try {
      const corrResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openAiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "developer", content: systemPrompt },
            { role: "user", content: learnerText },
          ],
          temperature: 0.25,
          max_tokens: isRunOn ? 400 : 220,
          response_format: { type: "json_object" },
        }),
      });
      if (!corrResponse.ok) return json({ error: "correction_failed" }, 500);
      const corrData = await corrResponse.json() as { choices?: Array<{ message?: { content?: string } }> };
      const raw = corrData.choices?.[0]?.message?.content ?? "{}";
      let parsed: { corrected?: string; explanation?: string; grammarTip?: string; confident?: boolean } = {};
      try { parsed = JSON.parse(raw); } catch { /* leave empty */ }
      const confident = parsed.confident !== false;
      return json({
        corrected: norm(parsed.corrected) || (confident ? learnerText : ""),
        explanation: norm(parsed.explanation) || (confident ? "" : (explainLang === "vi" ? viAbstain : enAbstain)),
        grammarTip: norm(parsed.grammarTip) || "",
        confident,
      });
    } catch {
      return json({ error: "correction_failed" }, 500);
    }
  }

  if (!openAiKey) return json({ error: "Missing OPENAI_API_KEY" }, 500);

  const userText = asString(body.userText || body.message || body.text || body.prompt, 2000);
  const lang = body.lang === "vi" ? "vi" : "en";
  if (!userText) return json({ error: "Missing userText" }, 400);

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
Always output EXACTLY this format:

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

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openAiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "developer", content: system },
        ...(ctxLine ? [{ role: "developer", content: `Context: ${ctxLine}` }] : []),
        ...history,
        { role: "user", content: userText },
      ],
      temperature: 0.4,
      max_tokens: 220,
    }),
  });

  if (!response.ok) return json({ error: `OpenAI ${response.status}` }, 502);
  const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  return json({ text: data.choices?.[0]?.message?.content ?? "" });
}
