// api/_lib/aiProvider.ts
//
// Ordered OpenAI / DeepSeek / Gemini failover for Teacher Mercy AI calls (Vercel Node /
// ESM serverless runtime). Phase 1 — JSON-mode + plaintext-mode
// completions. Providers share the same {ok, json/raw, provider,
// latencyMs, attempts, errorKind} envelope so callers can branch on
// provider without changing their response handling.
//
// Why a custom failover instead of openai-node + LangChain etc:
//   - The grammar.ts ESM outage that triggered this work was caused by
//     a bundled OpenAI client failing under Vercel's ESM runtime. We
//     stay on raw fetch end-to-end to keep the failure surface small.
//   - OpenAI, DeepSeek, and Gemini chat APIs are simple enough that the raw
//     request/response code is shorter than the integration glue would
//     have been.
//
// Failover rules (intentionally narrow):
//   Fall over only when the selected provider looks transiently broken:
//     - AbortError              (timeoutMs exceeded — default 15s)
//     - HTTP 429                (rate limit)
//     - HTTP 5xx                (upstream server error)
//     - fetch threw             (network)
//   DO NOT fall over on:
//     - HTTP 400                (caller's fault — another provider won't fix it)
//     - HTTP 401 / 403          (auth — same)
//     - JSON parse failure      (model emitted bad JSON — return ok:false)
//   When a configured provider key is missing we don't attempt that provider and
//   surface errorKind:'no_key' to make ops failures obvious.
//
// Logging: every call writes one line to stdout via console.log; failover
// transitions also emit a console.warn so they show up in Vercel's
// alert lanes.

// ── Types ────────────────────────────────────────────────────────────────

export type AiProvider = "openai" | "deepseek" | "gemini" | "none";
export type ConfiguredAiProvider = Exclude<AiProvider, "none">;

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
  deepseekModel?: string;
  geminiModel?: string;
  providerOrder?: readonly ConfiguredAiProvider[] | string;
  temperature?: number;
  maxTokens?: number;
};

export type ChatTextOpts = ChatJsonOpts;

// ── Defaults ─────────────────────────────────────────────────────────────

const DEFAULT_TIMEOUT_MS = 15_000;
const DEFAULT_OPENAI_MODEL = "gpt-4o-mini";
const DEFAULT_DEEPSEEK_MODEL = "deepseek-chat";
const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";
const DEFAULT_TEMPERATURE = 0.15;
const DEFAULT_MAX_TOKENS = 800;
const DEFAULT_PROVIDER_ORDER: readonly ConfiguredAiProvider[] = ["openai", "gemini"];

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

// ── DeepSeek calls (OpenAI-compatible JSON + text) ───────────────────────

type DeepSeekOutcome =
  | { kind: "ok"; raw: string }
  | { kind: "fail"; status?: number; isAbort?: boolean; threw?: boolean };

