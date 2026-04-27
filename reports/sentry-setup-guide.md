---
title: Sentry crash monitoring — setup guide for Chau
agent: A7 (recovered from A8 brief)
date: 2026-04-26
branch: feat/sentry-monitoring-complete-recovered
---

# Sentry setup guide

The code wiring is shipped. This doc is the **post-merge runbook** so you can flip Sentry on without writing any more code.

## What's already wired (no action from you)

- **DSN-gated client SDK** — the @sentry/react module isn't even loaded until `VITE_SENTRY_DSN` is set. Empty DSN = zero bundle bytes.
- **Error boundary** — wraps the whole app in `src/main.tsx`. Caught render crashes go to Sentry with the React component stack.
- **Global crash forwarding** — `componentDidCatch` calls `captureError(...)` so unhandled render errors land in Sentry with the component stack.
- **User + tier context** — `SentryUserBinding` watches `useAuth()` + `useUserAccess()` and pushes `{id}` only (no email / no IP) plus a coarse `tier` tag (`anon` / `trial` / `trial_expired` / `premium` / `admin`).
- **Route + feature flag tags** — every navigation re-tags the scope with a normalized route pattern (`/room/:roomId`, not raw `/room/hello_world`) so Sentry's filter-by-route works without exploding tag cardinality.
- **Breadcrumbs** — fired automatically on:
  - Mercy panel open / close (with `source` field: bubble / collapse / close)
  - Speak attempt start / finish / fallback (with `roomId`, `score`, `cloud` flag)
  - Navigation (`from → to`)
- **PII scrubbing** — emails, UUIDs, phones stripped from messages, exception values, request bodies, query strings, and breadcrumb data via `scrubEvent` / `scrubBreadcrumb`. Cookies dropped wholesale (auth tokens). `ui.input` breadcrumbs filtered out entirely.
- **Edge function helper** — `supabase/functions/_shared/sentry.ts` exports `wrapHandler(name, handler)`. Already wraps `azure-phoneme`, `speech-analyze`, `ai-chat`, `mercy-guide`, `room-chat`. Pattern documented below for the remaining ~96 functions.
- **Source map upload** — `@sentry/vite-plugin` is in devDependencies; activates only when `SENTRY_AUTH_TOKEN` + `SENTRY_ORG` + `SENTRY_PROJECT` are present at build time. Maps generated as `hidden` (not referenced from JS bundle, not visible in browser DevTools), uploaded, then deleted from `dist/`.

## Sample rate posture (cost control)

