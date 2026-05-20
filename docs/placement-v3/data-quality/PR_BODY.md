## Summary

Adds Placement V3 data-quality audit infrastructure for corpus integrity, taxonomy consistency, recommendation graph checks, and prompt/rubric alignment. After rebasing onto the merged #942 Placement V3 integration, the PR now audits the real runtime V3 prompt/calibration/recommender/rubric files.

This remains a draft PR. It does not claim Placement V3 data quality is production-safe.

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

## Post-#942 Corpus Coverage

- 44 V3 prompts: 12 writing, 12 speaking, 8 reading, 6 listening, 6 conversation.
- 40 V3 calibration entries: 12 writing, 12 speaking, 8 reading, 8 listening.
- 28 known V3 Vietnamese-L1 interference IDs.
- V3 recommender, lesson index, shared CEFR rubric/types, session/grading files, and V3 migrations.

## Issues Found

Post-#942 final audit outputs:

- Corpus integrity: 0 issues.
- Taxonomy consistency: 106 findings: 48 missing remediation links and 58 unused taxonomy-category findings.
- Recommendation graph: 1 warning: `vi_l1_final_consonants` alias target is not defined in legacy or V3 taxonomy catalogs.
- Prompt/rubric alignment: 11 warnings: 6 conversation prompts without calibration entries, 2 CEFR descriptor gaps, and 3 descriptor/category gaps on Vietnamese-L1 deterministic placement prompts.

No duplicate prompts, near-duplicate prompts, invalid V3 taxonomy references, orphan CEFR room paths, malformed calibration entries, invalid modality mappings, or missing CEFR labels were found in the merged runtime V3 corpus.

## Fixes Applied

- Rebases A3 tooling onto post-#942 `origin/main`.
- Updates audit required surfaces from missing docs paths to actual runtime V3 corpus/prompt/taxonomy/recommender files.
- Fixes V3 prompt parsing so nested reading/listening question objects are not treated as standalone prompts.
- Fixes duplicate-prompt detection to include reading passages and listening scripts.
- Updates A3 integration tests from missing-corpus expectations to real post-#942 corpus expectations.

No linguistic meaning was rewritten.

## Remaining Risks

- 6 conversation prompts have no calibration entries.
- `vi_l1_final_consonants` alias ownership needs review before A3 can mark recommendation taxonomy stable.
- 48 legacy weakness taxonomy tags have no remediation room link.
- 57 legacy weakness tags are not referenced by the deterministic placement question bank.
- V3 ID `negation-no-not-placement` is currently unused.
- Docs-only folders `docs/placement-v3/calibration/`, `docs/placement-v3/taxonomy/`, and `docs/placement-v3/prompt-library/` remain absent; runtime V3 files were audited instead.

## Integrity Evidence

- Raw post-#942 runs and logs: `docs/placement-v3/data-quality/raw-runs/post942-*.log`
- JSON run artifacts: `docs/placement-v3/data-quality/raw-runs/a3-20260520T132558-*.json`
- Integrity findings: `docs/placement-v3/data-quality/a3-integrity-findings.md`
- Taxonomy findings: `docs/placement-v3/data-quality/a3-taxonomy-conflicts.md`
- Recommendation findings: `docs/placement-v3/data-quality/a3-recommendation-gaps.md`
- Prompt/rubric findings: `docs/placement-v3/data-quality/a3-prompt-rubric-gaps.md`
- Final report: `docs/placement-v3/data-quality/a3-final-report.md`

## Verification

- `npm run typecheck` passed.
- `npm run typecheck:ci` passed.
- `npm run build` passed with existing non-fatal Vite warnings.
- `npx vitest run tests/integration/placement-v3-data-quality/data-quality-audits.test.ts` passed: 17 tests.
- `npx tsx scripts/placement-v3/run-corpus-integrity-audit.ts` passed.
- `npx tsx scripts/placement-v3/run-taxonomy-consistency.ts` passed.
- `npx tsx scripts/placement-v3/run-recommendation-graph-audit.ts` passed.
- `npx tsx scripts/placement-v3/run-prompt-rubric-alignment.ts` passed.

## Production Readiness Assessment

Not production-safe yet. The post-#942 runtime corpus audit has no blockers or errors, but unresolved taxonomy/remediation/calibration warnings remain and require review.
