#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

bash scripts/observability/a2-branch-guard.sh

OUT_DIR="${1:-reports/placement-v3/a2-observability/manual-rollback-check}"
RUNBOOK="docs/placement-v3/observability/rollback-runbook.md"

mkdir -p "$OUT_DIR"

required_terms=(
  "Disable Forensic Logging"
  "Disable Replay Persistence"
  "Disable Dashboard Access"
  "Revoke Provider Keys"
  "Stop Forensic Inserts"
  "Clean Up Accidental Sensitive Data"
  "Rollback Evidence Package"
)

for term in "${required_terms[@]}"; do
  if ! grep -Fq "$term" "$RUNBOOK"; then
    echo "rollback_readiness=failed"
    echo "missing_runbook_term=$term"
    exit 1
  fi
done

cat > "$OUT_DIR/rollback-readiness-check.json" <<EOF
{
  "generatedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "simulated": true,
  "rollback_readiness": "passed_for_manual_drill_preconditions",
  "runbook": "$RUNBOOK",
  "live_rollback_drill_validated": false,
  "placement_v3_enabled": false
}
EOF

echo "rollback_readiness=passed_for_manual_drill_preconditions"
echo "simulated=true"
echo "placement_v3_enabled=false"
echo "artifact=$OUT_DIR/rollback-readiness-check.json"
