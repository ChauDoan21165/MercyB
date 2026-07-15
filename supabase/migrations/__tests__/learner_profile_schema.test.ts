import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const sql = readFileSync(
  resolve(process.cwd(), "supabase/migrations/20260723000000_learner_profile_state.sql"),
  "utf8",
).toLowerCase();

describe("learner profile state migration", () => {
  it("creates the durable skill and error-pattern tables", () => {
    expect(sql).toContain("create type public.learner_skill as enum");
    expect(sql).toContain("create table if not exists public.learner_skill_state");
    expect(sql).toContain("create table if not exists public.learner_error_patterns");
    expect(sql).toContain("skill public.learner_skill not null");
    expect(sql).toContain("primary key (user_id, skill)");
    expect(sql).toContain("primary key (user_id, pattern_code, l1)");
  });

  it("keeps pattern codes pinned to the existing tutor taxonomy", () => {
    for (const code of [
      "missing-article",
      "tense-omission",
      "subj-verb-agreement",
      "preposition-calque",
      "word-order",
      "zero-copula",
      "double-negation",
      "word_choice",
      "sentence_structure",
      "pronunciation",
      "politeness_register",
    ]) {
      expect(sql).toContain(`'${code}'`);
    }
  });

  it("contains no raw learner text columns", () => {
    expect(sql).not.toMatch(/\b(raw_text|learner_text|input_text|corrected_text|transcript|message_text)\b/);
    expect(sql).toContain("example_unit_ids uuid[]");
  });

  it("allows authenticated users to select own rows but reserves writes for service role", () => {
    expect(sql).toContain("alter table public.learner_skill_state enable row level security");
    expect(sql).toContain("alter table public.learner_error_patterns enable row level security");
    expect(sql).toContain("grant select on table public.learner_skill_state to authenticated");
    expect(sql).toContain("grant select on table public.learner_error_patterns to authenticated");
    expect(sql).toContain("grant all privileges on table public.learner_skill_state to service_role");
    expect(sql).toContain("grant all privileges on table public.learner_error_patterns to service_role");
    expect(sql).not.toMatch(/grant\s+(insert|update|delete|all)[^;]+authenticated/i);
    expect(sql).not.toMatch(/grant\s+(select|insert|update|delete|all)[^;]+anon/i);
  });

  it("keeps Chau admin analytics select policy explicit", () => {
    expect(sql).toContain("learner_skill_state_admin_select");
    expect(sql).toContain("learner_error_patterns_admin_select");
    expect(sql).toContain("public.get_admin_level(auth.uid()) >= 9");
  });
});
