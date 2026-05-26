// Authoritative list of every table that has a user_id column, sourced from
// Supabase's live PostgREST OpenAPI spec (not from migrations, which drift).
//
// Output: JSON blob with { user_id_tables: [...], cascade_hints: [...] }.
// Used as the source of truth for delete-account wipe list + CI guard.

import { readFileSync, writeFileSync } from "node:fs";
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
  return out;
}

const env = loadEnv();
const url = env.VITE_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const res = await fetch(`${url}/rest/v1/?apikey=${key}`, {
  headers: { apikey: key, Authorization: `Bearer ${key}` },
});
if (!res.ok) {
  console.error(`OpenAPI fetch failed: ${res.status} ${await res.text()}`);
  process.exit(1);
}
const spec = await res.json();

const candidates = []; // { table, userColumns, isView, allColumns, cascadeHint }

// Names of columns that identify a user.
const USER_COLUMN_HINTS = [
  "user_id",
  "admin_id",
  "admin_user_id",
  "actor_user_id",
  "target_user_id",
  "sender_id",
  "receiver_id",
  "owner_id",
  "reviewer_id",
  "uploader_id",
];

for (const [name, def] of Object.entries(spec.definitions || {})) {
  const cols = def.properties || {};
  const colNames = Object.keys(cols);
  const userCols = colNames.filter((c) => USER_COLUMN_HINTS.includes(c));
  // profiles is special — its PK is `id` which is the user's auth.uid().
  if (name === "profiles" || name === "user_profiles") {
    userCols.push("id");
  }
  if (userCols.length === 0) continue;

  // Heuristic: if column has description mentioning FK to profiles/auth.users,
  // we can note it as cascade-protected.
  const cascadeHints = {};
  for (const c of userCols) {
    const desc = cols[c]?.description || "";
    const fkMatch = desc.match(/fk table='([^']+)' column='([^']+)'/i);
    cascadeHints[c] = fkMatch ? `${fkMatch[1]}.${fkMatch[2]}` : null;
  }

  candidates.push({
    table: name,
    userColumns: userCols,
    cascadeHints,
    allColumnCount: colNames.length,
    isView: !def.type || !def.required || !def.required.length
      ? null // OpenAPI spec doesn't mark views; heuristic only
      : false,
  });
}

// Sort alphabetically for stable diffs.
candidates.sort((a, b) => a.table.localeCompare(b.table));

const output = {
  generated_at: new Date().toISOString(),
  source: "Supabase PostgREST OpenAPI spec",
  total: candidates.length,
  tables: candidates,
};

console.log(`# Tables with user-identifying columns: ${candidates.length}`);
console.log();
console.log("| Table | user_id column(s) | FK hint |");
console.log("|---|---|---|");
for (const c of candidates) {
  const fks = c.userColumns
    .map((col) => `${col}${c.cascadeHints[col] ? ` → ${c.cascadeHints[col]}` : ""}`)
    .join(", ");
  console.log(`| \`${c.table}\` | ${fks} | |`);
}

writeFileSync(
  "scripts/.user-id-tables.json",
  JSON.stringify(output, null, 2) + "\n",
);
console.log();
console.log("Wrote scripts/.user-id-tables.json");
