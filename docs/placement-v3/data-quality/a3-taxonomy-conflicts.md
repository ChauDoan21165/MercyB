# A3 Taxonomy Conflicts

Status after rebase onto post-#942 `origin/main`: V3 prompt taxonomy IDs are present in `src/data/placement/v3/prompts/index.ts` and were audited against prompt and calibration references.

## Sources Audited

- `src/data/placement/v3/prompts/index.ts`
- `src/data/placement/v3/prompts/*.ts`
- `src/data/placement/v3/calibration/*.ts`
- `src/lib/weakness/weakness-catalog.ts`

The docs-only directory `docs/placement-v3/taxonomy/` remains absent, so this audit covers runtime taxonomy data, not a separate documentation taxonomy.

## Post-#942 Findings

- Duplicate V3 L1 interference IDs: 0.
- Undefined V3 L1 IDs referenced by prompts or calibration entries: 0.
- V3 L1 IDs unused by prompts or calibration entries: 1, `negation-no-not-placement`.
- Duplicate legacy weakness taxonomy IDs: 0.
- Missing legacy remediation links: 48 `vi_l1_*` weakness tags have `linkedRoomId: null`.
- Legacy weakness tags unused by the deterministic placement question bank: 57.

The unused-category counts do not prove the taxonomy entries are invalid. They identify categories that need an explicit policy: detector-only, future calibration target, or remediation-backed production category.
