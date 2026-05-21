import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const REQUIRED_ENV = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "VITE_SUPABASE_URL",
  "VITE_SUPABASE_ANON_KEY",
];

const PROVIDER_KEYS = ["OPENAI_API_KEY", "GEMINI_API_KEY"];
const MIGRATION_FILE = "supabase/migrations/20260520125321_placement_v3_forensics.sql";
const EVIDENCE_ROOT = "docs/placement-v3/observability/staging-validation-evidence";

function isoStamp() {
  return new Date().toISOString();
}

function safeStamp() {
  return isoStamp().replaceAll(":", "").replaceAll(".", "-");
}

function redact(value) {
  if (!value) return "missing";
  const trimmed = String(value).trim();
  if (trimmed.length <= 8) return "[set:redacted]";
  return `${trimmed.slice(0, 4)}...${trimmed.slice(-4)} (${trimmed.length} chars)`;
}

function envStatus() {
  const providerPresent = PROVIDER_KEYS.some((name) => Boolean(process.env[name]?.trim()));
  const missing = REQUIRED_ENV.filter((name) => !process.env[name]?.trim());
  if (!providerPresent) missing.push("OPENAI_API_KEY or GEMINI_API_KEY");

  return {
    checkedAt: isoStamp(),
    required: REQUIRED_ENV.map((name) => ({
      name,
      present: Boolean(process.env[name]?.trim()),
      redacted: redact(process.env[name]),
    })),
    providers: PROVIDER_KEYS.map((name) => ({
      name,
      present: Boolean(process.env[name]?.trim()),
      redacted: redact(process.env[name]),
    })),
    missing,
  };
}

function createEvidenceFolder() {
  const folder = path.join(EVIDENCE_ROOT, `staging-${safeStamp()}`);
  const subfolders = [
    "screenshots",
    "traces",
    "logs",
    "db-evidence",
    "dashboard",
    "replay",
    "rollback",
  ];

  mkdirSync(folder, { recursive: true });
  for (const subfolder of subfolders) {
    mkdirSync(path.join(folder, subfolder), { recursive: true });
  }
  return folder;
}

async function verifySupabaseConnectivity(folder) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const endpoint = `${String(url).replace(/\/$/, "")}/rest/v1/`;
  const startedAt = Date.now();

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
    });
    const result = {
      checkedAt: isoStamp(),
      endpoint,
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      latencyMs: Date.now() - startedAt,
    };
    writeFileSync(path.join(folder, "logs", "supabase-connectivity.json"), JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    const result = {
      checkedAt: isoStamp(),
      endpoint,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
      latencyMs: Date.now() - startedAt,
    };
    writeFileSync(path.join(folder, "logs", "supabase-connectivity.json"), JSON.stringify(result, null, 2));
    return result;
  }
}

function writeManifest(folder, env, migration, supabase) {
  const manifest = {
    schemaVersion: 1,
    validationId: path.basename(folder),
    generatedAt: isoStamp(),
    operator: process.env.USER || "unknown",
    environment: "staging",
    status: supabase?.ok && env.missing.length === 0 && migration.exists ? "ready_for_manual_steps" : "blocked",
    providerMetadata: env.providers.map((provider) => ({
      provider: provider.name.replace("_API_KEY", "").toLowerCase(),
      keyPresent: provider.present,
      model: null,
      liveCallValidated: false,
    })),
    artifacts: {
      screenshots: [],
      logs: ["logs/env-check.json", "logs/migration-check.json", "logs/supabase-connectivity.json"],
      replayArtifacts: [],
      dbEvidence: [],
      dashboardEvidence: [],
      rollbackEvidence: [],
    },
    validationStatus: {
      envReady: env.missing.length === 0,
      migrationPresent: migration.exists,
      supabaseReachable: Boolean(supabase?.ok),
      providerPreconditionsReady: env.providers.some((provider) => provider.present),
      liveProviderValidated: false,
      liveSupabaseInsertsValidated: false,
      dashboardPersistedRowsValidated: false,
      rollbackValidated: false,
    },
    blockers: [
      ...(env.missing.length ? env.missing.map((name) => `Missing env: ${name}`) : []),
      ...(migration.exists ? [] : [`Missing local migration: ${MIGRATION_FILE}`]),
      ...(supabase?.ok ? [] : ["Supabase REST connectivity failed"]),
      "Live provider calls not executed by this orchestrator.",
      "Live forensic inserts require manual Placement V3 session execution.",
    ],
  };

  writeFileSync(path.join(folder, "evidence-manifest.json"), JSON.stringify(manifest, null, 2));
}

function printChecklist(folder) {
  console.log("\nEvidence folder:");
  console.log(folder);
  console.log("\nNext manual validation steps:");
  console.log("1. Run one real Placement V3 staging session with provider credentials enabled.");
  console.log("2. Save Edge Function logs to logs/placement-v3-session.log.");
  console.log("3. Run the DB queries from docs/placement-v3/observability/db-verification-guide.md.");
  console.log("4. Save redacted SQL outputs under db-evidence/.");
  console.log("5. Capture dashboard screenshots under screenshots/ and dashboard/.");
  console.log("6. Replay the persisted correlation ID and save output under replay/.");
  console.log("7. Simulate provider outage using docs/placement-v3/observability/provider-outage-simulation.md.");
  console.log("8. Run rollback drill from docs/placement-v3/observability/rollback-runbook.md and save logs under rollback/.");
  console.log("9. Complete docs/placement-v3/observability/staging-validation-checklist.md.");
  console.log("\nThis orchestrator never fakes provider responses and does not perform provider calls.");
}

async function main() {
  const folder = createEvidenceFolder();
  const env = envStatus();
  const migration = {
    checkedAt: isoStamp(),
    path: MIGRATION_FILE,
    exists: existsSync(MIGRATION_FILE),
  };

  writeFileSync(path.join(folder, "logs", "env-check.json"), JSON.stringify(env, null, 2));
  writeFileSync(path.join(folder, "logs", "migration-check.json"), JSON.stringify(migration, null, 2));

  console.log("Placement V3 forensics staging validation orchestrator");
  console.log("No provider calls will be made.");
  console.log(`Evidence folder created: ${folder}`);

  if (env.missing.length > 0) {
    console.error("\nMissing required prerequisites:");
    for (const name of env.missing) console.error(`- ${name}`);
    writeManifest(folder, env, migration, { ok: false });
    printChecklist(folder);
    process.exit(1);
  }

  if (!migration.exists) {
    console.error(`\nMissing migration file: ${MIGRATION_FILE}`);
    writeManifest(folder, env, migration, { ok: false });
    printChecklist(folder);
    process.exit(1);
  }

  const supabase = await verifySupabaseConnectivity(folder);
  if (!supabase.ok) {
    console.error("\nSupabase connectivity check failed.");
    console.error("See logs/supabase-connectivity.json in the evidence folder.");
    writeManifest(folder, env, migration, supabase);
    printChecklist(folder);
    process.exit(1);
  }

  writeManifest(folder, env, migration, supabase);
  console.log("\nPrerequisites passed for manual staging validation.");
  printChecklist(folder);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
