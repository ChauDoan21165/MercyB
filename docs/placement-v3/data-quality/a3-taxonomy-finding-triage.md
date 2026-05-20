# A3 Taxonomy Finding Triage

Timestamp: 2026-05-20T13:33:00Z

## Before Counts

Source: `docs/placement-v3/data-quality/raw-runs/a3-20260520T132558-*.json`

- Corpus integrity: 0 issues.
- Taxonomy consistency: 106 findings: 48 missing remediation links, 58 unused taxonomy categories.
- Recommendation graph: 1 warning.
- Prompt/rubric alignment: 11 warnings.

## Triage Categories

### Mechanical Safe Fix

- 10 legacy `vi_l1_*` tags were flagged unused because the taxonomy audit only counted deterministic placement question references. Evidence: `src/lib/placement/v3/lessonIndex.ts` and `src/lib/placement/v3/recommender.ts` already reference these tags for V3 recommendations. Fix: count V3 lesson-index coverage IDs and recommender alias targets as audited usage.
- `vi_l1_final_consonants` was flagged as an invalid recommendation alias target. Evidence: `src/lib/placement/v3/lessonIndex.ts` defines it in `L1_RULE_SYNONYMS`, so it is a valid internal recommendation coverage ID even though it is not a legacy weakness-catalog entry.
- Three deterministic placement descriptors had CEFR/skill metadata in structured fields but not in descriptor text. Fix: prefix existing CEFR and `grammar` metadata into `q_a1_009`, `q_a2_009`, and `q_b1_009` descriptors without changing prompts, options, answer keys, or linguistic meaning.

### Needs Expert Review

- 48 legacy weakness tags still have `linkedRoomId: null`. Mapping them to existing rooms requires Chau/linguistic review because many room matches are partial or broad.
- 48 taxonomy categories remain unused by audited placement or V3 recommendation surfaces. These may be detector-only, future calibration targets, or stale taxonomy entries.
- 6 conversation prompts still have no calibration entries. Creating calibration samples would be new linguistic corpus content.
- V3 ID `negation-no-not-placement` remains unused by current V3 prompts/calibration. It may be a future intended diagnostic category.

### Audit False Positive

- The previous `vi_l1_final_consonants` recommendation warning was a scanner assumption bug. It treated only legacy weakness catalog IDs and V3 prompt IDs as valid, while V3 lesson-index coverage IDs are also valid recommendation graph nodes.
- The 10 resolved unused-taxonomy findings were false positives caused by ignoring V3 recommendation usage.

### Intentional Design

- `linkedRoomId: null` is explicitly allowed by `src/lib/weakness/weakness-catalog.ts` for taxonomy entries with no exact existing remediation room.
- Docs-only folders under `docs/placement-v3/calibration/`, `docs/placement-v3/taxonomy/`, and `docs/placement-v3/prompt-library/` remain absent; runtime corpus files under `src/data/placement/v3/` are the audited source for this PR.

## After Counts

Source: `docs/placement-v3/data-quality/raw-runs/a3-20260520T133236-taxonomy-consistency.json`, `a3-20260520T133158-recommendation-graph.json`, `a3-20260520T133158-prompt-rubric-alignment.json`, and `a3-20260520T133158-corpus-integrity.json`.

- Corpus integrity: 0 issues.
- Taxonomy consistency: 96 findings: 48 missing remediation links, 48 unused taxonomy categories.
- Recommendation graph: 0 warnings.
- Prompt/rubric alignment: 6 warnings.

## Safe Fixes Applied

- Updated `scripts/placement-v3/dataQualityAuditCore.ts` to include V3 lesson-index coverage and recommender aliases when deciding whether a legacy taxonomy tag is used.
- Updated `scripts/placement-v3/dataQualityAuditCore.ts` to treat V3 lesson-index coverage IDs as valid recommendation graph nodes.
- Updated three deterministic placement descriptors in `src/lib/placement/questions.ts` to include their existing CEFR and `grammar` labels.

## Unresolved

No remediation-room links were added in this pass. Those mappings are content decisions and need expert review.
