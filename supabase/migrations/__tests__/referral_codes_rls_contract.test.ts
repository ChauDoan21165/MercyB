import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const MIGRATION_DIR = resolve(process.cwd(), "supabase/migrations");
const TIGHTEN_MIGRATION = "20260712000000_referral_codes_owner_select.sql";

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

function finalReferralCodeSelectPolicies(sql: string) {
  const policies = new Map<string, string>();
  const statementPattern =
    /\b(drop|create)\s+policy\s+(?:if\s+exists\s+)?(?:"([^"]+)"|([a-z_][a-z0-9_]*))\s+[^;]*?\bon\s+public\.referral_codes\b[^;]*;/gi;

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

describe("referral_codes RLS contract", () => {
  it("replaces the authenticated read-all policy with owner-scoped SELECT", () => {
    expect(tightenSql).toContain(
      "drop policy if exists referral_codes_select_all on public.referral_codes",
    );
    expect(tightenSql).toContain(
      normalizeSql(`
        create policy referral_codes_select_own
          on public.referral_codes
          as permissive
          for select
          to authenticated
          using (auth.uid() = owner_user_id)
      `),
    );
  });

  it("leaves only an owner-scoped SELECT policy on referral_codes in a reset", () => {
    const policies = finalReferralCodeSelectPolicies(chainSql);

    expect([...policies.keys()]).toEqual(["referral_codes_select_own"]);

    const policy = policies.get("referral_codes_select_own") ?? "";
    expect(policy).toContain(" for select ");
    expect(policy).toContain(" to authenticated ");
    expect(policy).toContain("using (auth.uid() = owner_user_id)");

    for (const policySql of policies.values()) {
      expect(policySql).not.toContain("using (true)");
      expect(policySql).not.toContain(" to public ");
      expect(policySql).not.toContain(" to anon ");
    }
  });
});
