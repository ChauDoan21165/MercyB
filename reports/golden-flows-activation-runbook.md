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
| 1 | AUTH CONFIG — served bundle carries the real Supabase project ref | No |
| 2 | TTS — Vietnamese returns Azure audio, never silent fallback | No |
| 3 | FOLLOW — Mercy's opener follows learner context | **Yes — premium JWT** |
| 4 | GATE — free account blocked (403) before processing | **Yes — free JWT** |
| 5 | SIGNIN — auth backend is a real, reachable Supabase | No |

Flows 1, 2, 5 (the **no-token smoke**) already run green with zero setup.
This runbook activates flows 3 and 4. There are **two paths**:

**Path A — durable CI (recommended, implemented in `scripts/golden-flows.sh`):**
Set email+password pairs as masked GitLab CI/CD variables. The harness mints a
fresh token on every run — no manual refresh ever needed.

- `GOLDEN_FLOW_PREMIUM_EMAIL` + `GOLDEN_FLOW_PREMIUM_PASSWORD` — credentials for the premium test user.
- `GOLDEN_FLOW_FREE_EMAIL` + `GOLDEN_FLOW_FREE_PASSWORD` — credentials for the free test user.
- `GOLDEN_FLOW_SUPABASE_ANON_KEY` (or `VITE_SUPABASE_ANON_KEY`) — the project anon key used to exchange credentials for tokens.

**Path B — one-shot paste (short-lived, not for recurring CI):**
Mint tokens manually and set them directly:

- `GOLDEN_FLOW_PREMIUM_JWT` — a logged-in **premium** user's access token (direct override; takes priority over Path A).
- `GOLDEN_FLOW_FREE_JWT` — a logged-in **free (tier-0)** user's access token (same).

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
variable**.

### Path A — durable (recommended)

Set these 5 variables. The harness mints fresh tokens on every CI run:

| Key | Value | Flags |
|-----|-------|-------|
| `GOLDEN_FLOW_PREMIUM_EMAIL` | `golden-premium@mercyblade.test` | **Masked**, Protect on |
| `GOLDEN_FLOW_PREMIUM_PASSWORD` | your premium test user password | **Masked**, Protect on |
| `GOLDEN_FLOW_FREE_EMAIL` | `golden-free@mercyblade.test` | **Masked**, Protect on |
| `GOLDEN_FLOW_FREE_PASSWORD` | your free test user password | **Masked**, Protect on |
| `GOLDEN_FLOW_SUPABASE_ANON_KEY` | project anon public key | **Masked**, Protect on |

> `VITE_SUPABASE_ANON_KEY` is already set in CI for the build — the harness
> falls back to it automatically, so you can skip `GOLDEN_FLOW_SUPABASE_ANON_KEY`
> if the build var is present on the same job.

### Path B — one-shot paste (short-lived, not for recurring CI)

| Key | Value | Flags |
|-----|-------|-------|
| `GOLDEN_FLOW_PREMIUM_JWT` | the premium `eyJ...` token | **Masked**, Protect off* |
| `GOLDEN_FLOW_FREE_JWT` | the free `eyJ...` token | **Masked**, Protect off* |

When both `_JWT` vars are set they take priority over Path A (no minting
happens). Useful for a one-off manual verification run.

---

Common flags for all variables:
- Type: **Variable** (not File). Environment scope: **All (default)**.
- **Masked:** tick it so values never print in job logs.
- *Protect:* Recommended **on** for the post-deploy gate on `main`. Turn off
  only if you hit "variable not set" on a manual non-protected-branch run.

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

> Flow 1 (AUTH CONFIG) verifies the served JS bundle contains the real
> Supabase project ref. If production was deployed with the correct
> `VITE_SUPABASE_URL`, it is green with zero setup.

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

## ✅ Token expiry — resolved (Option 3 implemented)

A Supabase **access token expires** (~1 hour by default). Option 3 from the
original runbook — mint a fresh token at run time using stored credentials —
is now implemented in `scripts/golden-flows.sh` (A4 MR). The gate never
holds a stale token; it always mints fresh before running Playwright.

### How it works

`scripts/golden-flows.sh` resolves each JWT in priority order:

1. **`GOLDEN_FLOW_PREMIUM_JWT` / `GOLDEN_FLOW_FREE_JWT` set** → used as-is
   (manual override; useful for fast local runs or one-off debugging).
2. **`GOLDEN_FLOW_PREMIUM_EMAIL` + `GOLDEN_FLOW_PREMIUM_PASSWORD`** (and
   free equivalents) **set** → script mints a fresh access token at run
   time via the Supabase password grant. Token never touches a file or log.
3. **Neither** + `GOLDEN_FLOW_ALLOW_MISSING_SECRETS=1` → dry-run (flows
   3/4 skip, as before).
4. **Neither** + no escape hatch → exit 2 (hard fail, as before).

### Step 3b — Set the durable credentials (replaces Step 3)

> **Do this instead of setting `GOLDEN_FLOW_PREMIUM_JWT` /
> `GOLDEN_FLOW_FREE_JWT`.** The credential vars never expire; the script
> exchanges them for a fresh JWT on every run.

