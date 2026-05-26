// supabase/functions/mock-interview/__tests__/index.test.ts
//
// Handler-level tests via injected `Deps`. Mirrors the azure-phoneme
// pattern: e2e-style coverage of route dispatch, tier scenarios, and
// rejection paths — without spinning up Deno or Postgres.

import { describe, it, expect, vi } from "vitest";

import { handleRequest, type Deps } from "../core";

const URL_BASE = "https://x.functions.supabase.co/mock-interview";

function makeDeps(overrides: Partial<Deps> = {}): Deps {
  return {
    getUserFromAuthHeader: vi.fn().mockResolvedValue({ id: "user-1" }),
    fetchUserProfile: vi
      .fn()
      .mockResolvedValue({ tier: 0, isTrialing: false }),
    resolveAdminLevel: vi.fn().mockResolvedValue(0),
    countSessionsThisWeek: vi.fn().mockResolvedValue(0),
    insertSession: vi.fn().mockResolvedValue("sess-uuid-1"),
    markSessionCompleted: vi.fn().mockResolvedValue(true),
    now: () => new Date("2026-04-29T03:00:00Z"),
    ...overrides,
  };
}

function startReq(scenarioId: string | null = "interview-pm-1"): Request {
  return new Request(`${URL_BASE}/start`, {
    method: "POST",
    headers: { Authorization: "Bearer x" },
    body: scenarioId === null ? "{}" : JSON.stringify({ scenarioId }),
  });
}

function endReq(sessionId: string): Request {
  return new Request(`${URL_BASE}/end/${sessionId}`, {
    method: "POST",
    headers: { Authorization: "Bearer x" },
  });
}

// ── auth ─────────────────────────────────────────────────────────────

describe("handleRequest — auth", () => {
  it("returns 401 when getUserFromAuthHeader resolves null", async () => {
    const deps = makeDeps({ getUserFromAuthHeader: vi.fn().mockResolvedValue(null) });
    const res = await handleRequest(startReq(), deps);
    expect(res.status).toBe(401);
  });

  it("OPTIONS preflight returns 200 with CORS headers", async () => {
    const res = await handleRequest(
      new Request(`${URL_BASE}/start`, { method: "OPTIONS" }),
      makeDeps(),
    );
    expect(res.status).toBe(200);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });

  it("non-POST returns 405", async () => {
    const res = await handleRequest(
      new Request(`${URL_BASE}/start`, { method: "GET" }),
      makeDeps(),
    );
    expect(res.status).toBe(405);
  });
});

// ── /start dispatch ──────────────────────────────────────────────────

describe("handleRequest — /start dispatch", () => {
  it("returns 400 when scenarioId is missing", async () => {
    const res = await handleRequest(startReq(null), makeDeps());
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("scenarioId_required");
  });

  it("returns 400 when scenarioId is empty/whitespace", async () => {
    const res = await handleRequest(startReq("   "), makeDeps());
    expect(res.status).toBe(400);
  });

  it("returns 400 on malformed JSON", async () => {
    const req = new Request(`${URL_BASE}/start`, {
      method: "POST",
      headers: { Authorization: "Bearer x" },
      body: "{not json",
    });
    const res = await handleRequest(req, makeDeps());
    expect(res.status).toBe(400);
  });
});

// ── tier scenarios ────────────────────────────────────────────────────

