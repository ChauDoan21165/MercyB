# A3 Blockers

Timestamp: 2026-05-20T13:22:00-06:00

## Current Status

The original A3 blocker was resolved by rebasing onto post-#942 `origin/main`: runtime Placement V3 prompt, calibration, taxonomy ID, recommender, session, grading, rubric, and migration files are now present and audited.

## Still Missing

These docs-only paths remain absent:

- `docs/placement-v3/calibration/`
- `docs/placement-v3/taxonomy/`
- `docs/placement-v3/prompt-library/`

They are no longer treated as blockers for runtime corpus auditing because #942 added the actual runtime corpus under `src/data/placement/v3/`.

## Commands Run

```bash
git fetch origin
git switch feat/a3-placement-v3-data-quality
git rebase origin/main
npx tsx scripts/placement-v3/run-corpus-integrity-audit.ts
npx tsx scripts/placement-v3/run-taxonomy-consistency.ts
npx tsx scripts/placement-v3/run-recommendation-graph-audit.ts
npx tsx scripts/placement-v3/run-prompt-rubric-alignment.ts
```

## What Was Audited

- Runtime V3 prompts and calibration entries under `src/data/placement/v3/`.
- Runtime V3 recommender and lesson index under `src/lib/placement/v3/`.
- Shared CEFR rubric/types under `supabase/functions/_shared/cefr/`.
- V3 session/grading files under `supabase/functions/`.
- Legacy deterministic placement questions, weakness taxonomy, and room recommendation maps.

## What Remains Unverified

- Separate docs-only calibration/taxonomy/prompt-library files, if Chau later wants those added as canonical documentation.
- Production database persistence, because the A3 migration has not been applied by this PR.

No consistency result for absent docs-only surfaces is claimed.
