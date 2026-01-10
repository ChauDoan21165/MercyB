// src/lib/auth.ts
// Mercy Blade — Tier context helper (DB source of truth)
// This file is intentionally small and does not auto-run.
// Wire it from authService.ts (next step).

import type { SupabaseClient, User } from "@supabase/supabase-js";

export type VipKey = "free" | "vip1" | "vip3" | "vip9";

export type UserTierContext = {
  userId: string | null;
  vipKey: VipKey;
  tierId: string | null;
  subscriptionStatus: string | null;
};

function normalizeTierText(x: unknown): string {
  return String(x ?? "").toLowerCase().replace(/\s+/g, " ").trim();
}

function rowToVipKey(row: Record<string, unknown>): Exclude<VipKey, "free"> | null {
  const s = normalizeTierText(
    (row as any)?.code ??
      (row as any)?.slug ??
      (row as any)?.name ??
      (row as any)?.title ??
      (row as any)?.id ??
      "",
  );
  if (s.includes("vip1") || s.includes("vip 1")) return "vip1";
  if (s.includes("vip3") || s.includes("vip 3")) return "vip3";
  if (s.includes("vip9") || s.includes("vip 9")) return "vip9";
  return null;
}

async function resolveVipKeyFromTierId(
  supabase: SupabaseClient,
  tierId: string | null,
): Promise<Exclude<VipKey, "free"> | null> {
  if (!tierId) return null;

  const { data, error } = await supabase
    .from("subscription_tiers")
    .select("id, code, slug, name, title")
    .eq("id", tierId)
    .maybeSingle();

  if (error || !data) return null;
  return rowToVipKey(data as unknown as Record<string, unknown>);
}

/**
 * Reads tier from DB:
 * - user_subscriptions (user_id) → { status, tier_id }
 * - subscription_tiers (tier_id) → vipKey
 *
 * Returns "free" when not subscribed / inactive / unknown tier.
 */
export async function getUserTierContext(supabase: SupabaseClient): Promise<UserTierContext> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = (user as User | null)?.id ?? null;
  if (!userId) {
    return { userId: null, vipKey: "free", tierId: null, subscriptionStatus: null };
  }

  const { data: sub, error: subErr } = await supabase
    .from("user_subscriptions")
    .select("status, tier_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (subErr || !sub) {
    return { userId, vipKey: "free", tierId: null, subscriptionStatus: null };
  }

  const status = typeof (sub as any)?.status === "string" ? ((sub as any).status as string) : null;
  const tierId = typeof (sub as any)?.tier_id === "string" ? ((sub as any).tier_id as string) : null;

  if (status !== "active") {
    return { userId, vipKey: "free", tierId, subscriptionStatus: status };
  }

  const vipKey = (await resolveVipKeyFromTierId(supabase, tierId)) ?? "free";
  return { userId, vipKey, tierId, subscriptionStatus: status };
}
