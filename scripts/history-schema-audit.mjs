// Inspect Supabase schema for every table/view related to study history / memory.
// Lists columns, indexes, RLS policies, and row-counts. No writes.

import { createClient } from "@supabase/supabase-js";
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
  return out;
}

const env = loadEnv();
const supabase = createClient(
  env.VITE_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

// Candidate tables / views based on frontend audit.
const CANDIDATES = [
  "user_room_progress",
  "user_path_progress",
  "user_points",
  "user_sessions",
  "mb_user_progress_narratives",
  "mb_user_progress_snapshots",
  "mb_user_room_weekly_pronunciation",
  "v_user_progress_current",
  "speech_attempts",
  "room_reflections",
  "user_notebooks",
  "notebook_entries",
  "point_transactions",
  "teacher_memory",
  "mercy_memory",
  "user_memory",
  "study_sessions",
  "ai_meter",
  "profiles",
];

async function rpc(sql) {
  // Use a service-role raw query via PostgREST /rpc/<fn> if available,
  // else fall back to REST + information_schema probes.
  try {
    const { data, error } = await supabase.rpc("exec_sql", { sql_text: sql });
    if (!error) return data;
  } catch {}
  return null;
}

async function tableExists(name) {
  const { error, count } = await supabase.from(name).select("*", { count: "exact", head: true });
  if (error) return { exists: false, reason: error.message };
  return { exists: true, rowCount: count };
}

async function describeTableViaPostgrest(name) {
  // OPTIONS probe is not reliable via JS SDK; use SELECT ... LIMIT 0 to get columns via headers.
  const { data, error } = await supabase.from(name).select("*").limit(1);
  if (error) return { error: error.message };
  const columns = data && data.length ? Object.keys(data[0]) : [];
  return { sampleColumns: columns };
}

async function probeTable(name) {
  const ex = await tableExists(name);
  if (!ex.exists) return { name, exists: false, reason: ex.reason };
  const desc = await describeTableViaPostgrest(name);
  return { name, exists: true, rowCount: ex.rowCount, ...desc };
}

async function listAllStudyTables() {
  // Query information_schema via PostgREST if a helper RPC is installed; else
  // enumerate candidates only.
  return null;
}

async function main() {
  console.log("# Supabase history/memory schema audit");
  console.log("Run at:", new Date().toISOString());
  console.log();

  console.log("## Candidate tables/views — existence, row counts, columns");
  console.log();
  const results = [];
  for (const name of CANDIDATES) {
    const r = await probeTable(name);
    results.push(r);
    if (!r.exists) {
      console.log(`- ❌ \`${r.name}\` — does not exist (${(r.reason || "").slice(0, 80)})`);
    } else {
      console.log(`- ✅ \`${r.name}\` — rows: ${r.rowCount ?? "?"}; columns: ${(r.sampleColumns || []).join(", ") || "(empty sample)"}`);
    }
  }

  console.log();
  console.log("## Table list summary");
  console.log(`Existing: ${results.filter((r) => r.exists).length} of ${CANDIDATES.length}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
