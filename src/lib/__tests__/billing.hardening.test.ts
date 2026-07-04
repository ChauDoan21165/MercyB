import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { createSupabaseMock } from "@/test/mocks/supabaseMock";

type SupabaseMock = ReturnType<typeof createSupabaseMock>;

vi.mock("@/lib/supabaseClient", async () => {
  const mod = await vi.importActual<typeof import("@/test/mocks/supabaseMock")>("@/test/mocks/supabaseMock");
  const supabase = mod.createSupabaseMock();
  return { supabase, __mock: supabase };
});

import * as SupabaseModule from "@/lib/supabaseClient";
import {
  fetchMyEntitlement,
  openBillingPortal,
  startCheckoutOrOpenPortal,
  type ChangePlanResponse,
  type CheckoutResponse,
  type EntitlementResponse,
  type PortalResponse,
  type StartBillingParams,
  type StartBillingResult,
} from "@/lib/billing";

const supabaseMock = (SupabaseModule as typeof SupabaseModule & { __mock: SupabaseMock }).__mock;

const originalLocation = window.location;
let assignMock: ReturnType<typeof vi.fn>;

function installLocationAssignMock() {
  assignMock = vi.fn();

  Object.defineProperty(window, "location", {
    configurable: true,
    writable: true,
    value: {
      ...originalLocation,
      origin: "https://app.example.test",
      assign: assignMock,
    },
  });
}

function mockAuthenticatedSession(token = "token-123") {
  supabaseMock.auth.getSession.mockResolvedValue({
    data: {
      session: {
        access_token: token,
        user: { id: "user-1", email: "learner@example.test" },
      },
    },
    error: null,
  });
}

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
    ...init,
  });
}

function lastFetchCall() {
  const fetchMock = fetch as unknown as ReturnType<typeof vi.fn>;
  const [url, init] = fetchMock.mock.calls.at(-1) ?? [];
  return { url, init: init as RequestInit };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
  vi.stubEnv("VITE_SUPABASE_URL", "https://project.supabase.co");
  vi.stubEnv("VITE_SUPABASE_ANON_KEY", "anon-key");
  vi.stubGlobal("fetch", vi.fn());
  installLocationAssignMock();
  mockAuthenticatedSession();
  supabaseMock.functions.invoke.mockResolvedValue({ data: null, error: null });
});

afterEach(() => {
  Object.defineProperty(window, "location", {
    configurable: true,
    writable: true,
    value: originalLocation,
  });
  vi.unstubAllEnvs();
});

describe("billing exported type contracts", () => {
  it("accepts all exported response and parameter types", () => {
    const entitlement: EntitlementResponse = {
      is_premium: true,
      status: "active",
      source: "stripe",
      expires_at: "2027-01-01T00:00:00Z",
      current_period_end: "2027-01-01T00:00:00Z",
      cancel_at_period_end: false,
      price_id: "price_month",
      plan_name: "Level 1 Monthly",
      vip_tier: "level1",
    };
    const checkout: CheckoutResponse = {
      ok: true,
      url: "https://checkout.example.test/session",
      checkout_url: null,
      checkoutUrl: null,
      action: "checkout",
      mode: "checkout",
      message: null,
      current_price_id: "price_old",
      requested_price_id: "price_new",
      tier_id: "level3",
    };
    const changePlan: ChangePlanResponse = {
      ok: true,
      changed: true,
      action: "change_plan",
      change_type: "upgrade",
      message: "changed",
      previous_price_id: "price_old",
      requested_price_id: "price_new",
    };
    const portal: PortalResponse = { url: "https://billing.example.test/portal" };
    const params: StartBillingParams = {
      tierId: "level3",
      priceId: "price_new",
      successUrl: "https://app.example.test/done",
      cancelUrl: "https://app.example.test/pricing",
    };
    const result: StartBillingResult = {
      mode: "change_plan",
      changeType: "upgrade",
    };

    expect({
      entitlement,
      checkout,
      changePlan,
      portal,
      params,
      result,
    }).toMatchObject({
      entitlement: { is_premium: true, price_id: "price_month" },
      checkout: { action: "checkout", tier_id: "level3" },
      changePlan: { change_type: "upgrade" },
      portal: { url: expect.stringContaining("portal") },
      params: { priceId: "price_new" },
      result: { mode: "change_plan" },
    });
  });
});

