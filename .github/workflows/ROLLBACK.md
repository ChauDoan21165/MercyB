# Rollback Guide

This guide explains the automated rollback system and how to manually roll back deployments when needed.

## Automated Rollback

The `deploy-with-rollback.yml` workflow automatically rolls back failed deployments.

### How It Works

1. **Backup**: Before deploying, saves the current (working) version's commit SHA
2. **Deploy**: Deploys the new version to production
3. **Health Check**: Runs comprehensive health checks:
   - Application availability (HTTP response)
   - Critical endpoint validation
   - Console error detection (optional)
4. **Rollback**: If health checks fail, automatically redeploys the backup version
5. **Notify**: Creates a GitHub issue documenting the failure

### Health Checks

The workflow checks:
- ✅ **Availability**: Is the app responding with HTTP 200/304?
- ✅ **Endpoints**: Are critical routes accessible?
- ✅ **Retry Logic**: 3 attempts with 10-second intervals

### Configuration

Edit these variables in the workflow:

```yaml
env:
  DEPLOYMENT_TIMEOUT: 300        # 5 minutes
  HEALTH_CHECK_RETRIES: 3        # Number of retry attempts
  HEALTH_CHECK_INTERVAL: 10      # Seconds between retries
```

### Adding Custom Health Checks

Add your critical endpoints in the `endpoint-check` step:

```bash
ENDPOINTS=(
  "/chat/addiction-support-free"
  "/api/health"
  "/api/user/profile"  # Add your endpoints here
)
```

## Manual Rollback Options

### Option 1: Using Lovable History (Recommended for Lovable Hosting)

If your app is hosted on Lovable:

1. **Via Chat History**:
   - Open your Lovable project
   - Scroll through chat history
   - Find the edit you want to restore
   - Click the "Restore" button

2. **Via History Tab**:
   - Click the "History" button at the top of chat
   - Browse through versions
   - Click "Restore" on the desired version

**Advantages**:
- ✅ No code changes needed
- ✅ Instant rollback
- ✅ Works for all changes (frontend & backend)
- ✅ Visual preview of each version

<lov-actions>
  <lov-open-history>View History</lov-open-history>
</lov-actions>

### Option 2: Using GitHub Actions (For CI/CD Pipelines)

If using external hosting (Netlify, Vercel, etc.):

1. **Trigger Manual Rollback**:
   ```bash
   # Via GitHub CLI
   gh workflow run deploy-with-rollback.yml --ref main
   
   # Or use GitHub UI
   # Actions → Deploy with Auto-Rollback → Run workflow
   ```

2. **Deploy Specific Commit**:
   ```bash
   # Checkout the commit you want to deploy
   git checkout <commit-sha>
   
   # Trigger deployment
   git push origin HEAD:rollback-branch --force
   ```

### Option 3: Using Git Revert (Last Resort)

If all else fails:

```bash
# Revert the last commit
git revert HEAD

# Or revert to a specific commit
git revert <commit-sha>

# Push the revert
git push origin main
```

⚠️ **Warning**: This creates a new commit that undoes changes. It doesn't restore the exact previous state.

## Rollback Workflow Comparison

| Method | Speed | Scope | Best For |
|--------|-------|-------|----------|
| **Lovable History** | Instant | All changes | Lovable-hosted apps |
| **GitHub Actions** | 2-5 min | Frontend only* | External hosting |
| **Git Revert** | Varies | Code only | Emergency fixes |

*Backend changes (edge functions, DB) deploy immediately and may need separate rollback.

## Preventing Rollback Scenarios

### Pre-Deployment Checklist

Before pushing to `main`:

- [ ] Run validation: `node scripts/validate-data-files.js`
- [ ] Test locally: `npm run build && npm run preview`
- [ ] Check TypeScript: `npx tsc --noEmit`
- [ ] Review changes in PR
- [ ] Wait for preview deployment to pass
- [ ] Test in preview environment

### Gradual Rollout Strategy

Instead of deploying directly to production:

1. **Use branches**: `develop` → `staging` → `main`
2. **Feature flags**: Toggle features without redeployment
3. **Canary deployments**: Deploy to subset of users first
4. **Monitor metrics**: Watch errors, performance, user behavior

## Monitoring & Alerts

### Health Check Failures

When automated rollback triggers:

1. Check the GitHub issue created automatically
2. Review workflow logs for specific failures
3. Check console logs in Lovable
4. Review recent code changes
5. Test the failing commit locally

### Common Failure Causes

- **Build errors**: Missing dependencies, TypeScript errors
- **Data validation**: Invalid JSON structure
- **API endpoints**: Backend changes not deployed
- **Environment vars**: Missing or incorrect secrets
- **Browser errors**: JavaScript runtime errors

## Rollback Best Practices

### DO ✅

- Test thoroughly in preview environments
- Use automated health checks
- Document why rollbacks happened
- Keep rollback commits clean
- Monitor after rollback

### DON'T ❌

- Skip health checks in production
- Deploy without validation
- Force push to main
- Delete backup commits
- Ignore rollback warnings

## Emergency Procedures

### If Automated Rollback Fails

1. **Manual intervention required**
2. Use Lovable History to restore immediately
3. Check backend status separately
4. Review edge function logs
5. Verify database state

### If Database Rollback Needed

⚠️ **Database changes are NOT automatically rolled back**

For database rollback:
1. You may need to manually revert migrations
2. Check data integrity before reverting
3. Consider creating backup before risky changes
4. Use database snapshots if available

## Support Resources

- [Lovable History Documentation](https://docs.lovable.dev/tips-tricks/troubleshooting)
- [GitHub Actions Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [Deployment Best Practices](https://docs.lovable.dev/user-guides/deployment)

## Questions?

For issues with:
- **Lovable-hosted rollbacks**: Use History feature or contact Lovable support
- **GitHub Actions**: Check workflow logs and GitHub documentation
- **External hosting**: Check your hosting provider's rollback features
