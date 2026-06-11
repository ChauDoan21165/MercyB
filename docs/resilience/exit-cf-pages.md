# Cloudflare Pages — Exit Plan (48 h)

> **Why this doc exists:** Cloudflare Pages is the designated emergency
> hosting fallback for Netlify outages (per `docs/runbooks/disaster-recovery.md`
> §2.2 and §5.6). If CF Pages becomes the live host and then itself needs to be
> vacated — or if a CF account lockout hits during an already-live CF Pages
> deployment — this doc is the playbook for moving out within 48 hours.
>
> **Scope:** CF Pages as hosting layer only. DNS is Cloudflare too (separate
> concern — see `disaster-recovery.md` §2.5). This doc does NOT cover
> Cloudflare R2 storage (see `exit-r2.md`).

---

## What CF Pages holds that must be migrated

| Asset | Where it lives | Export method |
|---|---|---|
| Static build artifact (`dist/`) | Reproduced from repo via `npm run build` | No export needed — build from `main` |
| Environment variables set in CF Pages dashboard | CF Pages → Settings → Environment variables | Manual export (no API yet) |
| Custom domain binding (`mercyblade.com`) | Cloudflare DNS CNAME record | DNS A/CNAME update |
| Deploy history / rollback targets | CF Pages dashboard | Non-critical; repo git history is the source |

**Key insight:** CF Pages is a static-SPA host. No user data lives there. The
exit path is: build the artifact, redeploy to the new host, update DNS. That
sequence is reliably executable in under an hour.

---

## Pre-flight: confirm the exit target

Per `disaster-recovery.md §6.1` ("two providers max per layer"), pick ONE:

| Target | When to choose | Pre-req |
|---|---|---|
| **Netlify** (primary host) | CF Pages was the emergency fallback and Netlify has recovered | Netlify site still exists; `NETLIFY_AUTH_TOKEN` in env |
| **Vercel** (recovery host) | Both Netlify and CF Pages are suspect | `VERCEL_TOKEN` available; `vercel.json` in repo |

If the CF Pages issue is Cloudflare-wide (account lockout rather than CF Pages
service fault), see `disaster-recovery.md §2.5` for DNS fallback first, then
come back here.

---

## Exit sequence

### Step 1 — Confirm CI can reach the repo

```bash
# Verify GitLab and the local worktree are healthy
git fetch origin
git status
git log --oneline -3
```

If GitLab is also unavailable, see `docs/resilience/repo-mirror.md` to push
via the Codeberg mirror.

### Step 2 — Build the artifact locally

```bash
# Pull current env vars from your active host's secrets store
# (set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from the values
#  already in your environment or Netlify/Vercel env dashboards)
npm run build   # produces dist/ — the artifact to deploy
```

### Step 3a — Deploy to Netlify (if returning to primary)

```bash
# netlify-cli must be installed: npm install -g netlify-cli
netlify deploy --prod --dir=dist \
  --auth="$(security find-generic-password -s mb-netlify-auth-token -w 2>/dev/null || echo "$NETLIFY_AUTH_TOKEN")"
```

### Step 3b — Deploy to Vercel (if CF Pages + Netlify are both suspect)

```bash
vercel pull --environment=production \
  --token="$(security find-generic-password -s mb-vercel-token -w 2>/dev/null || echo "$VERCEL_TOKEN")"
vercel build --prod
vercel deploy --prebuilt --prod \
  --token="$(security find-generic-password -s mb-vercel-token -w 2>/dev/null || echo "$VERCEL_TOKEN")"
```

### Step 4 — Redirect DNS away from CF Pages

CF Pages domains follow the pattern `<project>.pages.dev` and the custom
domain binding is a Cloudflare DNS CNAME. Once the new host is confirmed live:

1. Open Cloudflare dashboard → DNS → Records.
2. Find the record for `mercyblade.com` (likely a CNAME or `@` A record
   pointing to CF Pages).
3. Update it to point to the new host's origin:
   - Netlify: the CNAME target is your Netlify site subdomain
     (shown in Netlify → Domain settings as the "Netlify subdomain")
   - Vercel: the CNAME target is `cname.vercel-dns.com`
4. Verify propagation:
   ```bash
   dig +short mercyblade.com CNAME
   curl -sI https://mercyblade.com | grep -E '^(HTTP|server:)'
   ```
   Propagation is usually < 1 minute inside Cloudflare's network.

### Step 5 — Remove the CF Pages custom domain binding

Once DNS propagation is confirmed:

1. CF Pages dashboard → your project → Custom domains.
2. Remove `mercyblade.com` from the list.
3. (Optional) Delete the CF Pages project to avoid stray deploys.

### Step 6 — Smoke-test the new host

```bash
# Run the three public golden flows (no JWT needed)
GOLDEN_FLOW_ALLOW_MISSING_SECRETS=1 npm run verify:golden-flows
# Expect flows 1 (AUTH CONFIG), 2 (TTS), 5 (SIGNIN) to be green
```

---

## Secrets rotation (if CF account is compromised)

If the exit is triggered by a CF account compromise (not just a service outage):

| Secret | Location | Action |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | macOS Keychain `mb-cloudflare-api-token`; also in GitLab CI vars | Revoke in CF dashboard → My Profile → API Tokens; generate new; update Keychain + CI |
| CF Pages project-level env vars | CF Pages dashboard | Already rotated once the project is deleted or locked |
| Cloudflare Zone ID | Not a secret; needed for DNS API calls (see `disaster-recovery.md §5.2`) | Re-export zone file; note new Zone ID if account changes |

Cloudflare API tokens are scoped — a compromised *Pages* token does NOT
automatically mean the *DNS* or *R2* tokens are compromised. Check the token
scope list in the dashboard before rotating everything.

---

## Cross-reference: update `disaster-recovery.md` after exit

When CF Pages is vacated:

- §2.2 "Pre-staged commands" section: note the CF Pages deploy command is
  no longer the active path and flag the new host.
- §1 table, Hosting row "Backup status today": update to reflect whether
  CF Pages is still a viable fallback.

---

## Maintenance

- **No routine action** — CF Pages exit is only executed under incident conditions.
- **Quarterly check:** verify that the `netlify-cli` and `vercel` CLIs in the
  developer environment are still authenticated and that the credentials
  in Keychain are current (run `netlify status` and `vercel whoami`).
- **If the CF Pages project is intentionally live** (i.e., you've migrated
  to CF Pages as primary, not emergency): re-scope this doc to describe
  exit FROM CF Pages to Netlify/Vercel; the sequence above already covers it.

---

**Last verified:** 2026-06-11.
**Cross-ref:** `disaster-recovery.md` §2.2, §5.5, §5.6; `exit-r2.md` (CF R2 storage, separate concern).
