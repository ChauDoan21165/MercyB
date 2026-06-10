// api/_lib/__tests__/aiProvider.test.ts
//
// Coverage for the OpenAI → Gemini failover policy. Mocks global fetch
// at the test level so we can pin every transient-failure path the
// production module branches on.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { chatJsonWithFailover } from "../aiProvider.js";

// ── Test helpers ─────────────────────────────────────────────────────────

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";
const GEMINI_URL_PREFIX =
  "https://generativelanguage.googleapis.com/v1beta/models/";

type FetchInput = string | URL | Request;

function makeOpenAiOk(jsonContent: string): Response {
  return new Response(
    JSON.stringify({
      choices: [{ message: { content: jsonContent } }],
    }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
}

function makeOpenAiStatus(status: number): Response {
  return new Response(JSON.stringify({ error: "x" }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function makeDeepSeekOk(jsonContent: string): Response {
  return new Response(
    JSON.stringify({
      choices: [{ message: { content: jsonContent } }],
    }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
}

function makeGeminiOk(text: string): Response {
  return new Response(
    JSON.stringify({
      candidates: [{ content: { parts: [{ text }] } }],
    }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
}

function makeGeminiStatus(status: number): Response {
  return new Response(JSON.stringify({ error: "x" }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function urlOf(input: FetchInput): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.href;
  return input.url;
}

function isOpenAiUrl(input: FetchInput): boolean {
  return urlOf(input) === OPENAI_URL;
}

function isDeepSeekUrl(input: FetchInput): boolean {
  return urlOf(input) === DEEPSEEK_URL;
}

function isGeminiUrl(input: FetchInput): boolean {
  return urlOf(input).startsWith(GEMINI_URL_PREFIX);
}

const SAMPLE_OPTS = {
  systemPrompt: "you are a helper",
  userMessage: "ping",
};

// ── Setup ────────────────────────────────────────────────────────────────

beforeEach(() => {
  process.env.OPENAI_API_KEY = "sk-test";
  process.env.DEEPSEEK_API_KEY = "ds-test";
  process.env.GEMINI_API_KEY = "g-test";
});

afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.OPENAI_API_KEY;
  delete process.env.DEEPSEEK_API_KEY;
  delete process.env.GEMINI_API_KEY;
});

// ── Tests ────────────────────────────────────────────────────────────────

describe("chatJsonWithFailover — OpenAI happy path", () => {
  it("returns provider:'openai' and parses the JSON content on 200", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: FetchInput) => {
        expect(isOpenAiUrl(input)).toBe(true);
        return makeOpenAiOk('{"answer":"ping back"}');
      }),
    );

    const result = await chatJsonWithFailover(SAMPLE_OPTS);

    expect(result.ok).toBe(true);
    expect(result.provider).toBe("openai");
    expect(result.attempts).toEqual(["openai"]);
    expect(result.json).toEqual({ answer: "ping back" });
    expect(result.errorKind).toBeUndefined();
  });
});

describe("chatJsonWithFailover — DeepSeek configured provider", () => {
  it("can use DeepSeek as the primary provider with OpenAI-compatible request shape", async () => {
    const fetchMock = vi.fn(async (input: FetchInput, init?: RequestInit) => {
      expect(isDeepSeekUrl(input)).toBe(true);
      expect(init?.headers).toMatchObject({
        "Content-Type": "application/json",
        Authorization: "Bearer ds-test",
      });
      const body = JSON.parse(String(init?.body)) as {
        model?: string;
        response_format?: { type?: string };
        messages?: Array<{ role?: string; content?: string }>;
      };
      expect(body.model).toBe("deepseek-reasoner");
      expect(body.response_format).toEqual({ type: "json_object" });
      expect(body.messages).toEqual([
        { role: "system", content: SAMPLE_OPTS.systemPrompt },
        { role: "user", content: SAMPLE_OPTS.userMessage },
      ]);
      return makeDeepSeekOk('{"answer":"from deepseek"}');
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await chatJsonWithFailover({
      ...SAMPLE_OPTS,
      providerOrder: ["deepseek", "openai", "gemini"],
      deepseekModel: "deepseek-reasoner",
    });

    expect(result.ok).toBe(true);
    expect(result.provider).toBe("deepseek");
    expect(result.attempts).toEqual(["deepseek"]);
    expect(result.json).toEqual({ answer: "from deepseek" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("falls over from OpenAI to DeepSeek when the surface order includes DeepSeek", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: FetchInput) => {
        if (isOpenAiUrl(input)) return makeOpenAiStatus(500);
        if (isDeepSeekUrl(input)) return makeDeepSeekOk('{"answer":"cheap turn"}');
        throw new Error(`unexpected url: ${urlOf(input)}`);
      }),
    );

    const result = await chatJsonWithFailover({
      ...SAMPLE_OPTS,
      providerOrder: "openai, deepseek, gemini",
    });

    expect(result.ok).toBe(true);
    expect(result.provider).toBe("deepseek");
    expect(result.attempts).toEqual(["openai", "deepseek"]);
    expect(result.json).toEqual({ answer: "cheap turn" });
  });

  it("does not attempt DeepSeek unless a surface provider order includes it", async () => {
    const fetchMock = vi.fn(async (input: FetchInput) => {
      if (isOpenAiUrl(input)) return makeOpenAiStatus(500);
      if (isGeminiUrl(input)) return makeGeminiOk('{"answer":"from gemini"}');
      throw new Error(`unexpected url: ${urlOf(input)}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await chatJsonWithFailover(SAMPLE_OPTS);

    expect(result.ok).toBe(true);
    expect(result.provider).toBe("gemini");
    expect(result.attempts).toEqual(["openai", "gemini"]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});

describe("chatJsonWithFailover — failover-on-OpenAI-failure", () => {
  it("falls over to Gemini on OpenAI 429", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: FetchInput) => {
        if (isOpenAiUrl(input)) return makeOpenAiStatus(429);
        if (isGeminiUrl(input)) return makeGeminiOk('{"answer":"from gemini"}');
        throw new Error(`unexpected url: ${urlOf(input)}`);
      }),
    );

    const result = await chatJsonWithFailover(SAMPLE_OPTS);

    expect(result.ok).toBe(true);
    expect(result.provider).toBe("gemini");
    expect(result.attempts).toEqual(["openai", "gemini"]);
    expect(result.json).toEqual({ answer: "from gemini" });
  });

  it("falls over on OpenAI 503", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: FetchInput) => {
        if (isOpenAiUrl(input)) return makeOpenAiStatus(503);
        return makeGeminiOk('{"answer":"ok"}');
      }),
    );

    const result = await chatJsonWithFailover(SAMPLE_OPTS);

    expect(result.ok).toBe(true);
    expect(result.provider).toBe("gemini");
    expect(result.attempts).toEqual(["openai", "gemini"]);
  });

  it("falls over on OpenAI timeout (AbortError)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: FetchInput, init?: RequestInit) => {
        if (isOpenAiUrl(input)) {
          return await new Promise<Response>((_resolve, reject) => {
            const signal = init?.signal as AbortSignal | undefined;
            const reportAbort = () => {
              const err = new Error("Aborted");
              err.name = "AbortError";
              reject(err);
            };
            if (signal?.aborted) {
              reportAbort();
              return;
            }
            signal?.addEventListener("abort", reportAbort, { once: true });
          });
        }
        if (isGeminiUrl(input)) return makeGeminiOk('{"answer":"ok"}');
        throw new Error(`unexpected url: ${urlOf(input)}`);
      }),
    );

    const result = await chatJsonWithFailover({
      ...SAMPLE_OPTS,
      timeoutMs: 50,
    });

    expect(result.ok).toBe(true);
    expect(result.provider).toBe("gemini");
    expect(result.attempts).toEqual(["openai", "gemini"]);
  });
});

describe("chatJsonWithFailover — does NOT fall over", () => {
  it("returns ok:false on OpenAI 400 and never calls Gemini", async () => {
    const fetchMock = vi.fn(async (input: FetchInput) => {
      if (isOpenAiUrl(input)) return makeOpenAiStatus(400);
      throw new Error("Gemini should not be called on 400");
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await chatJsonWithFailover(SAMPLE_OPTS);

    expect(result.ok).toBe(false);
    expect(result.provider).toBe("none");
    expect(result.attempts).toEqual(["openai"]);
    expect(result.errorKind).toBe("upstream_error");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("returns ok:false with parse_error on OpenAI 200 + invalid JSON", async () => {
    const fetchMock = vi.fn(async (input: FetchInput) => {
      if (isOpenAiUrl(input)) return makeOpenAiOk("not json at all");
      throw new Error("Gemini should not be called on parse_error");
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await chatJsonWithFailover(SAMPLE_OPTS);

    expect(result.ok).toBe(false);
    expect(result.provider).toBe("openai");
    expect(result.attempts).toEqual(["openai"]);
    expect(result.errorKind).toBe("parse_error");
    expect(result.raw).toBe("not json at all");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe("chatJsonWithFailover — both providers fail", () => {
  it("returns ok:false provider:'none' when OpenAI 500 + Gemini 500", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: FetchInput) => {
        if (isOpenAiUrl(input)) return makeOpenAiStatus(500);
        if (isGeminiUrl(input)) return makeGeminiStatus(500);
        throw new Error(`unexpected url: ${urlOf(input)}`);
      }),
    );

    const result = await chatJsonWithFailover(SAMPLE_OPTS);

    expect(result.ok).toBe(false);
    expect(result.provider).toBe("none");
    expect(result.attempts).toEqual(["openai", "gemini"]);
    expect(result.errorKind).toBe("upstream_error");
    expect(result.json).toEqual({});
  });
});

describe("chatJsonWithFailover — GEMINI_API_KEY missing", () => {
  it("returns ok:false errorKind:'no_key' on OpenAI 500 when Gemini key absent", async () => {
    delete process.env.GEMINI_API_KEY;

    const fetchMock = vi.fn(async (input: FetchInput) => {
      if (isOpenAiUrl(input)) return makeOpenAiStatus(500);
      throw new Error("Gemini should not be called when key is missing");
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await chatJsonWithFailover(SAMPLE_OPTS);

    expect(result.ok).toBe(false);
    expect(result.provider).toBe("none");
    expect(result.attempts).toEqual(["openai"]);
    expect(result.errorKind).toBe("no_key");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe("chatJsonWithFailover — Gemini response parsing", () => {
  it("extracts text from candidates[0].content.parts[].text and parses JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: FetchInput) => {
        if (isOpenAiUrl(input)) return makeOpenAiStatus(500);
        // Multi-part response should be concatenated.
        if (isGeminiUrl(input)) {
          return new Response(
            JSON.stringify({
              candidates: [
                {
                  content: {
                    parts: [{ text: '{"a":' }, { text: ' "b"}' }],
                  },
                },
              ],
            }),
            { status: 200 },
          );
        }
        throw new Error(`unexpected url: ${urlOf(input)}`);
      }),
    );

    const result = await chatJsonWithFailover(SAMPLE_OPTS);

    expect(result.ok).toBe(true);
    expect(result.provider).toBe("gemini");
    expect(result.json).toEqual({ a: "b" });
    expect(result.raw).toBe('{"a": "b"}');
  });
});
