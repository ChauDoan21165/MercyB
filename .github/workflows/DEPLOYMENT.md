# Deployment Configuration Guide

> **2026-05-27 — post-migration rewrite.** Production hosting moved from
> **Vercel** to **Netlify** during the May 26–27 incident cascade (see
> `docs/runbooks/disaster-recovery.md` §0 and §2.2 for the authoritative
> incident log). The repository simultaneously moved from GitHub to
> **GitLab** (`gitlab.com:cd12536/mercyB`). This file is being kept up
> to date with the new ground truth. The original Vercel-centric copy
> is preserved in git history if needed.

---

## Current ground truth (read this first)

- **Repository:** GitLab — `gitlab.com:cd12536/mercyB`. The
  GitHub remote is retained read-only as `old-origin` for forensics.
  Use `glab mr create`, not `gh pr create`.
- **Hosting (production):** **Netlify**. The site at
  `mercyblade.com` is served from Netlify with Cloudflare DNS in
  front of it. Sentry's deploy-environment tag is read from
  `NETLIFY_CONTEXT` (`production` / `deploy-preview` / `branch-deploy`)
  per commit `952d3e9e3 fix(sentry): map deploy environment from
  Netlify CONTEXT, not stale VERCEL_ENV`.
- **Hosting (recovery / fallback):** **Vercel** is now the
  *recovery* host. `vercel.json` still ships in the repo and the
  Vercel project is preserved as the documented emergency landing
  pad. Memory: [[project_vercel_prod_deploy]] (now stale on
  "primary" — Vercel is recovery-only post-migration). See
  `docs/runbooks/disaster-recovery.md` §2.2 for the swap procedure.
- **CI/CD:** GitLab CI (`.gitlab-ci.yml`). Today the only scheduled
  job is the nightly Postgres backup (`nightly-db-backup`). MR-time
  gates (typecheck, lint, test, validate-rooms) are not yet ported
  from the legacy GitHub Actions workflows — that work is its own
  migration track per the GitLab-CI consolidation MR.
- **Legacy GitHub Actions:** the `.github/workflows/*.yml` files
  (`production-deploy.yml`, `preview-deployment.yml`,
  `deploy-edge-functions.yml`, `sync-lessons.yml`, etc.) are
  **legacy** — they do not run today. Treat them as documentation
  of the prior deploy shape, not as current pipeline. Do not
  modify them in a passing PR; the GitHub-to-GitLab CI port is its
  own dispatch.

For the full incident-recovery model (what happens when GitLab /
Netlify / Vercel / Supabase go down, who owns each layer, and
pre-staged commands to swap providers under stress), the
authoritative runbook is
**[`docs/runbooks/disaster-recovery.md`](../../docs/runbooks/disaster-recovery.md)**.
This file is for the steady-state deploy workflow; that file is
for incidents.

---

## Production deployment (main → prod)

### 2026-06-10 incident lock: guarded deploys only

Production deploys are frozen unless they use the guarded canonical
path below. A bad deploy was built from a worktree without Supabase
env and shipped `placeholder.invalid` in the auth bundle. The rule is
now:

1. Deploy only from `/Users/admin/MercyB`.
2. Deploy only from local `main` exactly matching `origin/main`.
3. `npm run build` must fail if `VITE_SUPABASE_URL` or
   `VITE_SUPABASE_ANON_KEY` is missing.
4. The built JS must be scanned before publish:
   `grep -rq "placeholder.invalid" dist/assets/*.js` means **ABORT**.

Canonical Cloudflare Pages command:

```bash
cd /Users/admin/MercyB
git switch main
git pull --ff-only origin main
npm run deploy:cf-pages:main
```

Do not deploy from `/private/tmp/*`, agent worktrees, detached
worktrees, or any branch-specific checkout. Merges may continue while
this lock is active; deploys may not.

### Today (Netlify-native)

Netlify is connected to the GitLab repo via Netlify's GitLab
integration. The connection is configured in the Netlify dashboard,
not in this repo. On every push to `main`, Netlify:

