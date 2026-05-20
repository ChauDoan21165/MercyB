#!/usr/bin/env bash
set -u -o pipefail

ITERATIONS="${ITERATIONS:-${1:-3}}"
PATTERN="${PATTERN:-${2:-placement-v3-vertical}}"
LOG_DIR="${LOG_DIR:-docs/testing/b1-raw-runs}"
ARTIFACT_DIR="${ARTIFACT_DIR:-reports/b1-e2e-diagnostics/repeat-artifacts}"
SUMMARY_JSON="${SUMMARY_JSON:-$LOG_DIR/repeat-e2e-summary.json}"
CLUSTER_JSON="${CLUSTER_JSON:-$LOG_DIR/repeat-e2e-flaky-summary.json}"
RUN_PREFIX="${RUN_PREFIX:-repeat-e2e}"
E2E_PORT="${E2E_PORT:-$((3200 + (RANDOM % 2000)))}"
E2E_BASE_URL="${TEST_BASE_URL:-http://127.0.0.1:${E2E_PORT}}"

mkdir -p "$LOG_DIR" "$ARTIFACT_DIR"

pass_count=0
fail_count=0
total_seconds=0
run_json_entries=""
start_epoch="$(date +%s)"
start_iso="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

echo "repeat-e2e start $start_iso"
echo "iterations=$ITERATIONS pattern=$PATTERN log_dir=$LOG_DIR artifact_dir=$ARTIFACT_DIR summary_json=$SUMMARY_JSON cluster_json=$CLUSTER_JSON base_url=$E2E_BASE_URL"

for i in $(seq 1 "$ITERATIONS"); do
  run_start_epoch="$(date +%s)"
  run_start_iso="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  stamp="$(date -u +%Y%m%d-%H%M%S)"
  log_file="$LOG_DIR/${RUN_PREFIX}-${stamp}-run-${i}.log"

  echo "E2E REPEAT RUN $i/$ITERATIONS $run_start_iso"
  VITE_PLACEMENT_TEST_ENABLED="${VITE_PLACEMENT_TEST_ENABLED:-true}" \
  VITE_PLACEMENT_V3_UI_ENABLED="${VITE_PLACEMENT_V3_UI_ENABLED:-true}" \
  VITE_SUPABASE_URL="${VITE_SUPABASE_URL:-https://placeholder.invalid.supabase.co}" \
  VITE_SUPABASE_ANON_KEY="${VITE_SUPABASE_ANON_KEY:-placeholder-anon-key-not-real}" \
  TEST_PORT="$E2E_PORT" \
  TEST_BASE_URL="$E2E_BASE_URL" \
    npm run test:e2e -- "$PATTERN" 2>&1 | tee "$log_file"
  status="${PIPESTATUS[0]}"
  run_end_epoch="$(date +%s)"
  run_end_iso="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  duration="$((run_end_epoch - run_start_epoch))"
  total_seconds="$((total_seconds + duration))"
  if [ -n "$run_json_entries" ]; then
    run_json_entries="$run_json_entries,"
  fi
  run_json_entries="$run_json_entries{\"run\":$i,\"status\":$status,\"startedAt\":\"$run_start_iso\",\"endedAt\":\"$run_end_iso\",\"durationSeconds\":$duration,\"log\":\"$log_file\"}"

  if [ "$status" -eq 0 ]; then
    pass_count="$((pass_count + 1))"
    echo "E2E REPEAT RUN $i PASS duration=${duration}s log=$log_file"
  else
    fail_count="$((fail_count + 1))"
    echo "E2E REPEAT RUN $i FAIL status=$status duration=${duration}s log=$log_file"
    if [ -d test-results ]; then
      cp -R test-results "$ARTIFACT_DIR/test-results-${stamp}-run-${i}" || true
    fi
    if [ -d playwright-smoke-report ]; then
      cp -R playwright-smoke-report "$ARTIFACT_DIR/playwright-smoke-report-${stamp}-run-${i}" || true
    fi
    cat > "$SUMMARY_JSON" <<JSON
{
  "type": "e2e-repeat",
  "startedAt": "$start_iso",
  "endedAt": "$run_end_iso",
  "iterations": $ITERATIONS,
  "pattern": "$PATTERN",
  "baseUrl": "$E2E_BASE_URL",
  "passCount": $pass_count,
  "failCount": $fail_count,
  "totalDurationSeconds": $((run_end_epoch - start_epoch)),
  "measuredTestDurationSeconds": $total_seconds,
  "logDir": "$LOG_DIR",
  "artifactDir": "$ARTIFACT_DIR",
  "runs": [$run_json_entries]
}
JSON
    npx tsx scripts/testing/detect-flaky-patterns.ts "$LOG_DIR" --json "$CLUSTER_JSON" >/dev/null || true
    echo "repeat-e2e summary pass=$pass_count fail=$fail_count summary_json=$SUMMARY_JSON cluster_json=$CLUSTER_JSON artifact_dir=$ARTIFACT_DIR"
    exit "$status"
  fi
done

end_epoch="$(date +%s)"
end_iso="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
cat > "$SUMMARY_JSON" <<JSON
{
  "type": "e2e-repeat",
  "startedAt": "$start_iso",
  "endedAt": "$end_iso",
  "iterations": $ITERATIONS,
  "pattern": "$PATTERN",
  "baseUrl": "$E2E_BASE_URL",
  "passCount": $pass_count,
  "failCount": $fail_count,
  "totalDurationSeconds": $((end_epoch - start_epoch)),
  "measuredTestDurationSeconds": $total_seconds,
  "logDir": "$LOG_DIR",
  "artifactDir": "$ARTIFACT_DIR",
  "runs": [$run_json_entries]
}
JSON

if npx tsx scripts/testing/detect-flaky-patterns.ts "$LOG_DIR" --json "$CLUSTER_JSON" >/dev/null; then
  detector_status=0
else
  detector_status=$?
fi
echo "repeat-e2e complete $end_iso"
echo "repeat-e2e summary pass=$pass_count fail=$fail_count total_duration=$((end_epoch - start_epoch))s measured_test_duration=${total_seconds}s summary_json=$SUMMARY_JSON cluster_json=$CLUSTER_JSON artifact_dir=$ARTIFACT_DIR"
if [ "$detector_status" -ne 0 ]; then
  echo "repeat-e2e instability detected by flaky-pattern detector"
  exit "$detector_status"
fi
