# A3 Launch Impact Mapping

Timestamp: 2026-05-20T14:25:00Z

## Internal-Only Launch

Allowed:

- A3 audit tooling.
- Data-quality dashboard.
- Raw audit evidence.
- Known unresolved findings, if clearly labeled.

Blocked:

- Production-safe data-quality claim.

## Staff-Only Pilot

Allowed:

- Staff review of Placement V3 outputs with audit warnings visible.
- Manual inspection of remediation recommendations.

Blocked:

- Automatic learner-facing remediation for IDs with missing room links.
- Claims that conversation calibration is complete.

## Invite-Only Pilot

Allowed:

- Limited learner testing if unsupported remediation paths are hidden or manually reviewed.
- Non-conversation modalities if current corpus integrity remains clean.

Blocked:

- Scored conversation placement unless the 6 conversation prompts receive approved calibration or are excluded from scored decisions.
- Public-facing coverage claims for every taxonomy category.

## Soft Launch

Allowed only after:

- Any learner-facing remediation links are expert-approved or marked detector-only.
- Conversation calibration scope is explicitly decided.
- `negation-no-not-placement` disposition is recorded.

Blocked:

- Broad automated remediation routing while missing links can surface to learners.
- Production-safe taxonomy coverage claims.

## Public Launch

Allowed only after:

- Remediation ownership is resolved for learner-facing taxonomy IDs.
- Conversation prompts either have calibration or are explicitly out of scored placement.
- Unused taxonomy categories have documented dispositions.
- A fresh audit run confirms no new blockers.

Blocked:

- Any claim that Placement V3 data quality is production-safe based solely on this PR.

## Summary

The current A3 state is acceptable for infrastructure review and internal governance. It is not sufficient for public launch claims about complete taxonomy coverage, complete remediation, or complete conversation calibration.
