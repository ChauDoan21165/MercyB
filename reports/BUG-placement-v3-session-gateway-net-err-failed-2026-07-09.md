# BUG: placement-v3-session — intermittent `net::ERR_FAILED` (gateway/runtime level)

**Filed:** 2026-07-09 · **By:** A6 · **Caught by:** prod-smoke E2E (tests/prod-smoke/placement-imitation-user.spec.ts)
**Severity:** P2 — intermittent; the app retries and usually recovers, but under cold start / load a
placement request can fail outright.

> **NOT the same bug as the wrapHandler CORS issue (MR !2551 → fixed by !2555).**
> Do NOT re-chase the handler path — !2555 already fixed handler-level 500s. This is a distinct,
> deeper failure.

---

## Symptom

During a full placement run on `https://mercyblade.com`, the browser console logs:

```
Access to fetch at 'https://buemdfxyhxunzpgdoqin.supabase.co/functions/v1/placement-v3-session'
from origin 'https://mercyblade.com' has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
Failed to load resource: net::ERR_FAILED
```

Confirmed in **2 clean prod runs on 2026-07-09, AFTER !2555 deployed.**

## Why this is NOT the handler-level CORS bug (and why curl/Stripe miss it)

The paired **`net::ERR_FAILED`** is the tell: the request received **no HTTP response at all**. The
browser reports a missing `Access-Control-Allow-Origin` because a *failed* request has no headers of
any kind — it is not a 500-with-missing-headers, it is a non-response.

Evidence that the handled path is healthy (so `wrapHandler` / !2555 is working):

```
# Warm, handled path — POST with a bad/empty body:
curl -X POST …/functions/v1/placement-v3-session -H "Origin: https://mercyblade.com" -H "apikey: …" -d '{}'
  → HTTP/2 401
  → access-control-allow-origin: *          ✅ ACAO present on the error response
```

So:
- **Warm + reaches the handler** → 401/4xx/5xx **with** CORS headers (fixed by !2555). curl sees this.
- **Cold / times out / isolate never returns** → `net::ERR_FAILED`, **no** headers. Only a real
  browser doing the full flow hits it intermittently. curl (warm, single call) and Stripe webhooks
  (a different, frequently-warm function) never see it.

## Root cause (hypothesis)

A gateway/runtime-level failure on the Supabase Edge Function tier — the request never gets a
response. Most likely one of:
- **Cold-start timeout**: the Deno isolate is spun up on demand; a cold start that exceeds the edge
  gateway's response window returns nothing.
- **CPU-time / wall-clock limit** hit mid-request (the handler does several awaited DB writes via
  `forensicLogger.logEvent` + grader calls).
- **Transient 502/504** from the edge tier under load.

`wrapHandler` (`_shared/sentry.ts`) runs **inside** the function — if the function never starts or
never returns, no application code can set CORS headers. So this is unreachable by any handler-level
change.

## Suggested fix direction (NOT wrapHandler)

- **Edge warmup / keepalive**: a scheduled ping (Supabase cron / external heartbeat) to
  `placement-v3-session` so a learner rarely hits a cold isolate. Cheapest mitigation.
- **Reduce cold-start cost**: trim the function's import graph / bundle so cold isolates boot faster.
- **Trim the critical path**: don't `await forensicLogger.logEvent(...)` before sending the response
  (fire-and-forget it) so slow logging can't push the request past the gateway window.
- **Supabase-side**: confirm the function's timeout / resource limits and whether a 502/504 is being
  emitted by the platform.

## Current mitigation

The prod-smoke E2E allowlists this specific console error
(`tests/prod-smoke/placement-imitation-user.spec.ts`, `KNOWN_CONSOLE_NOISE`) so it doesn't mask the
audio/results assertions. **That allowlist references this report and MUST be removed once the
gateway fix ships** — otherwise a regression here would be silently tolerated.

## Evidence
- Console capture: prod-smoke runs 2026-07-09 (post-!2555).
- Header probe: `curl -X POST …placement-v3-session` → 401 + `access-control-allow-origin: *`.
- Related (fixed): `reports/BUG-placement-v3-session-cors-2026-07-09.md` (handler-level, !2551 → !2555).
