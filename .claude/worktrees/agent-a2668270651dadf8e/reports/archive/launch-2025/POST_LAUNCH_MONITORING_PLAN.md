# Post-Launch Monitoring Plan

## Overview

This document outlines monitoring procedures for the first 24 hours and 7 days after Mercy Blade app launch. Focus areas: payments, subscriptions, system health, and user experience.

---

## Key Metrics to Monitor

### 1. Payment Processing

**What to Watch:**
- Payment webhook hits (successful vs failed)
- Subscription updates in `user_subscriptions` table
- PayPal transaction logs
- USDT payment confirmations (if enabled)

**Critical Logs:**

From `supabase/functions/paypal-payment/index.ts`:
```
✅ Payment successful: { user_id, tier, amount, provider_tx_id }
❌ Payment failed: { user_id, tier, error }
```

**Where to Monitor:**
- Lovable Cloud → Edge Functions → `paypal-payment` logs
- Supabase → Database → `user_subscriptions` table (watch for new inserts)
- Supabase → Database → `payment_transactions` table (all payment records)

---

### 2. Subscription Updates

**What to Watch:**
- New subscriptions created
- Subscription status changes (pending → active)
- Failed subscription updates

**Critical Query:**

```sql
-- Check recent subscriptions
SELECT 
  us.user_id,
  p.email,
  st.name as tier_name,
  us.status,
  us.current_period_start,
  us.current_period_end,
  us.created_at
FROM user_subscriptions us
JOIN profiles p ON us.user_id = p.id
JOIN subscription_tiers st ON us.tier_id = st.id
WHERE us.created_at > NOW() - INTERVAL '24 hours'
ORDER BY us.created_at DESC;
```

**Alert Triggers:**
- Payment succeeded but subscription NOT updated (check logs for errors)
- Subscription created but status = 'pending' for > 5 minutes
- Multiple failed subscription updates for same user

---

### 3. System Health (Admin Dashboard)

**What to Watch:**
- Total users (should increase steadily)
- Active subscriptions (should match payment count)
- Room health (should remain stable)
- Storage usage (should grow with user activity)

**Where to Monitor:**
- `/admin/system-metrics` page
- Lovable Cloud → Edge Functions → `system-metrics` logs

**Critical Checks:**
- System metrics API returns valid data (not 0/0/0/0)
- No persistent errors in `system-metrics` edge function
- Response time < 2 seconds

---

### 4. Failed Payments

**What to Watch:**
- Payment declined by provider
- User cancels payment mid-flow
- Network/timeout errors

**Log Pattern:**

```
❌ ERROR: Payment capture failed
User: abc-123
Tier: vip3
Error: INSUFFICIENT_FUNDS
```

**Where to Monitor:**
- Edge function logs: `paypal-payment`
- Database table: `payment_transactions` with status='failed'

**Query:**
```sql
SELECT 
  user_id,
  tier_id,
  payment_method,
  status,
  metadata,
  created_at
FROM payment_transactions
WHERE status = 'failed'
AND created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
```

---

## Alerts to Add

### Critical Alerts (Immediate Action Required)

1. **Payment succeeded but subscription NOT updated**
   - Trigger: Payment log shows success, but no new row in `user_subscriptions`
   - Action: Manually update subscription or refund payment
   - Setup: Monitor edge function logs + database for mismatches

2. **Edge function crashes**
   - Trigger: `paypal-payment` or `system-metrics` returns 500 error
   - Action: Check logs, restart function if needed
   - Setup: Enable Lovable Cloud error notifications

3. **Database connection fails**
   - Trigger: Multiple edge functions report Supabase connection errors
   - Action: Check Supabase status, verify connection strings
   - Setup: Monitor edge function error rates

### Warning Alerts (Monitor Closely)

1. **High payment failure rate**
   - Trigger: > 20% of payments fail in 1 hour
   - Action: Check PayPal status, review error messages
   - Setup: Query `payment_transactions` hourly

2. **Slow system metrics response**
   - Trigger: `/admin/system-metrics` takes > 5 seconds
   - Action: Check database load, optimize queries
   - Setup: Monitor page load times

3. **Audio playback failures**
   - Trigger: Users report audio not playing (if feedback system enabled)
   - Action: Check storage bucket access, verify signed URLs
   - Setup: Monitor user feedback or error logs

---

## 24-Hour Post-Launch Checklist

Execute these checks in the first 24 hours after launch:

