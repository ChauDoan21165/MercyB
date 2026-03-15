import { supabase } from "@/integrations/supabase/client";
import { computeEntitlement } from "./computeEntitlement";
import { getSubscriptionsByUserId } from "./subscriptionRepository";
import type { EntitlementResult } from "./types";

export async function recomputeAndPersistEntitlement(
  userId: string
): Promise<EntitlementResult> {
  const subscriptions = await getSubscriptionsByUserId(userId);

  const result = computeEntitlement(subscriptions);

  const { error } = await supabase
    .from("profiles")
    .update({
      premium_status: result.premiumStatus,
      premium_expires_at: result.premiumExpiresAt,
      premium_source: result.premiumSource,
    })
    .eq("id", userId);

  if (error) {
    throw new Error(`Failed to persist entitlement: ${error.message}`);
  }

  return result;
}