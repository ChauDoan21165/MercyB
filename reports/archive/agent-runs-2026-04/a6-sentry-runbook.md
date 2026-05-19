# A6 — Sentry monitoring runbook

**Status:** Skeleton (Step 8 / Performance). Sentry is wired into the boot path but stays inert until `VITE_SENTRY_DSN` is set.
**Branch:** `feat/a6-sentry-monitoring-skeleton`
**Owner:** A6

## What this PR ships

1. `@sentry/react` added as a runtime dependency.
2. `src/lib/monitoring/sentryInit.ts` — DSN-gated init. Empty DSN ⇒ full no-op.
3. `src/lib/monitoring/captureException.ts` — `captureError`, `tagWithUser`, `clearUser` wrappers. All no-op when disabled.
4. Wired into `src/main.tsx` ahead of the boot IIFEs so even early errors get captured (once a DSN is set).
5. PII scrubbing in `beforeSend` + `beforeBreadcrumb`:
   - `user.*` reduced to `{ id }` only — never email, username, IP.
   - Strings (message, exception values, request body, query string, breadcrumb messages, breadcrumb data values) run through the existing `stripPII` regex.
   - `ui.input` breadcrumbs dropped entirely (highest-risk PII source).
   - Cookies stripped from request payload (contain auth tokens).
6. Tests at `src/lib/monitoring/__tests__/sentryInit.test.ts` — no-op gating, scrubbing, capture wrappers.

## What this PR deliberately does NOT do

- No DSN is shipped. No environment variable change. The skeleton is dormant until you flip the switch.
- No `Sentry.captureException` calls in feature code yet. That's a follow-up — this PR establishes the contract.
- No source-map upload. Sourcemap upload to Sentry is a build-step decision and needs the auth token.

## Activating in production

### 1. Provision the DSN

1. Sign in to https://sentry.io with the MercyBlade workspace account.
2. Create a project under the organization. Platform = `React`.
3. Copy the DSN from **Settings → Projects → MercyBlade → Client Keys (DSN)**. It looks like `https://abc123@o0.ingest.sentry.io/0`.

### 2. Set environment variables

Two variables, both `VITE_`-prefixed (must be exposed to the client bundle):

```bash
# .env (or hosting platform env settings — Vercel / Netlify / etc.)
VITE_SENTRY_DSN=https://abc123@o0.ingest.sentry.io/0
VITE_APP_ENV=production
```

`VITE_APP_ENV` controls sample rates: `production` ⇒ 10% trace sampling, anything else ⇒ 100% (dev visibility). It also tags every event with the environment for filtering in the Sentry UI.

For staging / preview branches, set `VITE_APP_ENV=staging`. Sentry will keep events in a separate filter without code changes.

### 3. Verify activation

After redeploying with the DSN set:

1. Open the deployed site in a browser; open devtools console.
2. Look for a single `[sentry] initialized (env=production)` log on boot.
3. Trigger a known error (e.g., visit a deliberately broken route). Within ~30s the event should appear in the Sentry project's Issues feed.
4. Confirm the event payload in Sentry: no email addresses, no usernames, only a hashed-ish `id` under `user`.

If you instead see `[sentry] disabled — VITE_SENTRY_DSN not set`, the env var didn't make it into the build. Vite reads `VITE_*` vars at build time — re-deploy after setting them.

## Privacy posture (review before activation)

| Surface                     | Default                                                  |
| --------------------------- | -------------------------------------------------------- |
| user.email                  | **Stripped**. Only `user.id` is sent.                    |
| user.username               | **Stripped**.                                            |
| user.ip_address             | **Stripped**.                                            |
| Cookies in request payload  | **Dropped wholesale** (contain Supabase tokens).         |
| Breadcrumbs of UI input     | **Dropped wholesale** (raw user text).                   |
| Email-like strings anywhere | Replaced with `[EMAIL_REDACTED]`.                        |
| Phone-like strings          | Replaced with `[PHONE_REDACTED]`.                        |
| UUIDs                       | Replaced with `[ID_REDACTED]`.                           |
| 16-digit card-like strings  | Replaced with `[CARD_REDACTED]`.                         |
| Session replays             | **Web only.** 10% baseline session sampling, 100% on-error sampling. `maskAllText: true`, `blockAllMedia: true`. Capacitor native build is unaffected — `@sentry/capacitor` does not support Replay. To watch a replay: open the Sentry issue → top of the event detail page → "Replay" section. Loosening either privacy default requires a privacy-policy update first. |

The PII regexes are the same ones in `src/lib/security/piiProtection.ts` — keep both in sync if you tune one.

## Cost estimate

Sentry's free tier (Developer plan) caps at:

- 5,000 errors / month
- 10,000 performance units / month
- 50 replays / month
- 1 user

At MercyBlade's current ~100-user cohort with `tracesSampleRate=0.1`, that's well within free tier even with a noisy week. Move to the Team plan ($26/mo) only when:

- Error volume exceeds ~150/day sustained, OR
- More than one team member needs Sentry access, OR
- We want monthly retention beyond 30 days.

## Alert routing recommendations

Once activated, set up these alerts in Sentry → Alerts → Create Alert:

| Alert                                    | Trigger                                         | Action                              |
| ---------------------------------------- | ----------------------------------------------- | ----------------------------------- |
| New issue (production only)              | First seen + environment = production           | Email `admin@mercyblade.com`        |
| High frequency regression                | > 10 events in 5 min for any single issue       | Email `admin@mercyblade.com`        |
| Error spike (anomaly detection)          | Error rate > 3× the trailing-7-day baseline     | Email `admin@mercyblade.com`        |

Skip Slack / Discord routing — at the current team size, email from Sentry is sufficient and avoids the "alert fatigue from noisy channels" failure mode.

## Source-map upload (deferred)

To get unminified stack traces in production, the Vite build needs to upload source maps to Sentry. The bare-minimum setup:

1. Install `@sentry/vite-plugin` as a dev dependency.
2. Add it to `vite.config.ts`:
   ```ts
   import { sentryVitePlugin } from "@sentry/vite-plugin";
   // inside plugins:
   sentryVitePlugin({
     org: "mercyblade",
     project: "mercyblade-web",
     authToken: process.env.SENTRY_AUTH_TOKEN, // build-time only, NOT VITE_-prefixed
   }),
   ```
3. Add `SENTRY_AUTH_TOKEN` to the build env (CI / Vercel / etc.).

This is a separate PR — not included here because it requires the auth token + a CI env update.

## Reversibility

To remove Sentry entirely:

1. `npm uninstall @sentry/react`
2. Delete `src/lib/monitoring/`
3. Remove the `initSentry()` import + call from `src/main.tsx`
4. Remove `VITE_SENTRY_DSN` and `VITE_APP_ENV` from any environment.

The skeleton is self-contained — no other module imports from `src/lib/monitoring/` yet.

## Test plan

- [x] `npm run typecheck` — clean
- [x] `npm test` — passes (Sentry is mocked in the suite)
- [x] `npm run build` — succeeds
- [ ] After DSN is provisioned: deploy to staging with `VITE_APP_ENV=staging`, verify init log + a deliberate test error reaches Sentry without PII.
- [ ] Same in production after staging is clean for ≥ 24h.
