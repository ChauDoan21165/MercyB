/**
 * AI Tutor Edge Function Shell — deployable skeleton.
 *
 * Phase C — returns 503 service_disabled for all valid requests.
 * No real provider calls. No API keys. No Supabase persistence.
 *
 * When the AI tutor goes live, this shell becomes the real handler.
 * Until then, it validates requests and responds with a consistent
 * disabled-service envelope.
 */

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { redactProviderLog } from "./provider.ts";

// ─── CORS ─────────────────────────────────────────────────────────────

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

function corsResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...CORS_HEADERS,
    },
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────

function makeRequestId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `req_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }
}

const VALID_MODES = new Set([
  "general_chat",
  "sentence_correction",
  "writing_feedback",
  "pronunciation_coaching",
  "lesson_guidance",
]);

// ─── Validation ───────────────────────────────────────────────────────

type ValidationError = {
  field: string;
  reason: string;
};

function validateBody(body: Record<string, unknown>): ValidationError[] {
  const errors: ValidationError[] = [];

  // sessionId: non-empty string
  if (typeof body.sessionId !== "string" || !body.sessionId.trim()) {
    errors.push({ field: "sessionId", reason: "must be a non-empty string" });
  }

  // systemPrompt: non-empty string
  if (typeof body.systemPrompt !== "string" || !body.systemPrompt.trim()) {
    errors.push({ field: "systemPrompt", reason: "must be a non-empty string" });
  }

  // userPrompt: non-empty string
  if (typeof body.userPrompt !== "string" || !body.userPrompt.trim()) {
    errors.push({ field: "userPrompt", reason: "must be a non-empty string" });
  }

  // mode: one of 5 valid modes
  if (typeof body.mode !== "string" || !VALID_MODES.has(body.mode)) {
    errors.push({
      field: "mode",
      reason: `must be one of: ${[...VALID_MODES].join(", ")}`,
    });
  }

  return errors;
}

// ─── Main Handler ─────────────────────────────────────────────────────

serve(async (req: Request): Promise<Response> => {
  const requestId = makeRequestId();

  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: CORS_HEADERS,
    });
  }

  // Only POST is allowed for the tutor endpoint
  if (req.method !== "POST") {
    return corsResponse(405, {
      ok: false,
      errorKind: "method_not_allowed",
      requestId,
    });
  }

  // Parse JSON body
  let body: Record<string, unknown>;
  try {
    body = await req.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw new Error("Body must be a JSON object");
    }
  } catch {
    return corsResponse(400, {
      ok: false,
      errorKind: "invalid_request",
      detail: "Request body must be valid JSON object",
      requestId,
    });
  }

  // Validate fields
  const errors = validateBody(body);
  if (errors.length > 0) {
    // Log validation failure (metadata only — no prompt text)
    console.log(JSON.stringify({
      ns: "[ai-tutor]",
      event: "validation_failed",
      requestId,
      errorCount: errors.length,
      errorFields: errors.map((e) => e.field),
      // Character counts only — no prompt content
      systemPromptChars: typeof body.systemPrompt === "string" ? body.systemPrompt.length : 0,
      userPromptChars: typeof body.userPrompt === "string" ? body.userPrompt.length : 0,
    }));

    return corsResponse(400, {
      ok: false,
      errorKind: "invalid_request",
      detail: errors.map((e) => `${e.field}: ${e.reason}`).join("; "),
      requestId,
    });
  }

  // Service is disabled — return 503 for all valid requests
  // Redact any log-safe metadata before logging
  const logEntry = redactProviderLog({
    requestId,
    rawText: `sessionId=${String(body.sessionId)} mode=${String(body.mode)}`,
    inputTokens: Math.ceil(String(body.userPrompt ?? "").length / 4),
    outputTokens: 0,
    errorClass: null,
  });

  console.log(JSON.stringify({
    ns: "[ai-tutor]",
    event: "service_disabled",
    requestId,
    mode: body.mode,
    // Character counts only — no prompt content
    systemPromptChars: typeof body.systemPrompt === "string" ? body.systemPrompt.length : 0,
    userPromptChars: typeof body.userPrompt === "string" ? body.userPrompt.length : 0,
  }));

  return corsResponse(503, {
    ok: false,
    errorKind: "service_disabled",
    message: "Tính năng AI Tutor hiện chưa khả dụng. Vui lòng thử lại sau.",
    requestId,
  });
});
