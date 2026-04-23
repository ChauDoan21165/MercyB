// src/lib/featureFlags.ts — MB-BLUE-93.9 — 2025-12-24 (+0700)

/**
 * Global feature flags
 * RULE:
 * - Default OFF for any new visible system
 */

function readEnvBool(key: string, defaultValue: boolean): boolean {
  try {
    const raw = (import.meta as any)?.env?.[key];
    if (raw === undefined || raw === null || raw === "") return defaultValue;
    const s = String(raw).toLowerCase().trim();
    return s === "true" || s === "1" || s === "yes" || s === "on";
  } catch {
    return defaultValue;
  }
}

export const FEATURE_FLAGS = {
  MERCY_HOST_ENABLED: false, // flip to true when ready

  /**
   * Wave 2 Step 2 — server-side streaks (P0-2).
   * When ON: streak reads come from profiles.streak_current (server),
   * and the localStorage → server migration runs once per user.
   * When OFF: original localStorage-based streak remains.
   * Reads from env `VITE_SERVER_STREAKS_ENABLED`; defaults to OFF.
   */
  SERVER_STREAKS_ENABLED: readEnvBool("VITE_SERVER_STREAKS_ENABLED", false),
};
