# A3 Taxonomy Governance Recommendations

Timestamp: 2026-05-20T14:25:00Z

## Adding New Taxonomy Items

- Add one taxonomy item per distinct Vietnamese-L1 interference pattern.
- Record the intended status: `runtime`, `detector-only`, `future-coverage`, or `deprecated-candidate`.
- Include CEFR range, modality relevance, learner-visible risk, and owner.
- Add or update audit evidence in the same PR.

## Naming Standards

- Use stable lowercase IDs.
- Use `vi_l1_` for legacy weakness-catalog IDs.
- Use kebab-case for V3 prompt-library L1 IDs only where the current V3 source already uses that convention.
- Do not create near-synonyms without documenting why the new category is distinct.
- Avoid IDs based only on implementation surfaces; name the linguistic pattern.

## Remediation Requirements

- A learner-facing taxonomy item must have either an approved remediation room or an explicit `detector-only` / `needs-new-room` status.
- A room link must be approved by content review, not inferred from keyword overlap.
- If no exact room exists, keep `linkedRoomId: null` and document the reason instead of forcing a weak match.

## Calibration Requirements

- Any prompt used for scored placement should have calibration coverage or an explicit out-of-scope status.
- Calibration entries must include representative learner responses and expected CEFR/rubric rationale.
- Borderline cases should be prioritized for prompts that separate adjacent CEFR bands.

## Review Ownership

- Chau owns final approval for learner-facing remediation and launch claims.
- Placement V3 content owner owns taxonomy disposition.
- Placement V3 assessment owner owns CEFR and calibration approval.
- A3 owns audit tooling, evidence capture, and reporting, not linguistic decisions.

## Anti-Duplication Rules

- Before adding a taxonomy ID, search current V3 IDs, legacy weakness tags, lesson-index coverage IDs, and recommender aliases.
- If two IDs overlap, document the boundary or mark one as a merge candidate.
- Do not delete unused IDs solely because they are unused; first classify them as detector-only, future, stale, or duplicate.
- Do not weaken audit rules to make counts smaller.

## Required Checks For Taxonomy PRs

- `npx tsx scripts/placement-v3/run-taxonomy-consistency.ts`
- `npx tsx scripts/placement-v3/run-recommendation-graph-audit.ts`
- `npx tsx scripts/placement-v3/run-prompt-rubric-alignment.ts`
- `npx tsx scripts/placement-v3/run-corpus-integrity-audit.ts`
- `npm run typecheck`
- `npm run typecheck:ci`
- `npm run build`

## Governance Principle

Unknown is an acceptable state when it is explicit. A weak or invented remediation is worse than an unresolved finding.
