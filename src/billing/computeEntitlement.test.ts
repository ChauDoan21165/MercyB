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
  it("defines entitlement for every canonical shared status", () => {
    const futureEnd = "2099-01-01T00:00:00.000Z";

    const cases: Array<{
      status:
        | "active"
        | "trialing"
        | "grace_period"
        | "past_due"
        | "paused"
        | "expired"
        | "revoked";
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
        status: "grace_period",
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
        status: "expired",
        currentPeriodEnd: futureEnd,
        expected: {
          status: "inactive",
          expires_at: null,
          source: null,
        },
      },
      {
        status: "revoked",
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