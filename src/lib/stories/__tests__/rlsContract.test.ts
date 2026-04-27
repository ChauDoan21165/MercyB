// RLS contract test — guards the policy *shape* by parsing the
// migration SQL. We don't have a live Postgres in unit tests, so a
// real RLS round-trip would be a Playwright integration concern. The
// next-best protection is asserting that the policies named in the
// task spec exist in the migration file. If someone later weakens or
// deletes them, this test fails and the PR review catches it.
//
// Each test maps to one of the spec's mandatory test cases:
//   9.  anon can SELECT only published rows
//   10. owner can SELECT own pending rows
//   11. non-owner cannot SELECT another user's pending rows
//
// Tests #10 and #11 are the same single policy from two angles —
// `owner_select` says `auth.uid() = user_id`, which is sufficient for
// owner-yes and non-owner-no. The test asserts the right predicate.

import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const migrationPath = path.resolve(
  process.cwd(),
  "supabase/migrations/20260426000000_user_stories.sql",
);

function readMigration(): string {
  return fs.readFileSync(migrationPath, "utf8");
}

describe("user_stories RLS migration", () => {
  it("creates a public_select_published policy that gates on status = 'published'", () => {
    const sql = readMigration();
    expect(sql).toMatch(/create policy "public_select_published"/i);
    // The policy's USING clause must reference `status = 'published'`.
    // This pattern is permissive about whitespace/quotes around the
    // word published.
    const block = sql.match(
      /create policy "public_select_published"[\s\S]*?(?=create policy|grant|$)/i,
    )?.[0] ?? "";
    expect(block).toMatch(/using\s*\(\s*status\s*=\s*'published'\s*\)/i);
  });

  it("creates an owner_select policy keyed on auth.uid() = user_id", () => {
    const sql = readMigration();
    expect(sql).toMatch(/create policy "owner_select"/i);
    const block = sql.match(
      /create policy "owner_select"[\s\S]*?(?=create policy|grant|$)/i,
    )?.[0] ?? "";
    expect(block).toMatch(/auth\.uid\(\)\s*=\s*user_id/);
  });

  it("does NOT add a non-owner read policy that would leak pending rows", () => {
    // The only SELECT policies allowed are: owner_select,
    // public_select_published, admin_select. Asserting the negative
    // here because adding e.g. `for select using (true)` would silently
    // expose pending rows.
    const sql = readMigration();
    const selectPolicies = sql.match(/create policy "[^"]+"\s+on public\.user_stories\s+for select/gi) ?? [];
    expect(selectPolicies.length).toBe(3);
    expect(sql.toLowerCase()).not.toMatch(/for select\s+using\s*\(\s*true\s*\)/);
  });

  it("only authenticated users can INSERT, and only for their own pending rows", () => {
    const sql = readMigration();
    expect(sql).toMatch(/create policy "owner_insert"/i);
    const block = sql.match(
      /create policy "owner_insert"[\s\S]*?(?=create policy|grant|$)/i,
    )?.[0] ?? "";
    expect(block).toMatch(/auth\.uid\(\)\s*=\s*user_id/);
    expect(block).toMatch(/status\s*=\s*'pending'/);
  });

  it("admin_update is gated on get_admin_level() >= 9", () => {
    const sql = readMigration();
    expect(sql).toMatch(/create policy "admin_update"/i);
    const block = sql.match(
      /create policy "admin_update"[\s\S]*?(?=create policy|grant|$)/i,
    )?.[0] ?? "";
    expect(block).toMatch(/get_admin_level\(\)\s*>=\s*9/);
  });
});
