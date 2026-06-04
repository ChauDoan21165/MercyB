// CI guard: every user-identifying table in the live schema must be classified
// in supabase/functions/delete-account/user-data-manifest.ts.
//
// Exits 0 if manifest covers every live user-id table.
// Exits 1 and prints the missing tables otherwise.
//
// Introspection path: a direct, READ-ONLY Postgres connection as the
// `ci_introspect` role (SELECT-only, no RLS bypass — see migration
// 20260705000000_ci_introspect_readonly_role.sql). Reads information_schema
// instead of the PostgREST OpenAPI spec, so it no longer needs the
// service-role key, and so the dashboard-only JWT secret is never involved.
//
// Connection string comes from a SINGLE protected CI variable,
// SUPABASE_CI_INTROSPECT_DSN. If it is absent the check skips cleanly
// (exit 0) — same harmless behavior as before — so local builds and any
// pipeline that predates the variable keep passing.
//
// Run locally:
//   SUPABASE_CI_INTROSPECT_DSN="postgres://ci_introspect:...@host:5432/postgres" \
//     node scripts/check-delete-account-coverage.mjs

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnv() {
  const out = {};
  for (const f of [".env", ".env.local"]) {
    try {
      const raw = readFileSync(resolve(process.cwd(), f), "utf8");
      for (const line of raw.split(/\r?\n/)) {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
        if (m) out[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
      }
    } catch { /* ignore */ }
  }
  for (const k of Object.keys(process.env)) {
    if (!(k in out)) out[k] = process.env[k];
  }
  return out;
}

const env = loadEnv();
const dsn = env.SUPABASE_CI_INTROSPECT_DSN;

if (!dsn) {
  console.error(
    "[check-delete-account-coverage] Missing SUPABASE_CI_INTROSPECT_DSN — skipping check.",
  );
  // Skip (exit 0) so local builds and pre-provisioning pipelines still pass.
  // CI must provide the read-only DSN for the check to run for real.
  process.exit(0);
}

const USER_COLUMN_HINTS = [
  "user_id",
  "admin_id",
  "admin_user_id",
  "actor_user_id",
  "target_user_id",
  "sender_id",
  "receiver_id",
  "owner_id",
];

// `pg` is a devDependency. Imported dynamically so the skip path above never
// requires the module to be installed (keeps the guard harmless pre-provision).
const { default: pg } = await import("pg");
const client = new pg.Client({
  connectionString: dsn,
  // Supabase requires TLS; the pooler cert chain isn't worth pinning for a
  // read-only metadata query.
  ssl: { rejectUnauthorized: false },
  statement_timeout: 30_000,
  query_timeout: 30_000,
  connectionTimeoutMillis: 15_000,
});

let rows;
try {
  await client.connect();

  // Defense-in-depth: refuse to proceed unless we are the read-only role, so a
  // misconfigured DSN can never run this against a privileged account.
  const who = await client.query("select current_user as u");
  if (who.rows[0].u !== "ci_introspect") {
    console.error(
      `[check-delete-account-coverage] Refusing: connected as '${who.rows[0].u}', expected 'ci_introspect'.`,
    );
    await client.end();
    process.exit(1);
  }

  const result = await client.query(
    `select table_name, column_name
       from information_schema.columns
      where table_schema = 'public'`,
  );
  rows = result.rows;
} catch (e) {
  console.error(
    `[check-delete-account-coverage] introspection query failed: ${e.message}`,
  );
  try { await client.end(); } catch { /* ignore */ }
  process.exit(1);
}
await client.end();

// Group columns by relation (table OR view) in the public schema.
const colsByTable = new Map();
for (const { table_name, column_name } of rows) {
  if (!colsByTable.has(table_name)) colsByTable.set(table_name, new Set());
  colsByTable.get(table_name).add(column_name);
}

const liveUserTables = new Set();
for (const [name, cols] of colsByTable) {
  if ([...cols].some((c) => USER_COLUMN_HINTS.includes(c))) liveUserTables.add(name);
  // profiles uses `id` = auth user id.
  if ((name === "profiles" || name === "user_profiles") && cols.has("id")) {
    liveUserTables.add(name);
  }
}

// Parse manifest by reading the TS file and extracting table: "name" strings.
const manifestSrc = readFileSync(
  resolve(process.cwd(), "supabase/functions/delete-account/user-data-manifest.ts"),
  "utf8",
);
const manifestTables = new Set();
const re = /table:\s*"([^"]+)"/g;
let m;
while ((m = re.exec(manifestSrc)) !== null) manifestTables.add(m[1]);

const missing = [...liveUserTables].filter((t) => !manifestTables.has(t)).sort();
const stale = [...manifestTables].filter((t) => !liveUserTables.has(t)).sort();

if (missing.length === 0 && stale.length === 0) {
  console.log(`[check-delete-account-coverage] OK — manifest covers all ${liveUserTables.size} live user-id tables.`);
  process.exit(0);
}

let failed = false;
if (missing.length > 0) {
  failed = true;
  console.error();
  console.error(`❌ ${missing.length} live user-id table(s) missing from manifest:`);
  for (const t of missing) console.error(`   - ${t}`);
  console.error();
  console.error("   Add an entry to supabase/functions/delete-account/user-data-manifest.ts");
  console.error("   classifying each as delete / anonymize / skip_view / skip_admin.");
}
if (stale.length > 0) {
  console.warn();
  console.warn(`⚠️  ${stale.length} manifest entry/entries no longer exist in live schema (stale, non-fatal):`);
  for (const t of stale) console.warn(`   - ${t}`);
}

process.exit(failed ? 1 : 0);
