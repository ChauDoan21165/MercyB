/**
 * user_sessions writer.
 *
 * Mirrors src/services/roomProgress.ts — a plain service that hides the
 * Supabase call behind a friendly API so callers (AuthProvider) don't
 * have to know the table shape or swallow errors themselves.
 *
 * Why this exists: until 2026-04-28 the app had src/hooks/useSessionManagement.ts
 * defined but never imported anywhere. Every user sign-in wrote zero rows.
 * Admin analytics (DAU, live users) silently broke. See audit-history for
 * the discovery note. Fix is to write one row per (user, device) on
 * sign-in and heartbeat every 5 min.
 *
 * All writes are gated by the `behaviorTrackingEnabled` feature flag so a
 * single SQL toggle can kill the entire tracker path if it ever misbehaves.
 */
import { supabase } from "@/lib/supabaseClient";
import { isTrackingEnabled } from "./behaviorTrackingFlag";

type DeviceType = "desktop" | "mobile";

function detectDeviceType(): DeviceType {
  if (typeof navigator === "undefined") return "desktop";
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    navigator.userAgent.toLowerCase(),
  )
    ? "mobile"
    : "desktop";
}

function collectDeviceInfo(): Record<string, unknown> {
  if (typeof navigator === "undefined" || typeof window === "undefined") {
    return {};
  }
  const uaData = (navigator as Navigator & {
    userAgentData?: { platform?: string };
  }).userAgentData;
  return {
    userAgent: navigator.userAgent,
    platform: uaData?.platform ?? navigator.userAgent,
    screenWidth: window.screen?.width ?? null,
    screenHeight: window.screen?.height ?? null,
  };
}

function devWarn(...args: unknown[]): void {
  if (import.meta.env.DEV) console.warn(...args);
}

/**
 * Upsert the caller's session row. Called on verified sign-in and on
 * every heartbeat tick — upsert keeps repeat calls idempotent.
 */
export async function logUserSession(
  userId: string | null | undefined,
  sessionToken: string | null | undefined,
): Promise<{ ok: boolean }> {
  if (!userId || !sessionToken) return { ok: false };

  if (!(await isTrackingEnabled(userId))) {
    return { ok: false };
  }

  try {
    const { error } = await supabase.from("user_sessions").upsert(
      {
        user_id: userId,
        session_id: sessionToken,
        device_type: detectDeviceType(),
        device_info: collectDeviceInfo(),
        last_activity: new Date().toISOString(),
      },
      { onConflict: "user_id,device_type" },
    );

    if (error) {
      devWarn("[userSessions] upsert failed:", error.message);
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    devWarn("[userSessions] upsert crashed:", err);
    return { ok: false };
  }
}

/**
 * Touch last_activity on the existing row. Cheaper than logUserSession
 * because it skips the insert path. If the row doesn't exist yet the
 * update is a no-op — next logUserSession() call will create it.
 */
export async function heartbeatSession(
  userId: string | null | undefined,
): Promise<{ ok: boolean }> {
  if (!userId) return { ok: false };

  if (!(await isTrackingEnabled(userId))) {
    return { ok: false };
  }

  try {
    const { error } = await supabase
      .from("user_sessions")
      .update({ last_activity: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("device_type", detectDeviceType());

    if (error) {
      devWarn("[userSessions] heartbeat failed:", error.message);
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    devWarn("[userSessions] heartbeat crashed:", err);
    return { ok: false };
  }
}
