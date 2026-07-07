# AAK Lifecycle Transition Rules

rule_set_id: `aak-lifecycle-transition-rules`
version: `1.0.0`
mode: `ADVISORY_VALIDATION_ONLY`

This artifact defines deterministic lifecycle transition validation for the admin AAK validator. It is read-only validation data and does not change product runtime behavior, database policy, or deployment behavior.

## Allowed Transitions

| Transition | Required artifacts | Rule diagnostic |
| --- | --- | --- |
| `DRAFT->PLANNING_APPROVED` | `owner_team` | `LIFECYCLE_DRAFT_APPROVAL_EVIDENCE_REQUIRED` |
| `ENGINEERING_VALIDATED->JUDGE_REVIEWED` | `evidence_bundle_ref`, `judge_package_ref` | `LIFECYCLE_JUDGE_REVIEW_EVIDENCE_REQUIRED` |
| `PLANNING_APPROVED->ENGINEERING_VALIDATED` | `execution_record_ref`, `rollback_ref`, `validation_report_ref` | `LIFECYCLE_ENGINEERING_VALIDATION_EVIDENCE_REQUIRED` |

## Deterministic Failure Diagnostics

| Diagnostic | Meaning |
| --- | --- |
| `LIFECYCLE_TRANSITION_MISSING` | The execution record did not provide both `transition.from` and `transition.to`. |
| `LIFECYCLE_TRANSITION_NOT_ALLOWED` | The requested `from->to` transition is not listed in the rule set. |
| `LIFECYCLE_ARTIFACT_REQUIRED` | The transition is allowed, but the execution record is missing a required artifact. |

## Validation Contract

- Valid transitions are advisory and non-blocking for product/runtime flows; the admin validator exits `0`.
- Invalid transitions exit non-zero with a stable `field`, `reason`, `diagnostic_code`, `actual`, and sorted `allowed` transition list.
- Missing required artifacts exit non-zero with a stable `field`, `reason`, `diagnostic_code`, and `transition`.
- The rule file is loaded read-only by `scripts/admin/aak.mjs validate-lifecycle`.
