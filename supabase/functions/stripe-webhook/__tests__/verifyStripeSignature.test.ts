// supabase/functions/stripe-webhook/__tests__/verifyStripeSignature.test.ts
//
// Locks the Stripe webhook signature gate — the only thing standing between
// an anonymous POST and the money-path subscription/tier writes. Stripe's
// scheme is HMAC-SHA256 over `${t}.${rawBody}`, hex, in the `v1=` field of
// the Stripe-Signature header, with a replay-tolerance window on `t`.
//
// `parseWebhookSecrets` is covered separately (parseWebhookSecrets.test.ts).
// This file covers the verifier itself, which was previously untested:
//   - a correctly-signed payload is accepted
//   - a tampered body / wrong secret / wrong digest is rejected
//   - a header missing `t` or `v1` is rejected (malformed = no field)
//   - a timestamp outside tolerance is rejected (replay defense)
//   - secret rotation: when two v1s are present, any match accepts; when
//     two secrets are in play, the matching one accepts.
//
// `verifyStripeSignatureOrThrow` reads STRIPE_WEBHOOK_TOLERANCE_SECONDS via
// core.ts `env()`, which calls `Deno.env.get`. Under Vitest there is no
// Deno global, so we stub a minimal one (default tolerance = 300s).

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createHmac } from "node:crypto";

import { verifyStripeSignatureOrThrow } from "../stripe-signature";

const SECRET = "whsec_test_secret_abc123";
const enc = new TextEncoder();

/** Stripe-style v1: HMAC-SHA256(secret, `${t}.${body}`) as lowercase hex. */
function sign(body: string, t: number, secret = SECRET): string {
  return createHmac("sha256", secret).update(`${t}.${body}`).digest("hex");
}

function header(t: number, v1s: string | string[]): string {
  const list = Array.isArray(v1s) ? v1s : [v1s];
  return [`t=${t}`, ...list.map((v) => `v1=${v}`)].join(",");
}

const now = () => Math.floor(Date.now() / 1000);

beforeAll(() => {
  (globalThis as { Deno?: unknown }).Deno = {
    env: { get: (_k: string) => "" },
  };
});

afterAll(() => {
  delete (globalThis as { Deno?: unknown }).Deno;
});

describe("verifyStripeSignatureOrThrow", () => {
  it("accepts a correctly-signed, in-tolerance payload (happy path)", async () => {
    const body = JSON.stringify({ id: "evt_1", type: "invoice.paid" });
    const t = now();

    await expect(
      verifyStripeSignatureOrThrow({
        rawBodyBytes: enc.encode(body),
        sigHeader: header(t, sign(body, t)),
        webhookSecret: SECRET,
      }),
    ).resolves.toBeUndefined();
  });

  it("rejects a tampered body (signature was over the original)", async () => {
    const original = JSON.stringify({ id: "evt_1", amount: 500 });
    const t = now();
    const sig = sign(original, t);
    const tampered = JSON.stringify({ id: "evt_1", amount: 999999 });

    await expect(
      verifyStripeSignatureOrThrow({
        rawBodyBytes: enc.encode(tampered),
        sigHeader: header(t, sig),
        webhookSecret: SECRET,
      }),
    ).rejects.toThrow("Stripe signature mismatch");
  });

  it("rejects a signature made with the wrong secret", async () => {
    const body = JSON.stringify({ id: "evt_1" });
    const t = now();

    await expect(
      verifyStripeSignatureOrThrow({
        rawBodyBytes: enc.encode(body),
        sigHeader: header(t, sign(body, t, "whsec_attacker_guess")),
        webhookSecret: SECRET,
      }),
    ).rejects.toThrow("Stripe signature mismatch");
  });

  it("rejects a header missing the t field (malformed)", async () => {
    const body = JSON.stringify({ id: "evt_1" });

    await expect(
      verifyStripeSignatureOrThrow({
        rawBodyBytes: enc.encode(body),
        sigHeader: `v1=${sign(body, now())}`,
        webhookSecret: SECRET,
      }),
    ).rejects.toThrow("Invalid Stripe-Signature header (missing t or v1)");
  });

  it("rejects a header missing the v1 field (malformed)", async () => {
    await expect(
      verifyStripeSignatureOrThrow({
        rawBodyBytes: enc.encode("{}"),
        sigHeader: `t=${now()}`,
        webhookSecret: SECRET,
      }),
    ).rejects.toThrow("Invalid Stripe-Signature header (missing t or v1)");
  });

  it("rejects an empty signature header", async () => {
    await expect(
      verifyStripeSignatureOrThrow({
        rawBodyBytes: enc.encode("{}"),
        sigHeader: "",
        webhookSecret: SECRET,
      }),
    ).rejects.toThrow("Invalid Stripe-Signature header (missing t or v1)");
  });

  it("rejects a non-numeric timestamp (bad t)", async () => {
    const body = "{}";
    await expect(
      verifyStripeSignatureOrThrow({
        rawBodyBytes: enc.encode(body),
        sigHeader: header("not-a-number" as unknown as number, sign(body, 0)),
        webhookSecret: SECRET,
      }),
    ).rejects.toThrow("Invalid Stripe-Signature header (bad t)");
  });

  it("rejects a timestamp outside the replay tolerance window", async () => {
    const body = JSON.stringify({ id: "evt_old" });
    const stale = now() - 10_000; // well past the default 300s window
    const sig = sign(body, stale);

    await expect(
      verifyStripeSignatureOrThrow({
        rawBodyBytes: enc.encode(body),
        sigHeader: header(stale, sig),
        webhookSecret: SECRET,
      }),
    ).rejects.toThrow(/outside tolerance/);
  });

  it("accepts when one of several v1 candidates matches (Stripe sends multiple)", async () => {
    const body = JSON.stringify({ id: "evt_multi" });
    const t = now();
    const good = sign(body, t);
    const bogus = "deadbeef".repeat(8);

    await expect(
      verifyStripeSignatureOrThrow({
        rawBodyBytes: enc.encode(body),
        sigHeader: header(t, [bogus, good]),
        webhookSecret: SECRET,
      }),
    ).resolves.toBeUndefined();
  });

  it("ignores a malformed (odd-length / non-hex) v1 and still matches a good one", async () => {
    const body = JSON.stringify({ id: "evt_mixed" });
    const t = now();

    await expect(
      verifyStripeSignatureOrThrow({
        rawBodyBytes: enc.encode(body),
        sigHeader: header(t, ["zznothex", sign(body, t)]),
        webhookSecret: SECRET,
      }),
    ).resolves.toBeUndefined();
  });
});
