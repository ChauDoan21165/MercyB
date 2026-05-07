// supabase/functions/stripe-webhook/__tests__/parseWebhookSecrets.test.ts
//
// Locks the multi-secret parsing that the webhook handler depends on for
// rotation cutovers. If this regresses, signature verification will fail
// in test or live mode whenever Stripe is rolling secrets and the env
// holds two values at once.

import { describe, expect, it } from "vitest";
import { parseWebhookSecrets } from "../stripe-signature";

describe("parseWebhookSecrets", () => {
  it("returns an empty array for missing or whitespace input", () => {
    expect(parseWebhookSecrets("")).toEqual([]);
    expect(parseWebhookSecrets("   ")).toEqual([]);
    expect(parseWebhookSecrets("\n\n")).toEqual([]);
  });

  it("returns a single-element array for a single secret", () => {
    expect(parseWebhookSecrets("whsec_test_abc")).toEqual(["whsec_test_abc"]);
  });

  it("supports comma-separated rotation pairs", () => {
    expect(parseWebhookSecrets("whsec_old_abc,whsec_new_def")).toEqual([
      "whsec_old_abc",
      "whsec_new_def",
    ]);
  });

  it("supports newline-separated rotation pairs", () => {
    expect(parseWebhookSecrets("whsec_old_abc\nwhsec_new_def")).toEqual([
      "whsec_old_abc",
      "whsec_new_def",
    ]);
  });

  it("trims whitespace and ignores empty entries", () => {
    expect(
      parseWebhookSecrets("  whsec_a  ,  ,\n  whsec_b\n,\n"),
    ).toEqual(["whsec_a", "whsec_b"]);
  });
});
