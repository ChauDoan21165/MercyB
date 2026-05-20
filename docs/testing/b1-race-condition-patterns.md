# B1 Race Condition Patterns

Date: 2026-05-20

## Disabled Submit Races

Pattern: a test fills an input and immediately clicks or asserts the submit button without proving the active task accepted the value.

Correct pattern:

- Fill through Playwright locators when possible.
- Assert the field value after fill.
- Wait for the specific submit button to become enabled.
- Capture diagnostics when the submit state stays disabled.

Anti-pattern:

- Dispatching raw DOM `input` events and returning before validation is reflected in UI state.
- Clicking submit after a fixed timeout.

## Async Hydration Races

Pattern: test code queries controls before auth/session/profile hydration finishes.

Correct pattern:

- Seed local storage before `page.goto`.
- Wait for a user-visible ready state, not only `domcontentloaded`.
- Use route-specific ready helpers such as `placementTaskReady`.

Anti-pattern:

- Assuming the first visible field is the active field.
- Reading app state before providers have settled.

## Route-Settle Races

Pattern: a test continues after navigation while nested route UI is still rendering.

Correct pattern:

- Use `waitForURL` with the expected route.
- Wait for `domcontentloaded`.
- Treat `networkidle` as helpful but not the only readiness signal.
- Confirm route-specific UI is visible.

Anti-pattern:

- `page.waitForTimeout(...)` as the main route readiness check.

## Feature-Flag Timing Races

Pattern: route or copy differs because the test server bundle did not receive the intended Vite flags.

Correct pattern:

- Set `VITE_PLACEMENT_TEST_ENABLED=true`.
- Set `VITE_PLACEMENT_V3_UI_ENABLED=true`.
- Assert Placement V3 route copy before starting the flow.

Anti-pattern:

- Assuming a route is enabled without checking route copy or feature-flag-visible UI.

## Lazy Import Races

Pattern: a route is navigated before lazy chunks, Suspense fallbacks, or async module work have produced interactable UI.

Correct pattern:

- Wait for semantic UI controls.
- Keep assertions tied to user-visible affordances.
- Capture current URL, route text, and pending network requests on failure.

Anti-pattern:

- Waiting for an implementation detail that disappears after chunk hydration.

## Playwright Timing Anti-Patterns

- Fixed sleeps used as proof of readiness.
- Unscoped selectors that can match stale controls from a prior task.
- Hidden fallback selectors that bypass visible user behavior.
- Retrying silently without logs or artifacts.
- Treating one passing run as flake proof.
