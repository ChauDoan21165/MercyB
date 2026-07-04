// RLS contract test — guards the profiles privilege-escalation fix by
// parsing the migration SQL. We don't have a live Postgres in unit
// tests, so a real RLS round-trip is a Playwright/manual-DB concern
// (same constraint documented in src/lib/accessCodes/__tests__/
// rlsContract.test.ts). The next-best protection is asserting that the
// BEFORE UPDATE trigger freezes every column in the privileged class,
// leaves legitimate own-profile fields alone, exempts service_role /
// SQL-Editor, and reverts rather than rejects. If a future edit drops a
// frozen column, starts freezing a legitimate one, removes the
// service_role exemption, or converts the revert into a RAISE, this
// test fails and the PR review catches it.
//
// Background: reports/RECON-rls-completeness.md §1 + this dispatch's
// Phase 1 verification. `GRANT SELECT,UPDATE ON public.profiles TO
// authenticated` is table-level and `profiles_update_own` has no
// `WITH CHECK`, so any free authenticated account could
// `PATCH /profiles?id=eq.<self> {is_admin:true}` then read all-user
// PII (profiles_select_admin → is_admin_user) and all subscriptions
// (subscriptions_admin_read). profiles_update_own /
// profiles_select_admin / is_admin_user() are SQL-Editor drift with no
// tracked migration; 20260614000000 is the first tracked migration for
// any of this surface. Full trace: RECON-rls-completeness.md §1–§2.

import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const migrationPath = path.resolve(
  process.cwd(),
  "supabase/migrations/20260614000000_profiles_freeze_privileged_columns.sql",
);

function readMigration(): string {
  return fs.readFileSync(migrationPath, "utf8");
}

// Executable SQL only — strips `--` line comments. The migration's
// header documents the attack path and the legitimate (NOT frozen)
// columns in prose, so negative assertions must run against the
// statements, not the comment block.
function readMigrationSql(): string {
  return readMigration()
    .split("\n")
    .map((line) => line.replace(/--.*$/, ""))
    .join("\n")
    .toLowerCase();
}

// The full privileged column class from RECON-rls-completeness.md §1.
// Every one of these must be reverted to its OLD value for the
// `authenticated` role. Keep this list exhaustive — the security
// guarantee is "the whole class", not just is_admin.
const SENSITIVE_COLUMNS = [
  "is_admin",
  "admin_level",
  "role",
  "tier",
  "plan_type",
  "premium_status",
  "premium_expires_at",
  "premium_source",
  "access_expires_at",
  "vip_rank",
  "trial_extension_days",
  "stripe_customer_id",
  "email_unsubscribe_token",
] as const;

// Representative legitimate own-profile fields written by browser
// client code today (Phase 1 inventory). These must NOT be frozen —
// freezing any of them is a product regression.
const LEGITIMATE_COLUMNS = [
  "username",
  "display_name",
  "avatar_url",
  "bio",
  "country",
  "timezone",
  "is_public",
  "preferred_accent",
  "native_language",
  "target_languages",
  "primary_goal",
  "profession",
  "english_level",
  "learning_started_at",
  "onboarded_at",
  "placement_cefr",
  "placement_score",
  "email_weekly_digest_enabled",
  "email_unsubscribed_at",
] as const;

describe("profiles privilege-escalation RLS migration (20260614000000)", () => {
  it("installs a BEFORE UPDATE FOR EACH ROW trigger on public.profiles", () => {
    const sql = readMigrationSql();
    expect(sql).toMatch(
      /create trigger profiles_freeze_privileged_columns\s+before update on public\.profiles\s+for each row\s+execute function public\.profiles_freeze_privileged_columns\(\)/,
    );
  });

  it("drops the trigger before recreating it (idempotent, no lockout window)", () => {
    expect(readMigrationSql()).toMatch(
      /drop trigger if exists profiles_freeze_privileged_columns on public\.profiles/,
    );
  });

  it("hardens the trigger function (security definer + pinned search_path)", () => {
    const sql = readMigrationSql();
    expect(sql).toContain("security definer");
    expect(sql).toMatch(/set search_path\s*=\s*''/);
  });

  // Locked #7 — the full 13-column class, one assertion per column.
  describe("authenticated user CANNOT mutate any privileged column", () => {
    for (const col of SENSITIVE_COLUMNS) {
      it(`reverts new.${col} to old.${col}`, () => {
        expect(readMigrationSql()).toMatch(
          new RegExp(`new\\.${col}\\s*:=\\s*old\\.${col}`),
        );
      });
    }

    it("freezes exactly the 13-column class and nothing fewer", () => {
      const sql = readMigrationSql();
      const reverts = [...sql.matchAll(/new\.(\w+)\s*:=\s*old\.\1/g)].map(
        (m) => m[1],
      );
      expect(new Set(reverts)).toEqual(new Set(SENSITIVE_COLUMNS));
    });
  });

  // Locked #7 — legitimate own-profile fields must still be writable.
  describe("authenticated user CAN still update legitimate fields", () => {
    for (const col of LEGITIMATE_COLUMNS) {
      it(`does not freeze ${col}`, () => {
        expect(readMigrationSql()).not.toMatch(
          new RegExp(`new\\.${col}\\s*:=\\s*old\\.${col}`),
        );
      });
    }
  });

  // Locked #7 — service_role / SQL-Editor unaffected (admin path).
  it("exempts every non-authenticated caller before any freeze runs", () => {
    const sql = readMigrationSql();
    // The guard short-circuits with `return new` for any role claim that
    // is not exactly 'authenticated' (service_role, NULL/postgres),
    // and it must appear before the first revert assignment.
    const guard =
      /if current_setting\('request\.jwt\.claim\.role',\s*true\)\s+is distinct from 'authenticated' then\s+return new;\s+end if;/;
    expect(sql).toMatch(guard);
    const guardIdx = sql.search(guard);
    const firstRevertIdx = sql.search(/new\.\w+\s*:=\s*old\.\w+/);
    expect(guardIdx).toBeGreaterThanOrEqual(0);
    expect(firstRevertIdx).toBeGreaterThan(guardIdx);
  });

  // Locked #7 — reverts, never rejects: a legitimate UPDATE that echoes
  // an unchanged sensitive value must succeed with no error.
  it("reverts rather than rejects (no RAISE in executable SQL)", () => {
    const sql = readMigrationSql();
    expect(sql).not.toMatch(/\braise\b/);
    expect(sql).toMatch(/return new;/);
  });
});
