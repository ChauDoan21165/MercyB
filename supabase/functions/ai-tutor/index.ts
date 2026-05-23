/**
 * AI Tutor Edge Function Shell — deployable skeleton.
 *
 * Phase C — returns 503 service_disabled for all valid requests.
 * Phase D2 — wired to the D1 disabled provider execution adapter.
 *
 * No real provider calls. No API keys. No Supabase persistence.
 *
 * When the AI tutor goes live, this shell becomes the real handler.
 * Until then, it validates requests and returns a consistent
 * disabled-service envelope via executeProviderCall.
 */

import {
  executeProviderCall,
  buildProviderRequest,
} from "./provider.ts";
import type { ProviderExecutionRequest } from "./provider.ts";

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

/**
 * Handle an incoming AI Tutor request.
 *
 * Exported so vitest can import and test it directly.
 * In the deployed Deno edge function, serve() calls this handler.
 */
export async function handleRequest(req: Request): Promise<Response> {
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

  // ── Phase D2: Build provider execution request from validated body ──

  const providerRequest = buildProviderRequest({
    systemPrompt: body.systemPrompt as string,
    messages: [{ role: "user" as const, content: body.userPrompt as string }],
  });

  const execRequest: ProviderExecutionRequest = {
    sessionId: body.sessionId as string,
    providerRequest,
    mode: body.mode as string,
    requestId,
  };

  // Execute via the D1 disabled adapter — always returns disabled
  const result = executeProviderCall(execRequest);

  // Log the event (character counts only — no prompt content)
  console.log(JSON.stringify({
    ns: "[ai-tutor]",
    event: "service_disabled",
    requestId,
    mode: body.mode,
    // Character counts only — no prompt content
    systemPromptChars: (body.systemPrompt as string).length,
    userPromptChars: (body.userPrompt as string).length,
  }));

  // Map adapter result to current response shape
  return corsResponse(503, {
    ok: false,
    errorKind: "service_disabled",
    message: result.messageVi,
    requestId,
  });
}

// ─── Start server (Deno runtime only) ────────────────────────────────
// The conditional guard prevents vitest/Node.js from attempting to resolve
// the Deno-specific HTTPS import. In Deno, `Deno` is a defined global.
if (typeof Deno !== "undefined") {
  const { serve } = await import("https://deno.land/std@0.224.0/http/server.ts");
  serve(handleRequest);
}
