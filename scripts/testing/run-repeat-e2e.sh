#!/usr/bin/env bash
set -u -o pipefail

ITERATIONS="${ITERATIONS:-${1:-3}}"
PATTERN="${PATTERN:-${2:-placement-v3-vertical}}"
LOG_DIR="${LOG_DIR:-docs/testing/b1-raw-runs}"
ARTIFACT_DIR="${ARTIFACT_DIR:-reports/b1-e2e-diagnostics/repeat-artifacts}"

mkdir -p "$LOG_DIR" "$ARTIFACT_DIR"

pass_count=0
fail_count=0
start_epoch="$(date +%s)"

echo "repeat-e2e start $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "iterations=$ITERATIONS pattern=$PATTERN log_dir=$LOG_DIR"

for i in $(seq 1 "$ITERATIONS"); do
  run_start_epoch="$(date +%s)"
  stamp="$(date -u +%Y%m%d-%H%M%S)"
  log_file="$LOG_DIR/repeat-e2e-${stamp}-run-${i}.log"

  echo "E2E REPEAT RUN $i/$ITERATIONS $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  VITE_PLACEMENT_TEST_ENABLED="${VITE_PLACEMENT_TEST_ENABLED:-true}" \
  VITE_PLACEMENT_V3_UI_ENABLED="${VITE_PLACEMENT_V3_UI_ENABLED:-true}" \
  VITE_SUPABASE_URL="${VITE_SUPABASE_URL:-https://placeholder.invalid.supabase.co}" \
  VITE_SUPABASE_ANON_KEY="${VITE_SUPABASE_ANON_KEY:-placeholder-anon-key-not-real}" \
    npm run test:e2e -- "$PATTERN" 2>&1 | tee "$log_file"
  status="${PIPESTATUS[0]}"
  run_end_epoch="$(date +%s)"
  duration="$((run_end_epoch - run_start_epoch))"

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
    echo "repeat-e2e summary pass=$pass_count fail=$fail_count"
    exit "$status"
  fi
done

end_epoch="$(date +%s)"
echo "repeat-e2e complete $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "repeat-e2e summary pass=$pass_count fail=$fail_count total_duration=$((end_epoch - start_epoch))s"
