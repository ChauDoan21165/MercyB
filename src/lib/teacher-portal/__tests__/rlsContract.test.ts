// RLS contract test for the teacher review portal migrations.
//
// We don't have a live Postgres in unit tests, so this is a textual
// guard over the migration SQL. The migration path is resolved relative
// to this test file via import.meta.url so the test is independent of
// the vitest cwd.
//
// Each test maps to one of the spec's required RLS contracts.

import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import { describe, expect, it } from "vitest";

const here = path.dirname(url.fileURLToPath(import.meta.url));
const migrationFeedbackPath = path.resolve(
  here,
  "../../../../supabase/migrations/20260533000000_teacher_feedback.sql",
);
const migrationRolePath = path.resolve(
  here,
  "../../../../supabase/migrations/20260532000000_teacher_review_role.sql",
);

function readMigration(p: string): string {
  return fs.readFileSync(p, "utf8");
}

describe("teacher_review_role migration", () => {
  it("creates an is_teacher_reviewer() helper at level >= 5", () => {
    const sql = readMigration(migrationRolePath);
    expect(sql).toMatch(/CREATE OR REPLACE FUNCTION public\.is_teacher_reviewer\(\)/);
    expect(sql).toMatch(/>=\s*5/);
  });

  it("uses a placeholder email and explicitly flags it for review", () => {
    const sql = readMigration(migrationRolePath);
    expect(sql).toMatch(/teacher\.review@mercyblade\.com/);
    expect(sql.toUpperCase()).toContain("PLACEHOLDER");
  });
});

describe("teacher_feedback RLS migration", () => {
  it("creates teacher_select_review_queue gating on get_admin_level() >= 5 and queue states", () => {
    const sql = readMigration(migrationFeedbackPath);
    expect(sql).toMatch(/create policy "teacher_select_review_queue"/i);
    const block =
      sql.match(
        /create policy "teacher_select_review_queue"[\s\S]*?(?=create policy|grant|alter|$)/i,
      )?.[0] ?? "";
    expect(block).toMatch(/get_admin_level\(\)\s*>=\s*5/);
    expect(block).toMatch(/'in_review'/);
    expect(block).toMatch(/'needs_revision'/);
  });

  it("creates teacher_insert_feedback so reviewer_id must equal auth.uid()", () => {
    const sql = readMigration(migrationFeedbackPath);
    expect(sql).toMatch(/create policy "teacher_insert_feedback"/i);
    const block =
      sql.match(
        /create policy "teacher_insert_feedback"[\s\S]*?(?=create policy|grant|alter|$)/i,
      )?.[0] ?? "";
    expect(block).toMatch(/get_admin_level\(\)\s*>=\s*5/);
    expect(block).toMatch(/reviewer_id\s*=\s*auth\.uid\(\)/);
  });

  it("creates teacher_select_own_feedback so teachers see only their rows", () => {
    const sql = readMigration(migrationFeedbackPath);
    expect(sql).toMatch(/create policy "teacher_select_own_feedback"/i);
    const block =
      sql.match(
        /create policy "teacher_select_own_feedback"[\s\S]*?(?=create policy|grant|alter|$)/i,
      )?.[0] ?? "";
    expect(block).toMatch(/get_admin_level\(\)\s*>=\s*5/);
    expect(block).toMatch(/reviewer_id\s*=\s*auth\.uid\(\)/);
  });

  it("creates admin_all_review_status and admin_all_feedback gated at level >= 9", () => {
    const sql = readMigration(migrationFeedbackPath);
    expect(sql).toMatch(/create policy "admin_all_review_status"/i);
    expect(sql).toMatch(/create policy "admin_all_feedback"/i);
    const reviewBlock =
      sql.match(
        /create policy "admin_all_review_status"[\s\S]*?(?=create policy|grant|alter|$)/i,
      )?.[0] ?? "";
    const feedbackBlock =
      sql.match(
        /create policy "admin_all_feedback"[\s\S]*?(?=create policy|grant|alter|$)/i,
      )?.[0] ?? "";
    expect(reviewBlock).toMatch(/get_admin_level\(\)\s*>=\s*9/);
    expect(feedbackBlock).toMatch(/get_admin_level\(\)\s*>=\s*9/);
  });

  it("does NOT grant any non-admin role read access — RLS denies by default", () => {
    // The only SELECT policies allowed on teacher_feedback are:
    //   - teacher_select_own_feedback (level >= 5)
    //   - admin_all_feedback (level >= 9; FOR ALL covers select)
    // No public/anon policy. This test asserts that no policy uses
    // `using (true)` and no policy lacks the admin_level gate.
    const sql = readMigration(migrationFeedbackPath);
    expect(sql.toLowerCase()).not.toMatch(/for select\s+using\s*\(\s*true\s*\)/);
    // No policy should be grantable without an admin_level check.
    const policyBlocks =
      sql.match(/create policy "[^"]+"[\s\S]*?(?=create policy|grant|alter|$)/gi) ?? [];
    for (const b of policyBlocks) {
      // Only policies on our two tables matter; skip otherwise.
      if (!/on public\.(teacher_feedback|content_review_status)/i.test(b)) continue;
      expect(b).toMatch(/get_admin_level\(\)/i);
    }
  });

  it("enables RLS on both new tables", () => {
    const sql = readMigration(migrationFeedbackPath);
    expect(sql).toMatch(/alter table public\.content_review_status enable row level security/i);
    expect(sql).toMatch(/alter table public\.teacher_feedback enable row level security/i);
  });

  it("creates the partial open-status index on teacher_feedback", () => {
    const sql = readMigration(migrationFeedbackPath);
    expect(sql).toMatch(/create index[\s\S]*teacher_feedback_status_idx[\s\S]*where status = 'open'/i);
  });
});
