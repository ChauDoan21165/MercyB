# Step 13/18 Privacy And Register Gates

Date: 2026-06-15
Job: L13-18-privacy-register-gates
Scope: Step 13 family/parent bridge boundaries and Step 18 register/politeness gates for AI Tutor and tutor conversation surfaces

## Final Status

Final status: privacy/register gates documented and verifier-backed; remaining gaps explicit.

This packet closes the safe boundary, not a broad privacy certification. The proven behavior is narrower: current tests and source contracts block raw learner-text persistence without consent, hidden surveillance, parent leakage through derived summaries, and rude or overconfident correction framing on the mapped tutor surfaces.

## What Is Allowed

- Generic family, parent, child, school, and childcare language practice is allowed when it is ordinary lesson content.
- Consented conversation capture is allowed only after `hasCaptureConsent()` returns true and only through the existing `conversationTelemetry` to `conversationCapture` path.
- AI Tutor memory may store safe aggregate tags, counts, product/language keys, timestamps, and generated correction ids.
- Derived learning summaries may carry safe aggregate progress signals.
- Polite correction and abstention copy is allowed when it is Vietnamese-first, low-shame, grounded in the available evidence, and does not fabricate scores or certainty.
- Kids mode may block AI Tutor interaction rather than creating a child-monitoring or parent-reporting channel.

## What Is Blocked

- No raw learner text persistence without consent.
- No hidden surveillance: no dark capture, no capture on missing consent, no capture after consent is revoked, and no re-prompt pressure after a stored decline.
- No parent leakage: child names, family details, learner text, transcripts, audio, emails, user ids, placement ids, JWTs, and corrected text must not appear in derived learning summaries or AI Tutor memory summaries.
- No hidden parent or guardian reporting bridge exists in this proof.
- No family/parent topic may be used as a reason to disclose learner data to another account.
- No broad learner profiling claim is allowed from these gates.
- No rude correction framing: no shame, stupidity, guilt, insult, or dismissive language in the mapped warmth/refusal/abstention paths.
- No overclaiming: uncertain pronunciation, uncertain Vietlish/interference, unclear learner intent, and distress-like content must become abstention, clarification, or pause behavior instead of confident correction.

## Tests Enforcing It

Primary verifier: `scripts/ci/verify-step13-18-privacy-register-gates.mjs`.

The verifier checks this artifact, audits source contracts, and runs the focused tests below:

- `src/lib/conversationCapture/__tests__/captureConsent.test.ts`
- `src/lib/conversationCapture/__tests__/conversationCapture.test.ts`
- `src/lib/tutor/__tests__/conversationIntegrationContracts.test.ts`
- `src/lib/ai-tutor/__tests__/learningMemory.test.ts`
- `src/lib/tutor/tests/learningEventSummary.test.ts`
- `src/lib/tutor/tests/studyOsBoundary.test.ts`
- `src/lib/ai-tutor/__tests__/safety.test.ts`
- `src/lib/tutor/__tests__/conversationWarmth.test.ts`
- `src/lib/tutor/__tests__/emotionalResponseBoundary.test.ts`
- `src/lib/ai-tutor/__tests__/aiTutorService.test.ts`

The script-level CI wrapper is `tests/scripts/verify-step13-18-privacy-register-gates.test.mjs`.

## Consent And Capture Gate

`src/lib/conversationCapture/captureConsent.ts` is the consent primitive. It defaults to no consent, treats only the exact stored value `"true"` as consent, treats `false`, missing, garbage, and storage errors as no consent, and records a decline as a real decision so the learner is not re-prompted.

`src/lib/tutor/conversationTelemetry.ts` is the current caller gate. It checks consent before starting capture, re-checks before every turn write, and re-checks before session close. With no consent or no user id, the capture session id is null and no raw conversation capture write is made.

`src/lib/conversationCapture/conversationCapture.ts` can write raw learner input and AI response when invoked. That is allowed only because the caller gate above is required. This artifact does not authorize new capture callers or any data-persistence expansion without the same explicit consent gate.

## Family And Parent Bridge

Step 13 is closed only as a boundary: family and parent topics can be practiced, but they are not a reporting bridge.

Current evidence:

- `learningEventSummary.test.ts` proves unsafe fields such as `learnerText`, `correctedText`, `transcript`, `audioBlob`, `email`, `jwt`, `supabaseUserId`, `placementResultId`, and `childName` are not copied into derived summaries.
- `learningMemory.test.ts` proves raw sentences, emails, user ids, JWT-like tokens, and sentence-like learner text collapse out of AI Tutor memory summaries.
- `safety.test.ts` proves kids mode is not allowed for the AI Tutor path.
- `studyOsBoundary.test.ts` blocks Study OS persistence files from raw learner text/audio fields and blocks tutor engine remote writes, analytics calls, memory writes, XP/streak hooks, and shame mechanics.

This does not prove a full parent-dashboard policy, because no parent dashboard or guardian disclosure flow is implemented or audited here.

## Register And Politeness Gate

Step 18 is closed for the mapped correction/register surfaces.

Current evidence:

- `conversationWarmth.test.ts` requires Vietnamese-primary warmth, blocks shame language, and blocks fabricated scores in warmth and abstention copy.
- `conversationIntegrationContracts.test.ts` requires abstention redirects for uncertain or low-confidence evidence, with no guessed numeric score and no dead end.
- `emotionalResponseBoundary.test.ts` turns unclear input into clarification and distress-like content into pause behavior without diagnosis wording, persistence, provider calls, or remote execution.
- `aiTutorService.test.ts` verifies uncertainty becomes a live clarification reply, distress pauses correction, and result metrics do not expose raw learner text.
- `safety.test.ts` requires static polite refusal messages and PII redaction instead of echoing raw learner input.

The allowed correction framing is: explain gently, ask for clarification when evidence is insufficient, pause when learner content is safety-adjacent, and avoid claiming a score, diagnosis, or native-level judgment that the system did not prove.

## What Remains Missing

- No full browser E2E proves all privacy/register gates in one end-to-end AI Tutor journey.
- No formal parent/guardian product surface exists, so there is no full parent-dashboard leakage audit.
- No account-level consent lifecycle audit proves deletion, export, cross-device consent sync, or server-side revocation behavior.
- No RLS or database migration audit is included in this job.
- No broad production telemetry audit proves every possible capture caller is gated; this verifier covers the current mapped source surfaces.
- No human-rater register benchmark has been run for these exact gates.
- No full kids-product privacy review is included beyond the current AI Tutor kids-mode block and derived-summary leakage tests.
- This packet does not eliminate every learner privacy risk.

## Status Rule

Step 13/18 may be described as "privacy/register gates documented and verifier-backed" only while this artifact and `scripts/ci/verify-step13-18-privacy-register-gates.mjs` pass. Any stronger claim, especially parent dashboard safety, account-wide privacy compliance, or universal no-leak guarantees, requires new implementation evidence and a separate verifier.
