// RLS contract test — guards the policy *shape* by parsing the
// migration SQL. We don't have a live Postgres in unit tests, so a real
// RLS round-trip is a Playwright/manual-DB concern (see
// RECON-admin-rls-fix.md §6). The next-best protection is asserting that
// the access_codes admin policies are pinned to the canonical admin
// model (get_admin_level → admin_users) and never regress to the broken
// one (has_role → user_roles). If someone re-introduces has_role here or
// drops the user redemption-visibility policy, this test fails and the
// PR review catches it.
//
// Background: 20260509000000_fix_access_codes_insert_policy.sql wired the
// four admin policies to has_role(auth.uid(),'admin') (→ user_roles),
// but the product's real admin model is admin_users via
// get_admin_level(). Normally-provisioned admins are absent from
// user_roles, so the frontend INSERT (AdminAccessCodes.tsx:172) was
// RLS-denied. 20260613000000 re-points all four to
// get_admin_level(auth.uid()) >= 7 (payment-grade — access codes grant a
// paid tier). Full trace: RECON-admin-rls-fix.md.

import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const migrationPath = path.resolve(
  process.cwd(),
  "supabase/migrations/20260613000000_fix_access_codes_admin_model.sql",
);

function readMigration(): string {
  return fs.readFileSync(migrationPath, "utf8");
}

// Executable SQL only — strips `--` line comments. The migration's
// header comment intentionally documents the broken model it fixes and
// the user policy it preserves, so negative assertions must run against
// the statements, not the prose.
function readMigrationSql(): string {
  return readMigration()
    .split("\n")
    .map((line) => line.replace(/--.*$/, ""))
    .join("\n");
}

// The canonical admin-write predicate. payment-transactions-rls-fix
// mirrors this verbatim — keep it stable.
const CANONICAL_PREDICATE = /public\.get_admin_level\(auth\.uid\(\)\)\s*>=\s*7/;

const ADMIN_POLICIES = [
  { name: "Admins can select access codes", op: "select" },
  { name: "Admins can insert access codes", op: "insert" },
  { name: "Admins can update access codes", op: "update" },
  { name: "Admins can delete access codes", op: "delete" },
] as const;

function policyBlock(sql: string, name: string): string {
  return (
    sql.match(
      new RegExp(
        `create policy "${name}"[\\s\\S]*?(?=create policy|drop policy|$)`,
        "i",
      ),
    )?.[0] ?? ""
  );
}

describe("access_codes admin RLS migration (20260613000000)", () => {
  it("drops all four old admin policies before recreating them (no lockout window)", () => {
    const sql = readMigration();
    for (const { name } of ADMIN_POLICIES) {
      expect(sql).toMatch(
        new RegExp(
          `drop policy if exists "${name}" on public\\.access_codes`,
          "i",
        ),
      );
    }
  });

  it("recreates all four admin policies on the canonical model (get_admin_level >= 7)", () => {
    const sql = readMigration();
    for (const { name, op } of ADMIN_POLICIES) {
      expect(sql).toMatch(new RegExp(`create policy "${name}"`, "i"));
      const block = policyBlock(sql, name);
      expect(block.toLowerCase()).toContain(`for ${op}`);
      expect(block).toMatch(CANONICAL_PREDICATE);
    }
  });

  it("INSERT policy gates WITH CHECK on get_admin_level >= 7 (the documented-bug path)", () => {
    const block = policyBlock(readMigration(), "Admins can insert access codes");
    expect(block).toMatch(
      /with check\s*\(\s*public\.get_admin_level\(auth\.uid\(\)\)\s*>=\s*7\s*\)/i,
    );
  });

  it("never references the broken admin model (has_role / user_roles) in executable SQL", () => {
    const sql = readMigrationSql().toLowerCase();
    expect(sql).not.toContain("has_role");
    expect(sql).not.toContain("user_roles");
  });

  it("does NOT touch the unrelated user redemption-visibility policy", () => {
    // "Users can view their assigned codes or public codes"
    // (20251130002025) must stay intact — this migration only owns the
    // four admin policies. Asserted against statements (the header
    // comment names the policy to document the preservation intent).
    const sql = readMigrationSql();
    expect(sql).not.toMatch(/users can view their assigned codes/i);
  });

  it("uses authenticated-role policies (service_role still bypasses RLS)", () => {
    const sql = readMigration();
    for (const { name } of ADMIN_POLICIES) {
      expect(policyBlock(sql, name).toLowerCase()).toContain("to authenticated");
    }
  });
});
