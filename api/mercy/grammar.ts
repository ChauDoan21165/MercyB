/**
 * File: grammar.ts
 * Path: api/mercy/grammar.ts
 */

type BilingualLike = {
  vi?: unknown;
  en?: unknown;
};

type GrammarRequestBody = {
  text?: unknown;
  input?: unknown;
  content?: unknown;
  sentence?: unknown;
  selectedText?: unknown;
  context?: unknown;
  title?: unknown;
  mode?: unknown;
  locale?: unknown;
  roomId?: unknown;
  [key: string]: unknown;
};

function readPositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const OPENAI_TIMEOUT_MS = readPositiveInt(
  process.env.OPENAI_GRAMMAR_TIMEOUT_MS,
  12000,
);
const OPENAI_MAX_TOKENS = readPositiveInt(
  process.env.OPENAI_GRAMMAR_MAX_TOKENS,
  650,
);
const MAX_CONTEXT_CHARS = readPositiveInt(
  process.env.OPENAI_GRAMMAR_MAX_CONTEXT_CHARS,
  900,
);
const MAX_TEXT_CHARS = readPositiveInt(
  process.env.OPENAI_GRAMMAR_MAX_TEXT_CHARS,
  1200,
);

function json(data: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json; charset=utf-8");
  }

  headers.set("Cache-Control", "no-store");

  return new Response(JSON.stringify(data), {
    ...init,
    headers,
  });
}

function asText(value: unknown): string {
  if (typeof value === "string") return value.trim();

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value).trim();
  }

  if (Array.isArray(value)) {
    return value.map(asText).filter(Boolean).join(" ").trim();
  }

  if (value && typeof value === "object") {
    const bilingual = value as BilingualLike;

    const en = asText(bilingual.en);
    if (en) return en;

    const vi = asText(bilingual.vi);
    if (vi) return vi;
  }

  return "";
}

function truncateText(value: string, maxChars: number): string {
  if (value.length <= maxChars) return value;
  return `${value.slice(0, Math.max(0, maxChars - 1)).trim()}…`;
}

