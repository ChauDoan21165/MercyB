# Placement V3 Forensics Privacy And Redaction Checklist

## Must Never Be Logged

- `SUPABASE_SERVICE_ROLE_KEY`
- `VITE_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `Authorization` or bearer tokens
- Supabase refresh/access tokens
- learner email addresses
- raw learner passwords or auth payloads
- full raw provider request bodies
- full raw learner free-text responses unless explicitly privacy-reviewed
- audio storage signed URLs

## Inspect Raw Forensic Rows

Use SQL on the target environment:

```sql
select
  id,
  occurred_at,
  session_id,
  correlation_id,
  event_type,
  severity,
  step,
  message,
  feature_flags,
  failure_snapshot,
  event
from public.placement_v3_forensic_events
order by occurred_at desc
limit 100;
```

Search exported rows for common accidental leaks:

```text
Bearer 
eyJ
sk-
AIza
@ 
refresh_token
access_token
service_role
authorization
apikey
```

## Identify Accidental PII

Treat a row as contaminated if it contains:

- learner email, phone number, or full name
- raw essay or spoken transcript beyond a short diagnostic excerpt
- auth token material
- provider API key material
- signed storage URLs
- stack traces containing env values

If contamination is found:

1. Stop live validation.
2. Record the table, row ID, event type, and field name.
3. Rotate any exposed secret.
4. Patch the logger redaction rules.
5. Delete contaminated rows according to the incident response decision.
6. Rerun the validation from a fresh session.

## Retention Recommendation

- Keep raw forensic events for 30 days in production unless a privacy review approves longer retention.
- Keep aggregated failure timelines and alert counts for 90 days.
- Do not retain raw provider outputs in forensic rows.

## Admin Access Recommendation

- Keep read access admin-only through `get_admin_level(auth.uid()) >= 9`.
- Use service-role writes only from Edge Functions.
- Do not expose forensic rows to learner-facing UI.
- Audit admin access before live validation.