describe("fetchMyEntitlement", () => {
  it("invokes me-entitlement with the authenticated bearer token", async () => {
    const entitlement: EntitlementResponse = {
      is_premium: true,
      status: "active",
      source: "stripe",
      current_period_end: "2027-01-01T00:00:00Z",
      price_id: "price_level1",
    };
    supabaseMock.functions.invoke.mockResolvedValueOnce({
      data: entitlement,
      error: null,
    });

    await expect(fetchMyEntitlement()).resolves.toEqual(entitlement);

    expect(supabaseMock.functions.invoke).toHaveBeenCalledWith(
      "me-entitlement",
      {
        body: undefined,
        headers: { Authorization: "Bearer token-123" },
      },
    );
  });

  it("rejects before invoking functions when the session is missing", async () => {
    supabaseMock.auth.getSession.mockResolvedValueOnce({
      data: { session: null },
      error: null,
    });

    await expect(fetchMyEntitlement()).rejects.toThrow(
      "User is not authenticated",
    );
    expect(supabaseMock.functions.invoke).not.toHaveBeenCalled();
  });

  it("uses the Supabase function error message when invocation fails", async () => {
    supabaseMock.functions.invoke.mockResolvedValueOnce({
      data: null,
      error: { message: "edge unavailable" },
    });

    await expect(fetchMyEntitlement()).rejects.toThrow("edge unavailable");
  });
});

describe("openBillingPortal", () => {
  it("navigates to the billing portal URL and reports portal mode", async () => {
    supabaseMock.functions.invoke.mockResolvedValueOnce({
      data: { url: "https://billing.example.test/session" },
      error: null,
    });

    await expect(openBillingPortal()).resolves.toEqual({ mode: "portal" });

    expect(supabaseMock.functions.invoke).toHaveBeenCalledWith(
      "create-billing-portal-session",
      {
        body: undefined,
        headers: { Authorization: "Bearer token-123" },
      },
    );
    expect(assignMock).toHaveBeenCalledWith(
      "https://billing.example.test/session",
    );
  });

  it("throws when the portal function omits the URL", async () => {
    supabaseMock.functions.invoke.mockResolvedValueOnce({
      data: { url: "" },
      error: null,
    });

    await expect(openBillingPortal()).rejects.toThrow(
      "Billing portal URL was missing.",
    );
    expect(assignMock).not.toHaveBeenCalled();
  });
});

