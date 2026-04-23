// Fetch Supabase PostgREST OpenAPI spec to introspect every study-related table's columns + types.
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
const url = env.VITE_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;

const TARGETS = [
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
];

const res = await fetch(`${url}/rest/v1/?apikey=${key}`, {
  headers: { apikey: key, Authorization: `Bearer ${key}` },
});
const spec = await res.json();

console.log("## Schema snapshot (from Supabase PostgREST OpenAPI)");
console.log();

for (const t of TARGETS) {
  const def = spec.definitions?.[t];
  if (!def) {
    console.log(`### ❌ \`${t}\` — not exposed by PostgREST`);
    console.log();
    continue;
  }
  const cols = def.properties || {};
  const required = new Set(def.required || []);
  const primary = [];
  const foreign = [];
  const generic = [];
  for (const [name, meta] of Object.entries(cols)) {
    const type = meta.format || meta.type || "?";
    const flags = [];
    if (required.has(name)) flags.push("NOT NULL");
    if (meta.description && /primary key/i.test(meta.description)) flags.push("PK");
    if (meta.description && /foreign key/i.test(meta.description)) flags.push("FK");
    if (meta.description && /<fk.*>/.test(meta.description)) flags.push("FK");
    const desc = meta.description ? ` — ${meta.description.replace(/\n/g, " ").slice(0, 120)}` : "";
    const line = `  - \`${name}\`: ${type}${flags.length ? ` [${flags.join(", ")}]` : ""}${desc}`;
    if (flags.includes("PK")) primary.push(line);
    else if (flags.some((f) => f === "FK")) foreign.push(line);
    else generic.push(line);
  }
  console.log(`### ✅ \`${t}\``);
  [...primary, ...foreign, ...generic].forEach((l) => console.log(l));
  console.log();
}
