# A3 Unresolved Risk Matrix

Timestamp: 2026-05-20T14:25:00Z

| Issue | Category | Learner impact | Release impact | Confidence | Requires linguist? | Requires calibration? | Safe for internal launch? | Safe for public launch? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 48 taxonomy IDs have no remediation room link | Missing remediation links | Medium to high if surfaced as learner recommendations; low if kept audit-only | Blocks production-safe remediation claims and broad automated remediation rollout | High: raw audit has exact IDs | Yes | No, unless adding calibration alongside new rooms | Yes, if clearly marked unresolved | No, if surfaced as complete remediation |
| 6 conversation prompts have no calibration entry | Conversation calibration gaps | Medium for conversation placement accuracy; low for non-conversation modalities | Blocks production-safe conversation calibration claims | High: prompt/rubric audit has exact IDs | Yes | Yes | Yes, if conversation calibration is not claimed complete | No, if conversation placement is learner-facing and scored |
| 47 legacy taxonomy IDs are unused by audited placement or V3 recommendation surfaces | Taxonomy ambiguity | Low unless presented as active coverage | Blocks claims of full active taxonomy coverage | High: taxonomy audit has exact IDs | Yes | No | Yes | Conditional: yes if labeled detector-only/future/stale before launch claims |
| `negation-no-not-placement` is unused by prompts/calibration | Taxonomy ambiguity | Low today; medium if expected to be active V3 coverage | Blocks full V3 taxonomy coverage claim | High: taxonomy audit has exact ID | Yes | Maybe, if kept as active prompt coverage | Yes | Conditional: no for full-coverage claims until disposition is recorded |
| Docs-only calibration/taxonomy/prompt-library folders are absent | Documentation source-of-truth gap | Low for runtime; medium for reviewer confusion | Does not block runtime audit, but should be clarified in release docs | High | No | No | Yes | Yes, if runtime files remain declared source of truth |
| Existing build/lint warnings outside A3 | Non-A3 technical backlog | None specific to Placement V3 data quality | Does not block this PR; should not be attributed to A3 | High | No | No | Yes | Yes |

## Notes

- No remaining item is a release blocker for A3 audit infrastructure itself.
- No remaining item supports a production-safe data-quality claim.
- The highest learner-impact risk is wrong remediation routing, not unused taxonomy metadata.
