# Placement V3 Vertical E2E Failure Analysis

Date: 2026-05-20
Branch: `reports/placement-v3-post-merge-readiness`
Test: `tests/e2e/placement-v3-vertical.spec.ts`

## Summary

The original local Placement V3 vertical E2E failure is best classified as a local E2E environment/harness failure, not confirmed product breakage.

The original trace shows the app loaded, feature flags were enabled, auth was seeded, and the mocked `placement-v3-session` endpoint was reachable. The failure happened after the test had already driven multiple mocked session responses. The local Vite dev server then disconnected, the browser failed to fetch the lazy `src/pages/placement/v3/ResultsPage.tsx` module from `http://127.0.0.1:3107`, and the page moved to `chrome-error://chromewebdata/`. After that, the test kept waiting for the next answer control and timed out.

## Exact Failing Selector / Step

Original failure:

```text
tests/e2e/placement-v3-vertical.spec.ts:253
locator("textarea, input[placeholder*='Short answer'], [role='textbox'], [role='radio']").first().waitFor({ state: "visible" })
```

Observed error:

```text
Test timeout of 60000ms exceeded.
waiting for locator('textarea, input[placeholder*=\'Short answer\'], [role=\'textbox\'], [role=\'radio\']').first() to be visible
```

## App Load Status

The original trace proves the app loaded and reached Placement V3:

- `/placement` rendered the welcome text: `Let's find where you should start`.
- The test proceeded into the placement flow.
- Multiple `POST https://placeholder.invalid.supabase.co/functions/v1/placement-v3-session` requests were fulfilled with HTTP 200 by the Playwright route mock.
- The failure screenshot is blank because the browser later navigated to `chrome-error://chromewebdata/` after the local dev server stopped responding.

## Feature Flags

Feature flags were enabled for the original failing command and for the successful reruns:

```text
VITE_PLACEMENT_TEST_ENABLED=true
VITE_PLACEMENT_V3_UI_ENABLED=true
```

Control rerun without flags failed at the expected gate:

```text
getByText(/Let's find where you should start/i) was not visible
```

The run-1 page snapshot showed the home page, which is expected because `PlacementV3Gate` redirects `/placement` to `/` when flags are off.

## Auth / Test User Availability

Auth was available for the flagged runs:

- The E2E test seeds Supabase auth state into localStorage before navigation.
- The page snapshot for the no-flag control run shows an authenticated `Account` link.
- The flagged runs reached the gated Placement V3 UI, which requires `RequireAuth`.

## Backend / Session Endpoint Reachability

The real backend was not required for this vertical E2E. The test installs a Playwright route for:

```text
**/functions/v1/placement-v3-session
```

Original trace evidence shows the mocked session endpoint was reachable:

- Multiple `POST .../functions/v1/placement-v3-session` requests returned HTTP 200.
- The route was fulfilled locally by the test harness, not by the placeholder Supabase host.

Unrelated placeholder Supabase REST calls failed with `ERR_NAME_NOT_RESOLVED` for tables like `profiles` and `feature_flags_public`. Those errors did not block the passing reruns and are not the root cause of the original selector timeout.

## Rerun Results

Artifacts are saved under:

```text
reports/placement-v3-readiness-evidence/e2e-reruns/
```

| Run | Command shape | Result | Notes |
|---|---:|---|---|
| Browser setup | `npx playwright install chromium` | Passed | Required because the local Playwright browser cache was missing `chromium_headless_shell-1217`. |
| 1 | Normal command, no Placement flags | Failed as expected | `/placement` redirected to `/`; no welcome text. This verifies flags are default-off. |
| 2 | Explicit Placement V3 flags + placeholder Supabase env | Passed | `1 passed (10.9s)`. |
| 3 | Explicit Placement V3 flags + trace forced on | Passed | `1 passed (8.8s)`, trace saved. |

## Reproduction Status

The original mid-flow selector timeout did not reproduce after:

- installing the missing Playwright Chromium binary,
- stopping any stale server on port 3107 before each run,
- starting Vite with explicit Placement V3 flags,
- rerunning the vertical E2E twice with the same mocked backend path.

## Suspected Root Cause

Most likely root cause: local Playwright/Vite harness instability during the original report run.

Evidence:

- Original trace logged `[vite] server connection lost. Polling for restart...`.
- Original trace logged `WebSocket connection to 'ws://127.0.0.1:3107/' failed: net::ERR_CONNECTION_REFUSED`.
- Original trace logged failed module fetch: `http://127.0.0.1:3107/src/pages/placement/v3/ResultsPage.tsx`.
- Browser frame URL became `chrome-error://chromewebdata/`.
- Clean flagged reruns passed.

This does not prove a Placement V3 product bug. It does prove the E2E command is sensitive to local dev-server state and Playwright browser installation state.

## Recommendation

- Keep the readiness decision as `DO NOT ENABLE` because benchmark, drift, native audio, shadow replay, adaptive generation, and live modality evidence remain missing.
- Update the test evidence from "vertical E2E failed locally" to "default-off gate verified; internal mocked vertical path passes with explicit flags; original failure was local harness/dev-server instability."
- For future PRs, run this E2E from a clean dev-server state or make the Playwright command fail fast when port 3107 is already occupied by a server started with unknown Vite env.
- Do not treat the passing mocked vertical E2E as production evidence. It does not prove live Supabase deployment, live AI graders, live cost/latency, native audio, or provider failover.
