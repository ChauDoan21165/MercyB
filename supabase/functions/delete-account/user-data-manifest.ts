// User-data manifest for delete-account.
//
// Every table in the Supabase schema that has a user-identifying column MUST
// appear here exactly once. A CI check (scripts/check-delete-account-coverage.mjs)
// fails the build when a new user_id table is added without being classified.
//
// Action types:
//   "delete"     — DELETE rows WHERE <column> = user_id. Used for personal
//                  learning / behavior / memory data. P0 for Apple 5.1.1(v)
//                  + GDPR Art. 17.
//   "anonymize"  — UPDATE SET <column> = NULL WHERE <column> = user_id.
//                  Used for billing / financial / audit records that must
//                  be retained for tax / legal compliance. We strip the
//                  user linkage but keep the row.
//   "skip_view"  — Postgres view. Deletes pass through to base tables.
//                  No-op.
//   "skip_admin" — Row identifies an admin's actions (e.g., who granted
//                  a role), not the deleted user's personal data. The
//                  admin may still be active; do not touch.

export type ManifestAction = "delete" | "anonymize" | "skip_view" | "skip_admin";

export type ManifestEntry = {
  table: string;
  action: ManifestAction;
  /** Column whose value equals the target user_id. Required for delete + anonymize. */
  column?: string;
  /**
   * For anonymize only. Additional columns to scrub in the same UPDATE.
   * Use `null` to set a column to SQL NULL; use a string literal (e.g.
   * `"[deleted]"`) to overwrite free-text. Needed when nulling `user_id`
   * alone would still leave identifying content behind (e.g. `feedback.message`,
   * jsonb payloads with embedded emails, IP addresses).
   */
  scrub_columns?: Record<string, string | null>;
  reason: string;
};

