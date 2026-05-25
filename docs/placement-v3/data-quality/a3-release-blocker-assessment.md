# A3 Release Blocker Assessment

Timestamp: 2026-05-20T14:05:00Z

## Are Any Remaining Findings Launch Blockers?

For A3 audit infrastructure merge: no.

For a production-safe Placement V3 data-quality claim: yes. The remaining remediation and conversation calibration gaps prevent that claim.

For internal enablement of the audit tooling/dashboard: no, provided the PR stays draft or is merged as infrastructure with explicit unresolved expert-review items.

## Which Findings Block Release Claims?

- 48 `missing_remediation_link` warnings. These block claims that every detected taxonomy issue has a validated remediation path.
- 6 `orphaned_rubric_reference` warnings for conversation prompts. These block claims that every V3 prompt has calibration coverage.
- 48 unused taxonomy findings. These block claims that every taxonomy category is actively covered by audited placement or recommendation surfaces.

## Why?

The remaining findings are not parser failures or malformed data. They are ownership gaps:

- A remediation link is a teaching decision, not a mechanical reference fix.
- A conversation calibration entry is corpus content, not metadata cleanup.
- An unused taxonomy category can be intentional future coverage, detector-only telemetry, or stale content. The audit cannot decide without expert review.

## Minimum Fixes Before Internal Enablement

No code fix is required before internal enablement of the A3 tooling.

Minimum process requirements:

- Keep the PR body explicit that there is no production-safe claim.
- Keep raw evidence checked in under `docs/placement-v3/data-quality/raw-runs/`.
- Route `a3-expert-review-queue.md` to Chau or the Placement V3 content owner.
- Ensure operators understand that remediation-link warnings are unresolved content decisions.

## Minimum Fixes Before Soft Launch Or Broad Learner Exposure

- Decide whether conversation placement is in scope. If yes, add calibration entries for `a1-c-mercy-greeting`, `a2-c-weekend-chat`, `b1-c-study-plan`, `b2-c-opinion-followup`, `c1-c-polished-disagreement`, and `c2-c-identity-debate`.
- For any taxonomy ID that can drive learner recommendations, assign a reviewed remediation room or mark it explicitly detector-only.
- Decide the disposition of `negation-no-not-placement`.

## What Can Wait Until Post-Soft-Launch?

- Unused legacy taxonomy categories that are not surfaced to learners and do not drive recommendations.
- Full remediation coverage for advanced or detector-only categories, as long as missing links are not presented as complete learner paths.
- Docs-only folder backfill under `docs/placement-v3/calibration/`, `docs/placement-v3/taxonomy/`, and `docs/placement-v3/prompt-library/`, because runtime V3 files are currently the audited source.

## Current Recommendation

Keep PR #951 draft unless Chau explicitly accepts it as infrastructure-only. The next useful work is expert review of remediation ownership and conversation calibration, not additional mechanical count reduction.
