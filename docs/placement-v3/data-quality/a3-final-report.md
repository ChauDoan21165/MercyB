# A3 Final Report

Status after rebase onto post-#942 `origin/main`: audit infrastructure is complete and the real merged Placement V3 runtime corpus has been audited. A3 does not declare data quality production-safe because unresolved taxonomy, calibration, and recommendation warnings remain.

## Corpus Audited

- 44 V3 prompts: 12 writing, 12 speaking, 8 reading, 6 listening, 6 conversation.
- 40 V3 calibration entries: 12 writing, 12 speaking, 8 reading, 8 listening.
- 28 known V3 Vietnamese-L1 interference IDs.
- V3 recommender, lesson index, shared CEFR rubric/types, session, grading, and migration files.

## Total Issues Found

Post-#942 final audit counts:

- Corpus integrity: 0.
- Taxonomy consistency: 106.
- Recommendation graph: 1.
- Prompt/rubric alignment: 11.

Across the four post-#942 audit outputs: 118 issue records, with 0 blockers and 0 errors. The remaining records are warnings/info findings, not production-safe certification.

## Issues Fixed

- Rebased A3 onto merged #942 Placement V3 integration.
- Updated required audit surfaces from missing docs paths to actual runtime V3 corpus/prompt/taxonomy/recommender files.
- Fixed V3 prompt parsing so nested reading/listening question objects are not treated as standalone prompts.
- Fixed duplicate-prompt detection to include reading passages and listening scripts, avoiding false duplicates on generic instructions such as “Read the passage...”.
- Updated integration tests to assert real merged V3 surfaces and counts instead of old missing-surface blockers.

No linguistic meaning was rewritten.

## Remaining Risks

- 6 conversation prompts have no calibration entries.
- `vi_l1_final_consonants` in `src/lib/placement/v3/recommender.ts` is not defined in the legacy or V3 taxonomy catalogs.
- 48 legacy `vi_l1_*` weakness tags have no remediation room link.
- 57 legacy weakness tags are not referenced by the deterministic placement question bank.
- V3 ID `negation-no-not-placement` is currently unused by V3 prompts or calibration entries.
- Docs-only folders `docs/placement-v3/calibration/`, `docs/placement-v3/taxonomy/`, and `docs/placement-v3/prompt-library/` remain absent; runtime files were audited instead.

## Taxonomy Trustworthiness Assessment

The merged V3 prompt/calibration references are internally consistent against the 28 known V3 L1 IDs. Taxonomy trustworthiness is not production-safe yet because remediation policy and alias ownership are unresolved.

## Recommendation Graph Stability Assessment

CEFR-to-room and non-null remediation room links are not orphaned in the audited files. Recommendation graph stability remains draft because one V3 alias points to an undefined taxonomy ID.

## Production-Safe?

No. A3 found no blockers/errors in the post-#942 runtime corpus audit, but unresolved taxonomy/remediation/calibration warnings mean Placement V3 data quality should stay draft until reviewed and resolved.

## Verification

- `npm run typecheck` passed.
- `npm run typecheck:ci` passed.
- `npm run build` passed with existing non-fatal Vite warnings.
- `npx vitest run tests/integration/placement-v3-data-quality/data-quality-audits.test.ts` passed: 17 tests.
- `npx tsx scripts/placement-v3/run-corpus-integrity-audit.ts` passed and saved `a3-20260520T132558-corpus-integrity.json`.
- `npx tsx scripts/placement-v3/run-taxonomy-consistency.ts` passed and saved `a3-20260520T132558-taxonomy-consistency.json`.
- `npx tsx scripts/placement-v3/run-recommendation-graph-audit.ts` passed and saved `a3-20260520T132558-recommendation-graph.json`.
- `npx tsx scripts/placement-v3/run-prompt-rubric-alignment.ts` passed and saved `a3-20260520T132558-prompt-rubric-alignment.json`.

The command outputs are saved under `docs/placement-v3/data-quality/raw-runs/`.
