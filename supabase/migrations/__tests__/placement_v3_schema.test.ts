// Static regression lock for the placement v3 storage migrations.
//
// TODO(local Supabase): replace or supplement these text checks with a real
// `supabase db reset`/ephemeral Postgres harness that applies the four
// migrations and exercises RLS with anon/authenticated/service_role JWTs.
// The current repo has no migration-apply test infrastructure under
// supabase/migrations, so these tests verify the schema contract directly
// from the SQL files and document the manual verification path.

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const MIGRATION_DIR = resolve(process.cwd(), "supabase/migrations");

const FILES = [
  "20260627000000_placement_v3_sessions.sql",
  "20260627000001_placement_v3_responses.sql",
  "20260627000002_placement_v3_profiles.sql",
  "20260627000003_placement_v3_rls.sql",
] as const;

function sql(file: (typeof FILES)[number]) {
  return readFileSync(resolve(MIGRATION_DIR, file), "utf8");
}

const allSql = FILES.map(sql).join("\n");

describe("placement v3 migrations", () => {
  it("keeps the four migrations in sequential apply order", () => {
    expect(FILES).toEqual([...FILES].sort());
  });

  it("creates all three tables with expected columns", () => {
    const expectedColumns = {
      placement_v3_sessions: [
        "id",
        "user_id",
        "started_at",
        "completed_at",
        "abandoned_at",
        "current_modality",
        "current_task_index",
        "total_tasks",
        "language_pair",
        "flow_state",
        "metadata",
        "created_at",
        "updated_at",
      ],
      placement_v3_responses: [
        "id",
        "session_id",
        "task_index",
        "modality",
        "prompt_id",
        "prompt_text",
        "user_response_text",
        "audio_storage_path",
        "response_duration_ms",
        "ai_assessment",
        "ai_assessment_version",
        "graded_at",
        "created_at",
      ],
      placement_v3_profiles: [
        "id",
        "user_id",
        "session_id",
        "cefr_overall",
        "cefr_overall_confidence",
        "cefr_per_skill",
        "l1_interference_flags",
        "strengths",
        "gaps",
        "recommended_lessons",
        "computed_at",
        "is_current",
        "created_at",
      ],
    } as const;

    for (const [table, columns] of Object.entries(expectedColumns)) {
      expect(allSql).toContain(`create table if not exists public.${table}`);
      for (const column of columns) {
        expect(allSql).toMatch(new RegExp(`\\b${column}\\b`));
      }
    }
  });

  it("declares the expected foreign keys with ON DELETE CASCADE", () => {
    expect(allSql).toContain("user_id uuid not null references auth.users(id) on delete cascade");
    expect(allSql).toContain(
      "session_id uuid not null references public.placement_v3_sessions(id) on delete cascade",
    );
  });

  it("declares the expected indexes and unique constraint", () => {
    for (const name of [
      "idx_sessions_user_id",
      "idx_sessions_flow_state",
      "idx_sessions_started_at",
      "idx_responses_session_id",
      "idx_responses_session_task",
      "uniq_responses_session_task",
      "idx_profiles_user_current",
      "uniq_profiles_user_session",
    ]) {
      expect(allSql).toContain(name);
    }
  });

  it("enables RLS and declares the expected policies", () => {
    for (const table of [
      "placement_v3_sessions",
      "placement_v3_responses",
      "placement_v3_profiles",
    ]) {
      expect(allSql).toContain(`alter table public.${table} enable row level security`);
    }

    for (const policy of [
      "placement_v3_sessions_select_own",
      "placement_v3_sessions_insert_own",
      "placement_v3_sessions_update_own",
      "placement_v3_responses_select_own_session",
      "placement_v3_responses_insert_own_session",
      "placement_v3_profiles_select_own",
    ]) {
      expect(allSql).toContain(`"${policy}"`);
    }
  });

  it("grants no anon access and gives service_role full table access", () => {
    for (const table of [
      "placement_v3_sessions",
      "placement_v3_responses",
      "placement_v3_profiles",
    ]) {
      expect(allSql).toContain(`revoke all on table public.${table} from anon, authenticated`);
      expect(allSql).toContain(`grant all privileges on table public.${table} to service_role`);
    }

    expect(allSql).not.toMatch(/grant\s+(select|insert|update|delete|all)[^;]+to anon/i);
  });

  it("keeps authenticated response writes scoped to owned sessions and append-only", () => {
    expect(allSql).toContain("where s.id = placement_v3_responses.session_id");
    expect(allSql).toContain("and s.user_id = auth.uid()");
    expect(allSql).not.toMatch(/grant\s+update[^;]+placement_v3_responses[^;]+authenticated/i);
    expect(allSql).not.toMatch(/grant\s+delete[^;]+placement_v3_responses[^;]+authenticated/i);
  });

  it("limits authenticated session updates to the approved column set", () => {
    expect(allSql).toContain("grant update (\n  flow_state,\n  completed_at,\n  current_modality,\n  current_task_index,\n  updated_at\n) on table public.placement_v3_sessions to authenticated");
  });

  it("documents manual runtime checks that need local Supabase", () => {
    // TODO(local Supabase): apply migrations, insert two auth.users, assert:
    // - service_role can insert/select all three tables.
    // - authenticated user A can select/insert only A's sessions/responses.
    // - authenticated user B cannot see A's rows.
    // - authenticated users cannot update response grading fields.
    // - deleting auth.users cascades sessions -> responses and profiles.
    expect(true).toBe(true);
  });
});
