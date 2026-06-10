# Golden-flows activation runbook

**Audience:** Chau (admin). **Type:** operational runbook. **Owner:** A2.
**Status:** the golden-flow suite, the `npm run verify:golden-flows`
wrapper, the DEPLOYMENT.md mandatory post-deploy section, and the
`golden-flows-prod` CI job all ship in MR !708. This runbook is the one
remaining manual step that turns the **full** five-flow gate on.

---

## TL;DR

The five production golden flows live in
`tests/golden-flows/prod-golden-flows.pw.ts`:

| # | Flow | Needs a JWT? |
|---|------|--------------|
| 1 | AUTH CONFIG — signin bundle has no `placeholder.invalid`, has real Supabase host | No |
| 2 | TTS — Vietnamese returns Azure audio, never silent fallback | No |
| 3 | FOLLOW — Mercy's opener follows learner context | **Yes — premium JWT** |
| 4 | GATE — free account blocked (403) before processing | **Yes — free JWT** |
| 5 | SIGNIN — auth backend is a real, reachable Supabase | No |

Flows 1, 2, 5 (the **no-token smoke**) already run green with zero setup.
This runbook activates flows 3 and 4 by minting two Supabase access
tokens and setting them as masked GitLab CI/CD variables:

- `GOLDEN_FLOW_PREMIUM_JWT` — a logged-in **premium** user's access token.
- `GOLDEN_FLOW_FREE_JWT` — a logged-in **free (tier-0)** user's access token.

> ⚠️ **Read the "Token expiry" section before you rely on this for the
> recurring CI gate.** A Supabase access token expires (~1 hour by
> default). The no-token smoke is the durable always-on gate; flows 3/4
> need a fresh-token strategy, not a paste-once value.

---

## Prerequisites

- Supabase project: **`buemdfxyhxunzpgdoqin`** (`https://buemdfxyhxunzpgdoqin.supabase.co`).
- The project **anon key** — it is public (it ships in the web bundle).
  Copy it from Supabase Dashboard → Project Settings → API → `anon` `public`,
  or from the `VITE_SUPABASE_ANON_KEY` value used in the build. Used below
  as `<ANON_KEY>`.
- Admin access to the Supabase Dashboard (to create users / set tier).
- Admin access to the GitLab project (Maintainer+) to set CI/CD variables.

---

## Step 1 — Provision the two test users

Create dedicated, stable test users (do **not** reuse a real customer).
In Supabase Dashboard → **Authentication → Users → Add user**:

1. **Premium test user** — e.g. `golden-premium@mercyblade.test`
   - Set a password (tick "Auto Confirm User" so no email step is needed).
2. **Free test user** — e.g. `golden-free@mercyblade.test`
   - Set a password, auto-confirm.

> The app's normal login is OTP (6-digit code), but minting a token for a
> test user uses the **password grant** below — independent of the OTP UI.
> Giving these two test users passwords is what makes non-interactive
> minting possible.

**Grant the premium user entitlement.** The `ai-conversation-turn` gate
treats a user as premium only when the `me-entitlement` edge function
returns `is_premium: true` (or the user is an admin). So:

- Set the premium test user to a paid tier via your normal admin path
  (admin "set tier" tooling / the `admin-set-tier` edge function), then
  confirm `me-entitlement` returns `is_premium: true` for it (see the
  verification curl in Step 2).
- Leave the free test user at tier 0 / no entitlement — it must resolve to
  `is_premium: false` so flow 4 (GATE) gets its expected 403.

---

## Step 2 — Mint each access token

The gate (`api/mercy-ai.ts`) validates the bearer with
`supabase.auth.getUser(token)`, so the variable value must be a **real,
unexpired Supabase access token** for the user — not the anon key, not a
made-up string.

Mint with the password grant (run locally; replace the placeholders):

