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
    if (!(await hasPremiumAiConversationAccess(env, accessToken, user.id))) {
      return json({ error: "Premium required" }, 403);
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
      return json(result);
    } catch (err) {
      return json({
        error: err instanceof Error ? err.message : "AI conversation failed",
      }, 502);
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
