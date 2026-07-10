// supabase/functions/_shared/__tests__/sentry.test.ts
//
// Locks the load-bearing safety contract the billing-webhook observability
// wiring depends on: captureEdgeError MUST be a non-throwing, awaitable
// no-op when Sentry is not configured (no SENTRY_DSN / no Deno env, which
// is exactly the vitest environment). The stripe-webhook handler awaits
// this on every failure path BEFORE returning its response — if it ever
// threw or hung, observability would change the webhook flow, which the
// task explicitly forbids.
//
// Also pins that the new `tags` field is part of CaptureOptions (the tag
// schema an ops dashboard will facet on) and is accepted at runtime.

import { describe, expect, it } from "vitest";

import { captureEdgeError, type CaptureOptions, wrapHandler } from "../sentry";

describe("captureEdgeError — safe no-op without Sentry config", () => {
  it("resolves (does not throw) when SENTRY_DSN/Deno env is absent", async () => {
    await expect(
      captureEdgeError(new Error("boom"), { functionName: "stripe-webhook" }),
    ).resolves.toBeUndefined();
  });

  it("never throws even for non-Error values", async () => {
    await expect(
      captureEdgeError("string error", { functionName: "stripe-webhook" }),
    ).resolves.toBeUndefined();
    await expect(
      captureEdgeError(null, { functionName: "stripe-webhook" }),
    ).resolves.toBeUndefined();
  });

  it("accepts the indexed `tags` schema used for billing observability", async () => {
    // This is the exact shape the stripe-webhook handler passes. The test
    // is the type+runtime guard that the dashboard contract compiles and
    // stays a no-op when disabled (the only path provable without network).
    const opts: CaptureOptions = {
      functionName: "stripe-webhook",
      extra: { stage: "processing" },
      tags: {
        webhook: "stripe",
        billing: "true",
        stage: "processing",
        severity: "high",
        event_type: "invoice.payment_failed",
      },
    };
    await expect(
      captureEdgeError(new Error("handler failed"), opts),
    ).resolves.toBeUndefined();
  });

  it("returns fast enough to not stall an error response when disabled", async () => {
    // No DSN ⇒ must short-circuit before any flush ceiling. Generous bound;
    // the real point is "well under the 2s flush ceiling", proving the
    // awaited call cannot meaningfully delay the webhook's 500.
    const t0 = Date.now();
    await captureEdgeError(new Error("x"), { functionName: "stripe-webhook" });
    expect(Date.now() - t0).toBeLessThan(1000);
  });
});

describe("wrapHandler — error path returns a CORS-bearing 500", () => {
  const req = () =>
    new Request("https://edge.example/functions/v1/placement-v3-session?token=secret", {
      method: "POST",
    });

  it("returns 500 with access-control-allow-origin when the handler throws", async () => {
    // This is the regression under fix: the platform's default 500 on a
    // re-throw carries NO CORS headers, so the browser reports an opaque
    // CORS / net::ERR_FAILED instead of the real error.
    const wrapped = wrapHandler("placement-v3-session", () => {
      throw new Error("boom");
    });

    const res = await wrapped(req());

    expect(res.status).toBe(500);
    expect(res.headers.get("access-control-allow-origin")).toBe("*");
    expect(res.headers.get("content-type")).toContain("application/json");
    await expect(res.json()).resolves.toEqual({ error: "internal_error" });
  });

  it("also covers async throws / rejected promises", async () => {
    const wrapped = wrapHandler("placement-v3-session", async () => {
      await Promise.resolve();
      throw new Error("async boom");
    });

    const res = await wrapped(req());
    expect(res.status).toBe(500);
    expect(res.headers.get("access-control-allow-origin")).toBe("*");
  });

  it("honors a caller-supplied corsHeaders override on the 500", async () => {
    const wrapped = wrapHandler(
      "some-fn",
      () => {
        throw new Error("boom");
      },
      { corsHeaders: { "Access-Control-Allow-Origin": "https://app.example" } },
    );

    const res = await wrapped(req());
    expect(res.status).toBe(500);
    expect(res.headers.get("access-control-allow-origin")).toBe("https://app.example");
  });

  it("passes a successful response through byte-for-byte (success path unchanged)", async () => {
    // The wrapper must be a pure pass-through on success: same object,
    // same status, same headers, same body. Only the throw path is touched.
    const original = new Response(JSON.stringify({ ok: true, hello: "world" }), {
      status: 207,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "X-Custom": "keep-me",
      },
    });
    const wrapped = wrapHandler("placement-v3-session", () => original);

    const res = await wrapped(req());

    // Same Response instance — the wrapper adds/removes nothing on success.
    expect(res).toBe(original);
    expect(res.status).toBe(207);
    expect(res.headers.get("x-custom")).toBe("keep-me");
    expect(res.headers.get("access-control-allow-origin")).toBe("*");
    await expect(res.json()).resolves.toEqual({ ok: true, hello: "world" });
  });
});
