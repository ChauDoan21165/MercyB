# B1 CI Stability Guardrails

Date: 2026-05-20
Branch: `feat/b1-test-stability-burndown`
PR: #950

## Original Flake Root Cause

The Placement V3 vertical E2E flake was not product logic. It was a harness race in `answerCurrentTask`.

The old helper filled the last visible text input using DOM events and returned immediately. During Placement V3 route/task transitions, a visible field can exist before the active task has fully settled. That meant the helper could return even though the current active task validation had not accepted the answer. The next assertion waited for `Submit answer` to become enabled and timed out.

## How To Avoid Future Submit Races

- Wait for the Placement task route to settle before interacting.
- Wait for an active task control to be visible.
- Fill through Playwright locators first.
- Assert the field value after filling text.
- Do not proceed until `Submit answer` is enabled.
- If using DOM events as a fallback, dispatch both `input` and `change`, then still verify submit readiness.

Use:

- `routeSettled(page, /\/placement\/test\//)`
- `placementTaskReady(page)`
- `stableInputFill(locator, value)`
- `waitForEnabledSubmit(page)`

## Correct Placement V3 Fill Pattern

```ts
await placementTaskReady(page);
await stableInputFill(activeField, LONG_PLACEMENT_ANSWER);
const submit = await waitForEnabledSubmit(page);
await submit.click();
```

For multiple-choice tasks:

```ts
await page.getByRole("radio").filter({ visible: true }).first().click();
const submit = await waitForEnabledSubmit(page);
await submit.click();
```

## Anti-Patterns

- Do not return from a helper just because a selector existed.
- Do not assume the last visible input is the active task without checking submit readiness.
- Do not use fixed sleeps as the only route/task synchronization.
- Do not hide flakes with Playwright retries unless diagnostics are captured.
- Do not skip Placement V3 E2E when feature flags are missing; assert the flag state clearly.

## Debugging Future E2E Instability

Placement V3 failures now attach and write B1 diagnostics:

- current task ID when present
- submit disabled state
- feature flag route visibility signal
- visible validation errors
- current URL
- screenshot
- Playwright trace output directory
- pending network requests tracked by the helper

Diagnostics are written under:

```text
reports/b1-e2e-diagnostics/
```

For repeated local proof, run:

```bash
scripts/testing/run-repeat-e2e.sh 5 placement-v3-vertical
scripts/testing/run-repeat-unit.sh 5
```

Both scripts stop on first failure and write timestamped logs under `docs/testing/b1-raw-runs/`.
