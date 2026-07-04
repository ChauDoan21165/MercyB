# Routing-Onboarding F Validation: WP-RO-036, WP-RO-045

## Commands

- `npx eslint src/lib/profile/publicProfile.ts src/lib/profile/__tests__/publicProfile.test.ts scripts/__tests__/factory-runtime.test.mjs`
  - Result: passed.
- `npx vitest run src/lib/profile/__tests__/publicProfile.test.ts scripts/__tests__/factory-runtime.test.mjs`
  - Result: passed, 2 files, 33 tests.

## Anti-fake checks

- No skipped or weakened tests added.
- Bad workpacks remain excluded from progress.
- F queue `verified` remains 0.
- Full `npm run typecheck` intentionally skipped because the app typecheck is a known compiler hot graph.