describe("startCheckoutOrOpenPortal", () => {
  it("requires either a tierId or priceId", async () => {
    await expect(startCheckoutOrOpenPortal({})).rejects.toThrow(
      "tierId or priceId is required.",
    );

    expect(supabaseMock.auth.getSession).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("returns noop when a premium learner requests the current price", async () => {
    supabaseMock.functions.invoke.mockResolvedValueOnce({
      data: {
        is_premium: true,
        price_id: " price_current ",
        status: "active",
      } satisfies EntitlementResponse,
      error: null,
    });

    await expect(
      startCheckoutOrOpenPortal({ priceId: "price_current" }),
    ).resolves.toEqual({ mode: "noop" });

    expect(fetch).not.toHaveBeenCalled();
    expect(assignMock).not.toHaveBeenCalled();
  });

  it("posts a trimmed checkout/change request with default redirect URLs", async () => {
    supabaseMock.functions.invoke.mockResolvedValueOnce({
      data: { is_premium: false },
      error: null,
    });
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({
        action: "checkout",
        url: "https://checkout.example.test/session",
      }),
    );

    await expect(
      startCheckoutOrOpenPortal({
        tierId: " level3 ",
        priceId: " price_level3 ",
      }),
    ).resolves.toEqual({ mode: "checkout" });

    const { url, init } = lastFetchCall();
    expect(url).toBe(
      "https://project.supabase.co/functions/v1/billing-stripe-change-plan",
    );
    expect(init).toMatchObject({
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer token-123",
        apikey: "anon-key",
      },
    });
    expect(JSON.parse(String(init.body))).toEqual({
      tier_id: "level3",
      price_id: "price_level3",
      success_url: "https://app.example.test/billing/success",
      cancel_url: "https://app.example.test/pricing",
    });
    expect(assignMock).toHaveBeenCalledWith(
      "https://checkout.example.test/session",
    );
  });

  it("uses explicit redirect URLs and checkout_url fallback", async () => {
    supabaseMock.functions.invoke.mockResolvedValueOnce({
      data: { is_premium: false },
      error: null,
    });
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({
        mode: "checkout",
        checkout_url: "https://checkout.example.test/fallback",
      }),
    );

    await expect(
      startCheckoutOrOpenPortal({
        priceId: "price_year",
        successUrl: "https://app.example.test/success/custom",
        cancelUrl: "https://app.example.test/cancel/custom",
      }),
    ).resolves.toEqual({ mode: "checkout" });

    const { init } = lastFetchCall();
    expect(JSON.parse(String(init.body))).toEqual({
      price_id: "price_year",
      success_url: "https://app.example.test/success/custom",
      cancel_url: "https://app.example.test/cancel/custom",
    });
    expect(assignMock).toHaveBeenCalledWith(
      "https://checkout.example.test/fallback",
    );
  });

  it("accepts legacy checkoutUrl fallback without an action", async () => {
    supabaseMock.functions.invoke.mockResolvedValueOnce({
      data: { is_premium: false },
      error: null,
    });
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({
        checkoutUrl: "https://checkout.example.test/legacy",
      }),
    );

    await expect(
      startCheckoutOrOpenPortal({ tierId: "level1" }),
    ).resolves.toEqual({ mode: "checkout" });

    expect(assignMock).toHaveBeenCalledWith(
      "https://checkout.example.test/legacy",
    );
  });

  it("returns change_plan with the backend change type", async () => {
    supabaseMock.functions.invoke.mockResolvedValueOnce({
      data: { is_premium: true, price_id: "price_old" },
      error: null,
    });
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({
        action: "change_plan",
        change_type: "downgrade",
      }),
    );

    await expect(
      startCheckoutOrOpenPortal({ priceId: "price_new" }),
    ).resolves.toEqual({ mode: "change_plan", changeType: "downgrade" });
    expect(assignMock).not.toHaveBeenCalled();
  });

  it("returns noop for explicit noop and unchanged response shapes", async () => {
    supabaseMock.functions.invoke
      .mockResolvedValueOnce({ data: { is_premium: false }, error: null })
      .mockResolvedValueOnce({ data: { is_premium: false }, error: null });
    vi.mocked(fetch)
      .mockResolvedValueOnce(jsonResponse({ action: "noop" }))
      .mockResolvedValueOnce(jsonResponse({ changed: false }));

    await expect(
      startCheckoutOrOpenPortal({ tierId: "level1" }),
    ).resolves.toEqual({ mode: "noop" });
    await expect(
      startCheckoutOrOpenPortal({ tierId: "level3" }),
    ).resolves.toEqual({ mode: "noop" });
  });

  it("opens the portal for duplicate subscription response variants", async () => {
    supabaseMock.functions.invoke
      .mockResolvedValueOnce({ data: { is_premium: false }, error: null })
      .mockResolvedValueOnce({
        data: { url: "https://billing.example.test/manage-1" },
        error: null,
      })
      .mockResolvedValueOnce({ data: { is_premium: false }, error: null })
      .mockResolvedValueOnce({
        data: { url: "https://billing.example.test/manage-2" },
        error: null,
      })
      .mockResolvedValueOnce({ data: { is_premium: false }, error: null })
      .mockResolvedValueOnce({
        data: { url: "https://billing.example.test/manage-3" },
        error: null,
      });
    vi.mocked(fetch)
      .mockResolvedValueOnce(jsonResponse({ action: "manage_billing" }))
      .mockResolvedValueOnce(jsonResponse({ action: "already_subscribed" }))
      .mockResolvedValueOnce(jsonResponse({ already_subscribed: true }));

    await expect(
      startCheckoutOrOpenPortal({ tierId: "level1" }),
    ).resolves.toEqual({ mode: "portal" });
    await expect(
      startCheckoutOrOpenPortal({ tierId: "level2" }),
    ).resolves.toEqual({ mode: "portal" });
    await expect(
      startCheckoutOrOpenPortal({ tierId: "level3" }),
    ).resolves.toEqual({ mode: "portal" });

    expect(assignMock).toHaveBeenNthCalledWith(
      1,
      "https://billing.example.test/manage-1",
    );
    expect(assignMock).toHaveBeenNthCalledWith(
      2,
      "https://billing.example.test/manage-2",
    );
    expect(assignMock).toHaveBeenNthCalledWith(
      3,
      "https://billing.example.test/manage-3",
    );
  });

  it("continues to checkout when entitlement lookup fails closed", async () => {
    supabaseMock.functions.invoke.mockRejectedValueOnce(
      new Error("entitlement offline"),
    );
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({
        action: "checkout",
        url: "https://checkout.example.test/after-entitlement-error",
      }),
    );

    await expect(
      startCheckoutOrOpenPortal({ priceId: "price_level1" }),
    ).resolves.toEqual({ mode: "checkout" });

    expect(assignMock).toHaveBeenCalledWith(
      "https://checkout.example.test/after-entitlement-error",
    );
  });

  it("extracts HTTP error messages by detail, error, message, and nested detail fields", async () => {
    const cases = [
      [{ detail: "specific detail" }, "specific detail"],
      [{ error: "top-level error" }, "top-level error"],
      [{ message: "top-level message" }, "top-level message"],
      [{ detail: { message: "nested message" } }, "nested message"],
      [{ detail: { error: "nested error" } }, "nested error"],
      [{ detail: "   ", error: "", message: "" }, "billing-stripe-change-plan failed (402)"],
    ] as const;

    for (const [payload, expected] of cases) {
      supabaseMock.functions.invoke.mockResolvedValueOnce({
        data: { is_premium: false },
        error: null,
      });
      vi.mocked(fetch).mockResolvedValueOnce(
        jsonResponse(payload, { status: 402 }),
      );

      await expect(
        startCheckoutOrOpenPortal({ tierId: "level1" }),
      ).rejects.toThrow(expected);
    }
  });

  it("falls back to status text when the HTTP error body is not JSON", async () => {
    supabaseMock.functions.invoke.mockResolvedValueOnce({
      data: { is_premium: false },
      error: null,
    });
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response("not json", {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      }),
    );

    await expect(
      startCheckoutOrOpenPortal({ tierId: "level1" }),
    ).rejects.toThrow("billing-stripe-change-plan failed (500)");
  });

  it("throws explicit backend message before the generic unexpected response", async () => {
    supabaseMock.functions.invoke.mockResolvedValueOnce({
      data: { is_premium: false },
      error: null,
    });
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ message: "unsupported plan transition" }),
    );

    await expect(
      startCheckoutOrOpenPortal({ tierId: "level9" }),
    ).rejects.toThrow("unsupported plan transition");
  });

  it("throws for a checkout action without any checkout URL", async () => {
    supabaseMock.functions.invoke.mockResolvedValueOnce({
      data: { is_premium: false },
      error: null,
    });
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ action: "checkout" }));

    await expect(
      startCheckoutOrOpenPortal({ tierId: "level1" }),
    ).rejects.toThrow("Checkout URL was missing.");
    expect(assignMock).not.toHaveBeenCalled();
  });

  it("throws for an unrecognized successful response", async () => {
    supabaseMock.functions.invoke.mockResolvedValueOnce({
      data: { is_premium: false },
      error: null,
    });
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ ok: true }));

    await expect(
      startCheckoutOrOpenPortal({ tierId: "level1" }),
    ).rejects.toThrow("Unexpected billing response.");
  });

  it("validates Supabase URL and anon key environment before fetch", async () => {
    supabaseMock.functions.invoke
      .mockResolvedValueOnce({ data: { is_premium: false }, error: null })
      .mockResolvedValueOnce({ data: { is_premium: false }, error: null });

    vi.stubEnv("VITE_SUPABASE_URL", " ");
    await expect(
      startCheckoutOrOpenPortal({ tierId: "level1" }),
    ).rejects.toThrow("VITE_SUPABASE_URL is missing.");

    vi.stubEnv("VITE_SUPABASE_URL", "https://project.supabase.co");
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", "");
    await expect(
      startCheckoutOrOpenPortal({ tierId: "level1" }),
    ).rejects.toThrow("VITE_SUPABASE_ANON_KEY is missing.");

    expect(fetch).not.toHaveBeenCalled();
  });
});