### Hour 0-1: Immediate Post-Launch

- [ ] **Verify payment flow end-to-end**
  - Make test purchase (real payment in test mode)
  - Confirm subscription created in database
  - Verify tier access unlocked in app
  - Check email receipt sent (if configured)

- [ ] **Monitor edge function logs**
  - Open Lovable Cloud → Edge Functions
  - Watch `paypal-payment` for real payment hits
  - Watch `system-metrics` for dashboard access

- [ ] **Check system metrics dashboard**
  - Navigate to `/admin/system-metrics`
  - Verify all metrics display correctly (not 0/0/0/0)
  - Refresh page to confirm live updates

### Hour 1-6: Early Adopter Phase

- [ ] **Track first 10 signups**
  - Query `profiles` table for new users
  - Verify email/username populated correctly
  - Check for any authentication errors in logs

- [ ] **Monitor payment transactions**
  - Run query: `SELECT * FROM payment_transactions ORDER BY created_at DESC LIMIT 20;`
  - Verify all payments have matching subscriptions
  - Check for failed payments (investigate errors)

- [ ] **Test user experience**
  - Log in as different tier users (free, VIP3, VIP4)
  - Verify tier gating works (free users blocked from VIP rooms)
  - Test audio playback in multiple rooms

### Hour 6-12: Stabilization Phase

- [ ] **Review payment success rate**
  - Calculate: (successful payments / total attempts) × 100%
  - Target: > 80% success rate
  - If < 80%: Investigate common failure reasons

- [ ] **Check for edge cases**
  - Multiple purchases by same user
  - Subscription upgrades (VIP3 → VIP4)
  - Subscription downgrades (if supported)

- [ ] **Validate system metrics**
  - Compare dashboard numbers to direct database queries
  - Ensure consistency (no ghost users, accurate room count)

### Hour 12-24: Optimization Phase

- [ ] **Analyze logs for patterns**
  - Most common errors (if any)
  - Peak usage times
  - Slowest edge functions

- [ ] **User feedback review**
  - Check feedback table for reported issues
  - Prioritize critical bugs
  - Plan hotfixes if needed

- [ ] **Database cleanup**
  - Verify no orphaned subscriptions (subscription without payment)
  - Check for duplicate user records
  - Confirm all users have profiles

---

## 7-Day Monitoring Checklist

Execute these checks daily for the first week:

### Daily Tasks (Days 1-7)

**Morning Check (9 AM):**
- [ ] Review overnight payment transactions
- [ ] Check edge function error rates
- [ ] Verify system metrics dashboard loads correctly
- [ ] Scan feedback table for urgent issues

**Midday Check (1 PM):**
- [ ] Monitor active user count (should grow daily)
- [ ] Check payment success rate (target: > 80%)
- [ ] Review subscription growth by tier

**Evening Check (6 PM):**
- [ ] Final payment review for the day
- [ ] Log any issues or anomalies
- [ ] Plan fixes for next day

### Weekly Analysis (End of Day 7)

- [ ] **Payment Health Report**
  - Total payments processed
  - Success rate %
  - Total revenue by tier
  - Most common payment failures

  ```sql
  SELECT 
    tier_id,
    COUNT(*) as total_payments,
    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as successful,
    ROUND(SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END)::numeric / COUNT(*) * 100, 2) as success_rate,
    SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as total_revenue
  FROM payment_transactions
  WHERE created_at > NOW() - INTERVAL '7 days'
  GROUP BY tier_id;
  ```

- [ ] **User Growth Report**
  - New signups per day
  - Conversion rate (signup → paid)
  - Most popular tier

  ```sql
  SELECT 
    DATE(created_at) as signup_date,
    COUNT(*) as new_users
  FROM profiles
  WHERE created_at > NOW() - INTERVAL '7 days'
  GROUP BY DATE(created_at)
  ORDER BY signup_date;
  ```

- [ ] **System Stability Report**
  - Edge function uptime %
  - Average response times
  - Total errors logged

- [ ] **Identify Top Issues**
  - Most common user complaints
  - Most frequent payment errors
  - Most reported bugs

---

## Log Monitoring Commands

### View Recent Payment Logs

Navigate to: **Lovable Cloud → Edge Functions → paypal-payment → Logs**

Filter by:
- Last 24 hours
- Search: "Payment successful" (count successes)
- Search: "ERROR" (identify failures)

### View Subscription Update Logs

