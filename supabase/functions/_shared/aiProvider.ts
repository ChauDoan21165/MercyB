// supabase/functions/_shared/aiProvider.ts
//
// Ordered OpenAI / DeepSeek / Gemini failover for Teacher Mercy Edge
// Functions (Deno). Mirrors api/_lib/aiProvider.ts (Vercel) but uses
// Deno.env and Deno's built-in fetch. Callers: ai-chat (streaming),
// mercy-guide / placement / writing-feedback (JSON mode). The text-mode
// helper exists for any future caller that wants free-form text without
// JSON mode.
//
// Design parity with the Vercel module is intentional — the failover
// rules + log format must match so the two surfaces are easy to
// correlate in dashboards.
//
// Per-surface provider order:
//   Callers pass `providerOrder` (array or comma-string, e.g.
//   ["deepseek","openai","gemini"] or "openai,deepseek,gemini") to choose
//   which providers to try and in what order. Default is ["openai","gemini"]
//   so existing callers behave exactly as before — DeepSeek is opt-in.
//   A provider whose API key is absent is skipped (no attempt, graceful
//   degradation) and the next configured provider is tried instead.
//   DeepSeek uses the OpenAI-compatible /chat/completions API
//   (env DEEPSEEK_API_KEY); its streaming SSE is OpenAI-shaped so it
//   passes through untranslated, unlike Gemini.
//
// Streaming (streamChatWithFailover):
//   The streaming variant fails over ONLY at connection-establishment
//   time. Once OpenAI starts emitting bytes we are committed; we do
//   not try to mid-stream switch (would require buffering then
//   replaying or telling the client to reconnect, both of which break
//   user-visible behaviour). Gemini's streaming SSE format differs
//   from OpenAI's — we translate Gemini chunks into OpenAI-shaped
//   chunks so the client and the existing consumeOpenAiSseStream
//   parser keep working unchanged.

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
  json: Record<string, unknown>;
  raw: string;
  provider: AiProvider;
  latencyMs: number;
  attempts: AiProvider[];
  errorKind?: AiErrorKind;
};

export type ChatTextResult = {
  ok: boolean;
  raw: string;
  provider: AiProvider;
  latencyMs: number;
  attempts: AiProvider[];
  errorKind?: AiErrorKind;
};

export type ChatJsonOpts = {
  systemPrompt: string;
  userMessage: string;
  /** Optional history to feed to the chat. The provider module turns
   *  these into provider-appropriate shapes. */
  messages?: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  timeoutMs?: number;
  openaiModel?: string;
  deepseekModel?: string;
  geminiModel?: string;
  /** Per-surface provider order. Array or comma-string. Unknown/duplicate
   *  entries are dropped; empty/undefined falls back to DEFAULT_PROVIDER_ORDER. */
  providerOrder?: readonly ConfiguredAiProvider[] | string;
  temperature?: number;
  maxTokens?: number;
};

export type ChatTextOpts = ChatJsonOpts;

export type StreamChatOpts = ChatTextOpts & {
  /** Whether the client wants `stream_options: { include_usage: true }`.
   *  Only honoured on OpenAI; Gemini's translated SSE includes a
   *  best-effort usage chunk at the end when its response carries one. */
  includeUsage?: boolean;
};

export type StreamChatResult = {
  /** ReadableStream emitting OpenAI-format SSE bytes. The consumer
   *  shouldn't have to know which provider answered. */
  body: ReadableStream<Uint8Array>;
  provider: AiProvider;
  /** [openai] when OpenAI answered, [openai, gemini] when failover happened. */
  attempts: AiProvider[];
};

export type StreamChatError = {
  ok: false;
  errorKind: AiErrorKind;
  attempts: AiProvider[];
  latencyMs: number;
};

// ── Defaults ─────────────────────────────────────────────────────────────