Errors: **1.0** (capture every error — they're rare and high-signal).
Performance traces: **0.1 in prod, 1.0 in dev** (`sentryInit.ts:83`).
Replays: **0% session, 10% on-error** (`sentryInit.ts:84-85`).

Free tier of Sentry covers ~5k errors / month. With ~100 users that's plenty of headroom. Revisit if event volume spikes.

---

## Step-by-step: turning Sentry on

### 1. Sign up at sentry.io

- Use `admin@mercyblade.com` so the receipts and alerts hit your inbox via Cloudflare forwarding.
- Pick the **Developer (free)** plan. 5k errors / 10k performance / 50 replays / 1 user.
- Create an org. Suggested name: `mercyblade`.

### 2. Create a project

- Platform: **React** (NOT Capacitor — the Capacitor option pulls in the Cordova-era SDK we don't use).
- Project name: `mercyblade-web`.
- Leave alerts at default; we'll customize after the first event lands.

### 3. Copy the DSN

- Project Settings → Client Keys (DSN). Looks like:
  `https://abc123@o000000.ingest.us.sentry.io/0000000`
- Copy it. **Treat as semi-public** — DSNs are embedded in client bundles by design, but don't paste into chat/issues.

### 4. Mint an auth token for source map uploads

- Settings → Account → User Auth Tokens (or Organization → Auth Tokens for a CI-only token).
- Scopes needed: `project:releases` and `org:read`.
- Copy the token (starts with `sntrys_`). **Keep this secret** — anyone with it can upload arbitrary releases to your project.

### 5. Set Vercel env vars

In the Vercel project settings → Environment Variables, add **all five** to the **Production** environment:

| Key | Value | Notes |
|-----|-------|-------|
| `VITE_SENTRY_DSN` | `https://abc123@o000000.ingest.us.sentry.io/0000000` | The DSN from step 3. Vite inlines this at build time. |
| `VITE_APP_ENV` | `production` | Tags events as production environment. |
| `SENTRY_AUTH_TOKEN` | `sntrys_...` | Build-time only — Vercel never exposes this to the browser. |
| `SENTRY_ORG` | `mercyblade` | Your Sentry org slug. |
| `SENTRY_PROJECT` | `mercyblade-web` | Your Sentry project slug. |

For **Preview** and **Development** environments leave them unset — you do NOT want preview deploys reporting into the same project as production.

### 6. Trigger a deliberate test error

After Vercel finishes the next deploy with the env vars in place:

```js
// In the browser console on mercyblade.com:
throw new Error("Sentry smoke test — please ignore");
```

You should see the error appear in Sentry's "Issues" view within 30–60 seconds, tagged `environment: production` and `route: /` (or wherever you triggered it). The stack trace should show **original file paths** (`src/main.tsx:319`), not the minified `assets/index-abc123.js:1:5400` — that's the source map upload working.

If the trace is still minified: check Vercel's build log for `[sentry-vite-plugin] Uploaded N source maps`. If it didn't run, env vars aren't reaching the build step.

### 7. Set up Slack alerts (optional)

- Sentry → Settings → Integrations → Slack → Add Workspace.
- Create an alert rule: "When a new issue is created → notify #mercyblade-alerts (or your #general)".
- Filter to `level: error` and `environment: production` — preview crashes shouldn't page you.

### 8. Set up edge function DSN

Edge functions read `SENTRY_DSN` (no `VITE_` prefix — Deno doesn't run Vite). Set it in Supabase:

```bash
supabase secrets set SENTRY_DSN="https://abc123@o000000.ingest.us.sentry.io/0000000" --project-ref buemdfxyhxunzpgdoqin
supabase secrets set APP_ENV="production" --project-ref buemdfxyhxunzpgdoqin
```

After setting, redeploy any wrapped function:

```bash
supabase functions deploy azure-phoneme --project-ref buemdfxyhxunzpgdoqin
```

Trigger a deliberate 500 (e.g. by sending a malformed body) and confirm it appears in Sentry tagged `function_name: azure-phoneme`.

---

## Wrapping the remaining edge functions

5 of 101 are wrapped today (the highest-traffic user-facing ones: azure-phoneme, speech-analyze, ai-chat, mercy-guide, room-chat). For each remaining function:

```ts
// At top of supabase/functions/<name>/index.ts:
import { wrapHandler } from "../_shared/sentry.ts";

// Replace:
serve(async (req) => { /* … */ });
// With:
serve(wrapHandler("<name>", async (req) => { /* … */ }));
```

That's it. The helper auto-extracts the user id from the JWT (via `readUserIdFromAuthHeader`), tags the event with `function_name`, and rethrows so the platform's normal error response is unchanged. Safe to roll out function-by-function — no shared state to break.

Priority order for the remaining 96 (handle the user-facing ones first):
1. `secure-room-loader`, `room-cache`, `get-room`, `list-rooms` (load failures break every room visit)
2. `me-entitlement` (powers tier gating; silent failures = wrong UI)
3. `email-broadcast`, `send-email-campaign`, `email-automations` (any failure = users miss emails)
4. Billing path: `stripe`, `stripe-webhook`, `stripe-webhook-v2`, `apple-iap-sync`, `revenuecat-webhook`
5. The rest (admin / audit / cron — low traffic, low impact).

I'd schedule a sweep agent to do this in batches of 10–20 once you've confirmed the helper works in production.

---

## What I deliberately did NOT do

- **No Performance monitoring auto-instrumentation** — `tracesSampleRate: 0.1` in prod is enough; the BrowserTracing integration would add ~30 KB and capture every fetch. Revisit if you actually want span data.
- **No Replay** — Replays are 50/month on free, and they capture user input. The privacy posture (`replaysSessionSampleRate: 0`) is intentional.
- **No `Sentry.withErrorBoundary`** — the existing `ErrorBoundary` works fine and we don't need the Sentry-branded wrapper. `componentDidCatch` forwards to Sentry directly.
- **No global `release` tag** — Vercel sets `VERCEL_GIT_COMMIT_SHA` automatically; we can wire that to `Sentry.init({ release: ... })` once you want release-grouping. Five-minute job; ask me to do it whenever.

---

## Verification checklist

After step 5 + 6 above, confirm the following appears in Sentry's issue detail view for your test error:

- [ ] **User** field shows just `id: <uuid>` (no email, no username).
- [ ] **Tags** include `tier`, `route`, and `environment: production`.
- [ ] **Breadcrumbs** show the navigation that led to the crash (`/ → /room/:roomId`).
- [ ] **Stack trace** shows `src/...` paths, not `assets/index-abc123.js`.
- [ ] **Cookies** field is empty (we drop them).
- [ ] **Body / query** strings show `[EMAIL_REDACTED]` / `[ID_REDACTED]` placeholders if the page captured anything sensitive.

If any of these are wrong, the scrub regex in `src/lib/monitoring/sentryInit.ts:108-183` is the place to harden.

---

## Files touched (for reference)

| File | What changed |
|------|--------------|
| `package.json` | Added `@sentry/vite-plugin` devDep |
| `vite.config.ts` | Conditional Sentry plugin + hidden source maps |
| `src/main.tsx` | Wrapped app in `ErrorBoundary` + mounted `SentryUserBinding` |
| `src/components/ErrorBoundary.tsx` | Forward to `captureError` in `componentDidCatch` |
| `src/components/monitoring/SentryUserBinding.tsx` | New — binds auth/access state to Sentry scope |
| `src/lib/monitoring/captureException.ts` | Added `setTag`, `addBreadcrumb`, `SentryTier` type |
| `src/lib/monitoring/sentryContext.ts` | New — derives `SentryTier` from `useUserAccess` snapshot |
| `src/lib/monitoring/breadcrumbs.ts` | New — `breadcrumbMercyPanel`, `breadcrumbSpeakAttempt` |
| `src/components/MercyGuide.tsx` | Fire panel breadcrumbs on open/close |
| `src/components/mercy-guide/MercySpeakTab.tsx` | Fire speak breadcrumbs + capture 401s |
| `supabase/functions/_shared/sentry.ts` | New — Deno-side `wrapHandler` + `captureEdgeError` |
| `supabase/functions/{azure-phoneme,speech-analyze,ai-chat,mercy-guide,room-chat}/index.ts` | Wrapped `serve(...)` with `wrapHandler` |

All changes are no-ops until `VITE_SENTRY_DSN` is set. Today's deploy behaves exactly as before.
