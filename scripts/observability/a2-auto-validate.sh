#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

bash scripts/observability/a2-branch-guard.sh

RUN_ID="${A2_RUN_ID:-a2-auto-$(date -u +%Y%m%dT%H%M%SZ)}"
OUT_DIR="${A2_OUT_DIR:-reports/placement-v3/a2-observability/$RUN_ID}"
LATEST_DIR="reports/placement-v3/a2-observability/latest"
RAW_DIR="docs/placement-v3/observability/raw-runs"
REPLAY_DIR="$OUT_DIR/replay"
DASHBOARD_DIR="$OUT_DIR/dashboard"

placement_flag_value() {
  local name="$1"
  printf '%s' "${!name:-false}"
}

assert_flag_off() {
  local name="$1"
  local value
  value="$(placement_flag_value "$name")"
  if [ "$value" = "true" ]; then
    echo "Refusing to run with $name=true. Placement V3 must remain disabled for A2 simulation automation." >&2
    exit 1
  fi
}

assert_flag_off PLACEMENT_TEST_ENABLED
assert_flag_off PLACEMENT_V3_UI_ENABLED
assert_flag_off VITE_PLACEMENT_TEST_ENABLED
assert_flag_off VITE_PLACEMENT_V3_UI_ENABLED

mkdir -p "$OUT_DIR" "$REPLAY_DIR" "$DASHBOARD_DIR" "$RAW_DIR" "$(dirname "$LATEST_DIR")"

echo "A2 automatic simulation validation"
echo "run_id=$RUN_ID"
echo "simulated=true"
echo "placement_v3_enabled=false"
echo "production_safe=false"
echo "live_validation_complete=false"
echo "live_provider_validated=false"
echo "supabase_persistence_validated=false"

npx tsx scripts/placement-v3/run-failure-injection.ts --run-id "$RUN_ID" > "$OUT_DIR/failure-injection.json"

for input in "$RAW_DIR"/"$RUN_ID"-*-after.json; do
  [ -e "$input" ] || continue
  base="$(basename "$input" .json)"
  npx tsx scripts/placement-v3/replay-failure-timeline.ts \
    --input "$input" \
    --output "$REPLAY_DIR/$base-replay.json" > /dev/null
done

bash scripts/observability/a2-check-retention.sh "$OUT_DIR" > "$OUT_DIR/retention-check.txt"
bash scripts/observability/a2-check-rollback-readiness.sh "$OUT_DIR" > "$OUT_DIR/rollback-readiness-check.txt"

node --input-type=module - "$RUN_ID" "$OUT_DIR" "$RAW_DIR" "$REPLAY_DIR" "$DASHBOARD_DIR" <<'NODE'
import fs from "node:fs";
import path from "node:path";

const [runId, outDir, rawDir, replayDir, dashboardDir] = process.argv.slice(2);
const scenarios = [
  "provider-timeout",
  "malformed-json-grader-output",
  "provider-fallback",
  "retry-exhaustion",
  "recommendation-engine-failure",
  "taxonomy-parse-failure",
  "persistence-write-failure",
  "feature-flag-mismatch",
  "interrupted-session-recovery",
  "partial-orchestration-corruption",
];

const requiredEventTypes = new Set([
  "session_event",
  "feature_flag_snapshot",
  "orchestration_transition",
]);

const rows = scenarios.map((scenario) => {
  const rawPath = path.join(rawDir, `${runId}-${scenario}-after.json`);
  const replayPath = path.join(replayDir, `${runId}-${scenario}-after-replay.json`);
  const raw = JSON.parse(fs.readFileSync(rawPath, "utf8"));
  const replay = JSON.parse(fs.readFileSync(replayPath, "utf8"));
  const eventTypes = new Set((raw.events ?? []).map((event) => event.type));
  const missingCoreEventTypes = [...requiredEventTypes].filter((type) => !eventTypes.has(type));
  const reconstruction = replay.reconstruction ?? {};
  return {
    scenario,
    simulated: true,
    rawPath,
    replayPath,
    eventCount: raw.events?.length ?? 0,
    eventTypes: [...eventTypes].sort(),
    missingCoreEventTypes,
    missingSequences: reconstruction.missingSequences?.length ?? 0,
    inconsistentRetries: reconstruction.inconsistentRetries ?? [],
    orchestrationDeadEnds: reconstruction.orchestrationDeadEnds ?? [],
    providerSwitches: reconstruction.providerSwitches?.length ?? 0,
    fallbacks: reconstruction.fallbacks?.length ?? 0,
  };
});

const failedRows = rows.filter((row) =>
  row.eventCount === 0 ||
  row.missingCoreEventTypes.length > 0 ||
  row.missingSequences > 0 ||
  row.inconsistentRetries.length > 0
);

const dashboard = {
  generatedAt: new Date().toISOString(),
  runId,
  simulated: true,
  placement_v3_enabled: false,
  live_provider_validated: false,
  supabase_persistence_validated: false,
  totals: {
    scenarios: rows.length,
    failedChecks: failedRows.length,
    providerSwitches: rows.reduce((sum, row) => sum + row.providerSwitches, 0),
    fallbacks: rows.reduce((sum, row) => sum + row.fallbacks, 0),
  },
  rows,
};

fs.writeFileSync(path.join(dashboardDir, "forensic-dashboard-summary.json"), JSON.stringify(dashboard, null, 2));
fs.writeFileSync(path.join(outDir, "validation-summary.json"), JSON.stringify({
  generatedAt: dashboard.generatedAt,
  runId,
  status: failedRows.length === 0 ? "passed" : "failed",
  simulated: true,
  live_provider_validated: false,
  supabase_persistence_validated: false,
  placement_v3_enabled: false,
  artifacts: {
    rawDir,
    replayDir,
    dashboard: path.join(dashboardDir, "forensic-dashboard-summary.json"),
    retention: path.join(outDir, "retention-check.txt"),
    rollback: path.join(outDir, "rollback-readiness-check.txt"),
  },
  failedChecks: failedRows,
}, null, 2));

if (failedRows.length > 0) {
  console.error(JSON.stringify({ failedChecks: failedRows }, null, 2));
  process.exit(1);
}
NODE

rm -f "$LATEST_DIR"
ln -s "$PWD/$OUT_DIR" "$LATEST_DIR"

echo "A2 validation passed"
echo "summary=$OUT_DIR/validation-summary.json"
