import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockGetUser = vi.fn();
vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: { getUser: () => mockGetUser() },
  },
}));

const mockResolveApiUrl = vi.fn((path: string) => path);
vi.mock("@/lib/apiBase", () => ({
  resolveApiUrl: (path: string) => mockResolveApiUrl(path),
}));

import { analyzeGrammarWithApi, GRAMMAR_API_ENDPOINT } from "../api";

const originalFetch = globalThis.fetch;

function buildResponse(
  body: string,
  {
    status = 200,
    contentType = "application/json",
  }: { status?: number; contentType?: string | null } = {},
) {
  const headers = new Headers();
  if (contentType) headers.set("content-type", contentType);
  return new Response(body, { status, headers });
}

describe("analyzeGrammarWithApi", () => {
  beforeEach(() => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    mockResolveApiUrl.mockClear();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("calls fetch through resolveApiUrl so native builds hit the prod origin", async () => {
    const fetchSpy = vi
      .fn()
      .mockResolvedValue(
        buildResponse(JSON.stringify({ ok: true, correctedText: "I bought apples." })),
      );
    globalThis.fetch = fetchSpy as unknown as typeof globalThis.fetch;
    mockResolveApiUrl.mockImplementation(
      (path: string) => `https://mercyblade.com${path}`,
    );

    await analyzeGrammarWithApi({ text: "I buy apple yesterday" });

    expect(mockResolveApiUrl).toHaveBeenCalledWith(GRAMMAR_API_ENDPOINT);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy.mock.calls[0][0]).toBe(
      "https://mercyblade.com/api/mercy/grammar",
    );
  });

  it("surfaces HTTP status, content-type, and body preview when JSON parse fails", async () => {
    const html =
      "<!DOCTYPE html><html><head><title>Mercy</title></head><body>SPA</body></html>";
    // Each fetch must return a fresh Response — the body stream can
    // only be read once. Use mockImplementation so the test can call
    // analyzeGrammarWithApi multiple times.
    const fetchSpy = vi
      .fn()
      .mockImplementation(() =>
        Promise.resolve(buildResponse(html, { contentType: "text/html" })),
      );
    globalThis.fetch = fetchSpy as unknown as typeof globalThis.fetch;

    let caught: Error | null = null;
    try {
      await analyzeGrammarWithApi({ text: "I buy apple yesterday" });
    } catch (err) {
      caught = err as Error;
    }

    expect(caught).toBeInstanceOf(Error);
    expect(caught?.message).toMatch(/non-JSON response \(HTTP 200/);
    expect(caught?.message).toMatch(/text\/html/);
    expect(caught?.message).toMatch(/<!DOCTYPE html>/);
  });

  it("uses the standard 'invalid response' error for non-object JSON payloads", async () => {
    const fetchSpy = vi.fn().mockResolvedValue(buildResponse("123"));
    globalThis.fetch = fetchSpy as unknown as typeof globalThis.fetch;

    await expect(
      analyzeGrammarWithApi({ text: "hello world from earth" }),
    ).rejects.toThrowError(/invalid response/i);
  });

  it("propagates HTTP error messages with status detail", async () => {
    const fetchSpy = vi
      .fn()
      .mockResolvedValue(
        buildResponse(JSON.stringify({ error: "rate limited" }), { status: 429 }),
      );
    globalThis.fetch = fetchSpy as unknown as typeof globalThis.fetch;

    await expect(
      analyzeGrammarWithApi({ text: "hello world from earth" }),
    ).rejects.toThrowError(/busy/i);
  });

  it("returns the parsed response on the happy path", async () => {
    const payload = {
      ok: true,
      correctedText: "I bought apples yesterday.",
      issues: [],
    };
    const fetchSpy = vi.fn().mockResolvedValue(buildResponse(JSON.stringify(payload)));
    globalThis.fetch = fetchSpy as unknown as typeof globalThis.fetch;

    const result = await analyzeGrammarWithApi({ text: "I buy apple yesterday" });
    expect(result).toMatchObject({ correctedText: "I bought apples yesterday." });
  });
});
