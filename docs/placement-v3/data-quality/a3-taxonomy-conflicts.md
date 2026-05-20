# A3 Taxonomy Conflicts

The available taxonomy source on `origin/main` is `src/lib/weakness/weakness-catalog.ts`.

The dedicated Placement V3 taxonomy directory requested by A3 is missing:

- `docs/placement-v3/taxonomy/`

Automated checks added:

- duplicate taxonomy IDs
- catalog key vs `entry.tag` mismatch
- missing descriptions/examples
- tags not referenced by the deterministic placement question bank
- missing or broken remediation links

Any conflicts reported in raw runs are limited to this available weakness taxonomy source.

## Final Corrected Findings

- Duplicate taxonomy IDs: 0.
- Undefined referenced categories from placement questions: 0.
- Missing remediation links: 48 weakness taxonomy tags have `linkedRoomId: null`.
- Unused taxonomy categories: 57 weakness taxonomy tags are not referenced by the deterministic placement question bank.

The unused-category count does not mean the tags are invalid; many are detector-only categories. A3 records them because Placement V3 needs an explicit taxonomy-reference policy before production claims.
