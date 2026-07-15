import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(
    process.cwd(),
    "supabase/functions/billing-google-attach-purchase/index.ts"
  ),
  "utf8"
);

describe("billing-google-attach-purchase subscription row shape", () => {
  it("writes the canonical fields me-entitlement reads", () => {
    expect(source).toContain('app_id: "mercy_blade"');
    expect(source).toContain("current_period_end: currentPeriodEndAt");
    expect(source).toContain("current_period_end_at: currentPeriodEndAt");
    expect(source).toContain('provider: "google"');
  });

  it("populates required subscription identity aliases", () => {
    expect(source).toContain("customer_id: providerCustomerId");
    expect(source).toContain("subscription_id: purchaseToken");
    expect(source).toContain("provider_subscription_id: purchaseToken");
  });
});
