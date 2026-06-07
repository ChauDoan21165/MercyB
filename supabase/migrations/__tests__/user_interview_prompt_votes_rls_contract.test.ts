import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const MIGRATION_DIR = resolve(process.cwd(), "supabase/migrations");
const TIGHTEN_MIGRATION =
  "20260711000000_user_interview_prompt_votes_tighten_select.sql";

function normalizeSql(sql: string) {
  return sql.toLowerCase().replace(/\s+/g, " ").trim();
}

function migrationSql(file: string) {
  return readFileSync(resolve(MIGRATION_DIR, file), "utf8");
}

const tightenSql = normalizeSql(migrationSql(TIGHTEN_MIGRATION));
const chainSql = normalizeSql(
  readdirSync(MIGRATION_DIR)
    .filter((file) => file.endsWith(".sql"))
    .sort()
    .map(migrationSql)
    .join("\n"),
);

function finalVoteSelectPolicies(sql: string) {
  const policies = new Map<string, string>();
  const statementPattern =
    /\b(drop|create)\s+policy\s+(?:if\s+exists\s+)?(?:"([^"]+)"|([a-z_][a-z0-9_]*))\s+[^;]*?\bon\s+public\.user_interview_prompt_votes\b[^;]*;/gi;

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

function finalVoteSelectGrants(sql: string) {
  const grants = new Set<string>();
  const statementPattern =
    /\b(grant|revoke)\s+[^;]*?\bselect\b[^;]*?\bon\s+(?:table\s+)?public\.user_interview_prompt_votes\s+(?:to|from)\s+([^;]+);/gi;

  for (const match of sql.matchAll(statementPattern)) {
    const action = match[1].toLowerCase();
    const roles = match[2]
      .split(",")
      .map((role) => normalizeSql(role.replace(/;$/, "")))
      .filter(Boolean);

    for (const role of roles) {
      if (action === "grant") grants.add(role);
      else grants.delete(role);
    }
  }

  return grants;
}

function functionBlock(sql: string, functionName: string) {
  const re = new RegExp(
    `create or replace function public\\.${functionName}\\([\\s\\S]*?\\$\\$;`,
    "i",
  );
  return normalizeSql(sql.match(re)?.[0] ?? "");
}

describe("user_interview_prompt_votes RLS contract", () => {
  it("keeps the vote recount trigger function SECURITY DEFINER with a pinned search_path", () => {
    const block = functionBlock(
      migrationSql(TIGHTEN_MIGRATION),
      "user_interview_prompt_votes_recount",
    );

    expect(block).toContain("security definer");
    expect(block).toContain("set search_path = public");
    expect(block).toContain("from public.user_interview_prompt_votes");
    expect(block).toContain("where prompt_id = v_prompt");
    expect(block).toContain("update public.user_interview_prompts");
    expect(block).not.toContain("execute ");
  });

  it("tightens raw vote ledger reads to authenticated owner rows", () => {
    expect(tightenSql).toContain(
      'drop policy if exists "votes_select_all" on public.user_interview_prompt_votes',
    );
    expect(tightenSql).toContain("revoke select on public.user_interview_prompt_votes from anon");
    expect(tightenSql).toContain(
      normalizeSql(`
        create policy "votes_select_own"
          on public.user_interview_prompt_votes
          as permissive
          for select
          to authenticated
          using (auth.uid() = user_id)
      `),
    );
  });

  it("leaves no public or anon USING true SELECT policy on user_interview_prompt_votes in a reset", () => {
    const policies = finalVoteSelectPolicies(chainSql);
    const grants = finalVoteSelectGrants(chainSql);

    expect([...policies.keys()]).toEqual(["votes_select_own"]);
    expect(grants.has("anon")).toBe(false);
    expect(grants.has("authenticated")).toBe(true);

    const ownerPolicy = policies.get("votes_select_own") ?? "";
    expect(ownerPolicy).toContain(" to authenticated ");
    expect(ownerPolicy).toContain("using (auth.uid() = user_id)");

    for (const policySql of policies.values()) {
      expect(policySql).not.toContain("using (true)");
      expect(policySql).not.toContain(" to public ");
      expect(policySql).not.toContain(" to anon ");
    }
  });
});
