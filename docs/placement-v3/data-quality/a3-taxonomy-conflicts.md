# A3 Taxonomy Conflicts

Status after mechanical follow-up: runtime V3 taxonomy references remain internally valid; total taxonomy findings dropped from 106 to 96 without changing taxonomy meaning.

## Sources Audited

- `src/data/placement/v3/prompts/index.ts`
- `src/data/placement/v3/prompts/*.ts`
- `src/data/placement/v3/calibration/*.ts`
- `src/lib/placement/v3/lessonIndex.ts`
- `src/lib/placement/v3/recommender.ts`
- `src/lib/weakness/weakness-catalog.ts`

## Before / After

- Before: 106 taxonomy findings.
- After: 96 taxonomy findings.
- Resolved: 10 unused-taxonomy false positives by counting V3 lesson-index and recommender references as taxonomy usage.

## Current Findings

- Duplicate V3 L1 interference IDs: 0.
- Undefined V3 L1 IDs referenced by prompts or calibration entries: 0.
- V3 L1 IDs unused by prompts or calibration entries: 1, `negation-no-not-placement`.
- Duplicate legacy weakness taxonomy IDs: 0.
- Missing legacy remediation links: 48 `vi_l1_*` weakness tags have `linkedRoomId: null`.
- Legacy weakness tags unused by audited placement or V3 recommendation surfaces: 47, plus the unused V3 ID above for 48 unused-category findings total.

## Unresolved

The 48 missing remediation links require expert review. The catalog explicitly allows `linkedRoomId: null` when no exact room exists, so A3 did not map broad or partial room matches just to reduce counts.
