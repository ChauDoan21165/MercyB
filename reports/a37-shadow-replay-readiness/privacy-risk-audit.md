# A37 Privacy Risk Audit

Date: 2026-05-20

## User Data That Would Be Captured

- Written placement responses.
- Speaking transcripts, if generated.
- Audio metadata and possibly audio object references.
- Prompt/task IDs and task text.
- CEFR assessments and subskill scores.
- Vietnamese L1 interference flags.
- Recommendation outputs.
- Provider route, model, latency, retries, and error details.
- Session/user identifiers, if not hashed.

## Data That Must Be Redacted

- Email addresses.
- Phone numbers.
- URLs.
- Access tokens, API keys, and auth headers.
- Names where reasonably detectable.
- Addresses, school/workplace details, immigration details, and other sensitive free text.

## Should Raw Writing Be Stored?

Not by default in long-lived shadow tables.

If raw writing is required for forensic debugging, store it only in an encrypted/admin-only location with short retention. Shadow replay should prefer sanitized text plus a stable hash of the original.

## Should Raw Audio Be Stored?

No, not by default.

For speaking replay, store duration, MIME type, size, transcript, phoneme scoring summary, and an expiring storage reference only when needed. Raw audio creates higher consent, biometric, storage, and access-control risk than text.

## Retention Recommendations

- Default sanitized replay artifacts: 30 days.
- Raw writing/audio, if temporarily enabled: 7 days or less.
- Aggregated drift metrics without user content: longer retention acceptable.
- Provide a deletion path tied to user deletion requests.

## Anonymization Recommendations

- Hash `user_id` and `session_id` with an environment-specific salt.
- Never expose raw auth IDs in replay dashboard URLs.
- Store prompt/task IDs separately from raw user content.
- Avoid free-text search over shadow artifacts.

## Hashing Recommendations

- Store `input_hash`, `output_hash`, `prompt_hash`, and `grader_prompt_hash`.
- Use salted hashes for user/session identifiers.
- Use unsalted content hashes only where cross-run matching is required and privacy review approves it.

## Required RLS Protections

- Browser clients must not be able to read shadow tables directly.
- Service role may insert capture events.
- Admin dashboard reads must require explicit admin level.
- Replay exports must be audit logged.
- RLS must prevent users from reading other users' replay artifacts.

## Admin Access Requirements

- Admin-only dashboard.
- No raw content shown by default.
- Redacted view first, raw/temporary view only behind explicit elevated access if approved.
- Audit every read/export of replay artifacts.

## Replay Abuse Risks

- Shadow data could become a covert transcript store.
- Replay exports could leak user PII.
- Provider raw outputs could echo sensitive content.
- Admin dashboard could become a search surface for private student writing.
- Replay system could accidentally resubmit private user content to providers without clear purpose.

## Forensic/Privacy Tradeoff

Replay needs enough detail to diagnose drift, but not enough raw content to create a permanent dossier. The safe default is sanitized event capture, content hashes, short retention, and admin-only access.
