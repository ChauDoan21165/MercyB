// src/lib/__tests__/billing.dupeGuard.test.ts
//
// Money-path regression guard for the duplicate-subscription fix.
//
// Context: the fix that prevents a user from being charged twice for the
// same tier shipped via PR #215 (commits d8b69982 + f5e09918). It was
// never covered by an automated test. The backend (billing-stripe-change-
// plan) returns one of three "you already have a live subscription"
// signals; the frontend MUST route every one of them to the billing
// portal instead of starting a second Stripe checkout.
//
// This drives the real, shipped startCheckoutOrOpenPortal() end-to-end
// with the network + supabase client + window stubbed, so a future edit
// to the guard at src/lib/billing.ts:264-270 that drops a signal — or
// over-fires and blocks a legitimate first-time checkout — turns this
// test red.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// --- supabase client stub --------------------------------------------------
// startCheckoutOrOpenPortal -> fetchMyEntitlement() -> invokeWithAuth(
//   "me-entitlement") and openBillingPortal() -> invokeWithAuth(
//   "create-billing-portal-session"); getAccessToken() -> auth.getSession().
const invokeMock = vi.fn();
const getSessionMock = vi.fn();

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: { getSession: () => getSessionMock() },
    functions: { invoke: (fn: string, opts?: unknown) => invokeMock(fn, opts) },
  },
}));

import { startCheckoutOrOpenPortal } from "../billing";

const PORTAL_URL = "https://billing.stripe.test/p/session_123";
const CHECKOUT_URL = "https://checkout.stripe.test/c/session_456";

const realLocation = window.location;
let fetchMock: ReturnType<typeof vi.fn>;

function backendReturns(payload: Record<string, unknown>) {
  fetchMock.mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => payload,
  } as unknown as Response);
}

beforeEach(() => {
  vi.stubEnv("VITE_SUPABASE_URL", "https://proj.supabase.co");
  vi.stubEnv("VITE_SUPABASE_ANON_KEY", "anon-key");

  getSessionMock.mockResolvedValue({
    data: { session: { access_token: "test-token" } },
    error: null,
  });

  // Default invoke behaviour: non-premium user (so no early "noop"),
  // and a working billing-portal session.
  invokeMock.mockImplementation(async (fn: string) => {
    if (fn === "me-entitlement") {
      return { data: { is_premium: false }, error: null };
    }
    if (fn === "create-billing-portal-session") {
      return { data: { url: PORTAL_URL }, error: null };
    }
    return { data: null, error: null };
  });

  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);

  Object.defineProperty(window, "location", {
    configurable: true,
    writable: true,
    value: { assign: vi.fn(), origin: "http://localhost", href: "" },
  });
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
  Object.defineProperty(window, "location", {
    configurable: true,
    writable: true,
    value: realLocation,
  });
});

describe("duplicate-subscription guard — frontend routing (src/lib/billing.ts)", () => {
  // The three backend response shapes the guard must treat as
  // "already subscribed". Backend half: billing-stripe-change-plan
  // returns action:"manage_billing"; older/variant paths use
  // action:"already_subscribed" or already_subscribed:true.
  it.each([
    ["action: 'manage_billing'", { ok: true, action: "manage_billing" }],
    ["action: 'already_subscribed'", { ok: true, action: "already_subscribed" }],
    ["already_subscribed: true (boolean)", { ok: true, already_subscribed: true }],
  ])(
    "routes %s to the billing portal — never a second checkout",
    async (_label, payload) => {
      backendReturns(payload);

      const result = await startCheckoutOrOpenPortal({ tierId: "tier_pro" });

      expect(result).toEqual({ mode: "portal" });
      // Portal session opened, redirected to Stripe's billing portal...
      expect(invokeMock).toHaveBeenCalledWith(
        "create-billing-portal-session",
        expect.anything(),
      );
      expect(window.location.assign).toHaveBeenCalledWith(PORTAL_URL);
      // ...and crucially the only backend POST was the plan-change call,
      // i.e. checkout.sessions.create was never reached.
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0][0]).toContain(
        "/functions/v1/billing-stripe-change-plan",
      );
    },
  );

  it("does NOT over-fire: a clean first-time customer still reaches checkout", async () => {
    // No duplicate signal in the payload — a legitimate new subscriber.
    // The guard must not block them (defense-in-depth must stay fail-safe
    // toward letting real first-time checkouts through).
    backendReturns({ ok: true, action: "checkout", url: CHECKOUT_URL });

    const result = await startCheckoutOrOpenPortal({ tierId: "tier_pro" });

    expect(result).toEqual({ mode: "checkout" });
    expect(window.location.assign).toHaveBeenCalledWith(CHECKOUT_URL);
    expect(invokeMock).not.toHaveBeenCalledWith(
      "create-billing-portal-session",
      expect.anything(),
    );
  });
});
