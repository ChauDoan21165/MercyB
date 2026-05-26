/**
 * A59 — guards the hygiene migration that scopes legacy PUBLIC
 * `WITH CHECK (true)` INSERT policies to service_role.
 *
 * A live `pg_policies` assertion is intentionally NOT done here: this
 * project has no unattended SQL path to prod (GRANT/REVOKE + policy DDL
 * are applied by hand via the Supabase SQL Editor) and CI has no DB
 * connection — a runtime pg_policies test would be unrunnable theater.
 * Instead we statically assert the migration artifact is correct and
 * complete, which is the part CI can honestly verify. The runtime check
 * is the `pg_policies` SELECT Chau runs in the SQL Editor post-apply.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { describe, it, expect } from "vitest";

const here = dirname(fileURLToPath(import.meta.url));
const migration = readFileSync(
  resolve(
    here,
    "../../../../supabase/migrations/20260621000000_scope_legacy_public_policies.sql",
  ),
  "utf8",
);

/** table -> exact legacy PUBLIC INSERT policy name being retired */
const SCOPED: Record<string, string> = {
  payment_transactions: "System can insert transactions",
  ai_usage: "System can insert AI usage logs",
  ai_usage_events: "System can insert AI usage",
  security_incidents: "System can insert incidents",
  uptime_checks: "System can insert uptime checks",
  security_events: "Authenticated can log own events",
  email_events: "System can insert email events",
  user_moderation_violations: "System can insert violations",
};

/** documented exclusions: client/anon writers — must NOT be revoked here */
const EXCLUDED = ["system_logs", "login_attempts"];

describe("A59 scope_legacy_public_policies migration", () => {
  it("is transactional and idempotent-safe", () => {
    expect(migration).toMatch(/^\s*BEGIN;/m);
    expect(migration).toMatch(/COMMIT;\s*$/);
  });

  for (const [table, legacyName] of Object.entries(SCOPED)) {
    describe(table, () => {
      it("drops the legacy PUBLIC insert policy", () => {
        expect(migration).toContain(
          `DROP POLICY IF EXISTS "${legacyName}"`,
        );
      });

      it("recreates the insert policy scoped TO service_role", () => {
        const re = new RegExp(
          `CREATE POLICY "${table}_service_insert"\\s+ON public\\.${table} FOR INSERT TO service_role WITH CHECK \\(true\\);`,
        );
        expect(migration).toMatch(re);
      });

      it("revokes INSERT from anon and authenticated", () => {
        expect(migration).toContain(
          `REVOKE INSERT ON public.${table} FROM anon, authenticated;`,
        );
      });
    });
  }

  it("scopes exactly the 8 audited tables (no scope creep)", () => {
    const revokes = [...migration.matchAll(/REVOKE INSERT ON public\.(\w+)/g)].map(
      (m) => m[1],
    );
    expect(revokes.sort()).toEqual(Object.keys(SCOPED).sort());
  });

  it("never re-creates a PUBLIC (no-role) INSERT policy", () => {
    // every `FOR INSERT` policy created here must name a role
    const inserts = [
      ...migration.matchAll(/CREATE POLICY[^;]*FOR INSERT([^;]*);/g),
    ];
    expect(inserts.length).toBeGreaterThan(0);
    for (const [, tail] of inserts) {
      expect(tail).toMatch(/TO service_role/);
    }
  });

  it("does NOT touch the excluded client/anon-writer tables", () => {
    for (const t of EXCLUDED) {
      expect(migration).not.toContain(`REVOKE INSERT ON public.${t}`);
      expect(migration).not.toContain(`ON public.${t} FOR INSERT`);
    }
  });
});
