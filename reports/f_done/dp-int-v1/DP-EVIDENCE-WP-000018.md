# DP-EVIDENCE-WP-000018 F evidence

## Scope

- Workpack: DP-EVIDENCE-WP-000018
- Source anchor: `src/lib/tm-int/runtimeReadiness/fixtureBuilder.ts` / `createValidRuntimeEvidenceBundle`
- Objective: harden deterministic runtime evidence fixtures for DP validator regression tests.

## Implementation

- Added deep cloning before applying replay mismatch variants.
- Added regression coverage proving second replay fixtures can be mutated without leaking into the first bundle.
- This keeps DP validator replay tests reproducible and avoids hand-written sample drift through shared nested fixture state.

## Validation

- `npm test -- --run src/lib/tm-int/runtimeReadiness src/lib/tm-int/runtime`
  - PASS: 13 files, 80 tests.
- `npm run typecheck`
  - PASS: `tsc -p tsconfig.typecheck.json --noEmit`.
- `npm exec eslint -- scripts src --format json`
  - PASS: exit 0; JSON report contained zero errors and zero warnings.

## Anti-fake checks

- Source diff exists in `src/lib/tm-int/runtimeReadiness/fixtureBuilder.ts`.
- Test diff exists in `src/lib/tm-int/runtimeReadiness/__tests__/fixtureBuilder.test.ts`.
- Test mutates nested OBS and Teacher Context evidence to prove fixture independence.
- No Judge ledger was written.
- F queue `verified` remains locked to 0 by factory schema.
