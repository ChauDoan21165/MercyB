// src/hooks/useSessionManagement.ts — MB-BLUE-94.7 — 2025-12-24 (+0700)
/**
 * MercyBlade Blue — Session Management
 * File: src/hooks/useSessionManagement.ts
 *
 * GOAL (LOCKED):
 * - One Supabase owner (imports go through "@/lib/supabaseClient")
 * - Session enforcement must NEVER cause login loops if DB table/RLS is not ready
 *
 * MB-BLUE-94.7:
 * - If user_sessions table is missing, RLS blocks, or row is missing:
 *   => DO NOT log the user out. Treat as "valid" and continue.
 * - If no row exists, attempt to auto-register (best-effort).
 */

import { useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";
import { logSecurityEvent } from "@/utils/securityUtils";

type DeviceType = "desktop" | "mobile";

function detectDeviceType(): DeviceType {
  const userAgent = navigator.userAgent.toLowerCase();
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
    ? "mobile"
    : "desktop";
}

function getDeviceInfo() {
  return {
    userAgent: navigator.userAgent,
    // navigator.platform is deprecated — use userAgentData when available
    platform:
      (navigator as Navigator & { userAgentData?: { platform?: string } })
        .userAgentData?.platform ?? navigator.userAgent,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
  };
}

// PostgREST often returns error codes/messages for "no rows" or permission issues.
// ANY DB/RLS/schema problem should NOT force signout.
function isNonFatalSessionTableIssue(err: unknown): boolean {
  const msg = String(
    (err as Record<string, unknown>)?.message ?? err ?? "",
  ).toLowerCase();

  if (msg.includes("relation") && msg.includes("does not exist")) return true;
  if (
    msg.includes("permission denied") ||
    msg.includes("not allowed") ||
    msg.includes("row-level security") ||
    msg.includes("rls") ||
    msg.includes("insufficient_privilege")
  ) return true;
  if (msg.includes("0 rows") || msg.includes("no rows") || msg.includes("pgrst116"))
    return true;

  return false;
}

function devWarn(...args: unknown[]): void {
  if (import.meta.env.DEV) console.warn(...args);
}

export const useSessionManagement = () => {
  const registerSession = useCallback(async (userId: string, sessionToken: string) => {
    try {
      const deviceType = detectDeviceType();
      const deviceInfo = getDeviceInfo();

      const { error } = await supabase.from("user_sessions").upsert(
        {
          user_id: userId,
          session_id: sessionToken,
          device_type: deviceType,
          device_info: deviceInfo,
          last_activity: new Date().toISOString(),
        },
        { onConflict: "user_id,device_type" },
      );

      if (error) throw error;

      if (import.meta.env.DEV) {
        console.log(`[useSessionManagement] Session registered (${deviceType})`);
      }
    } catch (error) {
      if (isNonFatalSessionTableIssue(error)) {
        devWarn("[useSessionManagement] registerSession skipped (non-fatal):", error);
        return;
      }
      // Non-fatal — never break login for DB/RLS readiness issues
      devWarn("[useSessionManagement] Failed to register session:", error);
    }
  }, []);

  const updateSessionActivity = useCallback(async (userId: string) => {
    try {
      const deviceType = detectDeviceType();

      const { error } = await supabase
        .from("user_sessions")
        .update({ last_activity: new Date().toISOString() })
        .eq("user_id", userId)
        .eq("device_type", deviceType);

      if (error) throw error;
    } catch (error) {
      if (isNonFatalSessionTableIssue(error)) return;
      devWarn("[useSessionManagement] Failed to update session activity:", error);
    }
  }, []);

  const checkSessionValidity = useCallback(
    async (userId: string): Promise<boolean> => {
      try {
        const { data: { session }, error: sessionErr } =
          await supabase.auth.getSession();

        if (sessionErr) {
          devWarn("[useSessionManagement] getSession error (non-fatal):", sessionErr);
          return true; // non-fatal — allow app to proceed
        }

        if (!session) return false;

        // Check if user is blocked
        const { data: securityStatus, error: securityErr } = await supabase
          .from("user_security_status")
          .select("is_blocked, blocked_reason")
          .eq("user_id", userId)
          .single();

        if (securityErr && isNonFatalSessionTableIssue(securityErr)) {
          return true; // table not ready — do not block login
        }

        if (securityStatus?.is_blocked) {
          toast({
            title: "Account Blocked",
            description: securityStatus.blocked_reason || "Your account has been blocked.",
            variant: "destructive",
          });
          await supabase.auth.signOut();
          await logSecurityEvent("blocked_user_login_attempt", "high", { userId });
          return false;
        }

        const deviceType = detectDeviceType();

        const { data, error } = await supabase
          .from("user_sessions")
          .select("session_id")
          .eq("user_id", userId)
          .eq("device_type", deviceType)
          .maybeSingle();

        if (error) {
          if (isNonFatalSessionTableIssue(error)) {
            await registerSession(userId, session.access_token);
            return true;
          }
          devWarn("[useSessionManagement] Session validity check error:", error);
          return true; // still non-fatal to prevent loops
        }

        if (!data?.session_id) {
          await registerSession(userId, session.access_token);
          return true;
        }

        if (data.session_id !== session.access_token) {
          toast({
            title: "Session Expired",
            description: "You have been logged in from another device.",
            variant: "destructive",
          });
          await supabase.auth.signOut();
          return false;
        }

        return true;
      } catch (error) {
        if (isNonFatalSessionTableIssue(error)) return true;
        devWarn("[useSessionManagement] Failed to check session validity:", error);
        return true; // non-fatal — do not cause auth loops
      }
    },
    [registerSession],
  );

  const cleanupSession = useCallback(async (userId: string) => {
    try {
      const deviceType = detectDeviceType();

      const { error } = await supabase
        .from("user_sessions")
        .delete()
        .eq("user_id", userId)
        .eq("device_type", deviceType);

      if (error) throw error;

      if (import.meta.env.DEV) {
        console.log(`[useSessionManagement] Session cleaned up (${deviceType})`);
      }
    } catch (error) {
      if (isNonFatalSessionTableIssue(error)) return;
      devWarn("[useSessionManagement] Failed to cleanup session:", error);
    }
  }, []);

  // Periodic session validity check — every 2 minutes
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const checkCurrentSession = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data?.session;

      if (session?.user) {
        const isValid = await checkSessionValidity(session.user.id);
        if (!isValid) return;
        await updateSessionActivity(session.user.id);
      }
    };

    void checkCurrentSession();
    intervalId = setInterval(checkCurrentSession, 2 * 60 * 1000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [checkSessionValidity, updateSessionActivity]);

  return {
    registerSession,
    updateSessionActivity,
    checkSessionValidity,
    cleanupSession,
  };
};