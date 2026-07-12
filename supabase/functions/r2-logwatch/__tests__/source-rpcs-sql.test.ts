import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const sql = readFileSync("supabase/migrations_manual/20260712112000_r2_logwatch_source_rpcs.sql", "utf8").toLowerCase();

describe("r2-logwatch source RPC SQL", () => {
  it("keeps cron/net source RPCs locked to service_role", () => {
    for (const name of ["r2_recent_cron_failures", "r2_recent_http_errors"]) {
      expect(sql).toContain(`create or replace function public.${name}`);
      expect(sql).toContain("security definer");
      expect(sql).toContain("set search_path = ''");
      expect(sql).toContain(`alter function public.${name}(timestamptz) owner to postgres`);
      expect(sql).toContain(`revoke all on function public.${name}(timestamptz) from public`);
      expect(sql).toContain(`revoke execute on function public.${name}(timestamptz) from anon, authenticated`);
      expect(sql).toContain(`grant execute on function public.${name}(timestamptz) to service_role`);
    }
  });
});
