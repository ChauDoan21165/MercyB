/**
 * A6 Phase A — entitlement/user-rank security_definer_view hardening.
 *
 * Static migration contract only. Production SQL is applied manually after
 * approval; CI should verify the artifact is additive and does not include
 * Phase B tightening.
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
    "supabase/migrations/20260630000000_entitlement_user_rank_secdef_phase_a.sql",
  ),
  "utf8",
);

const VIEWS = [
  "user_entitlements",
  "user_entitlements_v",
  "mb_user_effective_rank",
  "v_user_ai_monthly_meter",
] as const;

describe("A6 entitlement/user-rank Phase A migration", () => {
  it("is wrapped in a single transaction", () => {
    expect(migration).toMatch(/^\s*BEGIN;/m);
    expect(migration).toMatch(/COMMIT;\s*$/);
  });

  it("sets security_invoker=true on all four scoped views", () => {
    for (const view of VIEWS) {
      expect(migration).toContain(
        `ALTER VIEW public.${view} SET (security_invoker = true);`,
      );
    }
  });

  it("creates a self-scoped AI monthly meter RPC", () => {
    expect(migration).toMatch(
      /CREATE OR REPLACE FUNCTION public\.get_my_ai_monthly_meter\(\)[\s\S]*?SECURITY DEFINER\s+SET search_path = public/,
    );
    expect(migration).toContain("FROM public.v_user_ai_monthly_meter AS m");
    expect(migration).toContain("WHERE m.user_id = auth.uid()");
  });

  it("does not grant RPC execution to anon or PUBLIC", () => {
    expect(migration).toContain(
      "REVOKE EXECUTE ON FUNCTION public.get_my_ai_monthly_meter() FROM PUBLIC;",
    );
    expect(migration).toContain(
      "REVOKE EXECUTE ON FUNCTION public.get_my_ai_monthly_meter() FROM anon;",
    );
    expect(migration).not.toMatch(
      /GRANT\s+EXECUTE\s+ON\s+FUNCTION\s+public\.get_my_ai_monthly_meter\(\)\s+TO\s+(?:[^;]*,\s*)?(?:anon|PUBLIC)\b/i,
    );
    expect(migration).toContain(
      "GRANT EXECUTE ON FUNCTION public.get_my_ai_monthly_meter() TO authenticated, service_role;",
    );
  });

  it("introduces no anon grants", () => {
    expect(migration).not.toMatch(/GRANT\s+[^;]+\s+TO\s+[^;]*\banon\b/i);
  });

  it("preserves required SELECT paths", () => {
    expect(migration).toContain(
      "GRANT SELECT ON public.user_entitlements TO authenticated, service_role;",
    );
    expect(migration).toContain(
      "GRANT SELECT ON public.user_entitlements_v TO authenticated, service_role;",
    );
    expect(migration).toContain(
      "GRANT SELECT ON public.mb_user_effective_rank TO authenticated, service_role;",
    );
    expect(migration).toContain(
      "GRANT SELECT ON public.v_user_ai_monthly_meter TO authenticated, service_role;",
    );
  });

  it("does not include Phase B tightening revokes", () => {
    expect(migration).not.toMatch(
      /REVOKE\s+(?:ALL|SELECT|INSERT|UPDATE|DELETE|TRUNCATE|REFERENCES|TRIGGER)[^;]+ON\s+public\.(?:user_entitlements|user_entitlements_v|mb_user_effective_rank|v_user_ai_monthly_meter)\s+FROM\s+authenticated/i,
    );
  });

  it("does not drop or recreate the scoped views", () => {
    expect(migration).not.toMatch(/DROP\s+(?:VIEW|MATERIALIZED VIEW)/i);
    expect(migration).not.toMatch(/CREATE\s+(?:OR REPLACE\s+)?VIEW/i);
  });
});
