#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

bash scripts/observability/a2-branch-guard.sh

OUT_DIR="${1:-reports/placement-v3/a2-observability/manual-retention-check}"
POLICY="docs/placement-v3/observability/retention-policy.md"
MIGRATION="supabase/migrations/20260520125321_placement_v3_forensics.sql"

mkdir -p "$OUT_DIR"

required_policy_terms=(
  "Raw forensic events | 30 days"
  "Failure timelines | 90 days"
  "Runtime alerts | 90 days"
  "Full transcripts must not be stored"
  "Raw audio, signed audio URLs, and voice recordings must not be stored"
  "Secrets"
)

for term in "${required_policy_terms[@]}"; do
  if ! grep -Fq "$term" "$POLICY"; then
    echo "retention_check=failed"
    echo "missing_policy_term=$term"
    exit 1
  fi
done

for table in placement_v3_forensic_events placement_v3_failure_timelines placement_v3_runtime_alerts; do
  if ! grep -Fq "$table" "$MIGRATION"; then
    echo "retention_check=failed"
    echo "missing_migration_table=$table"
    exit 1
  fi
done

cat > "$OUT_DIR/retention-check.json" <<EOF
{
  "generatedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "simulated": true,
  "retention_check": "passed",
  "policy": "$POLICY",
  "migration": "$MIGRATION",
  "live_supabase_rows_scanned": false,
  "supabase_persistence_validated": false
}
EOF

echo "retention_check=passed"
echo "simulated=true"
echo "supabase_persistence_validated=false"
echo "artifact=$OUT_DIR/retention-check.json"