const DEFAULT_TIMEOUT_MS = 15_000;
const DEFAULT_OPENAI_MODEL = "gpt-4o-mini";
const DEFAULT_DEEPSEEK_MODEL = "deepseek-chat";
const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";
const DEFAULT_TEMPERATURE = 0.15;
const DEFAULT_MAX_TOKENS = 800;
const DEFAULT_PROVIDER_ORDER: readonly ConfiguredAiProvider[] = ["openai", "gemini"];

// ── Failover-decision helpers (shared) ───────────────────────────────────

type Outcome =
  | { kind: "ok"; raw: string }
  | { kind: "ok-stream"; body: ReadableStream<Uint8Array> }
  | { kind: "fail"; status?: number; isAbort?: boolean; threw?: boolean };

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

function describeFail(o: { status?: number; isAbort?: boolean; threw?: boolean }): string {
  if (o.isAbort) return "timeout";
  if (o.threw) return "network/throw";
  if (typeof o.status === "number") return `HTTP ${o.status}`;
  return "unknown";
}

// ── OpenAI calls ─────────────────────────────────────────────────────────

function buildOpenAiMessages(opts: ChatJsonOpts) {
  if (Array.isArray(opts.messages) && opts.messages.length > 0) {
    return opts.messages;
  }
  return [
    { role: "system" as const, content: opts.systemPrompt },
    { role: "user" as const, content: opts.userMessage },
  ];
}

async function callOpenAi(
  opts: ChatJsonOpts,
  jsonMode: boolean,
  signal: AbortSignal,
): Promise<Outcome> {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) return { kind: "fail", status: 401 };

  const body: Record<string, unknown> = {
    model: opts.openaiModel ?? DEFAULT_OPENAI_MODEL,
    temperature: opts.temperature ?? DEFAULT_TEMPERATURE,
    max_tokens: opts.maxTokens ?? DEFAULT_MAX_TOKENS,
    messages: buildOpenAiMessages(opts),
  };
  if (jsonMode) body.response_format = { type: "json_object" };

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
    if (!response.ok) return { kind: "fail", status: response.status };

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

async function callOpenAiStream(
  opts: StreamChatOpts,
  signal: AbortSignal,
): Promise<Outcome> {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) return { kind: "fail", status: 401 };

  const body: Record<string, unknown> = {
    model: opts.openaiModel ?? DEFAULT_OPENAI_MODEL,
    temperature: opts.temperature ?? DEFAULT_TEMPERATURE,
    max_tokens: opts.maxTokens ?? DEFAULT_MAX_TOKENS,
    messages: buildOpenAiMessages(opts),
    stream: true,
  };
  if (opts.includeUsage) {
    body.stream_options = { include_usage: true };
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
    if (!response.ok) return { kind: "fail", status: response.status };
    if (!response.body) return { kind: "fail", status: 502 };
    return { kind: "ok-stream", body: response.body };
  } catch (err) {
    const isAbort = err instanceof Error && err.name === "AbortError";
    return { kind: "fail", isAbort, threw: !isAbort };
  }
}

// ── DeepSeek calls (OpenAI-compatible JSON + text + stream) ──────────────
//
// DeepSeek's /chat/completions API matches OpenAI's request/response and
// SSE shape, so we reuse buildOpenAiMessages and the same passthrough as
// callOpenAiStream — no Gemini-style translation needed.

