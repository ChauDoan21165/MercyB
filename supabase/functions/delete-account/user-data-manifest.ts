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
  { table: "placement_v3_profiles",           action: "delete",    column: "user_id", reason: "placement v3 computed profile; user-owned learning diagnosis" },
  { table: "placement_v3_responses",          action: "delete",    column: "session_id", reason: "placement v3 response evidence; hard-deleted by ON DELETE CASCADE from placement_v3_sessions/auth.users because this table has no user_id column" },
  { table: "placement_v3_sessions",           action: "delete",    column: "user_id", reason: "placement v3 session history; cascades placement_v3_responses" },
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
  { table: "entitlements",                    action: "anonymize", column: "user_id", reason: "live entitlement state; anonymize on delete (parity with user_entitlements/raw)" },
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

  // ════════════════════════════════════════════════════════════
  // B1 follow-up to PR #797 — 42 live user-id tables surfaced by
  // scripts/check-delete-account-coverage.mjs once the CI gate was
  // wired. Classifications below cite the migration that defines
  // each table (column + FK cascade behavior); see the PR body for
  // the per-table rationale.
  // ════════════════════════════════════════════════════════════

  // ── B1: Personal learning / progress / memory / behavior → DELETE ──
  { table: "certificates",                    action: "delete",    column: "user_id", reason: "user-earned certificate records" },
  { table: "corporate_seats",                 action: "delete",    column: "user_id", reason: "seat assignment; user_id is NOT NULL (FK CASCADE from auth.users); seat row goes when user goes" },
  { table: "daily_challenges",                action: "delete",    column: "user_id", reason: "per-user daily challenge state (UNIQUE (user_id, date))" },
  { table: "family_plan_members",             action: "delete",    column: "user_id", reason: "family-plan seat; user_id NOT NULL (FK CASCADE); the family_plans row itself is owned separately" },
  { table: "interview_sessions",              action: "delete",    column: "user_id", reason: "interview-prep session log" },
  { table: "leaderboard_weekly",              action: "delete",    column: "user_id", reason: "weekly leaderboard rows" },
  { table: "mercy_conversations",             action: "delete",    column: "user_id", reason: "Mercy chat conversation history" },
  { table: "mercy_unified_sessions",          action: "delete",    column: "user_id", reason: "Mercy unified session log" },
  { table: "mercy_user_facts",                action: "delete",    column: "user_id", reason: "facts Mercy memorized about the user" },
  { table: "mfa_backup_codes",                action: "delete",    column: "user_id", reason: "user's MFA backup codes" },
  { table: "mfa_lockouts",                    action: "delete",    column: "user_id", reason: "MFA lockout state; user_id PK (FK CASCADE); short-lived, no audit retention needed" },
  { table: "mock_interview_sessions",         action: "delete",    column: "user_id", reason: "mock interview session history" },
  { table: "pronunciation_srs_items",         action: "delete",    column: "user_id", reason: "pronunciation SRS state" },
  { table: "push_preferences",                action: "delete",    column: "user_id", reason: "push-notification preferences" },
  { table: "push_tokens",                     action: "delete",    column: "user_id", reason: "APNS/FCM device tokens" },
  { table: "referral_leaderboard_optin",      action: "delete",    column: "user_id", reason: "leaderboard opt-in flag" },
  { table: "review_log",                      action: "delete",    column: "user_id", reason: "flashcard review log" },
  { table: "roadmap_item_votes",              action: "delete",    column: "user_id", reason: "user votes on roadmap items" },
  { table: "study_group_members",             action: "delete",    column: "user_id", reason: "study-group membership" },
  { table: "user_challenge_completion",       action: "delete",    column: "user_id", reason: "challenge-completion records" },
  { table: "user_interview_prompt_votes",     action: "delete",    column: "user_id", reason: "votes on interview prompts" },
  { table: "user_listening_progress",         action: "delete",    column: "user_id", reason: "listening-clip progress" },
  { table: "user_placements",                 action: "delete",    column: "user_id", reason: "placement-test results" },
  { table: "user_stories",                    action: "delete",    column: "user_id", reason: "user-written stories (testimonials); moderation status preserved on other users' rows" },
  { table: "user_vocabulary",                 action: "delete",    column: "user_id", reason: "user's vocabulary list" },
  { table: "user_writing_submissions",        action: "delete",    column: "user_id", reason: "user writing submissions" },
  { table: "user_xp",                         action: "delete",    column: "user_id", reason: "XP rollup per user" },
  { table: "vocabulary_srs_items",            action: "delete",    column: "user_id", reason: "vocabulary SRS state" },
  { table: "weekly_leaderboard",              action: "delete",    column: "user_id", reason: "weekly leaderboard rows" },
  { table: "xp_events",                       action: "delete",    column: "user_id", reason: "XP-event ledger" },

  // ── B1: Audit / deliverability / fraud-detection → ANONYMIZE (unblocked by #837 nullable migration, A6d retention policy) ──
  // user_id is nullable post-#837 (FK softened CASCADE → SET NULL). Each
  // row survives account deletion with user_id NULL — the audit / cost /
  // anti-abuse signal is retained, the linkage to the deleted user is
  // gone. DO NOT MERGE THIS PR until #837 is applied in prod — until
  // then these UPDATEs runtime-error on NOT NULL.
  { table: "email_sends_log",                 action: "anonymize", column: "user_id", reason: "re-engagement email delivery log; retain for deliverability audit (RFC 8058 list-hygiene patterns), strip linkage. user_id nullable post-#837 migration (A6d / A4j decision record)." },
  { table: "push_send_log",                   action: "anonymize", column: "user_id", reason: "per-user push delivery diagnostics; retain for ops/SLO traceability, strip linkage. user_id nullable post-#837 migration (A6d / A4j decision record)." },
  { table: "referral_audit_log",              action: "anonymize", column: "user_id", reason: "referral ANTI-ABUSE / fraud-detection memory — A6d's highest-priority retention case (deleting fraud evidence on user-erasure request is a policy risk). FK to profiles, ON DELETE SET NULL post-#837 (A4j decision record)." },
  { table: "speech_analysis_logs",            action: "anonymize", column: "user_id", reason: "per-attempt OpenAI cost-tracking; retain for cost analytics, strip linkage. user_id nullable post-#837 migration (A6d / A4j decision record)." },

  // ── B1: Cost-tracking / experiment integrity → ANONYMIZE (FK SET NULL — nullable today) ──
  { table: "mercy_tts_usage",                 action: "anonymize", column: "user_id", reason: "per-user TTS cost-tracking; retain for cost analytics, strip linkage. FK is ON DELETE SET NULL (nullable user_id); no PII column to scrub beyond user_id." },
  // known-tradeoff: CHECK (user_id IS NOT NULL OR anon_id IS NOT NULL) — anon_id scrub hits this; acceptable if user_id cascade-nulls first
  {
    table: "paywall_experiment_exposures", action: "anonymize", column: "user_id",
    scrub_columns: { anon_id: null },
    reason: "A/B experiment exposure; retain row to preserve denominator integrity (don't post-hoc shrink the cohort), strip linkage. FK is ON DELETE SET NULL. anon_id is a pre-login device fingerprint that can re-link, so the scrub_columns spec lists anon_id: null. Runtime: the combined UPDATE (user_id=NULL, anon_id=NULL) violates the CHECK and is rejected atomically — Pass 4's auth.users delete then cascade-nulls user_id alone (anon_id keeps its original value). End state: row survives with user_id=NULL, anon_id=<original> — denominator preserved, anti-relink scrub deferred until a CHECK-loosening migration ships.",
  },

  // ── B1: Marketing / signup intent → ANONYMIZE (FK is ON DELETE SET NULL → user_id is nullable) ──
  {
    table: "lifetime_intent_signups", action: "anonymize", column: "user_id",
    scrub_columns: { email: null, reason_text: "[deleted]" },
    reason: "marketing signal — keep aggregate counts/reason_code/country; scrub explicit email + free-text reason. FK is ON DELETE SET NULL (nullable user_id).",
  },

  // ── B1: Admin audit → ANONYMIZE (admin_user_id is nullable; FK is ON DELETE SET NULL) ──
  {
    table: "email_audit", action: "anonymize", column: "admin_user_id",
    scrub_columns: { recipient_email: "[deleted]", subject: "[deleted]", error_message: "[deleted]", metadata: null },
    reason: "admin email audit — retain action for accountability; scrub the email recipient/subject + error text + metadata jsonb when the deleted user WAS the admin. user_id-side scrubbing rides on FK SET NULL (admin_user_id nullable).",
  },

  // ── B1: Views + materialized views → SKIP_VIEW ──
  { table: "all_time_referral_leaderboard",   action: "skip_view", reason: "MATERIALIZED VIEW — REFRESH rebuilds it from base tables" },
  { table: "monthly_referral_leaderboard",    action: "skip_view", reason: "MATERIALIZED VIEW — REFRESH rebuilds it from base tables" },
  { table: "v_analytics_user_cohorts",        action: "skip_view", reason: "view over profiles" },
  { table: "v_user_pronunciation_stats",      action: "skip_view", reason: "view over speech_attempts" },

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
