# A3 Final Report

Status after remaining-finding triage: audit infrastructure is complete, the merged Placement V3 runtime corpus has been audited, safe mechanical fixes reduced findings, and the remaining findings are classified into operational buckets. A3 still does not declare data quality production-safe because unresolved taxonomy remediation and conversation calibration gaps remain.

## Corpus Audited

- 44 V3 prompts: 12 writing, 12 speaking, 8 reading, 6 listening, 6 conversation.
- 40 V3 calibration entries: 12 writing, 12 speaking, 8 reading, 8 listening.
- 28 known V3 Vietnamese-L1 interference IDs.
- V3 recommender, lesson index, shared CEFR rubric/types, session, grading, and migration files.

## Before / After Counts

Before mechanical fixes:

- Corpus integrity: 0.
- Taxonomy consistency: 106.
- Recommendation graph: 1.
- Prompt/rubric alignment: 11.

After mechanical fixes:

- Corpus integrity: 0.
- Taxonomy consistency: 96.
- Recommendation graph: 0.
- Prompt/rubric alignment: 6.

Total tracked findings dropped from 118 to 102.

## Remaining Finding Classification

- Safe / informational: 47 unused legacy taxonomy IDs. These are not invalid references; they are defined categories not currently used by audited placement or V3 recommendation surfaces.
- Needs expert linguistic review: 48 missing remediation links, 6 conversation prompts without calibration entries, and the unused V3 ID `negation-no-not-placement`.
- Release blocker for A3 tooling merge: none.
- Release blocker for production-safe data-quality claim: missing remediation ownership, conversation calibration gaps, and unresolved unused taxonomy ownership.
- Audit false positives remaining: none in the current raw output.
- Intentional design: `linkedRoomId: null` is allowed by the catalog, but still flagged because automated remediation needs an owned target.

Detailed queues:

- `docs/placement-v3/data-quality/a3-remaining-findings-triage.md`
- `docs/placement-v3/data-quality/a3-expert-review-queue.md`
- `docs/placement-v3/data-quality/a3-release-blocker-assessment.md`

## Safe Fixes Applied

- Counted V3 lesson-index coverage IDs and recommender alias targets as taxonomy usage in `scripts/placement-v3/dataQualityAuditCore.ts`.
- Treated V3 lesson-index coverage IDs as valid recommendation graph nodes, resolving the `vi_l1_final_consonants` false positive.
- Added existing CEFR/`grammar` labels into three deterministic placement descriptors in `src/lib/placement/questions.ts`.

No prompt text, answer keys, CEFR labels, taxonomy semantics, or remediation mappings were rewritten.

## Remaining Risks

- 6 conversation prompts have no calibration entries.
- 48 legacy `vi_l1_*` weakness tags have no remediation room link.
- 47 legacy weakness tags are not referenced by audited placement or V3 recommendation surfaces.
- V3 ID `negation-no-not-placement` is currently unused by V3 prompts or calibration entries.
- Docs-only folders `docs/placement-v3/calibration/`, `docs/placement-v3/taxonomy/`, and `docs/placement-v3/prompt-library/` remain absent; runtime files were audited instead.

## Taxonomy Trustworthiness Assessment

The merged V3 prompt/calibration references are internally consistent against the 28 known V3 L1 IDs. Taxonomy trustworthiness is not production-safe yet because remediation policy and unused-category ownership are unresolved.

## Recommendation Graph Stability Assessment

CEFR-to-room, non-null remediation links, V3 recommender aliases, and V3 lesson-index coverage IDs now pass the recommendation graph audit with 0 findings.

## Production-Safe?

No. A3 reduced safe mechanical findings, but unresolved remediation and calibration gaps remain and require review.

## Recommended Next Action

Keep PR #951 draft unless Chau explicitly accepts it as infrastructure-only. The next useful work is expert review of remediation-room ownership and conversation calibration, not further mechanical count reduction.

## Verification

- `npm run typecheck` passed.
- `npm run typecheck:ci` passed.
- `npm run build` passed with existing non-fatal Vite warnings.
- `npx vitest run tests/integration/placement-v3-data-quality/data-quality-audits.test.ts` passed.
- `npx tsx scripts/placement-v3/run-taxonomy-consistency.ts` passed and saved `a3-20260520T133236-taxonomy-consistency.json`.
- `npx tsx scripts/placement-v3/run-recommendation-graph-audit.ts` passed and saved `a3-20260520T133158-recommendation-graph.json`.
- `npx tsx scripts/placement-v3/run-prompt-rubric-alignment.ts` passed and saved `a3-20260520T133158-prompt-rubric-alignment.json`.
- `npx tsx scripts/placement-v3/run-corpus-integrity-audit.ts` passed and saved `a3-20260520T133158-corpus-integrity.json`.
