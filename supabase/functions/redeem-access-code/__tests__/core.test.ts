// supabase/functions/redeem-access-code/__tests__/core.test.ts
//
// Handler-level tests via injected Deps. Asserts:
//   - Success path returns ok:true with the right shape.
//   - Every RPC error code maps to user-facing copy.
//   - Every failure path returns HTTP 200 (so the Supabase JS SDK
//     surfaces `data.error` instead of collapsing into "non-2xx").
//   - The handler ALWAYS goes through `redeemAtomic` for any write —
//     i.e., the multi-step write path that previously orphaned a
//     subscription on a constraint failure can't return.

import { describe, it, expect, vi } from "vitest";

import {
  handleRequest,
  type Deps,
  type RedeemRpcResult,
} from "../core";

const URL = "https://x.functions.supabase.co/redeem-access-code";

function makeDeps(overrides: Partial<Deps> = {}): Deps {
  return {
    getUserFromAuthHeader: vi.fn().mockResolvedValue({ id: "user-1" }),
    redeemAtomic: vi.fn().mockResolvedValue({
      ok: true,
      row: {
        tier_name: "Mercy 1y",
        days: 365,
        is_lifetime: false,
        valid_until: "2027-05-10T05:48:08.075431+00:00",
      },
    } satisfies RedeemRpcResult),
    ...overrides,
  };
}

