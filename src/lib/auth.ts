// src/lib/auth.ts
import type { SupabaseClient, User } from "@supabase/supabase-js";
import {
  entitlementToVipKey,
  fetchCurrentEntitlement,
} from "./authService";

export type VipKey = "free" | "vip1" | "vip3" | "vip9";

export type UserTierContext = {
  userId: string | null;
  vipKey: VipKey;
  tierId: string | null;
  subscriptionStatus: string | null;
};

/**
 * Reads paid state from backend entitlement only.
 * Returns "free" when not signed in / inactive / unknown.
 */
export async function getUserTierContext(
  supabase: SupabaseClient,
): Promise<UserTierContext> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = (user as User | null)?.id ?? null;
  if (!userId) {
    return {
      userId: null,
      vipKey: "free",
      tierId: null,
      subscriptionStatus: null,
    };
  }

  const ent = await fetchCurrentEntitlement(supabase);

  return {
    userId,
    vipKey: entitlementToVipKey(ent),
    tierId: ent?.tier_id ?? null,
    subscriptionStatus: ent?.status ?? null,
  };
}