```bash
# Premium token
curl -s -X POST \
  'https://buemdfxyhxunzpgdoqin.supabase.co/auth/v1/token?grant_type=password' \
  -H "apikey: <ANON_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"email":"golden-premium@mercyblade.test","password":"<PREMIUM_PW>"}' \
  | python3 -c 'import sys,json;print(json.load(sys.stdin)["access_token"])'

# Free token
curl -s -X POST \
  'https://buemdfxyhxunzpgdoqin.supabase.co/auth/v1/token?grant_type=password' \
  -H "apikey: <ANON_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"email":"golden-free@mercyblade.test","password":"<FREE_PW>"}' \
  | python3 -c 'import sys,json;print(json.load(sys.stdin)["access_token"])'
```

Each command prints one long `eyJ...` JWT. That string is the variable
value.

**Verify the premium user really is premium** (optional but recommended) —
this is exactly what the gate checks:

```bash
curl -s 'https://buemdfxyhxunzpgdoqin.supabase.co/functions/v1/me-entitlement' \
  -H "apikey: <ANON_KEY>" \
  -H "Authorization: Bearer <PREMIUM_ACCESS_TOKEN>"
# expect JSON with "is_premium": true
```

Run the same against the free token and confirm `is_premium` is falsy.

---

## Step 3 — Set the masked GitLab CI/CD variables

GitLab → project `cd12536/mercyB` → **Settings → CI/CD → Variables → Add
variable**, twice:

| Key | Value | Flags |
|-----|-------|-------|
| `GOLDEN_FLOW_PREMIUM_JWT` | the premium `eyJ...` token | **Masked**, **Protect** off* |
| `GOLDEN_FLOW_FREE_JWT` | the free `eyJ...` token | **Masked**, **Protect** off* |

- Type: **Variable** (not File). Environment scope: **All (default)**.
- **Masked:** tick it so the value never prints in job logs. JWTs are
  base64url + dots and satisfy GitLab's masking charset; if GitLab refuses
  to mask (older instance / charset complaint), see Troubleshooting — the
  suite never echoes the token, so an unmasked value still does not leak
  into logs, but masked is preferred.
- *Protect:* the `golden-flows-prod` job runs on **main** (a protected
  branch) and on **manual web** runs. If you tick "Protect", the variable
  is only exposed on protected refs — that is fine for the main-push gate.
  Leave Protect **off** only if you also want the variable available to a
  manual run from a non-protected branch. Recommended: **Protect on** is
  safe for the post-deploy gate; turn it off only if you hit "variable not
  set" on a manual branch run.

No code change is needed — `golden-flows-prod` already reads these names.

---

## Step 4 — Verify locally (optional, fastest feedback)

From a clean main checkout:

```bash
cd /Users/admin/MercyB
export GOLDEN_FLOW_PREMIUM_JWT="eyJ...premium..."
export GOLDEN_FLOW_FREE_JWT="eyJ...free..."
npm run verify:golden-flows          # full five-flow suite vs https://mercyblade.com
```

- All five green → activation works; the CI gate will behave identically.
- No-token smoke only (no JWTs handy): `GOLDEN_FLOW_ALLOW_MISSING_SECRETS=1
  npm run verify:golden-flows` runs flows 1/2/5 and skips 3/4.

> Flow 1 (AUTH CONFIG) will be **red until production is redeployed clean**
> — the 2026-06-10 incident bundle still serves `placeholder.invalid`.
> That red is the detector working, not a setup error.

---

## Step 5 — How the CI gate then runs

`golden-flows-prod` (`.gitlab-ci.yml`, `verify` stage):

- Runs automatically on every **push to `main`** (each merge auto-publishes
  via Netlify, so a main-push pipeline is the post-deploy moment), and is
  available as a **manual** job on web-triggered pipelines. It never runs on
  merge-request pipelines, so a still-broken prod can't red feature MRs.
- With **both** JWT variables set → runs the **full five-flow** suite.
- With neither/either missing → runs the **no-token smoke** (flows 1/2/5)
  and skips 3/4. So the gate is always green-capable on the parts that need
  no secret, and upgrades automatically the moment both tokens are present.
