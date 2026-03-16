// FILE: src/billing/computeEntitlement.ts

import type { EntitlementResult, SubscriptionRow } from "./types";
import { deriveEntitlementFromSubscriptions } from "./subscriptionRepository";

export function computeEntitlement(
  subscriptions: SubscriptionRow[],
  _now: Date = new Date(),
): EntitlementResult {
  return deriveEntitlementFromSubscriptions(subscriptions);
}