async function callDeepSeek(
  opts: ChatJsonOpts,
  jsonMode: boolean,
  signal: AbortSignal,
): Promise<Outcome> {
  const apiKey = Deno.env.get("DEEPSEEK_API_KEY");
  if (!apiKey) return { kind: "fail", status: 401 };

  const body: Record<string, unknown> = {
    model: opts.deepseekModel ?? DEFAULT_DEEPSEEK_MODEL,
    temperature: opts.temperature ?? DEFAULT_TEMPERATURE,
    max_tokens: opts.maxTokens ?? DEFAULT_MAX_TOKENS,
    stream: false,
    messages: buildOpenAiMessages(opts),
  };
  if (jsonMode) body.response_format = { type: "json_object" };

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
    if (!response.ok) return { kind: "fail", status: response.status };

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

async function callDeepSeekStream(
  opts: StreamChatOpts,
  signal: AbortSignal,
): Promise<Outcome> {
  const apiKey = Deno.env.get("DEEPSEEK_API_KEY");
  if (!apiKey) return { kind: "fail", status: 401 };

  const body: Record<string, unknown> = {
    model: opts.deepseekModel ?? DEFAULT_DEEPSEEK_MODEL,
    temperature: opts.temperature ?? DEFAULT_TEMPERATURE,
    max_tokens: opts.maxTokens ?? DEFAULT_MAX_TOKENS,
    messages: buildOpenAiMessages(opts),
    stream: true,
  };
  if (opts.includeUsage) {
    body.stream_options = { include_usage: true };
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
    if (!response.ok) return { kind: "fail", status: response.status };
    if (!response.body) return { kind: "fail", status: 502 };
    return { kind: "ok-stream", body: response.body };
  } catch (err) {
    const isAbort = err instanceof Error && err.name === "AbortError";
    return { kind: "fail", isAbort, threw: !isAbort };
  }
}

// ── Gemini calls ─────────────────────────────────────────────────────────

function buildGeminiContents(opts: ChatJsonOpts) {
  // Gemini uses { role: "user" | "model", parts: [{text}] }. System
  // prompt is a separate field. We map provided messages onto that
  // shape; "assistant" → "model".
  if (Array.isArray(opts.messages) && opts.messages.length > 0) {
    return opts.messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));
  }
  return [{ role: "user", parts: [{ text: opts.userMessage }] }];
}

function geminiSystemText(opts: ChatJsonOpts): string {
  if (Array.isArray(opts.messages) && opts.messages.length > 0) {
    const sys = opts.messages.find((m) => m.role === "system");
    if (sys) return sys.content;
  }
  return opts.systemPrompt;
}

async function callGemini(
  opts: ChatJsonOpts,
  jsonMode: boolean,
  signal: AbortSignal,
): Promise<Outcome> {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) return { kind: "fail", status: 401 };

  const model = opts.geminiModel ?? DEFAULT_GEMINI_MODEL;
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent` +
    `?key=${encodeURIComponent(apiKey)}`;

  const generationConfig: Record<string, unknown> = {
    temperature: opts.temperature ?? DEFAULT_TEMPERATURE,
    maxOutputTokens: opts.maxTokens ?? DEFAULT_MAX_TOKENS,
  };
  if (jsonMode) generationConfig.responseMimeType = "application/json";

  const body = {
    contents: buildGeminiContents(opts),
    systemInstruction: { parts: [{ text: geminiSystemText(opts) }] },
    generationConfig,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });
    if (!response.ok) return { kind: "fail", status: response.status };

    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
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

async function callGeminiStream(
  opts: StreamChatOpts,
  signal: AbortSignal,
): Promise<Outcome> {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) return { kind: "fail", status: 401 };

  const model = opts.geminiModel ?? DEFAULT_GEMINI_MODEL;
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent` +
    `?alt=sse&key=${encodeURIComponent(apiKey)}`;

  const body = {
    contents: buildGeminiContents(opts),
    systemInstruction: { parts: [{ text: geminiSystemText(opts) }] },
    generationConfig: {
      temperature: opts.temperature ?? DEFAULT_TEMPERATURE,
      maxOutputTokens: opts.maxTokens ?? DEFAULT_MAX_TOKENS,
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });
    if (!response.ok) return { kind: "fail", status: response.status };
    if (!response.body) return { kind: "fail", status: 502 };

    const translated = translateGeminiSseToOpenAi(response.body, model);
    return { kind: "ok-stream", body: translated };
  } catch (err) {
    const isAbort = err instanceof Error && err.name === "AbortError";
    return { kind: "fail", isAbort, threw: !isAbort };
  }
}

