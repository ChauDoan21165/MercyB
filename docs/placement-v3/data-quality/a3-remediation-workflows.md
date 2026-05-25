# A3 Remediation Workflows

Timestamp: 2026-05-20T14:25:00Z

These workflows convert unresolved A3 findings into reviewable operational work. They do not approve any linguistic changes by themselves.

## Missing Remediation Links

Owner: Placement V3 content owner, with Chau final approval for learner-facing paths.

Evidence required:

- Taxonomy ID and current catalog definition.
- Candidate room ID, if any.
- Room title, CEFR level, skill, and lesson objective.
- Short explanation of why the room directly remediates the error pattern.

Review process:

- Open one expert-review intake per taxonomy ID.
- Mark each ID as `approved-room`, `detector-only`, `needs-new-room`, or `reject-link`.
- Do not use keyword similarity alone as evidence.

Approval criteria:

- The room teaches the same linguistic pattern, not just a neighboring grammar topic.
- CEFR level is plausible for the learner weakness.
- The room is accessible to the intended learner tier.

Rollback criteria:

- Learner-facing recommendations point to a room that does not teach the pattern.
- Reviewer later marks the mapping as partial, misleading, or too broad.

## Conversation Calibration Gaps

Owner: Placement V3 calibration owner.

Evidence required:

- Prompt ID.
- At least one representative learner response.
- Expected CEFR behavior and rubric rationale.
- Borderline or weak response when the prompt is used for placement decisions.

Review process:

- Create calibration entries for each prompt only after reviewer approval.
- Compare new entries against existing writing/speaking/reading/listening calibration structure.
- Rerun prompt/rubric alignment and corpus integrity audits after additions.

Approval criteria:

- Calibration response matches prompt modality and CEFR target.
- Expected result is defensible from rubric criteria.
- Entry does not collapse adjacent CEFR bands.

Rollback criteria:

- New calibration creates CEFR inconsistency, duplicate corpus content, malformed metadata, or prompt/rubric mismatch.

## Taxonomy Ambiguity

Owner: Placement V3 taxonomy owner.

Evidence required:

- Taxonomy ID.
- Current definition or category.
- Whether it is runtime-used, detector-only, future coverage, or stale.
- Any overlapping IDs.

Review process:

- Assign disposition: `keep-runtime`, `keep-detector-only`, `future-coverage`, `merge-candidate`, or `deprecate-candidate`.
- Do not merge or delete IDs without checking historical reports and recommendation usage.

Approval criteria:

- Meaning is distinct from existing taxonomy IDs.
- Naming follows current ID conventions.
- Runtime use or non-runtime status is explicit.

Rollback criteria:

- A taxonomy change removes traceability for existing audit evidence, calibration entries, recommendation routing, or learner reports.

## CEFR Uncertainty

Owner: Placement V3 assessment owner.

Evidence required:

- Prompt ID, calibration ID, or taxonomy ID.
- Claimed CEFR level and competing plausible CEFR level.
- Rubric evidence from the current CEFR criteria.
- Example learner response if available.

Review process:

- Require two-pass review: one pass for CEFR level, one pass for modality/rubric alignment.
- Rerun corpus integrity and prompt/rubric alignment audits after approval.

Approval criteria:

- The selected CEFR level matches task complexity, expected output, and rubric band.
- The change does not create impossible CEFR transitions.

Rollback criteria:

- Reclassification causes adjacent-band collapse or conflicts with existing calibration evidence.

## Orphaned Descriptors

Owner: Placement V3 prompt/rubric owner.

Evidence required:

- Prompt or descriptor ID.
- Missing calibration, rubric, modality, CEFR, or taxonomy field.
- Whether the descriptor is runtime-facing or docs-only.

Review process:

- If metadata is missing but meaning is clear, handle as mechanical fix.
- If content must be created or interpreted, route to expert review.

Approval criteria:

- Descriptor has an owned prompt, rubric, CEFR level, modality, and calibration status.
- Metadata reflects existing meaning rather than changing it.

Rollback criteria:

- Metadata addition changes the intended assessment target or introduces mismatched modality.

## Unresolved Expert-Review Items

Owner: Chau or delegated Placement V3 content reviewer.

Evidence required:

- Link to raw audit artifact.
- Exact ID.
- Issue category.
- Release-stage impact.
- Proposed decision and rationale.

Review process:

- Use `docs/placement-v3/data-quality/templates/expert-review-template.md`.
- Batch by launch impact: remediation links first, conversation calibration second, unused taxonomy disposition third.
- Record approvals in follow-up A3 docs before touching runtime data.

Approval criteria:

- Decision is explicit and auditable.
- Any learner-facing change has evidence and rollback criteria.

Rollback criteria:

- A change was made without evidence, reviewer sign-off, or updated audit output.
