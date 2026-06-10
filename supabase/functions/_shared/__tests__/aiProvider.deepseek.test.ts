// supabase/functions/_shared/__tests__/aiProvider.deepseek.test.ts
//
// D7 (A7) — DeepSeek provider in the Deno _shared/aiProvider layer.
//
// Proves the two DONE-WHEN conditions for the edge-function provider layer:
//   1. DEEPSEEK_API_KEY PRESENT + a surface providerOrder that includes
//      "deepseek" → the call routes to DeepSeek (OpenAI-compatible shape).
//   2. DEEPSEEK_API_KEY ABSENT → DeepSeek is skipped with no crash and the
//      next configured provider (openai/gemini) answers — graceful degrade.
//
// Plus parity guards: failover into DeepSeek, default order never touches
// DeepSeek, and the streaming path behaves the same.
//
// Runs under vitest (Node). The module reads env via Deno.env.get(...) at
// call time, so we stub a controllable Deno global per test — the same
// shim pattern the other supabase/functions tests use.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  chatJsonWithFailover,
  chatTextWithFailover,
  streamChatWithFailover,
} from "../aiProvider.ts";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";
const GEMINI_URL_PREFIX = "https://generativelanguage.googleapis.com/v1beta/models/";

type FetchInput = string | URL | Request;

function urlOf(input: FetchInput): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.href;
  return input.url;
}

const isOpenAiUrl = (i: FetchInput) => urlOf(i) === OPENAI_URL;
const isDeepSeekUrl = (i: FetchInput) => urlOf(i) === DEEPSEEK_URL;
const isGeminiUrl = (i: FetchInput) => urlOf(i).startsWith(GEMINI_URL_PREFIX);

