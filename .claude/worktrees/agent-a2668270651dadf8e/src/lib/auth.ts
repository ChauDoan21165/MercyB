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

const SAFE_LEVEL0: UserTierContext = {
  userId: null,
  vipKey: "level0",
  tierId: null,
  subscriptionStatus: null,
};

/**
 * Reads paid state from backend entitlement only.
 * Returns "level0" when not signed in / inactive / unknown / on error.
 */
export async function getUserTierContext(
  supabase: SupabaseClient,
): Promise<UserTierContext> {
  let user: User | null = null;

  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) return SAFE_LEVEL0;
    user = data.user;
  } catch {
    return SAFE_LEVEL0;
  }

  const userId = user.id ?? null;
  if (!userId) return SAFE_LEVEL0;

  const ent = await fetchCurrentEntitlement(supabase).catch(() => null);

  return {
    userId,
    vipKey: entitlementToVipKey(ent),
    tierId: ent?.tier_id ?? null,
    subscriptionStatus: ent?.status ?? null,
  };
}