- `allow_failure: false` — a real failure blocks the pipeline (visible
  signal that prod is broken). `retry: 1` absorbs a transient prod/network
  blip.

---

## ⚠️ Token expiry — the one thing that will bite

A Supabase **access token expires** (default ~1 hour; set under Dashboard →
Authentication → Sessions / "Access token expiry"). `getUser()` rejects an
expired token with 401, which would make flows 3/4 fail.

What this means in practice:

- **Local / immediate verification (Step 4):** mint, then run within the
  hour. Totally fine.
- **One-off manual CI run:** mint fresh, set the variables, trigger the
  manual `golden-flows-prod` job within the hour. Fine.
- **Recurring auto gate on every main push:** a paste-once token value
  **will expire** and then flows 3/4 start 401-ing on later merges. The
  no-token smoke (1/2/5) keeps protecting you; 3/4 silently degrade to
  "stale token" unless refreshed.

**Pick one:**

1. **Smoke-only as the standing gate (no action, recommended short-term).**
   Leave the JWT variables unset. Flows 1/2/5 run on every deploy forever
   with zero maintenance. Run the full five manually (Step 4) when you want
   the conversation/entitlement assurance. This is the honest steady state
   until option 3 lands.
2. **Raise the access-token TTL** for the project (Dashboard → Auth →
   Sessions). Buys a longer window but is a **global security setting** that
   affects all users — not recommended just for tests.
3. **Durable fix (separate follow-up task, ~small):** store the test users'
   email+password (or refresh tokens) as masked CI vars instead of raw
   access tokens, and have `scripts/golden-flows.sh` exchange them for a
   fresh access token at run time (the same password-grant curl as Step 2).
   Then the full five run green on every deploy with no manual refresh.
   This needs a code change to `golden-flows.sh`, so it is out of scope for
   this docs-only runbook — flagged for A2/next.

---

## Troubleshooting

- **GitLab won't mask the value.** Some instances reject masking if the
  value has disallowed characters or is too short. JWTs should be fine; if
  not, you can save it unmasked (the suite/tests never print the token) or
  use a "Masked and hidden" variable if your GitLab version offers it.
- **Flow 3/4 returns 401 (`Unauthorized` / `Missing bearer token`).** The
  token is expired or malformed. Re-mint (Step 2). Confirm you stored the
  `access_token`, not the `refresh_token` or the anon key.
- **Flow 3 (FOLLOW) returns 403 `Premium required`.** The "premium" user is
  not actually premium — `me-entitlement` is returning `is_premium:false`.
  Re-check Step 1 entitlement and the verification curl in Step 2.
- **Flow 4 (GATE) returns 200 instead of 403.** The "free" user has
  entitlement/admin. Use a genuinely tier-0 user.
- **Flow 1 (AUTH CONFIG) red.** Production still serves a bundle containing
  `placeholder.invalid`. This is the incident, not a token problem — it
  clears after a guarded redeploy from `/Users/admin/MercyB` main
  (`npm run deploy:cf-pages:main`), per DEPLOYMENT.md.
- **`golden-flows-prod` didn't run on a branch.** By design — it only runs
  on main-push and manual web pipelines, never MR pipelines.

---

## Quick reference

```
Project:   buemdfxyhxunzpgdoqin.supabase.co
Mint:      POST /auth/v1/token?grant_type=password  (apikey: <ANON_KEY>)
Vars:      GOLDEN_FLOW_PREMIUM_JWT, GOLDEN_FLOW_FREE_JWT  (GitLab → Settings → CI/CD → Variables, Masked)
Local:     npm run verify:golden-flows         (full 5 with both JWTs)
Smoke:     GOLDEN_FLOW_ALLOW_MISSING_SECRETS=1 npm run verify:golden-flows   (flows 1/2/5)
CI job:    golden-flows-prod  (.gitlab-ci.yml, verify stage, main-push + manual)
Caveat:    access tokens expire ~1h → see "Token expiry"
```
