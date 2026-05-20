#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import "dotenv/config";

const REQUIRED_FILES = [
  "scripts/placement-v3/run-grading-replay.ts",
  "scripts/placement-v3/check-replay-fixtures.ts",
  "scripts/placement-v3/check-replay-determinism.ts",
  "docs/placement-v3/drift-detection/replay-fixtures/placement-v3-replay-samples.json",
  "docs/placement-v3/drift-detection/raw-runs/.gitkeep",
  "supabase/migrations/20260520112527_placement_v3_grading_drift.sql",
  "supabase/functions/placement-v3-drift-report/index.ts",
];

const REQUIRED_MIGRATION_TABLES = [
  "placement_v3_replay_runs",
  "placement_v3_replay_scores",
  "placement_v3_drift_alerts",
  "placement_v3_provider_variance",
];

const GRADER_FUNCTIONS = [
  "placement-v3-grade-reading",
  "placement-v3-grade-listening",
  "placement-v3-grade-speaking",
];

const missing = [];
const warnings = [];

const supabaseUrl = env("PLACEMENT_REPLAY_SUPABASE_URL") || env("SUPABASE_URL");
const anonKey = env("PLACEMENT_REPLAY_ANON_KEY") || env("SUPABASE_ANON_KEY");
const serviceRoleKey = env("PLACEMENT_REPLAY_SERVICE_ROLE_KEY") || env("SUPABASE_SERVICE_ROLE_KEY");
const jwt = env("PLACEMENT_REPLAY_JWT");

if (!supabaseUrl) missing.push("PLACEMENT_REPLAY_SUPABASE_URL or SUPABASE_URL");
if (!anonKey) missing.push("PLACEMENT_REPLAY_ANON_KEY or SUPABASE_ANON_KEY");
if (!serviceRoleKey) warnings.push("PLACEMENT_REPLAY_SERVICE_ROLE_KEY/SUPABASE_SERVICE_ROLE_KEY missing: live replay can run, but --persist=true is not ready.");
if (!jwt) warnings.push("PLACEMENT_REPLAY_JWT missing: replay will rely on anon key or service-role bearer behavior.");

for (const file of REQUIRED_FILES) {
  if (!fs.existsSync(file)) missing.push(`file:${file}`);
}

const migrationPath = "supabase/migrations/20260520112527_placement_v3_grading_drift.sql";
if (fs.existsSync(migrationPath)) {
  const migration = fs.readFileSync(migrationPath, "utf8");
  for (const table of REQUIRED_MIGRATION_TABLES) {
    if (!migration.includes(table)) missing.push(`migration table:${table}`);
  }
  for (const rlsLine of [
    "alter table public.placement_v3_replay_runs enable row level security",
    "alter table public.placement_v3_replay_scores enable row level security",
    "alter table public.placement_v3_drift_alerts enable row level security",
    "alter table public.placement_v3_provider_variance enable row level security",
  ]) {
    if (!migration.includes(rlsLine)) missing.push(`migration RLS:${rlsLine}`);
  }
}

const fixturesPath = "docs/placement-v3/drift-detection/replay-fixtures/placement-v3-replay-samples.json";
let fixtureCount = 0;
if (fs.existsSync(fixturesPath)) {
  try {
    const fixtures = JSON.parse(fs.readFileSync(fixturesPath, "utf8"));
    if (!Array.isArray(fixtures)) {
      missing.push("fixtures must be a JSON array");
    } else {
      fixtureCount = fixtures.length;
      if (fixtureCount < 40) missing.push(`fixture count expected >= 40, found ${fixtureCount}`);
    }
  } catch (error) {
    missing.push(`fixtures JSON parse failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

for (const functionName of GRADER_FUNCTIONS) {
  if (!fs.existsSync(path.join("supabase/functions", functionName))) {
    warnings.push(`local function folder not present: ${functionName}; verify it is available in deployed Supabase before live replay.`);
  }
}

const summary = {
  checkedAt: new Date().toISOString(),
  callsProviders: false,
  callsSupabase: false,
  readyForLiveDryRun: missing.length === 0,
  readyForLivePersistence: missing.length === 0 && Boolean(serviceRoleKey),
  fixtureCount,
  env: {
    supabaseUrl: Boolean(supabaseUrl),
    anonKey: Boolean(anonKey),
    serviceRoleKey: Boolean(serviceRoleKey),
    jwt: Boolean(jwt),
  },
  missing,
  warnings,
  nextCommands: [
    "npm run check:placement-replay-fixtures",
    "npm run check:placement-replay-determinism -- --runs 5",
    "npx tsx scripts/placement-v3/run-grading-replay.ts --batch baseline-01 --outDir docs/placement-v3/drift-detection/raw-runs --resume=false",
    "npx tsx scripts/placement-v3/run-grading-replay.ts --batch baseline-01 --outDir docs/placement-v3/drift-detection/raw-runs --persist=true --resume=false",
  ],
};

console.log("[placement-drift] live replay env readiness");
console.log(JSON.stringify(summary, null, 2));

if (missing.length > 0) {
  console.error("[placement-drift] live replay env check failed: missing required prerequisites");
  process.exit(1);
}

console.log("[placement-drift] live replay dry-run prerequisites are present");
if (!serviceRoleKey) {
  console.log("[placement-drift] persistence is not ready until service-role env var is present");
}

function env(name) {
  const value = process.env[name];
  return typeof value === "string" && value.length > 0 ? value : "";
}
