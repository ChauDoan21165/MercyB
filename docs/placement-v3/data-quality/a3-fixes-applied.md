# A3 Fixes Applied

## 2026-05-20T13:10:00-06:00

File changed:

- `scripts/placement-v3/run-corpus-integrity-audit.ts`
- `scripts/placement-v3/run-taxonomy-consistency.ts`
- `scripts/placement-v3/run-recommendation-graph-audit.ts`
- `scripts/placement-v3/run-prompt-rubric-alignment.ts`
- `scripts/placement-v3/dataQualityAuditCore.ts`
- `src/types/placementDataQuality.ts`

Issue fixed:

- No repeatable Placement V3 data-quality scanner existed on `origin/main`.

Rationale:

- Add audit tooling that can detect available placement-data issues while reporting missing requested V3 surfaces as blockers.

Before:

- Corpus/taxonomy/recommendation/prompt-rubric checks were manual and scattered across existing tests.

After:

- A3 has four CLI audit entry points that persist raw JSON outputs under `docs/placement-v3/data-quality/raw-runs/`.

## 2026-05-20T13:10:00-06:00

File changed:

- `supabase/migrations/20260520131000_placement_v3_data_quality.sql`

Issue fixed:

- No database schema existed for storing Placement V3 data-quality audit runs and issue categories.

Rationale:

- Add additive, admin-readable tables for run history and issue persistence.

Before:

- Audit evidence could only live in local files.

After:

- Reviewed migrations can persist integrity, taxonomy, recommendation, and alignment issues.

## 2026-05-20T13:10:00-06:00

File changed:

- `src/pages/admin/PlacementDataQualityDashboard.tsx`
- `src/router/AppRouter.tsx`

Issue fixed:

- Operators had no Placement V3 data-quality dashboard route.

Rationale:

- Add `/admin/placement-data-quality` as an admin-only view over persisted audit data.

Before:

- No operator surface for data-quality audit history.

After:

- Dashboard shows issue counts, taxonomy conflicts, orphan recommendation counts, duplicate prompts, CEFR inconsistencies, unresolved issues, and audit history from real tables.

## Unresolved Instead Of Changed

No linguistic corpus content was normalized in the first A3 pass because the requested runtime Placement V3 corpus was not yet present on `origin/main`. Rewriting or inventing those files would have violated the A3 anti-fabrication rule.

## 2026-05-20T13:08:00-06:00

File changed:

- `scripts/placement-v3/dataQualityAuditCore.ts`

Issue fixed:

- The first text-parser version could truncate nested TypeScript object literals and produce false malformed-entry findings.

Rationale:

- A data-quality tool must not create noisy or false linguistic evidence. The scanner now splits top-level question/catalog entries by stable item starts and supports both single-quoted and double-quoted strings.

Before:

- Temporary raw runs reported parser-derived malformed calibration entries and missing taxonomy metadata.

After:

- Superseded inaccurate raw JSON files were removed. Corrected final raw runs show only verified blockers and available-surface findings.

## 2026-05-20T13:22:00-06:00

File changed:

- `scripts/placement-v3/dataQualityAuditCore.ts`
- `tests/integration/placement-v3-data-quality/data-quality-audits.test.ts`
- `docs/placement-v3/data-quality/a3-*.md`
- `docs/placement-v3/data-quality/PR_BODY.md`

Issue fixed:

- After #942 merged, A3 needed to audit the real runtime V3 corpus instead of continuing to report missing-surface blockers.

Rationale:

- The follow-up task explicitly required rebasing #951 onto latest main, rerunning audits against actual merged V3 files, and replacing the old caveat.

Before:

- Required surfaces pointed at absent docs paths and old orchestrator names.
- Prompt parsing could confuse nested reading/listening question objects with top-level prompt objects.
- Duplicate-prompt checks compared only generic instruction text.

After:

- Required surfaces point at real runtime V3 prompt, calibration, recommender, rubric, grading, session, and migration files.
- V3 prompt parsing reads full top-level prompt objects and embedded questions correctly.
- Duplicate-prompt checks include reading passages and listening scripts.
- Post-#942 raw runs report 0 corpus-integrity issues, 106 taxonomy findings, 1 recommendation warning, and 11 prompt/rubric warnings.

No linguistic meaning was rewritten.
