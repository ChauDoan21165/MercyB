// RLS contract test — guards the policy *shape* by parsing the
// migration SQL. We don't have a live Postgres in unit tests, so a
// real RLS round-trip would be a Playwright integration concern.
// Asserting that the named policies exist + carry the correct
// predicates is the next-best protection.
//
// Migration path is resolved relative to this file via
// `import.meta.url` (per task spec — never process.cwd()) so the test
// is portable across any working directory.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const here = path.dirname(fileURLToPath(import.meta.url));
const migrationPath = path.resolve(
  here,
  "..",
  "..",
  "..",
  "..",
  "supabase",
  "migrations",
  "20260427000003_user_interview_prompts.sql",
);

function readMigration(): string {
  return fs.readFileSync(migrationPath, "utf8");
}

function policyBlock(sql: string, policyName: string): string {
  // Match `create policy "<name>"` followed by everything up to the
  // next create policy / grant / end of file.
  const re = new RegExp(
    `create policy "${policyName}"[\\s\\S]*?(?=create policy|grant|alter table|$)`,
    "i",
  );
  return sql.match(re)?.[0] ?? "";
}

describe("user_interview_prompts RLS migration", () => {
  it("public_select_published gates SELECT on status = 'published' (anon read contract)", () => {
    const sql = readMigration();
    expect(sql).toMatch(/create policy "public_select_published"/i);
    const block = policyBlock(sql, "public_select_published");
    expect(block).toMatch(/using\s*\(\s*status\s*=\s*'published'\s*\)/i);
  });

  it("submitter_select_own keys on auth.uid() = submitter_user_id (own-rows-any-status contract)", () => {
    const sql = readMigration();
    expect(sql).toMatch(/create policy "submitter_select_own"/i);
    const block = policyBlock(sql, "submitter_select_own");
    expect(block).toMatch(/auth\.uid\(\)\s*=\s*submitter_user_id/i);
  });

  it("submitter_insert_pending forces status='pending' on insert (admin-only state changes)", () => {
    const sql = readMigration();
    expect(sql).toMatch(/create policy "submitter_insert_pending"/i);
    const block = policyBlock(sql, "submitter_insert_pending");
    expect(block).toMatch(/auth\.uid\(\)\s*=\s*submitter_user_id/i);
    expect(block).toMatch(/status\s*=\s*'pending'/i);
  });

  it("admin_all is gated on get_admin_level() >= 9 (only admin updates status)", () => {
    const sql = readMigration();
    expect(sql).toMatch(/create policy "admin_all"/i);
    const block = policyBlock(sql, "admin_all");
    expect(block).toMatch(/get_admin_level\(\)\s*>=\s*9/);
  });

  it("does not add any unrestricted SELECT (would leak pending rows)", () => {
    const sql = readMigration();
    const promptSelectPolicies =
      sql.match(
        /create policy "[^"]+"\s+on public\.user_interview_prompts\s+for select/gi,
      ) ?? [];
    // Allowed: public_select_published, submitter_select_own.
    // admin_all is `for all` so it does not match this regex.
    expect(promptSelectPolicies.length).toBe(2);
  });

  it("votes_insert_own scopes inserts to the calling user", () => {
    const sql = readMigration();
    expect(sql).toMatch(/create policy "votes_insert_own"/i);
    const block = policyBlock(sql, "votes_insert_own");
    expect(block).toMatch(/auth\.uid\(\)\s*=\s*user_id/i);
  });

  it("includes a self-upvote-blocking trigger function", () => {
    const sql = readMigration();
    expect(sql).toMatch(/user_interview_prompt_votes_block_self_upvote/);
    expect(sql).toMatch(/cannot upvote your own prompt/i);
  });
});
