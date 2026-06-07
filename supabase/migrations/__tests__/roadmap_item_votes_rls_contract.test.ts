import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const MIGRATION_DIR = resolve(process.cwd(), "supabase/migrations");
const VOICE_OF_CUSTOMER_MIGRATION = "20260505010000_voice_of_customer.sql";
const TIGHTEN_MIGRATION = "20260713000000_roadmap_item_votes_owner_select.sql";

function normalizeSql(sql: string) {
  return sql.toLowerCase().replace(/\s+/g, " ").trim();
}

function migrationSql(file: string) {
  return readFileSync(resolve(MIGRATION_DIR, file), "utf8");
}

const voiceOfCustomerSql = normalizeSql(migrationSql(VOICE_OF_CUSTOMER_MIGRATION));
const tightenSql = normalizeSql(migrationSql(TIGHTEN_MIGRATION));
const chainSql = normalizeSql(
  readdirSync(MIGRATION_DIR)
    .filter((file) => file.endsWith(".sql"))
    .sort()
    .map(migrationSql)
    .join("\n"),
);

function finalRoadmapVoteSelectPolicies(sql: string) {
  const policies = new Map<string, string>();
  const statementPattern =
    /\b(drop|create)\s+policy\s+(?:if\s+exists\s+)?(?:"([^"]+)"|([a-z_][a-z0-9_]*))\s+[^;]*?\bon\s+public\.roadmap_item_votes\b[^;]*;/gi;

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

function functionBlock(sql: string, signature: string) {
  const marker = normalizeSql(`create or replace function ${signature}`);
  const start = sql.indexOf(marker);
  if (start === -1) return "";

  const afterStart = sql.slice(start);
  const end = afterStart.indexOf("$$;");
  return end === -1 ? afterStart : afterStart.slice(0, end + 3);
}

describe("roadmap_item_votes RLS contract", () => {
  it("replaces the authenticated read-all policy with owner-scoped SELECT", () => {
    expect(tightenSql).toContain(
      "drop policy if exists roadmap_item_votes_select_all on public.roadmap_item_votes",
    );
    expect(tightenSql).toContain("revoke select on public.roadmap_item_votes from anon");
    expect(tightenSql).toContain(
      normalizeSql(`
        create policy roadmap_item_votes_select_own
          on public.roadmap_item_votes
          as permissive
          for select
          to authenticated
          using (auth.uid() = user_id)
      `),
    );
  });

  it("leaves only an owner-scoped SELECT policy on roadmap_item_votes in a reset", () => {
    const policies = finalRoadmapVoteSelectPolicies(chainSql);

    expect([...policies.keys()]).toEqual(["roadmap_item_votes_select_own"]);

    const policy = policies.get("roadmap_item_votes_select_own") ?? "";
    expect(policy).toContain(" for select ");
    expect(policy).toContain(" to authenticated ");
    expect(policy).toContain("using (auth.uid() = user_id)");

    for (const policySql of policies.values()) {
      expect(policySql).not.toContain("using (true)");
      expect(policySql).not.toContain(" to public ");
      expect(policySql).not.toContain(" to anon ");
    }
  });

  it("keeps roadmap vote count maintenance SECURITY DEFINER with pinned search_path", () => {
    const block = functionBlock(
      voiceOfCustomerSql,
      "public.refresh_roadmap_vote_count()",
    );

    expect(block).toContain("security definer");
    expect(block).toContain("set search_path = public");
    expect(block).toContain("update public.roadmap_items");
  });
});
