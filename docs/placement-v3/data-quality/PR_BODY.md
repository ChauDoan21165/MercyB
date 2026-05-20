## Summary

Adds Placement V3 data-quality audit infrastructure for corpus integrity, taxonomy consistency, recommendation graph checks, and prompt/rubric alignment. This is an infrastructure PR, not a claim that the full Placement V3 corpus is production-safe.

## Audit Categories

- duplicate prompts
- near-duplicate prompts
- invalid taxonomy references
- orphan recommendation paths
- impossible CEFR transitions
- malformed calibration entries
- prompt/rubric mismatch
- unused taxonomy categories
- missing remediation mappings
- inconsistent modality metadata

## Issues Found

Corrected final audit outputs:

- Corpus integrity: 6 missing required Placement V3 surface blockers.
- Taxonomy consistency: 111 findings: 6 missing-surface blockers, 48 missing remediation links, 57 taxonomy tags unused by the deterministic placement question bank.
- Recommendation graph: 6 missing required Placement V3 surface blockers.
- Prompt/rubric alignment: 11 findings: 6 missing-surface blockers plus 5 Vietnamese-L1 descriptor alignment warnings.

## Fixes Applied

- Added four audit CLI scripts under `scripts/placement-v3/`.
- Added shared data-quality types.
- Added audit persistence migration.
- Added `/admin/placement-data-quality` dashboard route.
- Added 16 integration scenarios and 8 dashboard e2e flows.
- Fixed a scanner parser bug before final evidence capture.

## Remaining Risks

Full Placement V3 corpus validation is blocked on missing files/directories on `origin/main`:

- `docs/placement-v3/calibration/`
- `docs/placement-v3/taxonomy/`
- `docs/placement-v3/prompt-library/`
- `src/lib/recommendations/`
- `supabase/functions/placement-v3-grade-writing/index.ts`
- `supabase/functions/placement-v3-session-orchestrator/index.ts`

A35 adaptive generation docs were also not present on `origin/main`.

## Integrity Evidence

- Raw runs and verification logs: `docs/placement-v3/data-quality/raw-runs/`
- Initial audit: `docs/placement-v3/data-quality/a3-initial-audit.md`
- Blockers: `docs/placement-v3/data-quality/a3-blockers.md`
- Fix log: `docs/placement-v3/data-quality/a3-fixes-applied.md`
- Final report: `docs/placement-v3/data-quality/a3-final-report.md`

Verification:

- `npm run typecheck` passed 3 consecutive times.
- `npm run typecheck:ci` passed 3 consecutive times.
- `npm run build` passed 3 consecutive times.
- `npx vitest run tests/integration/placement-v3-data-quality/data-quality-audits.test.ts` passed: 16 tests.
- `npx playwright test -c playwright.smoke.config.ts tests/e2e/placement-data-quality-dashboard.spec.ts` discovered 8 dashboard flows; all skipped because `RUN_ADMIN_DASHBOARD_E2E=1` was not set.
- `npx tsc -p tsconfig.scripts.json --noEmit` still fails only on existing unrelated script errors; A3 script paths no longer appear.

## Production Readiness Assessment

Not production-safe yet. The audit infrastructure is ready, but the requested Placement V3 corpus surfaces are missing, so A3 cannot honestly certify Placement V3 data quality.
