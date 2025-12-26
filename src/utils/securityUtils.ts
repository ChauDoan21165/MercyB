/**
 * MercyBlade Blue — Security Utils (FAIL-OPEN + CANONICAL CLIENT)
 * File: src/utils/securityUtils.ts
 * Version: MB-BLUE-94.13.6 — 2025-12-25 (+0700)
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
 * - Avoid PostgREST PGRST116 by using maybeSingle() instead of single() where 0 rows is possible.
 */

import { supabase } from "@/lib/supabaseClient";

const IS_DEV = import.meta.env.DEV;

function devWarn(...args: any[]) {
  if (IS_DEV) console.warn(...args);
}
function devError(...args: any[]) {
  if (IS_DEV) console.error(...args);
}

// Get user's IP address (best effort)
export const getUserIP = async (): Promise<string> => {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data?.ip || "unknown";
  } catch {
    return "unknown";
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

    if (insertRes.error) devWarn("[security] insert login_attempts failed (fail-open)", insertRes.error);

    // Check for suspicious activity and send alert if needed (best effort)
    if (!success) {
      const recentFailures = await supabase
        .from("login_attempts")
        .select("*")
        .eq("email", email)
        .eq("success", false)
        .gte("created_at", new Date(Date.now() - 15 * 60 * 1000).toISOString());

      if (recentFailures.error) {
        devWarn("[security] select login_attempts recentFailures failed (fail-open)", recentFailures.error);
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

        if ((fn as any)?.error) devWarn("[security] functions.invoke(security-alert) failed (fail-open)", (fn as any).error);
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

// Admin: Get security dashboard data (best effort)
export const getSecurityDashboard = async () => {
  try {
    const { data: recentAttempts, error: recentAttemptsErr } = await supabase
      .from("login_attempts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (recentAttemptsErr) devWarn("[security] getSecurityDashboard recentAttempts failed", recentAttemptsErr);

    const { data: recentFailures, error: recentFailuresErr } = await supabase
      .from("login_attempts")
      .select("*")
      .eq("success", false)
      .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order("created_at", { ascending: false });

    if (recentFailuresErr) devWarn("[security] getSecurityDashboard recentFailures failed", recentFailuresErr);

    const { data: securityEvents, error: securityEventsErr } = await supabase
      .from("security_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (securityEventsErr) devWarn("[security] getSecurityDashboard securityEvents failed", securityEventsErr);

    const { data: blockedUsers, error: blockedUsersErr } = await supabase
      .from("user_security_status")
      .select("*, profiles(email, full_name)")
      .eq("is_blocked", true)
      .order("blocked_at", { ascending: false });

    if (blockedUsersErr) devWarn("[security] getSecurityDashboard blockedUsers failed", blockedUsersErr);

    const { data: suspiciousUsers, error: suspiciousUsersErr } = await supabase
      .from("user_security_status")
      .select("*, profiles(email, full_name)")
      .gte("suspicious_activity_count", 3)
      .order("suspicious_activity_count", { ascending: false })
      .limit(50);

    if (suspiciousUsersErr) devWarn("[security] getSecurityDashboard suspiciousUsers failed", suspiciousUsersErr);

    const { data: activeSessions, error: activeSessionsErr } = await supabase
      .from("user_sessions")
      .select("*, profiles(email, full_name)")
      .gte("last_activity", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order("last_activity", { ascending: false });

    if (activeSessionsErr) devWarn("[security] getSecurityDashboard activeSessions failed", activeSessionsErr);

    return {
      recentAttempts: recentAttempts || [],
      recentFailures: recentFailures || [],
      securityEvents: securityEvents || [],
      blockedUsers: blockedUsers || [],
      suspiciousUsers: suspiciousUsers || [],
      activeSessions: activeSessions || [],
    };
  } catch (err) {
    devWarn("[security] getSecurityDashboard crashed (fail-open)", err);
    return {
      recentAttempts: [],
      recentFailures: [],
      securityEvents: [],
      blockedUsers: [],
      suspiciousUsers: [],
      activeSessions: [],
    };
  }
};

// Admin: Block user (best effort; still throws if the write fails since it's an explicit admin action)
export const blockUser = async (userId: string, reason: string) => {
  const {
    data: { user: admin },
    error: adminErr,
  } = await supabase.auth.getUser();

  if (adminErr) devWarn("[security] blockUser getUser failed", adminErr);

  const { error } = await supabase.from("user_security_status").upsert(
    {
      user_id: userId,
      is_blocked: true,
      blocked_reason: reason,
      blocked_at: new Date().toISOString(),
      blocked_by: admin?.id,
    },
    { onConflict: "user_id" }
  );

  if (error) throw error;

  // Best-effort logging
  await logSecurityEvent("user_blocked", "high", {
    blocked_user_id: userId,
    reason,
  });

  // Revoke all sessions for the user (best effort)
  const del = await supabase.from("user_sessions").delete().eq("user_id", userId);
  if (del.error) devWarn("[security] blockUser revoke sessions failed", del.error);
};

// Admin: Unblock user
export const unblockUser = async (userId: string) => {
  const { error } = await supabase
    .from("user_security_status")
    .update({
      is_blocked: false,
      blocked_reason: null,
      blocked_at: null,
      blocked_by: null,
    })
    .eq("user_id", userId);

  if (error) throw error;

  await logSecurityEvent("user_unblocked", "medium", {
    unblocked_user_id: userId,
  });
};

// Admin: Revoke all user sessions
export const revokeUserSessions = async (userId: string) => {
  const { error } = await supabase.from("user_sessions").delete().eq("user_id", userId);

  if (error) throw error;

  await logSecurityEvent("sessions_revoked", "high", {
    target_user_id: userId,
  });
};

// Admin: Invalidate user's access codes
export const invalidateUserAccessCodes = async (userId: string) => {
  const { error } = await supabase.from("access_codes").update({ is_active: false }).eq("for_user_id", userId);

  if (error) throw error;

  await logSecurityEvent("access_codes_invalidated", "high", {
    target_user_id: userId,
  });
};

// Admin: Downgrade user tier
export const downgradeUserTier = async (userId: string) => {
  // Get free tier (0 rows should be treated as "not found", not PGRST116)
  const { data: freeTier, error: tierErr } = await supabase
    .from("subscription_tiers")
    .select("id")
    .eq("name", "Free")
    .maybeSingle(); // ✅ instead of single()

  if (tierErr) {
    devError("[security] downgradeUserTier: failed to fetch Free tier", tierErr);
    throw tierErr;
  }

  if (!freeTier) {
    throw new Error("Free tier not found");
  }

  // Update subscription
  const { error } = await supabase
    .from("user_subscriptions")
    .update({
      tier_id: freeTier.id,
      status: "active",
    })
    .eq("user_id", userId);

  if (error) throw error;

  await logSecurityEvent("user_downgraded", "high", {
    target_user_id: userId,
  });
};

// Detect suspicious patterns
export const detectSuspiciousActivity = (loginAttempts: any[], userId: string): boolean => {
  // Multiple failed attempts from different IPs
  const uniqueIPs = new Set(
    loginAttempts
      .filter((a) => !a.success)
      .map((a) => a.ip_address)
  ).size;

  if (uniqueIPs > 3) return true;

  // Multiple failed attempts in short time
  const recentFailures = loginAttempts.filter(
    (a) => !a.success && new Date(a.created_at).getTime() > Date.now() - 5 * 60 * 1000
  );

  if (recentFailures.length > 5) return true;

  return false;
};
