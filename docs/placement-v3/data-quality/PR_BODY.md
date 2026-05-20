## Summary

Adds Placement V3 data-quality audit infrastructure for corpus integrity, taxonomy consistency, recommendation graph checks, and prompt/rubric alignment. After rebasing onto merged #942, the PR audits the real runtime V3 prompt/calibration/recommender/rubric files.

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

## Before Counts

- Corpus integrity: 0 issues.
- Taxonomy consistency: 106 findings.
- Recommendation graph: 1 warning.
- Prompt/rubric alignment: 11 warnings.

## Safe Fixes Applied

- Counted V3 lesson-index coverage IDs and recommender alias targets as taxonomy usage.
- Treated V3 lesson-index coverage IDs as valid recommendation graph nodes, resolving the `vi_l1_final_consonants` audit false positive.
- Added existing CEFR/`grammar` labels into three deterministic placement descriptors without changing prompts, options, answer keys, CEFR levels, skills, or taxonomy tags.

## After Counts

- Corpus integrity: 0 issues.
- Taxonomy consistency: 96 findings: 48 missing remediation links and 48 unused taxonomy-category findings.
- Recommendation graph: 0 warnings.
- Prompt/rubric alignment: 6 warnings: all are conversation prompts without calibration entries.

No duplicate prompts, near-duplicate prompts, invalid V3 taxonomy references, orphan CEFR room paths, malformed calibration entries, invalid modality mappings, or missing CEFR labels were found in the merged runtime V3 corpus.

## Unresolved Expert-Review Items

- 6 conversation prompts have no calibration entries.
- 48 legacy weakness taxonomy tags have no remediation room link.
- 47 legacy weakness tags are not referenced by audited placement or V3 recommendation surfaces.
- V3 ID `negation-no-not-placement` is currently unused.
- Docs-only folders `docs/placement-v3/calibration/`, `docs/placement-v3/taxonomy/`, and `docs/placement-v3/prompt-library/` remain absent; runtime V3 files were audited instead.

## Integrity Evidence

- Triage: `docs/placement-v3/data-quality/a3-taxonomy-finding-triage.md`
- Before JSON run artifacts: `docs/placement-v3/data-quality/raw-runs/a3-20260520T132558-*.json`
- After JSON run artifacts: `docs/placement-v3/data-quality/raw-runs/a3-20260520T133236-taxonomy-consistency.json`, `a3-20260520T133158-recommendation-graph.json`, `a3-20260520T133158-prompt-rubric-alignment.json`, `a3-20260520T133158-corpus-integrity.json`
- After logs: `docs/placement-v3/data-quality/raw-runs/a3-*-after-mechanical-fixes.log`
- Final report: `docs/placement-v3/data-quality/a3-final-report.md`

## Verification

- `npm run typecheck` passed.
- `npm run typecheck:ci` passed.
- `npm run build` passed with existing non-fatal Vite warnings.
- `npx vitest run tests/integration/placement-v3-data-quality/data-quality-audits.test.ts` passed.
- `npx tsx scripts/placement-v3/run-taxonomy-consistency.ts` passed.
- `npx tsx scripts/placement-v3/run-recommendation-graph-audit.ts` passed.
- `npx tsx scripts/placement-v3/run-prompt-rubric-alignment.ts` passed.
- `npx tsx scripts/placement-v3/run-corpus-integrity-audit.ts` passed.

## Production Readiness Assessment

Not production-safe yet. Safe mechanical issues were reduced, but unresolved remediation and calibration gaps remain.
