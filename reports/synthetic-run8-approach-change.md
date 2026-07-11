# Synthetic (a): approach change — direct API auth + session injection

Four consecutive (a) failures across four hosts were all in the UI login
form-drive. Per direction, journey (a) no longer drives the /signin UI; it
authenticates via the Supabase auth API and injects the session so the page loads
already authenticated. The UI login keeps its manual/canary coverage.

## Does the direct auth call return 200? — YES
`POST /auth/v1/token?grant_type=password` for the synthetic account returns **200**.
Evidence: the pre-existing `seedSession` did exactly this raw grant and **throws on
non-ok** — no run ever logged "synthetic sign-in failed", so the grant has succeeded
every time. A local bogus-credential smoke via `GoTrueClient.signInWithPassword`
confirms the mechanism fires the grant and surfaces the status (bad creds → 400
"Invalid login credentials"); real creds → 200 + a session.

## ROOT CAUSE of the persistent (b/c/d) failures — WRONG INJECTION SHAPE (found here)
supabase-js v2.89 (`@supabase/auth-js`) persists the session under the storage key as
a **wrapper `{ currentSession: <Session>, expiresAt: <number> }`** — its recover path
reads `stored.currentSession`. The old `seedSession` injected the **raw grant response**
(a bare Session, no `currentSession` key), so on load supabase-js found nothing →
the app treated the injected session as signed-out → `/ai-tutor` never rendered the
tutor → (b) `waiting for getByRole('textbox')` timeout every run. **This was a spec
injection bug, not the app rejecting a valid session.**

## The change (spec/infra only — no app/auth code)
- **`seedSession`** now signs in with **`GoTrueClient`** (auth-js) against a memory
  storage adapter using the app's `storageKey`, and injects the **exact blob
  GoTrueClient persists** (correct `{currentSession,expiresAt}` shape) via
  `addInitScript` before navigation. Throws on non-2xx (bad creds / rate-limit) — a
  real signal, never papered over. Returns the access token.
- **Journey (a)** injects the session, navigates to `/ai-tutor`, and asserts the authed
  surface is reachable (NOT bounced to /signin).
- **Journey (d)** now reads `learning_events` via a **raw PostgREST fetch** with the
  session's access token (RLS select_own), instead of the full supabase-js client.
- **WebSocket/Node hazard removed:** the full `createClient` from
  `@supabase/supabase-js` **throws at construction on Node < 22** ("native WebSocket
  not found") — verified locally. The synthetic job runs on **shell mac hosts** (the
  `node:24` container image is ignored by shell executors), whose Node version is not
  guaranteed 22+. So (d)'s old `createClient` was a latent bomb once (b) started
  passing. `GoTrueClient` (auth-only) + raw fetch have **no WebSocket dependency** →
  robust on any Node. `@supabase/supabase-js` is no longer imported by the spec.

## What the next run tells us (the two remaining branches)
- **Direct auth non-200** (bad creds / rate-limit / 429) → `seedSession` throws with
  the status → (a) fails with that message → a REAL credential/rate-limit signal to
  report, not paper over.
- **200 + the correctly-shaped injected session STILL bounces** → that is the genuine
  **app-side** signal (the app not accepting a valid session) → hold and report to
  Chau before any app change.
- **200 + authed surface reachable** → (a) green, and (b/c/d) proceed from a real
  signed-in session (now with the correct injection shape).

## Deliverable
`reports/synthetic-run8-approach-change.md` + the spec change. Spec/infra only → merge
on green per standing authority. The end-to-end result (which of the three branches)
comes from the next synthetic run.
