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
});
