import { describe, expect, it, vi } from "vitest";
import { failureJsonResponse } from "../_shared/failureLog";

describe("edge function failure logging", () => {
  it("logs structured context and attaches request id", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const request = new Request("https://example.test/functions/v1/mercy-tts", {
      headers: { "x-request-id": "edge-req-1" },
    });

    const response = failureJsonResponse(
      request,
      "mercy-tts",
      "tts",
      502,
      "provider_unavailable",
      { error: "Cloud TTS unavailable" },
      { "Access-Control-Allow-Origin": "*" },
      { provider: "azure" },
    );

    expect(response.status).toBe(502);
    expect(response.headers.get("x-request-id")).toBe("edge-req-1");
    expect(response.headers.get("access-control-allow-origin")).toBe("*");
    expect(await response.json()).toEqual({ error: "Cloud TTS unavailable" });

    expect(errorSpy).toHaveBeenCalledTimes(1);
    const logged = JSON.parse(String(errorSpy.mock.calls[0]?.[0]));
    expect(logged).toMatchObject({
      event: "edge_function_failure",
      route: "mercy-tts",
      mode: "tts",
      status: 502,
      errorClass: "provider_unavailable",
      requestId: "edge-req-1",
      detail: { provider: "azure" },
    });

    errorSpy.mockRestore();
  });

  it("schedules a privacy-safe function_failure_logs insert with EdgeRuntime.waitUntil", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 201 }));
    const waitUntil = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("Deno", {
      env: {
        get: (name: string) => {
          if (name === "SUPABASE_SERVICE_ROLE_KEY") {
            throw new Error("producer must not read SUPABASE_SERVICE_ROLE_KEY");
          }
          return ({
            SUPABASE_URL: "https://project.supabase.co",
            SUPABASE_ANON_KEY: "anon-key",
          })[name];
        },
      },
    });
    vi.stubGlobal("EdgeRuntime", { waitUntil });

    const request = new Request("https://project.supabase.co/functions/v1/mercy-tts", {
      headers: { "x-request-id": "edge-req-2" },
    });

    const response = failureJsonResponse(
      request,
      "mercy-tts",
      "tts",
      503,
      "provider_unavailable",
      { error: "Cloud TTS unavailable" },
      {},
      { provider: "azure", providerStatus: 503, errorName: "ProviderError" },
    );

    expect(response.status).toBe(503);
    expect(waitUntil).toHaveBeenCalledTimes(1);
    await waitUntil.mock.calls[0]?.[0];

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://project.supabase.co/rest/v1/function_failure_logs");
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer anon-key");
    expect((init.headers as Record<string, string>).apikey).toBe("anon-key");
    expect(JSON.parse(String(init.body))).toMatchObject({
      source: "edge-fn",
      function_name: "mercy-tts",
      endpoint: "/functions/v1/mercy-tts",
      status: 503,
      error_signature: "provider_unavailable",
      message: "provider_unavailable status=503 ProviderError provider=azure provider_status=503",
      request_id: "edge-req-2",
      detail: {
        mode: "tts",
        provider: "azure",
        providerStatus: 503,
        errorName: "ProviderError",
      },
    });

    vi.unstubAllGlobals();
    errorSpy.mockRestore();
  });
});
