#!/usr/bin/env bash
set -u -o pipefail

ITERATIONS="${ITERATIONS:-${1:-3}}"
LOG_DIR="${LOG_DIR:-docs/testing/b1-raw-runs}"

mkdir -p "$LOG_DIR"

pass_count=0
fail_count=0
total_seconds=0
start_epoch="$(date +%s)"

echo "repeat-unit start $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "iterations=$ITERATIONS log_dir=$LOG_DIR"

for i in $(seq 1 "$ITERATIONS"); do
  run_start_epoch="$(date +%s)"
  stamp="$(date -u +%Y%m%d-%H%M%S)"
  log_file="$LOG_DIR/repeat-unit-${stamp}-run-${i}.log"

  echo "UNIT REPEAT RUN $i/$ITERATIONS $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  npm test 2>&1 | tee "$log_file"
  status="${PIPESTATUS[0]}"
  run_end_epoch="$(date +%s)"
  duration="$((run_end_epoch - run_start_epoch))"
  total_seconds="$((total_seconds + duration))"

  if [ "$status" -eq 0 ]; then
    pass_count="$((pass_count + 1))"
    echo "UNIT REPEAT RUN $i PASS duration=${duration}s log=$log_file"
  else
    fail_count="$((fail_count + 1))"
    echo "UNIT REPEAT RUN $i FAIL status=$status duration=${duration}s log=$log_file"
    echo "repeat-unit summary pass=$pass_count fail=$fail_count total_duration=${total_seconds}s"
    exit "$status"
  fi
done

end_epoch="$(date +%s)"
echo "repeat-unit complete $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "repeat-unit summary pass=$pass_count fail=$fail_count total_duration=$((end_epoch - start_epoch))s measured_test_duration=${total_seconds}s"