Navigate to: **Lovable Cloud → Edge Functions → paypal-payment → Logs**

Search for:
```
Subscription updated for user
```

Verify each payment has a matching subscription update log.

### View System Metrics Logs

Navigate to: **Lovable Cloud → Edge Functions → system-metrics → Logs**

Check for:
- Successful responses (200 status)
- Errors (500 status)
- Slow queries (> 2s response time)

---

## Dashboard Monitoring

### Admin System Metrics (/admin/system-metrics)

**What to Monitor:**
- Total users (should increase)
- Active subscriptions (should increase)
- Total rooms (should remain stable)
- Total entries (should remain stable)
- Storage objects (should grow slowly)
- TTS calls (if feature used, should grow)

**Red Flags:**
- Metrics show 0/0/0/0 (API failure)
- Active subscriptions decrease suddenly (mass cancellations?)
- Storage objects grow too fast (abuse or bug)

**Action Items:**
- Check edge function logs if metrics fail
- Investigate sudden changes in key metrics
- Verify database queries are optimized

---

## Incident Response Procedures

### If Payment Succeeds But Subscription Not Updated

**Symptoms:**
- User reports payment confirmed but tier not unlocked
- Payment transaction shows 'completed' but no subscription row

**Diagnosis:**
1. Query `payment_transactions` for user_id
2. Check if matching `user_subscriptions` row exists
3. Review `paypal-payment` logs for errors during subscription update

**Resolution:**
```sql
-- Manually create subscription
INSERT INTO user_subscriptions (
  user_id,
  tier_id,
  status,
  current_period_start,
  current_period_end
) VALUES (
  '[user_id]',
  '[tier_id from payment_transactions]',
  'active',
  NOW(),
  NOW() + INTERVAL '30 days'
);
```

**Prevention:**
- Review `paypal-payment` error handling
- Add retry logic for subscription updates
- Implement transaction rollback if subscription fails

### If System Metrics API Fails

**Symptoms:**
- `/admin/system-metrics` shows 0/0/0/0
- Dashboard displays error message

**Diagnosis:**
1. Check edge function logs: `system-metrics`
2. Look for database connection errors
3. Verify Supabase service status

**Resolution:**
- Restart edge function (redeploy if needed)
- Check database connection limits
- Optimize slow queries if timeout errors

**Prevention:**
- Add error boundaries to admin dashboard
- Implement caching for system metrics (refresh every 60s)
- Add fallback to cached metrics if API fails

### If High Payment Failure Rate (> 30%)

**Symptoms:**
- Many payments fail with same error code
- Users report payment not going through

**Diagnosis:**
1. Query `payment_transactions` for common error patterns
2. Check PayPal API status
3. Review payment webhook configuration

**Resolution:**
- If PayPal issue: Wait for resolution, notify users
- If app issue: Fix code, redeploy, notify affected users
- If user issue: Provide clearer error messages

**Prevention:**
- Add payment retry logic (max 2 retries)
- Improve error messaging to users
- Monitor PayPal API status proactively

---

## Success Criteria

### 24 Hours Post-Launch

- [ ] Payment success rate > 80%
- [ ] Zero critical errors in edge functions
- [ ] All subscriptions have matching payments
- [ ] System metrics dashboard loads correctly
- [ ] No user-reported tier gating bugs

### 7 Days Post-Launch

- [ ] Payment success rate > 85%
- [ ] User growth is positive (daily signups increasing or stable)
- [ ] Revenue matches expected conversion rates
- [ ] No unresolved critical bugs
- [ ] Edge function uptime > 99%

---

## Contact & Escalation

### When to Escalate

- Payment system completely down (0% success rate)
- Database connection fails persistently
- Mass user reports of tier access issues
- Revenue loss > $500 in 24 hours due to bugs

### Escalation Procedure

1. Document the issue (logs, queries, user reports)
2. Attempt immediate hotfix if possible
3. If hotfix not possible: Notify users via email/announcement
4. Contact Lovable support or Supabase support if infrastructure issue
5. Plan rollback if critical feature broken

---

## Notes

- Keep this document updated as you learn patterns from real usage
- Add new alert rules based on actual incidents
- Optimize monitoring queries as database grows
- Review and adjust success criteria monthly

---

**Status:** 🟢 ACTIVE POST-LAUNCH

**Last Updated:** [Auto-generated on first use]

**Next Review:** Day 8 (post-7-day analysis)
