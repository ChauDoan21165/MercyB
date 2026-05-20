# Placement V3 Drift Production Risk Report

Generated: 2026-05-20

## Status

Infrastructure is implemented, but production grading stability is not verified until live replay credentials are available and at least three replay cycles complete.

## Known Risks

- Writing replay is blocked because `placement-v3-grade-writing` is absent in this branch.
- Provider retry-path variance is partially observable because current grader `modelTrace` does not expose failover attempts.
- Gemini comparison requires actual failover or a future provider-forcing contract; current shared provider only fails over on OpenAI timeout/rate-limit/upstream failure.
- Taxonomy output uses free-form grader flags, so dashboard grouping depends on fixture taxonomy tags unless raw grader tags are normalized later.

## Regression Evidence

No live replay regression can be honestly claimed until raw outputs exist under `raw-runs/`.

## Production Gate

Do not use A36 drift results to approve prompt/model changes until:

- 40+ fixtures have run through real graders
- raw outputs include provider, model, latency, token counts, and parsed CEFR
- database persistence has been verified
- admin dashboard renders real replay rows
- at least five unstable or explicitly stable borderline cases are documented
- three replay/tuning cycles are complete
