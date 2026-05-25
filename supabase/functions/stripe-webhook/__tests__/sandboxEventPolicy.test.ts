import { describe, expect, it } from "vitest";
import { getSandboxStripeWebhookIgnoreReason } from "../sandbox-event-policy";

describe("getSandboxStripeWebhookIgnoreReason", () => {
  it("acknowledges unresolved sandbox fixture events with explicit safe-ignore reasons", () => {
    expect(
      getSandboxStripeWebhookIgnoreReason("sandbox", "missing_subscription_id"),
    ).toBe("sandbox_missing_subscription_id");
    expect(
      getSandboxStripeWebhookIgnoreReason("sandbox", "missing_customer_id"),
    ).toBe("sandbox_missing_customer_id");
    expect(
      getSandboxStripeWebhookIgnoreReason("sandbox", "unresolved_user"),
    ).toBe("sandbox_unresolved_user");
    expect(
      getSandboxStripeWebhookIgnoreReason(
        "sandbox",
        "invoice_missing_subscription_id",
      ),
    ).toBe("sandbox_invoice_missing_subscription_id");
    expect(
      getSandboxStripeWebhookIgnoreReason("sandbox", "invoice_unresolved_user"),
    ).toBe("sandbox_invoice_unresolved_user");
    expect(
      getSandboxStripeWebhookIgnoreReason(
        "sandbox",
        "invoice_missing_customer_id",
      ),
    ).toBe("sandbox_invoice_missing_customer_id");
  });

  it("does not mask production fulfillment failures", () => {
    expect(
      getSandboxStripeWebhookIgnoreReason(
        "production",
        "missing_subscription_id",
      ),
    ).toBeNull();
    expect(
      getSandboxStripeWebhookIgnoreReason("production", "unresolved_user"),
    ).toBeNull();
    expect(
      getSandboxStripeWebhookIgnoreReason(
        "production",
        "invoice_missing_customer_id",
      ),
    ).toBeNull();
  });
});