// ── Gemini → OpenAI SSE translation ──────────────────────────────────────
//
// OpenAI delta chunk shape:
//   data: {"id":"...","object":"chat.completion.chunk","created":...,
//          "model":"...","choices":[{"index":0,"delta":{"content":"x"},
//          "finish_reason":null}]}
//   ...
//   data: [DONE]
//
// Gemini stream chunk shape (with ?alt=sse):
//   data: {"candidates":[{"content":{"parts":[{"text":"x"}]}}],
//          "usageMetadata":{"promptTokenCount":N,"candidatesTokenCount":M}}
//
// We translate part-by-part: each Gemini chunk becomes one OpenAI delta
// chunk carrying the same text. usageMetadata at the end is mapped to
// OpenAI's `usage` field on the final chunk so the existing cost
// pipeline still picks it up.

function translateGeminiSseToOpenAi(
  source: ReadableStream<Uint8Array>,
  model: string,
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const baseId = `gemini-${Date.now()}`;
  const created = Math.floor(Date.now() / 1000);

  let buffer = "";

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = source.getReader();
      let lastUsage: { promptTokens: number; completionTokens: number } | null = null;

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          while (true) {
            const newlineIndex = buffer.indexOf("\n");
            if (newlineIndex === -1) break;
            const rawLine = buffer.slice(0, newlineIndex);
            buffer = buffer.slice(newlineIndex + 1);

            const line = rawLine.replace(/\r$/, "").trim();
            if (!line.startsWith("data:")) continue;
            const payload = line.slice(5).trim();
            if (!payload) continue;

            try {
              const parsed = JSON.parse(payload) as {
                candidates?: Array<{
                  content?: { parts?: Array<{ text?: string }> };
                  finishReason?: string;
                }>;
                usageMetadata?: {
                  promptTokenCount?: number;
                  candidatesTokenCount?: number;
                };
              };

              if (parsed.usageMetadata) {
                lastUsage = {
                  promptTokens: parsed.usageMetadata.promptTokenCount ?? 0,
                  completionTokens:
                    parsed.usageMetadata.candidatesTokenCount ?? 0,
                };
              }

              const candidate = parsed.candidates?.[0];
              const text = candidate?.content?.parts
                ?.map((p) => p.text ?? "")
                .join("") ?? "";
              const finish = candidate?.finishReason
                ? mapGeminiFinish(candidate.finishReason)
                : null;

              if (text) {
                const chunk = {
                  id: baseId,
                  object: "chat.completion.chunk",
                  created,
                  model,
                  choices: [
                    {
                      index: 0,
                      delta: { content: text },
                      finish_reason: null,
                    },
                  ],
                };
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`),
                );
              }

              if (finish) {
                const chunk = {
                  id: baseId,
                  object: "chat.completion.chunk",
                  created,
                  model,
                  choices: [
                    {
                      index: 0,
                      delta: {},
                      finish_reason: finish,
                    },
                  ],
                };
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`),
                );
              }
            } catch {
              // ignore malformed Gemini chunk
            }
          }
        }

        // Flush a final usage chunk so cost tracking sees prompt/completion
        // counts in the same place OpenAI puts them.
        if (lastUsage) {
          const chunk = {
            id: baseId,
            object: "chat.completion.chunk",
            created,
            model,
            choices: [],
            usage: {
              prompt_tokens: lastUsage.promptTokens,
              completion_tokens: lastUsage.completionTokens,
              total_tokens:
                lastUsage.promptTokens + lastUsage.completionTokens,
            },
          };
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`),
          );
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });
}

function mapGeminiFinish(reason: string): string {
  switch (reason.toUpperCase()) {
    case "STOP":
      return "stop";
    case "MAX_TOKENS":
      return "length";
    case "SAFETY":
    case "RECITATION":
      return "content_filter";
    default:
      return "stop";
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
  let lastOutcome: Outcome | null = null;
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
    let outcome: Outcome;
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
  let lastOutcome: Outcome | null = null;
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
    let outcome: Outcome;
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

/**
 * Streaming variant. Returns OpenAI-format SSE bytes regardless of which
 * provider answered (Gemini chunks are translated). Failover is at
 * connection-establishment time only — once the body is flowing we are
 * committed to that provider for the rest of the response.
 */
export async function streamChatWithFailover(
  opts: StreamChatOpts,
): Promise<StreamChatResult | StreamChatError> {
  const startedAt = Date.now();
  const attempts: AiProvider[] = [];
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const providerOrder = normalizeProviderOrder(opts.providerOrder);
  let lastOutcome: Outcome | null = null;
  let missingFallbackAfterFailure = false;

  for (const provider of providerOrder) {
    if (!hasProviderKey(provider)) {
      if (lastOutcome) missingFallbackAfterFailure = true;
      continue;
    }
    missingFallbackAfterFailure = false;
    if (lastOutcome) {
      console.warn(
        `[aiProvider] (stream) ${attempts[attempts.length - 1] ?? "provider"} failed (${describeFail(lastOutcome)}) — failing over to ${provider}`,
      );
    }

    attempts.push(provider);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    let outcome: Outcome;
    try {
      outcome = await callConfiguredProviderStream(provider, opts, controller.signal);
    } finally {
      clearTimeout(timeout);
    }

    if (outcome.kind === "ok-stream") {
      console.log(
        `[aiProvider] provider=${provider} (stream) latencyMs=${Date.now() - startedAt} attempts=[${attempts.join(",")}]`,
      );
      return { body: outcome.body, provider, attempts };
    }

    // Shouldn't happen — stream calls return ok-stream on success. Treat a
    // plain "ok" as an upstream error and stop (no body to hand back).
    if (outcome.kind === "ok") {
      return {
        ok: false,
        errorKind: "upstream_error",
        attempts,
        latencyMs: Date.now() - startedAt,
      };
    }

    lastOutcome = outcome;
    if (!shouldFailover(outcome)) {
      return {
        ok: false,
        errorKind: errorKindFor(outcome),
        attempts,
        latencyMs: Date.now() - startedAt,
      };
    }
  }

  const errorKind: AiErrorKind = lastOutcome && !missingFallbackAfterFailure
    ? errorKindFor(lastOutcome)
    : "no_key";
  return {
    ok: false,
    errorKind,
    attempts,
    latencyMs: Date.now() - startedAt,
  };
}

// ── Provider-order dispatch helpers ──────────────────────────────────────

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
  if (provider === "openai") return Boolean(Deno.env.get("OPENAI_API_KEY"));
  if (provider === "deepseek") return Boolean(Deno.env.get("DEEPSEEK_API_KEY"));
  return Boolean(Deno.env.get("GEMINI_API_KEY"));
}

function callConfiguredProvider(
  provider: ConfiguredAiProvider,
  opts: ChatJsonOpts,
  jsonMode: boolean,
  signal: AbortSignal,
): Promise<Outcome> {
  if (provider === "openai") return callOpenAi(opts, jsonMode, signal);
  if (provider === "deepseek") return callDeepSeek(opts, jsonMode, signal);
  return callGemini(opts, jsonMode, signal);
}

function callConfiguredProviderStream(
  provider: ConfiguredAiProvider,
  opts: StreamChatOpts,
  signal: AbortSignal,
): Promise<Outcome> {
  if (provider === "openai") return callOpenAiStream(opts, signal);
  if (provider === "deepseek") return callDeepSeekStream(opts, signal);
  return callGeminiStream(opts, signal);
}

// ── Helpers ──────────────────────────────────────────────────────────────

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