1. Detects the push via the GitLab webhook.
2. Pulls the source.
3. Runs `npm install` and `npm run build`.
4. Publishes the `dist/` output to the production site at
   `mercyblade.com`.

There is **no GitLab CI deploy job** today — Netlify's webhook
integration is the trigger. If a deploy goes wrong, the Netlify
dashboard's deploy log is the first thing to check.

### Manual production deploy (rare)

For emergency manual deploys (e.g. Netlify's webhook is broken,
or a quick one-off from a specific commit):

```bash
cd /Users/admin/MercyB
git switch main
git pull --ff-only origin main
npm install
npm run build
if grep -rq "placeholder.invalid" dist/assets/*.js; then
  echo "ABORT: placeholder.invalid found in built JS assets" >&2
  exit 2
fi
netlify deploy --prod --dir=dist --auth="$NETLIFY_AUTH_TOKEN"
```

`NETLIFY_AUTH_TOKEN` is stored in macOS Keychain — see
[`docs/runbooks/disaster-recovery.md`](../../docs/runbooks/disaster-recovery.md)
§5.5 for the pre-staged form.

### Recovery deploy (Netlify down, Vercel as fallback)

See [`docs/runbooks/disaster-recovery.md`](../../docs/runbooks/disaster-recovery.md)
§2.2 for the full procedure. Short version:

```bash
vercel pull --environment=production --token="$VERCEL_TOKEN"
vercel build --prod
vercel deploy --prebuilt --prod --token="$VERCEL_TOKEN"
```

Then swap the Cloudflare DNS A-record at the dashboard.

---

## Preview deployments

Netlify auto-builds a preview deploy for every merge request branch
via its GitLab integration. The preview URL is posted as a comment
on the MR by Netlify's GitLab bot. No configuration in this repo is
required — it is wired at the Netlify project level.

Sentry's deploy-environment for previews is `deploy-preview` (read
from `NETLIFY_CONTEXT`).

**Database is shared.** Preview deploys all point at the same
production Supabase project (`buemdfxyhxunzpgdoqin.supabase.co`).
Supabase Branching (DB-per-preview) is not configured. Schema
changes affect every preview at once; coordinate carefully.

---

## What gets deployed

✅ **Deployed by Netlify:**

- The Vite-built SPA (`dist/`) — every page in `src/router/AppRouter.tsx`.
- Static assets (`public/*`).
- Static `_redirects` rules (`public/_redirects`).

❌ **NOT deployed by Netlify** (separate deploy paths):

- **Supabase edge functions** (`supabase/functions/*`) — deploy via
  `supabase functions deploy <name> --project-ref <ref>`. The CI
  pipeline for this is not yet ported to GitLab; today this is a
  manual developer-machine deploy. See "Edge functions — verified
  deploy procedure" below.
- **Supabase database migrations** (`supabase/migrations/*.sql`) —
  applied manually via the Supabase dashboard SQL Editor by Chau.
  CLI `db push` is **not** the canonical apply path (memory:
  [[project_agent_infra_access]] — agent restriction).
- **Supabase Storage bucket contents** (`room-audio`, etc.) — no
  build-step deploy; managed via the dashboard or `supabase
  storage` CLI.
- **iOS / Android app bundles** — see
  [`docs/architecture/systems/native-shells.md`](../../docs/architecture/systems/native-shells.md)
  for the Capacitor + store-submission flow.

---

## Environment variables

Production and preview environments use the same env vars. Today
they are managed in the **Netlify project dashboard** (Settings →
Build & deploy → Environment), not in this repo. The canonical
list is `docs/SECURITY_HARDENING_2025.md`; the Vite-prefixed subset
(`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`,
`VITE_SUPABASE_ANON_KEY`, `VITE_SENTRY_DSN`,
`VITE_REVENUECAT_APPLE_API_KEY`, analytics IDs) reaches the
browser bundle. Server-only secrets (Stripe webhook signing,
Resend API key, RevenueCat webhook auth token) live in Supabase
Edge Function secrets (`supabase secrets set <KEY>=<value>
--project-ref buemdfxyhxunzpgdoqin`).

