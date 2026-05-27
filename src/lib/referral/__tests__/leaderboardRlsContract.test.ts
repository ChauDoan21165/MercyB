// @vitest-environment node
//
// Contract tests on the SQL migration to lock the RLS + privacy invariants:
//   1. opt-in table is RLS-enabled
//   2. only the owner can read/write their row
//   3. admin can flag (level >= 9)
//   4. materialized views inner-join on status='active'
//   5. successful conversion requires email_confirmed_at + speech_attempts
//   6. daily cap is LEAST(5, ...)
//   7. flag function uses 10-row, 1h window threshold
//   8. last_recognition_email_month column exists

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Resolve relative to this test file, NOT process.cwd, so the test runs
// the same whether vitest is invoked from repo root or a sub-directory.
// Migration was renamed from 20260427000000 → 20260524000000 during
// the merge ordering shuffle when other referral migrations landed
// first. Same SQL content, just a later timestamp prefix. Point at
// the real filename so this contract test can keep enforcing the
// RLS policies + column shape.
const SQL_PATH = resolve(
  __dirname,
  "../../../../supabase/migrations/20260524000000_referral_leaderboard.sql",
);

const SQL = readFileSync(SQL_PATH, "utf8");

const SAFE_SQL_PATH = resolve(
  __dirname,
  "../../../../supabase/migrations/20260629000000_safe_referral_leaderboard_projection.sql",
);

const SAFE_SQL = readFileSync(SAFE_SQL_PATH, "utf8");

const PHASE2_RUNBOOK_PATH = resolve(
  __dirname,
  "../../../../docs/security/referral-leaderboard-auth-users-exposed-phase2.md",
);

const PHASE2_RUNBOOK = readFileSync(PHASE2_RUNBOOK_PATH, "utf8");

describe("referral_leaderboard_optin migration", () => {
  it("creates the opt-in table", () => {
    expect(SQL).toMatch(
      /CREATE TABLE IF NOT EXISTS public\.referral_leaderboard_optin/,
    );
  });

  it("enforces a 30-char display_name limit at the DB level", () => {
    expect(SQL).toMatch(/char_length\(display_name\) <= 30/);
  });

  it("declares the three valid status values", () => {
    expect(SQL).toMatch(/'active'/);
    expect(SQL).toMatch(/'opted_out'/);
    expect(SQL).toMatch(/'flagged'/);
  });

  it("enables RLS on the opt-in table", () => {
    expect(SQL).toMatch(
      /ALTER TABLE public\.referral_leaderboard_optin ENABLE ROW LEVEL SECURITY/,
    );
  });

  it("includes an owner-only write policy with auth.uid() = user_id", () => {
    expect(SQL).toMatch(/referral_lb_optin_write_own/);
    expect(SQL).toMatch(/auth\.uid\(\) = user_id/);
  });

  it("gates admin flag updates by get_admin_level >= 9", () => {
    expect(SQL).toMatch(/get_admin_level\(auth\.uid\(\)\) >= 9/);
  });

  it("adds the last_recognition_email_month column for the email cap", () => {
    expect(SQL).toMatch(/last_recognition_email_month/);
  });
});

