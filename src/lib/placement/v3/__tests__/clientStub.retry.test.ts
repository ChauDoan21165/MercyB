// src/lib/placement/v3/__tests__/clientStub.retry.test.ts
//
// Locks the cold-start resilience contract for the placement-v3-session
// client call (BUG-placement-v3-session-gateway-net-err-failed-2026-07-09):
//   - a non-response (fetch throws net::ERR_FAILED) is transparently retried
//     with backoff, so a cold-start miss still reaches placement;
//   - a gateway 5xx (502/503/504) — request never reached a booted handler —
//     is likewise retried;
//   - a real app response (incl. a handler error status/body) is NOT retried,
//     so an answered `respond` can never be double-processed;
//   - the happy path issues exactly one request (success path unchanged).

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const getSession = vi.fn();
vi.mock("@/lib/supabaseClient", () => ({
  supabase: { auth: { getSession: () => getSession() } },
}));

import { startSession, submitResponse } from "../clientStub";

const START_OK = {
  sessionId: "sess-1",
  currentTask: null,
  totalTasks: 5,
  progress: { current: 0, total: 5, state: "in_progress" as const },
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

beforeEach(() => {
  vi.stubEnv("VITE_SUPABASE_URL", "https://proj.supabase.co");
  vi.stubEnv("VITE_SUPABASE_ANON_KEY", "anon-key");
  getSession.mockResolvedValue({ data: { session: { access_token: "jwt-token" } } });
  window.localStorage.clear();
  window.sessionStorage.clear();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("placement-v3 client — cold-start retry hardening", () => {
  it("retries a net::ERR_FAILED non-response and recovers", async () => {
    const fetchMock = vi
      .fn()
      // two cold-start misses: fetch throws with no HTTP response at all
      .mockRejectedValueOnce(new TypeError("Failed to fetch"))
      .mockRejectedValueOnce(new TypeError("Failed to fetch"))
      // third attempt: the isolate is warm and answers
      .mockResolvedValueOnce(jsonResponse(START_OK));
    vi.stubGlobal("fetch", fetchMock);

    const session = await startSession();

    expect(session.sessionId).toBe("sess-1");
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("retries a gateway 5xx and recovers", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response("", { status: 503 }))
      .mockResolvedValueOnce(jsonResponse(START_OK));
    vi.stubGlobal("fetch", fetchMock);

    const session = await startSession();

    expect(session.sessionId).toBe("sess-1");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("does NOT retry a real handler error response (no double-submit)", async () => {
    // A received app response — even an error — means the handler ran. It must
    // be surfaced immediately, never retried.
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse({ ok: false, error: "invalid_json", message: "Invalid JSON." }, 400));
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      submitResponse({ sessionId: "sess-1", taskId: "writing-1", value: "hi", elapsedMs: 10 }),
    ).rejects.toThrow("Invalid JSON.");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("issues exactly one request on the happy path (success path unchanged)", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(START_OK));
    vi.stubGlobal("fetch", fetchMock);

    await startSession();

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("gives up after exhausting attempts on a persistent non-response", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));
    vi.stubGlobal("fetch", fetchMock);

    await expect(startSession()).rejects.toThrow(/temporarily unavailable/i);
    expect(fetchMock).toHaveBeenCalledTimes(4); // maxAttempts
  });
});
