# Deployment Configuration Guide

This guide explains how MercyBlade deploys. The project deploys
**exclusively via Vercel** — production through a GitHub Actions
workflow, PR previews through Vercel's native GitHub integration.
There is no other deploy target and no preview-deploy job to
"enable": previews are automatic.

## Overview

- **Production (`main` → prod):** the `production-deploy.yml` GitHub
  Actions workflow is the single owner. See below.
- **PR previews:** Vercel's native GitHub integration builds and
  deploys a preview for every pull request automatically. The preview
  URL appears as the **Vercel** check on the PR. No secrets or
  workflow changes are required for this — it is configured on the
  Vercel project, not in this repo.
- **`preview-deployment.yml`** does **not** deploy. It validates JSON,
  type-checks, builds, uploads a build artifact, and comments build
  status on the PR. It is a CI gate, not a deployer.

## Production Deployment (main → prod)

Production is deployed by the **`production-deploy.yml`** GitHub Actions
workflow — the single owner of production deploys. On every push to `main`
(and via `workflow_dispatch`) it:

1. Pulls the Vercel production environment (`vercel pull --environment=production`)
2. Builds the production bundle with the Vercel build pipeline (`vercel build --prod`)
3. Deploys the prebuilt output (`vercel deploy --prebuilt --prod`)

It **fails loud (red)** if the build or deploy fails — it replaced a former
no-op stub that reported a false green without ever deploying anything (see
the workflow's header comment and PR #657). Requires the GitHub Actions
secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.

> **No double-deploy (PR #681, merged 2026-05-19).** Vercel's GitHub
> App used to also auto-deploy `main`, double-deploying production.
> Root `vercel.json` now sets `{"git":{"deploymentEnabled":{"main":
> false}}}`, so the GitHub App no longer deploys `main` —
> `production-deploy.yml` is the **sole** prod owner. The GitHub App
> still auto-deploys **PR-branch previews** (only the production
> branch is gated; this is intentional — do not "fix" it). Revert
> path if Actions ever proves flaky: delete the `git` block from
> `vercel.json`.

## Important Notes

### Supabase Backend

- **Preview branches do NOT create separate database instances**
- All preview deployments share the same Supabase backend (the single project)
- Supabase Branching (a separate DB per preview) is not configured
- If you need isolated database environments, set this up manually through the Supabase dashboard

### What Gets Previewed

✅ **Previewed:**
- Frontend code changes
- UI/UX updates
- Component changes
- Styling modifications

❌ **Not Isolated Per Preview:**
- Database changes (all previews share same DB)
- Edge functions (deployed globally)
- Storage buckets
- Auth configuration

## How Preview Deploys Work

Previews require **no configuration in this repo**. The Vercel project
is connected to GitHub via Vercel's native integration; opening or
updating a PR triggers a preview build on Vercel directly. The result
surfaces as the **Vercel** status check on the PR, with the preview
URL.

If you ever need a build artifact without Vercel (e.g. to deploy a
one-off to another host), `preview-deployment.yml` already uploads the
`dist/` folder as a downloadable artifact on every PR run — download
it from the workflow run and deploy it wherever you like.

## Workflow Behavior (`preview-deployment.yml`)

### When Triggered
- On pull request creation
- On new commits to an open pull request
- On pull request reopening

### What It Does
1. ✅ Validates all JSON data files
2. ✅ Runs TypeScript type checking
3. ✅ Builds the production bundle
4. ✅ Uploads build artifacts (`dist/`)
5. 💬 Comments build status on the PR

It does **not** deploy — Vercel's native integration handles the
preview deploy independently.

### Concurrency
- Only one preview build runs per PR at a time
- New commits cancel in-progress builds

## Environment Variables

Preview and production deployments use the same environment variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

These are managed in the Vercel project dashboard (Settings → Environment
Variables). See `docs/SECURITY_HARDENING_2025.md` for the canonical list.

## Cost Considerations

### Vercel
- Preview deployments are free on all plans
- The project is on Vercel Pro (no Hobby deployment rate limit)

### GitHub Actions
- Free tier: 2,000 minutes/month for private repos
- Public repos: unlimited

## Troubleshooting

### Build Fails
1. Check the workflow run logs in GitHub Actions
2. Ensure all dependencies are in `package.json`
3. Verify data validation passes locally

### Production Deploy Fails
1. Check the `production-deploy.yml` run logs in GitHub Actions
2. Verify the `VERCEL_TOKEN` / `VERCEL_ORG_ID` / `VERCEL_PROJECT_ID`
   secrets are set and the token is not expired
3. The workflow fails loud (red) on a real failure — never assume a
   green badge means shipped without checking the run

### Preview Missing or Stale
1. Check the **Vercel** status check on the PR for the preview URL and
   build log (the preview is built by Vercel, not by GitHub Actions)
2. Remember: all previews share the same database — DB changes affect
   every preview immediately
3. Consider feature flags for gradual rollouts

## Best Practices

1. **Always validate data files** before committing
2. **Test database changes carefully** - they affect all previews
3. **Use meaningful commit messages** for easy tracking
4. **Close PRs when done** to clean up preview deployments
5. **Monitor build times** and optimize if needed

## Edge Functions — Verified Deploy Procedure

PR #669 added a real edge-function deploy + PR drift-gate pipeline,
replacing the old `supabase-functions.yml` (which only ever deployed a
non-existent `mercy_weekly_cron` and failed for 100+ runs). When you still
deploy an edge function **manually** from a developer machine, the safety
bar is to confirm twice that the bundle you want is the bundle you shipped —
the procedure below makes a stale deploy impossible.

Two stale-deploy cycles in PRs #257 and #258 (azure-phoneme code
merged to main but the manual deploy was run from a working tree
that didn't pull latest) cost real time. The procedure below adds
~10 seconds per deploy and makes that class of mistake impossible.

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

If the second `grep` had returned nothing, the deploy was stale and
the next /pronunciation/srs attempt would still 400 — exactly the
loop PR #258 hit before this procedure existed.

### Picking a good marker

A marker is "any string unique to your PR's diff." The best ones
are stable across rebases:

- a new exported function name
- a new constant name (`UPPER_SNAKE_CASE`)
- a new sentinel reason value (`"azure_payload_failed"`)
- a comment line that names the PR (`PR #259`) — handy for cross-
  referencing back to the change history

Avoid markers that legitimately exist elsewhere in the file (e.g.
common keywords). When in doubt, `git diff main...HEAD <file>` and
pick a string from the green-prefix lines.

## Additional Resources

- [Vercel Deploy Documentation](https://vercel.com/docs/deployments/overview)
- [Vercel Git Integration](https://vercel.com/docs/git)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## Support

For issues with:
- **Workflow configuration**: Check GitHub Actions logs
- **Supabase backend**: See the Supabase project dashboard and `docs/`
- **Deployment platform**: See the Vercel project dashboard / Vercel support
