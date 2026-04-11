// PATH: src/lib/authService.ts

import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import type { TierId } from "@/lib/constants/tiers";
import type { VipKey } from "@/lib/auth";

export type BackendEntitlement = {
  is_premium: boolean;
  source: string | null;
  status: string;
  expires_at: string | null;
  plan_name?: string | null;
  tier_id?: string | null;
};

export const FAIL_CLOSED_ENTITLEMENT: BackendEntitlement = {
  is_premium: false,
  source: null,
  status: "inactive",
  expires_at: null,
  plan_name: null,
  tier_id: null,
};

function isAlreadyRegisteredAuthError(err: unknown) {
  const row = (err ?? {}) as Record<string, unknown>;
  const msg = String(
    row.message || row.error_description || row.error || "",
  ).toLowerCase();
  const code = String(row.code || row.status || "").toLowerCase();

  if (msg.includes("user already registered")) return true;
  if (msg.includes("already registered")) return true;
  if (msg.includes("already exists")) return true;
  if (msg.includes("email already")) return true;
  if (code === "user_already_exists") return true;

  return false;
}

function asNonEmptyStringOrNull(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeStatus(
  value: unknown,
  fallback: "active" | "inactive",
): string {
  const raw = asNonEmptyStringOrNull(value);
  return raw ? raw.toLowerCase() : fallback;
}

function normalizeEntitlement(payload: unknown): BackendEntitlement {
  const row =
    payload && typeof payload === "object"
      ? (payload as Record<string, unknown>)
      : {};

  const isPremium = row.is_premium === true;
  const fallbackStatus: "active" | "inactive" = isPremium ? "active" : "inactive";

  return {
    is_premium: isPremium,
    source: asNonEmptyStringOrNull(row.source),
    status: normalizeStatus(row.status, fallbackStatus),
    expires_at: asNonEmptyStringOrNull(row.expires_at),
    plan_name: asNonEmptyStringOrNull(row.plan_name),
    tier_id: asNonEmptyStringOrNull(row.tier_id),
  };
}

function hasGetSession(
  client: SupabaseClient,
): client is SupabaseClient & {
  auth: SupabaseClient["auth"] & {
    getSession: () => Promise<{
      data: { session: { access_token?: string | null } | null };
      error: unknown;
    }>;
  };
} {
  return typeof (client as any)?.auth?.getSession === "function";
}

function hasFunctionsInvoke(
  client: SupabaseClient,
): client is SupabaseClient & {
  functions: SupabaseClient["functions"] & {
    invoke: (
      functionName: string,
      options?: { method?: string },
    ) => Promise<{ data: unknown; error: unknown }>;
  };
} {
  return typeof (client as any)?.functions?.invoke === "function";
}

function getDefaultEmailRedirectTo(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return `${window.location.origin}/auth/callback`;
}

function isPremiumStatus(status: string | null | undefined): boolean {
  const s = String(status ?? "").toLowerCase();
  return s === "active" || s === "trialing";
}

export function entitlementIsPremium(
  ent: BackendEntitlement | null | undefined,
): boolean {
  return ent?.is_premium === true && isPremiumStatus(ent?.status);
}

function entitlementText(ent: BackendEntitlement | null | undefined): string {
  return [ent?.tier_id, ent?.plan_name, ent?.source, ent?.status]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
}

function textHasAny(text: string, values: string[]): boolean {
  return values.some((value) => text.includes(value));
}

function isExplicitLegacyVipTier(value: string): value is TierId {
  return (
    value === "vip1" ||
    value === "vip2" ||
    value === "vip3" ||
    value === "vip4" ||
    value === "vip5" ||
    value === "vip6" ||
    value === "vip7" ||
    value === "vip8" ||
    value === "vip9"
  );
}

/**
 * Current test-expected compatibility mapping:
 * - month / monthly / generic premium => vip1
 * - year / annual / yearly => vip9
 */
function resolveCompatibilityTierFromText(text: string): TierId | null {
  if (
    textHasAny(text, [
      "premiumyear",
      "oneyear",
      "yearly",
      "annual",
      "annually",
      "12month",
      "12months",
      "1year",
    ])
  ) {
    return "vip9";
  }

  if (
    textHasAny(text, [
      "premiummonth",
      "onemonth",
      "monthly",
      "1month",
    ])
  ) {
    return "vip1";
  }

  if (text.includes("premium")) {
    return "vip1";
  }

  return null;
}

export function resolveEntitlementTier(
  ent: BackendEntitlement | null | undefined,
): TierId {
  if (!entitlementIsPremium(ent)) return "free";

  const exactTier = String(ent?.tier_id ?? "").trim().toLowerCase();
  const text = entitlementText(ent);

  // Current compatibility policy expected by tests:
  // month-style premium -> vip1, yearly/annual -> vip9
  if (exactTier === "premium_year") return "vip9";
  if (exactTier === "premium_month") return "vip1";

  // Preserve true legacy VIP tiers exactly if the backend still sends them.
  if (isExplicitLegacyVipTier(exactTier)) return exactTier;

  // Legacy VIP detection from other entitlement text.
  if (text.includes("vip9")) return "vip9";
  if (text.includes("vip8")) return "vip8";
  if (text.includes("vip7")) return "vip7";
  if (text.includes("vip6")) return "vip6";
  if (text.includes("vip5")) return "vip5";
  if (text.includes("vip4")) return "vip4";
  if (text.includes("vip3")) return "vip3";
  if (text.includes("vip2")) return "vip2";
  if (text.includes("vip1")) return "vip1";

  const inferredTier = resolveCompatibilityTierFromText(text);
  if (inferredTier) return inferredTier;

  // Paid but otherwise unknown premium-like plan:
  // current tests expect the safe fallback to vip1.
  return "vip1";
}

/**
 * Compatibility shim for older code still expecting VipKey.
 *
 * Policy expected by current tests:
 * - free stays free
 * - vip1 stays vip1
 * - vip2+ collapse to vip3 compatibility
 */
export function entitlementToVipKey(
  ent: BackendEntitlement | null | undefined,
): VipKey {
  const tier = resolveEntitlementTier(ent);

  if (tier === "free") return "free";
  if (tier === "vip1") return "vip1";
  return "vip3";
}

export async function fetchCurrentEntitlement(
  client: SupabaseClient = supabase,
): Promise<BackendEntitlement | null> {
  try {
    if (!hasGetSession(client)) {
      console.warn(
        "[authService] entitlement fetch skipped: client.auth.getSession is not available",
      );
      return { ...FAIL_CLOSED_ENTITLEMENT };
    }

    const {
      data: { session },
      error: sessionError,
    } = await client.auth.getSession();

    if (sessionError) {
      console.warn(
        "[authService] getSession failed for entitlement fetch:",
        sessionError,
      );
      return { ...FAIL_CLOSED_ENTITLEMENT };
    }

    if (!session?.access_token) {
      return null;
    }

    if (!hasFunctionsInvoke(client)) {
      console.warn(
        "[authService] entitlement fetch skipped: client.functions.invoke is not available",
      );
      return { ...FAIL_CLOSED_ENTITLEMENT };
    }

    const { data, error } = await client.functions.invoke("me-entitlement", {
      method: "GET",
    });

    if (error) {
      console.warn("[authService] me-entitlement failed:", error);
      return { ...FAIL_CLOSED_ENTITLEMENT };
    }

    return normalizeEntitlement(data);
  } catch (error) {
    console.warn("[authService] entitlement fetch crashed:", error);
    return { ...FAIL_CLOSED_ENTITLEMENT };
  }
}

export async function signUpWithEmail(email: string, _password: string) {
  const cleanEmail = email.trim().toLowerCase();

  const { data, error } = await supabase.auth.signInWithOtp({
    email: cleanEmail,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: getDefaultEmailRedirectTo(),
    },
  });

  if (error) {
    if (isAlreadyRegisteredAuthError(error)) {
      const e = new Error(
        "This email is already registered. Please sign in instead.",
      ) as Error & { code?: string; cause?: unknown };

      e.code = "email_already_registered";
      e.cause = error;
      console.error("Sign up error (already registered):", error);
      throw e;
    }

    console.error("Sign up error:", error);
    throw error;
  }

  return {
    ...data,
    session: null,
    requiresEmailVerification: true,
    verificationMessage:
      "We sent a sign-in link to your email. Open the email and click the link to create and access your account.",
  };
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) {
    console.error("Sign in error:", error);
    throw error;
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Sign out error:", error);
    throw error;
  }
}

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Get user error:", error);
    throw error;
  }

  return user;
}

/**
 * Compatibility shim for older code still expecting VipKey.
 */
export async function getCurrentVipKey(): Promise<VipKey> {
  const ent = await fetchCurrentEntitlement();
  return entitlementToVipKey(ent);
}