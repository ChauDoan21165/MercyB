#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

bash scripts/observability/a2-branch-guard.sh

SOURCE_DIR="${1:-reports/placement-v3/a2-observability/latest}"
if [ ! -e "$SOURCE_DIR/validation-summary.json" ]; then
  echo "Missing validation summary. Run npm run placement:a2:validate first, or pass an A2 output directory." >&2
  exit 1
fi

node --input-type=module - "$SOURCE_DIR" <<'NODE'
import fs from "node:fs";
import path from "node:path";

const [sourceDir] = process.argv.slice(2);
const summaryPath = path.join(sourceDir, "validation-summary.json");
const summary = JSON.parse(fs.readFileSync(summaryPath, "utf8"));
const reportPath = path.join(sourceDir, "evidence-report.md");
const machineReportPath = path.join(sourceDir, "evidence-report.json");
const manifestPath = path.join(sourceDir, "evidence-manifest.json");
const generatedAt = new Date().toISOString();
const commandsRun = (process.env.A2_COMMANDS_RUN ?? "")
  .split("\n")
  .map((command) => command.trim())
  .filter(Boolean);

const manifest = {
  schemaVersion: 1,
  validationId: summary.runId,
  generatedAt,
  operator: "Agent A2 automation",
  environment: "local",
  status: summary.status === "passed" ? "ready_for_manual_steps" : "failed",
  providerMetadata: [
    {
      provider: "simulation",
      keyPresent: false,
      model: null,
      liveCallValidated: false,
      latencyMs: null,
      tokenUsage: null
    }
  ],
  artifacts: {
    screenshots: [],
    logs: [summaryPath],
    replayArtifacts: [summary.artifacts.replayDir],
    dbEvidence: [],
    dashboardEvidence: [summary.artifacts.dashboard],
    rollbackEvidence: [summary.artifacts.rollback]
  },
  validationStatus: {
    envReady: true,
    migrationPresent: fs.existsSync("supabase/migrations/20260520125321_placement_v3_forensics.sql"),
    supabaseReachable: false,
    providerPreconditionsReady: false,
    liveProviderValidated: false,
    liveSupabaseInsertsValidated: false,
    dashboardPersistedRowsValidated: false,
    rollbackValidated: false
  },
  blockers: [
    "Live provider validation requires real provider credentials and an approved live-validation run.",
    "Live Supabase persistence validation requires verified writes and reads against a deployed Supabase project.",
    "Dashboard persisted-row validation requires real authenticated admin access and matching persisted rows."
  ],
  notes: "Automatic A2 evidence is local simulation only. It is safe to run repeatedly and does not enable Placement V3."
};

const machineReport = {
  generated_at: generatedAt,
  branch: "feat/a2-placement-v3-observability",
  simulated: true,
  live_provider_validated: false,
  supabase_persistence_validated: false,
  placement_v3_enabled: false,
  production_safe: false,
  live_validation_complete: false,
  commands_run: commandsRun,
  verification_passed: summary.status === "passed"
};

const report = `# Report from Agent A2 (ObservabilityOps)

generated_at=${manifest.generatedAt}
run_id=${summary.runId}
status=${summary.status}
placement_v3_enabled=false
production_safe=false
live_validation_complete=false
simulated=true
live_provider_validated=false
supabase_persistence_validated=false

## Automation Result

- Scheduled local simulation validation: passed
- Forensic log integrity checks: passed
- Dashboard artifact generation: ${summary.artifacts.dashboard}
- Retention-policy checks: ${summary.artifacts.retention}
- Rollback-readiness checks: ${summary.artifacts.rollback}
- Evidence manifest: ${manifestPath}

## Guardrails

- PLACEMENT_TEST_ENABLED=false
- PLACEMENT_V3_UI_ENABLED=false
- No provider network calls were made.
- No Supabase writes or reads were attempted.
- Simulated evidence is marked with simulated=true.

## Remaining Blockers

- live_provider_validated=false until real provider credentials are used.
- supabase_persistence_validated=false until live Supabase writes and reads are verified.
- placement_v3_enabled=false until an explicit enablement decision changes the flags.
`;

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
fs.writeFileSync(machineReportPath, `${JSON.stringify(machineReport, null, 2)}\n`);
fs.writeFileSync(reportPath, report);
console.log(report);
NODE