function chatOk(content: string): Response {
  return new Response(JSON.stringify({ choices: [{ message: { content } }] }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

function geminiOk(text: string): Response {
  return new Response(
    JSON.stringify({ candidates: [{ content: { parts: [{ text }] } }] }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
}

function status(code: number): Response {
  return new Response(JSON.stringify({ error: "x" }), { status: code });
}

function sseOk(line: string): Response {
  // A minimal OpenAI-shaped SSE body (DeepSeek/OpenAI emit this shape).
  return new Response(`data: ${line}\n\ndata: [DONE]\n\n`, {
    status: 200,
    headers: { "Content-Type": "text/event-stream" },
  });
}

/** Install a Deno.env stub exposing only the given keys. */
function stubEnv(env: Record<string, string>) {
  vi.stubGlobal("Deno", {
    env: { get: (key: string) => env[key] },
  });
}

const SAMPLE = { systemPrompt: "you are a helper", userMessage: "ping" };

beforeEach(() => {
  // Default: all three keys present unless a test overrides.
  stubEnv({ OPENAI_API_KEY: "sk", DEEPSEEK_API_KEY: "ds", GEMINI_API_KEY: "g" });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("aiProvider (Deno) — DeepSeek key PRESENT routes to DeepSeek", () => {
  it("uses DeepSeek as the primary provider with OpenAI-compatible request shape", async () => {
    const fetchMock = vi.fn(async (input: FetchInput, init?: RequestInit) => {
      expect(isDeepSeekUrl(input)).toBe(true);
      expect(init?.headers).toMatchObject({
        "Content-Type": "application/json",
        Authorization: "Bearer ds",
      });
      const body = JSON.parse(String(init?.body));
      expect(body.model).toBe("deepseek-reasoner");
      expect(body.stream).toBe(false);
      expect(body.response_format).toEqual({ type: "json_object" });
      expect(body.messages).toEqual([
        { role: "system", content: SAMPLE.systemPrompt },
        { role: "user", content: SAMPLE.userMessage },
      ]);
      return chatOk('{"answer":"from deepseek"}');
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await chatJsonWithFailover({
      ...SAMPLE,
      providerOrder: ["deepseek", "openai", "gemini"],
      deepseekModel: "deepseek-reasoner",
    });

    expect(result.ok).toBe(true);
    expect(result.provider).toBe("deepseek");
    expect(result.attempts).toEqual(["deepseek"]);
    expect(result.json).toEqual({ answer: "from deepseek" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("accepts a comma-string providerOrder and falls over OpenAI → DeepSeek", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: FetchInput) => {
        if (isOpenAiUrl(input)) return status(500);
        if (isDeepSeekUrl(input)) return chatOk('{"answer":"cheap turn"}');
        throw new Error(`unexpected url: ${urlOf(input)}`);
      }),
    );

    const result = await chatJsonWithFailover({
      ...SAMPLE,
      providerOrder: "openai, deepseek, gemini",
    });

    expect(result.ok).toBe(true);
    expect(result.provider).toBe("deepseek");
    expect(result.attempts).toEqual(["openai", "deepseek"]);
  });

  it("routes DeepSeek for the plaintext (chatText) path too", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: FetchInput) => {
        expect(isDeepSeekUrl(input)).toBe(true);
        return chatOk("plain deepseek text");
      }),
    );

    const result = await chatTextWithFailover({
      ...SAMPLE,
      providerOrder: ["deepseek"],
    });

    expect(result.ok).toBe(true);
    expect(result.provider).toBe("deepseek");
    expect(result.raw).toBe("plain deepseek text");
  });

  it("passes DeepSeek's OpenAI-shaped SSE straight through (no translation)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: FetchInput) => {
        expect(isDeepSeekUrl(input)).toBe(true);
        return sseOk('{"choices":[{"delta":{"content":"hi"}}]}');
      }),
    );

    const result = await streamChatWithFailover({
      ...SAMPLE,
      providerOrder: ["deepseek", "openai"],
    });

    expect("body" in result).toBe(true);
    if (!("body" in result)) throw new Error("expected stream body");
    expect(result.provider).toBe("deepseek");
    expect(result.attempts).toEqual(["deepseek"]);
  });
});

describe("aiProvider (Deno) — DeepSeek key ABSENT degrades gracefully", () => {
  it("skips DeepSeek with no crash and lets OpenAI answer", async () => {
    stubEnv({ OPENAI_API_KEY: "sk", GEMINI_API_KEY: "g" }); // no DEEPSEEK_API_KEY

    const fetchMock = vi.fn(async (input: FetchInput) => {
      if (isOpenAiUrl(input)) return chatOk('{"answer":"openai fallback"}');
      throw new Error(`unexpected url: ${urlOf(input)}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await chatJsonWithFailover({
      ...SAMPLE,
      providerOrder: ["deepseek", "openai", "gemini"],
    });

    expect(result.ok).toBe(true);
    expect(result.provider).toBe("openai");
    expect(result.attempts).toEqual(["openai"]); // deepseek skipped, not attempted
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("skips DeepSeek mid-chain after an OpenAI failure and reaches Gemini", async () => {
    stubEnv({ OPENAI_API_KEY: "sk", GEMINI_API_KEY: "g" }); // no DEEPSEEK_API_KEY

    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: FetchInput) => {
        if (isOpenAiUrl(input)) return status(500);
        if (isGeminiUrl(input)) return geminiOk('{"answer":"from gemini"}');
        throw new Error(`unexpected url: ${urlOf(input)}`);
      }),
    );

    const result = await chatJsonWithFailover({
      ...SAMPLE,
      providerOrder: ["openai", "deepseek", "gemini"],
    });

    expect(result.ok).toBe(true);
    expect(result.provider).toBe("gemini");
    expect(result.attempts).toEqual(["openai", "gemini"]); // deepseek skipped
  });

  it("streaming skips an absent DeepSeek and uses OpenAI", async () => {
    stubEnv({ OPENAI_API_KEY: "sk" }); // only OpenAI

    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: FetchInput) => {
        if (isOpenAiUrl(input)) return sseOk('{"choices":[{"delta":{"content":"x"}}]}');
        throw new Error(`unexpected url: ${urlOf(input)}`);
      }),
    );

    const result = await streamChatWithFailover({
      ...SAMPLE,
      providerOrder: ["deepseek", "openai"],
    });

    expect("body" in result).toBe(true);
    if (!("body" in result)) throw new Error("expected stream body");
    expect(result.provider).toBe("openai");
    expect(result.attempts).toEqual(["openai"]);
  });
});

describe("aiProvider (Deno) — parity / no-regression", () => {
  it("default provider order never attempts DeepSeek", async () => {
    const fetchMock = vi.fn(async (input: FetchInput) => {
      if (isOpenAiUrl(input)) return status(500);
      if (isGeminiUrl(input)) return geminiOk('{"answer":"from gemini"}');
      throw new Error(`unexpected url: ${urlOf(input)}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await chatJsonWithFailover(SAMPLE); // no providerOrder

    expect(result.ok).toBe(true);
    expect(result.provider).toBe("gemini");
    expect(result.attempts).toEqual(["openai", "gemini"]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("returns no_key when every provider in the order lacks a key (no crash)", async () => {
    stubEnv({}); // no keys at all

    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const result = await chatJsonWithFailover({
      ...SAMPLE,
      providerOrder: ["deepseek", "openai", "gemini"],
    });

    expect(result.ok).toBe(false);
    expect(result.provider).toBe("none");
    expect(result.errorKind).toBe("no_key");
    expect(result.attempts).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
