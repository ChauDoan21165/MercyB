import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";

const MIGRATION_DIR = resolve(process.cwd(), "supabase/migrations");
const MIGRATION = "20260708000000_room_entries_live_select_policies.sql";

const migrationSql = readFileSync(resolve(MIGRATION_DIR, MIGRATION), "utf8");
const allMigrationSql = readdirSync(MIGRATION_DIR)
  .filter((file) => file.endsWith(".sql"))
  .sort()
  .map((file) => readFileSync(resolve(MIGRATION_DIR, file), "utf8"))
  .join("\n");

function normalizeSql(sql: string) {
  return sql.toLowerCase().replace(/\s+/g, " ").trim();
}

const normalized = normalizeSql(migrationSql);
const normalizedChain = normalizeSql(allMigrationSql);

function finalRoomEntriesSelectPolicies(sql: string) {
  const policies = new Map<string, string>();
  const statementPattern =
    /\b(drop|create)\s+policy\s+(?:if\s+exists\s+)?(?:"([^"]+)"|([a-z_][a-z0-9_]*))\s+[^;]*?\bon\s+public\.room_entries\b[^;]*;/gi;

  for (const match of sql.matchAll(statementPattern)) {
    const statement = normalizeSql(match[0]);
    const action = match[1].toLowerCase();
    const name = match[2] ?? match[3];

    if (action === "drop") {
      policies.delete(name);
      continue;
    }

    if (statement.includes(" for select ")) {
      policies.set(name, statement);
    }
  }

  return policies;
}

describe("room_entries live SELECT policy contract", () => {
  it("is transactional and recreates policies idempotently without CREATE POLICY IF NOT EXISTS", () => {
    expect(normalized.startsWith("begin;")).toBe(true);
    expect(normalized.endsWith("commit;")).toBe(true);
    expect(normalized).not.toContain("create policy if not exists");

    for (const policy of [
      "room_entries_public_select",
      "room_entries_public_free_select",
      "room_entries_select_gated",
    ]) {
      expect(normalized).toContain(`drop policy if exists ${policy} on public.room_entries`);
    }
  });

  it("recreates the public free-room SELECT policy with the expected command, role, and qual", () => {
    expect(normalized).toContain(
      normalizeSql(`
        create policy room_entries_public_free_select
          on public.room_entries
          as permissive
          for select
          to public
          using (
            exists (
              select 1
              from rooms r
              where r.id = room_entries.room_id
                and coalesce(r.required_vip_rank, 0) = 0
            )
          )
      `),
    );
  });

  it("recreates the authenticated gated SELECT policy with the expected command, role, and qual", () => {
    expect(normalized).toContain(
      normalizeSql(`
        create policy room_entries_select_gated
          on public.room_entries
          as permissive
          for select
          to authenticated
          using (
            exists (
              select 1
              from rooms r
              where r.id = room_entries.room_id
                and (
                  coalesce(r.required_vip_rank, 0) = 0
                  or user_vip_rank(auth.uid()) >= coalesce(r.required_vip_rank, 0)
                )
            )
          )
      `),
    );
  });

  it("does not recreate the more-permissive USING true policy", () => {
    expect(normalized).not.toMatch(/create policy room_entries_public_select\b/);
    expect(normalized).not.toContain("using (true)");
  });

  it("drops the stale USING true policy from the committed migration chain", () => {
    expect(normalized).toContain(
      "drop policy if exists room_entries_public_select on public.room_entries",
    );

    const policies = finalRoomEntriesSelectPolicies(normalizedChain);

    expect([...policies.keys()].sort()).toEqual([
      "room_entries_public_free_select",
      "room_entries_select_gated",
    ]);

    for (const policySql of policies.values()) {
      expect(policySql).not.toContain("using (true)");
    }
  });
});
