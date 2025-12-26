/**
 * MercyBlade Blue — Security Utils (FAIL-OPEN + CANONICAL CLIENT)
 * File: src/utils/securityUtils.ts
 * Version: MB-BLUE-94.15.3 — 2025-12-26 (+0700)
 *
 * LOCKED:
 * - Must import ONLY the canonical Supabase client:
 *   import { supabase } from "@/lib/supabaseClient";
 *
 * FAIL-OPEN RULE:
 * - Any security / analytics helper must NEVER block login.
 * - Missing tables / RLS / missing RPC / function errors => return safe defaults and log (DEV only).
 *
 * NOISE FIX:
 * - Avoid PostgREST PGRST116 by using maybeSingle() instead of single()
 * - Avoid 406 from duplicates by forcing .limit(1)
 */

import { supabase } from "@/lib/supabaseClient";

const IS_DEV = import.meta.env.DEV;

function devWarn(...args: any[]) {
  if (IS_DEV) console.warn(...args);
}
function devError(...args: any[]) {
  if (IS_DEV) console.error(...args);
}

// Get user's IP address (best effort, never block)
export const getUserIP = async (): Promise<string> => {
  const controller = new AbortController();
  const t = window.setTimeout(() => controller.abort(), 2000);

  try {
    const response = await fetch("https://api.ipify.org?format=json", {
      signal: controller.signal,
    });

    const data = await response.json();
    return data?.ip || "unknown";
  } catch {
    return "unknown";
  } finally {
    window.clearTimeout(t); // ✅ ALWAYS clear
  }
};

// Log security event (best effort, never throw)
export const logSecurityEvent = async (
  eventType: string,
  severity: "low" | "medium" | "high" | "critical",
  metadata?: any
) => {
  try {
    const ipAddress = await getUserIP();
    const userAgent = navigator.userAgent;

    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr) devWarn("[security] getUser() failed (fail-open)", userErr);

    const { error } = await supabase.rpc("log_security_event", {
      _user_id: user?.id || null,
      _event_type: eventType,
      _severity: severity,
      _ip_address: ipAddress,
      _user_agent: userAgent,
      _metadata: metadata || {},
    });

    if (error) devWarn("[security] rpc log_security_event failed (fail-open)", error);
  } catch (err) {
    devWarn("[security] logSecurityEvent crashed (fail-open)", err);
  }
};

// Track login attempt (best effort, never throw)
export const trackLoginAttempt = async (
  email: string,
  success: boolean,
  failureReason?: string
) => {
  try {
    const ipAddress = await getUserIP();
    const userAgent = navigator.userAgent;

    const insertRes = await supabase.from("login_attempts").insert({
      email,
      ip_address: ipAddress,
      user_agent: userAgent,
      success,
      failure_reason: failureReason,
    });

    if (insertRes.error)
      devWarn("[security] insert login_attempts failed (fail-open)", insertRes.error);

    if (!success) {
      const recentFailures = await supabase
        .from("login_attempts")
        .select("*")
        .eq("email", email)
        .eq("success", false)
        .gte("created_at", new Date(Date.now() - 15 * 60 * 1000).toISOString())
        .limit(10); // ✅ avoid runaway scan

      if (recentFailures.error) {
        devWarn(
          "[security] select login_attempts recentFailures failed (fail-open)",
          recentFailures.error
        );
        return;
      }

      const count = recentFailures.data?.length || 0;

      if (count >= 5) {
        const fn = await supabase.functions.invoke("security-alert", {
          body: {
            incident_type: "multiple_failed_logins",
            severity: "high",
            description: `Multiple failed login attempts detected for ${email}`,
            metadata: {
              email,
              attempts: count,
              ip_address: ipAddress,
            },
          },
        });

        if ((fn as any)?.error)
          devWarn(
            "[security] functions.invoke(security-alert) failed (fail-open)",
            (fn as any).error
          );
      }
    }
  } catch (err) {
    devWarn("[security] trackLoginAttempt crashed (fail-open)", err);
  }
};

// Check if user is blocked (FAIL-OPEN: default false)
export const checkUserBlocked = async (email: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc("is_user_blocked", {
      user_email: email,
    });

    if (error) {
      devWarn("[security] rpc is_user_blocked failed (fail-open)", error);
      return false;
    }

    return !!data;
  } catch (err) {
    devWarn("[security] checkUserBlocked crashed (fail-open)", err);
    return false;
  }
};

// Check rate limit (FAIL-OPEN: default false)
export const checkRateLimit = async (email: string): Promise<boolean> => {
  try {
    const ipAddress = await getUserIP();

    const { data, error } = await supabase.rpc("check_rate_limit", {
      check_email: email,
      check_ip: ipAddress,
      time_window_minutes: 15,
      max_attempts: 5,
    });

    if (error) {
      devWarn("[security] rpc check_rate_limit failed (fail-open)", error);
      return false;
    }

    return !!data;
  } catch (err) {
    devWarn("[security] checkRateLimit crashed (fail-open)", err);
    return false;
  }
};

// Admin helpers BELOW (unchanged logic, fail-open preserved)
// ------------------------------------------------------------

// Admin: Downgrade user tier
export const downgradeUserTier = async (userId: string) => {
  const { data: freeTier, error: tierErr } = await supabase
    .from("subscription_tiers")
    .select("id")
    .eq("name", "Free")
    .limit(1)
    .maybeSingle();

  if (tierErr) {
    devError("[security] downgradeUserTier failed", tierErr);
    throw tierErr;
  }

  if (!freeTier) throw new Error("Free tier not found");

  const { error } = await supabase
    .from("user_subscriptions")
    .update({ tier_id: freeTier.id, status: "active" })
    .eq("user_id", userId);

  if (error) throw error;

  await logSecurityEvent("user_downgraded", "high", { target_user_id: userId });
};

// Detect suspicious patterns
export const detectSuspiciousActivity = (loginAttempts: any[]): boolean => {
  const uniqueIPs = new Set(
    loginAttempts.filter((a) => !a.success).map((a) => a.ip_address)
  ).size;

  if (uniqueIPs > 3) return true;

  const recentFailures = loginAttempts.filter(
    (a) =>
      !a.success &&
      new Date(a.created_at).getTime() > Date.now() - 5 * 60 * 1000
  );

  return recentFailures.length > 5;
};
