// CI guard: every user-identifying table in the live schema must be classified
// in supabase/functions/delete-account/user-data-manifest.ts.
//
// Exits 0 if manifest covers every live user-id table.
// Exits 1 and prints the missing tables otherwise.
//
// Run locally:
//   node scripts/check-delete-account-coverage.mjs
// Run in CI after installing @supabase/supabase-js (already in deps).

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
const url = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "[check-delete-account-coverage] Missing VITE_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY — skipping check.",
  );
  // Skip (exit 0) so local builds without service role key still pass.
  // CI must provide the env vars for the check to run for real.
  process.exit(0);
}

const res = await fetch(`${url}/rest/v1/?apikey=${key}`, {
  headers: { apikey: key, Authorization: `Bearer ${key}` },
});
if (!res.ok) {
  console.error(`[check-delete-account-coverage] OpenAPI fetch failed: ${res.status}`);
  process.exit(1);
}
const spec = await res.json();

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

const liveUserTables = new Set();
for (const [name, def] of Object.entries(spec.definitions || {})) {
  const cols = Object.keys(def.properties || {});
  if (cols.some((c) => USER_COLUMN_HINTS.includes(c))) liveUserTables.add(name);
  // profiles uses `id` = auth user id.
  if ((name === "profiles" || name === "user_profiles") && cols.includes("id")) {
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
