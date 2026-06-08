import { createClient } from "@supabase/supabase-js";
import {
  buildDeepSeekSpeakFollowUp,
  isRecord,
  norm,
  SPEAK_REPEAT_CLARIFICATION,
  toSpeakRecentTurns,
} from "../../api/_lib/deepseekSpeak";

type NetlifyEvent = {
  httpMethod: string;
  headers: Record<string, string | undefined>;
  body: string | null;
};

type NetlifyResponse = {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
};

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json; charset=utf-8",
};

function json(statusCode: number, body: unknown): NetlifyResponse {
  return {
    statusCode,
    headers,
    body: JSON.stringify(body),
  };
}

function getBearerToken(event: NetlifyEvent): string {
  const auth = event.headers.authorization || event.headers.Authorization;
  if (!auth) return "";
  const [scheme, token] = auth.split(" ");
  if (scheme !== "Bearer" || !token) return "";
  return token.trim();
}

function parseBody(event: NetlifyEvent): Record<string, unknown> {
  if (!event.body) return {};
  const parsed = JSON.parse(event.body) as unknown;
  return isRecord(parsed) ? parsed : {};
}

export async function handler(event: NetlifyEvent): Promise<NetlifyResponse> {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod === "GET") {
    return json(200, { ok: true, hint: "POST { mode: 'speak-follow-up', transcript }" });
  }

  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method Not Allowed" });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";
  if (!supabaseUrl || !supabaseAnonKey) {
    return json(500, { error: "Missing Supabase environment variables" });
  }

  const accessToken = getBearerToken(event);
  if (!accessToken) {
    return json(401, { error: "Missing bearer token" });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(accessToken);

  if (userError || !user) {
    return json(401, { error: "Unauthorized" });
  }

  let body: Record<string, unknown>;
  try {
    body = parseBody(event);
  } catch {
    return json(400, { error: "Invalid JSON" });
  }

  const mode = norm(body.mode);
  if (mode !== "speak-follow-up") {
    return json(400, { error: "Unsupported mode" });
  }

  const transcript = norm(body.transcript || body.userText || body.message || body.text);
  if (!transcript) {
    return json(400, { error: "Missing transcript" });
  }
  if (transcript.length > 1000) {
    return json(400, { error: "Input too long" });
  }

  const context = isRecord(body.context) ? body.context : {};
  const result = await buildDeepSeekSpeakFollowUp({
    transcript,
    learnerLevel: norm(context.learnerLevel) || "beginner",
    currentTopic: norm(context.currentTopic),
    recentTurns: toSpeakRecentTurns(context.recentTurns),
  });

  if (!result) {
    return json(200, {
      question: SPEAK_REPEAT_CLARIFICATION,
      provider: "local-fallback",
      fallback: true,
    });
  }

  return json(200, result);
}
