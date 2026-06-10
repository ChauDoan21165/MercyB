export type AiProvider = "openai" | "deepseek" | "gemini" | "none";
export type ConfiguredAiProvider = Exclude<AiProvider, "none">;
export type AiErrorKind = "timeout" | "rate_limit" | "upstream_error" | "parse_error" | "no_key";

export type ChatJsonResult = {
  ok: boolean;
  json: Record<string, unknown>;
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

type ProviderOutcome =
  | { kind: "ok"; raw: string }
  | { kind: "fail"; status?: number; isAbort?: boolean; threw?: boolean };

const DEFAULT_TIMEOUT_MS = 15_000;
const DEFAULT_OPENAI_MODEL = "gpt-4o-mini";
const DEFAULT_DEEPSEEK_MODEL = "deepseek-chat";
const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";
const DEFAULT_TEMPERATURE = 0.15;
const DEFAULT_MAX_TOKENS = 800;
const DEFAULT_PROVIDER_ORDER: readonly ConfiguredAiProvider[] = ["openai", "gemini"];

function shouldFailover(reason: { status?: number; isAbort?: boolean; threw?: boolean }): boolean {
  if (reason.isAbort || reason.threw) return true;
  if (typeof reason.status === "number") return reason.status === 429 || reason.status >= 500;
  return false;
}

function errorKindFor(reason: { status?: number; isAbort?: boolean; threw?: boolean }): AiErrorKind {
  if (reason.isAbort) return "timeout";
  if (reason.status === 429) return "rate_limit";
  return "upstream_error";
}

async function callOpenAi(opts: ChatJsonOpts, signal: AbortSignal): Promise<ProviderOutcome> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return { kind: "fail", status: 401 };

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: opts.openaiModel ?? DEFAULT_OPENAI_MODEL,
        temperature: opts.temperature ?? DEFAULT_TEMPERATURE,
        max_tokens: opts.maxTokens ?? DEFAULT_MAX_TOKENS,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: opts.systemPrompt },
          { role: "user", content: opts.userMessage },
        ],
      }),
      signal,
    });
    if (!response.ok) return { kind: "fail", status: response.status };

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    return { kind: "ok", raw: data.choices?.[0]?.message?.content ?? "" };
  } catch (err) {
    const isAbort = err instanceof Error && err.name === "AbortError";
    return { kind: "fail", isAbort, threw: !isAbort };
  }
}

async function callDeepSeek(opts: ChatJsonOpts, signal: AbortSignal): Promise<ProviderOutcome> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return { kind: "fail", status: 401 };

  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: opts.deepseekModel ?? DEFAULT_DEEPSEEK_MODEL,
        temperature: opts.temperature ?? DEFAULT_TEMPERATURE,
        max_tokens: opts.maxTokens ?? DEFAULT_MAX_TOKENS,
        response_format: { type: "json_object" },
        stream: false,
        messages: [
          { role: "system", content: opts.systemPrompt },
          { role: "user", content: opts.userMessage },
        ],
      }),
      signal,
    });
    if (!response.ok) return { kind: "fail", status: response.status };

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    return { kind: "ok", raw: data.choices?.[0]?.message?.content ?? "" };
  } catch (err) {
    const isAbort = err instanceof Error && err.name === "AbortError";
    return { kind: "fail", isAbort, threw: !isAbort };
  }
}

async function callGemini(opts: ChatJsonOpts, signal: AbortSignal): Promise<ProviderOutcome> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return { kind: "fail", status: 401 };

  const model = opts.geminiModel ?? DEFAULT_GEMINI_MODEL;
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent` +
    `?key=${encodeURIComponent(apiKey)}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: opts.userMessage }] }],
        systemInstruction: { parts: [{ text: opts.systemPrompt }] },
        generationConfig: {
          temperature: opts.temperature ?? DEFAULT_TEMPERATURE,
          maxOutputTokens: opts.maxTokens ?? DEFAULT_MAX_TOKENS,
          responseMimeType: "application/json",
        },
      }),
      signal,
    });
    if (!response.ok) return { kind: "fail", status: response.status };

    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const parts = data.candidates?.[0]?.content?.parts;
    return {
      kind: "ok",
      raw: Array.isArray(parts) ? parts.map((part) => part.text ?? "").join("") : "",
    };
  } catch (err) {
    const isAbort = err instanceof Error && err.name === "AbortError";
    return { kind: "fail", isAbort, threw: !isAbort };
  }
}

function parseJson(raw: string): { ok: true; json: Record<string, unknown> } | { ok: false } {
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? { ok: true, json: parsed } : { ok: false };
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return { ok: false };
    try {
      const parsed = JSON.parse(match[0]);
      return parsed && typeof parsed === "object" ? { ok: true, json: parsed } : { ok: false };
    } catch {
      return { ok: false };
    }
  }
}

function normalizeProviderOrder(value: ChatJsonOpts["providerOrder"]): ConfiguredAiProvider[] {
  const raw = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : DEFAULT_PROVIDER_ORDER;
  const seen = new Set<ConfiguredAiProvider>();
  const order: ConfiguredAiProvider[] = [];
  for (const entry of raw) {
    const provider = String(entry).trim().toLowerCase();
    if ((provider === "openai" || provider === "deepseek" || provider === "gemini") && !seen.has(provider)) {
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
  signal: AbortSignal,
): Promise<ProviderOutcome> {
  if (provider === "openai") return callOpenAi(opts, signal);
  if (provider === "deepseek") return callDeepSeek(opts, signal);
  return callGemini(opts, signal);
}

export async function chatJsonWithFailover(opts: ChatJsonOpts): Promise<ChatJsonResult> {
  const startedAt = Date.now();
  const attempts: AiProvider[] = [];
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const providerOrder = normalizeProviderOrder(opts.providerOrder);
  let lastOutcome: ProviderOutcome | null = null;
  let missingFallbackAfterFailure = false;

  for (const provider of providerOrder) {
    if (!hasProviderKey(provider)) {
      if (lastOutcome) missingFallbackAfterFailure = true;
      continue;
    }
    missingFallbackAfterFailure = false;
    attempts.push(provider);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    let outcome: ProviderOutcome;
    try {
      outcome = await callConfiguredProvider(provider, opts, controller.signal);
    } finally {
      clearTimeout(timeout);
    }

    if (outcome.kind === "ok") {
      const parsed = parseJson(outcome.raw);
      const latencyMs = Date.now() - startedAt;
      if (parsed.ok) {
        return { ok: true, json: parsed.json, raw: outcome.raw, provider, latencyMs, attempts };
      }
      return { ok: false, json: {}, raw: outcome.raw, provider, latencyMs, attempts, errorKind: "parse_error" };
    }

    lastOutcome = outcome;
    if (!shouldFailover(outcome)) {
      return { ok: false, json: {}, raw: "", provider: "none", latencyMs: Date.now() - startedAt, attempts, errorKind: errorKindFor(outcome) };
    }
  }

  const latencyMs = Date.now() - startedAt;
  return {
    ok: false,
    json: {},
    raw: "",
    provider: "none",
    latencyMs,
    attempts,
    errorKind: lastOutcome && !missingFallbackAfterFailure ? errorKindFor(lastOutcome) : "no_key",
  };
}
