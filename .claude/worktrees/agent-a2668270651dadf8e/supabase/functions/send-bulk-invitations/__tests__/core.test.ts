// supabase/functions/send-bulk-invitations/__tests__/core.test.ts

import { describe, it, expect, vi } from "vitest";

import { handleRequest, type Deps } from "../core";

const URL_BASE = "https://x.functions.supabase.co/send-bulk-invitations";

function makeDeps(overrides: Partial<Deps> = {}): Deps {
  return {
    resolveUserId: vi.fn().mockResolvedValue("user-1"),
    isFlagEnabled: vi.fn().mockResolvedValue(true),
    rateLimit: {
      countInWindow: vi.fn().mockResolvedValue(0),
    },
    insertInvitation: vi.fn().mockResolvedValue({ ok: true }),
    sendInviteMessage: vi.fn().mockResolvedValue({ ok: true }),
    ...overrides,
  };
}

function postReq(body: unknown): Request {
  return new Request(URL_BASE, {
    method: "POST",
    headers: { Authorization: "Bearer x" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

// ── auth + flag ──────────────────────────────────────────────────────

describe("handleRequest — guards", () => {
  it("401 when no JWT", async () => {
    const deps = makeDeps({ resolveUserId: vi.fn().mockResolvedValue(null) });
    const res = await handleRequest(postReq({ recipients: [{ email: "a@b.com" }] }), deps);
    expect(res.status).toBe(401);
  });

  it("503 when feature flag is OFF", async () => {
    const deps = makeDeps({ isFlagEnabled: vi.fn().mockResolvedValue(false) });
    const res = await handleRequest(postReq({ recipients: [{ email: "a@b.com" }] }), deps);
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.error_code).toBe("feature_disabled");
  });

  it("OPTIONS preflight returns 200 with CORS", async () => {
    const res = await handleRequest(
      new Request(URL_BASE, { method: "OPTIONS" }),
      makeDeps(),
    );
    expect(res.status).toBe(200);
  });

  it("405 on non-POST", async () => {
    const res = await handleRequest(
      new Request(URL_BASE, { method: "GET", headers: { Authorization: "Bearer x" } }),
      makeDeps(),
    );
    expect(res.status).toBe(405);
  });
});

// ── body validation ──────────────────────────────────────────────────

describe("handleRequest — body validation", () => {
  it("400 on malformed JSON", async () => {
    const res = await handleRequest(postReq("{not json"), makeDeps());
    expect(res.status).toBe(400);
  });

  it("400 when recipients array is missing or empty", async () => {
    expect((await handleRequest(postReq({}), makeDeps())).status).toBe(400);
    expect((await handleRequest(postReq({ recipients: [] }), makeDeps())).status).toBe(400);
  });
});

// ── rate limit ───────────────────────────────────────────────────────

describe("handleRequest — rate limit", () => {
  it("429 when batch exceeds the hourly cap", async () => {
    const deps = makeDeps({
      rateLimit: {
        countInWindow: vi.fn().mockImplementation(async (_u, win) =>
          win <= 60 * 60 ? 19 : 50,
        ),
      },
    });
    // 19 used + batch of 5 = 24, over the 20 cap → 429
    const res = await handleRequest(
      postReq({
        recipients: [
          { email: "a@b.com" },
          { email: "c@d.com" },
          { email: "e@f.com" },
          { email: "g@h.com" },
          { email: "i@j.com" },
        ],
      }),
      deps,
    );
    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body.error_code).toBe("FAMILY_INVITE_RATE_LIMIT_EXCEEDED");
    expect(deps.insertInvitation).not.toHaveBeenCalled();
  });

  it("rate-limit check uses the VALID batch size, not the input length", async () => {
    const deps = makeDeps();
    // 3 valid + 2 invalid; rate-limit-allowed for batch of 3.
    await handleRequest(
      postReq({
        recipients: [
          { email: "a@b.com" },
          { email: "not-an-email" }, // invalid
          { email: "c@d.com" },
          {}, // missing contact
          { email: "e@f.com" },
        ],
      }),
      deps,
    );
    expect(deps.insertInvitation).toHaveBeenCalledTimes(3);
  });
});

// ── happy path ───────────────────────────────────────────────────────

describe("handleRequest — happy path", () => {
  it("inserts + sends each valid recipient and returns per-row outcomes", async () => {
    const deps = makeDeps();
    const res = await handleRequest(
      postReq({
        recipients: [
          { email: "a@b.com", name: "A", relationship: "older_sister" },
          { email: "c@d.com", name: "C" },
        ],
        templateKey: "family",
      }),
      deps,
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.results.length).toBe(2);
    expect(body.results.every((r: { status: string }) => r.status === "sent")).toBe(true);
    expect(body.summary).toMatchObject({ attempted: 2, sent: 2, failed: 0 });
    expect(deps.insertInvitation).toHaveBeenCalledTimes(2);
    expect(deps.sendInviteMessage).toHaveBeenCalledTimes(2);
  });

  it("dedupes same email within batch — 1 sent, 1 failed=duplicate", async () => {
    const deps = makeDeps();
    const res = await handleRequest(
      postReq({
        recipients: [{ email: "A@B.COM" }, { email: "a@b.com" }],
      }),
      deps,
    );
    const body = await res.json();
    const statuses = body.results.map((r: { status: string; error_code?: string }) => ({
      status: r.status,
      error: r.error_code,
    }));
    expect(statuses).toContainEqual({ status: "sent", error: undefined });
    expect(statuses).toContainEqual({ status: "failed", error: "duplicate" });
  });

  it("preserves original index in the result rows", async () => {
    const deps = makeDeps();
    const res = await handleRequest(
      postReq({
        recipients: [
          { email: "not-an-email" }, // index 0 → failed
          { email: "good@example.com" }, // index 1 → sent
        ],
      }),
      deps,
    );
    const body = await res.json();
    const errorRow = body.results.find((r: { status: string }) => r.status === "failed");
    const sentRow = body.results.find((r: { status: string }) => r.status === "sent");
    expect(errorRow.index).toBe(0);
    expect(sentRow.index).toBe(1);
  });

  it("falls back to defaults when templateKey is invalid", async () => {
    const deps = makeDeps();
    await handleRequest(
      postReq({
        recipients: [{ email: "a@b.com" }],
        templateKey: "nope",
      }),
      deps,
    );
    const insertCall = (deps.insertInvitation as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(insertCall.templateKey).toBe("family");
  });

  it("clamps a custom message past 280 chars", async () => {
    const deps = makeDeps();
    await handleRequest(
      postReq({
        recipients: [{ email: "a@b.com" }],
        customMessage: "x".repeat(500),
      }),
      deps,
    );
    const insertCall = (deps.insertInvitation as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(insertCall.customMessage?.length).toBe(280);
  });
});

// ── per-row failure modes ────────────────────────────────────────────

describe("handleRequest — per-row failures", () => {
  it("marks send_failed when sendInviteMessage returns ok=false", async () => {
    const deps = makeDeps({
      sendInviteMessage: vi
        .fn()
        .mockResolvedValueOnce({ ok: false, error_code: "smtp_down" }),
    });
    const res = await handleRequest(
      postReq({ recipients: [{ email: "a@b.com" }] }),
      deps,
    );
    const body = await res.json();
    expect(body.results[0].status).toBe("failed");
    expect(body.results[0].error_code).toBe("smtp_down");
  });

  it("marks insert_failed when insertInvitation returns ok=false", async () => {
    const deps = makeDeps({
      insertInvitation: vi
        .fn()
        .mockResolvedValueOnce({ ok: false, error_code: "duplicate" }),
    });
    const res = await handleRequest(
      postReq({ recipients: [{ email: "a@b.com" }] }),
      deps,
    );
    const body = await res.json();
    expect(body.results[0].error_code).toBe("duplicate");
    expect(deps.sendInviteMessage).not.toHaveBeenCalled();
  });
});
