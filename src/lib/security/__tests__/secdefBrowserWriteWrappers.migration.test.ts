/**
 * A72 — guards the migration that moves the two browser-written tables
 * (`system_logs`, `login_attempts`) behind SECURITY DEFINER RPCs, the
 * follow-up A59 (#744) explicitly deferred.
 *
 * A live pg_policies / pg_proc assertion is intentionally NOT done here:
 * this project has no unattended SQL path to prod (function + GRANT/REVOKE
 * + policy DDL are applied by hand via the Supabase SQL Editor) and CI has
 * no DB connection — a runtime catalog test would be unrunnable theater
 * (same reasoning as A59's legacyPublicPolicies.migration.test.ts). We
 * statically assert the migration artifact is correct + complete (the part
 * CI can honestly verify) and assert the client now routes the write
 * through the RPC. The runtime "direct anon INSERT is rejected / RPC
 * accepts valid input / RPC rejects malformed input" check is the SQL Chau
 * runs in the Editor post-apply (copy-box in the PR body).
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { describe, it, expect } from "vitest";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "../../../../");

const migration = readFileSync(
  resolve(
    repoRoot,
    "supabase/migrations/20260622000000_secdef_browser_write_wrappers.sql",
  ),
  "utf8",
);
const loggerSrc = readFileSync(resolve(repoRoot, "src/lib/logger.ts"), "utf8");
const secUtilsSrc = readFileSync(
  resolve(repoRoot, "src/utils/securityUtils.ts"),
  "utf8",
);

const TABLES = ["system_logs", "login_attempts"] as const;

/** table -> exact legacy PUBLIC INSERT policy name being retired */
const LEGACY_POLICY: Record<(typeof TABLES)[number], string> = {
  system_logs: "System can insert logs",
  login_attempts: "System can insert login attempts",
};

const FN_SIGS = [
  "public.log_system_event(text, text, text, uuid, jsonb)",
  "public.record_login_attempt(text, boolean, text, text, text)",
];

describe("A72 secdef_browser_write_wrappers migration", () => {
  it("is wrapped in a single transaction", () => {
    expect(migration).toMatch(/^\s*BEGIN;/m);
    expect(migration).toMatch(/COMMIT;\s*$/);
  });

  describe("log_system_event RPC", () => {
    it("is SECURITY DEFINER with a pinned search_path", () => {
      expect(migration).toMatch(
        /CREATE OR REPLACE FUNCTION public\.log_system_event\([\s\S]*?LANGUAGE plpgsql\s+SECURITY DEFINER\s+SET search_path = public/,
      );
    });
    it("validates level against the table CHECK set (rejects malformed input)", () => {
      expect(migration).toContain(
        "_level NOT IN ('info', 'warn', 'error', 'debug')",
      );
      expect(migration).toMatch(/RAISE EXCEPTION 'log_system_event: invalid level/);
    });
    it("rejects an empty message", () => {
      expect(migration).toMatch(
        /RAISE EXCEPTION 'log_system_event: message is required'/,
      );
    });
    it("preserves the real columns (no telemetry regression)", () => {
      expect(migration).toMatch(
        /INSERT INTO public\.system_logs \(level, message, route, user_id, metadata\)/,
      );
    });
  });

  describe("record_login_attempt RPC", () => {
    it("is SECURITY DEFINER with a pinned search_path", () => {
      expect(migration).toMatch(
        /CREATE OR REPLACE FUNCTION public\.record_login_attempt\([\s\S]*?LANGUAGE plpgsql\s+SECURITY DEFINER\s+SET search_path = public/,
      );
    });
    it("validates email shape and success presence (rejects malformed input)", () => {
      expect(migration).toMatch(
        /RAISE EXCEPTION 'record_login_attempt: email is required'/,
      );
      expect(migration).toMatch(
        /RAISE EXCEPTION 'record_login_attempt: malformed email'/,
      );
      expect(migration).toMatch(
        /RAISE EXCEPTION 'record_login_attempt: success is required'/,
      );
    });
    it("preserves failure_reason (written today)", () => {
      expect(migration).toMatch(
        /INSERT INTO public\.login_attempts \(\s*email, ip_address, user_agent, success, failure_reason/,
      );
    });
  });

  describe("function execution is locked to the needed roles", () => {
    for (const sig of FN_SIGS) {
      it(`revokes EXECUTE from PUBLIC then grants the 3 roles for ${sig}`, () => {
        expect(migration).toContain(`REVOKE EXECUTE ON FUNCTION ${sig}`);
        const grant = new RegExp(
          `GRANT  EXECUTE ON FUNCTION ${sig.replace(
            /[.()]/g,
            "\\$&",
          )}\\s+TO anon, authenticated, service_role;`,
        );
        expect(migration).toMatch(grant);
      });
    }
  });

  for (const table of TABLES) {
    describe(table, () => {
      it("drops the legacy PUBLIC insert policy", () => {
        const re = new RegExp(
          `DROP POLICY IF EXISTS "${LEGACY_POLICY[table]}"\\s+ON public\\.${table};`,
        );
        expect(migration).toMatch(re);
      });
      it("recreates the insert policy scoped TO service_role", () => {
        const re = new RegExp(
          `CREATE POLICY "${table}_service_insert"\\s+ON public\\.${table} FOR INSERT TO service_role WITH CHECK \\(true\\);`,
        );
        expect(migration).toMatch(re);
      });
      it("revokes direct INSERT from anon and authenticated", () => {
        expect(migration).toContain(
          `REVOKE INSERT ON public.${table} FROM anon, authenticated;`,
        );
      });
    });
  }

  it("touches exactly the 2 deferred tables (no scope creep)", () => {
    const revokes = [
      ...migration.matchAll(/REVOKE INSERT ON public\.(\w+)/g),
    ].map((m) => m[1]);
    expect(revokes.sort()).toEqual([...TABLES].sort());
  });

  it("never recreates a PUBLIC (no-role) INSERT policy", () => {
    const inserts = [
      ...migration.matchAll(/CREATE POLICY[^;]*FOR INSERT([^;]*);/g),
    ];
    expect(inserts.length).toBeGreaterThan(0);
    for (const [, tail] of inserts) {
      expect(tail).toMatch(/TO service_role/);
    }
  });
});

describe("A72 client wiring", () => {
  it("logger.ts persists via the log_system_event RPC, not a direct insert", () => {
    expect(loggerSrc).toContain('supabase.rpc("log_system_event"');
    expect(loggerSrc).not.toMatch(/from\(\s*["']system_logs["']\s*\)\.insert/);
  });

  it("logger.ts forwards level, message, route, user_id and metadata", () => {
    for (const k of ["_level", "_message", "_route", "_user_id", "_metadata"]) {
      expect(loggerSrc).toContain(k);
    }
  });

  it("securityUtils.ts records via the record_login_attempt RPC, not a direct insert", () => {
    expect(secUtilsSrc).toContain('supabase.rpc("record_login_attempt"');
    expect(secUtilsSrc).not.toMatch(
      /from\(\s*["']login_attempts["']\s*\)\.insert/,
    );
  });

  it("securityUtils.ts forwards email, success, ip, user_agent and failure_reason", () => {
    for (const k of [
      "_email",
      "_success",
      "_ip_address",
      "_user_agent",
      "_failure_reason",
    ]) {
      expect(secUtilsSrc).toContain(k);
    }
  });
});
