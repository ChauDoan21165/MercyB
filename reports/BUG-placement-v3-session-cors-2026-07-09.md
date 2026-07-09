# BUG: placement-v3-session — intermittent browser CORS / `net::ERR_FAILED`

**Filed:** 2026-07-09 · **By:** A6 · **Source:** caught by the prod-smoke "imitation user" E2E (MR !2549)
**Severity:** P2 — intermittent; the app appears to retry and usually recovers, but the
failing request could hang/abort placement for some users under load or cold start.

---

## Symptom (observed on real prod)

During a full placement run on `https://mercyblade.com`, the browser console logged:

```
Access to fetch at 'https://buemdfxyhxunzpgdoqin.supabase.co/functions/v1/placement-v3-session'
from origin 'https://mercyblade.com' has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
Failed to load resource: net::ERR_FAILED
```

## It is NOT a static missing-header bug

Direct probes show the function sets CORS headers correctly on its normal responses:

```
OPTIONS (preflight) → HTTP 200   access-control-allow-origin: *
POST   (401 error)  → HTTP 401   access-control-allow-origin: *
```

So the endpoint's happy-path and handled-error responses are CORS-correct. The browser only
reports "no ACAO header" when the response carries **no** headers at all — i.e. the request
**failed at the runtime/gateway level**, not in the handler. The paired `net::ERR_FAILED`
confirms a request-level failure (5xx/timeout/isolate crash), which the browser surfaces as
a CORS error because the failed response has no headers.

## Root cause

`supabase/functions/_shared/sentry.ts` → `wrapHandler` (the wrapper every placement edge
function uses, `placement-v3-session/index.ts:111`):

```ts
// _shared/sentry.ts:230
return async (req: Request): Promise<Response> => {
  try {
    return await handler(req);
  } catch (err) {
    ...captureEdgeError(err, {...});
    throw err;                        // ← _shared/sentry.ts:242  RE-THROWS
  }
};
```

On **any** uncaught error in the handler, `wrapHandler` re-throws. The Supabase edge runtime
then returns its **default 500 with no CORS headers**, so the browser blames CORS. The
handler's own `corsHeaders` / `json()` helper never runs for this path.

Likely triggers for the intermittent throw (each is an `await` that can reject and is not
individually guarded before the response is sent):
- `forensicLogger.logEvent(...)` — awaited on several branches (`index.ts:133`, `155`, `342`);
  a transient DB write failure would throw.
- grader / conversation sub-calls (`graderClient.ts`) on cold start or timeout.
- Deno isolate cold-start / CPU-time limit (returns a gateway 5xx with no headers).

## Fix direction (do NOT deploy under this brief — flagging only)

Preferred, and the correct general fix: make `wrapHandler` **return** a CORS-carrying 500
instead of re-throwing, so every edge function's error path is CORS-safe:

```ts
} catch (err) {
  void captureEdgeError(err, {...});
  return new Response(
    JSON.stringify({ ok: false, error: "internal_error" }),
    { status: 500, headers: { "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        "Content-Type": "application/json" } },
  );
}
```

⚠️ `wrapHandler` is a **shared** file used by ~all edge functions (CLAUDE.md: "central files
are dangerous"). This changes the error-response shape fleet-wide — review + a single careful
deploy, not a drive-by. Secondary hardening: don't `await` `forensicLogger.logEvent` on the
response's critical path (fire-and-forget it) so logging failures can't 500 the request.

## Next step to confirm the exact throw

The re-thrown error is captured to Sentry via `captureEdgeError` — the edge-function Sentry
project will have the stack for `placement-v3-session`. Pull the most recent
`placement-v3-session` errors to name the exact failing `await`.

## Evidence
- Console capture: prod-smoke run 2026-07-09 (MR !2549 artifacts).
- Header probes: `curl -X OPTIONS/POST` above.
- Code: `supabase/functions/_shared/sentry.ts:242` (re-throw); `placement-v3-session/index.ts:111` (wrap).
