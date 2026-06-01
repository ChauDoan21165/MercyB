# Correction-engine golden set

Fixtures live in `correction-rules/*.json` and lock the observable behavior of the beginner-English correction engine (`correctWithTutorRules`).

**Canonical schema + authoring reference:** [`docs/ops/golden-net-harness.md`](../../../docs/ops/golden-net-harness.md)

That doc is the single source of truth for the fixture schema (fields, validation rules), the `expectedRuleFired` vs `expectedRulesFired[]` distinction, per-case assertion semantics, and the empirical authoring discipline (probe the live engine; never hand-trace; surface findings instead of locking broken behavior). Don't duplicate it here — read it before adding or editing a fixture.

Runner: `../harness/runCorrectionGolden.ts` · entry point: `../correction-golden.test.ts` · run: `npm run test:regression`.
