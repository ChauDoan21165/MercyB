# Chau report number 4 from C1

## Scope

Investigated the Sentry P1 on production `/signin` where iOS Safari reported:

```text
'text/html' is not a valid JavaScript MIME type
```

The investigation focused on the production asset fallback path, service worker registration, and existing lazy-load recovery.

## Root Cause

The Vercel SPA catch-all rewrite matched missing `/assets/...` JavaScript chunk URLs and served `index.html`, so Safari received HTML where it expected a JavaScript module.

This is consistent with a stale deployment or stale service worker holding an old chunk URL after the matching Vite asset was no longer present.

## Fix

Updated `vercel.json` so the SPA fallback still serves app routes such as `/signin`, but no longer rewrites `/assets/...` requests to `index.html`.

Before:

```json
{ "source": "/(.*)", "destination": "/index.html" }
```

After:

```json
{ "source": "/((?!assets/).*)", "destination": "/index.html" }
```

Expected behavior:

- `/signin` continues to load through the SPA fallback.
- `/assets/missing.js` falls through to a real 404 instead of receiving `index.html`.

## Files Changed

- `vercel.json`
- `reports/chau-report-number-4-from-c1.md`

## Verification

- `vercel.json` parses as valid JSON.
- Local route-pattern check confirmed `/signin` matches and `/assets/app.js` does not.
- `git diff --check`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed.

## Notes

- `public/_headers` is not present.
- `src/App.tsx` is not present; the app routes through `src/router/AppRouter.tsx`.
- Existing lazy-load recovery and global chunk-load recovery remain unchanged.
- This should reduce `/signin` Sentry MIME-type alerts caused by stale or missing Vite JS assets being served as HTML.
