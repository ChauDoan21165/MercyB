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
const SQL_PATH = resolve(
  __dirname,
  "../../../../supabase/migrations/20260427000000_referral_leaderboard.sql",
);

const SQL = readFileSync(SQL_PATH, "utf8");

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
