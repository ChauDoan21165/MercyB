// FILE: src/billing/computeEntitlement.test.ts

import { describe, expect, it } from "vitest";
import { deriveEntitlementFromSubscriptions } from "./subscriptionRepository";
import type { SubscriptionRow } from "./types";

function makeSubscription(
  status: SubscriptionRow["status"],
  currentPeriodEnd: string | null,
): Pick<SubscriptionRow, "status" | "current_period_end" | "provider"> {
  return {
    provider: "stripe",
    status,
    current_period_end: currentPeriodEnd,
  };
}

describe("deriveEntitlementFromSubscriptions", () => {
  it("defines entitlement for every Stripe-emitted canonical status", () => {
    const futureEnd = "2099-01-01T00:00:00.000Z";
    const pastEnd = "2000-01-01T00:00:00.000Z";

    const cases: Array<{
      status:
        | "active"
        | "trialing"
        | "past_due"
        | "paused"
        | "canceled"
        | "expired"
        | "incomplete";
      currentPeriodEnd: string;
      expected: {
        status: "active" | "inactive";
        expires_at: string | null;
        source: "stripe" | null;
      };
    }> = [
      {
        status: "active",
        currentPeriodEnd: futureEnd,
        expected: {
          status: "active",
          expires_at: futureEnd,
          source: "stripe",
        },
      },
      {
        status: "trialing",
        currentPeriodEnd: futureEnd,
        expected: {
          status: "active",
          expires_at: futureEnd,
          source: "stripe",
        },
      },
      {
        status: "past_due",
        currentPeriodEnd: futureEnd,
        expected: {
          status: "active",
          expires_at: futureEnd,
          source: "stripe",
        },
      },
      {
        status: "paused",
        currentPeriodEnd: futureEnd,
        expected: {
          status: "inactive",
          expires_at: null,
          source: null,
        },
      },
      {
        status: "canceled",
        currentPeriodEnd: futureEnd,
        expected: {
          status: "active",
          expires_at: futureEnd,
          source: "stripe",
        },
      },
      {
        status: "canceled",
        currentPeriodEnd: pastEnd,
        expected: {
          status: "inactive",
          expires_at: null,
          source: null,
        },
      },
      {
        status: "expired",
        currentPeriodEnd: futureEnd,
        expected: {
          status: "inactive",
          expires_at: null,
          source: null,
        },
      },
      {
        status: "incomplete",
        currentPeriodEnd: futureEnd,
        expected: {
          status: "inactive",
          expires_at: null,
          source: null,
        },
      },
    ];

    for (const testCase of cases) {
      expect(
        deriveEntitlementFromSubscriptions([
          makeSubscription(testCase.status, testCase.currentPeriodEnd),
        ]),
      ).toEqual(testCase.expected);
    }
  });
});