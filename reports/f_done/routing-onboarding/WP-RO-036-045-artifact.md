# Routing-Onboarding F Artifact: WP-RO-036, WP-RO-045

Worker: F
Lane: routing-onboarding

## Workpacks completed

- WP-RO-036: added a public-profile shape sanitizer and focused test so profile-only, language-pair, and sensitive fields cannot leak from RPC drift.
- WP-RO-045: added runtime status coverage showing `bad_workpack` is reported separately while F `verified` remains 0 and no Judge progress is implied.

## Files changed

- `src/lib/profile/publicProfile.ts`
- `src/lib/profile/__tests__/publicProfile.test.ts`
- `scripts/__tests__/factory-runtime.test.mjs`
