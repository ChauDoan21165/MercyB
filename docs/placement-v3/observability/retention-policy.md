# Placement V3 Forensic Retention Policy

This policy defines recommended retention and deletion standards for Placement V3 forensic data. It is a launch requirement, not proof that retention automation exists.

## Data Classes

| Data class | Examples | Default stance |
| --- | --- | --- |
| Operational metadata | Correlation ID, event type, provider name, model, latency, retry count, fallback marker | Allowed with expiry and admin access controls |
| Learner identifiers | User ID, email, phone, full name | Avoid; store hashed or surrogate IDs where possible |
| Transcript text | Learner writing, speaking transcript, provider prompt/response text | Do not persist by default in forensic rows |
| Audio | Raw audio, audio URLs, signed URLs, voice recordings | Do not persist in forensic rows |
| Secrets | API keys, service-role keys, bearer tokens, auth/session tokens | Never persist |
| Replay artifacts | Redacted event exports and reconstructed timelines | Allowed only when redacted and expiry-bound |

## Recommended Expiry Periods

| Artifact | Recommended retention | Requirement before extending |
| --- | --- | --- |
| Raw forensic events | 30 days | Chau approval and privacy review |
| Failure timelines | 90 days | Aggregate-only or redacted payload review |
| Runtime alerts | 90 days | Confirm no sensitive payload fields |
| Replay raw inputs | 30 days | Redaction review and incident linkage |
| Replay summaries | 90 days | Remove payload snippets; keep event counts and anomaly categories |
| Screenshots for acceptance evidence | Until launch review plus 30 days | Redact learner identifiers and environment secrets |
| P0 incident evidence | As required by incident review | Restrict access; minimize copied data |

## Transcript Retention

Requirement:
- Full transcripts must not be stored in forensic events by default.
- If a transcript fragment is required for a specific incident, store the minimum redacted excerpt in an incident record, not broad runtime telemetry.
- Any transcript retention must have explicit owner approval, expiry date, and deletion ticket.

Pass criteria:
- Random forensic row sample contains no full learner writing answer, speaking transcript, email, phone, or full name.

## Audio Retention

Requirement:
- Raw audio, signed audio URLs, and voice recordings must not be stored in forensic rows.
- Store only safe metadata such as `audio_present: true`, duration bucket, or error category when needed.
- Signed URLs must be treated as secrets.

Pass criteria:
- Search of forensic payloads finds no `http` audio URLs, signed token query strings, or storage object paths that expose learner audio.

## Replay Retention

Requirement:
- Replay files used for launch evidence must be redacted.
- Replay raw inputs should expire after 30 days unless tied to an active incident.
- Replay summaries may live longer if they contain no sensitive payload snippets.

Pass criteria:
- Replay files include environment label, timestamp, correlation ID, and no secrets or unnecessary learner PII.

## Anonymization Timing

Recommended timing:
- Immediately: redact secrets, tokens, signed URLs, and direct learner identifiers.
- Within 24 hours: replace user/session identifiers in exported evidence with approved surrogate IDs.
- Within 30 days: delete raw event payloads that are not needed for an active incident.
- Within 90 days: delete or aggregate failure timelines and runtime alerts unless Chau approves retention extension.

## Deletion Workflow

1. Identify affected rows by table, row ID, correlation ID, and timestamp.
2. Classify contamination: secret, transcript, audio, learner identifier, provider payload, or other.
3. Restrict dashboard and DB access if contamination is P0.
4. Prepare deletion or redaction SQL for review.
5. Execute with Supabase admin approval.
6. Verify with post-cleanup SQL and string search.
7. Save cleanup record with operator, timestamp, SQL hash or approved query, and verification output.

## Export Restrictions

Forensic exports must:
- Use redacted CSV/JSON only.
- Exclude secrets, auth tokens, raw transcript, raw audio, and direct learner contact data.
- Include environment label and export timestamp.
- Be stored only in approved repo docs for launch evidence or approved incident storage.

Forensic exports must not:
- Be pasted into public PR comments if they contain row payloads.
- Include screenshots with visible keys, tokens, learner email, or full transcript.
- Be shared outside the incident/launch review group without Chau approval.

## Admin Access Logging

Requirement:
- Access to forensic dashboard and raw tables should be admin-only.
- Production access should be logged where platform tooling allows it.
- Manual SQL exports should be recorded in the validation or incident template.

Recommended access review:
- Review admin access before enablement.
- Re-review after any P0/P1 incident.
- Remove stale admin access before production launch.
