# Adaptive Item Generation Methodology

Generated: 2026-05-20

## Goal

A35 tests whether AI-generated Placement V3 items can safely supplement or replace a static prompt bank. The pipeline is intentionally rejection-heavy: generation is not success unless validation proves CEFR fit, safety, Vietnamese-L1 relevance, rubric compatibility, duplicate risk, and learner usability.

## Pipeline

1. Generate one item for a modality, target CEFR, learner L1, skill focus, and difficulty constraints.
2. Validate the generated item with a separate low-temperature model call.
3. Reject any item that fails CEFR fit, safety, age-appropriateness, cultural neutrality, Vietnamese-L1 relevance, duplicate risk, rubric compatibility, or mobile learner usability.
4. Persist raw generation and validation responses under `docs/placement-v3/adaptive-generation/raw-runs/`.
5. Group rejection reasons.
6. Make exactly one prompt-version improvement per cycle.
7. Rerun and compare acceptance rate, validation scores, cost per accepted item, latency, and rejection categories.

## Evidence Requirements

Each raw run must include ISO timestamp, provider, model, latency, token usage, raw generated item, raw validator response, final decision, and rejection reasons. Missing credentials must produce `a35-blockers.md`; fake generated items or fake token counts are not allowed.

## Prompt Versions

- `a35-v1`: baseline item generation with explicit Vietnamese-L1 diagnostic target.
- `a35-v2`: one improvement requiring clearer expected answers or scoring targets.
- `a35-v3`: one improvement strengthening Vietnamese-L1 interference relevance.
- `a35-v4`: one improvement tightening mobile learner usability.

## Hard Gate

Production replacement is not recommended unless a run produces at least 90 generated candidates, 90 validation records, three prompt-tuning cycles, acceptance-rate comparison, cost per accepted item, at least 20 analyzed rejections, and at least 30 accepted items with CEFR and Vietnamese-L1 validation evidence.