async function callDeepSeek(
  opts: ChatJsonOpts,
  jsonMode: boolean,
  signal: AbortSignal,
): Promise<DeepSeekOutcome> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return { kind: "fail", status: 401 };
  }

  const body: Record<string, unknown> = {
    model: opts.deepseekModel ?? DEFAULT_DEEPSEEK_MODEL,
    temperature: opts.temperature ?? DEFAULT_TEMPERATURE,
    max_tokens: opts.maxTokens ?? DEFAULT_MAX_TOKENS,
    stream: false,
    messages: [
      { role: "system", content: opts.systemPrompt },
      { role: "user", content: opts.userMessage },
    ],
  };
  if (jsonMode) {
    body.response_format = { type: "json_object" };
  }

  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
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
  const providerOrder = normalizeProviderOrder(opts.providerOrder);
  let lastOutcome:
    | OpenAiOutcome
    | DeepSeekOutcome
    | GeminiOutcome
    | null = null;
  let missingFallbackAfterFailure = false;

  for (const provider of providerOrder) {
    if (!hasProviderKey(provider)) {
      if (lastOutcome) missingFallbackAfterFailure = true;
      continue;
    }
    missingFallbackAfterFailure = false;
    if (lastOutcome) {
      console.warn(
        `[aiProvider] ${attempts[attempts.length - 1] ?? "provider"} failed (${describeFail(lastOutcome)}) — failing over to ${provider}`,
      );
    }

    attempts.push(provider);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    let outcome: OpenAiOutcome | DeepSeekOutcome | GeminiOutcome;
    try {
      outcome = await callConfiguredProvider(provider, opts, true, controller.signal);
    } finally {
      clearTimeout(timeout);
    }

    if (outcome.kind === "ok") {
      const parseResult = parseJson(outcome.raw);
      const latencyMs = Date.now() - startedAt;
      if (parseResult.ok) {
        console.log(
          `[aiProvider] provider=${provider} latencyMs=${latencyMs} attempts=[${attempts.join(",")}]`,
        );
        return {
          ok: true,
          json: parseResult.value,
          raw: outcome.raw,
          provider,
          latencyMs,
          attempts,
        };
      }
      console.log(
        `[aiProvider] provider=${provider} latencyMs=${latencyMs} attempts=[${attempts.join(",")}] errorKind=parse_error`,
      );
      return {
        ok: false,
        json: {},
        raw: outcome.raw,
        provider,
        latencyMs,
        attempts,
        errorKind: "parse_error",
      };
    }

    lastOutcome = outcome;
    if (!shouldFailover(outcome)) {
      const latencyMs = Date.now() - startedAt;
      const errorKind = errorKindFor(outcome);
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
  }

  const latencyMs = Date.now() - startedAt;
  const errorKind = lastOutcome && !missingFallbackAfterFailure
    ? errorKindFor(lastOutcome)
    : "no_key";
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
  const providerOrder = normalizeProviderOrder(opts.providerOrder);
  let lastOutcome:
    | OpenAiOutcome
    | DeepSeekOutcome
    | GeminiOutcome
    | null = null;
  let missingFallbackAfterFailure = false;

  for (const provider of providerOrder) {
    if (!hasProviderKey(provider)) {
      if (lastOutcome) missingFallbackAfterFailure = true;
      continue;
    }
    missingFallbackAfterFailure = false;
    if (lastOutcome) {
      console.warn(
        `[aiProvider] ${attempts[attempts.length - 1] ?? "provider"} failed (${describeFail(lastOutcome)}) — failing over to ${provider}`,
      );
    }

    attempts.push(provider);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    let outcome: OpenAiOutcome | DeepSeekOutcome | GeminiOutcome;
    try {
      outcome = await callConfiguredProvider(provider, opts, false, controller.signal);
    } finally {
      clearTimeout(timeout);
    }

    if (outcome.kind === "ok") {
      const latencyMs = Date.now() - startedAt;
      console.log(
        `[aiProvider] provider=${provider} latencyMs=${latencyMs} attempts=[${attempts.join(",")}]`,
      );
      return {
        ok: true,
        raw: outcome.raw,
        provider,
        latencyMs,
        attempts,
      };
    }

    lastOutcome = outcome;
    if (!shouldFailover(outcome)) {
      const latencyMs = Date.now() - startedAt;
      const errorKind = errorKindFor(outcome);
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
  }

  const latencyMs = Date.now() - startedAt;
  const errorKind = lastOutcome && !missingFallbackAfterFailure
    ? errorKindFor(lastOutcome)
    : "no_key";
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

function normalizeProviderOrder(
  value: ChatJsonOpts["providerOrder"],
): ConfiguredAiProvider[] {
  const raw = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : DEFAULT_PROVIDER_ORDER;
  const seen = new Set<ConfiguredAiProvider>();
  const order: ConfiguredAiProvider[] = [];
  for (const entry of raw) {
    const provider = String(entry).trim().toLowerCase();
    if (
      (provider === "openai" || provider === "deepseek" || provider === "gemini") &&
      !seen.has(provider)
    ) {
      seen.add(provider);
      order.push(provider);
    }
  }
  return order.length ? order : [...DEFAULT_PROVIDER_ORDER];
}

function hasProviderKey(provider: ConfiguredAiProvider): boolean {
  if (provider === "openai") return Boolean(process.env.OPENAI_API_KEY);
  if (provider === "deepseek") return Boolean(process.env.DEEPSEEK_API_KEY);
  return Boolean(process.env.GEMINI_API_KEY);
}

function callConfiguredProvider(
  provider: ConfiguredAiProvider,
  opts: ChatJsonOpts,
  jsonMode: boolean,
  signal: AbortSignal,
): Promise<OpenAiOutcome | DeepSeekOutcome | GeminiOutcome> {
  if (provider === "openai") return callOpenAi(opts, jsonMode, signal);
  if (provider === "deepseek") return callDeepSeek(opts, jsonMode, signal);
  return callGemini(opts, jsonMode, signal);
}

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
