// supabase/functions/delete-account/__tests__/user-data-manifest.test.ts
//
// Regression lock for the B1 follow-up to PR #797.
//
// The CI gate (scripts/check-delete-account-coverage.mjs) needs prod Supabase
// env vars to compare against the live schema; this unit test runs against
// the static manifest only — covering the invariants the runtime relies on
// (vitest-importable, deno-clean, fast, deterministic). The CI gate is the
// authoritative live-schema check; this test is the in-repo regression lock.

import { describe, expect, it } from "vitest";

import {
  getAnonymizeEntries,
  getCoveredTableNames,
  getDeleteEntries,
  USER_DATA_MANIFEST,
  type ManifestEntry,
} from "../user-data-manifest";

describe("user-data-manifest — structural invariants", () => {
  it("delete + anonymize entries always carry a column", () => {
    const offenders = USER_DATA_MANIFEST.filter(
      (m) =>
        (m.action === "delete" || m.action === "anonymize") &&
        (typeof m.column !== "string" || m.column.length === 0),
    );
    expect(offenders).toEqual([]);
  });

  it("skip_view + skip_admin entries do not carry scrub_columns", () => {
    const offenders = USER_DATA_MANIFEST.filter(
      (m) =>
        (m.action === "skip_view" || m.action === "skip_admin") &&
        m.scrub_columns !== undefined,
    );
    expect(offenders).toEqual([]);
  });

  it("every entry has a non-empty reason", () => {
    const offenders = USER_DATA_MANIFEST.filter(
      (m) => typeof m.reason !== "string" || m.reason.trim().length === 0,
    );
    expect(offenders).toEqual([]);
  });

  it("getDeleteEntries returns every delete row", () => {
    const expected = USER_DATA_MANIFEST.filter(
      (m): m is ManifestEntry & { column: string } =>
        m.action === "delete" && typeof m.column === "string",
    ).length;
    expect(getDeleteEntries().length).toBe(expected);
  });

  it("getAnonymizeEntries returns every anonymize row", () => {
    const expected = USER_DATA_MANIFEST.filter(
      (m): m is ManifestEntry & { column: string } =>
        m.action === "anonymize" && typeof m.column === "string",
    ).length;
    expect(getAnonymizeEntries().length).toBe(expected);
  });
});

describe("user-data-manifest — B1 (#797) coverage lock", () => {
  // The live user-id tables the script surfaced after PR #797 wired the
  // CI gate. If any of these stop being covered, this test fails BEFORE the
  // CI gate is needed — earlier, cheaper feedback than the prod-env-gated
  // check.
  const REQUIRED_B1_TABLES = [
    "certificates",
    "corporate_seats",
    "daily_challenges",
    "conversations",
    "email_audit",
    "email_sends_log",
    "feature_outcome_events",
    "family_plan_members",
    "interview_sessions",
    "leaderboard_weekly",
    "lifetime_intent_signups",
    "mercy_conversations",
    "mercy_tts_usage",
    "mercy_unified_sessions",
    "mercy_user_facts",
    "mfa_backup_codes",
    "mfa_lockouts",
    "mock_interview_sessions",
    "paywall_experiment_exposures",
    "pronunciation_srs_items",
    "push_preferences",
    "push_send_log",
    "push_tokens",
    "referral_audit_log",
    "referral_leaderboard_optin",
    "review_log",
    "roadmap_item_votes",
    "speech_analysis_logs",
    "study_group_members",
    "user_challenge_completion",
    "user_interview_prompt_votes",
    "user_listening_progress",
    "user_placements",
    "user_stories",
    "user_vocabulary",
    "user_writing_submissions",
    "user_xp",
    "v_analytics_user_cohorts",
    "v_user_pronunciation_stats",
    "vocabulary_srs_items",
    "weekly_leaderboard",
    "xp_events",
  ] as const;

  it("covers all surfaced live user-id tables from PR #797's follow-up", () => {
    const covered = getCoveredTableNames();
    const missing = REQUIRED_B1_TABLES.filter((t) => !covered.has(t));
    expect(missing).toEqual([]);
  });
});
