// src/lib/auth.ts
import type { SupabaseClient, User } from "@supabase/supabase-js";
import {
  entitlementToVipKey,
  fetchCurrentEntitlement,
} from "./authService";

export type VipKey = "level0" | "level1" | "level3" | "level9";

export type UserTierContext = {
  userId: string | null;
  vipKey: VipKey;
  tierId: string | null;
  subscriptionStatus: string | null;
};

/**
 * Reads paid state from backend entitlement only.
 * Returns "level0" when not signed in / inactive / unknown.
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
      vipKey: "level0",
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