The Vercel project's env vars are retained (mirroring Netlify's)
so the recovery deploy path in §2.2 of disaster-recovery.md works
without re-population.

---

## Cost notes

- **Netlify:** free or Pro tier; deploy bandwidth + build minutes
  fit the current scale (~100 users).
- **Vercel:** the project remains on Pro (no Hobby deployment
  rate limit) so emergency recovery deploys don't hit limits.
- **Supabase:** Pro tier (per `STRATEGY.md` §"Tech stack").
- **GitLab:** free tier; CI minutes fit a single nightly job.
- **Cloudflare:** free tier (DNS + CDN); the `room-audio` bucket
  is Cloudflare-fronted per memory:
  [[project_supabase_audio_cdn_stale]].

---

## Edge functions — verified deploy procedure

Edge function deploys today are **manual from a developer machine**.
The MR-time deploy pipeline that was tracked in PR #669
(`deploy-edge-functions.yml`) is part of the GitHub-to-GitLab CI
port that hasn't landed yet. Until it does, use the procedure
below — it costs ~10 seconds per deploy and makes the stale-deploy
class of mistake impossible.

Two stale-deploy cycles in PRs #257 and #258 (azure-phoneme code
merged to main but the manual deploy was run from a working tree
that didn't pull latest) cost real time. The procedure below adds
the verify-twice gate that prevents repetition.

### Five-step procedure

```bash
# 1. Sync local main — NEVER deploy from a stale tree.
git checkout main && git pull

# 2. Confirm the change is actually in your local source.
#    Pick a string unique to the PR's diff (a new function name,
#    a new comment, a new constant). If grep returns 0 lines,
#    you didn't pull or you're on the wrong branch.
grep <marker> supabase/functions/<name>/core.ts

# 3. Deploy.
supabase functions deploy <name> --project-ref <ref>

# 4. Re-download the live bundle. (Use a scratch dir, NOT your repo.)
mkdir -p /tmp/verify-deploy && cd /tmp/verify-deploy
supabase link --project-ref <ref>
supabase functions download <name>

# 5. Confirm the same marker appears in the deployed bundle.
#    If grep returns 0 lines, the deploy didn't ship your change —
#    investigate before announcing the deploy as complete.
grep <marker> supabase/functions/<name>/core.ts
```

Step 5 is the one that prevented PR #258 → PR #259 from being a
third stale-deploy cycle. **Never skip it on a manual deploy.**

### Worked example — PR #259

PR #259 fixed the Azure Pronunciation Assessment 400 by replacing
base64url with standard base64 in the `Pronunciation-Assessment`
header. The PR added a new constant `configHeaderUsesBase64UrlChars`
in the failure-path log — that's the marker.

```bash
git checkout main && git pull
grep configHeaderUsesBase64UrlChars supabase/functions/azure-phoneme/core.ts
# → matches one line; PR #259 is in local source.

supabase functions deploy azure-phoneme --project-ref buemdfxyhxunzpgdoqin
# → "Deployed Function azure-phoneme on project ..."

mkdir -p /tmp/verify-deploy && cd /tmp/verify-deploy
supabase link --project-ref buemdfxyhxunzpgdoqin
supabase functions download azure-phoneme
grep configHeaderUsesBase64UrlChars supabase/functions/azure-phoneme/core.ts
# → matches one line; PR #259 is also live.
```

### Picking a good marker

A marker is "any string unique to your PR's diff." The best ones
are stable across rebases:

- a new exported function name
- a new constant name (`UPPER_SNAKE_CASE`)
- a new sentinel reason value (`"azure_payload_failed"`)
- a comment line that names the MR (`MR !456`) — handy for
  cross-referencing back to the change history

Avoid markers that legitimately exist elsewhere in the file (e.g.
common keywords). When in doubt,
`git diff main...HEAD <file>` and pick a string from the
green-prefix lines.

---

## Troubleshooting

### Production deploy didn't trigger

