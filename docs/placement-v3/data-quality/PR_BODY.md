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

## Remaining Finding Classification

- Safe / informational: 47 unused legacy taxonomy IDs. These are defined but not referenced by audited placement or V3 recommendation surfaces.
- Needs expert linguistic review: 48 missing remediation links, 6 conversation prompts without calibration entries, and unused V3 ID `negation-no-not-placement`.
- Release blocker for A3 tooling merge: none found.
- Release blocker for a production-safe data-quality claim: unresolved remediation ownership, conversation calibration gaps, and unused taxonomy ownership.
- Audit false positives remaining: none in the current raw output.
- Intentional design: `linkedRoomId: null` is allowed by the catalog, but flagged because remediation automation needs an owned target.

## Unresolved Expert-Review Items

- 6 conversation prompts have no calibration entries.
- 48 legacy weakness taxonomy tags have no remediation room link.
- 47 legacy weakness tags are not referenced by audited placement or V3 recommendation surfaces.
- V3 ID `negation-no-not-placement` is currently unused.
- Docs-only folders `docs/placement-v3/calibration/`, `docs/placement-v3/taxonomy/`, and `docs/placement-v3/prompt-library/` remain absent; runtime V3 files were audited instead.

## Integrity Evidence

- Triage: `docs/placement-v3/data-quality/a3-taxonomy-finding-triage.md`
- Remaining findings triage: `docs/placement-v3/data-quality/a3-remaining-findings-triage.md`
- Expert review queue: `docs/placement-v3/data-quality/a3-expert-review-queue.md`
- Release blocker assessment: `docs/placement-v3/data-quality/a3-release-blocker-assessment.md`
- Remediation workflows: `docs/placement-v3/data-quality/a3-remediation-workflows.md`
- Expert review template: `docs/placement-v3/data-quality/templates/expert-review-template.md`
- Unresolved-risk matrix: `docs/placement-v3/data-quality/a3-unresolved-risk-matrix.md`
- Remediation priority queue: `docs/placement-v3/data-quality/a3-remediation-priority-queue.md`
- Launch impact mapping: `docs/placement-v3/data-quality/a3-launch-impact.md`
- Taxonomy governance: `docs/placement-v3/data-quality/a3-taxonomy-governance.md`
- Before JSON run artifacts: `docs/placement-v3/data-quality/raw-runs/a3-20260520T132558-*.json`
- After JSON run artifacts: `docs/placement-v3/data-quality/raw-runs/a3-20260520T133236-taxonomy-consistency.json`, `a3-20260520T133158-recommendation-graph.json`, `a3-20260520T133158-prompt-rubric-alignment.json`, `a3-20260520T133158-corpus-integrity.json`
- After logs: `docs/placement-v3/data-quality/raw-runs/a3-*-after-mechanical-fixes.log`
- Final report: `docs/placement-v3/data-quality/a3-final-report.md`

## Governance Workflow Status

- Missing remediation links now have an explicit review workflow, evidence requirements, approval criteria, and rollback criteria.
- Conversation calibration gaps now have an expert-review and calibration workflow.
- Taxonomy ambiguity, CEFR uncertainty, orphaned descriptors, and unresolved expert-review items now have documented ownership and approval paths.
- Expert-review intake is standardized in `docs/placement-v3/data-quality/templates/expert-review-template.md`.
- A3 remains responsible for audit tooling and evidence, not linguistic approvals.

## Launch-Stage Impact

- Internal-only launch: allowed for tooling/dashboard with unresolved findings visible.
- Staff-only pilot: allowed with manual review; blocks automatic learner-facing remediation for missing links.
- Invite-only pilot: allowed only if unsupported remediation paths are hidden or reviewed.
- Soft launch: blocked until learner-facing remediation links have disposition and conversation calibration scope is decided.
- Public launch: blocked until remediation ownership, conversation calibration or exclusion, unused taxonomy dispositions, and a fresh audit are complete.

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

Not production-safe yet. Safe mechanical issues were reduced and remaining findings are classified, but unresolved remediation and calibration gaps remain.

## Recommended Next Action

Keep this PR draft unless Chau accepts it as infrastructure-only. The next useful work is to run the expert-review workflow, starting with learner-facing remediation links and conversation calibration scope.
