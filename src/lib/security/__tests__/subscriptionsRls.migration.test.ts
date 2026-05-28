/**
 * A1 — public.subscriptions RLS critical fix.
 *
 * Static migration contract only. The project applies Supabase security DDL
 * manually after review, so CI verifies the reviewed artifact: public.
 * subscriptions only, RLS enabled, self/admin SELECT policies present, and no
 * destructive SQL or sibling billing-table drift.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "../../../../");

const migration = readFileSync(
  resolve(
    repoRoot,
    "supabase/migrations/20260701000000_subscriptions_rls_select_policies.sql",
  ),
  "utf8",
);
const phase2Migration = readFileSync(
  resolve(
    repoRoot,
    "supabase/migrations/20260702000000_subscriptions_drop_legacy_admin_read.sql",
  ),
  "utf8",
);
const migrationSql = migration
  .split("\n")
  .filter((line) => !line.trimStart().startsWith("--"))
  .join("\n");
const phase2Sql = phase2Migration
  .split("\n")
  .filter((line) => !line.trimStart().startsWith("--"))
  .join("\n");

describe("A1 subscriptions RLS migration", () => {
  it("is wrapped in a single transaction", () => {
    expect(migration).toMatch(/^\s*BEGIN;/m);
    expect(migration).toMatch(/COMMIT;\s*$/);
  });

  it("enables RLS on public.subscriptions", () => {
    expect(migration).toContain(
      "ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;",
    );
  });

  it("creates an authenticated self-read policy scoped to auth.uid() = user_id", () => {
    expect(migration).toMatch(
      /CREATE POLICY subscriptions_self_select\s+ON public\.subscriptions\s+FOR SELECT\s+TO authenticated\s+USING \(auth\.uid\(\) = user_id\);/,
    );
  });

  it("creates an authenticated admin-read policy using the canonical admin helper", () => {
    expect(migration).toMatch(
      /CREATE POLICY subscriptions_admin_select\s+ON public\.subscriptions\s+FOR SELECT\s+TO authenticated\s+USING \(public\.get_admin_level\(auth\.uid\(\)\) >= 9\);/,
    );
  });

  it("does not drop, revoke, or mutate raw_payload/data", () => {
    expect(migrationSql).not.toMatch(/\bDROP\b/i);
    expect(migrationSql).not.toMatch(/\bREVOKE\b/i);
    expect(migrationSql).not.toMatch(/\bDELETE\b/i);
    expect(migrationSql).not.toMatch(/\bUPDATE\b/i);
    expect(migrationSql).not.toMatch(/\bINSERT\b/i);
    expect(migrationSql).not.toMatch(/\bALTER\s+TABLE\s+public\.subscriptions\s+(?:ALTER|DROP|ADD)\s+COLUMN\b/i);
    expect(migrationSql).not.toMatch(/\braw_payload\b/i);
  });

  it("does not grant privileges in this MR", () => {
    expect(migrationSql).not.toMatch(/\bGRANT\b/i);
  });

  it("does not touch unrelated tables", () => {
    const tableRefs = [
      ...migration.matchAll(/\b(?:ON|TABLE|FROM|JOIN|INTO|UPDATE)\s+public\.(\w+)/gi),
    ].map((match) => match[1]);

    expect(new Set(tableRefs)).toEqual(new Set(["subscriptions"]));
  });
});

describe("A1 subscriptions RLS Phase 2 legacy policy removal draft", () => {
  it("is wrapped in a single transaction", () => {
    expect(phase2Migration).toMatch(/^\s*BEGIN;/m);
    expect(phase2Migration).toMatch(/COMMIT;\s*$/);
  });

  it("drops only the legacy subscriptions_admin_read policy", () => {
    expect(phase2Sql).toContain(
      "DROP POLICY IF EXISTS subscriptions_admin_read ON public.subscriptions;",
    );

    const droppedPolicies = [
      ...phase2Sql.matchAll(/DROP\s+POLICY\s+IF\s+EXISTS\s+([A-Za-z0-9_"]+)/gi),
    ].map((match) => match[1].replaceAll('"', ""));

    expect(droppedPolicies).toEqual(["subscriptions_admin_read"]);
  });

  it("does not drop the reviewed self/admin policies", () => {
    expect(phase2Sql).not.toMatch(
      /DROP\s+POLICY\s+IF\s+EXISTS\s+subscriptions_self_select\b/i,
    );
    expect(phase2Sql).not.toMatch(
      /DROP\s+POLICY\s+IF\s+EXISTS\s+subscriptions_admin_select\b/i,
    );
  });

  it("does not change grants, data, columns, or sibling billing tables", () => {
    expect(phase2Sql).not.toMatch(/\bGRANT\b/i);
    expect(phase2Sql).not.toMatch(/\bREVOKE\b/i);
    expect(phase2Sql).not.toMatch(/\bDELETE\b/i);
    expect(phase2Sql).not.toMatch(/\bUPDATE\b/i);
    expect(phase2Sql).not.toMatch(/\bINSERT\b/i);
    expect(phase2Sql).not.toMatch(/\bALTER\s+TABLE\b/i);
    expect(phase2Sql).not.toMatch(/\braw_payload\b/i);

    const tableRefs = [
      ...phase2Sql.matchAll(/\b(?:ON|TABLE|FROM|JOIN|INTO|UPDATE)\s+public\.(\w+)/gi),
    ].map((match) => match[1]);

    expect(new Set(tableRefs)).toEqual(new Set(["subscriptions"]));
  });

  it("preserves the Phase 1 reviewed policies in the prior migration", () => {
    expect(migration).toMatch(
      /CREATE POLICY subscriptions_self_select\s+ON public\.subscriptions\s+FOR SELECT\s+TO authenticated\s+USING \(auth\.uid\(\) = user_id\);/,
    );
    expect(migration).toMatch(
      /CREATE POLICY subscriptions_admin_select\s+ON public\.subscriptions\s+FOR SELECT\s+TO authenticated\s+USING \(public\.get_admin_level\(auth\.uid\(\)\) >= 9\);/,
    );
  });
});
