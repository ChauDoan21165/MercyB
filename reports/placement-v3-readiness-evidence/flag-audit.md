# Placement V3 Flag Audit

Date: 2026-05-20
Branch: `reports/placement-v3-post-merge-readiness`
Base: `origin/main` at `de6d31c28` (#942)

## Files Audited

- Required path from task: `src/config/featureFlags.ts`
- Actual path in this repo tree: `src/lib/featureFlags.ts`
- Router: `src/router/AppRouter.tsx`

`src/config/featureFlags.ts` does not exist on `origin/main`; `AppRouter.tsx` imports `FEATURE_FLAGS` from `@/lib/featureFlags`.

## Defaults

| Flag | Source | Default | Production default accidentally enabled? |
|---|---|---:|---|
| `PLACEMENT_TEST_ENABLED` | `readEnvBool("VITE_PLACEMENT_TEST_ENABLED", false)` | `false` | No |
| `PLACEMENT_V3_UI_ENABLED` | `readEnvBool("VITE_PLACEMENT_V3_UI_ENABLED", false)` | `false` | No |

Both flags require explicit environment opt-in. Empty, missing, or unset env values return `false`.

## Route Gate Behavior

`PlacementV3Gate` in `src/router/AppRouter.tsx` redirects to `/` unless both flags are true:

- `FEATURE_FLAGS.PLACEMENT_TEST_ENABLED`
- `FEATURE_FLAGS.PLACEMENT_V3_UI_ENABLED`

When both are true, the gate wraps v3 routes in `RequireAuth`.

Route behavior:

- `/placement`: v3 welcome only when `PLACEMENT_V3_UI_ENABLED` is true and `PLACEMENT_TEST_ENABLED` passes the nested gate; otherwise v2 is available only if `PLACEMENT_TEST_ENABLED` is true; otherwise redirects home.
- `/placement/who`: same v3 gate behavior; otherwise redirects.
- `/placement/test/:sessionId`, `/placement/results/:sessionId`, `/placement/resume`, `/placement/skip`: always wrapped by `PlacementV3Gate`, so both flags are required.
- Legacy `/placement/test` and `/placement/results`: redirect to `/placement` only when `PLACEMENT_TEST_ENABLED` is true; otherwise redirect home.

## Admin Route Exposure Risk

No Placement V3-specific admin dashboard route is present on `origin/main` from the draft benchmark/drift/adaptive PRs. General `/admin/*` routes are protected by `AdminRoute`.

Risk remains operational rather than route exposure: if an admin manually flips both placement env flags in production, authenticated users can reach the v3 placement UI even though live benchmark, drift, native runtime, and A29 modality evidence is incomplete.

## Conclusion

Flags are safe by default. Keep both off in production:

- `VITE_PLACEMENT_TEST_ENABLED=false`
- `VITE_PLACEMENT_V3_UI_ENABLED=false`

