# Email Automations Cron Setup

This document explains how to set up the daily cron job for email automations (welcome emails + expiry reminders).

## Prerequisites

1. `pg_cron` and `pg_net` extensions must be enabled in your Supabase project
2. The `email-automations` edge function must be deployed

## Setup Instructions

Run this SQL in your Supabase SQL Editor (or via a migration if allowed):

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule daily email automations at 03:00 UTC
SELECT cron.schedule(
  'daily-email-automations',
  '0 3 * * *',
  $$
  SELECT net.http_post(
    url := 'https://vpkchobbrennozdvhgaw.supabase.co/functions/v1/email-automations',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwa2Nob2JicmVubm96ZHZoZ2F3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NjM4ODQsImV4cCI6MjA3NjQzOTg4NH0.j9fUrdiHQPpdfAxd1d7RVGqZMBfWbw7cq7q1MQBlewY'
    ),
    body := '{"action": "run_daily"}'::jsonb
  ) AS request_id;
  $$
);
```

## Verify Cron Job

```sql
SELECT * FROM cron.job WHERE jobname = 'daily-email-automations';
```

## Manual Testing

To test the function immediately:

```bash
curl -X POST https://vpkchobbrennozdvhgaw.supabase.co/functions/v1/email-automations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"action": "run_daily"}'
```

## Remove Cron Job

```sql
SELECT cron.unschedule('daily-email-automations');
```

## What the Automation Does

Every day at 03:00 UTC:

1. **Welcome Emails**: Sends to new VIP2/VIP3 subscribers who haven't received a welcome email yet
2. **Expiry Warnings**: Sends reminders to users whose subscription expires in exactly 7 days

All sends are logged in the `email_events` table for tracking.
