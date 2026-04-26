// api/_lib/aiProvider.ts
//
// OpenAI → Gemini failover for Teacher Mercy AI calls (Vercel Node /
// ESM serverless runtime). Phase 1 — JSON-mode + plaintext-mode
// completions. Both providers share the same {ok, json/raw, provider,
// latencyMs, attempts, errorKind} envelope so callers can branch on
// provider without changing their response handling.
//
// Why a custom failover instead of openai-node + LangChain etc:
//   - The grammar.ts ESM outage that triggered this work was caused by
//     a bundled OpenAI client failing under Vercel's ESM runtime. We
//     stay on raw fetch end-to-end to keep the failure surface small.
//   - Both OpenAI and Gemini chat APIs are simple enough that the raw
//     request/response code is shorter than the integration glue would
//     have been.
//
// Failover rules (intentionally narrow):
//   Fall over only when OpenAI looks transiently broken:
//     - AbortError              (timeoutMs exceeded — default 15s)
//     - HTTP 429                (rate limit)
//     - HTTP 5xx                (upstream server error)
//     - fetch threw             (network)
//   DO NOT fall over on:
//     - HTTP 400                (caller's fault — Gemini won't fix it)
//     - HTTP 401 / 403          (auth — same)
//     - JSON parse failure      (model emitted bad JSON — return ok:false)
//   When GEMINI_API_KEY is missing we don't even attempt Gemini and
//   surface errorKind:'no_key' to make ops failures obvious.
//
// Logging: every call writes one line to stdout via console.log; failover
// transitions also emit a console.warn so they show up in Vercel's
// alert lanes.

// ── Types ────────────────────────────────────────────────────────────────

export type AiProvider = "openai" | "gemini" | "none";

export type AiErrorKind =
  | "timeout"
  | "rate_limit"
  | "upstream_error"
  | "parse_error"
  | "no_key";

export type ChatJsonResult = {
  ok: boolean;
  /** Parsed JSON object from the model. `{}` when ok=false. */
  json: Record<string, unknown>;
  /** Raw text the model returned before JSON parsing. */
  raw: string;
  provider: AiProvider;
  latencyMs: number;
  attempts: AiProvider[];
  errorKind?: AiErrorKind;
};

export type ChatTextResult = {
  ok: boolean;
  /** Plain text the model returned. */
  raw: string;
  provider: AiProvider;
  latencyMs: number;
  attempts: AiProvider[];
  errorKind?: AiErrorKind;
};

export type ChatJsonOpts = {
  systemPrompt: string;
  userMessage: string;
  timeoutMs?: number;
  openaiModel?: string;
  geminiModel?: string;
  temperature?: number;
  maxTokens?: number;
};

export type ChatTextOpts = ChatJsonOpts;

// ── Defaults ─────────────────────────────────────────────────────────────

const DEFAULT_TIMEOUT_MS = 15_000;
const DEFAULT_OPENAI_MODEL = "gpt-4o-mini";
const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";
const DEFAULT_TEMPERATURE = 0.15;
const DEFAULT_MAX_TOKENS = 800;

// ── Internal helpers ─────────────────────────────────────────────────────

/** Decision: should we fall over on this OpenAI failure? */
function shouldFailover(reason: {
  status?: number;
  isAbort?: boolean;
  threw?: boolean;
}): boolean {
  if (reason.isAbort) return true;
  if (reason.threw) return true;
  if (typeof reason.status === "number") {
    if (reason.status === 429) return true;
    if (reason.status >= 500) return true;
  }
  return false;
}

function errorKindFor(reason: {
  status?: number;
  isAbort?: boolean;
  threw?: boolean;
}): AiErrorKind {
  if (reason.isAbort) return "timeout";
  if (typeof reason.status === "number" && reason.status === 429) return "rate_limit";
  return "upstream_error";
}

// ── OpenAI calls (JSON + text) ───────────────────────────────────────────

type OpenAiOutcome =
  | { kind: "ok"; raw: string }
  | { kind: "fail"; status?: number; isAbort?: boolean; threw?: boolean };

async function callOpenAi(
  opts: ChatJsonOpts,
  jsonMode: boolean,
  signal: AbortSignal,
): Promise<OpenAiOutcome> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { kind: "fail", status: 401 };
  }

  const body: Record<string, unknown> = {
    model: opts.openaiModel ?? DEFAULT_OPENAI_MODEL,
    temperature: opts.temperature ?? DEFAULT_TEMPERATURE,
    max_tokens: opts.maxTokens ?? DEFAULT_MAX_TOKENS,
    messages: [
      { role: "system", content: opts.systemPrompt },
      { role: "user", content: opts.userMessage },
    ],
  };
  if (jsonMode) {
    body.response_format = { type: "json_object" };
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal,
    });

    if (!response.ok) {
      return { kind: "fail", status: response.status };
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const raw = data?.choices?.[0]?.message?.content ?? "";
    return { kind: "ok", raw };
  } catch (err) {
    const isAbort = err instanceof Error && err.name === "AbortError";
    return { kind: "fail", isAbort, threw: !isAbort };
  }
}

