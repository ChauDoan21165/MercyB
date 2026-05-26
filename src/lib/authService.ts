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
  current_period_end?: string | null;
  plan_name?: string | null;
  tier_id?: string | null;
  price_id?: string | null;
  cancel_at_period_end?: boolean | null;
};

export const FAIL_CLOSED_ENTITLEMENT: BackendEntitlement = {
  is_premium: false,
  source: null,
  status: "inactive",
  expires_at: null,
  current_period_end: null,
  plan_name: null,
  tier_id: null,
  price_id: null,
  cancel_at_period_end: null,
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

  const currentPeriodEnd = asNonEmptyStringOrNull(row.current_period_end);
  const planName = asNonEmptyStringOrNull(row.plan_name);
  const tierId = asNonEmptyStringOrNull(row.tier_id);
  const priceId = asNonEmptyStringOrNull(row.price_id);
  const cancelAtPeriodEnd =
    typeof row.cancel_at_period_end === "boolean"
      ? row.cancel_at_period_end
      : null;

  return {
    is_premium: isPremium,
    source: asNonEmptyStringOrNull(row.source),
    status: normalizeStatus(row.status, fallbackStatus),
    expires_at: asNonEmptyStringOrNull(row.expires_at),
    ...(currentPeriodEnd !== null && { current_period_end: currentPeriodEnd }),
    ...(planName !== null && { plan_name: planName }),
    ...(tierId !== null && { tier_id: tierId }),
    ...(priceId !== null && { price_id: priceId }),
    ...(cancelAtPeriodEnd !== null && { cancel_at_period_end: cancelAtPeriodEnd }),
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
    value === "level1" ||
    value === "level2" ||
    value === "level3" ||
    value === "level4" ||
    value === "level5" ||
    value === "level6" ||
    value === "level7" ||
    value === "level8" ||
    value === "level9"
  );
}

function resolveCompatibilityTierFromText(text: string): TierId | null {
  if (
    textHasAny(text, [
      "premiumyear", "oneyear", "yearly", "annual",
      "annually", "12month", "12months", "1year",
    ])
  ) {
    return "level9";
  }

  if (
    textHasAny(text, [
      "premiummonth", "onemonth", "monthly", "1month",
    ])
  ) {
    return "level1";
  }

  if (text.includes("premium")) return "level1";

  return null;
}

export function resolveEntitlementTier(
  ent: BackendEntitlement | null | undefined,
): TierId {
  if (!entitlementIsPremium(ent)) return "level0";

  const exactTier = String(ent?.tier_id ?? "").trim().toLowerCase();
  const text = entitlementText(ent);

  if (exactTier === "premium_year")  return "level9";
  if (exactTier === "premium_month") return "level1";

  if (isExplicitLegacyVipTier(exactTier)) return exactTier;

  if (text.includes("level9")) return "level9";
  if (text.includes("level8")) return "level8";
  if (text.includes("level7")) return "level7";
  if (text.includes("level6")) return "level6";
  if (text.includes("level5")) return "level5";
  if (text.includes("level4")) return "level4";
  if (text.includes("level3")) return "level3";
  if (text.includes("level2")) return "level2";
  if (text.includes("level1")) return "level1";

  const inferredTier = resolveCompatibilityTierFromText(text);
  if (inferredTier) return inferredTier;

  return "level1";
}

export function entitlementToVipKey(
  ent: BackendEntitlement | null | undefined,
): VipKey {
  const tier = resolveEntitlementTier(ent);
  if (tier === "level0") return "level0";
  if (tier === "level1") return "level1";
  return "level3";
}

export async function fetchCurrentEntitlement(
  client: SupabaseClient = supabase,
): Promise<BackendEntitlement | null> {
  try {
    if (!hasGetSession(client)) {
      if (import.meta.env.DEV) {
        console.warn("[authService] entitlement fetch skipped: getSession unavailable");
      }
      return { ...FAIL_CLOSED_ENTITLEMENT };
    }

    const { data: { session }, error: sessionError } =
      await client.auth.getSession();

    if (sessionError) {
      if (import.meta.env.DEV) {
        console.warn("[authService] getSession failed:", sessionError.message);
      }
      return { ...FAIL_CLOSED_ENTITLEMENT };
    }

    if (!session?.access_token) return null;

    if (!hasFunctionsInvoke(client)) {
      if (import.meta.env.DEV) {
        console.warn("[authService] entitlement fetch skipped: functions.invoke unavailable");
      }
      return { ...FAIL_CLOSED_ENTITLEMENT };
    }

    const { data, error } = await client.functions.invoke("me-entitlement", {
      method: "GET",
    });

    if (error) {
      if (import.meta.env.DEV) {
        console.warn("[authService] me-entitlement failed:", error);
      }
      return { ...FAIL_CLOSED_ENTITLEMENT };
    }

    return normalizeEntitlement(data);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("[authService] entitlement fetch crashed:", error);
    }
    return { ...FAIL_CLOSED_ENTITLEMENT };
  }
}

/**
 * Sign up via OTP magic link.
 * Note: password parameter is not used — this flow uses passwordless OTP.
 * Kept for API compatibility with callers that pass a password argument.
 */
export async function signUpWithEmail(email: string, _password?: string) {
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

      if (import.meta.env.DEV) {
        console.warn("[authService] signUp: already registered:", error.message);
      }

      throw e;
    }

    if (import.meta.env.DEV) {
      console.warn("[authService] signUp error:", error.message);
    }

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
    if (import.meta.env.DEV) {
      console.warn("[authService] signIn error:", error.message);
    }
    throw error;
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    if (import.meta.env.DEV) {
      console.warn("[authService] signOut error:", error.message);
    }
    throw error;
  }
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    if (import.meta.env.DEV) {
      console.warn("[authService] getUser error:", error.message);
    }
    throw error;
  }

  return user;
}

export async function getCurrentVipKey(): Promise<VipKey> {
  const ent = await fetchCurrentEntitlement();
  return entitlementToVipKey(ent);
}