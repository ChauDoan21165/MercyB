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

import { captureEdgeError, type CaptureOptions } from "../sentry";

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
