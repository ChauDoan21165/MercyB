import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, expect, test } from "vitest";

import {
  buildRlsIntent,
  compareRlsIntent,
  scanRlsMigrations,
} from "../security/rls-matrix-scan.mjs";

const tempRoots = [];

function makeFixture(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "rls-matrix-"));
  tempRoots.push(root);
  const migrations = path.join(root, "supabase/migrations");
  fs.mkdirSync(migrations, { recursive: true });
  for (const [name, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(migrations, name), content);
  }
  return root;
}

afterEach(() => {
  for (const root of tempRoots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("RLS scanner collapses idempotent policy replacement into current policy state", () => {
  const root = makeFixture({
    "001_tables.sql": `
      create table if not exists public.accounts (id uuid primary key, user_id uuid);
      alter table public.accounts enable row level security;
      create policy "old_accounts_select" on public.accounts for select to authenticated using (true);
    `,
    "002_policies.sql": `
      drop policy if exists "old_accounts_select" on public.accounts;
      create policy "accounts_select_own"
        on public.accounts
        for select
        to authenticated
        using (user_id = auth.uid());
      create policy accounts_insert_own
        on public.accounts
        for insert
        to authenticated
        with check (user_id = auth.uid());
    `,
  });

  const scan = scanRlsMigrations({ root });

  expect(scan.tables).toHaveLength(1);
  expect(scan.tables[0].table).toBe("public.accounts");
  expect(scan.tables[0].rls_enabled).toBe(true);
  expect(scan.tables[0].policies.map((policy) => policy.name)).toEqual([
    "accounts_insert_own",
    "accounts_select_own",
  ]);
  expect(scan.tables[0].policies[0].with_check).toBe("user_id = auth.uid()");
  expect(scan.tables[0].policies[1].using).toBe("user_id = auth.uid()");
});

test("RLS intent compare flags new tables without RLS but accepts the recorded baseline state", () => {
  const root = makeFixture({
    "001_tables.sql": `
      create table public.audit_log (id uuid primary key);
    `,
  });
  const scan = scanRlsMigrations({ root });
  const intent = buildRlsIntent(scan);

  expect(compareRlsIntent(scan, intent)).toEqual([]);

  fs.writeFileSync(path.join(root, "supabase/migrations/002_new_table.sql"), `
    create table public.new_sensitive_table (id uuid primary key);
  `);
  const changed = scanRlsMigrations({ root });
  const drift = compareRlsIntent(changed, intent);

  expect(drift).toHaveLength(1);
  expect(drift[0]).toMatchObject({
    type: "new_table_without_rls",
    table: "public.new_sensitive_table",
  });
});
