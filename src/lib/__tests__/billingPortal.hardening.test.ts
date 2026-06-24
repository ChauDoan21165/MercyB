import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockSupabase = vi.hoisted(() => ({
  getSession: vi.fn(),
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getSession: mockSupabase.getSession,
    },
  },
}));

import { openBillingPortal } from "@/lib/billingPortal";

const originalFetch = globalThis.fetch;
const realLocation = window.location;

const fetchMock = vi.fn();

function sessionResult(accessToken = "session-token") {
  return {
    data: { session: { access_token: accessToken } },
    error: null,
  };
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function sentRequestInit(): RequestInit {
  return fetchMock.mock.calls[0][1] as RequestInit;
}

describe("openBillingPortal", () => {
  beforeEach(() => {
    vi.useRealTimers();
    vi.stubEnv("VITE_SUPABASE_URL", "https://billing.supabase.co");
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", "anon-key");

    mockSupabase.getSession.mockResolvedValue(sessionResult());
    fetchMock.mockResolvedValue(jsonResponse({ url: "https://stripe.test/portal" }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    Object.defineProperty(window, "location", {
      configurable: true,
      writable: true,
      value: { assign: vi.fn(), replace: vi.fn(), href: "" },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
    vi.clearAllMocks();
    globalThis.fetch = originalFetch;
    Object.defineProperty(window, "location", {
      configurable: true,
      writable: true,
      value: realLocation,
    });
  });

  it("posts to the Supabase billing portal edge function and redirects to the returned URL", async () => {
    await openBillingPortal("https://app.test/account?tab=billing");

    expect(mockSupabase.getSession).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://billing.supabase.co/functions/v1/create-billing-portal-session",
    );

    expect(sentRequestInit()).toMatchObject({
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: "anon-key",
        Authorization: "Bearer session-token",
      },
      body: JSON.stringify({ return_url: "https://app.test/account?tab=billing" }),
    });
    expect(sentRequestInit().signal).toBeInstanceOf(AbortSignal);
    expect(window.location.assign).toHaveBeenCalledWith("https://stripe.test/portal");
  });

  it("omits return_url from the JSON body when no return URL is provided", async () => {
    await openBillingPortal();

    expect(sentRequestInit().body).toBe("{}");
    expect(window.location.assign).toHaveBeenCalledWith("https://stripe.test/portal");
  });

  it("trims Supabase URL and anon key environment values before building the request", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "  https://trimmed.supabase.co  ");
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", "  trimmed-anon  ");

    await openBillingPortal("/billing");

    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://trimmed.supabase.co/functions/v1/create-billing-portal-session",
    );
    expect(sentRequestInit().headers).toMatchObject({
      apikey: "trimmed-anon",
      Authorization: "Bearer session-token",
    });
  });

  it("throws the Supabase session error message before making a portal request", async () => {
    mockSupabase.getSession.mockResolvedValue({
      data: { session: null },
      error: { message: "Auth service unavailable" },
    });

    await expect(openBillingPortal()).rejects.toThrow("Auth service unavailable");

    expect(fetchMock).not.toHaveBeenCalled();
    expect(window.location.assign).not.toHaveBeenCalled();
  });

  it("requires a signed-in session with an access token", async () => {
    mockSupabase.getSession.mockResolvedValue({
      data: { session: { access_token: "" } },
      error: null,
    });

    await expect(openBillingPortal()).rejects.toThrow(
      "You must be signed in to manage your subscription.",
    );

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fails fast when VITE_SUPABASE_URL is missing or blank", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "   ");

    await expect(openBillingPortal()).rejects.toThrow("Missing VITE_SUPABASE_URL");

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fails fast when VITE_SUPABASE_ANON_KEY is missing or blank", async () => {
    vi.stubEnv("VITE_SUPABASE_ANON_KEY", "");

    await expect(openBillingPortal()).rejects.toThrow(
      "Missing VITE_SUPABASE_ANON_KEY",
    );

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("turns network failures into a user-facing connection error", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));

    await expect(openBillingPortal()).rejects.toThrow(
      "Unable to reach billing portal. Please check your connection.",
    );

    expect(window.location.assign).not.toHaveBeenCalled();
  });

  it("aborts an in-flight portal request after the timeout window", async () => {
    vi.useFakeTimers();
    fetchMock.mockImplementation(
      (_url: string, init: RequestInit) =>
        new Promise((_resolve, reject) => {
          init.signal?.addEventListener("abort", () => {
            reject(new DOMException("The operation was aborted.", "AbortError"));
          });
        }),
    );

    const promise = openBillingPortal();
    const rejection = expect(promise).rejects.toThrow(
      "Billing portal request timed out. Please try again.",
    );

    await Promise.resolve();
    await Promise.resolve();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(12_000);
    await rejection;

    expect(window.location.assign).not.toHaveBeenCalled();
  });

  it("surfaces an error string from a non-OK portal response", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ error: "Stripe customer missing" }, 400));

    await expect(openBillingPortal()).rejects.toThrow("Stripe customer missing");

    expect(window.location.assign).not.toHaveBeenCalled();
  });

  it("uses a generic failure for non-OK responses with blank or absent errors", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ error: "   " }, 500));

    await expect(openBillingPortal()).rejects.toThrow(
      "Failed to open billing portal.",
    );

    fetchMock.mockResolvedValueOnce(jsonResponse({}, 502));

    await expect(openBillingPortal()).rejects.toThrow(
      "Failed to open billing portal.",
    );
  });

  it("reports the HTTP status when the portal response body is not valid JSON", async () => {
    fetchMock.mockResolvedValue(
      new Response("not json", {
        status: 503,
        headers: { "Content-Type": "text/plain" },
      }),
    );

    await expect(openBillingPortal()).rejects.toThrow(
      "Billing portal returned an unexpected response (503).",
    );

    expect(window.location.assign).not.toHaveBeenCalled();
  });

  it("requires the successful portal response to include a non-empty URL", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({}));

    await expect(openBillingPortal()).rejects.toThrow(
      "Billing portal did not return a URL.",
    );

    fetchMock.mockResolvedValueOnce(jsonResponse({ url: "" }));

    await expect(openBillingPortal()).rejects.toThrow(
      "Billing portal did not return a URL.",
    );
    expect(window.location.assign).not.toHaveBeenCalled();
  });
});
