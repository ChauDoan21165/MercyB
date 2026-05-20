# Privacy Operations Checklist

Date: 2026-05-20

Use this before any A37 implementation captures real Placement V3 user data.

## PII Handling Rules

- [ ] Treat writing responses, transcripts, provider raw output, and recommendation context as sensitive.
- [ ] Redact emails, phone numbers, URLs, addresses, names where detectable, auth tokens, API keys, and school/workplace details.
- [ ] Never write secrets or raw provider auth headers to replay artifacts.
- [ ] Store redacted content by default and content hashes for forensic matching.

## Transcript Retention Rules

- [ ] Sanitized transcripts: default 30-day retention.
- [ ] Raw transcripts: disabled by default.
- [ ] Raw transcripts, if temporarily enabled for debugging: 7 days or less, admin-only, encrypted where available.
- [ ] Deletion request path documented before production capture.

## Audio Retention Rules

- [ ] Raw audio storage disabled by default.
- [ ] Store duration, size, MIME type, transcript summary, and scoring summary instead.
- [ ] If raw audio must be kept, use expiring object references and 7-day maximum retention.
- [ ] Do not export raw audio into docs, PRs, or replay bundles.

## Anonymization Requirements

- [ ] Hash `user_id` with an environment-specific salt.
- [ ] Hash `session_id` with an environment-specific salt.
- [ ] Use replay-specific correlation IDs instead of auth IDs in dashboard URLs.
- [ ] Keep salt out of git and out of client bundles.

## Admin-Access Policy

- [ ] Shadow tables are not browser-readable by normal users.
- [ ] Admin dashboard requires explicit admin-level gate.
- [ ] Raw/sensitive views require elevated access and audit log.
- [ ] Export/download requires audit log with actor, timestamp, reason, and artifact ID.

## Replay-Data Deletion Process

1. Identify `user_id` or placement session ID.
2. Compute or look up the matching hashed IDs using server-only tooling.
3. Delete shadow sessions, shadow steps, replay runs, diffs, alerts, and temporary raw artifacts.
4. Record deletion timestamp and operator.
5. Verify no matching rows remain.

Verification snippet:

```bash
echo "Run deletion verification inside approved Supabase SQL tooling; do not paste service role credentials into shell history."
```

Expected output:

```text
Run deletion verification inside approved Supabase SQL tooling; do not paste service role credentials into shell history.
```

## Incident-Response Checklist

- [ ] Stop capture with feature flag/kill switch.
- [ ] Revoke exposed provider/Supabase secrets.
- [ ] Identify affected shadow sessions.
- [ ] Delete or quarantine unsanitized artifacts.
- [ ] Rotate salts/keys if identifiers were exposed.
- [ ] Document timeline, affected data classes, and remediation.
- [ ] Re-run sanitization audit before re-enabling.

## Minimum Audit Logging Requirements

- [ ] Capture insert success/failure.
- [ ] Sanitization pass/fail.
- [ ] Replay run start/end.
- [ ] Replay diff generation.
- [ ] Replay dashboard read.
- [ ] Raw artifact access.
- [ ] Export/download.
- [ ] Deletion/quarantine action.