1. Open the Netlify dashboard → site → **Deploys**. Is the latest
   commit listed?
2. If not, check the GitLab → Netlify webhook in the Netlify
   dashboard → **Site settings** → **Build & deploy** → **Continuous
   deployment**. The webhook URL should be reachable from GitLab.
3. As a fallback, manually trigger from the dashboard: **Deploys**
   → **Trigger deploy** → **Deploy site**.

### Build fails on Netlify but passes locally

1. Check the Netlify build log for the failing step.
2. Most common cause: a Node version mismatch. Netlify reads
   `.nvmrc` or `NODE_VERSION` env var; this repo targets Node 22.
3. Second most common: missing env var. The Netlify dashboard's
   env-var list must include every `VITE_*` referenced at build
   time.
4. Reproduce locally with the same Node version (`nvm use 22`) and
   the same env shape (`netlify env:list` to compare).

### Preview is missing or stale

1. Check the **Netlify** bot's comment on the MR for the preview
   URL. If absent, Netlify's webhook didn't fire — see "Production
   deploy didn't trigger" above.
2. Remember: all previews share the same Supabase project. DB
   changes affect every preview immediately.
3. Consider feature flags for gradual rollouts.

### Sentry events tagged with the wrong `deploy_env`

The environment is read from `NETLIFY_CONTEXT` (post-migration). If
you see `production` events that are actually previews, or vice
versa, check:

1. The `src/lib/monitoring/sentryInit.ts` environment-mapper —
   `NETLIFY_CONTEXT` should map `production` → `production`,
   `deploy-preview` → `preview`, `branch-deploy` → `branch`.
2. The Netlify env var `NETLIFY_CONTEXT` is set by Netlify itself
   per deploy; you do not configure it.

### "I can't push to origin"

The remote is GitLab now. `git remote -v` should show:

```
old-origin  git@github.com-chau:ChauDoan21165/MercyB.git (fetch + push)
origin      git@gitlab.com:cd12536/mercyB.git (fetch + push)
```

If `origin` still points at GitHub, your local repo is from before
the migration. `git remote set-url origin git@gitlab.com:cd12536/mercyB.git`.

---

## Pre-deployment checklist

Before pushing to `main`:

- [ ] Run validation: `npm run validate-rooms`
- [ ] Test locally: `npm run build && npm run preview`
- [ ] Check TypeScript: `npm run typecheck:ci` (not `typecheck` —
      the `:ci` variant matches CI exactly)
- [ ] Run lint: `npm run lint`
- [ ] Run unit tests: `npm test`
- [ ] Wait for the Netlify preview deploy on the MR; click through
      the change at 375 px width
- [ ] Read the MR description; ensure it lists the test plan

The Netlify preview is the gate. If preview is green and you've
clicked through the relevant flow, the push to `main` is the safe
default.

---

## Related runbooks

- **`docs/runbooks/disaster-recovery.md`** — incident playbook
  (GitLab down, Netlify down, Supabase locked out, …). Authoritative
  recovery procedures per provider.
- **`.github/workflows/ROLLBACK.md`** — application-level rollback
  (rolling back a bad deploy to a known-good version).
- **`docs/runbooks/placement-to-lesson.md`** — per-flow runbook
  example.
- **`docs/architecture/systems/observability.md`** — Sentry
  configuration; explains the `NETLIFY_CONTEXT` mapping.
- **`docs/architecture/systems/native-shells.md`** — iOS / Android
  Capacitor deploy paths (separate from the web deploy this file
  documents).

---

## Support

For issues with:

- **Production deploy** — Netlify dashboard → support@netlify.com (Pro)
  or community forum (free).
- **Recovery deploy** — Vercel dashboard → help@vercel.com (Pro).
- **GitLab CI / repo** — `support@gitlab.com` or community forum.
- **Supabase backend** — see the Supabase project dashboard and
  `docs/runbooks/disaster-recovery.md` §2.3.

When in doubt, follow `docs/runbooks/disaster-recovery.md` —
that's the authoritative incident-response runbook.
