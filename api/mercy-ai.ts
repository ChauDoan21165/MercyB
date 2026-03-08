// FILE: mercy-ai.ts
// PATH: api/mercy-ai.ts
// VERSION: v1.3.1-supabase-auth
// NOTE: Uses Supabase Auth bearer token verification instead of shared secret.

import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

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

function norm(s: unknown): string {
  return typeof s === "string" ? s.trim() : "";
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const ip = getIP(req);

    if (req.method === "GET") {
      return safeJson(res, 200, { ok: true, hint: "POST { userText }" });
    }

    if (req.method !== "POST") {
      res.setHeader("Allow", "POST, GET");
      return safeJson(res, 405, { error: "Method Not Allowed" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return safeJson(res, 500, { error: "Missing OPENAI_API_KEY" });
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

    const body: any = req.body ?? {};

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

    const context = body.context ?? {};
    const roomTitle = norm(context.roomTitle);
    const roomId = norm(context.roomId);
    const keyword = norm(context.keyword);
    const entryId = norm(context.entryId);

    const history: Array<{ role: "user" | "assistant"; text: string }> =
      Array.isArray(body.history)
        ? body.history.slice(-6).map((m: any) => ({
            role: m?.role === "assistant" ? "assistant" : "user",
            text: norm(m?.text),
          }))
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