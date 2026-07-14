import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const certSql = readFileSync(
  "supabase/migrations/20260722000000_certificates_self_scoped_rpcs.sql",
  "utf8",
).toLowerCase();

const r2Sql = readFileSync(
  "supabase/migrations/20260722001000_r2_recent_cron_failures_service_role.sql",
  "utf8",
).toLowerCase();

describe("WP-AUTH-FIX-1 certificate RPC migration", () => {
  it("removes caller-supplied user id from browser certificate issue/list RPCs", () => {
    expect(certSql).toContain("drop function if exists public.issue_certificate(uuid, text, integer, jsonb)");
    expect(certSql).toContain("create or replace function public.issue_certificate(\n  p_cert_type text");
    expect(certSql).toContain("v_user_id uuid := auth.uid()");
    expect(certSql).toContain("values (\n    v_user_id,");
    expect(certSql).toContain("grant execute on function public.issue_certificate(text, integer, jsonb) to authenticated");
    expect(certSql).not.toContain("create or replace function public.issue_certificate(\n  p_user_id");

    expect(certSql).toContain("drop function if exists public.get_user_certificates(uuid)");
    expect(certSql).toContain("create or replace function public.get_user_certificates()");
    expect(certSql).toContain("where c.user_id = v_user_id");
    expect(certSql).toContain("grant execute on function public.get_user_certificates() to authenticated");
  });

  it("captures public certificate verification without exposing private fields", () => {
    const verifySql = certSql.split("create or replace function public.verify_certificate(p_code text)")[1];

    expect(certSql).toContain("create or replace function public.verify_certificate(p_code text)");
    expect(certSql).toContain("where c.certificate_code = p_code");
    expect(certSql).toContain("grant execute on function public.verify_certificate(text) to anon, authenticated");
    expect(verifySql).not.toContain("c.user_id");
    expect(verifySql).not.toContain("c.metadata");
  });
});

describe("WP-AUTH-FIX-1 r2 cron failure RPC migration", () => {
  it("captures r2_recent_cron_failures as service-role-only", () => {
    expect(r2Sql).toContain("create or replace function public.r2_recent_cron_failures(window_start timestamptz)");
    expect(r2Sql).toContain("security definer");
    expect(r2Sql).toContain("set search_path = ''");
    expect(r2Sql).toContain("revoke all on function public.r2_recent_cron_failures(timestamptz) from public");
    expect(r2Sql).toContain("revoke execute on function public.r2_recent_cron_failures(timestamptz) from anon, authenticated");
    expect(r2Sql).toContain("grant execute on function public.r2_recent_cron_failures(timestamptz) to service_role");
  });
});
