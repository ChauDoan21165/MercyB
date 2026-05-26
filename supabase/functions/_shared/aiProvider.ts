// supabase/functions/_shared/aiProvider.ts
//
// OpenAI → Gemini failover for Teacher Mercy Edge Functions (Deno).
// Mirrors api/_lib/aiProvider.ts (Vercel) but uses Deno.env and Deno's
// built-in fetch. Three callers in Phase 1: ai-chat (streaming),
// mercy-guide (JSON mode). The text-mode helper exists for any future
// caller that wants free-form text without JSON mode.
//
// Design parity with the Vercel module is intentional — the failover
// rules + log format must match so the two surfaces are easy to
// correlate in dashboards.
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

export type AiProvider = "openai" | "gemini" | "none";

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
  geminiModel?: string;
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
const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";
const DEFAULT_TEMPERATURE = 0.15;
const DEFAULT_MAX_TOKENS = 800;

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

  const openaiController = new AbortController();
  const openaiTimeout = setTimeout(() => openaiController.abort(), timeoutMs);
  attempts.push("openai");
  let openaiOutcome: Outcome;
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

  if (openaiOutcome.kind === "ok-stream" || !shouldFailover(openaiOutcome)) {
    const latencyMs = Date.now() - startedAt;
    const errorKind =
      openaiOutcome.kind === "fail" ? errorKindFor(openaiOutcome) : "upstream_error";
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

  if (!Deno.env.get("GEMINI_API_KEY")) {
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

  console.warn(
    `[aiProvider] OpenAI failed (${describeFail(openaiOutcome)}) — failing over to Gemini`,
  );
  const geminiController = new AbortController();
  const geminiTimeout = setTimeout(() => geminiController.abort(), timeoutMs);
  attempts.push("gemini");
  let geminiOutcome: Outcome;
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

  const latencyMs = Date.now() - startedAt;
  const errorKind =
    geminiOutcome.kind === "fail" ? errorKindFor(geminiOutcome) : "upstream_error";
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
  let openaiOutcome: Outcome;
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

  if (openaiOutcome.kind === "ok-stream" || !shouldFailover(openaiOutcome)) {
    const latencyMs = Date.now() - startedAt;
    const errorKind =
      openaiOutcome.kind === "fail" ? errorKindFor(openaiOutcome) : "upstream_error";
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

  if (!Deno.env.get("GEMINI_API_KEY")) {
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
  let geminiOutcome: Outcome;
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
  const errorKind =
    geminiOutcome.kind === "fail" ? errorKindFor(geminiOutcome) : "upstream_error";
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

  const openaiController = new AbortController();
  const openaiTimeout = setTimeout(() => openaiController.abort(), timeoutMs);
  attempts.push("openai");
  let openaiOutcome: Outcome;
  try {
    openaiOutcome = await callOpenAiStream(opts, openaiController.signal);
  } finally {
    clearTimeout(openaiTimeout);
  }

  if (openaiOutcome.kind === "ok-stream") {
    console.log(
      `[aiProvider] provider=openai (stream) latencyMs=${Date.now() - startedAt} attempts=[${attempts.join(",")}]`,
    );
    return { body: openaiOutcome.body, provider: "openai", attempts };
  }

  // Connection-establishment outcomes for streaming.
  if (openaiOutcome.kind === "ok") {
    // Shouldn't happen — callOpenAiStream returns ok-stream on success.
    return {
      ok: false,
      errorKind: "upstream_error",
      attempts,
      latencyMs: Date.now() - startedAt,
    };
  }

  if (!shouldFailover(openaiOutcome)) {
    return {
      ok: false,
      errorKind: errorKindFor(openaiOutcome),
      attempts,
      latencyMs: Date.now() - startedAt,
    };
  }

  if (!Deno.env.get("GEMINI_API_KEY")) {
    console.warn(
      `[aiProvider] (stream) failover skipped: GEMINI_API_KEY missing attempts=[${attempts.join(",")}]`,
    );
    return {
      ok: false,
      errorKind: "no_key",
      attempts,
      latencyMs: Date.now() - startedAt,
    };
  }

  console.warn(
    `[aiProvider] (stream) OpenAI failed (${describeFail(openaiOutcome)}) — failing over to Gemini`,
  );
  const geminiController = new AbortController();
  const geminiTimeout = setTimeout(() => geminiController.abort(), timeoutMs);
  attempts.push("gemini");
  let geminiOutcome: Outcome;
  try {
    geminiOutcome = await callGeminiStream(opts, geminiController.signal);
  } finally {
    clearTimeout(geminiTimeout);
  }

  if (geminiOutcome.kind === "ok-stream") {
    console.log(
      `[aiProvider] provider=gemini (stream) latencyMs=${Date.now() - startedAt} attempts=[${attempts.join(",")}]`,
    );
    return { body: geminiOutcome.body, provider: "gemini", attempts };
  }

  const errorKind =
    geminiOutcome.kind === "fail" ? errorKindFor(geminiOutcome) : "upstream_error";
  return {
    ok: false,
    errorKind,
    attempts,
    latencyMs: Date.now() - startedAt,
  };
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
