# Deployment Configuration Guide

This guide explains how to set up automated preview deployments for pull requests.

## Overview

The preview deployment workflow builds your project and can automatically deploy to hosting platforms like Netlify or Vercel. This allows you to preview changes before merging to production.

## Important Notes

### Lovable Cloud / Supabase Backend

- **Preview branches do NOT create separate database instances**
- All preview deployments share the same Lovable Cloud backend
- Supabase Branching (separate DB per preview) is not supported in Lovable
- If you need isolated database environments, you'll need to set this up manually through the Supabase dashboard

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

## Deployment Options

### Option 1: Netlify (Recommended for Static Sites)

1. **Create Netlify account** at https://netlify.com

2. **Get your Site ID and Auth Token:**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Login and get site ID
   netlify login
   netlify sites:list
   ```

3. **Add GitHub Secrets:**
   - Go to your repository → Settings → Secrets and variables → Actions
   - Add these secrets:
     - `NETLIFY_AUTH_TOKEN`: Your Netlify personal access token
     - `NETLIFY_SITE_ID`: Your Netlify site ID

4. **Enable the workflow:**
   - Open `.github/workflows/preview-deployment.yml`
   - Uncomment the `deploy-netlify` job (lines 44-62)
   - Commit and push

### Option 2: Vercel (Recommended for Full-Stack Apps)

1. **Create Vercel account** at https://vercel.com

2. **Get your tokens:**
   - Go to Vercel → Settings → Tokens → Create new token
   - Get your Org ID and Project ID from your project settings

3. **Add GitHub Secrets:**
   - `VERCEL_TOKEN`: Your Vercel authentication token
   - `VERCEL_ORG_ID`: Your organization ID
   - `VERCEL_PROJECT_ID`: Your project ID

4. **Enable the workflow:**
   - Open `.github/workflows/preview-deployment.yml`
   - Uncomment the `deploy-vercel` job (lines 64-77)
   - Update `alias-domains` with your domain
   - Commit and push

### Option 3: Manual Preview (No Configuration Required)

The workflow already builds your project and uploads artifacts. You can:
- Download build artifacts from the workflow run
- Manually deploy to any hosting platform
- Test locally by downloading the `dist` folder

## Workflow Behavior

### When Triggered
- On pull request creation
- On new commits to an open pull request
- On pull request reopening

### What It Does
1. ✅ Validates all JSON data files
2. ✅ Runs TypeScript type checking
3. ✅ Builds the production bundle
4. ✅ Uploads build artifacts
5. 💬 Comments on PR with build status
6. 🚀 (Optional) Deploys to preview platform

### Concurrency
- Only one preview build runs per PR at a time
- New commits cancel in-progress builds

## Environment Variables

Preview deployments use the same environment variables as production:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

These are set automatically by Lovable Cloud.

## Cost Considerations

### Netlify
- Free tier: 100GB bandwidth/month
- Preview deployments count toward bandwidth

### Vercel
- Free tier: 100GB bandwidth/month
- Preview deployments are free on all plans

### GitHub Actions
- Free tier: 2,000 minutes/month for private repos
- Public repos: unlimited

## Troubleshooting

### Build Fails
1. Check the workflow run logs in GitHub Actions
2. Ensure all dependencies are in `package.json`
3. Verify data validation passes locally

### Deployment Fails
1. Verify secrets are configured correctly
2. Check token permissions
3. Ensure site/project IDs are correct

### Preview Shows Outdated Data
- Remember: All previews share the same database
- Database changes affect all preview deployments immediately
- Consider using feature flags for gradual rollouts

## Best Practices

1. **Always validate data files** before committing
2. **Test database changes carefully** - they affect all previews
3. **Use meaningful commit messages** for easy tracking
4. **Close PRs when done** to clean up preview deployments
5. **Monitor build times** and optimize if needed

## Edge Functions — Verified Deploy Procedure

The `supabase-functions.yml` GitHub Actions workflow deploys only
`mercy_weekly_cron` and has been failing for 100+ runs (no
`SUPABASE_ACCESS_TOKEN` repo secret). Until that's fixed, all other
edge functions deploy **manually** from a developer machine — and
the safety bar there is to confirm twice that the bundle you want
is the bundle you shipped.

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

- [Netlify Deploy Documentation](https://docs.netlify.com/site-deploys/overview/)
- [Vercel Deploy Documentation](https://vercel.com/docs/deployments/overview)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Lovable GitHub Integration](https://docs.lovable.dev/tips-tricks/github-integration)

## Support

For issues with:
- **Workflow configuration**: Check GitHub Actions logs
- **Lovable Cloud**: See Lovable documentation
- **Deployment platforms**: Contact Netlify or Vercel support
