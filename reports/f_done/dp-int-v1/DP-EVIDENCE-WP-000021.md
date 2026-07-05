# DP-EVIDENCE-WP-000021

## Scope
- Tightened `RuntimeEvidenceBundle` envelope detection in `src/lib/tm-int/runtimeReadiness/evidenceBundle.ts`.
- Added nested evidence shape checks for runtime events, OBS packets, teacher context schema, DP/PED decisions, runtime decisions, replay evidence, and judge reproduction evidence.
- Added regression coverage proving malformed nested canonical evidence is rejected.

## Validation
- `npm test -- --run src/lib/tm-int/runtimeReadiness src/lib/tm-int/runtime`
- `npm run typecheck`
- `npm exec eslint -- scripts src --format stylish`

## Result
- Runtime readiness tests passed: 13 files, 82 tests.
- TypeScript typecheck passed.
- ESLint passed with no reported findings.