export const USER_DATA_MANIFEST: ManifestEntry[] = [
  // ────────────────────────────────────────────────────────────
  // Personal learning / progress / memory / behavior data → DELETE
  // ────────────────────────────────────────────────────────────
  { table: "access_code_redemptions",         action: "delete",    column: "user_id", reason: "user's redemption history" },
  { table: "admin_inbox",                     action: "delete",    column: "user_id", reason: "inbox of messages addressed to user" },
  { table: "ai_usage",                        action: "delete",    column: "user_id", reason: "personal AI usage log" },
  { table: "ai_usage_events",                 action: "delete",    column: "user_id", reason: "personal AI usage events" },
  { table: "ai_usage_logs",                   action: "delete",    column: "user_id", reason: "personal AI usage logs" },
  { table: "app_feedback",                    action: "delete",    column: "user_id", reason: "user-submitted feedback" },
  { table: "community_messages",              action: "delete",    column: "user_id", reason: "chat messages authored by user" },
  { table: "companion_events",                action: "delete",    column: "user_id", reason: "teacher companion interaction log" },
  { table: "companion_state",                 action: "delete",    column: "user_id", reason: "teacher companion state" },
  { table: "email_events",                    action: "delete",    column: "user_id", reason: "per-user email open/click events" },
  { table: "favorite_rooms",                  action: "delete",    column: "user_id", reason: "user's favorited rooms" },
  { table: "favorite_tracks",                 action: "delete",    column: "user_id", reason: "user's favorited tracks" },
  { table: "matchmaking_preferences",         action: "delete",    column: "user_id", reason: "matchmaking preferences" },
  { table: "matchmaking_suggestions",         action: "delete",    column: "user_id", reason: "matchmaking results" },
  { table: "mb_ai_quality_events",            action: "delete",    column: "user_id", reason: "per-user AI quality events" },
  { table: "mb_ai_usage_logs",                action: "delete",    column: "user_id", reason: "per-user AI usage logs" },
  { table: "mb_progress_narratives",          action: "delete",    column: "user_id", reason: "AI-generated progress narratives" },
  { table: "mb_pronunciation_attempts",       action: "delete",    column: "user_id", reason: "pronunciation attempts" },
  { table: "mb_teacher_quality_scores",       action: "delete",    column: "user_id", reason: "teacher-quality scoring per user" },
  { table: "mb_user_effective_rank",          action: "delete",    column: "user_id", reason: "computed per-user rank" },
  { table: "mb_user_learning_history",        action: "delete",    column: "user_id", reason: "learning history events" },
  { table: "mb_user_learning_metrics",        action: "delete",    column: "user_id", reason: "rolled-up learning metrics" },
  { table: "mb_user_personality_memory",      action: "delete",    column: "user_id", reason: "personality profile" },
  { table: "mb_user_progress_narratives",     action: "delete",    column: "user_id", reason: "AI-generated progress narratives" },
  { table: "mb_user_progress_snapshots",      action: "delete",    column: "user_id", reason: "periodic progress snapshots" },
  { table: "mb_user_pron_growth",             action: "delete",    column: "user_id", reason: "pronunciation growth metrics" },
  { table: "mb_user_room_weekly_pronunciation", action: "delete",  column: "user_id", reason: "weekly pronunciation rollups" },
  { table: "mb_user_weakness_events",         action: "delete",    column: "user_id", reason: "weakness events" },
  { table: "mb_user_weakness_profile",        action: "delete",    column: "user_id", reason: "weakness profile" },
  { table: "mb_user_weakness_snapshots",      action: "delete",    column: "user_id", reason: "weakness snapshots" },
  { table: "mb_user_weekly_ai_snapshots",     action: "delete",    column: "user_id", reason: "weekly AI snapshots" },
  { table: "mb_user_weekly_snapshots",        action: "delete",    column: "user_id", reason: "weekly snapshots" },
  { table: "mb_weekly_snapshots",             action: "delete",    column: "user_id", reason: "weekly snapshots" },
  { table: "mercy_host_notes",                action: "delete",    column: "user_id", reason: "Mercy's notes about the user" },
  { table: "point_transactions",              action: "delete",    column: "user_id", reason: "points ledger" },
  { table: "presence_sessions",               action: "delete",    column: "user_id", reason: "presence tracking" },
  { table: "pronunciation_evaluations",       action: "delete",    column: "user_id", reason: "pronunciation evals" },
  { table: "room_assignments",                action: "delete",    column: "user_id", reason: "room-to-user assignments" },
  { table: "room_chat_messages",              action: "delete",    column: "user_id", reason: "chat messages" },
  { table: "room_feedback",                   action: "delete",    column: "user_id", reason: "per-room feedback" },
  { table: "room_messages",                   action: "delete",    column: "user_id", reason: "room messages" },
  { table: "room_reflections",                action: "delete",    column: "user_id", reason: "user-written reflections" },
  { table: "room_usage_analytics",            action: "delete",    column: "user_id", reason: "per-user room usage" },
  { table: "speaking_evaluations",            action: "delete",    column: "user_id", reason: "speaking evals" },
  { table: "speech_attempts",                 action: "delete",    column: "user_id", reason: "speech attempt transcripts" },
  { table: "study_events",                    action: "delete",    column: "user_id", reason: "study event log" },
  { table: "study_log",                       action: "delete",    column: "user_id", reason: "legacy study log" },
  { table: "teacher_memory",                  action: "delete",    column: "user_id", reason: "Mercy memory blob" },
  { table: "tts_usage_log",                   action: "delete",    column: "user_id", reason: "TTS usage" },
  { table: "user_behavior_tracking",          action: "delete",    column: "user_id", reason: "behavior tracking" },
  { table: "user_feedback",                   action: "delete",    column: "user_id", reason: "user feedback submissions" },
  { table: "user_knowledge_profile",          action: "delete",    column: "user_id", reason: "knowledge profile" },
  { table: "user_music_uploads",              action: "delete",    column: "user_id", reason: "user-uploaded music refs" },
  { table: "user_notebook_items",             action: "delete",    column: "user_id", reason: "notebook + SRS state" },
  { table: "user_notes",                      action: "delete",    column: "user_id", reason: "user's notes" },
  { table: "user_path_progress",              action: "delete",    column: "user_id", reason: "path progress" },
  { table: "user_points",                     action: "delete",    column: "user_id", reason: "points snapshot" },
  { table: "user_presence",                   action: "delete",    column: "user_id", reason: "presence" },
  { table: "user_quotas",                     action: "delete",    column: "user_id", reason: "quota counters" },
  { table: "user_room_progress",              action: "delete",    column: "user_id", reason: "room progress (currently empty)" },
  { table: "user_sessions",                   action: "delete",    column: "user_id", reason: "session log" },
  { table: "viewer_access",                   action: "delete",    column: "user_id", reason: "viewer access entries" },
  { table: "vip_room_requests",               action: "delete",    column: "user_id", reason: "VIP room requests" },

  // ────────────────────────────────────────────────────────────
  // Private messages — both sender and receiver columns need wiping
  // ────────────────────────────────────────────────────────────
  { table: "private_chat_requests",           action: "delete",    column: "sender_id",   reason: "chat requests sent by user" },
  { table: "private_chat_requests",           action: "delete",    column: "receiver_id", reason: "chat requests received by user" },
  { table: "private_messages",                action: "delete",    column: "sender_id",   reason: "messages sent by user" },
  { table: "private_messages",                action: "delete",    column: "receiver_id", reason: "messages received by user" },

  // ────────────────────────────────────────────────────────────
  // Billing / financial / entitlements → ANONYMIZE
  // (retain row for tax / legal audit; strip user linkage)
  // ────────────────────────────────────────────────────────────
  {
    table: "apple_iap_events", action: "anonymize", column: "user_id",
    scrub_columns: {
      raw_payload: null, dedupe_key: null, notification_uuid: null,
      original_transaction_id: null, transaction_id: null,
    },
    reason: "keep amounts/dates for audit; scrub signed JWS payload + Apple transaction IDs (contain appAccountToken = user uuid)",
  },
  {
    table: "bank_payment_requests", action: "anonymize", column: "user_id",
    scrub_columns: { transfer_note: "[deleted]", admin_note: "[deleted]", screenshot_url: null },
    reason: "financial record; scrub user-written note, admin note referencing user, and proof-image URL",
  },
  {
    table: "bank_transfer_orders", action: "anonymize", column: "user_id",
    scrub_columns: { transfer_note: "[deleted]", rejection_reason: "[deleted]", screenshot_url: null },
    reason: "financial record; scrub user-written note, admin rejection reason, proof-image URL",
  },
  {
    table: "billing_customers", action: "anonymize", column: "user_id",
    scrub_columns: { email: null, customer_id: null },
    reason: "row kept for reconciliation; scrub explicit email + Stripe customer_id",
  },
  {
    table: "entitlement_events", action: "anonymize", column: "user_id",
    scrub_columns: { payload: null, event_id: null },
    reason: "entitlement history; scrub jsonb payload (provider event body, can contain email)",
  },
  { table: "organization_users",              action: "anonymize", column: "user_id", reason: "org_id + role only — no further PII after user_id nulled" },
  {
    table: "payment_events", action: "anonymize", column: "user_id",
    scrub_columns: {
      payload: null, stripe_customer_id: null, stripe_subscription_id: null,
      stripe_session_id: null, external_reference: null,
    },
    reason: "payment event log; scrub jsonb payload + Stripe IDs that back-link to PII via Stripe API",
  },
  {
    table: "payment_proof_submissions", action: "anonymize", column: "user_id",
    scrub_columns: {
      username: null, admin_notes: "[deleted]", screenshot_url: null, extracted_email: null,
    },
    reason: "manual payment proof history; scrub user-stated username, admin notes, proof-image URL, OCR-extracted email",
  },
  {
    table: "payment_transactions", action: "anonymize", column: "user_id",
    scrub_columns: {
      metadata: null, stripe_customer_id: null, stripe_subscription_id: null,
      stripe_payment_intent_id: null, external_reference: null,
    },
    reason: "financial record; scrub jsonb metadata + Stripe IDs",
  },
  {
    table: "payments", action: "anonymize", column: "user_id",
    scrub_columns: {
      raw: null, customer_id: null, subscription_id: null,
      invoice_id: null, payment_intent_id: null,
    },
    reason: "financial record; scrub full Stripe event body + provider IDs",
  },
  { table: "subscription_usage",              action: "anonymize", column: "user_id", reason: "dates + usage counters only — no PII after user_id nulled" },
  {
    table: "subscriptions", action: "anonymize", column: "user_id",
    scrub_columns: {
      raw_payload: null, metadata: null, provider_metadata: null,
      customer_id: null, subscription_id: null,
      provider_customer_id: null, provider_transaction_id: null,
      provider_original_transaction_id: null,
    },
    reason: "subscription history; scrub jsonb raw/metadata + all provider-assigned IDs",
  },
  { table: "tier_memberships",                action: "anonymize", column: "user_id", reason: "tier + dates only — no PII after user_id nulled" },
  { table: "user_entitlements",               action: "anonymize", column: "user_id", reason: "tier_name + vip_rank + date only — no PII after user_id nulled" },
  { table: "user_entitlements_raw",           action: "anonymize", column: "user_id", scrub_columns: { features: null }, reason: "entitlement audit; features jsonb can hold arbitrary flags — null for safety" },
  { table: "user_entitlements_raw_20260301_181303", action: "anonymize", column: "user_id", scrub_columns: { features: null }, reason: "entitlement snapshot backup; null features jsonb" },
  { table: "user_promo_redemptions",          action: "anonymize", column: "user_id", reason: "promo_code_id + counters only — no PII after user_id nulled" },
  {
    table: "user_subscription_state", action: "anonymize", column: "user_id",
    scrub_columns: { stripe_customer_id: null, stripe_subscription_id: null },
    reason: "subscription state; scrub Stripe IDs",
  },
  {
    table: "user_subscriptions", action: "anonymize", column: "user_id",
    scrub_columns: {
      stripe_customer_id: null, stripe_subscription_id: null,
      provider_customer_id: null, provider_transaction_id: null,
    },
    reason: "subscription history; scrub all provider-assigned IDs",
  },
  { table: "user_tiers",                      action: "anonymize", column: "user_id", reason: "tier + date only — no PII after user_id nulled" },
  {
    table: "webhook_events", action: "anonymize", column: "user_id",
    scrub_columns: {
      payload: null, error: null, customer_id: null, subscription_id: null,
      invoice_id: null, payment_intent_id: null,
    },
    reason: "webhook delivery audit; scrub jsonb payload (full provider event), error text, provider IDs",
  },
  {
    table: "webhook_events_pending", action: "anonymize", column: "user_id",
    scrub_columns: {
      payload: null, error: null, customer_id: null, subscription_id: null,
      invoice_id: null, payment_intent_id: null,
    },
    reason: "webhook delivery queue; same scrub shape as webhook_events",
  },

  // ────────────────────────────────────────────────────────────
  // Security / moderation / audit → ANONYMIZE
  // ────────────────────────────────────────────────────────────
  {
    table: "audit_logs", action: "anonymize", column: "admin_id",
    scrub_columns: { ip_address: null, user_agent: null, metadata: null },
    reason: "admin audit — retain action for accountability; scrub IP (GDPR PII) + user_agent + metadata jsonb",
  },
  {
    table: "feedback", action: "anonymize", column: "user_id",
    scrub_columns: { message: "[deleted]" },
    reason: "public feedback — keep row for analytics; scrub free-text message body (user may have typed name/phone/email)",
  },
  {
    table: "security_events", action: "anonymize", column: "user_id",
    scrub_columns: { ip_address: null, user_agent: null, metadata: null },
    reason: "security audit; scrub IP (GDPR PII) + user_agent + metadata jsonb (may contain device fingerprint)",
  },
  {
    table: "system_logs", action: "anonymize", column: "user_id",
    scrub_columns: { message: "[deleted]", metadata: null },
    reason: "system audit; scrub free-text log message and metadata jsonb",
  },
  { table: "user_moderation_status",          action: "anonymize", column: "user_id",        reason: "counters + booleans only — no PII after user_id nulled; kept for abuse-prevention memory" },
  {
    table: "user_moderation_violations", action: "anonymize", column: "user_id",
    scrub_columns: { message_content: "[deleted]" },
    reason: "moderation audit — retain violation_type/severity; scrub the user's violating message text",
  },
  {
    table: "user_role_audit", action: "anonymize", column: "actor_user_id",
    scrub_columns: { actor_email: null },
    reason: "role audit — retain action; strip actor_user_id + actor_email. Scrub only runs on actor pass so other admins' emails on rows where this user was the TARGET are untouched.",
  },
  { table: "user_role_audit",                 action: "anonymize", column: "target_user_id", reason: "role audit — strip target only; actor columns handled on the actor pass" },
  {
    table: "user_security_status", action: "anonymize", column: "user_id",
    scrub_columns: { blocked_reason: "[deleted]" },
    reason: "security tracking; scrub admin-written blocked_reason text",
  },
  { table: "vip_topic_requests_detailed",     action: "skip_view", reason: "view over vip_room_requests" },

  // ────────────────────────────────────────────────────────────
  // Admin tables — user_id here refers to the ADMIN, not the deleted user
  // ────────────────────────────────────────────────────────────
  { table: "admin_access_audit",              action: "skip_admin", reason: "audit of actions the ADMIN took; admin may still be active" },
  { table: "admin_notification_preferences",  action: "delete",     column: "admin_user_id", reason: "IF the deleted user was an admin, wipe their prefs" },
  { table: "admin_notification_settings",     action: "delete",     column: "admin_user_id", reason: "same" },
  { table: "admin_notifications",             action: "delete",     column: "admin_user_id", reason: "admin's personal notifications" },
  { table: "admin_users",                     action: "delete",     column: "user_id",       reason: "admin role membership" },
  { table: "payment_proof_audit_log",         action: "anonymize",  column: "admin_user_id", reason: "admin audit — retain action" },
  { table: "user_roles",                      action: "delete",     column: "user_id",       reason: "role assignments for this user" },

  // ────────────────────────────────────────────────────────────
  // Views — automatically reflect base tables; no direct action
  // ────────────────────────────────────────────────────────────
  { table: "mb_v_pron_attempts_week",                 action: "skip_view", reason: "view" },
  { table: "mb_v_pronunciation_failures_by_user",     action: "skip_view", reason: "view" },
  { table: "mb_v_pronunciation_improvement_core",     action: "skip_view", reason: "view" },
  { table: "mb_v_quality_events_week",                action: "skip_view", reason: "view" },
  { table: "mb_v_trust_score",                        action: "skip_view", reason: "view" },
  { table: "mb_v_usage_week",                         action: "skip_view", reason: "view" },
  { table: "mb_v_weakness_improvement_week",          action: "skip_view", reason: "view" },
  { table: "mb_v_weakness_week",                      action: "skip_view", reason: "view" },
  { table: "payment_events_canonical",                action: "skip_view", reason: "canonical view over payment_events" },
  { table: "payment_transactions_with_age",           action: "skip_view", reason: "view over payment_transactions" },
  { table: "account_summary_v",                       action: "skip_view", reason: "view" },
  { table: "admin_users_dashboard_v1",                action: "skip_view", reason: "view" },
  { table: "ai_usage_daily",                          action: "skip_view", reason: "view over ai_usage" },
  { table: "ai_usage_daily_v2",                       action: "skip_view", reason: "view over ai_usage" },
  { table: "billing_active_subscriptions_v",          action: "skip_view", reason: "view" },
  { table: "billing_mrr_inputs_v",                    action: "skip_view", reason: "view" },
  { table: "billing_recent_subscription_changes_v",   action: "skip_view", reason: "view" },
  { table: "billing_subscription_events_v",           action: "skip_view", reason: "view" },
  { table: "current_user_vip",                        action: "skip_view", reason: "view" },
  { table: "my_entitlements",                         action: "skip_view", reason: "view" },
  { table: "my_entitlements_v1",                      action: "skip_view", reason: "view" },
  { table: "user_entitlements_v",                     action: "skip_view", reason: "view" },
  { table: "v_admin_profiles",                        action: "skip_view", reason: "view" },
  { table: "v_community_messages",                    action: "skip_view", reason: "view over community_messages" },
  { table: "v_feedback_inbox",                        action: "skip_view", reason: "view" },
  { table: "v_mb_mercy_pron_attempts_weekly",         action: "skip_view", reason: "view" },
  { table: "v_mb_mercy_pron_fail_tail",               action: "skip_view", reason: "view" },
  { table: "v_mb_mercy_weakness_current",             action: "skip_view", reason: "view" },
  { table: "v_mb_recent_failures",                    action: "skip_view", reason: "view" },
  { table: "v_mb_sound_improvement_score_weekly",     action: "skip_view", reason: "view" },
  { table: "v_mb_trust_daily_user",                   action: "skip_view", reason: "view" },
  { table: "v_mb_trust_rank_week",                    action: "skip_view", reason: "view" },
  { table: "v_mb_user_phoneme_bottom_week",           action: "skip_view", reason: "view" },
  { table: "v_mb_user_room_counts_week",              action: "skip_view", reason: "view" },
  { table: "v_mb_weakness_improvement_weekly",        action: "skip_view", reason: "view" },
  { table: "v_mb_weakness_improving_now",             action: "skip_view", reason: "view" },
  { table: "v_mb_weekly_leaderboard",                 action: "skip_view", reason: "view" },
  { table: "v_mb_weekly_most_improved",               action: "skip_view", reason: "view" },
  { table: "v_mb_weekly_rank_by_org",                 action: "skip_view", reason: "view" },
  { table: "v_mb_weekly_rank_global",                 action: "skip_view", reason: "view" },
  { table: "v_payment_events_with_resolution",        action: "skip_view", reason: "view" },
  { table: "v_profiles_self",                         action: "skip_view", reason: "view" },
  { table: "v_user_ai_monthly_meter",                 action: "skip_view", reason: "view" },
  { table: "v_user_progress_current",                 action: "skip_view", reason: "view" },
  { table: "v_user_streak_vn",                        action: "skip_view", reason: "view" },
  { table: "v_user_vip_access_active",                action: "skip_view", reason: "view" },
  { table: "v_user_vip_tier",                         action: "skip_view", reason: "view" },

  // ────────────────────────────────────────────────────────────
  // profiles — handled separately at the END of delete-account
  // (after all FKs clean). Not looped via the manifest.
  // ────────────────────────────────────────────────────────────
  { table: "profiles",                        action: "skip_view", reason: "handled by separate final DELETE + auth.users cascade" },
];

/** Tables with explicit DELETE action, FK-safe ordered (leaf-ish first). */
export function getDeleteEntries(): Array<{ table: string; column: string }> {
  return USER_DATA_MANIFEST
    .filter((m): m is ManifestEntry & { column: string } =>
      m.action === "delete" && typeof m.column === "string",
    )
    .map(({ table, column }) => ({ table, column }));
}

/** Tables with explicit ANONYMIZE action, including any scrub overlay. */
export function getAnonymizeEntries(): Array<{
  table: string;
  column: string;
  scrub_columns?: Record<string, string | null>;
}> {
  return USER_DATA_MANIFEST
    .filter((m): m is ManifestEntry & { column: string } =>
      m.action === "anonymize" && typeof m.column === "string",
    )
    .map(({ table, column, scrub_columns }) => ({ table, column, scrub_columns }));
}

/** Canonical set of table names this manifest covers (views + skips included). */
export function getCoveredTableNames(): Set<string> {
  return new Set(USER_DATA_MANIFEST.map((m) => m.table));
}
