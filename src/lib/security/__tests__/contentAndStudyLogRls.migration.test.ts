/**
 * Sentry RLS-denied fix — rooms / room_entries public read + study_log GRANT.
 *
 * Static migration contract only. This project applies Supabase security DDL
 * manually after review, so CI verifies the reviewed artifact: the three
 * intended tables (rooms, room_entries, study_log) and nothing else, a single
 * transaction, public SELECT restored on the content catalog, and study_log
 * kept strictly own-row (auth.uid() = user_id) for authenticated users only.
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
    "supabase/migrations/20260707000000_fix_content_rls_and_study_log_grant.sql",
  ),
  "utf8",
);

// SQL with comment lines stripped, for assertions that must not match prose.
const sql = migration
  .split("\n")
  .filter((line) => !line.trimStart().startsWith("--"))
  .join("\n");

describe("content + study_log RLS migration", () => {
  it("is wrapped in a single transaction", () => {
    expect(migration).toMatch(/^\s*BEGIN;/m);
    expect(migration).toMatch(/COMMIT;\s*$/);
  });

  it("touches only rooms, room_entries, and study_log", () => {
    const tableRefs = [
      ...sql.matchAll(/\b(?:ON|TABLE|FROM|JOIN|INTO|UPDATE)\s+public\.(\w+)/gi),
    ].map((m) => m[1]);
    expect(new Set(tableRefs)).toEqual(
      new Set(["rooms", "room_entries", "study_log"]),
    );
  });

  it("restores public SELECT on the rooms catalog", () => {
    expect(sql).toMatch(
      /CREATE POLICY rooms_public_select\s+ON public\.rooms\s+FOR SELECT\s+USING \(true\);/,
    );
    expect(sql).toContain("GRANT SELECT ON public.rooms TO anon, authenticated;");
  });

  it("restores public SELECT on room_entries", () => {
    expect(sql).toMatch(
      /CREATE POLICY room_entries_public_select\s+ON public\.room_entries\s+FOR SELECT\s+USING \(true\);/,
    );
    expect(sql).toContain(
      "GRANT SELECT ON public.room_entries TO anon, authenticated;",
    );
  });

  it("grants study_log writes to authenticated only — never anon", () => {
    expect(sql).toContain(
      "GRANT SELECT, INSERT, UPDATE ON public.study_log TO authenticated;",
    );
    // study_log is per-user; anon must never be granted access to it.
    expect(sql).not.toMatch(/study_log\s+TO[^;]*\banon\b/i);
  });

  it("keeps study_log strictly own-row (auth.uid() = user_id)", () => {
    expect(sql).toMatch(
      /CREATE POLICY study_log_own_select\s+ON public\.study_log\s+FOR SELECT\s+TO authenticated\s+USING \(auth\.uid\(\) = user_id\);/,
    );
    expect(sql).toMatch(
      /CREATE POLICY study_log_own_insert\s+ON public\.study_log\s+FOR INSERT\s+TO authenticated\s+WITH CHECK \(auth\.uid\(\) = user_id\);/,
    );
    expect(sql).toMatch(
      /CREATE POLICY study_log_own_update\s+ON public\.study_log\s+FOR UPDATE\s+TO authenticated\s+USING \(auth\.uid\(\) = user_id\)\s+WITH CHECK \(auth\.uid\(\) = user_id\);/,
    );
  });

  it("does not grant write access to the content tables (read-only public)", () => {
    expect(sql).not.toMatch(/GRANT[^;]*\b(INSERT|UPDATE|DELETE)\b[^;]*\bpublic\.rooms\b/i);
    expect(sql).not.toMatch(
      /GRANT[^;]*\b(INSERT|UPDATE|DELETE)\b[^;]*\bpublic\.room_entries\b/i,
    );
  });

  it("contains no destructive table/data statements", () => {
    expect(sql).not.toMatch(/\bDROP\s+TABLE\b/i);
    expect(sql).not.toMatch(/\bDELETE\s+FROM\b/i);
    expect(sql).not.toMatch(/\bTRUNCATE\b/i);
    expect(sql).not.toMatch(/\bREVOKE\b/i);
  });

  it("is idempotent — every CREATE POLICY has a matching DROP POLICY IF EXISTS", () => {
    const created = [
      ...sql.matchAll(/CREATE POLICY\s+([A-Za-z0-9_]+)/gi),
    ].map((m) => m[1]);
    const dropped = new Set(
      [...sql.matchAll(/DROP POLICY IF EXISTS\s+([A-Za-z0-9_"]+)/gi)].map((m) =>
        m[1].replaceAll('"', ""),
      ),
    );
    for (const name of created) {
      expect(dropped.has(name)).toBe(true);
    }
  });
});
