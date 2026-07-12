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
});
