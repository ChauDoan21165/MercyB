# Rollback Guide

> **2026-05-27 — post-migration rewrite.** Production hosting moved
> from Vercel to **Netlify** during the May 26–27 incident cascade
> (see `docs/runbooks/disaster-recovery.md` §0). Rollback paths
> previously documented for the Vercel-native "Promote to Production"
> flow have been replaced with Netlify-equivalents. The
> `deploy-with-rollback.yml` GitHub Actions workflow referenced in
> the prior version of this doc **was deleted in PR #681** (memory:
> [[project_vercel_prod_deploy]]) before the migration and is not
> applicable post-migration either way. The original copy is in git
> history if needed.

---

## When to use this guide

This doc covers **application-level rollback** — rolling back a bad
deploy to a known-good version of the same product. For
**incident-level recovery** (provider outages, account lockouts,
full service migrations), the authoritative runbook is
**[`docs/runbooks/disaster-recovery.md`](../../docs/runbooks/disaster-recovery.md)**.

The two are distinct:

- **Rollback (this doc):** *"We shipped a bad deploy; restore the
  previous one."* Minutes to fix. Reversible.
- **Disaster recovery:** *"GitLab is down" / "Netlify is down" /
  "Supabase locked us out"*. Hours or days to fix. The runbook in
  `docs/runbooks/disaster-recovery.md` is the authority.

---

## Option 1 — Netlify "Restore Deploy" (recommended for the frontend)

The fastest path for a bad frontend deploy is restoring a previous
Netlify deploy directly from the dashboard.

1. Open the Netlify dashboard → site → **Deploys**.
2. Find the last green production deploy (look for the "Published"
   tag against `main`).
3. Open its **⋯** menu → **Publish deploy** (or "Restore deploy",
   depending on the dashboard wording).

This rewrites the production alias to point at the previously-built
artifact. Near-instant; no rebuild required.

**Advantages**

- ✅ No code change.
- ✅ Near-instant — promoting an already-built artifact.
- ✅ Visual list of every prior deploy with commit SHA + Sentry
  release tag.

**Limits**

> ⚠️ Netlify "Publish deploy" rolls back the **frontend bundle
> only**. Supabase edge functions, database migrations, and Storage
> are deployed via separate paths (`docs/architecture/systems/native-shells.md`
> §2.3 of the disaster recovery doc has the full map). If the bad
> deploy included an edge-function update, see **Option 3** below.

---

## Option 2 — `netlify deploy --prod` from a known-good commit

When the dashboard isn't reachable (rare) or you want a CLI path:

```bash
# Check out the commit you want to restore
git checkout <known-good-sha>

# Build clean
npm install
npm run build

# Push it to prod
netlify deploy --prod --dir=dist --auth="$NETLIFY_AUTH_TOKEN"
```

`NETLIFY_AUTH_TOKEN` lives in macOS Keychain — see
[`docs/runbooks/disaster-recovery.md`](../../docs/runbooks/disaster-recovery.md)
§5.5. After the deploy, `dig +short mercyblade.com A` should still
point at Netlify (no DNS swap needed).

If you don't have Netlify CLI installed:

```bash
npm install -g netlify-cli
netlify login
```

---

## Option 3 — fall back to Vercel (recovery host)

If Netlify itself is degraded, the recovery host is **Vercel**.
`vercel.json` still ships in the repo and the project is preserved
for this exact path.

```bash
vercel pull --environment=production --token="$VERCEL_TOKEN"
vercel build --prod
vercel deploy --prebuilt --prod --token="$VERCEL_TOKEN"
```

Then swap Cloudflare DNS to the Vercel origin. The full procedure
is documented in
[`docs/runbooks/disaster-recovery.md`](../../docs/runbooks/disaster-recovery.md)
§2.2 — read it before doing this under stress.

---

## Option 4 — git revert (last resort)

For the rare case where a code-level revert is the right shape (not
a deploy rollback, but an undo of the commit itself):

```bash
# Revert the bad commit
git revert <bad-sha>

# Or revert multiple commits in a range
git revert <oldest-sha>..<newest-sha>

# Push the revert; Netlify auto-deploys on push to main
git push origin main
```

⚠️ **This creates a new commit** that undoes the previous changes;
it does not restore the previous state byte-for-byte. Use Option 1
or 2 if you need exact restoration.

---

## Rollback method comparison

| Method                       | Speed         | Scope            | Best for                          |
|------------------------------|---------------|------------------|-----------------------------------|
| **Netlify Publish deploy**   | Near-instant  | Frontend only*   | Bad frontend deploy               |
| **`netlify deploy --prod`**  | 1–3 min       | Frontend only*   | CLI-only environments             |
| **Vercel recovery deploy**   | 3–5 min       | Frontend only*   | Netlify itself is degraded        |
| **`git revert`**             | Varies        | Code only        | The bug is in code, not deploy    |

*Backend changes (edge functions, migrations, Storage) deploy via
separate paths and must be rolled back separately.

---

## Edge function rollback

Edge functions are not rolled back by any frontend host. To revert
an edge function to a prior version:

```bash
# Check out the prior version of the function
git checkout <known-good-sha> -- supabase/functions/<name>/

# Use the verified deploy procedure from DEPLOYMENT.md §"Edge functions"
# (Steps 1–5 — sync, marker-grep, deploy, download, verify-grep)
```

If the edge function update was part of a stale-deploy mishap (a
function shipped from a stale tree), the verify-grep procedure in
**[`.github/workflows/DEPLOYMENT.md`](./DEPLOYMENT.md)** is what
catches it.

---

## Database / migration rollback

⚠️ **Database changes are NOT automatically rolled back.**

For a migration rollback:

1. **Verify the migration is the cause** — check Sentry for the
   error class spike that started at the migration timestamp.