describe("monthly_referral_leaderboard view", () => {
  it("inner-joins on the active opt-in (privacy invariant)", () => {
    // The materialized view DDL must filter on status='active'.
    const monthlyBlock = SQL.split("CREATE MATERIALIZED VIEW public.monthly_referral_leaderboard")[1] ?? "";
    expect(monthlyBlock).toMatch(/o\.status = 'active'/);
  });

  it("requires email_confirmed_at IS NOT NULL for successful conversions", () => {
    expect(SQL).toMatch(/email_confirmed_at IS NOT NULL/);
  });

  it("requires at least one speech_attempts row for successful conversions", () => {
    expect(SQL).toMatch(/public\.speech_attempts/);
    expect(SQL).toMatch(/first_attempt_at IS NOT NULL/);
  });

  it("applies the daily cap of 5 in the aggregation", () => {
    expect(SQL).toMatch(/LEAST\(5,\s*count\(\*\)/);
  });

  it("granularises by month via date_trunc('month', ...)", () => {
    expect(SQL).toMatch(/date_trunc\('month'/);
  });
});

describe("all_time_referral_leaderboard view", () => {
  it("also inner-joins on active opt-in", () => {
    const allTimeBlock = SQL.split(
      "CREATE MATERIALIZED VIEW public.all_time_referral_leaderboard",
    )[1] ?? "";
    expect(allTimeBlock).toMatch(/o\.status = 'active'/);
  });

  it("exposes total_premium_conversions + first_referral_date", () => {
    expect(SQL).toMatch(/total_premium_conversions/);
    expect(SQL).toMatch(/first_referral_date/);
  });
});

describe("flag_suspicious_referrers function", () => {
  it("uses a 1 hour preceding window", () => {
    expect(SQL).toMatch(/interval '1 hour' PRECEDING/);
  });

  it("flags at the 10-or-more threshold", () => {
    expect(SQL).toMatch(/in_window >= 10/);
  });

  it("writes a row to referral_audit_log on flag", () => {
    expect(SQL).toMatch(/INSERT INTO public\.referral_audit_log/);
  });

  it("only flags rows currently in 'active' state (idempotent)", () => {
    expect(SQL).toMatch(/AND status\s*=\s*'active'/);
  });
});

describe("public read grants", () => {
  it("grants SELECT on both views to anon + authenticated", () => {
    expect(SQL).toMatch(
      /GRANT SELECT ON public\.monthly_referral_leaderboard\s+TO anon, authenticated/,
    );
    expect(SQL).toMatch(
      /GRANT SELECT ON public\.all_time_referral_leaderboard TO anon, authenticated/,
    );
  });
});

describe("safe referral leaderboard projections", () => {
  it("creates public physical tables, not public views", () => {
    expect(SAFE_SQL).toMatch(
      /CREATE TABLE IF NOT EXISTS public\.referral_leaderboard_monthly_public/,
    );
    expect(SAFE_SQL).toMatch(
      /CREATE TABLE IF NOT EXISTS public\.referral_leaderboard_all_time_public/,
    );
    expect(SAFE_SQL).not.toMatch(
      /CREATE (?:MATERIALIZED )?VIEW public\.referral_leaderboard_monthly_public/,
    );
    expect(SAFE_SQL).not.toMatch(
      /CREATE (?:MATERIALIZED )?VIEW public\.referral_leaderboard_all_time_public/,
    );
  });

  it("excludes raw auth identifiers and PII from public projection columns", () => {
    const monthlyPublicBlock =
      SAFE_SQL.split("CREATE TABLE IF NOT EXISTS public.referral_leaderboard_monthly_public")[1]
        ?.split(");")[0] ?? "";
    const allTimePublicBlock =
      SAFE_SQL.split("CREATE TABLE IF NOT EXISTS public.referral_leaderboard_all_time_public")[1]
        ?.split(");")[0] ?? "";
    const publicBlocks = `${monthlyPublicBlock}\n${allTimePublicBlock}`;

    expect(publicBlocks).toMatch(/rank\s+integer/);
    expect(publicBlocks).toMatch(/display_name\s+text/);
    expect(publicBlocks).not.toMatch(/\buser_id\b/);
    expect(publicBlocks).not.toMatch(/\bemail\b/);
    expect(publicBlocks).not.toMatch(/\bphone\b/);
    expect(publicBlocks).not.toMatch(/\braw_/);
    expect(publicBlocks).not.toMatch(/\bprovider\b/);
    expect(publicBlocks).not.toMatch(/\bmetadata\b/);
  });

  it("does not reference auth.users in public projection table DDL", () => {
    const publicDdlWithComments =
      SAFE_SQL.split("CREATE TABLE IF NOT EXISTS public.referral_leaderboard_monthly_public")[1]
        ?.split("CREATE OR REPLACE FUNCTION public.refresh_safe_referral_leaderboard_projections")[0] ?? "";
    const publicDdl = publicDdlWithComments.replace(
      /COMMENT ON TABLE public\.referral_leaderboard_(?:monthly|all_time)_public IS\s+'[^']*';/g,
      "",
    );
    expect(publicDdl).not.toMatch(/auth\.users/);
  });

  it("keeps refresh and private candidate access off browser roles", () => {
    expect(SAFE_SQL).toMatch(
      /REVOKE ALL ON FUNCTION public\.refresh_safe_referral_leaderboard_projections\(\)\s+FROM PUBLIC, anon, authenticated/,
    );
    expect(SAFE_SQL).toMatch(
      /GRANT EXECUTE ON FUNCTION public\.refresh_safe_referral_leaderboard_projections\(\)\s+TO service_role/,
    );
    expect(SAFE_SQL).toMatch(
      /REVOKE ALL ON FUNCTION public\.get_referral_recognition_candidates\(date, integer\)\s+FROM PUBLIC, anon, authenticated/,
    );
    expect(SAFE_SQL).toMatch(
      /GRANT EXECUTE ON FUNCTION public\.get_referral_recognition_candidates\(date, integer\)\s+TO service_role/,
    );
  });

  it("schedules the safe projection refresh without touching legacy grants", () => {
    expect(SAFE_SQL).toMatch(/refresh-safe-referral-leaderboards-daily/);
    expect(SAFE_SQL).toMatch(
      /SELECT public\.refresh_safe_referral_leaderboard_projections\(\);/,
    );
  });
});

describe("referral leaderboard Phase 2 runbook", () => {
  it("unschedules the legacy refresh cron before legacy objects are dropped", () => {
    expect(PHASE2_RUNBOOK).toContain(
      "select cron.unschedule('refresh-referral-leaderboards-daily');",
    );
  });
});
