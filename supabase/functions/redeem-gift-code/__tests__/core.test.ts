// supabase/functions/redeem-gift-code/__tests__/core.test.ts
//
// Handler-level tests via injected Deps. The load-bearing assertion
// (B22 silent-failure carve-out): a redemption whose written row is NOT
// visible to the entitlement read path (`not_propagated`, i.e. the
// is_gift_redemption=false case) returns ok:false — NOT ok:true — does
// NOT burn the gift code, and surfaces to Sentry.

import { describe, it, expect, vi } from "vitest";

import {
  type Deps,
  handleRequest,
  type RedeemOutcome,
} from "../core";

const URL = "https://x.functions.supabase.co/redeem-gift-code";

function makeDeps(overrides: Partial<Deps> = {}): Deps {
  return {
    getUserFromAuthHeader: vi
      .fn()
      .mockResolvedValue({ id: "user-1", email: "u@example.com" }),
    redeemGift: vi.fn().mockResolvedValue({
      ok: true,
      tier: "Level 3",
      giftId: "gift-1",
      userEmail: "u@example.com",
    } satisfies RedeemOutcome),
    finalizeRedemption: vi.fn().mockResolvedValue(undefined),
    captureError: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

function postReq(
  body: unknown,
  headers: Record<string, string> = { Authorization: "Bearer x" },
): Request {
  return new Request(URL, {
    method: "POST",
    headers: { ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

// ── success ───────────────────────────────────────────────────────────

describe("handleRequest — success", () => {
  it("returns ok:true with tier + message on a verified-visible redeem", async () => {
    const deps = makeDeps();
    const res = await handleRequest(postReq({ code: "ABC-123" }), deps);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.tier).toBe("Level 3");
    expect(body.message).toMatch(/Welcome to Level 3/);
  });

  it("burns the code (finalizeRedemption) ONLY on a verified redeem, and does not alert Sentry", async () => {
    const deps = makeDeps();
    await handleRequest(postReq({ code: "abc-123" }), deps);
    expect(deps.finalizeRedemption).toHaveBeenCalledOnce();
    expect(deps.finalizeRedemption).toHaveBeenCalledWith(
      { id: "user-1", email: "u@example.com" },
      "gift-1",
      "Level 3",
    );
    expect(deps.captureError).not.toHaveBeenCalled();
  });

  it("upper-cases and trims the code before redeeming", async () => {
    const deps = makeDeps();
    await handleRequest(postReq({ code: "  abc-123  " }), deps);
    expect(deps.redeemGift).toHaveBeenCalledWith(
      { id: "user-1", email: "u@example.com" },
      "ABC-123",
    );
  });
});

// ── the B22 silent-failure carve-out (the reason this PR exists) ──────

describe("handleRequest — silent-failure carve-out", () => {
  it("not_propagated (is_gift_redemption=false row) returns ok:false, NOT ok:true", async () => {
    const deps = makeDeps({
      redeemGift: vi.fn().mockResolvedValue({
        ok: false,
        kind: "not_propagated",
        tier: "Level 3",
        giftId: "gift-1",
      } satisfies RedeemOutcome),
    });

    const res = await handleRequest(postReq({ code: "ABC-123" }), deps);

    expect(res.status).toBe(200); // SDK-safe envelope, but…
    const body = await res.json();
    expect(body.ok).toBe(false); // …NOT the old ok:true lie
    expect(body.error_code).toBe("GIFT_REDEEM_NOT_PROPAGATED");
    expect(body.error).toMatch(/has NOT been used/);
    expect(body.error).toMatch(/admin@mercyblade\.com/);
  });

  it("not_propagated does NOT burn the gift code", async () => {
    const deps = makeDeps({
      redeemGift: vi.fn().mockResolvedValue({
        ok: false,
        kind: "not_propagated",
        tier: "Level 3",
        giftId: "gift-1",
      } satisfies RedeemOutcome),
    });
    await handleRequest(postReq({ code: "ABC-123" }), deps);
    expect(deps.finalizeRedemption).not.toHaveBeenCalled();
  });

  it("not_propagated surfaces to Sentry with stage + tier tags and the code in extra", async () => {
    const deps = makeDeps({
      redeemGift: vi.fn().mockResolvedValue({
        ok: false,
        kind: "not_propagated",
        tier: "Level 3",
        giftId: "gift-1",
      } satisfies RedeemOutcome),
    });
    await handleRequest(postReq({ code: "ABC-123" }), deps);
    expect(deps.captureError).toHaveBeenCalledOnce();
    const [, ctx] = (deps.captureError as ReturnType<typeof vi.fn>).mock
      .calls[0];
    expect(ctx.userId).toBe("user-1");
    expect(ctx.tags).toMatchObject({
      stage: "entitlement_verify",
      tier: "Level 3",
    });
    expect(ctx.extra).toMatchObject({ code: "ABC-123", gift_id: "gift-1" });
  });

  it("write_failed returns ok:false + GIFT_REDEEM_WRITE_FAILED, no burn, Sentry alerted", async () => {
    const deps = makeDeps({
      redeemGift: vi.fn().mockResolvedValue({
        ok: false,
        kind: "write_failed",
        tier: "Level 3",
        giftId: "gift-1",
        detail: "null value in column current_period_end",
      } satisfies RedeemOutcome),
    });

    const res = await handleRequest(postReq({ code: "ABC-123" }), deps);
    const body = await res.json();

    expect(body.ok).toBe(false);
    expect(body.error_code).toBe("GIFT_REDEEM_WRITE_FAILED");
    expect(deps.finalizeRedemption).not.toHaveBeenCalled();
    expect(deps.captureError).toHaveBeenCalledOnce();
    const [, ctx] = (deps.captureError as ReturnType<typeof vi.fn>).mock
      .calls[0];
    expect(ctx.tags.stage).toBe("subscription_write");
    expect(ctx.extra.detail).toMatch(/current_period_end/);
  });
});

// ── ordinary (non-silent) redeem failures keep their old copy ────────

describe("handleRequest — known redeem failures", () => {
  const cases: Array<{
    outcome: RedeemOutcome;
    match: RegExp;
  }> = [
    { outcome: { ok: false, kind: "not_found" }, match: /not found or already used/ },
    { outcome: { ok: false, kind: "expired" }, match: /has expired/ },
    {
      outcome: { ok: false, kind: "already_redeemed", tier: "Level 3" },
      match: /already redeemed a Level 3 code/,
    },
    {
      outcome: { ok: false, kind: "tier_not_configured", tier: "Level 3" },
      match: /Tier Level 3 is not configured/,
    },
  ];

  for (const { outcome, match } of cases) {
    it(`${outcome.kind} → ok:false, friendly copy, no burn, no Sentry`, async () => {
      const deps = makeDeps({
        redeemGift: vi.fn().mockResolvedValue(outcome),
      });
      const res = await handleRequest(postReq({ code: "ABC-123" }), deps);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.ok).toBe(false);
      expect(body.error).toMatch(match);
      expect(body.error_code).toBeUndefined();
      expect(deps.finalizeRedemption).not.toHaveBeenCalled();
      expect(deps.captureError).not.toHaveBeenCalled();
    });
  }
});

// ── auth + input validation ──────────────────────────────────────────

describe("handleRequest — auth & input", () => {
  it("missing Authorization header → login prompt, never touches redeemGift", async () => {
    const deps = makeDeps();
    const res = await handleRequest(postReq({ code: "ABC-123" }, {}), deps);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toMatch(/Please log in to redeem a gift code/);
    expect(deps.getUserFromAuthHeader).not.toHaveBeenCalled();
    expect(deps.redeemGift).not.toHaveBeenCalled();
  });

  it("invalid/expired token (getUser → null) → session-expired message", async () => {
    const deps = makeDeps({
      getUserFromAuthHeader: vi.fn().mockResolvedValue(null),
    });
    const res = await handleRequest(postReq({ code: "ABC-123" }), deps);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toMatch(/Session expired/);
    expect(deps.redeemGift).not.toHaveBeenCalled();
  });

  it("invalid JSON body → format error", async () => {
    const deps = makeDeps();
    const res = await handleRequest(postReq("not-json{"), deps);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toMatch(/Invalid request format/);
  });

  it("missing code → 'Gift code is required.'", async () => {
    const deps = makeDeps();
    const res = await handleRequest(postReq({}), deps);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toMatch(/Gift code is required/);
    expect(deps.redeemGift).not.toHaveBeenCalled();
  });

  it("CORS preflight returns 200 with no body", async () => {
    const deps = makeDeps();
    const res = await handleRequest(
      new Request(URL, { method: "OPTIONS" }),
      deps,
    );
    expect(res.status).toBe(200);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });

  it("every failure path is HTTP 200 (SDK-safe envelope)", async () => {
    for (const outcome of [
      { ok: false, kind: "not_found" },
      { ok: false, kind: "not_propagated", tier: "Level 3", giftId: "g" },
    ] as RedeemOutcome[]) {
      const deps = makeDeps({
        redeemGift: vi.fn().mockResolvedValue(outcome),
      });
      const res = await handleRequest(postReq({ code: "ABC-123" }), deps);
      expect(res.status).toBe(200);
    }
  });
});
