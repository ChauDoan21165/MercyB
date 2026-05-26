#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

bash scripts/observability/a2-branch-guard.sh

LOG_DIR="reports/placement-v3/a2-observability/logs"
mkdir -p "$LOG_DIR"

LOG_PATH="$LOG_DIR/a2-auto-$(date -u +%Y%m%dT%H%M%SZ).log"
COMMANDS_RUN=$'npm run placement:a2:validate\nnpm run placement:a2:evidence\nnpm run placement:a2:retention -- reports/placement-v3/a2-observability/latest\nnpm run placement:a2:rollback -- reports/placement-v3/a2-observability/latest'

run_step() {
  local label="$1"
  shift
  echo "command=$label"
  "$@"
}

{
  echo "A2 automatic entrypoint"
  echo "generated_at=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "placement_v3_enabled=false"
  echo "production_safe=false"
  echo "live_validation_complete=false"
  echo "simulated=true"
  echo "live_provider_validated=false"
  echo "supabase_persistence_validated=false"

  run_step "npm run placement:a2:validate" npm run placement:a2:validate
  A2_COMMANDS_RUN="$COMMANDS_RUN" run_step "npm run placement:a2:evidence" npm run placement:a2:evidence
  run_step "npm run placement:a2:retention -- reports/placement-v3/a2-observability/latest" npm run placement:a2:retention -- reports/placement-v3/a2-observability/latest
  run_step "npm run placement:a2:rollback -- reports/placement-v3/a2-observability/latest" npm run placement:a2:rollback -- reports/placement-v3/a2-observability/latest

  EVIDENCE_PATH="reports/placement-v3/a2-observability/latest/evidence-report.json"
  echo "log_path=$LOG_PATH"
  echo "final_evidence_path=$EVIDENCE_PATH"
} 2>&1 | tee "$LOG_PATH"
