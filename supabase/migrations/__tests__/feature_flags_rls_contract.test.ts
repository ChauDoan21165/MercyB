import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const MIGRATION_DIR = resolve(process.cwd(), "supabase/migrations");
const TIGHTEN_MIGRATION = "20260714000000_feature_flags_admin_select_only.sql";

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

function finalFeatureFlagSelectPolicies(sql: string) {
  const policies = new Map<string, string>();
  const statementPattern =
    /\b(drop|create)\s+policy\s+(?:if\s+exists\s+)?(?:"([^"]+)"|([a-z_][a-z0-9_ ]*))\s+[^;]*?\bon\s+(?:public\.)?feature_flags\b[^;]*;/gi;

  for (const match of sql.matchAll(statementPattern)) {
    const statement = normalizeSql(match[0]);
    const action = match[1].toLowerCase();
    const name = normalizeSql(match[2] ?? match[3]);

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

describe("feature_flags RLS contract", () => {
  it("drops broad base-table SELECT policies and creates admin-only SELECT", () => {
    for (const policyName of [
      "Anyone can read feature flags",
      "Anyone can view feature flags",
      "feature_flags_read_authenticated",
      "feature_flags_read_anon",
    ]) {
      expect(tightenSql).toContain(
        normalizeSql(`drop policy if exists "${policyName}" on public.feature_flags`),
      );
    }

    expect(tightenSql).toContain("revoke select on public.feature_flags from anon");
    expect(tightenSql).toContain(
      normalizeSql(`
        create policy "feature_flags_admin_select"
          on public.feature_flags
          as permissive
          for select
          to authenticated
          using (public.get_admin_level(auth.uid()) >= 9)
      `),
    );
    expect(tightenSql).toContain(
      "grant select on public.feature_flags_public to anon",
    );
    expect(tightenSql).toContain(
      "grant select on public.feature_flags_public to authenticated",
    );
  });

  it("leaves no USING true base-table SELECT policy on feature_flags in a reset", () => {
    const policies = finalFeatureFlagSelectPolicies(chainSql);

    expect([...policies.keys()]).toEqual(["feature_flags_admin_select"]);

    const policy = policies.get("feature_flags_admin_select") ?? "";
    expect(policy).toContain(" for select ");
    expect(policy).toContain(" to authenticated ");
    expect(policy).toContain("using (public.get_admin_level(auth.uid()) >= 9)");

    for (const policySql of policies.values()) {
      expect(policySql).not.toContain("using (true)");
      expect(policySql).not.toContain(" to public ");
      expect(policySql).not.toContain(" to anon ");
    }
  });
});
