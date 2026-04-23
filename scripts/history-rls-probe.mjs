// Probe each history table with the ANON key to verify RLS is actually blocking public access.
// Service-role key is authoritative; anon key is what a logged-out browser would use.
// Any table that returns rows (or 0 rows without error) via anon → potential RLS gap.

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
const anon = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const service = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const TABLES = [
  "user_room_progress",
  "user_path_progress",
  "user_points",
  "user_sessions",
  "point_transactions",
  "speech_attempts",
  "room_reflections",
  "mb_user_progress_narratives",
  "mb_user_progress_snapshots",
  "mb_user_room_weekly_pronunciation",
  "teacher_memory",
  "study_log",
  "user_notebooks",
  "notebook_entries",
];

console.log("| Table | anon SELECT | service SELECT | RLS verdict |");
console.log("|---|---|---|---|");
for (const t of TABLES) {
  const [a, s] = await Promise.all([
    anon.from(t).select("*", { count: "exact", head: true }),
    service.from(t).select("*", { count: "exact", head: true }),
  ]);
  const anonState = a.error ? `ERR: ${(a.error.message || "").slice(0, 40)}` : `OK (${a.count ?? "?"} rows)`;
  const svcState = s.error ? `ERR: ${(s.error.message || "").slice(0, 40)}` : `OK (${s.count ?? "?"} rows)`;
  let verdict;
  if (s.error && /does not exist|schema cache/i.test(s.error.message)) verdict = "⚫ table not exposed";
  else if (a.error && /permission denied|row-level security|violates.*policy/i.test(a.error.message)) verdict = "✅ RLS blocks anon";
  else if (!a.error && (a.count === 0 || a.count === null)) verdict = "⚠️ anon connects but sees 0 rows — RLS likely enabled with per-user filter";
  else if (!a.error && a.count > 0) verdict = "🚨 anon SEES ROWS — RLS GAP";
  else verdict = "?";
  console.log(`| ${t} | ${anonState} | ${svcState} | ${verdict} |`);
}
