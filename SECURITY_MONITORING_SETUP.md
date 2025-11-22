# 🛡️ Security Monitoring & Alert System - Setup Guide

Your Mercy Blade project now has comprehensive security monitoring with instant alerts!

## ✅ What's Been Implemented

### 1. **Database Tables Created**
- `security_monitoring_config` - Stores Discord webhook and alert preferences
- `uptime_checks` - Records site availability checks
- `security_incidents` - Logs all security events

### 2. **Edge Functions Deployed**
- `security-alert` - Sends alerts to Discord/email when incidents occur
- `uptime-monitor` - Checks site status and detects issues
- `health-check` - Public endpoint for external monitoring services (UptimeRobot)

### 3. **Frontend Pages**
- `/security-dashboard` - View all incidents and uptime history (Admin only)
- `/settings` - Configure Discord webhook and alert preferences

### 4. **Features**
- Real-time security incident tracking
- Automatic uptime monitoring
- Discord webhook integration
- Email alerts (with RESEND_API_KEY)
- "Under Attack" emergency mode
- Environment badge (STAGING/PRODUCTION)
- Enhanced login attempt monitoring
- Automatic alerts for:
  - Site downtime
  - Multiple failed login attempts (5+ in 15 minutes)
  - Suspicious HTTP status codes (403, 500, 503)
  - Manual "Under Attack" triggers

## 📋 Setup Instructions

### Step 1: Configure Discord Webhook

1. **Create a Discord Webhook:**
   - Open your Discord server
   - Go to Server Settings → Integrations → Webhooks
   - Click "New Webhook"
   - Name it "Mercy Blade Security"
   - Choose the channel for alerts
   - Copy the webhook URL

2. **Add Webhook to Your App:**
   - Navigate to `/settings` in your app
   - Paste the Discord webhook URL
   - Click "Send Test Alert" to verify
   - Click "Save Settings"

### Step 2: Configure Email Alerts (Optional)

If you have a Resend API key configured:
1. Go to `/settings`
2. Enter your alert email address
3. Save settings

**Note:** Email alerts require `RESEND_API_KEY` to be configured in your secrets.

### Step 3: Set Up UptimeRobot (External Service)

UptimeRobot will ping your site every 60 seconds:

1. **Sign up for UptimeRobot:**
   - Go to https://uptimerobot.com
   - Create a free account

2. **Add Your Monitor:**
   - Click "Add New Monitor"
   - Monitor Type: HTTP(s)
   - Friendly Name: "Mercy Blade Production"
   - URL: `https://mercyblade.link`
   - Monitoring Interval: 60 seconds (minimum on free tier)
   - Click "Create Monitor"

3. **Optional - Add Health Check Endpoint:**
   - For more detailed monitoring, use:
   - URL: `https://vpkchobbrennozdvhgaw.supabase.co/functions/v1/health-check`
   - This endpoint returns JSON with site status

### Step 4: Set Up Cloudflare (Recommended)

**Important:** Cloudflare setup requires DNS configuration outside of this app.

1. **Sign up for Cloudflare:**
   - Go to https://cloudflare.com
   - Create account and add your domain
   - Update nameservers at your domain registrar

2. **Enable Security Features (Free Tier):**
   - DDoS Protection: Auto-enabled
   - Bot Fight Mode: Security → Bots
   - Rate Limiting: Security → WAF (create rules)
   - Under Attack Mode: Quick Actions button

3. **Configure Cloudflare Webhook Notifications:**
   - Notifications → Destinations
   - Add Webhook pointing to your Discord or custom endpoint

## 🎯 How to Use

### View Security Dashboard
1. Log in as admin
2. Navigate to `/security-dashboard`
3. View:
   - Current site status (online/offline)
   - Recent security incidents
   - Uptime check history
   - "Under Attack" emergency button

### Configure Alerts
1. Navigate to `/settings`
2. Enter Discord webhook URL
3. Enter alert email (optional)
4. Enable/disable uptime monitoring
5. Test alerts before saving

### Trigger Emergency "Under Attack" Mode
1. Go to `/security-dashboard`
2. Click "I'm Under Attack!"
3. Emergency alerts sent to all configured channels
4. Heightened security mode activated
5. Click "Disable Attack Mode" when resolved

## 🔔 Alert Channels

Your security system will send alerts through:

- ✅ **Discord** - Instant notifications with severity colors
- ✅ **Email** - Critical incidents (requires RESEND_API_KEY)
- ✅ **Database Logs** - All events stored for audit trail

## 🚨 What Triggers Alerts

### Automatic Alerts:
- Site returns non-200 status code
- Site doesn't respond (timeout)
- 5+ failed login attempts in 15 minutes
- HTTP 403, 500, or 503 errors
- Admin triggers "Under Attack" mode

### Alert Severity Levels:
- 🔴 **CRITICAL** - Site down, under attack
- 🟠 **HIGH** - Multiple failed logins, suspicious status codes
- 🟡 **MEDIUM** - Security policy violations
- 🔵 **LOW** - Informational, test alerts

## 🔐 Security Best Practices

### For Production (mercyblade.link):
- ✅ Always use HTTPS
- ✅ Keep Cloudflare enabled
- ✅ Monitor Discord channel regularly
- ✅ Review security dashboard weekly
- ✅ Never expose sensitive keys

### For Staging/Preview:
- 🟡 Badge shows "STAGING" - test freely
- 🟡 Uses separate Supabase project (when set up)
- 🟡 Can test security features safely

## 📊 Monitoring Schedule

| Check | Frequency | Action |
|-------|-----------|--------|
| UptimeRobot ping | 60 seconds | External validation |
| Internal health check | On-demand | Via edge function |
| Failed login monitoring | Real-time | Triggers at 5+ failures |
| Security dashboard | Real-time | WebSocket updates |

## 🛠️ Testing Your Setup

1. **Test Discord Alert:**
   ```
   Go to /settings → Click "Send Test Alert"
   ```

2. **Test Failed Login Detection:**
   ```
   Try logging in with wrong password 5 times
   Should trigger high-severity alert
   ```

3. **Test Emergency Mode:**
   ```
   Go to /security-dashboard → Click "I'm Under Attack!"
   Check Discord for emergency notification
   ```

## 📞 API Endpoints

All edge functions are deployed at:
```
https://vpkchobbrennozdvhgaw.supabase.co/functions/v1/
```

- `health-check` - Public, returns site status
- `security-alert` - System use, sends notifications
- `uptime-monitor` - System use, monitors availability

## 🔄 Next Steps

1. ✅ Configure Discord webhook in `/settings`
2. ✅ Set up UptimeRobot external monitoring
3. ⚠️ Consider setting up Cloudflare for DDoS protection
4. ✅ Test all alert channels
5. ✅ Monitor `/security-dashboard` regularly

## ⚠️ Important Notes

- **Environment Badge:** Shows STAGING (yellow) or PRODUCTION (red) on all pages
- **Admin Access:** Security dashboard requires admin role
- **RLS Security:** All security tables protected with Row Level Security
- **Zero Exposed Keys:** All secrets stored securely in Supabase
- **Real-time Updates:** Dashboard updates instantly via WebSocket

## 🎉 You're Protected!

Your site now has:
- ✅ 24/7 uptime monitoring
- ✅ Instant Discord alerts
- ✅ Failed login detection
- ✅ Emergency "Under Attack" mode
- ✅ Complete incident logging
- ✅ Real-time security dashboard

**Your mercyblade.link is now protected! 🛡️**

---

**Questions or Issues?**
- Check `/security-dashboard` for recent events
- Review security incidents in database
- Test alerts in `/settings`