describe("handleRequest — /start tier scenarios", () => {
  it("free tier with 0 sessions → 200, session inserted, count = 1", async () => {
    const deps = makeDeps({
      fetchUserProfile: vi.fn().mockResolvedValue({ tier: 0, isTrialing: false }),
      countSessionsThisWeek: vi.fn().mockResolvedValue(0),
    });
    const res = await handleRequest(startReq(), deps);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.sessionId).toBe("sess-uuid-1");
    expect(body.allow_reason).toBe("within_free_limit");
    expect(body.used_this_period).toBe(1);
    expect(body.limit).toBe(1);
    expect(deps.insertSession).toHaveBeenCalledWith("user-1", "interview-pm-1");
  });

  it("free tier with 1 session → 429 with bilingual error", async () => {
    const insertSession = vi.fn();
    const deps = makeDeps({
      fetchUserProfile: vi.fn().mockResolvedValue({ tier: 0, isTrialing: false }),
      countSessionsThisWeek: vi.fn().mockResolvedValue(1),
      insertSession,
    });
    const res = await handleRequest(startReq(), deps);
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toMatch(/^\d+$/);
    const body = await res.json();
    expect(body.error_code).toBe("MOCK_INTERVIEW_FREE_LIMIT_REACHED");
    expect(body.error_message_vi).toContain("Đã hết lượt");
    expect(body.error_message_en).toContain("Out of mock interviews");
    expect(body.used_this_period).toBe(1);
    expect(body.limit).toBe(1);
    expect(insertSession).not.toHaveBeenCalled();
  });

  it("trial tier (isTrialing=true) → 200 even with 5 prior sessions", async () => {
    const count = vi.fn().mockResolvedValue(5);
    const deps = makeDeps({
      fetchUserProfile: vi.fn().mockResolvedValue({ tier: 1, isTrialing: true }),
      countSessionsThisWeek: count,
    });
    const res = await handleRequest(startReq(), deps);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.allow_reason).toBe("trialing");
    expect(body.limit).toBeNull(); // unlimited surfaced as null
    expect(count).not.toHaveBeenCalled();
  });

  it("paid tier (tier 2) → 200 unlimited", async () => {
    const deps = makeDeps({
      fetchUserProfile: vi.fn().mockResolvedValue({ tier: 2, isTrialing: false }),
    });
    const res = await handleRequest(startReq(), deps);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.allow_reason).toBe("paid");
    expect(body.limit).toBeNull();
  });

  it("admin level 10 with tier 0 → bypass, 200", async () => {
    const deps = makeDeps({
      fetchUserProfile: vi.fn().mockResolvedValue({ tier: 0, isTrialing: false }),
      resolveAdminLevel: vi.fn().mockResolvedValue(10),
      countSessionsThisWeek: vi.fn().mockResolvedValue(99),
    });
    const res = await handleRequest(startReq(), deps);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.allow_reason).toBe("admin_bypass");
  });
});

// ── /end ─────────────────────────────────────────────────────────────

describe("handleRequest — /end", () => {
  const validUuid = "11111111-2222-3333-4444-555555555555";

  it("returns 200 when the session is marked completed", async () => {
    const mark = vi.fn().mockResolvedValue(true);
    const res = await handleRequest(endReq(validUuid), makeDeps({ markSessionCompleted: mark }));
    expect(res.status).toBe(200);
    expect(mark).toHaveBeenCalledWith(validUuid, "user-1");
  });

  it("returns 404 when the row didn't update (not owner / missing)", async () => {
    const res = await handleRequest(
      endReq(validUuid),
      makeDeps({ markSessionCompleted: vi.fn().mockResolvedValue(false) }),
    );
    expect(res.status).toBe(404);
  });

  it("returns 404 for a non-uuid sessionId path", async () => {
    const res = await handleRequest(endReq("not-a-uuid"), makeDeps());
    expect(res.status).toBe(404);
  });
});

// ── unknown path ──────────────────────────────────────────────────────

describe("handleRequest — unknown path", () => {
  it("returns 404 for a path that's not /start or /end/:uuid", async () => {
    const req = new Request(`${URL_BASE}/something-else`, {
      method: "POST",
      headers: { Authorization: "Bearer x" },
    });
    const res = await handleRequest(req, makeDeps());
    expect(res.status).toBe(404);
  });
});

// ── fail-open posture ─────────────────────────────────────────────────

describe("handleRequest — fail-open on infra blip", () => {
  it("when the gate throws, allows the session through (transition safety)", async () => {
    const deps = makeDeps({
      countSessionsThisWeek: vi.fn().mockRejectedValue(new Error("PG hiccup")),
      fetchUserProfile: vi.fn().mockResolvedValue({ tier: 0, isTrialing: false }),
    });
    const res = await handleRequest(startReq(), deps);
    expect(res.status).toBe(200);
    expect(deps.insertSession).toHaveBeenCalled();
  });

  it("missing profile (tier=0, no trial) treats as free-tier and counts", async () => {
    const count = vi.fn().mockResolvedValue(0);
    const deps = makeDeps({
      fetchUserProfile: vi.fn().mockResolvedValue(null),
      countSessionsThisWeek: count,
    });
    const res = await handleRequest(startReq(), deps);
    expect(res.status).toBe(200);
    expect(count).toHaveBeenCalledTimes(1);
  });
});
