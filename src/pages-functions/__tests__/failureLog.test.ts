import { describe, expect, it, vi } from "vitest";
import { failureJson } from "../failureLog";
import type { PagesContext } from "../http";

describe("pages function failure logging", () => {
  it("logs structured context and returns a request id header", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const request = new Request("https://example.test/api/mercy-ai", {
      headers: { "x-request-id": "req-test-1" },
    });
    const context: PagesContext = { request, env: {} };

    const response = failureJson(context, "/api/mercy-ai", "sentence-correction", 401, "unauthorized", {
      error: "Unauthorized",
    });

    expect(response.status).toBe(401);
    expect(response.headers.get("x-request-id")).toBe("req-test-1");
    expect(await response.json()).toEqual({ error: "Unauthorized" });

    expect(errorSpy).toHaveBeenCalledTimes(1);
    const logged = JSON.parse(String(errorSpy.mock.calls[0]?.[0]));
    expect(logged).toMatchObject({
      event: "function_failure",
      route: "/api/mercy-ai",
      mode: "sentence-correction",
      status: 401,
      errorClass: "unauthorized",
      requestId: "req-test-1",
    });
    expect(JSON.stringify(logged)).not.toContain("learner");

    errorSpy.mockRestore();
  });

  it("schedules a privacy-safe function_failure_logs insert with waitUntil", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);
    const waitUntil = vi.fn();
    const request = new Request("https://example.test/api/mercy-ai", {
      headers: { "x-request-id": "req-test-2" },
    });
    const env = new Proxy({
      SUPABASE_URL: "https://project.supabase.co",
      SUPABASE_ANON_KEY: "anon-key",
      VITE_SUPABASE_ANON_KEY: "vite-anon-key",
    }, {
      get(target, prop: string) {
        if (prop === "SUPABASE_SERVICE_ROLE_KEY") {
          throw new Error("producer must not read SUPABASE_SERVICE_ROLE_KEY");
        }
        return target[prop as keyof typeof target];
      },
    });
    const context = {
      request,
      env,
      waitUntil,
    } as PagesContext & { waitUntil: (promise: Promise<unknown>) => void };

    const response = failureJson(
      context,
      "/api/mercy-ai",
      "sentence-correction",
      502,
      "provider_failed",
      { error: "provider_failed" },
      { provider: "openai", providerStatus: 502, errorName: "UpstreamError" },
    );

    expect(response.status).toBe(502);
    expect(waitUntil).toHaveBeenCalledTimes(1);
    await waitUntil.mock.calls[0]?.[0];

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://project.supabase.co/rest/v1/function_failure_logs");
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer anon-key");
    expect((init.headers as Record<string, string>).apikey).toBe("anon-key");
    expect(JSON.parse(String(init.body))).toMatchObject({
      source: "cf-pages",
      function_name: "mercy-ai",
      endpoint: "/api/mercy-ai",
      status: 502,
      error_signature: "provider_failed",
      message: "provider_failed status=502 UpstreamError provider=openai provider_status=502",
      request_id: "req-test-2",
      detail: {
        mode: "sentence-correction",
        provider: "openai",
        providerStatus: 502,
        errorName: "UpstreamError",
      },
    });
    expect(String(init.body)).not.toContain("learner");

    vi.unstubAllGlobals();
    errorSpy.mockRestore();
  });
});
