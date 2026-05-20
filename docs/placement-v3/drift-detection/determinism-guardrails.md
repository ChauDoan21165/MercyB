# Placement V3 Drift Replay Determinism Guardrails

## Why determinism matters

The local replay simulation exists to prove the replay pipeline can load fixtures, generate grader-shaped outputs, write artifacts, produce drift comparisons, and render dashboard-shaped payloads without provider secrets. It is only useful as a regression guardrail if the same fixture corpus produces the same normalized replay output every time.

Determinism failures are treated as pipeline bugs because they make future drift evidence ambiguous. If simulated replay changes without fixture or algorithm changes, reviewers cannot tell whether a later live replay difference is provider drift, fixture drift, ordering drift, or serialization drift.

## What is guarded

- `tests/integration/placement-v3-drift-detection/replayDeterminism.test.ts` runs simulation twice and compares normalized raw replay output plus normalized drift diffs.
- `scripts/placement-v3/check-replay-determinism.ts` runs simulation repeatedly for CI-style replay consistency checks and writes diff summaries on failure.
- `scripts/placement-v3/check-replay-fixtures.ts` checks fixture IDs, ordering, metadata, CEFR labels, and committed simulated artifact markers.
- `src/lib/placementDrift/validateReplayArtifact.ts` validates simulated replay artifact structure and builds timestamp-normalized comparison signatures.

## What can break determinism

- Iterating fixture objects through unordered maps instead of fixture-file order.
- Sorting only some artifacts, for example scores but not evidence or drift diffs.
- Adding timestamps, random numbers, UUIDs, or measured wall-clock latency into compared fields.
- Changing fixture IDs, numeric suffixes, modality labels, CEFR labels, or `payload.promptId` without updating snapshots and docs.
- Serializing provider metadata differently across artifacts.
- Omitting `simulated: true` on a new artifact type.

## Ordering risks

Replay ordering must follow the fixture corpus order. The guardrails compare score order, evidence order, and drift-diff order. The fixture integrity check also requires fixture IDs to keep their stable numeric suffix order so a contributor cannot silently move samples around and change top-unstable output.

## Timestamp normalization

Replay artifacts intentionally include run timestamps and timestamped run IDs. Those fields are validated for ISO shape, then removed from the determinism signature. The comparison keeps deterministic fields such as sample IDs, CEFR outputs, provider metadata, retry paths, token counts, latency values from the simulator, malformed flags, and drift deltas.

## Fixture mutation risks

Fixture changes are allowed only when intentional. A fixture mutation can change deterministic outputs because the simulator derives stable values from fixture IDs and payload size. Any fixture change should be reviewed alongside updated determinism evidence and should not be mixed with live replay claims.

## Serialization risks

JSON serialization is part of the contract. New replay artifacts must keep top-level `simulated: true`, stable array ordering, and provider metadata that clearly identifies simulation as `provider: "none"` and `model: "local-drift-simulator-v1"`. Live replay artifacts must not be inferred from simulation artifacts.

## Commands

```bash
npm run check:placement-replay-fixtures
npm run check:placement-replay-determinism -- --runs 5
npx vitest run tests/integration/placement-v3-drift-detection/replayDeterminism.test.ts
```

These commands do not prove live provider drift. Live replay remains blocked until Supabase URL, anon key, and optional service-role persistence credentials are configured.
