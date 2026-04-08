// src/lib/authService.ts
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

export function entitlementIsPremium(
  ent: BackendEntitlement | null | undefined,
): boolean {
  return (
    ent?.is_premium === true &&
    String(ent?.status ?? "").toLowerCase() === "active"
  );
}

function entitlementText(ent: BackendEntitlement | null | undefined): string {
  return [ent?.tier_id, ent?.plan_name, ent?.source, ent?.status]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
}

export function resolveEntitlementTier(
  ent: BackendEntitlement | null | undefined,
): TierId {
  if (!entitlementIsPremium(ent)) return "free";

  const text = entitlementText(ent);

  if (
    text.includes("vip9") ||
    text.includes("oneyear") ||
    text.includes("yearly") ||
    text.includes("annual") ||
    text.includes("12month")
  ) {
    return "vip9";
  }

  if (text.includes("vip6")) return "vip6";
  if (text.includes("vip5")) return "vip5";
  if (text.includes("vip4")) return "vip4";
  if (text.includes("vip3")) return "vip3";
  if (text.includes("vip2")) return "vip2";

  if (
    text.includes("vip1") ||
    text.includes("onemonth") ||
    text.includes("monthly") ||
    text.includes("month")
  ) {
    return "vip1";
  }

  return "vip1";
}

export function entitlementToVipKey(
  ent: BackendEntitlement | null | undefined,
): VipKey {
  const tier = resolveEntitlementTier(ent);

  if (tier === "vip9") return "vip9";
  if (
    tier === "vip3" ||
    tier === "vip4" ||
    tier === "vip5" ||
    tier === "vip6"
  ) {
    return "vip3";
  }
  if (tier === "vip1" || tier === "vip2") return "vip1";
  return "free";
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
 * Canonical paid truth is me-entitlement.
 */
export async function getCurrentVipKey(): Promise<VipKey> {
  const ent = await fetchCurrentEntitlement();
  return entitlementToVipKey(ent);
}