function getPrimaryText(body: GrammarRequestBody): string {
  return (
    asText(body.text) ||
    asText(body.input) ||
    asText(body.content) ||
    asText(body.sentence) ||
    asText(body.selectedText) ||
    ""
  );
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function buildGrammarResult(
  text: string,
  source: string,
  summary: string,
  correctedText?: string,
) {
  const normalized = text.replace(/\s+/g, " ").trim();
  const resolvedCorrectedText =
    typeof correctedText === "string" && correctedText.trim()
      ? correctedText.trim()
      : normalized;

  return {
    ok: true,
    source,
    originalText: normalized,
    correctedText: resolvedCorrectedText,
    summary,
    issues: [],
    suggestions: [],
    sentences: splitSentences(resolvedCorrectedText).map((sentence) => ({
      original: sentence,
      corrected: sentence,
      notes: [],
    })),
  };
}

function buildFallbackGrammarResult(text: string) {
  return buildGrammarResult(
    text,
    "fallback-local",
    "Grammar analysis completed.",
  );
}

function buildTimeoutGrammarResult(text: string) {
  return buildGrammarResult(
    text,
    "fallback-timeout",
    "Grammar analysis took too long, so Mercy returned a safe fallback result. Please try again with a shorter passage for full feedback.",
  );
}

function buildUpstreamFailureGrammarResult(text: string) {
  return buildGrammarResult(
    text,
    "fallback-upstream",
    "The grammar service is temporarily busy. Mercy returned a safe fallback result. Please try again in a moment.",
  );
}

function isAbortError(error: unknown): boolean {
  if (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    String((error as { name?: unknown }).name) === "AbortError"
  ) {
    return true;
  }

  const message = String(
    (error as { message?: unknown } | null | undefined)?.message ?? "",
  ).toLowerCase();

  return message.includes("abort") || message.includes("aborted");
}

async function runOpenAIGrammarAnalysis(text: string, context: string) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return buildFallbackGrammarResult(text);
  }

  const compactText = truncateText(
    text.replace(/\s+/g, " ").trim(),
    MAX_TEXT_CHARS,
  );
  const compactContext = truncateText(
    context.replace(/\s+/g, " ").trim(),
    MAX_CONTEXT_CHARS,
  );

  const prompt = [
    "You are a precise English grammar assistant.",
    "Return JSON only.",
    "Required JSON shape:",
    "{",
    '  "correctedText": string,',
    '  "summary": string,',
    '  "issues": Array<{ "type": string, "message": string, "original"?: string, "suggestion"?: string }>,',
    '  "suggestions": string[],',
    '  "sentences": Array<{ "original": string, "corrected": string, "notes": string[] }>',
    "}",
    compactContext ? `Context: ${compactContext}` : "",
    `Text: ${compactText}`,
  ]
    .filter(Boolean)
    .join("\n");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), OPENAI_TIMEOUT_MS);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_GRAMMAR_MODEL || "gpt-4.1-mini",
        temperature: 0.2,
        max_tokens: OPENAI_MAX_TOKENS,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are an English grammar correction service. Respond with valid JSON only.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(
        `OpenAI grammar request failed: ${response.status} ${errorText}`,
      );
    }

    const result = await response.json();
    const content = result?.choices?.[0]?.message?.content;

    if (typeof content !== "string" || !content.trim()) {
      throw new Error("OpenAI grammar response was empty.");
    }

    let parsed: any;
    try {
      parsed = JSON.parse(content);
    } catch {
      throw new Error("OpenAI grammar response was not valid JSON.");
    }

    return {
      ok: true,
      source: "openai",
      originalText: compactText,
      correctedText: asText(parsed?.correctedText) || compactText,
      summary: asText(parsed?.summary) || "Grammar analysis completed.",
      issues: Array.isArray(parsed?.issues) ? parsed.issues : [],
      suggestions: Array.isArray(parsed?.suggestions) ? parsed.suggestions : [],
      sentences: Array.isArray(parsed?.sentences) ? parsed.sentences : [],
    };
  } catch (error) {
    if (isAbortError(error)) {
      console.warn("[api/mercy/grammar] OpenAI timeout, returning fallback");
      return buildTimeoutGrammarResult(compactText);
    }

    console.error(
      "[api/mercy/grammar] OpenAI request failed, returning fallback",
      error,
    );
    return buildUpstreamFailureGrammarResult(compactText);
  } finally {
    clearTimeout(timeoutId);
  }
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method === "GET") {
    return json(
      {
        ok: true,
        endpoint: "/api/mercy/grammar",
        method: "POST",
        timeoutMs: OPENAI_TIMEOUT_MS,
      },
      { status: 200 },
    );
  }

  if (request.method !== "POST") {
    return json(
      {
        ok: false,
        error: `Method ${request.method} Not Allowed.`,
      },
      {
        status: 405,
        headers: {
          Allow: "GET, POST",
        },
      },
    );
  }

  try {
    let body: GrammarRequestBody;

    try {
      body = (await request.json()) as GrammarRequestBody;
    } catch {
      return json(
        { ok: false, error: "Invalid JSON body." },
        { status: 400 },
      );
    }

    const text = getPrimaryText(body);
    const context = asText(body.context);
    const title = asText(body.title);
    const mergedContext = [title, context].filter(Boolean).join(" — ");

    if (!text) {
      return json(
        { ok: false, error: "Missing grammar text input." },
        { status: 400 },
      );
    }

    const result = await runOpenAIGrammarAnalysis(text, mergedContext);
    return json(result, { status: 200 });
  } catch (error) {
    console.error("[api/mercy/grammar] request failed", error);

    return json(
      { ok: false, error: "Grammar analysis failed." },
      { status: 500 },
    );
  }
}