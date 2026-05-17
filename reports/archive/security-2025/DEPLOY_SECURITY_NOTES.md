# 🔐 Deployment Security Configuration

## Critical Security Rule: Block Public JSON Access

### Why This Matters

All premium room content exists as JSON files in `/public/data/*.json`. Without proper protection, these files can be downloaded directly by anyone, bypassing all authentication and tier restrictions.

**Attack scenario without protection:**
```bash
# Attacker downloads entire VIP9 curriculum worth $150/month for free:
curl https://your-app.com/public/data/strategic_foundations_vip9.json
curl https://your-app.com/public/data/corporate_strategy_vip9.json
# ... downloads all 200+ premium rooms
```

---

## Required Configuration

### For Vercel Deployment (Current)

The `vercel.json` file is included in this repository and blocks all access to `/public/data/*`:

```json
{
  "routes": [
    {
      "src": "/public/data/(.*)",
      "status": 404
    }
  ]
}
```

**This file is REQUIRED for production deployment.**

### For Netlify Deployment (Alternative)

If deploying to Netlify instead, add this to `netlify.toml`:

```toml
[[redirects]]
  from = "/public/data/*"
  to = "/404"
  status = 404
  force = true
```

---

## Verification Steps After Deployment

After deploying to production, verify the protection is active:

1. **Test direct JSON access:**
   ```bash
   curl https://your-production-domain.com/public/data/strategic_foundations_vip9.json
   ```
   **Expected:** 404 error

2. **Test legitimate room access:**
   - Log in as VIP9 user
   - Navigate to any VIP9 room
   - Verify content loads normally
   **Expected:** Room content displays correctly

3. **Test access denial:**
   - Log in as Free tier user
   - Try to navigate to VIP9 room URL
   - **Expected:** Access denied error, no content visible

---

## Security Architecture

The app now uses a defense-in-depth approach:

1. **Client-side validation** - UX only (never trust)
2. **Function-level access control** - `loadMergedRoom()` enforces authenticated tier
3. **Database RLS policies** - Final enforcement at data layer
4. **CDN/Static asset protection** - Blocks direct JSON access (this file)

All 4 layers must work together for complete security.

---

## Emergency Rollback

If this configuration causes issues in production:

1. **Immediate mitigation:** Delete `vercel.json` and redeploy
2. **Risk:** Premium content becomes downloadable again
3. **Follow-up:** Debug the issue, restore protection ASAP

**Do not leave production unprotected.**

---

**Last Updated:** 2025-01-29  
**Status:** ✅ Required for secure production deployment