GitLab → project `cd12536/mercyB` → **Settings → CI/CD → Variables → Add
variable**, four times:

| Key | Value | Flags |
|-----|-------|-------|
| `GOLDEN_FLOW_PREMIUM_EMAIL` | e.g. `golden-premium@mercyblade.test` | **Masked**, Protect on |
| `GOLDEN_FLOW_PREMIUM_PASSWORD` | the premium test account password | **Masked**, Protect on |
| `GOLDEN_FLOW_FREE_EMAIL` | e.g. `golden-free@mercyblade.test` | **Masked**, Protect on |
| `GOLDEN_FLOW_FREE_PASSWORD` | the free test account password | **Masked**, Protect on |

**Anon key:** `scripts/golden-flows.sh` reads `GOLDEN_FLOW_ANON_KEY` first,
then falls back to `VITE_SUPABASE_ANON_KEY`. If `VITE_SUPABASE_ANON_KEY` is
already a CI variable for your build (it is, since it ships in the bundle),
no separate anon-key variable is needed. If not, add:

| Key | Value | Flags |
|-----|-------|-------|
| `GOLDEN_FLOW_ANON_KEY` | the project `anon` `public` key | Masked |

Once these four (or five) variables are set the `golden-flows-prod` job
automatically promotes to the full five-flow suite on every `main` push —
no manual refresh, no expiry.

The old `GOLDEN_FLOW_PREMIUM_JWT` / `GOLDEN_FLOW_FREE_JWT` variables (if
you previously set them) can be left in place — they act as overrides and
take priority over the credential path.

---

### Historical options (for reference)

1. ~~**Smoke-only as the standing gate.**~~ Still valid if you want the
   minimal-maintenance posture; leave all credential vars unset.
2. ~~**Raise the access-token TTL.**~~ Global security setting, not
   recommended.
3. **Durable fix — IMPLEMENTED** (this runbook, A4 MR): credentials stored
   as masked CI vars; script mints fresh JWTs at run time.

---

## Troubleshooting

- **GitLab won't mask the value.** Some instances reject masking if the
  value has disallowed characters or is too short. JWTs should be fine; if
  not, you can save it unmasked (the suite/tests never print the token) or
  use a "Masked and hidden" variable if your GitLab version offers it.
- **Flow 3/4 returns 401 (`Unauthorized` / `Missing bearer token`).** With
  the credential path: the mint call failed silently (check CI job logs for
  `failed to mint … JWT — HTTP …`). Verify the test account password in
  Supabase Dashboard. With the override path: the JWT is expired or malformed
  — re-mint manually (Step 2) and update the `*_JWT` CI variable.
- **Flow 3 (FOLLOW) returns 403 `Premium required`.** The "premium" user is
  not actually premium — `me-entitlement` is returning `is_premium:false`.
  Re-check Step 1 entitlement and the verification curl in Step 2.
- **Flow 4 (GATE) returns 200 instead of 403.** The "free" user has
  entitlement/admin. Use a genuinely tier-0 user.
- **Flow 1 (AUTH CONFIG) red.** The served JS bundle does not contain the
  real Supabase project ref `buemdfxyhxunzpgdoqin`. This means production
  was built with a missing or wrong `VITE_SUPABASE_URL`. It clears after a
  guarded redeploy with the correct env vars set, per DEPLOYMENT.md.
- **`golden-flows-prod` didn't run on a branch.** By design — it only runs
  on main-push and manual web pipelines, never MR pipelines.

---

## Quick reference

```
Project:   buemdfxyhxunzpgdoqin.supabase.co
Mint:      POST /auth/v1/token?grant_type=password  (apikey: <ANON_KEY>)

Durable CI vars (set once, never expire):
  GOLDEN_FLOW_PREMIUM_EMAIL     premium test account email    (Masked, Protect on)
  GOLDEN_FLOW_PREMIUM_PASSWORD  premium test account password (Masked, Protect on)
  GOLDEN_FLOW_FREE_EMAIL        free test account email       (Masked, Protect on)
  GOLDEN_FLOW_FREE_PASSWORD     free test account password    (Masked, Protect on)
  GOLDEN_FLOW_ANON_KEY          Supabase anon key             (Masked; omit if
                                                               VITE_SUPABASE_ANON_KEY
                                                               is already a CI var)

Override vars (optional, direct JWT — bypasses mint; useful for local one-offs):
  GOLDEN_FLOW_PREMIUM_JWT       premium user access token     (Masked)
  GOLDEN_FLOW_FREE_JWT          free user access token        (Masked)

Local:     npm run verify:golden-flows         (full 5 — with creds or override JWTs)
Smoke:     GOLDEN_FLOW_ALLOW_MISSING_SECRETS=1 npm run verify:golden-flows   (flows 1/2/5)
CI job:    golden-flows-prod  (.gitlab-ci.yml, verify stage, main-push + manual)
Expiry:    none — script mints a fresh token on every run (see "Token expiry")
```
