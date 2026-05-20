import process from "node:process";

const REQUIRED = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "VITE_SUPABASE_URL",
  "VITE_SUPABASE_ANON_KEY",
];

const PROVIDER_KEYS = ["OPENAI_API_KEY", "GEMINI_API_KEY"];

const OPTIONAL_FLAGS = [
  "PLACEMENT_V3_UI_ENABLED",
  "PLACEMENT_TEST_ENABLED",
  "VITE_PLACEMENT_V3_UI_ENABLED",
  "VITE_PLACEMENT_TEST_ENABLED",
];

function redact(value) {
  if (!value) return "missing";
  const trimmed = String(value).trim();
  if (trimmed.length <= 8) return "[set:redacted]";
  return `${trimmed.slice(0, 4)}...${trimmed.slice(-4)} (${trimmed.length} chars)`;
}

function checkEnv(name, required, note) {
  const value = process.env[name];
  return {
    name,
    required,
    present: Boolean(value && String(value).trim()),
    redacted: redact(value),
    note,
  };
}

function buildChecks() {
  return [
    ...REQUIRED.map((name) =>
      checkEnv(name, true, "Required for live Supabase persistence/dashboard validation.")
    ),
    ...PROVIDER_KEYS.map((name) =>
      checkEnv(name, false, "At least one provider key is required for live provider validation.")
    ),
    ...OPTIONAL_FLAGS.map((name) => checkEnv(name, false, "Optional Placement V3 runtime/browser flag.")),
  ];
}

function getMissing(checks) {
  const missingRequired = checks
    .filter((check) => check.required && !check.present)
    .map((check) => check.name);
  const providerPresent = PROVIDER_KEYS.some((name) => Boolean(process.env[name]?.trim()));
  return providerPresent ? missingRequired : [...missingRequired, "OPENAI_API_KEY or GEMINI_API_KEY"];
}

function printChecks(checks) {
  for (const check of checks) {
    const status = check.present ? "present" : check.required ? "missing" : "not set";
    console.log(`${check.name}: ${status} ${check.redacted}`);
    console.log(`  ${check.note}`);
  }
}

function printDryRunReport(checks, missing) {
  console.log("\nDry-run staging validation report");
  console.log("No provider or Supabase network calls were made.");
  console.log("\nWhat would be validated once prerequisites are present:");
  console.log("- Supabase REST connectivity and forensic table reachability.");
  console.log("- Local migration file presence for Placement V3 forensics.");
  console.log("- Provider credential preconditions without sending a provider request.");
  console.log("- Evidence folder creation under docs/placement-v3/observability/staging-validation-evidence/.");
  console.log("- Operator checklist, DB queries, dashboard checks, replay checks, and rollback drill steps.");
  console.log("\nEvidence that would be collected:");
  console.log("- env-check.json");
  console.log("- supabase-connectivity.json");
  console.log("- migration-check.json");
  console.log("- db-evidence/*.sql and redacted query outputs");
  console.log("- dashboard screenshots");
  console.log("- replay outputs");
  console.log("- rollback drill logs");
  console.log("- evidence-manifest.json");

  if (missing.length > 0) {
    console.log("\nMissing prerequisites:");
    for (const name of missing) console.log(`- ${name}`);
  } else {
    console.log("\nMissing prerequisites: none detected by env-only dry run.");
  }

  console.log("\nRemaining blocked until real staging execution:");
  console.log("- Live provider calls are not validated by this dry run.");
  console.log("- Live Supabase inserts are not validated by this dry run.");
  console.log("- Dashboard persisted-row rendering is not validated by this dry run.");
  console.log("- Rollback and kill-switch behavior are not validated by this dry run.");
}

function main() {
  const dryRunReport = process.argv.includes("--dry-run-report");
  const checks = buildChecks();
  const missing = getMissing(checks);

  console.log("Placement V3 forensics live-validation env check");
  console.log("No provider or Supabase network calls were made.\n");
  printChecks(checks);

  if (dryRunReport) {
    printDryRunReport(checks, missing);
    process.exit(missing.length > 0 ? 1 : 0);
  }

  if (missing.length > 0) {
    console.error("\nMissing required live-validation env:");
    for (const name of missing) {
      console.error(`- ${name}`);
    }
    process.exit(1);
  }

  console.log("\nEnvironment is ready for live-validation attempts.");
  console.log("This does not prove live provider calls or live Supabase inserts.");
}

main();
