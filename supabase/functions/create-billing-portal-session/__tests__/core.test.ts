// supabase/functions/create-billing-portal-session/__tests__/core.test.ts
//
// Handler-level tests via injected Deps. This is the Stripe billing-portal
// entry point — the URL it returns is where users go to cancel/manage a
// paid subscription, so every gate (auth, subscription existence, customer
// resolution, Stripe failure) is money-path. Asserts:
//   - happy path returns 200 { url }
//   - a missing Authorization header is rejected 401 (missing required field)
//   - an invalid JWT is rejected 401
//   - no subscription -> 404, no customer -> 404
//   - a subscription-lookup failure surfaces 500 (failure injection)
//   - a Stripe throw is caught and surfaced 500 (failure injection)
//   - OPTIONS preflight and non-POST are handled

import { describe, expect, it, vi } from "vitest";

import { type Deps, handleRequest } from "../core";

const URL = "https://x.functions.supabase.co/create-billing-portal-session";

function makeDeps(overrides: Partial<Deps> = {}): Deps {
  return {
    getUserFromToken: vi.fn().mockResolvedValue({ id: "user-1" }),
    getSubscriptionLookup: vi
      .fn()
      .mockResolvedValue({ ok: true, hasSubscription: true }),
    getStripeCustomerId: vi.fn().mockResolvedValue("cus_abc123"),
    createPortalSession: vi
      .fn()
      .mockResolvedValue({ url: "https://billing.stripe.com/session/xyz" }),
    ...overrides,
  };
}

function postReq(headers: Record<string, string> = { Authorization: "Bearer good-token" }): Request {
  return new Request(URL, { method: "POST", headers });
}

describe("create-billing-portal-session handleRequest", () => {
  it("happy path: returns 200 with the Stripe portal url", async () => {
    const deps = makeDeps();
    const res = await handleRequest(postReq(), deps);

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({
      url: "https://billing.stripe.com/session/xyz",
    });
    expect(deps.getUserFromToken).toHaveBeenCalledWith("good-token");
    expect(deps.createPortalSession).toHaveBeenCalledWith("cus_abc123");
  });

  it("rejects a request with no Authorization header (missing required field)", async () => {
    const deps = makeDeps();
    const res = await handleRequest(postReq({}), deps);

    expect(res.status).toBe(401);
    await expect(res.json()).resolves.toEqual({
      error: "Missing Authorization Bearer token",
    });
    expect(deps.getUserFromToken).not.toHaveBeenCalled();
  });

  it("rejects a non-bearer Authorization scheme", async () => {
    const deps = makeDeps();
    const res = await handleRequest(
      postReq({ Authorization: "Basic abc123" }),
      deps,
    );

    expect(res.status).toBe(401);
    await expect(res.json()).resolves.toEqual({
      error: "Missing Authorization Bearer token",
    });
  });

  it("rejects an invalid JWT with 401", async () => {
    const deps = makeDeps({
      getUserFromToken: vi.fn().mockResolvedValue(null),
    });
    const res = await handleRequest(postReq(), deps);

    expect(res.status).toBe(401);
    await expect(res.json()).resolves.toEqual({
      error: "Invalid JWT",
      detail: "No user returned from auth",
    });
    expect(deps.getSubscriptionLookup).not.toHaveBeenCalled();
  });

  it("returns 404 when the user has no Stripe subscription", async () => {
    const deps = makeDeps({
      getSubscriptionLookup: vi
        .fn()
        .mockResolvedValue({ ok: true, hasSubscription: false }),
    });
    const res = await handleRequest(postReq(), deps);

    expect(res.status).toBe(404);
    await expect(res.json()).resolves.toEqual({
      error: "No Stripe subscription found for user",
    });
    expect(deps.getStripeCustomerId).not.toHaveBeenCalled();
  });

  it("returns 404 when no Stripe customer id resolves", async () => {
    const deps = makeDeps({
      getStripeCustomerId: vi.fn().mockResolvedValue(null),
    });
    const res = await handleRequest(postReq(), deps);

    expect(res.status).toBe(404);
    await expect(res.json()).resolves.toEqual({
      error: "No Stripe customer found for user",
    });
    expect(deps.createPortalSession).not.toHaveBeenCalled();
  });

  it("treats a blank/whitespace customer id as no customer (404)", async () => {
    const deps = makeDeps({
      getStripeCustomerId: vi.fn().mockResolvedValue("   "),
    });
    const res = await handleRequest(postReq(), deps);

    expect(res.status).toBe(404);
    await expect(res.json()).resolves.toEqual({
      error: "No Stripe customer found for user",
    });
  });

  it("failure injection: a subscription-lookup error surfaces 500", async () => {
    const deps = makeDeps({
      getSubscriptionLookup: vi.fn().mockResolvedValue({
        ok: false,
        error: "permission denied for table subscriptions",
      }),
    });
    const res = await handleRequest(postReq(), deps);

    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({
      error: "Failed to resolve subscription",
      detail: "permission denied for table subscriptions",
    });
  });

  it("failure injection: a Stripe API throw is caught and surfaced 500", async () => {
    const deps = makeDeps({
      createPortalSession: vi
        .fn()
        .mockRejectedValue(new Error("No such customer: cus_abc123")),
    });
    const res = await handleRequest(postReq(), deps);

    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({
      error: "Internal error",
      detail: "No such customer: cus_abc123",
    });
  });

  it("handles OPTIONS preflight with CORS headers", async () => {
    const res = await handleRequest(
      new Request(URL, { method: "OPTIONS" }),
      makeDeps(),
    );

    expect(res.status).toBe(200);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });

  it("rejects non-POST methods with 405", async () => {
    const res = await handleRequest(
      new Request(URL, { method: "GET" }),
      makeDeps(),
    );

    expect(res.status).toBe(405);
    await expect(res.json()).resolves.toEqual({
      error: "Method not allowed",
    });
  });
});
