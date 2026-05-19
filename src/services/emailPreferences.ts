/**
 * Client-side service for email preferences.
 *
 * Three operations:
 *   - unsubscribeByToken(token)        no auth — used by /unsubscribe?token=
 *   - getEmailPreferences()            authenticated — read flags
 *   - updateEmailPreferences(input)    authenticated — write flags
 *
 * RLS handles tenant isolation on the read/write flow; the unsubscribe
 * RPC is `SECURITY DEFINER` so it works for signed-out callers (the
 * email-link case).
 */

import { supabase } from "@/lib/supabaseClient";

export type EmailPreferences = {
  reEngagementEnabled: boolean;
  trialExpiryEnabled: boolean;
  weeklyDigestEnabled: boolean;
  streakReminderEnabled: boolean;
  weeklyProgressEnabled: boolean;
  unsubscribedAt: string | null;
};

export type EmailPreferencesUpdate = Partial<{
  reEngagementEnabled: boolean;
  trialExpiryEnabled: boolean;
  weeklyDigestEnabled: boolean;
  streakReminderEnabled: boolean;
  weeklyProgressEnabled: boolean;
}>;

export type UnsubscribeResult =
  | { ok: true; message: "unsubscribed" }
  | { ok: false; message: "invalid_token" | "token_not_found" | "rpc_error" };

const DEFAULT_PREFS: EmailPreferences = {
  reEngagementEnabled: true,
  trialExpiryEnabled: true,
  weeklyDigestEnabled: true,
  streakReminderEnabled: true,
  weeklyProgressEnabled: true,
  unsubscribedAt: null,
};

/**
 * Token-based one-click unsubscribe. No auth required — the token IS
 * the credential. The RPC sets all email_*_enabled to false and stamps
 * email_unsubscribed_at.
 */
export async function unsubscribeByToken(
  token: string,
): Promise<UnsubscribeResult> {
  const trimmed = (token ?? "").trim();
  if (!trimmed) return { ok: false, message: "invalid_token" };

  const { data, error } = await supabase
    // unsubscribe_by_token isn't in the generated types yet (migration
    // added in this PR; types regenerate on next dump).
    .rpc("unsubscribe_by_token" as never, { p_token: trimmed } as never);

  if (error) {
    if (typeof console !== "undefined") {
      console.warn("[emailPreferences] unsubscribe RPC failed:", error.message);
    }
    return { ok: false, message: "rpc_error" };
  }

  // The RPC returns a single-row table — supabase-js surfaces it as an array.
  const row = Array.isArray(data) ? data[0] : data;
  const ok = Boolean((row as { ok?: boolean } | null)?.ok);
  const message = (row as { message?: string } | null)?.message ?? "rpc_error";

  if (ok) return { ok: true, message: "unsubscribed" };
  if (message === "invalid_token" || message === "token_not_found") {
    return { ok: false, message };
  }
  return { ok: false, message: "rpc_error" };
}

/**
 * Read the current user's email flags. Returns DEFAULT_PREFS if no row
 * exists (which shouldn't happen post-migration, but is harmless as a
 * conservative default).
 */
export async function getEmailPreferences(): Promise<EmailPreferences> {
  const { data, error } = await supabase
    .rpc("get_email_preferences" as never);

  if (error) throw error;

  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return { ...DEFAULT_PREFS };

  const r = row as Record<string, unknown>;
  return {
    reEngagementEnabled: Boolean(r.email_re_engagement_enabled ?? true),
    trialExpiryEnabled: Boolean(r.email_trial_expiry_enabled ?? true),
    weeklyDigestEnabled: Boolean(r.email_weekly_digest_enabled ?? true),
    streakReminderEnabled: Boolean(r.email_streak_reminder_enabled ?? true),
    weeklyProgressEnabled: Boolean(r.email_weekly_progress_enabled ?? true),
    unsubscribedAt:
      typeof r.email_unsubscribed_at === "string"
        ? r.email_unsubscribed_at
        : null,
  };
}

/**
 * Authenticated UPDATE on profiles. Each toggle maps to a column.
 * Re-enabling any flag also clears email_unsubscribed_at — the user is
 * declaring "yes, send me X again" and a stale timestamp would lie about
 * their state.
 */
export async function updateEmailPreferences(
  input: EmailPreferencesUpdate,
): Promise<EmailPreferences> {
  const { data: userResult } = await supabase.auth.getUser();
  const userId = userResult.user?.id ?? null;
  if (!userId) throw new Error("Not authenticated");

  const patch: Record<string, unknown> = {};
  if (input.reEngagementEnabled !== undefined)
    patch.email_re_engagement_enabled = input.reEngagementEnabled;
  if (input.trialExpiryEnabled !== undefined)
    patch.email_trial_expiry_enabled = input.trialExpiryEnabled;
  if (input.weeklyDigestEnabled !== undefined)
    patch.email_weekly_digest_enabled = input.weeklyDigestEnabled;
  if (input.streakReminderEnabled !== undefined)
    patch.email_streak_reminder_enabled = input.streakReminderEnabled;
  if (input.weeklyProgressEnabled !== undefined)
    patch.email_weekly_progress_enabled = input.weeklyProgressEnabled;

  // If the user is re-opting-in to anything, clear the global stamp.
  const reEnabling =
    input.reEngagementEnabled === true ||
    input.trialExpiryEnabled === true ||
    input.weeklyDigestEnabled === true ||
    input.streakReminderEnabled === true ||
    input.weeklyProgressEnabled === true;
  if (reEnabling) patch.email_unsubscribed_at = null;

  const { error } = await supabase
    .from("profiles")
    .update(patch as never)
    .eq("id", userId);

  if (error) throw error;

  return await getEmailPreferences();
}
