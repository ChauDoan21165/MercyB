import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const MIGRATION_DIR = resolve(process.cwd(), "supabase/migrations");
const RPC_MIGRATION = "20260709000000_family_invitations_token_lookup_rpc.sql";
const TIGHTEN_MIGRATION = "20260710000000_family_invitations_tighten_anon_select.sql";

function normalizeSql(sql: string) {
  return sql.toLowerCase().replace(/\s+/g, " ").trim();
}

function migrationSql(file: string) {
  return readFileSync(resolve(MIGRATION_DIR, file), "utf8");
}

const rpcSql = normalizeSql(migrationSql(RPC_MIGRATION));
const tightenSql = normalizeSql(migrationSql(TIGHTEN_MIGRATION));
const chainSql = normalizeSql(
  readdirSync(MIGRATION_DIR)
    .filter((file) => file.endsWith(".sql"))
    .sort()
    .map(migrationSql)
    .join("\n"),
);

function finalFamilyInvitationSelectPolicies(sql: string) {
  const policies = new Map<string, string>();
  const statementPattern =
    /\b(drop|create)\s+policy\s+(?:if\s+exists\s+)?(?:"([^"]+)"|([a-z_][a-z0-9_]*))\s+[^;]*?\bon\s+public\.family_invitations\b[^;]*;/gi;

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

function finalFamilyInvitationSelectGrants(sql: string) {
  const grants = new Set<string>();
  const statementPattern =
    /\b(grant|revoke)\s+[^;]*?\bselect\b[^;]*?\bon\s+(?:table\s+)?public\.family_invitations\s+(?:to|from)\s+([^;]+);/gi;

  for (const match of sql.matchAll(statementPattern)) {
    const statement = normalizeSql(match[0]);
    const action = match[1].toLowerCase();
    const roles = match[2]
      .split(",")
      .map((role) => normalizeSql(role.replace(/;$/, "")))
      .filter(Boolean);

    for (const role of roles) {
      if (action === "grant") grants.add(role);
      else grants.delete(role);
    }

    if (statement.includes(" from public")) {
      grants.delete("public");
    }
  }

  return grants;
}

describe("family_invitations RLS contract", () => {
  it("adds a token-scoped SECURITY DEFINER RPC that omits PII fields", () => {
    expect(rpcSql).toContain(
      "create or replace function public.get_family_invitation_by_token(p_token text)",
    );
    expect(rpcSql).toContain("security definer");
    expect(rpcSql).toContain("set search_path = public");
    expect(rpcSql).toContain("where fi.invite_token = p_token");
    expect(rpcSql).toContain(
      "revoke all on function public.get_family_invitation_by_token(text) from public",
    );
    expect(rpcSql).toContain(
      "grant execute on function public.get_family_invitation_by_token(text) to anon, authenticated",
    );

    const returnsBlock = rpcSql.slice(
      rpcSql.indexOf("returns table"),
      rpcSql.indexOf("language sql"),
    );
    expect(returnsBlock).not.toContain("recipient_email");
    expect(returnsBlock).not.toContain("recipient_phone");
    expect(returnsBlock).not.toContain("invite_token");
  });

  it("tightens family invitation table reads after the client RPC switch", () => {
    expect(tightenSql).toContain(
      "drop policy if exists family_invitations_recipient_by_token on public.family_invitations",
    );
    expect(tightenSql).toContain("revoke select on public.family_invitations from anon");
    expect(tightenSql).toContain(
      normalizeSql(`
        create policy family_invitations_owner_select
          on public.family_invitations
          as permissive
          for select
          to authenticated
          using (inviter_user_id = auth.uid())
      `),
    );
  });

  it("leaves no public USING true SELECT policy on family_invitations in a reset", () => {
    const policies = finalFamilyInvitationSelectPolicies(chainSql);
    const grants = finalFamilyInvitationSelectGrants(chainSql);

    expect([...policies.keys()]).toEqual(["family_invitations_owner_select"]);
    expect(grants.has("anon")).toBe(false);

    for (const policySql of policies.values()) {
      expect(policySql).not.toContain("using (true)");
      expect(policySql).not.toContain(" to public ");
      expect(policySql).not.toContain(" to anon ");
    }
  });
});