// ── Gemini calls (JSON + text) ───────────────────────────────────────────

type GeminiOutcome =
  | { kind: "ok"; raw: string }
  | { kind: "fail"; status?: number; isAbort?: boolean; threw?: boolean };

async function callGemini(
  opts: ChatJsonOpts,
  jsonMode: boolean,
  signal: AbortSignal,
): Promise<GeminiOutcome> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { kind: "fail", status: 401 };
  }

  const model = opts.geminiModel ?? DEFAULT_GEMINI_MODEL;
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent` +
    `?key=${encodeURIComponent(apiKey)}`;

  const generationConfig: Record<string, unknown> = {
    temperature: opts.temperature ?? DEFAULT_TEMPERATURE,
    maxOutputTokens: opts.maxTokens ?? DEFAULT_MAX_TOKENS,
  };
  if (jsonMode) {
    generationConfig.responseMimeType = "application/json";
  }

  const body = {
    contents: [
      { role: "user", parts: [{ text: opts.userMessage }] },
    ],
    systemInstruction: {
      parts: [{ text: opts.systemPrompt }],
    },
    generationConfig,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });

    if (!response.ok) {
      return { kind: "fail", status: response.status };
    }

    const data = (await response.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
    };
    const parts = data?.candidates?.[0]?.content?.parts;
    const raw = Array.isArray(parts)
      ? parts.map((p) => p?.text ?? "").join("")
      : "";
    return { kind: "ok", raw };
  } catch (err) {
    const isAbort = err instanceof Error && err.name === "AbortError";
    return { kind: "fail", isAbort, threw: !isAbort };
  }
}

// ── Public API ───────────────────────────────────────────────────────────

export async function chatJsonWithFailover(
  opts: ChatJsonOpts,
): Promise<ChatJsonResult> {
  const startedAt = Date.now();
  const attempts: AiProvider[] = [];
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  // OpenAI attempt with its own AbortController.
  const openaiController = new AbortController();
  const openaiTimeout = setTimeout(() => openaiController.abort(), timeoutMs);
  attempts.push("openai");
  let openaiOutcome: OpenAiOutcome;
  try {
    openaiOutcome = await callOpenAi(opts, true, openaiController.signal);
  } finally {
    clearTimeout(openaiTimeout);
  }

  if (openaiOutcome.kind === "ok") {
    const parseResult = parseJson(openaiOutcome.raw);
    const latencyMs = Date.now() - startedAt;
    if (parseResult.ok) {
      console.log(
        `[aiProvider] provider=openai latencyMs=${latencyMs} attempts=[${attempts.join(",")}]`,
      );
      return {
        ok: true,
        json: parseResult.value,
        raw: openaiOutcome.raw,
        provider: "openai",
        latencyMs,
        attempts,
      };
    }
    // OpenAI returned 200 but the model emitted invalid JSON. Per spec
    // we do NOT fall over (Gemini won't reliably fix that), and surface
    // parse_error for the caller.
    console.log(
      `[aiProvider] provider=openai latencyMs=${latencyMs} attempts=[${attempts.join(",")}] errorKind=parse_error`,
    );
    return {
      ok: false,
      json: {},
      raw: openaiOutcome.raw,
      provider: "openai",
      latencyMs,
      attempts,
      errorKind: "parse_error",
    };
  }

  // OpenAI failed. Decide whether to fall over.
  if (!shouldFailover(openaiOutcome)) {
    const latencyMs = Date.now() - startedAt;
    const errorKind = errorKindFor(openaiOutcome);
    console.log(
      `[aiProvider] provider=none latencyMs=${latencyMs} attempts=[${attempts.join(",")}] errorKind=${errorKind}`,
    );
    return {
      ok: false,
      json: {},
      raw: "",
      provider: "none",
      latencyMs,
      attempts,
      errorKind,
    };
  }

  // No GEMINI_API_KEY → don't attempt Gemini; surface 'no_key'.
  if (!process.env.GEMINI_API_KEY) {
    const latencyMs = Date.now() - startedAt;
    console.warn(
      `[aiProvider] failover skipped: GEMINI_API_KEY missing latencyMs=${latencyMs} attempts=[${attempts.join(",")}]`,
    );
    return {
      ok: false,
      json: {},
      raw: "",
      provider: "none",
      latencyMs,
      attempts,
      errorKind: "no_key",
    };
  }

  // Failover to Gemini with its own (fresh) AbortController + timeout.
  console.warn(
    `[aiProvider] OpenAI failed (${describeFail(openaiOutcome)}) — failing over to Gemini`,
  );
  const geminiController = new AbortController();
  const geminiTimeout = setTimeout(() => geminiController.abort(), timeoutMs);
  attempts.push("gemini");
  let geminiOutcome: GeminiOutcome;
  try {
    geminiOutcome = await callGemini(opts, true, geminiController.signal);
  } finally {
    clearTimeout(geminiTimeout);
  }

  if (geminiOutcome.kind === "ok") {
    const parseResult = parseJson(geminiOutcome.raw);
    const latencyMs = Date.now() - startedAt;
    if (parseResult.ok) {
      console.log(
        `[aiProvider] provider=gemini latencyMs=${latencyMs} attempts=[${attempts.join(",")}]`,
      );
      return {
        ok: true,
        json: parseResult.value,
        raw: geminiOutcome.raw,
        provider: "gemini",
        latencyMs,
        attempts,
      };
    }
    console.log(
      `[aiProvider] provider=gemini latencyMs=${latencyMs} attempts=[${attempts.join(",")}] errorKind=parse_error`,
    );
    return {
      ok: false,
      json: {},
      raw: geminiOutcome.raw,
      provider: "gemini",
      latencyMs,
      attempts,
      errorKind: "parse_error",
    };
  }

  // Both failed. Surface the WORSE-of-the-two error kind (Gemini's, since
  // it was the last attempt).
  const latencyMs = Date.now() - startedAt;
  const errorKind = errorKindFor(geminiOutcome);
  console.log(
    `[aiProvider] provider=none latencyMs=${latencyMs} attempts=[${attempts.join(",")}] errorKind=${errorKind}`,
  );
  return {
    ok: false,
    json: {},
    raw: "",
    provider: "none",
    latencyMs,
    attempts,
    errorKind,
  };
}

export async function chatTextWithFailover(
  opts: ChatTextOpts,
): Promise<ChatTextResult> {
  const startedAt = Date.now();
  const attempts: AiProvider[] = [];
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  const openaiController = new AbortController();
  const openaiTimeout = setTimeout(() => openaiController.abort(), timeoutMs);
  attempts.push("openai");
  let openaiOutcome: OpenAiOutcome;
  try {
    openaiOutcome = await callOpenAi(opts, false, openaiController.signal);
  } finally {
    clearTimeout(openaiTimeout);
  }

  if (openaiOutcome.kind === "ok") {
    const latencyMs = Date.now() - startedAt;
    console.log(
      `[aiProvider] provider=openai latencyMs=${latencyMs} attempts=[${attempts.join(",")}]`,
    );
    return {
      ok: true,
      raw: openaiOutcome.raw,
      provider: "openai",
      latencyMs,
      attempts,
    };
  }

  if (!shouldFailover(openaiOutcome)) {
    const latencyMs = Date.now() - startedAt;
    const errorKind = errorKindFor(openaiOutcome);
    console.log(
      `[aiProvider] provider=none latencyMs=${latencyMs} attempts=[${attempts.join(",")}] errorKind=${errorKind}`,
    );
    return {
      ok: false,
      raw: "",
      provider: "none",
      latencyMs,
      attempts,
      errorKind,
    };
  }

  if (!process.env.GEMINI_API_KEY) {
    const latencyMs = Date.now() - startedAt;
    console.warn(
      `[aiProvider] failover skipped: GEMINI_API_KEY missing latencyMs=${latencyMs} attempts=[${attempts.join(",")}]`,
    );
    return {
      ok: false,
      raw: "",
      provider: "none",
      latencyMs,
      attempts,
      errorKind: "no_key",
    };
  }

  console.warn(
    `[aiProvider] OpenAI failed (${describeFail(openaiOutcome)}) — failing over to Gemini`,
  );
  const geminiController = new AbortController();
  const geminiTimeout = setTimeout(() => geminiController.abort(), timeoutMs);
  attempts.push("gemini");
  let geminiOutcome: GeminiOutcome;
  try {
    geminiOutcome = await callGemini(opts, false, geminiController.signal);
  } finally {
    clearTimeout(geminiTimeout);
  }

  if (geminiOutcome.kind === "ok") {
    const latencyMs = Date.now() - startedAt;
    console.log(
      `[aiProvider] provider=gemini latencyMs=${latencyMs} attempts=[${attempts.join(",")}]`,
    );
    return {
      ok: true,
      raw: geminiOutcome.raw,
      provider: "gemini",
      latencyMs,
      attempts,
    };
  }

  const latencyMs = Date.now() - startedAt;
  const errorKind = errorKindFor(geminiOutcome);
  console.log(
    `[aiProvider] provider=none latencyMs=${latencyMs} attempts=[${attempts.join(",")}] errorKind=${errorKind}`,
  );
  return {
    ok: false,
    raw: "",
    provider: "none",
    latencyMs,
    attempts,
    errorKind,
  };
}

// ── Small helpers ────────────────────────────────────────────────────────

function parseJson(
  raw: string,
):
  | { ok: true; value: Record<string, unknown> }
  | { ok: false } {
  try {
    const value = JSON.parse(raw);
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return { ok: true, value: value as Record<string, unknown> };
    }
    return { ok: false };
  } catch {
    return { ok: false };
  }
}

function describeFail(outcome: { status?: number; isAbort?: boolean; threw?: boolean }): string {
  if (outcome.isAbort) return "timeout";
  if (outcome.threw) return "network/throw";
  if (typeof outcome.status === "number") return `HTTP ${outcome.status}`;
  return "unknown";
}