2. **Write a reverse migration.** Don't try to "unwind" a migration
   in-place; write a new migration file with the inverse operation
   and apply it via the Supabase dashboard SQL Editor.
3. **Test the reverse migration on a staging copy first** if the
   stakes warrant. For destructive changes (DROP, ALTER COLUMN
   that loses data), the reverse migration may not be loss-less.
4. **Memory: [[project_db_schema_drift_audit]]** — the canonical
   apply path is Supabase SQL Editor by Chau, NOT `supabase db
   push`. Agent-driven migrations are not in the working contract.

---

## Preventing rollback scenarios

### Pre-deployment checklist

Before pushing to `main`:

- [ ] `npm run typecheck:ci` (matches CI exactly — not
      `typecheck`)
- [ ] `npm run lint`
- [ ] `npm test`
- [ ] `npm run validate-rooms`
- [ ] Local build: `npm run build && npm run preview`
- [ ] Wait for the Netlify preview deploy on the MR
- [ ] Click through the changed flow at 375 px width
- [ ] Read the MR description; confirm the test plan reflects what
      you actually ran

### Gradual rollout strategy (when stakes warrant)

For risky changes:

1. **Branch-based rollout** — use a `branch-deploy` URL (Netlify
   serves every branch as a separate preview) to put the change in
   front of a subset of testers.
2. **Feature flags** — wrap the change in a feature flag so the
   deploy is "dark" by default and the flag flip is the real
   rollout. See `src/lib/featureFlags.ts`.
3. **Monitor metrics post-deploy** — Sentry error rate, key page
   load metrics, the `me-entitlement` call rate.

---

## Monitoring & alerts

### Where to look first after a deploy

1. **Sentry** — `chau-doan / mercyblade-web`. The two RLS alert
   rules (`17072095`, `17072096`) fire on sustained security
   regressions; new error classes appear as separate issues.
2. **Netlify deploy log** — for build/deploy failures themselves.
3. **Supabase dashboard** — for DB / Auth / edge-function errors.
4. **`@sentry/capacitor` native crashes** — for the iOS/Android
   apps. Memory: [[project_sentry_infra_access]] notes that §15
   Bar #6 (native crash telemetry confirmed on-device) is owner-
   gated.

### Common post-deploy failure causes

- **Build errors** — TypeScript errors that escaped `typecheck:ci`,
  missing deps.
- **Data validation** — invalid room JSON (caught by
  `rooms:check` prebuild hook locally; should never reach
  Netlify).
- **API endpoints** — backend changes (edge functions, migrations)
  not deployed in lockstep with the frontend.
- **Environment vars** — missing or incorrect secret in Netlify's
  dashboard.
- **JavaScript runtime errors** — covered by Sentry; the
  route-gate means the SDK only loads when needed
  ([`docs/architecture/systems/observability.md`](../../docs/architecture/systems/observability.md)).

---

## Rollback best practices

### DO ✅

- Use Netlify "Publish deploy" first; it's the fastest, lowest-risk
  path.
- Document why the rollback happened in a short incident note
  (`reports/incident-YYYY-MM-DD.md` — same convention as
  disaster-recovery.md §7.2).
- Keep rollback commits clean (if you `git revert`, include the
  reverted commit's SHA in the message body).
- Re-monitor Sentry for ~10 minutes after the rollback to confirm
  the error class has stopped firing.

### DON'T ❌

- Skip the post-rollback monitor window.
- Force-push to `main` (you don't need to — Netlify rolls back via
  the dashboard, not via git).
- Delete the bad commit. Keep it in history so the root-cause can
  be diagnosed and a real fix authored.
- "Just roll back and ignore the bug" — every rollback gets a
  short post-incident note explaining the cause AND the planned
  fix.

---

## Emergency procedures

### If both Netlify and Vercel are unreachable

Cloudflare Pages is the third-line option per
[`docs/runbooks/disaster-recovery.md`](../../docs/runbooks/disaster-recovery.md)
§2.2. Single-vendor concentration means it's emergency-only.

```bash
# Build, then deploy to Cloudflare Pages
npm run build
npx wrangler pages deploy dist --project-name mercyblade
```

DNS swap is the same Cloudflare dashboard step as for Vercel.

### If a rollback doesn't recover (the bug is in the DB / function)

1. **Check whether the bad change was in an edge function or
   migration**, not the frontend.
2. **Rollback the relevant layer** — see "Edge function rollback"
   or "Database / migration rollback" above.
3. **Verify the bug is gone post-rollback.** Open the relevant
   page or trigger the relevant flow; confirm Sentry shows the
   error class stopped.

---

## Cross-references

- **`.github/workflows/DEPLOYMENT.md`** — steady-state deploy
  workflow. Read this for "how does production deploy normally?"
- **`docs/runbooks/disaster-recovery.md`** — incident-level
  playbook for provider outages.
- **`docs/architecture/systems/observability.md`** — Sentry
  monitoring + the dashboard alert rules.
- **`docs/architecture/systems/billing-entitlement.md`** — the
  entitlement contract that gives subscriber-impacting deploys
  weeks of runway (existing premium users keep access until
  `current_period_end`).
- **`CLAUDE.md`** — operating discipline; the "restore before
  redesign" principle is the spirit of this whole doc.

---

## Support

- **Netlify support** — `support@netlify.com` (Pro) or community
  forum.
- **Vercel support** — `help@vercel.com` (Pro tier) or community
  forum.
- **Supabase support** — `support@supabase.io`.
- **GitLab support** — `support@gitlab.com` or forum.

The standing principle (`PRINCIPLES.md` §5 — diagnose before
patching): every rollback needs a one-line cause documented in the
incident note. Otherwise the same class of bug ships again next
week.
