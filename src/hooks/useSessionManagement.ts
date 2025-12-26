// src/hooks/useSessionManagement.ts — MB-BLUE-94.7 — 2025-12-24 (+0700)
/**
 * MercyBlade Blue — Session Management
 * File: src/hooks/useSessionManagement.ts
 * Version: MB-BLUE-94.7 — 2025-12-24 (+0700)
 *
 * GOAL (LOCKED):
 * - One Supabase owner (imports go through "@/lib/supabaseClient" which re-exports canonical)
 * - Session enforcement must NEVER cause login loops if DB table/RLS is not ready
 *
 * MB-BLUE-94.7 change:
 * - If user_sessions table is missing, or RLS blocks access, or row is missing:
 *   => DO NOT log the user out. Treat as "valid" and continue.
 * - If no row exists, attempt to auto-register (best-effort).
 * - Safer interval typing for browser env.
 */

import { useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";
import { logSecurityEvent } from "@/utils/securityUtils";

type DeviceType = "desktop" | "mobile";

const detectDeviceType = (): DeviceType => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile =
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  return isMobile ? "mobile" : "desktop";
};

const getDeviceInfo = () => {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
  };
};

// PostgREST often returns error codes/messages for "no rows" or permission issues.
// We keep this generic + safe: ANY DB/RLS/schema problem should NOT force signout.
const isNonFatalSessionTableIssue = (err: any): boolean => {
  const msg = String(err?.message || err || "").toLowerCase();

  // Common “table missing” / schema mismatch
  if (msg.includes("relation") && msg.includes("does not exist")) return true;

  // RLS / permission
  if (
    msg.includes("permission denied") ||
    msg.includes("not allowed") ||
    msg.includes("row-level security") ||
    msg.includes("rls") ||
    msg.includes("insufficient_privilege")
  )
    return true;

  // PostgREST “no rows” patterns
  if (msg.includes("0 rows") || msg.includes("no rows") || msg.includes("pgrst116"))
    return true;

  return false;
};

export const useSessionManagement = () => {
  /**
   * registerSession
   * sessionToken MUST be the current Supabase session.access_token
   */
  const registerSession = useCallback(async (userId: string, sessionToken: string) => {
    try {
      const deviceType = detectDeviceType();
      const deviceInfo = getDeviceInfo();

      const { error } = await supabase.from("user_sessions").upsert(
        {
          user_id: userId,
          session_id: sessionToken, // store ACCESS TOKEN
          device_type: deviceType,
          device_info: deviceInfo,
          last_activity: new Date().toISOString(),
        },
        { onConflict: "user_id,device_type" }
      );

      if (error) throw error;

      if (import.meta.env.DEV) {
        console.log(`[useSessionManagement] Session registered (${deviceType})`);
      }
    } catch (error: any) {
      // ✅ NON-FATAL: never break login for DB/RLS readiness
      if (isNonFatalSessionTableIssue(error)) {
        if (import.meta.env.DEV) {
          console.warn("[useSessionManagement] registerSession skipped (non-fatal):", error);
        }
        return;
      }

      console.error("[useSessionManagement] Failed to register session:", error);
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
    } catch (error: any) {
      // ✅ NON-FATAL
      if (isNonFatalSessionTableIssue(error)) return;
      console.error("[useSessionManagement] Failed to update session activity:", error);
    }
  }, []);

  const checkSessionValidity = useCallback(
    async (userId: string): Promise<boolean> => {
      try {
        const {
          data: { session },
          error: sessionErr,
        } = await supabase.auth.getSession();

        if (sessionErr) {
          // ✅ Non-fatal: allow app to proceed rather than force logout loop
          if (import.meta.env.DEV) {
            console.warn("[useSessionManagement] getSession error (non-fatal):", sessionErr);
          }
          return true;
        }

        if (!session) return false;

        // Check if user is blocked
        const { data: securityStatus, error: securityErr } = await supabase
          .from("user_security_status")
          .select("is_blocked, blocked_reason")
          .eq("user_id", userId)
          .single();

        // If the table is missing / RLS blocks, do NOT break login
        if (securityErr && isNonFatalSessionTableIssue(securityErr)) {
          return true;
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

        // Check active session for this device type
        const { data, error } = await supabase
          .from("user_sessions")
          .select("session_id")
          .eq("user_id", userId)
          .eq("device_type", deviceType)
          .maybeSingle();

        // ✅ If table missing/RLS/no-row => treat valid and best-effort register
        if (error) {
          if (isNonFatalSessionTableIssue(error)) {
            // Best effort: create/update the row so future checks pass (no loop)
            await registerSession(userId, session.access_token);
            return true;
          }

          console.error("[useSessionManagement] Session validity check error:", error);
          return true; // still non-fatal to prevent loops
        }

        // If no row exists, auto-register and allow
        if (!data?.session_id) {
          await registerSession(userId, session.access_token);
          return true;
        }

        // If current session doesn't match stored session, user was logged out elsewhere
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
      } catch (error: any) {
        // ✅ NON-FATAL: do not cause auth loops
        if (isNonFatalSessionTableIssue(error)) return true;
        console.error("[useSessionManagement] Failed to check session validity:", error);
        return true;
      }
    },
    [registerSession]
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
    } catch (error: any) {
      // ✅ NON-FATAL
      if (isNonFatalSessionTableIssue(error)) return;
      console.error("[useSessionManagement] Failed to cleanup session:", error);
    }
  }, []);

  // Periodic session validity check
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

    // Initial check
    checkCurrentSession();

    // Check every 2 minutes
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
