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
const migrationSql = migration
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