function postReq(body: unknown, headers: Record<string, string> = {}): Request {
  return new Request(URL, {
    method: "POST",
    headers: { Authorization: "Bearer x", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

// ── success ─────────────────────────────────────────────────────────

describe("handleRequest — success", () => {
  it("returns ok:true with tier + valid_until on a happy redeem", async () => {
    const deps = makeDeps();
    const res = await handleRequest(postReq({ code: "GIFT1Y-52340F" }), deps);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.success).toBe(true);
    expect(body.tier).toBe("Mercy 1y");
    expect(body.days).toBe(365);
    expect(body.valid_until).toBe("2027-05-10T05:48:08.075431+00:00");
    expect(body.message).toMatch(/redeemed successfully/);
    expect(deps.redeemAtomic).toHaveBeenCalledWith("user-1", "GIFT1Y-52340F");
  });

  it("trims whitespace around the code before passing to the RPC", async () => {
    const deps = makeDeps();
    await handleRequest(postReq({ code: "  GIFT1Y-52340F  " }), deps);
    expect(deps.redeemAtomic).toHaveBeenCalledWith("user-1", "GIFT1Y-52340F");
  });

  it("formats lifetime grants distinctly", async () => {
    const deps = makeDeps({
      redeemAtomic: vi.fn().mockResolvedValue({
        ok: true,
        row: {
          tier_name: "Lifetime",
          days: -1,
          is_lifetime: true,
          valid_until: "2126-05-10T00:00:00Z",
        },
      } satisfies RedeemRpcResult),
    });
    const res = await handleRequest(postReq({ code: "LIFE-XX" }), deps);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.days).toBe("lifetime");
    expect(body.valid_until).toBe("never");
    expect(body.message).toMatch(/Lifetime/);
  });
});

// ── auth ────────────────────────────────────────────────────────────

describe("handleRequest — auth", () => {
  it("returns ok:false with login prompt when no Authorization header", async () => {
    const deps = makeDeps({
      getUserFromAuthHeader: vi.fn().mockResolvedValue(null),
    });
    const res = await handleRequest(
      new Request(URL, { method: "POST", body: '{"code":"X"}' }),
      deps,
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toMatch(/log in/i);
    expect(deps.redeemAtomic).not.toHaveBeenCalled();
  });

  it("returns ok:false when JWT validation fails", async () => {
    const deps = makeDeps({
      getUserFromAuthHeader: vi.fn().mockResolvedValue(null),
    });
    const res = await handleRequest(postReq({ code: "X" }), deps);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(deps.redeemAtomic).not.toHaveBeenCalled();
  });
});

// ── input validation ────────────────────────────────────────────────

describe("handleRequest — input validation", () => {
  it("returns ok:false on missing code", async () => {
    const deps = makeDeps();
    const res = await handleRequest(postReq({}), deps);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toMatch(/code format/i);
  });

  it("returns ok:false on empty-string code", async () => {
    const deps = makeDeps();
    const res = await handleRequest(postReq({ code: "   " }), deps);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toMatch(/code format/i);
  });

  it("returns ok:false on non-string code", async () => {
    const deps = makeDeps();
    const res = await handleRequest(postReq({ code: 123 }), deps);
    const body = await res.json();
    expect(body.ok).toBe(false);
  });

  it("returns ok:false on malformed JSON body", async () => {
    const deps = makeDeps();
    const res = await handleRequest(postReq("not-json"), deps);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toMatch(/request body/i);
  });
});

// ── RPC error mapping ───────────────────────────────────────────────

describe("handleRequest — RPC error mapping", () => {
  const cases: Array<[string, RegExp]> = [
    ["CODE_NOT_FOUND", /invalid or inactive/i],
    ["CODE_EXPIRED", /expired/i],
    ["CODE_FULLY_REDEEMED", /fully redeemed/i],
    ["ALREADY_REDEEMED", /already redeemed/i],
  ];

  for (const [pgMessage, userFacing] of cases) {
    it(`maps ${pgMessage} to user-facing copy`, async () => {
      const deps = makeDeps({
        redeemAtomic: vi.fn().mockResolvedValue({
          ok: false,
          pgCode: "P0001",
          message: pgMessage,
        } satisfies RedeemRpcResult),
      });
      const res = await handleRequest(postReq({ code: "X" }), deps);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.ok).toBe(false);
      expect(body.error).toMatch(userFacing);
    });
  }

  it("passes through unknown RPC error messages verbatim", async () => {
    const deps = makeDeps({
      redeemAtomic: vi.fn().mockResolvedValue({
        ok: false,
        pgCode: "23514",
        message: 'new row violates check constraint "payment_transactions_payment_method_check"',
      } satisfies RedeemRpcResult),
    });
    const res = await handleRequest(postReq({ code: "X" }), deps);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toMatch(/payment_method_check/);
    expect(body.pg_code).toBe("23514");
  });
});

// ── atomicity contract ─────────────────────────────────────────────
//
// Hard guarantee from the new architecture: there is exactly one path
// to writes — the redeemAtomic RPC. A constraint failure inside the
// RPC rolls back ALL writes (subscription upsert, payment_transactions,
// access_code_redemptions, used_count bump). The handler can't even
// observe a partial success, because the RPC is one Postgres function
// call and all four writes share its implicit transaction.
//
// These tests pin that contract: the handler invokes redeemAtomic at
// most once and never has any other write seam to leak through.

describe("handleRequest — atomicity contract", () => {
  it("invokes redeemAtomic exactly once on success", async () => {
    const deps = makeDeps();
    await handleRequest(postReq({ code: "X" }), deps);
    expect(deps.redeemAtomic).toHaveBeenCalledTimes(1);
  });

  it("returns ok:false WITHOUT a second RPC call when the RPC fails", async () => {
    const deps = makeDeps({
      redeemAtomic: vi.fn().mockResolvedValue({
        ok: false,
        pgCode: "23514",
        message: "constraint violation",
      } satisfies RedeemRpcResult),
    });
    const res = await handleRequest(postReq({ code: "X" }), deps);
    expect(res.status).toBe(200);
    expect((await res.json()).ok).toBe(false);
    // Critical: we don't retry, don't fall back to a half-write path.
    expect(deps.redeemAtomic).toHaveBeenCalledTimes(1);
  });

  it("does NOT invoke redeemAtomic when input validation fails", async () => {
    const deps = makeDeps();
    await handleRequest(postReq({ code: "" }), deps);
    expect(deps.redeemAtomic).not.toHaveBeenCalled();
  });

  it("does NOT invoke redeemAtomic when auth fails", async () => {
    const deps = makeDeps({
      getUserFromAuthHeader: vi.fn().mockResolvedValue(null),
    });
    await handleRequest(postReq({ code: "X" }), deps);
    expect(deps.redeemAtomic).not.toHaveBeenCalled();
  });
});

// ── CORS + method handling ─────────────────────────────────────────

describe("handleRequest — CORS + method", () => {
  it("OPTIONS preflight returns 200 with CORS headers", async () => {
    const res = await handleRequest(
      new Request(URL, { method: "OPTIONS" }),
      makeDeps(),
    );
    expect(res.status).toBe(200);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });

  it("rejects non-POST/OPTIONS methods with ok:false (still 200)", async () => {
    const res = await handleRequest(
      new Request(URL, { method: "GET", headers: { Authorization: "Bearer x" } }),
      makeDeps(),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(false);
  });
});
